import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { patientService, type CreatePatientRequest, type UpdatePatientRequest } from "../api/services/patientService"

export interface Patient {
  profilePicture?: string
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  password?: string
  phone: string
  phoneNumber?: string
  age: number
  dateOfBirth: string
  DateOfBirth?: string
  gender: "male" | "female" | "other"
  bloodType?: string
  BloodType?: string
  assignedDoctor?: string
  insuranceInfo?: string
  medicalHistory?: string
  MedicalHistory?: string
  allergies?: string
  Allergies?: string
  currentMedication?: string
  CurrentMedication?: string
  insuranceProvide?: string
  InsuranceProvide?: string
  eContactName?: string
  EContactName?: string
  ePhoneNumber?: string
  EPhoneNumber?: string
  eRelationship?: string
  ERelationship?: string
  PrimaryDoctor?: string
  primaryDoctor?: string
  address: string
  status: "active" | "inactive"
  role: "patient"
  lastVisit: string
  avatar?: string
  prescriptions?: string[]
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelationship?: string
  allergiesArray?: string[]
  medicationsArray?: string[]
  assignedClinic?: string[],
}

interface PatientState {
  patients: Patient[]
  patient: Patient | null
  loading: boolean
  error: string | null
}

const initialState: PatientState = {
  patients: [],
  patient: null,
  loading: false,
  error: null,
}

// Async thunks for API operations
export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientService.getPatients()
      
      return response;
    } catch (error: any) {
      console.error('Error in fetchPatients:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients')
    }
  }
)

export const fetchPatient = createAsyncThunk(
  'patients/fetchPatient',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await patientService.getPatient(id)
      return response;
    } catch (error: any) {
      console.error('Error in fetchPatient:', error)
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patient')
    }
  }
)

export const createPatient = createAsyncThunk(
  'patients/createPatient',
  async (patientData: CreatePatientRequest, { rejectWithValue }) => {
    try {
      const response = await patientService.createPatient(patientData)
      if (response.success) {
        return response.data
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create patient')
    }
  }
)

export const createPatientInCollection = createAsyncThunk(
  'patients/createPatientInCollection',
  async (patientData: Omit<CreatePatientRequest, 'password'>, { rejectWithValue }) => {
    try {
      const response = await patientService.createPatientInCollection(patientData)
      if (response.success) {
        return response.data
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add patient to collection')
    }
  }
)

export const updatePatient = createAsyncThunk(
  'patients/updatePatient',
  async ({ id, patientData }: { id: string; patientData: UpdatePatientRequest }, { rejectWithValue }) => {
    try {
      const response = await patientService.updatePatient(id, patientData)
      if (response.success) {
        return response.data
      } else {
        return rejectWithValue(response.message || 'Failed to update patient')
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update patient')
    }
  }
)

export const updatePatientStatus = createAsyncThunk(
  'patients/updatePatientStatus',
  async ({id, status}: {id: string, status: string}, { rejectWithValue }) => {
    try {
      const response = await patientService.updatePatientStatus(id, status)
      if (response.success) {
        return id
      } 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update patient status')
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
      const index = state.patients.findIndex((patient) => patient.id === action.payload.id)
      if (index !== -1) {
        state.patients[index] = action.payload
      }
    },
    deletePatientLocal: (state, action: PayloadAction<string>) => {
      state.patients = state.patients.filter((patient) => patient.id !== action.payload)
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

        // Handle different possible response structures
        let patientsArray = action.payload

        // Check if payload has a data property (wrapped response)
        if (action.payload && typeof action.payload === 'object' && 'data' in action.payload) {
          patientsArray = (action.payload as any).data
        }

        // Check if payload is directly an array (direct response)
        if (Array.isArray(action.payload)) {
         
          patientsArray = action.payload
        }

        if (Array.isArray(patientsArray)) {
          const mappedPatients = patientsArray.map((patient: any, index: number) => {

            const mappedPatient = {
              id: patient._id || patient.id || `temp-${Date.now()}-${index}`,
              firstName: patient.firstName || '',
              lastName: patient.lastName || '',
              fullName: patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Unknown Patient',
              email: patient.email || '',
              phone: patient.phone || '',
              age: patient.age || 0,
              dateOfBirth: patient.dateOfBirth || '',
              gender: patient.gender || 'male',
              bloodType: patient.bloodType || '',
              assignedDoctor: patient.assignedDoctor || '',
              insuranceInfo: patient.insuranceInfo || '',
              medicalHistory: patient.medicalHistory || '',
              address: patient.address || '',
              status: patient.status || 'active',
              role: 'patient' as const,
              lastVisit: patient.lastVisit || "",
              avatar: patient.avatar || '',
              prescriptions: patient.prescriptions || [],
              profilePicture: patient.profilePicture || '',
              allergies: patient.allergies || '',
              currentMedication: patient.currentMedication || '',
              insuranceProvide: patient.insuranceProvide || '',
              eContactName: patient.eContactName || patient.emergencyContactName || '',
              ePhoneNumber: patient.ePhoneNumber || patient.emergencyContactPhone || '',
              eRelationship: patient.eRelationship || patient.emergencyContactRelationship || '',
              assignedClinic: patient.assignedClinic || [],
            } as Patient

            return mappedPatient
          })
          state.patients = mappedPatients
        } else {
          state.patients = []
        }
        state.error = null
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string | null
      })
      .addCase(fetchPatient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPatient.fulfilled, (state, action) => {
        state.loading = false
        // Handle the single patient response
        const responseData = action.payload as any
        const patientData = responseData.data?.user || responseData.data || responseData
        
        const mappedPatient: Patient = {
          id: patientData._id || patientData.id,
          firstName: patientData.firstName || '',
          lastName: patientData.lastName || '',
          fullName: patientData.fullName || `${patientData.firstName || ''} ${patientData.lastName || ''}`.trim() || 'Unknown Patient',
          email: patientData.email || '',
          phone: patientData.phone || '',
          age: patientData.age || 0,
          dateOfBirth: patientData.dateOfBirth || '',
          gender: patientData.gender || 'male',
          bloodType: patientData.bloodType || '',
          assignedDoctor: patientData.assignedDoctor || patientData.primaryDoctor || patientData.PrimaryDoctor || '',
          insuranceInfo: patientData.insuranceInfo || '',
          medicalHistory: patientData.medicalHistory || '',
          address: patientData.address || '',
          status: patientData.status || 'active',
          role: 'patient' as const,
          lastVisit: patientData.lastVisit || '',
          avatar: patientData.avatar || patientData.profilePicture || '',
          prescriptions: patientData.prescriptions || [],
          profilePicture: patientData.profilePicture || '',
          // Add other fields that might be missing
          allergies: patientData.allergies || '',
          currentMedication: patientData.currentMedication || '',
          insuranceProvide: patientData.insuranceProvide || '',
          eContactName: patientData.eContactName || patientData.emergencyContactName || '',
          ePhoneNumber: patientData.ePhoneNumber || patientData.emergencyContactPhone || '',
          eRelationship: patientData.eRelationship || patientData.emergencyContactRelationship || '',
          emergencyContactName: patientData.emergencyContactName || patientData.eContactName || '',
          emergencyContactPhone: patientData.emergencyContactPhone || patientData.ePhoneNumber || '',
          emergencyContactRelationship: patientData.emergencyContactRelationship || patientData.eRelationship || '',
          allergiesArray: patientData.allergiesArray || [],
          medicationsArray: patientData.medicationsArray || [],
        }
        state.patient = mappedPatient
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
        const newPatient: Patient = {
          id: action.payload?.user.id || ''   ,
          firstName: action.payload?.user.firstName || '',
          lastName: action.payload?.user.lastName || '',
          fullName: action.payload?.user.fullName || '',
          email: action.payload?.user.email || '',
          phone: action.payload?.user.phone || '',
          age: action.payload?.user.age || 0,
          dateOfBirth: action.payload?.user.dateOfBirth || '',
          gender: action.payload?.user.gender || 'male' ,
          bloodType: action.payload?.user.bloodType || '',
          assignedDoctor: action.payload?.user.assignedDoctor || '',
          insuranceInfo: action.payload?.user.insuranceInfo || '',
          medicalHistory: action.payload?.user.medicalHistory || '',
          address: action.payload?.user.address || '',
          status: action.payload?.user.status || 'active',
          role: action.payload?.user.role || 'patient',
          lastVisit: "",
          prescriptions: [],
          profilePicture: action.payload?.user.profilePicture || ''
        }
        state.patients.push(newPatient)
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
        const updatedPatient: Patient = {
          id: action.payload.user.id,
          firstName: action.payload.user.firstName,
          lastName: action.payload.user.lastName,
          fullName: action.payload.user.fullName,
          email: action.payload.user.email,
          phone: action.payload.user.phone,
          age: action.payload.user.age,
          dateOfBirth: action.payload.user.dateOfBirth,
          gender: action.payload.user.gender,
          bloodType: action.payload.user.bloodType,
          assignedDoctor: action.payload.user.assignedDoctor,
          insuranceInfo: action.payload.user.insuranceInfo,
          medicalHistory: action.payload.user.medicalHistory,
          address: action.payload.user.address,
          status: action.payload.user.status,
          role: action.payload.user.role,
          lastVisit: "",
          avatar: action.payload.user.avatar || '',
          prescriptions: [],
          profilePicture: action.payload.user.profilePicture || ''
        }
        const index = state.patients.findIndex((patient) => patient.id === updatedPatient.id)
        if (index !== -1) {
          state.patients[index] = updatedPatient
        }
        state.error = null
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Delete patient
    builder
      .addCase(updatePatientStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePatientStatus.fulfilled, (state, action) => {
        state.loading = false
        state.patients = state.patients.filter((patient) => patient.id !== action.payload)
        state.error = null
      })
      .addCase(updatePatientStatus.rejected, (state, action) => {
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
  debugState
} = patientSlice.actions

export default patientSlice.reducer
