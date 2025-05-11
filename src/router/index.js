import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/Homepage.vue";
import NoticingShifts from "@/components/NoticingShifts.vue";
import MoodObservation from "@/components/MoodObservation.vue";
import GameDashboard from "@/components/GameDashboard.vue";

const routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/mood-observation",
    component: MoodObservation,
  },
  {
    path: "/noticing-shifts",
    component: NoticingShifts,
  },
  {
    path: "/game-dash",
    component: GameDashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ❌ Removed parent login route
// ❌ Removed route guard

export default router;
