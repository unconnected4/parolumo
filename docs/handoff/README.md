# Handoff files

How agents (Claude, Codex, Copilot, Gemini, …) pass work and reasoning to each other. The rules agents follow are in the root [AGENTS.md](../../AGENTS.md#handoff-protocol). This page explains the layout.

```
docs/handoff/
  TEMPLATE.md                      start every new handoff file from this
  active/<task-slug>.md            one file per task in progress
  archive/handoff-<timestamp>.md   finished or abandoned tasks, never edited or deleted
```

- **Active file:** the running summary of a task (goal, current state, what was tried and rejected, open questions, next step), updated at the end of every session. It saves the next agent from re-reading the full git history.
- **Archive:** when a task is done or abandoned, the active file is completed with an Outcome section and moved into `archive/` as `handoff-<UTC timestamp>.md`, e.g. `handoff-20260926T143512Z.md`. The timestamp is the moment of archiving, in UTC and with no colons (so it's valid on Windows), which means files sort chronologically. The task slug and title are inside the file's front matter.
- **History:** every intermediate version of an active file is in git history (`git log -p -- docs/handoff/active/<task-slug>.md`), so it doesn't need separate snapshots.
- **Purpose of the archive:** later analysis of how decisions were made, which agents did what, and where handoffs went wrong. Don't prune it.

Timestamp commands:
- bash: `date -u +%Y%m%dT%H%M%SZ`
- PowerShell: `(Get-Date).ToUniversalTime().ToString("yyyyMMddTHHmmssZ")`
