# BRIEF-10-RESPONSIVE-HEIGHT
## Session brief for viewport height responsiveness
## Read CLAUDE.md and DESIGN.md before starting. Do not commit anything.

---

## Problem summary

The site was built for a tall desktop viewport.
When the browser window height is reduced, multiple things break:
- Chippy's panel gets cut off or does not move up
- Billboard numbers do not shrink to keep content visible
- Card fans overlap headlines
- Content boxes cover the headline and subhead above them
- Lists and hover boxes do not scale with page height

This is a systematic fix across all 8 stops.
The minimum supported viewport height is 600px.
Everything must be visible and usable at 600px height.

---

## Root cause

Chippy's rig uses fixed pixel values for top positioning.
Content sections use fixed heights and padding instead of
viewport-relative units and clamp().
Nothing collapses gracefully when height is reduced.

---

## Fix 1: Chippy rig — responsive top position ALL stops

The Chippy rig position must use viewport-relative units
not fixed pixel values.

For all corner stops (02 through 07):
Replace fixed top: 418px (or whatever fixed value is used)
with: top: clamp(100px, 25vh, 418px)

This means:
- At tall viewports: Chippy sits at his designed position
- At short viewports: Chippy moves up proportionally
- He never goes above 100px from the top (below the topbar)
- He never cuts off at the bottom

Apply this to ALL stops where Chippy has a fixed top value.
Check every body[data-stop] .rig CSS rule and replace
fixed top values with clamp equivalents.

---

## Fix 2: Proof billboard — responsive content scaling

The billboard big numbers must scale down at smaller heights.
The description text below the number must always be visible.

Use clamp() on the billboard value font size:
font-size: clamp(36px, 8vh, 114px)

The billboard frame height should be:
height: clamp(200px, 40vh, 400px)

The description text minimum size: 14px always visible.
The queue tiles must always be fully visible below the frame.
Use flex layout with flex-shrink allowed on all billboard children.

---

## Fix 3: Thesis operator — card fan scaling

The card fan must not overlap the headline at any viewport height.

Wrap the card fan in a container that has:
max-height: calc(100vh - 200px)
overflow: hidden

Scale the cards down proportionally using:
transform: scale(clamp(0.6, calc((100vh - 300px) / 400px), 1))
transform-origin: top center

The headline must always be fully visible above the fan.
If the fan cannot fit without overlapping the headline,
reduce the card size until it fits.

---

## Fix 4: Engage — content boxes must not cover headline

Both the capital card and the operator box are sliding up
and covering the headline and subhead when viewport shrinks.

The content area below the headline must have:
overflow-y: auto at small heights, not overflow: visible

The headline and subhead must be position: sticky or
have a minimum margin-bottom that prevents the card below
from ever touching them regardless of viewport height.

Add to both capital card and operator box:
max-height: calc(100vh - 300px)
overflow-y: auto

This allows the card to scroll internally rather than
pushing up and covering the headline.

---

## Fix 5: Practice — hover cards and list scaling

Operator mode hover cards:
The card grid must use a max-height with overflow hidden.
Cards must scale down at smaller viewports.
Use: grid with auto-rows: clamp(120px, 18vh, 200px)

Capital mode list:
Each list item must have:
padding: clamp(8px, 1.5vh, 14px) 0

This prevents the list from overflowing at small heights.

---

## Fix 6: Portfolio, Built With, Connect — Chippy only

These stops just need Fix 1 applied.
The Chippy rig responsive top positioning fix covers them.
No other content changes needed for these stops.

---

## Testing requirement

After applying all fixes, test at these viewport heights:
- 900px (current design target)
- 768px (laptop)
- 600px (minimum supported)

At 600px height:
- Chippy panel must be fully visible
- No content must overlap the headline
- Billboard must show number plus description
- Thesis cards must not overlap headline
- All buttons must be visible and clickable

---

## Do not commit. I will review at multiple viewport heights when done.
