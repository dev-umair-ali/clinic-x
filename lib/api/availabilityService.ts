import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000";

// Get token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("clinic-ai-token");
  }
  return null;
};

// Create axios instance with auth headers
const createAxiosInstance = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
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

/**
 * Get doctor availability
 */
export const getAvailability = async (doctorId: string): Promise<AvailabilityResponse> => {
  try {
    const api = createAxiosInstance();
    const response = await api.get(`/doctor/availability/${doctorId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error getting availability:", error);
    throw new Error(error.response?.data?.message || "Failed to get availability");
  }
};

/**
 * Update doctor availability
 */
export const updateAvailability = async (availabilityId: string, data: AvailabilityData): Promise<AvailabilityResponse> => {
  try {
    const api = createAxiosInstance();
    const response = await api.put(`/doctor/availability/update-availability/${availabilityId}`, data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating availability:", error);
    throw new Error(error.response?.data?.message || "Failed to update availability");
  }
};

/**
 * Sync availability with Google Calendar
 */
export const syncAvailabilityWithGoogle = async (doctorId: string): Promise<void> => {
  try {
    const api = createAxiosInstance();
    await api.post(`/doctor/connection/google/sync-availability/${doctorId}`);
  } catch (error: any) {
    console.error("Error syncing availability with Google:", error);
    throw new Error(error.response?.data?.message || "Failed to sync availability");
  }
};
