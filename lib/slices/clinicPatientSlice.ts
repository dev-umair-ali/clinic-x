import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { clinicPatientService, type CreateClinicPatientRequest, type UpdateClinicPatientRequest, type ClinicPatientQueryParams } from "../api/services/clinicPatientService"
import { clinicDoctorService } from "../api/services/clinicDoctorService"

export interface ClinicPatient {
    _id?: string
    userRef: string
    userId?: string
    clinicRef: string
    doctorRef?: string
    firstName: string
    lastName: string
    email?: string
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

interface ClinicPatientState {
    clinicPatients: ClinicPatient[]
    clinicPatient: ClinicPatient | null
    clinicDoctors: any[]
    pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
    } | null
    loading: boolean
    error: string | null
}

const initialState: ClinicPatientState = {
    clinicPatients: [],
    clinicPatient: null,
    clinicDoctors: [],
    pagination: null,
    loading: false,
    error: null,
}

// Async thunks for API operations
export const fetchClinicPatients = createAsyncThunk(
    'clinic/patient/all/patients',
    async (params: ClinicPatientQueryParams | undefined = undefined, { rejectWithValue }) => {
        try {
            const response = await clinicPatientService.getPatients(params)
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch patients';
            return rejectWithValue(errorMessage)
        }
    }
)

export const fetchClinicDoctorsForPatient = createAsyncThunk(
    'clinic/patient/fetch-clinic-doctors',
    async (clinicRef: string, { rejectWithValue }) => {
        try {
            const response = await clinicDoctorService.getDoctors({ clinicRef })
            return response.doctors || []
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch clinic doctors';
            return rejectWithValue(errorMessage)
        }
    }
)

export const clearClinicDoctorsForPatient = createAsyncThunk(
    'clinic/patient/clear-clinic-doctors',
    async () => {
        return []
    }
)

export const fetchClinicPatient = createAsyncThunk(
    'clinic/patient/:id',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await clinicPatientService.getPatient(id)
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch patient';
            return rejectWithValue(errorMessage)
        }
    }
)

export const createClinicPatient = createAsyncThunk(
    'clinic/patient/create-patient',
    async (patientData: CreateClinicPatientRequest, { rejectWithValue }) => {
        try {
            const response = await clinicPatientService.createPatient(patientData)
            return response.patient
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create patient';
            return rejectWithValue(errorMessage)
        }
    }
)

export const createClinicPatientInCollection = createAsyncThunk(
    'clinic/patients/createPatientInCollection',
    async (patientData: Omit<CreateClinicPatientRequest, 'password'>, { rejectWithValue }) => {
        try {
            const response = await clinicPatientService.createPatientInCollection(patientData)
            if (response.success) {
                return response.patient;
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add patient to collection')
        }
    }
)

export const updateClinicPatient = createAsyncThunk(
    'clinic/patient/update-patient/:id',
    async ({ id, patientData }: { id: string; patientData: UpdateClinicPatientRequest }, { rejectWithValue }) => {
        try {
            const response = await clinicPatientService.updatePatient(id, patientData)
            return response.patient
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to update patient';
            return rejectWithValue(errorMessage)
        }
    }
)

export const updateClinicPatientStatus = createAsyncThunk(
    'clinic/patient/update-patient/status/:id',
    async ({ id, status }: { id: string; status: "active" | "inactive" | "pending_verification" | "suspended" }, { rejectWithValue, dispatch }) => {
        try {
            const response = await clinicPatientService.updatePatientStatus(id, status)
            await dispatch(fetchClinicPatients()).unwrap()
            return { _id: id, status, data: response.patient }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
            return rejectWithValue(errorMessage || 'Failed to update patient status')
        }
    }
)

const clinicPatientSlice = createSlice({
    name: "clinicPatients",
    initialState,
    reducers: {
        setClinicPatients: (state, action: PayloadAction<ClinicPatient[]>) => {
            state.clinicPatients = action.payload
        },
        addClinicPatient: (state, action: PayloadAction<ClinicPatient>) => {
            state.clinicPatients.push(action.payload)
        },
        updateClinicPatientInState: (state, action: PayloadAction<ClinicPatient>) => {
            const index = state.clinicPatients.findIndex((p) => p._id === action.payload._id)
            if (index !== -1) {
                state.clinicPatients[index] = action.payload
            }
        },
        removeClinicPatient: (state, action: PayloadAction<string>) => {
            state.clinicPatients = state.clinicPatients.filter((p) => p._id !== action.payload)
        },
        clearClinicPatient: (state) => {
            state.clinicPatient = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Patients
            .addCase(fetchClinicPatients.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchClinicPatients.fulfilled, (state, action: PayloadAction<{ patients: ClinicPatient[], pagination?: any }>) => {
                state.loading = false
                state.clinicPatients = action.payload.patients || []
                state.pagination = action.payload.pagination || null
            })
            .addCase(fetchClinicPatients.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Fetch Clinic Doctors
            .addCase(fetchClinicDoctorsForPatient.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchClinicDoctorsForPatient.fulfilled, (state, action) => {
                state.loading = false
                state.clinicDoctors = action.payload
            })
            .addCase(fetchClinicDoctorsForPatient.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Clear Clinic Doctors
            .addCase(clearClinicDoctorsForPatient.fulfilled, (state) => {
                state.clinicDoctors = []
            })
            // Fetch Patient
            .addCase(fetchClinicPatient.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchClinicPatient.fulfilled, (state, action) => {
                state.loading = false
                state.clinicPatient = action.payload as ClinicPatient
            })
            .addCase(fetchClinicPatient.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Create Patient
            .addCase(createClinicPatient.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createClinicPatient.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.clinicPatients.push(action.payload as ClinicPatient)
                }
            })
            .addCase(createClinicPatient.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Create Patient In Collection
            .addCase(createClinicPatientInCollection.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createClinicPatientInCollection.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.clinicPatients.push(action.payload as ClinicPatient)
                }
            })
            .addCase(createClinicPatientInCollection.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Update Patient
            .addCase(updateClinicPatient.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateClinicPatient.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    const index = state.clinicPatients.findIndex((p) => p._id === action.payload._id)
                    if (index !== -1) {
                        state.clinicPatients[index] = action.payload as ClinicPatient
                    }
                    state.clinicPatient = action.payload as ClinicPatient
                }
            })
            .addCase(updateClinicPatient.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Update Patient Status
            .addCase(updateClinicPatientStatus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateClinicPatientStatus.fulfilled, (state, action: PayloadAction<{ _id: string; status: string; data?: any }>) => {
                state.loading = false
                const index = state.clinicPatients.findIndex((p) => p._id === action.payload._id)
                if (index !== -1) {
                    state.clinicPatients[index].status = action.payload.status as "active" | "inactive" | "pending_verification" | "suspended"
                }
            })
            .addCase(updateClinicPatientStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const {
    setClinicPatients,
    addClinicPatient,
    updateClinicPatientInState,
    removeClinicPatient,
    clearClinicPatient,
} = clinicPatientSlice.actions

export default clinicPatientSlice.reducer
