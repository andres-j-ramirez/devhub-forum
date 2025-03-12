<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Profile Card -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div class="flex items-center space-x-4">
          <!-- Avatar -->
          <img
            :src="user.avatar"
            alt="User Avatar"
            class="w-24 h-24 rounded-full object-cover"
          />
          <!-- Basic Info -->
          <div>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ user.username }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300">
              {{ user.bio }}
            </p>
          </div>
        </div>
      </div>

      <!-- User Posts -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">User Posts</h3>
        <div v-if="user.posts.length">
          <div
            v-for="(post, index) in user.posts"
            :key="index"
            class="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4"
          >
            <h4 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {{ post.title }}
            </h4>
            <p class="text-gray-600 dark:text-gray-300">
              {{ post.content }}
            </p>
          </div>
        </div>
        <div v-else class="text-gray-500 dark:text-gray-400">
          No posts yet.
        </div>
      </div>

      <!-- User Comments -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">User Comments</h3>
        <div v-if="user.comments.length">
          <div
            v-for="(comment, index) in user.comments"
            :key="index"
            class="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4"
          >
            <p class="text-gray-600 dark:text-gray-300">
              "{{ comment.text }}"
            </p>
            <small class="text-gray-500 dark:text-gray-400">
              On post: {{ comment.postTitle }}
            </small>
          </div>
        </div>
        <div v-else class="text-gray-500 dark:text-gray-400">
          No comments yet.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from "@/store.js";

export default {
  name: "ProfilePage",
  data() {
    return {
      // Bind directly to the global store's user object
      user: store.user
    };
  },
  mounted() {
    // If you plan to fetch user data from an API later, do it here.
  }
};
</script>

<style scoped>
/* Additional styling if needed */
</style>
