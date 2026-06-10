# BRIEF-03-THESIS
## Session brief for Thesis section fixes
## Read CLAUDE.md and DESIGN.md before starting. Do not commit anything.

---

## Current state

Thesis section has two mode-specific layouts.
Capital shows editorial cycling belief statements.
Operator shows a card fan that deals cards on click.
Both have issues with Chippy positioning and layout problems.

---

## Fixes required — work through in order

### Fix 1: Operator mode — Chippy size and position
Chippy and his panel got small and are jammed against the far right edge.
This is a regression from a previous session.

The Chippy rig on the Thesis stop should match the same size as Proof.
Width 340px. Chip 132px. Same proportions as all corner stops.
Position it at the top-right corner with at least 20px clearance
from the right edge of the viewport. It must not touch the edge.
Pull it away from the wall.

### Fix 2: Operator mode — card fan interaction
Currently only the top two cards move when cycling.
The bottom cards in the fan never animate.
This needs to be rebuilt properly.

The card fan should work as follows:
- All 4 cards are visible in the fan at all times
- The front card is the active card, centered and fully readable
- The 3 back cards are fanned behind it at rotateZ offsets
- On hover over the fan, all 4 cards spread slightly so each is
  partially visible and individually selectable
- Clicking any back card brings that card to the front
  (not just cycling front to back)
- The front card can still be clicked to deal it to the back
  (current behavior, keep it)
- When a card moves, ALL cards in the fan shift position smoothly

The goal: a visitor can see all beliefs at once on hover
and jump directly to any one they want.

### Fix 3: Capital mode — image and headline as one unit
The editorial layout currently shows the image placeholder
as a separate element above the headline.
They need to be a single unified card unit.

Each belief card should be:
- A tall editorial card with the image taking the top 55% of the card
- The headline overlaid on the BOTTOM of the image
  (like a magazine cover or film poster title treatment)
  The headline text sits inside the image area at the bottom,
  with a gradient darkening the bottom of the image behind the text
  for legibility
- Sub-copy sits outside the image, below the card

The image placeholder should show the filename hint:
thesis-cap-01.png, thesis-cap-02.png, etc.
Located at /public/assets/thesis/

The cards should feel like editorial magazine article cards,
not like a box with a label and text below.

---

## Success criteria

- Operator Chippy is same size as Proof stop, not jammed to the edge
- Hovering the card fan spreads all 4 cards and makes each selectable
- Any card can be brought to front directly, not just front-to-back cycle
- Capital belief cards are unified image plus headline units
- Headline overlaid inside the image at the bottom
- Both modes feel premium and intentional

---

## Do not commit. Show me what you have when done and I will review.
