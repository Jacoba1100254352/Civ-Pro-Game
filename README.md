# Civ Pro: Trial Ready

`Civ Pro: Trial Ready` is a playable first-pass prototype for a competitive 1L Civil Procedure card game. It is built as a dependency-free browser app so it can be opened directly or converted later into a React/Vite multiplayer app.

## Run

Open `index.html` in a browser.

If you prefer a local server:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Game Shape

The prototype uses a hot-seat competitive format.

- One player files a claim and chooses the defendant.
- The other player can play threshold attack cards: personal jurisdiction, subject-matter jurisdiction, venue, removal, local-party joinder, and Rule 12(b)(6).
- The plaintiff must answer with a matching motion before the timer runs out.
- Surviving claims move into discovery.
- The plaintiff must collect the claim-specific proof checklist using the right discovery tools.
- The defense can close with summary judgment if the record is incomplete.
- A claim that survives and has a complete record scores as trial ready.

## Verified Doctrine Hooks

The rule engine intentionally abstracts doctrine rather than pretending to be a full legal simulator. The first edition uses these verified hooks:

- FRCP 12(b) and 12(h): threshold defenses and waiver timing.
- 28 U.S.C. 1332: diversity jurisdiction requires citizenship diversity and more than $75,000 in controversy.
- 28 U.S.C. 1441: removal requires original federal jurisdiction and diversity removal can be blocked by a properly joined forum defendant.
- FRCP 26, 30, 34, and 37: discovery scope, depositions, document production, and motions to compel.
- FRCP 56: summary judgment depends on whether the record contains evidence for the required elements.

## Why a Web Card Game

A card-game model is the best first format because it preserves the original idea and can later become either a physical deck or a digital multiplayer system. The app keeps the core parts separate:

- Case facts are data.
- Attack and motion cards are data.
- Rule checking is concentrated in `app.js`.
- The UI is only HTML/CSS/JS.

That keeps future work practical: add a larger case library, add professor-specific rule decks, add multiplayer, or print cards from the same data model.

## Market Check

Quick verification found law-themed card and board games, legal trivia games, civil-rights/case-law card games, and small Civ Pro gamification experiments, but not an established strategic 1L Civil Procedure card game covering jurisdiction, removal, Rule 12 timing, discovery, and summary judgment as one integrated product.

Useful comparators:

- `Civ Pro the Gathering` shows that students already see FRCP rules as trading-card-like mechanics.
- Law-themed games such as `CIVIO`, `Disbarred`, `The Game of Law School`, and `Uncivil Litigation` show the broader market, but they are not this specific Civ Pro pretrial-procedure system.
- The incomplete Civ Pro board-game/flowchart space suggests student interest in turning jurisdiction rules into play.

## Next Product Steps

The next sensible version would add:

- A printable card export from the same case/card data.
- More precise Rule 12 waiver sequencing.
- Supplemental jurisdiction and claim/party joinder modules.
- A professor mode that toggles topics on or off.
- Multiplayer state sync for two students on different devices.
