import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/Homepage.vue";
import NoticingShifts from "@/components/NoticingShifts.vue";
import MoodObservation from "@/components/MoodObservation.vue";
import GameDashboard from "@/components/GameDashboard.vue";
import ParentAuth from "@/components/ParentAuth.vue"; // ✅ FIXED path
import TrackerDashboard from "@/components/TrackerDashboard.vue";

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
  {
    path: "/parent-login",
    name: "ParentLogin",
    component: ParentAuth, // ✅ Login/Signup Page
  },
  {
    path: "/tracker",
    component: TrackerDashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
