export function initializeGame() {
  const startButton = document.querySelector("#start-game");
  const restartButton = document.querySelector("#restart-game");
  const timerDisplay = document.querySelector("#game-time");
  const roomButtons = document.querySelectorAll(".room-object");
  const puzzleTitle = document.querySelector("#puzzle-title");
  const puzzleMessage = document.querySelector("#puzzle-message");
  const puzzleForm = document.querySelector("#puzzle-form");
  const puzzleLabel = document.querySelector("#puzzle-label");
  const puzzleAnswer = document.querySelector("#puzzle-answer");
  const resultModal = document.querySelector("#result-modal");
  const finalTime = document.querySelector("#final-time");
  const closeResultButton = document.querySelector("#close-result");

  let timerId = null;
  let startedAt = 0;
  let activePuzzle = null;
  let elapsedSeconds = 0;
  let gameState = createInitialState();

  function createInitialState() {
    return {
      clueOneFound: false,
      clueTwoSolved: false,
      laptopUnlocked: false,
      drawerOpened: false,
      gameCompleted: false,
      gameStarted: false
    };
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  }

  function updateTimer() {
    elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
    timerDisplay.textContent = formatTime(elapsedSeconds);
  }

  function setRoomEnabled(enabled) {
    roomButtons.forEach((button) => { button.disabled = !enabled; });
  }

  function startGame() {
    clearInterval(timerId);
    gameState = createInitialState();
    gameState.gameStarted = true;
    elapsedSeconds = 0;
    startedAt = Date.now();
    timerDisplay.textContent = "00:00";
    timerId = setInterval(updateTimer, 1000);
    setRoomEnabled(true);
    startButton.disabled = true;
    activePuzzle = null;
    puzzleForm.hidden = true;
    puzzleAnswer.value = "";
    puzzleTitle.textContent = "Explore the room";
    puzzleMessage.textContent = "Click the objects. A good detective checks even the quiet corners.";
    resetClueList();
    if (resultModal.open) resultModal.close();
  }

  function resetGame() {
    clearInterval(timerId);
    timerId = null;
    gameState = createInitialState();
    elapsedSeconds = 0;
    activePuzzle = null;
    timerDisplay.textContent = "00:00";
    startButton.disabled = false;
    setRoomEnabled(false);
    puzzleForm.hidden = true;
    puzzleAnswer.value = "";
    puzzleTitle.textContent = "The room is waiting";
    puzzleMessage.textContent = "Press “Start Game” when you’re ready.";
    resetClueList();
    document.querySelector("#score-form").reset();
    document.querySelector("#score-status").textContent = "";
    document.querySelectorAll(".avatar-option").forEach((button, index) => {
      button.classList.toggle("selected", index === 0);
      button.setAttribute("aria-pressed", String(index === 0));
    });
    if (resultModal.open) resultModal.close();
  }

  function resetClueList() {
    const labels = {
      "clue-plant": "○ Plant clue",
      "clue-books": "○ Bookshelf puzzle",
      "clue-laptop": "○ Laptop password",
      "clue-drawer": "○ Drawer opened"
    };
    Object.entries(labels).forEach(([id, text]) => {
      const item = document.querySelector(`#${id}`);
      item.textContent = text;
      item.classList.remove("found");
    });
  }

  function markClue(id, text) {
    const clue = document.querySelector(`#${id}`);
    clue.textContent = `✓ ${text}`;
    clue.classList.add("found");
  }

  function showPuzzle(type, title, message, label) {
    activePuzzle = type;
    puzzleTitle.textContent = title;
    puzzleMessage.textContent = message;
    puzzleLabel.textContent = label;
    puzzleAnswer.value = "";
    puzzleForm.hidden = false;
    puzzleAnswer.focus();
  }

  function showMessage(title, message) {
    activePuzzle = null;
    puzzleTitle.textContent = title;
    puzzleMessage.textContent = message;
    puzzleForm.hidden = true;
  }

  function inspectObject(objectName) {
    if (!gameState.gameStarted || gameState.gameCompleted) return;
    if (objectName === "plant") {
      gameState.clueOneFound = true;
      markClue("clue-plant", "Plant clue: laptop word is COZY");
      showMessage("A note under the plant!", "The tiny note says: “The laptop likes the word COZY.”");
    } else if (objectName === "bookshelf") {
      if (gameState.clueTwoSolved) showMessage("Bookshelf solved", "The books already revealed the first half of the code: 31.");
      else showPuzzle("books", "Bookshelf pattern", "A bookmark asks: What number comes next? 2, 4, 6, …", "Next number");
    } else if (objectName === "laptop") {
      if (gameState.laptopUnlocked) showMessage("Laptop unlocked", "The screen shows a small golden key icon. It unlocks the drawer.");
      else if (!gameState.clueOneFound) showMessage("Password needed", "The laptop wants a short word. Search the room for a note.");
      else showPuzzle("laptop", "Laptop password", "Enter the word from the hidden note.", "Password");
    } else if (objectName === "clock") {
      showMessage("The clock chimes softly", "A scratched message on the back says: “The final code begins with three.”");
    } else if (objectName === "drawer") {
      if (gameState.drawerOpened) showMessage("Open drawer", "A card inside shows the second half of the code: 48.");
      else if (!gameState.laptopUnlocked) showMessage("Locked drawer", "This drawer needs a key. Maybe another object can unlock it.");
      else {
        gameState.drawerOpened = true;
        markClue("clue-drawer", "Drawer clue: second half is 48");
        showMessage("The drawer opens!", "Inside is a card with the number 48. That is the second half of the final code.");
      }
    } else if (objectName === "lockbox") {
      if (!gameState.clueTwoSolved || !gameState.drawerOpened) showMessage("Four-digit lock", "You still need both halves of the final code. Try the bookshelf, laptop, and drawer.");
      else showPuzzle("lockbox", "Final lock", "Combine the two code halves you discovered.", "Four-digit code");
    }
  }

  function checkAnswer(event) {
    event.preventDefault();
    const answer = puzzleAnswer.value.trim().toLowerCase();
    if (activePuzzle === "books" && answer === "8") {
      gameState.clueTwoSolved = true;
      markClue("clue-books", "Bookshelf clue: first half is 31");
      showMessage("Pattern solved!", "Correct! Behind book number 8 is a card showing 31—the first half of the final code.");
    } else if (activePuzzle === "laptop" && answer === "cozy") {
      gameState.laptopUnlocked = true;
      markClue("clue-laptop", "Laptop unlocked: drawer key found");
      showMessage("Welcome back!", "The laptop unlocks and displays a golden key icon. The drawer clicks open.");
    } else if (activePuzzle === "lockbox" && answer === "3148") {
      finishGame();
    } else {
      puzzleMessage.textContent = "Not quite. Look at your clues and try again.";
      puzzleAnswer.select();
    }
  }

  function finishGame() {
    gameState.gameCompleted = true;
    clearInterval(timerId);
    updateTimer();
    elapsedSeconds = Math.max(1, elapsedSeconds);
    setRoomEnabled(false);
    startButton.disabled = false;
    showMessage("The box opens!", "A tiny star key unlocks the bedroom door. You escaped!");
    finalTime.textContent = formatTime(elapsedSeconds);
    window.dispatchEvent(new CustomEvent("gameCompleted", { detail: { elapsedSeconds } }));
    resultModal.showModal();
  }

  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", resetGame);
  puzzleForm.addEventListener("submit", checkAnswer);
  roomButtons.forEach((button) => button.addEventListener("click", () => inspectObject(button.dataset.object)));
  closeResultButton.addEventListener("click", () => resultModal.close());
  resultModal.addEventListener("click", (event) => { if (event.target === resultModal) resultModal.close(); });
  setRoomEnabled(false);
}
