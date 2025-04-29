<template>
  <div class="mood-page">
    <section class="user-story">
      <h1>Post-Gaming Mood Check</h1>
      <p>
        As an observant parent, I want to learn about common behaviours my son
        might exhibit immediately after gaming (such as irritability,
        withdrawal, restlessness, or heightened excitement), so that I can
        better recognize patterns and potential triggers.
      </p>
    </section>

    <section class="emoji-selection">
      <div
        v-for="mood in moods"
        :key="mood.name"
        class="emoji-option"
        @click="selectMood(mood)"
      >
        <div class="emoji-icon">{{ mood.emoji }}</div>
        <div class="emoji-label">{{ mood.name }}</div>
      </div>
    </section>

    <section v-if="selectedMood" class="mood-details">
      <h2>{{ selectedMood.name }}</h2>
      <p>{{ selectedMood.description }}</p>
    </section>
  </div>
</template>

<script>
export default {
  name: "MoodObservation",
  data() {
    return {
      moods: [
        {
          emoji: "🙂",
          name: "Happy",
          description: "Content, cheerful, easily engages with others.",
        },
        {
          emoji: "😐",
          name: "Neutral",
          description:
            "Calm, indifferent, easily shifts attention to other activities.",
        },
        {
          emoji: "😠",
          name: "Irritable",
          description: "Short temper, frustration with family, easily annoyed.",
        },
        {
          emoji: "😔",
          name: "Withdrawn",
          description: "Silent, avoids conversation, prefers being alone.",
        },
        {
          emoji: "😵",
          name: "Restless",
          description:
            "Fidgety, difficulty settling down, wants new stimulation.",
        },
        {
          emoji: "😃",
          name: "Excited",
          description:
            "High energy, rapid talking about the game, can't sit still.",
        },
      ],
      selectedMood: null,
    };
  },
  methods: {
    selectMood(mood) {
      this.selectedMood = mood;
    },
  },
};
</script>

<style scoped>
.mood-page {
  font-family: "Roboto", sans-serif;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.user-story {
  margin-bottom: 2rem;
}

.emoji-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.emoji-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  width: 250px;
  cursor: pointer;
  transition: background 0.3s;
}

.emoji-option:hover {
  background: #e0e0e0;
}

.emoji-icon {
  font-size: 2rem;
}

.emoji-label {
  font-size: 1.2rem;
  font-weight: 500;
}

.mood-details {
  margin-top: 2rem;
  background: #3498db;
  color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
}
</style>
