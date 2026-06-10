# BRIEF-01-HERO
## Session brief for Hero section fixes
## Read CLAUDE.md and DESIGN.md before starting. Do not commit anything.

---

## Current state

Hero phase 1 and phase 2 are built and mostly working.
The cinematic video plays, three-layer copy is visible,
Chippy enters on click, panel opens with mode selection.
Core mechanic is functional but several issues remain.

---

## Fixes required — work through in order, maximum 5 per session

### Fix 1: Hero panel choice spacing
There is no visual space between the choice button label and its
sub-description text.
"I'm raising capital" runs directly into "Pre-seed to Series B" with no gap.
"I need an operator partner" runs directly into "Fractional · project · retainer".
Add comfortable padding between the choice title and the sub-description
inside each choice button. They should read as label plus supporting detail,
not as one run-on line.

### Fix 2: Hero check size copy
Update the sub-description on the capital choice button to read:
"Pre-seed $50K–$250K · Series rounds up to $2M"
This replaces whatever is currently showing for the capital choice sub-text.
Update this in the PCOPY data for stop 0, capital and neutral modes.

### Fix 3: Chippy idle bounce — personality rewrite
The current bounce has no elasticity, no energy, no personality.
Complete rewrite required.

The bounce must feel like a heavy coin with cartoon physics.
Full cycle takes 2 seconds total.

Phase 1 — slow weighted drop:
Duration 800ms. Drop 50px below normal rest position.
Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)

Phase 2 — spring overshoot up:
Duration 400ms. Snap 20px ABOVE rest position.
Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
This is the elastic overshoot. It must be visible and satisfying.

Phase 3 — settle back to rest:
Duration 400ms. Return to rest position.
Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)

Fire every 4th idle bob cycle.
The regular gentle bob continues between personality bounces.
The personality bounce should be clearly different from the regular bob.
Not subtle. Cartoony. Fun.

### Fix 4: Chippy travel — 3D physics
The flight from Hero to Proof currently feels like a flat slide.
It needs to feel like a physical coin thrown through the air.

During travel Chippy should feel like he is flying TOWARD the viewer
and then landing on the next section. Specifically:

- Scale up to 1.6x at the peak of the arc (feels close to viewer)
- Scale back down to 1.0x on landing (feels like it landed on the surface)
- Add a rotateX forward tilt of 20deg at peak (foreshortening as it flies)
- Add rotateZ tilt of 16deg one direction mid-arc
- On landing: quick scale bounce to 1.1x then settle to 1.0x
  with a spring easing (overshoot on the settle)
- The shadow beneath Chippy should scale with him
  (larger when close, smaller when landed)

The goal: a visitor should feel like they watched a coin
fly through the air and land on the table.

### Fix 5: Chip rotation smoothness
The 4-frame rotation sequence currently has visible tearing
when splicing in non-WND chip faces ($400M, $2B, 20yrs).

For now this is acceptable at prototype level.
Do NOT spend time on this fix in this session.
Flag it as a known issue and move on.
Better turn art for each chip face will be provided later.

---

## Success criteria

- Choice buttons have clear visual separation between label and sub-text
- Capital choice shows updated check size copy
- Idle bounce is obviously elastic and cartoony, fires every 4th cycle
- Travel to Proof feels like a coin flying through air and landing
- No commits made

---

## Do not commit. Show me what you have when done and I will review.
