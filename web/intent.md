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
- **Outside-in UI prototyping with MSW:** UI prototyping uses mapped API response examples from `docs/api/examples/` (generated during Step 0), served via MSW (Mock Service Worker) at the network layer and called via the generated client (typed from `docs/api/openapi.json`). This ensures the UI exercises the exact production data shape from day one while keeping `web/` completely decoupled from backend internals.

## Open questions
- Hosting: static hosting with `/api` routed to the backend, or served by the backend's host. TBD with backend hosting.
