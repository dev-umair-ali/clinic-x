'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import { loginStart, loginSuccess, loginFailure } from '@/lib/slices/authSlice'
import { authService, type LoginResponse } from '@/lib/api/services/authService'
import img from "../../public/images/login-illustration.png.png"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const dispatch = useDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    dispatch(loginStart())

    try {
      // Use the auth service to login
      const result = await authService.login({ email, password })

      // Check if the API response is successful
        const user = result.data.data.user;
        dispatch(loginSuccess({ user, token: result.data.data.token }))

        const dashboardRoutes: Record<string, string> = {
          admin: '/admin/dashboard',
          doctor: '/doctor/dashboard',
          patient: '/patient/dashboard',
        }

        const userRole = user.role;
        router.push(dashboardRoutes[userRole])
    } catch (err: any) {
      console.error('Login error:', err)

      // Handle different types of errors
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.status === 401) {
        setError('Invalid email or password')
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.')
      } else if (err.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your connection.')
      } else {
        setError('Login failed. Please try again.')
      }

      dispatch(loginFailure())
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Side Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#61C2B4] items-center justify-center">
        <Image
          src={img || "/placeholder.svg"}
          alt="Login Illustration"
          width={500}
          height={500}
          priority
          className="object-contain max-h-[70vh]"
        />
      </div>

      {/* Right Side Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-background px-4 sm:px-6">
        <div className="w-full max-w-md space-y-6 p-6 sm:p-10 border border-border rounded-xl shadow-lg bg-card">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold italic text-foreground">Logo</h1>
            <p className="text-muted-foreground text-sm">Powered By Clinic AI</p>
          </div>

          {/* Welcome */}
          <div>
            <h2 className="text-lg font-semibold text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Sign in to MY account to continue</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm px-4 py-2 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your Email Address"
                className="w-full px-3 py-2 border border-input rounded-md shadow-sm text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your Password"
                  className="w-full px-3 py-2 border border-input rounded-md shadow-sm text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-primary-foreground bg-primary hover:bg-primary/90 rounded-md shadow-sm text-sm disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            {/* Footer */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Need an account? </span>
              <Link href="#" className="text-primary hover:underline">
                Contact Admin
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
