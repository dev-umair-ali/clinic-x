import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { clinicAssistantService, type CreateClinicAssistantRequest, type UpdateClinicAssistantRequest, type ClinicAssistantQueryParams } from "../api/services/clinicAssistantService"

export interface ClinicAssistant {
    _id: string
    userRef: string
    clinicRef?: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    department?: string
    position?: string
    profilePicture?: string
    age?: number
    dateOfBirth?: string
    gender?: "male" | "female" | "other"
    address?: {
        street?: string
        city?: string
        state?: string
        zipCode?: string
        country?: string
    }
    isEmailVerified?: boolean
    status: "active" | "inactive" | "pending_verification" | "suspended"
    role?: "assistant"
    createdBy?: string
    updatedBy?: string
    createdAt?: string
    updatedAt?: string
}

interface ClinicAssistantState {
    clinicAssistants: ClinicAssistant[]
    clinicAssistant: ClinicAssistant | null
    pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
    } | null
    loading: boolean
    error: string | null
}

const initialState: ClinicAssistantState = {
    clinicAssistants: [],
    clinicAssistant: null,
    pagination: null,
    loading: false,
    error: null,
}

// Async thunks for API operations
export const fetchClinicAssistants = createAsyncThunk(
    'clinic/assistant/all/assistants',
    async (params: ClinicAssistantQueryParams | undefined = undefined, { rejectWithValue }) => {
        try {
            const response = await clinicAssistantService.getAssistants(params)
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch assistants';
            return rejectWithValue(errorMessage)
        }
    }
)

export const fetchClinicAssistant = createAsyncThunk(
    'clinic/assistant/:id',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await clinicAssistantService.getAssistant(id)
            return response.data?.assistant ?? response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch assistant';
            return rejectWithValue(errorMessage)
        }
    }
)

export const createClinicAssistant = createAsyncThunk(
    'clinic/assistant/create-assistant',
    async (assistantData: CreateClinicAssistantRequest, { rejectWithValue }) => {
        try {
            const response = await clinicAssistantService.createAssistant(assistantData)
            return response.data.assistant;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create assistant';
            return rejectWithValue(errorMessage)
        }
    }
)

export const updateClinicAssistant = createAsyncThunk(
    'clinic/assistants/update-assistant/:id',
    async ({ id, assistantData }: { id: string; assistantData: UpdateClinicAssistantRequest }, { rejectWithValue }) => {
        try {
            const response = await clinicAssistantService.updateAssistant(id, assistantData)
            return response.data.assistant;

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to update assistant';
            return rejectWithValue(errorMessage)
        }
    }
)

export const updateClinicAssistantStatus = createAsyncThunk(
    'clinic/assistants/update-assistant/status/:id',
    async ({ id, status }: { id: string; status: "active" | "inactive" | "pending_verification" | "suspended" }, { rejectWithValue, dispatch }) => {
        try {
            const response = await clinicAssistantService.updateAssistantStatus(id, status)
            await dispatch(fetchClinicAssistants()).unwrap()
            return { _id: id, status, data: response.data.assistant }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
            return rejectWithValue(errorMessage || 'Failed to update assistant status')
        }
    }
)

const clinicAssistantSlice = createSlice({
    name: "clinicAssistants",
    initialState,
    reducers: {
        setClinicAssistants: (state, action: PayloadAction<ClinicAssistant[]>) => {
            state.clinicAssistants = action.payload
        },
        addClinicAssistant: (state, action: PayloadAction<ClinicAssistant>) => {
            state.clinicAssistants.push(action.payload)
        },
        updateClinicAssistantInState: (state, action: PayloadAction<ClinicAssistant>) => {
            const index = state.clinicAssistants.findIndex((a) => a._id === action.payload._id)
            if (index !== -1) {
                state.clinicAssistants[index] = action.payload
            }
        },
        removeClinicAssistant: (state, action: PayloadAction<string>) => {
            state.clinicAssistants = state.clinicAssistants.filter((a) => a._id !== action.payload)
        },
        clearClinicAssistant: (state) => {
            state.clinicAssistant = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Assistants
            .addCase(fetchClinicAssistants.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchClinicAssistants.fulfilled, (state, action: PayloadAction<{ assistants: ClinicAssistant[], pagination?: any }>) => {
                state.loading = false
                state.clinicAssistants = action.payload.assistants
                state.pagination = action.payload.pagination || null
            })
            .addCase(fetchClinicAssistants.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Fetch Assistant
            .addCase(fetchClinicAssistant.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchClinicAssistant.fulfilled, (state, action) => {
                state.loading = false
                state.clinicAssistant = action.payload as any
            })
            .addCase(fetchClinicAssistant.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Create Assistant
            .addCase(createClinicAssistant.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createClinicAssistant.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.clinicAssistants.push(action.payload as ClinicAssistant)
                }
            })
            .addCase(createClinicAssistant.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Update Assistant
            .addCase(updateClinicAssistant.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateClinicAssistant.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    const index = state.clinicAssistants.findIndex((a) => a._id === action.payload._id)
                    if (index !== -1) {
                        state.clinicAssistants[index] = action.payload as ClinicAssistant
                    }
                }
            })
            .addCase(updateClinicAssistant.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Update Assistant Status
            .addCase(updateClinicAssistantStatus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateClinicAssistantStatus.fulfilled, (state, action: PayloadAction<{ _id: string; status: string; data?: any }>) => {
                state.loading = false
                const index = state.clinicAssistants.findIndex((a) => a._id === action.payload._id)
                if (index !== -1) {
                    state.clinicAssistants[index].status = action.payload.status as "active" | "inactive" | "pending_verification" | "suspended"
                }
            })
            .addCase(updateClinicAssistantStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const {
    setClinicAssistants,
    addClinicAssistant,
    updateClinicAssistantInState,
    removeClinicAssistant,
    clearClinicAssistant,
} = clinicAssistantSlice.actions

export default clinicAssistantSlice.reducer
