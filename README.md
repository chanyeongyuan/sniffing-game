# Sniffing

A self-contained browser game about HubSpot-style multi-touch attribution and pathfinder routing.

Open `index.html` in a browser to play.

Controls:
- Move with arrow keys or WASD.
- Press `P` or the Pathfind button to reveal the recommended conversion route.
- Press the Sales Stage button to switch into Stage 2.
- In Stage 2, press `B` or the Breeze button after collecting Breeze Agent to delay risk bombs.
- On touch screens, use the on-screen directional pad and `P` button.

Game loop:
- Play as Growth Gabby, an original fire-lizard mascot with a Breeze-style spark in the tail flame.
- Collect touchpoints: Email, Ads, Webinar, Review, and Sales Call.
- Answer four save point questions about lead volume, budget, systems, and drop-off.
- Watch the lead score, journey math, and revenue credit update as milestones are passed.
- Use Pathfinder to route through high-value steps and save points toward conversion.
- Reach the conversion portal after at least three journey signals.

Stage 2:
- Switch to the space pipeline for a Bomberman-style sales stage.
- Collect sales sequences and advance smart deal stages.
- Avoid timed deal-risk bombs. Explosions reduce deal health, subtract 10 deal-score points, and can lose the deal.
- Collect Breeze Agent to delay bombs, summarize objections, and help close the deal.

Files:
- `index.html` contains the game shell.
- `styles.css` contains the retro UI system.
- `src/game.js` contains the map, movement, pathfinding, attribution model, and canvas rendering.
- `assets/concept.png` is the generated visual concept used as the design reference.
