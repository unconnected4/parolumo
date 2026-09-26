---
task: step0-fixtures-and-contract
title: Step 0 — Web UI implementation with local mocks
status: in-progress
branch: main
started: 2026-09-26T14:38:53Z
last_updated: 2026-09-26T18:40:30Z
last_commit: 084876f
agents: [AgyD-Flash3.8, ClaudeC-Opus5.5]
related_decisions: [intent.md, docs/plan.md, backend/intent.md, web/intent.md]
---

# Step 0 — Web UI implementation with local mocks

## Goal and acceptance
Implement the Web UI first with mock data directly in `web/` (by Alex). Do not scaffold anything in `backend/` yet.
1. Scaffold `web/` with React + Vite + TypeScript + Tailwind CSS.
2. Define interim TypeScript models and client functions in `web/src/api/` (P16), intercepted by MSW in `web/src/mocks/`.
3. Author mock data and MSW handlers directly inside `web/src/mocks/` for search (e.g. "run", "bank", "light", plus not-found and error cases), sense cards with "+/✓", and "My words".
4. Build the core interactive UI surfaces:
   - Word search bar with phonetic transcription and Web Speech audio.
   - Senses grouped by Part of Speech.
   - Sense cards with Russian translation, synonyms, English meanings, context examples, and interactive `+` → `✓` toggle.
   - "My Words" vocabulary list view with filter and state.
   - Lightweight mock auth session indicator in header (P19).
5. Based on the working, validated Web UI, implement the backend and export `docs/api/openapi.json` in Step 1, replacing the interim client with the generated one (`npm run gen:api`).

Acceptance:
- Web app runs locally (`npm run dev`) and provides interactive search, card saving, and "My words" list view using mock handlers.
- The UI clarifies and proves the exact data shape and UX requirements before any backend code or database schema is written.

## Current state
Alex intervened to clarify build order: "why do you scafold anything in backend? I believe I made clear instructions that we are implementing web ui now. Based on them we will implement backend."
All backend scaffolding is deferred. Development starts immediately and exclusively in `web/`. Proposals P16–P19 from ClaudeC-Opus5.5 have been accepted and applied across all instruction and specification files.

## Done
- Initialized active handoff for Step 0.
- Evaluated and accepted proposals P11–P14.
- Recorded Alex's decisions:
  - Design our own API for our own app (by Alex).
  - Segregated implementations across all parts, mocks included (by Alex).
  - Implement Web UI now; do not scaffold backend yet; backend implementation follows based on Web UI (by Alex).
- Evaluated and accepted proposals P16–P19:
  - P16: `web/src/api/` holds interim TypeScript models and client functions; MSW intercepts them; production code never imports `src/mocks/`.
  - P17: Dropped `docs/api/examples/` and its drift check; `openapi.json` is the sole contract artifact in `docs/api/`. Cleaned up `backend/AGENTS.md`, `backend/intent.md`, `docs/api/README.md`, and `docs/engineering.md`.
  - P18: Harmonized step numbering 0–5 across root `intent.md` and `docs/plan.md`.
  - P19: Scoped lightweight mock auth session indicator in UI header for Step 0.
- Synchronized `intent.md`, `docs/plan.md`, `backend/intent.md`, `web/intent.md`, `backend/AGENTS.md`, `web/AGENTS.md`, `docs/api/README.md`, and `docs/engineering.md`.

## Tried and rejected
- Pre-scaffolding backend before Web UI (rejected by Alex): "why do you scafold anything in backend? I believe I made clear instructions that we are implementing web ui now. Based on them we will implement backend."
- P15, web prototyping against the mocked backend instead of MSW (rejected by Alex): it "mixtures implementations that should be segregated", and the "UI mock can be utilized in the future for UI only tests". MSW stays as `web/`'s own mock layer.

## Decisions made during this task
- **Implement Web UI first, do not scaffold backend yet (by Alex):** "why do you scafold anything in backend? I believe I made clear instructions that we are implementing web ui now. Based on them we will implement backend." Development starts directly in `web/`. Backend scaffolding and contract exports wait until the Web UI is built and validated.
- **Direct mock authoring in `web/` (by Alex):** `web/` authors its own mock fixtures and MSW handlers directly under `src/mocks/` to fulfill the UI's needs without waiting for backend exports.
- **Interim client in `web/src/api/` (P16):** Production code imports only from `src/api/`, never from `src/mocks/`. MSW intercepts requests at `/api/...`. In Step 1, the hand-written client is replaced by the generated client with matching method signatures.
- **Single contract artifact in `docs/api/` (P17):** Dropped `docs/api/examples/` and its drift checks; `docs/api/openapi.json` is the single source of truth between backend and frontend.
- **Harmonized step numbering (P18):** Root `intent.md` and `docs/plan.md` both number steps 0 to 5.
- **Lightweight mock auth in Step 0 (P19):** UI includes a header session indicator / mock user toggle without blocking the core dictionary/cards flow.
- **Design our own API; Yandex is the first provider, not the only one (by Alex):** "Don't focus on Yandex API, we design our own application. Yandex will be used as a first but not the only provider. Hence, design API for our needs (Web UI atm), integration questions will be addressed after we build the first backend with mocked functionality."
- **Segregated implementations, mocks included (by Alex):** `web/` keeps MSW in `src/mocks/`, used by dev mock mode and tests only, and reused later for UI-only tests. Production code never branches on "is this a mock".
- **Public sense identification (P11):** The public `sense_id` in API responses and card requests is an opaque deterministic string owned by the backend.
- **Dynamic mock overlay for `saved` (P12):** MSW layer in `web/src/mocks/` maintains an in-memory set of saved sense IDs to overlay `saved: bool` on search results dynamically.

## Open questions
None blocking Step 0 Web UI implementation.
- Hosting for backend + Postgres and web SPA: TBD.
- Yandex terms clarification and key registration: Deferred until after mocked backend is built (by Alex).

## Next step
Scaffold `web/` with Vite + React + TypeScript + Tailwind CSS, establish interim types and client in `web/src/api/`, set up MSW handlers in `web/src/mocks/`, and implement search, sense cards, and "My words" UI surfaces.

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
- 2026-09-26T18:40:30Z AgyD-Flash3.8: Accepted P16–P19. Updated web/AGENTS.md, web/intent.md, docs/plan.md, root intent.md, backend/intent.md, backend/AGENTS.md, docs/api/README.md, and docs/engineering.md.

## Outcome
<!-- Filled in only when archiving. -->
