// frontend/src/api/axios.js
import axios from "axios";

// Detect if we're running on GitHub Pages
const onPages =
  typeof window !== "undefined" && /\.github\.io$/.test(window.location.hostname);

// Keep requests same-origin on Pages; otherwise use env or localhost for dev
const baseURL = onPages ? "" : (process.env.VUE_APP_API_BASE || "http://localhost:5001");

// Create the client first
const instance = axios.create({
  baseURL,
  withCredentials: false,
});

// --- Lightweight mock only when on GitHub Pages ---
if (onPages) {
  // Intercept requests and synthesize responses for a few endpoints
  instance.interceptors.request.use((config) => {
    const method = (config.method || "get").toLowerCase();
    const url = config.url || "";

    // normalize data for POSTs
    let data = config.data;
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch { data = {}; }
    }
    data = data || {};

    // Mock: POST /api/auth/login
    if (/\/api\/auth\/login\b/.test(url) && method === "post") {
      const u = (data.email || "").toLowerCase();
      const p = data.password || "";
      const ok = (u === "test@example.com" && p === "devhub");
      return Promise.reject({
        __mock: true,
        response: ok
          ? { status: 200, data: { token: "demo", user: { email: u } } }
          : { status: 401, data: { error: "invalid" } },
      });
    }

    // Mock: GET /api/posts
    if (/\/api\/posts\b(?!\/)/.test(url) && method === "get") {
      return Promise.reject({
        __mock: true,
        response: {
          status: 200,
          data: {
            posts: [
              {
                id: 1,
                title: "Welcome to DevHub (Demo)",
                body: "This is a static demo running on GitHub Pages.",
                author: "Admin",
                createdAt: new Date().toISOString(),
              },
              {
                id: 2,
                title: "Tip: Dark Mode",
                body: "Use the switch in the navbar to toggle themes.",
                author: "Admin",
                createdAt: new Date().toISOString(),
              },
            ],
          },
        },
      });
    }

    // Mock: POST /api/posts/:id/comments (no-op OK)
    if (/\/api\/posts\/[^/]+\/comments\b/.test(url) && method === "post") {
      return Promise.reject({
        __mock: true,
        response: { status: 200, data: { ok: true } },
      });
    }

    // Otherwise pass through
    return config;
  });

  // Turn our mock rejections into resolved responses
  instance.interceptors.response.use(
    (r) => r,
    (err) => (err && err.__mock && err.response) ? Promise.resolve(err.response) : Promise.reject(err)
  );
}

export default instance;
