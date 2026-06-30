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

/**
 * Check Google Calendar connection status for a doctor
 */
export const checkGoogleCalendarStatus = async (doctorId: string): Promise<boolean> => {
  try {
    const api = createAxiosInstance();
    const response = await api.get(`/doctor/connection/google/status/${doctorId}`);
    return response.data?.googleCalendarConnected ?? false;
  } catch (error) {
    console.error("Error checking Google Calendar status:", error);
    return false;
  }
};

/**
 * Connect Google Calendar - redirects to Google OAuth
 */
export const connectGoogleCalendar = (doctorId: string): void => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const redirectUrl = `${API_BASE_URL}/doctor/connection/connect-google-calendar?token=${token}&doctorId=${doctorId}`;
  window.location.href = redirectUrl;
};

/**
 * Disconnect Google Calendar
 */
export const disconnectGoogleCalendar = async (doctorId: string): Promise<void> => {
  try {
    const api = createAxiosInstance();
    await api.post(`/doctor/connection/google/disconnect/${doctorId}`);
  } catch (error) {
    console.error("Error disconnecting Google Calendar:", error);
    throw error;
  }
};

/**
 * Refresh Google Calendar connection status
 */
export const refreshGoogleCalendarStatus = async (doctorId: string) => {
  try {
    const api = createAxiosInstance();
    const response = await api.get(`/doctor/connection/google/status/${doctorId}`);
    return {
      connected: response.data?.googleCalendarConnected ?? false,
      email: response.data?.googleEmail ?? null,
    };
  } catch (error) {
    console.error("Error refreshing Google Calendar status:", error);
    throw error;
  }
};
