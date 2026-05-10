const rawBackendValue = import.meta.env.VITE_API_BASE_URL?.trim();
const cleanedBackendValue = rawBackendValue
  ? rawBackendValue.replace(/^nohttps?:\/\//i, "https://")
  : "";

const backendHost = cleanedBackendValue ||
  (import.meta.env.MODE === "production"
    ? "https://backend-woad-kappa-13.vercel.app"
    : "http://localhost:9000");

export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
  },
  SESSION: {
    CREATE: "/sessions/create",
    GET_ALL: "/sessions/my-sessions",
    GET_ONE: "/sessions", // usage: GET_ONE/:id
  },
  AI: {
    GENERATE_QUESTIONS: "/ai/generate-questions",
    EXPLAIN: "/ai/generate-explanation",
  },
};
