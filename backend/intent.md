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
- **Auth transport:** `fastapi-users` supports dual transports simultaneously. Use `CookieTransport` (httpOnly, SameSite=lax) for the Web SPA (safe behind Vite proxy, no JS token storage), and keep `BearerTransport` enabled for future mobile/Android clients.
- **Card retention:** `user_cards` uses soft deletion (`deleted_at TIMESTAMP NULL`) so user card removal never deletes `review_logs`, preserving SRS training history.

## Open questions
- Hosting and deploy target: TBD (see [../docs/engineering.md](../docs/engineering.md#delivery)).
- Whether Yandex terms allow caching lookups (`lookup_cache`) or only rate limiting.
