<template>
    <div class="post-view">
      <h2>{{ post.title }}</h2>
      <p>{{ post.content }}</p>
  
      <div class="comments" v-if="post.comments.length">
        <h3>Comments</h3>
        <div v-for="comment in post.comments" :key="comment._id" class="comment-card">
          <p><strong>{{ comment.author }}</strong>: {{ comment.text }} ({{ comment.time }})</p>
        </div>
      </div>
      
      <div v-else>
        <p>No comments yet. Be the first to comment!</p>
      </div>
  
      <form @submit.prevent="addComment">
        <input 
          v-model="newComment" 
          type="text" 
          placeholder="Add a comment" 
          required 
          class="comment-input"
        />
        <button type="submit" class="comment-button">Comment</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'PostView',
    data() {
      return {
        post: {
          _id: this.$route.params.id,  // Post ID from the route
          title: '',
          content: '',
          comments: []
        },
        newComment: ''
      };
    },
    created() {
      this.fetchPost();  // Fetch the post data when the component is created
    },
    methods: {
      async fetchPost() {
        try {
          const response = await axios.get(`http://localhost:5001/posts/${this.post._id}`);  // Adjust the URL to match your backend
          this.post = response.data;
        } catch (error) {
          console.error('Error fetching the post:', error);
        }
      },
      async addComment() {
        if (this.newComment.trim()) {
          const comment = {
            author: 'CurrentUser',  // This could be dynamic based on logged-in user
            text: this.newComment,
            time: 'Just now'  // You can dynamically generate this based on the actual time
          };
          
          try {
            await axios.post(`http://localhost:5001/posts/${this.post._id}/comments`, comment);  // Adjust the URL to match your backend
            this.post.comments.push(comment);  // Update the UI with the new comment
            this.newComment = '';  // Reset the input field
          } catch (error) {
            console.error('Error adding comment:', error);
          }
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .post-view {
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
  
  p {
    font-size: 1.2em;
    color: #555;
    line-height: 1.6;
  }
  
  .comments {
    margin-top: 2em;
  }
  
  .comment-card {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 1em;
    margin-bottom: 1em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .comment-input {
    width: 100%;
    padding: 1em;
    font-size: 1.2em;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 1em;
  }
  
  .comment-button {
    padding: 0.8em;
    font-size: 1.1em;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .comment-button:hover {
    background-color: #45a049;
  }
  
  .comment-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>
  