import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/components/Homepage.vue";
import NoticingShifts from "@/components/NoticingShifts.vue";
import MoodObservation from "@/components/MoodObservation.vue";
import GameDashboard from "@/components/GameDashboard.vue";
import ParentLogin from "@/components/ParentLogin.vue";

const routes = [
  { path: "/parent-login", component: ParentLogin },
  {
    path: "/",
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/mood-observation",
    component: MoodObservation,
    meta: { requiresAuth: true },
  },
  { path: "/noticing-shifts", component: NoticingShifts },
  { path: "/game-dash", component: GameDashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated =
    localStorage.getItem("isParentAuthenticated") === "true";
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/parent-login");
  } else {
    next();
  }
});

export default router;
