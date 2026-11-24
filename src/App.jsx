import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import SkillsPage from "./pages/SkillsPage";
import GamePage from "./pages/GamePage";
import MusicPage from "./pages/MusicPage";
import ShowsPage from "./pages/ShowsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="game" element={<GamePage />} />
        <Route path="music" element={<MusicPage />} />
        <Route path="shows" element={<ShowsPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
