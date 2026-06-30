import api from '../axios';

export interface LifestyleHabitsFormData {
  id?: string;
  patientRef: string;
  doctorRef?: string;
  clinicRef?: string;
  tobaccoUse: string;
  exerciseRegularly: string;
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

export const lifestyleHabitsService = {
  async update(id: string, data: Partial<LifestyleHabitsFormData>): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/patient/onboarding/lifestyle-habits`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating lifestyle habits:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update lifestyle habits',
        error: error.response?.data?.error || error.message,
      };
    }
  },
};

export function validateLifestyleHabits(formData: LifestyleHabitsFormData): string | null {
  if (!formData.tobaccoUse) {
    return 'Tobacco Use is required';
  }
  if (!formData.exerciseRegularly) {
    return 'Exercise Regularly is required';
  }
  return null;
}
