import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  checkGoogleCalendarStatus,
  disconnectGoogleCalendar,
  refreshGoogleCalendarStatus,
} from "@/lib/api/googleCalendarService";

interface GoogleCalendarState {
  isConnected: boolean;
  email: string | null;
  isLoading: boolean;
  error: string | null;
  showConnectionDialog: boolean;
}

const initialState: GoogleCalendarState = {
  isConnected: false,
  email: null,
  isLoading: false,
  error: null,
  showConnectionDialog: false,
};

// Async thunks
export const checkCalendarConnection = createAsyncThunk(
  "googleCalendar/checkConnection",
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const isConnected = await checkGoogleCalendarStatus(doctorId);
      return isConnected;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to check connection status");
    }
  }
);

export const refreshCalendarConnection = createAsyncThunk(
  "googleCalendar/refreshConnection",
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const result = await refreshGoogleCalendarStatus(doctorId);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to refresh connection status");
    }
  }
);

export const disconnectCalendar = createAsyncThunk(
  "googleCalendar/disconnect",
  async (doctorId: string, { rejectWithValue }) => {
    try {
      await disconnectGoogleCalendar(doctorId);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to disconnect calendar");
    }
  }
);

const googleCalendarSlice = createSlice({
  name: "googleCalendar",
  initialState,
  reducers: {
    setShowConnectionDialog: (state, action: PayloadAction<boolean>) => {
      state.showConnectionDialog = action.payload;
    },
    setConnectionStatus: (state, action: PayloadAction<{ isConnected: boolean; email?: string | null }>) => {
      state.isConnected = action.payload.isConnected;
      if (action.payload.email !== undefined) {
        state.email = action.payload.email;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Check connection
    builder
      .addCase(checkCalendarConnection.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkCalendarConnection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isConnected = action.payload;
        state.showConnectionDialog = !action.payload;
      })
      .addCase(checkCalendarConnection.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isConnected = false;
      });

    // Refresh connection
    builder
      .addCase(refreshCalendarConnection.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshCalendarConnection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isConnected = action.payload.connected;
        state.email = action.payload.email;
      })
      .addCase(refreshCalendarConnection.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Disconnect calendar
    builder
      .addCase(disconnectCalendar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(disconnectCalendar.fulfilled, (state) => {
        state.isLoading = false;
        state.isConnected = false;
        state.email = null;
        state.showConnectionDialog = true;
      })
      .addCase(disconnectCalendar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setShowConnectionDialog, setConnectionStatus, clearError } = googleCalendarSlice.actions;
export default googleCalendarSlice.reducer;
