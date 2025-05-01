<template>
  <div class="game-dashboard">
    <header class="navbar">
      <div class="navbar-container">
        <div class="logo">
          <img
            src="@/assets/icon.png"
            alt="ThinkPlayAct Logo"
            class="logo-icon"
          />
          <span class="logo-text">Think.Play.Act</span>
        </div>
        <nav class="nav-menu">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/mood-observation" class="nav-link"
            >How They Play</router-link
          >
        </nav>
      </div>
    </header>

    <main class="dashboard-main">
      <aside class="sidebar">
        <h2>Search & Filter</h2>
        <input v-model="searchTerm" type="text" placeholder="Search games…" />

        <label>Sort By</label>
        <select v-model="sortKey">
          <option value="">None</option>
          <option value="owners_lower">Popularity</option>
          <option value="average_playtime">Avg. Playtime</option>
          <option value="avg_emotional_intensity">Emotion Intensity</option>
        </select>

        <label>Filter by Genre</label>
        <select v-model="genreFilter">
          <option value="">All Genres</option>
          <option v-for="g in uniqueGenres" :key="g" :value="g">{{ g }}</option>
        </select>

        <label>Filter by Age Rating</label>
        <select v-model="ageRatingFilter">
          <option value="">All Ratings</option>
          <option value="Everyone">Everyone</option>
          <option value="Teen">Teen</option>
          <option value="Mature">Mature</option>
          <option value="Adults Only">Adults Only</option>
          <option value="Not Rated">Not Rated</option>
          <option value="Unknown">Unknown</option>
        </select>
      </aside>

      <section class="content">
        <h2 class="section-title">Top Games</h2>
        <p class="instructions">
          Explore a curated list of popular games. Use the filters to search by
          genre, age rating, or sort by metrics like popularity and average
          playtime. Click on a card to learn more.
        </p>

        <div v-if="!filteredGames.length" class="no-results">
          No games match your search.
        </div>

        <div v-else class="games-grid">
          <div
            v-for="game in filteredGames"
            :key="game.game_title"
            class="game-card"
          >
            <h3>{{ game.game_title }}</h3>
            <p>
              {{ new Date(game.release_date).getFullYear() }} •
              {{ Number(game.owners_lower).toLocaleString() }} owners
            </p>
            <p><strong>Playtime:</strong> {{ game.average_playtime }} mins</p>
            <p><strong>Violence:</strong> {{ game.violence_level }}</p>
            <p><strong>Genres:</strong> {{ formatGenres(game.genres) }}</p>
            <p>
              <strong>Age Rating:</strong> {{ game.ageRating || "Loading..." }}
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "GameDashboard",
  data() {
    return {
      games: [],
      searchTerm: "",
      sortKey: "owners_lower",
      genreFilter: "",
      ageRatingFilter: "",
    };
  },
  computed: {
    filteredGames() {
      const term = this.searchTerm.trim().toLowerCase();
      return this.games
        .filter((g) => !term || g.game_title.toLowerCase().includes(term))
        .filter((g) =>
          this.genreFilter
            ? this.formatGenres(g.genres)
                .toLowerCase()
                .includes(this.genreFilter.toLowerCase())
            : true
        )
        .filter((g) =>
          this.ageRatingFilter ? g.ageRating === this.ageRatingFilter : true
        )
        .sort((a, b) =>
          this.sortKey ? Number(b[this.sortKey]) - Number(a[this.sortKey]) : 0
        );
    },
    uniqueGenres() {
      const allGenres = this.games.flatMap((g) =>
        this.formatGenres(g.genres).split(", ")
      );
      return [...new Set(allGenres)].filter(Boolean).sort();
    },
  },
  methods: {
    async fetchGames() {
      const base = process.env.VUE_APP_API_URL || "";
      const endpoint = base
        ? `${base}/api/classified_steam_games`
        : "/api/classified_steam_games";

      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        this.games = data.slice(0, 12);
        for (const game of this.games) {
          this.fetchAgeRating(game);
        }
      } catch (err) {
        console.error("Failed to load games:", err);
      }
    },
    async fetchAgeRating(game) {
      const base = process.env.VUE_APP_API_URL || "";
      try {
        const res = await fetch(
          `${base}/api/rawg-age-rating?title=${encodeURIComponent(
            game.game_title
          )}`
        );
        const json = await res.json();
        game.ageRating = json.age_rating || "Unknown";
      } catch (err) {
        game.ageRating = "Unknown";
      }
    },
    formatGenres(genres) {
      if (!genres) return "N/A";
      if (typeof genres === "string")
        return genres
          .replace(/[{}"]+/g, "")
          .split(",")
          .join(", ");
      return Array.isArray(genres) ? genres.join(", ") : "N/A";
    },
  },
  created() {
    this.fetchGames();
  },
};
</script>

<style scoped>
.game-dashboard {
  font-family: "Roboto", sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
}
.navbar {
  background-color: #fff;
  padding: 1.5rem 3rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}
.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  display: flex;
  align-items: center;
}
.logo-icon {
  width: 70px;
  margin-right: 1rem;
}
.logo-text {
  font-size: 2rem;
  font-weight: 800;
  color: #333;
}
.nav-menu {
  display: flex;
  gap: 3rem;
}
.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.2rem;
}
.nav-link:hover {
  color: #3498db;
}
.dashboard-main {
  display: flex;
  padding: 2rem;
}
.sidebar {
  width: 280px;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.sidebar input,
.sidebar select {
  width: 100%;
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}
.content {
  flex: 1;
}
.section-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}
.instructions {
  color: #555;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}
.game-card {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #ddd;
  transition: box-shadow 0.2s ease;
}
.game-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
.game-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}
.no-results {
  color: #888;
  text-align: center;
  margin-top: 2rem;
  font-size: 1.1rem;
}
</style>
