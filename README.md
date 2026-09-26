# Paralumo

English→Russian vocabulary app with a dictionary and spaced-repetition practice.

- What and why: [intent.md](intent.md)
- Repo map and agent instructions: [AGENTS.md](AGENTS.md)
- Local setup, testing, CI/CD, configuration: [docs/engineering.md](docs/engineering.md)

## Quick start (once projects are scaffolded)
```bash
docker compose up -d                                   # Postgres
cp backend/.env.example backend/.env                   # then edit
cd backend && uv sync && uv run alembic upgrade head && uv run uvicorn app.main:app --reload
cd web && npm ci && npm run dev                        # http://localhost:5173
```

## Quick start today (Step 0: web UI only, no backend yet)
```bash
cd web && npm ci && npm run dev:mock                   # http://localhost:5173, API mocked by MSW
```
