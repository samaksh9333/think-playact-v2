<template>
  <div class="mood-page">
    <section class="page-intro">
      <h1>Track Post-Gaming Mood</h1>
      <p>
        Select your child's observed mood after gaming to better understand
        typical emotional responses and recommended support strategies.
      </p>
    </section>

    <section class="emoji-grid">
      <div
        v-for="mood in moods"
        :key="mood.name"
        class="emoji-card"
        @click="selectMood(mood)"
      >
        <img :src="mood.gif" alt="Mood Icon" class="emoji-gif" />
        <div class="emoji-label">{{ mood.name }}</div>
      </div>
    </section>

    <transition name="fade-slide">
      <section v-if="selectedMood" class="mood-details">
        <div class="mood-column">
          <h2>Observed Behaviours - {{ selectedMood.name }}</h2>
          <ul>
            <li
              v-for="(behavior, index) in selectedMood.behaviors"
              :key="index"
            >
              {{ behavior }}
            </li>
          </ul>
        </div>
        <div class="mood-column">
          <h2>Parent Strategies</h2>
          <ul>
            <li
              v-for="(strategy, index) in selectedMood.strategies"
              :key="index"
            >
              {{ strategy }}
            </li>
          </ul>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
export default {
  name: "MoodObservation",
  data() {
    return {
      selectedMood: null,
      moods: [
        {
          name: "Happy",
          gif: require("@/assets/happy.gif"),
          behaviors: [
            "Smiling and communicating openly.",
            "Shows excitement about achievements in the game.",
            "Engages positively with family members.",
          ],
          strategies: [
            "Praise their positive communication [CharlieHealth](https://www.charliehealth.com/post/video-games-and-mental-health).",
            "Encourage discussions about balancing gaming with other activities [PMC9856521](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9856521/).",
            "Support friendships formed online, while setting healthy boundaries [Frontiers](https://www.frontiersin.org/articles/10.3389/fpsyg.2019.01731/full).",
          ],
        },
        {
          name: "Neutral",
          gif: require("@/assets/neutral.gif"),
          behaviors: [
            "Limited emotional expression post-gaming.",
            "Shifts easily to offline tasks or conversations.",
            "Displays calmness without excessive excitement.",
          ],
          strategies: [
            "Ask open-ended questions to maintain communication [Frontiers](https://www.frontiersin.org/articles/10.3389/fpsyg.2019.01731/full).",
            "Encourage small routines that separate gaming from other activities [CharlieHealth](https://www.charliehealth.com/post/video-games-and-mental-health).",
            "Gently reinforce offline hobbies [SpringerLink](https://link.springer.com/article/10.1007/s10964-017-0646-z).",
          ],
        },
        {
          name: "Angry",
          gif: require("@/assets/angry.gif"),
          behaviors: [
            "Short-tempered responses.",
            "Resistance to ending gaming sessions.",
            "Frustration over minor issues or requests.",
          ],
          strategies: [
            "Implement cooldown periods post-gaming [PMC9856521](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9856521/).",
            "Use positive redirection instead of confrontation [Frontiers](https://www.frontiersin.org/articles/10.3389/fpsyg.2019.01731/full).",
            "Teach emotional regulation skills gradually [SpringerLink](https://link.springer.com/article/10.1007/s10964-017-0646-z).",
          ],
        },
        {
          name: "Withdrawn",
          gif: require("@/assets/withdrawn.gif"),
          behaviors: [
            "Avoids conversation post-gaming.",
            "Prefers staying alone, silent, or disengaged.",
            "Reduced interest in family activities.",
          ],
          strategies: [
            "Create non-judgmental spaces for talking [CharlieHealth](https://www.charliehealth.com/post/video-games-and-mental-health).",
            "Encourage offline bonding activities without forcing [Frontiers](https://www.frontiersin.org/articles/10.3389/fpsyg.2019.01731/full).",
            "Monitor for signs of gaming-related isolation [PMC9856521](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9856521/).",
          ],
        },
        {
          name: "Restless",
          gif: require("@/assets/restless.gif"),
          behaviors: [
            "Unable to sit still post-gaming.",
            "Jumping quickly between activities.",
            "Seeks new stimulation immediately.",
          ],
          strategies: [
            "Schedule decompression time before tasks [SpringerLink](https://link.springer.com/article/10.1007/s10964-017-0646-z).",
            "Introduce physical outlets like short walks [PMC9856521](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9856521/).",
            "Guide transitions with calming activities [Frontiers](https://www.frontiersin.org/articles/10.3389/fpsyg.2019.01731/full).",
          ],
        },
        {
          name: "Excited",
          gif: require("@/assets/excited.gif"),
          behaviors: [
            "Energetic recounting of game events.",
            "Difficulty settling into quiet activities.",
            "Higher emotional intensity after gaming.",
          ],
          strategies: [
            "Channel excitement into offline storytelling [CharlieHealth](https://www.charliehealth.com/post/video-games-and-mental-health).",
            "Slow transitions with light mindfulness [PMC9856521](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9856521/).",
            "Reinforce routines that separate gaming highs from daily tasks [Frontiers](https://www.frontiersin.org/articles/10.3389/fpsyg.2019.01731/full).",
          ],
        },
      ],
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
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

/* Page Intro */
.page-intro {
  margin-bottom: 3rem;
}
.page-intro h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.page-intro p {
  font-size: 1.2rem;
  color: #555;
}

/* Emoji Grid */
.emoji-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1.5rem;
  justify-items: center;
  margin-bottom: 2rem;
}
.emoji-card {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  width: 180px;
}
.emoji-card:hover {
  transform: scale(1.05);
}
.emoji-gif {
  width: 100%;
  height: 150px;
  object-fit: contain;
}
.emoji-label {
  margin-top: 0.8rem;
  font-weight: 600;
}

/* Mood Details */
.mood-details {
  background-color: #3498db;
  padding: 2rem;
  border-radius: 16px;
  color: #fff;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
}
.mood-column {
  flex: 1;
  min-width: 280px;
}
.mood-column h2 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}
.mood-column ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}
.mood-column li {
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
}

/* Smooth Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.8s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
