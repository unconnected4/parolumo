---
task: step0-fixtures-and-contract
title: Step 0 — confirm Yandex, record fixtures, schemas and contract export
status: in-progress
branch: main
started: 2026-09-26T14:38:53Z
last_updated: 2026-09-26T14:42:34Z
last_commit: 8d51d1e
agents: [AgyD-Flash3.8, ClaudeC-Opus5.5]
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

ClaudeC-Opus5.5 reviewed 8d51d1e: P5–P10 are applied as intended. Four gaps remain that affect Step 0's code and contract, raised as proposals P11–P14 under Open questions for AgyD-Flash3.8 to decide before scaffolding. No docs other than this handoff were changed.

## Done
- Initialized active handoff for Step 0.

## Tried and rejected
- Hand-writing mock data in TypeScript: rejected in favor of exporting generated API examples from the Python backend slice to prevent schema and mapping drift.

## Decisions made during this task
- None yet.

## Open questions
Proposals from ClaudeC-Opus5.5, continuing the numbering from the archived `ui-first-and-plan-amendments` handoff, to be answered by AgyD-Flash3.8 (accept → apply to the named docs; reject → record why under Tried and rejected):

- **P11. Decide how the API identifies a sense before any database exists.** `POST /api/cards {sense_id}` assumes `senses.id`, a database key. Step 0 has no database, so the exported lookup examples have no real IDs, and anything MSW invents won't match what the backend returns later. It also leaves an unstated consequence: every lookup has to insert its lexemes and senses into the database so that IDs exist for the "+" button. Proposal: the public sense identifier in the API is `source_key` (the stable hash of lemma + pos + main translation from `docs/plan.md` Step 1), exposed as a string `sense_id`. It can be computed by the mapping alone, so the Step 0 examples are deterministic and final, and it survives database resets and differs by nothing between environments. Internally `user_cards.sense_id` can stay an integer foreign key; `POST /api/cards` resolves the key (upserting the sense from the lookup cache or provider if it isn't stored yet). Lookup then doesn't need to write to `senses` at all. Affects `docs/plan.md` (Step 1 `senses`, Step 2 endpoints) and `backend/intent.md`.
- **P12. `saved` is per-user state, so examples can't carry it.** The lookup response marks each sense `saved: bool` for the current user. A static example file can only say one thing. Proposal: exported lookup examples always have `saved: false`; the MSW handlers keep an in-memory set of saved sense IDs (filled by the mocked `POST`/`DELETE /api/cards`) and overlay `saved` on the lookup response. Also export the non-happy cases the UI must handle, not only "run", "bank", "light": a word with no results (`lookup/not-found.json`), and the error body shape for a provider failure. Affects `web/intent.md` (MSW decision) and `docs/plan.md` (Step 0).
- **P13. The fake provider can't read from `tests/`.** This corrects my own P7. "Tests and local runs use the fake dictionary provider" (root `AGENTS.md`), so the fake provider is runtime code, and `backend.yml` builds a Docker image, which normally leaves `tests/` out. If the fake provider loads `tests/fixtures/yandex/`, it breaks in the image and makes app code depend on the test tree. Proposal: raw Yandex responses live under the app, e.g. `backend/app/providers/fake_data/yandex/<word>.json`, and tests load them from there. For unknown words the fake provider returns an empty result, so local runs behave like the real "not found" case. Affects `backend/intent.md` (Fixture boundaries), `docs/plan.md` (Step 0, Repo layout) and `backend/AGENTS.md` (Layout).
- **P14. Examples need the same drift protection as the spec, and the instruction files need to know about them.** 8d51d1e updated the intent docs but not the files agents actually follow. Proposal: (a) examples are written by a command next to the spec export (e.g. `uv run python -m app.export_examples`), each example validated against its response schema before writing; (b) the OpenAPI drift check in CI also fails when `docs/api/examples/` is out of date; (c) update `backend/AGENTS.md` (commands, layout, and the rule "any change to routes or schemas re-exports the spec" extended to examples), `docs/api/README.md` (which says `openapi.json` is the only file in the folder) and `docs/engineering.md` (Contract row and API contract section). Affects those three files.

- For Alex: can you obtain a live Yandex Dictionary API key, or should Step 0 start with the sample responses from Yandex's documentation? Only Alex can register the key (account, and whether the terms are acceptable). It blocks recording real fixtures, not the rest of Step 0.

## Next step
AgyD-Flash3.8: decide P11–P14 under Open questions, apply the accepted ones to the named docs, and record rejected ones under Tried and rejected. Then:
Verify Yandex key availability or collect sample responses for "run", "bank", "light", then scaffold `backend/pyproject.toml` with `uv`.

## Session log
- 2026-09-26T14:38:53Z AgyD-Flash3.8: Initialized Step 0 handoff following closure and archiving of ui-first-and-plan-amendments.
- 2026-09-26T14:42:34Z ClaudeC-Opus5.5: Reviewed 8d51d1e; P5–P10 applied as intended; recorded proposals P11–P14 (public sense ID, per-user `saved` in mocks, fake-provider data location, example export and drift checks). Handoff-only change.

## Outcome
<!-- Filled in only when archiving. -->
