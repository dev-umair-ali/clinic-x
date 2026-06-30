import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { clinicDoctorService, type CreateClinicDoctorRequest, type UpdateClinicDoctorRequest, type ClinicDoctorQueryParams } from "../api/services/clinicDoctorService"

export interface ClinicDoctor {
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

interface ClinicDoctorState {
    clinicDoctors: ClinicDoctor[]
    clinicDoctor: ClinicDoctor | null
    pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
    } | null
    loading: boolean
    error: string | null
}

const initialState: ClinicDoctorState = {
    clinicDoctors: [],
    clinicDoctor: null,
    pagination: null,
    loading: false,
    error: null,
}

// Async thunks for API operations
export const fetchClinicDoctors = createAsyncThunk(
    'clinic/doctor/all/doctors',
    async (params: ClinicDoctorQueryParams | undefined = undefined, { rejectWithValue }) => {
        try {
            const response = await clinicDoctorService.getDoctors(params)
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch doctors';
            return rejectWithValue(errorMessage)
        }
    }
)

export const fetchClinicDoctor = createAsyncThunk(
    'clinic/doctor/:id',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await clinicDoctorService.getDoctor(id)
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch doctor';
            return rejectWithValue(errorMessage)
        }
    }
)

export const createClinicDoctor = createAsyncThunk(
    'clinic/doctor/create-doctor',
    async (doctorData: CreateClinicDoctorRequest, { rejectWithValue }) => {
        try {
            const response = await clinicDoctorService.createDoctor(doctorData)
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

export const updateClinicDoctor = createAsyncThunk(
    'clinic/doctor/update-doctor/:id',
    async ({ id, doctorData }: { id: string; doctorData: UpdateClinicDoctorRequest }, { rejectWithValue, dispatch }) => {
        try {
            const response = await clinicDoctorService.updateDoctor(id, doctorData)
            return response.doctor
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to update doctor';
            return rejectWithValue(errorMessage)
        }
    }
)

export const updateClinicDoctorStatus = createAsyncThunk(
    'clinic/doctor/update-doctor/status/:id',
    async ({ id, status }: { id: string; status: "active" | "inactive" }, { rejectWithValue, dispatch }) => {
        try {
            const response = await clinicDoctorService.updateDoctorStatus(id, status)
            await dispatch(fetchClinicDoctors()).unwrap()
            return { _id: id, status, data: response.data }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
            return rejectWithValue(errorMessage || 'Failed to update doctor status')
        }
    }
)

const clinicDoctorSlice = createSlice({
    name: "clinicDoctors",
    initialState,
    reducers: {
        setClinicDoctors: (state, action: PayloadAction<ClinicDoctor[]>) => {
            state.clinicDoctors = action.payload
        },
        addClinicDoctor: (state, action: PayloadAction<ClinicDoctor>) => {
            state.clinicDoctors.push(action.payload)
        },
        updateClinicDoctorInState: (state, action: PayloadAction<ClinicDoctor>) => {
            const index = state.clinicDoctors.findIndex((d) => d._id === action.payload._id)
            if (index !== -1) {
                state.clinicDoctors[index] = action.payload
            }
        },
        removeClinicDoctor: (state, action: PayloadAction<string>) => {
            state.clinicDoctors = state.clinicDoctors.filter((d) => d._id !== action.payload)
        },
        clearClinicDoctor: (state) => {
            state.clinicDoctor = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Doctors
            .addCase(fetchClinicDoctors.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchClinicDoctors.fulfilled, (state, action: PayloadAction<{ doctors: ClinicDoctor[], pagination?: any }>) => {
                state.loading = false
                state.clinicDoctors = action.payload.doctors || []
                state.pagination = action.payload.pagination || null
            })
            .addCase(fetchClinicDoctors.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Fetch Doctor
            .addCase(fetchClinicDoctor.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchClinicDoctor.fulfilled, (state, action) => {
                state.loading = false
                state.clinicDoctor = action.payload as ClinicDoctor
            })
            .addCase(fetchClinicDoctor.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Create Doctor
            .addCase(createClinicDoctor.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(createClinicDoctor.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.clinicDoctors.push(action.payload as ClinicDoctor)
                }
            })
            .addCase(createClinicDoctor.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Update Doctor
            .addCase(updateClinicDoctor.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateClinicDoctor.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    const index = state.clinicDoctors.findIndex((d) => d._id === action.payload._id)
                    if (index !== -1) {
                        state.clinicDoctors[index] = action.payload as ClinicDoctor
                    }
                    state.clinicDoctor = action.payload as ClinicDoctor
                }
            })
            .addCase(updateClinicDoctor.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
            // Update Doctor Status
            .addCase(updateClinicDoctorStatus.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateClinicDoctorStatus.fulfilled, (state, action: PayloadAction<{ _id: string; status: string; data?: any }>) => {
                state.loading = false
                const index = state.clinicDoctors.findIndex((d) => d._id === action.payload._id)
                if (index !== -1) {
                    state.clinicDoctors[index].status = action.payload.status as "active" | "inactive"
                }
            })
            .addCase(updateClinicDoctorStatus.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const {
    setClinicDoctors,
    addClinicDoctor,
    updateClinicDoctorInState,
    removeClinicDoctor,
    clearClinicDoctor,
} = clinicDoctorSlice.actions

export default clinicDoctorSlice.reducer
