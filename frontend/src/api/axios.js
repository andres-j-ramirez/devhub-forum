// src/api/axios.js
import axios from "axios";

/**
 * Base URL:
 * - On GitHub Pages (*.github.io) we keep requests same-origin ("") and use mocks.
 * - Else we use env or default to local dev API.
 */
const isPages =
  typeof window !== "undefined" && /\.github\.io$/.test(window.location.hostname);

const base =
  isPages
    ? "" // same-origin on Pages; intercepted below
    : (process.env.VUE_APP_API_BASE || "http://localhost:5001");

const api = axios.create({
  baseURL: base,
  withCredentials: false,
});

/* ------------------------------------------------------------------ */
/* Demo store (localStorage) — only used on GitHub Pages               */
/* ------------------------------------------------------------------ */
if (isPages) {
  const LS_KEY = "devhub_demo_posts_v1";
  const TOKEN_KEY = "token"; // we keep using your existing token key

  const readLS = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  };
  const writeLS = (posts) => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(posts));
    } catch (_) {}
  };

  // --- Versioned seed so we can replace demo content and force refresh ---
  const DEMO_VER_KEY = "devhub_demo_version";
  const DEMO_VERSION = "2"; // bump to force reseed

  const ensureSeed = () => {
    const current = (typeof localStorage !== "undefined" && localStorage.getItem(DEMO_VER_KEY)) || "";
    let posts = readLS();

    if (current !== DEMO_VERSION || !Array.isArray(posts) || posts.length < 5) {
      // Rich seed: ~10 posts with links, categories, likes, and comments
      const now = Date.now();
      posts = [
        {
          id: now - 11 * 86400000,
          title: "Breaking into Software Engineering",
          excerpt: "A practical starter path into SWE: projects, networking, interviews.",
          body: "A practical starter path into SWE.",
          image: "https://picsum.photos/seed/devhub101/1200/450",
          articleUrl: "https://github.com/npmaile/blog/blob/main/posts/2.%20How%20to%20get%20into%20software.md",
          createdAt: new Date(now - 11 * 86400000).toISOString(),
          category: "Software Engineering",
          likes: 12,
          liked: false,
          comments: [{ id: "c1", author: "Alice", text: "Great guide!" }]
        },
        {
          id: now - 10 * 86400000,
          title: "A Beginner’s Guide to Cloud Computing",
          excerpt: "The basics of cloud infrastructure and key providers.",
          body: "Intro to the cloud landscape.",
          image: "https://picsum.photos/seed/devhub102/1200/450",
          articleUrl: "https://www.ibm.com/think/topics/cloud-computing",
          createdAt: new Date(now - 10 * 86400000).toISOString(),
          category: "Cloud",
          likes: 25, liked: false,
          comments: [{ id: "c2", author: "Bob", text: "Very informative!" }]
        },
        {
          id: now - 9 * 86400000,
          title: "The Future of AI: Trends to Watch",
          excerpt: "Emerging trends shaping AI & data.",
          body: "Five big trends in AI and data.",
          image: "https://picsum.photos/seed/devhub103/1200/450",
          articleUrl: "https://sloanreview.mit.edu/article/five-trends-in-ai-and-data-science-for-2025/",
          createdAt: new Date(now - 9 * 86400000).toISOString(),
          category: "Tech News",
          likes: 30, liked: false,
          comments: [{ id: "c3", author: "Carol", text: "Exciting future!" }]
        },
        {
          id: now - 8 * 86400000,
          title: "Top DevOps Tools: Docker, Kubernetes, Terraform",
          excerpt: "Core tools for cloud-native infra & apps.",
          body: "Primer on Docker, K8s, and Terraform.",
          image: "https://picsum.photos/seed/devhub104/1200/450",
          articleUrl: "https://www.env0.com/blog/top-devops-tools-for-infrastructure-automation",
          createdAt: new Date(now - 8 * 86400000).toISOString(),
          category: "Cloud",
          likes: 15, liked: false,
          comments: []
        },
        {
          id: now - 7 * 86400000,
          title: "Securing Cloud Environments in 2025",
          excerpt: "Key strategies to protect cloud systems.",
          body: "Threat models and practices.",
          image: "https://picsum.photos/seed/devhub105/1200/450",
          articleUrl: "https://www.charterglobal.com/cloud-security-best-practices/",
          createdAt: new Date(now - 7 * 86400000).toISOString(),
          category: "Cloud",
          likes: 18, liked: false,
          comments: []
        },
        {
          id: now - 6 * 86400000,
          title: "Containerization Best Practices",
          excerpt: "Get more from Docker & friends.",
          body: "Tips for secure, portable images.",
          image: "https://picsum.photos/seed/devhub106/1200/450",
          articleUrl: "https://www.tenable.com/blog/mastering-containerization-key-strategies-and-best-practices",
          createdAt: new Date(now - 6 * 86400000).toISOString(),
          category: "Cloud",
          likes: 22, liked: false,
          comments: []
        },
        {
          id: now - 5 * 86400000,
          title: "Database Scaling in the Cloud",
          excerpt: "Patterns for growth: sharding, read replicas, caches.",
          body: "Scale patterns & tradeoffs.",
          image: "https://picsum.photos/seed/devhub107/1200/450",
          articleUrl: "https://karandeepsingh.ca/posts/leveraging-devops-cloud-database-scaling/",
          createdAt: new Date(now - 5 * 86400000).toISOString(),
          category: "Cloud",
          likes: 14, liked: false,
          comments: [{ id: "c4", author: "Frank", text: "Helpful overview!" }]
        },
        {
          id: now - 4 * 86400000,
          title: "Kubernetes Crash Course",
          excerpt: "Pods, services, deployments—quick orientation.",
          body: "K8s essentials with mental models.",
          image: "https://picsum.photos/seed/devhub108/1200/450",
          articleUrl: "https://kubernetes.io/docs/concepts/overview/",
          createdAt: new Date(now - 4 * 86400000).toISOString(),
          category: "Cloud",
          likes: 10, liked: false,
          comments: []
        },
        {
          id: now - 3 * 86400000,
          title: "CI/CD with GitHub Actions",
          excerpt: "Ship faster with workflows, caching, and environments.",
          body: "Patterns for reliable pipelines.",
          image: "https://picsum.photos/seed/devhub109/1200/450",
          articleUrl: "https://docs.github.com/actions",
          createdAt: new Date(now - 3 * 86400000).toISOString(),
          category: "Software Engineering",
          likes: 17, liked: false,
          comments: []
        },
        {
          id: now - 2 * 86400000,
          title: "Terraform: Infrastructure as Code",
          excerpt: "Modules, state, workspaces, and guardrails.",
          body: "How to keep IaC sane at scale.",
          image: "https://picsum.photos/seed/devhub110/1200/450",
          articleUrl: "https://developer.hashicorp.com/terraform/docs",
          createdAt: new Date(now - 2 * 86400000).toISOString(),
          category: "Cloud",
          likes: 19, liked: false,
          comments: []
        }
      ];

      writeLS(posts);
      try { localStorage.setItem(DEMO_VER_KEY, DEMO_VERSION); } catch (_) {}
    }
  };

  const listPosts = () => readLS() || [];
  const getPost = (id) => (listPosts().find((p) => String(p.id) === String(id)) || null);
  const setPosts = (arr) => writeLS(arr);

  const createPost = (data) => {
    const posts = listPosts();
    const now = Date.now();
    const post = {
      id: now,
      title: data.title || "Untitled",
      excerpt: data.excerpt || data.content || "",
      body: data.content || "",
      image: data.image || "",
      articleUrl: data.articleUrl || "",
      createdAt: new Date().toISOString(),
      category: data.category || "General",
      likes: 0,
      liked: false,
      comments: [],
    };
    posts.unshift(post);
    setPosts(posts);
    return post;
  };

  const updatePost = (id, patch) => {
    const posts = listPosts();
    const idx = posts.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return null;
    posts[idx] = { ...posts[idx], ...patch };
    setPosts(posts);
    return posts[idx];
    };

  const deletePost = (id) => {
    const before = listPosts();
    const after = before.filter((p) => String(p.id) !== String(id));
    setPosts(after);
    return before.length !== after.length;
  };

  const addComment = (id, text, author = "You") => {
    const posts = listPosts();
    const idx = posts.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) return null;
    const c = { id: Date.now(), author, text: String(text || "").trim() };
    posts[idx].comments = posts[idx].comments || [];
    posts[idx].comments.push(c);
    setPosts(posts);
    return c;
  };

  ensureSeed();

  /* -------------------------------------------------------------- */
  /* Axios interceptors: convert API calls into local operations     */
  /* -------------------------------------------------------------- */
  const ok = (data, status = 200) => ({ status, data, headers: {}, config: {}, statusText: "OK" });
  const err = (status, data) => ({ status, data, headers: {}, config: {}, statusText: "ERR" });

  api.interceptors.request.use((config) => {
    const method = (config.method || "get").toLowerCase();
    const url = config.url || "";
    // Normalize data
    let data = config.data;
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch { data = {}; }
    }
    data = data || {};

    // ---- AUTH ----------------------------------------------------
    if (/\/api\/auth\/login\b/.test(url) && method === "post") {
      const email = String(data.email || "").toLowerCase();
      const pass = String(data.password || "");
      const success = (email === "test@example.com" && pass === "devhub");
      if (success) {
        try { localStorage.setItem(TOKEN_KEY, "demo"); } catch (_) {}
        return Promise.reject({ __mock: true, response: ok({ token: "demo", user: { email } }, 200) });
      }
      return Promise.reject({ __mock: true, response: err(401, { message: "Invalid email or password." }) });
    }

    // Simple token gate for write ops
    const needsToken = (method === "post" || method === "put" || method === "delete") &&
                       /\/api\/posts\b/.test(url);
    if (needsToken) {
      const token = (config.headers && (config.headers.Authorization || config.headers.authorization) || "").replace(/^Bearer\s+/i, "");
      if (token !== "demo") {
        return Promise.reject({ __mock: true, response: err(401, { message: "Unauthorized" }) });
      }
    }

    // ---- POSTS: list ---------------------------------------------
    if (/\/api\/posts\/?$/.test(url) && method === "get") {
      return Promise.reject({ __mock: true, response: ok({ posts: listPosts() }, 200) });
    }

    // ---- POSTS: create -------------------------------------------
    if (/\/api\/posts\/?$/.test(url) && method === "post") {
      const post = createPost(data);
      return Promise.reject({ __mock: true, response: ok({ message: "Post created", post }, 201) });
    }

    // ---- POSTS: by id --------------------------------------------
    const m = url.match(/\/api\/posts\/(\d+)\b/);
    if (m) {
      const id = m[1];

      if (method === "get") {
        const post = getPost(id);
        return Promise.reject({
          __mock: true,
          response: post ? ok(post, 200) : err(404, { message: "Not found" }),
        });
      }

      if (method === "put") {
        const updated = updatePost(id, data || {});
        return Promise.reject({
          __mock: true,
          response: updated ? ok({ message: "Post updated", post: updated }, 200) : err(404, { message: "Not found" }),
        });
      }

      if (method === "delete") {
        const removed = deletePost(id);
        return Promise.reject({
          __mock: true,
          response: removed ? ok({ message: "Post deleted" }, 200) : err(404, { message: "Not found" }),
        });
      }

      // ---- COMMENTS: /api/posts/:id/comments ---------------------
      if (/\/comments\b/.test(url) && method === "post") {
        const c = addComment(id, (data && data.text) || "");
        return Promise.reject({
          __mock: true,
          response: c ? ok({ message: "Comment added", comment: c }, 201) : err(404, { message: "Not found" }),
        });
      }
    }

    // Let everything else go through (e.g., if you later deploy a real API)
    return config;
  });

  // Convert our special rejections into resolved responses
  api.interceptors.response.use(
    (r) => r,
    (e) => (e && e.__mock && e.response) ? Promise.resolve(e.response) : Promise.reject(e)
  );
}

export default api;
