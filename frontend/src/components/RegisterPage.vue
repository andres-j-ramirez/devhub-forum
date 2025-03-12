<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
    <div class="max-w-md w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8">
      <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Register</h2>

      <form @submit.prevent="registerUser" class="space-y-4">
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          required
          class="w-full p-3 rounded border focus:ring-2 focus:ring-blue-500 text-black"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="w-full p-3 rounded border focus:ring-2 focus:ring-blue-500 text-black"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          class="w-full p-3 rounded border focus:ring-2 focus:ring-blue-500 text-black"
        />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          required
          class="w-full p-3 rounded border focus:ring-2 focus:ring-blue-500 text-black"
        />

        <button type="submit" class="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
          Register
        </button>
      </form>

      <!-- Inline Error Message -->
      <div v-if="errorMessage" class="text-red-500 mt-4">
        {{ errorMessage }}
      </div>

      <div class="text-center mt-4">
        <router-link to="/login" class="text-sm text-blue-600 hover:underline dark:text-blue-400">
          Already have an account? Log In
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "RegisterPage",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      errorMessage: ""
    };
  },
  methods: {
    async registerUser() {
      // 1. Check password match
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match!";
        return;
      }

      try {
        // 2. Make POST request to /api/auth/register
        const response = await api.post("/api/auth/register", {
          username: this.username,
          email: this.email,
          password: this.password
        });
        console.log("Registration successful:", response.data);

        // 3. On success, redirect to login
        this.$router.push("/login");
      } catch (error) {
        console.error("Registration failed:", error);
        // 4. Inline error message
        this.errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      }
    }
  }
};
</script>

<style scoped>
/* Additional styling if needed */
</style>
