# BRIEF-04-PORTFOLIO
## Session brief for Portfolio section fixes
## Read CLAUDE.md and DESIGN.md before starting. Do not commit anything.

---

## Current state

Portfolio section shows 6 project cards in a grid with
animated diagonal slat overlay. Chippy is positioned at
top-left corner. Issues with layout proportions and
Chippy sizing and position.

---

## Fixes required — work through in order

### Fix 1: Layout proportions — portfolio grid vs Chippy
The portfolio grid is currently taking up too much horizontal space
leaving Chippy jammed and small on the side.

Split the horizontal space as follows:
- Portfolio grid: 65% of the page width (left side)
- Chippy rig and panel: 35% of the page width (right side)

The Chippy rig should be the same size as the Proof and Thesis stops.
Width 340px. Chip 132px. Properly positioned at top-right corner.
Not jammed. Not small. Same presence as other stops.

The grid should reflow to fit its 65% column comfortably.
3 columns at 2 rows should still work within that space.
If it does not fit cleanly, use 2 columns at 3 rows instead.

### Fix 2: Video behind grid cards
Each portfolio card should load a video file behind the
tinted diagonal slat overlay.

Wire each card to look for its video file at:
/public/assets/portfolio/

File names (1920x1080 MP4):
- Card 1 (AI Social Simulator): portfolio-ai-social.mp4
- Card 2 (Agentic Player-Support): portfolio-ai-engagement.mp4
- Card 3 (Real Money Gaming): portfolio-real-money.mp4
- Card 4 (Live Service Action RPG): portfolio-aaa-rpg.mp4
- Card 5 (Social and Web3 Gaming): portfolio-web3.mp4
- Card 6 (Hybrid Casual Studio): portfolio-casual.mp4

If the video file does not exist, fall back to the slat animation.
Do not break the card if the video is missing.
The video plays behind the tinted slat overlay, looping silently.
On hover the slats open and the video shows through more clearly.

---

## Success criteria

- Portfolio grid takes 65% of the page, Chippy owns the right 35%
- Chippy is same size and presence as Proof and Thesis stops
- Each card is wired to its video file with graceful fallback
- Cards still animate on hover whether video is present or not
- No layout feels jammed or disproportionate

---

## Do not commit. Show me what you have when done and I will review.
