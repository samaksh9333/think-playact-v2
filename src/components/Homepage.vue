<template>
  <div class="home-page fade-in">
    <div v-if="!unlocked" class="lock-screen">
      <h1>Welcome to ThinkPlayAct</h1>
      <input type="password" v-model="password" placeholder="Enter password" />
      <button @click="checkPassword">Unlock</button>
      <p v-if="error" class="error-msg">Incorrect password</p>
    </div>

    <div v-else>
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
            <router-link to="/mood-observation" class="nav-link">
              Post-game Tracker
            </router-link>
            <router-link to="/game-dash" class="nav-link">
              Game World
            </router-link>
          </nav>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-background">
          <div class="hero-content">
            <h1 class="hero-title">
              12% of adolescents are at risk of problematic gaming (WHO, 2024).
            </h1>
            <p class="hero-subtitle">
              Understand new behaviors, find resources for balance, build
              healthy habits, and support their well-being.
            </p>
            <button
              class="hero-button"
              @click="$router.push('/noticing-shifts')"
            >
              Know More
            </button>
          </div>
          <div class="scroll-button" @click="scrollToTracker">
            <span>&#x25BC;</span>
          </div>
        </div>
      </section>

      <!-- Mood Tracker Section -->
      <section class="mood-tracker-section" ref="trackerSection">
        <div class="tracker-box">
          <div class="tracker-content">
            <h2>Track Your Child’s Mood After Gaming</h2>
            <p>
              Observe how your child behaves post-gaming. Spot patterns like
              irritability, withdrawal, or excitement, and get helpful guidance.
            </p>
            <button
              class="mood-button"
              @click="$router.push('/mood-observation')"
            >
              Track Your Child's Mood
            </button>
          </div>
          <div class="carousel-wrapper">
            <div class="carousel-images">
              <img
                v-for="(image, index) in carouselImages"
                :key="index"
                :src="image"
                :class="{ active: index === currentImage }"
                class="carousel-image"
                alt="Mood tracker background"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Decode Game Age Labels Section -->
      <section class="age-labels-section">
        <div class="labels-box">
          <img
            src="@/assets/age-guide.jpg"
            alt="Age Guide"
            class="labels-image"
          />
          <div class="labels-content">
            <h3>Decode Game Age Labels</h3>
            <p>
              Ever wondered what those game ratings like "Mature 17+" or
              "Everyone 10+" really mean? Click below to understand how age
              labels are assigned, what content they imply, and how to choose
              games appropriate for your child’s development.
            </p>
            <button @click="$router.push('/game-dash')" class="labels-button">
              View Age Rating Guide
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      password: "",
      unlocked: false,
      error: false,
      currentImage: 0,
      carouselImages: [
        require("@/assets/image1.png"),
        require("@/assets/image2.png"),
        require("@/assets/image3.png"),
        require("@/assets/image4.png"),
      ],
      intervalId: null,
    };
  },
  mounted() {
    this.intervalId = setInterval(() => {
      this.currentImage = (this.currentImage + 1) % this.carouselImages.length;
    }, 4000);
    if (localStorage.getItem("isUnlocked") === "true") {
      this.unlocked = true;
    }
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
  methods: {
    checkPassword() {
      if (this.password === "think2024") {
        this.unlocked = true;
        this.error = false;
        localStorage.setItem("isUnlocked", "true");
      } else {
        this.error = true;
      }
    },
    scrollToTracker() {
      this.$refs.trackerSection.scrollIntoView({ behavior: "smooth" });
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

.home-page {
  font-family: "Roboto", sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
  animation: fadeIn 1.2s ease-in-out;
  position: relative;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.lock-screen {
  position: fixed;
  inset: 0;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 2rem;
}
.lock-screen input {
  padding: 0.75rem;
  font-size: 1rem;
  width: 250px;
  margin-top: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.lock-screen button {
  margin-top: 1rem;
  padding: 0.6rem 1.5rem;
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.lock-screen .error-msg {
  color: red;
  margin-top: 0.5rem;
}

/* Navbar (reduced height) */
.navbar {
  background-color: #fff;
  padding: 1rem 3rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  display: flex;
  align-items: center;
}
.logo-icon {
  width: 60px;
  margin-right: 1rem;
}
.logo-text {
  font-size: 1.8rem;
  font-weight: 800;
  color: #333;
}
.nav-menu {
  display: flex;
  gap: 3rem;
}
.nav-link {
  font-weight: 600;
  color: #333;
  text-decoration: none;
  font-size: 1.2rem;
}
.nav-link:hover {
  color: #3498db;
}

/* Hero Section */
.hero {
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.hero-background {
  width: 100%;
  height: 100%;
  background: url("@/assets/hero-controller.jpg") center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.hero-content {
  text-align: center;
  color: white;
  background: rgba(0, 0, 0, 0.4);
  padding: 3rem;
  border-radius: 8px;
  z-index: 2;
}
.hero-title {
  font-size: 2.6rem;
  margin-bottom: 1rem;
}
.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2rem;
}
.hero-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
}
.hero-button:hover {
  background-color: #217dbb;
}

/* Scroll Button (bottom-right in circle) */
.scroll-button {
  position: absolute;
  bottom: 64px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #3498db;
  cursor: pointer;
  z-index: 3;
  animation: bounce 1.5s infinite;
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(6px);
  }
}

/* Mood Tracker Section */
.mood-tracker-section {
  background-color: #fff;
  padding: 4rem 2rem 2rem;
  display: flex;
  justify-content: center;
}
.tracker-box {
  background: #f9f9f9;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  width: 100%;
  max-width: 1440px;
  gap: 3rem;
  align-items: center;
}
.tracker-content {
  flex: 1;
}
.tracker-content h2 {
  font-size: 2.2rem;
  margin-bottom: 1rem;
}
.tracker-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #555;
}
.mood-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 50px;
  cursor: pointer;
}
.mood-button:hover {
  background-color: #217dbb;
}
.carousel-wrapper {
  flex: 1;
  height: 400px;
  overflow: hidden;
  border-radius: 16px;
  position: relative;
}
.carousel-images {
  position: relative;
  width: 100%;
  height: 100%;
}
.carousel-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  border-radius: 16px;
}
.carousel-image.active {
  opacity: 1;
}

/* Age Labels Section */
.age-labels-section {
  padding: 0 2rem 3rem;
  display: flex;
  justify-content: center;
}
.labels-box {
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  max-width: 1440px;
  gap: 2rem;
}
.labels-image {
  height: 100%;
  max-height: 260px;
  border-radius: 16px;
}
.labels-content {
  flex: 1;
}
.labels-content h3 {
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
}
.labels-content p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #555;
}
.labels-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 50px;
  cursor: pointer;
}
.labels-button:hover {
  background-color: #217dbb;
}

/* Responsive Layout */
@media (max-width: 768px) {
  .tracker-box,
  .labels-box {
    flex-direction: column;
    text-align: center;
  }
  .carousel-wrapper {
    height: 250px;
  }
}
</style>
