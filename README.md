# Paralumo

Vocabulary app: look words up in a dictionary, save individual senses, and practise them with spaced repetition.

The product is not tied to one language pair. English→Russian is the first pair implemented, chosen to get a stable project skeleton working end to end (search → save → practice). More pairs and dictionary providers come after that.

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
