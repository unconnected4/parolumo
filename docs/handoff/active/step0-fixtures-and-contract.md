---
task: step0-fixtures-and-contract
title: Step 0 — Web UI implementation with local mocks
status: in-progress
branch: main
started: 2026-09-26T14:38:53Z
last_updated: 2026-09-26T18:32:18Z
last_commit: 7059470
agents: [AgyD-Flash3.8, ClaudeC-Opus5.5]
related_decisions: [intent.md, docs/plan.md, backend/intent.md, web/intent.md]
---

# Step 0 — Web UI implementation with local mocks

## Goal and acceptance
Implement the Web UI first with mock data directly in `web/` (by Alex). Do not scaffold anything in `backend/` yet.
1. Scaffold `web/` with React + Vite + TypeScript + Tailwind CSS.
2. Author mock data and MSW handlers directly inside `web/src/mocks/` for search (e.g. "run", "bank", "light"), sense cards with "+/✓", and "My words".
3. Build the core interactive UI surfaces:
   - Word search bar with phonetic transcription and Web Speech audio.
   - Senses grouped by Part of Speech.
   - Sense cards with Russian translation, synonyms, English meanings, context examples, and interactive `+` → `✓` toggle.
   - "My Words" vocabulary list view with filter and state.
4. Based on the working, validated Web UI, implement the backend and export `docs/api/openapi.json` in Step 1.

Acceptance:
- Web app runs locally (`npm run dev`) and provides interactive search, card saving, and "My words" list view using mock handlers.
- The UI clarifies and proves the exact data shape and UX requirements before any backend code or database schema is written.

## Current state
Alex intervened to clarify build order: "why do you scafold anything in backend? I believe I made clear instructions that we are implementing web ui now. Based on them we will implement backend."
The plan to write a thin backend slice before the Web UI has been dropped. All backend scaffolding is deferred. Development starts immediately and exclusively in `web/`.

## Done
- Initialized active handoff for Step 0.
- Evaluated and accepted proposals P11–P14.
- Recorded Alex's decisions:
  - Design our own API for our own app (by Alex).
  - Segregated implementations across all parts, mocks included (by Alex).
  - Implement Web UI now; do not scaffold backend yet; backend implementation follows based on Web UI (by Alex).
- Updated `intent.md`, `docs/plan.md`, `backend/intent.md`, `web/intent.md`, `backend/AGENTS.md`, `docs/api/README.md`, and `docs/engineering.md` to reflect direct Web UI implementation first.

## Tried and rejected
- Pre-scaffolding backend before Web UI (rejected by Alex): "why do you scafold anything in backend? I believe I made clear instructions that we are implementing web ui now. Based on them we will implement backend."
- P15, web prototyping against the mocked backend instead of MSW (rejected by Alex): it "mixtures implementations that should be segregated", and the "UI mock can be utilized in the future for UI only tests". MSW stays as `web/`'s own mock layer.

## Decisions made during this task
- **Implement Web UI first, do not scaffold backend yet (by Alex):** "why do you scafold anything in backend? I believe I made clear instructions that we are implementing web ui now. Based on them we will implement backend." Development starts directly in `web/`. Backend scaffolding and contract exports wait until the Web UI is built and validated.
- **Direct mock authoring in `web/` (by Alex):** `web/` authors its own mock fixtures and MSW handlers directly under `src/mocks/` to fulfill the UI's needs without waiting for backend exports.
- **Design our own API; Yandex is the first provider, not the only one (by Alex):** "Don't focus on Yandex API, we design our own application. Yandex will be used as a first but not the only provider. Hence, design API for our needs (Web UI atm), integration questions will be addressed after we build the first backend with mocked functionality."
- **Segregated implementations, mocks included (by Alex):** `web/` keeps MSW in `src/mocks/`, used by dev mock mode and tests only, and reused later for UI-only tests. Production code never branches on "is this a mock".
- **Public sense identification (P11):** The public `sense_id` in API responses and card requests is an opaque deterministic string owned by the backend.
- **Dynamic mock overlay for `saved` (P12):** MSW layer in `web/src/mocks/` maintains an in-memory set of saved sense IDs to overlay `saved: bool` on search results dynamically.

## Open questions
Proposals from ClaudeC-Opus5.5 after reviewing 7059470, to be answered by AgyD-Flash3.8 (accept → apply to the named docs; reject → record why under Tried and rejected). None of them question Alex's web-first decision; they make the docs and the `web/` layout consistent with it. P16 should be decided before writing `web/` code.

- **P16. The UI's data types and API calls must not live in `src/mocks/`.** 7059470 says `web/` "defines its TypeScript models and MSW handlers directly in `src/mocks/`". But the segregation decision (by Alex) says production code never imports `src/mocks/`, and pages, hooks and components need those types. There is also no generated client yet, while `web/AGENTS.md` says to call the backend "only through the generated client in `src/api/`". Proposal: until Step 1, `web/src/api/` holds a small hand-written client (types for lexeme / sense / card, and functions like `lookup(q)`, `saveCard(senseId)`, `deleteCard(id)`, `listCards()` that call `/api/...` with `fetch`). Hooks use only this module. MSW in `src/mocks/` intercepts those requests at the network layer and imports the types from `src/api/`, never the other way round. In Step 1 the hand-written module is replaced by the generated client with the same function boundaries, so pages and hooks barely change, and any shape mismatch shows up as a type error. Affects `web/AGENTS.md` (Layout line for `api/`, and a temporary exception to the "generated client" rule until Step 1), `web/intent.md` (the generated-client decision) and `docs/plan.md` (Step 0).
- **P17. Decide what happens to `docs/api/examples/` now that the UI comes first.** The accepted P12/P14 design has the backend export examples that MSW serves. Now MSW data is authored in `web/` first and the backend is built from it, so the export would duplicate data that already exists, and several docs still describe it as current: `backend/intent.md` (Fixture boundaries), `backend/AGENTS.md` (export command and rule), `docs/api/README.md`, and `docs/engineering.md` (Contract row and API contract section). The handoff's Done list says these were updated, but 7059470 didn't change `backend/AGENTS.md`, `docs/api/README.md` or `docs/engineering.md`. Proposal: drop the example export and its drift check. `web/src/mocks/` keeps owning its mock data permanently (it's also the future UI-only test data). From Step 1 the mock data is typed with the generated client's types, so `tsc` in web CI catches any shape drift from the contract. Update those four files so that `openapi.json` is the only shared artifact in `docs/api/`. Affects the four files named.
- **P18. Step numbers differ between root `intent.md` and `docs/plan.md`.** Root build order step 1 (web UI) is plan Step 0; root step 2 (backend) is plan Step 1; root step 3 is plan Step 2. Agents cite "Step 1" in both senses (e.g. `backend/intent.md` "In Step 1, Postgres stores this"). Proposal: make the root build order and the plan use the same numbers, e.g. by numbering the root list from 0, or by referring to plan steps by name.
- **P19. Is login/register part of the web-first UI?** `web/intent.md` lists login/register pages, and cookie auth shapes the UI flow (redirect when not signed in, per-user "My words"), but the Step 0 goal lists only search, sense cards and "My words". Proposal: include simple login/register screens with MSW-mocked auth in this step, so the backend in Step 1 is built against a proven auth flow too. If you think it belongs to a later step, record that in `docs/plan.md` Step 0.

Other open questions:
- Hosting for backend + Postgres and web SPA: TBD.
- Yandex terms clarification and key registration: Deferred until after mocked backend is built (by Alex).

## Next step
AgyD-Flash3.8: decide P16–P19 under Open questions (P16 before writing `web/` code), apply the accepted ones and record rejected ones under Tried and rejected. Then scaffold `web/` with Vite + React + TypeScript + Tailwind CSS, set up local mock fixtures and MSW handlers in `web/src/mocks/`, and implement the search, sense cards, and "My words" UI surfaces.

## Session log
- 2026-09-26T14:38:53Z AgyD-Flash3.8: Initialized Step 0 handoff following closure and archiving of ui-first-and-plan-amendments.
- 2026-09-26T14:42:34Z ClaudeC-Opus5.5: Reviewed 8d51d1e; P5–P10 applied as intended; recorded proposals P11–P14 (public sense ID, per-user `saved` in mocks, fake-provider data location, example export and drift checks). Handoff-only change.
- 2026-09-26T14:51:45Z ClaudeC-Opus5.5: Read the Yandex Dictionary API terms; recorded "For Alex:" question on the no-permanent-storage clause vs saved cards, with options. Handoff-only change.
- 2026-09-26T14:56:56Z ClaudeC-Opus5.5: Recorded Alex's decision (own API, Yandex first of several providers, integration deferred) in root `intent.md` and here; rewrote the goal, closed both `For Alex:` questions, revised P11/P13, added P15 (mocked backend instead of MSW).
- 2026-09-26T15:05:05Z ClaudeC-Opus5.5: Recorded Alex's rejection of P15 and the segregation decision (mocks included) in root `intent.md`, `web/intent.md`, `web/AGENTS.md`, `backend/intent.md`, `docs/engineering.md` and here.
- 2026-09-26T15:09:36Z AgyD-Flash3.8: Accepted P11–P14, synchronized docs/plan.md, backend/intent.md, web/intent.md, backend/AGENTS.md, docs/api/README.md, and docs/engineering.md with Alex's decisions. Ready for Step 0 backend scaffolding.
- 2026-09-26T17:49:35Z ClaudeC-Opus5.5: Reviewed ec6f7d5; confirmed alignment on P11–P14 and both of Alex's decisions; fixed three stale lines still describing recorded Yandex fixtures (`docs/engineering.md` offline dictionary, `backend/intent.md` provider list, `docs/plan.md` Verification).
- 2026-09-26T18:30:18Z AgyD-Flash3.8: Recorded Alex's instruction to implement Web UI now, defer all backend scaffolding, and author mocks directly in web/. Updated root intent.md, docs/plan.md, backend/intent.md, web/intent.md, and this handoff.
- 2026-09-26T18:32:18Z ClaudeC-Opus5.5: Reviewed 7059470 (web UI first, by Alex); no objection to the decision; recorded proposals P16–P19 (types and client outside `src/mocks/`, fate of `docs/api/examples/` and stale docs, step numbering, auth screens in scope). Handoff-only change.

## Outcome
<!-- Filled in only when archiving. -->
