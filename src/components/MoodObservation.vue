<template>
  <div class="mood-page">
    <header class="navbar">
      <div class="navbar-container">
        <div class="logo">
          <img src="@/assets/icon.png" alt="Logo" class="logo-icon" />
          <span class="logo-text">Think.Play.Act</span>
        </div>
        <nav class="nav-menu">
          <router-link to="/game-dash" class="nav-link">Game World</router-link>
          <router-link to="/mood-observation" class="nav-link"
            >How They Play</router-link
          >
        </nav>
      </div>
    </header>

    <div class="main-layout">
      <aside class="sidebar">
        <div class="nav-icon">H</div>
        <div class="nav-icon"><img src="@/assets/nav1.png" /></div>
        <div class="nav-icon"><img src="@/assets/nav2.png" /></div>
        <div class="nav-icon"><img src="@/assets/nav3.png" /></div>
      </aside>

      <div class="content">
        <div class="row heading-row">
          <h2 class="page-title">Navigate Post-game Behaviour</h2>
          <div class="chart-heading">
            <h2>How game affect your child’s mood?</h2>
            <span
              class="info-icon"
              title="Observe post-gaming behaviour. Spot patterns and support their well-being."
              >ℹ️</span
            >
          </div>
        </div>

        <div class="row same-height">
          <div class="mood-box">
            <p class="instruction">
              Choose one emotion to understand your child's typical post-play
              behaviours and how you can support them.
            </p>
            <div class="gif-grid">
              <div
                v-for="mood in moods"
                :key="mood.name"
                :class="[
                  'gif-card',
                  { active: selectedMood?.name === mood.name },
                ]"
                @click="selectMood(mood)"
              >
                <img :src="require(`@/assets/${mood.file}`)" :alt="mood.name" />
                <p>{{ mood.name }}</p>
              </div>
            </div>
          </div>

          <div class="chart-area">
            <div class="chart-legend-wrap">
              <div class="chart-container">
                <Bar
                  v-if="chartData"
                  :data="chartData"
                  :options="chartOptions"
                />
              </div>
              <div class="legend-box">
                <h4>Emotional Impact Index:</h4>
                <ul>
                  <li><strong>0–2</strong>: Low emotional impact</li>
                  <li><strong>2–4</strong>: Mild emotional impact</li>
                  <li><strong>4–8</strong>: Moderate emotional impact</li>
                  <li><strong>8–12</strong>: Strong emotional impact</li>
                  <li><strong>12–16</strong>: Intense emotional impact</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="column">
            <div class="info-box">
              <h3>Typical Behaviours</h3>
              <ul>
                <li v-for="(b, i) in selectedMood?.behaviors || []" :key="i">
                  {{ b }}
                </li>
              </ul>
            </div>
            <div class="info-box">
              <h3>Parental Strategies</h3>
              <ul>
                <li v-for="(s, i) in selectedMood?.strategies || []" :key="i">
                  {{ s }}
                </li>
              </ul>
            </div>
          </div>

          <div class="tracker-box">
            <div class="tracker-content">
              <h2>Kids Behaviours Tracking</h2>
              <p class="sub">Start tracking by simple clicks!</p>
              <p>
                Track your kid’s post-play mood and duration to foster healthier
                responses and habits.
              </p>
              <router-link to="/parent-login">
                <button class="start-btn">Start</button>
              </router-link>
            </div>
            <img src="@/assets/angrylight.png" class="light-image" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

export default {
  components: { Bar },
  data() {
    return {
      selectedMood: null,
      chartData: null,
      moods: [
        {
          name: "Joy",
          file: "happy.gif",
          behaviors: [
            "Sports games like FIFA or Rocket League bring joy and excitement.",
            "They improve reflexes but may cause frustration when losing.",
          ],
          strategies: ["1–2 hours is safe — encourage effort, not just wins."],
        },
        {
          name: "Calmness",
          file: "neutral.gif",
          behaviors: [
            "Simulation games like The Sims or Animal Crossing are relaxing.",
            "They offer creative escape and slow-paced play.",
          ],
          strategies: [
            "Limit to ~2 hours and encourage physical activity too.",
          ],
        },
        {
          name: "Frustration",
          file: "angry.gif",
          behaviors: [
            "Strategy games like Age of Empires demand planning.",
            "Losing progress can lead to frustration or restlessness.",
          ],
          strategies: ["Play for 30–60 minutes, encourage breaks and support."],
        },
        {
          name: "Sadness",
          file: "restless.gif",
          behaviors: [
            "RPGs like Final Fantasy or Zelda can be emotionally immersive.",
            "Failures or sad plots may trigger emotional responses.",
          ],
          strategies: [
            "Talk after gameplay to help kids process story emotions.",
          ],
        },
        {
          name: "Excitement",
          file: "excited.gif",
          behaviors: [
            "Action games like Fortnite stimulate adrenaline.",
            "Fast-paced gameplay excites but may cause hyperactivity.",
          ],
          strategies: [
            "Limit play to under 90 mins and add calming time after.",
          ],
        },
      ],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: "end",
            align: "end",
            color: "#000",
            font: { weight: "bold", size: 12 },
            formatter: (value) =>
              typeof value === "number" ? value.toFixed(1) : "",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Emotional Impact ☺" },
            ticks: { stepSize: 2 },
          },
          x: {
            title: { display: true, text: "Game Genre" },
          },
        },
      },
    };
  },
  mounted() {
    const baseURL =
      process.env.VUE_APP_API_BASE_URL ||
      "https://backendtpa-fdhcdfbzh9dbfchz.australiaeast-01.azurewebsites.net";

    axios
      .get(`${baseURL}/api/genre_emotion_summary`)
      .then((res) => {
        if (!Array.isArray(res.data) || res.data.length === 0) {
          console.warn("⚠️ No data received from API.");
          return;
        }

        const labels = res.data.map((entry) => entry.genre || entry.game_genre);
        const data = res.data.map(
          (entry) => entry.intensity || entry.avg_intensity
        );

        this.chartData = {
          labels,
          datasets: [
            {
              label: "Emotional Intensity",
              backgroundColor: [
                "#FFD93D",
                "#7F3FBF",
                "#4285F4",
                "#EA4335",
                "#34A853",
              ],
              data,
            },
          ],
        };
      })
      .catch((err) => {
        console.error("❌ Failed to fetch chart data:", err);
      });
  },
  methods: {
    selectMood(mood) {
      this.selectedMood = mood;
    },
  },
};
</script>

<style scoped>
.navbar {
  background-color: #fff;
  padding: 1.5rem 3rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  gap: 2rem;
}
.nav-link {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  text-decoration: none;
}
.nav-link:hover {
  color: #3498db;
}
.main-layout {
  display: flex;
}
.sidebar {
  width: 70px;
  background: #f7f7f7;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.nav-icon {
  width: 40px;
  height: 40px;
  margin: 1rem 0;
  background: #fce3cd;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-icon img {
  width: 24px;
}
.content {
  flex: 1;
  padding: 2rem;
}
.row {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}
.heading-row {
  align-items: flex-start;
  justify-content: space-between;
}
.page-title,
.section-title {
  font-size: 1.6rem;
  font-weight: bold;
  color: #222;
}
.instruction {
  font-size: 0.95rem;
  color: #444;
  margin-bottom: 1rem;
}
.mood-box {
  background: #fde3cd;
  border-radius: 20px;
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.gif-grid {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
}
.gif-card {
  text-align: center;
  cursor: pointer;
}
.gif-card img {
  width: 60px;
}
.gif-card.active {
  border: 3px solid #ffcc00;
  box-shadow: 0 0 8px #ffcc00;
}
.chart-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.chart-heading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
.info-icon {
  font-size: 1.2rem;
  color: #888;
  cursor: pointer;
}
.chart-legend-wrap {
  display: flex;
  gap: 1rem;
  height: 100%;
}
.chart-container {
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
  flex: 3;
  height: 300px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.legend-box {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #555;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.info-box {
  background: #f7f7f7;
  padding: 1rem;
  border-radius: 14px;
}
.tracker-box {
  background: #fde3cd;
  padding: 1.5rem;
  border-radius: 24px;
  flex: 1;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
.tracker-content {
  max-width: 60%;
}
.sub {
  color: #c49e74;
  font-size: 0.9rem;
}
.start-btn {
  margin-top: 1rem;
  background: #ec8147;
  color: white;
  padding: 0.5rem 1.25rem;
  font-weight: bold;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}
.light-image {
  max-width: 160px;
  object-fit: contain;
}
</style>
