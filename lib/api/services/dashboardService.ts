import api from '../axios';

// ==================== TYPE DEFINITIONS ====================

export interface AdminDashboardCounts {
    totalClinics: number;
    totalStaff: number;
    totalDoctors: number;
    totalPatients: number;
}

export interface ClinicPerformance {
    clinic: string;
    appointments: number;
}

export interface DoctorPerformance {
    clinic: string;
    appointments: number;
}

export interface PatientGrowth {
    month: string;
    patients: number;
}

export interface RecentActivity {
    description: string;
    timeAgo: string;
    timestamp: string;
}

export interface AdminDashboardData {
    counts: AdminDashboardCounts;
    clinicPerformance: ClinicPerformance[];
    appointmentsTrend: AppointmentTrend[];
    doctorPerformance: DoctorPerformance[];
    patientGrowth: PatientGrowth[];
    recentActivity: RecentActivity[];
}

export interface ClinicDashboardCounts {
    totalDoctors: number;
    totalStaff: number;
    totalPatients: number;
    totalAppointments: number;
}

export interface AppointmentTrend {
    month: string;
    appointments: number;
}

export interface ClinicDashboardData {
    counts: ClinicDashboardCounts;
    appointmentsTrend: AppointmentTrend[];
    clinicPerformance: ClinicPerformance[];
    doctorPerformance: DoctorPerformance[];
    patientGrowth: PatientGrowth[];
    recentActivity: RecentActivity[];
}

export interface AssistantDashboardCounts {
    totalPatients: number;
    totalDoctors: number;
    todayAppointments: number;
    pendingAppointments: number;
}

export interface PatientTrend {
    month: string;
    patients: number;
}

export interface AssistantDashboardData {
    counts: AssistantDashboardCounts;
    appointmentsTrend: AppointmentTrend[];
    patientsTrend: PatientTrend[];
    recentActivity: RecentActivity[];
}

export interface DoctorAppointmentsOverview {
    scheduled: number;
    rescheduled: number;
    cancelled: number;
    completed: number;
}

export interface PatientNotesData {
    name: string;
    voiceNotes: number;
    manualNotes: number;
}

export interface DoctorDashboardData {
    appointmentsOverview: DoctorAppointmentsOverview;
    patientNotesGraph: PatientNotesData[];
    recentActivity: RecentActivity[];
}

export interface NextAppointment {
    id: string;
    date: string;
    time: string;
    fullDateTime: string;
    doctor: {
        name: string;
        specialization: string;
    } | null;
    type: string;
    status: string;
}

export interface LastVisit {
    id: string;
    date: string;
    time: string;
    type: string;
    status: string;
}

export interface UpcomingAppointmentDetails {
    id: string;
    title: string;
    doctor: {
        name: string;
        specialization: string;
    } | null;
    clinic: {
        name: string;
        address: any;
    } | null;
    dateTime: string;
    date: string;
    time: string;
    status: string;
}

export interface PatientDashboardData {
    nextAppointment: NextAppointment | null;
    lastVisit: LastVisit | null;
    upcomingAppointmentDetails: UpcomingAppointmentDetails | null;
    appointmentTrends: AppointmentTrend[];
    recentActivity: RecentActivity[];
}

// ==================== DASHBOARD SERVICE ====================

export const dashboardService = {
    // Admin Dashboard
    async getAdminDashboard(): Promise<AdminDashboardData> {
        const response = await api.get('/admin/dashboard/stats');
        return response.data.data;
    },

    async getAdminCounts(): Promise<AdminDashboardCounts> {
        const response = await api.get('/admin/dashboard/counts');
        return response.data.data;
    },

    async getClinicPerformance(months: number = 6): Promise<ClinicPerformance[]> {
        const response = await api.get('/admin/dashboard/clinic-performance', {
            params: { months }
        });
        return response.data.data;
    },

    async getDoctorPerformance(months: number = 6): Promise<DoctorPerformance[]> {
        const response = await api.get('/admin/dashboard/doctor-performance', {
            params: { months }
        });
        return response.data.data;
    },

    async getPatientGrowth(months: number = 6): Promise<PatientGrowth[]> {
        const response = await api.get('/admin/dashboard/patient-growth', {
            params: { months }
        });
        return response.data.data;
    },

    async getAdminRecentActivity(limit: number = 4): Promise<RecentActivity[]> {
        const response = await api.get('/admin/dashboard/recent-activity', {
            params: { limit }
        });
        return response.data.data;
    },

    // Clinic Dashboard
    async getClinicDashboard(clinicId?: string): Promise<ClinicDashboardData> {
        const url = clinicId ? `/clinic/dashboard/${clinicId}` : '/clinic/dashboard/stats';
        const response = await api.get(url);
        return response.data.data;
    },

    async getClinicCounts(clinicId?: string): Promise<ClinicDashboardCounts> {
        const url = clinicId ? `/clinic/dashboard/counts/${clinicId}` : '/clinic/dashboard/counts';
        const response = await api.get(url);
        return response.data.data;
    },

    async getClinicAppointmentsTrend(clinicId?: string, months: number = 6): Promise<AppointmentTrend[]> {
        const url = clinicId
            ? `/clinic/dashboard/appointments-trend/${clinicId}`
            : '/clinic/dashboard/appointments-trend';
        const response = await api.get(url, { params: { months } });
        return response.data.data;
    },

    async getClinicPatientGrowth(clinicId?: string, months: number = 6): Promise<PatientGrowth[]> {
        const url = clinicId
            ? `/clinic/dashboard/patient-growth/${clinicId}`
            : '/clinic/dashboard/patient-growth';
        const response = await api.get(url, { params: { months } });
        return response.data.data;
    },

    async getClinicRecentActivity(clinicId?: string, limit: number = 4): Promise<RecentActivity[]> {
        const url = clinicId
            ? `/clinic/dashboard/recent-activity/${clinicId}`
            : '/clinic/dashboard/recent-activity';
        const response = await api.get(url, { params: { limit } });
        return response.data.data;
    },

    // Assistant Dashboard
    async getAssistantDashboard(clinicId?: string): Promise<AssistantDashboardData> {
        const url = clinicId ? `/assistant/dashboard/${clinicId}` : '/assistant/dashboard/stats';
        const response = await api.get(url);
        return response.data.data;
    },

    async getAssistantCounts(clinicId?: string): Promise<AssistantDashboardCounts> {
        const url = clinicId ? `/assistant/dashboard/counts/${clinicId}` : '/assistant/dashboard/counts';
        const response = await api.get(url);
        return response.data.data;
    },

    async getAssistantAppointmentsTrend(clinicId?: string, months: number = 6): Promise<AppointmentTrend[]> {
        const url = clinicId
            ? `/assistant/dashboard/appointments-trend/${clinicId}`
            : '/assistant/dashboard/appointments-trend';
        const response = await api.get(url, { params: { months } });
        return response.data.data;
    },

    async getAssistantPatientsTrend(clinicId?: string, months: number = 6): Promise<PatientTrend[]> {
        const url = clinicId
            ? `/assistant/dashboard/patients-trend/${clinicId}`
            : '/assistant/dashboard/patients-trend';
        const response = await api.get(url, { params: { months } });
        return response.data.data;
    },

    async getAssistantRecentActivity(clinicId?: string, limit: number = 4): Promise<RecentActivity[]> {
        const url = clinicId
            ? `/assistant/dashboard/recent-activity/${clinicId}`
            : '/assistant/dashboard/recent-activity';
        const response = await api.get(url, { params: { limit } });
        return response.data.data;
    },

    // Doctor Dashboard
    async getDoctorDashboard(doctorId?: string): Promise<DoctorDashboardData> {
        const url = doctorId ? `/doctor/dashboard/${doctorId}` : '/doctor/dashboard/stats';
        const response = await api.get(url);
        return response.data.data;
    },

    async getDoctorAppointmentsOverview(doctorId?: string): Promise<DoctorAppointmentsOverview> {
        const url = doctorId
            ? `/doctor/dashboard/appointments-overview/${doctorId}`
            : '/doctor/dashboard/appointments-overview';
        const response = await api.get(url);
        return response.data.data;
    },

    async getDoctorPatientNotesGraph(doctorId?: string): Promise<PatientNotesData[]> {
        const url = doctorId
            ? `/doctor/dashboard/patient-notes-graph/${doctorId}`
            : '/doctor/dashboard/patient-notes-graph';
        const response = await api.get(url);
        return response.data.data;
    },

    async getDoctorRecentActivity(doctorId?: string, limit: number = 10): Promise<RecentActivity[]> {
        const url = doctorId
            ? `/doctor/dashboard/recent-activity/${doctorId}`
            : '/doctor/dashboard/recent-activity';
        const response = await api.get(url, { params: { limit } });
        return response.data.data;
    },

    // Patient Dashboard
    async getPatientDashboard(patientId?: string): Promise<PatientDashboardData> {
        const url = patientId ? `/patient/dashboard/${patientId}` : '/patient/dashboard/stats';
        const response = await api.get(url);
        return response.data.data;
    },

    async getPatientNextAppointment(patientId?: string): Promise<NextAppointment | null> {
        const url = patientId
            ? `/patient/dashboard/next-appointment/${patientId}`
            : '/patient/dashboard/next-appointment';
        const response = await api.get(url);
        return response.data.data;
    },

    async getPatientLastVisit(patientId?: string): Promise<LastVisit | null> {
        const url = patientId
            ? `/patient/dashboard/last-visit/${patientId}`
            : '/patient/dashboard/last-visit';
        const response = await api.get(url);
        return response.data.data;
    },

    async getPatientUpcomingAppointmentDetails(patientId?: string): Promise<UpcomingAppointmentDetails | null> {
        const url = patientId
            ? `/patient/dashboard/upcoming-appointment/${patientId}`
            : '/patient/dashboard/upcoming-appointment';
        const response = await api.get(url);
        return response.data.data;
    },

    async getPatientAppointmentTrends(patientId?: string, months: number = 6): Promise<AppointmentTrend[]> {
        const url = patientId
            ? `/patient/dashboard/appointment-trends/${patientId}`
            : '/patient/dashboard/appointment-trends';
        const response = await api.get(url, { params: { months } });
        return response.data.data;
    },

    async getPatientRecentActivity(patientId?: string, limit: number = 4): Promise<RecentActivity[]> {
        const url = patientId
            ? `/patient/dashboard/recent-activity/${patientId}`
            : '/patient/dashboard/recent-activity';
        const response = await api.get(url, { params: { limit } });
        return response.data.data;
    },
};
