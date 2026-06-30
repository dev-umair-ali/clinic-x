import api from '../axios';

export interface VerifiedStatus {
  status: string;
}

export interface PresentConditionFormData {
  _id?: string;
  patientRef: string;
  clinicRef?: string | null;
  doctorRef?: string | null;
  createdBy: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  verifiedStatus?: VerifiedStatus;
  __v?: number;
  symptomStartDate?: string;
  mainConcern?: string;
  hadThisBefore?: string;
  painLevel?: number;
  painCharacteristics?: string[];
  whatImprovesIt?: string;
  whatWorsensIt?: string;
  activitiesAffected?: string;
  seenAnyoneElse?: string;
  treatmentsTried?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const presentConditionService = {
  async update(id: string, data: Partial<PresentConditionFormData>): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/patient/onboarding/present-condition`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating present condition:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update present condition',
        error: error.response?.data?.error || error.message,
      };
    }
  },
};

export function validatePresentCondition(formData: PresentConditionFormData): string | null {
    if (!formData.mainConcern || formData.mainConcern.trim() === '') {
        return 'Main concern is required.';
    }
    if (!formData.symptomStartDate || formData.symptomStartDate.trim() === '') {
        return 'Symptom start date is required.';
    }
    if (formData.painLevel !== undefined && (formData.painLevel < 0 || formData.painLevel > 10)) {
        return 'Pain level must be between 0 and 10.';
    }
  return null;
}
