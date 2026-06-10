# BRIEF-05-PRACTICE
## Session brief for Practice section fixes
## Read CLAUDE.md and DESIGN.md before starting. Do not commit anything.

---

## Current state

Practice section shows 6 service areas as a hairline-rule list.
Each item has a number prefix, service name, and arrow button.
Hover slides the row right and fills the arrow with accent color.
No specific issues logged in notes yet beyond general positioning.

---

## Fixes required — work through in order

### Fix 1: Chippy position
Chippy and his panel are positioned too high on this stop.
Drop the entire Chippy rig down so it sits vertically centered
in the right portion of the page rather than jammed at the top.
Target: the center of the Chippy rig should be at approximately
50% of the viewport height.
Same size as other corner stops. Width 340px. Chip 132px.

### Fix 2: Content padding
Add 10% top and 10% bottom padding to the practice content area.
The list should not run to the top or bottom edges of the viewport.
Content should feel like it has room to breathe.

### Fix 3: Mode differentiation
The Practice section currently looks nearly identical in both modes.
Capital and operator should feel visually different.

Capital mode:
- Numbers in var(--gold)
- Arrow buttons with gold border and fill on hover
- Generous spacing between rows
- Feels like a considered service menu

Operator mode:
- Numbers in var(--signal) chartreuse with Space Mono font
- Press Start 2P or Space Mono for the number prefix
- Arrow buttons with chartreuse border and fill on hover
- Tighter spacing, more data-dense feel
- Feels like a capability readout, not a menu

### Fix 4: Section alive rule
The Practice section currently has no motion beyond hover states.
Add at least one ambient motion element:
- The list items stagger-animate in on arrival at this stop
  (each row slides in from the left with a 60ms delay between rows)
- This fires once per arrival, not on loop

---

## Success criteria

- Chippy is vertically centered, not cramped at top
- 10% padding top and bottom on content
- Capital and operator modes read as different visual rooms
- List animates in on arrival with stagger
- Hover states work cleanly in both modes

---

## Do not commit. Show me what you have when done and I will review.
