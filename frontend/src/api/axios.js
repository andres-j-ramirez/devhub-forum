// src/api/axios.js
import axios from "axios";

// On GitHub Pages, keep requests on the same origin.
// Anywhere else, use env or fallback to local dev API.
const base =
  (typeof window !== "undefined" && /\.github\.io$/.test(window.location.hostname))
    ? ""                           // same-origin on Pages
    : (process.env.VUE_APP_API_BASE || "http://localhost:5001");

const api = axios.create({
  baseURL: base,
  withCredentials: false,
});

// --- Demo mock just for GitHub Pages ---
const onPages =
  typeof window !== "undefined" && /\.github\.io$/.test(window.location.hostname);

if (onPages) {
  // Intercept requests and, for certain endpoints, *return a fake response*
  api.interceptors.request.use((config) => {
    const method = (config.method || "get").toLowerCase();
    const url = config.url || "";

    // normalize data object
    let data = config.data;
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch { data = {}; }
    }
    data = data || {};

    // Mock: POST /api/auth/login
    if (/\/api\/auth\/login\b/.test(url) && method === "post") {
      const u = (data.email || "").toLowerCase();
      const p = (data.password || "");
      const ok = (u === "test@example.com" && p === "devhub");

      // We *reject* with a marker, then turn that into a resolved response below.
      return Promise.reject({
        __mock: true,
        response: ok
          ? { status: 200, data: { token: "demo", user: { email: u } } }
          : { status: 401, data: { error: "invalid" } },
      });
    }

    // Mock: GET /api/posts
    if (/\/api\/posts\b/.test(url) && method === "get") {
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

    // Otherwise, let it through (e.g., when you run with a real backend)
    return config;
  });

  // Convert our special rejections into *successful* mock responses
  api.interceptors.response.use(
    (r) => r,
    (err) => (err && err.__mock && err.response)
      ? Promise.resolve(err.response)
      : Promise.reject(err)
  );
}

export default api;
