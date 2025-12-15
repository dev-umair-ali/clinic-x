import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { setAuthToken, clearAuthToken } from "../api/axios"

export interface User {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  role: "admin" | "doctor" | "patient"
  profilePicture?: string
  hasCompletedOnboarding?: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.loading = false

      // Set token in global axios headers
      setAuthToken(action.payload.token)

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("clinic-ai-token", action.payload.token)
        localStorage.setItem("clinic-ai-user", JSON.stringify(action.payload.user))
      }
    },
    loginFailure: (state) => {
      state.loading = false
      state.user = null
      state.token = null
      state.isAuthenticated = false

      // Clear token from global axios headers
      clearAuthToken()

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("clinic-ai-token")
        localStorage.removeItem("clinic-ai-user")
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.loading = false

      // Clear token from global axios headers
      clearAuthToken()

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("clinic-ai-token")
        localStorage.removeItem("clinic-ai-user")
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    initializeAuth: (state) => {
      // Initialize auth state from localStorage
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("clinic-ai-token")
        const userStr = localStorage.getItem("clinic-ai-user")

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr)
            state.user = user
            state.token = token
            state.isAuthenticated = true
            
            // Set token in global axios headers
            setAuthToken(token)
          } catch (error) {
            console.error("Error parsing user from localStorage:", error)
          }
        }
      }
    },
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, setUser, initializeAuth } = authSlice.actions
export default authSlice.reducer
