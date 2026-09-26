# Web: intent

Scope: the browser client, and the fast prototyping surface for every feature before Android. Product context: [../intent.md](../intent.md). Feature detail: [../docs/plan.md](../docs/plan.md).

## Stack
- **React + Vite + TypeScript** SPA
- Routing: React Router. Server state: TanStack Query (no global store unless a real need appears)
- Typed API client generated from `docs/api/openapi.json` (`openapi-typescript` + `openapi-fetch`)
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

## Open questions
- Styling approach (CSS modules vs Tailwind vs a component library): decide when building the first page.
- Hosting: static hosting with `/api` routed to the backend, or served by the backend's host. TBD with backend hosting.
