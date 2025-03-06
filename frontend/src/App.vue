<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <header class="app-header">
      <button @click="toggleDarkMode" class="dark-mode-toggle">
        {{ isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}
      </button>
    </header>
    <main class="app-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isDarkMode: false,
    };
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('darkMode', this.isDarkMode);
    },
  },
  mounted() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      this.isDarkMode = savedMode === 'true';
    }
  },
};
</script>

<style>
/* Global transitions for smooth theme change */
* {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Default (Light Mode) Styles */
body {
  background-color: #ffffff;
  color: #333333;
}

/* Dark Mode Styles */
.dark-mode {
  background-color: #121212;
  color: #e0e0e0;
}

/* Header styling */
.app-header {
  padding: 1em;
  display: flex;
  justify-content: flex-end;
  background-color: inherit;
}

/* Toggle button styling */
.dark-mode-toggle {
  padding: 0.5em 1em;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.dark-mode-toggle:hover {
  background-color: #0056b3;
}

/* Main content styling */
.app-content {
  padding: 2em;
}
</style>

