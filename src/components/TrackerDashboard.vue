<template>
  <div class="tracker-dashboard">
    <!-- Top Navbar -->
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

    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="nav-icon initials">{{ userInitial }}</div>
        <div class="nav-icon" @click="showTracker = true">+</div>
        <router-link to="/game-dash" class="nav-icon"
          ><img src="@/assets/nav1.png"
        /></router-link>
        <router-link to="/tracker-dashboard" class="nav-icon"
          ><img src="@/assets/nav2.png"
        /></router-link>
        <router-link to="/settings" class="nav-icon"
          ><img src="@/assets/nav3.png"
        /></router-link>
      </aside>

      <!-- Dashboard -->
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
          <!-- Calendar -->
          <div class="calendar-box">
            <p><strong>Select a date to filter</strong></p>
            <vue-datepicker
              v-model="selectedDate"
              :max-date="new Date()"
              :highlighted="highlightedDates"
              :formatter="{ stringify: formatDayLabel }"
            />
            <p class="calendar-note">🔴 Red = data exists</p>
          </div>

          <!-- Chart Summary -->
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
              No data available for selected filter.
            </p>
          </div>
        </div>

        <!-- Modal -->
        <TrackerModal
          :show="showTracker"
          @submit="handleTrackerSubmit"
          @close="showTracker = false"
        />
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

export default {
  components: { BarChart, TrackerModal, VueDatepicker },
  data() {
    return {
      showTracker: false,
      filter: "week",
      selectedDate: new Date(),
      weeklyLogs: [], // Make sure these are always arrays
      monthlyLogs: [],
    };
  },
  computed: {
    userInitial() {
      const email = localStorage.getItem("parentEmail") || "H";
      return email.charAt(0).toUpperCase();
    },
    currentLogs() {
      const logs = this.filter === "week" ? this.weeklyLogs : this.monthlyLogs;
      return Array.isArray(logs) ? logs : [];
    },
    filteredLogs() {
      if (!this.selectedDate) return this.currentLogs;
      const selectedDateStr = this.selectedDate.toISOString().split("T")[0];

      if (this.filter === "week") {
        const start = this.getWeekStart(this.selectedDate);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);

        return this.currentLogs.filter((log) => {
          const date = new Date(log.play_date);
          return date >= start && date <= end;
        });
      } else {
        return this.currentLogs.filter(
          (log) => log.play_date === selectedDateStr
        );
      }
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
      this.selectedDate = new Date(); // Reset date to today
    },
    formatDayLabel(date) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    },
    getWeekStart(date) {
      const copied = new Date(date);
      const day = copied.getDay();
      const diff = copied.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
      return new Date(copied.setDate(diff));
    },
    async fetchLogs() {
      const email = localStorage.getItem("parentEmail");
      if (!email) return;
      try {
        const [week, month] = await Promise.all([
          axios.get("/api/tracker_logs", {
            params: { parent_email: email, period: "week" },
          }),
          axios.get("/api/tracker_logs", {
            params: { parent_email: email, period: "month" },
          }),
        ]);

        // Defensive assignment
        this.weeklyLogs = Array.isArray(week.data) ? week.data : [];
        this.monthlyLogs = Array.isArray(month.data) ? month.data : [];

        console.log("✅ Weekly logs:", this.weeklyLogs);
        console.log("📆 Monthly logs:", this.monthlyLogs);
      } catch (err) {
        console.error("❌ Error fetching logs:", err);
      }
    },
    async handleTrackerSubmit(entry) {
      const email = localStorage.getItem("parentEmail");
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
        await axios.post("/api/tracker_logs", payload);
        alert("✅ Entry added!");
        this.showTracker = false;
        await this.fetchLogs();
      } catch (err) {
        alert("❌ Submission failed.");
        console.error("Error:", err);
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
</style>
