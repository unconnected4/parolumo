# Paralumo

Vocabulary app: look words up in a dictionary, save individual senses, and practise them with spaced repetition.

The product is not tied to one language pair. English→Russian is the first pair implemented, chosen to get a stable project skeleton working end to end (search → save → practice). More pairs and dictionary providers come after that.

- What and why: [intent.md](intent.md)
- Repo map and agent instructions: [AGENTS.md](AGENTS.md)
- Local setup, testing, CI/CD, configuration: [docs/engineering.md](docs/engineering.md)

## Status

Build order and step details: [intent.md](intent.md#architecture--build-order) and [docs/plan.md](docs/plan.md).

| Step | What | State |
|------|------|-------|
| 0 | Web UI prototype in `web/`: search, sense cards with "+"/✓, "My words", sign-in, all against a local mock API (MSW) | **Done** |
| 1 | Backend in `backend/`: FastAPI + Postgres, auth, cards, OpenAPI contract, generated web client | Next. Handoff: [docs/handoff/active/step1-backend.md](docs/handoff/active/step1-backend.md) |
| 2 | Dictionary provider integration (Yandex first, behind a provider interface) | Not started |
| 3 | "Match the words" game | Not started |
| 4 | Android app | Later |
| 5 | iOS app | Only if there is demand |

As of now only the UI prototype exists. `backend/` holds instructions and intent but no code, `docs/api/openapi.json` does not exist yet, and `e2e/` has no tests. Every screen runs on mock data.

## Quick start today (Step 0: web prototype on mock data)
```bash
cd web && npm ci && npm run dev:mock                   # http://localhost:5173, API mocked by MSW
```
Sign in with the seeded account `learner@example.com` / `password123`, or register a new one. Accounts and saved words live in memory until the page reloads.

## Quick start once the backend exists (Step 1)
```bash
docker compose up -d                                   # Postgres
cp backend/.env.example backend/.env                   # then edit
cd backend && uv sync && uv run alembic upgrade head && uv run uvicorn app.main:app --reload
cd web && npm ci && npm run dev                        # http://localhost:5173
```
