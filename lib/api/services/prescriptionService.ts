import api from '../axios';

export interface Prescription {
  _id: string;
  patient: string;
  doctor: string;
  medication: string;
  dosage: string;
  instructions: string;
  status: "sent" | "in-progress" | "ready" | "delivered";
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrescriptionRequest {
  patient: string;
  doctor: string;
  medication: string;
  dosage: string;
  instructions: string;
}

export interface UpdatePrescriptionRequest {
  patient?: string;
  doctor?: string;
  medication?: string;
  dosage?: string;
  instructions?: string;
  status?: "sent" | "in-progress" | "ready" | "delivered";
}

export interface PrescriptionResponse {
  success: boolean;
  data: Prescription;
  message?: string;
}

export interface PrescriptionsListResponse {
  success: boolean;
  data: Prescription[];
  message?: string;
}

export const prescriptionService = {
  async getPrescriptions(): Promise<PrescriptionsListResponse> {
    try {
      const response = await api.get('/prescriptions');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching prescriptions:', error);
      throw error;
    }
  },

  async getPrescriptionById(id: string): Promise<PrescriptionResponse> {
    try {
      const response = await api.get(`/prescriptions/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching prescription by ID:', error);
      throw error;
    }
  },

  async createPrescription(prescriptionData: CreatePrescriptionRequest): Promise<PrescriptionResponse> {
    try {
      const response = await api.post('/prescriptions', prescriptionData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating prescription:', error);
      throw error;
    }
  },

  async updatePrescription(id: string, prescriptionData: UpdatePrescriptionRequest): Promise<PrescriptionResponse> {
    try {
      const response = await api.put(`/prescriptions/${id}`, prescriptionData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating prescription:', error);
      throw error;
    }
  },

  async deletePrescription(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.delete(`/prescriptions/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting prescription:', error);
      throw error;
    }
  }
};
