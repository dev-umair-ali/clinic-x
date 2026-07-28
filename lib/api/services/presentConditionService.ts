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

export function validatePresentCondition(_formData: PresentConditionFormData): string | null {
  return null; // Portfolio: all onboarding fields optional
}
