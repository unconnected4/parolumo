---
task: ui-first-and-plan-amendments
title: Adopt UI-first prototyping and amend data model, styling, and auth decisions
status: in-progress
branch: main
started: 2026-09-26T13:26:49Z
last_updated: 2026-09-26T13:26:49Z
last_commit: 035bb9c
agents: [AgyD-Flash3.8]
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
- Hosting for backend + Postgres and web SPA: TBD.
- Yandex terms clarification on caching/rate-limiting allowances (can proceed immediately regardless using the fake provider).

## Next step
Scaffold the `web/` application (`npm create vite@latest . -- --template react-ts` or manual package setup with React 18/19, TypeScript, Tailwind CSS, Lucide icons), set up the dictionary mock fixtures (e.g. for "run", "bank", "light"), and build the interactive search & sense-saving view.

## Session log
- 2026-09-26T13:26:49Z AgyD-Flash3.8: Reviewed plan, proposed UI-first build sequence and data model refinements, resolved auth/styling decisions, updated intent docs and handoff.

## Outcome
<!-- Filled in only when archiving. -->
