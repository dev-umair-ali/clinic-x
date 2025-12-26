import api from '../axios';

/* ---------  TYPES  --------- */

/**
 * Clinic Model - Represents a healthcare facility
 */
export interface Clinic {
  _id: string;
  name: string;
  clinicName?: string; // Alternative name field
  ownerUser: string; // Reference to User (clinic owner/admin)
  createdBy: string; // Reference to User who created the clinic
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  settings?: {
    timezone?: string;
    currency?: string;
    [key: string]: any;
  };
  logo?: string; // URL to logo file
  isActive?: boolean;
  status?: 'active' | 'inactive'; // Clinic operational status
  services?: string[]; // List of services offered
  revenue?: number; // Total revenue
  assignedDoctors?: any[]; // List of assigned doctors
  assignedPatients?: any[]; // List of assigned patients
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Request payload for creating a new clinic
 * Note: clinicName and createdBy are required fields (as per API documentation exception)
 */
export interface CreateClinicRequest {
  name: string;
  clinicName: string; // Required field (API documentation exception)
  createdBy: string; // Required field (API documentation exception)
  ownerUser: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone: string;
  email: string;
  settings?: {
    timezone?: string;
    currency?: string;
    [key: string]: any;
  };
}

/**
 * Request payload for updating a clinic
 */
export interface UpdateClinicRequest {
  name?: string;
  clinicName?: string;
  ownerUser?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  logo?: string; // Logo URL
  settings?: {
    timezone?: string;
    currency?: string;
    [key: string]: any;
  };
  isActive?: boolean;
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

/**
 * Clinic Dashboard Statistics
 */
export interface ClinicDashboard {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalRevenue: number;
  recentAppointments?: any[];
  recentBills?: any[];
  [key: string]: any;
}

export interface ClinicDashboardResponse {
  success: boolean;
  data: ClinicDashboard;
  message?: string;
}

/**
 * Appointments Trend Data
 */
export interface AppointmentsTrendData {
  date: string;
  count: number;
  [key: string]: any;
}

export interface AppointmentsTrendResponse {
  success: boolean;
  data: AppointmentsTrendData[];
  message?: string;
}

/**
 * Revenue Trend Data
 */
export interface RevenueTrendData {
  date: string;
  amount: number;
  [key: string]: any;
}

export interface RevenueTrendResponse {
  success: boolean;
  data: RevenueTrendData[];
  message?: string;
}

/**
 * Logo Upload Response
 */
export interface LogoUploadResponse {
  success: boolean;
  data: {
    url: string;
    [key: string]: any;
  };
  message?: string;
}

/**
 * Logo Get Response
 */
export interface LogoGetResponse {
  success: boolean;
  data: {
    url: string;
    [key: string]: any;
  };
  message?: string;
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
    const response = await api.get('/clinics');
    // API returns array directly or wrapped in data
    return Array.isArray(response.data) ? response.data : response.data.data || [];
  },

  /**
   * POST /clinics - Create a new clinic
   * IMPORTANT: clinicName and createdBy fields are required (API documentation exception)
   */
  async createClinic(data: CreateClinicRequest): Promise<Clinic> {
    const response = await api.post('/clinics', data);
    // API returns clinic directly in response.data
    return response.data;
  },

  /**
   * GET /clinics/{id} - Get clinic by ID
   */
  async getClinicById(id: string): Promise<Clinic> {
    const response = await api.get(`/clinics/${id}`);
    return response.data;
  },

  /**
   * PUT /clinics/{id} - Update clinic
   */
  async updateClinic(id: string, data: UpdateClinicRequest): Promise<Clinic> {
    const response = await api.put(`/clinics/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /clinics/{id} - Delete clinic
   */
  async deleteClinic(id: string): Promise<SuccessResponse> {
    const response = await api.delete(`/clinics/${id}`);
    return response.data;
  },

  /**
   * GET /admin/clinics/{clinicId}/dashboard - Get clinic dashboard statistics
   */
  async getClinicDashboard(clinicId: string): Promise<ClinicDashboardResponse> {
    const response = await api.get(`/admin/clinics/${clinicId}/dashboard`);
    return response.data;
  },

  /**
   * GET /admin/clinics/{clinicId}/dashboard/appointments-trend - Get appointments trend
   */
  async getAppointmentsTrend(clinicId: string, params?: {
    startDate?: string;
    endDate?: string;
    interval?: 'day' | 'week' | 'month';
  }): Promise<AppointmentsTrendResponse> {
    const response = await api.get(`/admin/clinics/${clinicId}/dashboard/appointments-trend`, {
      params
    });
    return response.data;
  },

  /**
   * GET /admin/clinics/{clinicId}/dashboard/revenue-trend - Get revenue trend
   */
  async getRevenueTrend(clinicId: string, params?: {
    startDate?: string;
    endDate?: string;
    interval?: 'day' | 'week' | 'month';
  }): Promise<RevenueTrendResponse> {
    const response = await api.get(`/admin/clinics/${clinicId}/dashboard/revenue-trend`, {
      params
    });
    return response.data;
  },

  /**
   * POST /clinics/{clinicId}/logo - Upload clinic logo
   * Note: Trying without /admin prefix as it might not be needed
   * @param clinicId - The clinic ID
   * @param file - The logo file to upload
   */
  async uploadClinicLogo(clinicId: string, file: File): Promise<LogoUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('Uploading logo to:', `/clinics/${clinicId}/logo`);
    console.log('File details:', { name: file.name, size: file.size, type: file.type });
    
    try {
      // Try without /admin first (simpler endpoint)
      const response = await api.post(`/clinics/${clinicId}/logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Logo upload response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Logo upload failed on /clinics endpoint:', error?.response?.data || error.message);
      
      // If that fails, try with /admin prefix
      console.log('Trying with /admin prefix...');
      const response = await api.post(`/admin/clinics/${clinicId}/logo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Logo upload response (admin endpoint):', response.data);
      return response.data;
    }
  },

  /**
   * GET /admin/clinics/{clinicId}/logo - Get clinic logo
   */
  async getClinicLogo(clinicId: string): Promise<LogoGetResponse> {
    const response = await api.get(`/admin/clinics/${clinicId}/logo`);
    return response.data;
  },

  /**
   * DELETE /admin/clinics/{clinicId}/logo - Delete clinic logo
   */
  async deleteClinicLogo(clinicId: string): Promise<SuccessResponse> {
    const response = await api.delete(`/admin/clinics/${clinicId}/logo`);
    return response.data;
  },
};
