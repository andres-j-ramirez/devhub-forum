<template>
    <div class="feed-page">
      <h2>Feed</h2>
      <div v-for="post in posts" :key="post._id" class="post-card">
        <h3>{{ post.title }}</h3>
        <p>{{ post.summary }}</p>
        <button @click="viewPost(post._id)" class="view-button">Read More</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'FeedPage',
    data() {
      return {
        posts: []  // Will be populated with posts fetched from the backend
      };
    },
    created() {
      this.fetchPosts(); // Fetch posts as soon as the component is created
    },
    methods: {
      async fetchPosts() {
        try {
          const response = await axios.get('http://localhost:5001/posts'); // Ensure this URL matches your backend endpoint
          this.posts = response.data;
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      },
      viewPost(id) {
        // Navigate to the detailed post view using the router
        this.$router.push(`/post/${id}`);
      }
    }
  };
  </script>
  
  <style scoped>
  .feed-page {
    padding: 2em;
    max-width: 900px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    font-size: 2.5em;
    color: #333;
    margin-bottom: 1.5em;
  }
  
  .post-card {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 1.5em;
    margin-bottom: 1.5em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .post-card h3 {
    font-size: 1.8em;
    color: #333;
    margin-bottom: 0.8em;
  }
  
  .post-card p {
    font-size: 1.2em;
    color: #555;
    line-height: 1.6;
  }
  
  .view-button {
    padding: 0.8em;
    font-size: 1.1em;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .view-button:hover {
    background-color: #45a049;
  }
  
  .view-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>
  
  