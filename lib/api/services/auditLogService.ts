import api from '../axios';

export interface AuditLog {
  _id: string;
  action: string;
  actorId: string;
  actorRole: string;
   actorUser?: {
    firstName: string;
    lastName: string;
    email?: string;
  };
  actorName?: string;
  entityType: string;
  entityId: string;
  entityName?: string;
  clinicRef?: string;
  clinicName?: string;
  ipAddress?: string;
  userAgent?: string;
  device?: string;
  sessionId?: string;
  requestId?: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata?: Record<string, any>;
  status: 'success' | 'failure' | 'pending';
  errorMessage?: string;
  timestamp: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuditLogQueryParams {
  action?: string;
  clinicRef?: string;
  doctorRef?: string;
  entityType?: string;
  actorRole?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogsListResponse {
  success: boolean;
  logs: AuditLog[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  message?: string;
}

export interface AuditLogResponse {
  success: boolean;
  log: AuditLog;
  message?: string;
}

export const auditLogService = {
  async getAuditLogs(params?: AuditLogQueryParams): Promise<AuditLogsListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.action) queryParams.append('action', params.action);
    if (params?.clinicRef) queryParams.append('clinicRef', params.clinicRef);
    if (params?.entityType) queryParams.append('entityType', params.entityType);
    if (params?.actorRole) queryParams.append('actorRole', params.actorRole);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `/admin/audit-log/all/audit-logs?${queryString}`
      : '/admin/audit-log/all/audit-logs';
    
    const response = await api.get<AuditLogsListResponse>(url);
    return response.data;
  },

  async getAssistantAuditLogs(params?: AuditLogQueryParams): Promise<AuditLogsListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.action) queryParams.append('action', params.action);
    if (params?.clinicRef) queryParams.append('clinicRef', params.clinicRef);
    if (params?.entityType) queryParams.append('entityType', params.entityType);
    if (params?.actorRole) queryParams.append('actorRole', params.actorRole);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `/assistant/audit-log/all/audit-logs?${queryString}`
      : '/assistant/audit-log/all/audit-logs';
    
    const response = await api.get<AuditLogsListResponse>(url);
    return response.data;
  },

  async getClinicAuditLogs(params?: AuditLogQueryParams): Promise<AuditLogsListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.action) queryParams.append('action', params.action);
    if (params?.clinicRef) queryParams.append('clinicRef', params.clinicRef);
    if (params?.entityType) queryParams.append('entityType', params.entityType);
    if (params?.actorRole) queryParams.append('actorRole', params.actorRole);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `/clinic/audit-log/all/audit-logs?${queryString}`
      : '/clinic/audit-log/all/audit-logs';
    
    const response = await api.get<AuditLogsListResponse>(url);
    return response.data;
  },

  async getDoctorAuditLogs(params?: AuditLogQueryParams): Promise<AuditLogsListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.action) queryParams.append('action', params.action);
    if (params?.doctorRef) queryParams.append('doctorRef', params.doctorRef);

    if (params?.entityType) queryParams.append('entityType', params.entityType);
    if (params?.actorRole) queryParams.append('actorRole', params.actorRole);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `/doctor/audit-log/all/audit-logs?${queryString}`
      : '/doctor/audit-log/all/audit-logs';
    
    const response = await api.get<AuditLogsListResponse>(url);
    return response.data;
  },

  async getAuditLog(id: string): Promise<AuditLog> {
    const response = await api.get<AuditLogResponse>(`/admin/audit-log/audit-log/${id}`);
    return response.data.log;
  },
};

