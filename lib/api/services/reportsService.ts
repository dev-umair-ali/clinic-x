import api from '../axios';

export interface Report {
  _id: string;
  clinic: string;
  type: "roi_weekly" | "billing_summary" | "appointments_summary";
  periodStart: string;
  periodEnd: string;
  status: "pending" | "generated" | "failed";
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportRequest {
  clinic: string;
  type: "roi_weekly" | "billing_summary" | "appointments_summary";
  periodStart: string;
  periodEnd: string;
}

export interface MarkReportGeneratedRequest {
  url: string;
}

export interface ReportResponse {
  success: boolean;
  data: Report;
  message?: string;
}

export interface ReportsListResponse {
  success: boolean;
  data: Report[];
  message?: string;
}

export const reportsService = {
  async getReports(): Promise<ReportsListResponse> {
    try {
      const response = await api.get('/reports');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  async createReport(reportData: CreateReportRequest): Promise<ReportResponse> {
    try {
      const response = await api.post('/reports', reportData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating report:', error);
      throw error;
    }
  },

  async markReportGenerated(id: string, urlData: MarkReportGeneratedRequest): Promise<ReportResponse> {
    try {
      const response = await api.post(`/reports/${id}/generated`, urlData);
      return response.data;
    } catch (error: any) {
      console.error('Error marking report as generated:', error);
      throw error;
    }
  }
};
