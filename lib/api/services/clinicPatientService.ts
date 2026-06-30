import api from '../axios';

export interface CreateClinicPatientRequest {
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
  status?: "active" | "inactive" | "pending_verification" | "suspended";
  role?: "patient";
  isEmailVerified?: boolean;
  erxPatientId?: string;
  erxDoctorId?: string;
  createdBy?: string;
}

export interface UpdateClinicPatientRequest {
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
  status?: "active" | "inactive" | "pending_verification" | "suspended";
  doctorRef?: string;
  clinicRef?: string;
}

export interface ClinicPatientResponse {
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
    presentConditionFormRef?: string;
    historyHealthFormRef?: string;
    formCompletionPercentage?: number;
    isEmailVerified?: boolean;
    erxPatientId?: string;
    erxDoctorId?: string;
    lastVisit?: string;
    assignedDoctor?: any;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  message?: string;
}

export interface ClinicPatientQueryParams {
  search?: string;
  status?: string;
  clinicId?: string;
  doctorId?: string;
  page?: number;
  limit?: number;
}

export interface ClinicPatientsListResponse {
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
    assignedDoctor?: any;
    createdBy?: string;
    updatedBy?: string;
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

export const clinicPatientService = {
  async getPatients(params?: ClinicPatientQueryParams): Promise<ClinicPatientsListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.clinicId) queryParams.append('clinicId', params.clinicId);
    if (params?.doctorId) queryParams.append('doctorId', params.doctorId);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `/clinic/patient/all/patients?${queryString}`
      : '/clinic/patient/all/patients';

    const response = await api.get<ClinicPatientsListResponse>(url);

    return response.data;
  },

  async getPatient(id: string): Promise<ClinicPatientResponse['patient']> {
    const response = await api.get<ClinicPatientResponse>(`/clinic/patient/${id}`);
    return response.data.patient;
  },

  async createPatient(patientData: CreateClinicPatientRequest): Promise<ClinicPatientResponse> {
    const response = await api.post<ClinicPatientResponse>('/clinic/patient/create-patient', patientData);
    return response.data;
  },

  async updatePatient(id: string, patientData: UpdateClinicPatientRequest): Promise<ClinicPatientResponse> {
    const response = await api.put(`/clinic/patient/update-patient/${id}`, patientData);
    return response.data;
  },

  async createPatientInCollection(patientData: Omit<CreateClinicPatientRequest, 'password'>): Promise<ClinicPatientResponse> {
    const response = await api.post<ClinicPatientResponse>('/clinic/patient/create-patient', patientData);
    return response.data;
  },

  async updatePatientStatus(id: string, status: "active" | "inactive" | "pending_verification" | "suspended"): Promise<ClinicPatientResponse> {
    const response = await api.put<ClinicPatientResponse>(`/clinic/patient/update-patient/status/${id}`, { status });
    return response.data;
  }
};
