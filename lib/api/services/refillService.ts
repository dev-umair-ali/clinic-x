import api from '../axios';

export interface RefillRequest {
  _id: string;
  prescription: string;
  patient: string;
  doctor: string;
  status: "pending" | "approved" | "denied";
  notes?: string;
  requestedAt: string;
  processedAt?: string;
}

export interface CreateRefillRequest {
  prescription: string;
  patient: string;
  doctor: string;
  notes?: string;
}

export interface UpdateRefillStatusRequest {
  status: "pending" | "approved" | "denied";
  notes?: string;
}

export interface RefillResponse {
  success: boolean;
  data: RefillRequest;
  message?: string;
}

export interface RefillsListResponse {
  success: boolean;
  data: RefillRequest[];
  message?: string;
}

export const refillService = {
  async getRefills(): Promise<RefillsListResponse> {
    try {
      const response = await api.get('/refills');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching refills:', error);
      throw error;
    }
  },

  async createRefill(refillData: CreateRefillRequest): Promise<RefillResponse> {
    try {
      const response = await api.post('/refills', refillData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating refill request:', error);
      throw error;
    }
  },

  async updateRefillStatus(id: string, statusData: UpdateRefillStatusRequest): Promise<RefillResponse> {
    try {
      const response = await api.post(`/refills/${id}/status`, statusData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating refill status:', error);
      throw error;
    }
  }
};
