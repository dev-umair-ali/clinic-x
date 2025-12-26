// Export all services
export { appointmentService } from './services/appointmentService';
export { authService } from './services/authService';
export { patientService } from './services/patientService';
export { doctorService } from './services/doctorService';
export { doctorPatientService } from './services/doctorPatientService';
export { profileService } from './services/profileService';
export { prescriptionService } from './services/prescriptionService';
export { billingService } from './services/billingService';
export { refillService } from './services/refillService';
export { reportsService } from './services/reportsService';
export { uploadService } from './services/uploadService';
export { clinicService } from './services/clinicService';

// Export axios instance and utilities
export { default as api, setAuthToken, clearAuthToken } from './axios';

// Export types
export type { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest, AppointmentResponse, AppointmentsListResponse } from './services/appointmentService';
export type { LoginRequest, LoginResponse, SignupRequest, User } from './services/authService';
export type { CreatePatientRequest, UpdatePatientRequest, PatientResponse, PatientsListResponse } from './services/patientService';
export type { CreateDoctorRequest, UpdateDoctorRequest, DoctorResponse, DoctorsListResponse } from './services/doctorService';
export type { DoctorPatient, CreateDoctorPatientRequest, UpdateDoctorPatientRequest, DoctorPatientResponse, DoctorPatientsListResponse, DoctorPatientsByDoctorResponse } from './services/doctorPatientService';
export type { Profile, CreateProfileRequest, UpdateProfileRequest, ProfileResponse, ProfilesListResponse, ProfilesWithLinksResponse } from './services/profileService';
export type { Prescription, CreatePrescriptionRequest, UpdatePrescriptionRequest, PrescriptionResponse, PrescriptionsListResponse } from './services/prescriptionService';
export type { Bill, CreateBillRequest, UpdateBillRequest, BillResponse, BillsListResponse } from './services/billingService';
export type { RefillRequest, CreateRefillRequest, UpdateRefillStatusRequest, RefillResponse, RefillsListResponse } from './services/refillService';
export type { Report, CreateReportRequest, MarkReportGeneratedRequest, ReportResponse, ReportsListResponse } from './services/reportsService';
export type { UploadResponse, UploadProgress } from './services/uploadService';
export type { Clinic, CreateClinicRequest, UpdateClinicRequest, ClinicResponse, ClinicsListResponse, ClinicDashboard, ClinicDashboardResponse, AppointmentsTrendData, AppointmentsTrendResponse, RevenueTrendData, RevenueTrendResponse, LogoUploadResponse, LogoGetResponse } from './services/clinicService';
