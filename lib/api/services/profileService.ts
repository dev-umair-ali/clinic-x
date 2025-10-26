import api from '../axios';

export interface Profile {
  _id: string;
  user: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  role: 'admin' | 'doctor' | 'patient';
  avatar?: string;
  specialization?: string;
  licenseNumber?: string;
  medicalHistory?: string;
  insuranceInfo?: {
    provider?: string;
    policyNumber?: string;
    groupNumber?: string;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  role: 'admin' | 'doctor' | 'patient';
  avatar?: string;
  specialization?: string;
  licenseNumber?: string;
  medicalHistory?: string;
  insuranceInfo?: {
    provider?: string;
    policyNumber?: string;
    groupNumber?: string;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  avatar?: string;
  specialization?: string;
  licenseNumber?: string;
  medicalHistory?: string;
  insuranceInfo?: {
    provider?: string;
    policyNumber?: string;
    groupNumber?: string;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: Profile;
  message?: string;
}

export interface ProfilesListResponse {
  success: boolean;
  data: Profile[];
  message?: string;
}

export interface ProfilesWithLinksResponse {
  success: boolean;
  data: Array<Profile & {
    doctorLinks?: string[];
    patientLinks?: string[];
  }>;
  message?: string;
}

export const profileService = {
  async getMyProfile(): Promise<ProfileResponse> {
    try {
      const response = await api.get('/profile/me');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching my profile:', error);
      throw error;
    }
  },

  async updateMyProfile(profileData: UpdateProfileRequest): Promise<ProfileResponse> {
    try {
      const response = await api.put('/profile/me', profileData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating my profile:', error);
      throw error;
    }
  },

  async getDoctorProfile(doctorId: string): Promise<ProfileResponse> {
    try {
      const response = await api.get(`/profile/doctor/${doctorId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching doctor profile:', error);
      throw error;
    }
  },

  async getPatientProfile(patientId: string): Promise<ProfileResponse> {
    try {
      const response = await api.get(`/profile/patient/${patientId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching patient profile:', error);
      throw error;
    }
  },

  async getProfileById(profileId: string): Promise<ProfileResponse> {
    try {
      const response = await api.get(`/profile/${profileId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching profile by ID:', error);
      throw error;
    }
  },

  async updateProfileById(profileId: string, profileData: UpdateProfileRequest): Promise<ProfileResponse> {
    try {
      const response = await api.put(`/profile/${profileId}`, profileData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating profile by ID:', error);
      throw error;
    }
  },

  async getAllProfiles(): Promise<ProfilesListResponse> {
    try {
      const response = await api.get('/profile/');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all profiles:', error);
      throw error;
    }
  },

  async getProfilesByRole(role: string): Promise<ProfilesListResponse> {
    try {
      const response = await api.get(`/profile/role/${role}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching profiles by role:', error);
      throw error;
    }
  },

  async getProfilesWithDoctorLinks(): Promise<ProfilesWithLinksResponse> {
    try {
      const response = await api.get('/profile/with-doctor-links');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching profiles with doctor links:', error);
      throw error;
    }
  },

  async getProfilesWithPatientLinks(): Promise<ProfilesWithLinksResponse> {
    try {
      const response = await api.get('/profile/with-patient-links');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching profiles with patient links:', error);
      throw error;
    }
  },

  async deleteProfile(profileId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.delete(`/profile/${profileId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  }
};
