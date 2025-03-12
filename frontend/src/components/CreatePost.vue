<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
    <div class="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-lg">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Create a New Post</h2>
      <form @submit.prevent="createPost" class="space-y-4">
        <div>
          <label class="block text-gray-700 dark:text-gray-300 font-medium mb-1" for="title">Title</label>
          <input
            id="title"
            v-model="title"
            type="text"
            required
            class="w-full p-3 border rounded focus:outline-none focus:ring-2 
                   focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-gray-300 font-medium mb-1" for="content">Content</label>
          <textarea
            id="content"
            v-model="content"
            rows="5"
            required
            class="w-full p-3 border rounded focus:outline-none focus:ring-2 
                   focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          ></textarea>
        </div>
        <div>
          <label class="block text-gray-700 dark:text-gray-300 font-medium mb-1" for="image">
            Image URL (required)
          </label>
          <input
            id="image"
            v-model="image"
            type="url"
            required
            class="w-full p-3 border rounded focus:outline-none focus:ring-2 
                   focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-gray-300 font-medium mb-1" for="articleLink">
            Article Link (required)
          </label>
          <input
            id="articleLink"
            v-model="articleLink"
            type="url"
            required
            class="w-full p-3 border rounded focus:outline-none focus:ring-2 
                   focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="https://example.com/article"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded"
        >
          Create Post
        </button>
      </form>

      <div v-if="errorMessage" class="text-red-500 mt-4">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { store } from "@/store.js";

export default {
  name: "CreatePost",
  data() {
    return {
      title: "",
      content: "",
      image: "",
      articleLink: "",
      errorMessage: ""
    };
  },
  methods: {
    createPost() {
      // Basic validation
      if (!this.title || !this.content || !this.image || !this.articleLink) {
        this.errorMessage = "All fields are required, including image & link.";
        return;
      }
      // Construct new post
      const newPost = {
        _id: Date.now().toString(),
        title: this.title,
        content: this.content,
        excerpt: this.content.slice(0, 80) + "...",
        image: this.image,
        articleUrl: this.articleLink,
        createdAt: new Date().toISOString(),
        category: "Cloud",
        likes: 0,
        liked: false,
        comments: [],
        newComment: "",
        showComments: false
      };

      // Add to store.feed
      store.feed.push(newPost);
      // Also add to user’s posts
      store.user.posts.push(newPost);

      // Clear form
      this.title = "";
      this.content = "";
      this.image = "";
      this.articleLink = "";
      this.errorMessage = "";

      // Redirect to feed
      this.$router.push("/feed");
    }
  }
};
</script>

<style scoped>
/* Keep your original styling for light mode. 
   The .dark overrides are minimal. */
</style>
