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

  // Seed initial demo data if none exists
  const ensureSeed = () => {
    let posts = readLS();
    if (!posts || !Array.isArray(posts)) {
      posts = [
        {
          id: Date.now() - 172800000, // now-2d
          title: "Welcome to DevHub (Demo)",
          excerpt: "This is a static demo running on GitHub Pages.",
          body: "This is a static demo running on GitHub Pages.",
          image: "https://picsum.photos/seed/devhub1/1200/450",
          createdAt: new Date().toISOString(),
          category: "Tech News",
          likes: 0,
          liked: false,
          comments: [],
        },
        {
          id: Date.now() - 259200000, // now-3d
          title: "Tip: Dark Mode",
          excerpt: "Use the switch in the navbar to toggle themes.",
          body: "Use the switch in the navbar to toggle themes.",
          image: "https://picsum.photos/seed/devhub2/1200/450",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          category: "Cloud",
          likes: 0,
          liked: false,
          comments: [],
        },
      ];
      writeLS(posts);
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
