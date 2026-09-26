---
task: step0-fixtures-and-contract
title: Step 0 — API schemas, fake provider and contract export
status: in-progress
branch: main
started: 2026-09-26T14:38:53Z
last_updated: 2026-09-26T15:09:36Z
last_commit: c9d4d11
agents: [AgyD-Flash3.8, ClaudeC-Opus5.5]
related_decisions: [intent.md, docs/plan.md, backend/intent.md, web/intent.md]
---

# Step 0 — API schemas, fake provider and contract export

## Goal and acceptance
Establish the shared API contract and fake data before frontend or database scaffolding. Rewritten 2026-09-26 after Alex's decision (see Decisions): no Yandex work in this task.
1. Design the API around what the web UI needs (search results grouped by part of speech, sense cards with "+/✓", "My words"), independent of any provider's response format.
2. Scaffold minimal `backend/` slice (no DB, no auth): Pydantic schemas (`Lexeme`, `Sense`), the `DictionaryProvider` interface, and a `fake` provider returning hand-authored data in our own domain shape (e.g. "run", "bank", "light", plus a not-found case), with unit tests.
3. Export `docs/api/openapi.json` from stub FastAPI routes via `app.export_openapi`.
4. Make the fake data available to `web/` for prototyping through its own MSW mock layer (`web/src/mocks/`), kept separate from the backend's fake provider (by Alex, see Decisions).

Acceptance:
- Unit tests pass for the fake provider and stub routes.
- `docs/api/openapi.json` is exported and valid.
- `docs/api/examples/` contains validated static examples (happy paths, not-found, error shape).
- `web/` can prototype against the fake data through the generated client and MSW.

## Current state
All proposals P11–P14 have been accepted and applied across `docs/plan.md`, `backend/intent.md`, `web/intent.md`, `backend/AGENTS.md`, `docs/api/README.md`, and `docs/engineering.md` in line with Alex's decisions (design our own API, segregated implementations including mocks). All durable specifications and agent instruction files are fully synchronized.

## Done
- Initialized active handoff for Step 0.
- Evaluated and accepted proposals P11–P14:
  - P11: Public `sense_id` is an opaque deterministic string owned by the backend.
  - P12: Static lookup examples export `saved: false`; MSW overlays `saved: bool` dynamically from an in-memory set; export non-happy paths (not-found, error).
  - P13: Fake provider data lives under runtime code `backend/app/providers/fake_data/<word>.json`.
  - P14: Added `app.export_examples` command, schema validation, CI drift check, and updated instructions in `backend/AGENTS.md`, `docs/api/README.md`, and `docs/engineering.md`.
- Updated `docs/plan.md`, `backend/intent.md`, `web/intent.md`, `backend/AGENTS.md`, `docs/api/README.md`, and `docs/engineering.md` to remove Yandex Step 0 coupling and reflect Alex's decisions on API ownership and code segregation.

## Tried and rejected
- Hand-writing mock data in TypeScript: rejected in favor of exporting generated API examples from the Python backend slice to prevent schema and mapping drift.
- P15, web prototyping against the mocked backend instead of MSW (rejected by Alex): it "mixtures implementations that should be segregated", and the "UI mock can be utilized in the future for UI only tests". MSW stays as `web/`'s own mock layer.

## Decisions made during this task
- **Design our own API; Yandex is the first provider, not the only one (by Alex):** "Don't focus on Yandex API, we design our own application. Yandex will be used as a first but not the only provider. Hence, design API for our needs (Web UI atm), integration questions will be addressed after we build the first backend with mocked functionality." Consequences: Step 0 no longer records Yandex fixtures or writes the Yandex mapping; fake data is hand-authored in our domain shape under `backend/app/providers/fake_data/`; Yandex keys, terms and storage are deferred. Recorded in root `intent.md`.
- **Segregated implementations, mocks included (by Alex):** "no, it mixtures implementations that should be segregated. also UI mock can be utilized in the future for UI only tests. Consider segregation of code for all the parts." Consequences: `web/` keeps MSW in `src/mocks/`, used by dev mock mode and tests only, and reused later for UI-only tests; every backend fake (fake provider, in-memory stand-ins before Postgres) is its own implementation behind an interface, chosen by `Settings` or test setup; no production code branches on "is this a mock". Recorded in root `intent.md`, `web/intent.md`, `web/AGENTS.md`, `backend/intent.md` and `docs/engineering.md`.
- **Public sense identification (P11):** The public `sense_id` in API responses and card requests is an opaque deterministic string owned by the backend (e.g. hash of provider + lemma + pos + main translation). Clients never parse it. Any provider computes it statelessly without a database.
- **Dynamic mock overlay for `saved` (P12):** Static lookup examples export `saved: false`. The MSW layer keeps an in-memory set of saved sense IDs to overlay `saved: bool` on search results dynamically. Export includes non-happy paths (`lookup/not-found.json` and error shape).
- **Fake provider data location (P13):** Fake data lives under `backend/app/providers/fake_data/<word>.json` because the fake provider is runtime code (used in local dev and Docker builds).
- **API examples export & drift check (P14):** `uv run python -m app.export_examples` validates and exports response examples to `docs/api/examples/`. CI enforces drift checks on examples alongside `openapi.json`.

## Open questions
None blocking Step 0.
- Hosting for backend + Postgres and web SPA: TBD.
- Yandex terms clarification and key registration: Deferred until after the mocked backend is built (by Alex).

## Next step
Scaffold `backend/pyproject.toml` with `uv` and start the Step 0 slice:
1. Define Pydantic models for `Lexeme`, `Sense`, and search/card responses in `app/schemas/`.
2. Define `DictionaryProvider` protocol and `FakeDictionaryProvider` in `app/providers/`.
3. Add hand-authored fake data for "run", "bank", "light" under `backend/app/providers/fake_data/`.
4. Create stub FastAPI app with `/api/dictionary/lookup` and `/api/cards` in `app/main.py`.
5. Implement `app.export_openapi` and `app.export_examples` and export `docs/api/openapi.json` and `docs/api/examples/`.

## Session log
- 2026-09-26T14:38:53Z AgyD-Flash3.8: Initialized Step 0 handoff following closure and archiving of ui-first-and-plan-amendments.
- 2026-09-26T14:42:34Z ClaudeC-Opus5.5: Reviewed 8d51d1e; P5–P10 applied as intended; recorded proposals P11–P14 (public sense ID, per-user `saved` in mocks, fake-provider data location, example export and drift checks). Handoff-only change.
- 2026-09-26T14:51:45Z ClaudeC-Opus5.5: Read the Yandex Dictionary API terms; recorded "For Alex:" question on the no-permanent-storage clause vs saved cards, with options. Handoff-only change.
- 2026-09-26T14:56:56Z ClaudeC-Opus5.5: Recorded Alex's decision (own API, Yandex first of several providers, integration deferred) in root `intent.md` and here; rewrote the goal, closed both `For Alex:` questions, revised P11/P13, added P15 (mocked backend instead of MSW).
- 2026-09-26T15:05:05Z ClaudeC-Opus5.5: Recorded Alex's rejection of P15 and the segregation decision (mocks included) in root `intent.md`, `web/intent.md`, `web/AGENTS.md`, `backend/intent.md`, `docs/engineering.md` and here.
- 2026-09-26T15:09:36Z AgyD-Flash3.8: Accepted P11–P14, synchronized docs/plan.md, backend/intent.md, web/intent.md, backend/AGENTS.md, docs/api/README.md, and docs/engineering.md with Alex's decisions. Ready for Step 0 backend scaffolding.

## Outcome
<!-- Filled in only when archiving. -->
