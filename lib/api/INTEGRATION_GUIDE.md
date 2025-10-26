# API Integration Guide

This guide shows how to use the newly created services and Redux slices for all the remaining APIs.

## 🚀 **New Services Created**

### 1. **Profile Service** (`profileService.ts`)
- **Endpoints:** All profile management APIs
- **Features:** CRUD operations for profiles, role-based filtering, doctor/patient links

### 2. **Appointment Service** (`appointmentService.ts`) - Enhanced
- **Endpoints:** Complete CRUD operations for appointments
- **Features:** Create, read, update, delete appointments

### 3. **Prescription Service** (`prescriptionService.ts`)
- **Endpoints:** All prescription management APIs
- **Features:** CRUD operations for prescriptions

### 4. **Billing Service** (`billingService.ts`)
- **Endpoints:** All billing management APIs
- **Features:** CRUD operations for bills

### 5. **Refill Service** (`refillService.ts`)
- **Endpoints:** Refill request management APIs
- **Features:** Create refill requests, update status

### 6. **Reports Service** (`reportsService.ts`)
- **Endpoints:** Report generation and management APIs
- **Features:** Create reports, mark as generated

### 7. **Upload Service** (`uploadService.ts`)
- **Endpoints:** File upload APIs
- **Features:** Upload images, videos, audio files with progress tracking

## 🔄 **Redux Slices Created**

### 1. **Profile Slice** (`profileSlice.ts`)
- **State:** `profiles`, `currentProfile`, `loading`, `error`
- **Actions:** All profile CRUD operations

### 2. **Appointment Slice** (`appointmentSlice.ts`) - Enhanced
- **State:** `appointments`, `currentAppointment`, `loading`, `error`
- **Actions:** Complete appointment CRUD operations

### 3. **Prescription Slice** (`prescriptionSlice.ts`)
- **State:** `prescriptions`, `currentPrescription`, `loading`, `error`
- **Actions:** All prescription CRUD operations

### 4. **Billing Slice** (`billingSlice.ts`)
- **State:** `bills`, `currentBill`, `loading`, `error`
- **Actions:** All billing CRUD operations

### 5. **Refill Slice** (`refillSlice.ts`)
- **State:** `refills`, `currentRefill`, `loading`, `error`
- **Actions:** Refill request management

### 6. **Reports Slice** (`reportsSlice.ts`)
- **State:** `reports`, `currentReport`, `loading`, `error`
- **Actions:** Report generation and management

### 7. **Upload Slice** (`uploadSlice.ts`)
- **State:** `uploadedFiles`, `currentUpload`, `loading`, `error`
- **Actions:** File upload with progress tracking

## 📖 **Usage Examples**

### **Using Services Directly**

```typescript
import { 
  profileService, 
  appointmentService, 
  prescriptionService,
  billingService,
  refillService,
  reportsService,
  uploadService 
} from '@/lib/api';

// Profile operations
const myProfile = await profileService.getMyProfile();
const allProfiles = await profileService.getAllProfiles();
const doctorProfiles = await profileService.getProfilesByRole('doctor');

// Appointment operations
const appointments = await appointmentService.getAppointments();
const newAppointment = await appointmentService.createAppointment({
  doctor: 'doctor-id',
  patient: 'patient-id',
  dateTime: '2024-01-15T10:00:00Z',
  notes: 'Regular checkup'
});

// Prescription operations
const prescriptions = await prescriptionService.getPrescriptions();
const newPrescription = await prescriptionService.createPrescription({
  patient: 'patient-id',
  doctor: 'doctor-id',
  medication: 'Aspirin',
  dosage: '100mg',
  instructions: 'Take once daily'
});

// Billing operations
const bills = await billingService.getBills();
const newBill = await billingService.createBill({
  patient: 'patient-id',
  doctor: 'doctor-id',
  amount: 150.00,
  status: 'unpaid'
});

// Refill operations
const refills = await refillService.getRefills();
const newRefill = await refillService.createRefill({
  prescription: 'prescription-id',
  patient: 'patient-id',
  doctor: 'doctor-id',
  notes: 'Patient needs refill'
});

// Reports operations
const reports = await reportsService.getReports();
const newReport = await reportsService.createReport({
  clinic: 'clinic-id',
  type: 'billing_summary',
  periodStart: '2024-01-01T00:00:00Z',
  periodEnd: '2024-01-31T23:59:59Z'
});

// Upload operations
const uploadResponse = await uploadService.uploadImage(file, (progress) => {
  console.log(`Upload progress: ${progress.percentage}%`);
});
```

### **Using Redux Slices**

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { 
  fetchMyProfile, 
  updateMyProfile, 
  fetchAllProfiles 
} from '@/lib/slices/profileSlice';
import { 
  fetchAppointments, 
  createAppointment, 
  updateAppointment 
} from '@/lib/slices/appointmentSlice';
import { 
  fetchPrescriptions, 
  createPrescription 
} from '@/lib/slices/prescriptionSlice';
import { 
  fetchBills, 
  createBill 
} from '@/lib/slices/billingSlice';
import { 
  fetchRefills, 
  createRefill 
} from '@/lib/slices/refillSlice';
import { 
  fetchReports, 
  createReport 
} from '@/lib/slices/reportsSlice';
import { 
  uploadFile, 
  setUploadProgress 
} from '@/lib/slices/uploadSlice';

function MyComponent() {
  const dispatch = useDispatch();
  
  // Selectors
  const { profiles, currentProfile, loading, error } = useSelector((state: RootState) => state.profiles);
  const { appointments } = useSelector((state: RootState) => state.appointments);
  const { prescriptions } = useSelector((state: RootState) => state.prescriptions);
  const { bills } = useSelector((state: RootState) => state.billing);
  const { refills } = useSelector((state: RootState) => state.refills);
  const { reports } = useSelector((state: RootState) => state.reports);
  const { uploadedFiles, currentUpload } = useSelector((state: RootState) => state.upload);

  // Profile operations
  const handleFetchProfile = () => {
    dispatch(fetchMyProfile());
  };

  const handleUpdateProfile = (profileData) => {
    dispatch(updateMyProfile(profileData));
  };

  // Appointment operations
  const handleFetchAppointments = () => {
    dispatch(fetchAppointments());
  };

  const handleCreateAppointment = (appointmentData) => {
    dispatch(createAppointment(appointmentData));
  };

  // Prescription operations
  const handleFetchPrescriptions = () => {
    dispatch(fetchPrescriptions());
  };

  const handleCreatePrescription = (prescriptionData) => {
    dispatch(createPrescription(prescriptionData));
  };

  // Billing operations
  const handleFetchBills = () => {
    dispatch(fetchBills());
  };

  const handleCreateBill = (billData) => {
    dispatch(createBill(billData));
  };

  // Refill operations
  const handleFetchRefills = () => {
    dispatch(fetchRefills());
  };

  const handleCreateRefill = (refillData) => {
    dispatch(createRefill(refillData));
  };

  // Reports operations
  const handleFetchReports = () => {
    dispatch(fetchReports());
  };

  const handleCreateReport = (reportData) => {
    dispatch(createReport(reportData));
  };

  // Upload operations
  const handleFileUpload = (file, type) => {
    dispatch(uploadFile({ 
      file, 
      type, 
      onProgress: (progress) => {
        dispatch(setUploadProgress(progress));
      }
    }));
  };

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
}
```

### **Using the useApi Hook**

```typescript
import { useApi } from '@/lib/hooks/useApi';

function MyComponent() {
  const api = useApi();

  const handleApiCall = async () => {
    // Generic API calls
    const { data: profiles, error: profileError } = await api.get('/profile/');
    const { data: appointments, error: appointmentError } = await api.get('/appointments');
    const { data: prescriptions, error: prescriptionError } = await api.get('/prescriptions');
    const { data: bills, error: billError } = await api.get('/bills');
    const { data: refills, error: refillError } = await api.get('/refills');
    const { data: reports, error: reportError } = await api.get('/reports');

    // POST requests
    const { data: newAppointment, error: createError } = await api.post('/appointments', {
      doctor: 'doctor-id',
      patient: 'patient-id',
      dateTime: '2024-01-15T10:00:00Z'
    });

    // PUT requests
    const { data: updatedProfile, error: updateError } = await api.put('/profile/me', {
      firstName: 'John',
      lastName: 'Doe'
    });

    // DELETE requests
    const { data: deleteResult, error: deleteError } = await api.delete('/appointments/appointment-id');
  };

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
}
```

## 🎯 **Key Features**

### **1. Type Safety**
- All services and Redux slices are fully typed with TypeScript
- Comprehensive interfaces for all API requests and responses
- Type-safe Redux state management

### **2. Error Handling**
- Consistent error handling across all services
- Redux slices include error states and actions
- Automatic error logging and user feedback

### **3. Loading States**
- Loading states for all async operations
- Progress tracking for file uploads
- UI-friendly loading indicators

### **4. State Management**
- Centralized state management with Redux
- Automatic state persistence with localStorage
- Optimistic updates for better UX

### **5. File Upload**
- Support for images, videos, and audio files
- Progress tracking with callbacks
- Automatic file type detection

## 🔧 **Integration Status**

✅ **Fully Integrated APIs:**
- Authentication & User Management
- Patient Management
- Doctor Management
- Profile Management
- Appointment Management (Complete CRUD)
- Prescription Management
- Billing Management
- Refill Management
- Reports Management
- File Upload

## 📝 **Next Steps**

1. **Import the services** in your components
2. **Use Redux hooks** for state management
3. **Implement error handling** in your UI
4. **Add loading states** for better UX
5. **Test the integrations** with your backend

All services are now ready to use throughout your application!
