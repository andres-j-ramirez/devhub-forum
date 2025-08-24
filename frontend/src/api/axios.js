// src/api/axios.js
import axios from "axios";

// If VUE_APP_API_BASE is set, ALWAYS use it (even on GitHub Pages).
// Otherwise: on GitHub Pages use same-origin (''), or fallback to local dev.
const envBase = (process.env.VUE_APP_API_BASE || "").trim();
const onPages = typeof window !== "undefined" && /\.github\.io$/.test(window.location.hostname);

const base = envBase
  ? envBase.replace(/\/+$/, "")                      // strip trailing slash
  : (onPages ? "" : "http://localhost:5001");        // demo on Pages, local in dev

const api = axios.create({
  baseURL: base,
  withCredentials: false,
});

// ---- Demo mocks ONLY if we’re on Pages AND no env base was provided ----
if (onPages && !envBase) {
  api.interceptors.request.use((config) => {
    const method = (config.method || "get").toLowerCase();
    const url = config.url || "";

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

    return config;
  });

  api.interceptors.response.use(
    (r) => r,
    (err) => (err && err.__mock && err.response)
      ? Promise.resolve(err.response)
      : Promise.reject(err)
  );
}

export default api;
