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
        </nav>
      </div>
    </header>

    <!-- Instructions -->
    <section class="instructions">
      <h1>Post-Gaming Mood Tracker</h1>
      <p>
        After your child finishes gaming, use this tool to note how they’re
        feeling. Click the mood that best matches their expression to get clear
        insight into typical behaviors and evidence-based strategies to support
        them.
      </p>
    </section>

    <!-- GIF Selector -->
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

    <!-- Info Panel -->
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
          file: "happy.gif",
          behaviors: [
            `Cheerful, shares achievements, often smiling. (<a href="https://www.frontiersin.org/articles/10.3389/fpsyg.2019.01731/full" target="_blank">Frontiers in Psychology</a>)`,
            `Talks excitedly about the game with family. (<a href="https://link.springer.com/article/10.1007/s10964-017-0646-z" target="_blank">Journal of Youth and Adolescence</a>)`,
            `Positive carryover into other routines. (<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9856521/" target="_blank">PMC</a>)`,
          ],
          strategies: [
            `Acknowledge their wins to boost self-esteem. (<a href="https://www.charliehealth.com/post/video-games-and-mental-health" target="_blank">Charlie Health</a>)`,
            `Create “celebration rituals” after gaming.`,
            `Use their good mood to initiate bonding tasks.`,
          ],
        },
        {
          name: "Neutral",
          file: "neutral.gif",
          behaviors: [
            `Calmly transitions to next task. (<a href="https://www.who.int/europe/news/item/25-09-2024-teens--screens-and-mental-health" target="_blank">WHO</a>)`,
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
            `Short-tempered when asked to stop gaming. (<a href="https://www.frontiersin.org/articles/10.3389/fpsyg.2019.01731/full" target="_blank">Frontiers in Psychology</a>)`,
            `Grumbles or resists transition tasks.`,
            `Elevated stress response post-play. (<a href="https://link.springer.com/article/10.1007/s10964-017-0646-z" target="_blank">Journal of Youth and Adolescence</a>)`,
          ],
          strategies: [
            `Use a calm, validating tone.`,
            `Offer cool-down breaks like deep breathing.`,
            `Avoid forcing conversation immediately.`,
          ],
        },
        {
          name: "Withdrawn",
          file: "withdrawn.gif",
          behaviors: [
            `Avoids interaction, minimal response. (<a href="https://www.frontiersin.org/articles/10.3389/fpsyg.2019.01731/full" target="_blank">Frontiers in Psychology</a>)`,
            `Retreats to quiet space or room.`,
            `Appears introspective or emotionally distant.`,
          ],
          strategies: [
            `Give space while remaining gently present.`,
            `Invite them into low-pressure joint activities.`,
            `Use open-ended prompts without expectation.`,
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
            `Enthusiastic storytelling about gameplay. (<a href="https://www.charliehealth.com/post/video-games-and-mental-health" target="_blank">Charlie Health</a>)`,
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
  methods: {
    selectMood(mood) {
      this.selectedMood = mood;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

/* Fade-in Animation */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-in {
  animation: fadeIn 0.7s ease-in-out;
}

/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  color: #333;
}
.nav-menu .nav-link {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  text-decoration: none;
}
.nav-menu .nav-link:hover {
  color: #3498db;
}

/* Page Spacing */
.mood-page {
  font-family: "Roboto", sans-serif;
  background-color: #f5f5f5;
  padding-top: 5rem;
  min-height: 100vh;
}

/* Instructions */
.instructions {
  max-width: 800px;
  margin: 2rem auto;
  text-align: center;
}
.instructions h1 {
  font-size: 1.75rem;
}
.instructions p {
  color: #555;
  font-size: 1rem;
}

/* Mood Grid */
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
  background: #f5f5f5;
  border-radius: 12px;
  padding: 0.5rem;
  width: 80px;
  cursor: pointer;
  text-align: center;
  transition: 0.3s;
}
.gif-card img {
  width: 100%;
}
.gif-label {
  font-weight: bold;
  margin-top: 0.25rem;
}
.gif-card.active {
  box-shadow: 0 0 12px rgba(52, 152, 219, 0.6);
  transform: scale(1.05);
}

/* Info Panel */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.slide-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.info-panel {
  max-width: 1000px;
  margin: 2rem auto;
  background: #3498db;
  color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
}
.info-header h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.info-content {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
.info-box {
  background: #fff;
  color: #333;
  flex: 1 1 300px;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.info-box h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
.numbered-list {
  padding-left: 1.2rem;
}
.numbered-list li {
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

/* Responsive */
@media (max-width: 600px) {
  .gif-card {
    width: 60px;
  }
  .logo-text {
    font-size: 1.4rem;
  }
  .navbar-container {
    padding: 1rem;
  }
}
</style>
