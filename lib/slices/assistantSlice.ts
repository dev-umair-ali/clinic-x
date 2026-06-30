import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { assistantService, type CreateAssistantRequest, type UpdateAssistantRequest, type AssistantQueryParams } from "../api/services/assistantService"

export interface Assistant {
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

interface AssistantState {
    assistants: Assistant[]
    assistant: Assistant | null
    pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
    } | null
    loading: boolean
    error: string | null
}

const initialState: AssistantState = {
    assistants: [],
    assistant: null,
    pagination: null,
    loading: false,
    error: null,
}

// Async thunks for API operations
export const fetchAssistants = createAsyncThunk(
    'admin/assistant/all/assistants',
    async (params: AssistantQueryParams | undefined = undefined, { rejectWithValue }) => {
        try {
            const response = await assistantService.getAssistants(params)
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch assistants';
            return rejectWithValue(errorMessage)
        }
    }
)

export const createAssistant = createAsyncThunk(
    'admin/assistant/create-assistant',
    async (assistantData: CreateAssistantRequest, { rejectWithValue }) => {
        try {
            const response = await assistantService.createAssistant(assistantData)
            return response.data
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create assistant';
            return rejectWithValue(errorMessage)
        }
    }
)

export const updateAssistant = createAsyncThunk(
    'admin/assistants/update-assistant/:id',
    async ({ id, assistantData }: { id: string; assistantData: UpdateAssistantRequest }, { rejectWithValue }) => {
        try {
            const response = await assistantService.updateAssistant(id, assistantData)
            return response.data

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to update assistant';
            return rejectWithValue(errorMessage)
        }
    }
)

export const updateAssistantStatus = createAsyncThunk(
    'admin/assistants/update-assistant/status/:id',
    async ({ id, status }: { id: string; status: "active" | "inactive" | "pending_verification" | "suspended" }, { rejectWithValue, dispatch }) => {
        try {
            const response = await assistantService.updateAssistantStatus(id, status)
            await dispatch(fetchAssistants()).unwrap()
            return { id, status, data: response.data }

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to update assistant status';
            return rejectWithValue(errorMessage)
        }
    }
)

export const fetchAssistant = createAsyncThunk(
    'admin/assistant/:id',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await assistantService.getAssistant(id)
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch assistant';
            return rejectWithValue(errorMessage)
        }
    }
)

const assistantSlice = createSlice({
    name: 'assistants',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        clearAssistant: (state) => {
            state.assistant = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Assistants
            .addCase(fetchAssistants.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAssistants.fulfilled, (state, action: PayloadAction<{ assistants: Assistant[], pagination?: any }>) => {
                state.loading = false
                state.assistants = action.payload.assistants
                state.pagination = action.payload.pagination || null
            })
            .addCase(fetchAssistants.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Fetch Assistant
            .addCase(fetchAssistant.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAssistant.fulfilled, (state, action: PayloadAction<Assistant>) => {
                state.loading = false
                state.assistant = action.payload
            })
            .addCase(fetchAssistant.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Create Assistant
            .addCase(createAssistant.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createAssistant.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.assistants.push(action.payload)
                }
            })
            .addCase(createAssistant.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Update Assistant
            .addCase(updateAssistant.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateAssistant.fulfilled, (state, action) => {
                state.loading = false
                const index = state.assistants.findIndex((a) => a._id === action.payload._id)
                if (index !== -1) {
                    state.assistants[index] = action.payload
                }
                state.assistant = action.payload
            })
            .addCase(updateAssistant.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Update Assistant Status
            .addCase(updateAssistantStatus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateAssistantStatus.fulfilled, (state, action) => {
                state.loading = false
                const index = state.assistants.findIndex((a) => a._id === action.payload.id)
                if (index !== -1) {
                    state.assistants[index].status = action.payload.status
                }
            })
            .addCase(updateAssistantStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { clearError, clearAssistant } = assistantSlice.actions
export default assistantSlice.reducer
