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

export function validateConsentLegal(formData: ConsentLegalFormData): string | null {
  if (!formData.digitalSignature) {
    return 'Consent must be given';
  }
  if (!formData.informationComplete) {
    return 'Information completeness must be confirmed';
  }
  if (!formData.consentToTreatment) {
    return 'Consent to treatment is required';
  }
  if (!formData.physicalExamination) {
    return 'Acknowledgment of physical examination is required';
  }
  if (!formData.privacyPoliciesAcknowledged) {
    return "Acknowledgment of privacy policies is required";
  }
  return null;
}
