<template>
    <div class="create-post">
      <h2>Create New Post</h2>
      <form @submit.prevent="createPost">
        <div class="form-group">
          <label for="title">Title:</label>
          <input id="title" v-model="title" type="text" required>
        </div>
        <div class="form-group">
          <label for="content">Content:</label>
          <textarea id="content" v-model="content" required></textarea>
        </div>
        <div class="form-group">
          <label for="image">Image URL (optional):</label>
          <input id="image" v-model="image" type="text">
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  </template>
  
  <script>
  import api from '../api/axios';
  
  export default {
    name: 'CreatePost',
    data() {
      return {
        title: '',
        content: '',
        image: '',
      };
    },
    methods: {
      async createPost() {
        try {
          const payload = {
            title: this.title,
            content: this.content,
            image: this.image || undefined,
          };
          const response = await api.post('/posts', payload);
          // After creating, navigate to the newly created post's view
          this.$router.push(`/post/${response.data._id}`);
        } catch (err) {
          console.error('Error creating post:', err);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .create-post {
    padding: 2em;
  }
  
  .form-group {
    margin-bottom: 1em;
  }
  
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5em;
  }
  
  input,
  textarea {
    width: 100%;
    padding: 0.5em;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    padding: 0.5em 1em;
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
  
  button:hover {
    background-color: #218838;
  }
  </style>
  
  