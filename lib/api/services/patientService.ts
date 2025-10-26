import api from '../axios';

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  age: number;
  dateOfBirth: string;
  gender: "male" | "female";
  bloodType: string;
  assignedDoctor: string;
  insuranceInfo: string;
  medicalHistory: string;
  address: string;
  status: "active" | "inactive";
  role: "patient";
  hipaaConsent: boolean;
}

export interface UpdatePatientRequest {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
  age?: number;
  dateOfBirth?: string;
  gender?: "male" | "female";
  bloodType?: string;
  assignedDoctor?: string;
  insuranceInfo?: string;
  medicalHistory?: string;
  address?: string;
  status?: "active" | "inactive";
}

export interface PatientResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      fullName: string;
      email: string;
      phone: string;
      age: number;
      dateOfBirth: string;
      gender: "male" | "female";
      bloodType: string;
      assignedDoctor: string;
      insuranceInfo: string;
      medicalHistory: string;
      address: string;
      status: "active" | "inactive";
      role: "patient";
      avatar?: string;
    };
    token?: string;
  };
  message?: string;
}

export interface PatientsListResponse {
  success: boolean;
  data: Array<{
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
    age: number;
    dateOfBirth: string;
    gender: "male" | "female";
    bloodType: string;
    assignedDoctor: string;
    insuranceInfo: string;
    medicalHistory: string;
    address: string;
    status: "active" | "inactive";
    role: "patient";
    avatar?: string;
    lastVisit: string;
  }>;
  message?: string;
}

export const patientService = {
  async getPatients(): Promise<PatientsListResponse> {
    try {

      const response = await api.get('/admin/patients');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async getPatient(id: string): Promise<PatientResponse> {
    const response = await api.get(`/admin/patients/${id}`);
    return response.data;
  },

  async createPatient(patientData: CreatePatientRequest): Promise<PatientResponse> {
    const response = await api.post<PatientResponse>('/admin/create-patient', patientData);
    return response.data;
  },

  async createPatientInCollection(patientData: Omit<CreatePatientRequest, 'password'>): Promise<PatientResponse> {
    const response = await api.post<PatientResponse>('/admin/create-patient', patientData);
    return response.data;
  },

  async updatePatient(id: string, patientData: UpdatePatientRequest): Promise<PatientResponse> {
    const response = await api.put(`/admin/update-patient/${id}`, patientData);
    return response.data;
  },

  async deletePatient(id: string): Promise<{ success: boolean; message?: string }> {
    const response = await api.delete(`/admin/patients/${id}`);
    return response.data;
  }
};
