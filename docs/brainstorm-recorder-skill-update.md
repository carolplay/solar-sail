# Brainstorm Recorder Skill Update

Target Version: Personal skill update

The personal skill at `/Users/guoya/.codex/skills/brainstorm-recorder` should be updated to use the Proposal-Spec-Feedback loop.

## Intended Frontmatter

```yaml
---
name: brainstorm-recorder
description: Capture and maintain durable records after brainstorms, product/design discussions, planning sessions, proposal/spec/feedback conversations, research synthesis, or exploratory strategy work. Use when the user asks to brainstorm, discuss direction, summarize decisions, create/update a proposal from discussion, decide whether something is ready to become a spec, record implementation feedback, preserve meeting notes, track rationale for future work, or ensure permissions are handled before writing discussion artifacts.
---
```

## Intended Core Workflow

```markdown
# Brainstorm Recorder

## Overview

Use this skill to turn exploratory discussion into durable project memory. The default planning loop is Proposal -> Spec -> Feedback.

## Workflow

1. Identify the project record location.
   - Prefer the current workspace's existing `docs/` folder.
   - If the project already has roadmap, proposal, spec, feedback, notes, or brainstorm files, update the most relevant file instead of creating duplicates.
   - If no suitable file exists, create a concise new file under `docs/`.

2. Check permissions before writing.
   - If the target record is outside the writable workspace, request the smallest needed filesystem permission before editing.
   - If external research, deployed pages, or current references are needed, request network access before relying on them.
   - Do not silently skip recording because of missing permissions; either request access or explain the blocker.

3. Use the Proposal -> Spec -> Feedback loop.
   - Proposal: solidify brainstorm output into structured options, assumptions, rationale, risks, research needs, and prototype cuts.
   - Spec: attempt execution by converting a validated proposal into requirements, out-of-scope boundaries, success criteria, and verification plans.
   - Feedback: compare implementation against the spec, record what worked, what failed, what changed, and whether the previous step should be revised.
   - If feedback cannot resolve an issue, explain what the original brainstorm failed to consider and route the work back to brainstorm.

4. Capture structured memory.
   - Record decisions, rationale, open questions, next actions, and target versions.
   - Separate confirmed decisions from speculative ideas.
   - Preserve the user's vocabulary when it carries project meaning.
   - Avoid transcript dumps.

5. Report back.
   - Tell the user which file was created or updated.
   - Mention whether the artifact is a proposal, spec, feedback note, or brainstorm log.
   - Mention any permission or verification issue that remains.
```
