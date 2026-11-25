import { HEIGHT, WIDTH } from "./snackGame";

const sprites = {
  rabbit: ["...ww....ww...", "...wpw..wpw...", "...wpw..wpw...", "...www..www...", "...wwwwwww...", "..wwwwwwwww..", "..wkwwwwwkw..", "..wppwnwppw..", "...wwwwwww...", "..wwwwwwwww..", ".wwwwwwwwwww.", ".wwwwwwwwwww.", "..wwwwwwwww..", ".www.....www."],
  strawberry: ["....gg.g....", "..ggggggg...", "...grrrg....", "..rrrrrrrr..", ".rryrrryrrr.", ".rrrrrrrrrr.", "..rrryrryr..", "..ryrrrrrr..", "...rrrrrr...", "....ryrr....", ".....rr....."],
  candy: ["............", "pp.......pp.", "ppp.wwwwppp.", ".ppwwppwwp..", "..wwppppww..", "..wppwwppw..", "..wwppppww..", ".ppwwppwwp..", "ppp.wwwwppp.", "pp.......pp."],
  bomb: ["......yy....", ".....yo.....", ".....s......", "...kkkkk....", "..kkkkkkk...", ".kksskkkkk..", ".kkskkkkkk..", ".kkkkkkkkk..", ".kkkkkkkkk..", "..kkkkkkk...", "...kkkkk...."]
};
const palette = { w: "#fff4e7", p: "#f494bb", k: "#171726", n: "#c15b84", r: "#ef5578", g: "#70bd86", y: "#ffe6a0", o: "#f49058", s: "#70758b" };

export function drawSprite(ctx, type, x, y, scale = 1) {
  const rows = sprites[type];
  rows.forEach((row, rowIndex) => [...row].forEach((pixel, column) => {
    if (palette[pixel]) { ctx.fillStyle = palette[pixel]; ctx.fillRect(Math.round(x + column * scale), Math.round(y + rowIndex * scale), scale, scale); }
  }));
}

export function drawGame(ctx, game) {
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#20243b"; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#d2bcf0";
  [[20, 20], [80, 34], [146, 16], [245, 25], [292, 60], [45, 90], [212, 75]].forEach(([x, y]) => ctx.fillRect(x, y, 2, 2));
  ctx.fillStyle = "#ffdfad"; ctx.fillRect(269, 14, 17, 17); ctx.fillStyle = "#20243b"; ctx.fillRect(265, 11, 15, 15);
  ctx.fillStyle = "#30324e";
  for (let x = 0; x < WIDTH; x += 30) ctx.fillRect(x, 150 - (x % 60), 24, 70);
  ctx.fillStyle = "#55745f"; ctx.fillRect(0, 205, WIDTH, 15);
  ctx.fillStyle = "#8db58a"; ctx.fillRect(0, 205, WIDTH, 3);
  ctx.fillStyle = "#b8d7aa";
  for (let x = 6; x < WIDTH; x += 27) ctx.fillRect(x, 213, 4, 2);
  game.items.forEach((item) => drawSprite(ctx, item.type, item.x - 6, item.y - 6));
  drawSprite(ctx, "rabbit", game.rabbit - 13, 169, 2);
  ctx.fillStyle = "#b87f64"; ctx.fillRect(game.rabbit - 22, 190, 44, 11);
  ctx.fillStyle = "#e7bc85"; ctx.fillRect(game.rabbit - 24, 187, 48, 4);
  ctx.fillStyle = "#f7d7a5";
  for (let x = game.rabbit - 18; x < game.rabbit + 22; x += 8) ctx.fillRect(x, 193, 3, 5);
  if (game.flash) { ctx.fillStyle = "rgba(255,100,120,.22)"; ctx.fillRect(0, 0, WIDTH, HEIGHT); }
}
