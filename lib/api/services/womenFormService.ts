import api from '../axios';

export interface WomenFormData {
  id?: string;
  patientRef: string;
  doctorRef?: string;
  clinicRef?: string;
  pregnancyStatus: string;
  menstrualCycleInfo: string;
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

export const womenFormService = {
  async update(id: string, data: Partial<WomenFormData>): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/patient/onboarding/women-form`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating women form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update women form',
        error: error.response?.data?.error || error.message,
      };
    }
  },
};

export function validateWomenForm(formData: WomenFormData): string | null {
  if (!formData.pregnancyStatus || formData.pregnancyStatus.trim() === '') {
    return 'Pregnancy Status is required';
  }
  if (!formData.menstrualCycleInfo || formData.menstrualCycleInfo.trim() === '') {
    return 'Last Menstrual Period is required';
  }
  return null;
}
