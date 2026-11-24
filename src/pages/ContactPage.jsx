import PageBanner from "../components/PageBanner";
import { asset } from "../lib/assets";

const socials = [["https://www.facebook.com/cagadas.heart", "01/facebook.png", "Facebook"], ["https://www.instagram.com/arthe.heart", "01/insta.png", "Instagram"], ["https://www.tiktok.com/@shhhhqc", "01/tiktok.png", "TikTok"], ["https://x.com/Arthe_HeartQ", "01/twitter.png", "X / Twitter"], ["https://wa.me/", "01/whats_app.png", "WhatsApp"]];

export default function ContactPage() {
  return <main id="main-content" className="page-main inner-page contact-page"><PageBanner eyebrow="Let’s talk" title="✉️ Let’s Connect!">Feel free to send me a message or visit my social pages.</PageBanner><section className="contact-layout"><div className="paper-card contact-message"><p className="hand-note">Every great project starts with a conversation ♡</p><h2>Say hello</h2><p>I’m always happy to meet other students, creators, and people who enjoy technology. The buttons below open my public social profiles.</p><div className="social-links large" aria-label="Social media links">{socials.map(([href, image, label]) => <a key={label} href={href} target="_blank" rel="noopener noreferrer"><img src={asset(image)} alt={label} /></a>)}</div></div><div className="contact-art" aria-hidden="true"><span>🪴</span><span>🐈</span><span>📚</span></div></section></main>;
}
