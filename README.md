# Civ Pro: Trial Ready

`Civ Pro: Trial Ready` is a dependency-light browser prototype for a competitive 1L Civil Procedure card game. Version 0.2 turns the first proof of concept into a more usable game system: decks, hands, draw/discard, litigation budget, tutorial mode, printable cards, professor settings, and automated doctrine tests.

## Run

Because the app is now split into browser modules, run it from a local server:

```sh
npm run serve
```

Then open `http://localhost:4173`.

## Test

```sh
npm test
npm run check
```

The test suite covers rule-engine doctrine branches and edge cases, playable card/deck integrity, generated legal-source data, source generator/env parsing behavior, secret redaction, the static HTML-to-app DOM contract, and a dependency-free app boot smoke test.

## Legal Source Imports

The app now has a legal-source ingestion layer. It does not need API credentials to run; the default source catalog is generated from public doctrine/source metadata and blank credential placeholders.

```sh
npm run sources
```

That command writes:

- `data/legal-sources/source-manifest.json`: provider registry, doctrine source links, and live-probe configuration.
- `legal-sources.generated.js`: browser-safe source cards used by the in-game Rule Judge.

To probe live APIs and public endpoints, add real credentials to `.env.local` and run:

```sh
npm run sources:live
```

The tracked `.env` intentionally contains blank placeholders only. Use `.env.local` for real values; it is ignored by git. Current placeholders are `GOVINFO_API_KEY`, `COURTLISTENER_API_TOKEN`, `CONGRESS_API_KEY`, `OPENSTATES_API_KEY`, `PACER_USERNAME`, and `PACER_PASSWORD`.

Source coverage currently includes U.S. Courts FRCP materials, Cornell LII rule/statute pages, CourtListener, govinfo, FederalRegister.gov, eCFR, Congress.gov, Open States, and a restricted PACER/RECAP path. Direct PACER use should stay server-side and optional because it can require account credentials and may incur fees.

## What Is Playable

- File a case and choose the defendant.
- Use an actual defense attack hand and plaintiff motion/discovery hand.
- Draw cards, discard used cards, and spend limited litigation budget.
- Play threshold attacks for personal jurisdiction, subject-matter jurisdiction, service, venue, removal, joinder, supplemental jurisdiction, Erie preview, Rule 12(b)(6), and class certification preview.
- Use timed or untimed motion responses.
- Collect discovery proof with depositions, requests for production, requests for admission, expert proof, motions to compel, narrowing, and privilege-log responses.
- Close discovery and use Rule 56 if the proof checklist is incomplete.
- Score trial-ready claims and rotate roles.

## Study Modes

The professor panel supports:

- Jurisdiction-only preset.
- Discovery-only preset.
- Topic toggles for jurisdiction/removal, service, joinder, supplemental jurisdiction, discovery/Rule 56, Erie preview, and class actions preview.
- No-timer mode.
- Exam mode, which hides the Rule Judge analysis until revealed.
- Explanation toggle.
- Guided tutorial mode.

## Print Cards

Use `Print cards` in the app. The print view is generated from the same data model used by the game so the physical deck and digital prototype stay aligned.

## File Structure

- `data.js`: case cards, attack cards, motion/discovery cards, topic modules, sources, tutorial steps.
- `legal-sources.generated.js`: generated browser-safe source module used by `data.js`.
- `rules.js`: rule evaluation and shared helpers.
- `app.js`: UI state, turns, rendering, hands, budget, tutorial, printing.
- `rule-tests.js`: reusable test assertions.
- `scripts/`: legal-source configuration, env loading, and source-manifest generation.
- `tests/`: Node test runners for doctrine logic and source ingestion.
- `styles.css`: game UI and print-card styling.

## Doctrine Boundary

This is still a learning game, not a legal expert system. It intentionally abstracts doctrine into teachable game states. The source hooks are grounded in core 1L procedure materials, including FRCP 4, 8, 12-15, 18-20, 23, 26/30/34/36/37, 56, and 28 U.S.C. 1331, 1332, 1367, 1391, 1441, and 1446.
