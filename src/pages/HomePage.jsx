import { Link } from "react-router-dom";
import { asset } from "../lib/assets";

const socials = [
  ["https://www.facebook.com/cagadas.heart", "01/facebook.png", "Facebook"],
  ["https://www.instagram.com/arthe.heart", "01/insta.png", "Instagram"],
  ["https://www.tiktok.com/@shhhhqc", "01/tiktok.png", "TikTok"],
  ["https://x.com/Arthe_HeartQ", "01/twitter.png", "X / Twitter"],
  ["https://wa.me/", "01/whats_app.png", "WhatsApp"]
];

const shortcuts = [
  ["/about", "💗", "About Me", "My story and photos"], ["/projects", "💻", "Projects", "Things I have built"],
  ["/skills", "📚", "Skills", "My growing toolkit"], ["/music", "🎧", "Music", "Search new favorites"],
  ["/shows", "📺", "Series", "Find something to watch"], ["/game", "🎮", "Mini Game", "Catch a snack with bunny"]
];

export default function HomePage() {
  return (
    <main id="main-content" className="page-main home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-copy">
          <p className="intro-label">Hi there! I&apos;m</p>
          <img className="text-ornament ornament-top" src={asset("01/top.png")} alt="" />
          <h1 id="home-title">Heart Quimbo Cagadas</h1>
          <p className="home-introduction">I&apos;m a Computer Science student at Tangub City Global College. I have a deep passion for learning new things, especially anything computer-related. Whenever I&apos;m working on something I love, I&apos;m always ready to give it my all. I&apos;m excited to dive deeper into coding, continue expanding my knowledge, and become a full-stack developer.</p>
          <div className="home-contact"><span>Contact Info:</span><div className="social-links" aria-label="Social media links">{socials.map(([href, image, label]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer"><img src={asset(image)} alt={label} /></a>)}</div></div>
          <img className="text-ornament ornament-bottom" src={asset("01/bottom.png")} alt="" />
        </div>
        <div className="portrait-stage" aria-label="Portrait of Heart with purple decorative circles">
          {["one", "two", "three", "four", "five"].map((name) => <span key={name} className={`portrait-bubble bubble-${name}`} />)}
          <img src={asset("01/me1.png")} alt="Heart Cagadas" className="home-portrait" />
        </div>
      </section>
      <section className="home-shortcuts" aria-labelledby="explore-title">
        <div className="ornament-heading"><img src={asset("01/top.png")} alt="" /><h2 id="explore-title">Explore My Space</h2></div>
        <div className="shortcut-grid">{shortcuts.map(([to, icon, title, copy]) => <Link className="shortcut-card" to={to} key={title}><span aria-hidden="true">{icon}</span><strong>{title}</strong><small>{copy}</small></Link>)}</div>
      </section>
    </main>
  );
}
