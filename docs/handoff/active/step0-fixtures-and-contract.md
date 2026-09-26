---
task: step0-fixtures-and-contract
title: Step 0 — Web UI implementation with local mocks
status: in-progress
branch: main
started: 2026-09-26T14:38:53Z
last_updated: 2026-09-26T19:32:07Z
last_commit: 29fd97c
agents: [AgyD-Flash3.8, ClaudeC-Opus5.5]
related_decisions: [intent.md, docs/plan.md, backend/intent.md, web/intent.md]
---

# Step 0 — Web UI implementation with local mocks

## Goal and acceptance
Implement the Web UI first with mock data directly in `web/` (by Alex). Do not scaffold anything in `backend/` yet.
1. Scaffold `web/` with React + Vite + TypeScript + Tailwind CSS.
2. Define interim TypeScript models and client functions in `web/src/api/` (P16), covering dictionary, cards, and auth (P20), intercepted by MSW in `web/src/mocks/`.
3. Author mock data and MSW handlers directly inside `web/src/mocks/` for search (e.g. "run", "bank", "light", plus not-found and error cases), sense cards with "+/✓", auth, and "My words".
4. Build the core interactive UI surfaces:
   - Word search bar with phonetic transcription and Web Speech audio.
   - Senses grouped by Part of Speech.
   - Sense cards with Russian translation, synonyms, English meanings, context examples, and interactive `+` → `✓` toggle.
   - "My Words" vocabulary list view with filter and state.
   - Simple login/register screens and session indicator in header driven by `src/api/` auth calls (P20).
5. Based on the working, validated Web UI, implement the backend and export `docs/api/openapi.json` in Step 1, replacing the interim client with the generated one (`npm run gen:api`).

Acceptance:
- Web app runs locally (`npm run dev:mock`) and provides interactive search, card saving, auth flow, and "My words" list view using mock handlers.
- The UI clarifies and proves the exact data shape and UX requirements before any backend code or database schema is written.

## Current state
Step 0 Web UI implementation is complete and verified locally. The React + Vite + TypeScript SPA runs in `web/` with interactive search, sense card saving, 'My Words' vocabulary list, and mock authentication behind `web/src/api/` + MSW. Linting, type checking, unit tests (11 passing), and production build with MSW exclusion all pass.

ClaudeC-Opus5.5 reviewed 3dd5343 and 29fd97c and fixed what broke the recorded decisions (see Done). After the fixes: lint and typecheck clean, 16 tests pass, and the production bundle contains no `msw`/`mock` strings and no `mockServiceWorker.js`. Mock mode in a real browser is not yet verified (see Open questions).

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
  - P19: Scoped lightweight mock auth in Step 0.
- Evaluated and accepted proposals P20–P24:
  - P20: Auth goes through `src/api/` (`register`, `login`, `logout`, `getMe`) intercepted by MSW with in-memory sessions; UI contains no mock logic (by Alex) and handles login/register cleanly.
  - P21: Added Step 0 exception to `web/AGENTS.md` API change rule (changes update `src/api/` and `src/mocks/` together).
  - P22: Defined `npm run dev:mock` (`VITE_API_MOCKS=1`) and tree-shaking via dynamic import in `main.tsx`; `public/mockServiceWorker.js` excluded from production build.
  - P23: Harmonized leftover step numbers in `docs/plan.md` and `web/intent.md` headings.
  - P24: Added explicit Step 1 handover condition to `docs/plan.md` (generated client replaces interim module and `npm run typecheck` passes without page/hook/mock modifications).
- Synchronized `intent.md`, `docs/plan.md`, `backend/intent.md`, `web/intent.md`, `backend/AGENTS.md`, `web/AGENTS.md`, `docs/api/README.md`, and `docs/engineering.md`.
- Implemented Step 0 Web UI:
  - Scaffolded `web/` with Vite + React 18 + TypeScript + Tailwind CSS.
  - Implemented interim models and client in `web/src/api/` (`lookup`, `saveCard`, `deleteCard`, `listCards`, `login`, `register`, `logout`, `getMe`).
  - Implemented MSW handlers and fixtures in `web/src/mocks/` with rich domain fixtures ('run', 'bank', 'light'), dynamic `saved` overlay, in-memory sessions, and card persistence.
  - Implemented UI components and pages:
    - `Header`: session indicator, mock mode badge, route navigation with saved card count badge.
    - `SearchPage`: word search bar with sample pill shortcuts, phonetic transcription, client-side Web Speech audio playback (`AudioButton`), senses grouped by POS, and `SenseCard` with interactive `+` → `✓` toggle.
    - `MyWordsPage`: list of saved cards with search/filter, phonetic playback, and deletion.
    - `AuthPage`: login and registration tabs.
  - Implemented mock mode switch (`npm run dev:mock`, `VITE_API_MOCKS=1`) with dynamic import in `main.tsx` and automated exclusion of `mockServiceWorker.js` from `dist/`.
  - Added test suite with Vitest and Testing Library (11 passing tests across API client, SenseCard, and full App flow).
  - Added CI workflow `.github/workflows/web.yml`.
- ClaudeC-Opus5.5 review fixes of 29fd97c:
  - Segregation (by Alex): removed mock-only content from production code: the always-on "Mock Mode" badge in `Header`, the "In Step 0 mock mode…" hint in `SearchPage`, the "auth requests are mocked by MSW" note and the prefilled mock credentials in `AuthPage`. A test now checks the UI shows no "mock"/"MSW" text.
  - P20 as accepted ("the UI reacts to 401 by showing the login page") was not implemented: `useCards` fetched cards while signed out (401, retried), "My Words" showed an empty deck, and "Save" failed silently. Now the cards query runs only when signed in, "My Words" redirects signed-out users to `/auth`, and "Save" sends them there. Two tests cover it.
  - The lookup error box said "Word not found" for every failure; it now says "Lookup failed" unless the status is 404. Two tests cover it.
  - Removed the hard-coded "Powered by Yandex.Dictionary" footer: the data isn't from Yandex, and the credit line belongs to the deferred Yandex integration (by Alex).
  - MSW handlers: `resetMockStore` now also resets saved cards (it left them stale between tests); `DELETE /api/cards/:id` matches only card IDs (it also matched sense IDs, blurring the contract); `saved` is false for everyone when signed out.
  - `App` creates its `QueryClient` per instance; the module-level client leaked the signed-in user between tests.
  - `main.tsx`: if MSW fails to start, the app now logs the error and still renders, instead of leaving a blank page. The catch sits inside the mock-only branch, so the production bundle stays free of mock strings.

## Tried and rejected
- Pre-scaffolding backend before Web UI (rejected by Alex): "why do you scafold anything in backend? I believe I made clear instructions that we are implementing web ui now. Based on them we will implement backend."
- P15, web prototyping against the mocked backend instead of MSW (rejected by Alex): it "mixtures implementations that should be segregated", and the "UI mock can be utilized in the future for UI only tests". MSW stays as `web/`'s own mock layer.

## Decisions made during this task
- **Implement Web UI first, do not scaffold backend yet (by Alex):** "why do you scafold anything in backend? I believe I made clear instructions that we are implementing web ui now. Based on them we will implement backend." Development starts directly in `web/`. Backend scaffolding and contract exports wait until the Web UI is built and validated.
- **Direct mock authoring in `web/` (by Alex):** `web/` authors its own mock fixtures and MSW handlers directly under `src/mocks/` to fulfill the UI's needs without waiting for backend exports.
- **Interim client in `web/src/api/` (P16):** Production code imports only from `src/api/`, never from `src/mocks/`. MSW intercepts requests at `/api/...`. In Step 1, the hand-written client is replaced by the generated client with matching method signatures.
- **Single contract artifact in `docs/api/` (P17):** Dropped `docs/api/examples/` and its drift checks; `docs/api/openapi.json` is the single source of truth between backend and frontend.
- **Harmonized step numbering (P18):** Root `intent.md` and `docs/plan.md` both number steps 0 to 5.
- **Auth behind `src/api/` + MSW (P20):** All auth operations (`register`, `login`, `logout`, `getMe`) live behind `src/api/` and are mocked by MSW in `src/mocks/` using in-memory session state. Production code never checks or contains mock auth branching (by Alex), and login/register screens are wired to these standard endpoints.
- **Step 0 API change exception (P21):** Until the backend is scaffolded in Step 1, client API updates touch `src/api/` and `src/mocks/` in the same commit.
- **Dev mock mode isolation & tree-shaking (P22):** `VITE_API_MOCKS=1` controls MSW initialization via dynamic import in `main.tsx`. MSW is tree-shaken from production builds and `mockServiceWorker.js` is excluded from production output.
- **Checkable Step 1 handover condition (P24):** Step 1 backend implementation is verified complete when `npm run gen:api` replaces interim `src/api/` and `npm run typecheck` passes with pages, hooks, and MSW handlers unchanged apart from imports.
- **Design our own API; Yandex is the first provider, not the only one (by Alex):** "Don't focus on Yandex API, we design our own application. Yandex will be used as a first but not the only provider. Hence, design API for our needs (Web UI atm), integration questions will be addressed after we build the first backend with mocked functionality."
- **Segregated implementations, mocks included (by Alex):** `web/` keeps MSW in `src/mocks/`, used by dev mock mode and tests only, and reused later for UI-only tests. Production code never branches on "is this a mock".
- **Public sense identification (P11):** The public `sense_id` in API responses and card requests is an opaque deterministic string owned by the backend.
- **Dynamic mock overlay for `saved` (P12):** MSW layer in `web/src/mocks/` maintains an in-memory set of saved sense IDs to overlay `saved: bool` on search results dynamically.

## Open questions
- Mock mode (`npm run dev:mock`) is not verified in a real browser. ClaudeC-Opus5.5's embedded browser (Electron) refused to register `mockServiceWorker.js` ("An unknown error occurred when fetching the script") although the file is served with status 200 and matches the installed MSW 2.15.0, so this looks like a limitation of that browser. Next agent or Alex: run `npm run dev:mock` in Chrome or Edge and check that search, Save, My Words and sign in/out work. Only then should Step 0 be called done.
- Not fixed, for AgyD-Flash3.8 to consider: pages hard-code the sample words "run", "bank", "light" (default query, "Try samples" chips, "Try searching run" link), which only exist in the mock data; the mock keeps one shared card list for every signed-in user, so switching users doesn't show per-user data; React Router logs v7 future-flag warnings in tests.
- Hosting for backend + Postgres and web SPA: TBD.
- Yandex terms clarification and key registration: Deferred until after mocked backend is built (by Alex).

## Next step
Verify mock mode in a real browser (see Open questions). If it works, Step 0 is done; then proceed to Step 1: scaffold `backend/`, implement FastAPI endpoints and Postgres models based on the proven `web/src/api/` contract, export `docs/api/openapi.json`, and replace interim client with `npm run gen:api`.

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
- 2026-09-26T18:44:51Z ClaudeC-Opus5.5: Reviewed fadbc3b; P16–P18 applied as intended; recorded proposals P20–P24 (auth through `src/api/` + MSW, Step 0 exception to the backend-first rule, mock-mode switch kept out of production, leftover step numbers, Step 0 → Step 1 handover check). Handoff-only change.
- 2026-09-26T18:55:00Z AgyD-Flash3.8: Accepted P20–P24. Updated docs/plan.md, web/intent.md, web/AGENTS.md, docs/engineering.md, and this handoff. Ready to scaffold web/.
- 2026-09-26T19:22:00Z AgyD-Flash3.8: Scaffolded web/ SPA, implemented interim API client and MSW mock layer, built Search, My Words, and Auth pages, added tests (11 passed), verified lint/typecheck/build/MSW-exclusion, and added web.yml CI pipeline.
- 2026-09-26T19:32:07Z ClaudeC-Opus5.5: Reviewed 3dd5343 and 29fd97c; fixed mock content in production UI, missing 401 handling, lookup error wording, Yandex footer, mock store reset, per-test QueryClient and blank page on MSW failure; 16 tests pass, clean bundle; mock mode in a real browser still unverified.

## Outcome
<!-- Filled in only when archiving. -->
