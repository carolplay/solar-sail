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
