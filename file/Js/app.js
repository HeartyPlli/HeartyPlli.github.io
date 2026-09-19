import { renderSiteShell } from "./site-shell.js";
import { initializeNavbar } from "./navbar.js";
import { initializeTheme } from "./theme.js";
import { initializeGame } from "./game.js";
import { initializeLeaderboard } from "./leaderboard.js";
import { initializeMusicSearch } from "./music.js";
import { initializeShowSearch } from "./shows.js";
import { initializeRecommendations } from "./recommendations.js";

renderSiteShell();
initializeNavbar();
initializeTheme();

if (document.querySelector("#game-room")) {
  initializeGame();
  initializeLeaderboard();
}
if (document.querySelector("#music-search-form")) initializeMusicSearch();
if (document.querySelector("#show-search-form")) initializeShowSearch();
if (document.querySelector("#recommendation-form")) initializeRecommendations();
if (document.querySelector(".project-card")) initializeProjectModal();

function initializeProjectModal() {
  const modal = document.querySelector("#project-modal");
  const projects = {
    portfolio: { icon: "🖥️", category: "Web Project", title: "ArtheHeart Portfolio", description: "My student portfolio, combining the visual identity of my original site with a cozy multipage experience.", technologies: "HTML, CSS, Vanilla JavaScript", features: ["Responsive multipage navigation", "Persistent light and night themes", "Accessible keyboard-friendly interactions"] },
    "escape-room": { icon: "🔐", category: "JavaScript Activity", title: "Mini Escape Room", description: "A beginner-friendly room puzzle demonstrating DOM events, state management, forms, and timers.", technologies: "HTML, CSS, Vanilla JavaScript, Supabase REST API", features: ["Four linked clues and a final code", "Timer, restart, result dialog, and avatar selection", "Local development scores or a shared online leaderboard"] },
    "api-corners": { icon: "🎧", category: "API Activity", title: "Media Corners", description: "Separate music and series search pages plus a visitor recommendation feed.", technologies: "Vanilla JavaScript, MusicBrainz, Cover Art Archive, TVMaze, Supabase", features: ["Loading, empty, and error states", "Safely rendered API and visitor content", "Shared recommendations when Supabase is configured"] }
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

  modal.querySelector(".modal-close").addEventListener("click", () => modal.close());
  modal.addEventListener("click", (event) => { if (event.target === modal) modal.close(); });
}
