// This is a placeholder component. In a real application, this would handle authentication logic.
import React from "react"

interface ProtectedRouteProps {
  allowedRoles: string[]
  children: React.ReactNode
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  // Mock authentication logic for demonstration
  const userRole = "doctor" // Assume user is a doctor for this demo

  if (allowedRoles.includes(userRole)) {
    return <>{children}</>
  } else {
    return (
      <div className="flex items-center justify-center min-h-screen bg-custom-dashboard-gray-50">
        <p className="text-lg text-custom-dashboard-red-DEFAULT">Access Denied. You do not have the required role.</p>
      </div>
    )
  }
}
