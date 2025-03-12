import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../components/LoginPage.vue";
import FeedPage from "../components/FeedPage.vue";
import RegisterPage from "../components/RegisterPage.vue";
import ProfilePage from "../components/ProfilePage.vue";
import CreatePost from "../components/CreatePost.vue";

const routes = [
  // Redirect the root path to /login so the homepage isn’t blank.
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: LoginPage },
  {
    path: "/feed",
    name: "Feed",
    component: FeedPage,
    meta: { requiresAuth: true }
  },
  { path: "/register", name: "Register", component: RegisterPage },
  {
    path: "/profile",
    name: "Profile",
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: "/create",
    name: "CreatePost",
    component: CreatePost,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Global navigation guard: protect routes that require authentication.
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem("token");
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next({ name: "Login", query: { redirect: to.fullPath } });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
