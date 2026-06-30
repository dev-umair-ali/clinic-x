import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { doctorService, type CreateDoctorRequest, type UpdateDoctorRequest, type DoctorQueryParams } from "../api/services/doctorService"

export interface Doctor {
  _id?: string
  userRef?: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  age: number
  dateOfBirth?: string
  gender: "male" | "female" | "other"
  address: string | {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  }
  specialization: string
  yearsOfExperience?: number
  licenseNumber: string
  bio?: string | object
  educationSummary?: string | object
  status?: "active" | "inactive" | "pending_verification" | "suspended",
  role: "doctor"
  profilePicture?: string
  languages?: string[]
  clinicRef?: string | {
    _id: string;
    clinicName: string;
    [key: string]: any;
  };
  hipaaConsent?: boolean
  createdBy?: string
  updatedBy?: string
  createdAt?: string
  updatedAt?: string
}

interface DoctorState {
  doctors: Doctor[]
  doctor: Doctor | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  } | null
  loading: boolean
  error: string | null
}

const initialState: DoctorState = {
  doctors: [],
  doctor: null,
  pagination: null,
  loading: false,
  error: null,
}

// Async thunks for API operations
export const fetchDoctors = createAsyncThunk(
  'admin/doctor/all/doctors',
  async (params: DoctorQueryParams | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctors(params)
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch doctors';
      return rejectWithValue(errorMessage)
    }
  }
)

export const fetchDoctor = createAsyncThunk(
  'admin/doctor/:id',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctor(id)
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch doctor';
      return rejectWithValue(errorMessage)
    }
  }
)

export const createDoctor = createAsyncThunk(
  'admin/doctor/create-doctor',
  async (doctorData: CreateDoctorRequest, { rejectWithValue }) => {
    try {
      const response = await doctorService.createDoctor(doctorData)

      return response?.doctor
    } catch (error: any) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const firstError = Object.values(validationErrors)[0];
        return rejectWithValue(Array.isArray(firstError) ? firstError[0] : 'Validation error');
      }
      // Handle other structured errors
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      return rejectWithValue(errorMessage || 'Failed to create doctor')
    }
  }
)

export const updateDoctor = createAsyncThunk(
  'admin/doctor/update-doctor/:id',
  async ({ id, doctorData }: { id: string; doctorData: UpdateDoctorRequest }, { rejectWithValue }) => {
    try {
      const response = await doctorService.updateDoctor(id, doctorData)
      return response?.doctor
    } catch (error: any) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        const firstError = Object.values(validationErrors)[0];
        return rejectWithValue(Array.isArray(firstError) ? firstError[0] : 'Validation error');
      }
      // Handle other structured errors
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      return rejectWithValue(errorMessage || 'Failed to update doctor')
    }
  }
)

export const updateDoctorStatus = createAsyncThunk(
  'admin/doctor/update-doctor/status/:id',
  async ({ id, status }: { id: string; status: "active" | "inactive" }, { rejectWithValue, dispatch }) => {
    try {
      const response = await doctorService.updateDoctorStatus(id, status)
      await dispatch(fetchDoctors()).unwrap()
      return { _id: id, status, data: response.data }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message;

      return rejectWithValue(errorMessage || 'Failed to update doctor status')
    }
  }
)


const doctorSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    setDoctors: (state, action: PayloadAction<Doctor[]>) => {
      state.doctors = action.payload
    },
    addDoctor: (state, action: PayloadAction<Doctor>) => {
      state.doctors.push(action.payload)
    },
    updateDoctorLocal: (state, action: PayloadAction<Doctor>) => {
      const index = state.doctors.findIndex((doctor) => doctor._id === action.payload._id)
      if (index !== -1) {
        state.doctors[index] = action.payload
      }
    },
    deleteDoctorLocal: (state, action: PayloadAction<string>) => {
      state.doctors = state.doctors.filter((doctor) => doctor._id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearDoctor: (state) => {
      state.doctor = null
    },
    debugState: (state) => {

    },
  },
  extraReducers: (builder) => {
    // Fetch doctors
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDoctors.fulfilled, (state, action: PayloadAction<{ doctors: Doctor[], pagination?: any }>) => {
        state.loading = false
        state.doctors = action.payload.doctors
        state.pagination = action.payload.pagination || null
        state.error = null
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string | null
      })
      .addCase(fetchDoctor.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDoctor.fulfilled, (state, action: PayloadAction<Doctor>) => {
        state.loading = false
        state.doctor = action.payload
        state.error = null
      })
      .addCase(fetchDoctor.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string | null
      })

    // Create doctor
    builder
      .addCase(createDoctor.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createDoctor.fulfilled, (state, action) => {
        state.loading = false
        state.doctors.push(action.payload)
        state.error = null
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Update doctor
    builder
      .addCase(updateDoctor.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        state.loading = false
        const index = state.doctors.findIndex((d) => d._id === action.payload._id)
        if (index !== -1) {
          state.doctors[index] = action.payload
        }
        state.doctor = action.payload
        state.error = null
      })
      .addCase(updateDoctor.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Update doctor status
    builder
      .addCase(updateDoctorStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateDoctorStatus.fulfilled, (state, action) => {
        state.loading = false
        const doctor = state.doctors.find((d) => d._id === action.payload._id)
        if (doctor) {
          doctor.status = action.payload.status
        }
        state.error = null
      })
      .addCase(updateDoctorStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const {
  setDoctors,
  addDoctor,
  updateDoctorLocal,
  deleteDoctorLocal,
  setLoading,
  clearError,
  clearDoctor,
  debugState
} = doctorSlice.actions

export default doctorSlice.reducer