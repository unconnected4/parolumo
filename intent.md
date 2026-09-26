# Paralumo: intent

Product-level intent and cross-cutting decisions. Project-specific intent lives in [backend/intent.md](backend/intent.md) and [web/intent.md](web/intent.md). The detailed plan is in [docs/plan.md](docs/plan.md), and engineering conventions are in [docs/engineering.md](docs/engineering.md).

## Architecture / build order
1. Step 0 contract & outside-in UI prototype: thin backend slice (schemas, `DictionaryProvider` interface, fake provider) to export `docs/api/openapi.json` and API response examples, followed by web SPA prototype (search, sense cards with "+/✓", "My words") against MSW to validate UX and lock down the data contract.
2. Shared backend: multi-user, word/sense storage, SRS data model, FastAPI implementation of the validated contract.
3. Translator-dictionary integration: connect web to live/fake backend provider.
4. "Match the words" game, built against real per-user vocabulary data from step 3.
5. Android after web is stable (a third project alongside `backend/` and `web/`)
6. iOS only if there's demonstrated interest/traction

## Cross-cutting decisions
- **English → Russian only** for v1. A single pair lets us check the whole search → save → practice loop quickly.
- **Our API is designed for our app, not for a provider (by Alex):** "we design our own application". The API and data model follow what the clients need (the web UI for now), and providers adapt to it, never the other way round. Provider integration questions (keys, terms, storage rules, mapping) are addressed after the first backend with mocked functionality is built.
- **Outside-in prototyping:** Start with the Web UI against fake dictionary data and the OpenAPI contract before freezing the backend schema and persistence layer.
- **Yandex Dictionary API is the first provider, not the only one (by Alex).** It returns sense-level translations with examples (plain translation APIs don't), and it is strong for pairs involving Russian. Providers sit behind a `DictionaryProvider` interface, and more will be added.
- **Backend and clients meet only at a JSON API** described by a committed OpenAPI spec (`docs/api/openapi.json`). The web app now, and the Android app later, use it unchanged.
- **FSRS scheduling, with every review logged from day one.** Keeping the logs means we can change the algorithm later without losing history.
- **The match game only lightly affects the review schedule.** Matching tests recognition and can be solved by elimination, which makes it a weak memory signal.
- **Separate delivery:** backend and web each have their own pipeline and deploy independently from the same repo.

Stack choices per project: [backend](backend/intent.md) (FastAPI + SQLAlchemy + Alembic + Postgres) and [web](web/intent.md) (React + Vite + TypeScript).

## Open questions
- Yandex integration (deferred until after the first backend with mocked functionality, by Alex): key availability and terms. Known so far: the [terms](https://yandex.com/legal/dictionary_api/) allow only temporary caching and forbid permanently storing the data, cap use at 10,000 requests/day per key, and require a "Powered by Yandex.Dictionary" link on every page showing the data. This matters for saved cards, which keep a copy of the sense.
- Hosting for the backend + Postgres and for the web app is **TBD**. Deploy and production-secrets sections are placeholders until this is decided.
