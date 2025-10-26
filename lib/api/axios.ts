import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('clinic-ai-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized responses
    if (error.response?.status === 401) {
      // Clear invalid token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('clinic-ai-token');
        localStorage.removeItem('clinic-ai-user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Function to set token manually (useful after login)
export const setAuthToken = (token: string | null) => {
  if (token) {
    // Set token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('clinic-ai-token', token);
    }
    // Set default authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Remove token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('clinic-ai-token');
    }
    // Remove default authorization header
    delete api.defaults.headers.common['Authorization'];
  }
};

// Function to clear auth token (useful for logout)
export const clearAuthToken = () => {
  setAuthToken(null);
};

export default api;
