# BRIEF-11-SCROLL-MOBILE
## Session brief for scroll/mobile layout and bot prerendering
## Read CLAUDE.md and DESIGN.md before starting. Do not commit anything.

---

## Project context

The site currently runs in cinematic mode only.
Eight full-viewport stops, Chippy travels between them,
no standard scrolling. This works beautifully on desktop
but breaks on mobile and is invisible to bots and crawlers.

This brief adds a scroll layout that:
1. Activates automatically below 768px viewport width
2. Can be manually toggled via a button in the topbar
3. Serves as the prerendered HTML for bots and SEO

---

## How larrypacey.com solved this

Reference: ~/projects/larrypacey-site/scripts/prerender.mjs
Reference: ~/projects/larrypacey-site/src/App.tsx (mode switching logic)

The same pattern applies here. Study those files before building.

---

## Fix 1: Mode detection and toggle

Add a mode state to App.tsx: 'cinematic' or 'scroll'.

Auto-detection logic:
- On mount check window.innerWidth
- Below 768px: default to scroll mode
- 768px and above: default to cinematic mode
- Add resize listener to switch automatically if window resizes

Manual toggle:
- Add a small toggle button to the TopBar component
- Position it next to the Capital/Operator mode toggle
- Label: "SCROLL" and "CINEMATIC" 
- Active mode is highlighted
- Clicking switches modes instantly
- Store the preference in localStorage so it persists
  key: 'wnd-layout-mode'

The toggle is always visible in both modes.
This serves as a debug tool and accessibility option.

---

## Fix 2: Scroll layout — overall structure

In scroll mode the page becomes a standard single-page
vertical scroll. All 8 sections stack vertically.
The world container translateY mechanic is disabled.
Standard browser scroll applies.

Layout structure in scroll mode:
- Sticky topbar at top (same as cinematic)
- Sections stack in order: Hero, Proof, Thesis, Portfolio,
  Practice, Engage, Built With, Connect
- Each section has min-height: 100vh except Connect
- Standard scroll between sections

The mode toggle (Capital/Operator) still works in scroll mode.
Switching modes re-renders the current content in place.

---

## Fix 3: Chippy in scroll mode — floating smart chip

Chippy does NOT travel in scroll mode.
He becomes a persistent floating chip in the bottom-right corner.

Size: 64px x 64px
Position: fixed, bottom: 24px, right: 24px, z-index: 100
Default face: chip-wnd-f.png
Idle: gentle bob animation, same as desktop but smaller

Section awareness:
Use an IntersectionObserver to detect which section
is currently most visible in the viewport.
When the visible section changes:
- Chippy briefly pulses (scale 1.0 to 1.15 and back, 400ms)
- Flips to chip-exclaim-f.png for 2 seconds
- Returns to chip-wnd-f.png
- A small notification dot appears on the chip

On click or tap:
- A panel slides up from the bottom of the screen (mobile)
  or slides out to the left (tablet/desktop scroll)
- Panel shows the contextual copy for the current section
- Same PCOPY data as the cinematic version
- Mode-aware: capital or operator copy based on current mode
- Panel has an X button to close it
- Closing returns Chippy to idle

The panel in scroll mode is simpler than cinematic:
- No absorb/emerge animation
- Simple slide in/out
- Same content and styling as cinematic panel
- Max width 320px
- Positioned above the chip

---

## Fix 4: Hero section in scroll mode

The hero video plays full bleed behind the copy.
Hero section height: 100vh.

All hero copy is visible immediately on load:
- Eyebrow label
- Main headline with "future" in Cormorant italic chartreuse
- Subhead "WE BET ON THE PEOPLE BUILDING WHAT'S NEXT."

Chippy appears on the hero at full size, same as cinematic phase 2.
He is present immediately. No phase 1 delay. No click to advance.
His panel is open with the mode selection question.

The two choice buttons inside the panel must be larger and more
prominent than the cinematic version. People scroll fast.
The buttons must stop them and feel like a real decision.
Make the choice buttons full width inside the panel,
taller than normal, with clear labels and visual weight.

WHEN A MODE IS SELECTED — two animations fire simultaneously:

Animation 1: Auto-scroll to Proof section
Smooth scroll to the Proof section below.
Duration: 800ms. Easing: cubic-bezier(0.4, 0, 0.2, 1).
The page slides down to the next section automatically.

Animation 2: Chippy shrinks to corner
While the page scrolls, Chippy's panel absorbs into him
(same absorb mechanic as cinematic, scales to 5% opacity 0).
Then Chippy himself shrinks and flies to the bottom-right corner.
He scales from full size down to 64px while moving to his
fixed corner position. Duration: 600ms.
On arrival at the corner he does his personality bounce once
to signal he has landed.

WHEN VISITOR SCROLLS WITHOUT CHOOSING:

If the visitor scrolls down without making a selection:
- The panel fades out and dissolves as they scroll
- Chippy flies to the bottom-right corner simultaneously
- Default mode is set to Operator automatically
- Chippy shows the exclamation face briefly on arrival
  to signal he has context for the current section

The panel dissolve on scroll should be tied to scroll position.
As the hero scrolls out of view, the panel opacity decreases
proportionally. At 50% scroll out the panel is gone.
At 100% scroll out Chippy is in the corner.

Default is Operator if no selection made.

---

## Fix 5: Proof section in scroll mode

Full width layout. No left panel reserved for Chippy.
Content takes the full width minus standard padding.

Headline: "Numbers we earned. Not managed. Earned."
Billboard: full width, same mechanic as cinematic
Queue tiles: full width below the billboard
The billboard auto-cycles as in cinematic mode.

---

## Fix 6: Thesis section in scroll mode

Capital mode:
Editorial cards stack vertically. Each belief is a full-width
card with the image placeholder taking the top portion
and the headline and sub-copy below it.
Cards have subtle scroll-triggered fade-in animations.

Operator mode:
The card fan does not work on scroll/mobile.
Replace with a horizontal scrollable strip of cards.
Each card is the same design as the cinematic fan cards.
User swipes horizontally to browse beliefs.
A scroll indicator shows there are more cards.

---

## Fix 7: Portfolio section in scroll mode

2-column grid on tablet (768px+).
1-column grid on mobile (below 480px).
Cards retain their slat animation and hover behavior.
Video behind slats still loads if files exist.

---

## Fix 8: Practice section in scroll mode

Capital mode:
Standard vertical list with hairline rules.
Same hover behavior as cinematic.

Operator mode:
2x3 grid of tactical cards.
Cards retain their floating animation.
Hover scale effect works on desktop scroll.
On mobile: tap to expand card detail instead of hover.

---

## Fix 9: Engage section in scroll mode

Both cards stack vertically regardless of mode.
Capital card on top, operator card below.
Or show only the active mode card full width.
Use the same card designs as cinematic.

---

## Fix 10: Built With section in scroll mode

Capital mode:
Logo grid in standard CSS grid layout.
3 columns on tablet, 2 columns on mobile.
Same hover lift effect as cinematic.

Operator mode:
The Three.js orbital ring.
Keep it as-is if the device can handle WebGL.
Detect WebGL support and fall back to the capital grid
if WebGL is not available.
This is a graceful degradation, not a requirement to fix.

---

## Fix 11: Connect section in scroll mode

Full width layout. Headline, subhead, tagline, buttons.
Footer with socials below.
Same mode-split content as cinematic.

---

## Fix 12: Bot prerendering

After the scroll layout is working, add build-time prerendering.

Create scripts/prerender.mjs in the project root.
Reference ~/projects/larrypacey-site/scripts/prerender.mjs
as the model for this implementation.

The prerender script should:
1. Build the project first (npm run build)
2. Load the scroll layout (not cinematic) as the prerender target
3. Default to operator mode for the prerendered HTML
4. Write the full rendered HTML to dist/index.html
5. Ensure all section content is in the DOM for crawlers

Update package.json build script to run prerender after vite build:
"build": "tsc -b && vite build && node scripts/prerender.mjs"

---

## Success criteria

- Below 768px: scroll mode activates automatically
- Above 768px: cinematic mode activates automatically  
- Toggle button in topbar switches between modes manually
- localStorage remembers the manual preference
- Chippy floats in bottom-right corner in scroll mode
- Chippy pulses and shows exclamation face on section change
- Chippy panel slides out with contextual copy on click
- All 8 sections render correctly in scroll mode
- Mode switching (capital/operator) works in scroll mode
- Build-time prerender generates full HTML for bots
- Google Search Console can crawl all content

---

## Do not commit. I will review when done.
