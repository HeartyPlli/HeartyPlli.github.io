import { initializeNavbar } from "./navbar.js";
import { initializeTheme } from "./theme.js";
import { initializeGame } from "./game.js";
import { initializeLeaderboard } from "./leaderboard.js";
import { initializeMusicSearch } from "./music.js";
import { initializeShowSearch } from "./shows.js";
import { initializeRecommendations } from "./recommendations.js";

initializeNavbar();
initializeTheme();
initializeGame();
initializeLeaderboard();
initializeMusicSearch();
initializeShowSearch();
initializeRecommendations();
initializeProjectModal();

function initializeProjectModal() {
  const modal = document.querySelector("#project-modal");
  const closeButton = modal.querySelector(".modal-close");
  const projects = {
    portfolio: { icon: "🖥️", category: "Web Project", title: "ArtheHeart Portfolio", description: "My personal student portfolio, refreshed as a calm and playful place to share what I learn.", technologies: "HTML, CSS, Vanilla JavaScript", features: ["Responsive single-page navigation", "Persistent cozy day and night themes", "Accessible keyboard-friendly interactions"] },
    "escape-room": { icon: "🔐", category: "JavaScript Activity", title: "Cozy Mini Escape Room", description: "A beginner-friendly room puzzle that demonstrates DOM events, state management, forms, and timers.", technologies: "HTML, CSS, Vanilla JavaScript, Supabase REST API", features: ["Four linked clues and a final code", "Timer, restart, result dialog, and avatar selection", "Local development scores or a shared online leaderboard"] },
    "api-corners": { icon: "🎧", category: "API Activity", title: "Cozy Media Corners", description: "A pair of simple search tools plus a visitor recommendation feed.", technologies: "Vanilla JavaScript, MusicBrainz, Cover Art Archive, TVMaze, Supabase", features: ["Loading, empty, and error states", "Safely rendered external and visitor content", "Shared recommendations when Supabase is configured"] }
  };

  document.querySelectorAll(".project-card").forEach((button) => {
    button.addEventListener("click", () => {
      const project = projects[button.dataset.project];
      if (!project) return;
      document.querySelector("#project-modal-icon").textContent = project.icon;
      document.querySelector("#project-modal-category").textContent = project.category;
      document.querySelector("#project-modal-title").textContent = project.title;
      document.querySelector("#project-modal-description").textContent = project.description;
      document.querySelector("#project-modal-tech").textContent = project.technologies;
      const featureList = document.querySelector("#project-modal-features");
      featureList.replaceChildren();
      project.features.forEach((feature) => {
        const item = document.createElement("li");
        item.textContent = feature;
        featureList.append(item);
      });
      modal.showModal();
    });
  });

  closeButton.addEventListener("click", () => modal.close());
  modal.addEventListener("click", (event) => { if (event.target === modal) modal.close(); });
}
