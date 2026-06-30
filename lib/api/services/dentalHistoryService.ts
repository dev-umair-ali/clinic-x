import api from '../axios';

export interface DentalHistoryFormData {
  id?: string;
  patientRef: string;
  doctorRef?: string;
  clinicRef?: string;
  lastDentalVisit: string;
  dentalAnxietyLevel: string;
  currentSymptoms: string[];
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

export const dentalHistoryService = {
  async update(id: string, data: Partial<DentalHistoryFormData>): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/patient/onboarding/dental-history`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating dental history:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update dental history',
        error: error.response?.data?.error || error.message,
      };
    }
  },
};

export function validateDentalHistory(formData: DentalHistoryFormData): string | null {
  if (!formData.lastDentalVisit || formData.lastDentalVisit.trim() === '') {
    return 'Last Dental Visit is required';
  }
  if (!formData.dentalAnxietyLevel || formData.dentalAnxietyLevel.trim() === '') {
    return 'Dental Anxiety Level is required';
  }
  if (!formData.currentSymptoms || formData.currentSymptoms.length === 0) {
    return 'Current Symptoms are required';
  }
  return null;
}
