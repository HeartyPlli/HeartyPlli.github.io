import PageBanner from "../components/PageBanner";
import { asset } from "../lib/assets";
import { Link } from "react-router-dom";
import PhotoGallery from "../components/PhotoGallery";

const photos = ["me and me/7.jpeg", "me and me/6.jpeg", "me and me/5.jpg", "me and me/4.jpeg", "me and me/3.jpeg", "me and me/2.jpeg", "me and me/1.jpeg", "me and me/sdsad.png", "friends/77.jpg", "friends/66.jpeg", "friends/55.jpeg", "friends/44.jpeg", "friends/22.JPG", "friends/11.jpeg"];

export default function AboutPage() {
  return (
    <main id="main-content" className="page-main inner-page">
      <PageBanner eyebrow="A little introduction" title="💗 About Me">Student, aspiring developer, and lifelong learner.</PageBanner>
      <section className="about-layout">
        <article className="paper-card about-story"><p className="hand-note">Just a girl who loves coding ♡</p><h2>Hi! I’m Heart</h2><p>I’m a Computer Science student at Tangub City Global College. I love creating, problem-solving, and turning ideas into meaningful projects.</p><p>I enjoy web development, UI design, and exploring new technologies. This portfolio reflects my learning journey, passions, and dreams. My goal is to grow into a full-stack developer and make useful, welcoming experiences for other people.</p><Link className="button primary" to="/contact">Let’s connect</Link></article>
        <div className="about-portrait"><img src={asset("01/me1.png")} alt="Heart Cagadas" /><span className="cat-pill">student · creator · dreamer</span></div>
      </section>
      <section className="photo-section" aria-labelledby="photos-title"><div className="ornament-heading"><img src={asset("01/top.png")} alt="" /><h2 id="photos-title">Photo Keepsakes</h2></div><p className="section-intro">Small moments with myself and my friends. Tap a photo to take a closer look.</p><PhotoGallery photos={photos} /></section>
    </main>
  );
}
