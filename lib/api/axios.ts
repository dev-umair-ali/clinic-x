import axios, { type AxiosAdapter, type InternalAxiosRequestConfig } from "axios";
import { IS_PORTFOLIO_MODE } from "@/lib/config/portfolio";
import { resolveStaticMock } from "@/lib/api/staticMockRouter";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "https://api.clinicx.io",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const staticAdapter: AxiosAdapter = async (config) => {
  await new Promise((r) => setTimeout(r, 120));
  const url = config.url || "";
  const base = config.baseURL || "";
  const fullPath = url.startsWith("http") ? url : `${base}${url}`;
  const data = resolveStaticMock(config.method || "GET", fullPath, config.data);

  return {
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: config as InternalAxiosRequestConfig,
  };
};

if (IS_PORTFOLIO_MODE) {
  api.defaults.adapter = staticAdapter;
}

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("clinic-ai-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("clinic-ai-token");
      localStorage.removeItem("clinic-ai-user");
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("clinic-ai-token", token);
    }
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    if (typeof window !== "undefined") {
      localStorage.removeItem("clinic-ai-token");
    }
    delete api.defaults.headers.common["Authorization"];
  }
};

export const clearAuthToken = () => {
  setAuthToken(null);
};

export default api;
