export function initializeNavbar() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const dropdownButtons = document.querySelectorAll(".dropdown-button");

  navToggle.addEventListener("click", function () {
    navLinks.classList.toggle("show");
    const isOpen = navLinks.classList.contains("show");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.querySelector("span[aria-hidden]").textContent = isOpen ? "×" : "☰";
  });

  dropdownButtons.forEach((dropdownButton) => {
    const dropdownMenu = document.querySelector(`#${dropdownButton.getAttribute("aria-controls")}`);
    dropdownButton.addEventListener("click", function () {
      const willOpen = !dropdownMenu.classList.contains("show");
      closeDropdowns();
      dropdownMenu.classList.toggle("show", willOpen);
      dropdownButton.setAttribute("aria-expanded", String(willOpen));
    });
  });

  function closeDropdowns() {
    dropdownButtons.forEach((button) => {
      const menu = document.querySelector(`#${button.getAttribute("aria-controls")}`);
      menu.classList.remove("show");
      button.setAttribute("aria-expanded", "false");
    });
  }

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".dropdown")) closeDropdowns();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDropdowns();
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeDropdowns();
      navLinks.classList.remove("show");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.querySelector("span[aria-hidden]").textContent = "☰";
    });
  });
}
