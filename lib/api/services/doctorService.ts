import api from '../axios';

export interface CreateDoctorRequest {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  age: number;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  address: string;
  specialization: string;
  experience: number;
  licenseNumber: string;
  bio: string;
  educationSummary: string;
  status: "active" | "inactive";
  role: "doctor";
  hipaaConsent: boolean;
}

export interface UpdateDoctorRequest {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  age?: number;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  specialization?: string;
  experience?: number;
  licenseNumber?: string;
  bio?: string;
  educationSummary?: string;
  status?: "active" | "inactive";
}

export interface DoctorResponse {
  success: boolean;
  data: {
    user: {
      profilePicture: any;
      firstName: string;
      lastName: string;
      id: string;
      name: string;
      email: string;
      phone: string;
      age: number;
      dateOfBirth?: string;
      gender: "male" | "female" | "other";
      address: string | {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
      };
      specialization: string;
      experience: number;
      licenseNumber: string;
      bio?: string | object;
      educationSummary?: string | object;
      status?: "active" | "inactive";
      role: "doctor";
      avatar?: string;
      // Additional fields for comprehensive doctor data
      languages?: string[];
      timeZone?: string;
      availableDays?: Array<{
        day: string;
        from: string;
        to: string;
      }>;
      assignedClinic?: string;
      hipaaConsent?: boolean;
    };
    token?: string;
  };
  message?: string;
}

export interface DoctorsListResponse {
  success: boolean;
  data: Array<{
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    age: number;
    gender: "male" | "female" | "other";
    address: string;
    specialization: string;
    experience: number;
    licenseNumber: string;
    role: "doctor";
    avatar?: string;
  }>;
  message?: string;
}

export const doctorService = {
  async getCurrentDoctor(): Promise<DoctorResponse> {
    try {
      const response = await api.get('/doctors/me');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async getDoctors(): Promise<DoctorsListResponse> {
    try {
      
      const response = await api.get('/admin/doctors');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async getDoctor(id: string): Promise<DoctorResponse> {
    try {
      const response = await api.get(`/admin/doctors/${id}`);    
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async createDoctor(doctorData: CreateDoctorRequest): Promise<DoctorResponse> {
    const response = await api.post<DoctorResponse>('/auth/signup', doctorData);
    return response.data;
  },

  async createDoctorInCollection(doctorData: Omit<CreateDoctorRequest, 'password'>): Promise<DoctorResponse> {
    const response = await api.post<DoctorResponse>('/admin/create-doctor', doctorData);
    return response.data;
  },

  async updateDoctor(id: string, doctorData: UpdateDoctorRequest): Promise<DoctorResponse> {
    const response = await api.put(`/admin/update-doctor/${id}`, doctorData);
    return response.data;
  },

  async updateDoctorStatus(id: string, status: "active" | "inactive"): Promise<{ success: boolean; message?: string; data?: any }> {
    const response = await api.put(`/admin/doctors/status/${id}`, { status });
    return response.data;
  },

  async deleteDoctor(id: string): Promise<{ success: boolean; message?: string }> {
    const response = await api.delete(`/doctors/${id}`);
    return response.data;
  }
};
