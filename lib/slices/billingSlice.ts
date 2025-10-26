import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { billingService, Bill, CreateBillRequest, UpdateBillRequest } from '../api/services/billingService';

interface BillingState {
  bills: Bill[];
  currentBill: Bill | null;
  loading: boolean;
  error: string | null;
}

const initialState: BillingState = {
  bills: [],
  currentBill: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchBills = createAsyncThunk(
  'billing/fetchBills',
  async (_, { rejectWithValue }) => {
    try {
      const response = await billingService.getBills();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bills');
    }
  }
);

export const fetchBillById = createAsyncThunk(
  'billing/fetchBillById',
  async (billId: string, { rejectWithValue }) => {
    try {
      const response = await billingService.getBillById(billId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bill');
    }
  }
);

export const createBill = createAsyncThunk(
  'billing/createBill',
  async (billData: CreateBillRequest, { rejectWithValue }) => {
    try {
      const response = await billingService.createBill(billData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create bill');
    }
  }
);

export const updateBill = createAsyncThunk(
  'billing/updateBill',
  async ({ billId, billData }: { billId: string; billData: UpdateBillRequest }, { rejectWithValue }) => {
    try {
      const response = await billingService.updateBill(billId, billData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update bill');
    }
  }
);

export const deleteBill = createAsyncThunk(
  'billing/deleteBill',
  async (billId: string, { rejectWithValue }) => {
    try {
      await billingService.deleteBill(billId);
      return billId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete bill');
    }
  }
);

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBill: (state) => {
      state.currentBill = null;
    },
    clearBills: (state) => {
      state.bills = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bills
      .addCase(fetchBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch bill by ID
      .addCase(fetchBillById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBill = action.payload;
      })
      .addCase(fetchBillById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create bill
      .addCase(createBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.loading = false;
        state.bills.push(action.payload);
      })
      .addCase(createBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update bill
      .addCase(updateBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bills.findIndex(bill => bill._id === action.payload._id);
        if (index !== -1) {
          state.bills[index] = action.payload;
        }
        if (state.currentBill?._id === action.payload._id) {
          state.currentBill = action.payload;
        }
      })
      .addCase(updateBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete bill
      .addCase(deleteBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = state.bills.filter(bill => bill._id !== action.payload);
        if (state.currentBill?._id === action.payload) {
          state.currentBill = null;
        }
      })
      .addCase(deleteBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentBill, clearBills } = billingSlice.actions;
export default billingSlice.reducer;
