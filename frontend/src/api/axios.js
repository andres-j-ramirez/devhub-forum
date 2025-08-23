// --- Demo mock just for GitHub Pages ---
const onPages =
  typeof window !== "undefined" && /\.github\.io$/.test(window.location.hostname);

if (onPages) {
  // in-memory demo data (keeps pages working with no backend)
  const demoPosts = [
    {
      id: 1,
      title: "Welcome to DevHub (Demo)",
      body: "This is a static demo running on GitHub Pages.",
      author: "Admin",
      image: "https://picsum.photos/seed/devhub1/800/400",
      createdAt: new Date().toISOString(),
      category: "Tech News",
      likes: 15,
      comments: [],
    },
    {
      id: 2,
      title: "Tip: Dark Mode",
      body: "Use the switch in the navbar to toggle themes.",
      author: "Admin",
      image: "https://picsum.photos/seed/devhub2/800/400",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      category: "Cloud",
      likes: 8,
      comments: [],
    },
  ];

  function findPost(id) {
    const nid = Number(id);
    return demoPosts.find(p => p.id === nid);
  }

  api.interceptors.request.use((config) => {
    const method = (config.method || "get").toLowerCase();
    const url = config.url || "";

    // normalize data object
    let data = config.data;
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch { data = {}; }
    }
    data = data || {};

    // --- Auth: POST /api/auth/login ---
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

    // --- Feed: GET /api/posts ---
    if (/\/api\/posts\b$/.test(url) && method === "get") {
      return Promise.reject({
        __mock: true,
        response: { status: 200, data: { posts: demoPosts } },
      });
    }

    // --- Single post: GET /api/posts/:id ---
    const postIdMatch = url.match(/\/api\/posts\/(\d+)\b/);
    if (postIdMatch && method === "get") {
      const post = findPost(postIdMatch[1]);
      return Promise.reject({
        __mock: true,
        response: post
          ? { status: 200, data: post }
          : { status: 404, data: { error: "not_found" } },
      });
    }

    // --- Add comment: POST /api/posts/:id/comments ---
    const cmMatch = url.match(/\/api\/posts\/(\d+)\/comments\b/);
    if (cmMatch && method === "post") {
      const post = findPost(cmMatch[1]);
      if (!post) {
        return Promise.reject({
          __mock: true,
          response: { status: 404, data: { error: "not_found" } },
        });
      }
      const text = (data && data.text || "").trim();
      if (!text) {
        return Promise.reject({
          __mock: true,
          response: { status: 400, data: { error: "empty_comment" } },
        });
      }
      const newItem = { id: Date.now(), author: "You", text };
      post.comments.push(newItem);
      return Promise.reject({
        __mock: true,
        response: { status: 201, data: newItem },
      });
    }

    // Otherwise, let it through to a real backend (local/prod)
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
