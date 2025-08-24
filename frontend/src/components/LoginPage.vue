<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
    <div class="max-w-md mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Log in</h1>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <input v-model="email" type="email" placeholder="Email" class="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white text-black" required />
        <input v-model="password" type="password" placeholder="Password" class="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white text-black" required />
        <button type="submit" class="w-full px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Log in</button>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Demo: test@example.com / devhub
        </p>
        <p v-if="error" class="text-sm text-red-600 mt-2">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { seedDemoIfNeeded } from "@/demo/demoData";
import { isDemoHost, loginDemo } from "@/demo/demoAuth";

export default {
  name: "LoginPage",
  data() {
    return { email: "", password: "", error: "" };
  },
  methods: {
    async onSubmit() {
      seedDemoIfNeeded();
      if (isDemoHost()) {
        const token = loginDemo(this.email, this.password);
        if (!token) { this.error = "Invalid demo credentials."; return; }
        if (this.$router) this.$router.push({ path: "/feed" });
        else if (typeof window !== "undefined") window.location.hash = "#/feed";
        return;
      }
      try {
        const res = await this.$axios.post("/api/auth/login", { email: this.email, password: this.password });
        if (res && res.data && res.data.token) {
          localStorage.setItem("auth_token", res.data.token);
          this.$router.push({ path: "/feed" });
        } else {
          this.error = "Login failed.";
        }
      } catch (e) {
        this.error = "Login failed.";
      }
    }
  }
};
</script>
