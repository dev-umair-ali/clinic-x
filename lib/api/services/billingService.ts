import api from '../axios';

export interface Bill {
  _id: string;
  patient: string;
  doctor: string;
  amount: number;
  status: "unpaid" | "paid" | "pending" | "cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBillRequest {
  patient: string;
  doctor: string;
  amount: number;
  status?: "unpaid" | "paid" | "pending" | "cancelled";
  notes?: string;
}

export interface UpdateBillRequest {
  patient?: string;
  doctor?: string;
  amount?: number;
  status?: "unpaid" | "paid" | "pending" | "cancelled";
  notes?: string;
}

export interface BillResponse {
  success: boolean;
  data: Bill;
  message?: string;
}

export interface BillsListResponse {
  success: boolean;
  data: Bill[];
  message?: string;
}

export const billingService = {
  async getBills(): Promise<BillsListResponse> {
    try {
      const response = await api.get('/bills');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching bills:', error);
      throw error;
    }
  },

  async getBillById(id: string): Promise<BillResponse> {
    try {
      const response = await api.get(`/bills/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching bill by ID:', error);
      throw error;
    }
  },

  async createBill(billData: CreateBillRequest): Promise<BillResponse> {
    try {
      const response = await api.post('/bills', billData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating bill:', error);
      throw error;
    }
  },

  async updateBill(id: string, billData: UpdateBillRequest): Promise<BillResponse> {
    try {
      const response = await api.put(`/bills/${id}`, billData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating bill:', error);
      throw error;
    }
  },

  async deleteBill(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.delete(`/bills/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting bill:', error);
      throw error;
    }
  }
};
