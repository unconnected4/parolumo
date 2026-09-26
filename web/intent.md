# Web: intent

Scope: the browser client, and the fast prototyping surface for every feature before Android. Product context: [../intent.md](../intent.md). Feature detail: [../docs/plan.md](../docs/plan.md).

## Stack
- **React + Vite + TypeScript** SPA
- Styling: **Tailwind CSS** for rapid responsive styling and easy theming
- Routing: React Router. Server state: TanStack Query (no global store unless a real need appears)
- Typed API client generated from `docs/api/openapi.json` (`openapi-typescript` + `openapi-fetch`)
- Audio pronunciation: Web Speech API (`window.speechSynthesis`) fallback alongside phonetic transcription
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
- **Outside-in UI prototyping:** Start by building the search results, sense cards, and vocabulary views against realistic mock fixtures. This validates the UX and proves the exact data shape required before freezing backend endpoints.

## Open questions
- Hosting: static hosting with `/api` routed to the backend, or served by the backend's host. TBD with backend hosting.
