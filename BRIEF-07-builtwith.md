# BRIEF-07-BUILTWITH
## Session brief for Built With section fixes
## Read CLAUDE.md and DESIGN.md before starting. Do not commit anything.

---

## Current state

Built With section shows a logo grid with placeholder slots.
Chippy is jammed in the top-right corner.
Partner list is incomplete and the grid has no visual hierarchy.

---

## Fixes required — work through in order

### Fix 1: Chippy position
Chippy and his panel are jammed at the top-right corner.
Drop the Chippy rig down by 40% of the viewport height.
It should feel vertically centered in the right portion of the page.
Same size as other corner stops. Width 340px. Chip 132px.
At least 20px clearance from the right edge.

### Fix 2: Complete partner list
Update the partner list to include all known partners:

Tier 1 (major exits and flagship engagements):
- WMS Gaming (acquired by Scientific Games, $1.5B exit)
- Scientific Games (post-acquisition operations)
- Aristocrat

Tier 2 (active and recent engagements):
- Respawn Entertainment
- Nexon
- Xbox Game Studios
- Avalanche Studios
- Aruze Gaming Global
- Burn Ghost
- Joingo
- Planet Bingo
- PlayBeMo

Do NOT invent relationships or engagements not on this list.
Use these names exactly as written.

### Fix 3: Color-coded category system
The grid should illuminate partners based on category
and current mode.

Each partner has a primary category: GAMES, CASINO, AI, or PUBLISHER.

In CAPITAL mode:
Partners with investment or major exit relationships
glow with gold accent on hover and active state.
Others are dimmer.

In OPERATOR mode:
Partners with deep operator engagements
glow with chartreuse accent on hover and active state.
Others are dimmer.

WMS Gaming always gets featured treatment in both modes:
- Larger double-wide slot
- "$1.5B exit" label visible below the name
- Brief pulse glow animation on arrival when the stop loads

### Fix 4: Grid layout
WMS Gaming takes a featured double-wide slot.
Other tier 1 partners get standard slots.
Tier 2 partners get slightly smaller slots.
All slots have subtle border and dark background.
Partner name is the primary element until logo images arrive.
Category tag is a small pill label below the name.

Logo image naming convention:
/public/assets/partners/[company-slug].png

If image does not exist, show company name as text
in the appropriate accent color. Graceful fallback always.

---

## Success criteria

- Chippy is vertically centered, not cramped at top
- All partners from the confirmed list are present
- WMS Gaming has featured treatment with exit label
- Grid illuminates by category based on active mode
- Graceful fallback to text if logo images are missing
- Feels like a wall of proof, not a generic logo grid

---

## Do not commit. Show me what you have when done and I will review.
