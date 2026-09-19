export function initializeShowSearch() {
  const form = document.querySelector("#show-search-form");
  const queryInput = document.querySelector("#show-query");
  const status = document.querySelector("#show-status");
  const results = document.querySelector("#show-results");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = queryInput.value.trim();
    if (!query) return;
    const submitButton = form.querySelector("button");
    submitButton.disabled = true;
    status.classList.remove("error");
    status.textContent = "Searching TVMaze…";
    results.replaceChildren();

    try {
      const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error(`TVMaze returned ${response.status}`);
      const data = await response.json();
      const shows = Array.isArray(data) ? data.slice(0, 8).map((item) => item.show).filter(Boolean) : [];
      renderShows(shows, results);
      status.textContent = shows.length ? `Found ${shows.length} series.` : "No shows found. Try a different title.";
    } catch (error) {
      console.error("Show search error:", error);
      status.textContent = "Could not search for shows. Please try again later.";
      status.classList.add("error");
    } finally {
      submitButton.disabled = false;
    }
  });
}

function renderShows(shows, container) {
  container.replaceChildren();
  shows.forEach((show) => {
    const card = document.createElement("article");
    const poster = document.createElement("img");
    const details = document.createElement("div");
    const title = document.createElement("h4");
    const genres = document.createElement("p");
    const rating = document.createElement("p");
    const summary = document.createElement("p");

    card.className = "result-card";
    if (show.image?.medium) poster.src = show.image.medium;
    poster.alt = show.image?.medium ? `${show.name} poster` : "No poster available";
    poster.loading = "lazy";
    title.textContent = show.name || "Untitled series";
    genres.textContent = `Genres: ${show.genres?.length ? show.genres.join(", ") : "Not listed"}`;
    rating.textContent = `Rating: ${show.rating?.average ?? "Not rated"}`;
    summary.textContent = safePlainText(show.summary).slice(0, 190) || "No summary available.";
    details.append(title, genres, rating, summary);
    card.append(poster, details);
    container.append(card);
  });
}

function safePlainText(html) {
  if (typeof html !== "string") return "";
  const documentFragment = new DOMParser().parseFromString(html, "text/html");
  return documentFragment.body.textContent || "";
}
