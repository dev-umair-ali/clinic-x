// src/lib/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import clinicSlice from "./slices/clinicSlice"


import appointmentSlice from "./slices/appointmentSlice"
import patientSlice from "./slices/patientSlice"
import doctorSlice from "./slices/doctorSlice"
import assistantSlice from "./slices/assistantSlice"
import doctorPatientSlice from "./slices/doctorPatientSlice"
import profileSlice from "./slices/profileSlice"
import prescriptionSlice from "./slices/prescriptionSlice"
import billingSlice from "./slices/billingSlice"
import refillSlice from "./slices/refillSlice"
import reportsSlice from "./slices/reportsSlice"
import uploadSlice from "./slices/uploadSlice"
import auditLogSlice from "./slices/auditLogSlice"
import clinicAssistantSlice from "./slices/clinicAssistantSlice"
import clinicDoctorSlice from "./slices/clinicDoctorSlice"
import clinicPatientSlice from "./slices/clinicPatientSlice"
import assistantDoctorSlice from "./slices/assistantDoctorSlice"
import assistantPatientSlice from "./slices/assistantPatientSlice"
import themeSlice from "./slices/themeSlice"
import googleCalendarSlice from "./slices/googleCalendarSlice"
import availabilitySlice from "./slices/availabilitySlice"
import onboardingSlice from "./slices/onboardingSlice"
import noteSlice from "./slices/noteSlice"
import dashboardSlice from "./slices/dashboardSlice"

const rootReducer = combineReducers({
  auth: authSlice,
  clinics: clinicSlice,
  dashboard: dashboardSlice,

  appointments: appointmentSlice,
  patients: patientSlice,
  doctors: doctorSlice,
  assistants: assistantSlice,
  doctorPatients: doctorPatientSlice,
  profiles: profileSlice,
  prescriptions: prescriptionSlice,
  billing: billingSlice,
  auditLogs: auditLogSlice,
  refills: refillSlice,
  reports: reportsSlice,
  upload: uploadSlice,
  clinicAssistants: clinicAssistantSlice,
  clinicDoctors: clinicDoctorSlice,
  clinicPatients: clinicPatientSlice,
  assistantDoctors: assistantDoctorSlice,
  assistantPatients: assistantPatientSlice,
  theme: themeSlice,
  googleCalendar: googleCalendarSlice,
  availability: availabilitySlice,
  onboarding: onboardingSlice,
  notes: noteSlice,
})

// Load state from localStorage
const loadState = () => {
  try {
    if (typeof window === "undefined") return undefined
    const serializedState = localStorage.getItem("clinic-ai-state")
    if (serializedState === null) return undefined
    return JSON.parse(serializedState)
  } catch (error) {
    console.error("Error loading state from localStorage:", error)
    return undefined
  }
}

// Create store - only load persisted state on client side
export const store = configureStore({
  reducer: rootReducer,
  preloadedState: typeof window !== "undefined" ? loadState() : undefined,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable if needed
    }),
})

// Save state to localStorage on every change (client-side only)
if (typeof window !== "undefined") {
  store.subscribe(() => {
    try {
      const state = store.getState()
      localStorage.setItem("clinic-ai-state", JSON.stringify(state))
    } catch (error) {
      console.error("Error saving state to localStorage:", error)
    }
  })
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
