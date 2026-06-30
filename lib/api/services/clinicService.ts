import api from '../axios';

/* ---------  TYPES  --------- */

/**
 * Clinic Model - Represents a healthcare facility
 */
export interface Clinic {
  _id: string;
  clinicName: string;
  clinicSpecaility?: string[];

  ownerName?: string;
  ownerPhone?: string;
  ownerAge?: number;
  ownerGender?: 'male' | 'female' | 'other';
  ownerEmail?: string;

  email?: string;
  clinicPhone?: string;
  clinicFax?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };

  bio?: string;
  description?: string;
  logo?: string; // ObjectId reference to logo

  isEmailVerified?: boolean;
  emailVerificationToken?: string | null;
  emailVerificationExpires?: string | null;
  status?: 'active' | 'inactive' | 'pending_verification' | 'suspended';

  timezone?: string;
  totalPatients?: number;
  totalDoctors?: number;
  totalAssistants?: number;
  totalRevenue?: number;

  userRef?: string; // ObjectId reference to user
  createdBy?: string; // ObjectId reference to user
  updatedBy?: string; // ObjectId reference to user

  createdAt?: string;
  updatedAt?: string;
}

/**
 * Request payload for creating a new clinic
 * Note: clinicName and createdBy are required fields (as per API documentation exception)
 */
export interface CreateClinicRequest {
  clinicName: string; // Required field
  createdBy: string; // Required field (User ID who created the clinic)
  clinicSpecaility?: string[];
  
  ownerName?: string;
  ownerPhone?: string;
  ownerAge?: number;
  ownerGender?: 'male' | 'female' | 'other';
  ownerEmail?: string;

  timezone?: string;
  
  email?: string;
  clinicPhone?: string;
  clinicFax?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  
  bio?: string;
  description?: string;
  
  userRef?: string; // Reference to user document for clinic login
}

/**
 * Request payload for updating a clinic
 */
export interface UpdateClinicRequest {
  clinicName?: string;
  clinicSpecaility?: string[];
  
  ownerName?: string;
  ownerPhone?: string;
  ownerAge?: number;
  ownerGender?: 'male' | 'female' | 'other';
  ownerEmail?: string;

  email?: string;
  clinicPhone?: string;
  clinicFax?: string;
  
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  
  bio?: string;
  description?: string;
  logo?: string; // Logo URL
  
  timezone?: string;
  status?: 'active' | 'inactive' | 'pending_verification' | 'suspended';
}

/**
 * Response from single clinic operations
 */
export interface ClinicResponse {
  success: boolean;
  data: Clinic;
  message?: string;
}

/**
 * Response from list clinics operation
 */
export interface ClinicsListResponse {
  success: boolean;
  data: Clinic[];
  message?: string;
}

/** Status Change Payload
 */
export interface StatusChange {
  status: 'active' | 'inactive' | 'pending_verification' | 'suspended';
}

/**
 * Generic success response
 */
export interface SuccessResponse {
  success: boolean;
  message?: string;
}

/* ---------  SERVICE  --------- */

/**
 * Clinic Service - Handles all clinic-related API operations
 */
export const clinicService = {
  /**
   * GET /clinics - List all clinics
   */
  async getClinics(): Promise<Clinic[]> {
    const response = await api.get('/admin/clinic/all/clinics');
    // API returns array directly or wrapped in data
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.clinics)) {
      return response.data.clinics;
    } else {
      return [];
    }
  },

  /**
   * POST /clinics - Create a new clinic
   * IMPORTANT: clinicName and createdBy fields are required (API documentation exception)
   */
  async createClinic(data: CreateClinicRequest): Promise<Clinic> {
    const response = await api.post('/admin/clinic/create-clinic', data);

    // API returns clinic directly in response.data
    return response.data.clinic;
  },

  /**
   * GET /clinics/{id} - Get clinic by ID
   */
  async getClinicById(id: string): Promise<Clinic> {
    const response = await api.get(`/admin/clinic/${id}`);
    return response.data.clinic;
  },

  /**
   * PUT /clinics/{id} - Update clinic
   */
  async updateClinic(id: string, data: UpdateClinicRequest): Promise<Clinic> {
    const response = await api.put(`/admin/clinic/update-clinic/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /clinics/{id} - Delete clinic
   */
  async clinicStatusChange(id: string, data: StatusChange): Promise<SuccessResponse> {
    const response = await api.put(`/admin/clinic/update-clinic/status/${id}`, data);
    return response.data;
  },
};
