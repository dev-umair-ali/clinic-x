import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clinicService } from '@/lib/api';
import type {
  Clinic,
  CreateClinicRequest,
  UpdateClinicRequest,
} from '@/lib/api';
import { StatusChange } from '../api/services/clinicService';

/* ---------  STATE INTERFACE  --------- */
interface ClinicState {
  clinics: Clinic[];
  currentClinic: Clinic | null;
  // dashboard: ClinicDashboard | null;
  // appointmentsTrend: AppointmentsTrendData[];
  // revenueTrend: RevenueTrendData[];
  loading: boolean;
  error: string | null;
}

const initialState: ClinicState = {
  clinics: [],
  currentClinic: null,
  // dashboard: null,
  // appointmentsTrend: [],
  // revenueTrend: [],
  loading: false,
  error: null,
};

/* ---------  ASYNC THUNKS  --------- */

/**
 * Fetch all clinics
 */
export const fetchClinics = createAsyncThunk(
  '/admin/clinic/all/clinics',
  async (_, { rejectWithValue }) => {
    try {
      const clinics = await clinicService.getClinics();
      return clinics;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch clinics');
    }
  }
);

/**
 * Create a new clinic
 */
export const createClinic = createAsyncThunk(
  '/admin/clinic/create-clinic',
  async (data: CreateClinicRequest, { rejectWithValue }) => {
    try {
      const clinic = await clinicService.createClinic(data);
      return clinic;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create clinic');
    }
  }
);

/**
 * Fetch clinic by ID
 */
export const fetchClinicById = createAsyncThunk(
  '/admin/clinic/:id',
  async (id: string, { rejectWithValue }) => {
    try {
      const clinic = await clinicService.getClinicById(id);
      return clinic;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch clinic');
    }
  }
);

/**
 * Update clinic
 */
export const updateClinic = createAsyncThunk(
  '/admin/clinic/update-clinic',
  async ({ id, data }: { id: string; data: UpdateClinicRequest }, { rejectWithValue }) => {
    try {
      const clinic = await clinicService.updateClinic(id, data);
      return clinic;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update clinic');
    }
  }
);

/**
 * Delete clinic
 */
export const clinicStatusChange = createAsyncThunk(
  '/admin/clinic/update-clinic/:id',
  async ({ id, data }: { id: string; data: StatusChange }, { rejectWithValue }) => {
    try {
      await clinicService.clinicStatusChange(id, data);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete clinic');
    }
  }
);

// /**
//  * Fetch clinic dashboard
//  */
// export const fetchClinicDashboard = createAsyncThunk(
//   'clinics/fetchDashboard',
//   async (clinicId: string, { rejectWithValue }) => {
//     try {
//       const response = await clinicService.getClinicDashboard(clinicId);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard');
//     }
//   }
// );

// /**
//  * Fetch appointments trend
//  */
// export const fetchAppointmentsTrend = createAsyncThunk(
//   'clinics/fetchAppointmentsTrend',
//   async (
//     { clinicId, params }: { clinicId: string; params?: { startDate?: string; endDate?: string; interval?: 'day' | 'week' | 'month' } },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await clinicService.getAppointmentsTrend(clinicId, params);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch appointments trend');
//     }
//   }
// );

// /**
//  * Fetch revenue trend
//  */
// export const fetchRevenueTrend = createAsyncThunk(
//   'clinics/fetchRevenueTrend',
//   async (
//     { clinicId, params }: { clinicId: string; params?: { startDate?: string; endDate?: string; interval?: 'day' | 'week' | 'month' } },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await clinicService.getRevenueTrend(clinicId, params);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch revenue trend');
//     }
//   }
// );

// /**
//  * Upload clinic logo
//  */
// export const uploadClinicLogo = createAsyncThunk(
//   'clinics/uploadLogo',
//   async ({ clinicId, file }: { clinicId: string; file: File }, { rejectWithValue }) => {
//     try {
//       const response = await clinicService.uploadClinicLogo(clinicId, file);
//       // response is LogoUploadResponse with structure { success, data: { url }, message }
//       return { clinicId, logoUrl: response.data.url };
//     } catch (error: any) {
//       console.error('Logo upload error:', error);
//       return rejectWithValue(error.response?.data?.message || error.message || 'Failed to upload logo');
//     }
//   }
// );

// /**
//  * Delete clinic logo
//  */
// export const deleteClinicLogo = createAsyncThunk(
//   'clinics/deleteLogo',
//   async (clinicId: string, { rejectWithValue }) => {
//     try {
//       await clinicService.deleteClinicLogo(clinicId);
//       return clinicId;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to delete logo');
//     }
//   }
// );

/* ---------  SLICE  --------- */

const clinicSlice = createSlice({
  name: 'clinics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentClinic: (state) => {
      state.currentClinic = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all clinics
      .addCase(fetchClinics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClinics.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out any null/undefined values
        state.clinics = action.payload.filter((clinic) => clinic != null);
      })
      .addCase(fetchClinics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create clinic
      .addCase(createClinic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClinic.fulfilled, (state, action) => {
        state.loading = false;
        state.clinics.push(action.payload);
        state.currentClinic = action.payload;
      })
      .addCase(createClinic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch clinic by ID
      .addCase(fetchClinicById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClinicById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClinic = action.payload;
      })
      .addCase(fetchClinicById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update clinic
      .addCase(updateClinic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClinic.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.clinics.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.clinics[index] = action.payload;
        }
        if (state.currentClinic?._id === action.payload._id) {
          state.currentClinic = action.payload;
        }
      })
      .addCase(updateClinic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete clinic
      .addCase(clinicStatusChange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clinicStatusChange.fulfilled, (state, action) => {
        state.loading = false;
        state.clinics = state.clinics.filter((c) => c._id !== action.payload);
        if (state.currentClinic?._id === action.payload) {
          state.currentClinic = null;
        }
      })
      .addCase(clinicStatusChange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // // Fetch dashboard
      // .addCase(fetchClinicDashboard.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(fetchClinicDashboard.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.dashboard = action.payload;
      // })
      // .addCase(fetchClinicDashboard.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })

      // // Fetch appointments trend
      // .addCase(fetchAppointmentsTrend.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(fetchAppointmentsTrend.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.appointmentsTrend = action.payload;
      // })
      // .addCase(fetchAppointmentsTrend.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })

      // // Fetch revenue trend
      // .addCase(fetchRevenueTrend.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(fetchRevenueTrend.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.revenueTrend = action.payload;
      // })
      // .addCase(fetchRevenueTrend.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })

      // // Upload logo
      // .addCase(uploadClinicLogo.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(uploadClinicLogo.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const { clinicId, logoUrl } = action.payload;
      //   const index = state.clinics.findIndex((c) => c._id === clinicId);
      //   if (index !== -1) {
      //     state.clinics[index].logo = logoUrl;
      //   }
      //   if (state.currentClinic?._id === clinicId) {
      //     state.currentClinic.logo = logoUrl;
      //   }
      // })
      // .addCase(uploadClinicLogo.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })

      // // Delete logo
      // .addCase(deleteClinicLogo.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(deleteClinicLogo.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const clinicId = action.payload;
      //   const index = state.clinics.findIndex((c) => c._id === clinicId);
      //   if (index !== -1) {
      //     state.clinics[index].logo = undefined;
      //   }
      //   if (state.currentClinic?._id === clinicId) {
      //     state.currentClinic.logo = undefined;
      //   }
      // })
      // .addCase(deleteClinicLogo.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // });
  },
});

export const { clearError, clearCurrentClinic } = clinicSlice.actions;
export default clinicSlice.reducer;
