(function () {
  if (!location.hostname.endsWith("github.io")) return;

  function ok(json) { return new Response(JSON.stringify(json), { status: 200, headers: { "Content-Type": "application/json" } }); }
  function err(code, msg) { return new Response(JSON.stringify({ error: msg || "invalid" }), { status: code, headers: { "Content-Type": "application/json" } }); }

  function handle(url, method, body) {
    method = (method || "GET").toUpperCase();
    try {
      const u = new URL(url, location.href); url = u.pathname.toLowerCase();
    } catch (_) { url = String(url || "").toLowerCase(); }

    if ((url.includes("/auth/login") || url.endsWith("/login")) && method === "POST") {
      const email = (body?.email || body?.username || "").toString().toLowerCase();
      const pass = (body?.password || body?.pass || "").toString();
      if (email === "test@example.com" && pass === "devhub") {
        try { localStorage.setItem("token", "demo"); } catch (_) {}
        return ok({ token: "demo" });
      }
      return err(401, "invalid");
    }

    if ((url.includes("/feed") || url.includes("/posts")) && method === "GET") {
      const posts = [
        { id: 1, title: "Welcome to DevHub (Demo)", body: "Static demo on GitHub Pages.", author: "Admin", createdAt: new Date().toISOString() },
        { id: 2, title: "Try Dark Mode", body: "Use the toggle in the navbar.", author: "Admin", createdAt: new Date().toISOString() }
      ];
      return ok({ posts });
    }
    return null;
  }

  const realFetch = window.fetch.bind(window);
  window.fetch = async function (input, init) {
    const url = typeof input === "string" ? input : input.url;
    let body = {};
    try {
      if (init && init.body) body = init.body instanceof FormData ? Object.fromEntries(init.body) : JSON.parse(init.body);
    } catch (_) {}
    const resp = handle(url, init?.method, body);
    if (resp) return resp;
    return realFetch(input, init);
  };

  const RealXHR = window.XMLHttpRequest;
  function MockXHR() {
    const x = new RealXHR(); let _method = "GET", _url = "";
    const open = x.open.bind(x), send = x.send.bind(x);
    x.open = function (m, u) { _method = m; _url = u; return open(m, u); };
    x.send = function (d) {
      let body = {};
      try {
        if (typeof d === "string") body = JSON.parse(d);
        else if (d instanceof FormData) body = Object.fromEntries(d);
      } catch (_) {}
      const resp = handle(_url, _method, body);
      if (resp) {
        resp.text().then(t => {
          Object.defineProperty(x, "status", { value: 200 });
          Object.defineProperty(x, "responseText", { value: t });
          Object.defineProperty(x, "response", { value: t });
          if (x.onreadystatechange) x.onreadystatechange();
          if (x.onload) x.onload();
        });
        return;
      }
      return send(d);
    };
    return x;
  }
  window.XMLHttpRequest = MockXHR;

  if (window.axios && window.axios.interceptors) {
    window.axios.interceptors.request.use(cfg => {
      const resp = handle(cfg.url, cfg.method, cfg.data ? (typeof cfg.data === "string" ? JSON.parse(cfg.data) : cfg.data) : undefined);
      if (resp) {
        return Promise.reject({ __demoHandled: true, resp });
      }
      return cfg;
    });
  }
  const _then = Promise.prototype.then;
  Promise.prototype.then = function (onFulfilled, onRejected) {
    return _then.call(this, onFulfilled, function (e) {
      if (e && e.__demoHandled && e.resp) {
        return e.resp.json ? e.resp.json().then(j => onFulfilled && onFulfilled({ data: j })) : onFulfilled && onFulfilled({ data: e.resp });
      }
      return onRejected && onRejected(e);
    });
  };
})();
