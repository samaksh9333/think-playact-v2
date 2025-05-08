<template>
  <div class="mood-page fade-in">
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

    <section class="instructions">
      <h1>Post-Gaming Mood Tracker</h1>
      <p>
        After your child finishes gaming, use this tool to note how they’re
        feeling. Click the mood that best matches their expression to get clear
        insight into typical behaviors and evidence-based strategies to support
        them.
      </p>
    </section>

    <section class="gif-selector">
      <h2>Select Your Child’s Post-Gaming Mood</h2>
      <div class="gif-grid">
        <div
          v-for="mood in moods"
          :key="mood.name"
          :class="['gif-card', { active: selectedMood?.name === mood.name }]"
          @click="selectMood(mood)"
        >
          <div class="gif-label">{{ mood.name }}</div>
          <img :src="require(`@/assets/${mood.file}`)" :alt="mood.name" />
        </div>
      </div>
    </section>

    <transition name="slide-fade">
      <section v-if="selectedMood" class="info-panel">
        <div class="info-header">
          <h2>{{ selectedMood.name }} Mood</h2>
        </div>
        <div class="info-content">
          <div class="info-box">
            <h3>Typical Behaviors</h3>
            <ol class="numbered-list">
              <li
                v-for="(b, i) in selectedMood.behaviors"
                :key="i"
                v-html="b"
              ></li>
            </ol>
          </div>
          <div class="info-box">
            <h3>Parental Strategies</h3>
            <ol class="numbered-list">
              <li
                v-for="(s, i) in selectedMood.strategies"
                :key="i"
                v-html="s"
              ></li>
            </ol>
          </div>
        </div>
      </section>
    </transition>

    <div class="chart-wrapper" v-if="chartData && chartData.length">
      <div class="chart-inner">
        <h2>Emotional Intensity by Genre</h2>
        <div class="chart-container">
          <Bar :data="moodChart" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

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
  name: "MoodObservation",
  components: { Bar },
  data() {
    return {
      selectedMood: null,
      chartData: [],
      genreDescriptions: {
        Action: `⚡ Risk: Higher chances of gamer rage, impulsivity...`,
        Sports: `⚡ Risk: Competitive frustration or impulsivity...`,
        "Role-Playing": `⚡ Risk: Emotional vulnerability from deep immersion...`,
        Strategy: `⚡ Risk: Peer conflict or frustration with team tasks...`,
        Simulation: `✅ Opportunity: Reflective, calm post-play mood...`,
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 30 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              afterBody: (ctx) => {
                const genre = ctx[0].label;
                return this.genreDescriptions[genre] || "";
              },
            },
          },
          datalabels: {
            anchor: "end",
            align: "end",
            color: "#000",
            font: { weight: "bold", size: 12 },
            formatter: (value, ctx) => {
              const label = this.chartData[ctx.dataIndex]?.emotion_label || "";
              return `${label}\n${value.toFixed(1)}`;
            },
            clip: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Average Emotional Intensity" },
            ticks: { stepSize: 2 },
          },
          x: {
            title: { display: true, text: "Game Genre" },
          },
        },
      },
      moods: [
        {
          name: "Happy",
          file: "happy.gif",
          behaviors: [
            `Cheerful, shares achievements, often smiling.`,
            `Talks excitedly about the game with family.`,
            `Positive carryover into other routines.`,
          ],
          strategies: [
            `Acknowledge their wins to boost self-esteem.`,
            `Create “celebration rituals” after gaming.`,
            `Use their good mood to initiate bonding tasks.`,
          ],
        },
        {
          name: "Neutral",
          file: "neutral.gif",
          behaviors: [
            `Calmly transitions to next task.`,
            `Tone remains steady and relaxed.`,
            `No obvious emotional shift after gaming.`,
          ],
          strategies: [
            `Keep environment balanced with low stimulation.`,
            `Maintain consistent routine.`,
            `Use calmness to introduce shared responsibilities.`,
          ],
        },
        {
          name: "Irritable",
          file: "angry.gif",
          behaviors: [
            `Short-tempered when asked to stop gaming.`,
            `Grumbles or resists transition tasks.`,
            `Elevated stress response post-play.`,
          ],
          strategies: [
            `Use a calm, validating tone.`,
            `Offer cool-down breaks like deep breathing.`,
            `Avoid forcing conversation immediately.`,
          ],
        },
        {
          name: "Restless",
          file: "restless.gif",
          behaviors: [
            `Fidgeting, tapping, or physical jittering.`,
            `Difficulty settling into non-gaming tasks.`,
            `High energy after intense in-game stimuli.`,
          ],
          strategies: [
            `Redirect into physical activity (stretching, jumping).`,
            `Incorporate grounding exercises.`,
            `Offer water/snack to reset routine.`,
          ],
        },
        {
          name: "Excited",
          file: "excited.gif",
          behaviors: [
            `Overtalking or reenacting game scenes.`,
            `Increased motion and verbal excitement.`,
            `Enthusiastic storytelling about gameplay.`,
          ],
          strategies: [
            `Ask guiding questions to let them share.`,
            `Use the energy to co-create stories or draw.`,
            `Set time limits for excitement wind-down.`,
          ],
        },
      ],
    };
  },
  computed: {
    moodChart() {
      return {
        labels: this.chartData.map((d) => d.game_genre),
        datasets: [
          {
            label: "Emotional Impact",
            backgroundColor: this.chartData.map((d) => {
              const colors = {
                Joy: "#FFD700",
                Excitement: "#800080",
                Sadness: "#0000FF",
                Frustration: "#FF0000",
                Calmness: "#228B22",
              };
              return colors[d.emotion_label] || "#3498db";
            }),
            data: this.chartData.map((d) => d.avg_intensity),
          },
        ],
      };
    },
  },
  methods: {
    selectMood(mood) {
      this.selectedMood = mood;
    },
    async fetchChartData() {
      const baseUrl = process.env.VUE_APP_API_BASE_URL || "";
      try {
        const res = await fetch(`${baseUrl}/api/genre_emotion_summary`);
        const data = await res.json();
        this.chartData = data;
      } catch (err) {
        console.error("Failed to load emotion summary:", err);
      }
    },
  },
  created() {
    this.fetchChartData();
  },
};
</script>

<style scoped>
.mood-page {
  font-family: "Roboto", sans-serif;
  background-color: #f9fafa;
  padding-top: 6rem;
  min-height: 100vh;
  color: #333;
}

.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-icon {
  width: 60px;
  margin-right: 0.75rem;
}

.logo-text {
  font-size: 1.75rem;
  font-weight: 800;
  color: #2c3e50;
}

.nav-menu .nav-link {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  text-decoration: none;
}

.instructions {
  max-width: 800px;
  margin: 2rem auto;
  text-align: center;
}

.instructions h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.instructions p {
  color: #666;
  font-size: 1.05rem;
  line-height: 1.6;
}

.gif-selector {
  max-width: 1000px;
  margin: 2rem auto;
  text-align: center;
}

.gif-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.gif-card {
  background: #fff;
  border-radius: 12px;
  padding: 0.5rem;
  width: 90px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.gif-card img {
  width: 100%;
  border-radius: 6px;
}

.gif-label {
  font-weight: bold;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.gif-card.active {
  box-shadow: 0 0 12px rgba(52, 152, 219, 0.5);
  transform: scale(1.05);
}

.info-panel {
  max-width: 800px;
  margin: 2rem auto;
  background: #4a90e2;
  color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
}

.info-content {
  display: flex;
  gap: 1.5rem;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.info-box {
  background: #fff;
  color: #333;
  flex: 1 1 48%;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.chart-wrapper {
  display: flex;
  justify-content: center;
  margin: 2rem auto;
}

.chart-inner {
  background: #fff;
  max-width: 800px;
  width: 100%;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.chart-inner h2 {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
}
</style>
