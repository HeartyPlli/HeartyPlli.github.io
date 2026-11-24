import PageBanner from "../components/PageBanner";

const skills = [["HTML", 90], ["CSS", 85], ["JavaScript", 80], ["PHP", 70], ["MySQL", 65], ["Flutter", 75], ["UI/UX Design", 80]];
const tools = ["VS Code", "Git", "Figma", "Canva", "MySQL", "Dart", "Notion"];

export default function SkillsPage() {
  return (
    <main id="main-content" className="page-main inner-page skills-page">
      <PageBanner eyebrow="My growing toolkit" title="⭐ My Skills">Here are the tools and technologies I use and continue to learn.</PageBanner>
      <section className="skills-board paper-card" aria-label="Skill levels"><p className="hand-note">Progress over perfection ♡</p>
        {skills.map(([name, level]) => <div className="skill-row" key={name}><strong>{name}</strong><div><span style={{ "--level": `${level}%` }} /></div><b>{level}%</b></div>)}
        <h2>🧰 Tools I Use</h2><div className="tool-grid">{tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
      </section>
    </main>
  );
}
