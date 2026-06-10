# BRIEF-08-CONNECT
## Session brief for Connect section fixes
## Read CLAUDE.md and DESIGN.md before starting. Do not commit anything.

---

## Current state

Connect section shows a large headline CTA with mode-split buttons.
Chippy is jammed at the top-left corner.
Copy needs refinement for both audiences.

---

## Fixes required — work through in order

### Fix 1: Chippy position
Chippy and his panel are jammed at the top-left corner.
Drop the Chippy rig down by 30% of the viewport height.
It should feel like it is anchoring the left side of the page,
not floating at the top.
Same size as other corner stops. Width 340px. Chip 132px.

### Fix 2: Mode-split CTAs — verify and clean up
The CTA buttons should switch based on mode.
Verify this is working correctly and clean up any issues.

CAPITAL MODE:
Headline: "Building something that shouldn't exist yet?"
Sub-copy: "We answer every email. Tell us what you are working on.
We will get back inside two business days."
Primary button: "Pitch us"
Links to: mailto:info@whatsnext.digital?subject=Pitch%20via%20WND
No secondary button in capital mode.

OPERATOR MODE:
Headline: "Ready to move?"
Sub-copy: "We work with founders and operators who are already
in the arena. Not looking for the entrance."
Primary button: "Engage with us"
Links to: mailto:info@whatsnext.digital?subject=Operator%20Engagement
Secondary button: "Book a call"
Links to: https://calendly.com/whatsnext (placeholder, replace when live)

Both modes:
Tagline at the bottom of the section:
"Betting on the people building what's next."
In var(--muted) color, Space Mono font.

### Fix 3: Chippy panel copy for Connect stop

CAPITAL mode panel:
Headline: "Let's talk about what you're building."
Bullets:
- We read every pitch. No deck required to start.
- We move fast when something is right.
- We have been on your side of the table.
Stat line: "Angel through Series B · $50K to $2M"

OPERATOR mode panel:
Headline: "Let's get in the work."
Bullets:
- Fractional, project, or retainer.
- We only engage where we can make a real difference.
- No retainer theater.
Stat line: "$400M+ launched · still building"

### Fix 4: Section visual treatment
The Connect section should feel like a closing moment,
not just another content page.

Add these ambient elements:
- Background should have a very subtle radial gradient
  that feels warmer and more inviting than the other sections
  (slightly lighter center, dark edges)
- The tagline at the bottom should have a slow fade-in animation
  that fires on arrival at this stop
- The headline should be the largest text on this page,
  clamp(48px, 8vw, 120px), Archivo 900

---

## Success criteria

- Chippy is down 30% from the top, not jammed in corner
- Capital and operator show completely different headlines and CTAs
- Tagline "Betting on the people building what's next." present in both modes
- Chippy panel copy is mode-specific and compelling
- Section feels like a cinematic closing moment
- No commits made

---

## Do not commit. Show me what you have when done and I will review.
