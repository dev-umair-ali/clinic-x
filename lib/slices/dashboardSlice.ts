import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  dashboardService,
  AdminDashboardData,
  ClinicDashboardData,
  AssistantDashboardData,
  DoctorDashboardData,
  PatientDashboardData,
} from "../api/services/dashboardService";

// ==================== STATE TYPES ====================

interface DashboardState {
  admin: {
    data: AdminDashboardData | null;
    loading: boolean;
    error: string | null;
  };
  clinic: {
    data: ClinicDashboardData | null;
    loading: boolean;
    error: string | null;
  };
  assistant: {
    data: AssistantDashboardData | null;
    loading: boolean;
    error: string | null;
  };
  doctor: {
    data: DoctorDashboardData | null;
    loading: boolean;
    error: string | null;
  };
  patient: {
    data: PatientDashboardData | null;
    loading: boolean;
    error: string | null;
  };
}

const initialState: DashboardState = {
  admin: {
    data: null,
    loading: false,
    error: null,
  },
  clinic: {
    data: null,
    loading: false,
    error: null,
  },
  assistant: {
    data: null,
    loading: false,
    error: null,
  },
  doctor: {
    data: null,
    loading: false,
    error: null,
  },
  patient: {
    data: null,
    loading: false,
    error: null,
  },
};

// ==================== ASYNC THUNKS ====================

// Admin Dashboard
export const fetchAdminDashboard = createAsyncThunk(
  "dashboard/fetchAdminDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getAdminDashboard();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch admin dashboard"
      );
    }
  }
);

// Clinic Dashboard
export const fetchClinicDashboard = createAsyncThunk(
  "dashboard/fetchClinicDashboard",
  async (clinicId: string | undefined, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getClinicDashboard(clinicId);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch clinic dashboard"
      );
    }
  }
);

// Assistant Dashboard
export const fetchAssistantDashboard = createAsyncThunk(
  "dashboard/fetchAssistantDashboard",
  async (clinicId: string | undefined, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getAssistantDashboard(clinicId);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch assistant dashboard"
      );
    }
  }
);

// Doctor Dashboard
export const fetchDoctorDashboard = createAsyncThunk(
  "dashboard/fetchDoctorDashboard",
  async (doctorId: string | undefined, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getDoctorDashboard(doctorId);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch doctor dashboard"
      );
    }
  }
);

// Patient Dashboard
export const fetchPatientDashboard = createAsyncThunk(
  "dashboard/fetchPatientDashboard",
  async (patientId: string | undefined, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getPatientDashboard(patientId);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch patient dashboard"
      );
    }
  }
);

// ==================== SLICE ====================

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearAdminDashboard: (state) => {
      state.admin.data = null;
      state.admin.error = null;
    },
    clearClinicDashboard: (state) => {
      state.clinic.data = null;
      state.clinic.error = null;
    },
    clearAssistantDashboard: (state) => {
      state.assistant.data = null;
      state.assistant.error = null;
    },
    clearDoctorDashboard: (state) => {
      state.doctor.data = null;
      state.doctor.error = null;
    },
    clearPatientDashboard: (state) => {
      state.patient.data = null;
      state.patient.error = null;
    },
    clearAllDashboards: (state) => {
      state.admin.data = null;
      state.admin.error = null;
      state.clinic.data = null;
      state.clinic.error = null;
      state.assistant.data = null;
      state.assistant.error = null;
      state.doctor.data = null;
      state.doctor.error = null;
      state.patient.data = null;
      state.patient.error = null;
    },
  },
  extraReducers: (builder) => {
    // Admin Dashboard
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.admin.loading = true;
        state.admin.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.admin.loading = false;
        state.admin.data = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.admin.loading = false;
        state.admin.error = action.payload as string;
      });

    // Clinic Dashboard
    builder
      .addCase(fetchClinicDashboard.pending, (state) => {
        state.clinic.loading = true;
        state.clinic.error = null;
      })
      .addCase(fetchClinicDashboard.fulfilled, (state, action) => {
        state.clinic.loading = false;
        state.clinic.data = action.payload;
      })
      .addCase(fetchClinicDashboard.rejected, (state, action) => {
        state.clinic.loading = false;
        state.clinic.error = action.payload as string;
      });

    // Assistant Dashboard
    builder
      .addCase(fetchAssistantDashboard.pending, (state) => {
        state.assistant.loading = true;
        state.assistant.error = null;
      })
      .addCase(fetchAssistantDashboard.fulfilled, (state, action) => {
        state.assistant.loading = false;
        state.assistant.data = action.payload;
      })
      .addCase(fetchAssistantDashboard.rejected, (state, action) => {
        state.assistant.loading = false;
        state.assistant.error = action.payload as string;
      });

    // Doctor Dashboard
    builder
      .addCase(fetchDoctorDashboard.pending, (state) => {
        state.doctor.loading = true;
        state.doctor.error = null;
      })
      .addCase(fetchDoctorDashboard.fulfilled, (state, action) => {
        state.doctor.loading = false;
        state.doctor.data = action.payload;
      })
      .addCase(fetchDoctorDashboard.rejected, (state, action) => {
        state.doctor.loading = false;
        state.doctor.error = action.payload as string;
      });

    // Patient Dashboard
    builder
      .addCase(fetchPatientDashboard.pending, (state) => {
        state.patient.loading = true;
        state.patient.error = null;
      })
      .addCase(fetchPatientDashboard.fulfilled, (state, action) => {
        state.patient.loading = false;
        state.patient.data = action.payload;
      })
      .addCase(fetchPatientDashboard.rejected, (state, action) => {
        state.patient.loading = false;
        state.patient.error = action.payload as string;
      });
  },
});

export const {
  clearAdminDashboard,
  clearClinicDashboard,
  clearAssistantDashboard,
  clearDoctorDashboard,
  clearPatientDashboard,
  clearAllDashboards,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
