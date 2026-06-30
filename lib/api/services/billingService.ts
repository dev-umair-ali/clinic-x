import api from '../axios';

export interface Bill {
  _id: string;
  doctorId: string;
  patientId: string;
  clinicId: string;
  appointmentId?: string;
  serviceCode: string;
  totalAmount: number;
  copayAmount: number;
  remainingAmount: number;
  status: "pending" | "copay_paid" | "fully_paid";
  insuranceStatus: "not_submitted" | "submitted" | "processing" | "accepted" | "denied" | "paid";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBillRequest {
  doctorId: string;
  patientId: string;
  clinicId: string;
  appointmentId?: string;
  serviceCode: string; // CPT codes
  totalAmount: number;
  copayAmount: number;
  remainingAmount: number;
  status?: "pending" | "copay_paid" | "fully_paid";
  insuranceStatus?: "not_submitted" | "submitted" | "processing" | "accepted" | "denied" | "paid";
  notes?: string;
}

export interface UpdateBillRequest {
  doctorId?: string;
  patientId?: string;
  clinicId?: string;
  appointmentId?: string;
  serviceCode?: string;
  totalAmount?: number;
  copayAmount?: number;
  remainingAmount?: number;
  status?: "pending" | "copay_paid" | "fully_paid";
  insuranceStatus?: "not_submitted" | "submitted" | "processing" | "accepted" | "denied" | "paid";
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

export interface CPTCode {
  code: string;
}

export interface ExtractCPTCodesRequest {
  soap_note: string;
  use_fallback: boolean;
}

export interface ExtractCPTCodesResponse {
  cpt_codes: CPTCode[];
  modifier: string;
  model_used: string;
}

// Helper function to calculate billing amount from CPT codes
// You can customize this with actual pricing or fetch from a database
function calculateAmountFromCPTCodes(cptCodes: CPTCode[]): number {
  // Default pricing for common CPT codes (customize as needed)
  const cptPricing: Record<string, number> = {
    '99213': 120.00, // Office visit - established patient
    '99214': 180.00, // Office visit - detailed
    '99215': 250.00, // Office visit - comprehensive
    '81002': 15.00,  // Urinalysis
    '87086': 25.00,  // Culture, bacterial
    '99000': 15.00,  // Handling specimen
    // Add more CPT codes with pricing as needed
  };

  let total = 0;
  for (const cpt of cptCodes) {
    const price = cptPricing[cpt.code] || 50.00; // Default price if not found
    total += price;
  }

  return total;
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
      const response = await api.post('/bills/create', billData);
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
  },

  async extractCPTCodes(requestData: ExtractCPTCodesRequest): Promise<ExtractCPTCodesResponse> {
    try {

      // Create the JSON string
      const requestBody = JSON.stringify(requestData);

      const response = await fetch('https://billing-api.clinicx.io/extract-cpt-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization if needed
          // Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('clinic-ai-token') : ''}`,
        },
        body: requestBody,
      });


      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Billing API error response:', errorText);
        throw new Error(`Billing API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: ExtractCPTCodesResponse = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error extracting CPT codes:', error);
      throw error;
    }
  },

  async createBillingFromCPTCodes(
    patientId: string,
    doctorId: string,
    cptCodes: CPTCode[],
    modifier: string,
    amount: number,
    appointmentId?: string
  ): Promise<BillResponse> {
    try {
      const cptCodesString = cptCodes.map(c => c.code).join(', ');
      
      // Get user data to extract clinicId
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const user = userStr ? JSON.parse(userStr) : null;
      const clinicId = user?.clinicId || user?.clinic;
      
      if (!clinicId) {
        console.warn('⚠️ No clinicId found in user data');
      }
      
      // Backend expects: doctorId, patientId, clinicId, appointmentId, serviceCode, totalAmount, copayAmount, remainingAmount
      const billData: CreateBillRequest = {
        doctorId: doctorId,
        patientId: patientId,
        clinicId: clinicId || doctorId, // fallback to doctorId if no clinicId
        appointmentId: appointmentId || undefined,
        serviceCode: cptCodesString, // CPT codes as comma-separated string
        totalAmount: amount,
        copayAmount: 0, // Default to 0, can be updated later
        remainingAmount: amount, // Full amount is remaining initially
        status: 'pending' as const,
        insuranceStatus: 'not_submitted' as const,
        notes: `CPT Codes: ${cptCodesString}${modifier ? `\nModifier: ${modifier}` : ''}${appointmentId ? `\nAppointment: ${appointmentId}` : ''}`,
      };

      return await this.createBill(billData);
    } catch (error: any) {
      console.error('❌ Error creating billing from CPT codes:', error);
      throw error;
    }
  }
};
