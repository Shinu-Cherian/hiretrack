const API_HOST = window.location.hostname || "localhost";

export const API_BASE = `http://${API_HOST}:8000`;

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}
