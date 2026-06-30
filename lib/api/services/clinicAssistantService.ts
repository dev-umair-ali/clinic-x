import api from '../axios';

export interface CreateClinicAssistantRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age?: number;
  dateOfBirth?: string;
  gender: "male" | "female" | "other";
  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  department?: string;
  position?: string;
  clinicRef?: string;
  role: "assistant";
  profilePicture?: string;
}

export interface UpdateClinicAssistantRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  age?: number;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  department?: string;
  position?: string;
  clinicRef?: string;
  profilePicture?: string;
}
export interface ClinicAssistantResponse {
  success: boolean;
  message?: string;
  data: {
    assistant: {
      _id: string;
      id?: string;
      userRef: string;
      userId: string;
      clinicRef?: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      department?: string;
      position?: string;
      profilePicture?: string;
      age?: number;
      dateOfBirth?: string;
      gender: "male" | "female" | "other";
      address: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
      };
      isEmailVerified: boolean;
      emailVerificationToken?: string | null;
      emailVerificationExpires?: string | null;
      status: "active" | "inactive" | "pending_verification" | "suspended";
      role?: "assistant";
      createdBy: string;
      updatedBy?: string;
      createdAt: string;
      updatedAt: string;
      __v?: number;
    };
  };
}

export interface ClinicAssistantsListResponse {
  success: boolean;
  data: Array<{
    _id: string;
    id?: string;
    userRef: string;
    clinicRef?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    department?: string;
    position?: string;
    age?: number;    
    dateOfBirth?: string;    
    gender?: "male" | "female" | "other";
    address: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    status: "active" | "inactive" | "pending_verification" | "suspended";
    role?: "assistant";
    profilePicture?: string;
  }>;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  message?: string;
}

export interface ClinicAssistantQueryParams {
  search?: string;
  status?: string;
  clinicRef?: string;
  page?: number;
  limit?: number;
}

export const clinicAssistantService = {
  // Get all assistants with optional filters
  getAssistants: async (params?: ClinicAssistantQueryParams) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.clinicRef) queryParams.append('clinicRef', params.clinicRef);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `/clinic/assistant/all/assistants?${queryString}`
      : '/clinic/assistant/all/assistants';
    
    const response = await api.get<ClinicAssistantsListResponse>(url);
    return {
      assistants: response.data.data,
      pagination: response.data.pagination
    };
  },

  // Get single assistant by ID
  getAssistant: async (id: string) => {
    const response = await api.get<ClinicAssistantResponse>(`/clinic/assistant/${id}`);
    return response.data;
  },

  // Create assistant
  createAssistant: async (assistantData: CreateClinicAssistantRequest): Promise<ClinicAssistantResponse> => {
    const response = await api.post<ClinicAssistantResponse>('/clinic/assistant/create-assistant', assistantData);
    return response.data;
  },

  // Update assistant
  updateAssistant: async (id: string, assistantData: UpdateClinicAssistantRequest): Promise<ClinicAssistantResponse> => {
    const response = await api.put<ClinicAssistantResponse>(`/clinic/assistant/update-assistant/${id}`, assistantData);
    return response.data;
  },

  // Update assistant status
  updateAssistantStatus: async (id: string, status: "active" | "inactive" | "pending_verification" | "suspended"): Promise<ClinicAssistantResponse> => {
    const response = await api.put<ClinicAssistantResponse>(`/clinic/assistant/update-assistant/status/${id}`, { status });
    return response.data;
  },
};
