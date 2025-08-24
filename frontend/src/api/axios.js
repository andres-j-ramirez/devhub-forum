// src/api/axios.js
import axios from "axios";

// Base URL: use explicit prod base if provided; else '' on Pages; else localhost.
const explicitBase = process.env.VUE_APP_API_BASE || "";
const base =
  explicitBase
    ? explicitBase.replace(/\/+$/, "") // trim trailing slash
    : (typeof window !== "undefined" && /\.github\.io$/.test(window.location.hostname))
      ? ""     // same-origin on Pages when no explicit base
      : "http://localhost:5001";

const api = axios.create({
  baseURL: base,  // e.g. https://devhub-alb-522...elb.amazonaws.com
  withCredentials: false,
});

// ---- Demo mocks only if we're on Pages AND no explicit base was given ----
const onPages = typeof window !== "undefined" && /\.github\.io$/.test(window.location.hostname);
const useMocks = onPages && !explicitBase;

if (useMocks) {
  api.interceptors.request.use((config) => {
    const method = (config.method || "get").toLowerCase();
    const url = config.url || "";

    let data = config.data;
    if (typeof data === "string") { try { data = JSON.parse(data); } catch { data = {}; } }
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
              { id: 1, title: "Welcome to DevHub (Demo)", body: "This is a static demo running on GitHub Pages.", author: "Admin", createdAt: new Date().toISOString() },
              { id: 2, title: "Tip: Dark Mode", body: "Use the switch in the navbar to toggle themes.", author: "Admin", createdAt: new Date().toISOString() },
            ],
          },
        },
      });
    }

    return config;
  });

  api.interceptors.response.use(
    (r) => r,
    (err) => (err && err.__mock && err.response) ? Promise.resolve(err.response) : Promise.reject(err)
  );
}

export default api;
