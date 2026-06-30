import api from '../axios';

export interface MedicalProfileFormData {
  id?: string;
  patientRef: string;
  doctorRef?: string;
  clinicRef?: string;
  criticalAllergies: string[];
  primaryCareInformation: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const medicalProfileService = {
  async update(id: string, data: Partial<MedicalProfileFormData>): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/patient/onboarding/medical-profile`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating medical profile:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update medical profile',
        error: error.response?.data?.error || error.message,
      };
    }
  },
};

export function validateMedicalProfile(formData: MedicalProfileFormData): string | null {
  if (!formData.criticalAllergies || formData.criticalAllergies.length === 0) {
    return 'Critical Allergies are required';
  }
  if (!formData.primaryCareInformation) {
    return 'Primary Care Information is required';
  }
  return null;
}
