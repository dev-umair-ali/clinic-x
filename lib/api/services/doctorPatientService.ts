import api from '../axios'

// Types for Doctor Patient operations
export interface DoctorPatient {
  id?: string
  _id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  age: number
  dateOfBirth: string
  gender: "male" | "female"
  bloodType: string
  insuranceInfo: string
  medicalHistory: string
  address: string
  status: "active" | "inactive"
  role: "patient"
  lastVisit: string
  avatar?: string
  prescriptions?: string[],
  profilePicture?: string,
  clinicRef?: string,
  doctorRef?: string,
  createdAt?: string
  updatedAt?: string
}

export interface CreateDoctorPatientRequest {
  firstName: string
  lastName: string
  fullName: string
  email: string
  password: string
  phone: string
  age: number
  dateOfBirth: string
  gender: "male" | "female"
  bloodType: string
  assignedDoctor: string
  insuranceInfo: string
  medicalHistory: string
  address: string
  status: "active" | "inactive"
  role: "patient"
  hipaaConsent: boolean
}

export interface UpdateDoctorPatientRequest {
  firstName?: string
  lastName?: string
  fullName?: string
  email?: string
  password?: string
  phone?: string
  age?: number
  dateOfBirth?: string
  gender?: "male" | "female"
  bloodType?: string
  assignedDoctor?: string
  insuranceInfo?: string
  medicalHistory?: string
  address?: string
  status?: "active" | "inactive"
}

export interface DoctorPatientResponse {
  success: boolean
  data: {
    user: DoctorPatient
    token?: string
  }
  message?: string
}

export interface DoctorPatientsListResponse {
  success: boolean;
  patients: Array<{
    _id?: string;
    userRef: string;
    userId?: string;
    clinicRef: string;
    doctorRef?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    age?: number;
    dateOfBirth?: string;
    gender: "male" | "female" | "other";
    profilePicture?: string;
    bloodType?: string;
    insuranceInfo?: string;
    medicalHistory?: string[];
    allergies?: string;
    currentMedication?: string;
    insuranceProvider?: string;
    address: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    status: "active" | "inactive" | "pending_verification" | "suspended";
    role?: "patient";
    formCompletionPercentage?: number;
    isEmailVerified?: boolean;
    erxPatientId?: string;
    erxDoctorId?: string;
    lastVisit?: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  message?: string;
}

export interface DoctorPatientsByDoctorResponse {
  success: boolean
  patient: DoctorPatient[]
  message?: string
}

// Doctor Patient Service
export const doctorPatientService = {
  // Create new patient
  async createDoctorPatient(patientData: CreateDoctorPatientRequest): Promise<DoctorPatientResponse> {
    const response = await api.post('/doctors/patients', patientData)
    return response.data
  },

  // Get all patients
  async getDoctorPatients(): Promise<DoctorPatientsListResponse> {
    const response = await api.get('/doctor/patient/all/patients')
    return response.data
  },

    // Get patient by ID
  async getPatient(doctorId: string): Promise<DoctorPatientsByDoctorResponse> {
    const response = await api.get(`/doctor/patient/${doctorId}`)
    return response.data.patient
  },

  // Get specific patient by ID
  async getDoctorPatientById(id: string): Promise<DoctorPatientResponse> {
    const response = await api.get(`/doctors/patients/${id}`)
    return response.data
  },

  // Update patient
  async updateDoctorPatient(id: string, patientData: UpdateDoctorPatientRequest): Promise<DoctorPatientResponse> {
    const response = await api.put(`/doctors/patients/${id}`, patientData)
    return response.data
  },

  // Delete patient (admin only)
  async deleteDoctorPatient(id: string): Promise<{ success: boolean; message?: string }> {
    const response = await api.delete(`/doctors/patients/${id}`)
    return response.data
  },

  // Get patients by doctor ID
  async getPatientByDoctorId(doctorId: string): Promise<DoctorPatientsByDoctorResponse> {
    const response = await api.get(`/doctors/patients/doctor/${doctorId}`)
    return response.data
  },


}