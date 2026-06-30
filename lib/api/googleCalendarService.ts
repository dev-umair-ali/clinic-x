import axios from "axios";
import { IS_PORTFOLIO_MODE } from "@/lib/config/portfolio";
import { resolveStaticMock } from "@/lib/api/staticMockRouter";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000";

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("clinic-ai-token");
  }
  return null;
};

const portfolioGet = async (path: string) => {
  await new Promise((r) => setTimeout(r, 100));
  return resolveStaticMock("GET", path);
};

export const checkGoogleCalendarStatus = async (_doctorId: string): Promise<boolean> => {
  if (IS_PORTFOLIO_MODE) {
    const data = await portfolioGet("/doctor/connection/google/status/demo") as { googleCalendarConnected?: boolean };
    return data?.googleCalendarConnected ?? false;
  }
  try {
    const token = getAuthToken();
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const response = await api.get(`/doctor/connection/google/status/${_doctorId}`);
    return response.data?.googleCalendarConnected ?? false;
  } catch {
    return false;
  }
};

export const connectGoogleCalendar = (doctorId: string): void => {
  if (IS_PORTFOLIO_MODE) return;
  const token = getAuthToken();
  if (!token) throw new Error("Authentication token not found");
  window.location.href = `${API_BASE_URL}/doctor/connection/connect-google-calendar?token=${token}&doctorId=${doctorId}`;
};

export const disconnectGoogleCalendar = async (doctorId: string): Promise<void> => {
  if (IS_PORTFOLIO_MODE) return;
  const token = getAuthToken();
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  await api.post(`/doctor/connection/google/disconnect/${doctorId}`);
};

export const refreshGoogleCalendarStatus = async (doctorId: string) => {
  if (IS_PORTFOLIO_MODE) {
    return { connected: false, email: null };
  }
  try {
    const token = getAuthToken();
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const response = await api.get(`/doctor/connection/google/status/${doctorId}`);
    return {
      connected: response.data?.googleCalendarConnected ?? false,
      email: response.data?.googleEmail ?? null,
    };
  } catch {
    return { connected: false, email: null };
  }
};
