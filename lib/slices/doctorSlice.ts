import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { doctorService, type CreateDoctorRequest, type UpdateDoctorRequest } from "../api/services/doctorService"
import { toast } from "react-toastify"

export interface Doctor {
  profilePicture: any
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  password?: string
  phone: string
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
  experience: number
  licenseNumber: string
  bio?: string | object
  educationSummary?: string | object
  status?: "active" | "inactive"
  role: "doctor"
  avatar?: string
  // Additional fields for comprehensive doctor data
  languages?: string[]
  timeZone?: string
  availableDays?: Array<{
    day: string
    from: string
    to: string
  }>
  assignedClinic?: string
  hipaaConsent?: boolean
}

interface DoctorState {
  doctors: Doctor[]
  doctor: Doctor | null
  loading: boolean
  error: string | null
}

const initialState: DoctorState = {
  doctors: [],
  doctor: null,
  loading: false,
  error: null,
}

// Async thunks for API operations
export const fetchDoctors = createAsyncThunk(
  'doctors/fetchDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctors()
      return response;
    } catch (error: any) {  
      const errorMessage = error.response?.data?.error;
      const result = errorMessage ? errorMessage.split(':').pop()?.trim() : 'Failed to fetch doctors';
      return rejectWithValue(result)
    }
  }
)

export const fetchDoctor = createAsyncThunk(
  'doctors/fetchDoctor',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await doctorService.getDoctor(id)
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error;
      const result = errorMessage ? errorMessage.split(':').pop()?.trim() : 'Failed to fetch doctor';
      return rejectWithValue(result)
    }
  }
)

export const createDoctor = createAsyncThunk(
  'doctors/createDoctor',
  async (doctorData: CreateDoctorRequest, { rejectWithValue }) => {
    try {
      const response = await doctorService.createDoctor(doctorData)
      if (response.success) {
        return response.data
      } else {
        return rejectWithValue(response.message)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error;
      const result = errorMessage ? errorMessage.split(':').pop()?.trim() : 'Failed to create doctor';
      return rejectWithValue(result)
    }
  }
)

export const createDoctorInCollection = createAsyncThunk(
  'doctors/createDoctorInCollection',
  async (doctorData: Omit<CreateDoctorRequest, 'password'>, { rejectWithValue }) => {
    try {
     
      const response = await doctorService.createDoctorInCollection(doctorData)
      if (response.success) {
        toast.success("Doctor added successfully!")
        return response.data
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error;
      const result = errorMessage ? errorMessage.split(':').pop()?.trim() : 'Failed to add doctor to collection';
      return rejectWithValue(result)
    }
  }
)

export const updateDoctor = createAsyncThunk(
  'doctors/updateDoctor',
  async ({ id, doctorData }: { id: string; doctorData: UpdateDoctorRequest }, { rejectWithValue }) => {
    try {
      const response = await doctorService.updateDoctor(id, doctorData)
      if (response.success) {
        toast.success("Doctor updated successfully!")
        return response.data
      } else {
        return rejectWithValue(response.message)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error;
      const result = errorMessage ? errorMessage.split(':').pop()?.trim() : 'Failed to update doctor';
      return rejectWithValue(result)
    }
  }
)

export const updateDoctorStatus = createAsyncThunk(
  'doctors/updateDoctorStatus',
  async ({ id, status }: { id: string; status: "active" | "inactive" }, { rejectWithValue, dispatch }) => {
    try {
      const response = await doctorService.updateDoctorStatus(id, status)
      if (response.success) {
        await dispatch(fetchDoctors()).unwrap()
        return { id, status, data: response.data }
      } else {
        return rejectWithValue(response.message)
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error;
      const result = errorMessage ? errorMessage.split(':').pop()?.trim() : 'Failed to update doctor status';
      return rejectWithValue(result)
    }
  }
)

export const deleteDoctor = createAsyncThunk(
  'doctors/deleteDoctor',
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      

      const response = await doctorService.deleteDoctor(id)
    

      if (response.success) {
      
        // Fetch updated doctor list after successful deletion
        const fetchResult = await dispatch(fetchDoctors()).unwrap()
    
        return id
      } else {
        return rejectWithValue(response.message)
      }
    } catch (error: any) {
    
      const errorMessage = error.response?.data?.error;
      const result = errorMessage ? errorMessage.split(':').pop()?.trim() : 'Failed to delete doctor';
      return rejectWithValue(result)
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
      const index = state.doctors.findIndex((doctor) => doctor.id === action.payload.id)
      if (index !== -1) {
        state.doctors[index] = action.payload
      }
    },
    deleteDoctorLocal: (state, action: PayloadAction<string>) => {
      state.doctors = state.doctors.filter((doctor) => doctor.id !== action.payload)
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
      .addCase(fetchDoctors.fulfilled, (state, action) => {

        // Handle different possible response structures
        let doctorsArray = action.payload

        // Check if payload has a data property (wrapped response)
        if (action.payload && typeof action.payload === 'object' && 'data' in action.payload) {
          doctorsArray = (action.payload as any).data
        }

        // Check if payload is directly an array (direct response)
        if (Array.isArray(action.payload)) {
          doctorsArray = action.payload
        }

        if (Array.isArray(doctorsArray)) {
          const mappedDoctors = doctorsArray.map((doctor: any, index: number) => {
            const mappedDoctor = {
              id: doctor._id,
              name: doctor.fullName || `${doctor.firstName} ${doctor.lastName}`,
              firstName: doctor.firstName,
              lastName: doctor.lastName,
              email: doctor.email,
              phone: doctor.phone || doctor.phoneNumber,
              age: doctor.age,
              dateOfBirth: doctor.dateOfBirth,
              gender: doctor.gender,
              address: doctor.address,
              specialization: doctor.specialization,
              experience: doctor.experience,
              licenseNumber: doctor.licenseNumber,
              bio: doctor.bio,
              educationSummary: doctor.educationSummary,
              status: doctor.status || 'active',
              role: 'doctor' as const,
              avatar: doctor.profilePicture,
              profilePicture: doctor.profilePicture,
              languages: doctor.languages || [],
              timeZone: doctor.availability?.timeZone || 'Asia/Karachi',
              availableDays: doctor.availability?.availableDays || [],
              assignedClinic: doctor.assignedClinics?.[0] || '',
              hipaaConsent: doctor.user?.hipaaConsent ?? true
            } as Doctor

            return mappedDoctor
          })

          state.doctors = mappedDoctors
          state.loading = false

        } else {
          state.doctors = []
        }
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
      .addCase(fetchDoctor.fulfilled, (state, action) => {
     
        // Handle the single doctor response
        const doctorData = (action.payload as any).data || action.payload
        const mappedDoctor: Doctor = {
          id: doctorData._id,
          name: doctorData.fullName || `${doctorData.firstName} ${doctorData.lastName}`,
          firstName: doctorData.firstName,
          lastName: doctorData.lastName,
          email: doctorData.email,
          phone: doctorData.phone || doctorData.phoneNumber,
          age: doctorData.age,
          dateOfBirth: doctorData.dateOfBirth,
          gender: doctorData.gender,
          address: doctorData.address,
          specialization: doctorData.specialization,
          experience: doctorData.experience,
          licenseNumber: doctorData.licenseNumber,
          bio: doctorData.bio,
          educationSummary: doctorData.educationSummary,
          status: doctorData.status || 'active',
          role: 'doctor' as const,
          avatar: doctorData.profilePicture,
          profilePicture: doctorData.profilePicture,
          languages: doctorData.languages || [],
          timeZone: doctorData.availability?.timeZone || 'Asia/Karachi',
          availableDays: doctorData.availability?.availableDays || [],
          assignedClinic: doctorData.assignedClinics?.[0] || '',
          hipaaConsent: doctorData.user?.hipaaConsent ?? true
        }
        state.doctor = mappedDoctor
        state.loading = false

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
        const newDoctor: Doctor = {
          id: action.payload?.user?.id || '',
          name: action.payload.user.name,
          firstName: action.payload.user.firstName,
          lastName: action.payload.user.lastName,
          email: action.payload.user.email,
          phone: action.payload.user.phone,
          age: action.payload.user.age,
          gender: action.payload.user.gender,
          address: action.payload.user.address,
          specialization: action.payload.user.specialization,
          experience: action.payload.user.experience,
          licenseNumber: action.payload.user.licenseNumber,
          role: "doctor",
          avatar: action.payload.user.avatar,
          profilePicture: action.payload.user.profilePicture
        }
        state.doctors.push(newDoctor)
        state.error = null
      })
      .addCase(createDoctor.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Create doctor in collection
    builder
      .addCase(createDoctorInCollection.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createDoctorInCollection.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
      })
      .addCase(createDoctorInCollection.rejected, (state, action) => {
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
        const updatedDoctor: Doctor = {
          id: action.payload?.user?.id || '',
          name: action.payload?.user?.name || '',
          firstName: action.payload?.user?.firstName || '',
          lastName: action.payload?.user?.lastName || '',
          email: action.payload?.user?.email || '',
          phone: action.payload?.user?.phone || '',
          age: action.payload?.user?.age || 0,
          gender: action.payload?.user?.gender || 'male',
          address: action.payload?.user?.address || '',
          specialization: action.payload?.user?.specialization || '',
          experience: action.payload?.user?.experience || 0,
          licenseNumber: action.payload?.user?.licenseNumber || '',
          status: (action.payload?.user as any).status || 'active',
          role: "doctor",
          avatar: action.payload?.user?.avatar || '',
          profilePicture: action.payload?.user?.profilePicture || ''
        }
        const index = state.doctors.findIndex((doctor) => doctor.id === updatedDoctor.id)
        if (index !== -1) {
          state.doctors[index] = updatedDoctor
        }
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
        const { id, status } = action.payload
        const index = state.doctors.findIndex((doctor) => doctor.id === id)
        if (index !== -1) {
          state.doctors[index].status = status
        }
        state.error = null
      })
      .addCase(updateDoctorStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Delete doctor
    builder
      .addCase(deleteDoctor.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.loading = false
      
        // Don't filter locally since we're fetching updated list from server
        state.error = null
      })
      .addCase(deleteDoctor.rejected, (state, action) => {
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