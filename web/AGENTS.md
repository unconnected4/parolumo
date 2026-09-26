# Web: agent instructions

React + Vite + TypeScript SPA. Intent and decisions: [intent.md](intent.md). Shared conventions: [../docs/engineering.md](../docs/engineering.md).

## Commands (run from `web/`)
- Install: `npm ci`
- Dev server: `npm run dev` → http://localhost:5173, proxies `/api` to `API_PROXY_TARGET` (default http://localhost:8000)
- Unit tests: `npm test`
- Lint / types: `npm run lint && npm run typecheck`
- Regenerate API client after the spec changes: `npm run gen:api`
- Production build: `npm run build` (output in `dist/`)

## Layout
```
src/
  api/         generated client. Do not edit by hand
  pages/       route-level components
  components/  reusable UI
  hooks/       TanStack Query hooks wrapping the API client
  mocks/       MSW handlers and mock data. Dev mock mode and tests only
```

## Rules
- Call the backend only through the generated client in `src/api/`.
- Keep mocks segregated (by Alex): only the dev mock-mode entry point and test setup import `src/mocks/`. Production code never imports it or checks whether it is mocked.
- Only `VITE_`-prefixed env vars reach the browser, and they must never contain secrets.
- If a feature needs an API change, change the backend and spec first, then run `gen:api`. Never work around a missing endpoint on the client.
