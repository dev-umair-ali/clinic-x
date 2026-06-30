import { IDS } from "./ids";

const now = new Date();
const iso = (d: Date) => d.toISOString();
const daysAgo = (n: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return iso(d);
};
const daysAhead = (n: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + n);
  return iso(d);
};

export const recentActivity = [
  { description: "New patient registered — Sarah Johnson", timeAgo: "2 hours ago", timestamp: daysAgo(0) },
  { description: "Appointment completed — Dr. Chen", timeAgo: "4 hours ago", timestamp: daysAgo(0) },
  { description: "Insurance claim submitted", timeAgo: "1 day ago", timestamp: daysAgo(1) },
  { description: "Lab results uploaded", timeAgo: "2 days ago", timestamp: daysAgo(2) },
];

export const appointmentTrends = [
  { month: "Jan", appointments: 42 },
  { month: "Feb", appointments: 58 },
  { month: "Mar", appointments: 65 },
  { month: "Apr", appointments: 72 },
  { month: "May", appointments: 68 },
  { month: "Jun", appointments: 81 },
];

export const patientGrowth = [
  { month: "Jan", patients: 12 },
  { month: "Feb", patients: 18 },
  { month: "Mar", patients: 24 },
  { month: "Apr", patients: 31 },
  { month: "May", patients: 28 },
  { month: "Jun", patients: 35 },
];

export const clinics = [
  {
    _id: IDS.CLINIC_1,
    clinicName: "City Health Center",
    clinicSpecaility: ["General Practice", "Family Medicine"],
    ownerName: "Demo Clinic Owner",
    ownerEmail: "clinic@clinicx.demo",
    ownerPhone: "+1 (555) 100-2000",
    email: "contact@cityhealth.demo",
    clinicPhone: "+1 (555) 100-2001",
    address: { street: "123 Medical Drive", city: "Austin", state: "TX", zipCode: "78701", country: "USA" },
    bio: "Full-service family health clinic.",
    status: "active" as const,
    timezone: "America/Chicago",
    totalPatients: 248,
    totalDoctors: 8,
    totalAssistants: 4,
    totalRevenue: 125000,
    createdAt: daysAgo(180),
    updatedAt: daysAgo(1),
  },
  {
    _id: IDS.CLINIC_2,
    clinicName: "Westside Wellness Clinic",
    clinicSpecaility: ["Pediatrics", "Dermatology"],
    ownerName: "Maria Garcia",
    ownerEmail: "maria@westside.demo",
    email: "info@westside.demo",
    clinicPhone: "+1 (555) 200-3000",
    address: { street: "456 Wellness Blvd", city: "Dallas", state: "TX", zipCode: "75201", country: "USA" },
    status: "active" as const,
    timezone: "America/Chicago",
    totalPatients: 156,
    totalDoctors: 5,
    totalAssistants: 2,
    createdAt: daysAgo(120),
    updatedAt: daysAgo(3),
  },
];

export const doctors = [
  {
    _id: IDS.DOCTOR_1,
    userRef: "user-doctor-001",
    firstName: "Sarah",
    lastName: "Chen",
    name: "Dr. Sarah Chen",
    email: "doctor@clinicx.demo",
    phoneNumber: "+1 (555) 300-4001",
    age: 38,
    dateOfBirth: "1987-03-15",
    gender: "female" as const,
    specialization: "Internal Medicine",
    yearsOfExperience: "12",
    licenseNumber: "TX-MD-88421",
    bio: "Board-certified internist specializing in preventive care.",
    clinicRef: IDS.CLINIC_1,
    profilePicture: "/placeholder.svg?height=80&width=80",
    status: "active" as const,
    role: "doctor" as const,
    hipaaConsent: true,
    createdAt: daysAgo(90),
  },
  {
    _id: IDS.DOCTOR_2,
    userRef: "user-doctor-002",
    firstName: "James",
    lastName: "Wilson",
    name: "Dr. James Wilson",
    email: "jwilson@cityhealth.demo",
    phoneNumber: "+1 (555) 300-4002",
    age: 45,
    dateOfBirth: "1980-07-22",
    gender: "male" as const,
    specialization: "Cardiology",
    yearsOfExperience: "18",
    licenseNumber: "TX-MD-77210",
    clinicRef: IDS.CLINIC_1,
    profilePicture: "/placeholder.svg?height=80&width=80",
    status: "active" as const,
    role: "doctor" as const,
    hipaaConsent: true,
    createdAt: daysAgo(60),
  },
];

export const patients = [
  {
    _id: IDS.PATIENT_1,
    userRef: "user-patient-001",
    clinicRef: IDS.CLINIC_1,
    doctorRef: IDS.DOCTOR_1,
    firstName: "Emily",
    lastName: "Johnson",
    email: "patient@clinicx.demo",
    phoneNumber: "+1 (555) 400-5001",
    age: 34,
    dateOfBirth: "1991-05-20",
    gender: "female" as const,
    profilePicture: "/placeholder.svg?height=80&width=80",
    bloodType: "O+",
    insuranceProvider: "BlueCross BlueShield",
    insuranceInfo: "Policy #BC-8829100",
    allergies: "Penicillin",
    currentMedication: "Lisinopril 10mg",
    address: { street: "789 Oak Street", city: "Austin", state: "TX", zipCode: "78702", country: "USA" },
    status: "active" as const,
    role: "patient" as const,
    formCompletionPercentage: 100,
    lastVisit: daysAgo(14),
    createdAt: daysAgo(45),
  },
  {
    _id: IDS.PATIENT_2,
    userRef: "user-patient-002",
    clinicRef: IDS.CLINIC_1,
    doctorRef: IDS.DOCTOR_1,
    firstName: "Michael",
    lastName: "Brown",
    email: "mbrown@email.demo",
    phoneNumber: "+1 (555) 400-5002",
    age: 52,
    dateOfBirth: "1973-11-08",
    gender: "male" as const,
    profilePicture: "/placeholder.svg?height=80&width=80",
    bloodType: "A+",
    insuranceProvider: "Aetna",
    status: "active" as const,
    role: "patient" as const,
    formCompletionPercentage: 85,
    lastVisit: daysAgo(7),
    createdAt: daysAgo(30),
  },
  {
    _id: IDS.PATIENT_3,
    userRef: "user-patient-003",
    clinicRef: IDS.CLINIC_1,
    doctorRef: IDS.DOCTOR_2,
    firstName: "Lisa",
    lastName: "Martinez",
    email: "lmartinez@email.demo",
    phoneNumber: "+1 (555) 400-5003",
    age: 28,
    dateOfBirth: "1997-02-14",
    gender: "female" as const,
    bloodType: "B+",
    status: "active" as const,
    role: "patient" as const,
    formCompletionPercentage: 60,
    lastVisit: daysAgo(21),
    createdAt: daysAgo(15),
  },
];

export const assistants = [
  {
    _id: IDS.ASSISTANT_1,
    userRef: "user-assistant-001",
    clinicRef: IDS.CLINIC_1,
    firstName: "Anna",
    lastName: "Reed",
    name: "Anna Reed",
    email: "assistant@clinicx.demo",
    phoneNumber: "+1 (555) 500-6001",
    age: 29,
    gender: "female" as const,
    profilePicture: "/placeholder.svg?height=80&width=80",
    status: "active" as const,
    role: "assistant" as const,
    createdAt: daysAgo(60),
  },
];

export const appointments = [
  {
    _id: IDS.APPT_1,
    doctor: IDS.DOCTOR_1,
    doctorRef: doctors[0],
    doctorName: "Dr. Sarah Chen",
    patientRef: { _id: IDS.PATIENT_1, name: "Emily Johnson", email: "patient@clinicx.demo", phone: "+1 (555) 400-5001", avatar: "/placeholder.svg?height=40&width=40" },
    patientName: "Emily Johnson",
    patientId: IDS.PATIENT_1,
    dateTime: daysAhead(2),
    timeZone: "America/Chicago",
    status: "scheduled" as const,
    service: "Annual Checkup",
    title: "Annual Physical",
    notes: "Fasting required",
    type: "In-person",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  },
  {
    _id: IDS.APPT_2,
    doctor: IDS.DOCTOR_1,
    doctorRef: doctors[0],
    doctorName: "Dr. Sarah Chen",
    patientRef: { _id: IDS.PATIENT_2, name: "Michael Brown", email: "mbrown@email.demo" },
    patientName: "Michael Brown",
    patientId: IDS.PATIENT_2,
    dateTime: daysAhead(5),
    timeZone: "America/Chicago",
    status: "scheduled" as const,
    service: "Follow-up",
    title: "Blood Pressure Follow-up",
    createdAt: daysAgo(3),
    updatedAt: daysAgo(2),
  },
  {
    _id: IDS.APPT_3,
    doctor: IDS.DOCTOR_1,
    doctorName: "Dr. Sarah Chen",
    patientRef: { _id: IDS.PATIENT_1, name: "Emily Johnson" },
    patientName: "Emily Johnson",
    patientId: IDS.PATIENT_1,
    dateTime: daysAgo(3),
    timeZone: "America/Chicago",
    status: "completed" as const,
    service: "Consultation",
    title: "General Consultation",
    createdAt: daysAgo(10),
    updatedAt: daysAgo(3),
  },
  {
    _id: IDS.APPT_4,
    doctor: IDS.DOCTOR_2,
    doctorName: "Dr. James Wilson",
    patientRef: { _id: IDS.PATIENT_3, name: "Lisa Martinez" },
    patientName: "Lisa Martinez",
    patientId: IDS.PATIENT_3,
    dateTime: daysAgo(1),
    timeZone: "America/Chicago",
    status: "cancelled" as const,
    service: "Cardiology",
    title: "ECG Review",
    createdAt: daysAgo(8),
    updatedAt: daysAgo(1),
  },
];

export const notes = [
  {
    _id: IDS.NOTE_1,
    title: "Annual Checkup Notes",
    rawText: "Patient reports feeling well. BP 120/80. Continue current medication.",
    audioTranscriptUrl: "",
    patientRef: { _id: IDS.PATIENT_1, firstName: "Emily", lastName: "Johnson" },
    doctorRef: { _id: IDS.DOCTOR_1, firstName: "Sarah", lastName: "Chen" },
    appointmentRef: { _id: IDS.APPT_3, service: "Consultation", date: daysAgo(3) },
    transcription: "Patient reports feeling well. Blood pressure normal.",
    summary: "Routine visit — stable condition.",
    status: "transcribed" as const,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    _id: IDS.NOTE_2,
    title: "Follow-up Visit",
    rawText: "Discussed lifestyle changes. Ordered lipid panel.",
    audioTranscriptUrl: "",
    patientRef: { _id: IDS.PATIENT_2, firstName: "Michael", lastName: "Brown" },
    doctorRef: { _id: IDS.DOCTOR_1, firstName: "Sarah", lastName: "Chen" },
    status: "transcribed" as const,
    createdAt: daysAgo(7),
    updatedAt: daysAgo(7),
  },
  {
    _id: IDS.NOTE_3,
    title: "Pending Voice Note",
    rawText: "",
    audioTranscriptUrl: "/placeholder.svg",
    patientRef: { _id: IDS.PATIENT_3, firstName: "Lisa", lastName: "Martinez" },
    doctorRef: { _id: IDS.DOCTOR_2, firstName: "James", lastName: "Wilson" },
    status: "pending" as const,
    audioFileUrl: "/placeholder.svg",
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
];

export const auditLogs = [
  {
    _id: IDS.AUDIT_1,
    action: "CREATE",
    actorId: "demo-admin",
    actorRole: "admin",
    actorUser: { firstName: "Demo", lastName: "Admin", email: "admin@clinicx.demo" },
    actorName: "Demo Admin",
    entityType: "patient",
    entityId: IDS.PATIENT_1,
    entityName: "Emily Johnson",
    clinicRef: IDS.CLINIC_1,
    clinicName: "City Health Center",
    status: "success" as const,
    timestamp: daysAgo(1),
    createdAt: daysAgo(1),
  },
  {
    _id: "audit-002",
    action: "UPDATE",
    actorId: IDS.DOCTOR_1,
    actorRole: "doctor",
    actorUser: { firstName: "Sarah", lastName: "Chen" },
    actorName: "Dr. Sarah Chen",
    entityType: "appointment",
    entityId: IDS.APPT_1,
    entityName: "Annual Physical",
    clinicRef: IDS.CLINIC_1,
    clinicName: "City Health Center",
    status: "success" as const,
    timestamp: daysAgo(2),
    createdAt: daysAgo(2),
  },
  {
    _id: "audit-003",
    action: "LOGIN",
    actorId: IDS.ASSISTANT_1,
    actorRole: "assistant",
    actorUser: { firstName: "Anna", lastName: "Reed" },
    actorName: "Anna Reed",
    entityType: "user",
    entityId: IDS.ASSISTANT_1,
    clinicRef: IDS.CLINIC_1,
    status: "success" as const,
    timestamp: daysAgo(0),
    createdAt: daysAgo(0),
  },
];

export const adminDashboard = {
  counts: { totalClinics: 2, totalStaff: 12, totalDoctors: 8, totalPatients: 248 },
  clinicPerformance: [
    { clinic: "City Health Center", appointments: 81 },
    { clinic: "Westside Wellness", appointments: 54 },
  ],
  appointmentsTrend: appointmentTrends,
  doctorPerformance: [
    { clinic: "City Health Center", appointments: 45 },
    { clinic: "Westside Wellness", appointments: 32 },
  ],
  patientGrowth,
  recentActivity,
};

export const clinicDashboard = {
  counts: { totalDoctors: 8, totalStaff: 12, totalPatients: 248, totalAppointments: 386 },
  appointmentsTrend: appointmentTrends,
  clinicPerformance: adminDashboard.clinicPerformance,
  doctorPerformance: adminDashboard.doctorPerformance,
  patientGrowth,
  recentActivity,
};

export const assistantDashboard = {
  counts: { totalPatients: 248, totalDoctors: 8, todayAppointments: 6, pendingAppointments: 3 },
  appointmentsTrend: appointmentTrends,
  patientsTrend: patientGrowth,
  recentActivity,
};

export const doctorDashboard = {
  appointmentsOverview: { scheduled: 12, rescheduled: 2, cancelled: 1, completed: 45 },
  patientNotesGraph: [
    { name: "Emily Johnson", voiceNotes: 3, manualNotes: 5 },
    { name: "Michael Brown", voiceNotes: 1, manualNotes: 4 },
    { name: "Lisa Martinez", voiceNotes: 2, manualNotes: 2 },
  ],
  recentActivity,
};

export const patientDashboard = {
  nextAppointment: {
    id: IDS.APPT_1,
    date: new Date(daysAhead(2)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: "10:00 AM",
    fullDateTime: daysAhead(2),
    doctor: { name: "Dr. Sarah Chen", specialization: "Internal Medicine" },
    type: "Annual Checkup",
    status: "scheduled",
  },
  lastVisit: {
    id: IDS.APPT_3,
    date: new Date(daysAgo(3)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: "2:30 PM",
    type: "Consultation",
    status: "completed",
  },
  upcomingAppointmentDetails: null,
  appointmentTrends: [
    { month: "Jan", appointments: 1 },
    { month: "Feb", appointments: 2 },
    { month: "Mar", appointments: 1 },
    { month: "Apr", appointments: 2 },
    { month: "May", appointments: 1 },
    { month: "Jun", appointments: 2 },
  ],
  recentActivity: recentActivity.slice(0, 3),
};

export const clinicTheme = {
  _id: IDS.THEME_1,
  clinicId: IDS.CLINIC_1,
  theme: {
    primary: "#61C2B4",
    secondary: "#2D3748",
    accent: "#4299E1",
    logo: null as string | null,
  },
  createdAt: daysAgo(30),
  updatedAt: daysAgo(5),
};

export const availability = {
  _id: IDS.AVAIL_1,
  timeZone: "America/Chicago",
  availableDays: [
    { day: "Monday", from: "09:00", to: "17:00" },
    { day: "Tuesday", from: "09:00", to: "17:00" },
    { day: "Wednesday", from: "09:00", to: "13:00" },
    { day: "Thursday", from: "09:00", to: "17:00" },
    { day: "Friday", from: "09:00", to: "15:00" },
  ],
};

export const billingCharges = [
  {
    _id: IDS.CHARGE_1,
    chargeId: "CHG-2024-001",
    invoiceNumber: "INV-88421",
    patientId: patients[0],
    doctorId: doctors[0],
    clinicId: clinics[0],
    appointmentId: IDS.APPT_3,
    items: [{ cptCode: "99213", description: "Office Visit", quantity: 1, unitPrice: 150, totalPrice: 150, dateOfService: daysAgo(3) }],
    totalCharge: 150,
    amountDue: 25,
    amountPaid: 125,
    balance: 25,
    status: "pending" as const,
    paymentStatus: "partially_paid" as const,
    issueDate: new Date(daysAgo(3)),
    dueDate: new Date(daysAhead(30)),
    serviceDate: new Date(daysAgo(3)),
    visitType: "Office Visit",
    isOverdue: false,
    payments: [{ amount: 125, date: daysAgo(2), method: "Insurance" }],
    createdAt: new Date(daysAgo(3)),
    updatedAt: new Date(daysAgo(2)),
  },
];

export const billingClaims = [
  {
    _id: IDS.CLAIM_1,
    claimId: "CLM-2024-001",
    claimNumber: "BC-8829100-01",
    chargeId: IDS.CHARGE_1,
    patientId: patients[0],
    doctorId: doctors[0],
    clinicId: clinics[0],
    insuranceProvider: { name: "BlueCross BlueShield", payerId: "BCBS-TX" },
    totalCharges: 150,
    allowedAmount: 130,
    paidAmount: 105,
    deductible: 20,
    coinsurance: 0,
    copay: 25,
    patientResponsibility: 25,
    procedureCodes: [{ cptCode: "99213", description: "Office Visit", quantity: 1, chargedAmount: 150, allowedAmount: 130, paidAmount: 105, adjustmentAmount: 20 }],
    diagnosisCodes: ["Z00.00"],
    serviceDate: new Date(daysAgo(3)),
    submissionDate: new Date(daysAgo(2)),
    status: "submitted" as const,
    createdAt: new Date(daysAgo(2)),
    updatedAt: new Date(daysAgo(1)),
  },
];

export const doctorStats = {
  totalRevenue: 45200,
  totalPaid: 38400,
  totalPending: 6800,
  chargeCount: 86,
  paidCount: 72,
  pendingCount: 14,
  overdueCount: 3,
  overdueAmount: 1200,
  averageChargeAmount: 525,
  topProcedures: [
    { code: "99213", description: "Office Visit", count: 32, revenue: 4800 },
    { code: "99214", description: "Extended Visit", count: 18, revenue: 3600 },
  ],
};

export const cptCodes = [
  { code: "99213", description: "Office visit, established patient, low complexity" },
  { code: "99214", description: "Office visit, established patient, moderate complexity" },
  { code: "99203", description: "Office visit, new patient, low complexity" },
];

export const icd10Codes = [
  { code: "Z00.00", description: "General adult medical examination" },
  { code: "I10", description: "Essential hypertension" },
  { code: "E11.9", description: "Type 2 diabetes mellitus" },
];

export const onboardingForms = {
  personalInfo: { firstName: "Emily", lastName: "Johnson", email: "patient@clinicx.demo", phone: "+1 (555) 400-5001", dateOfBirth: "1991-05-20", gender: "female" },
  insurance: { provider: "BlueCross BlueShield", policyNumber: "BC-8829100", groupNumber: "GRP-100" },
  presentCondition: { chiefComplaint: "Annual wellness visit", symptoms: ["None"], duration: "N/A" },
  healthHistory: { conditions: ["Hypertension"], surgeries: [], familyHistory: "Father — heart disease" },
  lifestyle: { smoking: "Never", alcohol: "Occasional", exercise: "3x per week" },
  medicalProfile: { bloodType: "O+", allergies: ["Penicillin"], medications: ["Lisinopril 10mg"] },
  dentalHistory: { lastVisit: "6 months ago", concerns: "None" },
  womenForm: null,
  consentLegal: { hipaaConsent: true, signedAt: daysAgo(45) },
  documentUploads: { idUploaded: true, insuranceCardUploaded: true },
  formsCompleted: {
    onboarding: true, medicalProfile: true, insurance: true, dentalHistory: true,
    historyHealth: true, lifeStyle: true, women: false, constantLegal: true, presentCondition: true,
  },
  formCompletionPercentage: 100,
};

export const pagination = (items: unknown[], page = 1, limit = 10) => ({
  currentPage: page,
  totalPages: Math.max(1, Math.ceil(items.length / limit)),
  totalItems: items.length,
  itemsPerPage: limit,
});

export const doctorPatients = patients.map((p) => ({
  ...p,
  id: p._id,
  fullName: `${p.firstName} ${p.lastName}`,
  phone: p.phoneNumber,
  medicalHistory: p.allergies || "",
  address: `${p.address?.street}, ${p.address?.city}`,
  avatar: p.profilePicture,
  lastVisit: p.lastVisit || daysAgo(14),
}));
