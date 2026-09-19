export function renderSiteShell() {
  const currentPage = document.body.dataset.page || "";
  const headerMount = document.querySelector("#site-header");
  const footerMount = document.querySelector("#site-footer");

  if (headerMount) {
    headerMount.innerHTML = `
      <header class="site-header">
        <nav class="navbar" aria-label="Main navigation">
          <a class="brand" href="Home_Page.html" aria-label="ArtheHeart home">
            <img src="../Image/Logo.png" alt="" width="92" height="92">
            <span>ArtheHeart</span>
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links"><span class="sr-only">Open navigation</span><span aria-hidden="true">☰</span></button>
          <div class="nav-links" id="nav-links">
            ${navLink("Home_Page.html", "Home", "home", currentPage)}
            ${navLink("About_Page.html", "About", "about", currentPage)}
            <div class="dropdown">
              <button class="dropdown-button${currentPage === "projects" ? " active" : ""}" type="button" aria-expanded="false" aria-controls="projects-menu">Projects <span class="dropdown-arrow" aria-hidden="true">▼</span></button>
              <div class="dropdown-menu" id="projects-menu"><a href="Projects_Page.html#web-projects">Web Projects</a><a href="Projects_Page.html#school-projects">School Projects</a><a href="Projects_Page.html#javascript-activities">JavaScript Activities</a></div>
            </div>
            ${navLink("Skills_Page.html", "Skills", "skills", currentPage)}
            <div class="dropdown">
              <button class="dropdown-button${["game", "music", "shows", "recommendations"].includes(currentPage) ? " active" : ""}" type="button" aria-expanded="false" aria-controls="cozy-menu">Cozy Corner <span class="dropdown-arrow" aria-hidden="true">▼</span></button>
              <div class="dropdown-menu" id="cozy-menu"><a href="Game_Page.html">Mini Escape Room</a><a href="Music_Page.html">Music</a><a href="Shows_Page.html">Movies &amp; Series</a><a href="Recommendations_Page.html">Recommendations</a></div>
            </div>
            ${navLink("Contact_Page.html", "Contact", "contact", currentPage)}
            <button class="theme-toggle" type="button" aria-label="Switch to night mode" title="Switch theme">🌙</button>
          </div>
        </nav>
      </header>`;
  }

  if (footerMount) {
    footerMount.innerHTML = `
      <footer class="site-footer">
        <div class="footer-brand"><img src="../Image/Logo.png" alt="" width="44" height="44"><span><strong>ArtheHeart</strong><small>A portfolio by Heart Cagadas</small></span></div>
        <p>“Good code. Brighter days.” ♥</p>
        <nav aria-label="Footer navigation"><a href="Home_Page.html">Home</a><a href="About_Page.html">About</a><a href="Projects_Page.html">Projects</a><a href="Skills_Page.html">Skills</a><a href="Contact_Page.html">Contact</a></nav>
      </footer>`;
  }
}

function navLink(href, label, pageName, currentPage) {
  const current = currentPage === pageName ? ' class="active" aria-current="page"' : "";
  return `<a href="${href}"${current}>${label}</a>`;
}
