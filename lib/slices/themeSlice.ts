import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { themeService } from "../api/services/themeService";
import type { ThemeSettings, ClinicTheme } from "../api/services/themeService";

// Default theme values
export const DEFAULT_THEME = {
  primary: "167 69% 39%",
  secondary: "167 69% 49%",
  accent: "167 69% 29%",
  logo: null as string | null,
};

// Re-export types for convenience
export type { ThemeSettings, ClinicTheme };

interface ThemeState {
  current: ThemeSettings;
  clinicId: string | null;
  loading: boolean;
  error: string | null;
  isDefault: boolean; // Track if using default theme
}

const initialState: ThemeState = {
  current: { ...DEFAULT_THEME },
  clinicId: null,
  loading: false,
  error: null,
  isDefault: true,
};

// Fetch clinic theme from backend
export const fetchClinicTheme = createAsyncThunk(
  "theme/fetchClinicTheme",
  async (clinicId: string, { rejectWithValue }) => {
    try {
      const data = await themeService.getClinicTheme(clinicId);
      // Always return data even if 404, service handles default theme
      return data;
    } catch (error: any) {
      // Only reject for actual errors, not 404
      if (error.response?.status === 404) {
        // Return default theme for 404
        return {
          success: false,
          message: 'Theme not found',
          data: {
            clinicId,
            theme: {
              primary: "167 69% 39%",
              secondary: "167 69% 49%",
              accent: "167 69% 29%",
              logo: null,
            },
          },
          clinicId,
        };
      }
      return rejectWithValue(error.message || "Failed to load theme");
    }
  }
);

// Save clinic theme to backend
export const saveClinicTheme = createAsyncThunk(
  "theme/saveClinicTheme",
  async (
    { clinicId, theme }: { clinicId: string; theme: ThemeSettings },
    { rejectWithValue }
  ) => {
    try {
      const data = await themeService.saveClinicTheme(clinicId, theme);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to save theme");
    }
  }
);

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    // Set theme directly (for preview purposes)
    setTheme: (state, action: PayloadAction<Partial<ThemeSettings>>) => {
      state.current = { ...state.current, ...action.payload };
    },

    // Reset to default theme
    resetTheme: (state) => {
      state.current = { ...DEFAULT_THEME };
      state.isDefault = true;
      state.error = null;
    },


    // Clear theme state
    clearTheme: (state) => {
      state.current = { ...DEFAULT_THEME };
      state.clinicId = null;
      state.isDefault = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch clinic theme
    builder.addCase(fetchClinicTheme.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchClinicTheme.fulfilled, (state, action) => {
      state.loading = false;
      // Support both { theme: {...} } and flat theme object
      let themeObj = null;
      if (action?.payload?.data) {
        if (action.payload.data.theme) {
          themeObj = action.payload.data.theme;
        } else {
          // If API returns flat theme object
          const { primary, secondary, accent, logo } = action.payload.data as any;
          if (primary && secondary && accent) {
            themeObj = { primary, secondary, accent, logo: logo ?? null };
          }
        }
      }
      state.current = themeObj || { ...DEFAULT_THEME };
      state.clinicId = action?.payload?.clinicId || action?.payload?.data?.clinicId || null;
      state.isDefault = action?.payload?.success === false || !themeObj;
      state.error = null;
    });
    builder.addCase(fetchClinicTheme.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      // Fall back to default theme on error
      state.current = { ...DEFAULT_THEME };
      state.isDefault = true;
    });

    // Save clinic theme
    builder.addCase(saveClinicTheme.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(saveClinicTheme.fulfilled, (state, action) => {
      state.loading = false;
      // Support both { theme: {...} } and flat theme object in SaveThemeResponse
      let themeObj = null;
      const payload = action.payload as any;
        if (payload.data && payload.data.theme) {
          const t = payload.data.theme;
          themeObj = {
            primary: t.primary,
            secondary: t.secondary,
            accent: t.accent,
            logo: t.logo ?? null,
          };
        } else if (payload?.data) {
          // If API returns flat theme object
          const { primary, secondary, accent, logo } = payload.data;
          if (primary && secondary && accent) {
            themeObj = { primary, secondary, accent, logo: logo ?? null };
          }
      }
      state.current = themeObj || { ...DEFAULT_THEME };
      state.clinicId = payload?.clinicId || payload?.theme?.clinicRef || payload?.data?.clinicId || null;
      state.isDefault = false;
      state.error = null;
    });
    builder.addCase(saveClinicTheme.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setTheme, resetTheme, clearTheme } =
  themeSlice.actions;

// Selectors
export const selectTheme = (state: RootState) => state.theme.current;
export const selectThemeLoading = (state: RootState) => state.theme.loading;
export const selectThemeError = (state: RootState) => state.theme.error;
export const selectIsDefaultTheme = (state: RootState) => state.theme.isDefault;

export default themeSlice.reducer;
