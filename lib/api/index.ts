// Export all services
export { authService } from './services/authService';
export { clinicService } from './services/clinicService';

export { appointmentService } from './services/appointmentService';
export { patientService } from './services/patientService';
export { doctorService } from './services/doctorService';
export { assistantService } from './services/assistantService';
export { doctorPatientService } from './services/doctorPatientService';
export { profileService } from './services/profileService';
export { prescriptionService } from './services/prescriptionService';
export { billingService } from './services/billingService';
export { refillService } from './services/refillService';
export { reportsService } from './services/reportsService';
export { uploadService } from './services/uploadService';
export { clinicAssistantService } from './services/clinicAssistantService';
export { clinicDoctorService } from './services/clinicDoctorService';
export { clinicPatientService } from './services/clinicPatientService';
export { assistantDoctorService } from './services/assistantDoctorService';
export { assistantPatientService } from './services/assistantPatientService';
export { themeService } from './services/themeService';

// Export axios instance and utilities
export { default as api, setAuthToken, clearAuthToken } from './axios';

// Export types
export type { LoginRequest, LoginResponse, SignupRequest, User } from './services/authService';
export type { Clinic, CreateClinicRequest, UpdateClinicRequest, ClinicResponse, ClinicsListResponse } from './services/clinicService';


export type { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest, AppointmentResponse, AppointmentsListResponse } from './services/appointmentService';
export type { CreatePatientRequest, UpdatePatientRequest, PatientResponse, PatientsListResponse } from './services/patientService';
export type { CreateDoctorRequest, UpdateDoctorRequest, DoctorResponse, DoctorsListResponse } from './services/doctorService';
export type { CreateAssistantRequest, UpdateAssistantRequest, AssistantResponse, AssistantsListResponse } from './services/assistantService';
export type { DoctorPatient, CreateDoctorPatientRequest, UpdateDoctorPatientRequest, DoctorPatientResponse, DoctorPatientsListResponse, DoctorPatientsByDoctorResponse } from './services/doctorPatientService';
export type { Profile, CreateProfileRequest, UpdateProfileRequest, ProfileResponse, ProfilesListResponse, ProfilesWithLinksResponse } from './services/profileService';
export type { Prescription, CreatePrescriptionRequest, UpdatePrescriptionRequest, PrescriptionResponse, PrescriptionsListResponse } from './services/prescriptionService';
export type { Bill, CreateBillRequest, UpdateBillRequest, BillResponse, BillsListResponse } from './services/billingService';
export type { RefillRequest, CreateRefillRequest, UpdateRefillStatusRequest, RefillResponse, RefillsListResponse } from './services/refillService';
export type { Report, CreateReportRequest, MarkReportGeneratedRequest, ReportResponse, ReportsListResponse } from './services/reportsService';
export type { UploadResponse, UploadProgress } from './services/uploadService';
export type { CreateClinicAssistantRequest, UpdateClinicAssistantRequest, ClinicAssistantResponse, ClinicAssistantsListResponse } from './services/clinicAssistantService';
export type { CreateClinicDoctorRequest, UpdateClinicDoctorRequest, ClinicDoctorResponse, ClinicDoctorsListResponse } from './services/clinicDoctorService';
export type { CreateClinicPatientRequest, UpdateClinicPatientRequest, ClinicPatientResponse, ClinicPatientsListResponse } from './services/clinicPatientService';
export type { CreateAssistantDoctorRequest, UpdateAssistantDoctorRequest, AssistantDoctorResponse, AssistantDoctorsListResponse } from './services/assistantDoctorService';
export type { CreateAssistantPatientRequest, UpdateAssistantPatientRequest, AssistantPatientResponse, AssistantPatientsListResponse } from './services/assistantPatientService';
export type { ThemeSettings, ClinicTheme, FetchThemeResponse, SaveThemeRequest, SaveThemeResponse } from './services/themeService';
