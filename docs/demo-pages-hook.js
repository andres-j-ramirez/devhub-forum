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

  function handleAttempt(root) {
    const form = root.closest("form") || document;
    const emailInput = document.querySelector('input[type="email"], input[name="email"]');
    const passInput  = document.querySelector('input[type="password"], input[name="password"]');
    if (!emailInput || !passInput) return false;

    const email = (emailInput.value || "").trim().toLowerCase();
    const pass  = passInput.value || "";

    if (email === "test@example.com" && pass === "devhub") {
      try { localStorage.setItem("token", "demo"); } catch (_) {}
      const base = (document.querySelector("base")?.href || "/devhub-forum/");
      location.href = base + "#/feed";
      return true;
    }
    showError(form, "Login failed. Use test@example.com / devhub");
    return true; // we handled it (wrong creds)
  }

  // Intercept ANY form submit on the page
  document.addEventListener("submit", function (e) {
    try {
      // Heuristic: if the form has email + password fields, treat as login
      if (e.target.querySelector('input[type="email"], input[name="email"]') &&
          e.target.querySelector('input[type="password"], input[name="password"]')) {
        e.preventDefault();
        handleAttempt(e.target);
      }
    } catch (_) {}
  }, true);

  // Also catch clicks on a "Log In" button that isn't type=submit
  document.addEventListener("click", function (e) {
    const btn = e.target.closest('button, input[type="submit"]');
    if (!btn) return;
    const text = (btn.textContent || btn.value || "").toLowerCase();
    if (/log\s*in/.test(text)) {
      e.preventDefault();
      handleAttempt(btn);
    }
  }, true);
})();
