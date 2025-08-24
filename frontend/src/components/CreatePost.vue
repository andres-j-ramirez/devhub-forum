<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
    <div class="max-w-3xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Create Post</h1>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <input v-model="title" type="text" placeholder="Title" class="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white text-black" required />
        <input v-model="excerpt" type="text" placeholder="Excerpt" class="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white text-black" required />
        <textarea v-model="content" rows="6" placeholder="Content" class="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white text-black" required></textarea>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input v-model="category" type="text" placeholder="Category (e.g., Tech News)" class="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white text-black" />
          <input v-model="imageUrl" type="url" placeholder="Image URL (optional)" class="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white text-black" />
        </div>
        <input v-model="articleUrl" type="url" placeholder="External Article URL (optional)" class="w-full p-3 border rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white text-black" />
        <div class="flex items-center space-x-3">
          <button type="submit" class="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Publish</button>
          <button type="button" @click="cancel" class="px-5 py-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 text-black">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { seedDemoIfNeeded, readDemo, writeDemo, newId } from "@/demo/demoData";

export default {
  name: "CreatePost",
  data() {
    return {
      title: "",
      excerpt: "",
      content: "",
      category: "",
      imageUrl: "",
      articleUrl: ""
    };
  },
  methods: {
    onSubmit() {
      seedDemoIfNeeded();
      const state = readDemo() || { user: { comments: [] }, posts: [] };
      const post = {
        author: "You",
        id: newId(),
        title: this.title.trim(),
        excerpt: this.excerpt.trim(),
        content: this.content.trim(),
        image: this.imageUrl.trim() || "",
        articleUrl: this.articleUrl.trim() || "",
        createdAt: new Date().toISOString(),
        category: this.category.trim() || "Software Engineering",
        likes: 0,
        liked: false,
        comments: []
      };
      state.posts = [post, ...(state.posts || [])];
      writeDemo(state);
      if (typeof window !== "undefined") {
        window.location.hash = "#/feed";
        window.location.reload();
      }
    },
    cancel() {
      if (this.$router) this.$router.back();
      else if (typeof window !== "undefined") window.history.back();
    }
  }
};
</script>
