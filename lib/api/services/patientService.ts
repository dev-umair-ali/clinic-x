import api from '../axios';

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  phoneNumber?: string;
  age: number;
  dateOfBirth: string;
  DateOfBirth?: string;
  gender: "male" | "female" | "other";
  bloodType?: string;
  BloodType?: string;
  profilePicture?: string;
  medicalHistory?: string;
  MedicalHistory?: string;
  allergies?: string;
  Allergies?: string;
  currentMedication?: string;
  CurrentMedication?: string;
  insuranceProvide?: string;
  InsuranceProvide?: string;
  eContactName?: string;
  EContactName?: string;
  ePhoneNumber?: string;
  EPhoneNumber?: string;
  eRelationship?: string;
  ERelationship?: string;
  PrimaryDoctor?: string;
  primaryDoctor?: string;
  address: string;
  status: "active" | "inactive";
  role: "patient";
  hipaaConsent: boolean;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  allergiesArray?: string[];
  medicationsArray?: string[];
}

export interface UpdatePatientRequest {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
  phoneNumber?: string;
  age?: number;
  dateOfBirth?: string;
  DateOfBirth?: string;
  gender?: "male" | "female" | "other";
  bloodType?: string;
  BloodType?: string;
  profilePicture?: string;
  medicalHistory?: string;
  MedicalHistory?: string;
  allergies?: string;
  Allergies?: string;
  currentMedication?: string;
  CurrentMedication?: string;
  insuranceProvide?: string;
  InsuranceProvide?: string;
  eContactName?: string;
  EContactName?: string;
  ePhoneNumber?: string;
  EPhoneNumber?: string;
  eRelationship?: string;
  ERelationship?: string;
  PrimaryDoctor?: string;
  primaryDoctor?: string;
  address?: string;
  status?: "active" | "inactive";
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  allergiesArray?: string[];
  medicationsArray?: string[];
}

export interface PatientResponse {
  success: boolean;
  data: {
    user: {
      profilePicture?: string;
      id: string;
      firstName: string;
      lastName: string;
      fullName: string;
      email: string;
      phone: string;
      phoneNumber?: string;
      age: number;
      dateOfBirth: string;
      DateOfBirth?: string;
      gender: "male" | "female" | "other";
      bloodType?: string;
      BloodType?: string;
      assignedDoctor?: string;
      insuranceInfo?: string;
      medicalHistory?: string;
      MedicalHistory?: string;
      allergies?: string;
      Allergies?: string;
      currentMedication?: string;
      CurrentMedication?: string;
      insuranceProvide?: string;
      InsuranceProvide?: string;
      eContactName?: string;
      EContactName?: string;
      ePhoneNumber?: string;
      EPhoneNumber?: string;
      eRelationship?: string;
      ERelationship?: string;
      PrimaryDoctor?: string;
      primaryDoctor?: string;
      address: string;
      status: "active" | "inactive";
      role: "patient";
      avatar?: string;
      emergencyContactName?: string;
      emergencyContactPhone?: string;
      emergencyContactRelationship?: string;
      allergiesArray?: string[];
      medicationsArray?: string[];
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
    phoneNumber?: string;
    age: number;
    dateOfBirth: string;
    DateOfBirth?: string;
    gender: "male" | "female" | "other";
    bloodType?: string;
    BloodType?: string;
    profilePicture?: string;
    assignedDoctor?: string;
    insuranceInfo?: string;
    medicalHistory?: string;
    MedicalHistory?: string;
    allergies?: string;
    Allergies?: string;
    currentMedication?: string;
    CurrentMedication?: string;
    insuranceProvide?: string;
    InsuranceProvide?: string;
    eContactName?: string;
    EContactName?: string;
    ePhoneNumber?: string;
    EPhoneNumber?: string;
    eRelationship?: string;
    ERelationship?: string;
    PrimaryDoctor?: string;
    primaryDoctor?: string;
    address: string;
    status: "active" | "inactive";
    role: "patient";
    avatar?: string;
    lastVisit: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelationship?: string;
    allergiesArray?: string[];
    medicationsArray?: string[];
  }>;
  message?: string;
}

export const patientService = {
  async getPatients(): Promise<PatientsListResponse> {
    try {
      // Use /doctors/patients for doctors, which filters by assigned doctor
      const endpoint = '/doctors/patients';
      const response = await api.get(endpoint);
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
  
  async updatePatient(id: string, patientData: UpdatePatientRequest): Promise<PatientResponse> {
    const response = await api.put(`/admin/update-patient/${id}`, patientData);
    return response.data;
  },

  async createPatientInCollection(patientData: Omit<CreatePatientRequest, 'password'>): Promise<PatientResponse> {
    const response = await api.post<PatientResponse>('/admin/create-patient', patientData);
    return response.data;
  },

  async updatePatientStatus(id: string, status: string): Promise<{ success: boolean; message?: string }> {
    const response = await api.patch(`/admin/patients/status/${id}`, { status });
    return response.data;
  }
};
