const TOKEN_KEY = "devhub_demo_token_v1";

export function isDemoHost() {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname || "";
  return h.endsWith(".github.io") || h === "localhost";
}

export function getToken() {
  try { return JSON.parse(localStorage.getItem(TOKEN_KEY) || "null"); } catch { return null; }
}

export function isLoggedIn() {
  const t = getToken();
  if (!t) return false;
  if (!t.expiresAt) return true;
  return Date.now() < new Date(t.expiresAt).getTime();
}

export function loginDemo(email, password) {
  if (!isDemoHost()) return null;
  if ((email || "").toLowerCase() === "test@example.com" && password === "devhub") {
    const token = {
      value: "demo",
      email,
      username: "andresramirez",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString()
    };
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    return token;
  }
  return null;
}

export function logoutDemo() {
  localStorage.removeItem(TOKEN_KEY);
}

export function currentUser() {
  const t = getToken();
  if (!t) return null;
  return { email: t.email, username: t.username };
}
