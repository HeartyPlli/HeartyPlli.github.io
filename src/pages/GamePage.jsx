import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import PageBanner from "../components/PageBanner";
import { addScore, databaseMode, getScores } from "../lib/database";
import { asset } from "../lib/assets";

const initialGame = { clueOneFound: false, clueTwoSolved: false, laptopUnlocked: false, drawerOpened: false, gameCompleted: false, gameStarted: false };
const avatars = ["cat", "bunny", "frog", "bear", "ghost", "star"];

export default function GamePage() {
  const [game, setGame] = useState(initialGame);
  const [elapsed, setElapsed] = useState(0);
  const [activePuzzle, setActivePuzzle] = useState(null);
  const [panel, setPanel] = useState({ title: "The room is waiting", message: "Press “Start Game” when you’re ready.", label: "Your answer" });
  const [answer, setAnswer] = useState("");
  const [completionTime, setCompletionTime] = useState(null);
  const [scoreRefresh, setScoreRefresh] = useState(0);
  const startedAt = useRef(0);
  const resultDialog = useRef(null);

  useEffect(() => {
    if (!game.gameStarted || game.gameCompleted) return undefined;
    const timer = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [game.gameStarted, game.gameCompleted]);

  function startGame() {
    startedAt.current = Date.now(); setElapsed(0); setCompletionTime(null); setAnswer(""); setActivePuzzle(null);
    setGame({ ...initialGame, gameStarted: true });
    setPanel({ title: "Explore the room", message: "Click the objects. A good detective checks even the quiet corners.", label: "Your answer" });
    if (resultDialog.current?.open) resultDialog.current.close();
  }

  function restartGame() {
    setGame(initialGame); setElapsed(0); setCompletionTime(null); setAnswer(""); setActivePuzzle(null);
    setPanel({ title: "The room is waiting", message: "Press “Start Game” when you’re ready.", label: "Your answer" });
    if (resultDialog.current?.open) resultDialog.current.close();
  }

  function showMessage(title, message) { setActivePuzzle(null); setAnswer(""); setPanel({ title, message, label: "Your answer" }); }
  function showPuzzle(type, title, message, label) { setActivePuzzle(type); setAnswer(""); setPanel({ title, message, label }); }

  function inspectObject(name) {
    if (!game.gameStarted || game.gameCompleted) return;
    if (name === "plant") {
      setGame((current) => ({ ...current, clueOneFound: true })); showMessage("A note under the plant!", "The tiny note says: “The laptop likes the word COZY.”");
    } else if (name === "bookshelf") {
      game.clueTwoSolved ? showMessage("Bookshelf solved", "The books already revealed the first half of the code: 31.") : showPuzzle("books", "Bookshelf pattern", "A bookmark asks: What number comes next? 2, 4, 6, …", "Next number");
    } else if (name === "laptop") {
      if (game.laptopUnlocked) showMessage("Laptop unlocked", "The screen shows a small golden key icon. It unlocks the drawer.");
      else if (!game.clueOneFound) showMessage("Password needed", "The laptop wants a short word. Search the room for a note.");
      else showPuzzle("laptop", "Laptop password", "Enter the word from the hidden note.", "Password");
    } else if (name === "clock") showMessage("The clock chimes softly", "A scratched message on the back says: “The final code begins with three.”");
    else if (name === "drawer") {
      if (game.drawerOpened) showMessage("Open drawer", "A card inside shows the second half of the code: 48.");
      else if (!game.laptopUnlocked) showMessage("Locked drawer", "This drawer needs a key. Maybe another object can unlock it.");
      else { setGame((current) => ({ ...current, drawerOpened: true })); showMessage("The drawer opens!", "Inside is a card with the number 48. That is the second half of the final code."); }
    } else if (name === "lockbox") {
      if (!game.clueTwoSolved || !game.drawerOpened) showMessage("Four-digit lock", "You still need both halves of the final code. Try the bookshelf, laptop, and drawer.");
      else showPuzzle("lockbox", "Final lock", "Combine the two code halves you discovered.", "Four-digit code");
    }
  }

  function checkAnswer(event) {
    event.preventDefault();
    const value = answer.trim().toLowerCase();
    if (activePuzzle === "books" && value === "8") {
      setGame((current) => ({ ...current, clueTwoSolved: true })); showMessage("Pattern solved!", "Correct! Behind book number 8 is a card showing 31—the first half of the final code.");
    } else if (activePuzzle === "laptop" && value === "cozy") {
      setGame((current) => ({ ...current, laptopUnlocked: true })); showMessage("Welcome back!", "The laptop unlocks and displays a golden key icon. The drawer clicks open.");
    } else if (activePuzzle === "lockbox" && value === "3148") {
      const finalSeconds = Math.max(1, Math.floor((Date.now() - startedAt.current) / 1000));
      setElapsed(finalSeconds); setCompletionTime(finalSeconds); setGame((current) => ({ ...current, gameCompleted: true }));
      showMessage("The box opens!", "A tiny star key unlocks the bedroom door. You escaped!");
      window.setTimeout(() => resultDialog.current?.showModal(), 0);
    } else setPanel((current) => ({ ...current, message: "Not quite. Look at your clues and try again." }));
  }

  const clues = [
    [game.clueOneFound, game.clueOneFound ? "Plant clue: laptop word is COZY" : "Plant clue"],
    [game.clueTwoSolved, game.clueTwoSolved ? "Bookshelf clue: first half is 31" : "Bookshelf puzzle"],
    [game.laptopUnlocked, game.laptopUnlocked ? "Laptop unlocked: drawer key found" : "Laptop password"],
    [game.drawerOpened, game.drawerOpened ? "Drawer clue: second half is 48" : "Drawer opened"]
  ];

  return <main id="main-content" className="page-main inner-page"><PageBanner eyebrow="A tiny browser game" title="🎮 Mini Escape Room">Explore the cozy study room and solve the gentle clues.</PageBanner><section className="feature-panel game-panel" aria-labelledby="game-title"><div className="feature-heading"><div><h2 id="game-title">The Cozy Study</h2><p>You’re studying when the door clicks shut. Find the four-digit code to escape.</p></div><div className="timer" aria-live="polite">Time: <span>{formatTime(elapsed)}</span></div></div><div className="game-actions"><button className="button primary" type="button" disabled={game.gameStarted && !game.gameCompleted} onClick={startGame}>Start Game</button><button className="button secondary" type="button" onClick={restartGame}>Restart Game</button></div><div className="game-layout"><div className="room" aria-label="Interactive cozy study room"><div className="room-window" aria-hidden="true"><span>☾</span><i /><i /><i /></div>{[["bookshelf", "📚", "Bookshelf"], ["plant", "🪴", "Plant"], ["laptop", "💻", "Laptop"], ["clock", "🕘", "Clock"], ["drawer", "🗄️", "Drawer"], ["lockbox", "🎁", "Locked box"]].map(([name, icon, label]) => <button key={name} className={`room-object ${name}`} type="button" disabled={!game.gameStarted || game.gameCompleted} onClick={() => inspectObject(name)}><span aria-hidden="true">{icon}</span><span>{label}</span></button>)}<div className="room-rug" aria-hidden="true">✦ ✧ ✦</div></div><aside className="puzzle-panel" aria-live="polite"><h3>{panel.title}</h3><p>{panel.message}</p>{activePuzzle && <form className="puzzle-form" onSubmit={checkAnswer}><label htmlFor="puzzle-answer">{panel.label}</label><input id="puzzle-answer" autoComplete="off" maxLength="12" autoFocus value={answer} onChange={(event) => setAnswer(event.target.value)} /><button className="button primary" type="submit">Try answer</button></form>}<ul className="clue-list" aria-label="Clues found">{clues.map(([found, text]) => <li key={text} className={found ? "found" : ""}>{found ? "✓" : "○"} {text}</li>)}</ul></aside></div></section><Leaderboard refreshKey={scoreRefresh} /><ResultDialog ref={resultDialog} completionTime={completionTime} onClose={() => resultDialog.current?.close()} onSaved={() => { setCompletionTime(null); setScoreRefresh((value) => value + 1); resultDialog.current?.close(); }} /></main>;
}

function Leaderboard({ refreshKey }) {
  const [scores, setScores] = useState([]); const [status, setStatus] = useState("Loading scores…");
  const loadScores = useCallback(async () => { try { const items = await getScores(); setScores(items); setStatus(items.length ? `Showing the ${items.length} fastest ${databaseMode} scores.` : databaseMode === "online" ? "No scores yet. Be the first to escape!" : "No local scores yet. Complete the game to add one."); } catch (error) { console.error("Leaderboard error:", error); setStatus("Could not load the online leaderboard. Please try again later."); } }, []);
  useEffect(() => { loadScores(); }, [loadScores, refreshKey]);
  return <section className="feature-panel leaderboard-panel" aria-labelledby="leaderboard-title"><div className="feature-heading"><div><p className="eyebrow">{databaseMode === "online" ? "ONLINE · shared between visitors" : "LOCAL · this browser only"}</p><h2 id="leaderboard-title">🏆 Escape Room Leaderboard</h2></div><button className="icon-button" type="button" aria-label="Refresh leaderboard" onClick={loadScores}>↻</button></div><p className="status-message" role="status">{status}</p><div className="table-wrap"><table><thead><tr><th>Rank</th><th>Avatar</th><th>Name</th><th>Time</th></tr></thead><tbody>{scores.length ? scores.slice(0, 10).map((score, index) => <tr key={score.id}><td>{index + 1}</td><td><img className="leaderboard-avatar" src={asset(`avatars/${avatars.includes(score.avatar) ? score.avatar : "star"}.svg`)} alt={`${score.avatar} avatar`} /></td><td>{String(score.player_name).slice(0, 20)}</td><td>{formatTime(Number(score.completion_time))}</td></tr>) : <tr><td colSpan="4">The leaderboard is waiting for its first player.</td></tr>}</tbody></table></div></section>;
}
const ResultDialog = forwardRef(function ResultDialog({ completionTime, onClose, onSaved }, ref) {
  const [name, setName] = useState(""); const [avatar, setAvatar] = useState("cat"); const [status, setStatus] = useState(""); const [saving, setSaving] = useState(false);
  async function save(event) { event.preventDefault(); const playerName = name.trim(); if (!playerName || playerName.length > 20 || !Number.isInteger(completionTime)) { setStatus("Complete the game and enter a name between 1 and 20 characters."); return; } setSaving(true); setStatus("Saving your score…"); try { await addScore({ player_name: playerName, avatar, completion_time: completionTime }); setStatus(databaseMode === "online" ? "Score saved to the shared leaderboard!" : "Score saved to the local practice leaderboard."); setName(""); setAvatar("cat"); window.setTimeout(onSaved, 500); } catch (error) { console.error("Score save error:", error); setStatus("Could not save your score. Please try again later."); } finally { setSaving(false); } }
  return <dialog className="modal result-modal" ref={ref} aria-labelledby="result-title"><h2 id="result-title">🎉 You Escaped!</h2><p>Your time: <strong>{formatTime(completionTime || 0)}</strong></p><form className="stacked-form" onSubmit={save}><label htmlFor="player-name">Enter your name</label><input id="player-name" maxLength="20" required autoComplete="nickname" value={name} onChange={(event) => setName(event.target.value)} /><fieldset><legend>Choose your avatar</legend><div className="avatar-grid">{avatars.map((item) => <button key={item} type="button" className={`avatar-option${avatar === item ? " selected" : ""}`} aria-pressed={avatar === item} onClick={() => setAvatar(item)}><img src={asset(`avatars/${item}.svg`)} alt="" /><span>Pixel {item[0].toUpperCase() + item.slice(1)}</span></button>)}</div></fieldset><p className="status-message" role="status">{status || (databaseMode === "online" ? "This score will be shared online." : "This score will be saved only in this browser.")}</p><div className="modal-actions"><button className="button primary" type="submit" disabled={saving}>Save Score</button><button className="button secondary" type="button" onClick={onClose}>Maybe later</button></div></form></dialog>;
});

function formatTime(value) { const seconds = Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0; return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`; }
