<template>
  <nav class="bg-white dark:bg-gray-800 shadow">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="text-lg font-bold text-gray-900 dark:text-white">
          DevHub Forum
        </router-link>

        <div class="flex items-center space-x-4">
          <!-- If route is /login or /register, show only login/register -->
          <template v-if="onLoginOrRegister">
            <router-link
              to="/login"
              :class="navLinkClass('/login')"
            >
              Login
            </router-link>
            <router-link
              to="/register"
              :class="navLinkClass('/register')"
            >
              Register
            </router-link>
          </template>

          <!-- Otherwise, show feed, profile, create, logout -->
          <template v-else>
            <router-link
              to="/feed"
              :class="navLinkClass('/feed')"
            >
              Feed
            </router-link>
            <router-link
              to="/profile"
              :class="navLinkClass('/profile')"
            >
              Profile
            </router-link>
            <router-link
              to="/create"
              :class="navLinkClass('/create')"
            >
              Create Post
            </router-link>
            <button
              @click="logout"
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Logout
            </button>
          </template>

          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            {{ isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      isLoggedIn: false,
      isDarkMode: false
    };
  },
  computed: {
    onLoginOrRegister() {
      // If the route name is "Login" or "Register"
      return this.$route.name === "Login" || this.$route.name === "Register";
    }
  },
  created() {
    this.isLoggedIn = !!localStorage.getItem("token");

    // Check if dark mode was saved
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      this.isDarkMode = (savedMode === "true");
      this.applyDarkMode();
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.isLoggedIn = false;
      this.$router.push("/login");
    },
    navLinkClass(path) {
      const currentPath = this.$route.path;
      const isActive = currentPath.startsWith(path);
      return isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400";
    },

    toggleDarkMode() {
      // Flip the boolean
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem("darkMode", this.isDarkMode);
      this.applyDarkMode();
    },

    applyDarkMode() {
      // For Tailwind 'dark:' classes to work, we must apply/remove 'dark' on <html> or <body>
      if (this.isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }
};
</script>

<style scoped>
/* Additional styling if needed */
</style>
