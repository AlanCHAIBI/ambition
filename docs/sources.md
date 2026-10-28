# Primary sources on prompt engineering

Every URL was opened and checked. Excerpts are verbatim (under 15 words). Where a page shows no date, the Date column says so instead of guessing one. The numbers match the references in square brackets in `hooks/v2.ts`.

Columns: principle (one actionable sentence) · source · publisher/author · date · evidence level · short excerpt.

## Clarity and context

| # | Principle | Source | Publisher/author | Date | Evidence | Excerpt |
|---|---|---|---|---|---|---|
| 1 | State instructions explicitly and precisely, including the expected result, then have someone without the context read them: if they are lost, the model will be too. | Prompting best practices, Claude Platform Docs: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices | Anthropic | not shown on the page | publisher recommendation | "If they'd be confused, Claude will be too." |
| 2 | Explain the reason behind each instruction (goal, audience, why it matters) instead of imposing it without justification. | Prompting best practices, Claude Platform Docs: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices | Anthropic | not shown on the page | publisher recommendation | "Providing context or motivation behind your instructions" |
| 3 | Give all the necessary context before the question or the task, not after. | Prompt design strategies, Gemini API: https://ai.google.dev/gemini-api/docs/prompting-strategies | Google | updated 2026-10-13 (date shown) | publisher recommendation | "supply all the context first." |
| 4 | Start with a minimal prompt tested on the best available model, then add instructions and examples only for the failures you observe. | Effective context engineering for AI agents, Anthropic: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | Anthropic (Engineering) | 2025-09-29 | publisher's experience report | "add clear instructions and examples to improve performance based on failure modes" |

## Examples

| # | Principle | Source | Publisher/author | Date | Evidence | Excerpt |
|---|---|---|---|---|---|---|
| 5 | Add 3 to 5 examples representative of your real case, covering edge cases, and wrap them in tags to tell them apart from the instructions. | Prompting best practices, Claude Platform Docs: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices | Anthropic | not shown on the page | publisher recommendation | "Include 3–5 examples for best results." |
| 6 | Always include few-shot examples to fix the format, tone and scope of the answer. | Prompt design strategies, Gemini API: https://ai.google.dev/gemini-api/docs/prompting-strategies | Google | updated 2026-10-13 (date shown) | publisher recommendation | "We recommend to always include few-shot examples in your prompts." |
| 7 | Check how sensitive your prompt is to formatting: choices that do not change the meaning can change the results measurably. | Quantifying Language Models' Sensitivity to Spurious Features in Prompt Design, arXiv:2310.11324: https://arxiv.org/abs/2310.11324 | Sclar, Choi, Tsvetkov, Suhr (ICLR 2024) | 2023-10-17 (v1) | measured | "LLM sensitivity to a quintessential class of meaning-preserving design choices: prompt formatting" |

## Structure

| # | Principle | Source | Publisher/author | Date | Evidence | Excerpt |
|---|---|---|---|---|---|---|
| 8 | Separate instructions, context, examples and variable data with XML tags. | Prompting best practices, Claude Platform Docs: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices | Anthropic | not shown on the page | publisher recommendation | "XML tags help Claude parse complex prompts unambiguously" |
| 9 | Put long documents at the top of the prompt, and the question or instruction at the bottom. | Prompting best practices, Claude Platform Docs: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices | Anthropic | not shown on the page | publisher recommendation | "Put long-form data at the top" |
| 10 | Do not rely on information buried in the middle of a long context: put it near the start or the end, or repeat the key instructions. | Lost in the Middle: How Language Models Use Long Contexts, arXiv:2307.03172: https://arxiv.org/abs/2307.03172 | Liu, Lin, Hewitt, Paranjape, Bevilacqua, Petroni, Liang | 2023-07-06 (v1) | measured | "relevant information in the middle of long contexts" |

## Reasoning

| # | Principle | Source | Publisher/author | Date | Evidence | Excerpt |
|---|---|---|---|---|---|---|
| 11 | For a reasoning task, ask for or show the intermediate steps: chain-of-thought improved performance on arithmetic and logic tasks. | Chain-of-Thought Prompting Elicits Reasoning in Large Language Models, arXiv:2201.11903: https://arxiv.org/abs/2201.11903 | Wei et al. (Google) | 2022-01-28 (v1) | measured | "a simple method called chain of thought prompting" |
| 12 | For more reliable reasoning, sample several reasoning paths and keep the most consistent answer instead of a single one. | Self-Consistency Improves Chain of Thought Reasoning in Language Models, arXiv:2203.11171: https://arxiv.org/abs/2203.11171 | Wang, Wei, Schuurmans, Le, Chi, Narang, Chowdhery, Zhou | 2022-03-21 (v1) | measured | "selects the most consistent answer by marginalizing out the sampled reasoning paths" |
| 13 | For a complex problem, break it into subproblems solved in order, each answer feeding the next. | Least-to-Most Prompting Enables Complex Reasoning in Large Language Models, arXiv:2205.10625: https://arxiv.org/abs/2205.10625 | Zhou et al. (Google) | 2022-05-21 (v1) | measured | "break down a complex problem into a series of simpler subproblems" |

## Tools and agents

| # | Principle | Source | Publisher/author | Date | Evidence | Excerpt |
|---|---|---|---|---|---|---|
| 14 | For an agent that uses tools, alternate reasoning and tool calls (ReAct) instead of asking for the final answer in one go. | ReAct: Synergizing Reasoning and Acting in Language Models, arXiv:2210.03629: https://arxiv.org/abs/2210.03629 | Yao et al. | 2022-10-06 (v1) | measured | "generate both reasoning traces and task-specific actions in an interleaved manner" |
| 15 | When an attempt fails, ask the agent for a written reflection on the failure and feed it into the next attempt, without retraining the model. | Reflexion: Language Agents with Verbal Reinforcement Learning, arXiv:2303.11366: https://arxiv.org/abs/2303.11366 | Shinn et al. | 2023-03-20 (v1) | measured | "maintain their own reflective text in an episodic memory buffer" |
| 16 | Start with simple prompts and direct LLM API calls; add complexity (frameworks, autonomous agents) only when evaluation justifies it. | Building effective AI agents, Anthropic: https://www.anthropic.com/research/building-effective-agents | Anthropic | 2024-12-19 | publisher recommendation | "Start with simple prompts, optimize them with comprehensive evaluation" |
| 17 | Write each tool's description for an agent, not for a developer: even a small refinement of a description can change results a lot. | Writing effective tools for AI agents, Anthropic: https://www.anthropic.com/engineering/writing-tools-for-agents | Anthropic | 2025-09-11 (shown on the page) | publisher's experience report | "Even small refinements to tool descriptions can yield dramatic improvements." |
| 18 | Have tools return only the useful information (filters, pagination, ranges) rather than bulky raw data. | Writing effective tools for AI agents, Anthropic: https://www.anthropic.com/engineering/writing-tools-for-agents | Anthropic | 2025-09-11 (shown on the page) | publisher's experience report | "return only high signal information back to agents" |
| 19 | State the stop conditions of an agentic task and when the agent must hand control back to the user. | GPT-5 prompting guide, OpenAI Cookbook: https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide | OpenAI | not shown (guide flagged as archived) | publisher recommendation | "clearly state the stop conditions of the agentic tasks" |

## Verification and evaluation

| # | Principle | Source | Publisher/author | Date | Evidence | Excerpt |
|---|---|---|---|---|---|---|
| 20 | Start evaluations with 20 to 50 simple tasks drawn from real failures, before polishing the prompt. | Demystifying evals for AI agents, Anthropic: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents | Anthropic | 2026-01-09 | publisher's experience report | "20-50 simple tasks drawn from real failures is a great start." |
| 21 | Grade the result the agent produced, not the path it took to get there. | Demystifying evals for AI agents, Anthropic: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents | Anthropic | 2026-01-09 | publisher's experience report | "it's often better to grade what the agent produced, not the path it took." |
| 22 | Before changing a prompt, write tests that measure its behavior and compare the versions on them. | Prompt engineering, OpenAI API docs: https://developers.openai.com/api/docs/guides/prompt-engineering | OpenAI | not shown on the page | publisher recommendation | "Building tests and evaluation suites that measure prompt behavior" |

## Biases and pitfalls

| # | Principle | Source | Publisher/author | Date | Evidence | Excerpt |
|---|---|---|---|---|---|---|
| 23 | If a model acts as judge, swap the order of the compared answers and watch for position, length and self-preference biases. | Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena, arXiv:2306.05685: https://arxiv.org/abs/2306.05685 | Zheng et al. | 2023-06-09 (v1) | measured | "including position, verbosity, and self-enhancement biases" |
| 24 | Remove contradictory instructions: when they conflict, the model may follow the one closest to the end of the prompt. | GPT-4.1 Prompting Guide, OpenAI Cookbook: https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide | OpenAI | not shown (undated page) | publisher recommendation (specific to GPT-4.1) | "GPT-4.1 tends to follow the one closer to the end of the prompt." |
| 25 | Do not use capital letters or incentives (tips, threats) to reinforce an instruction: it is generally not needed. | GPT-4.1 Prompting Guide, OpenAI Cookbook: https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide | OpenAI | not shown (undated page) | publisher recommendation (specific to GPT-4.1) | "It's generally not necessary to use all-caps or other incentives like bribes or tips." |

## Not verified

- Dates are not shown on the Claude (Prompting best practices) and OpenAI (Prompt engineering, GPT-4.1 guide, GPT-5 guide) pages. The GPT-5 page is flagged as archived and may be outdated.
- Figures from the literature are not quoted: the exact gain of self-consistency (it varies between versions of the paper), the size of the formatting gaps in Sclar et al., and the size of the verbosity bias in Zheng et al. (the bias is named, but no figure was checked).
- Reflexion authors: the lists differ between the papers that cite it. Only "Shinn et al." is kept.
- The excerpts from Lost in the Middle, Chain-of-Thought and Sclar et al. are verbatim fragments; the full sentence is longer than 15 words.
- Date conflict resolved: "Writing effective tools for AI agents" shows 11 September 2025 on the page, while an Anthropic index cited by the research said 26 June 2025. The date on the page is kept.
