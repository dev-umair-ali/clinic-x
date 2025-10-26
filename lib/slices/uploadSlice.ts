import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { uploadService, UploadResponse, UploadProgress } from '../api/services/uploadService';

interface UploadedFile {
  url: string;
  filename: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface UploadState {
  uploadedFiles: UploadedFile[];
  currentUpload: {
    file: File | null;
    progress: UploadProgress | null;
    uploading: boolean;
  };
  loading: boolean;
  error: string | null;
}

const initialState: UploadState = {
  uploadedFiles: [],
  currentUpload: {
    file: null,
    progress: null,
    uploading: false,
  },
  loading: false,
  error: null,
};

// Async thunks
export const uploadImage = createAsyncThunk(
  'upload/uploadImage',
  async ({ file, onProgress }: { file: File; onProgress?: (progress: UploadProgress) => void }, { rejectWithValue }) => {
    try {
      const response = await uploadService.uploadImage(file, onProgress);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload image');
    }
  }
);

export const uploadVideo = createAsyncThunk(
  'upload/uploadVideo',
  async ({ file, onProgress }: { file: File; onProgress?: (progress: UploadProgress) => void }, { rejectWithValue }) => {
    try {
      const response = await uploadService.uploadVideo(file, onProgress);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload video');
    }
  }
);

export const uploadAudio = createAsyncThunk(
  'upload/uploadAudio',
  async ({ file, onProgress }: { file: File; onProgress?: (progress: UploadProgress) => void }, { rejectWithValue }) => {
    try {
      const response = await uploadService.uploadAudio(file, onProgress);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload audio');
    }
  }
);

export const uploadFile = createAsyncThunk(
  'upload/uploadFile',
  async ({ file, type, onProgress }: { file: File; type: 'image' | 'video' | 'audio'; onProgress?: (progress: UploadProgress) => void }, { rejectWithValue }) => {
    try {
      const response = await uploadService.uploadFile(file, type, onProgress);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload file');
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUpload: (state) => {
      state.currentUpload = {
        file: null,
        progress: null,
        uploading: false,
      };
    },
    clearUploadedFiles: (state) => {
      state.uploadedFiles = [];
    },
    setUploadProgress: (state, action: PayloadAction<UploadProgress>) => {
      state.currentUpload.progress = action.payload;
    },
    setUploadingFile: (state, action: PayloadAction<File>) => {
      state.currentUpload.file = action.payload;
      state.currentUpload.uploading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload image
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentUpload.uploading = true;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUpload.uploading = false;
        state.uploadedFiles.push({
          ...action.payload,
          uploadedAt: new Date().toISOString(),
        });
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.currentUpload.uploading = false;
        state.error = action.payload as string;
      })
      // Upload video
      .addCase(uploadVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentUpload.uploading = true;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUpload.uploading = false;
        state.uploadedFiles.push({
          ...action.payload,
          uploadedAt: new Date().toISOString(),
        });
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.loading = false;
        state.currentUpload.uploading = false;
        state.error = action.payload as string;
      })
      // Upload audio
      .addCase(uploadAudio.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentUpload.uploading = true;
      })
      .addCase(uploadAudio.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUpload.uploading = false;
        state.uploadedFiles.push({
          ...action.payload,
          uploadedAt: new Date().toISOString(),
        });
      })
      .addCase(uploadAudio.rejected, (state, action) => {
        state.loading = false;
        state.currentUpload.uploading = false;
        state.error = action.payload as string;
      })
      // Upload file (generic)
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentUpload.uploading = true;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUpload.uploading = false;
        state.uploadedFiles.push({
          ...action.payload,
          uploadedAt: new Date().toISOString(),
        });
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.currentUpload.uploading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentUpload, clearUploadedFiles, setUploadProgress, setUploadingFile } = uploadSlice.actions;
export default uploadSlice.reducer;
