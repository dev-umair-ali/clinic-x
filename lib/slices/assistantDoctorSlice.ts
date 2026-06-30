import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { assistantDoctorService, type CreateAssistantDoctorRequest, type UpdateAssistantDoctorRequest, type AssistantDoctorQueryParams } from "../api/services/assistantDoctorService"

export interface AssistantDoctor {
    _id?: string
    userRef?: string
    firstName: string
    lastName: string
    name?: string
    email: string
    phoneNumber?: string
    age: number
    dateOfBirth?: string
    gender: "male" | "female" | "other"
    address: string | {
        street?: string
        city?: string
        state?: string
        country?: string
        zipCode?: string
    }
    specialization: string
    yearsOfExperience?: number
    licenseNumber: string
    bio?: string | object
    educationSummary?: string | object
    status: "active" | "inactive" | "pending_verification" | "suspended"
    role: "doctor"
    profilePicture?: string
    languages?: string[]
    clinicRef?: string
    hipaaConsent?: boolean
    createdBy?: string
    updatedBy?: string
    createdAt?: string
    updatedAt?: string
}

interface AssistantDoctorState {
    assistantDoctors: AssistantDoctor[]
    assistantDoctor: AssistantDoctor | null
    pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
    } | null
    loading: boolean
    error: string | null
}

const initialState: AssistantDoctorState = {
    assistantDoctors: [],
    assistantDoctor: null,
    pagination: null,
    loading: false,
    error: null,
}

// Async thunks for API operations
export const fetchAssistantDoctors = createAsyncThunk(
    'assistant/doctor/all/doctors',
    async (params: AssistantDoctorQueryParams | undefined = undefined, { rejectWithValue }) => {
        try {
            const response = await assistantDoctorService.getDoctors(params)
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch doctors';
            return rejectWithValue(errorMessage)
        }
    }
)

export const fetchAssistantDoctor = createAsyncThunk(
    'assistant/doctor/:id',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await assistantDoctorService.getDoctor(id)
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch doctor';
            return rejectWithValue(errorMessage)
        }
    }
)

export const createAssistantDoctor = createAsyncThunk(
    'assistant/doctor/create-doctor',
    async (doctorData: CreateAssistantDoctorRequest, { rejectWithValue }) => {
        try {
            const response = await assistantDoctorService.createDoctor(doctorData)
            return response?.doctor
        } catch (error: any) {
            // Handle validation errors
            if (error.response?.data?.errors) {
                const validationErrors = error.response.data.errors;
                const firstError = Object.values(validationErrors)[0];
                return rejectWithValue(Array.isArray(firstError) ? firstError[0] : 'Validation error');
            }
            // Handle other structured errors
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create doctor';
            return rejectWithValue(errorMessage);
        }
    }
)

export const updateAssistantDoctor = createAsyncThunk(
    'assistant/doctor/update-doctor/:id',
    async ({ id, doctorData }: { id: string; doctorData: UpdateAssistantDoctorRequest }, { rejectWithValue, dispatch }) => {
        try {
            const response = await assistantDoctorService.updateDoctor(id, doctorData)
            if (response.success) {
                return response.data
            } else {
                return rejectWithValue(response.doctor?.message || 'Failed to update doctor')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to update doctor';
            return rejectWithValue(errorMessage)
        }
    }
)

export const updateAssistantDoctorStatus = createAsyncThunk(
    'assistant/doctor/update-doctor/status/:id',
    async ({ id, status }: { id: string; status: "active" | "inactive" }, { rejectWithValue, dispatch }) => {
        try {
            const response = await assistantDoctorService.updateDoctorStatus(id, status)
            await dispatch(fetchAssistantDoctors()).unwrap()
            return { _id: id, status, data: response.data }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
            return rejectWithValue(errorMessage || 'Failed to update doctor status')
        }
    }
)

const assistantDoctorSlice = createSlice({
    name: "assistantDoctors",
    initialState,
    reducers: {
        setAssistantDoctors: (state, action: PayloadAction<AssistantDoctor[]>) => {
            state.assistantDoctors = action.payload
        },
        addAssistantDoctor: (state, action: PayloadAction<AssistantDoctor>) => {
            state.assistantDoctors.push(action.payload)
        },
        updateAssistantDoctorInState: (state, action: PayloadAction<AssistantDoctor>) => {
            const index = state.assistantDoctors.findIndex((d) => d._id === action.payload._id)
            if (index !== -1) {
                state.assistantDoctors[index] = action.payload
            }
        },
        removeAssistantDoctor: (state, action: PayloadAction<string>) => {
            state.assistantDoctors = state.assistantDoctors.filter((d) => d._id !== action.payload)
        },
        clearAssistantDoctor: (state) => {
            state.assistantDoctor = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Doctors
            .addCase(fetchAssistantDoctors.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAssistantDoctors.fulfilled, (state, action) => {
                state.loading = false
                state.assistantDoctors = action.payload.doctors || []
                state.pagination = action.payload.pagination || null
            })
            .addCase(fetchAssistantDoctors.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Fetch Doctor
            .addCase(fetchAssistantDoctor.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAssistantDoctor.fulfilled, (state, action) => {
                state.loading = false
                state.assistantDoctor = action.payload as AssistantDoctor
            })
            .addCase(fetchAssistantDoctor.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Create Doctor
            .addCase(createAssistantDoctor.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createAssistantDoctor.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.assistantDoctors.push(action.payload as AssistantDoctor)
                }
            })
            .addCase(createAssistantDoctor.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Update Doctor
            .addCase(updateAssistantDoctor.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateAssistantDoctor.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    const index = state.assistantDoctors.findIndex((d) => d._id === action.payload._id)
                    if (index !== -1) {
                        state.assistantDoctors[index] = action.payload as AssistantDoctor
                    }
                    state.assistantDoctor = action.payload as AssistantDoctor
                }
            })
            .addCase(updateAssistantDoctor.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Update Doctor Status
            .addCase(updateAssistantDoctorStatus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateAssistantDoctorStatus.fulfilled, (state, action: PayloadAction<{ _id: string; status: string; data?: any }>) => {
                state.loading = false
                const index = state.assistantDoctors.findIndex((d) => d._id === action.payload._id)
                if (index !== -1) {
                    state.assistantDoctors[index].status = action.payload.status as "active" | "inactive"
                }
            })
            .addCase(updateAssistantDoctorStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const {
    setAssistantDoctors,
    addAssistantDoctor,
    updateAssistantDoctorInState,
    removeAssistantDoctor,
    clearAssistantDoctor,
} = assistantDoctorSlice.actions

export default assistantDoctorSlice.reducer
