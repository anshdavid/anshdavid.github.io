---
title: Eclipse Ditto + HiveMQ (MQTT) - Build a Tiny LED Digital Twin
subtitle: A step‑by‑step, code‑light walkthrough for understanding policies, things, connections, and message flow
author: Ansh David
pubDatetime: 2025-09-10T23:15:00-05:00
slug: eclipse-ditto-hivemq-mqtt
featured: true
draft: false
tags:
  - digital-twin
  - eclipse-ditto
  - mqtt
  - hivemq
  - iot
  - tutorial
description: Exploring the principles, challenges, and strategies of data science ethics—covering privacy, bias, transparency, regulations, and best practices for responsible innovation.

---

**Who is this for?** Curious engineers and product folks who want to *understand* how an Eclipse Ditto digital twin talks to a physical/virtual device over MQTT (HiveMQ), without needing the full source code. We'll unpack the concepts and show the exact shapes of the messages Ditto expects.

Python code snippets and a docker environment are linked at the end of the post!!

---

# What we're building (in plain English)

We’ll wire up a **digital twin** for a tiny device called **`dt-led`** and a logical
controller called **`dt-controller`**. The controller tells the LED device: **turn ON/OFF**.
The device acknowledges and **updates its twin state** (the "source of truth" in Ditto).

- **Command path:** Controller → Ditto (HTTP inbox message) → Ditto publishes to MQTT → Device subscribes and acts  
- **State path:** Device → Ditto (via HTTP *or* MQTT) → Ditto persists twin → Ditto emits twin events (optional MQTT)

You’ll meet four core Ditto ideas along the way:

1. **Policies** — Who can do what on which resources (things, messages, policies).
2. **Things** — Your twins (`dt-led` and `dt-controller`) with attributes and features.
3. **Connections** — How Ditto bridges to external systems (here: **HiveMQ** MQTT broker).
4. **Ditto Protocol** — The JSON envelope Ditto uses on MQTT for commands/events.

---

# The high‑level architecture

[![](https://mermaid.ink/img/pako:eNpVkFFPwjAUhf_KzX2SZBDQycYefBBIMJEoBHmQ8VC2y9bYtUvXAUr477ZbJNKkaW977ndOe8ZEpYQR7oU6JjnTBl6XsQT4eNnEOFbSaCUEabhLTTe5lp0Yt9Dtwmy1egcud-oEBVUVy8iePsGEG6M200TwsqK22jpoVe8yzcoc5ovVajPjB5ov4FmrL9LNPcBkura-EzrwhBpPQWmjBgsjaZyxU5JM3dKgXZCy3gle5SAs8yaK622U07XT1WXKDIE5cgkHzlr027J9yDX6DZoKbtoGOtgEFdyp0nAlmQArcIDO1Qk9zDRPMTK6Jg8L0gVzJZ4dMkaTU0ExRnab0p7VwsQYy4ttK5n8VKr469SqznKM9kxUtmpTTzizv1dcT7X9BNJjVUuD0TBsGBid8YRRMOiN3AiDwM7Q9_Abo4e-37sfDP2wHwz90eDRv3j403j2e2Hgj_6Pyy9r_6lh?type=png)](https://mermaid.live/edit#pako:eNpVkFFPwjAUhf_KzX2SZBDQycYefBBIMJEoBHmQ8VC2y9bYtUvXAUr477ZbJNKkaW977ndOe8ZEpYQR7oU6JjnTBl6XsQT4eNnEOFbSaCUEabhLTTe5lp0Yt9Dtwmy1egcud-oEBVUVy8iePsGEG6M200TwsqK22jpoVe8yzcoc5ovVajPjB5ov4FmrL9LNPcBkura-EzrwhBpPQWmjBgsjaZyxU5JM3dKgXZCy3gle5SAs8yaK622U07XT1WXKDIE5cgkHzlr027J9yDX6DZoKbtoGOtgEFdyp0nAlmQArcIDO1Qk9zDRPMTK6Jg8L0gVzJZ4dMkaTU0ExRnab0p7VwsQYy4ttK5n8VKr469SqznKM9kxUtmpTTzizv1dcT7X9BNJjVUuD0TBsGBid8YRRMOiN3AiDwM7Q9_Abo4e-37sfDP2wHwz90eDRv3j403j2e2Hgj_6Pyy9r_6lh)

Key takeaways:

- **Ditto does not "poll" devices.** Devices either subscribe (MQTT) and react to commands, or push twin updates.
- **MQTT topics you own** (like `devices/<thing:id>`) carry **Ditto Protocol JSON envelopes** when Ditto's `ditto` payload mapping is enabled.
- **Everything is allowed/blocked by Policy**, so we’ll grant just enough privileges for the connection and a default app subject.

---

# Ditto Essentials in 90 seconds

- A **Thing** has an **ID** like `org.eclipse.ditto:dt-led`.  
  It can carry **attributes** (metadata) and **features** (capabilities + state).  
  We'll use feature `status_led` with property `{ "status": "ON" | "OFF" }`.

- A **Policy** binds **subjects** (identities) to **resources** with `READ`/`WRITE` grants.  
  Two subjects matter here:
  - `nginx:ditto` (a basic‑auth app user hitting the REST API through Ditto’s HTTP endpoint).
  - `connection:hivemq-mqtt` (the MQTT connection itself, so Ditto can read/write using it).

- A **Connection** of type `mqtt` tells Ditto which MQTT **addresses** (topics) to **consume** (`sources`) and **where** to **publish** (`targets`).  
  We’ll use the `ditto` **payloadMapping** so messages are JSON envelopes that Ditto understands.

---

# Identity & Policy — unlocking the right doors

Our policy grants just-enough permissions to the two subjects we care about:

- **Owner / app subject**: `nginx:ditto` → may `READ`/`WRITE` `thing:/`, `policy:/`, `message:/`
- **Connection subject**: `connection:hivemq-mqtt` → may `READ`/`WRITE` `thing:/`, `message:/`

Here is a **minimal, friendly version** of the policy document you’d PUT to Ditto:

```json
{
  "entries": {
    "owner": {
      "subjects": { "nginx:ditto": { "type": "nginx basic auth user" } },
      "resources": {
        "thing:/":  { "grant": ["READ","WRITE"], "revoke": [] },
        "policy:/": { "grant": ["READ","WRITE"], "revoke": [] },
        "message:/":{ "grant": ["READ","WRITE"], "revoke": [] }
      }
    },
    "connection": {
      "subjects": { "connection:hivemq-mqtt": { "type": "Connection to HiveMQ MQTT broker" } },
      "resources": {
        "thing:/":  { "grant": ["READ","WRITE"], "revoke": [] },
        "message:/":{ "grant": ["READ","WRITE"], "revoke": [] }
      }
    }
  }
}
```

> **Why give the connection `thing:/` + `message:/`?** - So Ditto is allowed to **publish live messages** _to_ devices, and **consume device updates** to modify the twin.

---

# Modeling the twins (Things)

We’ll create two **things**:

1. `org.eclipse.ditto:dt-led`  
   - `attributes.name = "LED Device"`  
   - `features.status_led.properties.status = "OFF"` (initial state)
2. `org.eclipse.ditto:dt-controller`  
   - `attributes.name = "LED Controller"`

Conceptually, the **LED** thing holds state. The **Controller** is stateless and just sends commands.

> You’d upsert each Thing with an HTTP `PUT` to `/api/2/things/<thingId>`, including the `policyId` that points at the policy we created.

---

# The MQTT connection (Ditto ↔ HiveMQ)

Connection settings worth remembering:

- **`id`:** `hivemq-mqtt`
- **`connectionType`:** `mqtt`
- **`connectionStatus`:** `open` (Ditto will connect immediately)
- **`uri`:** `tcp://hivemq:1883` (inside Docker this might be the service name; on bare metal, use your host/IP)
- **`payloadMappings`:** `[{{"mappingId":"ditto"}}]` (so payloads are Ditto Protocol JSON envelopes)
- **`authorizationContext`:** `[ "connection:hivemq-mqtt" ]` (so the policy entry applies)


## Sources (consuming from device → Ditto)

```json
{
  "sources": [ {
    "addresses": ["devices/#"],
    "authorizationContext": ["connection:hivemq-mqtt"],
    "qos": 1,
    "payloadMappings": [{"mappingId": "ditto"}]
  } ]
}
```

> Any publish to `devices/...` (e.g., `devices/org.eclipse.ditto:dt-led/twin`) will be **ingested by Ditto** and interpreted as a Ditto Protocol message.

## Targets (publishing from Ditto → device)

```json
{
  "targets": [ {
    "address": "devices/{{ thing:id }}",
    "topics": [
      "_/_/things/live/messages",
      "_/_/things/twin/events"
    ],
    "authorizationContext": ["connection:hivemq-mqtt"],
    "qos": 1,
    "payloadMappings": [{"mappingId": "ditto"}]
  } ]
}
```

- When Ditto routes a **live message** to a device, it publishes a Ditto Protocol envelope to the MQTT topic:  
  **`devices/<thing:id>`** (for example: `devices/org.eclipse.ditto:dt-led`).  
- When a **twin event** occurs, Ditto can also emit it to the same base address (using the configured `topics`).

---

# The message flow - end‑to‑end

[![](https://mermaid.ink/img/pako:eNp1U8tu2zAQ_JUFe3FQ15KfsQU0QG0VyMFpnNa9FAIKRlzLBCRSJVduUsP_3qWVOEEetxV3dnZmSO1FbhWKRHj806DJMdWycLLKDEAtHelc19IQLEB6WFhDzpYlOuhcrtcryEuNhs5egtMATjWRfdmZh86l3uHVDXSubtbrV7PLgFh-TSHFnc7xhAq4xaeLizSB1fWPNUS01abw0X5fojocIm1u7V1UofeyQB-RLYoSf3MP9pnwJKnxmUgycf0tE4dAljLZnMma21L7bSsXVs6SzW0JJWuEBzbghjqqOa0LBHMmWCZw9QCSzvGMB0lvgZct-EtOjSQ8GvzIuFyrI73D2jqCoBMDXJYE39uznZYQwg7HLU-I4OfrBDbIJh2vbd0G71HtbI0cLut6JwYsPT5fFeJ-WvV-QPRXmyi3VSWN8lFlld7cvxFUFHAt37yV3vKwcvTkYeNsBd42Lg_RKcX6PVedR5oPxweCRj1eGTOsmRKaWnFWCjpPbntt-bl1d_bskju2Jm2NLM9OdoIuwB0_X_-GbGg8KwSSrkDyPbK1zr3oisJpJRJyDXZFha6S4VPsw6pM0BYr5HS5VLiRTUmZyMyBx_hl_7K2epx0tim2ItlIzr4rWicP_93p1LFndAvbGBJJPx4dSUSyF3ciOY9743F_dD6cTkaD_igedMW9SIbxsDcdnc-G8WAQj0f9eHLoin_HtXFvOptM-8PxbDKYzmbxdHz4D-aFVOA?type=png)](https://mermaid.live/edit#pako:eNp1U8tu2zAQ_JUFe3FQ15KfsQU0QG0VyMFpnNa9FAIKRlzLBCRSJVduUsP_3qWVOEEetxV3dnZmSO1FbhWKRHj806DJMdWycLLKDEAtHelc19IQLEB6WFhDzpYlOuhcrtcryEuNhs5egtMATjWRfdmZh86l3uHVDXSubtbrV7PLgFh-TSHFnc7xhAq4xaeLizSB1fWPNUS01abw0X5fojocIm1u7V1UofeyQB-RLYoSf3MP9pnwJKnxmUgycf0tE4dAljLZnMma21L7bSsXVs6SzW0JJWuEBzbghjqqOa0LBHMmWCZw9QCSzvGMB0lvgZct-EtOjSQ8GvzIuFyrI73D2jqCoBMDXJYE39uznZYQwg7HLU-I4OfrBDbIJh2vbd0G71HtbI0cLut6JwYsPT5fFeJ-WvV-QPRXmyi3VSWN8lFlld7cvxFUFHAt37yV3vKwcvTkYeNsBd42Lg_RKcX6PVedR5oPxweCRj1eGTOsmRKaWnFWCjpPbntt-bl1d_bskju2Jm2NLM9OdoIuwB0_X_-GbGg8KwSSrkDyPbK1zr3oisJpJRJyDXZFha6S4VPsw6pM0BYr5HS5VLiRTUmZyMyBx_hl_7K2epx0tim2ItlIzr4rWicP_93p1LFndAvbGBJJPx4dSUSyF3ciOY9743F_dD6cTkaD_igedMW9SIbxsDcdnc-G8WAQj0f9eHLoin_HtXFvOptM-8PxbDKYzmbxdHz4D-aFVOA)

## Controller → LED (HTTP inbox message)

The controller tells the LED to toggle via **Ditto’s HTTP inbox**:

```bash
curl -u ditto:ditto -H "Content-Type: application/json" -X POST   'http://localhost:8080/api/2/things/org.eclipse.ditto:dt-led/inbox/messages/toggle_led?timeout=0'   -d '{"status":"ON","source_thing":"org.eclipse.ditto:dt-controller"}'
```

Ditto **routes** this as a **live message** to MQTT target `devices/org.eclipse.ditto:dt-led`. The **payload** (what the device sees) is a **Ditto Protocol envelope** like:

```json
{
  "topic": "org.eclipse.ditto/dt-led/things/live/messages/toggle_led",
  "headers": {
    "content-type": "application/json",
    "correlation-id": "..."
  },
  "path": "/",
  "value": {"status":"ON", "source_thing":"org.eclipse.ditto:dt-controller"}
}
```

> Note the internal `topic` is a Ditto Protocol topic (with `/` after the namespace), while the **MQTT broker topic** you subscribe to is `devices/org.eclipse.ditto:dt-led`.

## LED device → Ditto (twin update)

Once the device sets its real LED, it **reports state** back to the twin. Two equivalent options:

**A) HTTP to the twin's feature path**

```bash
curl -u ditto:ditto -H "Content-Type: application/json" -X PUT   'http://localhost:8080/api/2/things/org.eclipse.ditto:dt-led/features/status_led/properties'   -d '{"status":"ON"}'
```

**B) MQTT publish (Ditto Protocol)**

- Publish to broker topic: `devices/org.eclipse.ditto:dt-led/twin`  
- Payload (Ditto Protocol envelope telling Ditto to modify the twin):

```json
{
  "topic": "org.eclipse.ditto/dt-led/things/twin/commands/modify",
  "headers": {
    "response-required": false,
    "content-type": "application/vnd.eclipse.ditto+json",
    "correlation-id": "led-{timestamp}"
  },
  "path": "/features/status_led/properties",
  "value": {"status": "ON"}
}
```

Ditto applies the update; anyone watching the twin gets **events**. With our connection’s `targets.topics` set to include `twin/events`, Ditto can also publish those **events** out to MQTT for downstream consumers or dashboards.

---

# Observability & sanity checks

- **Check the connection:** `GET /api/2/connections/hivemq-mqtt` → status should be **OPEN** and **connected**.  
- **Watch the twin:** `GET /api/2/things/org.eclipse.ditto:dt-led` → feature `status_led.properties.status` should reflect the latest value.  
- **MQTT introspection:** Use a generic MQTT client to subscribe to `devices/#` and **see** messages coming/going.

---

# Troubleshooting

| Symptom | Likely Cause | What to check |
|---|---|---|
| `401 Unauthorized` on HTTP | Wrong basic‑auth | Use `ditto:ditto` (demo) or your creds; confirm you hit the correct `/api/2` base path |
| `403` from Ditto | Policy denies the action | Ensure policy grants `READ/WRITE` on `thing:/` and `message:/` for both `nginx:ditto` and `connection:hivemq-mqtt` |
| Ditto connection stuck `CLOSED` | Broker not reachable or wrong `uri` | Is the broker at `tcp://hivemq:1883` (inside Docker) or `tcp://localhost:1883` (host)? Firewall? |
| Device doesn't get commands | Wrong MQTT topic | Device must subscribe to `devices/{{ thing:id }}` (e.g., `devices/org.eclipse.ditto:dt-led`) |
| Device publishes but Ditto ignores it | Missing `ditto` payload mapping | Ensure both `sources` and `targets` include `payloadMappings: [{{"mappingId":"ditto"}}]` |
| Twin doesn't change | Wrong Ditto Protocol `path` | For our LED: `/features/status_led/properties` is the path to modify |
| No twin events on MQTT | Targets `topics` missing `twin/events` | Add `"_/_/things/twin/events"` to the connection `targets.topics` |

---

# Production hardening - beyond the demo

- **TLS for MQTT** (`ssl://...`) and **mutual auth** between broker and Ditto.  
- Use **fine‑grained Policies** (avoid global `thing:/` grants; scope to your things).  
- Rotate secrets; avoid shipping the `ditto:ditto` demo user.  
- Define **consistent topic conventions** (`devices/<thing:id>[/...]`) and keep them stable.  
- Validate **payload schemas** for your business domain (e.g., restrict `status` to `ON|OFF`).  
- Add **observability** (Ditto connection metrics, broker metrics, dead‑letter topics for bad envelopes).

---

# Where to go next

- Replace `status_led` with your real features (sensors/actuators).  
- Add **desiredProperties** to let cloud apps *request* future state and have devices converge.  
- Use **policies per device** for least privilege.  
- Emit **twin events** to analytics pipelines (via the same MQTT bridge or Kafka).

---

# Code Snippets

Add the following HiveMQ service to the Docker Compose file in the Ditto repository on GitHub:

```yaml file="docker-compose.yaml"
  # HiveMQ MQTT broker (Community Edition)
  hivemq:
    image: hivemq/hivemq-ce:latest
    deploy:
      resources:
        limits:
          memory: 512m
    networks:
      default:
        aliases: [hivemq]
    ports:
      # - 8181:8080
      - 1883:1883   # MQTT
    logging:
      options: { max-size: 50m }
  # If you prefer HiveMQ Enterprise Trial with Control Center UI, use:
  # image: hivemq/hivemq4:latest
  # ports:
  #   - "1883:1883"   # MQTT
  #   - "8082:8080"   # Control Center UI available at http://localhost:8082
```

**Python examples are available in this GitHub Gist**
[https://gist.github.com/anshdavid/5092b13b74fa8fb9827b9328f5013814](https://gist.github.com/anshdavid/5092b13b74fa8fb9827b9328f5013814)

---

*If this post saved you a few hours, share it or drop a ⭐ on your internal knowledge base!*
