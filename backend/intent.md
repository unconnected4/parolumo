# Backend: intent

Scope: the multi-user JSON API behind every client. It covers auth, dictionary lookup via providers, the user's vocabulary (cards), SRS scheduling and review logging, and later the game endpoints. Product context: [../intent.md](../intent.md). Detailed data model and endpoints: [../docs/plan.md](../docs/plan.md).

## Stack
- Python 3.12+, **FastAPI**, **SQLAlchemy 2** (typed ORM), **Alembic**, **Postgres 16**
- `uv` for dependencies, `ruff` for lint/format, `mypy` for types, `pytest` for tests
- Auth via `fastapi-users` (email + password), so we don't write auth ourselves
- SRS via the `fsrs` package, wrapped in `services/srs.py`

## Decisions
- **Saved cards copy the sense data**, so they stay intact if the dictionary source changes or drops a sense.
- **Every review is logged** (`review_logs`, with `source = 'srs' | 'match_game'`) so the algorithm can change without losing history.
- **Dictionary sources sit behind `DictionaryProvider`.** Implementations: `yandex` (live) and `fake` (recorded fixtures for dev/test/CI).
- **Plain JSON API only.** No server-rendered HTML, so Android can reuse it unchanged. The spec is exported to `docs/api/openapi.json`.
- **Layering:** `api/` (thin routes) → `services/` (logic) → `models/` + `providers/`. Routes never talk to providers directly.

## Open questions
- Auth transport: an httpOnly session cookie for web (safer, and simple behind the dev proxy) plus bearer JWT for Android later, or JWT everywhere? Decide before step 1 auth work.
- Hosting and deploy target: TBD (see [../docs/engineering.md](../docs/engineering.md#delivery)).
- Whether Yandex terms allow caching lookups (`lookup_cache`) or only rate limiting.
