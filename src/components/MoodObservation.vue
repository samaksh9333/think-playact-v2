<template>
  <div class="mood-page fade-in">
    <!-- Navbar -->
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
          <button v-if="user" @click="logout" class="nav-link logout-button">
            Log Out
          </button>
        </nav>
      </div>
    </header>

    <!-- Auth Section -->
    <div v-if="!user" class="auth-container">
      <div class="auth-box">
        <h2>{{ isSignup ? "Sign Up" : "Parent Login" }}</h2>
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />
        <button @click="isSignup ? signup() : login()">
          {{ isSignup ? "Create Account" : "Login" }}
        </button>
        <p class="switch-auth">
          {{ isSignup ? "Already have an account?" : "Need an account?" }}
          <span @click="isSignup = !isSignup">
            {{ isSignup ? "Login here" : "Sign up" }}
          </span>
        </p>
        <p v-if="error" class="error-text">{{ error }}</p>
      </div>
    </div>

    <!-- Logged-In Tracker -->
    <div v-else>
      <section class="instructions">
        <h1>Post-Gaming Mood Tracker</h1>
        <p>
          After your child finishes gaming, select the mood that best matches
          their behavior. You’ll get insights and parenting tips, along with
          weekly/monthly time tracking.
        </p>
      </section>

      <!-- Mood Selection -->
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

      <!-- Mood Info Panel -->
      <transition name="slide-fade">
        <section v-if="selectedMood" class="info-panel">
          <div class="info-header">
            <h2>{{ selectedMood.name }} Mood</h2>
          </div>
          <div class="info-content">
            <div class="info-box">
              <h3>Typical Behaviors</h3>
              <ol class="numbered-list">
                <li v-for="(b, i) in selectedMood.behaviors" :key="i">
                  {{ b }}
                </li>
              </ol>
            </div>
            <div class="info-box">
              <h3>Parental Strategies</h3>
              <ol class="numbered-list">
                <li v-for="(s, i) in selectedMood.strategies" :key="i">
                  {{ s }}
                </li>
              </ol>
            </div>
          </div>
        </section>
      </transition>

      <!-- Game Time Logger -->
      <section class="game-time-tracker">
        <h2>Log Game Time</h2>
        <input
          type="number"
          v-model="gameDuration"
          placeholder="Duration (min)"
        />
        <button @click="logGameTime">Log Time</button>
        <p v-if="lastLoggedTime">Last session: {{ lastLoggedTime }} min</p>
        <p>
          Total this week: {{ totalWeekly }} min | This month:
          {{ totalMonthly }} min
        </p>
      </section>

      <!-- Chart -->
      <div class="chart-wrapper" v-if="chartData.length">
        <div class="chart-inner">
          <h2>Emotional Intensity by Genre</h2>
          <div class="chart-container">
            <Bar :data="moodChart" :options="chartOptions" />
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
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "@/firebase";

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
  name: "MoodTracker",
  components: { Bar },
  data() {
    return {
      user: null,
      email: "",
      password: "",
      error: "",
      isSignup: false,
      selectedMood: null,
      gameDuration: null,
      lastLoggedTime: null,
      totalWeekly: 0,
      totalMonthly: 0,
      chartData: [],
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
            "Maintain regular routine",
            "Use time for relaxing activities",
            "Light conversation",
          ],
        },
        {
          name: "Irritable",
          file: "angry.gif",
          behaviors: ["Snaps back", "Avoids talking", "Frustrated easily"],
          strategies: [
            "Allow cool-down time",
            "Use calm tones",
            "Delay tasks briefly",
          ],
        },
        {
          name: "Restless",
          file: "restless.gif",
          behaviors: [
            "Pacing or fidgeting",
            "Can’t settle down",
            "Wants to play more",
          ],
          strategies: [
            "Redirect energy to movement",
            "Offer grounding tasks",
            "Small healthy snack",
          ],
        },
        {
          name: "Excited",
          file: "excited.gif",
          behaviors: [
            "Fast-talking, hyper",
            "Shares game moments quickly",
            "Animated gestures",
          ],
          strategies: [
            "Let them express then slow it down",
            "Encourage drawing/storytelling",
            "Set a calming activity next",
          ],
        },
      ],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
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
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Avg. Emotional Intensity" },
            ticks: { stepSize: 2 },
          },
          x: {
            title: { display: true, text: "Game Genre" },
          },
        },
      },
      genreDescriptions: {
        Action: "⚡ Risk: High tension and reactivity",
        Sports: "⚡ Risk: Competition can increase stress",
        "Role-Playing": "⚡ Risk: Deep emotional immersion",
        Strategy: "⚡ Risk: Mental overload and team stress",
        Simulation: "✅ Calm, lower arousal post-play",
      },
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
              const map = {
                Joy: "#FFD700",
                Excitement: "#800080",
                Sadness: "#0000FF",
                Frustration: "#FF0000",
                Calmness: "#228B22",
              };
              return map[d.emotion_label] || "#3498db";
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
      try {
        const baseUrl = process.env.VUE_APP_API_BASE_URL || "";
        const res = await fetch(`${baseUrl}/api/genre_emotion_summary`);
        this.chartData = await res.json();
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    },
    logGameTime() {
      if (this.gameDuration && this.gameDuration >= 0) {
        this.totalWeekly += Number(this.gameDuration);
        this.totalMonthly += Number(this.gameDuration);
        this.lastLoggedTime = this.gameDuration;
        this.gameDuration = null;
      } else {
        alert("Enter a valid game duration.");
      }
    },
    async login() {
      this.error = "";
      try {
        await setPersistence(auth, browserSessionPersistence);
        const cred = await signInWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        this.user = cred.user;
      } catch {
        this.error = "Login failed. Please check your credentials.";
      }
    },
    async signup() {
      this.error = "";
      try {
        await setPersistence(auth, browserSessionPersistence);
        const cred = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );
        this.user = cred.user;
      } catch {
        this.error = "Signup failed. Use a valid email and password.";
      }
    },
    async logout() {
      try {
        await signOut(auth);
        this.user = null;
      } catch (err) {
        console.error("Logout error:", err);
      }
    },
  },
  mounted() {
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
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

.nav-menu {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
}

.logout-button {
  background-color: #e74c3c;
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  border: none;
}

.auth-container {
  display: flex;
  justify-content: center;
  margin-top: 5rem;
}

.auth-box {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.auth-box input {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.auth-box button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: #4a90e2;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.switch-auth {
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.switch-auth span {
  color: #3498db;
  cursor: pointer;
  font-weight: bold;
  margin-left: 0.25rem;
}

.error-text {
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5rem;
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
  flex-wrap: wrap;
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

.numbered-list {
  list-style: decimal inside;
  padding-left: 1rem;
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

.game-time-tracker {
  text-align: center;
  margin: 2rem auto;
  max-width: 500px;
}

.game-time-tracker input {
  padding: 0.5rem;
  width: 120px;
  margin-right: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.game-time-tracker button {
  padding: 0.5rem 1rem;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 0.5rem;
}
</style>
