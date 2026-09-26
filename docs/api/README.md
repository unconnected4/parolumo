# API contract

`openapi.json` in this folder is the single source of truth for the API between `backend/` and its clients (`web/` now, Android later).

- **Generated, not hand-written:** `cd backend && uv run python -m app.export_openapi > ../docs/api/openapi.json`
- **Consumed by web:** `cd web && npm run gen:api` regenerates `web/src/api/`
- CI fails if either generated file is out of date. See [../engineering.md](../engineering.md#api-contract).

The file appears once the backend is scaffolded.
