import { useState } from "react";
import { Link } from "react-router-dom";
import PageBanner from "../components/PageBanner";

export default function MusicPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("Search MusicBrainz for release information.");
  const [loading, setLoading] = useState(false);

  async function searchMusic(event) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    setLoading(true); setResults([]); setStatus("Searching MusicBrainz…");
    try {
      const response = await fetch(`https://musicbrainz.org/ws/2/release-group/?query=${encodeURIComponent(value)}&fmt=json&limit=8`, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`MusicBrainz returned ${response.status}`);
      const data = await response.json();
      const releases = Array.isArray(data["release-groups"]) ? data["release-groups"] : [];
      setResults(releases);
      setStatus(releases.length ? `Found ${releases.length} releases.` : "No music results found. Try another artist or album.");
    } catch (error) {
      console.error("Music search error:", error);
      setStatus("Music search is temporarily unavailable. Please try again later.");
    } finally { setLoading(false); }
  }

  return <main id="main-content" className="page-main inner-page media-page"><PageBanner eyebrow="Find a new favorite" title="🎧 Music Corner">Discover music and artists without autoplaying full songs.</PageBanner><section className="feature-panel"><form className="search-form" onSubmit={searchMusic}><label htmlFor="music-query">Search for an artist or album</label><div><input id="music-query" maxLength="80" required placeholder="e.g. Laufey" value={query} onChange={(event) => setQuery(event.target.value)} /><button className="button primary" type="submit" disabled={loading}>Search</button></div></form><p className="status-message" role="status">{status}</p><div className="result-grid">{results.map((release) => <MusicCard key={release.id} release={release} />)}</div></section><aside className="page-cta paper-card"><span aria-hidden="true">💌</span><div><h2>Have a favorite?</h2><p>Share a song, movie, or series with other visitors.</p></div><Link className="button secondary" to="/recommendations">Recommend something</Link></aside></main>;
}

function MusicCard({ release }) {
  const [coverFailed, setCoverFailed] = useState(false);
  const artist = release["artist-credit"]?.[0]?.name || "Unknown artist";
  return <article className="result-card">{coverFailed ? <div className="image-placeholder" aria-label="No cover art available">♫</div> : <img src={`https://coverartarchive.org/release-group/${encodeURIComponent(release.id)}/front-250`} alt={`Cover art for ${release.title}`} loading="lazy" onError={() => setCoverFailed(true)} />}<div><h4>{release.title || "Untitled release"}</h4><p>Artist: {artist}</p><p>First release: {release["first-release-date"]?.slice(0, 4) || "Unknown"}</p><p>{release["primary-type"] || "Release"}</p></div></article>;
}
