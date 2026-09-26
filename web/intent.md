# Web: intent

Scope: the browser client, and the fast prototyping surface for every feature before Android. Product context: [../intent.md](../intent.md). Feature detail: [../docs/plan.md](../docs/plan.md).

## Stack
- **React + Vite + TypeScript** SPA
- Styling: **Tailwind CSS** for rapid responsive styling and easy theming
- Routing: React Router. Server state: TanStack Query (no global store unless a real need appears)
- Typed API client generated from `docs/api/openapi.json` (`openapi-typescript` + `openapi-fetch`)
- Audio pronunciation: Web Speech API (`window.speechSynthesis`) is the primary audio source, with feature detection (`'speechSynthesis' in window` and voice check) to gracefully hide the button when unsupported
- Tests: Vitest + Testing Library for components. Full-flow tests live in `../e2e`

## Pages (steps 1–2)
- Login / register
- Search: results grouped by part of speech, one card per sense (Russian translation, synonyms, English meanings, examples), with a "+" button that turns into ✓ once saved
- My words: the user's vocabulary list
- Yandex credit line, if the terms require it

Step 3 adds the Match game page.

## Decisions
- The web app holds **no secrets** and talks only to `/api` on the same origin (the Vite proxy locally, and the same arrangement in production).
- The API client is always generated. Hand-written fetch calls to the backend are not allowed.
- **Outside-in UI prototyping with MSW:** UI prototyping uses static response examples from `docs/api/examples/` (exported by Step 0), served via MSW (Mock Service Worker) in `src/mocks/` and called through the generated client (typed from `docs/api/openapi.json`). Because `saved: bool` is per-user, static examples export `saved: false`; MSW handlers maintain an in-memory set of saved sense IDs to overlay `saved: true/false` on search responses dynamically and support mock `POST`/`DELETE /api/cards`.
- **The MSW mock layer is a separate, permanent part of `web/` (by Alex):** it is not replaced by running against the backend's mocked functionality, because that "mixtures implementations that should be segregated", and because the "UI mock can be utilized in the future for UI only tests". It lives in its own folder (`src/mocks/`), is switched on only by the dev mock mode or test setup, and is never imported by production code. Pages, components and hooks don't know whether they talk to MSW or a real backend. The same handlers are reused later for UI-only tests (see [../docs/engineering.md](../docs/engineering.md#testing-tiers)).

## Open questions
- Hosting: static hosting with `/api` routed to the backend, or served by the backend's host. TBD with backend hosting.
