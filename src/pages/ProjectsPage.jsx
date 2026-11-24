import { useEffect, useRef, useState } from "react";
import PageBanner from "../components/PageBanner";

const projects = {
  portfolio: { icon: "🖥️", category: "Web Project", title: "ArtheHeart Portfolio", preview: "💻", tags: "HTML · CSS · React", summary: "A responsive personal portfolio combining my original style with cozy interactions.", description: "My student portfolio, converted to React while preserving the visual identity of my original site and its cozy multipage experience.", technologies: "React, React Router, Vite, CSS", features: ["Responsive routed navigation", "Persistent light and night themes", "Accessible keyboard-friendly interactions"] },
  "api-corners": { icon: "🎧", category: "API Activity", title: "Media Corners", preview: "🎧 📺", tags: "React · APIs", summary: "Music and series searches with friendly loading and error states.", description: "Separate React routes for music and series search plus a visitor recommendation feed.", technologies: "React, MusicBrainz, Cover Art Archive, TVMaze, Supabase", features: ["Loading, empty, and error states", "Safely rendered API and visitor content", "Shared recommendations when Supabase is configured"] },
  "escape-room": { icon: "🔐", category: "JavaScript Activity", title: "Mini Escape Room", preview: "🔐", tags: "React · Supabase", summary: "A puzzle game with state, timer, avatars, and leaderboard.", description: "A beginner-friendly room puzzle rebuilt with React state, effects, forms, and reusable components.", technologies: "React, CSS, Supabase REST API", features: ["Four linked clues and a final code", "Timer, restart, result dialog, and avatar selection", "Local development scores or a shared online leaderboard"] }
};

export default function ProjectsPage() {
  const dialogRef = useRef(null);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    if (selected) dialogRef.current?.showModal();
  }, [selected]);
  const closeDialog = () => { dialogRef.current?.close(); setSelected(null); };

  return (
    <main id="main-content" className="page-main inner-page">
      <PageBanner eyebrow="Things I’m building" title="📁 My Projects">A collection of my work and learning experiences.</PageBanner>
      <ProjectSection id="web-projects" title="Web Projects" projects={["portfolio"]} onSelect={setSelected} />
      <ProjectSection id="school-projects" title="School Projects" projects={["api-corners"]} onSelect={setSelected} />
      <ProjectSection id="javascript-activities" title="JavaScript Activities" projects={["escape-room"]} onSelect={setSelected} />
      <dialog className="modal" ref={dialogRef} aria-labelledby="project-modal-title" onClick={(event) => { if (event.target === dialogRef.current) closeDialog(); }} onClose={() => setSelected(null)}>
        {selected && <><button className="modal-close" type="button" aria-label="Close project details" onClick={closeDialog}>×</button><div className="modal-icon" aria-hidden="true">{projects[selected].icon}</div><p className="eyebrow">{projects[selected].category}</p><h2 id="project-modal-title">{projects[selected].title}</h2><p>{projects[selected].description}</p><h3>Technologies</h3><p>{projects[selected].technologies}</p><h3>Features</h3><ul>{projects[selected].features.map((feature) => <li key={feature}>{feature}</li>)}</ul></>}
      </dialog>
    </main>
  );
}

function ProjectSection({ id, title, projects: projectIds, onSelect }) {
  return <section className="project-section" id={id}><h2>{title}</h2><div className="project-grid">{projectIds.map((id) => { const project = projects[id]; return <button className="project-card paper-card" type="button" key={id} onClick={() => onSelect(id)}><span className="project-preview" aria-hidden="true">{project.preview}</span><span className="project-category">{project.tags}</span><strong>{project.title}</strong><span>{project.summary}</span><span className="card-action">View Project</span></button>; })}</div></section>;
}
