Website anshdavid.com
=====================

## build

- `docker compose up -d --build`

## VS Code Extensions Setup

Export extensions

```bash
code --list-extensions > extensions.txt
```

If using VS Code, install all recommended extensions:

```bash
while read line; do code --install-extension "$line"; done < extensions.txt
```

## Run astro

- `npm run dev -- --host 0.0.0.0`

---