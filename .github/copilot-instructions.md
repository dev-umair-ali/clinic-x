# Clinic X Frontend - AI Coding Agent Instructions

## Project Overview
Next.js 14 healthcare management platform with role-based access (admin/doctor/patient), AWS Cognito auth, Redux Toolkit state management, and shadcn/ui components.

**Backend API**: `https://api.clinicx.io`  
**Key Documentation**: `BACKEND_SCHEMA_DOCUMENTATION.md`, `INTEGRATION_GUIDE.md`, `DOCTOR_PATIENT_INTEGRATION_GUIDE.md`

---

## 🏗️ Architecture

### Role-Based Routing System
**3 distinct user roles with separate routes**:
- `admin` → `/admin/*` (doctors, patients, billing management)
- `doctor` → `/doctor/*` (appointments, prescriptions, patient notes)
- `patient` → `/patient/*` (appointments, prescriptions, records)

**Implementation details**:
- Role defined in `lib/slices/authSlice.ts` as `"admin" | "doctor" | "patient"` union type
- Root page (`app/page.tsx`) redirects based on `user.role` to appropriate dashboard
- Navigation menu in `components/layout/app-sidebar.tsx` filters items by role
- Email-based role detection in `lib/auth/cognito.ts` (mock auth for demo)

---

## 🔄 Redux State Management

### Store Configuration
**Location**: `lib/store.ts`  
**Persistence**: Auto-saves to `localStorage` as `clinic-ai-state` on every state change  
**Rehydration**: Loads state from localStorage on app initialization

### Available Slices
Located in `lib/slices/`:

| Slice | State Keys | Purpose |
|-------|-----------|---------|
| `authSlice` | `user`, `token`, `isAuthenticated`, `loading` | Authentication & authorization |
| `appointmentSlice` | `appointments`, `currentAppointment`, `loading`, `error` | Appointment CRUD operations |
| `patientSlice` | `patients`, `currentPatient`, `loading`, `error` | General patient management |
| `doctorSlice` | `doctors`, `currentDoctor`, `loading`, `error` | Doctor management |
| `doctorPatientSlice` | `patients`, `currentPatient`, `loading`, `error` | **Doctor-specific** patient operations |
| `prescriptionSlice` | `prescriptions`, `currentPrescription`, `loading`, `error` | Prescription management |
| `billingSlice` | `bills`, `currentBill`, `loading`, `error` | Bill/invoice management |
| `refillSlice` | `refills`, `currentRefill`, `loading`, `error` | Prescription refill requests |
| `reportsSlice` | `reports`, `currentReport`, `loading`, `error` | Report generation |
| `uploadSlice` | `uploadedFiles`, `currentUpload`, `loading`, `error` | File upload with progress |
| `profileSlice` | `profiles`, `currentProfile`, `loading`, `error` | User profile management |

### Redux Usage Pattern
```typescript
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"

// In component
const dispatch = useDispatch<AppDispatch>()
const user = useSelector((state: RootState) => state.auth.user)
const { appointments, loading, error } = useSelector((state: RootState) => state.appointments)

// Dispatch async thunk
dispatch(fetchAppointments())
```

**Critical**: Always type `useDispatch` as `AppDispatch` for async thunk support.

---

## 🌐 Backend Integration Architecture

### Global Axios Instance
**Location**: `lib/api/axios.ts`

**Automatic features**:
1. **JWT Auto-Injection**: Request interceptor reads `clinic-ai-token` from localStorage and adds `Authorization: Bearer {token}` header
2. **401 Auto-Logout**: Response interceptor clears tokens and redirects to `/login` on 401 errors
3. **Base URL**: Configured via `NEXT_PUBLIC_BACKEND_BASE_URL` environment variable

```typescript
// lib/api/axios.ts architecture
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'https://api.clinicx.io/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor - auto-adds JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('clinic-ai-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor - handles 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('clinic-ai-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### Service Layer Pattern
**Location**: `lib/api/services/*.ts`  
**Export Hub**: `lib/api/index.ts`

**All 11 services follow this pattern**:
```typescript
// lib/api/services/appointmentService.ts
import api from '../axios' // Pre-configured with auth

export const appointmentService = {
  async getAppointments(): Promise<AppointmentsListResponse> {
    const response = await api.get('/appointments')
    return response.data
  },
  
  async createAppointment(data: CreateAppointmentRequest): Promise<AppointmentResponse> {
    const response = await api.post('/appointments', data)
    return response.data
  },
  
  async updateAppointment(id: string, data: UpdateAppointmentRequest): Promise<AppointmentResponse> {
    const response = await api.put(`/appointments/${id}`, data)
    return response.data
  },
  
  async deleteAppointment(id: string): Promise<{ success: boolean }> {
    const response = await api.delete(`/appointments/${id}`)
    return response.data
  }
}
```

### Available Services
Import from `@/lib/api`:

```typescript
import { 
  authService,           // Login, signup, token refresh
  appointmentService,    // Appointment CRUD
  patientService,        // General patient CRUD
  doctorService,         // Doctor CRUD
  doctorPatientService,  // Doctor-specific patient CRUD (IMPORTANT!)
  prescriptionService,   // Prescription CRUD
  billingService,        // Bill/invoice CRUD
  refillService,         // Refill request management
  reportsService,        // Report generation
  uploadService,         // File uploads (image/video/audio)
  profileService         // User profile CRUD
} from '@/lib/api'
```

### Critical Distinction: Patient Services
**Two separate patient endpoints exist**:

| Service | Endpoint | Use Case |
|---------|----------|----------|
| `patientService` | `/patients/*` | Admin-level patient management, global patient operations |
| `doctorPatientService` | `/doctors/patients/*` | Doctor-specific patient operations, doctor-patient relationships |

**NEVER mix these endpoints**. Use `doctorPatientService` for doctor dashboard features.

---

## 🔐 Authentication Flow

### Complete Auth Lifecycle
```typescript
// 1. LOGIN (lib/auth/cognito.ts or lib/api/services/authService.ts)
const { user, token } = await CognitoAuth.signIn(email, password)

// 2. REDUX UPDATE (lib/slices/authSlice.ts)
dispatch(loginSuccess({ user, token }))
// This triggers:
//   - state.user = user
//   - state.token = token
//   - state.isAuthenticated = true
//   - localStorage.setItem('clinic-ai-token', token)
//   - localStorage.setItem('clinic-ai-user', JSON.stringify(user))
//   - setAuthToken(token) → updates axios defaults

// 3. AUTO-RESTORE ON APP LOAD (components/layout/main-layout-wrapper.tsx)
useEffect(() => {
  dispatch(initializeAuth()) // Reads from localStorage, sets axios headers
}, [dispatch])

// 4. LOGOUT
dispatch(logout())
// This triggers:
//   - state.user = null
//   - state.token = null
//   - state.isAuthenticated = false
//   - localStorage.clear()
//   - clearAuthToken() → removes axios defaults
```

### Token Management Functions
```typescript
import { setAuthToken, clearAuthToken } from '@/lib/api/axios'

setAuthToken('your-jwt-token')    // Manually set token in axios headers
clearAuthToken()                   // Remove token from axios headers
```

---

## 📡 Backend API Integration Guide

### Complete Backend Schema Reference
See `BACKEND_SCHEMA_DOCUMENTATION.md` for all TypeScript interfaces matching backend models:

**Core Models**: Doctor, Patient, Appointment, Prescription, Bill, Clinic, Claim, CPTCode  
**Pharmacy**: PharmacySubmission, RefillRequest  
**System**: Notification, Report, CalendlyLink  
**Auth**: AuthSignupRequest, AuthLoginRequest

### Response Pattern (All Endpoints)
```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
```

### Example: Integrating a New Backend Endpoint

**Scenario**: Backend added `/api/lab-results` endpoint

**Step 1: Create Service** (`lib/api/services/labResultsService.ts`)
```typescript
import api from '../axios'

export interface LabResult {
  _id: string
  patient: string
  doctor: string
  testType: string
  results: string
  status: "pending" | "completed"
  createdAt: string
}

export interface CreateLabResultRequest {
  patient: string
  doctor: string
  testType: string
  results?: string
}

export const labResultsService = {
  async getLabResults(): Promise<{ success: boolean; data: LabResult[] }> {
    const response = await api.get('/lab-results')
    return response.data
  },
  
  async createLabResult(data: CreateLabResultRequest): Promise<{ success: boolean; data: LabResult }> {
    const response = await api.post('/lab-results', data)
    return response.data
  }
}
```

**Step 2: Export Service** (`lib/api/index.ts`)
```typescript
export { labResultsService } from './services/labResultsService'
export type { LabResult, CreateLabResultRequest } from './services/labResultsService'
```

**Step 3: Create Redux Slice** (`lib/slices/labResultsSlice.ts`)
```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { labResultsService, type LabResult } from '@/lib/api'

interface LabResultsState {
  labResults: LabResult[]
  loading: boolean
  error: string | null
}

const initialState: LabResultsState = {
  labResults: [],
  loading: false,
  error: null
}

export const fetchLabResults = createAsyncThunk(
  'labResults/fetchAll',
  async () => {
    const response = await labResultsService.getLabResults()
    return response.data
  }
)

export const createLabResult = createAsyncThunk(
  'labResults/create',
  async (data: CreateLabResultRequest) => {
    const response = await labResultsService.createLabResult(data)
    return response.data
  }
)

const labResultsSlice = createSlice({
  name: 'labResults',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLabResults.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchLabResults.fulfilled, (state, action) => {
        state.loading = false
        state.labResults = action.payload
      })
      .addCase(fetchLabResults.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch lab results'
      })
      .addCase(createLabResult.fulfilled, (state, action) => {
        state.labResults.push(action.payload)
      })
  }
})

export default labResultsSlice.reducer
```

**Step 4: Add to Store** (`lib/store.ts`)
```typescript
import labResultsSlice from './slices/labResultsSlice'

const rootReducer = combineReducers({
  auth: authSlice,
  // ... other slices
  labResults: labResultsSlice
})
```

**Step 5: Use in Component**
```typescript
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLabResults, createLabResult } from '@/lib/slices/labResultsSlice'
import type { RootState, AppDispatch } from '@/lib/store'

export default function LabResultsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { labResults, loading, error } = useSelector((state: RootState) => state.labResults)
  
  useEffect(() => {
    dispatch(fetchLabResults())
  }, [dispatch])
  
  const handleCreate = async () => {
    await dispatch(createLabResult({
      patient: 'patient-id',
      doctor: 'doctor-id',
      testType: 'Blood Test'
    })).unwrap()
  }
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {labResults.map(result => (
        <div key={result._id}>{result.testType}</div>
      ))}
    </div>
  )
}
```

---

## 🎨 UI Components & Styling

### Component Framework
**shadcn/ui** (Radix UI primitives + Tailwind CSS + CVA)

**Installation pattern**:
```bash
npx shadcn@latest add button dialog table
```

### Component Usage Pattern
```typescript
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { cn } from "@/lib/utils" // tailwind-merge + clsx

// CVA variant example (see components/ui/button.tsx)
<Button variant="destructive" size="lg">Delete</Button>
<Button variant="outline" size="sm">Cancel</Button>

// Conditional classes
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  error && "error-classes"
)}>
```

### Layout Architecture
```typescript
// app/layout.tsx
<ReduxProvider>
  <ThemeProvider>
    <MainLayoutWrapper> {/* Handles auth vs dashboard layout */}
      {children}
    </MainLayoutWrapper>
  </ThemeProvider>
</ReduxProvider>

// MainLayoutWrapper logic (components/layout/main-layout-wrapper.tsx)
const isAuthPage = pathname === "/login" || pathname === "/signup"
if (isAuthPage) return <>{children}</>

return (
  <SidebarProvider>
    <AppSidebar />      {/* Role-based navigation */}
    <SidebarInset>
      <Header />
      {children}
    </SidebarInset>
  </SidebarProvider>
)
```

### Styling Conventions
**Brand Colors**: Teal/green gradient `from-[#126A5C] to-[#1DA68F]` (sidebar)  
**Typography**: Inter font via `--font-inter` CSS variable  
**Dark Mode**: Enabled via `class` strategy in `tailwind.config.ts`  
**Theme Variables**: Defined in `app/globals.css` using CSS custom properties

---

## 🔧 Special Features

### Audio Recording with Transcription
**Component**: `components/ui/AudioRecorder.tsx`

**Capabilities**:
- Web Speech API for real-time transcription
- MediaRecorder for audio capture
- Returns both audio URL and transcription text

**Usage**:
```typescript
<AudioRecorder 
  label="Doctor Notes"
  onSave={(audioUrl) => console.log(audioUrl)}
  onTranscription={(text) => console.log(text)}
/>
```

### Calendly Integration
**Files**: `app/services/calendlyService.ts`, `components/calendly-connection.tsx`

**Endpoints**:
- `POST /api/calendly/connect` - OAuth connection
- `GET /api/calendly/status/:username` - Check connection status
- `GET /api/calendly/availability/:cognitoId` - Fetch available times

---

## 🚀 Development Workflow

### Commands
```bash
pnpm dev          # Development server (port 3000)
pnpm start        # Production server (port 3001 - configured in package.json)
pnpm build        # Next.js production build
pnpm lint         # ESLint check
```

### Environment Variables
**Required in `.env.local`**:
```bash
NEXT_PUBLIC_BACKEND_BASE_URL=https://api.clinicx.io/
NEXT_PUBLIC_AWS_REGION=eu-north-1
NEXT_PUBLIC_AWS_USER_POOL_ID=eu-north-1_bgEkqoJLI
NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID=75sgp2n2jgl32u3e4q8dqjjf93
```

---

## ⚠️ Critical Rules

### ❌ NEVER Do
1. **Manually add `Authorization` headers** - axios auto-handles via interceptor
2. **Mix `/patients` and `/doctors/patients` endpoints** - they serve different purposes
3. **Hardcode role strings** - use `"admin" | "doctor" | "patient"` union type
4. **Access Redux state without typing** - always use `RootState` type
5. **Call API directly without service layer** - always use service methods
6. **Forget `dispatch(initializeAuth())` on app mount** - required for session restore

### ✅ ALWAYS Do
1. **Import services from `@/lib/api`** - centralized export hub
2. **Type Redux hooks**: `useDispatch<AppDispatch>()` and `useSelector((state: RootState) => ...)`
3. **Check user role before rendering** - `user.role === "doctor"`
4. **Use `cn()` for conditional Tailwind classes** - proper merge behavior
5. **Handle loading/error states** - every Redux slice provides these
6. **Export types from service files** - enables type safety across app

---

## 📚 Key Files Reference

### Architecture & Config
- `lib/store.ts` - Redux store configuration with persistence
- `lib/api/axios.ts` - Global axios instance with interceptors
- `lib/api/index.ts` - Service export hub
- `middleware.ts` - Next.js middleware (allows all routes, client-side auth)
- `tailwind.config.ts` - Theme configuration

### Auth & Routing
- `lib/auth/cognito.ts` - Mock Cognito auth implementation
- `lib/slices/authSlice.ts` - Auth state management
- `app/page.tsx` - Root redirector based on user role
- `components/layout/app-sidebar.tsx` - Role-based navigation menu

### Documentation
- `BACKEND_SCHEMA_DOCUMENTATION.md` - Complete API contracts & TypeScript interfaces
- `INTEGRATION_GUIDE.md` - Service & Redux usage examples
- `DOCTOR_PATIENT_INTEGRATION_GUIDE.md` - Doctor-patient relationship patterns
- `lib/api/README.md` - Axios configuration & service patterns

---

## 🎯 Common Integration Tasks

### Task 1: Add New Route
```typescript
// 1. Create page: app/doctor/lab-results/page.tsx
// 2. Add to sidebar menu: components/layout/app-sidebar.tsx
const menuItems = {
  doctor: [
    // ... existing items
    { icon: FlaskIcon, label: "Lab Results", href: "/doctor/lab-results" }
  ]
}
// 3. Add role check if needed
if (user?.role !== "doctor") return <AccessDenied />
```

### Task 2: File Upload with Progress
```typescript
import { uploadService } from '@/lib/api'

const handleUpload = async (file: File) => {
  const response = await uploadService.uploadImage(file, (progress) => {
    console.log(`${progress.percentage}% - ${progress.loaded}/${progress.total} bytes`)
  })
  console.log('Upload URL:', response.url)
}
```

### Task 3: Create New UI Component
```bash
# Use shadcn CLI for pre-built components
npx shadcn@latest add select

# Custom component
# Create in components/ with TypeScript + Tailwind
# Follow pattern: functional component, proper typing, cn() for styles
```

---

## 🔍 Debugging Tips

1. **Auth Issues**: Check browser localStorage for `clinic-ai-token` and `clinic-ai-user`
2. **API Errors**: Check Network tab → Request Headers → `Authorization` should be present
3. **Redux State**: Install Redux DevTools extension to inspect state changes
4. **Type Errors**: Verify imports from `@/lib/api` include both service and types

---

## 📞 Quick Reference

**Get current user**: `useSelector((state: RootState) => state.auth.user)`  
**Dispatch async action**: `await dispatch(fetchAppointments()).unwrap()`  
**Call API directly**: `const data = await appointmentService.getAppointments()`  
**Import multiple services**: `import { appointmentService, patientService } from '@/lib/api'`  
**Check authentication**: `useSelector((state: RootState) => state.auth.isAuthenticated)`
