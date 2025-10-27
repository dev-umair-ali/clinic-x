# Backend API Schema Documentation

Based on the running backend API at `https://api.clinicx.io`, here are the complete schema definitions for all models.

## 📋 **Core Models Schema**

### 1. **Doctor Model**
```typescript
interface Doctor {
  _id: string;                    // MongoDB ObjectId
  name: string;                   // Required
  email: string;                  // Required, email format
  specialization?: string;        // Optional
  phone?: string;                 // Optional
  clinicId?: string;              // Optional, references clinic
  createdAt: string;              // ISO date-time
}

interface CreateDoctorRequest {
  name: string;                   // Required
  email: string;                  // Required, email format
  specialization?: string;        // Optional
  phone?: string;                 // Optional
  clinicId?: string;              // Optional
}
```

### 2. **Patient Model**
```typescript
interface Patient {
  _id: string;                    // MongoDB ObjectId
  name: string;                   // Required
  email: string;                  // Required, email format
  phone?: string;                 // Optional
  insuranceInfo?: {               // Optional nested object
    provider?: string;
    policyNumber?: string;
  };
  medicalHistory?: string;        // Optional
  createdAt: string;              // ISO date-time
}

interface CreatePatientRequest {
  name: string;                   // Required
  email: string;                  // Required, email format
  phone?: string;                 // Optional
  insuranceInfo?: {               // Optional nested object
    provider?: string;
    policyNumber?: string;
  };
  medicalHistory?: string;        // Optional
}
```

### 3. **Appointment Model**
```typescript
interface Appointment {
  _id: string;                    // MongoDB ObjectId
  doctor: string;                 // Required, references doctor ID
  patient: string;                // Required, references patient ID
  dateTime: string;               // Required, ISO date-time
  status: "scheduled" | "completed" | "cancelled";  // Enum
  notes?: string;                 // Optional
  createdAt: string;              // ISO date-time
}

interface CreateAppointmentRequest {
  doctor: string;                 // Required
  patient: string;                // Required
  dateTime: string;               // Required, ISO date-time
  status?: "scheduled" | "completed" | "cancelled";  // Optional, defaults to "scheduled"
  notes?: string;                 // Optional
}
```

### 4. **Prescription Model**
```typescript
interface Prescription {
  _id: string;                    // MongoDB ObjectId
  patient: string;                // Required, references patient ID
  doctor: string;                 // Required, references doctor ID
  medication: string;             // Required
  dosage: string;                 // Required
  instructions: string;           // Required
  status: "sent" | "in-progress" | "ready" | "delivered";  // Enum
  createdAt: string;              // ISO date-time
}

interface CreatePrescriptionRequest {
  patient: string;                // Required
  doctor: string;                 // Required
  medication: string;             // Required
  dosage: string;                 // Required
  instructions: string;           // Required
}
```

### 5. **Bill Model**
```typescript
interface Bill {
  _id: string;                    // MongoDB ObjectId
  patient: string;                // Required, references patient ID
  doctor: string;                 // Required, references doctor ID
  amount: number;                 // Required, decimal number
  status: "unpaid" | "paid" | "pending" | "cancelled";  // Enum
  notes?: string;                 // Optional
  createdAt: string;              // ISO date-time
}

interface CreateBillRequest {
  patient: string;                // Required
  doctor: string;                 // Required
  amount: number;                 // Required
  status?: "unpaid" | "paid" | "pending" | "cancelled";  // Optional, defaults to "unpaid"
  notes?: string;                 // Optional
}
```

### 6. **Clinic Model**
```typescript
interface Clinic {
  _id: string;                    // MongoDB ObjectId
  name: string;                   // Required
  ownerUser: string;              // Required, references user ID
  address?: {                     // Optional nested object
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;                 // Optional
  email?: string;                 // Optional, email format
  settings?: {                    // Optional nested object
    timezone?: string;
    currency?: string;
  };
  createdAt: string;              // ISO date-time
}

interface CreateClinicRequest {
  name: string;                   // Required
  ownerUser: string;              // Required
  address?: {                     // Optional
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;                 // Optional
  email?: string;                 // Optional
  settings?: {                    // Optional
    timezone?: string;
    currency?: string;
  };
}
```

### 7. **Claim Model**
```typescript
interface Claim {
  _id: string;                    // MongoDB ObjectId
  patient: string;                // Required, references patient ID
  doctor: string;                 // Required, references doctor ID
  clinic: string;                 // Required, references clinic ID
  appointment?: string;           // Optional, references appointment ID
  insurance: {                    // Required nested object
    provider?: string;
    plan?: string;
    memberId?: string;
    groupNumber?: string;
    copay?: number;
    deductible?: number;
  };
  cptCodes: Array<{              // Array of objects
    code: string;
    description: string;
  }>;
  amount: number;                 // Required
  status: "draft" | "submitted" | "processing" | "approved" | "rejected";  // Enum
  externalClaimId?: string;       // Optional
  response?: any;                 // Optional, any type
  createdAt: string;              // ISO date-time
  updatedAt: string;              // ISO date-time
}

interface CreateClaimRequest {
  patient: string;                // Required
  doctor: string;                 // Required
  clinic: string;                 // Required
  appointment?: string;           // Optional
  insurance: {                    // Required
    provider?: string;
    plan?: string;
    memberId?: string;
    groupNumber?: string;
    copay?: number;
    deductible?: number;
  };
  cptCodes: Array<{              // Required array
    code: string;
    description: string;
  }>;
  amount: number;                 // Required
}
```

### 8. **CPT Code Model**
```typescript
interface CPTCode {
  _id: string;                    // MongoDB ObjectId
  code: string;                   // Required
  description: string;            // Required
  category?: string;              // Optional
  isActive?: boolean;             // Optional, boolean
  createdAt: string;              // ISO date-time
}

interface UpsertCPTRequest {
  code: string;                   // Required
  description: string;            // Required
  category?: string;              // Optional
}
```

### 9. **Calendly Link Model**
```typescript
interface CalendlyLink {
  _id: string;                    // MongoDB ObjectId
  user: string;                   // Required, references user ID
  accessToken: string;            // Required
  organizationUri: string;        // Required
  userUri: string;                // Required
  connected: boolean;             // Required, boolean
  connectedAt: string;            // ISO date-time
}

interface ConnectCalendlyRequest {
  userId: string;                 // Required
  accessToken: string;            // Required
  organizationUri: string;        // Required
  userUri: string;                // Required
}
```

### 10. **Pharmacy Submission Model**
```typescript
interface PharmacySubmission {
  _id: string;                    // MongoDB ObjectId
  prescription: string;           // Required, references prescription ID
  patient: string;                // Required, references patient ID
  doctor: string;                 // Required, references doctor ID
  pharmacyName: string;           // Required
  externalId?: string;            // Optional
  status: "pending" | "sent" | "in_progress" | "ready" | "delivered" | "failed";  // Enum
  response?: any;                 // Optional, any type
  createdAt: string;              // ISO date-time
  updatedAt: string;              // ISO date-time
}

interface SubmitPharmacyRequest {
  prescription: string;           // Required
  patient: string;                // Required
  doctor: string;                 // Required
  pharmacyName: string;           // Required
}
```

### 11. **Refill Request Model**
```typescript
interface RefillRequest {
  _id: string;                    // MongoDB ObjectId
  prescription: string;           // Required, references prescription ID
  patient: string;                // Required, references patient ID
  doctor: string;                 // Required, references doctor ID
  status: "pending" | "approved" | "denied";  // Enum
  notes?: string;                 // Optional
  requestedAt: string;            // ISO date-time
  processedAt?: string;           // Optional, ISO date-time
}

interface CreateRefillRequest {
  prescription: string;           // Required
  patient: string;                // Required
  doctor: string;                 // Required
  notes?: string;                 // Optional
}
```

### 12. **Notification Model**
```typescript
interface Notification {
  _id: string;                    // MongoDB ObjectId
  user: string;                   // Required, references user ID
  type: "booking" | "cancellation" | "prescription" | "billing" | "system";  // Enum
  title: string;                  // Required
  message: string;                // Required
  read: boolean;                  // Required, boolean
  createdAt: string;              // ISO date-time
}

interface CreateNotificationRequest {
  user: string;                   // Required
  type: string;                   // Required
  title: string;                  // Required
  message: string;                // Required
}
```

### 13. **Report Model**
```typescript
interface Report {
  _id: string;                    // MongoDB ObjectId
  clinic: string;                 // Required, references clinic ID
  type: "roi_weekly" | "billing_summary" | "appointments_summary";  // Enum
  periodStart: string;            // Required, ISO date-time
  periodEnd: string;              // Required, ISO date-time
  status: "pending" | "generated" | "failed";  // Enum
  url?: string;                   // Optional
  createdAt: string;              // ISO date-time
}

interface CreateReportRequest {
  clinic: string;                 // Required
  type: string;                   // Required
  periodStart: string;            // Required, ISO date-time
  periodEnd: string;              // Required, ISO date-time
}
```

## 🔐 **Authentication Models**

### 14. **Auth Signup Request**
```typescript
interface AuthSignupRequest {
  email: string;                  // Required, email format
  firstName: string;              // Required
  lastName: string;               // Required
  role: string;                   // Required
  phoneNumber?: string;           // Optional
  dateOfBirth?: string;           // Optional, date format (YYYY-MM-DD)
  hipaaConsent: boolean;          // Required, boolean
  password: string;               // Required, password format
}
```

### 15. **Auth Login Request**
```typescript
interface AuthLoginRequest {
  email: string;                  // Required, email format
  password: string;               // Required, password format
}
```

## 📊 **Common Response Patterns**

### Standard API Response
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

### Error Response
```typescript
interface ErrorResponse {
  message: string;
}
```

### ID Parameter
```typescript
interface IdParam {
  id: string;                     // Resource ID (MongoDB ObjectId)
}
```

## 🔗 **API Endpoints Summary**

### **Authentication & User Management**
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/cognito-login` - Cognito authentication
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout
- `POST /auth/verify-email` - Email verification
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset confirmation
- `GET /auth/me` - Get current user profile

### **Core Healthcare Management**
- `GET|POST /doctors` - Doctor management
- `GET|POST /patients` - Patient management
- `GET|POST /appointments` - Appointment management
- `GET|POST /prescriptions` - Prescription management
- `GET|POST /bills` - Billing management

### **Clinic & Facility Management**
- `GET|POST /clinics` - Clinic management
- `POST /calendly/connect` - Connect Calendly
- `POST /calendly/disconnect` - Disconnect Calendly
- `GET /calendly/{userId}` - Get Calendly by user ID

### **Financial Management**
- `GET|POST /claims` - Claims management
- `POST /claims/{id}/submit` - Submit claim
- `GET|POST /cpt` - CPT codes management
- `POST /cpt/extract` - Extract CPT codes

### **Pharmacy & Medication**
- `POST /pharmacy/submit` - Submit pharmacy request
- `POST /pharmacy/{id}/status` - Update pharmacy status
- `GET|POST /refills` - Refill management
- `POST /refills/{id}/status` - Update refill status

### **Communication & Notifications**
- `GET|POST /notifications` - Notification management
- `POST /notifications/{id}/read` - Mark notification as read

### **Reporting & Analytics**
- `GET|POST /reports` - Report management
- `POST /reports/{id}/generated` - Mark report as generated

### **System & Health**
- `GET /health` - Health check
- `GET /openapi.json` - OpenAPI specification
- `GET /docs` - Swagger UI documentation

## 🎯 **Key Schema Notes**

1. **All models use MongoDB ObjectId** for `_id` fields
2. **Date fields** are in ISO 8601 format (date-time)
3. **Email fields** use email format validation
4. **Password fields** use password format validation
5. **Enum fields** have predefined string values
6. **Nested objects** are optional unless specified as required
7. **Arrays** are typed with their item structure
8. **All timestamps** are automatically managed by the backend

This schema documentation provides the complete structure for all backend models and can be used to ensure proper integration between frontend and backend systems.
