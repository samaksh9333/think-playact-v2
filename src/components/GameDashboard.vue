<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
    <!-- Navbar -->
    <nav
      class="bg-indigo-600 text-white p-4 flex justify-between items-center fixed w-full z-10"
    >
      <div class="text-2xl font-bold flex items-center space-x-2">
        <img src="@/assets/icon.png" alt="ThinkPlayAct Logo" class="w-8 h-8" />
        <span>ThinkPlay Act</span>
      </div>
      <router-link to="/" class="hover:underline text-lg">Home</router-link>
    </nav>

    <!-- Push content below fixed navbar -->
    <div class="pt-20 flex-1 flex flex-col md:flex-row overflow-hidden">
      <!-- Sidebar Filters/Search -->
      <aside
        class="w-full md:w-64 bg-white p-6 border-b md:border-b-0 md:border-r"
      >
        <h2 class="text-indigo-700 text-lg font-semibold mb-4">
          Filters &amp; Search
        </h2>
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search games…"
          class="w-full mb-4 p-2 border rounded focus:ring-indigo-400"
        />
        <label class="block mb-1 text-sm">Violence Level</label>
        <select
          v-model="violenceFilter"
          class="w-full mb-4 p-2 border rounded focus:ring-indigo-400"
        >
          <option value="">All Levels</option>
          <option value="Non-Violent">Non-Violent</option>
          <option value="Moderately Violent">Moderately Violent</option>
          <option value="Highly Violent">Highly Violent</option>
        </select>
        <label class="block mb-1 text-sm">Sort By</label>
        <select
          v-model="sortKey"
          class="w-full p-2 border rounded focus:ring-indigo-400"
        >
          <option value="owners_lower">Popularity</option>
          <option value="average_playtime">Avg. Playtime</option>
          <option value="avg_emotional_intensity">Emotion Intensity</option>
        </select>
      </aside>

      <!-- Games Grid -->
      <main class="flex-1 p-6 overflow-auto">
        <h2 class="text-2xl font-semibold text-gray-700 mb-4">
          {{ headerText }}
        </h2>

        <div v-if="!filteredGames.length" class="text-center text-gray-500">
          No games match.
        </div>

        <div v-else class="games-grid">
          <div
            v-for="game in filteredGames"
            :key="game.game_title"
            @click="selectGame(game)"
            class="game-card"
          >
            <h3 class="font-semibold truncate mb-2">{{ game.game_title }}</h3>
            <p class="text-sm text-gray-600">
              {{ new Date(game.release_date).getFullYear() }} &bull;
              {{ Number(game.owners_lower).toLocaleString() }} owners
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameDashboard",
  data() {
    return {
      games: [],
      searchTerm: "",
      violenceFilter: "",
      sortKey: "owners_lower",
      PAGE_SIZE: 10,
    };
  },
  computed: {
    headerText() {
      return !this.searchTerm && !this.violenceFilter
        ? "Top 10 Popular Games"
        : "Matching Games";
    },
    filteredGames() {
      const term = this.searchTerm.trim().toLowerCase();
      let list = this.games
        .filter((g) =>
          term ? g.game_title.toLowerCase().includes(term) : true
        )
        .filter((g) =>
          this.violenceFilter ? g.violence_level === this.violenceFilter : true
        )
        .sort((a, b) => Number(b[this.sortKey]) - Number(a[this.sortKey]));

      // Only top N when no search/filter
      return !term && !this.violenceFilter
        ? list.slice(0, this.PAGE_SIZE)
        : list;
    },
  },
  methods: {
    async fetchGames() {
      // front-end will see VUE_APP_API_BASE_URL in production, or use '/api' in dev
      const base = process.env.VUE_APP_API_URL || "";
      const endpoint = base
        ? `${base}/api/classified_steam_games`
        : "/api/classified_steam_games";

      try {
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        this.games = await res.json();
      } catch (err) {
        console.error("Failed to load games:", err);
      }
    },
    selectGame(game) {
      console.log("Selected:", game.game_title);
    },
  },
  created() {
    this.fetchGames();
  },
};
</script>

<style scoped>
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
.game-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.game-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
/* ensure we push content below fixed navbar */
.min-h-screen {
  height: 100vh;
  padding-top: 4rem;
}
@media (max-width: 768px) {
  .games-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
}
</style>
