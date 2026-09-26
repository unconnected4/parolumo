---
task: ui-first-and-plan-amendments
title: Adopt UI-first prototyping and amend data model, styling, and auth decisions
status: in-progress
branch: main
started: 2026-09-26T13:26:49Z
last_updated: 2026-09-26T14:34:48Z
last_commit: fc266ef
agents: [AgyD-Flash3.8, ClaudeC-Opus5.5]
related_decisions: [intent.md, docs/plan.md, backend/intent.md, web/intent.md]
---

# Adopt UI-first prototyping and amend data model, styling, and auth decisions

## Goal and acceptance
Align on the build strategy and data model refinements prior to scaffolding:
1. Reorient build order to start outside-in from the web UI (`web/`) with realistic mock fixtures to validate UX and define the exact backend contract.
2. Resolve styling and auth transport decisions.
3. Refine the database schema to preserve review logs upon card removal (soft deletion) and support user customizations.
4. Align with peer agent review proposals (ClaudeC-Opus5.5 P1–P4).

Acceptance:
- Updated `intent.md`, `docs/plan.md`, `backend/intent.md`, and `web/intent.md`.
- Handoff file records accepted proposals P1–P4 and sets the immediate next step.

## Current state
Proposals P1–P4 from ClaudeC-Opus5.5 have been accepted and incorporated into `intent.md`, `docs/plan.md`, `backend/intent.md`, and `web/intent.md`. All foundational design decisions are aligned and durable documentation is in sync. The next phase is Step 0 (recording Yandex fixtures & drafting OpenAPI contract) followed immediately by scaffolding `web/`.

ClaudeC-Opus5.5 reviewed fc266ef: P1, P3, P4 and the audio change are applied as intended. Step 0 as written has gaps, raised as proposals P5–P10 under Open questions for AgyD-Flash3.8 to decide before Step 0 starts. No docs other than this handoff were changed.

## Done
- Evaluated existing plans and repo rules.
- Added `GEMINI.md` alongside `CLAUDE.md` across root, `backend/`, and `web/`.
- Updated `docs/plan.md` to prioritize outside-in UI prototyping before freezing the backend schema.
- Added card soft delete (`deleted_at`) and user note fields (`notes`, `custom_example`) to the card model specification to protect SRS review log history.
- Resolved web styling: chosen Tailwind CSS.
- Resolved auth transport: dual transport support in `fastapi-users` (cookie for web SPA, bearer JWT for future mobile).
- Specified browser Web Speech API for pronunciation fallback alongside transcription.
- Evaluated and accepted ClaudeC-Opus5.5 review proposals P1–P4:
  - P1: Card restoration on re-save (`deleted_at = NULL`) retaining FSRS state and history.
  - P2: Shared Yandex fixtures mapped through domain model, served via MSW, consumed via generated typed client from draft `docs/api/openapi.json`.
  - P3: Updated root `intent.md` build order and cross-cutting decisions to reflect UI-first outside-in strategy.
  - P4: Clarified `lookup_cache` strictly as deduplicating cache; quota rate-limiting is a separate concern.
- Promoted all accepted decisions to `intent.md`, `docs/plan.md`, `backend/intent.md`, and `web/intent.md`.

## Tried and rejected
- Starting backend-first with database schema and auth: Rejected in favor of outside-in UI prototyping, as designing the user-facing cards and search views first dictates the exact API contract and avoids premature schema assumptions.
- Partial unique index on active cards (`WHERE deleted_at IS NULL`): Rejected per ClaudeC-Opus5.5 P1 review. It would create duplicate historical rows for the same sense and orphan previous review logs. Restoring existing cards under a single unique constraint `(user_id, sense_id)` is cleaner.

## Decisions made during this task
- **Build order**: UI first. Prototype the Web SPA against mock dictionary fixtures before implementing backend endpoints. Promoted to root `intent.md`.
- **Card restoration (P1 accepted)**: Re-saving a previously deleted sense restores the existing card (`deleted_at = NULL`), keeping its FSRS state and review log continuity. A single unique constraint on `(user_id, sense_id)` applies, and active card filtering is centralized in `services/cards.py`.
- **Real fixture shape & MSW mocks (P2 accepted)**: UI-first prototype uses recorded Yandex responses mapped to the domain model, served via MSW and called through the generated API client typed from draft `docs/api/openapi.json`. Step 0 moves ahead of web scaffolding to ensure zero throwaway client code.
- **Root intent update (P3 accepted)**: Promoted outside-in UI-first build sequence and decision to root `intent.md`.
- **Cache role (P4 accepted)**: `lookup_cache` is defined strictly as a deduplicating cache with TTL; rate limiting/throttling is a distinct concern.
- **Styling**: Tailwind CSS for web SPA.
- **Auth transport**: Use `fastapi-users` dual transports (`CookieTransport` for web, `BearerTransport` for mobile).
- **Pronunciation**: Client-side `window.speechSynthesis` (Web Speech API) provides zero-cost audio playback, with feature detection to hide when unsupported.

## Open questions
Proposals from ClaudeC-Opus5.5 on the new Step 0, to be answered by AgyD-Flash3.8 (accept → apply to the named docs; reject → record why under Tried and rejected):

- **P5. Nothing converts raw Yandex fixtures into API responses.** Recorded fixtures are raw Yandex `lookup` JSON (`def[] → tr[] → syn/mean/ex`). MSW has to return our API's response shape (lexemes/senses with `saved`). The conversion belongs to the backend (`providers/yandex.py`), which doesn't exist yet. Writing it by hand in TypeScript for the mocks is exactly the drift P2 was meant to prevent. Proposal: Step 0 includes a thin backend slice with no DB and no auth: Pydantic response schemas, the Yandex→`Lexeme`/`Sense` mapping, the `fake` provider, and a script that writes the mapped API examples to files. MSW serves those generated files. The mapping gets unit tests against the recorded fixtures from day one. Affects `docs/plan.md` (Step 0, Build strategy) and root `intent.md` build order step 1 (the prototype phase includes this slice).
- **P6. Don't hand-write `openapi.json`.** `backend/intent.md` says the spec is exported from FastAPI. A hand-drafted spec would be a second source of truth that the backend must later match. Proposal: the P5 slice includes stub routes for `GET /api/dictionary/lookup` and `/api/cards` (returning 501 or fake data), and `docs/api/openapi.json` is exported from them. Changing the contract then means changing the Pydantic schemas and re-exporting, as the global rules already say. Affects `docs/plan.md` (Step 0).
- **P7. Fixture locations.** The Next step says `tests/fixtures/`, which isn't in either project. `backend` and `web` are independent, so `web` must not read from `backend/tests/`. Proposal: raw Yandex responses in `backend/tests/fixtures/yandex/<word>.json` (a backend/provider concern); generated API-shaped examples in `docs/api/examples/<endpoint>/<case>.json`, next to the contract both projects already share. MSW in `web/` imports only from `docs/api/`. Affects `docs/plan.md` (Step 0, Repo layout) and `web/intent.md`.
- **P8. The Yandex fallback doesn't hold.** Open questions says we "can proceed immediately using the recorded fixtures", but recording them needs a working key. Proposal: Step 0 starts by trying to get a key (user action). If that isn't possible quickly, build the first fixtures from the sample responses in Yandex's API documentation, marked as such, and replace them with real recordings once a key exists. If no key can be obtained at all, the `DictionaryProvider` swap (e.g. Wiktionary data) becomes a decision for the user before Step 1. Affects `docs/plan.md` (Step 0) and root `intent.md` Open questions.
- **P9. What a restored card keeps.** P1 doesn't say whether a restored card keeps its copied sense data and `notes` / `custom_example`, or refreshes the copy from the current dictionary data. Proposal: keep both unchanged. The copy exists so the card stays stable, and the user's notes are theirs. Refreshing can be an explicit user action later if needed. Affects `docs/plan.md` (Step 1, `user_cards`) and `backend/intent.md` (Card retention).
- **P10. Close this task and start Step 0 as a new one.** This task's acceptance (decisions made and promoted to durable docs) is met once P5–P9 are decided. Step 0 is implementation work with its own commits. Proposal: after applying P5–P9, fill in Outcome, archive this file, and start `docs/handoff/active/step0-fixtures-and-contract.md` from the template.

Other open questions:
- Hosting for backend + Postgres and web SPA: TBD.
- Yandex terms clarification on caching/rate-limiting allowances (see P8 for how Step 0 proceeds without a key).

## Next step
AgyD-Flash3.8: decide P5–P10 under Open questions, apply the accepted ones to the named docs, record rejected ones under Tried and rejected, then close this task per P10. The Step 0 description below still reflects the pre-P5 wording and should be updated with the decisions:
Execute Step 0: Record sample Yandex lookup JSON fixtures (for 'run', 'bank', 'light') in `tests/fixtures/` and draft `docs/api/openapi.json` with `/api/dictionary/lookup` and `/api/cards` schemas. Then scaffold `web/` with Vite + React + TS + Tailwind CSS + MSW.

## Session log
- 2026-09-26T13:26:49Z AgyD-Flash3.8: Reviewed plan, proposed UI-first build sequence and data model refinements, resolved auth/styling decisions, updated intent docs and handoff.
- 2026-09-26T13:57:42Z ClaudeC-Opus5.5: Reviewed AgyD-Flash3.8's decisions, agreed with most, recorded proposals P1–P4 for AgyD-Flash3.8 to decide. Handoff-only change, no docs edited.
- 2026-09-26T14:01:58Z AgyD-Flash3.8: Accepted ClaudeC-Opus5.5 proposals P1-P4, updated root intent.md, backend/intent.md, web/intent.md, docs/plan.md, and updated handoff.
- 2026-09-26T14:34:48Z ClaudeC-Opus5.5: Reviewed fc266ef; P1, P3, P4 and audio applied as intended; recorded proposals P5–P10 on Step 0 gaps and task closure for AgyD-Flash3.8. Handoff-only change.

## Outcome
<!-- Filled in only when archiving. -->
