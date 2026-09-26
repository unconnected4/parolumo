# Paralumo — plan for steps 1–2 (backend + translator-dictionary), step 3 outline

## Context
`intent.md` sets out the build order: a shared multi-user backend with word/sense/spaced-repetition (SRS) storage, then an English→Russian translator-dictionary with a per-sense "+" button to save senses into the user's vocabulary, then a "Match the words" game that runs on real vocabulary. The web app comes first; Android later; iOS only if people want it.

Decisions (see also `../intent.md` → Cross-cutting decisions, and each project's intent.md):
- **Language pair:** English → Russian only (the learner studies English and sees Russian glosses)
- **Dictionary source:** Yandex Dictionary API (`dict.1.1/json/lookup`, `lang=en-ru`)
- **Backend:** Python (FastAPI + SQLAlchemy 2 + Alembic + Postgres)
- **Frontend:** React + Vite + TypeScript SPA; Android gets a separate native app later
- The backend is a plain JSON API so the future Android app can use it unchanged

## Step 0 — confirm Yandex before building on it
- Confirm a Yandex Dictionary API key can still be obtained (new key registration has been restricted at times) and check its current terms. The things to check: daily request limit, whether a "Powered by Yandex.Dictionary" credit is required, and whether saving results is allowed.
- Hide the provider behind a `DictionaryProvider` interface so we can switch to another source (e.g. Wiktionary data) if Yandex falls through.

## Repo layout
Monorepo with independently delivered projects. The full map is in the root [AGENTS.md](../AGENTS.md).
```
backend/             FastAPI app (pyproject + uv), alembic/, app/{api,services,models,schemas,providers}, tests/
web/                 Vite + React + TS
e2e/                 Playwright tests across web + backend
docs/                shared docs; docs/api/openapi.json is the API contract
docker-compose.yml   Postgres for local dev
```

## Step 1 — Data model (Postgres)
- `users`: id, email, password_hash, created_at. Auth is email+password with JWT or a session cookie, via `fastapi-users` so we don't write auth ourselves.
- `lexemes`: id, lemma, lang='en', pos, transcription. Unique on (lemma, pos).
- `senses`: id, lexeme_id, source='yandex', source_key, translation_ru, synonyms_ru[], meanings_en[], examples jsonb [{en, ru}]. Yandex has no sense IDs, so `source_key` is a stable hash of lemma+pos+main translation.
- `user_cards`: id, user_id, sense_id, **a copy of the sense data**, created_at, plus SRS state (due_at, stability/interval, difficulty/ease, reps, lapses, state). Unique on (user_id, sense_id). The copy keeps the card intact if the dictionary data changes.
- `review_logs`: card_id, reviewed_at, rating, source ('srs' | 'match_game'), previous and new state. This lets us change the SRS algorithm later without losing history.
- `lookup_cache`: query and response json with a timestamp, used only if Yandex's terms allow it; otherwise this is only the rate limiter.
- SRS algorithm: start with FSRS (the `fsrs` Python package), wrapped in `services/srs.py`.

## Step 2 — Translator-dictionary
Backend:
- `providers/yandex.py`: calls the lookup endpoint and turns the response (`def[] → tr[] → syn/mean/ex`) into our `Lexeme`/`Sense` structures.
- `GET /api/dictionary/lookup?q=`: returns the lexemes and senses, each marked `saved: bool` for the current user.
- `POST /api/cards {sense_id}`, `DELETE /api/cards/{id}`, `GET /api/cards` (the user's vocabulary list).

Web:
- Login/register pages, a search box, results grouped by part of speech, and one sense card each (Russian translation, synonyms, English meanings, examples) with a "+" button that shows ✓ once saved. Plus a "My words" list page.
- Show the Yandex credit line if the terms require it.

## Step 3 — Match game (outline, planned in detail later)
- `GET /api/game/match?n=6` picks due or weak cards first, then fills from random cards.
- Match results are logged with `source='match_game'` and only nudge SRS state lightly, because matching is a recognition task and pairs can be solved by elimination.

## Verification
Testing tiers, CI and local setup are defined in [engineering.md](engineering.md).

- Backend: `pytest` covering the Yandex→model mapping (against recorded JSON fixtures), the card save/unsave endpoints and their uniqueness, FSRS scheduling, and per-user isolation.
- End to end: automated in `e2e/` (Playwright, fake dictionary provider). Register, search "run", add two senses, and check they appear in "My words" and in `user_cards`.
