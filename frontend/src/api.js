import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({ baseURL: API_BASE, timeout: 20000 });

api.interceptors.request.use(config => {
  const token = localStorage.getItem("hrflow_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401 && !location.pathname.startsWith("/login")) {
      localStorage.removeItem("hrflow_token");
      localStorage.removeItem("hrflow_user");
      location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const unwrap = p => p.then(r => r.data);
export default api;
