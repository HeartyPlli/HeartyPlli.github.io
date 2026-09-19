import { addScore, databaseMode, getScores } from "./database.js";

const validAvatars = ["cat", "bunny", "frog", "bear", "ghost", "star"];

export function initializeLeaderboard() {
  const tableBody = document.querySelector("#leaderboard-body");
  const status = document.querySelector("#leaderboard-status");
  const modeLabel = document.querySelector("#leaderboard-mode");
  const scoreForm = document.querySelector("#score-form");
  const scoreStatus = document.querySelector("#score-status");
  const avatarButtons = document.querySelectorAll(".avatar-option");
  const resultModal = document.querySelector("#result-modal");
  let selectedAvatar = "cat";
  let completedTime = null;

  modeLabel.textContent = databaseMode === "online" ? "ONLINE · shared between visitors" : "LOCAL · this browser only";

  async function loadScores() {
    status.classList.remove("error");
    status.textContent = "Loading scores…";
    try {
      const scores = await getScores();
      renderScores(scores, tableBody);
      status.textContent = scores.length
        ? `Showing the ${Math.min(scores.length, 10)} fastest ${databaseMode} score${scores.length === 1 ? "" : "s"}.`
        : databaseMode === "online" ? "No scores yet. Be the first to escape!" : "No local scores yet. Complete the game to add one.";
    } catch (error) {
      console.error("Leaderboard error:", error);
      tableBody.replaceChildren();
      status.textContent = "Could not load the online leaderboard. Please try again later.";
      status.classList.add("error");
    }
  }

  avatarButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedAvatar = button.dataset.avatar;
      avatarButtons.forEach((option) => {
        const isSelected = option === button;
        option.classList.toggle("selected", isSelected);
        option.setAttribute("aria-pressed", String(isSelected));
      });
    });
  });

  window.addEventListener("gameCompleted", (event) => {
    completedTime = event.detail.elapsedSeconds;
    scoreStatus.textContent = databaseMode === "online" ? "This score will be added to the shared leaderboard." : "Supabase is not configured, so this score will be saved only in this browser.";
  });

  scoreForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const playerName = document.querySelector("#player-name").value.trim();
    if (!playerName || playerName.length > 20) {
      scoreStatus.textContent = "Please enter a name between 1 and 20 characters.";
      scoreStatus.classList.add("error");
      return;
    }
    if (!validAvatars.includes(selectedAvatar) || !Number.isInteger(completedTime) || completedTime < 1) {
      scoreStatus.textContent = "Complete the game before saving a score.";
      scoreStatus.classList.add("error");
      return;
    }

    const submitButton = scoreForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    scoreStatus.classList.remove("error");
    scoreStatus.textContent = "Saving your score…";
    try {
      await addScore({ player_name: playerName, avatar: selectedAvatar, completion_time: completedTime });
      completedTime = null;
      scoreStatus.textContent = databaseMode === "online" ? "Score saved to the shared leaderboard!" : "Score saved to the local practice leaderboard.";
      await loadScores();
      setTimeout(() => { if (resultModal.open) resultModal.close(); }, 700);
    } catch (error) {
      console.error("Score save error:", error);
      scoreStatus.textContent = "Could not save your score. Please try again later.";
      scoreStatus.classList.add("error");
    } finally {
      submitButton.disabled = false;
    }
  });

  document.querySelector("#refresh-scores").addEventListener("click", loadScores);
  loadScores();
}

function renderScores(scores, tableBody) {
  tableBody.replaceChildren();
  if (!scores.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "The leaderboard is waiting for its first player.";
    row.append(cell);
    tableBody.append(row);
    return;
  }

  scores.slice(0, 10).forEach((score, index) => {
    const row = document.createElement("tr");
    const rankCell = document.createElement("td");
    const avatarCell = document.createElement("td");
    const nameCell = document.createElement("td");
    const timeCell = document.createElement("td");
    const avatar = document.createElement("img");
    const safeAvatar = validAvatars.includes(score.avatar) ? score.avatar : "star";

    rankCell.textContent = String(index + 1);
    avatar.src = `../Image/avatars/${safeAvatar}.svg`;
    avatar.alt = `${safeAvatar} avatar`;
    avatar.className = "leaderboard-avatar";
    avatarCell.append(avatar);
    nameCell.textContent = String(score.player_name).slice(0, 20);
    timeCell.textContent = formatTime(Number(score.completion_time));
    row.append(rankCell, avatarCell, nameCell, timeCell);
    tableBody.append(row);
  });
}

function formatTime(value) {
  const seconds = Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
  return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}
