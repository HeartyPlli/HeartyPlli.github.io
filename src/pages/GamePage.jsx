import { useEffect, useRef, useState } from "react";
import PageBanner from "../components/PageBanner";
import { createGame, HEIGHT, moveRabbit, stepGame, WIDTH } from "../lib/snackGame";
import { drawGame, drawSprite } from "../lib/snackArt";

const BEST_KEY = "bunny-snack-best";
const initialHud = { score: 0, lives: 3, seconds: 30 };

function PixelIcon({ type }) {
  const canvas = useRef(null);
  useEffect(() => { const ctx = canvas.current.getContext("2d"); ctx.clearRect(0, 0, 16, 16); drawSprite(ctx, type, 1, 1); }, [type]);
  return <canvas ref={canvas} width="16" height="16" className="snack-icon" aria-hidden="true" />;
}

export default function GamePage() {
  const canvas = useRef(null);
  const game = useRef(createGame());
  const keys = useRef(new Set());
  const touchDirection = useRef(0);
  const lastHud = useRef("");
  const [status, setStatus] = useState("ready");
  const [hud, setHud] = useState(initialHud);
  const [best, setBest] = useState(() => { try { const value = Number(localStorage.getItem(BEST_KEY)); return Number.isFinite(value) && value >= 0 ? value : 0; } catch { return 0; } });

  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    let frame;
    let previous = 0;
    const render = (now) => {
      const current = game.current;
      const direction = touchDirection.current || (Number(keys.current.has("ArrowRight") || keys.current.has("d")) - Number(keys.current.has("ArrowLeft") || keys.current.has("a")));
      stepGame(current, previous ? (now - previous) / 1000 : 0, direction);
      previous = now;
      drawGame(ctx, current);
      const nextHud = { score: current.score, lives: current.lives, seconds: Math.ceil(current.remaining) };
      const signature = JSON.stringify(nextHud);
      if (signature !== lastHud.current) { lastHud.current = signature; setHud(nextHud); }
      if (current.status === "done") setStatus("done");
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    const pause = () => {
      keys.current.clear(); touchDirection.current = 0;
      if (game.current.status === "playing") { game.current.status = "paused"; setStatus("paused"); }
    };
    const hidden = () => { if (document.hidden) pause(); };
    window.addEventListener("blur", pause);
    document.addEventListener("visibilitychange", hidden);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("blur", pause); document.removeEventListener("visibilitychange", hidden); };
  }, []);

  useEffect(() => {
    if (status === "done" && hud.score > best) {
      setBest(hud.score);
      try { localStorage.setItem(BEST_KEY, String(hud.score)); } catch { /* The game still works without storage. */ }
    }
  }, [status, hud.score, best]);

  function start() {
    game.current = { ...createGame(), status: "playing" };
    keys.current.clear(); touchDirection.current = 0;
    setHud(initialHud); setStatus("playing"); canvas.current.focus();
  }
  function pauseOrResume() {
    const next = game.current.status === "paused" ? "playing" : "paused";
    game.current.status = next; setStatus(next);
    keys.current.clear(); touchDirection.current = 0;
    if (next === "playing") canvas.current.focus();
  }
  function point(event) {
    if (game.current.status !== "playing") return;
    const rect = canvas.current.getBoundingClientRect();
    moveRabbit(game.current, (event.clientX - rect.left) / rect.width * WIDTH);
  }

  return <main id="main-content" className="page-main inner-page">
    <PageBanner eyebrow="A tiny pause in your day" title="Bunny Snack Catch">A little rabbit. A basket. A gentle shower of treats.</PageBanner>
    <section className="feature-panel snack-panel" aria-labelledby="snack-title">
      <div className="snack-heading"><div><p className="eyebrow">Easy mode · 30 seconds</p><h2 id="snack-title">Something sweet is falling.</h2></div><span className="snack-best">Personal best: {best}</span></div>
      <div className="snack-legend"><span><PixelIcon type="strawberry" /> Strawberry +1</span><span><PixelIcon type="candy" /> Candy +1</span><span><PixelIcon type="bomb" /> Bomb −1 heart</span></div>
      <div className="snack-hud"><span>Treats <b>{hud.score}</b></span><span aria-label={`${hud.lives} hearts remaining`} className="snack-hearts">{"♥".repeat(hud.lives)}<span>{"♡".repeat(3 - hud.lives)}</span></span><span>Time <b>{hud.seconds}s</b></span></div>
      <div className="snack-stage">
        <canvas ref={canvas} width={WIDTH} height={HEIGHT} tabIndex="0" aria-label="Bunny Snack Catch play area. Use left and right arrows or A and D to move, and space to pause." aria-describedby="snack-help" onKeyDown={(event) => {
          const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
          if (["ArrowLeft", "ArrowRight", "a", "d"].includes(key)) { event.preventDefault(); keys.current.add(key); }
          if (event.code === "Space" && !event.repeat && ["playing", "paused"].includes(game.current.status)) { event.preventDefault(); pauseOrResume(); }
        }} onKeyUp={(event) => keys.current.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key)} onBlur={() => { keys.current.clear(); }} onPointerMove={point} onPointerDown={(event) => { canvas.current.focus(); canvas.current.setPointerCapture(event.pointerId); point(event); }}>Your browser needs canvas to play this game.</canvas>
        {status !== "playing" && <div className="snack-overlay"><div><p className="eyebrow">{status === "done" ? "All done, little bunny" : status === "paused" ? "Take your time" : "Welcome to the snack garden"}</p><h3>{status === "done" ? `${hud.score} sweet treats!` : status === "paused" ? "A cozy little pause." : "Catch a little happiness."}</h3><p>{status === "done" ? hud.lives ? "A lovely little haul. Fancy another round?" : "The bombs got your basket. Let’s try again!" : "Catch strawberries and candy. Let the bombs fall past."}</p><button type="button" className="button primary" onClick={status === "paused" ? pauseOrResume : start}>{status === "paused" ? "Resume game" : status === "done" ? "Play again" : "Let’s play"}</button></div></div>}
      </div>
      <div className="snack-controls"><div className="snack-move-controls">{[-1, 1].map((direction) => <button key={direction} type="button" aria-label={direction < 0 ? "Move rabbit left" : "Move rabbit right"} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); touchDirection.current = direction; }} onPointerUp={() => { touchDirection.current = 0; }} onPointerCancel={() => { touchDirection.current = 0; }} onLostPointerCapture={() => { touchDirection.current = 0; }} onClick={(event) => { if (event.detail === 0 && game.current.status === "playing") moveRabbit(game.current, game.current.rabbit + direction * 28); }}>{direction < 0 ? "Move left" : "Move right"}</button>)}</div><div>{["playing", "paused"].includes(status) && <button type="button" className="button secondary" onClick={pauseOrResume}>{status === "paused" ? "Resume" : "Pause"}</button>}{status !== "ready" && <button className="button secondary" type="button" onClick={start}>Restart</button>}</div></div>
      <p id="snack-help" className="section-intro">Move your mouse, drag on the garden, hold the buttons, or use ← → / A D. Missing a treat is okay. You have 3 hearts!</p>
      <p className="sr-only" role="status">{status === "done" ? `Round finished. You caught ${hud.score} treats.` : status === "paused" ? "Game paused." : status === "playing" ? "Game started." : "Ready to play."}</p>
    </section>
  </main>;
}
