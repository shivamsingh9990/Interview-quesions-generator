import axios from "axios";

const rawBackendValue = import.meta.env.VITE_API_URL?.trim();
const cleanedBackendValue = rawBackendValue
  ? rawBackendValue.replace(/^nohttps?:\/\//i, "https://")
  : "";

const backendHost =
  cleanedBackendValue ||
  (import.meta.env.MODE === "production"
    ? "https://project-interview-questions.onrender.com"
    : "http://localhost:9000");

const axiosInstance = axios.create({
  baseURL: `${backendHost.replace(/\/$/, "")}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or wherever you store it
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;