// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Homepage.vue";
import Race from "@/pages/RacePage.vue";
import Leaderboard from '@/components/Leaderboard.vue';


const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/race", name: "Race", component: Race },
  { path: "/leaderboard", name: "Leaderboard", component: Leaderboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
