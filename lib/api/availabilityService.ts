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

export interface TimeSlot {
  day: string;
  from: string;
  to: string;
}

export interface AvailabilityData {
  timeZone: string;
  availableDays: TimeSlot[];
  _id?: string;
}

export interface AvailabilityResponse {
  success: boolean;
  data: AvailabilityData;
}

const portfolioResponse = async (method: string, path: string, body?: unknown): Promise<AvailabilityResponse> => {
  await new Promise((r) => setTimeout(r, 100));
  const raw = resolveStaticMock(method, path, body) as { data?: AvailabilityData; success?: boolean };
  if (raw?.data) return { success: true, data: raw.data };
  return { success: true, data: raw as AvailabilityData };
};

export const getAvailability = async (doctorId: string): Promise<AvailabilityResponse> => {
  if (IS_PORTFOLIO_MODE) {
    return portfolioResponse("GET", `/doctor/availability/${doctorId}`);
  }
  try {
    const token = getAuthToken();
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const response = await api.get(`/doctor/availability/${doctorId}`);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || "Failed to get availability");
  }
};

export const updateAvailability = async (
  availabilityId: string,
  data: AvailabilityData
): Promise<AvailabilityResponse> => {
  if (IS_PORTFOLIO_MODE) {
    return portfolioResponse("PUT", `/doctor/availability/update-availability/${availabilityId}`, data);
  }
  try {
    const token = getAuthToken();
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const response = await api.put(`/doctor/availability/update-availability/${availabilityId}`, data);
    return response.data;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || "Failed to update availability");
  }
};

export const syncAvailabilityWithGoogle = async (_doctorId: string): Promise<void> => {
  if (IS_PORTFOLIO_MODE) return;
  const token = getAuthToken();
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  await api.post(`/doctor/connection/google/sync-availability/${_doctorId}`);
};
