(function () {
  if (!location.hostname.endsWith("github.io")) return;

  function showError(form, msg) {
    let el = form.querySelector(".demo-login-error");
    if (!el) {
      el = document.createElement("div");
      el.className = "demo-login-error";
      el.style.cssText = "margin-top:8px;color:#e11d48;font-size:12px";
      form.appendChild(el);
    }
    el.textContent = msg;
  }

  // Intercept ANY form submit; if it looks like the login form, handle it
  document.addEventListener("submit", function (e) {
    try {
      const form = e.target;
      const emailInput = form.querySelector('input[type="email"], input[name="email"]');
      const passInput  = form.querySelector('input[type="password"], input[name="password"]');
      const submitText = (form.querySelector('button[type="submit"], button, input[type="submit"]')?.textContent || "").trim().toLowerCase();

      // Heuristic: has email+password inputs AND a "log in" button
      if (emailInput && passInput && /log\s*in/.test(submitText)) {
        e.preventDefault();

        const email = (emailInput.value || "").trim().toLowerCase();
        const pass  = passInput.value || "";

        if (email === "test@example.com" && pass === "devhub") {
          try { localStorage.setItem("token", "demo"); } catch (_) {}
          const base = (document.querySelector("base")?.href || "/devhub-forum/");
          location.href = base + "#/feed";
        } else {
          showError(form, "Login failed. Use test@example.com / devhub");
        }
      }
    } catch (_) {}
  }, true);
})();
