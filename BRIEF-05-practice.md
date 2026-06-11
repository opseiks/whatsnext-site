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
Chippy and his panel are positioned too tight on the right side.
He needs to be given padding along the right side of the page to give him breathing room to the right. Similar padding he has on the thesis page
Also he should be the same size as he is on the thesis page. he and even his box may be smaller than the setup on the thesis page. it should match size wise.

### Fix 2: Content padding
the left column can Add 10% top, left, right and 10% bottom padding to the practice left column content area.
The list should not run to the top or bottom edges of the viewport.
Even the headline Where we get our hands dirty could come down a little.

### Fix 3: Mode differentiation
The Practice section currently looks nearly identical in both modes.
Capital and operator should feel visually different.

Capital mode:
- Numbers in var(--gold)
- Arrow buttons with gold border and fill on hover
- Generous spacing between rows
- Feels like a considered service menu

### Fix 4: Section alive rule for Capital mode only:
The Practice section currently has no motion beyond hover states.
Add at least one ambient motion element:
- The list items stagger-animate in on arrival at this stop
  (each row slides in from the left with a 60ms delay between rows)
- This fires once per arrival, not on loop


### Fix 5: New feature Operator layout

OPERATOR MODE: Replace the list with a 2x3 grid of tactical
mission cards with parallax floating energy.

PARALLAX AND MOTION:
Each card floats at a slightly different depth in 3D space.
Use CSS perspective on the grid container and give each card
a subtle translateZ value so they sit at different depths:
Card 1: translateZ(0px)
Card 2: translateZ(8px)
Card 3: translateZ(4px)
Card 4: translateZ(12px)
Card 5: translateZ(6px)
Card 6: translateZ(10px)

On mouse move over the section, the entire grid responds
to cursor position with a subtle tilt:
- Max rotateX: 6 degrees
- Max rotateY: 8 degrees
- Smooth lerp interpolation so it follows the mouse lazily
- Returns to neutral when mouse leaves

Each card also has its own slow idle float animation,
each on a different timing offset so they never move in sync:
- Gentle translateY oscillation between -4px and 4px
- Duration between 3s and 5s per card, staggered
- ease-in-out infinite loop

This gives the grid a living breathing presence,
like the cards are floating in space at different depths.

CARD DESIGN:
- Dark panel background #0a120a
- Chartreuse border 1px solid rgba(185,242,58,0.3)
- Chamfered clip-path corners
- Top: small status pill in Press Start 2P, 7px, chartreuse
- Animated pulse dot next to status
- Domain name in Space Mono bold, large
- Proof line in Space Mono 11px muted color
- On hover: border brightens, background lifts, second detail line slides up

CARD CONTENT:

Card 1: Future Impacting Investments
Status: ACTIVE
Proof: Operator-led checks from $50K to $2M
Detail: We only back what we would build ourselves

Card 2: Corporate Product Strategy
Status: ACTIVE
Proof: Led product org through award-winning product launch
Detail: People, process, product. In that order. Always.

Card 3: Game Design & Live Ops
Status: ACTIVE
Proof: Current soft launch of AI live service product
Detail: $400M+ shipped across console, mobile, and social

Card 4: Agentic Transformation
Status: ACTIVE
Proof: AI-native product systems built and deployed
Detail: We build the thing, not the deck about the thing

Card 5: Go-To-Market & Growth
Status: ACTIVE
Proof: Launched category-defining products in 3 industries
Detail: Advertising, games, casino. Each one from scratch.

Card 6: Community & Creator Stacks
Status: ACTIVE
Proof: Pioneered early free-to-play and in-game digital economies
Detail: Before the terminology existed

The grid should fill the content area comfortably.
Chippy stays on the right corner same as capital mode.

---

## Success criteria

- Chippy is vertically centered, not cramped at top
- 10% padding top and bottom on content
- Capital and operator modes read as different visual rooms
- List animates in on arrival with stagger
- Hover states work cleanly in both modes

---

## Do not commit. Show me what you have when done and I will review.
