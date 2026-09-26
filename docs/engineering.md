# Engineering conventions

Shared across `backend/`, `web/` and `e2e/`. Project-specific commands live in each project's AGENTS.md.

## Local development
- **Only infrastructure runs in Docker.** `docker compose up -d` starts Postgres (it also creates the `paralumo_test` database for integration tests). The API and the web app run natively so debuggers, hot reload and breakpoints work normally.
- **Backend** on `http://localhost:8000` (`uv run uvicorn app.main:app --reload`).
- **Web** on `http://localhost:5173` (`npm run dev`). The Vite dev server proxies `/api/*` to the backend, so the browser sees one origin. That means no CORS setup and auth cookies work as they would in production.
- **Offline dictionary.** `DICTIONARY_PROVIDER=fake` makes the backend serve hand-authored data in our own domain shape from `backend/app/providers/fake_data/`. This is the default for local work, tests and CI, so development never depends on the network or burns the daily quota. Switch to `yandex` only when you need live data.
- **Debugging.** `.vscode/launch.json` (added with the backend scaffolding) has *Backend: API*, *Backend: pytest current file* and *Web: Chrome* configs, plus a compound *Full stack* config that runs both at once. Start `npm run dev` first, because the Chrome config attaches to the running dev server. The backend configs load `backend/.env` and use the Windows venv path (`.venv/Scripts/python.exe`).

## Configuration and secrets
- **All configuration comes from environment variables.** The backend reads them through one pydantic-settings `Settings` class (`backend/app/config.py`). Nothing reads `os.environ` directly.
- **Fail fast.** Required settings have no defaults. The app refuses to start if one is missing, and never falls back to a dev secret.
- **Files:** `backend/.env.example` and `web/.env.example` are committed and list every variable. The real `.env` files are git-ignored.
- **Web bundle is public.** Only `VITE_`-prefixed variables reach the browser, and they must never hold secrets. The web app needs no secrets at all.
- **Where secrets live:**
  - local: `backend/.env`
  - CI: GitHub Actions secrets. CI uses the fake dictionary provider, so no Yandex key is needed
  - production: the hosting platform's secret store (**TBD** with hosting)
- **Secrets inventory:** `AUTH_SECRET` (signs sessions/JWTs), `DATABASE_URL`, `YANDEX_DICT_API_KEY`.
- **Rotation:** `AUTH_SECRET` rotation invalidates sessions. Design for accepting a list of secrets (current + previous) before first production users.

## Testing tiers
| Tier | Where | Needs | Runs in |
|---|---|---|---|
| Unit | `backend/tests/unit`, `web/src/**/*.test.ts(x)` | nothing external; providers and API mocked | every push, seconds |
| Web UI-only (planned) | `web/` | the MSW mock layer in `web/src/mocks/`, no backend | web CI, once added. Uses the same handlers as the dev mock mode (by Alex) |
| Backend integration | `backend/tests/integration` (`pytest -m integration`) | real Postgres (`TEST_DATABASE_URL`), migrations applied, fake dictionary provider, app called via `httpx.AsyncClient` | backend CI |
| Migrations | `backend/tests/integration/test_migrations.py` | Postgres | backend CI; runs upgrade head → downgrade -1 → upgrade head |
| Contract | CI step | — | backend CI fails if `docs/api/openapi.json` differs from what the backend exports; web CI fails if the generated client differs from what's committed |
| End-to-end | `e2e/` (Playwright) | built web + running API + Postgres, fake dictionary provider | e2e CI on PRs touching any project |

The first e2e test covers the loop from the plan: register, search "run", add two senses, and see them in "My words".

## API contract
- FastAPI generates the spec. `backend` exports it to `docs/api/openapi.json`, which is committed.
- `web` generates its typed client from that file (`npm run gen:api` → `web/src/api/`) once the backend is scaffolded in Step 1.
- An API change touches the backend code/schemas, `openapi.json`, and the web client in the same commit. CI enforces this.

## Delivery
- **Trunk-based:** short-lived branches, PRs into `main`, and `main` is always deployable.
- **Merges keep commit messages:** use rebase or merge commits, not squash, because commit bodies carry agents' reasoning (see [AGENTS.md](../AGENTS.md#commit-messages)).
- **Pipelines** (`.github/workflows/`), each filtered by path:
  - `backend.yml`: lint (ruff), types (mypy), unit + integration + migration tests, OpenAPI drift check, Docker image build
  - `web.yml`: lint (eslint), typecheck (tsc), unit tests (vitest), client drift check, production build
  - `e2e.yml`: full-stack Playwright run on PRs touching `backend/`, `web/` or `e2e/`
- **Each pipeline arrives with its project:** `backend.yml` in the commit that scaffolds the backend, `web.yml` with the web app, and `e2e.yml` with the first e2e test. Each is written against the real commands and passes on its first run. Until then, drafts are kept in `AgentsOutput/` (git-ignored).
- **Deploy: TBD with hosting.** Planned shape: merging to `main` builds and deploys only the changed project, and the backend runs `alembic upgrade head` as a release step before the new version takes traffic. Migrations must be backward-compatible with the previous backend release (expand → migrate → contract).
- **Environments:** local and production to start. Add staging if we have real users before Android.

## Observability (minimum for v1)
- Structured JSON logs from the backend, with a request ID on every line, returned as the `X-Request-ID` header.
- Every dictionary-provider call is logged with query, status, latency and cache hit/miss, and the daily Yandex quota usage is tracked.
- `GET /api/health` (process up) and `GET /api/health/ready` (DB reachable), used by the host's health checks.
