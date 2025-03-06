<template>
    <div class="profile-page">
      <div class="profile-info">
        <img :src="user.avatar || 'default-avatar.png'" alt="User Avatar" class="avatar" />
        <div>
          <h2>{{ user.username }}</h2>
          <p>{{ user.bio }}</p>
        </div>
      </div>
  
      <div class="profile-posts">
        <h3>User Posts</h3>
        <div v-for="post in posts" :key="post._id" class="post-card">
          <h4>{{ post.title }}</h4>
          <p>{{ post.content.slice(0, 100) }}...</p>
          <button @click="viewPost(post._id)">View Post</button>
        </div>
      </div>
  
      <div class="profile-comments">
        <h3>User Comments</h3>
        <div v-for="comment in comments" :key="comment._id" class="comment-card">
          <p>{{ comment.text }}</p>
          <small>On post: {{ comment.postTitle || 'Unknown' }}</small>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../api/axios';
  
  export default {
    name: 'ProfileView',
    data() {
      return {
        user: {},
        posts: [],
        comments: [],
      };
    },
    mounted() {
      this.fetchProfile();
    },
    methods: {
      async fetchProfile() {
        try {
          const userId = this.$route.params.id;
          // Fetch user details
          const userResponse = await api.get(`/users/${userId}`);
          this.user = userResponse.data;
          // Fetch posts by the user
          const postsResponse = await api.get(`/users/${userId}/posts`);
          this.posts = postsResponse.data;
          // Fetch comments made by the user
          const commentsResponse = await api.get(`/users/${userId}/comments`);
          this.comments = commentsResponse.data;
        } catch (err) {
          console.error('Error fetching profile data:', err);
        }
      },
      viewPost(postId) {
        this.$router.push(`/post/${postId}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .profile-page {
    padding: 2em;
  }
  .profile-info {
    display: flex;
    align-items: center;
    margin-bottom: 2em;
  }
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 1em;
  }
  .profile-posts, .profile-comments {
    margin-bottom: 2em;
  }
  .post-card, .comment-card {
    border: 1px solid #ccc;
    padding: 1em;
    margin-bottom: 1em;
    background-color: #f9f9f9;
  }
  button {
    padding: 0.5em 1em;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
  button:hover {
    background-color: #0056b3;
  }
  </style>
  