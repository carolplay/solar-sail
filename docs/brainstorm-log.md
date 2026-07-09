# Brainstorm Log

Target Version: Project memory / ongoing process

## 2026-07-09 - Brainstorm Recorder Skill

### Decisions

- Add a personal Codex skill named `brainstorm-recorder`.
- Use the skill after brainstorms, design discussions, planning sessions, research synthesis, and spec conversations.
- The skill should preserve decisions, rationale, open questions, next actions, and version targets.
- The skill should check permissions before writing records outside the current workspace or before using network-dependent sources.
- The default record location for this project is the existing `docs/` folder.

### Rationale

- Brainstorm outcomes need durable project memory so future work can recover why decisions were made.
- A reusable skill is better than ad hoc reminders because it can apply across projects.
- Permission checks belong in the workflow because useful records often involve attached files, deployed pages, external research, or non-workspace skill locations.

### Open Questions

- Whether future brainstorm records should remain in this single log or move into topic-specific docs when a discussion becomes a spec.

### Next Actions

- Use `brainstorm-recorder` in future discussion turns when a brainstorm or planning result should be captured.

## 2026-07-09 - Demo 003 Direction

### Decisions

- Demo 003 should be the first version to introduce economic factors.
- Demo 003 should still focus on infrastructure potential, not a full tycoon loop.
- Remove the proposed Compare Mode from the Demo 003 direction.
- Avoid simplifying infrastructure judgment into direct rankings such as "Phobos vs Deimos" or "Ceres vs Vesta."
- Economic modeling should appear as scenario pressure: demand, cost, risk, route windows, maintenance burden, revenue potential, and infrastructure state.

### Rationale

- Real logistics and settlement decisions are contextual. A direct comparison UI would imply a false universal answer.
- The north star is not "find the best node"; it is "understand how physical and economic constraints shape civilization."
- Economics can enter before gameplay if it is treated as explanatory pressure rather than as a complete market simulation.

### Open Questions

- What is the smallest economic model that changes infrastructure value without becoming a tycoon game?
- Should Demo 003 expose scenarios such as science logistics, Mars settlement support, asteroid volatiles, or passenger migration?
- Which economic variables should be fixed assumptions and which should be user-adjustable?

### Next Actions

- Draft a Demo 003 spec around infrastructure potential plus economic pressure.
- Explicitly mark full economy, resources, population, and settlement simulation as out of scope unless the spec narrows them to explanatory metrics.

## 2026-07-09 - Demo 003 Economy Research Gate

### Decisions

- Do not add an economic model to Demo 003 from intuition alone.
- Before writing the Demo 003 spec, review transport economics, virtual economy literature, and online-game economy practice.
- Treat EVE Online-style telemetry, MMO faucet/sink practice, OSRS market intervention research, and transport generalized-cost models as relevant inputs.
- Frame the likely Demo 003 direction as economic pressure over infrastructure, not as a complete economy simulation.

### Rationale

- Economic systems are easy to oversimplify and hard to make coherent once they are exposed as gameplay.
- Virtual economies need sources, sinks, observability, and intervention design; otherwise numbers become decorative.
- Transportation economics is a better starting point than generic supply/demand because the project is about costly movement through a network.

### Research Output

- Added `docs/demo-003-economy-model-research.md`.

### Next Actions

- Use the research note as input before drafting `docs/demo-003-*.md`.
- Decide whether Demo 003 should be named `Economic Pressure Map` or `Infrastructure Economics Prototype`.

## 2026-07-09 - Proposal-First Planning

### Decisions

- Change planning output from immediate specs to proposals.
- Use specs only when implementation scope is sufficiently clear.
- Treat Codex's planning role as discussion partner and proposal writer before spec author.
- Add a project process note at `docs/proposal-workflow.md`.

### Rationale

- Demo 001 implementation feedback showed many reasonable deviations from the initial spec.
- Early project work still contains research uncertainty in physics, visualization, economic modeling, and gameplay framing.
- Proposal documents are better suited for capturing options, rationale, weak assumptions, and research gates.

### Next Actions

- Draft Demo 003 as a proposal first, using `docs/demo-003-economy-model-research.md` as research input.
- Convert the Demo 003 proposal into a spec only after the economic model and prototype cut are clear.

## 2026-07-09 - Proposal-Spec-Feedback Loop

### Decisions

- Use a three-step planning loop: proposal, spec, feedback.
- Proposal solidifies brainstorm output into structured options, assumptions, rationale, risks, and prototype cuts.
- Spec attempts execution and records whether the proposal survived implementation.
- Feedback improves the proposal/spec path when possible.
- If feedback cannot resolve the issue, it should explain what the original brainstorm failed to consider and route the work back to brainstorm.

### Rationale

- Proposal alone is not enough; implementation needs a spec boundary.
- Spec alone is not enough; implementation feedback must be captured and allowed to revise prior assumptions.
- A formal feedback step prevents failed implementation from being treated as merely a coding problem when the real issue may be missing domain thinking.

### Next Actions

- Use `docs/proposal-workflow.md` as the project process reference.
- Apply the loop to Demo 003: economy brainstorm/research -> proposal -> spec -> feedback.
