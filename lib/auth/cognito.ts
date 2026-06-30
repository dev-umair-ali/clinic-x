import { findDemoCredential } from "@/lib/constants/demoCredentials";

export class CognitoAuth {
  static async signIn(email: string, password: string) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const demoAccount = findDemoCredential(email, password);
    if (!demoAccount) {
      throw new Error("Invalid demo credentials");
    }

    return {
      user: demoAccount.user,
      token: `mock-jwt-token-${demoAccount.role}`,
    };
  }

  static async signUp(
    email: string,
    _password: string,
    name: string,
    role: string
  ) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      user: {
        id: `demo-${role}`,
        email,
        name,
        role: role as "admin" | "doctor" | "patient" | "assistant" | "clinic",
        profilePicture: "/placeholder.svg?height=40&width=40",
        hasCompletedOnboarding: true,
      },
      token: `mock-jwt-token-${role}`,
    };
  }

  static async signOut() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return true;
  }

  static async getCurrentUser() {
    const userStr = localStorage.getItem("clinic-ai-user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
}
