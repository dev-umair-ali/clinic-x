import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { refillService, RefillRequest, CreateRefillRequest, UpdateRefillStatusRequest } from '../api/services/refillService';

interface RefillState {
  refills: RefillRequest[];
  currentRefill: RefillRequest | null;
  loading: boolean;
  error: string | null;
}

const initialState: RefillState = {
  refills: [],
  currentRefill: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchRefills = createAsyncThunk(
  'refill/fetchRefills',
  async (_, { rejectWithValue }) => {
    try {
      const response = await refillService.getRefills();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch refills');
    }
  }
);

export const createRefill = createAsyncThunk(
  'refill/createRefill',
  async (refillData: CreateRefillRequest, { rejectWithValue }) => {
    try {
      const response = await refillService.createRefill(refillData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create refill request');
    }
  }
);

export const updateRefillStatus = createAsyncThunk(
  'refill/updateRefillStatus',
  async ({ refillId, statusData }: { refillId: string; statusData: UpdateRefillStatusRequest }, { rejectWithValue }) => {
    try {
      const response = await refillService.updateRefillStatus(refillId, statusData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update refill status');
    }
  }
);

const refillSlice = createSlice({
  name: 'refill',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRefill: (state) => {
      state.currentRefill = null;
    },
    clearRefills: (state) => {
      state.refills = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch refills
      .addCase(fetchRefills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRefills.fulfilled, (state, action) => {
        state.loading = false;
        state.refills = action.payload;
      })
      .addCase(fetchRefills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create refill
      .addCase(createRefill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRefill.fulfilled, (state, action) => {
        state.loading = false;
        state.refills.push(action.payload);
      })
      .addCase(createRefill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update refill status
      .addCase(updateRefillStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRefillStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.refills.findIndex(refill => refill._id === action.payload._id);
        if (index !== -1) {
          state.refills[index] = action.payload;
        }
        if (state.currentRefill?._id === action.payload._id) {
          state.currentRefill = action.payload;
        }
      })
      .addCase(updateRefillStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentRefill, clearRefills } = refillSlice.actions;
export default refillSlice.reducer;
