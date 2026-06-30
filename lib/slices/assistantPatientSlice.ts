import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { assistantPatientService, type CreateAssistantPatientRequest, type UpdateAssistantPatientRequest, type AssistantPatientQueryParams } from "../api/services/assistantPatientService"
import { assistantDoctorService } from "../api/services/assistantDoctorService"

export interface AssistantPatient {
    _id?: string
    userRef: string
    userId?: string
    clinicRef: string
    doctorRef?: string
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string
    age?: number
    dateOfBirth?: string
    gender: "male" | "female" | "other"
    profilePicture?: string
    bloodType?: string
    insuranceInfo?: string
    medicalHistory?: string[]
    allergies?: string
    currentMedication?: string
    insuranceProvider?: string
    address?: {
        street?: string
        city?: string
        state?: string
        zipCode?: string
        country?: string
    }
    status: "active" | "inactive" | "pending_verification" | "suspended"
    role?: "patient"
    formCompletionPercentage?: number
    isEmailVerified?: boolean
    erxPatientId?: string
    erxDoctorId?: string
    lastVisit?: string
    assignedDoctor?: any
    createdBy?: string
    updatedBy?: string
    createdAt?: string
    updatedAt?: string
}

interface AssistantPatientState {
    assistantPatients: AssistantPatient[]
    assistantPatient: AssistantPatient | null
    assistantDoctors: any[]
    pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
    } | null
    loading: boolean
    error: string | null
}

const initialState: AssistantPatientState = {
    assistantPatients: [],
    assistantPatient: null,
    assistantDoctors: [],
    pagination: null,
    loading: false,
    error: null,
}

// Async thunks for API operations
export const fetchAssistantPatients = createAsyncThunk(
    'assistant/patient/all/patients',
    async (params: AssistantPatientQueryParams | undefined = undefined, { rejectWithValue }) => {
        try {
            const response = await assistantPatientService.getPatients(params)
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch patients';
            return rejectWithValue(errorMessage)
        }
    }
)

export const fetchAssistantDoctorsForPatient = createAsyncThunk(
    'assistant/patient/fetch-assistant-doctors',
    async (clinicRef: string, { rejectWithValue }) => {
        try {
            const response = await assistantDoctorService.getDoctors({ clinicRef })
            return response.doctors || []
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch assistant doctors';
            return rejectWithValue(errorMessage)
        }
    }
)

export const clearAssistantDoctorsForPatient = createAsyncThunk(
    'assistant/patient/clear-assistant-doctors',
    async () => {
        return []
    }
)

export const fetchAssistantPatient = createAsyncThunk(
    'assistant/patient/:id',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await assistantPatientService.getPatient(id)
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch patient';
            return rejectWithValue(errorMessage)
        }
    }
)

export const createAssistantPatient = createAsyncThunk(
    'assistant/patient/create-patient',
    async (patientData: CreateAssistantPatientRequest, { rejectWithValue }) => {
        try {
            const response = await assistantPatientService.createPatient(patientData)
            return response.patient
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create patient';
            return rejectWithValue(errorMessage)
        }
    }
)

export const createAssistantPatientInCollection = createAsyncThunk(
    'assistant/patients/createPatientInCollection',
    async (patientData: Omit<CreateAssistantPatientRequest, 'password'>, { rejectWithValue }) => {
        try {
            const response = await assistantPatientService.createPatientInCollection(patientData)
            if (response.success) {
                return response.patient;
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add patient to collection')
        }
    }
)

export const updateAssistantPatient = createAsyncThunk(
    'assistant/patient/update-patient/:id',
    async ({ id, patientData }: { id: string; patientData: UpdateAssistantPatientRequest }, { rejectWithValue }) => {
        try {
            const response = await assistantPatientService.updatePatient(id, patientData)
            return response.patient
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to update patient';
            return rejectWithValue(errorMessage)
        }
    }
)

export const updateAssistantPatientStatus = createAsyncThunk(
    'assistant/patient/update-patient/status/:id',
    async ({ id, status }: { id: string; status: "active" | "inactive" | "pending_verification" | "suspended" }, { rejectWithValue, dispatch }) => {
        try {
            const response = await assistantPatientService.updatePatientStatus(id, status)
            await dispatch(fetchAssistantPatients()).unwrap()
            return { _id: id, status, data: response.patient }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
            return rejectWithValue(errorMessage || 'Failed to update patient status')
        }
    }
)

const assistantPatientSlice = createSlice({
    name: "assistantPatients",
    initialState,
    reducers: {
        setAssistantPatients: (state, action: PayloadAction<AssistantPatient[]>) => {
            state.assistantPatients = action.payload
        },
        addAssistantPatient: (state, action: PayloadAction<AssistantPatient>) => {
            state.assistantPatients.push(action.payload)
        },
        updateAssistantPatientInState: (state, action: PayloadAction<AssistantPatient>) => {
            const index = state.assistantPatients.findIndex((p) => p._id === action.payload._id)
            if (index !== -1) {
                state.assistantPatients[index] = action.payload
            }
        },
        removeAssistantPatient: (state, action: PayloadAction<string>) => {
            state.assistantPatients = state.assistantPatients.filter((p) => p._id !== action.payload)
        },
        clearAssistantPatient: (state) => {
            state.assistantPatient = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Patients
            .addCase(fetchAssistantPatients.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAssistantPatients.fulfilled, (state, action) => {
                state.loading = false
                state.assistantPatients = action.payload.patients || []
                state.pagination = action.payload.pagination || null
            })
            .addCase(fetchAssistantPatients.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Fetch Assistant Doctors
            .addCase(fetchAssistantDoctorsForPatient.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAssistantDoctorsForPatient.fulfilled, (state, action) => {
                state.loading = false
                state.assistantDoctors = action.payload
            })
            .addCase(fetchAssistantDoctorsForPatient.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Clear Assistant Doctors
            .addCase(clearAssistantDoctorsForPatient.fulfilled, (state) => {
                state.assistantDoctors = []
            })
            // Fetch Patient
            .addCase(fetchAssistantPatient.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAssistantPatient.fulfilled, (state, action) => {
                state.loading = false
                state.assistantPatient = action.payload as AssistantPatient
            })
            .addCase(fetchAssistantPatient.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Create Patient
            .addCase(createAssistantPatient.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createAssistantPatient.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.assistantPatients.push(action.payload as AssistantPatient)
                }
            })
            .addCase(createAssistantPatient.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Create Patient In Collection
            .addCase(createAssistantPatientInCollection.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createAssistantPatientInCollection.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.assistantPatients.push(action.payload as AssistantPatient)
                }
            })
            .addCase(createAssistantPatientInCollection.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Update Patient
            .addCase(updateAssistantPatient.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateAssistantPatient.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    const index = state.assistantPatients.findIndex((p) => p._id === action.payload._id)
                    if (index !== -1) {
                        state.assistantPatients[index] = action.payload as AssistantPatient
                    }
                    state.assistantPatient = action.payload as AssistantPatient
                }
            })
            .addCase(updateAssistantPatient.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Update Patient Status
            .addCase(updateAssistantPatientStatus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateAssistantPatientStatus.fulfilled, (state, action: PayloadAction<{ _id: string; status: string; data?: any }>) => {
                state.loading = false
                const index = state.assistantPatients.findIndex((p) => p._id === action.payload._id)
                if (index !== -1) {
                    state.assistantPatients[index].status = action.payload.status as "active" | "inactive" | "pending_verification" | "suspended"
                }
            })
            .addCase(updateAssistantPatientStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const {
    setAssistantPatients,
    addAssistantPatient,
    updateAssistantPatientInState,
    removeAssistantPatient,
    clearAssistantPatient,
} = assistantPatientSlice.actions

export default assistantPatientSlice.reducer
