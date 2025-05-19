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
            <div class="chart-heading chart-left">
              <h2>How game affect your child’s mood?</h2>
              <p class="chart-subtext">
                *Emotional Impact:<br />
                Measure how strongly a game genre tends to affect your child
                emotionally.<br />
                High scores = more intense mood changes.
              </p>
            </div>
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
                  <li><strong>0–2</strong>: Low</li>
                  <li><strong>2–4</strong>: Mild</li>
                  <li><strong>4–8</strong>: Moderate</li>
                  <li><strong>8–12</strong>: Strong</li>
                  <li><strong>12–16</strong>: Intense</li>
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
            "Sports games like FIFA, NBA 2K, or Rocket League often bring joy and excitement through competition and winning moments.",
            "They promote fast decision-making and quick reflexes but can also create frustration when losing.",
          ],
          strategies: [
            "A playtime of 1–2 hours is generally safe — encourage your child to celebrate effort, not just outcomes.",
          ],
        },
        {
          name: "Excitement",
          file: "excited.gif",
          behaviors: [
            "Action games such as Call of Duty, Fortnite, or Apex Legends stimulate adrenaline and fast thinking.",
            "They often cause excitement due to high energy gameplay and quick wins, but overexposure can lead to hyperactivity or short temper.",
          ],
          strategies: [
            "Limit sessions to under 90 minutes at a time, and suggest a calm-down period afterward.",
          ],
        },
        {
          name: "Sadness",
          file: "restless.gif",
          behaviors: [
            "Role-playing games like The Legend of Zelda, Final Fantasy, or Genshin Impact immerse kids in deep stories and emotional plots.",
            "While they boost creativity, they can also trigger sadness when characters suffer or fail.",
          ],
          strategies: [
            "Check in after play sessions — discussing in-game stories can help children process these emotions.",
          ],
        },
        {
          name: "Frustration",
          file: "angry.gif",
          behaviors: [
            "Strategy games such as Clash Royale, Age of Empires, or Civilization require planning and decision-making.",
            "They challenge the brain, but losing progress or complex tasks can lead to frustration or restlessness.",
          ],
          strategies: [
            "Sessions of 30–60 minutes are recommended, with breaks and positive reinforcement when they struggle.",
          ],
        },
        {
          name: "Calmness",
          file: "neutral.gif",
          behaviors: [
            "Simulation games like The Sims, Animal Crossing, or Cities: Skylines are typically relaxing and slow-paced.",
            "They offer a creative escape and a calming effect — ideal for unwinding after school.",
          ],
          strategies: [
            "These games are generally low-risk, but screen time should still be limited to about 2 hours, with occasional physical play for balance.",
          ],
        },
      ],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: { display: false },
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
html {
  font-size: 16px;
  overflow: hidden;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.mood-page {
  font-family: "Segoe UI", sans-serif;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #fff;
  padding: 0.8rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
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
  width: 50px;
  margin-right: 0.75rem;
}

.logo-text {
  font-size: 1.6rem;
  font-weight: 800;
  color: #333;
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  text-decoration: none;
}
.nav-link:hover {
  color: #3498db;
}

.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 60px;
  background: #f7f7f7;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.nav-icon {
  width: 36px;
  height: 36px;
  margin: 0.8rem 0;
  background: #fce3cd;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-icon img {
  width: 20px;
}

.content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.same-height {
  align-items: stretch;
}

.heading-row {
  align-items: flex-start;
  justify-content: space-between;
}

.page-title {
  font-size: 1.4rem;
  font-weight: bold;
  color: #222;
}

.chart-heading.chart-left {
  margin-bottom: 0.8rem;
}

.chart-heading h2 {
  margin-bottom: 0.2rem;
  font-size: 1.3rem;
}

.chart-subtext {
  font-size: 0.85rem;
  color: #555;
  line-height: 1.4;
}

.mood-box {
  background: #fde3cd;
  border-radius: 16px;
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.instruction {
  font-size: 0.95rem;
  color: #444;
  margin-bottom: 0.8rem;
}

.gif-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  flex-grow: 1;
  align-items: center;
}

.gif-card {
  flex: 1 1 90px;
  max-width: 120px;
  text-align: center;
  cursor: pointer;
}

.gif-card img {
  width: 100%;
  height: 80px;
  object-fit: contain;
}

.gif-card.active {
  border: 3px solid #ffcc00;
  box-shadow: 0 0 6px #ffcc00;
  border-radius: 12px;
}

.chart-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chart-legend-wrap {
  display: flex;
  height: 100%;
  min-height: 360px;
  background: #fff;
  padding: 1rem;
  border-radius: 16px;
  align-items: flex-start;
}

.chart-container {
  flex: 3;
  height: 100%;
}

.legend-box {
  background: #f5f5f5;
  padding: 0.8rem;
  border-radius: 10px;
  font-size: 0.85rem;
  color: #555;
  flex: 1;
  margin-left: 1rem;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-box {
  background: #f7f7f7;
  padding: 0.8rem;
  border-radius: 12px;
}

.tracker-box {
  background: #fde3cd;
  padding: 1rem;
  border-radius: 20px;
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
  margin-top: 0.8rem;
  background: #ec8147;
  color: white;
  padding: 0.5rem 1rem;
  font-weight: bold;
  border: none;
  border-radius: 18px;
  cursor: pointer;
}

.light-image {
  max-width: 200px;
  object-fit: contain;
}
</style>
