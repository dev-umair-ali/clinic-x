import api from '../axios';

export interface CreateClinicDoctorRequest {
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

export interface UpdateClinicDoctorRequest {
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
  profilePicture?: string;
  clinicRef?: string;
}

export interface ClinicDoctorResponse {
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

export interface UpdateClinicDoctorResponse {
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

export interface ClinicDoctorsListResponse {
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

export interface ClinicDoctorQueryParams {
  search?: string;
  status?: string;
  clinicRef?: string;
  page?: number;
  limit?: number;
}

export const clinicDoctorService = {
  async getDoctors(params?: ClinicDoctorQueryParams) {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.clinicRef) queryParams.append('clinicRef', params.clinicRef);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = queryString
      ? `/clinic/doctor/all/doctors?${queryString}`
      : '/clinic/doctor/all/doctors';

    const response = await api.get<ClinicDoctorsListResponse>(url);
    return {
      doctors: response.data?.doctors,
      pagination: response.data.pagination
    };
  },

  async getDoctor(id: string) {
    const response = await api.get<ClinicDoctorResponse>(`/clinic/doctor/${id}`);
    return response.data?.doctor;
  },

  async createDoctor(doctorData: CreateClinicDoctorRequest): Promise<ClinicDoctorResponse> {
    const response = await api.post<ClinicDoctorResponse>('/clinic/doctor/create-doctor', doctorData);
    return response.data;
  },

  async updateDoctor(id: string, doctorData: UpdateClinicDoctorRequest): Promise<UpdateClinicDoctorResponse> {
    const response = await api.put(`/clinic/doctor/update-doctor/${id}`, doctorData);
    return response.data;
  },

  async updateDoctorStatus(id: string, status: "active" | "inactive"): Promise<{ success: boolean; message?: string; data?: any }> {
    const response = await api.put(`/clinic/doctor/update-doctor/status/${id}`, { status });
    return response.data;
  },
};
