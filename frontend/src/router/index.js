// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Homepage.vue";
import Race from "@/pages/RacePage.vue";
import Leaderboard from '@/components/Leaderboard.vue';
import Login from '@/pages/LoginPage.vue';

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    beforeEnter: (to, from, next) => {
      console.log("User is not logged in. Staying on login page.");
      next();  // Stay on the login page
    },
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem("username") && localStorage.getItem("password")) {
        console.log("User logged in. Proceeding to home.");
        next();  // Allow access to the home page
      } else {
        console.log("User not logged in. Redirecting to login.");
        next("/");  // Redirect to login if not logged in
      }
    },
  },
  {
    path: "/race",
    name: "Race",
    component: Race,
  },
  {
    path: "/leaderboard", 
    name: "Leaderboard", 
    component: Leaderboard 
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
