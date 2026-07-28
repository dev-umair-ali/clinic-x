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
  hasCompletedOnboarding?: boolean;
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

const ONBOARDING_COMPLETE_KEY = "clinic-ai-onboarding-complete";
/** Set to "1" only on fresh login — consumed after first show so reload won't reopen. */
export const ONBOARDING_LOGIN_PROMPT_KEY = "clinic-ai-onboarding-login-prompt";

function getStoredPatientId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("clinic-ai-user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user.patientId || user._id || user.id || null;
  } catch {
    return null;
  }
}

export function isOnboardingCompleteInStorage(patientId?: string | null): boolean {
  if (typeof window === "undefined") return false;
  const id = patientId || getStoredPatientId();
  if (!id) return false;
  return localStorage.getItem(`${ONBOARDING_COMPLETE_KEY}:${id}`) === "true";
}

export function markOnboardingCompleteInStorage(patientId?: string | null) {
  if (typeof window === "undefined") return;
  const id = patientId || getStoredPatientId();
  if (!id) return;
  localStorage.setItem(`${ONBOARDING_COMPLETE_KEY}:${id}`, "true");
  try {
    const raw = localStorage.getItem("clinic-ai-user");
    if (raw) {
      const user = JSON.parse(raw);
      user.hasCompletedOnboarding = true;
      localStorage.setItem("clinic-ai-user", JSON.stringify(user));
    }
  } catch {
    // ignore
  }
  // Stop forcing the modal for this browser session
  sessionStorage.setItem(ONBOARDING_LOGIN_PROMPT_KEY, "0");
}

export function clearOnboardingCompleteInStorage(patientId?: string | null) {
  if (typeof window === "undefined") return;
  const id = patientId || getStoredPatientId();
  if (id) localStorage.removeItem(`${ONBOARDING_COMPLETE_KEY}:${id}`);
}

/** Call on patient login — show onboarding once until completed or page reload consumes it. */
export function armOnboardingPromptForLogin(patientId?: string | null) {
  if (typeof window === "undefined") return;
  clearOnboardingCompleteInStorage(patientId);
  sessionStorage.setItem(ONBOARDING_LOGIN_PROMPT_KEY, "1");
}

/**
 * Returns true when onboarding should be forced after login.
 * - Fresh login (`1`) → true, mark as `shown`
 * - Already `shown` and not completed → true (keep gate until finish)
 * - Page reload → false (never re-open on refresh)
 */
export function consumeOnboardingLoginPrompt(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav?.type === "reload") {
      sessionStorage.setItem(ONBOARDING_LOGIN_PROMPT_KEY, "0");
      return false;
    }
  } catch {
    // ignore
  }

  const value = sessionStorage.getItem(ONBOARDING_LOGIN_PROMPT_KEY);
  if (value === "1") {
    sessionStorage.setItem(ONBOARDING_LOGIN_PROMPT_KEY, "shown");
    return true;
  }
  // Keep showing until the patient finishes onboarding (same login session, no reload)
  return value === "shown";
}

export function shouldShowOnboardingAfterLogin(): boolean {
  if (typeof window === "undefined") return false;
  // Only true for a brand-new login before the guard consumes it
  return sessionStorage.getItem(ONBOARDING_LOGIN_PROMPT_KEY) === "1";
}

export function dismissOnboardingLoginPrompt() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ONBOARDING_LOGIN_PROMPT_KEY, "0");
}

function formsIndicateComplete(_data: OnboardingFormsResponse): boolean {
  // Portfolio: never auto-complete from seed/API data — only after user hits final submit
  return false;
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

export const fetchAllOnboardingForms = createAsyncThunk<
  OnboardingFormsResponse,
  string
>(
  "onboarding/fetchAll",
  async (patientId: string, { rejectWithValue }) => {
    try {
      const response = await patientOnboardingService.getAllOnboardingForms(patientId);
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

export const getAllOnboardingFormsForAppointment = createAsyncThunk<
  OnboardingFormsResponse,
  string
>(
  "onboarding/fetchAllForAppointment",
  async (patientId: string, { rejectWithValue }) => {
    try {
      const response = await patientOnboardingService.getAllOnboardingFormsForAppointment(patientId);
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

function applyOnboardingPayload(
  state: OnboardingState,
  data: OnboardingFormsResponse,
  patientId?: string
) {
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

  const fromStorage = isOnboardingCompleteInStorage(patientId || getStoredPatientId());
  // Prefer explicit user completion; do not auto-complete from seeded forms
  state.hasCompletedOnboarding = fromStorage || state.hasCompletedOnboarding;
}

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
      markOnboardingCompleteInStorage();
      dismissOnboardingLoginPrompt();
    },
    resetOnboardingCompletion: (state) => {
      state.hasCompletedOnboarding = false;
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
        applyOnboardingPayload(state, action.payload || {}, action.meta.arg);
      })
      .addCase(fetchAllOnboardingForms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        if (isOnboardingCompleteInStorage()) {
          state.hasCompletedOnboarding = true;
        }
      })
      .addCase(getAllOnboardingFormsForAppointment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllOnboardingFormsForAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        applyOnboardingPayload(state, action.payload || {}, action.meta.arg);
      })
      .addCase(getAllOnboardingFormsForAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        if (isOnboardingCompleteInStorage()) {
          state.hasCompletedOnboarding = true;
        }
      });
  },
});

export const { clearOnboardingData, clearError, setOnboardingComplete, resetOnboardingCompletion } = onboardingSlice.actions;

export default onboardingSlice.reducer;
