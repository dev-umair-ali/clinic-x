import api from '../axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
  status?: number;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role: 'doctor' | 'patient';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'patient';
  profilePicture?: string;
  firstName?: string;  // Add if your API returns these
  lastName?: string;   // Add if your API returns these
}

export const authService = {
  async login(credentials: LoginRequest): Promise<any> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response;
  },

  async signup(userData: SignupRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/signup', userData);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Fixed: Now accepts an object to match your frontend usage
  async forgotPassword({ email }: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword({ token, newPassword }: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  }
};