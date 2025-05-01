<template>
  <div class="noticing-shifts-page fade-in">
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

    <!-- Page Content -->
    <div class="content-wrapper">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-text">
          <h1>Noticing Shifts</h1>
          <p>Learn how gaming might be playing a role</p>
        </div>
      </section>

      <!-- Research Insights Section -->
      <section class="section research">
        <h3>Seeing Changes in Your Son's Gaming Behaviour</h3>
        <h2>Research Offers Insights</h2>
        <p>
          As parents, you're often the first to notice subtle shifts in your
          teenager's behaviour. If excessive gaming seems linked to increased
          irritability, withdrawal, or academic struggles, your concerns are
          valid. Research is exploring these connections.
        </p>
        <p>
          Studies suggest that significant gaming can be associated with
          emotional and behavioural changes in teens (Anderson et al., 2010).
          The WHO highlights the importance of balanced screen time for
          adolescent mental health (WHO, 2024).
        </p>
        <p class="source">
          Source:
          <a
            href="https://www.who.int/europe/news/item/25-09-2024-teens--screens-and-mental-health"
            target="_blank"
            >World Health Organization (2024)</a
          >
        </p>
      </section>

      <!-- Observations Section -->
      <section class="section observations">
        <div class="text">
          <h2>You Might Be Observing</h2>
          <ul>
            <li>
              <strong>Increased Irritability/Aggression:</strong> Some research
              links frequent gaming to heightened aggression in adolescents.
            </li>
            <li>
              <strong>Sleep Issues:</strong> Late-night gaming can disrupt sleep
              patterns, impacting mood and focus.
            </li>
            <li>
              <strong>Social Withdrawal:</strong> Intense gaming can lead to
              less engagement in real-world relationships.
            </li>
            <li>
              <strong>Academic Slips:</strong> Gaming can sometimes take away
              from schoolwork.
            </li>
          </ul>
          <p class="source">
            Source: Anderson, C. A., et al. (2010). Journal of Adolescent
            Health, 46(5), 501-505.
          </p>
        </div>
        <div class="images">
          <img src="@/assets/might_observe.jpg" alt="Observation 1" />
          <img src="@/assets/extra_observation.jpg" alt="Observation 2" />
        </div>
      </section>

      <!-- Data Points Section -->
      <section class="section datapoints">
        <h2>Data Points</h2>
        <div class="points">
          <div class="point">
            <h4>12%</h4>
            <p>
              12% of adolescents are at risk of problematic gaming (WHO, 2024).
            </p>
          </div>
          <div class="point">
            <h4>25%</h4>
            <p>
              Up to 25% of teen gamers may exhibit aggression linked to game
              content (Anderson et al., 2010).
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoticingShiftsPage",
};
</script>

<style scoped>
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

.noticing-shifts-page {
  font-family: "Roboto", sans-serif;
  background-color: #f8f9fa;
  color: #333;
  padding-top: 5.5rem;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: #fff;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
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

.content-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.hero {
  background: #fff;
  padding: 3rem;
  text-align: center;
  border-left: 5px solid #3498db;
  margin-bottom: 2rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.hero p {
  font-size: 1.2rem;
  color: #666;
}

.section {
  background: #fff;
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.section h2 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.section h3 {
  text-transform: uppercase;
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 0.5rem;
}

.section p {
  line-height: 1.6;
  margin-bottom: 1rem;
}

.source {
  font-size: 0.85rem;
  color: #777;
}

.observations {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;
}

.observations .text {
  flex: 1 1 300px;
}

.observations ul {
  padding-left: 1rem;
}

.observations li {
  margin-bottom: 1rem;
  line-height: 1.5;
}

.observations .images {
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.observations img {
  width: 100%;
  border-radius: 4px;
}

.datapoints .points {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.datapoints .point {
  flex: 1 1 220px;
  background: #eef2f7;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
}

.datapoints .point h4 {
  font-size: 2rem;
  color: #3498db;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .observations {
    flex-direction: column;
  }

  .observations .images {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .hero {
    padding: 2rem 1rem;
  }
}
</style>
