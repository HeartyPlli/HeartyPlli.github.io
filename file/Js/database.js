import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./supabase-config.js";

const SCORE_STORAGE_KEY = "artheheart-local-scores";
const RECOMMENDATION_STORAGE_KEY = "artheheart-local-recommendations";

export const databaseMode = isSupabaseConfigured() ? "online" : "local";

function readLocal(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

async function supabaseRequest(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!response.ok) {
    const problem = await response.text();
    throw new Error(problem || `Database request failed (${response.status}).`);
  }

  if (response.status === 204 || options.method === "POST") return null;
  return response.json();
}

export async function getScores() {
  if (databaseMode === "local") {
    return readLocal(SCORE_STORAGE_KEY)
      .sort((a, b) => a.completion_time - b.completion_time)
      .slice(0, 10);
  }
  return supabaseRequest("escape_scores?select=id,player_name,avatar,completion_time,created_at&order=completion_time.asc&limit=10");
}

export async function addScore(score) {
  const validAvatars = ["cat", "bunny", "frog", "bear", "ghost", "star"];
  if (!score.player_name || score.player_name.length > 20) throw new Error("Please enter a name up to 20 characters.");
  if (!validAvatars.includes(score.avatar)) throw new Error("Please choose a valid avatar.");
  if (!Number.isInteger(score.completion_time) || score.completion_time < 1 || score.completion_time > 86400) throw new Error("The completion time is invalid.");

  if (databaseMode === "local") {
    const scores = readLocal(SCORE_STORAGE_KEY);
    scores.push({ ...score, id: crypto.randomUUID(), created_at: new Date().toISOString() });
    writeLocal(SCORE_STORAGE_KEY, scores.slice(-100));
    return;
  }
  return supabaseRequest("escape_scores", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(score) });
}

export async function getRecommendations() {
  if (databaseMode === "local") {
    return readLocal(RECOMMENDATION_STORAGE_KEY)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 50);
  }
  return supabaseRequest("recommendations?select=id,visitor_name,type,title,creator,message,created_at&order=created_at.desc&limit=50");
}

export async function addRecommendation(recommendation) {
  const validTypes = ["song", "movie", "series"];
  if (!recommendation.visitor_name || recommendation.visitor_name.length > 30) throw new Error("Your name must be 1–30 characters.");
  if (!validTypes.includes(recommendation.type)) throw new Error("Please select a valid type.");
  if (!recommendation.title || recommendation.title.length > 100) throw new Error("The title must be 1–100 characters.");
  if (recommendation.creator.length > 100 || recommendation.message.length > 300) throw new Error("One of the fields is too long.");

  if (databaseMode === "local") {
    const recommendations = readLocal(RECOMMENDATION_STORAGE_KEY);
    recommendations.push({ ...recommendation, id: crypto.randomUUID(), created_at: new Date().toISOString() });
    writeLocal(RECOMMENDATION_STORAGE_KEY, recommendations.slice(-100));
    return;
  }
  return supabaseRequest("recommendations", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify(recommendation) });
}
