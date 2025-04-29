<template>
  <div class="mood-page">
    <!-- Navbar -->
    <header class="navbar">
      <div class="navbar-container">
        <div class="logo">
          <img
            src="@/assets/icon.png"
            alt="ThinkPlayAct Logo"
            class="logo-icon"
          />
          <span class="logo-text">Think.Play.Act</span>
        </div>
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
          :class="[
            'gif-card',
            { active: selectedMood?.name === mood.name },
            mood.name === 'Happy' ? 'large' : '',
          ]"
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
          <!-- Behaviors Box -->
          <div class="info-box">
            <h3>Typical Behaviors</h3>
            <ol class="numbered-list">
              <li
                v-for="(b, i) in selectedMood.behaviors"
                :key="i"
                v-html="b"
              ></li>
            </ol>
            <div class="box-footer">{{ selectedMood.name }}</div>
          </div>
          <!-- Strategies Box -->
          <div class="info-box">
            <h3>Parental Strategies</h3>
            <ol class="numbered-list">
              <li
                v-for="(s, i) in selectedMood.strategies"
                :key="i"
                v-html="s"
              ></li>
            </ol>
            <div class="box-footer">{{ selectedMood.name }}</div>
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
            `After gaming, your child may exhibit cheerfulness, sharing positive in-game achievements and engaging openly with family — a reward-driven lift in mood backed by dopamine release (<a href="https://www.frontiersin.org/articles/10.3389/fpsyg.2019.01731/full" target="_blank">Frontiers Psych</a>).`,
            `They smoothly transition from game talk to real-life plans, reflecting emotional carryover and social connectivity (<a href="https://link.springer.com/article/10.1007/s10964-017-0646-z" target="_blank">J Youth Adolescence</a>).`,
            `Smiling during meals or chores, they bring positivity into shared routines, as observed in clinical youth studies (<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9856521/" target="_blank">PMC</a>).`,
          ],
          strategies: [
            `Praise specific wins (“I loved how you described that level”) to reinforce confidence and balanced play (<a href="https://www.charliehealth.com/post/video-games-and-mental-health" target="_blank">Charlie Health</a>).`,
            `Introduce “celebration breaks” — share a snack and discuss their highlights to deepen family bonds.`,
            `Plan cooperative activities or co-play sessions offline to harness their enthusiasm into teamwork opportunities.`,
          ],
        },
        {
          name: "Neutral",
          file: "neutral.gif",
          behaviors: [
            `Your child shifts calmly to homework or chores, showing emotional regulation consistent with WHO screen-time guidelines (<a href="https://www.who.int/europe/news/item/25-09-2024-teens--screens-and-mental-health" target="_blank">WHO</a>).`,
            `Their tone remains measured and steady, indicating no emotional spillover from gaming.`,
            `They adapt quickly to the next activity, displaying resilience and routine-oriented stability.`,
          ],
          strategies: [
            `Set a brief “cool-down” routine (reading, walk) immediately post-play to maintain their balanced mood.`,
            `Offer structured choices (“Table or dishes first?”) to build decision-making under calm conditions.`,
            `Use this window for cooperative chores or games that reinforce responsibility without stress.`,
          ],
        },
        {
          name: "Irritable",
          file: "angry.gif",
          behaviors: [
            `Abrupt frustration when play is interrupted, often snapping at simple requests — a documented rise in aggressive affect (<a href="https://www.frontiersin.org/articles/10.3389/fpsyg.2019.01731/full" target="_blank">Frontiers Psych</a>).`,
            `Crossed arms or frowns linger minutes after gaming, signaling residual arousal (<a href="https://link.springer.com/article/10.1007/s10964-017-0646-z" target="_blank">J Youth Adolescence</a>).`,
            `They may grumble or delay tasks, reflecting lingering competitive tension.`,
          ],
          strategies: [
            `Validate their frustration (“I know you were in the zone”) calmly to de-escalate tension.`,
            `Offer a 5–10 minute reset (deep breathing or quiet walk) (<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9856521/" target="_blank">PMC</a>).`,
            `Transition to a low-demand activity (drawing, puzzle) that allows space to cool off.`,
          ],
        },
        {
          name: "Withdrawn",
          file: "withdrawn.gif",
          behaviors: [
            `They may retreat to their room or headphones, avoiding eye contact — a coping withdrawal pattern noted in mood studies (<a href="https://www.frontiersin.org/articles/10.3389/fpsyg.2019.01731/full" target="_blank">Frontiers Psych</a>).`,
            `Minimal verbal replies (“I’m fine”) mask internal processing.`,
            `They often prefer silence or solitary reflection before rejoining family dynamics.`,
          ],
          strategies: [
            `Offer predictable check-ins (“Five minutes to chat?”) to rebuild trust without pressure.`,
            `Use open prompts (“What part of the game stood out today?”) to gently encourage sharing.`,
            `Suggest low-pressure togetherness (listening to music, a short walk) to reconnect gradually.`,
          ],
        },
        {
          name: "Restless",
          file: "restless.gif",
          behaviors: [
            `Fidgeting or pacing immediately post-play, reflecting residual reward-loop arousal (<a href="https://link.springer.com/article/10.1007/s10964-017-0646-z" target="_blank">J Youth Adolescence</a>).`,
            `They may tap objects or bounce legs, unable to settle.`,
            `Speech can become rapid or disjointed as adrenaline lingers.`,
          ],
          strategies: [
            `Channel energy into quick physical bursts (jumping jacks, ball toss).`,
            `Introduce teen-friendly stretching or yoga to ground bodily tension (<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9856521/" target="_blank">PMC</a>).`,
            `Use guided breathing apps to slow internal rhythm.`,
          ],
        },
        {
          name: "Excited",
          file: "excited.gif",
          behaviors: [
            `They replay highlights and talk rapidly about achievements — a direct effect of in-game rewards (<a href="https://www.charliehealth.com/post/video-games-and-mental-health" target="_blank">Charlie Health</a>).`,
            `Animated gestures (clapping, jumping) show sustained positivity.`,
            `They may enthusiastically reenact scenarios, indicating deep engagement.`,
          ],
          strategies: [
            `Ask follow-up questions (“Tell me about that boss fight”) to deepen connection.`,
            `Encourage creative outlets (fan art, writing recaps) to channel excitement.`,
            `Set a brief window for game discussion before shifting focus, balancing energy with routine.`,
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

/* Reset */
html,
body {
  margin: 0;
  padding: 0;
}

/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  display: flex;
  align-items: center;
}
.logo-icon {
  width: 60px;
  margin-right: 0.75rem;
}
.logo-text {
  font-size: 1.75rem;
  font-weight: 800;
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

/* Page content offset under fixed navbar */
.mood-page {
  padding-top: 4.5rem;
}

/* Instructions */
.instructions {
  max-width: 800px;
  margin: 2rem auto;
  text-align: center;
  padding: 0 1rem;
}
.instructions h1 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}
.instructions p {
  font-size: 1rem;
  color: #555;
}

/* GIF Selector */
.gif-selector {
  max-width: 1000px;
  margin: 2rem auto;
  text-align: center;
  padding: 0 1rem;
}
.gif-selector h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.gif-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
.gif-card {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 0.5rem;
  width: 80px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}
.gif-card.large {
  width: 110px;
}
.gif-card img {
  width: 100%;
  height: auto;
  display: block;
}
.gif-label {
  font-weight: 600;
  margin-top: 0.25rem;
}
.gif-card.active {
  box-shadow: 0 0 12px rgba(52, 152, 219, 0.6);
  transform: scale(1.05);
}

/* Info Panel & Animation */
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
  background-color: #3498db;
  padding: 1.5rem;
  border-radius: 12px;
  color: #fff;
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

/* White Boxes */
.info-box {
  background: #fff;
  color: #333;
  padding: 1rem;
  border-radius: 8px;
  flex: 1 1 300px;
  position: relative;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.info-box h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
.numbered-list {
  margin: 0.5rem 0;
  padding-left: 1.2rem;
}
.numbered-list li {
  margin-bottom: 0.75rem;
  line-height: 1.4;
}
.box-footer {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 0.75rem;
  color: #999;
}

/* Responsive */
@media (max-width: 600px) {
  .navbar-container {
    padding: 0.75rem;
  }
  .logo-icon {
    width: 50px;
  }
  .logo-text {
    font-size: 1.4rem;
  }
  .instructions h1 {
    font-size: 1.4rem;
  }
  .gif-card {
    width: 60px;
  }
  .gif-card.large {
    width: 85px;
  }
  .info-header h2 {
    font-size: 1.3rem;
  }
}
</style>
