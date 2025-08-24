<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
    <div class="max-w-4xl mx-auto px-4 space-y-8">
      <div class="flex items-center space-x-4">
        <img :src="user.avatar" alt="" class="w-16 h-16 rounded-full object-cover border" />
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">@{{ user.username }}</h1>
          <p class="text-gray-600 dark:text-gray-300">{{ user.bio }}</p>
        </div>
        <div class="ml-auto">
          <ResetDemoButton />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-sm text-gray-500 dark:text-gray-400">Posts</div>
          <div class="text-2xl font-semibold text-gray-900 dark:text-white">{{ myPosts.length }}</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-sm text-gray-500 dark:text-gray-400">Likes</div>
          <div class="text-2xl font-semibold text-gray-900 dark:text-white">{{ likedPosts.length }}</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="text-sm text-gray-500 dark:text-gray-400">Comments</div>
          <div class="text-2xl font-semibold text-gray-900 dark:text-white">{{ myComments.length }}</div>
        </div>
      </div>

      <section>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Liked Posts</h2>
        <div v-if="likedPosts.length === 0" class="text-gray-500 dark:text-gray-400">No likes yet.</div>
        <ul v-else class="space-y-3">
          <li v-for="p in likedPosts" :key="p.id" class="bg-white dark:bg-gray-800 rounded p-4 shadow">
            <div class="font-medium text-gray-900 dark:text-white">{{ p.title }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(p.createdAt) }} • {{ p.category }}</div>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Your Comments</h2>
        <div v-if="myComments.length === 0" class="text-gray-500 dark:text-gray-400">No comments yet.</div>
        <ul v-else class="space-y-3">
          <li v-for="c in myComments" :key="c.id" class="bg-white dark:bg-gray-800 rounded p-4 shadow">
            <div class="text-gray-800 dark:text-gray-100">{{ c.text }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              on <span class="font-medium">{{ c.postTitle }}</span>
            </div>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">Your Posts</h2>
        <div v-if="myPosts.length === 0" class="text-gray-500 dark:text-gray-400">You haven't created any posts yet.</div>
        <ul v-else class="space-y-3">
          <li v-for="p in myPosts" :key="p.id" class="bg-white dark:bg-gray-800 rounded p-4 shadow">
            <div class="font-medium text-gray-900 dark:text-white">{{ p.title }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(p.createdAt) }} • {{ p.category }}</div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import ResetDemoButton from "@/components/ResetDemoButton.vue";
import { seedDemoIfNeeded, readDemo } from "@/demo/demoData";

export default {
  name: "ProfilePage",
  components: { ResetDemoButton },
  data() {
    return {
      user: { username: "", avatar: "", bio: "" },
      posts: []
    };
  },
  computed: {
    likedPosts() {
      return this.posts.filter((p) => p.liked);
    },
    myComments() {
      const out = [];
      for (const p of this.posts) {
        for (const c of p.comments || []) {
          if ((c.author || "").toLowerCase() === "you") {
            out.push({ ...c, postId: p.id, postTitle: p.title });
          }
        }
      }
      return out;
    },
    myPosts() {
      return this.posts.filter((p) => (p.author || "").toLowerCase() === "you");
    }
  },
  methods: {
    load() {
      seedDemoIfNeeded();
      const s = readDemo() || { user: {}, posts: [] };
      this.user = s.user || {};
      this.posts = s.posts || [];
    },
    formatDate(d) {
      return new Date(d).toLocaleDateString();
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.load());
  },
  beforeRouteUpdate(to, from, next) {
    this.load();
    next();
  },
  mounted() {
    this.load();
  }
};
</script>
