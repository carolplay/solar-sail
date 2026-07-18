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

## 2026-07-09 - Demo 0.3.0 Direction

### Decisions

- Demo 0.3.0 should be the first version to introduce economic factors.
- Demo 0.3.0 should still focus on infrastructure potential, not a full tycoon loop.
- Remove the proposed Compare Mode from the Demo 0.3.0 direction.
- Avoid simplifying infrastructure judgment into direct rankings such as "Phobos vs Deimos" or "Ceres vs Vesta."
- Economic modeling should appear as scenario pressure: demand, cost, risk, route windows, maintenance burden, revenue potential, and infrastructure state.

### Rationale

- Real logistics and settlement decisions are contextual. A direct comparison UI would imply a false universal answer.
- The north star is not "find the best node"; it is "understand how physical and economic constraints shape civilization."
- Economics can enter before gameplay if it is treated as explanatory pressure rather than as a complete market simulation.

### Open Questions

- What is the smallest economic model that changes infrastructure value without becoming a tycoon game?
- Should Demo 0.3.0 expose scenarios such as science logistics, Mars settlement support, asteroid volatiles, or passenger migration?
- Which economic variables should be fixed assumptions and which should be user-adjustable?

### Next Actions

- Draft a Demo 0.3.0 spec around infrastructure potential plus economic pressure.
- Explicitly mark full economy, resources, population, and settlement simulation as out of scope unless the spec narrows them to explanatory metrics.

## 2026-07-09 - Demo 0.3.0 Economy Research Gate

### Decisions

- Do not add an economic model to Demo 0.3.0 from intuition alone.
- Before writing the Demo 0.3.0 spec, review transport economics, virtual economy literature, and online-game economy practice.
- Treat EVE Online-style telemetry, MMO faucet/sink practice, OSRS market intervention research, and transport generalized-cost models as relevant inputs.
- Frame the likely Demo 0.3.0 direction as economic pressure over infrastructure, not as a complete economy simulation.

### Rationale

- Economic systems are easy to oversimplify and hard to make coherent once they are exposed as gameplay.
- Virtual economies need sources, sinks, observability, and intervention design; otherwise numbers become decorative.
- Transportation economics is a better starting point than generic supply/demand because the project is about costly movement through a network.

### Research Output

- Added `docs/demo-0.3.0-economy-model-research.md`.

### Next Actions

- Use the research note as input before drafting `docs/demo-0.3.0-*.md`.
- Decide whether Demo 0.3.0 should be named `Economic Pressure Map` or `Infrastructure Economics Prototype`.

## 2026-07-09 - Proposal-First Planning

### Decisions

- Change planning output from immediate specs to proposals.
- Use specs only when implementation scope is sufficiently clear.
- Treat Codex's planning role as discussion partner and proposal writer before spec author.
- Add a project process note at `docs/proposal-workflow.md`.

### Rationale

- Demo 0.1.0 implementation feedback showed many reasonable deviations from the initial spec.
- Early project work still contains research uncertainty in physics, visualization, economic modeling, and gameplay framing.
- Proposal documents are better suited for capturing options, rationale, weak assumptions, and research gates.

### Next Actions

- Draft Demo 0.3.0 as a proposal first, using `docs/demo-0.3.0-economy-model-research.md` as research input.
- Convert the Demo 0.3.0 proposal into a spec only after the economic model and prototype cut are clear.

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
- Apply the loop to Demo 0.3.0: economy brainstorm/research -> proposal -> spec -> feedback.

## 2026-07-09 - Demo 0.2.5 Physical Coherence Direction

### Decisions

- Start Demo 0.2.5 as a proposal, not a spec.
- Reframe Demo 0.2.5 from "3D physics and data pipeline decision" to "physical coherence pass."
- Treat Three.js, ephemeris JSON, and CR3BP work as possible tools, not the purpose of 0.2.5.
- Focus 0.2.5 on coordinate frames, scale contracts, route-line meaning, cycler honesty, and concept-view boundaries.
- Add `docs/demo-0.2.5-physical-coherence-proposal.md`.

### Rationale

- Demo 0.2.0 improved labeling and explanations, but some visible physical relationships still do not make sense.
- More labels are not enough if the visuals still imply stronger physical claims than the model supports.
- Demo 0.3.0 economics would sit on weak ground if the physical layer remains incoherent.
- A 3D implementation could make weak physics look more authoritative unless the model contract is fixed first.

### Open Questions

- Should concept views remain primary modes or move into secondary explanation/research surfaces?
- Should the cycler become a schedule lane, a stylized orbit, or a hybrid?
- Is documented Keplerian data enough for 0.2.5, or does the spec need an ephemeris JSON experiment?
- Should local gateway views become separate modes, atlas sheets, or inset diagrams?

### Next Actions

- Discuss the 0.2.5 proposal and choose the coordinate / scale contract.
- Pick the route claim taxonomy before writing the 0.2.5 spec.
- Decide the cycler representation direction before implementation.

## 2026-07-09 - Permission and Global Memory Intent

### Decisions

- The user intends Codex to have broad write access while working on this project.
- Reusable lessons from using the project brainstorm process should be added to the global brainstorm skill or equivalent global memory when possible.
- Runtime permissions still need to be verified before writing outside the workspace.
- Avoid creating duplicate project-side placeholder docs for global skill updates unless explicitly requested.

### Rationale

- The desired workflow is direct update of the canonical artifact, not scattered synchronization notes.
- User authorization and runtime sandbox capability are separate. The project should record the authorization intent while still respecting actual tool permissions.

### Next Actions

- When a session has writable access to `/Users/guoya/.codex/skills/brainstorm-recorder`, update that skill directly with the Proposal-Spec-Feedback loop.
- Keep `docs/proposal-workflow.md` as the current local source of truth until the global skill is writable.

## 2026-07-17 - Gamified Simulator Positioning

### Decisions

- Reframe the project away from "game demo" and toward "gamified simulator."
- Treat the current product direction as an infrastructure systems lab with game-like interaction.
- Demo 0.3.0 should avoid defaulting to traditional game loops, win states, or tycoon mechanics.
- Economic and operational layers should appear as scenarios, pressure maps, interventions, telemetry, and explanations.

### Rationale

- The 0.2.5 direction is increasingly about model clarity, route claims, physical coherence, local review, and explanatory tooling.
- That trajectory fits a simulator better than a conventional game demo.
- Game design remains useful, but primarily as interaction design: making complex systems explorable, legible, and motivating.

### Open Questions

- What amount of gamification is useful before it starts distorting the model?
- Should Demo 0.3.0 be framed as `Economic Pressure Simulator`, `Infrastructure Systems Lab`, or another proposal title?
- Which interactions should remain analytical controls, and which can become game-like interventions?

### Next Actions

- Draft Demo 0.3.0 as a proposal for a gamified infrastructure simulator rather than a game demo.
- Use the proposal to decide whether any actual game loop belongs before Demo 0.4.0.

## 2026-07-17 - Four Role Workflow

### Decisions

- Split future work into four lightweight roles:
  - overall planning / evaluation
  - science advisor / game design
  - development
  - operations / UX
- Keep roles intentionally overlapping and lightweight.
- Use the roles to clarify outputs, not to add heavy process.
- Add `docs/project-role-guidelines.md`.

### Rationale

- The project now combines planning, scientific research, simulator/game design, implementation, and feedback operations.
- Without role separation, research uncertainty, implementation tasks, and UX feedback can collapse into one vague next step.
- The role split supports the existing proposal -> spec -> feedback loop without making it prematurely bureaucratic.

### Next Actions

- Use the four roles when drafting the Demo 0.3.0 proposal.
- Let Science Advisor / Game Design produce research and scenario inputs before Demo 0.3.0 becomes a spec.

## 2026-07-17 - Demo 0.2.5 Value Before Demo 0.3.0

### Decisions

- Do not push Demo 0.2.5 toward a perfect physics or visual milestone.
- Keep Demo 0.2.5 valuable as the physical/visual substrate for Demo 0.3.0.
- Demo 0.3.0 can add an economic model directly, but should reuse 0.2.5's route claims, scale contracts, visual layers, and concept-view playability.
- Treat remaining 0.2.5 work as selective polish and coherence fixes, not as a full physics-engine upgrade.

### Rationale

- Demo 0.2.5 still has meaningful playability in physical models and visual presentation: route layers, scale contracts, cycler service semantics, concept views, and local review.
- Demo 0.3.0 economic pressure will be easier to understand if users can already see route classes, schematic vs physical scale, and infrastructure relationships.
- Chasing physically perfect ephemeris, 3D manifolds, or authoritative cycler trajectories before economics would delay the simulator's core direction.

### Open Questions

- Which 0.2.5 visual elements should be kept as primary interaction surfaces in Demo 0.3.0?
- Which 0.2.5 issues must be fixed before economic overlays, especially local schematic coordinate readouts and mobile complexity?
- Should Gravity Well View and Low-Energy Routes View become economic scenario explanation surfaces rather than standalone physics ambitions?

### Next Actions

- Draft Demo 0.3.0 as an economic-pressure proposal that explicitly builds on Demo 0.2.5 visual/physical affordances.
- Keep Demo 0.2.5 feedback focused on blockers for Demo 0.3.0 rather than exhaustive visual refinement.

## 2026-07-17 - Dynamic Routes And Scenarios

### Decisions

- Low-Energy Routes should not remain purely static visual corridors.
- Add time variation to Low-Energy Routes so the viewer can communicate dynamic route availability, cadence, waiting time, and slow/cheap flow.
- Treat dynamic route behavior as an input to the future economic model, not just as visual polish.
- Reframe scale presets such as Inner System and Earth Gateway toward scenario selection.
- Scenarios should behave like playable maritime situations: known global geography, but concrete local/route problems.

### Rationale

- Economic pressure depends on time: window frequency, transfer duration, reliability, waiting cost, and route cadence.
- A static Low-Energy Routes view cannot explain why a slow cheap route is economically useful or when it becomes a bottleneck.
- A scenario such as Earth-Moon logistics or Earth-Mars service corridor is more playable than a generic zoom mode.
- The Age of Sail analogy works better when the simulator offers concrete route/port theaters rather than only a global map.

### Candidate Scenarios

- Earth-Moon logistics
- Earth-Mars service corridor
- Mars-Phobos-Deimos gateway operations
- Mars-Ceres / asteroid volatile logistics
- Lagrange relay and depot network

### Open Questions

- Should scenario selection replace scale selection, or sit above it?
- What is the simplest time model for Low-Energy Routes: pulsing corridors, route windows, moving packets, or scheduled flow bands?
- Which dynamic route properties should be exposed to the economic model first: availability, travel time, reliability, capacity, or waiting cost?

### Next Actions

- Include dynamic Low-Energy Routes and scenario selection as first-class topics in the Demo 0.3.0 proposal.
- Avoid treating scale modes as the main interaction model once scenario design begins.

## 2026-07-17 - Demo 0.2.6 Proposal

### Decisions

- Position the next iteration as Demo 0.2.6.
- Draft Demo 0.2.6 from the Science Advisor / Game Design perspective.
- Focus Demo 0.2.6 on dynamic Low-Energy Routes and scenario-based route theaters.
- Keep Demo 0.2.6 between physical coherence and economic modeling: it prepares route telemetry for Demo 0.3.0 but does not implement the full economy.
- Add `docs/demo-0.2.6-dynamic-route-scenarios-proposal.md`.

### Rationale

- Demo 0.2.5 has enough physical coherence to become a substrate for more playable scenarios.
- Low-Energy Routes need time variation to become meaningful inputs for economic pressure.
- Scenario selection is a better gamified simulator interface than plain scale selection.

### Next Actions

- Choose the first two or three scenarios.
- Choose the visual metaphor for dynamic Low-Energy Routes.
- Decide which telemetry fields must feed Demo 0.3.0.

## 2026-07-17 - Version And Direction Cleanup

### Decisions

- Use semantic demo versions in docs and references.
- Treat `Demo 001`, `Demo 002`, `Demo 002.5`, `Demo 002.6`, and `Demo 003` as old shorthand for `Demo 0.1.0`, `Demo 0.2.0`, `Demo 0.2.5`, `Demo 0.2.6`, and `Demo 0.3.0`.
- Rename versioned proposal/spec/feedback documents to `docs/demo-<major.minor.patch>-<topic>-<step>.md`.
- Rename the direction document from a post-0.1.0 note into a continuing project roadmap.
- Separate Demo 0.2.6 dynamic route/scenario work from Demo 0.3.0 economic pressure work.

### Rationale

- Proposal, spec, and feedback are now versioned artifacts, so filenames should sort and read consistently.
- The direction document had accumulated later-version material; it needed a version index and clearer boundaries.
- Demo 0.2.6 is better understood as the route-time/scenario substrate for Demo 0.3.0, not as a hidden subsection of the economy direction.

### Next Actions

- Keep new proposal/spec/feedback docs on the semantic version naming convention.
- Use `docs/project-directions.md` as the continuing roadmap reference.

## 2026-07-17 - Demo 0.2.6 Implementation Readiness

### Decisions

- The refined Demo 0.2.6 proposal is ready to hand to implementation after being converted into a constrained spec.
- Accept the three scenario cut: Earth-Moon Gateway Logistics, Earth-Mars Service Corridor, and Lagrange Relay And Volatile Network.
- Treat scenarios as the primary navigation model; keep scale as focus/camera support.
- Implement parameterized scenario-normalized energy terrain for Gravity View.
- Implement stable route-family networks with dynamic availability, waiting, and flow for Low-Energy Routes View.
- Defer CR3BP, real manifold solving, 3D orbit rendering, and the economic model.
- Add `docs/demo-0.2.6-dynamic-route-scenarios-spec.md`.

### Rationale

- The proposal now has enough decisions for implementation: scenario count, view/model/claim boundaries, and dynamic route telemetry are all defined.
- Remaining scientific uncertainty can be safely carried as model labels and future research, rather than blocking 0.2.6.
- A narrow spec protects implementation from accidentally expanding into CR3BP, 3D, or Demo 0.3.0 economics.

### Next Actions

- Hand Demo 0.2.6 to development using `docs/demo-0.2.6-dynamic-route-scenarios-spec.md`.
- After implementation, write Demo 0.2.6 feedback comparing the running app against the spec.

## 2026-07-17 - Spec Ownership And Execution Notes

### Decisions

- Planning / Organizer should write implementation-ready specs from proposals and research input.
- Implementation should read proposal and spec, then execute the accepted cut instead of writing the spec itself.
- If the spec is unrealistic, implementation should record deviations, blockers, and gaps rather than silently changing the target.
- Development and operations can temporarily share one working note during early demo work.
- Implementation / operations may repeat build, test, fix, and retest cycles before producing final feedback.

### Rationale

- Specs are scope-control artifacts, so they fit the organizer role better than the implementation role.
- Letting implementation invent the spec risks mixing direction-setting with feasibility triage.
- In early demos, development and UX review are tightly coupled; separating their notes too early adds process without adding clarity.

### Next Actions

- Keep `docs/proposal-workflow.md` as the process source of truth.
- Let Demo 0.2.6 implementation produce working notes as needed, then final feedback against the spec.
