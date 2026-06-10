# BRIEF-06-ENGAGE
## Session brief for Engage section fixes
## Read CLAUDE.md and DESIGN.md before starting. Do not commit anything.

---

## Current state

Engage section shows two cards side by side in both modes.
This is wrong. The mode-split is not working correctly.
Both cards show simultaneously regardless of mode.
Copy needs improvement for both audiences.

---

## Fixes required — work through in order

### Fix 1: True mode-split layout — CRITICAL
This is the most important fix on this section.
The two cards must NOT both show at the same time.
Each mode owns the full page width with its card.

CAPITAL MODE — "We write checks" owns the full space:
- This card takes the full content width (left of Chippy)
- Large, confident, premium treatment
- The operator card does NOT appear at all
- Not at reduced opacity. Gone.

Headline: "We write checks."
Body: "Angel through Series B. $50K to $2M.
We only back what we would build ourselves."
CTA button: "Pitch us"
Button color: var(--gold-hi)
Button links to: mailto:info@whatsnext.digital
  with subject line "Pitch via WND"

OPERATOR MODE — "We roll up our sleeves" owns the full space:
- This card takes the full content width (right of Chippy)
- Edgy, confident, operator-room treatment
- The capital card does NOT appear at all
- Not at reduced opacity. Gone.

Headline: "We roll up our sleeves."
Body: "Fractional, project, or retainer. Corporate strategy,
product management, game design, live ops, AI transformation,
go-to-market, executive sparring."
CTA button: "Engage with us"
Button color: var(--signal) chartreuse
Button links to: mailto:info@whatsnext.digital
  with subject line "Operator Engagement"

### Fix 2: Page headline and intro copy
The page headline "We invest time before we invest capital." is good.
Keep it. It works for both audiences.

The intro paragraph below the headline should also be kept.
It explains the WND approach clearly.

Both headline and intro are visible in both modes.
Only the card below switches.

### Fix 3: Chippy position and panel copy
Drop the Chippy rig down so it is vertically centered.
Same size as other corner stops. Width 340px. Chip 132px.
Add 10% top and 10% bottom padding to the content area.

Chippy panel copy for Engage stop:

CAPITAL mode:
Headline: "We invest time before we invest capital."
Bullets:
- 15-minute call. No deck required.
- We get close to the work first.
- Senior operator attention at every stage.
Stat line: "Pre-seed $50K–$250K · Series up to $2M"

OPERATOR mode:
Headline: "We get in the work. Not just the room."
Bullets:
- Fractional, project, or retainer.
- We've shipped in every domain we advise on.
- No PowerPoint consultants.
Stat line: "$400M+ launched · concept to scale"

### Fix 4: Visual differentiation between modes
Capital engage card:
- Clean dark background #0c1418
- Gold border on the card
- Generous whitespace
- Cormorant italic on the headline emphasis
- Feels like a term sheet room

Operator engage card:
- Dark green tinted background #141a0c
- Chartreuse border on the card
- Space Mono for supporting text
- Chamfered clip-path corners
- Feels like a war room briefing

---

## Success criteria

- Capital mode shows only the capital card, operator mode shows only operator card
- No card overlap or dual visibility in either mode
- Each card owns the full space with premium visual treatment
- Chippy panel copy switches correctly per mode
- Both modes feel like different rooms with different energy

---

## Do not commit. Show me what you have when done and I will review.
