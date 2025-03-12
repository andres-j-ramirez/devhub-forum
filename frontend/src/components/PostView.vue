<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
    <div class="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded shadow">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ post.title }}</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-6">{{ post.content }}</p>
      
      <div class="comments mb-6" v-if="post.comments && post.comments.length">
        <h3 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Comments</h3>
        <div
          v-for="comment in post.comments"
          :key="comment._id"
          class="bg-gray-50 dark:bg-gray-700 p-4 mb-3 rounded shadow"
        >
          <p class="text-gray-800 dark:text-gray-200">
            <strong>{{ comment.author }}</strong>: {{ comment.text }}
          </p>
          <small class="text-gray-500 dark:text-gray-400">{{ comment.time }}</small>
        </div>
      </div>
      <div v-else class="mb-6">
        <p class="text-gray-600 dark:text-gray-300">No comments yet. Be the first to comment!</p>
      </div>

      <form @submit.prevent="addComment" class="flex flex-col">
        <input
          v-model="newComment"
          type="text"
          placeholder="Add a comment"
          required
          class="w-full p-3 border rounded mb-4 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded">
          Comment
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PostView",
  data() {
    return {
      post: {
        _id: this.$route.params.id,
        title: "",
        content: "",
        comments: []
      },
      newComment: ""
    };
  },
  created() {
    this.fetchPost();
  },
  methods: {
    async fetchPost() {
      try {
        const response = await axios.get(`http://localhost:5001/posts/${this.post._id}`);
        this.post = response.data;
      } catch (error) {
        console.error("Error fetching the post:", error);
      }
    },
    async addComment() {
      if (this.newComment.trim()) {
        const comment = {
          author: "CurrentUser", // Replace with dynamic user data if available
          text: this.newComment,
          time: new Date().toLocaleString()
        };
        try {
          await axios.post(`http://localhost:5001/posts/${this.post._id}/comments`, comment);
          this.post.comments.push(comment);
          this.newComment = "";
        } catch (error) {
          console.error("Error adding comment:", error);
          alert("Error adding comment. Please try again.");
        }
      }
    }
  }
};
</script>

<style scoped>
/* Additional styles if needed */
</style>

  