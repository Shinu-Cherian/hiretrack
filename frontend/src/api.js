const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const envBase = import.meta.env.VITE_API_URL;
export const API_BASE = envBase || (isDev ? "http://localhost:8000" : "");

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}
