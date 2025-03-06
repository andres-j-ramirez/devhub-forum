<template>
    <div class="login-page">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div>
          <label>Username:</label>
          <input type="text" v-model="username" required>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" v-model="password" required>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginPage',
    data() {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      login() {
        // Replace this dummy login logic with your real API call
        if (this.username && this.password) {
          this.$router.push('/feed');
        } else {
          alert('Please enter both username and password.');
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .login-page {
    max-width: 400px;
    margin: 0 auto;
    padding: 2em;
  }
  </style>
  