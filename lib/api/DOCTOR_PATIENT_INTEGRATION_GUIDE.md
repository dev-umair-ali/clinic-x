# Doctor Patient Service Integration Guide

This guide explains how to use the newly created doctor patient service and Redux state management for the `/doctors/patients/` endpoints.

## Overview

The doctor patient service provides specialized endpoints for doctors to manage their patients, separate from the general patient management system. This allows for doctor-specific patient operations and better data organization.

## API Endpoints

### Base URL: `/doctors/patients/`

| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| POST | `/doctors/patients` | Create new patient | Doctor |
| GET | `/doctors/patients` | Get all patients | Doctor |
| GET | `/doctors/patients/:id` | Get specific patient | Doctor |
| PUT | `/doctors/patients/:id` | Update patient | Doctor |
| DELETE | `/doctors/patients/:id` | Delete patient | Admin only |
| GET | `/doctors/patients/doctor/:doctorId` | Get patients by doctor ID | Doctor |

## Service Usage

### Import the Service

```typescript
import { doctorPatientService } from '@/lib/api/services/doctorPatientService'
// or
import { doctorPatientService } from '@/lib/api'
```

### Available Methods

#### 1. Create Doctor Patient
```typescript
const newPatient = await doctorPatientService.createDoctorPatient({
  firstName: "John",
  lastName: "Doe",
  fullName: "John Doe",
  email: "john.doe@example.com",
  password: "SecurePass123!",
  phone: "(123) 456-7890",
  age: 30,
  dateOfBirth: "1994-01-01",
  gender: "male",
  bloodType: "O+",
  assignedDoctor: "doctor-id-123",
  insuranceInfo: "Blue Cross - Policy #123456",
  medicalHistory: "No known allergies",
  address: "123 Main St, City, State 12345",
  status: "active",
  role: "patient",
  hipaaConsent: true
})
```

#### 2. Get All Doctor Patients
```typescript
const patients = await doctorPatientService.getDoctorPatients()
console.log(patients.data) // Array of patients
```

#### 3. Get Specific Patient
```typescript
const patient = await doctorPatientService.getDoctorPatientById("patient-id-123")
console.log(patient.data.user) // Patient object
```

#### 4. Update Patient
```typescript
const updatedPatient = await doctorPatientService.updateDoctorPatient("patient-id-123", {
  phone: "(987) 654-3210",
  address: "456 New St, City, State 54321",
  status: "inactive"
})
```

#### 5. Delete Patient (Admin Only)
```typescript
const result = await doctorPatientService.deleteDoctorPatient("patient-id-123")
console.log(result.success) // true/false
```

#### 6. Get Patients by Doctor ID
```typescript
const doctorPatients = await doctorPatientService.getPatientsByDoctorId("doctor-id-123")
console.log(doctorPatients.data) // Array of patients for specific doctor
```

## Redux State Management

### Import Redux Actions

```typescript
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchDoctorPatients,
  fetchDoctorPatientById,
  createDoctorPatient,
  updateDoctorPatient,
  deleteDoctorPatient,
  fetchPatientsByDoctorId
} from '@/lib/slices/doctorPatientSlice'
import type { RootState } from '@/lib/store'
```

### Using Redux in Components

#### 1. Fetch All Patients
```typescript
const dispatch = useDispatch<AppDispatch>()
const { patients, loading, error } = useSelector((state: RootState) => state.doctorPatients)

useEffect(() => {
  dispatch(fetchDoctorPatients())
}, [dispatch])
```

#### 2. Create New Patient
```typescript
const handleCreatePatient = async (patientData: CreateDoctorPatientRequest) => {
  try {
    await dispatch(createDoctorPatient(patientData)).unwrap()
    toast.success("Patient created successfully!")
  } catch (error) {
    toast.error("Failed to create patient")
  }
}
```

#### 3. Update Patient
```typescript
const handleUpdatePatient = async (id: string, patientData: UpdateDoctorPatientRequest) => {
  try {
    await dispatch(updateDoctorPatient({ id, patientData })).unwrap()
    toast.success("Patient updated successfully!")
  } catch (error) {
    toast.error("Failed to update patient")
  }
}
```

#### 4. Delete Patient
```typescript
const handleDeletePatient = async (id: string) => {
  try {
    await dispatch(deleteDoctorPatient(id)).unwrap()
    toast.success("Patient deleted successfully!")
  } catch (error) {
    toast.error("Failed to delete patient")
  }
}
```

#### 5. Get Patients by Doctor ID
```typescript
const handleGetPatientsByDoctor = async (doctorId: string) => {
  try {
    await dispatch(fetchPatientsByDoctorId(doctorId)).unwrap()
  } catch (error) {
    toast.error("Failed to fetch patients")
  }
}
```

## TypeScript Types

### Core Types
- `DoctorPatient` - Patient object structure
- `CreateDoctorPatientRequest` - Data for creating new patients
- `UpdateDoctorPatientRequest` - Data for updating existing patients

### Response Types
- `DoctorPatientResponse` - Single patient response
- `DoctorPatientsListResponse` - List of patients response
- `DoctorPatientsByDoctorResponse` - Patients by doctor response

### Redux State
```typescript
interface DoctorPatientState {
  patients: DoctorPatient[]
  loading: boolean
  error: string | null
  currentPatient: DoctorPatient | null
}
```

## Error Handling

The service includes comprehensive error handling:

```typescript
try {
  const result = await doctorPatientService.createDoctorPatient(patientData)
} catch (error: any) {
  if (error.response?.status === 409) {
    console.error("Patient with this email already exists")
  } else if (error.response?.status === 400) {
    console.error("Invalid data provided")
  } else if (error.response?.status === 500) {
    console.error("Server error")
  } else {
    console.error("Network or other error:", error.message)
  }
}
```

## Redux Actions Available

### Async Thunks
- `fetchDoctorPatients()` - Get all patients
- `fetchDoctorPatientById(id)` - Get specific patient
- `createDoctorPatient(data)` - Create new patient
- `updateDoctorPatient({ id, patientData })` - Update patient
- `deleteDoctorPatient(id)` - Delete patient
- `fetchPatientsByDoctorId(doctorId)` - Get patients by doctor

### Synchronous Actions
- `clearError()` - Clear error state
- `setCurrentPatient(patient)` - Set current patient
- `clearCurrentPatient()` - Clear current patient

## Integration with Existing Code

The doctor patient service is designed to work alongside the existing patient service. You can use both services in the same application:

- Use `patientService` for general patient management (admin operations)
- Use `doctorPatientService` for doctor-specific patient operations

Both services share similar interfaces but are optimized for their specific use cases.

## Example Component

```typescript
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDoctorPatients, createDoctorPatient } from '@/lib/slices/doctorPatientSlice'
import type { RootState, AppDispatch } from '@/lib/store'

const DoctorPatientList = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { patients, loading, error } = useSelector((state: RootState) => state.doctorPatients)

  useEffect(() => {
    dispatch(fetchDoctorPatients())
  }, [dispatch])

  const handleAddPatient = async (patientData: CreateDoctorPatientRequest) => {
    try {
      await dispatch(createDoctorPatient(patientData)).unwrap()
      // Patient will be automatically added to the list
    } catch (error) {
      console.error('Failed to create patient:', error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>My Patients</h2>
      {patients.map(patient => (
        <div key={patient.id}>
          <h3>{patient.fullName}</h3>
          <p>Email: {patient.email}</p>
          <p>Phone: {patient.phone}</p>
          <p>Status: {patient.status}</p>
        </div>
      ))}
    </div>
  )
}

export default DoctorPatientList
```

This integration provides a complete solution for doctor-specific patient management with proper TypeScript support, error handling, and Redux state management.
