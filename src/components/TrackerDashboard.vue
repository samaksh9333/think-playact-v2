<template>
  <div class="tracker-dashboard">
    <header class="navbar">
      <div class="navbar-container">
        <div class="logo">
          <img src="@/assets/icon.png" alt="Logo" class="logo-icon" />
          <span class="logo-text">Think.Play.Act</span>
        </div>
        <nav class="nav-menu">
          <router-link to="/game-dash" class="nav-link">Game World</router-link>
          <router-link to="/" class="nav-link">Home</router-link>
        </nav>
      </div>
    </header>

    <div class="main-layout">
      <aside class="sidebar">
        <div class="nav-icon initials">{{ userInitial }}</div>
        <div class="nav-icon" @click="showTracker = true">+</div>
        <router-link to="/game-dash" class="nav-icon"
          ><img src="@/assets/nav1.png"
        /></router-link>
        <router-link to="/tracker" class="nav-icon"
          ><img src="@/assets/nav2.png"
        /></router-link>
        <div class="nav-icon" @click="showInsights = true">
          <img src="@/assets/insight.png" />
        </div>
      </aside>

      <div class="dashboard-main">
        <div class="header-row">
          <h1>Post-game Tracking</h1>
          <button class="pill-btn" @click="showTracker = true">
            Add Tracking <span>+</span>
          </button>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-number">{{ filteredLogs.length }}</div>
            <div class="stat-label">Games</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ totalHours }} hrs</div>
            <div class="stat-label">Hours</div>
          </div>
        </div>

        <h2 class="section-title">Data Insights</h2>
        <div class="insights-grid">
          <div class="calendar-box">
            <p><strong>Select a date to filter</strong></p>
            <vue-datepicker
              v-model="selectedDate"
              :max-date="new Date()"
              :highlighted="highlightedDates"
              :formatter="{ stringify: formatDayLabel }"
            />
            <p class="calendar-note">🔴 Red = data exists</p>

            <!-- 🎮 Hardcoded Top Played Info -->
            <div class="top-played-box">
              <p>
                <strong>📅 Top This Week:</strong><br />Genre: Open World<br />Game:
                GTA 5
              </p>
              <p style="margin-top: 1rem">
                <strong>📅 Top This Month:</strong><br />Genre: Open World<br />Game:
                GTA 5
              </p>
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-header">
              <h4>
                {{ filter === "week" ? "Weekly Summary" : "Monthly Summary" }}
              </h4>
              <div class="toggle">
                <button
                  :class="{ active: filter === 'week' }"
                  @click="setFilter('week')"
                >
                  W
                </button>
                <button
                  :class="{ active: filter === 'month' }"
                  @click="setFilter('month')"
                >
                  M
                </button>
              </div>
            </div>
            <p class="summary-sub">Avg: {{ averageHours }} hrs</p>
            <p class="summary-sub">Total: {{ totalHours }} hrs</p>
            <bar-chart
              v-if="chartLabels.length"
              :labels="chartLabels"
              :values="chartData"
              :height="140"
            />
            <p v-else class="calendar-note">
              No data available. Try logging new entries!
            </p>
            <button class="insights-btn" @click="showInsights = true">
              🧠 Insights
            </button>
          </div>
        </div>

        <TrackerModal
          :show="showTracker"
          @submit="handleTrackerSubmit"
          @close="showTracker = false"
        />

        <!-- 📘 Insights Modal -->
        <div
          v-if="showInsights"
          class="modal-overlay"
          @click.self="showInsights = false"
        >
          <div class="modal-content">
            <div class="modal-header">
              <h2>🧠 Research-Based Insights</h2>
              <button class="close-button" @click="showInsights = false">
                ×
              </button>
            </div>
            <div class="modal-body">
              <p><strong>Safe Gaming Limits for Teens:</strong></p>
              <ul>
                <li>
                  <strong>Moderate Gaming (1–3 hrs/day):</strong> Better
                  psychological adjustment.
                </li>
                <li>
                  <strong>Excessive Gaming (&gt;4 hrs/day):</strong> Linked to
                  anxiety and poor sleep.
                </li>
              </ul>
              <p><strong>Impact of Game Genre:</strong></p>
              <ul>
                <li>
                  <strong>Violent Games:</strong> May increase aggression.
                </li>
                <li>
                  <strong>Prosocial Games:</strong> Boost empathy and mood.
                </li>
              </ul>
              <p><strong>Time Played:</strong></p>
              <ul>
                <li><strong>Short (30–60 min):</strong> Positive.</li>
                <li><strong>Prolonged (&gt;3 hrs):</strong> Risky.</li>
              </ul>
              <p><strong>Parental Tips:</strong></p>
              <ul>
                <li>Cap at 2–3 hrs/day with breaks.</li>
                <li>Mix genres. Watch content.</li>
                <li>Prioritize sleep and school.</li>
              </ul>
              <p>
                <strong>Conclusion:</strong> Moderate, diverse, social play =
                good. Excess = risk.
              </p>
              <p class="sources">
                <em>Sources: WHO, APA, Oxford, Granic et al.</em>
              </p>
            </div>
          </div>
        </div>
        <!-- 🔚 End of Modal -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import BarChart from "./BarChart.vue";
import TrackerModal from "./TrackerModal.vue";
import VueDatepicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";

const BASE_URL = process.env.VUE_APP_API_BASE_URL || "";

export default {
  components: { BarChart, TrackerModal, VueDatepicker },
  data() {
    return {
      showTracker: false,
      showInsights: false,
      filter: "week",
      selectedDate: new Date(),
      weeklyLogs: [],
      monthlyLogs: [],
    };
  },
  computed: {
    userInitial() {
      const email = localStorage.getItem("parentEmail") || "H";
      return email.charAt(0).toUpperCase();
    },
    currentLogs() {
      return this.filter === "week" ? this.weeklyLogs : this.monthlyLogs;
    },
    filteredLogs() {
      const selectedMonth = this.selectedDate.toISOString().slice(0, 7);
      return this.currentLogs.filter(
        (log) => log.play_date && log.play_date.startsWith(selectedMonth)
      );
    },
    totalMinutes() {
      return this.filteredLogs.reduce(
        (sum, l) => sum + (l.play_duration_minutes || 0),
        0
      );
    },
    totalHours() {
      return (this.totalMinutes / 60).toFixed(1);
    },
    averageHours() {
      const divisor = this.filter === "week" ? 7 : 30;
      return (this.totalMinutes / divisor / 60).toFixed(1);
    },
    chartLabels() {
      return this.filteredLogs.map((log) =>
        new Date(log.play_date).toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
        })
      );
    },
    chartData() {
      return this.filteredLogs.map((log) =>
        (log.play_duration_minutes / 60).toFixed(2)
      );
    },
    highlightedDates() {
      return this.currentLogs.map((log) => new Date(log.play_date));
    },
  },
  methods: {
    setFilter(newFilter) {
      this.filter = newFilter;
      this.selectedDate = new Date();
    },
    formatDayLabel(date) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    },
    async fetchLogs() {
      const email = localStorage.getItem("parentEmail");
      if (!email) return;
      try {
        const [week, month] = await Promise.all([
          axios.get(`${BASE_URL}/api/tracker_logs`, {
            params: { parent_email: email, period: "week" },
          }),
          axios.get(`${BASE_URL}/api/tracker_logs`, {
            params: { parent_email: email, period: "month" },
          }),
        ]);
        this.weeklyLogs = Array.isArray(week.data) ? week.data : [];
        this.monthlyLogs = Array.isArray(month.data) ? month.data : [];
      } catch (err) {
        console.error("❌ Error fetching logs:", err);
        this.weeklyLogs = [];
        this.monthlyLogs = [];
      }
    },
    async handleTrackerSubmit(entry) {
      const email = localStorage.getItem("parentEmail");
      if (!email) return alert("Please log in first.");
      const payload = {
        parent_email: email,
        mood: entry.mood,
        game_name: entry.game_name,
        game_genre: entry.game_genre,
        play_date: entry.play_date,
        play_duration_minutes:
          parseInt(entry.hours || 0) * 60 + parseInt(entry.minutes || 0),
      };
      try {
        await axios.post(`${BASE_URL}/api/tracker_logs`, payload);
        this.showTracker = false;
        await this.fetchLogs();
      } catch (err) {
        alert("❌ Submission failed.");
        console.error(err);
      }
    },
  },
  mounted() {
    this.fetchLogs();
  },
};
</script>

<style scoped>
/* 🌐 Top Navbar */
.navbar {
  background-color: #fff;
  padding: 0.8rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}
.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}
.logo {
  display: flex;
  align-items: center;
}
.logo-icon {
  width: 36px;
  margin-right: 0.75rem;
}
.logo-text {
  font-size: 1.6rem;
  font-weight: 800;
  color: #333;
}
.nav-menu {
  display: flex;
  gap: 2rem;
}
.nav-link {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  text-decoration: none;
}
.nav-link:hover {
  color: #007bff;
}

/* 🟨 Sidebar */
.main-layout {
  display: flex;
  height: calc(100vh - 70px);
  overflow: hidden;
}
.sidebar {
  width: 70px;
  background: #f7f7f7;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  box-shadow: 1px 0 4px rgba(0, 0, 0, 0.05);
}
.nav-icon {
  width: 40px;
  height: 40px;
  margin: 0.8rem 0;
  background: #fce3cd;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #333;
  cursor: pointer;
}
.nav-icon img {
  width: 20px;
}

/* 🧠 Dashboard Content */
.dashboard-main {
  flex: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
  background-color: #fcfcfc;
}

/* 🧾 Header */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.header-row h1 {
  font-size: 2rem;
  font-weight: bold;
}
.pill-btn {
  background: linear-gradient(to right, #000, #007bff);
  color: white;
  padding: 0.6rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
}

/* 📈 Stats */
.stats-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.stat-card {
  flex: 1;
  min-width: 200px;
  background: #125cf2;
  color: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
}
.stat-number {
  font-size: 2.2rem;
  font-weight: 700;
}
.stat-label {
  font-size: 1rem;
  margin-top: 0.3rem;
}

/* 📅 Insights */
.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
.insights-grid {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

/* 📆 Calendar */
.calendar-box {
  background: #f5f8ff;
  padding: 1.2rem;
  border-radius: 14px;
  flex: 1;
  min-width: 260px;
  max-width: 300px;
  text-align: center;
}
.calendar-note {
  font-size: 0.85rem;
  margin-top: 0.5rem;
  color: #888;
}

/* 📊 Chart Summary */
.summary-card {
  background: #f5f8ff;
  padding: 1.5rem;
  border-radius: 14px;
  flex: 2;
  min-width: 400px;
  width: 100%;
}
.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.toggle {
  display: flex;
  gap: 0.5rem;
}
.toggle button {
  padding: 0.4rem 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  font-weight: 600;
}
.toggle .active {
  background: #125cf2;
  color: white;
  border-color: #125cf2;
}
.summary-sub {
  font-size: 0.9rem;
  margin-top: 0.6rem;
}

/* 📘 Insight */
.insight-card {
  background: #fff8e1;
  border-left: 5px solid #ff9800;
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #333;
  text-align: left;
  white-space: pre-line;
}
.insight-card h4 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
}
.insight-text {
  line-height: 1.5;
}

/* 🔍 Insights Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: white;
  max-width: 680px;
  width: 90%;
  padding: 2rem;
  border-radius: 12px;
  overflow-y: auto;
  max-height: 90vh;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.modal-header h2 {
  font-size: 1.4rem;
}
.close-button {
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
}
.modal-body {
  font-size: 0.95rem;
  color: #444;
}
.modal-body ul {
  margin: 0.5rem 0 1rem;
  padding-left: 1.2rem;
}
.modal-body ul li {
  margin-bottom: 0.4rem;
}
.sources {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #666;
  text-align: right;
}

.insights-btn {
  margin-top: 1rem;
  background-color: #ec8147;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  font-size: 0.9rem;
  font-weight: bold;
  border-radius: 18px;
  cursor: pointer;
}

/* Insight Modal Styles */
.insight-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}
.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}
.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 90%;
  max-width: 700px;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 9999;
}
.insight-body {
  max-height: 60vh;
  overflow-y: auto;
  font-size: 0.95rem;
  color: #333;
  line-height: 1.6;
}
.close-btn {
  margin-top: 1rem;
  background: #3498db;
  color: white;
  padding: 0.6rem 1.4rem;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.top-played-box {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  background: #e7f4ff;
  padding: 0.8rem;
  border-radius: 8px;
  color: #333;
  text-align: left;
}
</style>
