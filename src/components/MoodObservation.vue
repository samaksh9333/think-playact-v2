<template>
  <div class="mood-page">
    <!-- Top Navbar -->
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
          <router-link to="/game-dash" class="nav-link">Game World</router-link>
          <router-link to="/mood-observation" class="nav-link"
            >How They Play</router-link
          >
        </nav>
      </div>
    </header>

    <!-- Main Body -->
    <div class="main-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="nav-icon">H</div>
        <div class="nav-icon"><img src="@/assets/nav1.png" alt="nav1" /></div>
        <div class="nav-icon"><img src="@/assets/nav2.png" alt="nav2" /></div>
        <div class="nav-icon"><img src="@/assets/nav3.png" alt="nav3" /></div>
      </aside>

      <!-- Content Area -->
      <div class="content">
        <h1 class="heading">Navigate Post-game Behaviour</h1>

        <!-- Mood + Chart Row -->
        <div class="row">
          <div class="mood-box">
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

          <div class="chart-container">
            <Bar :data="moodChart" :options="chartOptions" />
          </div>
        </div>

        <!-- Info Boxes + Tracker Row -->
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
      moods: [
        {
          name: "Happy",
          file: "happy.gif",
          behaviors: [
            "Cheerful and cooperative",
            "Talks about game highlights",
            "Positive attitude afterwards",
          ],
          strategies: [
            "Celebrate wins together",
            "Use mood to bond",
            "Encourage storytelling",
          ],
        },
        {
          name: "Neutral",
          file: "neutral.gif",
          behaviors: [
            "Calm and quiet",
            "No strong emotional signs",
            "Transitions smoothly",
          ],
          strategies: [
            "Maintain routine",
            "Relaxing activities",
            "Light conversation",
          ],
        },
        {
          name: "Irritable",
          file: "angry.gif",
          behaviors: ["Snaps back", "Avoids talking", "Frustrated easily"],
          strategies: ["Allow cool-down", "Use calm tones", "Delay tasks"],
        },
        {
          name: "Restless",
          file: "restless.gif",
          behaviors: [
            "Pacing or fidgeting",
            "Can’t settle",
            "Wants to play more",
          ],
          strategies: [
            "Redirect to movement",
            "Grounding tasks",
            "Small snack",
          ],
        },
        {
          name: "Excited",
          file: "excited.gif",
          behaviors: ["Hyper talking", "Shares fast", "Animated gestures"],
          strategies: [
            "Let them express",
            "Drawing/storytelling",
            "Calming activity",
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
            formatter: (value) => `${value.toFixed(1)}`,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Intensity" },
            ticks: { stepSize: 2 },
          },
          x: { title: { display: true, text: "Game Genre" } },
        },
      },
    };
  },
  computed: {
    moodChart() {
      return {
        labels: ["Action", "Sports", "RPG", "Simulation", "Strategy"],
        datasets: [
          {
            label: "Emotional Intensity",
            backgroundColor: [
              "#FF6B6B",
              "#FFD93D",
              "#6BCB77",
              "#4D96FF",
              "#CDB4DB",
            ],
            data: [6.8, 5.5, 4.7, 3.2, 6.1],
          },
        ],
      };
    },
  },
  methods: {
    selectMood(mood) {
      this.selectedMood = mood;
    },
  },
};
</script>

<style scoped>
/* Top navbar */
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
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}
.nav-link:hover {
  color: #3498db;
}

.main-layout {
  display: flex;
}

/* Sidebar */
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
  height: 24px;
}

/* Content layout */
.content {
  flex: 1;
  padding: 2rem;
}
.heading {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}
.row {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}
.mood-box {
  background: #fde3cd;
  border-radius: 20px;
  padding: 1.5rem;
  flex: 1;
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
  border-radius: 12px;
  padding: 0.25rem;
  transition: all 0.2s ease;
}
.gif-card img {
  width: 60px;
}
.gif-card.active {
  border: 3px solid #ffcc00;
  box-shadow: 0 0 8px #ffcc00;
}
.chart-container {
  background: #fff;
  border-radius: 16px;
  padding: 1rem;
  flex: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  height: 300px;
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
.info-box h3 {
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.tracker-box {
  background: #fde3cd;
  padding: 1.5rem;
  border-radius: 24px;
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}
.tracker-content {
  max-width: 60%;
}
.sub {
  color: #c49e74;
  font-size: 0.9rem;
  margin: 0.3rem 0;
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
  height: auto;
  object-fit: contain;
}
</style>
