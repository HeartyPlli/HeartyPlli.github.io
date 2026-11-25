import { Link } from "react-router-dom";
import PageBanner from "../components/PageBanner";

export default function ProjectsPage() {
  return <main id="main-content" className="page-main inner-page">
    <PageBanner eyebrow="Things I’m building" title="📁 My Projects">Little ideas, useful tools, and room to keep learning.</PageBanner>
    <section className="project-section" id="web-projects"><h2>Web Projects</h2><div className="project-grid">
      <Link className="project-card paper-card budget-project" to="/budget-tracker"><span className="project-preview budget-preview" aria-hidden="true">₱<small>Every peso, a little more planned.</small></span><span className="project-category">React · Personal finance</span><strong>Peso Pocket</strong><span>A simple budget tracker for your needs, wants, and everything you’re saving for.</span><span className="card-action">Open Budget Tracker</span></Link>
    </div></section>
    <section className="project-section" id="school-projects"><h2>School Projects</h2><div className="coming-soon paper-card"><p>Coming soon</p><span>New things are taking shape.</span></div></section>
    <section className="project-section" id="javascript-activities"><h2>JavaScript Activities</h2><div className="coming-soon paper-card"><p>Coming soon</p><span>A little space for future experiments.</span></div></section>
  </main>;
}
