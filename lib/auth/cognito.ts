// Mock AWS Cognito implementation for demo purposes
export class CognitoAuth {
  static async signIn(email: string, password: string) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock user data based on email
    let role: "admin" | "doctor" | "patient" = "patient"
    let name = "User"

    if (email.includes("admin")) {
      role = "admin"
      name = "Admin User"
    } else if (email.includes("doctor") || email.includes("sarah.chen")) {
      role = "doctor"
      name = "Dr. Sarah Chen"
    } else {
      role = "patient"
      name = "Patient User"
    }

    return {
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      token: "mock-jwt-token-" + Math.random().toString(36).substr(2, 9),
    }
  }

  static async signUp(email: string, password: string, name: string, role: string) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role: role as "admin" | "doctor" | "patient",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      token: "mock-jwt-token-" + Math.random().toString(36).substr(2, 9),
    }
  }

  static async signOut() {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return true
  }

  static async getCurrentUser() {
    // Mock getting current user from token
    const token = localStorage.getItem("clinic-ai-token")
    if (!token) return null

    return {
      id: "current-user-id",
      email: "user@example.com",
      name: "Current User",
      role: "doctor" as const,
      avatar: "/placeholder.svg?height=40&width=40",
    }
  }
}
