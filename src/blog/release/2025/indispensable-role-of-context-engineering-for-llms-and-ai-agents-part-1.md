---
title: Indispensable Role of Context Engineering - Part 1
author: Ansh David
pubDatetime: 2025-09-13T07:18:00Z
featured: false
draft: false
tags:
  - llm
  - rag
  - ai-agents
  - context-engineering
description: Why providing the right context to large language models and AI agents is critical for reliable, advanced AI systems.
---

| Part     | Title                                                                          |
| -------- | ------------------------------------------------------------------------------ |
| Part - 1 | [Indispensable Role of Context Engineering](https://anshdavid.com/posts/2025/indispensable-role-of-context-engineering-for-llms-and-ai-agents-part-1/)                   |
| Part - 2 | [Advanced Context Engineering in Practice](https://anshdavid.com/posts/2025/advanced-context-engineering-in-practice-part-2/)                                           |
| Part - 3 | [The Future is Context-Driven](https://anshdavid.com/posts/2025/the-future-is-context-driven-part-3/)                                                       |

In the rapidly evolving landscape of Artificial Intelligence, LLMs and the agents built on them are transforming how we interact with technology. One crucial lesson has become clear: these models are only as good as the context we give them. Whether it's a RAG system fetching external knowledge or an autonomous coding agent carrying on a conversation, providing the right information and instructions as context is indispensable. A new discipline, Context Engineering, has emerged as the linchpin for building reliable, efficient, and sophisticated AI agents. Far surpassing traditional prompt engineering, context engineering isn't just a buzzword - it's a fundamental philosophy driving the next generation of AI applications.

## Moving Beyond Prompt Engineering

**Prompt engineering**, crafting an ideal one-shot instruction or question for an LLM, was an early strategy for guiding model behavior. But as models and tasks grow more complex, prompt engineering alone falls short. **Context engineering** goes beyond static prompts - it is the art and science of dynamically assembling the right information, tools, and history in the right format to help an LLM perform a task over many steps. In other words, if prompt engineering is about what to ask, context engineering is about what information to provide and how to maintain it throughout the interaction.

Why is this so important in 2025 and beyond? Modern LLMs are incredibly intelligent in their trained capabilities, but even the smartest human or model can't do a job effectively without knowing exactly **what they're supposed to do and what's already been done**. Just as a human needs background, requirements, and tools to perform well, an AI agent needs rich, relevant context. Providing that context has become the number one job of engineers building AI agents. This context might include relevant documents or knowledge. In the case of RAG systems that retrieve facts to prevent hallucinations, the conversation history and goals, intermediate results, tool outputs, and more. Essentially everything the agent needs to know to proceed correctly.

## The Perils of Poor Context Management

Early experiments in agent architecture explored using multiple LLM agents working in parallel on sub-tasks. It sounds promising, break a complex job into pieces and have specialized agents work simultaneously. Frameworks like OpenAI's Swarm and Microsoft's Autogen even encouraged this multi-agent approach. In practice, however, these systems proved fragile and unreliable. A big reason is poor context management between the agents.

Consider a hypothetical project: <u>_Build a Flappy Bird clone._</u> A naive multi-agent setup might spawn one sub-agent to create the game background and another to program the bird character. If not managed carefully, each sub-agent can go off track. For instance, sub-agent 1 might misunderstand and start making a Super Mario Bros-style background, while sub-agent 2 builds a bird that isn't even consistent with Flappy Bird's physics or art style. In the end, the main agent is left to somehow combine these mismatched pieces. This failure isn't far-fetched as real tasks have nuances that get lost when subdivided without shared context.

Why do these multi-agent approaches often stumble? Several issues emerge:

- **Lack of shared context:** If agents work in parallel without seeing each other's work or reasoning, they can make conflicting assumptions. In the Flappy Bird example, each sub-agent had no idea what the other produced until the end - resulting in inconsistent outputs.

- **Compounding errors:** Complex tasks usually involve multiple steps. A misunderstanding in an early step can snowball into larger errors later. In multi-turn conversations or tool-using agents, an initial misinterpretation can cascade if subsequent actions build on a wrong premise.

- **Over-reliance on human-like communication:** One might hope agents could chat amongst themselves to resolve conflicts, but today's AI agents lack the robust long-horizon reasoning to <u>_talk it out._</u> Unlike humans, they don't possess the nontrivial intelligence to efficiently share only the important knowledge and reconcile differences over many turns. When agents try to negotiate understanding like humans, the process often breaks down, with decision-making becoming too dispersed and key details getting lost.

These problems all boil down to **context:** each agent not having the full picture of the task and each other's progress. In fact, poor context management leads to several failure modes for LLM systems even beyond multi-agent scenarios:

- **Context Poisoning:** This is when a hallucination or error enters the context and then gets treated as truth because it's repeatedly referenced. For example, DeepMind's Gemini agent playing Pokémon sometimes hallucinated incorrect game information and inserted it into its own context memory, <u>_poisoning_</u> its goals. The agent would then fixate on impossible or irrelevant objectives based on that false info. Once bad data is in the context, the model may struggle to recover.

- **Context Distraction:** Here the context grows so large and unwieldy that the model starts focusing on the provided context at the expense of what it originally learned during training. In the Pokémon example, as the game context exceeded 100k tokens, the Gemini agent began to repeat actions from its history instead of devising new strategies, stuck in a loop of what it had already seen. In essence, the trove of context became a distraction that drowned out the model's built-in reasoning.

- **Context Confusion:** This occurs when a lot of superfluous or irrelevant information in the context misleads the model and lowers output quality. More context isn't always better - if you stuff a prompt with dozens of tools or extraneous data, the model will try to account for all of it, often to its detriment. A study found that a small LLM given 46 different tool APIs at once failed to pick the right one, whereas it succeeded when given only 19 relevant tools. In practice, providing too many options or unnecessary details can confuse the model into worse performance.

- **Context Clash:** This is the most pernicious case: different pieces of context that directly conflict with each other. Conflicting instructions or information in the prompt will confuse the model about which to trust. Researchers have shown that if a conversation's context contains earlier misleading attempts or contradictory info, as can happen when a user keeps adding new details, the final answers degrade significantly. The model is essentially tripping over inconsistent context that it cannot reconcile.

These issues highlight a counterintuitive truth: simply **pouring more data or history into an LLM's context window is not a silver bullet.** In fact, naively using very large contexts can hurt performance. Long context windows fueled excitement that we might not need retrieval or careful curation, but in reality, overloading context causes agents and applications to fail in surprising ways. The context must not only be the right information, but also presented and managed effectively. Quality trumps quantity when it comes to context.
