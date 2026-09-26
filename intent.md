# Paralumo: intent

Product-level intent and cross-cutting decisions. Project-specific intent lives in [backend/intent.md](backend/intent.md) and [web/intent.md](web/intent.md). The detailed plan is in [docs/plan.md](docs/plan.md), and engineering conventions are in [docs/engineering.md](docs/engineering.md).

## Architecture / build order
1. Step 0 contract & outside-in UI prototype: thin backend slice (schemas, mapping, fake provider) to export `docs/api/openapi.json` and API response examples, followed by web SPA prototype (search, sense cards with "+/✓", "My words") against MSW to validate UX and lock down the data contract.
2. Shared backend: multi-user, word/sense storage, SRS data model, FastAPI implementation of the validated contract.
3. Translator-dictionary integration: connect web to live/fake backend provider.
4. "Match the words" game, built against real per-user vocabulary data from step 3.
5. Android after web is stable (a third project alongside `backend/` and `web/`)
6. iOS only if there's demonstrated interest/traction

## Cross-cutting decisions
- **English → Russian only** for v1. A single pair lets us check the whole search → save → practice loop quickly.
- **Outside-in prototyping:** Start with the Web UI against recorded Yandex fixtures and a draft OpenAPI contract before freezing the backend schema and persistence layer.
- **Yandex Dictionary API** for word data. It returns sense-level translations with examples (plain translation APIs don't), and it is strong for pairs involving Russian. It sits behind a `DictionaryProvider` interface so it can be swapped out.
- **Backend and clients meet only at a JSON API** described by a committed OpenAPI spec (`docs/api/openapi.json`). The web app now, and the Android app later, use it unchanged.
- **FSRS scheduling, with every review logged from day one.** Keeping the logs means we can change the algorithm later without losing history.
- **The match game only lightly affects the review schedule.** Matching tests recognition and can be solved by elimination, which makes it a weak memory signal.
- **Separate delivery:** backend and web each have their own pipeline and deploy independently from the same repo.

Stack choices per project: [backend](backend/intent.md) (FastAPI + SQLAlchemy + Alembic + Postgres) and [web](web/intent.md) (React + Vite + TypeScript).

## Open questions
- Yandex Dictionary API key availability: verify key acquisition and terms (request limits, attribution, caching). If a key cannot be obtained quickly, use documented sample responses for initial Step 0 fixtures; if no key is obtainable at all, escalate `DictionaryProvider` swap (e.g. Wiktionary) before Step 1.
- Hosting for the backend + Postgres and for the web app is **TBD**. Deploy and production-secrets sections are placeholders until this is decided.
