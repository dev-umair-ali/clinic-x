import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { auditLogService, type AuditLog, type AuditLogQueryParams } from "../api/services/auditLogService"

interface AuditLogState {
  logs: AuditLog[]
  selectedLog: AuditLog | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  } | null
  loading: boolean
  error: string | null
}

const initialState: AuditLogState = {
  logs: [],
  selectedLog: null,
  pagination: null,
  loading: false,
  error: null,
}

export const fetchAuditLogs = createAsyncThunk(
  'admin/audit-log/all/audit-logs',
  async (params: AuditLogQueryParams | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await auditLogService.getAuditLogs(params)
      return response
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch audit logs'
      return rejectWithValue(errorMessage)
    }
  }
)

export const fetchClinicAuditLogsForClinic = createAsyncThunk(
  'clinic/audit-log/all/audit-logs',
  async (params: AuditLogQueryParams | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await auditLogService.getClinicAuditLogs(params)
      return response
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch audit logs'
      return rejectWithValue(errorMessage)
    }
  }
)

export const fetchClinicAuditLogsForAssistant = createAsyncThunk(
  'assistant/audit-log/all/audit-logs',
  async (params: AuditLogQueryParams | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await auditLogService.getAssistantAuditLogs(params)
      return response
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch audit logs'
      return rejectWithValue(errorMessage)
    }
  }
)

export const fetchDoctorAuditLogs = createAsyncThunk(
  'doctor/audit-log/all/audit-logs',
  async (params: AuditLogQueryParams | undefined = undefined, { rejectWithValue }) => {
    try {
      const response = await auditLogService.getDoctorAuditLogs(params)
      return response
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch audit logs'
      return rejectWithValue(errorMessage)
    }
  }
)

export const fetchAuditLog = createAsyncThunk(
  'admin/audit-log/audit-log/:id',
  async (id: string, { rejectWithValue }) => {
    try {
      const log = await auditLogService.getAuditLog(id)
      return log
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to fetch audit log'
      return rejectWithValue(errorMessage)
    }
  }
)

const auditLogSlice = createSlice({
  name: "auditLogs",
  initialState,
  reducers: {
    clearSelectedLog: (state) => {
      state.selectedLog = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false
        state.logs = action.payload.logs || []
        state.pagination = action.payload.pagination || null
        state.error = null
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string | null
      })

    builder
      .addCase(fetchClinicAuditLogsForAssistant.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchClinicAuditLogsForAssistant.fulfilled, (state, action) => {
        state.loading = false
        state.logs = action.payload.logs || []
        state.pagination = action.payload.pagination || null
        state.error = null
      })
      .addCase(fetchClinicAuditLogsForAssistant.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string | null
      })

    builder
      .addCase(fetchClinicAuditLogsForClinic.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchClinicAuditLogsForClinic.fulfilled, (state, action) => {
        state.loading = false
        state.logs = action.payload.logs || []
        state.pagination = action.payload.pagination || null
        state.error = null
      })
      .addCase(fetchClinicAuditLogsForClinic.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string | null
      })

    builder
      .addCase(fetchDoctorAuditLogs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDoctorAuditLogs.fulfilled, (state, action) => {
        state.loading = false
        state.logs = action.payload.logs || []
        state.pagination = action.payload.pagination || null
        state.error = null
      })
      .addCase(fetchDoctorAuditLogs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string | null
      })

    builder
      .addCase(fetchAuditLog.pending, (state) => {
        state.loading = true
        state.error = null
        state.selectedLog = null
      })
      .addCase(fetchAuditLog.fulfilled, (state, action) => {
        state.loading = false
        state.selectedLog = action.payload
        state.error = null
      })
      .addCase(fetchAuditLog.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string | null
      })
  }
})

export const { clearSelectedLog, clearError } = auditLogSlice.actions

export default auditLogSlice.reducer
