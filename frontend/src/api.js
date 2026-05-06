const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const envBase = import.meta.env.VITE_API_URL;
export const API_BASE = envBase || (isDev ? "http://localhost:8000" : "");

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}

export function syncAuthStorage(user) {
  if (!user?.authenticated) {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("profile_pic");
    return;
  }

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("username", user.username || "User");
  if (user.profile_pic) {
    localStorage.setItem("profile_pic", user.profile_pic);
  } else {
    localStorage.removeItem("profile_pic");
  }
}

export async function getAuthStatus() {
  const res = await fetch(apiUrl("/api/auth/status/"), {
    credentials: "include",
  });

  if (!res.ok) {
    syncAuthStorage(null);
    return { authenticated: false };
  }

  const data = await res.json();
  syncAuthStorage(data);
  return data;
}

export async function logoutSession() {
  try {
    await fetch(apiUrl("/api/auth/logout/"), {
      method: "POST",
      credentials: "include",
    });
  } finally {
    syncAuthStorage(null);
  }
}
