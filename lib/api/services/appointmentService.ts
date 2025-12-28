import api from '../axios';

export interface Appointment {
  doctorName: any;
  _id: string;
  doctor: string;
  patient: string;
  dateTime: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  doctorId: string;
  patientId: string;
  dateTime: string;
  status?: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

export interface UpdateAppointmentRequest {
  doctor?: string;
  patient?: string;
  dateTime?: string;
  status?: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

export interface AppointmentResponse {
  success: boolean;
  data: Appointment;
  message?: string;
}

export interface AppointmentsListResponse {
  success: boolean;
  data: Appointment[];
  message?: string;
}

export interface DoctorAppointment {
  _id: string;
  doctor: string;
  patient: string | {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    bloodType?: string;
    address?: string;
    avatar?: string;
  };
  dateTime: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  patientName?: string;
  patientId?: string;
  type?: string;
  time?: string;
  date?: string;
}

export interface PatientDetails {
  _id: string;
  name: string;
  patientId?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  bloodType?: string;
  address?: string;
  avatar?: string;
  lastVisit?: string;
}

export interface DoctorAppointmentsListResponse {
  success: boolean;
  data: DoctorAppointment[];
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface WeeklyCountResponse {
  success: boolean;
  data: {
    count: number;
    week: string;
  };
  message?: string;
}

// Helper function to format error messages
const formatError = (error: any, defaultMessage: string): string => {
  if (!error) return defaultMessage;
  
  // Network error
  if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  // Timeout error
  if (error.code === 'ETIMEDOUT') {
    return 'Request timed out. Please try again.';
  }
  
  // Server error with response
  if (error.response) {
    const status = error.response.status;
    const message = error.response?.data?.message || error.response?.data?.error;
    
    switch (status) {
      case 400:
        return message || 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return message || 'Resource not found.';
      case 409:
        return message || 'Conflict. This appointment may already exist.';
      case 422:
        return message || 'Validation error. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return message || `Error ${status}: ${defaultMessage}`;
    }
  }
  
  // Generic error
  return error.message || defaultMessage;
};

// Helper function to validate response structure
const validateResponse = (response: any, expectedFields: string[]): boolean => {
  if (!response || typeof response !== 'object') {
    return false;
  }
  
  for (const field of expectedFields) {
    if (!(field in response)) {
      console.warn(`Response missing expected field: ${field}`);
    }
  }
  
  return true;
};

export const appointmentService = {
  async getAppointments(): Promise<AppointmentsListResponse> {
    try {
      const response = await api.get('/appointments');
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      validateResponse(response.data, ['success', 'data']);
      
      return response.data;
    } catch (error: any) {
      const errorMessage = formatError(error, 'Failed to fetch appointments');
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).originalError = error;
      (enhancedError as any).status = error.response?.status;
      throw enhancedError;
    }
  },

  async getAppointmentById(id: string): Promise<AppointmentResponse> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Invalid appointment ID provided');
    }
    
    try {
      const response = await api.get(`/appointments/${id}`);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      validateResponse(response.data, ['success', 'data']);
      
      return response.data;
    } catch (error: any) {
      const errorMessage = formatError(error, 'Failed to fetch appointment');
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).originalError = error;
      (enhancedError as any).status = error.response?.status;
      throw enhancedError;
    }
  },

  async createAppointment(appointmentData: CreateAppointmentRequest): Promise<AppointmentResponse> {
    // Validate required fields
    if (!appointmentData.doctorId || !appointmentData.patientId || !appointmentData.dateTime) {
      throw new Error('Missing required fields: doctorId, patientId, and dateTime are required');
    }
    
    // Validate dateTime format
    if (isNaN(new Date(appointmentData.dateTime).getTime())) {
      throw new Error('Invalid dateTime format. Please provide a valid date and time.');
    }
    
    try {
      const response = await api.post('/appointments', appointmentData);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      validateResponse(response.data, ['success', 'data']);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create appointment');
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = formatError(error, 'Failed to create appointment');
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).originalError = error;
      (enhancedError as any).status = error.response?.status;
      throw enhancedError;
    }
  },

  async updateAppointment(id: string, appointmentData: UpdateAppointmentRequest): Promise<AppointmentResponse> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Invalid appointment ID provided');
    }
    
    if (!appointmentData || Object.keys(appointmentData).length === 0) {
      throw new Error('No update data provided');
    }
    
    // Validate dateTime if provided
    if (appointmentData.dateTime && isNaN(new Date(appointmentData.dateTime).getTime())) {
      throw new Error('Invalid dateTime format. Please provide a valid date and time.');
    }
    
    try {
      const response = await api.put(`/appointments/${id}`, appointmentData);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      validateResponse(response.data, ['success', 'data']);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update appointment');
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = formatError(error, 'Failed to update appointment');
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).originalError = error;
      (enhancedError as any).status = error.response?.status;
      throw enhancedError;
    }
  },

  async cancelAppointment(id: string): Promise<AppointmentResponse> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Invalid appointment ID provided');
    }
    
    try {
      // Use the doctor-specific status update endpoint
      const response = await api.put(`/doctors/appointments/updatestatus/${id}`, {
        status: 'cancelled'
      });
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      validateResponse(response.data, ['success']);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to cancel appointment');
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = formatError(error, 'Failed to cancel appointment');
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).originalError = error;
      (enhancedError as any).status = error.response?.status;
      throw enhancedError;
    }
  },

  async rescheduleAppointment(id: string, dateTime: string, notes?: string): Promise<AppointmentResponse> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Invalid appointment ID provided');
    }
    
    if (!dateTime || isNaN(new Date(dateTime).getTime())) {
      throw new Error('Invalid dateTime format');
    }
    
    try {
      // Parse dateTime into date and time for the backend
      const dt = new Date(dateTime);
      const date = dt.toISOString().split('T')[0]; // YYYY-MM-DD
      const time = dt.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
      
      const response = await api.put(`/doctors/appointments/updatestatus/${id}`, {
        date,
        time,
        status: 'rescheduled' // Backend expects 'rescheduled' status for date/time updates
      });
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      validateResponse(response.data, ['success']);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to reschedule appointment');
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = formatError(error, 'Failed to reschedule appointment');
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).originalError = error;
      (enhancedError as any).status = error.response?.status;
      throw enhancedError;
    }
  },

  async deleteAppointment(id: string): Promise<{ success: boolean; message?: string }> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Invalid appointment ID provided');
    }
    
    try {
      const response = await api.delete(`/appointments/${id}`);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = formatError(error, 'Failed to delete appointment');
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).originalError = error;
      (enhancedError as any).status = error.response?.status;
      throw enhancedError;
    }
  },

  // Doctor-specific appointment methods
  async getDoctorAppointmentsCalendar(startDate?: string, endDate?: string): Promise<DoctorAppointmentsListResponse> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const url = `/doctors/appointments/calendar${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      validateResponse(response.data, ['success', 'data']);
      
      return response.data;
    } catch (error: any) {
      const errorMessage = formatError(error, 'Failed to fetch calendar appointments');
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).originalError = error;
      (enhancedError as any).status = error.response?.status;
      throw enhancedError;
    }
  },

  async getDoctorAppointments(params?: {
    patientName?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<DoctorAppointmentsListResponse> {
    // Validate pagination parameters
    if (params?.page !== undefined && (params.page < 1 || !Number.isInteger(params.page))) {
      throw new Error('Invalid page number. Page must be a positive integer.');
    }
    
    if (params?.limit !== undefined && (params.limit < 1 || !Number.isInteger(params.limit))) {
      throw new Error('Invalid limit. Limit must be a positive integer.');
    }
    
    // Validate status if provided
    if (params?.status && !['scheduled', 'completed', 'cancelled'].includes(params.status)) {
      throw new Error('Invalid status. Status must be one of: scheduled, completed, cancelled');
    }
    
    try {
      const queryParams = new URLSearchParams();
      if (params?.patientName) queryParams.append('patientName', params.patientName.trim());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      const url = `/doctors/appointments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      validateResponse(response.data, ['success', 'data']);
      
      return response.data;
    } catch (error: any) {
      const errorMessage = formatError(error, 'Failed to fetch appointments');
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).originalError = error;
      (enhancedError as any).status = error.response?.status;
      throw enhancedError;
    }
  },

  async getDoctorAppointmentById(id: string): Promise<{ success: boolean; data: DoctorAppointment; message?: string }> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Invalid appointment ID provided');
    }
    
    try {
      const response = await api.get(`/doctors/appointments/${id}`);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      validateResponse(response.data, ['success', 'data']);
      
      return response.data;
    } catch (error: any) {
      const errorMessage = formatError(error, 'Failed to fetch appointment');
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).originalError = error;
      (enhancedError as any).status = error.response?.status;
      throw enhancedError;
    }
  },

  async getDoctorAppointmentDetails(id: string): Promise<{ success: boolean; data: DoctorAppointment & { patient: PatientDetails }; message?: string }> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Invalid appointment ID provided');
    }
    
    try {
      const response = await api.get(`/doctors/appointments/${id}/details`);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      validateResponse(response.data, ['success', 'data']);
      
      if (!response.data.data?.patient) {
        throw new Error('Patient details not found in response');
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = formatError(error, 'Failed to fetch appointment details');
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).originalError = error;
      (enhancedError as any).status = error.response?.status;
      throw enhancedError;
    }
  },

  async getDoctorAppointmentsByStatus(status: string): Promise<DoctorAppointmentsListResponse> {
    if (!status || typeof status !== 'string' || status.trim() === '') {
      throw new Error('Status is required');
    }
    
    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
      throw new Error('Invalid status. Status must be one of: scheduled, completed, cancelled');
    }
    
    try {
      const response = await api.get(`/doctors/appointments/status/${status}`);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      validateResponse(response.data, ['success', 'data']);
      
      return response.data;
    } catch (error: any) {
      const errorMessage = formatError(error, `Failed to fetch ${status} appointments`);
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).originalError = error;
      (enhancedError as any).status = error.response?.status;
      throw enhancedError;
    }
  },

  async updateDoctorAppointmentStatus(id: string, status: string): Promise<AppointmentResponse> {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new Error('Invalid appointment ID provided');
    }
    
    if (!status || typeof status !== 'string' || status.trim() === '') {
      throw new Error('Status is required');
    }
    
    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
      throw new Error('Invalid status. Status must be one of: scheduled, completed, cancelled');
    }
    
    try {
      const response = await api.put(`/doctors/appointments/${id}/status`, { status });
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      validateResponse(response.data, ['success', 'data']);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update appointment status');
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = formatError(error, 'Failed to update appointment status');
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).originalError = error;
      (enhancedError as any).status = error.response?.status;
      throw enhancedError;
    }
  },

  async getDoctorWeeklyCount(): Promise<WeeklyCountResponse> {
    try {
      const response = await api.get('/doctors/weekly-count');
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      validateResponse(response.data, ['success', 'data']);
      
      return response.data;
    } catch (error: any) {
      const errorMessage = formatError(error, 'Failed to fetch weekly count');
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).originalError = error;
      (enhancedError as any).status = error.response?.status;
      throw enhancedError;
    }
  },

  async getDoctorAppointmentListView(doctorId: string): Promise<DoctorAppointmentsListResponse> {
    if (!doctorId || typeof doctorId !== 'string' || doctorId.trim() === '') {
      throw new Error('Invalid doctor ID provided');
    }
    
    try {
      const response = await api.get(`/doctors/${doctorId}/appointmentListView`);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      validateResponse(response.data, ['success', 'data']);
      
      return response.data;
    } catch (error: any) {
      const errorMessage = formatError(error, 'Failed to fetch appointment list view');
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).originalError = error;
      (enhancedError as any).status = error.response?.status;
      throw enhancedError;
    }
  }
};