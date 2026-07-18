# Proposal-Spec-Feedback Workflow

Target Version: Project process

## Purpose

Project planning should follow a three-step loop:

```text
Proposal -> Spec -> Feedback
```

The project is still discovering its physics model, visualization language, economic model, and eventual gameplay shape. A spec should be reserved for implementation-ready scope. Before that point, the useful artifact is a proposal: a structured argument with options, assumptions, evidence, risks, and recommended next steps.

## Why Proposal Before Spec

Demo 0.1.0 implementation feedback showed several cases where the written spec was too firm for the actual discovery process:

- deployment was deferred
- build tooling stayed simpler than expected
- physics remained approximate
- Earth-Moon Lagrange points were reduced
- scale modes only applied to Orbit View
- concept views became interactive snapshots
- Low-Energy Routes View remained a placeholder
- cycler and shuttle dynamics stayed conceptual
- mobile layout needed substantial adjustment after testing

These were reasonable implementation decisions, but they show that early documents should not imply settled requirements before research and prototype feedback.

## Step 1: Proposal

Purpose:

```text
Solidify brainstorm output into a structured argument.
```

During brainstorms and planning discussions, Codex should produce proposals that:

- state the problem being solved
- map the idea back to the north star
- separate confirmed decisions from hypotheses
- identify research needed before implementation
- define viable options and tradeoffs
- recommend a direction with rationale
- call out risks and weak assumptions
- suggest the smallest useful prototype or experiment
- record open questions

The proposal is allowed to contain uncertainty. It should make uncertainty visible instead of hiding it in requirements language.

### Proposal Shape

Use this structure by default:

```markdown
# <Topic> Proposal

Target Version: <demo/version/process scope>

## Problem

## North Star Fit

## Current Evidence

## Options

## Recommendation

## Risks / Weak Assumptions

## Research Needed

## Prototype Cut

## Open Questions

## When This Becomes A Spec
```

## Step 2: Spec

Purpose:

```text
Attempt execution and record whether the proposal survived contact with implementation.
```

Planning / Organizer should create or update a spec only after:

- the proposal has a clear recommendation
- key unknowns have either been researched or explicitly deferred
- the implementation cut is small enough to build
- out-of-scope items are clear
- success criteria are testable

Specs should describe what to build. Proposals should describe what may be worth building and why.

Implementation should read the proposal and spec, but should not be responsible for inventing the spec from scratch. If the spec is unrealistic, implementation records the gap instead of silently changing the target.

Each spec should include:

- target version
- goal
- requirements
- out of scope
- implementation cut
- success criteria
- verification plan
- known risks carried forward from the proposal

During implementation, record:

- what was implemented
- what changed from the spec
- what failed
- what was deferred
- what assumptions proved wrong

Implementation and operations may share a working note during active development. For early demos, it is acceptable for the same role to build, run local checks, test the UI, fix obvious issues, and repeat this cycle a few times before writing final feedback.

## Step 3: Feedback

Purpose:

```text
Improve the previous steps or identify what the brainstorm missed.
```

After implementation or prototype testing, write feedback that:

- compares implementation against the spec
- identifies scope-adjusted choices
- records test findings
- separates implementation bugs from bad assumptions
- recommends whether to update the spec, revise the proposal, or reopen brainstorm

Feedback can be written after one or more implementation / operations cycles. It should summarize the final tested state, not every intermediate attempt.

If feedback can improve the previous step, do so:

```text
feedback -> revise spec
feedback -> revise proposal
```

If feedback cannot resolve the issue because the original brainstorm missed important constraints, explicitly route the work back to brainstorm:

```text
feedback -> missing consideration -> new brainstorm needed
```

Examples of issues that should return to brainstorm:

- the economic model is incoherent
- the physics claim is stronger than the model supports
- the UI concept cannot work on target devices
- the proposed gameplay loop contradicts the north star
- implementation exposes a new domain question that was not considered

## Document Naming

Prefer:

```text
docs/demo-<major.minor.patch>-<topic>-proposal.md
docs/demo-<major.minor.patch>-<topic>-spec.md
docs/demo-<major.minor.patch>-<topic>-feedback.md
```

Examples:

```text
docs/demo-0.2.6-dynamic-route-scenarios-proposal.md
docs/demo-0.2.6-dynamic-route-scenarios-spec.md
docs/demo-0.2.6-dynamic-route-scenarios-feedback.md
```

For small cycles, one file may contain all three sections if that keeps the project easier to follow.

## Permission Rule

If producing a proposal requires reading attached notes, deployed pages, external research, or files outside the current writable workspace, request the smallest required permission before relying on those sources.

The same rule applies to spec and feedback. Do not claim implementation success, research support, or deployment behavior without the required local, browser, network, or filesystem access.

## Project Permission Intent

The user intends Codex to have broad write access while working on this project, including the ability to update reusable project/process memory such as personal brainstorm skills.

Execution rule:

- Treat broad write access as user intent, not as proof of runtime capability.
- Before editing outside the current workspace, verify that the path is actually writable in the active sandbox.
- If the runtime cannot write the intended global path, do not create duplicate workaround documents in the project unless the user explicitly wants a temporary artifact.
- Prefer updating the canonical artifact directly once permissions are available.

## Global Learning Rule

When the project brainstorm process produces reusable operating lessons, add them to the canonical global skill or memory artifact when possible.

Examples:

- proposal/spec/feedback workflow improvements
- permission-handling lessons
- recurring documentation conventions
- rules for when brainstorm should reopen instead of forcing implementation

If global memory cannot be updated because of runtime permissions, record the blocker in the final response and keep the project docs as the canonical local record.
