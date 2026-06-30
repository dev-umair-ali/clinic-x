import api from '../axios';

export interface CreateAssistantRequest {
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

export interface UpdateAssistantRequest {
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

export interface AssistantResponse {
  success: boolean;
  data: {
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
    status: "active" | "inactive" | "pending_verification" | "suspended";
    role?: "assistant";
    createdBy: string;
    updatedBy?: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
}

export interface AssistantsListResponse {
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

export interface AssistantQueryParams {
  search?: string;
  status?: string;
  clinicId?: string;
  page?: number;
  limit?: number;
}

export const assistantService = {
  // Get all assistants with optional filters
  getAssistants: async (params?: AssistantQueryParams) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.clinicId) queryParams.append('clinicId', params.clinicId);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `/admin/assistant/all/assistants?${queryString}`
      : '/admin/assistant/all/assistants';
    
    const response = await api.get<AssistantsListResponse>(url);
    return {
      assistants: response.data.data,
      pagination: response.data.pagination
    };
  },

  // Get single assistant by ID
  getAssistant: async (id: string) => {
    const response = await api.get<AssistantResponse>(`/admin/assistant/${id}`);
    return response.data.data;
  },

  // Create assistant
  createAssistant: async (assistantData: CreateAssistantRequest): Promise<AssistantResponse> => {
    const response = await api.post<AssistantResponse>('/admin/assistant/create-assistant', assistantData);
    return response.data;
  },

  // Update assistant
  updateAssistant: async (id: string, assistantData: UpdateAssistantRequest): Promise<AssistantResponse> => {
    const response = await api.put<AssistantResponse>(`/admin/assistant/update-assistant/${id}`, assistantData);
    return response.data;
  },

  // Update assistant status
  updateAssistantStatus: async (id: string, status: "active" | "inactive" | "pending_verification" | "suspended"): Promise<AssistantResponse> => {
    const response = await api.put<AssistantResponse>(`/admin/assistant/update-assistant/status/${id}`, { status });
    return response.data;
  },
};
