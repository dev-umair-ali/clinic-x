import api from '../axios';

export interface HealthHistoryFormData {
  id?: string;
  patientRef: string;
  doctorRef?: string;
  clinicRef?: string;
  healthConditions: string[];
  currentMedication: string;
  surgicalHistory: string;
  allergies: string;
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

export const healthHistoryService = {
  async update(id: string, data: Partial<HealthHistoryFormData>): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/patient/onboarding/health-history`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating health history:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update health history',
        error: error.response?.data?.error || error.message,
      };
    }
  },
};

export function validateHealthHistory(formData: HealthHistoryFormData): string | null {
  if (!formData.healthConditions || formData.healthConditions.length === 0) {
    return 'Health Condition is required';
  }
  if (!formData.currentMedication || formData.currentMedication.trim() === '') {
    return 'Current Medication is required';
  }
  if (!formData.surgicalHistory || formData.surgicalHistory.trim() === '') {
    return 'Surgical History is required';
  }
  if (!formData.allergies || formData.allergies.trim() === '') {
    return 'Allergies are required';
  }
  return null;
}
