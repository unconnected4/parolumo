# Web: agent instructions

React + Vite + TypeScript SPA. Intent and decisions: [intent.md](intent.md). Shared conventions: [../docs/engineering.md](../docs/engineering.md).

## Commands (run from `web/`)
- Install: `npm ci`
- Dev server (mock mode, default for Step 0): `npm run dev:mock` (or `npm run dev` with `VITE_API_MOCKS=1`) → http://localhost:5173, intercepted by MSW
- Dev server (backend mode, from Step 1): `npm run dev` → http://localhost:5173, proxies `/api` to `API_PROXY_TARGET` (default http://localhost:8000)
- Unit tests: `npm test`
- Lint / types: `npm run lint && npm run typecheck`
- Regenerate API client after the spec changes: `npm run gen:api`
- Production build: `npm run build` (output in `dist/`, MSW tree-shaken and excluded)

## Layout
```
src/
  api/         client and types (interim hand-written in Step 0, generated from Step 1)
  pages/       route-level components
  components/  reusable UI
  hooks/       TanStack Query hooks wrapping the API client
  mocks/       MSW handlers and mock data. Dev mock mode and tests only
```

## Rules
- Call the backend only through `src/api/`. In Step 0, `src/api/` contains an interim typed client and models intercepted by MSW; in Step 1, it is replaced by the generated client (`npm run gen:api`).
- Keep mocks segregated (by Alex): only the dev mock-mode entry point and test setup import `src/mocks/`. Production code never imports it or checks whether it is mocked. `main.tsx` dynamically imports `src/mocks/browser` only when `VITE_API_MOCKS=1`, tree-shaking MSW out of production builds and excluding `mockServiceWorker.js` from production output.
- Only `VITE_`-prefixed env vars reach the browser, and they must never contain secrets.
- If a feature needs an API change, change the backend and spec first, then run `gen:api`. Never work around a missing endpoint on the client. **Step 0 exception:** until the backend is scaffolded in Step 1, an API change updates the interim types and client in `src/api/` and the MSW handlers in `src/mocks/` in the same commit.
