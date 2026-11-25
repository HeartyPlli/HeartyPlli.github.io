export const WIDTH = 320;
export const HEIGHT = 220;
export function createGame() {
  return { rabbit: 160, items: [], score: 0, lives: 3, remaining: 30, spawnIn: 0.5, status: "ready", flash: 0 };
}
export function moveRabbit(game, x) { game.rabbit = Math.max(22, Math.min(WIDTH - 22, x)); }

// The simulation is independent of canvas so scoring and collisions can be verified.
export function stepGame(game, delta, direction = 0, random = Math.random) {
  if (game.status !== "playing") return;
  const dt = Math.min(Math.max(delta, 0), 0.05);
  moveRabbit(game, game.rabbit + direction * 190 * dt);
  game.remaining = Math.max(0, game.remaining - dt);
  game.flash = Math.max(0, game.flash - dt);
  game.spawnIn -= dt;
  if (game.spawnIn <= 0) {
    const roll = random();
    game.items.push({ type: roll < 0.45 ? "strawberry" : roll < 0.8 ? "candy" : "bomb", x: 24 + random() * (WIDTH - 48), y: -12 });
    game.spawnIn = 1.25;
  }
  game.items = game.items.filter((item) => {
    item.y += 42 * dt;
    if (item.y >= 178 && item.y <= 197 && Math.abs(item.x - game.rabbit) < 26) {
      if (item.type === "bomb") { game.lives = Math.max(0, game.lives - 1); game.flash = 0.35; }
      else game.score += 1;
      return false;
    }
    return item.y < HEIGHT + 12;
  });
  if (!game.remaining || !game.lives) game.status = "done";
}
