# CLAUDE.md — whatsnext.digital
## READ THIS BEFORE TOUCHING ANYTHING

---

## What this project is

A full rebuild of whatsnext.digital in React 18 + TypeScript + Vite + Tailwind CSS.
The design was prototyped in Claude Design as a single vanilla HTML/CSS/JS file
located at `project/index.html`. Your job is to reimplement that prototype
pixel-accurately in the production React stack. Do NOT copy the prototype's
internal structure. Match the visual output. Rebuild it properly.

---

## Tech stack

- React 18, TypeScript, Vite, Tailwind CSS
- Deployed to Vercel
- DNS on GoDaddy
- Repo: github.com/opseiks/whatsnext-site

---

## The core mechanic — READ THIS CAREFULLY

A persistent poker chip character called Chippy travels the full site.
This is the defining interaction. Everything else serves it.

### How Chippy works

- Chippy is a fixed-position element that travels between section stops
- He has a coin-bob idle animation (gentle float + tilt)
- During travel between stops he plays a tumble sequence using the turn PNGs
- He swells to 1.22x scale during travel, returns to 1x on landing
- He has a panel (dialog box) that opens at each stop
- The panel ABSORBS INTO Chippy when leaving a stop (scales to 5% toward his corner)
- The panel GROWS OUT from Chippy's position when arriving at a new stop
- During idle he slowly flip-cycles through stat chips every 4.2 seconds

### Chippy's position alternates every stop (STRICT ZIG-ZAG)
```
Stop 00 Hero      — center right
Stop 01 Proof     — left
Stop 02 Thesis    — right corner
Stop 03 Portfolio — left corner
Stop 04 Practice  — right corner
Stop 05 Engage    — left corner
Stop 06 Built With — right corner
Stop 07 Connect   — left corner
```
DO NOT break the zig-zag. This was a recurring bug in the prototype.

### Chip assets (in /public/assets/)
```
chip-question-f.png   — hero default, before mode selection
chip-wnd-f.png        — W/N face-on
chip-2b-f.png         — $2B stat chip
chip-400-f.png        — $400M+ stat chip
chip-20yrs-f.png      — 20YRS stat chip
chip-exclaim-f.png    — exclamation chip
chip-wnd-turn1.png    — 1/4 turn (travel sequence)
chip-wnd-turn2.png    — side profile (travel sequence)
chip-wnd-turn3.png    — 3/4 back (travel sequence)
```

### Travel sequence
`wnd-f → turn1 → turn2 → turn3 → turn2 → turn1 → wnd-f`
Each frame: 150ms. Fires during goToStop transition.

### Idle chip cycle by mode
```
neutral:  question → 2b → 400 → wnd
capital:  2b → wnd → 400 → 20yrs
operator: 400 → 20yrs → wnd → 2b
```

---

## Site sections (8 stops, 0-indexed)

```
00  HERO       — cinematic video bg, timed intro then Chippy mode selection
01  PROOF      — billboard stat display, mode-aware
02  THESIS     — belief statements; capital=editorial, operator=card fan
03  PORTFOLIO  — full-width card grid, 6 items, animated slat overlay
04  PRACTICE   — hairline-rule list, 6 service areas
05  ENGAGE     — two-card layout; Chippy panel on left side
06  BUILT WITH — logo/name grid; Chippy panel on right side
07  CONNECT    — single CTA; "Betting on the people building what's next" as tagline
```

---

## DESIGN NOTES — Applied before first build

These are director-level decisions locked before any component is written.

### Note 1: Hero sequence — DO NOT skip this

The hero has a TWO-PHASE entry. This is not optional.

**Phase 1 (first 5-10 seconds or until click/scroll):**
- Full cinematic video plays unobstructed
- Only the headline appears: "The future isn't waiting for permission."
- NO Chippy. NO panel. NO mode selection. NO dimmer overlay on the video.
- The video is the hero moment. Let it breathe.

**Phase 2 (after timer OR first user interaction):**
- Chippy flips in from off-screen
- His panel opens with the mode selection question
- "Who are you here as?" — two choices appear
- Video continues playing underneath, no dimmer added

Implementation: use a `heroPhase` state (1 or 2). Start at 1.
Auto-advance to phase 2 after 7 seconds. Also advance on any click or scroll.
Do NOT add a dark overlay or dimmer to the video at any point.

### Note 2: No video dimmer

The prototype had a `.hero-tint` overlay dimming the video.
REMOVE IT. The video should play at full brightness with no tint overlay.
If text legibility is an issue, solve it with text-shadow or a subtle
gradient behind the text only, NOT a full-screen overlay.

### Note 3: Chippy rotation art — use 3D spin everywhere

The 4-frame turn sequence (wnd-f, turn1, turn2, turn3) currently only fires
during section-to-section travel. This gives Chippy depth during travel but
makes him look flat when idling.

RULE: Use the 4-frame turn sequence for ALL chip rotations, not just travel.
This includes idle flips between stat chips. The sequence is:
`face → turn1 → turn2 → turn3 → turn2 → turn1 → face`

When flipping from one stat chip to another during idle:
- Exit through the turn sequence (face → turn1 → turn2 → turn3)
- At the edge-on moment (turn2/turn3 transition) swap the face PNG
- Return through (turn3 → turn2 → turn1 → new face)

Additional turn art for stat chips ($2B, $400M, 20yrs) will be provided later.
Until that art arrives, use the WND turn frames (chip-wnd-turn1/2/3.png)
for all rotations regardless of which chip face is showing.
This maintains consistent depth even with placeholder turn frames.

### Note 4: Every section must fill the frame

Every stop must clamp and fill the full viewport.
No wasted space. No content that does not extend to the edges.
Use clamp() for all font sizes. Use vh/vw units for spacing where appropriate.
If a section feels empty, it needs more content density, not more padding.
The prototype had significant dead space on some stops. Fix it in the rebuild.

### Note 5: Capital vs Operator = different layouts, not just different colors

This is the most important design principle after the Chippy mechanic.

**Capital mode:** Professional. Orderly. Trophy-room energy.
- Editorial typography: big, generous, authoritative
- Serif Cormorant italics for emphasis
- Gold structural accents on rules and borders
- Generous whitespace used intentionally, not accidentally
- Layout feels like a considered, premium document

**Operator mode:** Edgy. Graphical. Game-from-inside energy.
- Chamfered clip-path corners on cards
- Press Start 2P for labels
- Chartreuse glow and chromatic aberration on key numbers
- Tighter layouts, more data density
- Feels like a live dashboard or game HUD
- References: Tron ARES UI, Free Guy diegetic interface, Scott Pilgrim

DO NOT achieve this distinction with color alone.
The layout, typography, and component shapes must diverge visibly between modes.
A visitor should be able to tell which mode they are in with color turned off.

### Note 6: Chippy in 3D — alive and physical

Chippy must feel like a physical object in space, not a flat PNG sliding around.

Requirements:
- The 4-frame turn sequence creates real depth during all rotations (see Note 3)
- CSS perspective on the coin-bob adds tilt: rotateX(7deg) to rotateX(10deg)
- Mouse proximity causes subtle rotateX/rotateY response (parallax tilt)
- During travel: rotateZ tilt (16 degrees mid-arc), scale swell to 1.38x at peak
- On landing: small bounce-back (rotateZ snap, scale settle)
- The shadow beneath the chip scales and fades with height
- The specular highlight on the chip face is always present

The goal: a visitor should feel like they could reach out and pick him up.

### Note 7: Every section must feel alive

Static sections are wrong. Every stop needs at least one of:
- A number counting up on arrival
- An element that animates in on arrival (stagger, slide, fade)
- A cycling element (billboard, thesis statements, chip idle)
- A hover state with real visual feedback
- A background element with subtle motion (ghost watermark drift, grid, grain)

Stillness is earned. Nothing is allowed to just sit there.

---

## Dual mode system

Two modes: `capital` (investor) and `operator`.
Selected at the hero by the visitor. Toggle available in the header at all times.

Mode affects:
- Chippy's panel copy at every stop (investor voice vs operator voice)
- Billboard data and transition style (capital=fall/rise, operator=scramble)
- Thesis display (capital=editorial big text, operator=card fan)
- Portfolio card styling (capital=clean, operator=chamfered clip-path)
- Practice list accent colors
- Engage section layout
- All accent colors (capital=gold, operator=chartreuse)

Mode state is global. Changing mode rerenders the current stop immediately.

---

## Design system

See DESIGN.md for full spec. Quick reference:

```
--black:    #09090b
--paper:    #ece7da
--muted:    #9a958a
--gold:     #c8a24b
--gold-hi:  #f3dd9b
--gold-lo:  #7a5a22
--teal:     #1f9c89
--teal-hi:  #46cdb6
--signal:   #b9f23a   (chartreuse — the live signal color)

Capital mode accent: gold
Operator mode accent: chartreuse/signal
```

Fonts:
- Archivo 800/900 — display headlines
- Cormorant italic — accent italic within headlines
- Space Mono — labels, metadata, monospace readouts
- Press Start 2P — operator mode game UI labels only

---

## What is NOT built yet (do not invent, wait for instruction)

- LLM/Chippy chat integration (text input placeholder exists, wire-up later)
- Real logo images for Built With (use placeholder slots)
- Video assets behind Portfolio card slats (CSS animation placeholder only)
- Thesis card images (top 40% placeholder zone)
- Back-face chip PNGs (-b suffix) for true two-sided flips
- Real Calendly link for Connect (use placeholder href)

---

## Rules that never change

1. NO em-dashes anywhere in copy or code comments
2. NO invented numbers, stats, or career details
3. The $340M figure = R&D directed, NOT assets under management. Label it correctly.
4. The $2B figure = revenue navigated as operators. Label it correctly.
5. The $1.5B figure = WMS exit to Scientific Games (October 2013). Verified.
6. Vince Zampella passed away Christmas 2025. Handle any references with care.
7. Do not commit without being explicitly told to commit.
8. Review locally before any push to Vercel.

---

## Component structure (suggested, not mandatory)

```
src/
  components/
    Chippy/
      Chippy.tsx          — coin-bob, flip, travel, panel
      ChippyPanel.tsx     — panel content by stop + mode
    sections/
      Hero.tsx
      Proof/
        Proof.tsx
        Billboard.tsx     — the stat billboard mechanic
      Thesis/
        Thesis.tsx
        CardFan.tsx       — operator card fan
      Portfolio.tsx
      Practice.tsx
      Engage.tsx
      BuiltWith.tsx
      Connect.tsx
    ui/
      TopBar.tsx
      ModeToggle.tsx
      Rail.tsx            — right side stop navigation dots
  data/
    billboard.ts          — BB stat data for both modes
    thesis.ts             — THESIS belief data for both modes
    portfolio.ts          — DOMAINS data
    practice.ts           — PRACTICE list
    engage.ts             — ENGAGE steps
    pcopy.ts              — PCOPY panel copy for all stops + modes
  hooks/
    useChippy.ts          — global chippy state
    useMode.ts            — capital/operator mode state
    useStop.ts            — current stop navigation
  App.tsx
  main.tsx
```

---

## The prototype file

The full working prototype is at `project/index.html`.
Read it top to bottom before writing any component.
The CSS, data structures, and JS logic are the source of truth for behavior.
The React rebuild should match the visual output exactly.

---

## Confidence check

If anything in this document conflicts with what you see in `project/index.html`,
the index.html wins. It is the most recent source of truth.
If anything is ambiguous, ask before building.
