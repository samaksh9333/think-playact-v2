import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/Homepage.vue";
import NoticingShifts from "../components/NoticingShifts.vue";
import MoodObservation from "@/components/MoodObservation.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/noticing-shifts", component: NoticingShifts },
  { path: "/mood-observation", component: MoodObservation },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
