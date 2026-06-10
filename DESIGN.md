# DESIGN.md — whatsnext.digital
## Visual system spec. Claude Code reads this before generating any component.

---

## Design philosophy

This site is NOT larrypacey.com. Different entity, different purpose, same quality bar.

**The feeling:** A private room where serious operators move. Not a VC site.
Not a gaming studio. Not a startup landing page. Think: high-end Macau private room
meets F1 war room meets Tron ARES UI. Cinematic, premium, alive with movement.

**References:** F1, Apple, Ferrari, Brunello Cucinelli, Loro Piana, Prada,
Scott Pilgrim vs The World, Tron Legacy ARES UI, Free Guy, Ready Player One, Pixels.

**The operator mode** is a game you are playing from inside.
**The capital mode** is a trophy room where serious money moves quietly.
These are two different rooms, not two different color palettes.
A visitor must be able to tell which mode they are in with color turned off.
Layout, typography, and component shapes must diverge visibly between modes.

### The hero video rule
The hero video plays at full brightness. NO dimmer overlay. NO tint layer.
If copy legibility needs help, use text-shadow or a gradient behind the text only.
Never add a full-screen overlay that dims or tints the video.

### The alive rule
Every section must have at least one element with active motion.
Counting numbers. Staggered arrivals. Cycling content. Hover states.
Background drift. Chippy idling. Something always moves.
Stillness is earned, never accidental.

---

## Color tokens

```css
--black:    #09090b    /* base background — deeper than larrypacey.com navy */
--paper:    #ece7da    /* primary text */
--muted:    #9a958a    /* secondary text */
--muted2:   #6a665e    /* tertiary text */
--line:     rgba(255,255,255,.10)  /* hairline rules and borders */

--gold:     #c8a24b    /* capital mode accent — structural gold */
--gold-hi:  #f3dd9b    /* capital highlight */
--gold-lo:  #7a5a22    /* capital shadow */

--teal:     #1f9c89    /* secondary accent */
--teal-hi:  #46cdb6    /* teal highlight */

--signal:   #b9f23a    /* chartreuse — the live signal. operator mode accent.
                          use for: things that move, glow, mark what is alive */
```

### Mode-aware accent system
```
Capital mode:  --acc = gold,    --acc-hi = gold-hi,  --acc-glow = rgba(200,162,75,.42)
Operator mode: --acc = signal,  --acc-hi = #d4ff4a,  --acc-glow = rgba(185,242,58,.48)
```

All accent-colored elements use CSS variables so mode switching recolors automatically.

---

## Typography

### Display headlines
```
font-family: 'Archivo', system-ui, sans-serif
font-weight: 900
letter-spacing: -0.025em to -0.035em
line-height: 0.88 to 0.93
font-size: clamp(32px, 5.2vw, 82px) — scale with viewport
```

### Italic accent within headlines
```
font-family: 'Cormorant', serif
font-style: italic
font-weight: 600
color: var(--signal)   /* chartreuse always, not mode-aware */
letter-spacing: 0
padding: 0 0.04em
```

### Body copy
```
font-family: 'Archivo', system-ui, sans-serif
font-weight: 400
font-size: clamp(15px, 1.4vw, 18px)
line-height: 1.52 to 1.56
color: var(--muted)
```

### Labels and metadata
```
font-family: 'Space Mono', monospace
font-size: 10px to 12px
letter-spacing: 0.12em to 0.2em
text-transform: uppercase
color: var(--acc) or var(--muted)
```

### Operator mode game UI labels ONLY
```
font-family: 'Press Start 2P', monospace
font-size: 7px to 13px
color: var(--signal)
text-shadow: 0 0 12px var(--signal)
```

### Eyebrow pattern (used above every section headline)
```
display: flex
align-items: center
gap: 12px
color: var(--muted)
font-family: Space Mono
font-size: 11.5px
letter-spacing: 0.18em
text-transform: uppercase
```
Includes: accent tick line (34px wide, var(--acc) color), bold section number, plain section name.

---

## Animation principles

**Everything moves. Stillness is earned, not default.**

### Easing curves
```
Travel/navigation: cubic-bezier(0.72, 0, 0.2, 1)   — fast out, gentle settle
Panel emerge:      cubic-bezier(0.2, 0.7, 0.2, 1)   — springy arrival
Panel absorb:      cubic-bezier(0.55, 0, 0.9, 0.5)  — quick snap inward
Card deal:         cubic-bezier(0.2, 0.7, 0.2, 1)
Billboard capital: cubic-bezier(0.6, 0, 1, 0.6) out, cubic-bezier(0, 0.6, 0.3, 1) in
Billboard operator: cubic-bezier(0.7, 0, 1, 0.7) squeeze, cubic-bezier(0, 0.7, 0.3, 1) expand
```

### Timing
```
Section travel:    1050ms
Panel absorb:      320ms
Panel emerge:      480ms
Chip flip:         300ms each half (600ms total)
Chip travel seq:   150ms per frame
Billboard capital: 360ms exit, 420ms enter
Billboard operator: 220ms squeeze, 260ms expand
Billboard scramble: 620ms character lock
Card deal exit:    380ms
Thesis editorial:  300ms fade out, 360ms fade in
Idle chip cycle:   4200ms interval
Billboard cycle:   10000ms interval
Thesis cycle:      12000ms interval
```

### Grain overlay
Animated film grain using SVG feTurbulence. Position animates on 3-step loop at 1.1s.
Opacity: 0.38. Mix-blend-mode: overlay. Always present, never removed.

### Vignette
Fixed position. Box-shadow: inset 0 0 22vmin 7vmin rgba(0,0,0,.65). Always present.

---

## Layout system

### Navigation model
NOT a scrolling page. Eight full-viewport sections stacked vertically.
The `.world` container translates on Y axis: `translateY(-N * 100vh)` where N = stop number.
Transition: `transform 1.05s cubic-bezier(0.72, 0, 0.2, 1)`.

### Chippy rig positioning
Fixed position, z-index 50. Width 382px at hero, 340px at corner stops.
See CLAUDE.md for exact stop-by-stop positions.

### Section padding patterns
```
Full-width sections (Portfolio, Practice):
  padding: 76px 52px 28px 60px

Left-panel-reserved sections (Engage, Connect):
  padding: 76px 52px 32px 396px   /* 396px = rig width + gap */

Right-panel-reserved sections (Built With):
  padding: 76px 396px 32px 60px

Proof (content right):
  position: absolute right 52px, left calc(23% + 216px)
```

---

## Component-specific design specs

### Billboard (Proof stop)

**Frame:**
- Background: rgba(6,6,10,.92)
- Border: 1px solid rgba(200,162,75,.22) for capital, rgba(185,242,58,.2) for operator
- Border-radius: 8px
- Box-shadow: 0 22px 56px rgba(0,0,0,.58), inset 0 0 0 1px rgba(255,255,255,.04)
- Corner L-bracket marks in var(--acc)

**Capital mode display:**
- Big value: Archivo 900, clamp(58px, 10vw, 114px), color var(--gold-hi)
- Text-shadow: 0 5px 0 rgba(0,0,0,.5), 0 0 70px rgba(200,162,75,.42)
- Transition: fall forward (perspective rotateX 26deg + translateY 36px), rise from below

**Operator mode display:**
- Big value: Space Mono 700, clamp(50px, 8.5vw, 100px), color var(--signal)
- Chromatic aberration: 4px 0 0 rgba(255,30,100,.4), -4px 0 0 rgba(30,160,255,.4)
- Subtle flicker animation
- Dot-grid background pattern
- Scanline overlay
- Transition: horizontal squeeze (scaleX to 0.04) then character scramble

**Queue tiles:**
- Capital: clean bordered tiles, gold on active
- Operator: chamfered clip-path corners, chartreuse glow on active, Press Start 2P font

### Thesis card fan (operator only)

**Card dimensions:** min(380px, 36vw) width, aspect-ratio 5/7
**Card background:** linear-gradient(160deg, #0e1a0c, #060d05)
**Border:** 1.5px solid rgba(185,242,58,.25)
**Border-radius:** 14px
**Box-shadow:** 0 20px 60px rgba(0,0,0,.78)

**Card positions (4 cards in fan):**
```
Front (active): translate(-50%, -50%) rotateZ(0) scale(1.0)   z-index:10
Back 1:         translate(-50%+40px, -50%+12px) rotateZ(12deg) scale(0.87)  z-index:7
Back 2:         translate(-50%+74px, -50%+26px) rotateZ(23deg) scale(0.74)  z-index:4
Back 3:         translate(-50%-26px, -50%+6px)  rotateZ(-8deg) scale(0.93)  z-index:8
```

**Top 40% of card:** image/video placeholder zone. Dark tinted, dashed border.
**Exit animation:** flies left, rotateZ(-22deg), scale(0.65), opacity 0 over 380ms.

### Portfolio cards

**Grid:** 3 columns x 2 rows (responsive: 2 col when rig on left)
**Animated slat overlay:** repeating diagonal stripes, 12s slide animation
**Hover state:** slats fade to 22% opacity, card scales 1.025, description reveals
**Operator mode:** chamfered clip-path corners, Space Mono name in chartreuse with glow

### Practice list

Hairline rules above and below each item. On hover: item slides right 14px,
circle arrow fills with var(--acc). Transition: 0.25s ease.

### Panel

```
width: 382px (hero) / 340px (corner stops)
background: linear-gradient(160deg, rgba(20,20,24,.96), rgba(11,11,13,.95))
border: 1px solid var(--line)
border-radius: 12px
backdrop-filter: blur(10px)
box-shadow: 0 18px 42px rgba(0,0,0,.48), inset 0 1px 0 rgba(255,255,255,.05)
Left accent bar: 3px wide, var(--acc) color
```

**Bullet list style:**
- 7px circle dot, var(--signal) color, glow: 0 0 8px var(--signal)
- Font-size: 15px, line-height: 1.46, color: #d0cbbf

**Chat input placeholder (LLM slot — NOT wired up):**
- Dark input area, Space Mono font
- Send button: var(--acc) background
- Note below: "LLM chat · coming soon"

### Topbar

Height: ~68px. Fixed. z-index: 70.
Wordmark: Archivo 800, 20px, letter-spacing 0.06em. Slash in var(--acc).
Mode toggle: pill shape, border 1px solid var(--line), active state fills with var(--acc).

### Rail (right side stop dots)

Fixed right side. z-index: 60.
Dots: 6px circle. Active: var(--acc) fill with glow.
Labels: Space Mono 10px, appear on hover.

---

## What makes this site distinctive vs generic

1. **The chip IS the navigation.** Chippy is not decoration. He drives the experience.
2. **Two rooms, not two palettes.** Capital and operator feel architecturally different.
3. **The billboard scramble.** Operator mode stat transitions feel like a game scoreboard.
4. **The card fan.** Thesis beliefs dealt like poker hands in operator mode.
5. **Grain and vignette always on.** The cinematic texture never turns off.
6. **Nothing is static.** Grain animates. Billboard cycles. Chippy idles. Dots pulse.

---

## What this site is NOT

- Not larrypacey.com (different identity, do not borrow its teal/navy palette)
- Not a VC site (no white backgrounds, no sans-serif grid layouts)
- Not a gaming studio site (premium, not playful)
- Not a startup landing page (no hero illustration, no feature grid)
- Not cookie cutter (if it looks like a template, it is wrong)
