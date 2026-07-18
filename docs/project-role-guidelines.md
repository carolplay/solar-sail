# Project Role Guidelines

Target Version: Project process

## Purpose

The project is moving toward a gamified infrastructure simulator. Work should be split across lightweight roles so discussion, research, development, and review do not blur into one undifferentiated task.

These are roles, not separate teams. A single Codex session may hold multiple roles, and overlap is acceptable.

## Brainstorm vs Project Management

Brainstorm and project management should be conceptually separate.

Brainstorm is about direction generation:

- explore next-version possibilities
- surface scientific, design, and product questions
- compare options and tradeoffs
- preserve rationale and open questions
- produce or revise proposals

Project management is about delivery control:

- define role inputs and outputs
- decide when proposal is ready for spec
- write or approve implementation-ready specs
- hand work to Development / Operations
- track implementation notes, tests, deviations, and gaps
- decide whether feedback should revise spec, revise proposal, or reopen brainstorm

In many small project contexts, the project lead may do both. When that happens, explicitly name which hat is active:

```text
Brainstorm hat: generate and clarify direction.
Project-management hat: constrain scope and move work through roles.
```

## 1. Overall Planning / Evaluation

Primary owner: Codex in planning mode for this project.

Focus:

- maintain the north star
- keep the proposal -> spec -> feedback loop moving
- decide when an idea is still a proposal and when it is ready for spec
- reduce unnecessary detail when the project is drifting
- identify when feedback means the original brainstorm missed a constraint
- keep roadmap, scope, and version boundaries coherent

Inputs:

- brainstorm discussions
- role outputs from research, development, and UX review
- implementation feedback
- project roadmap and prior docs

Outputs:

- proposals
- implementation-ready specs
- roadmap updates
- scope cuts
- decision logs
- version boundary recommendations

Avoid:

- over-specifying before research is done
- treating implementation failure as automatically a coding issue
- adding process for its own sake

## 2. Science Advisor / Game Design

Focus:

- research relevant physics, astronomy, economics, transport systems, and simulation references
- produce compact literature notes with citations when current knowledge matters
- translate research into usable simulator concepts
- propose game-like scenarios, stories, interventions, and interaction patterns
- keep scientific claims aligned with model limits

Inputs:

- open questions from proposals
- weak assumptions found during implementation or UX review
- external references and papers
- player/user experience goals

Outputs:

- research notes
- scenario proposals
- concept explanations
- interaction ideas
- model risk notes

Example outputs:

- cycler research note
- economic pressure model research
- scenario: asteroid volatile logistics
- scenario: Mars settlement support
- interaction: toggle depot support and inspect route pressure

Avoid:

- making weak physics look authoritative
- reducing complex infrastructure decisions to simple rankings
- adding lore that does not clarify the system

## 3. Development / Operations Loop

Focus:

- implement the agreed spec or prototype cut
- keep code changes scoped to the current version goal
- preserve model labels, route claims, and explanation surfaces
- verify build, syntax, UI states, and local preview behavior
- record implementation deviations for feedback
- test the running simulator
- evaluate whether views are legible and useful
- collect questions and feedback during local review
- identify panel overlap, mobile friction, unclear labels, and misleading visuals
- separate UX bugs from deeper model or proposal problems

Inputs:

- accepted proposal
- implementation-ready spec
- research notes needed for the feature
- UX feedback and bug reports
- running local preview or deployed demo
- spec success criteria
- user feedback
- offline review logs

Outputs:

- code changes
- local build artifacts
- implementation notes
- verification results
- known gaps
- feedback notes
- test findings
- screenshots or local review records when useful
- recommendations to revise spec, revise proposal, or reopen brainstorm

Avoid:

- adding major features not covered by the current spec unless they are explicitly labeled as extra
- hiding uncertainty in UI polish
- mixing operational review tools into the core simulator without documenting the boundary
- treating all user confusion as UI wording problems
- accepting visual excitement as proof of model coherence
- letting local operations records become scattered project documentation

Working rule:

```text
Implementation and operations may share one note while the version is being built.
Build -> test -> fix -> retest can repeat several times before final feedback.
```

Local permission rule:

```text
Local preview and verification are part of the default implementation loop.
```

When the runtime asks for approval, Development / Operations should request persistent approval for narrow project-local prefixes such as:

- `npm run dev`
- `npm run build`
- `npm test`
- `node scripts/preview.mjs`
- `node scripts/build.mjs`

Avoid broad command approvals such as `node`, `python`, `bash`, or `curl`.

## Handoff Rules

- Planning turns brainstorm into proposal.
- Science/Game Design supplies research and scenarios before spec when model quality matters.
- Planning / Organizer writes the implementation-ready spec from the proposal and research input.
- Development / Operations implements, tests, iterates, and records deviations.
- When Planning starts an implementation thread, Planning should evaluate the result after that thread completes.
- Feedback decides whether remaining gaps can be fixed locally or must return to spec, proposal, or brainstorm.

Minimal loop:

```text
Planning -> Science/Game Design -> Proposal -> Planning Spec -> Development/Operations cycles -> Planning Evaluation -> Feedback
```

This loop can be shortened when the change is small. The important rule is to keep the artifact type honest.

## Current Default For Demo 0.3.0

Demo 0.3.0 should be approached as a gamified simulator proposal, not a game spec.

Expected emphasis:

- scenario-based infrastructure economics
- pressure maps
- interventions
- telemetry
- explanation
- feedback capture

Do not start with:

- win states
- campaign missions
- full tycoon loops
- player wallet
- commodity market
