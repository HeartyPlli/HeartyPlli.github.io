export function initializeMusicSearch() {
  const form = document.querySelector("#music-search-form");
  const queryInput = document.querySelector("#music-query");
  const status = document.querySelector("#music-status");
  const results = document.querySelector("#music-results");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = queryInput.value.trim();
    if (!query) return;
    const submitButton = form.querySelector("button");
    submitButton.disabled = true;
    status.classList.remove("error");
    status.textContent = "Searching MusicBrainz…";
    results.replaceChildren();

    try {
      const url = `https://musicbrainz.org/ws/2/release-group/?query=${encodeURIComponent(query)}&fmt=json&limit=8`;
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(`MusicBrainz returned ${response.status}`);
      const data = await response.json();
      const releases = Array.isArray(data["release-groups"]) ? data["release-groups"] : [];
      renderMusic(releases, results);
      status.textContent = releases.length ? `Found ${releases.length} release${releases.length === 1 ? "" : "s"}.` : "No music results found. Try another artist or album.";
    } catch (error) {
      console.error("Music search error:", error);
      status.textContent = "Music search is temporarily unavailable. Please try again later.";
      status.classList.add("error");
    } finally {
      submitButton.disabled = false;
    }
  });
}

function renderMusic(releases, container) {
  container.replaceChildren();
  releases.forEach((release) => {
    const card = document.createElement("article");
    const cover = document.createElement("img");
    const details = document.createElement("div");
    const title = document.createElement("h4");
    const artist = document.createElement("p");
    const year = document.createElement("p");
    const type = document.createElement("p");
    const artistName = release["artist-credit"]?.[0]?.name || "Unknown artist";

    card.className = "result-card";
    cover.src = `https://coverartarchive.org/release-group/${encodeURIComponent(release.id)}/front-250`;
    cover.alt = `Cover art for ${release.title}`;
    cover.loading = "lazy";
    cover.addEventListener("error", () => {
      cover.removeAttribute("src");
      cover.alt = "No cover art available";
    }, { once: true });
    title.textContent = release.title || "Untitled release";
    artist.textContent = `Artist: ${artistName}`;
    year.textContent = `First release: ${release["first-release-date"]?.slice(0, 4) || "Unknown"}`;
    type.textContent = release["primary-type"] || "Release";
    details.append(title, artist, year, type);
    card.append(cover, details);
    container.append(card);
  });
}
