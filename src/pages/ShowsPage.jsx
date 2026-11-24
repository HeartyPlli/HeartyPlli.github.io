import { useState } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../components/PageBanner";

export default function ShowsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("Search for a series to begin.");
  const [loading, setLoading] = useState(false);

  async function searchShows(event) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    setLoading(true); setResults([]); setStatus("Searching TVMaze…");
    try {
      const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(value)}`);
      if (!response.ok) throw new Error(`TVMaze returned ${response.status}`);
      const data = await response.json();
      const shows = Array.isArray(data) ? data.slice(0, 8).map((item) => item.show).filter(Boolean) : [];
      setResults(shows); setStatus(shows.length ? `Found ${shows.length} series.` : "No shows found. Try a different title.");
    } catch (error) {
      console.error("Show search error:", error); setStatus("Could not search for shows. Please try again later.");
    } finally { setLoading(false); }
  }

  return <main id="main-content" className="page-main inner-page media-page"><PageBanner eyebrow="For your watch list" title="📺 Movies & Series Corner">Find your next favorite show.</PageBanner><section className="feature-panel"><form className="search-form" onSubmit={searchShows}><label htmlFor="show-query">Search for a TV series</label><div><input id="show-query" maxLength="80" required placeholder="e.g. Wednesday" value={query} onChange={(event) => setQuery(event.target.value)} /><button className="button primary" type="submit" disabled={loading}>Search</button></div></form><p className="microcopy">Series search uses TVMaze. Movie search can be added later through a secure backend if its provider requires a private key.</p><p className="status-message" role="status">{status}</p><div className="result-grid">{results.map((show) => <ShowCard key={show.id} show={show} />)}</div></section><aside className="page-cta paper-card"><span aria-hidden="true">🍿</span><div><h2>Share your watch list</h2><p>Leave a movie or series recommendation for other visitors.</p></div><Link className="button secondary" to="/recommendations">Open recommendations</Link></aside></main>;
}

function ShowCard({ show }) {
  const plainSummary = typeof show.summary === "string" ? new DOMParser().parseFromString(show.summary, "text/html").body.textContent : "";
  return <article className="result-card">{show.image?.medium ? <img src={show.image.medium} alt={`${show.name} poster`} loading="lazy" /> : <div className="image-placeholder" aria-label="No poster available">📺</div>}<div><h4>{show.name || "Untitled series"}</h4><p>Genres: {show.genres?.length ? show.genres.join(", ") : "Not listed"}</p><p>Rating: {show.rating?.average ?? "Not rated"}</p><p>{plainSummary?.slice(0, 190) || "No summary available."}</p></div></article>;
}
