// src/lib/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import appointmentSlice from "./slices/appointmentSlice"
import patientSlice from "./slices/patientSlice"
import doctorSlice from "./slices/doctorSlice"
import doctorPatientSlice from "./slices/doctorPatientSlice"
import profileSlice from "./slices/profileSlice"
import prescriptionSlice from "./slices/prescriptionSlice"
import billingSlice from "./slices/billingSlice"
import refillSlice from "./slices/refillSlice"
import reportsSlice from "./slices/reportsSlice"
import uploadSlice from "./slices/uploadSlice"
import clinicSlice from "./slices/clinicSlice"

const rootReducer = combineReducers({
  auth: authSlice,
  appointments: appointmentSlice,
  patients: patientSlice,
  doctors: doctorSlice,
  doctorPatients: doctorPatientSlice,
  profiles: profileSlice,
  prescriptions: prescriptionSlice,
  billing: billingSlice,
  refills: refillSlice,
  reports: reportsSlice,
  upload: uploadSlice,
  clinics: clinicSlice,
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
