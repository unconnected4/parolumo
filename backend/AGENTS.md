# Backend: agent instructions

FastAPI JSON API. Intent and decisions: [intent.md](intent.md). Shared conventions: [../docs/engineering.md](../docs/engineering.md).

## Commands (run from `backend/`)
- Install: `uv sync`
- Run API: `uv run uvicorn app.main:app --reload` → http://localhost:8000 (docs at `/docs`)
- Unit tests: `uv run pytest -m "not integration"`
- All tests (needs `docker compose up -d` at repo root): `uv run pytest`
- Lint / format / types: `uv run ruff check . && uv run ruff format --check . && uv run mypy app`
- Migrate: `uv run alembic upgrade head`
- New migration: `uv run alembic revision --autogenerate -m "<what changed>"`, then review the generated file
- Export API spec: `uv run python -m app.export_openapi > ../docs/api/openapi.json`

## Layout
```
app/
  main.py        app factory, middleware (request ID, logging)
  config.py      Settings (pydantic-settings), the only place env vars are read
  api/           routers, thin: validate, call a service, return a schema
  services/      business logic (cards, srs, lookup)
  models/        SQLAlchemy models
  schemas/       Pydantic request/response models
  providers/     DictionaryProvider + yandex.py + fake.py
alembic/
tests/
  unit/
  integration/   marked @pytest.mark.integration, real Postgres
  fixtures/      recorded Yandex JSON (also used by the fake provider)
```

## Rules
- Every model change ships with an Alembic migration in the same commit. Migrations must be backward-compatible with the previous release.
- Any change to routes or schemas means re-exporting `docs/api/openapi.json` in the same commit.
- New config goes into `Settings` and `.env.example` together. Never add secrets to code or fixtures.
- Tests use `DICTIONARY_PROVIDER=fake` and never call Yandex.
- Every endpoint that touches user data has a per-user isolation test.
