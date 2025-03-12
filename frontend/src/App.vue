<template>
  <div id="app">
    <!-- Use the dedicated Navbar component -->
    <Navbar />
    <!-- Removed p-4, or replaced with p-0 if you want no padding at all -->
    <main class="app-content">
      <router-view :key="$route.fullPath" />
    </main>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar
  }
};
</script>

<style>
/* We rely on Tailwind's classes for spacing if needed.
   No forced padding or margin here. */
</style>
