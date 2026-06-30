import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { appointmentService, Appointment, CreateAppointmentRequest, UpdateAppointmentRequest, PatientFullDetails } from '../api/services/appointmentService';

interface AppointmentState {
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  patientDetails: PatientFullDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  currentAppointment: null,
  patientDetails: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAppointments = createAsyncThunk(
  'appointment/fetchAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointments();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments');
    }
  }
);

export const fetchAppointmentById = createAsyncThunk(
  'appointment/fetchAppointmentById',
  async (appointmentId: string, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getAppointmentById(appointmentId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointment');
    }
  }
);

export const createAppointment = createAsyncThunk(
  'appointment/createAppointment',
  async ({ role, appointmentData }: { role: string; appointmentData: CreateAppointmentRequest }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.createAppointment(role, appointmentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create appointment');
    }
  }
);

export const updateAppointment = createAsyncThunk(
  'appointment/updateAppointment',
  async ({ appointmentId, appointmentData }: { appointmentId: string; appointmentData: UpdateAppointmentRequest }, { rejectWithValue }) => {
    try {
      const response = await appointmentService.updateAppointment(appointmentId, appointmentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update appointment');
    }
  }
);

export const deleteAppointment = createAsyncThunk(
  'appointment/deleteAppointment',
  async (appointmentId: string, { rejectWithValue }) => {
    try {
      await appointmentService.deleteAppointment(appointmentId);
      return appointmentId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete appointment');
    }
  }
);

export const fetchPatientFullDetails = createAsyncThunk(
  'appointment/fetchPatientFullDetails',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const response = await appointmentService.getPatientFullDetails(patientId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch patient details');
    }
  }
);

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAppointment: (state) => {
      state.currentAppointment = null;
    },
    clearAppointments: (state) => {
      state.appointments = [];
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
    },
    clearPatientDetails: (state) => {
      state.patientDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch appointment by ID
      .addCase(fetchAppointmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAppointment = action.payload;
      })
      .addCase(fetchAppointmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update appointment
      .addCase(updateAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.appointments.findIndex(appointment => appointment._id === action.payload._id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        if (state.currentAppointment?._id === action.payload._id) {
          state.currentAppointment = action.payload;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete appointment
      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.filter(appointment => appointment._id !== action.payload);
        if (state.currentAppointment?._id === action.payload) {
          state.currentAppointment = null;
        }
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch patient full details
      .addCase(fetchPatientFullDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientFullDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.patientDetails = action.payload;
      })
      .addCase(fetchPatientFullDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentAppointment, clearAppointments, addAppointment, clearPatientDetails } = appointmentSlice.actions;
export default appointmentSlice.reducer;