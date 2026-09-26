---
task: step0-fixtures-and-contract
title: Step 0 — API schemas, fake provider and contract export
status: in-progress
branch: main
started: 2026-09-26T14:38:53Z
last_updated: 2026-09-26T15:05:05Z
last_commit: b2ae09c
agents: [AgyD-Flash3.8, ClaudeC-Opus5.5]
related_decisions: [intent.md, docs/plan.md, backend/intent.md, web/intent.md]
---

# Step 0 — API schemas, fake provider and contract export

## Goal and acceptance
Establish the shared API contract and fake data before frontend or database scaffolding. Rewritten 2026-09-26 by ClaudeC-Opus5.5 after Alex's decision (see Decisions): no Yandex work in this task.
1. Design the API around what the web UI needs (search results grouped by part of speech, sense cards with "+/✓", "My words"), independent of any provider's response format.
2. Scaffold minimal `backend/` slice (no DB, no auth): Pydantic schemas (`Lexeme`, `Sense`), the `DictionaryProvider` interface, and a `fake` provider returning hand-authored data in our own domain shape (e.g. "run", "bank", "light", plus a not-found case), with unit tests.
3. Export `docs/api/openapi.json` from stub FastAPI routes via `app.export_openapi`.
4. Make the fake data available to `web/` for prototyping through its own MSW mock layer (`web/src/mocks/`), kept separate from the backend's fake provider (by Alex, see Decisions).

Acceptance:
- Unit tests pass for the fake provider and stub routes.
- `docs/api/openapi.json` is exported and valid.
- `web/` can prototype against the fake data through the generated client.

## Current state
Task `ui-first-and-plan-amendments` has been closed and archived. The durable specifications in `intent.md`, `docs/plan.md`, `backend/intent.md`, and `web/intent.md` reflect all accepted decisions (P1–P10).

ClaudeC-Opus5.5 reviewed 8d51d1e: P5–P10 are applied as intended. Four gaps remain that affect Step 0's code and contract, raised as proposals P11–P14 under Open questions for AgyD-Flash3.8 to decide before scaffolding. No docs other than this handoff were changed.

Alex then decided (see Decisions) that we design our own API for our own app, with Yandex as the first of several providers, and that provider integration waits until after the first backend with mocked functionality. ClaudeC-Opus5.5 recorded this in root `intent.md`, rewrote this task's goal, answered both `For Alex:` questions, revised its own P11 and P13 to match, and added P15. `docs/plan.md`, `backend/intent.md` and `web/intent.md` still describe Yandex fixtures and mapping in Step 0 and need updating (see Next step).

Alex rejected P15 and decided that all parts' code, mocks included, stays segregated (see Decisions). ClaudeC-Opus5.5 recorded this in root `intent.md`, `web/intent.md`, `web/AGENTS.md`, `backend/intent.md` and `docs/engineering.md` (planned UI-only test tier).

## Done
- Initialized active handoff for Step 0.

## Tried and rejected
- Hand-writing mock data in TypeScript: rejected in favor of exporting generated API examples from the Python backend slice to prevent schema and mapping drift.
- P15, web prototyping against the mocked backend instead of MSW (rejected by Alex): it "mixtures implementations that should be segregated", and the "UI mock can be utilized in the future for UI only tests". MSW stays as `web/`'s own mock layer.

## Decisions made during this task
- **Design our own API; Yandex is the first provider, not the only one (by Alex):** "Don't focus on Yandex API, we design our own application. Yandex will be used as a first but not the only provider. Hence, design API for our needs (Web UI atm), integration questions will be addressed after we build the first backend with mocked functionality." Consequences: Step 0 no longer records Yandex fixtures or writes the Yandex mapping (earlier P5 and P7 parts about raw Yandex data are superseded); fake data is hand-authored in our domain shape; Yandex keys, terms and storage are deferred. Recorded in root `intent.md`.
- **Segregated implementations, mocks included (by Alex):** "no, it mixtures implementations that should be segregated. also UI mock can be utilized in the future for UI only tests. Consider segregation of code for all the parts." Consequences: `web/` keeps MSW in `src/mocks/`, used by dev mock mode and tests only, and reused later for UI-only tests; every backend fake (fake provider, in-memory stand-ins before Postgres) is its own implementation behind an interface, chosen by `Settings` or test setup; no production code branches on "is this a mock". Recorded in root `intent.md`, `web/intent.md`, `web/AGENTS.md`, `backend/intent.md` and `docs/engineering.md`.

## Open questions
Proposals from ClaudeC-Opus5.5, continuing the numbering from the archived `ui-first-and-plan-amendments` handoff, to be answered by AgyD-Flash3.8 (accept → apply to the named docs; reject → record why under Tried and rejected):

- **P11. Decide how the API identifies a sense before any database exists.** `POST /api/cards {sense_id}` assumes `senses.id`, a database key. Step 0 has no database, so the exported lookup examples have no real IDs, and anything MSW invents won't match what the backend returns later. It also leaves an unstated consequence: every lookup has to insert its lexemes and senses into the database so that IDs exist for the "+" button. Proposal (revised after Alex's decision): the API's `sense_id` is an opaque string that our backend owns, e.g. a stable hash of provider + lemma + pos + main translation (the `source_key` from `docs/plan.md` Step 1, with the provider added since there will be several). Clients never parse it. Any provider, including the fake one, can compute it without a database, so fake data is deterministic, and it survives database resets. Internally `user_cards.sense_id` can stay an integer foreign key; `POST /api/cards` resolves the string (storing the sense if it isn't stored yet). Lookup then doesn't need to write to `senses` at all. Affects `docs/plan.md` (Step 1 `senses`, Step 2 endpoints) and `backend/intent.md`.
- **P12. `saved` is per-user state, so examples can't carry it.** The lookup response marks each sense `saved: bool` for the current user. A static example file can only say one thing. Proposal: exported lookup examples always have `saved: false`; the MSW handlers keep an in-memory set of saved sense IDs (filled by the mocked `POST`/`DELETE /api/cards`) and overlay `saved` on the lookup response. Also export the non-happy cases the UI must handle, not only "run", "bank", "light": a word with no results (`lookup/not-found.json`), and the error body shape for a provider failure. Affects `web/intent.md` (MSW decision) and `docs/plan.md` (Step 0).
- **P13. The fake provider can't read from `tests/`.** This corrects my own P7. "Tests and local runs use the fake dictionary provider" (root `AGENTS.md`), so the fake provider is runtime code, and `backend.yml` builds a Docker image, which normally leaves `tests/` out. If the fake provider loads `tests/fixtures/yandex/`, it breaks in the image and makes app code depend on the test tree. Proposal (revised after Alex's decision): the fake provider's data is hand-authored in our own domain shape (not raw Yandex JSON) and lives under the app, e.g. `backend/app/providers/fake_data/<word>.json`, and tests load it from there. Raw provider fixtures for Yandex come later, with the integration work. For unknown words the fake provider returns an empty result, so local runs behave like the real "not found" case. Affects `backend/intent.md` (Fixture boundaries), `docs/plan.md` (Step 0, Repo layout) and `backend/AGENTS.md` (Layout).
- **P14. Examples need the same drift protection as the spec, and the instruction files need to know about them.** 8d51d1e updated the intent docs but not the files agents actually follow. Proposal: (a) examples are written by a command next to the spec export (e.g. `uv run python -m app.export_examples`), each example validated against its response schema before writing; (b) the OpenAPI drift check in CI also fails when `docs/api/examples/` is out of date; (c) update `backend/AGENTS.md` (commands, layout, and the rule "any change to routes or schemas re-exports the spec" extended to examples), `docs/api/README.md` (which says `openapi.json` is the only file in the folder) and `docs/engineering.md` (Contract row and API contract section). Affects those three files.
- ~~**P15. With a mocked backend, the web app may not need MSW at all.**~~ → Rejected by Alex, see Decisions and Tried and rejected. Original proposal: Alex's decision says the first backend is built "with mocked functionality". If that backend runs the fake provider and keeps cards in memory (no Postgres, stub auth), `web/` can talk to it through the Vite proxy and the generated client, exactly as it will in production. Then MSW, the exported `docs/api/examples/` and their drift checks (P12, P14 (a)(b)) are no longer needed: one mocked backend instead of two parallel mocks. The per-user `saved` flag also works naturally, since the backend tracks it. Cost: web prototyping needs the backend running (one `uv run` command), and component tests would still use small local mocks. Proposal: drop MSW and exported examples; Step 0's mocked backend is the prototyping target. If accepted, P12's "not-found and error cases" become fake-provider cases, and P14 shrinks to updating `backend/AGENTS.md` for the fake data location. Affects `docs/plan.md` (Step 0, Build strategy), `web/intent.md` (MSW decision), `backend/intent.md` (Fixture boundaries) and root `intent.md` build order step 1.

- ~~For Alex: Yandex's terms forbid permanently storing dictionary data, which conflicts with how saved cards work. Which way do we go?~~ → Deferred: design our own API; provider integration questions come after the first backend with mocked functionality (by Alex, 2026-09-26). The findings stay recorded in root `intent.md` Open questions. Original question: ClaudeC-Opus5.5 checked the Dictionary API terms (https://yandex.com/legal/dictionary_api/, read 2026-09-26). They allow "temporary storage (caching) of the Data within the functionality of the Service" and prohibit modifying or permanently storing the data. They also cap use at 10,000 requests/day per key, require a "Powered by Yandex.Dictionary" link to http://api.yandex.com/dictionary on every page showing the data, in the same font size and color as the main text, and let Yandex cut access without notice. Our design stores Yandex data permanently in `senses` and copies it into `user_cards` (and the match game reads it from there). Options: (a) accept the risk because the app stays personal / small and private; (b) keep Yandex for search results only (cached, with TTL), and store saved cards from a source whose license allows storage (e.g. Wiktionary data, CC BY-SA, via wiktextract/kaikki.org), accepting weaker Russian examples; (c) ask Yandex for written permission to store saved senses; (d) switch fully to a storable source. Only Alex knows whether the app is meant to be public and how much legal risk is acceptable. This blocks the `senses` / `user_cards` data model (Step 1) and which provider Step 0's fixtures come from, but not the Step 0 slice's structure.
- ~~For Alex: can you obtain a live Yandex Dictionary API key, or should Step 0 start with the sample responses from Yandex's documentation?~~ → Neither for now: Step 0 uses hand-authored fake data in our own shape; Yandex keys are an integration question for later (by Alex, 2026-09-26).

## Next step
AgyD-Flash3.8: decide P11–P14 under Open questions (P15 was rejected by Alex; check P12 and P14 against the segregation decision), apply the accepted ones to the named docs, and record rejected ones under Tried and rejected. In the same pass, bring `docs/plan.md` (Step 0, Build strategy, Repo layout), `backend/intent.md` (Fixture boundaries) and `web/intent.md` (MSW decision) in line with Alex's decision: no Yandex fixtures or mapping in Step 0. Then scaffold `backend/pyproject.toml` with `uv` and start the slice with the API schemas the web UI needs.

## Session log
- 2026-09-26T14:38:53Z AgyD-Flash3.8: Initialized Step 0 handoff following closure and archiving of ui-first-and-plan-amendments.
- 2026-09-26T14:42:34Z ClaudeC-Opus5.5: Reviewed 8d51d1e; P5–P10 applied as intended; recorded proposals P11–P14 (public sense ID, per-user `saved` in mocks, fake-provider data location, example export and drift checks). Handoff-only change.
- 2026-09-26T14:51:45Z ClaudeC-Opus5.5: Read the Yandex Dictionary API terms; recorded "For Alex:" question on the no-permanent-storage clause vs saved cards, with options. Handoff-only change.
- 2026-09-26T14:56:56Z ClaudeC-Opus5.5: Recorded Alex's decision (own API, Yandex first of several providers, integration deferred) in root `intent.md` and here; rewrote the goal, closed both `For Alex:` questions, revised P11/P13, added P15 (mocked backend instead of MSW).
- 2026-09-26T15:05:05Z ClaudeC-Opus5.5: Recorded Alex's rejection of P15 and the segregation decision (mocks included) in root `intent.md`, `web/intent.md`, `web/AGENTS.md`, `backend/intent.md`, `docs/engineering.md` and here.

## Outcome
<!-- Filled in only when archiving. -->
