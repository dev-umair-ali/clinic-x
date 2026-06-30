import api from '../axios';

export interface CreatePatientRequest {
  userRef?: string;
  userId?: string;
  clinicRef: string;
  doctorRef?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
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
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  role?: "patient";
  isEmailVerified?: boolean;
  erxPatientId?: string;
  erxDoctorId?: string;
  createdBy?: string;
}

export interface UpdatePatientRequest {
  clinicRef?: string;
  doctorRef?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  age?: number;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  profilePicture?: string;
  bloodType?: string;
  insuranceInfo?: string;
  medicalHistory?: string[];
  allergies?: string;
  currentMedication?: string;
  insuranceProvider?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  isEmailVerified?: boolean;
  erxPatientId?: string;
  erxDoctorId?: string;
  updatedBy?: string;
}

export interface PatientResponse {
  success: boolean;
  patient: {
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
    onboardingFormRef?: string;
    medicalProfileFormRef?: string;
    insuranceFormRef?: string;
    dentalHistoryFormRef?: string;
    historyHealthFormRef?: string;
    lifeStyleFormRef?: string;
    womenFormRef?: string;
    constantLegalFormRef?: string;
    presentConditionFormRef?: string;
    formsCompleted?: {
      onboarding?: boolean;
      medicalProfile?: boolean;
      insurance?: boolean;
      dentalHistory?: boolean;
      historyHealth?: boolean;
      lifeStyle?: boolean;
      women?: boolean;
      constantLegal?: boolean;
      presentCondition?: boolean;
    };
    formCompletionPercentage?: number;
    incompleteForms?: string[];
    isEmailVerified?: boolean;
    emailVerificationToken?: string;
    emailVerificationExpires?: string;
    erxPatientId?: string;
    erxDoctorId?: string;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  message?: string;
}

export interface PatientQueryParams {
  search?: string;
  status?: string;
  clinicId?: string;
  doctorId?: string;
  page?: number;
  limit?: number;
}

export interface PatientsListResponse {
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

export const patientService = {
  async getPatients(params?: PatientQueryParams): Promise<PatientsListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.clinicId) queryParams.append('clinicId', params.clinicId);
    if (params?.doctorId) queryParams.append('doctorId', params.doctorId);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `/admin/patient/all/patients?${queryString}`
      : '/admin/patient/all/patients';
    
    const response = await api.get<PatientsListResponse>(url);

    return response.data;
  },

  async getPatient(id: string): Promise<PatientResponse['patient']> {
    const response = await api.get<PatientResponse>(`/admin/patient/${id}`);
    return response.data.patient;
  },

  async createPatient(patientData: CreatePatientRequest): Promise<PatientResponse> {
    const response = await api.post<PatientResponse>('/admin/patient/create-patient', patientData);
    return response.data;
  },
  
  async updatePatient(id: string, patientData: UpdatePatientRequest): Promise<PatientResponse> {
    const response = await api.put(`/admin/patient/update-patient/${id}`, patientData);
    return response.data;
  },

  async createPatientInCollection(patientData: Omit<CreatePatientRequest, 'password'>): Promise<PatientResponse> {
    const response = await api.post<PatientResponse>('/admin/patient/create-patient', patientData);
    return response.data;
  },

  async updatePatientStatus(id: string, status: "active" | "inactive" | "pending_verification" | "suspended"): Promise<PatientResponse> {
    const response = await api.put<PatientResponse>(`/admin/patient/update-patient/status/${id}`, { status });
    return response.data;
  }
};
