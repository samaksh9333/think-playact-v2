<template>
  <div class="home-page">
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
          <router-link to="/game-world" class="nav-link"
            >Game World</router-link
          >
          <router-link to="/how-they-play" class="nav-link"
            >How They Play</router-link
          >
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <div class="hero-content">
          <h1 class="hero-title">
            Concerned About Gaming's Impact on Your Child?
          </h1>
          <p class="hero-subtitle">
            Understand new behaviours, find resources for balance, build healthy
            habits, and support their well-being.
          </p>
          <button class="hero-button" @click="$router.push('/noticing-shifts')">
            Know More
          </button>
        </div>
      </div>
    </section>

    <!-- Mood Tracker Section -->
    <section class="mood-tracker-section">
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
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
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
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

.home-page {
  font-family: "Roboto", sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* Navbar */
.navbar {
  background-color: #fff;
  padding: 1.5rem 3rem; /* Increased padding */
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
  width: 70px; /* Bigger logo */
  height: auto;
  margin-right: 1rem;
}
.logo-text {
  font-size: 2rem; /* Bigger title */
  font-weight: 800;
  color: #333;
}
.nav-menu {
  display: flex;
  gap: 3rem;
}
.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 600; /* Bolder links */
  font-size: 1.2rem; /* Bigger font */
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
}
.hero-background {
  width: 100%;
  height: 100%;
  background: url("@/assets/hero-controller.jpg") center center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-content {
  text-align: center;
  color: white;
  background: rgba(0, 0, 0, 0.4);
  padding: 3rem;
  border-radius: 8px;
}
.hero-title {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}
.hero-subtitle {
  font-size: 1.4rem;
  margin-bottom: 2rem;
}
.hero-button {
  background-color: #3498db;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  color: #fff;
  cursor: pointer;
}
.hero-button:hover {
  background-color: #217dbb;
}

/* Mood Tracker Section */
.mood-tracker-section {
  background-color: #fff;
  padding: 4rem 2rem;
  display: flex;
  justify-content: center;
}
.tracker-box {
  background: #f9f9f9;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1440px;
  gap: 3rem;
}

.tracker-content {
  flex: 1;
  text-align: left;
}
.tracker-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.tracker-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #555;
}
.mood-button {
  background-color: #3498db;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  color: white;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.mood-button:hover {
  background-color: #217dbb;
}

/* Carousel */
.carousel-wrapper {
  flex: 1;
  height: 400px;
  overflow: hidden;
  border-radius: 16px;
  position: relative;
}
.carousel-images {
  width: 100%;
  height: 100%;
  position: relative;
}
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  border-radius: 16px;
}
.carousel-image.active {
  opacity: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .tracker-box {
    flex-direction: column;
    padding: 2rem;
    text-align: center;
  }
  .carousel-wrapper {
    height: 250px;
  }
}
</style>
