import api from '../axios';

export interface ConsentLegalFormData {
  id?: string;
  patientRef: string;
  doctorRef?: string;
  clinicRef?: string;
  digitalSignature: boolean;
  informationComplete: boolean;
  consentToTreatment: boolean;
  physicalExamination: boolean;
  privacyPoliciesAcknowledged: boolean;
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

export const consentLegalService = {
  async update(id: string, data: Partial<ConsentLegalFormData>): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/patient/onboarding/consent-legal`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating consent legal:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update consent legal',
        error: error.response?.data?.error || error.message,
      };
    }
  },
};

export function validateConsentLegal(_formData: ConsentLegalFormData): string | null {
  return null; // Portfolio: all onboarding fields optional
}
