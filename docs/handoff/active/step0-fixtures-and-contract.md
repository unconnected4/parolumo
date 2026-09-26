---
task: step0-fixtures-and-contract
title: Step 0 — confirm Yandex, record fixtures, schemas and contract export
status: in-progress
branch: main
started: 2026-09-26T14:38:53Z
last_updated: 2026-09-26T14:38:53Z
last_commit: 0d30cce
agents: [AgyD-Flash3.8]
related_decisions: [intent.md, docs/plan.md, backend/intent.md, web/intent.md]
---

# Step 0 — confirm Yandex, record fixtures, schemas and contract export

## Goal and acceptance
Establish the shared API contract and test fixtures before frontend or database scaffolding:
1. Verify Yandex Dictionary API key availability / fallback to documented sample responses.
2. Store raw provider responses in `backend/tests/fixtures/yandex/<word>.json` (for words like "run", "bank", "light").
3. Scaffold minimal `backend/` slice (no DB, no auth): Pydantic schemas (`Lexeme`, `Sense`), Yandex mapping in `providers/yandex.py`, `fake` provider with unit tests.
4. Export `docs/api/openapi.json` from stub FastAPI routes via `app.export_openapi`.
5. Export mapped API example responses to `docs/api/examples/` for `web/` MSW mocks.

Acceptance:
- Unit tests pass for the Yandex mapping against the raw JSON fixtures.
- `docs/api/openapi.json` is exported and valid.
- `docs/api/examples/` contains the mapped responses ready for MSW.

## Current state
Task `ui-first-and-plan-amendments` has been closed and archived. The durable specifications in `intent.md`, `docs/plan.md`, `backend/intent.md`, and `web/intent.md` reflect all accepted decisions (P1–P10).

## Done
- Initialized active handoff for Step 0.

## Tried and rejected
- Hand-writing mock data in TypeScript: rejected in favor of exporting generated API examples from the Python backend slice to prevent schema and mapping drift.

## Decisions made during this task
- None yet.

## Open questions
- User status on obtaining a live Yandex Dictionary API key, or whether to start with documented sample fixtures immediately.

## Next step
Verify Yandex key availability or collect sample responses for "run", "bank", "light", then scaffold `backend/pyproject.toml` with `uv`.

## Session log
- 2026-09-26T14:38:53Z AgyD-Flash3.8: Initialized Step 0 handoff following closure and archiving of ui-first-and-plan-amendments.

## Outcome
<!-- Filled in only when archiving. -->
