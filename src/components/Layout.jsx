import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { asset } from "../lib/assets";

const THEME_KEY = "artheheart-theme-v2";
const activeNavClass = ({ isActive }) => isActive ? "active" : "";

export default function Layout() {
  const location = useLocation();
  const navRef = useRef(null);
  const [navOpen, setNavOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) !== "light"; } catch { return true; }
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    try { localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light"); } catch { /* Theme still works for this visit. */ }
  }, [darkMode]);

  useEffect(() => {
    setNavOpen(false);
    setOpenMenu(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const closeMenus = (event) => {
      if (!navRef.current?.contains(event.target)) setOpenMenu(null);
    };
    const closeWithEscape = (event) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setNavOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeMenus);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMenus);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, []);

  const toggleDropdown = (name) => setOpenMenu((current) => current === name ? null : name);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <nav className="navbar" aria-label="Main navigation" ref={navRef}>
          <NavLink className="brand" to="/" aria-label="ArtheHeart home">
            <img src={asset("Logo.png")} alt="" width="92" height="92" />
            <span>ArtheHeart</span>
          </NavLink>
          <button className="nav-toggle" type="button" aria-expanded={navOpen} aria-controls="nav-links" onClick={() => setNavOpen((value) => !value)}>
            <span className="sr-only">{navOpen ? "Close" : "Open"} navigation</span><span aria-hidden="true">{navOpen ? "×" : "☰"}</span>
          </button>
          <div className={`nav-links${navOpen ? " show" : ""}`} id="nav-links">
            <NavLink className={activeNavClass} to="/" end>Home</NavLink>
            <NavLink className={activeNavClass} to="/about">About</NavLink>
            <div className="dropdown">
              <button className={`dropdown-button${location.pathname === "/projects" ? " active" : ""}`} type="button" aria-expanded={openMenu === "projects"} aria-controls="projects-menu" onClick={() => toggleDropdown("projects")}>Projects <span className="dropdown-arrow" aria-hidden="true">▼</span></button>
              <div className={`dropdown-menu${openMenu === "projects" ? " show" : ""}`} id="projects-menu"><NavLink to="/projects#web-projects">Web Projects</NavLink><NavLink to="/projects#school-projects">School Projects</NavLink><NavLink to="/projects#javascript-activities">JavaScript Activities</NavLink></div>
            </div>
            <NavLink className={activeNavClass} to="/skills">Skills</NavLink>
            <div className="dropdown">
              <button className={`dropdown-button${["/game", "/music", "/shows", "/recommendations"].includes(location.pathname) ? " active" : ""}`} type="button" aria-expanded={openMenu === "cozy"} aria-controls="cozy-menu" onClick={() => toggleDropdown("cozy")}>Cozy Corner <span className="dropdown-arrow" aria-hidden="true">▼</span></button>
              <div className={`dropdown-menu${openMenu === "cozy" ? " show" : ""}`} id="cozy-menu"><NavLink to="/game">Bunny Snack Catch</NavLink><NavLink to="/music">Music</NavLink><NavLink to="/shows">Movies &amp; Series</NavLink><NavLink to="/recommendations">Recommendations</NavLink></div>
            </div>
            <NavLink className={activeNavClass} to="/contact">Contact</NavLink>
            <button className="theme-toggle" type="button" aria-label={darkMode ? "Switch to light mode" : "Switch to night mode"} title="Switch theme" onClick={() => setDarkMode((value) => !value)}>{darkMode ? "☀️" : "🌙"}</button>
          </div>
        </nav>
      </header>
      <Outlet />
      <footer className="site-footer">
        <div className="footer-brand"><img src={asset("Logo.png")} alt="" width="44" height="44" /><span><strong>ArtheHeart</strong><small>A portfolio by Heart Cagadas</small></span></div>
        <p>“Good code. Brighter days.” ♥</p>
        <nav aria-label="Footer navigation"><NavLink to="/">Home</NavLink><NavLink to="/about">About</NavLink><NavLink to="/projects">Projects</NavLink><NavLink to="/skills">Skills</NavLink><NavLink to="/contact">Contact</NavLink></nav>
      </footer>
    </>
  );
}
