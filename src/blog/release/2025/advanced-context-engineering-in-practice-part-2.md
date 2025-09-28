---
title: Advanced Context Engineering in Practice - Part 2
author: Ansh David
pubDatetime: 2025-09-18T07:16:40Z
featured: false
draft: false
tags:
  - llm
  - rag
  - ai-agents
  - context-engineering

description: How can we avoid these pitfalls and build robust AI agents? Through hard-won experience, practitioners have distilled a couple of core principles for context engineering.
---

| Part     | Title                                                                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Part - 1 | [Indispensable Role of Context Engineering](https://anshdavid.com/posts/2025/indispensable-role-of-context-engineering-for-llms-and-ai-agents-part-1/) |
| Part - 2 | [Advanced Context Engineering in Practice](https://anshdavid.com/posts/2025/advanced-context-engineering-in-practice-part-2/)                          |
| Part - 3 | [The Future is Context-Driven](https://anshdavid.com/posts/2025/the-future-is-context-driven-part-3/)                                                  |

Continuing from [Part 1](https://anshdavid.com/posts/2025/indispensable-role-of-context-engineering-for-llms-and-ai-agents-part-1/), we explored why context engineering is critical for building reliable AI agents and the common pitfalls of poor context management. In this part, we'll dive into practical strategies and architectures that embody effective context engineering principles to create robust, capable AI systems.

## The Core Principles of Context Engineering

How can we avoid these pitfalls and build robust AI agents? Through hard-won experience, practitioners have distilled a couple of core principles for context engineering:

1. **Share Context**: Every agent or component in a system should have access to the full relevant context, ideally including the complete conversation or task history, intermediate results, and other agents actions, not just isolated instructions. In other words, no agent should operate in the dark. If one sub-module decides something or discovers an important detail, that should be part of the context seen by any subsequent steps. Sharing the full agent trace helps ensure nothing gets misconstrued in parallel branches.

2. **Actions Carry Implicit Decisions**: Every action an agent takes is based on a host of implicit decisions and assumptions. If different parts of the system make conflicting decisions, the end result will be bad. Therefore, the architecture must prevent or reconcile conflicting decisions. In practice this often means sequencing tasks rather than having agents work in isolation on potentially overlapping decisions. As a rule, conflicting assumptions should be resolved immediately by the system design, not left to be discovered only after outputs clash.

These principles might seem abstract, but they essentially argue for coherence in an agent's process: all parts working from the same understanding, and no part making unchecked decisions that violate another's. In fact, these guidelines are so critical that one expert advises to "**by default rule out any agent architectures that don't abide by them.**"

## Advanced Context Engineering in Practice

Following the above principles, engineers have developed effective strategies to build context-centric AI workflows. Let's explore a few key patterns being used to push the reliability and capabilities of LLM-based agents:

### 1. The Power of Single-Threaded Linear Agents

The simplest and often most reliable agent architecture is a **single-threaded linear agent**, meaning it tackles sub-tasks sequentially rather than in parallel. Instead of spawning multiple agents to work concurrently and then merging their results, a linear agent handles one part at a time in a chain. This might involve calling one sub-agent or tool after another, but always feeding the complete context forward as it goes. Each subsequent step receives the full history of what has happened so far, the original task, all intermediate outputs, and decisions made up to that point. This ensures complete awareness and prevents the kind of inconsistency that plagued the Flappy Bird example.

For most AI agent applications, this <u>_single-threaded_</u> approach is sufficient and far more dependable than complex multi-agent schemes. By serializing the process, you naturally enforce the share context principle, there's only one context state being updated as the task progresses. Many state-of-the-art agents use this linear sequence approach under the hood because it's easier to maintain coherence. The downside is that pure sequential operation may be slower, but in practice reliability is often a more urgent requirement than maximal speed for complex tasks.

Of course, even a single long-running agent can hit limits, particularly the **context window limit** of the model. Very large tasks with many sub-parts might eventually overflow the context window if we keep appending every detail. At that point, the agent would start to forget earlier parts or lose track. How do we handle that? This leads to the next strategy.

### 2. Intentional Compaction for Large Tasks and Codebases

For lengthy, complex tasks, say building a large piece of software, or any process that generates a lot of intermediate information, context management becomes critical to avoid overflow. One proven technique is **intentional context compaction**. Instead of letting the conversation history grow until it barely fits, the agent strategically compresses and handoff its context when reaching a certain size often well before the hard limit, e.g. keeping utilization under ~40% of the window.

In practical terms, the agent will write out a concise "**progress file**" **or scratchpad** that summarizes the important state, findings, and decisions so far. This summary might include: what the agent understands about the system or problem, which sub-tasks are completed or pending, key results, and any critical decisions or assumptions made. The progress file serves as a distilled context. The agent can then start a new LLM invocation with a fresh context window, seeding it with this summary instead of the entire verbose history. This context handoff allows the project to continue seamlessly without carrying along thousands of irrelevant tokens of chat history, keeping the context focused and efficient.

Dexter Horthy, founder of Human Layer, describes a successful workflow along these lines in three phases:

- **Research Phase**: The agent first explores the system, reads relevant files or data, and produces a structured research output, e.g. listing relevant file names, functions, and lines related to the task. This is essentially understanding the problem. Any misunderstanding here can propagate, a single bad line of research can lead to thousands of bad lines of code as the saying goes. So, the agent invests heavily in building an accurate picture of the system.

- **Plan Phase**: Next, the agent drafts a detailed plan of attack: listing every change it will make, which files to edit, what code to add or modify, and even how to test or verify each change. This plan is much shorter than raw code, so it's easy for a human to review or for the agent itself to double-check consistency. Errors caught at the planning stage are far cheaper than after code is written, a bad plan might produce hundreds of bad lines of code if not corrected. By creating a clear spec, the agent aligns with the developer team's intent before implementation.

- **Implement Phase**: Finally, the agent executes the plan by writing the actual code according to the specifications. It continuously updates the context with progress, potentially revising the plan if needed, but always keeping the context limited mostly to the current plan and immediate code changes. With a solid plan in hand, the implementation can be done in smaller context windows and tends to go smoothly.

This phased approach illustrates intentional compaction: after research, the agent doesn't lug the entire codebase and exploration dialogue forward. It carries just the distilled findings into the planning. After planning, it carries the approved plan into implementation, not the entire thought process that led to it. By **compacting context at each stage**, the agent stays within a manageable window. The result is not only that it avoids overflow, but also that each phase's context is highly focused on the task at hand, improving reliability.

This strategy of "**spec-first, then implement**" has another huge benefit: it aligns teams and catches errors early. Instead of dumping a 5,000-line diff of AI-generated code on a developer, the AI produces a concise plan that humans can read and critique. Teams using this workflow report significantly reduced review overhead and faster onboarding of new members who can understand the project by reading specifications rather than endless code. In short, **context engineering can be a competitive advantage**, it transforms how humans collaborate with AI. Instead of humans painstakingly reviewing AI's code, we review AI's plans/specs, then let the AI handle the grunt work of coding according to the vetted plan.

### 3. Strategic Use of Sub-Agents and Context Isolation

Earlier we cautioned against general multi-agent free-for-alls. However, using sub-agents in a controlled way can be beneficial when done with careful context isolation. A great example is **Anthropic's Claude Code**. Claude Code is a coding assistant that will sometimes spin up a subordinate agent to handle a specific query or investigation, but never for parallel code generation. The sub-agent might be asked, for instance, "Find where in the codebase the user login function is defined" or "Figure out what library is used for database calls." This sub-agent can browse documentation or search the code, and it will produce an answer.

The key is that the **sub-agent's work is kept completely separate from the main agent's context**. Claude's primary agent doesn't dump the sub-agent's entire exploration into its own prompt history. It only receives the succinct answer or relevant snippet that was needed. By doing this, they avoid cluttering the main context with a lot of intermediate noise. The sub-agent essentially functions as a focused tool, it uses its own context to dig up answers, then hands just the answer back. This way, Claude Code extends its capabilities without polluting its long-term context or running multiple decision-makers in parallel. Notably, Claude never has two agents writing code at the same time; any coding is done by the main agent sequentially. This avoids the conflicting decisions issue, adhering to our principles above. The benefit of such isolated sub-agents is primarily **context management**: the investigative work doesn't bloat the main conversation, so the agent can have longer, productive sessions before hitting limits.

Finally, for truly **long-duration tasks**, researchers are exploring automated context compression using a dedicated LLM. In this pattern, you introduce a secondary model whose sole job is to take a huge dialogue or action history and summarize it into a much shorter form, preserving key details, decisions, and milestones. The main agent can periodically call on this "compression model" to distill its memory and then carry on with a fresh context window that includes the compressed summary. This is still an emerging area, getting a model to reliably extract just the right information to keep is hard, and if it drops an important detail, the agent may lose something crucial. But it has been prototyped; for example, teams at Cognition have fine-tuned smaller models to compress contexts for their agents. With a good compression system, they've managed to run agents effectively with context histories far beyond the normal limits.

<u>_There's still a limit eventually, and designing "infinite" context management is an open research question, but these approaches push the boundaries of how long and complex an AI task can be without losing coherence._</u>
