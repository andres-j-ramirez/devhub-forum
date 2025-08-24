<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Latest Posts</h1>
      <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <input v-model="searchQuery" type="text" placeholder="Search posts..." class="w-full md:w-1/2 p-3 border rounded dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"/>
        <select v-model="sortOption" class="w-full md:w-1/3 p-3 border rounded dark:border-gray-600 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="date-new">Date: Newest First</option>
          <option value="date-old">Date: Oldest First</option>
          <option value="title">Title Alphabetically</option>
        </select>
        <select v-model="selectedCategory" class="w-full md:w-1/4 p-3 border rounded dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-black">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <div v-if="loading" class="text-center text-gray-500">Loading posts...</div>
      <div v-else>
        <div v-for="post in sortedPosts" :key="post.id" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg">
          <img v-if="post.image" :src="post.image" alt="" class="w-full h-48 object-cover rounded mb-4"/>
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            <a :href="post.articleUrl" target="_blank" rel="noopener" class="hover:underline">{{ post.title }}</a>
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4">{{ post.excerpt }}</p>
          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div>Posted on {{ formatDate(post.createdAt) }}</div>
            <div class="flex items-center space-x-4">
              <button class="flex items-center space-x-1" :class="post.liked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'" @click="toggleLike(post)">
                <i class="fas fa-thumbs-up"></i>
                <span>{{ post.likes }}</span>
                <span class="ml-1 text-xs">Likes</span>
              </button>
              <button class="flex items-center space-x-1 hover:text-blue-600" @click="toggleComments(post)">
                <i class="fas fa-comment"></i>
                <span>{{ post.comments.length }}</span>
                <span class="ml-1 text-xs">Comments</span>
              </button>
            </div>
          </div>
          <div v-if="post.showComments" class="mt-4 border-t border-gray-300 dark:border-gray-700 pt-4">
            <div class="mb-2 font-semibold text-gray-700 dark:text-gray-200">Comments</div>
            <div v-for="c in post.comments" :key="c.id" class="mb-2">
              <strong class="text-gray-800 dark:text-gray-100">{{ c.author }}:</strong>
              <span class="text-gray-600 dark:text-gray-300"> {{ c.text }}</span>
            </div>
            <div class="mt-3 flex space-x-2">
              <input v-model="post.newComment" type="text" placeholder="Write a comment..." class="flex-1 p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" @keyup.enter="submitComment(post)"/>
              <button @click="submitComment(post)" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add</button>
            </div>
          </div>
        </div>
        <div v-if="sortedPosts.length === 0" class="text-center text-gray-500">No posts match your criteria.</div>
      </div>
    </div>
  </div>
</template>

<script>
import { seedDemoIfNeeded, readDemo, writeDemo, newId } from "@/demo/demoData";

export default {
  name: "FeedPage",
  data() {
    return { posts: [], loading: true, searchQuery: "", sortOption: "date-new", selectedCategory: "", categories: ["Software Engineering","Cloud","Tech News"] };
  },
  computed: {
    filteredPosts() {
      const q = this.searchQuery.trim().toLowerCase();
      return this.posts.filter(p => {
        const s = !q || (p.title||"").toLowerCase().includes(q) || (p.excerpt||"").toLowerCase().includes(q) || (p.content||"").toLowerCase().includes(q);
        const c = this.selectedCategory ? p.category === this.selectedCategory : true;
        return s && c;
      });
    },
    sortedPosts() {
      const arr = [...this.filteredPosts];
      if (this.sortOption === "date-new") arr.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
      else if (this.sortOption === "date-old") arr.sort((a,b)=> new Date(a.createdAt)-new Date(b.createdAt));
      else if (this.sortOption === "title") arr.sort((a,b)=> (a.title||"").localeCompare(b.title||""));
      return arr;
    }
  },
  methods: {
    loadDemo() {
      seedDemoIfNeeded();
      const state = readDemo();
      this.posts = state?.posts || [];
    },
    persist() {
      const state = readDemo() || { user: { comments: [] }, posts: [] };
      state.posts = this.posts;
      writeDemo(state);
    },
    formatDate(d) { return new Date(d).toLocaleDateString(); },
    toggleLike(post) { post.liked = !post.liked; post.likes = Math.max(0, (post.likes||0) + (post.liked ? 1 : -1)); this.persist(); },
    toggleComments(post) { post.showComments = !post.showComments; },
    submitComment(post) {
      const text = (post.newComment||"").trim();
      if (!text) return;
      post.comments.push({ id: newId(), author: "You", text });
      post.newComment = "";
      this.persist();
    }
  },
  beforeRouteEnter(to,from,next){next(vm=>vm.loadDemo());},
  beforeRouteUpdate(to,from,next){this.loadDemo();next();},
  mounted() {
    this.loadDemo();
    this.loading = false;
  }
};
</script>
