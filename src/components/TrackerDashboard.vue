<template>
  <div class="dashboard-page">
    <h2>Welcome to ThinkPlayAct Tracker</h2>
    <button class="open-tracker-btn" @click="showTracker = true">
      Open Tracker
    </button>

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
      const parentEmail = localStorage.getItem("parentEmail");

      if (!parentEmail) {
        alert("❗ Please log in to continue.");
        return;
      }

      const payload = {
        parent_email: parentEmail,
        mood: entry.mood,
        game_name: entry.gameName,
        game_genre: entry.genre,
        play_date: entry.date,
        play_duration_minutes: parseInt(entry.duration),
      };

      try {
        const response = await axios.post(
          "https://backendtpa-fdhcdfbzh9dbfchz.australiaeast-01.azurewebsites.net/api/tracker_logs",
          payload
        );

        if (response.status === 200 || response.status === 201) {
          alert("✅ Entry submitted successfully!");
          this.showTracker = false;
        } else {
          throw new Error("Unexpected response status: " + response.status);
        }
      } catch (error) {
        console.error(
          "❌ Failed to submit tracker entry:",
          error?.response || error
        );
        alert(
          error?.response?.data?.error ||
            "❌ Submission failed. Please check login and try again."
        );
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
