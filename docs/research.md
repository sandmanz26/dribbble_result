# Research: an AI that works like a brain, and what that should mean on screen

Brief (Dribbble, $10,000, a few weeks): modern UI/UX for an AI platform that "emulates human brain processes vs
traditional AI that reasons everything", up to 80% cheaper and fast at getting things done. Distinctive UI across
web, desktop and mobile. Contemporary or retro, open to suggestions. shadcn/ui components and Tailwind CSS.
High-fidelity mockups and interaction prototypes that show the unique value.

The product is not named in the brief. This prototype calls it **Myelin** (placeholder): myelin is the sheath that
makes well-used nerve pathways fast, which is the product's promise in one word. ("Engram", the first candidate,
is already a funded AI memory company.)

## 1. What "brain-like" can honestly mean for an AI product

| Brain idea | Engineering it maps to | Evidence that it saves cost or time |
|---|---|---|
| Fast and slow thinking (System 1 and System 2) | A cheap fast path for familiar work, a deliberate model only when needed | SwiftSage pairs a small fast module with an LLM for slow analysis, for efficiency on complex tasks. HRM (Sapient, 2025) uses a slow planning module over a fast computing module; strong ARC results for 27M parameters, though ARC Prize found the hierarchy itself mattered less than claimed |
| Attention and routing | A router that sends each request to the cheapest model likely to be good enough | RouteLLM (LMSYS, ICLR 2025): over 2x cost saving on common benchmarks while keeping most of GPT-4's quality; router overhead under 0.4% of one strong-model call |
| Recognition before reasoning | Semantic cache of verified answers | GPT Semantic Cache: 61.6% to 68.8% hit rates in its tests. Production ranges reported from about 10% (open chat) to 40 to 70% (FAQ, support, classification) |
| Memory (episodic, semantic, procedural) | Events, facts and learned workflows stored outside the model | The standard split in agent memory (Mem0, Letta, LangMem). Letta runs "sleep-time" consolidation while idle |
| Habits | Procedural memory: a workflow that once needed reasoning, now replayed cheaply | Same sources; the cost win is that the expensive model is not called for work it has already solved |
| Sleep | Nightly consolidation: merge duplicates, let unused memories fade, promote patterns to habits | Letta's sleep-time agents; several memory products re-read and re-link the day's memories |
| Effort control | Reasoning effort or thinking budget | OpenAI reasoning effort, Claude effort and thinking budget, Gemini thinking budget and levels. Thinking tokens bill as output, so the budget is a cost lever |

**What 80% cheaper requires.** Savings come from how much work stays off the expensive path. If 70% of requests
are answered from cache or memory at about 1% of the cost and the rest go to the large model, the bill is about
0.7 x 0.01 + 0.3 = 31% of reasoning everything, a 69% saving. Reaching 80% needs about 80% of the work on fast paths.
That is plausible for repetitive team work (support, ops, reports), not for open-ended research. The product
should therefore **show the saving per answer and per workspace, honestly, against a stated baseline**, and never
promise 80% in the abstract.

## 2. How conventional AI interfaces work, and where they fail

- **The chat box is the whole product.** ChatGPT, Claude, Gemini, Le Chat, Perplexity: a column of messages and a
  composer. Critiques (Nielsen via secondary sources, "The Chatbot Trap", "Chat is the wrong interface") name the
  same problems: the blank box hides what the tool can do; users must write prose; it only acts when spoken to;
  focused jobs get a generic UI.
- **Effort is a model picker.** Users choose a model or an effort level before they know what the task needs.
  The cost of the choice is invisible.
- **Memory is a settings page.** Where memory exists it is a list of sentences in settings; nobody sees when it
  was used or how strongly it holds.
- **Reasoning is theatre.** "Thinking..." with a spinner or a long trace. It tells the user the system is busy,
  not that it chose to be.
- **Desktop apps are the web app in a window.** Raycast is the exception worth learning from: a global hotkey,
  Quick AI for one-off questions, Tab to hand over to a full chat, Enter pastes the answer back into the app you
  were in.

## 3. Competitor and reference frame

- **Frontier chat apps** (ChatGPT, Claude, Gemini): best general quality, cost hidden, effort picked by hand.
- **Routers and gateways** (RouteLLM, OpenRouter-style gateways, Portkey): save money, but they are developer
  infrastructure with no end-user experience.
- **Memory layers** (Mem0, Letta, LangMem): give agents memory; the UI is developer dashboards.
- **Brain-inspired models** (Sapient HRM, Liquid, others): research results, no product surface for teams.
- **Desktop quick-ask** (Raycast AI): the right interaction for small asks on desktop.

**Gap:** nobody turns routing, memory and habits into something a team can see, trust and steer. That is the
design opportunity: make the brain's economy visible.

## Sources
- RouteLLM, LMSYS blog: https://lmsys.org/blog/2024-07-01-routellm/ and paper: https://arxiv.org/abs/2406.18665
- GPT Semantic Cache: https://arxiv.org/abs/2411.05276
- Semantic caching in production: https://tianpan.co/blog/2026-04-10-semantic-caching-llm-production
- SwiftSage: https://arxiv.org/pdf/2305.17390
- Hierarchical Reasoning Model coverage: https://bdtechtalks.com/2025/08/04/hierarchical-reasoning-model/
- Agent memory types: https://mem0.ai/library/agent-memory/long-term-memory and https://respan.ai/market-map/compare/langmem-vs-letta
- Thinking budget: https://techcrunch.com/snippet/3009694/google-is-releasing-a-thinking-budget-for-gemini and https://www.promptlayer.com/glossary/thinking-budget
- Chat UX critiques: https://www.ignorance.ai/p/the-chatbot-trap and https://tianpan.co/blog/2026/07/04/chat-is-the-wrong-interface
- Raycast Quick AI: https://manual.raycast.com/ai/chat
- Engram (name taken): https://www.cnbc.com/2026/06/23/ai-memory-startup-focused-on-cutting-token-costs-raises-98-million.html
