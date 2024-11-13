import { createRouter, createWebHistory } from "vue-router";
import loginPage from "../components/auth/loginPage.vue";
import HomePage from "../components/home-page/HomePage.vue";
import StoryDetails from "../components/posts/StoryDetails.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: loginPage },
  { path: "/post/:id", component: StoryDetails, props: true },
  { path: "/home", component: HomePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// global router guard that will intercept the routes and check if "isLoggedIn" is set to true in the local storage
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const authRequired = ["/home", "/post/:id"];

  if (authRequired.includes(to.path) && !isLoggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
