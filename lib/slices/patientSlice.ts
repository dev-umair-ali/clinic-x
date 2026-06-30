import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { patientService, type CreatePatientRequest, type UpdatePatientRequest, type PatientQueryParams } from "../api/services/patientService"
import { doctorService } from "../api/services/doctorService"

export interface Patient {
  _id?: string
  userRef: string
  userId?: string
  clinicRef: string
  doctorRef?: string
  firstName: string
  lastName: string
  fullName?: string
  displayName?: string
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
  address: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  status: "active" | "inactive" | "pending_verification" | "suspended"
  role?: "patient"

  // Form references
  onboardingFormRef?: string
  medicalProfileFormRef?: string
  insuranceFormRef?: string
  dentalHistoryFormRef?: string
  historyHealthFormRef?: string
  lifeStyleFormRef?: string
  womenFormRef?: string
  constantLegalFormRef?: string
  presentConditionFormRef?: string

  // Form completion status
  formsCompleted?: {
    onboarding?: boolean
    medicalProfile?: boolean
    insurance?: boolean
    dentalHistory?: boolean
    historyHealth?: boolean
    lifeStyle?: boolean
    women?: boolean
    constantLegal?: boolean
    presentCondition?: boolean
  }

  formCompletionPercentage?: number
  incompleteForms?: string[]

  isEmailVerified?: boolean
  emailVerificationToken?: string
  emailVerificationExpires?: string

  // eRx Integration
  erxPatientId?: string
  erxDoctorId?: string

  createdBy?: string
  updatedBy?: string
  createdAt?: string
  updatedAt?: string

  // Legacy/backward compatibility fields
  lastVisit?: string
  prescriptions?: string[]
}

interface PatientState {
  patients: Patient[]
  patient: Patient | null
  clinicDoctors: any[] // Doctors filtered by selected clinic
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  } | null
  loading: boolean
  error: string | null
}

const initialState: PatientState = {
  patients: [],
  patient: null,
  clinicDoctors: [],
  pagination: null,
  loading: false,
  error: null,
}

// Async thunks for API operations
export const fetchPatients = createAsyncThunk(
  'admin/patient/all/patients',
  async (params: PatientQueryParams | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await patientService.getPatients(params)
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch patients';
      return rejectWithValue(errorMessage)
    }
  }
)

export const fetchPatient = createAsyncThunk(
  'admin/patient/:id',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await patientService.getPatient(id)
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch patient';
      return rejectWithValue(errorMessage)
    }
  }
)

export const createPatient = createAsyncThunk(
  'admin/patient/create-patient',
  async (patientData: CreatePatientRequest, { rejectWithValue }) => {
    try {
      const response = await patientService.createPatient(patientData)
      return response.patient
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create patient';
      return rejectWithValue(errorMessage)
    }
  }
)

export const createPatientInCollection = createAsyncThunk(
  'patients/createPatientInCollection',
  async (patientData: Omit<CreatePatientRequest, 'password'>, { rejectWithValue }) => {
    try {
      const response = await patientService.createPatientInCollection(patientData)
      if (response.success) {
        return response.patient;
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add patient to collection')
    }
  }
)

export const updatePatient = createAsyncThunk(
  'admin/patient/update-patient/:id',
  async ({ id, patientData }: { id: string; patientData: UpdatePatientRequest }, { rejectWithValue }) => {
    try {
      const response = await patientService.updatePatient(id, patientData)
      return response.patient
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to update patient';
      return rejectWithValue(errorMessage)
    }
  }
)

export const updatePatientStatus = createAsyncThunk(
  'admin/patient/update-patient/status/:id',
  async ({ id, status }: { id: string; status: "active" | "inactive" | "pending_verification" | "suspended" }, { rejectWithValue }) => {
    try {
      const response = await patientService.updatePatientStatus(id, status)
      fetchPatients({})
      return { id, status }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to update patient status';
      return rejectWithValue(errorMessage)
    }
  }
)

export const fetchClinicDoctors = createAsyncThunk(
  'patients/fetchClinicDoctors',
  async (params: string, { rejectWithValue }) => {
    try {
      // Fetch all doctors and filter by clinic on frontend, or update backend to support clinicRef
      const response = await doctorService.getDoctorsByClinicId(params ? { clinicId: params } : undefined)
      // Filter doctors by clinic ID (using clinicRef field)
      const clinicDoctors = response.doctors || []
      return clinicDoctors
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch clinic doctors';
      return rejectWithValue(errorMessage)
    }
  }
)


export const fetchClinicDoctorsByAssistant = createAsyncThunk(
  'patients/fetchClinicDoctorsByAssistant',
  async (params: string, { rejectWithValue }) => {
    try {
      // Fetch all doctors and filter by clinic on frontend, or update backend to support clinicRef
      const response = await doctorService.getDoctorsByClinicIdByAssistant(params ? { clinicId: params } : undefined)
      // Filter doctors by clinic ID (using clinicRef field)
      const clinicDoctors = response.doctors || []
      return clinicDoctors
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch clinic doctors';
      return rejectWithValue(errorMessage)
    }
  }
)


export const fetchClinicDoctorsByClinic = createAsyncThunk(
  'patients/fetchClinicDoctorsByClinic',
  async (params: string, { rejectWithValue }) => {
    try {
      // Fetch all doctors and filter by clinic on frontend, or update backend to support clinicRef
      const response = await doctorService.getDoctorsByClinicIdByClinic(params ? { clinicId: params } : undefined)
      // Filter doctors by clinic ID (using clinicRef field)
      const clinicDoctors = response.doctors || []
      return clinicDoctors
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch clinic doctors';
      return rejectWithValue(errorMessage)
    }
  }
)

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload
    },
    addPatient: (state, action: PayloadAction<Patient>) => {
      state.patients.push(action.payload)
    },
    updatePatientLocal: (state, action: PayloadAction<Patient>) => {
      const index = state.patients.findIndex((patient) => patient._id === action.payload._id)
      if (index !== -1) {
        state.patients[index] = action.payload
      }
    },
    deletePatientLocal: (state, action: PayloadAction<string>) => {
      state.patients = state.patients.filter((patient) => patient._id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearPatient: (state) => {
      state.patient = null
    },
    clearClinicDoctors: (state) => {
      state.clinicDoctors = []
    },
    debugState: (state) => {

    },
  },
  extraReducers: (builder) => {
    // Fetch patients
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false
        // Response is PatientsListResponse with patients array
        state.patients = action.payload.patients || []
        state.pagination = action.payload.pagination || null
        state.error = null
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string | null
      })

    // Fetch patient
    builder
      .addCase(fetchPatient.pending, (state) => {
        state.loading = true
        state.error = null
        state.patient = null // Clear previous patient data
      })
      .addCase(fetchPatient.fulfilled, (state, action) => {
        state.loading = false
        // action.payload is already the patient data object
        state.patient = action.payload || null
        state.error = null
      })
      .addCase(fetchPatient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string | null
      })

    // Create patient
    builder
      .addCase(createPatient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.loading = false
        state.patients.push(action.payload)
        state.error = null
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Create patient in collection
    builder
      .addCase(createPatientInCollection.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPatientInCollection.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.patients.push(action.payload)
        }
        state.error = null
      })
      .addCase(createPatientInCollection.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Update patient
    builder
      .addCase(updatePatient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.loading = false
        const index = state.patients.findIndex((p) => p._id === action.payload._id)
        if (index !== -1) {
          state.patients[index] = action.payload
        }
        state.patient = action.payload
        state.error = null
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Update patient status
    builder
      .addCase(updatePatientStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePatientStatus.fulfilled, (state, action) => {
        state.loading = false
        const patient = state.patients.find((p) => p._id === action.payload.id)
        if (patient) {
          patient.status = action.payload.status
        }
        state.error = null
      })
      .addCase(updatePatientStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch clinic doctors
    builder
      .addCase(fetchClinicDoctors.pending, (state) => {
        // state.loading = true
        state.error = null
      })
      .addCase(fetchClinicDoctors.fulfilled, (state, action) => {
        state.loading = false
        state.clinicDoctors = action.payload
        state.error = null
      })
      .addCase(fetchClinicDoctors.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

       // Fetch clinic doctors
    builder
      .addCase(fetchClinicDoctorsByAssistant.pending, (state) => {
        // state.loading = true
        state.error = null
      })
      .addCase(fetchClinicDoctorsByAssistant.fulfilled, (state, action) => {
        state.loading = false
        state.clinicDoctors = action.payload
        state.error = null
      })
      .addCase(fetchClinicDoctorsByAssistant.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

       // Fetch clinic doctors
    builder
      .addCase(fetchClinicDoctorsByClinic.pending, (state) => {
        // state.loading = true
        state.error = null
      })
      .addCase(fetchClinicDoctorsByClinic.fulfilled, (state, action) => {
        state.loading = false
        state.clinicDoctors = action.payload
        state.error = null
      })
      .addCase(fetchClinicDoctorsByClinic.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })


      
  }
})

export const {
  setPatients,
  addPatient,
  updatePatientLocal,
  deletePatientLocal,
  setLoading,
  clearError,
  clearPatient,
  clearClinicDoctors,
  debugState
} = patientSlice.actions

export default patientSlice.reducer
