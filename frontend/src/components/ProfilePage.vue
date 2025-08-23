<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <div v-if="loading" class="text-gray-500">Loading post…</div>

    <div v-else-if="error" class="text-red-600">
      {{ error }}
    </div>

    <article v-else class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-3">
        {{ post.title }}
      </h1>
      <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
        By {{ post.author || 'Anonymous' }} • {{ formatDate(post.createdAt) }}
      </div>

      <img
        v-if="post.image"
        :src="post.image"
        alt="Post image"
        class="w-full h-64 object-cover rounded mb-4"
      />

      <p class="text-gray-800 dark:text-gray-200 leading-relaxed mb-6">
        {{ post.body || post.excerpt }}
      </p>

      <!-- Comments -->
      <section class="mt-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          Comments ({{ (post.comments && post.comments.length) || 0 }})
        </h2>

        <div v-if="post.comments && post.comments.length" class="space-y-3 mb-4">
          <div
            v-for="c in post.comments"
            :key="c._id || c.id"
            class="border-b border-gray-200 dark:border-gray-700 pb-3"
          >
            <strong class="text-gray-800 dark:text-gray-100">
              {{ c.author || 'User' }}:
            </strong>
            <span class="text-gray-700 dark:text-gray-300"> {{ c.text }} </span>
          </div>
        </div>

        <div class="flex gap-2">
          <input
            v-model="newComment"
            type="text"
            placeholder="Write a comment…"
            class="flex-1 p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white text-black"
            @keyup.enter="submitComment"
          />
          <button
            @click="submitComment"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </section>
    </article>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "PostView",
  props: {
    // Optional: if parent passes a post object directly
    postProp: { type: Object, default: null }
  },
  data() {
    return {
      post: this.postProp || null,
      loading: !this.postProp,
      error: "",
      newComment: ""
    };
  },
  methods: {
    async loadPost() {
      this.loading = true;
      this.error = "";
      try {
        // Allow id from route param or query (?id=)
        const id = this.$route.params.id || this.$route.query.id || (this.post && this.post._id);
        if (!id) throw new Error("No post id provided.");

        const { status, data } = await api.get(`/api/posts/${id}`);
        if (status === 200 && data) {
          // Accept either a raw post object or {post: {...}}
          this.post = data.post || data;
        } else {
          throw new Error(`Unexpected response (${status}).`);
        }
      } catch (e) {
        console.error(e);
        this.error = "Unable to load this post.";
      } finally {
        this.loading = false;
      }
    },
    async submitComment() {
      const text = (this.newComment || "").trim();
      if (!text || !this.post || !this.post._id) return;

      try {
        const { status, data } = await api.post(`/api/posts/${this.post._id}/comments`, { text });
        if (status === 201 && data) {
          this.post.comments = this.post.comments || [];
          this.post.comments.push({
            _id: data._id || data.id || String(Date.now()),
            author: data.author || "You",
            text: data.text || text
          });
          this.newComment = "";
        }
      } catch (e) {
        console.error(e);
        // Keep it silent in demo; optionally show a toast here
      }
    },
    formatDate(d) {
      try {
        return new Date(d).toLocaleDateString();
      } catch {
        return "";
      }
    }
  },
  mounted() {
    if (!this.post) this.loadPost();
  }
};
</script>
