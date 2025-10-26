import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { profileService, Profile, CreateProfileRequest, UpdateProfileRequest } from '../api/services/profileService';

interface ProfileState {
  profiles: Profile[];
  currentProfile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profiles: [],
  currentProfile: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchMyProfile = createAsyncThunk(
  'profile/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getMyProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateMyProfile = createAsyncThunk(
  'profile/updateMyProfile',
  async (profileData: UpdateProfileRequest, { rejectWithValue }) => {
    try {
      const response = await profileService.updateMyProfile(profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const fetchAllProfiles = createAsyncThunk(
  'profile/fetchAllProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getAllProfiles();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profiles');
    }
  }
);

export const fetchProfilesByRole = createAsyncThunk(
  'profile/fetchProfilesByRole',
  async (role: string, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfilesByRole(role);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profiles by role');
    }
  }
);

export const fetchProfileById = createAsyncThunk(
  'profile/fetchProfileById',
  async (profileId: string, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfileById(profileId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfileById = createAsyncThunk(
  'profile/updateProfileById',
  async ({ profileId, profileData }: { profileId: string; profileData: UpdateProfileRequest }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateProfileById(profileId, profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const deleteProfile = createAsyncThunk(
  'profile/deleteProfile',
  async (profileId: string, { rejectWithValue }) => {
    try {
      await profileService.deleteProfile(profileId);
      return profileId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete profile');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProfile: (state) => {
      state.currentProfile = null;
    },
    clearProfiles: (state) => {
      state.profiles = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch my profile
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update my profile
      .addCase(updateMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch all profiles
      .addCase(fetchAllProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(fetchAllProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch profiles by role
      .addCase(fetchProfilesByRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfilesByRole.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(fetchProfilesByRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch profile by ID
      .addCase(fetchProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update profile by ID
      .addCase(updateProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
        // Update in profiles array if it exists
        const index = state.profiles.findIndex(profile => profile._id === action.payload._id);
        if (index !== -1) {
          state.profiles[index] = action.payload;
        }
      })
      .addCase(updateProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete profile
      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = state.profiles.filter(profile => profile._id !== action.payload);
        if (state.currentProfile?._id === action.payload) {
          state.currentProfile = null;
        }
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentProfile, clearProfiles } = profileSlice.actions;
export default profileSlice.reducer;
