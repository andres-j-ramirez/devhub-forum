<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Page Heading -->
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Latest Posts
      </h1>

      <!-- Sorting and Filtering Controls -->
      <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <!-- Search Input -->
        <input
          v-model="searchQuery"
          @input="filterPosts"
          type="text"
          placeholder="Search posts..."
          class="w-full md:w-1/2 p-3 border rounded dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        />
        <!-- Sort Dropdown -->
        <select
          v-model="sortOption"
          @change="filterPosts"
          class="w-full md:w-1/3 p-3 border rounded dark:border-gray-600 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="date-new">Date: Newest First</option>
          <option value="date-old">Date: Oldest First</option>
          <option value="title">Title Alphabetically</option>
        </select>
        <!-- Category Filter -->
        <select
          v-model="selectedCategory"
          @change="filterPosts"
          class="w-full md:w-1/4 p-3 border rounded dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="text-center text-gray-500">
        Loading posts...
      </div>

      <!-- Posts List -->
      <div v-else>
        <div
          v-for="post in sortedPosts"
          :key="post._id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg"
        >
          <!-- Featured Image -->
          <img
            v-if="post.image"
            :src="post.image"
            alt="Post Image"
            class="w-full h-48 object-cover rounded mb-4"
          />
          <!-- Post Title -->
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            <a
              :href="post.articleUrl"
              target="_blank"
              rel="noopener"
              class="hover:underline"
            >
              {{ post.title }}
            </a>
          </h2>
          <!-- Post Excerpt -->
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            {{ post.excerpt }}
          </p>

          <!-- Post Info Row -->
          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div>Posted on {{ formatDate(post.createdAt) }}</div>
            <div class="flex items-center space-x-4">
              <!-- Like Button (toggle) -->
              <div
                class="flex items-center space-x-1 cursor-pointer"
                :class="post.liked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'"
                @click="toggleLike(post)"
              >
                <i class="fas fa-thumbs-up"></i>
                <span>{{ post.likes }}</span>
                <span class="ml-1 text-xs">Likes</span>
              </div>
              <!-- Comments Button (expand/collapse) -->
              <div
                class="flex items-center space-x-1 cursor-pointer hover:text-blue-600"
                @click="toggleComments(post)"
              >
                <i class="fas fa-comment"></i>
                <span>{{ post.comments.length }}</span>
                <span class="ml-1 text-xs">Comments</span>
              </div>
            </div>
          </div>

          <!-- Comments Section (expand/collapse) -->
          <div
            v-if="post.showComments"
            class="mt-4 border-t border-gray-300 dark:border-gray-700 pt-4"
          >
            <div class="mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Comments
            </div>
            <!-- Existing Comments -->
            <div
              v-for="comment in post.comments"
              :key="comment._id"
              class="mb-2"
            >
              <strong class="text-gray-800 dark:text-gray-100">
                {{ comment.author }}:
              </strong>
              <span class="text-gray-600 dark:text-gray-300">
                {{ comment.text }}
              </span>
            </div>
            <!-- Add New Comment -->
            <div class="mt-3 flex space-x-2">
              <input
                v-model="post.newComment"
                type="text"
                placeholder="Write a comment..."
                class="flex-1 p-2 border rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                @keyup.enter="submitComment(post)"
              />
              <button
                @click="submitComment(post)"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <!-- No Posts Found Message -->
        <div v-if="sortedPosts.length === 0" class="text-center text-gray-500">
          No posts match your criteria.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { store } from "@/store.js";

export default {
  name: "FeedPage",
  data() {
    return {
      posts: [],
      loading: true,
      searchQuery: "",
      sortOption: "date-new", // Default sort: Newest First
      selectedCategory: "",
      categories: ["Software Engineering", "Cloud", "Tech News"]
    };
  },
  computed: {
    filteredPosts() {
      return this.posts.filter(post => {
        const matchesSearch =
          post.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory = this.selectedCategory
          ? post.category === this.selectedCategory
          : true;
        return matchesSearch && matchesCategory;
      });
    },
    sortedPosts() {
      let sorted = [...this.filteredPosts];
      if (this.sortOption === "date-new") {
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (this.sortOption === "date-old") {
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (this.sortOption === "title") {
        sorted.sort((a, b) => a.title.localeCompare(b.title));
      }
      return sorted;
    }
  },
  methods: {
    async fetchPosts() {
      try {
        console.log("Fetching posts...");
        const response = await fetch("http://localhost:5001/api/posts");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched posts:", data);
        if (Array.isArray(data) && data.length === 0) {
          console.warn("No posts found in DB. Using sample posts...");
          this.posts = this.generateSamplePosts();
        } else {
          this.posts = data;
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        this.posts = this.generateSamplePosts();
      } finally {
        this.loading = false;
      }
    },
    filterPosts() {
      console.log("Filtering posts:", this.searchQuery, this.selectedCategory);
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    toggleLike(post) {
      if (!post.liked) {
        post.likes++;
        post.liked = true;
      } else {
        post.likes--;
        post.liked = false;
      }
    },
    toggleComments(post) {
      post.showComments = !post.showComments;
    },
    submitComment(post) {
      if (!post.newComment || !post.newComment.trim()) return;
      const newComment = {
        _id: Date.now().toString(),
        author: "CurrentUser",
        text: post.newComment.trim()
      };
      post.comments.push(newComment);
      // Also add to global user comments so it appears on the profile page
      store.user.comments.push({
        text: newComment.text,
        postTitle: post.title
      });
      post.newComment = "";
    },
    generateSamplePosts() {
      return [
        {
          _id: "1",
          title: "Breaking into Software Engineering",
          excerpt: "A guide to starting your career in software engineering.",
          content: "Full content for post 1...",
          image: "https://picsum.photos/seed/post1/600/400",
          articleUrl: "http://github.com/npmaile/blog/blob/main/posts/2.%20How%20to%20get%20into%20software.md",
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          category: "Software Engineering",
          likes: 12,
          liked: false,
          comments: [{ _id: "c1", author: "Alice", text: "Great guide!" }],
          newComment: "",
          showComments: false
        },
        {
          _id: "2",
          title: "A Beginner’s Guide to Cloud Computing",
          excerpt: "An introduction to the basics of cloud infrastructure.",
          content: "Full content for post 2...",
          image: "https://picsum.photos/seed/post2/600/400",
          articleUrl: "https://www.ibm.com/think/topics/cloud-computing",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          category: "Cloud",
          likes: 25,
          liked: false,
          comments: [{ _id: "c2", author: "Bob", text: "Very informative!" }],
          newComment: "",
          showComments: false
        },
        {
          _id: "3",
          title: "The Future of AI: Trends to Watch",
          excerpt: "Exploring emerging trends in artificial intelligence.",
          content: "Full content for post 3...",
          image: "https://picsum.photos/seed/post3/600/400",
          articleUrl: "https://sloanreview.mit.edu/article/five-trends-in-ai-and-data-science-for-2025/",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          category: "Tech News",
          likes: 30,
          liked: false,
          comments: [{ _id: "c3", author: "Carol", text: "Exciting future!" }],
          newComment: "",
          showComments: false
        },
        {
          _id: "4",
          title: "Top DevOps Tools: Docker, Kubernetes, Terraform",
          excerpt: "An overview of essential DevOps tools for building and managing cloud-native apps.",
          content: "Full content for post 4...",
          image: "https://picsum.photos/seed/post4/600/400",
          articleUrl: "https://www.env0.com/blog/top-devops-tools-for-infrastructure-automation#:~:text=Some%20of%20the%20most%20popular,Kubernetes%2C%20Terraform%2C%20and%20Prometheus.",
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          category: "Cloud",
          likes: 15,
          liked: false,
          comments: [],
          newComment: "",
          showComments: false
        },
        {
          _id: "5",
          title: "Securing Cloud Environments in 2025",
          excerpt: "Learn key strategies to protect your cloud systems from evolving cyber threats.",
          content: "Full content for post 5...",
          image: "https://picsum.photos/seed/post5/600/400",
          articleUrl: "https://www.charterglobal.com/cloud-security-best-practices/",
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          category: "Cloud",
          likes: 18,
          liked: false,
          comments: [],
          newComment: "",
          showComments: false
        },
        {
          _id: "6",
          title: "Containerization Best Practices for Modern Applications",
          excerpt: "Tips and best practices for using Docker and container technologies effectively.",
          content: "Full content for post 6...",
          image: "https://picsum.photos/seed/post6/600/400",
          articleUrl: "https://www.tenable.com/blog/mastering-containerization-key-strategies-and-best-practices",
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          category: "Cloud",
          likes: 22,
          liked: false,
          comments: [],
          newComment: "",
          showComments: false
        },
        {
          _id: "7",
          title: "Strategies for Database Scaling in the Cloud",
          excerpt: "Explore techniques for scaling your databases to meet growing demand in cloud environments.",
          content: "Full content for post 7...",
          image: "https://picsum.photos/seed/post7/600/400",
          articleUrl: "https://karandeepsingh.ca/posts/leveraging-devops-cloud-database-scaling/",
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          category: "Cloud",
          likes: 14,
          liked: false,
          comments: [{ _id: "c4", author: "Frank", text: "Very informative!" }],
          newComment: "",
          showComments: false
        }
      ];
    }
  },
  mounted() {
    console.log("FeedPage Mounted");
    this.fetchPosts();
  }
};
</script>

<style scoped>
/* Additional styling if needed */
</style>
