<template>
  <div class="game-dashboard fade-in">
    <header class="navbar">
      <div class="navbar-container">
        <router-link to="/" class="logo">
          <img
            src="@/assets/icon.png"
            alt="ThinkPlayAct Logo"
            class="logo-icon"
          />
          <span class="logo-text">Think.Play.Act</span>
        </router-link>
        <nav class="nav-menu">
          <router-link to="/" class="nav-link">Home</router-link>
        </nav>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="dashboard-header">
        <h1>Game Dashboard</h1>
        <p class="dashboard-subtext">
          You’re doing great — use this tool to find games that match your
          child’s age and interests. With the right info here, our
          <router-link to="/tracker" class="tracker-link">tracker</router-link>
          can help you better understand how gaming affects their mood and
          habits.
        </p>

        <div class="search-filter-wrapper">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Type game name"
            class="search-rounded"
          />

          <div class="dropdown-label">
            <strong>Age Rating</strong>
            <select v-model="ageRatingFilter">
              <option value="">Age Rating</option>
              <option value="G">G (All ages)</option>
              <option value="PG">PG (Parental Guidance)</option>
              <option value="M">M (Mature themes)</option>
              <option value="MA15+">MA15+ (15+ restricted)</option>
              <option value="R18+">R18+ (Adults only)</option>
              <option value="Unrated">Unrated</option>
            </select>
          </div>

          <div class="dropdown-label">
            <strong>Genre</strong>
            <div class="custom-select small">
              <div class="selected-option" @click="toggleGenreDropdown">
                <span>{{ genreFilter || "Select game genres" }}</span>
                <span class="arrow" :class="{ open: showGenreDropdown }"
                  >▼</span
                >
              </div>
              <ul v-if="showGenreDropdown" class="dropdown-list">
                <li
                  v-for="g in genreGroups"
                  :key="g.label"
                  @click="onGenreSelect(g.label)"
                  class="dropdown-item"
                >
                  <img
                    :src="require(`@/assets/${g.icon}`)"
                    class="dropdown-icon"
                  />
                  <span>{{ g.label }}</span>
                </li>
                <li @click="onGenreSelect('')" class="dropdown-item">
                  Clear Filter
                </li>
              </ul>
            </div>
          </div>

          <div class="dropdown-label">
            <strong><a href="#" style="color: #007bff">Sort by</a></strong>
            <select v-model="sortKey">
              <option value="">Select order</option>
              <option value="avg_emotional_intensity">Emotion Intensity</option>
              <option value="average_playtime">Avg. Playtime</option>
            </select>
          </div>

          <button class="search-btn">🔍 Search</button>
        </div>
      </div>

      <p class="instructions">
        🎮 Use the filters above to find games by genre and age suitability.
        This can help you better understand how your child’s gaming habits
        affect their mood using our tracker.
      </p>

      <div v-if="!filteredGames.length" class="no-results">
        No games match your filters.
      </div>

      <div v-else class="games-grid">
        <div v-for="game in filteredGames" :key="game.appid" class="game-card">
          <div
            class="card-top"
            :class="{ violent: game.violence_level_api === 'VIOLENCE' }"
          >
            <h3>{{ game.game_title }}</h3>
          </div>
          <div class="card-body">
            <p>{{ formatYear(game.release_date) }}</p>
            <div class="genre-row">
              <img
                v-if="getGenreIcon(groupGenreKey(game.genres, game.tags))"
                :src="
                  require(`@/assets/${getGenreIcon(
                    groupGenreKey(game.genres, game.tags)
                  )}`)
                "
                class="genre-icon"
              />
              <div class="badge">{{ groupGenre(game.genres, game.tags) }}</div>
            </div>
            <div class="badge age">⭐ {{ game.acb_rating || "Unrated" }}</div>
            <div
              class="tag"
              :class="{ red: game.violence_level_api === 'VIOLENCE' }"
            >
              {{ game.violence_level_api || "NON-VIOLENCE" }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "GameDashboard",
  data() {
    return {
      allGames: [],
      visibleCount: 20,
      searchTerm: "",
      sortKey: "",
      genreFilter: "",
      ageRatingFilter: "",
      showGenreDropdown: false,
      genreIcons: {
        Action: "icon-action.png",
        Adult: "icon-adult.png",
        Adventure: "icon-adventure.png",
        Casual: "icon-casual.png",
        Gambling: "icon-gambling.png",
        Simulation: "icon-simulation.png",
        Sports: "icon-sports.png",
        Strategy: "icon-strategy.png",
        Violence: "icon-vioolence.png",
        Other: "icon-casual.png",
      },
      genreGroups: [
        { label: "Sports", icon: "icon-sports.png" },
        { label: "Action", icon: "icon-action.png" },
        { label: "Simulation", icon: "icon-simulation.png" },
        { label: "Strategy", icon: "icon-strategy.png" },
        { label: "Casual", icon: "icon-casual.png" },
        { label: "Adventure", icon: "icon-adventure.png" },
        { label: "Adult", icon: "icon-adult.png" },
        { label: "Gambling", icon: "icon-gambling.png" },
      ],
    };
  },
  computed: {
    filteredGames() {
      const term = this.searchTerm.trim().toLowerCase();
      const unique = new Map();
      this.allGames.forEach((g) => {
        if (!unique.has(g.appid)) unique.set(g.appid, g);
      });

      return Array.from(unique.values())
        .filter((g) => !term || g.game_title?.toLowerCase().includes(term))
        .filter((g) =>
          this.genreFilter
            ? this.groupGenreKey(g.genres, g.tags) === this.genreFilter
            : true
        )
        .filter((g) =>
          this.ageRatingFilter ? g.acb_rating === this.ageRatingFilter : true
        )
        .sort((a, b) =>
          this.sortKey
            ? Number(b[this.sortKey] || 0) - Number(a[this.sortKey] || 0)
            : 0
        )
        .slice(0, this.visibleCount);
    },
  },
  methods: {
    async fetchGames() {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || "";
      try {
        const res = await fetch(`${baseUrl}/api/steam_games`);
        const data = await res.json();
        this.allGames = Array.isArray(data) ? data : data.data || [];
      } catch (err) {
        console.error("Failed to load games:", err);
      }
    },
    formatYear(date) {
      if (!date) return "N/A";
      const d = new Date(date);
      return isNaN(d.getFullYear()) ? "N/A" : d.getFullYear();
    },
    groupGenreKey(genres, tags) {
      const splitAndClean = (str) =>
        (typeof str === "string"
          ? str.split(",")
          : Array.isArray(str)
          ? str
          : []
        ).map((s) => s.replace(/[{}"]/g, "").trim());

      const all = [...splitAndClean(genres), ...splitAndClean(tags)];

      const mapping = {
        Action: ["Action", "Shooter", "Fighting"],
        Strategy: ["Strategy", "Turn-Based", "Tactics"],
        Simulation: ["Simulation", "Driving", "Management"],
        Casual: ["Puzzle", "Platformer", "Casual"],
        Adventure: ["Adventure", "Exploration", "Indie"],
        Sports: ["Sports", "Racing", "Football"],
        Adult: ["Sexual Content", "Nudity", "NSFW"],
        Gambling: ["Gambling", "Casino", "Cards"],
      };

      for (const [group, keywords] of Object.entries(mapping)) {
        if (all.some((g) => keywords.includes(g))) return group;
      }

      return "Other";
    },
    groupGenre(genres, tags) {
      const splitAndClean = (str) =>
        (typeof str === "string"
          ? str.split(",")
          : Array.isArray(str)
          ? str
          : []
        ).map((s) => s.replace(/[{}"]/g, "").trim());

      const key = this.groupGenreKey(genres, tags);
      const cleaned = [...splitAndClean(genres), ...splitAndClean(tags)];
      return `${key} (${cleaned.join(", ")})`;
    },
    getGenreIcon(key) {
      return this.genreIcons[key] || this.genreIcons.Other;
    },
    toggleGenreDropdown() {
      this.showGenreDropdown = !this.showGenreDropdown;
    },
    onGenreSelect(label) {
      this.genreFilter = label;
      this.showGenreDropdown = false;
    },
    handleClickOutside(event) {
      const dropdown = this.$el.querySelector(".custom-select");
      if (dropdown && !dropdown.contains(event.target)) {
        this.showGenreDropdown = false;
      }
    },
  },
  mounted() {
    this.fetchGames();
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
.dashboard-subtext {
  font-size: 1rem;
  color: #444;
  margin-top: 0.4rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}
.tracker-link {
  color: #007bff;
  font-weight: 600;
  text-decoration: none;
}
.tracker-link:hover {
  text-decoration: underline;
}
.search-filter-wrapper {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 0.8rem 1.2rem;
  border-radius: 40px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.search-rounded {
  flex: 1.5;
  padding: 0.75rem 1.2rem;
  border-radius: 25px;
  border: none;
  background: white;
  font-size: 0.95rem;
}
.dropdown-label {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  min-width: 150px;
}
.dropdown-label select {
  margin-top: 2px;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: white;
  font-size: 0.9rem;
}
.custom-select.small {
  width: 100%;
  cursor: pointer;
  border: 1px solid #ccc;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  background: white;
  margin-top: 2px;
  position: relative;
}
.selected-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.arrow {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}
.arrow.open {
  transform: rotate(180deg);
}
.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #f0f0f0;
}
.dropdown-icon {
  width: 20px;
  height: 20px;
}
.search-btn {
  background: #007bff;
  color: white;
  padding: 0.6rem 1.4rem;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  white-space: nowrap;
}
/* Keep your existing styles for cards, navbar, layout, etc. */
.dashboard-subtext {
  font-size: 1rem;
  color: #444;
  margin-top: 0.4rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}
.tracker-link {
  color: #007bff;
  font-weight: 600;
  text-decoration: none;
}
.tracker-link:hover {
  text-decoration: underline;
}
.search-filter-wrapper {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 0.8rem 1.2rem;
  border-radius: 40px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.search-rounded {
  flex: 1.5;
  padding: 0.75rem 1.2rem;
  border-radius: 25px;
  border: none;
  background: white;
  font-size: 0.95rem;
}
.dropdown-label {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  min-width: 150px;
}
.dropdown-label select {
  margin-top: 2px;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: white;
  font-size: 0.9rem;
}
.custom-select.small {
  width: 100%;
  cursor: pointer;
  border: 1px solid #ccc;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  background: white;
  margin-top: 2px;
  position: relative;
}
.selected-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.arrow {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}
.arrow.open {
  transform: rotate(180deg);
}
.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #f0f0f0;
}
.dropdown-icon {
  width: 20px;
  height: 20px;
}
.search-btn {
  background: #007bff;
  color: white;
  padding: 0.6rem 1.4rem;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  white-space: nowrap;
}
.dashboard-subtext {
  font-size: 1rem;
  color: #444;
  margin-top: 0.4rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}
.tracker-link {
  color: #007bff;
  font-weight: 600;
  text-decoration: none;
}
.tracker-link:hover {
  text-decoration: underline;
}
.search-filter-wrapper {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 0.8rem 1.2rem;
  border-radius: 40px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.search-rounded {
  flex: 1.5;
  padding: 0.75rem 1.2rem;
  border-radius: 25px;
  border: none;
  background: white;
  font-size: 0.95rem;
}

.dropdown-label {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  min-width: 150px;
}

.dropdown-label select {
  margin-top: 2px;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: white;
  font-size: 0.9rem;
}

.custom-select.small {
  width: 100%;
  cursor: pointer;
  border: 1px solid #ccc;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  background: white;
  margin-top: 2px;
  position: relative;
}

.selected-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-icon {
  width: 20px;
  height: 20px;
}

.arrow {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}
.arrow.open {
  transform: rotate(180deg);
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  cursor: pointer;
}
.dropdown-item:hover {
  background: #f0f0f0;
}

.search-btn {
  background: #007bff;
  color: white;
  padding: 0.6rem 1.4rem;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  white-space: nowrap;
}

.genre-dropdown {
  position: relative;
  width: 200px;
}

.custom-select {
  background: #f4f4f4;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  border: 1px solid #ccc;
  position: relative;
}

.selected-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.dropdown-icon {
  width: 20px;
  height: 20px;
}

.arrow {
  margin-left: auto;
  font-size: 0.8rem;
  transition: transform 0.3s;
}

.arrow.open {
  transform: rotate(180deg);
}

.dropdown-list {
  position: absolute;
  top: 105%;
  left: 0;
  width: 100%;
  background: white;
  border-radius: 10px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f0f0f0;
}

/* Existing styles preserved and enhanced */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-in {
  animation: fadeIn 0.7s ease-out;
}

.game-dashboard {
  font-family: "Inter", sans-serif;
  background: #fff;
  min-height: 100vh;
}
.navbar {
  background: white;
  padding: 1.2rem 3rem;
  border-bottom: 1px solid #eee;
}
.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}
.logo-icon {
  width: 60px;
  margin-right: 0.8rem;
}
.logo-text {
  font-size: 1.6rem;
  font-weight: 800;
  color: #111;
}
.nav-menu {
  display: flex;
  gap: 2rem;
}
.nav-link {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  text-decoration: none;
}
.nav-link:hover {
  color: #007bff;
}

.dashboard-main {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}
.dashboard-header h1 {
  font-size: 2.4rem;
  font-weight: 800;
  margin-bottom: 1.2rem;
}

.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}
.search-input {
  flex: 2;
  min-width: 200px;
  padding: 0.8rem 1.2rem;
  border-radius: 25px;
  border: 1px solid #ddd;
  background: #f8f8f8;
}
.filter-pill {
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
  gap: 0.3rem;
}
.filter-pill select {
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.genre-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.genre-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #f5f5f5;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
}
.genre-option.selected {
  background: #d8eaff;
  color: #0047ab;
  font-weight: 600;
}

.search-btn {
  background: #007bff;
  color: white;
  padding: 0.7rem 1.4rem;
  font-weight: 600;
  border: none;
  border-radius: 24px;
  cursor: pointer;
}

.instructions {
  font-size: 1rem;
  margin-bottom: 1.2rem;
  color: #555;
}
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}
.game-card {
  border-radius: 14px;
  overflow: hidden;
  background: white;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.card-top {
  padding: 1rem;
  background: linear-gradient(to right, #ff4e00, #ec9f05);
  color: white;
}
.card-top.violent {
  background: linear-gradient(to right, #d63031, #e17055);
}
.card-top h3 {
  margin: 0;
  font-size: 1.1rem;
}
.card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.genre-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.genre-icon {
  width: 24px;
  height: 24px;
}

.badge {
  background: #eee;
  border-radius: 10px;
  padding: 4px 10px;
  font-size: 0.8rem;
  width: fit-content;
  display: inline-block;
}
.badge.age {
  background: #dff0ff;
  color: #007bff;
}

.tag {
  font-size: 0.7rem;
  background: #ccc;
  color: #222;
  padding: 3px 8px;
  border-radius: 10px;
  width: fit-content;
  margin-top: 0.4rem;
}
.tag.red {
  background: #ffcccc;
  color: #b10000;
}
.no-results {
  text-align: center;
  color: #888;
  margin-top: 2rem;
}
</style>
