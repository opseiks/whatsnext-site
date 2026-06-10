# BRIEF-02-PROOF
## Session brief for Proof section fixes
## Read CLAUDE.md and DESIGN.md before starting. Do not commit anything.

---

## Current state

Proof section is built with billboard mechanic working in both modes.
Capital shows fall/rise transition with count-up.
Operator shows horizontal squeeze with character scramble.
Four queue tiles at bottom show stat chips.
Issues remain with Chippy positioning, billboard proportions,
and stat sequence differentiation between modes.

---

## Fixes required — work through in order

### Fix 1: Chippy position on Proof
Chippy still sits too high and not close enough to his panel.
Move the Chippy rig so the chip tucks snugly above the top-left
corner of the panel box.
The bottom of the chip should clear the top of the panel by 8px only.
No overlap. Just enough breathing room to read the panel header.
The chip should feel like it is sitting on top of its own box,
not floating above the page.

Before making the change, console.log the current CSS top and left
values for the rig at stop 1 so we can verify the change actually applied.

### Fix 2: Billboard proportions
The billboard frame looks slightly empty.
The big stat number is good but the surrounding space needs work.

Adjust the ratios so:
- The billboard frame takes up more vertical space
- The label above the number is larger and more prominent
- The description text below the number is at least 16px,
  comfortable to read without squinting
- The queue tiles at the bottom are taller with larger text
  (stat value at least 18px, label at least 12px)
- There should be 10% padding top and bottom inside the billboard frame
  so the number does not feel cramped

### Fix 3: Differentiate stat sequences between modes
Capital and operator modes currently show the same stats
in the same order. They should feel like different data sets.

Capital mode sequence (investor framing):
1. $1.5B — "The Exit"
2. 20YRS — "In the Work"
3. $340M — "R&D Directed"
4. 7+ — "Portfolio Active"

Operator mode sequence (operator framing):
1. $400M+ — "Launched and Shipped"
2. 20YRS — "Time in Domain"
3. $1.5B — "Exit on Record"
4. $340M — "Active Portfolio"

Starting stat is different per mode.
The Chippy panel copy should also reflect the different starting stat.
Make sure the chip face that Chippy shows matches the active billboard stat.

---

## Success criteria

- Chippy chip tucks snugly above panel, 8px clearance only
- Billboard feels proportionally balanced, no empty space
- Description text and queue tiles are readable at a glance
- Capital mode starts on $1.5B, operator mode starts on $400M+
- Both modes feel like different rooms, not the same page in different colors

---

## Do not commit. Show me what you have when done and I will review.
