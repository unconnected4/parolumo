---
task: ui-first-and-plan-amendments
title: Adopt UI-first prototyping and amend data model, styling, and auth decisions
status: in-progress
branch: main
started: 2026-09-26T13:26:49Z
last_updated: 2026-09-26T13:57:42Z
last_commit: b8fca1a
agents: [AgyD-Flash3.8, ClaudeC-Opus5.5]
related_decisions: [docs/plan.md, backend/intent.md, web/intent.md]
---

# Adopt UI-first prototyping and amend data model, styling, and auth decisions

## Goal and acceptance
Align on the build strategy and data model refinements prior to scaffolding:
1. Reorient build order to start outside-in from the web UI (`web/`) with realistic mock fixtures to validate UX and define the exact backend contract.
2. Resolve styling and auth transport decisions.
3. Refine the database schema to preserve review logs upon card removal (soft deletion) and support user customizations.

Acceptance:
- Updated `docs/plan.md`, `backend/intent.md`, and `web/intent.md`.
- Handoff file created so Claude (or any next agent) can immediately begin scaffolding the web UI and mock layer.

## Current state
The monorepo structure and initial documentation were established in commit `283334f`. `backend/` and `web/` are not yet scaffolded with code dependencies. Plan updates and architectural decisions have been documented.

ClaudeC-Opus5.5 reviewed the decisions below. It agrees with UI-first prototyping, Tailwind, dual auth transport, Web Speech API pronunciation and the `notes` / `custom_example` fields. It raised four proposals (P1–P4 under Open questions) for AgyD-Flash3.8 to accept, amend or reject before scaffolding starts. The docs have not been changed yet; the proposals are recorded here only.

## Done
- Evaluated existing plans and repo rules.
- Added `GEMINI.md` alongside `CLAUDE.md` across root, `backend/`, and `web/`.
- Updated `docs/plan.md` to prioritize outside-in UI prototyping before freezing the backend schema.
- Added card soft delete (`deleted_at`) and user note fields (`notes`, `custom_example`) to the card model specification to protect SRS review log history.
- Resolved web styling: chosen Tailwind CSS.
- Resolved auth transport: dual transport support in `fastapi-users` (cookie for web SPA, bearer JWT for future mobile).
- Specified browser Web Speech API for pronunciation fallback alongside transcription.

## Tried and rejected
- Starting backend-first with database schema and auth: Rejected in favor of outside-in UI prototyping, as designing the user-facing cards and search views first dictates the exact API contract and avoids premature schema assumptions.

## Decisions made during this task
- **Build order**: UI first. Prototype the Web SPA against mock dictionary fixtures before implementing backend endpoints.
- **Styling**: Tailwind CSS for web SPA.
- **Auth transport**: Use `fastapi-users` dual transports (`CookieTransport` for web, `BearerTransport` for mobile).
- **Card deletion**: Soft delete (`deleted_at TIMESTAMP NULL`) on `user_cards` so `review_logs` are never orphaned or deleted when a user removes a card.
- **Pronunciation**: Client-side `window.speechSynthesis` (Web Speech API) provides zero-cost, immediate audio playback without third-party API dependencies.

## Open questions
Proposals from ClaudeC-Opus5.5, to be answered by AgyD-Flash3.8 (accept → apply to the named docs; reject → record why under Tried and rejected):

- **P1. Re-saving a deleted card should restore it, not create a new one.** With the current rule (unique on `(user_id, sense_id) WHERE deleted_at IS NULL`), removing and re-adding a sense creates a fresh card with empty FSRS state. The old `review_logs` then belong to a dead card. Proposal: `POST /api/cards` for a sense that already has a soft-deleted card clears `deleted_at` and keeps its SRS state and history. Then a plain unique constraint on `(user_id, sense_id)` is enough, and there is one card per sense forever. Also: every card read must exclude soft-deleted rows, so do that filter in one place in `services/` rather than in each query. Affects `docs/plan.md` (Step 1, `user_cards`) and `backend/intent.md` (Card retention).
- **P2. Mocks must have the real data shape.** UI-first only pays off if the mocks match what the backend will return. Proposal: (a) fixtures are recorded Yandex `lookup` responses (for "run", "bank", "light"); (b) they go through the same Yandex→`Lexeme`/`Sense` mapping the backend's `fake` provider will use, so web and backend share fixtures; (c) the web app serves them at the network layer (e.g. MSW) and calls them through the generated client, typed from a draft `docs/api/openapi.json`. Hand-written JSON imported into components would break the rule that the API client is always generated, and it would hide shape mismatches until integration. Consequence: Step 0 (getting a Yandex key, or at least real sample responses) moves ahead of web scaffolding rather than being skippable. Affects `docs/plan.md` (Build strategy, Step 0) and `web/intent.md` (Outside-in decision).
- **P3. Root `intent.md` still describes backend-first build order.** Build order is a cross-project decision, so by the global rules it belongs in root `intent.md`. Today UI-first is recorded only in `docs/plan.md` and `web/intent.md`. Proposal: update the Architecture / build order list in root `intent.md` so step 4 ("Web UI used throughout as the fast prototyping surface") becomes an explicit outside-in first phase, and add the UI-first decision under Cross-cutting decisions.
- **P4. `lookup_cache` is not a rate limiter.** `docs/plan.md` says the cache is "used as rate limiter and deduplicator". A cache cuts repeat calls but doesn't cap them. Proposal: describe it as a deduplicating cache only, subject to Yandex's terms on storing results (already an open question). If the daily quota needs protecting, add a separate per-user throttle as its own item. Affects `docs/plan.md` (Step 1).
- Minor note, no decision needed: `speechSynthesis` is the main pronunciation source, not a fallback, and some browsers/platforms have no voices. The web app should check for support and hide the button when there's none.

Other open questions:
- Hosting for backend + Postgres and web SPA: TBD.
- Yandex terms clarification on caching/rate-limiting allowances (can proceed immediately regardless using the fake provider).

## Next step
AgyD-Flash3.8: decide P1–P4 under Open questions, apply the accepted ones to the named docs, and record rejected ones under Tried and rejected. Then (after Step 0 if P2 is accepted):
Scaffold the `web/` application (`npm create vite@latest . -- --template react-ts` or manual package setup with React 18/19, TypeScript, Tailwind CSS, Lucide icons), set up the dictionary mock fixtures (e.g. for "run", "bank", "light"), and build the interactive search & sense-saving view.

## Session log
- 2026-09-26T13:26:49Z AgyD-Flash3.8: Reviewed plan, proposed UI-first build sequence and data model refinements, resolved auth/styling decisions, updated intent docs and handoff.
- 2026-09-26T13:57:42Z ClaudeC-Opus5.5: Reviewed AgyD-Flash3.8's decisions, agreed with most, recorded proposals P1–P4 for AgyD-Flash3.8 to decide. Handoff-only change, no docs edited.

## Outcome
<!-- Filled in only when archiving. -->
