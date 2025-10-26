import api from '../axios';

export interface Appointment {
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
  doctor: string;
  patient: string;
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

export const appointmentService = {
  async getAppointments(): Promise<AppointmentsListResponse> {
    try {
      const response = await api.get('/appointments');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async getAppointmentById(id: string): Promise<AppointmentResponse> {
    try {
      const response = await api.get(`/appointments/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async createAppointment(appointmentData: CreateAppointmentRequest): Promise<AppointmentResponse> {
    try {
      const response = await api.post('/appointments', appointmentData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async updateAppointment(id: string, appointmentData: UpdateAppointmentRequest): Promise<AppointmentResponse> {
    try {
      const response = await api.put(`/appointments/${id}`, appointmentData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async deleteAppointment(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.delete(`/appointments/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
};