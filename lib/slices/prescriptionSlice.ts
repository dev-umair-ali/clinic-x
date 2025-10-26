import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { prescriptionService, Prescription, CreatePrescriptionRequest, UpdatePrescriptionRequest } from '../api/services/prescriptionService';

interface PrescriptionState {
  prescriptions: Prescription[];
  currentPrescription: Prescription | null;
  loading: boolean;
  error: string | null;
}

const initialState: PrescriptionState = {
  prescriptions: [],
  currentPrescription: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchPrescriptions = createAsyncThunk(
  'prescription/fetchPrescriptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await prescriptionService.getPrescriptions();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch prescriptions');
    }
  }
);

export const fetchPrescriptionById = createAsyncThunk(
  'prescription/fetchPrescriptionById',
  async (prescriptionId: string, { rejectWithValue }) => {
    try {
      const response = await prescriptionService.getPrescriptionById(prescriptionId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch prescription');
    }
  }
);

export const createPrescription = createAsyncThunk(
  'prescription/createPrescription',
  async (prescriptionData: CreatePrescriptionRequest, { rejectWithValue }) => {
    try {
      const response = await prescriptionService.createPrescription(prescriptionData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create prescription');
    }
  }
);

export const updatePrescription = createAsyncThunk(
  'prescription/updatePrescription',
  async ({ prescriptionId, prescriptionData }: { prescriptionId: string; prescriptionData: UpdatePrescriptionRequest }, { rejectWithValue }) => {
    try {
      const response = await prescriptionService.updatePrescription(prescriptionId, prescriptionData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update prescription');
    }
  }
);

export const deletePrescription = createAsyncThunk(
  'prescription/deletePrescription',
  async (prescriptionId: string, { rejectWithValue }) => {
    try {
      await prescriptionService.deletePrescription(prescriptionId);
      return prescriptionId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete prescription');
    }
  }
);

const prescriptionSlice = createSlice({
  name: 'prescription',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPrescription: (state) => {
      state.currentPrescription = null;
    },
    clearPrescriptions: (state) => {
      state.prescriptions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch prescriptions
      .addCase(fetchPrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = action.payload;
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch prescription by ID
      .addCase(fetchPrescriptionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrescriptionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPrescription = action.payload;
      })
      .addCase(fetchPrescriptionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create prescription
      .addCase(createPrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions.push(action.payload);
      })
      .addCase(createPrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update prescription
      .addCase(updatePrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrescription.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.prescriptions.findIndex(prescription => prescription._id === action.payload._id);
        if (index !== -1) {
          state.prescriptions[index] = action.payload;
        }
        if (state.currentPrescription?._id === action.payload._id) {
          state.currentPrescription = action.payload;
        }
      })
      .addCase(updatePrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete prescription
      .addCase(deletePrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptions = state.prescriptions.filter(prescription => prescription._id !== action.payload);
        if (state.currentPrescription?._id === action.payload) {
          state.currentPrescription = null;
        }
      })
      .addCase(deletePrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentPrescription, clearPrescriptions } = prescriptionSlice.actions;
export default prescriptionSlice.reducer;
