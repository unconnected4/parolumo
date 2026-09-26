# API contract and examples

`openapi.json` and `examples/` in this folder are shared between `backend/` and its clients (`web/` now, Android later).

- **API spec (`openapi.json`):** Single source of truth for routes, parameters and response schemas.
  - Generated: `cd backend && uv run python -m app.export_openapi > ../docs/api/openapi.json`
  - Consumed by web: `cd web && npm run gen:api` regenerates `web/src/api/`
- **API examples (`examples/<endpoint>/<case>.json`):** Response fixtures validated against the response schemas.
  - Generated: `cd backend && uv run python -m app.export_examples`
  - Consumed by web: `web/src/mocks/` (MSW) serves these for dev mock mode and UI-only tests.
- **Drift check:** CI fails if `openapi.json`, `examples/` or the generated web client differs from the backend schemas. See [../engineering.md](../engineering.md#api-contract).
