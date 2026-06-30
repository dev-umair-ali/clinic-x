import api from '../axios';

export interface DocumentUploadsFormData {
  id?: string;
  patientRef: string;
  doctorRef?: string;
  clinicRef?: string;
  idFront: string;
  idBack: string;
  xrayOrScans: string;
  medicalReport: string;
  otherDocs: string;
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

export const documentUploadsService = {
  async update(id: string, data: Partial<DocumentUploadsFormData>): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/patient/onboarding/document-form`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating document uploads:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update document uploads',
        error: error.response?.data?.error || error.message,
      };
    }
  },
};

export function validateDocumentUploads(formData: DocumentUploadsFormData): string | null {
  if (!formData.idFront) {
    return 'ID front image must be uploaded';
  }
  if (!formData.idBack) {
    return 'ID back image must be uploaded';
  }
  if (!formData.xrayOrScans) {
    return 'X-ray or scans document must be uploaded';
  }
  if (!formData.medicalReport) {
    return 'Medical report document must be uploaded';
  }
  return null;
}
