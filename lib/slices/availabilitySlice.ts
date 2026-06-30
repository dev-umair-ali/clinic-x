import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAvailability,
  updateAvailability,
  syncAvailabilityWithGoogle,
  AvailabilityData,
  TimeSlot,
} from "@/lib/api/availabilityService";

interface AvailabilityState {
  timeZone: string;
  availableDays: TimeSlot[];
  availabilityId:String;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: AvailabilityState = {
  timeZone: "EST - Eastern Time (UTC-5)",
  availableDays: [],
  availabilityId:"",
  isLoading: false,
  isSaving: false,
  error: null,
  lastUpdated: null,
};

// Async thunks
export const fetchAvailability = createAsyncThunk(
  "availability/fetch",
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const response = await getAvailability(doctorId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch availability");
    }
  }
);

export const saveAvailability = createAsyncThunk(
  "availability/save",
  async ({ availabilityId, data }: { availabilityId: string; data: AvailabilityData }, { rejectWithValue }) => {
    try {
      const response = await updateAvailability(availabilityId , data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to save availability");
    }
  }
);

export const syncWithGoogleCalendar = createAsyncThunk(
  "availability/syncWithGoogle",
  async (doctorId: string, { rejectWithValue }) => {
    try {
      await syncAvailabilityWithGoogle(doctorId);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to sync with Google Calendar");
    }
  }
);

const availabilitySlice = createSlice({
  name: "availability",
  initialState,
  reducers: {
    setTimeZone: (state, action: PayloadAction<string>) => {
      state.timeZone = action.payload;
    },
    setAvailableDays: (state, action: PayloadAction<TimeSlot[]>) => {
      state.availableDays = action.payload;
    },
    addTimeSlot: (state, action: PayloadAction<TimeSlot>) => {
      state.availableDays.push(action.payload);
    },
    removeTimeSlot: (state, action: PayloadAction<number>) => {
      state.availableDays = state.availableDays.filter((_, index) => index !== action.payload);
    },
    updateTimeSlot: (state, action: PayloadAction<{ index: number; slot: TimeSlot }>) => {
      const { index, slot } = action.payload;
      if (state.availableDays[index]) {
        state.availableDays[index] = slot;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch availability
    builder
      .addCase(fetchAvailability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailability.fulfilled, (state, action) => {
        state.isLoading = false;
        state.timeZone = action.payload.timeZone || state.timeZone;
        state.availableDays = action.payload.availableDays || [];
        state.availabilityId = action.payload._id || "";
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAvailability.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Save availability
    builder
      .addCase(saveAvailability.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(saveAvailability.fulfilled, (state, action) => {
        state.isSaving = false;
        state.timeZone = action.payload.timeZone || state.timeZone;
        state.availableDays = action.payload.availableDays || [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(saveAvailability.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      });

    // Sync with Google Calendar
    builder
      .addCase(syncWithGoogleCalendar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(syncWithGoogleCalendar.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(syncWithGoogleCalendar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setTimeZone,
  setAvailableDays,
  addTimeSlot,
  removeTimeSlot,
  updateTimeSlot,
  clearError,
} = availabilitySlice.actions;

export default availabilitySlice.reducer;
