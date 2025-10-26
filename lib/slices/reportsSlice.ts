import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reportsService, Report, CreateReportRequest, MarkReportGeneratedRequest } from '../api/services/reportsService';

interface ReportsState {
  reports: Report[];
  currentReport: Report | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  reports: [],
  currentReport: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reportsService.getReports();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports');
    }
  }
);

export const createReport = createAsyncThunk(
  'reports/createReport',
  async (reportData: CreateReportRequest, { rejectWithValue }) => {
    try {
      const response = await reportsService.createReport(reportData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create report');
    }
  }
);

export const markReportGenerated = createAsyncThunk(
  'reports/markReportGenerated',
  async ({ reportId, urlData }: { reportId: string; urlData: MarkReportGeneratedRequest }, { rejectWithValue }) => {
    try {
      const response = await reportsService.markReportGenerated(reportId, urlData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark report as generated');
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
    clearReports: (state) => {
      state.reports = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reports
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create report
      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.push(action.payload);
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Mark report generated
      .addCase(markReportGenerated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markReportGenerated.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reports.findIndex(report => report._id === action.payload._id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        }
        if (state.currentReport?._id === action.payload._id) {
          state.currentReport = action.payload;
        }
      })
      .addCase(markReportGenerated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentReport, clearReports } = reportsSlice.actions;
export default reportsSlice.reducer;
