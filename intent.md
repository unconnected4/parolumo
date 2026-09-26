# Paralumo: intent

Product-level intent and cross-cutting decisions. Project-specific intent lives in [backend/intent.md](backend/intent.md) and [web/intent.md](web/intent.md). The detailed plan is in [docs/plan.md](docs/plan.md), and engineering conventions are in [docs/engineering.md](docs/engineering.md).

## Architecture / build order
1. Shared backend: multi-user, word/sense storage, SRS data model
2. Translator-dictionary functionality is the FIRST feature: search a word,
   call a third-party translation API, display senses/translations/example
   sentences, and give each sense a "+" button to save it into the user's vocabulary.
   This is the foundation everything else (including the game) reads from.
3. "Match the words" game, built against real per-user vocabulary data
   from step 2, not static/dummy pairs
4. Web UI used throughout as the fast prototyping surface
5. Android after web is stable (a third project alongside `backend/` and `web/`)
6. iOS only if there's demonstrated interest/traction

## Cross-cutting decisions
- **English → Russian only** for v1. A single pair lets us check the whole search → save → practice loop quickly.
- **Yandex Dictionary API** for word data. It returns sense-level translations with examples (plain translation APIs don't), and it is strong for pairs involving Russian. It sits behind a `DictionaryProvider` interface so it can be swapped out.
- **Backend and clients meet only at a JSON API** described by a committed OpenAPI spec (`docs/api/openapi.json`). The web app now, and the Android app later, use it unchanged.
- **FSRS scheduling, with every review logged from day one.** Keeping the logs means we can change the algorithm later without losing history.
- **The match game only lightly affects the review schedule.** Matching tests recognition and can be solved by elimination, which makes it a weak memory signal.
- **Separate delivery:** backend and web each have their own pipeline and deploy independently from the same repo.

Stack choices per project: [backend](backend/intent.md) (FastAPI + SQLAlchemy + Alembic + Postgres) and [web](web/intent.md) (React + Vite + TypeScript).

## Open questions
- Can we still get a Yandex Dictionary API key, and what do its terms say about request limits, required credit lines, and storing results? Check this before building step 2.
- Hosting for the backend + Postgres and for the web app is **TBD**. Deploy and production-secrets sections are placeholders until this is decided.
