import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { patientOnboardingService } from "@/lib/api/services/patientOnboardingService";

interface OnboardingFormsResponse {
  patient?: any;
  onBoardingInfo?: any;
  insurance?: any;
  presentCondition?: any;
  history?: any[];
  dentalHistory?: any;
  medicalProfile?: any;
  lifeStyle?: any;
  womenForm?: any;
  constantLegal?: any;
  onBoardingUploads?: any;
}

interface OnboardingState {
  patient?: any;
  onBoardingInfo: any | null;
  presentCondition: any | null;
  insurance: any | null;
  history: any[];
  lifeStyle: any | null;
  womenForm: any | null;
  constantLegal: any | null;
  dentalHistory: any | null;
  medicalProfile: any | null;
  onBoardingUploads: any | null;
  isLoading: boolean;
  error: string | null;
  hasCompletedOnboarding: boolean;
}

const initialState: OnboardingState = {
  patient: null,
  onBoardingInfo: null,
  presentCondition: null,
  insurance: null,
  history: [],
  lifeStyle: null,
  womenForm: null,
  constantLegal: null,
  dentalHistory: null,
  medicalProfile: null,
  onBoardingUploads: null,
  isLoading: false,
  error: null,
  hasCompletedOnboarding: false,
};

// Async thunks
export const fetchAllOnboardingForms = createAsyncThunk<
  OnboardingFormsResponse,
  string
>(
  "onboarding/fetchAll",
  async (patientId: string, { rejectWithValue }) => {
    try {
      const response = await patientOnboardingService.getAllOnboardingForms(patientId);
      // Ensure a valid object is always returned
      return response.data ?? {
        patient: null,
        onBoardingInfo: null,
        presentCondition: null,
        insurance: null,
        history: [],
        lifeStyle: null,
        womenForm: null,
        constantLegal: null,
        dentalHistory: null,
        medicalProfile: null,
        onBoardingUploads: null,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch onboarding forms");
    }
  }
);

// Async thunks
export const getAllOnboardingFormsForAppointment = createAsyncThunk<
  OnboardingFormsResponse,
  string
>(
  "onboarding/fetchAllForAppointment",
  async (patientId: string, { rejectWithValue }) => {
    try {
      const response = await patientOnboardingService.getAllOnboardingFormsForAppointment(patientId);
      // Ensure a valid object is always returned
      return response.data ?? {
        patient: null,
        onBoardingInfo: null,
        presentCondition: null,
        insurance: null,
        history: [],
        lifeStyle: null,
        womenForm: null,
        constantLegal: null,
        dentalHistory: null,
        medicalProfile: null,
        onBoardingUploads: null,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch onboarding forms");
    }
  }
);

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    clearOnboardingData: (state) => {
      state.patient = null;
      state.onBoardingInfo = null;
      state.presentCondition = null;
      state.insurance = null;
      state.history = [];
      state.lifeStyle = null;
      state.womenForm = null;
      state.constantLegal = null;
      state.dentalHistory = null;
      state.medicalProfile = null;
      state.onBoardingUploads = null;
      state.hasCompletedOnboarding = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setOnboardingComplete: (state) => {
      state.hasCompletedOnboarding = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOnboardingForms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllOnboardingForms.fulfilled, (state, action) => {
        state.isLoading = false;
        const data: OnboardingFormsResponse = action.payload || {};
        state.patient = data.patient || null;
        state.onBoardingInfo = data.onBoardingInfo || null;
        state.insurance = data.insurance || null;
        state.presentCondition = data.presentCondition || null;
        state.history = data.history || [];
        state.lifeStyle = data.lifeStyle || null;
        state.dentalHistory = data.dentalHistory || null;
        state.medicalProfile = data.medicalProfile || null;
        state.womenForm = data.womenForm || null;
        state.constantLegal = data.constantLegal || null;
        state.onBoardingUploads = data.onBoardingUploads || null;
        state.hasCompletedOnboarding = (
          data.onBoardingInfo &&
          data.presentCondition &&
          data.dentalHistory &&
          data.medicalProfile &&
          data.insurance &&
          data.lifeStyle &&
          data.constantLegal &&
          data.onBoardingUploads
        );
      })
      .addCase(fetchAllOnboardingForms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.hasCompletedOnboarding = false;
      })
      .addCase(getAllOnboardingFormsForAppointment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOnboardingFormsForAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        const data: OnboardingFormsResponse = action.payload || {};
        state.patient = data.patient || null;
        state.onBoardingInfo = data.onBoardingInfo || null;
        state.insurance = data.insurance || null;
        state.presentCondition = data.presentCondition || null;
        state.history = data.history || [];
        state.lifeStyle = data.lifeStyle || null;
        state.dentalHistory = data.dentalHistory || null;
        state.medicalProfile = data.medicalProfile || null;
        state.womenForm = data.womenForm || null;
        state.constantLegal = data.constantLegal || null;
        state.onBoardingUploads = data.onBoardingUploads || null;
        state.hasCompletedOnboarding = (
          data.onBoardingInfo &&
          data.presentCondition &&
          data.dentalHistory &&
          data.medicalProfile &&
          data.insurance &&
          data.lifeStyle &&
          data.constantLegal &&
          data.onBoardingUploads
        );
      })
      .addCase(getAllOnboardingFormsForAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.hasCompletedOnboarding = false;
      });
  },
});

export const { clearOnboardingData, clearError, setOnboardingComplete } = onboardingSlice.actions;

export default onboardingSlice.reducer;
