const THEME_KEY = "artheheart-theme";

export function initializeTheme() {
  const themeButton = document.querySelector(".theme-toggle");
  let savedTheme = "light";
  try { savedTheme = localStorage.getItem(THEME_KEY) || "light"; } catch { /* Storage may be blocked. */ }
  document.body.classList.toggle("dark-mode", savedTheme === "dark");
  updateButton(themeButton);

  themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    try { localStorage.setItem(THEME_KEY, theme); } catch { /* The theme still works for this page view. */ }
    updateButton(themeButton);
  });
}

function updateButton(button) {
  const darkMode = document.body.classList.contains("dark-mode");
  button.textContent = darkMode ? "☀️" : "🌙";
  button.setAttribute("aria-label", darkMode ? "Switch to light mode" : "Switch to night mode");
}
