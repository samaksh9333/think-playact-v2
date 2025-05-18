<template>
  <div class="dashboard-page">
    <h2>Welcome to ThinkPlayAct Tracker</h2>
    <button class="open-tracker-btn" @click="showTracker = true">
      Open Tracker
    </button>

    <!-- Tracker Popup -->
    <TrackerModal
      :show="showTracker"
      @submit="handleTrackerSubmit"
      @close="showTracker = false"
    />
  </div>
</template>

<script>
import TrackerModal from "./TrackerModal.vue";
import axios from "axios";

export default {
  components: {
    TrackerModal,
  },
  data() {
    return {
      showTracker: false,
    };
  },
  methods: {
    async handleTrackerSubmit(entry) {
      try {
        // ✅ Map modal field names to DB-compatible format
        const formattedEntry = {
          parent_email:
            localStorage.getItem("parent_email") || "test@parent.com", // Replace with actual login data
          mood: entry.mood,
          game_name: entry.gameName,
          game_genre: entry.genre,
          play_date: entry.date,
          play_duration_minutes: parseInt(entry.duration),
        };

        // ✅ POST to the correct Azure backend route
        await axios.post(
          "https://backendtpa-fdhcdfbzh9dbfchz.australiaeast-01.azurewebsites.net/api/tracker_logs",
          formattedEntry
        );

        alert("✅ Entry submitted successfully!");
        this.showTracker = false;
      } catch (err) {
        console.error("❌ Failed to submit tracker entry:", err);
        alert("❌ Failed to submit entry. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.dashboard-page {
  padding: 2rem;
  text-align: center;
}
.open-tracker-btn {
  padding: 0.75rem 1.5rem;
  background: #ec8147;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
}
</style>
