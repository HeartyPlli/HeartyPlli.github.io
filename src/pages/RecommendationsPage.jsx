import { useCallback, useEffect, useState } from "react";
import PageBanner from "../components/PageBanner";
import { addRecommendation, databaseMode, getRecommendations } from "../lib/database";

const typeIcons = { song: "🎵", movie: "🎬", series: "📺" };
const emptyForm = { visitor_name: "", type: "song", title: "", creator: "", message: "" };

export default function RecommendationsPage() {
  const [form, setForm] = useState(emptyForm);
  const [recommendations, setRecommendations] = useState([]);
  const [listStatus, setListStatus] = useState("Loading recommendations…");
  const [formStatus, setFormStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadRecommendations = useCallback(async () => {
    setListStatus("Loading recommendations…");
    try {
      const items = await getRecommendations();
      setRecommendations(items);
      setListStatus(items.length ? "Newest recommendations appear first." : "No recommendations yet. Be the first!");
    } catch (error) {
      console.error("Recommendations error:", error);
      setRecommendations([]); setListStatus("Could not load recommendations. Please try again later.");
    }
  }, []);

  useEffect(() => { loadRecommendations(); }, [loadRecommendations]);

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  async function submitRecommendation(event) {
    event.preventDefault();
    const recommendation = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()]));
    if (!recommendation.visitor_name || recommendation.visitor_name.length > 30 || !recommendation.title || recommendation.title.length > 100 || !Object.hasOwn(typeIcons, recommendation.type) || recommendation.creator.length > 100 || recommendation.message.length > 300) {
      setFormStatus("Please check the required fields and character limits."); return;
    }
    setSubmitting(true); setFormStatus("Sending your recommendation…");
    try {
      await addRecommendation(recommendation);
      setForm(emptyForm);
      setFormStatus(databaseMode === "online" ? "Recommendation shared—thank you!" : "Saved locally for development. Configure Supabase to share it.");
      await loadRecommendations();
    } catch (error) {
      console.error("Recommendation save error:", error); setFormStatus("Could not submit the recommendation. Please try again later.");
    } finally { setSubmitting(false); }
  }

  return <main id="main-content" className="page-main inner-page"><PageBanner eyebrow={databaseMode === "online" ? "ONLINE · shared visitor notes" : "LOCAL · development preview only"} title="💌 Visitor Recommendations">Leave a friendly media suggestion for the next visitor.</PageBanner><section className="recommendations-layout feature-panel"><form className="stacked-form" onSubmit={submitRecommendation}><h2>Recommend Something</h2><label htmlFor="visitor-name">Your name</label><input id="visitor-name" name="visitor_name" maxLength="30" required value={form.visitor_name} onChange={updateField} /><label htmlFor="recommendation-type">Type</label><select id="recommendation-type" name="type" required value={form.type} onChange={updateField}><option value="song">Song</option><option value="movie">Movie</option><option value="series">Series</option></select><label htmlFor="recommendation-title">Title</label><input id="recommendation-title" name="title" maxLength="100" required value={form.title} onChange={updateField} /><label htmlFor="recommendation-creator">Artist / Creator</label><input id="recommendation-creator" name="creator" maxLength="100" value={form.creator} onChange={updateField} /><label htmlFor="recommendation-message">Optional message</label><textarea id="recommendation-message" name="message" maxLength="300" rows="4" value={form.message} onChange={updateField} /><div className="character-count">{form.message.length}/300</div><button className="button primary" type="submit" disabled={submitting}>Submit Recommendation</button><p className="status-message" role="status">{formStatus}</p></form><div><h2>Latest Visitor Notes</h2><p className="status-message" role="status">{listStatus}</p><div className="recommendation-feed">{recommendations.map((item) => <RecommendationItem key={item.id} item={item} />)}</div></div></section></main>;
}

function RecommendationItem({ item }) {
  const type = Object.hasOwn(typeIcons, item.type) ? item.type : "series";
  return <article className="recommendation-item"><header><span className="recommendation-icon">{typeIcons[type]}</span><div><strong>{String(item.visitor_name).slice(0, 30)}</strong><div className="recommendation-meta">recommended a {type.toUpperCase()}</div></div></header><h4>“{String(item.title).slice(0, 100)}”</h4>{item.creator && <p>by {String(item.creator).slice(0, 100)}</p>}{item.message && <p className="recommendation-quote">“{String(item.message).slice(0, 300)}”</p>}<p className="recommendation-meta">{relativeTime(item.created_at)}</p></article>;
}

function relativeTime(dateValue) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(dateValue).getTime()) / 1000));
  if (!Number.isFinite(seconds)) return "recently";
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minute${seconds < 120 ? "" : "s"} ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${seconds < 7200 ? "" : "s"} ago`;
  return `${Math.floor(seconds / 86400)} day${seconds < 172800 ? "" : "s"} ago`;
}
