/**
 * Billing API Client
 * Connects to the new billing backend
 */

import { IS_PORTFOLIO_MODE } from "@/lib/config/portfolio";
import { resolveStaticFetch } from "@/lib/api/staticMockRouter";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper to get auth token
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  // Check for the correct token key used by the app
  return localStorage.getItem('clinic-ai-token') || sessionStorage.getItem('clinic-ai-token') || localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Helper for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  if (IS_PORTFOLIO_MODE) {
    await new Promise((r) => setTimeout(r, 120));
    const { json } = resolveStaticFetch(options.method || "GET", endpoint, options.body);
    const body = json as { data?: T; success?: boolean; error?: string };
    return {
      success: body.success !== false,
      data: (body.data ?? json) as T,
    };
  }

  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'An error occurred',
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ==================== TYPES ====================

export interface ChargeItem {
  cptCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  modifiers?: string[];
  diagnosisCodes?: string[];
  placeOfService?: string;
  dateOfService: Date | string;
}

export interface InsuranceInfo {
  providerName: string;
  policyNumber: string;
  groupNumber?: string;
  subscriberName?: string;
  subscriberDOB?: string;
  relationshipToPatient?: string;
  coverageLevel?: 'primary' | 'secondary' | 'tertiary';
  insurancePaid?: number;
  patientResponsibility?: number;
  claimStatus?: string;
  claimId?: string;
}

export interface CreateChargeInput {
  patientId: string;
  doctorId?: string;
  clinicId?: string;
  appointmentId?: string;
  serviceDate: string;
  visitType: string;
  placeOfService?: string;
  items: ChargeItem[];
  insuranceInfo?: InsuranceInfo;
  notes?: string;
}

export interface Charge {
  _id: string;
  chargeId: string;
  invoiceNumber: string;
  patientId: any;
  doctorId: any;
  clinicId?: any;
  appointmentId?: string;
  items: ChargeItem[];
  totalCharge: number;
  amountDue: number;
  amountPaid: number;
  balance: number;
  discountAmount?: number;
  discountReason?: string;
  taxAmount?: number;
  insuranceInfo?: InsuranceInfo;
  status: 'draft' | 'pending' | 'submitted_to_insurance' | 'paid' | 'overdue' | 'cancelled';
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid' | 'overdue';
  issueDate: Date;
  dueDate: Date;
  serviceDate: Date;
  visitType: string;
  placeOfService?: string;
  notes?: string;
  isOverdue: boolean;
  overdueDate?: Date;
  payments: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorStats {
  totalRevenue: number;
  totalPaid: number;
  totalPending: number;
  chargeCount: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
  overdueAmount: number;
  averageChargeAmount: number;
  topProcedures: Array<{
    code: string;
    description: string;
    count: number;
    revenue: number;
  }>;
}

export interface InsuranceClaim {
  _id: string;
  claimId: string;
  claimNumber?: string;
  chargeId: string;
  patientId: any;
  doctorId: any;
  clinicId?: any;
  insuranceProvider: {
    name: string;
    payerId?: string;
    phone?: string;
    address?: any;
  };
  totalCharges: number;
  allowedAmount: number;
  paidAmount: number;
  deductible: number;
  coinsurance: number;
  copay: number;
  patientResponsibility: number;
  procedureCodes: Array<{
    cptCode: string;
    description: string;
    quantity: number;
    chargedAmount: number;
    allowedAmount: number;
    paidAmount: number;
    adjustmentAmount: number;
  }>;
  diagnosisCodes: string[];
  serviceDate: Date;
  submissionDate?: Date;
  submittedDate?: Date;
  processedDate?: Date;
  status: 'draft' | 'submitted' | 'in_review' | 'approved' | 'denied' | 'appealed' | 'paid';
  claimType: 'primary' | 'secondary' | 'tertiary' | 'professional' | 'institutional' | 'dental' | 'vision';
  submissionMethod?: 'electronic' | 'paper' | 'manual';
  placeOfService?: string;
  notes?: string;
  denialInfo?: {
    denialDate: Date;
    reasonCode: string;
    denialReason?: string;
    reasonDescription: string;
    appealDeadline?: Date;
    isAppealable: boolean;
    category: string;
  };
  appealInfo?: {
    appealDate: Date;
    appealReason: string;
    supportingDocuments: string[];
    appealStatus: 'pending' | 'approved' | 'denied';
    submittedBy: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// ==================== DOCTOR BILLING API ====================

export const doctorBillingAPI = {
  /**
   * Create a new charge
   */
  async createCharge(input: CreateChargeInput) {
    return apiRequest<Charge>('/billing/doctor/charges', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  /**
   * List doctor's charges
   */
  async listCharges(params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    patientId?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    return apiRequest<{
      charges: Charge[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/billing/doctor/charges?${queryParams.toString()}`);
  },

  /**
   * Get charge by ID
   */
  async getCharge(chargeId: string) {
    return apiRequest<Charge>(`/billing/doctor/charges/${chargeId}`);
  },

  /**
   * Update charge
   */
  async updateCharge(chargeId: string, updates: Partial<CreateChargeInput>) {
    return apiRequest<Charge>(`/billing/doctor/charges/${chargeId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete/cancel charge
   */
  async deleteCharge(chargeId: string) {
    return apiRequest(`/billing/doctor/charges/${chargeId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get doctor statistics
   */
  async getStats(params?: { dateFrom?: string; dateTo?: string }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }

    return apiRequest<DoctorStats>(
      `/billing/doctor/stats?${queryParams.toString()}`
    );
  },

  /**
   * Submit charge to insurance
   */
  async submitToInsurance(chargeId: string) {
    return apiRequest<Charge>(
      `/billing/doctor/charges/${chargeId}/submit-insurance`,
      { method: 'POST' }
    );
  },

  /**
   * Apply discount
   */
  async applyDiscount(
    chargeId: string,
    discountAmount: number,
    reason: string
  ) {
    return apiRequest<Charge>(`/billing/doctor/charges/${chargeId}/discount`, {
      method: 'POST',
      body: JSON.stringify({ discountAmount, reason }),
    });
  },

  /**
   * Send payment reminder
   */
  async sendReminder(chargeId: string, method: 'email' | 'sms' | 'portal') {
    return apiRequest(`/billing/doctor/charges/${chargeId}/reminder`, {
      method: 'POST',
      body: JSON.stringify({ method }),
    });
  },

  /**
   * List payments for a charge
   */
  async listChargePayments(chargeId: string) {
    return apiRequest<any[]>(`/billing/doctor/charges/${chargeId}/payments`);
  },
};

// ==================== INSURANCE CLAIMS API ====================

export const claimsAPI = {
  /**
   * Create insurance claim from charge
   */
  async createClaim(input: {
    chargeId: string;
    insuranceProvider?: any;
    procedureCodes?: any[];
    diagnosisCodes?: string[];
    notes?: string;
  }) {
    return apiRequest<InsuranceClaim>('/billing/claims', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  /**
   * List claims
   */
  async listClaims(params?: {
    page?: number;
    limit?: number;
    status?: string;
    claimType?: string;
    patientId?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    return apiRequest<{
      claims: InsuranceClaim[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/billing/claims?${queryParams.toString()}`);
  },

  /**
   * Get claim by ID
   */
  async getClaim(claimId: string) {
    return apiRequest<InsuranceClaim>(`/billing/claims/${claimId}`);
  },

  /**
   * Update claim
   */
  async updateClaim(claimId: string, updates: any) {
    return apiRequest<InsuranceClaim>(`/billing/claims/${claimId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Submit claim to insurance
   */
  async submitClaim(
    claimId: string,
    data: { submissionMethod?: string; notes?: string }
  ) {
    return apiRequest<InsuranceClaim>(`/billing/claims/${claimId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Process insurance response (ERA/EOB)
   */
  async processResponse(
    claimId: string,
    data: {
      status: string;
      allowedAmount?: number;
      paidAmount?: number;
      deductible?: number;
      coinsurance?: number;
      copay?: number;
      patientResponsibility?: number;
      adjustments?: any[];
      denialInfo?: any;
      notes?: string;
    }
  ) {
    return apiRequest<InsuranceClaim>(
      `/billing/claims/${claimId}/process-response`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  /**
   * Submit appeal
   */
  async submitAppeal(
    claimId: string,
    data: {
      reason: string;
      supportingDocuments?: string[];
      notes?: string;
    }
  ) {
    return apiRequest<InsuranceClaim>(`/billing/claims/${claimId}/appeal`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get claim statistics
   */
  async getStats(params?: {
    dateFrom?: string;
    dateTo?: string;
    doctorId?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }

    return apiRequest<{
      totalClaims: number;
      statusBreakdown: Record<string, number>;
      financialSummary: {
        totalCharges: number;
        totalPaid: number;
        totalPatientResponsibility: number;
      };
      approvalRate: string;
    }>(`/billing/claims/stats?${queryParams.toString()}`);
  },

  /**
   * Delete draft claim
   */
  async deleteClaim(claimId: string) {
    return apiRequest(`/billing/claims/${claimId}`, {
      method: 'DELETE',
    });
  },
};

// ==================== CPT & ICD-10 CODES API ====================

export const medicalCodesAPI = {
  /**
   * Search CPT codes
   */
  async searchCPTCodes(query: string, limit = 20) {
    return apiRequest<any[]>(`/billing/codes/cpt/search?q=${query}&limit=${limit}`);
  },

  /**
   * Search ICD-10 codes
   */
  async searchICD10Codes(query: string, limit = 20) {
    return apiRequest<any[]>(`/billing/codes/icd10/search?q=${query}&limit=${limit}`);
  },

  /**
   * Get popular CPT codes
   */
  async getPopularCPTCodes() {
    return apiRequest<any[]>('/billing/codes/cpt/popular');
  },

  /**
   * Get popular ICD-10 codes
   */
  async getPopularICD10Codes() {
    return apiRequest<any[]>('/billing/codes/icd10/popular');
  },
};

// ==================== EXPORT ====================

export default {
  doctor: doctorBillingAPI,
  claims: claimsAPI,
  codes: medicalCodesAPI,
};
