  <template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div class="max-w-md w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Log In</h2>

        <form @submit.prevent="loginUser" class="space-y-4">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="w-full p-3 rounded border focus:ring-2 focus:ring-blue-500 text-black 
                  dark:bg-gray-600 dark:text-white"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
            class="w-full p-3 rounded border focus:ring-2 focus:ring-blue-500 text-black 
                  dark:bg-gray-600 dark:text-white"
          />
          <button
            type="submit"
            class="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          >
            Log In
          </button>
        </form>

        <div v-if="errorMessage" class="text-red-500 mt-4">
          {{ errorMessage }}
        </div>

        <div class="text-center mt-4">
          <router-link to="/register" class="text-sm text-blue-600 hover:underline dark:text-blue-400">
            Don't have an account? Register
          </router-link>
        </div>
      </div>
    </div>
  </template>

  <script>
  import api from "../api/axios";

  export default {
    name: "LoginPage",
    data() {
      return {
        email: "",
        password: "",
        errorMessage: ""
      };
    },
    methods: {
      async loginUser() {
        try {
          const response = await api.post("/api/auth/login", {
            email: this.email,
            password: this.password
          });
          console.log("Login Successful:", response.data);
          localStorage.setItem("token", response.data.token);
          this.$router.push("/feed");
        } catch (error) {
          console.error("Login failed:", error);
          this.errorMessage = "Login failed. Please try again.";
        }
      }
    }
  };
  </script>

  <style scoped>
  /* We rely on global .dark overrides from <html class="dark"> */
  </style>
