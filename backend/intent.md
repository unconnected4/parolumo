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
- **Plain JSON API only.** No server-rendered HTML, so Android can reuse it unchanged. The spec is exported from the FastAPI application (`app.export_openapi`) to `docs/api/openapi.json`; it is never hand-edited.
- **Layering:** `api/` (thin routes) → `services/` (logic) → `models/` + `providers/`. Routes never talk to providers directly.
- **Segregated implementations (by Alex):** see root [intent.md](../intent.md). Every fake or mocked part of the backend (the `fake` dictionary provider, and any in-memory stand-in used before Postgres exists) is its own implementation of an interface, in its own module, and is selected by `Settings` or test setup. Services and routes never branch on whether they run against a fake. Replacing a fake with the real implementation must not change the code that uses it.
- **Auth transport:** `fastapi-users` supports dual transports simultaneously. Use `CookieTransport` (httpOnly, SameSite=lax) for the Web SPA (safe behind Vite proxy, no JS token storage), and keep `BearerTransport` enabled for future mobile/Android clients.
- **Card retention:** `user_cards` uses soft deletion (`deleted_at TIMESTAMP NULL`). Re-saving a deleted card restores it (`deleted_at = NULL`), keeping its copied sense data, notes, custom examples, and FSRS state intact. A single unique constraint on `(user_id, sense_id)` applies. Active card filtering (`deleted_at IS NULL`) is centralized in `services/cards.py`.
- **Public sense identification:** The API's `sense_id` is an opaque deterministic string owned by the backend (e.g. a hash of provider + lemma + pos + main translation). Clients never parse it. Any provider, including `fake`, computes it statelessly without a database, ensuring deterministic IDs across resets. In Step 1, Postgres stores this as `senses.source_key` and `user_cards` resolves it.
- **Fixture boundaries & fake data:** Fake provider data is hand-authored in our own domain shape and lives under the app at `app/providers/fake_data/<word>.json`, because the fake provider is runtime code (used in local development and Docker builds). Generated API response examples are exported via `uv run python -m app.export_examples` to `../docs/api/examples/<endpoint>/<case>.json` so web MSW mocks stay completely independent of backend internals. Raw provider responses for Yandex belong to the later integration step.

## Open questions
- Hosting and deploy target: TBD (see [../docs/engineering.md](../docs/engineering.md#delivery)).
- Whether Yandex terms allow caching lookups (`lookup_cache`) and what retention period is permitted.
