<template>
  <transition name="fade">
    <div v-if="show" class="tracker-overlay">
      <div class="tracker-modal">
        <button class="close-btn" @click="handleClose">×</button>

        <!-- Step Dots -->
        <div class="step-indicator">
          <span :class="{ active: step === 1 }"></span>
          <span :class="{ active: step === 2 }"></span>
          <span :class="{ active: step === 3 }"></span>
        </div>

        <!-- Step 1: Mood -->
        <div v-if="step === 1" class="step-card">
          <h3>What's your kid's mood after the game?</h3>
          <div class="mood-options">
            <button
              v-for="m in moods"
              :key="m"
              :class="{ selected: mood === m }"
              @click="mood = m"
            >
              {{ m }}
            </button>
          </div>
          <button class="next-btn" :disabled="!mood" @click="step++">
            Next
          </button>
        </div>

        <!-- Step 2: Game Info -->
        <div v-if="step === 2" class="step-card">
          <h3>Name and genre of the game your kid played?</h3>
          <input v-model="game_name" placeholder="Name of the game" />
          <input v-model="game_genre" placeholder="Genre of the game" />
          <div class="step-actions">
            <button @click="step--">Previous</button>
            <button
              :disabled="!game_name.trim() || !game_genre.trim()"
              @click="step++"
            >
              Next
            </button>
          </div>
        </div>

        <!-- Step 3: Date & Time -->
        <div v-if="step === 3" class="step-card">
          <h3>When and how long did they play?</h3>
          <input type="date" v-model="play_date" :max="today" />

          <div class="time-inputs">
            <input
              type="number"
              min="0"
              v-model.number="hours"
              placeholder="Hours"
            />
            <input
              type="number"
              min="0"
              v-model.number="minutes"
              placeholder="Minutes"
            />
          </div>

          <div class="step-actions">
            <button @click="step--">Previous</button>
            <button
              :disabled="!play_date || (!hours && !minutes)"
              @click="submitEntry"
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      step: 1,
      mood: "",
      game_name: "",
      game_genre: "",
      play_date: new Date().toISOString().split("T")[0],
      hours: null,
      minutes: null,
      moods: ["Irritable", "Restless", "Neutral", "Happy", "Excited"],
    };
  },
  computed: {
    today() {
      return new Date().toISOString().split("T")[0];
    },
  },
  watch: {
    show(newVal) {
      if (newVal) this.resetForm();
    },
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    submitEntry() {
      const totalMinutes =
        parseInt(this.hours || 0) * 60 + parseInt(this.minutes || 0);

      if (
        !this.mood ||
        !this.game_name.trim() ||
        !this.game_genre.trim() ||
        !this.play_date ||
        totalMinutes <= 0
      ) {
        alert("❗ Please fill in all fields.");
        return;
      }

      const entry = {
        mood: this.mood,
        game_name: this.game_name.trim(),
        game_genre: this.game_genre.trim(),
        play_date: this.play_date,
        hours: this.hours,
        minutes: this.minutes,
        play_duration_minutes: totalMinutes,
      };

      this.$emit("submit", entry);
      this.handleClose();
    },
    resetForm() {
      this.step = 1;
      this.mood = "";
      this.game_name = "";
      this.game_genre = "";
      this.play_date = new Date().toISOString().split("T")[0];
      this.hours = null;
      this.minutes = null;
    },
  },
};
</script>

<style scoped>
.tracker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(20, 20, 20, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.tracker-modal {
  background: white;
  width: 360px;
  padding: 1.5rem;
  border-radius: 16px;
  position: relative;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  background: transparent;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  color: #666;
}

.step-indicator {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.step-indicator span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ccc;
  margin: 0 5px;
}

.step-indicator span.active {
  background: #ec8147;
}

.step-card h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #333;
}

input {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.95rem;
}

.mood-options {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.mood-options button {
  flex: 1 1 30%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
}

.mood-options button.selected {
  background: #ec8147;
  color: white;
  border-color: #ec8147;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.next-btn {
  background: #ec8147;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  float: right;
}

.time-inputs {
  display: flex;
  gap: 1rem;
}
.time-inputs input {
  flex: 1;
}

/* Transition (optional but clean) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
