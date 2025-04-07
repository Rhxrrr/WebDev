// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Homepage.vue";
import Race from "@/pages/RacePage.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/race", name: "Race", component: Race },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
