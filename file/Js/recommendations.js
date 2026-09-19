import { addRecommendation, databaseMode, getRecommendations } from "./database.js";

const typeIcons = { song: "🎵", movie: "🎬", series: "📺" };

export function initializeRecommendations() {
  const form = document.querySelector("#recommendation-form");
  const feed = document.querySelector("#recommendation-feed");
  const listStatus = document.querySelector("#recommendations-status");
  const formStatus = document.querySelector("#recommendation-form-status");
  const message = document.querySelector("#recommendation-message");
  const messageCount = document.querySelector("#message-count");
  const modeLabel = document.querySelector("#recommendations-mode");

  modeLabel.textContent = databaseMode === "online" ? "ONLINE · shared visitor notes" : "LOCAL · development preview only";
  message.addEventListener("input", () => { messageCount.textContent = String(message.value.length); });

  async function loadRecommendations() {
    listStatus.classList.remove("error");
    listStatus.textContent = "Loading recommendations…";
    try {
      const recommendations = await getRecommendations();
      renderRecommendations(recommendations, feed);
      listStatus.textContent = recommendations.length ? "Newest recommendations appear first." : "No recommendations yet. Be the first!";
    } catch (error) {
      console.error("Recommendations error:", error);
      feed.replaceChildren();
      listStatus.textContent = "Could not load recommendations. Please try again later.";
      listStatus.classList.add("error");
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const recommendation = {
      visitor_name: document.querySelector("#visitor-name").value.trim(),
      type: document.querySelector("#recommendation-type").value,
      title: document.querySelector("#recommendation-title").value.trim(),
      creator: document.querySelector("#recommendation-creator").value.trim(),
      message: message.value.trim()
    };
    const validTypes = Object.keys(typeIcons);
    if (!recommendation.visitor_name || recommendation.visitor_name.length > 30 || !recommendation.title || recommendation.title.length > 100 || !validTypes.includes(recommendation.type) || recommendation.creator.length > 100 || recommendation.message.length > 300) {
      formStatus.textContent = "Please check the required fields and character limits.";
      formStatus.classList.add("error");
      return;
    }

    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true;
    formStatus.classList.remove("error");
    formStatus.textContent = "Sending your recommendation…";
    try {
      await addRecommendation(recommendation);
      form.reset();
      messageCount.textContent = "0";
      formStatus.textContent = databaseMode === "online" ? "Recommendation shared—thank you!" : "Saved locally for development. Configure Supabase to share it.";
      await loadRecommendations();
    } catch (error) {
      console.error("Recommendation save error:", error);
      formStatus.textContent = "Could not submit the recommendation. Please try again later.";
      formStatus.classList.add("error");
    } finally {
      submitButton.disabled = false;
    }
  });

  loadRecommendations();
}

function renderRecommendations(recommendations, feed) {
  feed.replaceChildren();
  recommendations.forEach((recommendation) => {
    const item = document.createElement("article");
    const header = document.createElement("header");
    const icon = document.createElement("span");
    const headerText = document.createElement("div");
    const name = document.createElement("strong");
    const action = document.createElement("div");
    const title = document.createElement("h4");
    const creator = document.createElement("p");
    const note = document.createElement("p");
    const time = document.createElement("p");
    const type = Object.hasOwn(typeIcons, recommendation.type) ? recommendation.type : "series";

    item.className = "recommendation-item";
    icon.className = "recommendation-icon";
    icon.textContent = typeIcons[type];
    name.textContent = String(recommendation.visitor_name).slice(0, 30);
    action.textContent = `recommended a ${type.toUpperCase()}`;
    action.className = "recommendation-meta";
    headerText.append(name, action);
    header.append(icon, headerText);
    title.textContent = `“${String(recommendation.title).slice(0, 100)}”`;
    creator.textContent = recommendation.creator ? `by ${String(recommendation.creator).slice(0, 100)}` : "";
    note.textContent = recommendation.message ? `“${String(recommendation.message).slice(0, 300)}”` : "";
    note.className = recommendation.message ? "recommendation-quote" : "";
    time.textContent = relativeTime(recommendation.created_at);
    time.className = "recommendation-meta";
    item.append(header, title);
    if (creator.textContent) item.append(creator);
    if (note.textContent) item.append(note);
    item.append(time);
    feed.append(item);
  });
}

function relativeTime(dateValue) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(dateValue).getTime()) / 1000));
  if (!Number.isFinite(seconds)) return "recently";
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minute${seconds < 120 ? "" : "s"} ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${seconds < 7200 ? "" : "s"} ago`;
  return `${Math.floor(seconds / 86400)} day${seconds < 172800 ? "" : "s"} ago`;
}
