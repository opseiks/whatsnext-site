# BRIEF-07-BUILTWITH
## Session brief for Built With section
## Read CLAUDE.md and DESIGN.md before starting. Do not commit anything.

---

## Project context

This is the whatsnext.digital React rebuild. The site has 8 stops
navigated by Chippy, a persistent poker chip character who travels
between sections. The site has two modes: capital and operator.
Each mode has different visual language and content framing.

Capital mode: gold accents, premium, editorial, boardroom energy.
Operator mode: chartreuse accents, edgy, game UI energy.

Built With is stop 06. Chippy is on the right corner at this stop.

---

## Current state

Built With section has a basic logo grid with placeholder slots.
Chippy is jammed too high against the top-right corner.
The partner list needs updating.
The two modes need to be architecturally different experiences,
not just color swaps.

---

## Fix 1: Chippy position

Chippy is sitting too high on this stop.
Match the vertical position of the Practice stop (stop 04).
Same distance from the top as Practice.
Same clearance from the right edge as Practice: at least 20px.
Same chip and panel size as Practice.
Check the CSS for stop 04 and replicate the top value for stop 06.

---

## Fix 2: Partner logo assets

All 11 logo files live at /public/assets/partners/
File naming convention: company name lowercased,
spaces replaced with hyphens, .png extension.

wms-gaming.png
scientific-games.png
aristocrat.png
respawn-entertainment.png
nexon.png
xbox-game-studios.png
avalanche-studios.png
aruze-gaming-global.png
burn-ghost.png
joingo.png
planet-bingo.png

If a logo file does not exist, show the company name as text
in the appropriate accent color. Never break the layout
for a missing asset. Graceful fallback always.

---

## Fix 3: Capital mode — boardroom table

A dark premium surface fills the content area below the headline.
The surface has a very subtle reflection beneath each card,
like looking down at a polished conference table in a dark room.

11 logo cards arranged in a clean grid on the surface.
Each card is a flat dark rectangle with a subtle gold border.
The logo PNG sits centered inside the card with padding.
No text labels needed. The logos speak for themselves.

On hover each card:
- Lifts slightly with a drop shadow suggesting physical elevation
- Tilts very slightly toward the viewer with CSS perspective
- A faint gold glow appears around the border
- Transition smooth 300ms, premium feel

Overall mood: a serious room where serious companies have sat.
Clean, dark, gold accents. No animation when idle.
Stillness is the statement.

---

## Fix 4: Fix 4: Operator mode — Three.js Dyson ring
Build a Three.js scene that fills the content area.
Use React Three Fiber (@react-three/fiber and @react-three/drei).
If not installed, install them first.
The camera is fixed at the center looking forward.
Do NOT move the camera. The ring moves around the camera.
Create 3 complete sets of all 11 logos, 33 logo instances total.
Distribute them around a full 360 degree ring.
Each instance of a logo is placed at a slightly different
latitude and orbital radius from its other two copies
so the ring feels like a natural asteroid belt,
not three obvious identical layers.
The variation should be subtle. Think Dyson ring not solar system.
All logos stay within a reasonable band around the equator.
No logo should be so far away it disappears.
No logo should be so close it overwhelms the view.
The ring rotates continuously and slowly.
At any given moment multiple logos should be visible
passing through the camera's field of view.
Each logo is a flat PlaneGeometry card in 3D space.
Logo PNG is the texture. Cards always face the camera via lookAt.
Cards scale slightly larger as they pass closest to camera.
Chartreuse edge glow intensifies as a card approaches.
Cards further away are slightly smaller and dimmer.
Ambient particle field of tiny dots suggesting stars or signal noise.
Background color #09090b matching the site.
On click a card:

Smoothly pulls toward the camera
Enlarges to show detail
Company name appears below in Space Mono chartreuse
Click again or elsewhere to release back to orbit

Contain the scene within the content area left of Chippy.
Do not overflow into the Chippy panel area.
Mood: you are inside the network. These are co-conspirators.

---

## Fix 5: Content area padding

Add 10% top and 10% bottom padding to the content area
on both modes so the headline and grid breathe properly.

---

## Success criteria

- Chippy vertical position matches Practice stop exactly
- Capital mode feels like a premium boardroom surface
- Operator mode has a working Three.js orbital ring
- All 11 logos load from /public/assets/partners/
- Graceful text fallback if any logo is missing
- Both modes feel architecturally different, not just different colors
- No layout overflows into Chippy panel area

---

## Do not commit. I will review when done.
