import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {
  doctorPatientService,
  DoctorPatient,
  CreateDoctorPatientRequest,
  UpdateDoctorPatientRequest,
} from '../api/services/doctorPatientService'

interface DoctorPatientState {
  patients: DoctorPatient[]
  doctorPatient: DoctorPatient | null
  loading: boolean
  error: string | null
  currentPatient: DoctorPatient | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  } | null
}

const initialState: DoctorPatientState = {
  patients: [],
  doctorPatient: null,
  loading: false,
  error: null,
  currentPatient: null,
  pagination: null,
}

// Async thunks
export const fetchDoctorPatients = createAsyncThunk(
  'doctorPatients/fetchDoctorPatients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await doctorPatientService.getDoctorPatients()
      return response.patients
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients')
    }
  }
)

export const fetchDoctorPatientById = createAsyncThunk(
  'doctorPatients/fetchDoctorPatientById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await doctorPatientService.getDoctorPatientById(id)
      return response.data.user
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patient')
    }
  }
)

export const createDoctorPatient = createAsyncThunk(
  'doctorPatients/createDoctorPatient',
  async (patientData: CreateDoctorPatientRequest, { rejectWithValue }) => {
    try {
      const response = await doctorPatientService.createDoctorPatient(patientData)
      return response.data.user
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create patient')
    }
  }
)

export const updateDoctorPatient = createAsyncThunk(
  'doctorPatients/updateDoctorPatient',
  async ({ id, patientData }: { id: string; patientData: UpdateDoctorPatientRequest }, { rejectWithValue, dispatch }) => {
    try {


      const response = await doctorPatientService.updateDoctorPatient(id, patientData)


      if (response.success) {

        // Fetch updated patient list after successful update
        await dispatch(fetchDoctorPatients()).unwrap()

        return response.data.user
      } else {
        return rejectWithValue(response.message || 'Failed to update patient')
      }
    } catch (error: any) {

      return rejectWithValue(error.response?.data?.message || 'Failed to update patient')
    }
  }
)

export const deleteDoctorPatient = createAsyncThunk(
  'doctorPatients/deleteDoctorPatient',
  async (id: string, { rejectWithValue, dispatch }) => {
    try {

      const response = await doctorPatientService.deleteDoctorPatient(id)

      if (response.success) {
        // Fetch updated patient list after successful deletion
        const fetchResult = await dispatch(fetchDoctorPatients()).unwrap()
        return id
      } else {
        return rejectWithValue(response.message || 'Failed to delete patient')
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete patient')
    }
  }
)

export const fetchPatientsByDoctorId = createAsyncThunk(
  'doctorPatients/fetchPatientsByDoctorId',
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const response = await doctorPatientService.getPatientByDoctorId(doctorId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients by doctor ID')
    }
  }
)


export const fetchDoctorPatient = createAsyncThunk(
  'doctor/patient/:id',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await doctorPatientService.getPatient(id)
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch patient';
      return rejectWithValue(errorMessage)
    }
  }
)

const doctorPatientSlice = createSlice({
  name: 'doctorPatients',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentPatient: (state, action: PayloadAction<DoctorPatient | null>) => {
      state.currentPatient = action.payload
    },
    clearCurrentPatient: (state) => {
      state.currentPatient = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all patients
      .addCase(fetchDoctorPatients.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDoctorPatients.fulfilled, (state, action) => {


        state.loading = false

        // Ensure we have an array to work with
        const patientsArray = Array.isArray(action.payload) ? action.payload : []


        // Ensure fullName is populated for each patient and handle both id and _id
        state.patients = patientsArray.map((patient, index) => {


          const mappedPatient = {
            ...patient,
            id: patient?._id || `temp-${Date.now()}-${index}`, // Ensure id is available
            _id: patient?._id || `temp-${Date.now()}-${index}`, // Ensure _id is available
            fullName: `${patient?.firstName || ''} ${patient?.lastName || ''}`.trim() || 'Unknown Patient',
            phone: patient?.phoneNumber || '',
            doctorRef: patient?.doctorRef || '',
            age: patient?.age || 0, // Ensure age is always a number
            createdAt: patient?.createdAt || '',
            updatedAt: patient?.updatedAt || ''
          }
          return mappedPatient
        })


        state.error = null
      })
      .addCase(fetchDoctorPatients.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch patient by ID
      .addCase(fetchDoctorPatientById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDoctorPatientById.fulfilled, (state, action) => {
        state.loading = false
        state.currentPatient = action.payload
        state.error = null
      })
      .addCase(fetchDoctorPatientById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Create patient
      .addCase(createDoctorPatient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createDoctorPatient.fulfilled, (state, action) => {
        state.loading = false
        const newPatient = {
          ...action.payload,
          id: action.payload.id || action.payload._id || `temp-${Date.now()}`, // Ensure id is available
          _id: action.payload._id || action.payload.id || `temp-${Date.now()}`, // Ensure _id is available
          fullName: `${action.payload.firstName || ''} ${action.payload.lastName || ''}`.trim() || 'Unknown Patient',
          phone: action.payload.phone || '',
          doctorRef: action.payload.doctorRef || ''
        }
        state.patients.push(newPatient)
        state.error = null
      })
      .addCase(createDoctorPatient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update patient
      .addCase(updateDoctorPatient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateDoctorPatient.fulfilled, (state, action) => {

        state.loading = false
        // The fetchDoctorPatients thunk will refresh the list, so we don't need to manually update
        // Just set the current patient if it matches
        const updatedPatient = {
          ...action.payload,
          id: action.payload.id || action.payload._id || `temp-${Date.now()}`,
          _id: action.payload._id || action.payload.id || `temp-${Date.now()}`,
          fullName: action.payload.fullName || `${action.payload.firstName || ''} ${action.payload.lastName || ''}`.trim() || 'Unknown Patient'
        }

        if (state.currentPatient?.id === action.payload.id ||
          state.currentPatient?._id === action.payload._id ||
          state.currentPatient?.id === action.payload._id ||
          state.currentPatient?._id === action.payload.id) {
          state.currentPatient = updatedPatient
        }
        state.error = null
      })
      .addCase(updateDoctorPatient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Delete patient
      .addCase(deleteDoctorPatient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteDoctorPatient.fulfilled, (state, action) => {
        state.loading = false
        // Don't filter locally since we're fetching updated list from server
        state.error = null
      })
      .addCase(deleteDoctorPatient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch patients by doctor ID
      .addCase(fetchPatientsByDoctorId.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPatientsByDoctorId.fulfilled, (state, action) => {
        state.loading = false
        // Ensure fullName is populated for each patient and handle both id and _id
        state.patients = action.payload.map((patient, index) => ({
          ...patient,
          id: patient.id || patient._id || `temp-${Date.now()}-${index}`, // Ensure id is available
          _id: patient._id || patient.id || `temp-${Date.now()}-${index}`, // Ensure _id is available
          fullName: `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Unknown Patient',
          phone: patient.phone || '',
          doctorRef: patient.doctorRef || ''
        }))
        state.error = null
      })
      .addCase(fetchPatientsByDoctorId.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch Patient
      .addCase(fetchDoctorPatient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDoctorPatient.fulfilled, (state, action) => {
        state.loading = false
        state.doctorPatient = action.payload
      })
      .addCase(fetchDoctorPatient.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { clearError, setCurrentPatient, clearCurrentPatient } = doctorPatientSlice.actions
export default doctorPatientSlice.reducer
