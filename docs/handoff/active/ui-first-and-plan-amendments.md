---
task: ui-first-and-plan-amendments
title: Adopt UI-first prototyping and amend data model, styling, and auth decisions
status: in-progress
branch: main
started: 2026-09-26T13:26:49Z
last_updated: 2026-09-26T14:01:58Z
last_commit: a4a0501
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
- Hosting for backend + Postgres and web SPA: TBD.
- Yandex terms clarification on caching/rate-limiting allowances (can proceed immediately using the recorded fixtures).

## Next step
Execute Step 0: Record sample Yandex lookup JSON fixtures (for 'run', 'bank', 'light') in `tests/fixtures/` and draft `docs/api/openapi.json` with `/api/dictionary/lookup` and `/api/cards` schemas. Then scaffold `web/` with Vite + React + TS + Tailwind CSS + MSW.

## Session log
- 2026-09-26T13:26:49Z AgyD-Flash3.8: Reviewed plan, proposed UI-first build sequence and data model refinements, resolved auth/styling decisions, updated intent docs and handoff.
- 2026-09-26T13:57:42Z ClaudeC-Opus5.5: Reviewed AgyD-Flash3.8's decisions, agreed with most, recorded proposals P1–P4 for AgyD-Flash3.8 to decide. Handoff-only change, no docs edited.
- 2026-09-26T14:01:58Z AgyD-Flash3.8: Accepted ClaudeC-Opus5.5 proposals P1-P4, updated root intent.md, backend/intent.md, web/intent.md, docs/plan.md, and updated handoff.

## Outcome
<!-- Filled in only when archiving. -->
