import api from '../axios';

export interface CreateDoctorRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  age: number;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  address: string | {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  specialization: string;
  yearsOfExperience?: string;
  licenseNumber: string;
  bio?: string;
  educationSummary?: string;
  education?: Array<{
    degree?: string;
    institution?: string;
    graduationYear?: number | null;
    fieldOfStudy?: string;
  }>;
  languages?: string[];
  role: "doctor";
  hipaaConsent: boolean;
  clinicRef?: string;
  profilePicture?: string;
}

export interface UpdateDoctorRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  age?: number;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: string | {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  specialization?: string;
  yearsOfExperience?: string;
  licenseNumber?: string;
  bio?: string;
  educationSummary?: string;
  education?: Array<{
    degree?: string;
    institution?: string;
    graduationYear?: number | null;
    fieldOfStudy?: string;
  }>;
  languages?: string[];
  role?: "doctor";
  hipaaConsent?: boolean;
  clinicRef?: string;
  profilePicture?: string;
}

export interface DoctorResponse {
  success: boolean;
  doctor: {
    _id?: string;
    userRef?: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    phoneNumber?: string;
    age: number;
    dateOfBirth?: string;
    gender: "male" | "female" | "other";
    address: string | {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
    specialization: string;
    yearsOfExperience?: number;
    licenseNumber: string;
    bio?: string | object;
    educationSummary?: string | object;
    status: "active" | "inactive" | "pending_verification" | "suspended";
    role: "doctor";
    profilePicture?: string;
    languages?: string[];
    clinicRef?: string;
    hipaaConsent?: boolean;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  message?: string;
}


export interface UpdateDoctorResponse {
  doctor: any;
  success: boolean;
  data: {
    _id?: string;
    userRef?: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    phoneNumber?: string;
    age: number;
    dateOfBirth?: string;
    gender: "male" | "female" | "other";
    address: string | {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
    specialization: string;
    yearsOfExperience?: number;
    licenseNumber: string;
    bio?: string | object;
    educationSummary?: string | object;
    role: "doctor";
    profilePicture?: string;
    languages?: string[];
    clinicRef?: string;
    hipaaConsent?: boolean;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  message?: string;
}

export interface DoctorsListResponse {
  success: boolean;
  doctors: Array<{
    _id?: string;
    userRef?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    age: number;
    dateOfBirth?: string;
    gender: "male" | "female" | "other";
    address: string | {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
    specialization: string;
    yearsOfExperience: number;
    licenseNumber: string;
    status: "active" | "inactive" | "pending_verification" | "suspended";
    role: "doctor";
    profilePicture?: string;
    avatar?: string;
    languages?: string[];
    clinicRef?: string;
  }>;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  message?: string;
}

export interface DoctorQueryParams {
  search?: string;
  status?: string;
  clinicId?: string;
  page?: number;
  limit?: number;
}

export interface DoctorByClinicParams {
  clinicId?: string;
}

export const doctorService = {

  async getDoctors(params?: DoctorQueryParams) {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.clinicId) queryParams.append('clinicId', params.clinicId);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `/admin/doctor/all/doctors?${queryString}`
      : '/admin/doctor/all/doctors';

    const response = await api.get<DoctorsListResponse>(url);
    return {
      doctors: response.data?.doctors,
      pagination: response.data.pagination
    };
  },

  async getDoctorsByClinicId(params?: DoctorByClinicParams) {
    const queryParams = new URLSearchParams();
    if (params?.clinicId) queryParams.append('clinicId', params.clinicId);

    const queryString = queryParams.toString();
    const url = `/admin/doctor/all/doctors?${queryString}`

    const response = await api.get<DoctorsListResponse>(url);
    return {
      doctors: response.data?.doctors,
    };
  },

  async getDoctorsByClinicIdByAssistant(params?: DoctorByClinicParams) {
    const queryParams = new URLSearchParams();
    if (params?.clinicId) queryParams.append('clinicId', params.clinicId);

    const queryString = queryParams.toString();
    const url = `/assistant/doctor/all/doctors?${queryString}`

    const response = await api.get<DoctorsListResponse>(url);
    return {
      doctors: response.data?.doctors,
    };
  },

  async getDoctorsByClinicIdByClinic(params?: DoctorByClinicParams) {
    const queryParams = new URLSearchParams();
    if (params?.clinicId) queryParams.append('clinicId', params.clinicId);

    const queryString = queryParams.toString();
    const url = `/clinic/doctor/all/doctors?${queryString}`

    const response = await api.get<DoctorsListResponse>(url);
    return {
      doctors: response.data?.doctors,
    };
  },

  async getDoctor(id: string) {
    const response = await api.get<DoctorResponse>(`/admin/doctor/${id}`);
    return response.data?.doctor;
  },

  async createDoctor(doctorData: CreateDoctorRequest): Promise<DoctorResponse> {
    const response = await api.post<DoctorResponse>('/admin/doctor/create-doctor', doctorData);
    return response.data;
  },

  async updateDoctor(id: string, doctorData: UpdateDoctorRequest): Promise<UpdateDoctorResponse> {
    const response = await api.put(`/admin/doctor/update-doctor/${id}`, doctorData);
    return response.data;
  },

  async updateDoctorStatus(id: string, status: "active" | "inactive"): Promise<{ success: boolean; message?: string; data?: any }> {
    const response = await api.put(`/admin/doctor/update-doctor/status/${id}`, { status });
    return response.data;
  },
};
