"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, UserCircle2 } from "lucide-react";
import { loginStart, loginSuccess, loginFailure } from "@/lib/slices/authSlice";
import type { User } from "@/lib/slices/authSlice";
import { authService } from "@/lib/api/services/authService";
import { CognitoAuth } from "@/lib/auth/cognito";
import { IS_PORTFOLIO_MODE } from "@/lib/config/portfolio";
import {
  DEMO_CREDENTIALS,
  DASHBOARD_ROUTES,
  findDemoCredential,
  type DemoCredential,
} from "@/lib/constants/demoCredentials";
import img from "../../public/images/login-illustration.png.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const completeLogin = (user: User, token: string) => {
    dispatch(loginSuccess({ user, token }));
    router.push(DASHBOARD_ROUTES[user.role]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    dispatch(loginStart());

    try {
      const demoAccount = findDemoCredential(email, password);

      if (demoAccount || IS_PORTFOLIO_MODE) {
        if (!demoAccount) {
          setError("Use a demo account below to sign in.");
          dispatch(loginFailure());
          return;
        }
        const result = await CognitoAuth.signIn(email, password);
        completeLogin(result.user as User, result.token);
        return;
      }

      const result = await authService.login({ email, password });
      const user = result.data.data.user;
      completeLogin(user, result.data.data.token);
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (err.code === "NETWORK_ERROR") {
        setError("Network error. Please check your connection.");
      } else {
        setError("Login failed. Please try again.");
      }

      dispatch(loginFailure());
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (credential: DemoCredential) => {
    setEmail(credential.email);
    setPassword(credential.password);
    setLoading(true);
    setError("");
    dispatch(loginStart());

    try {
      const result = await CognitoAuth.signIn(
        credential.email,
        credential.password
      );
      completeLogin(result.user as User, result.token);
    } catch {
      setError("Demo login failed. Please try again.");
      dispatch(loginFailure());
    } finally {
      setLoading(false);
    }
  };

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
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-background px-4 sm:px-6 py-8">
        <div className="w-full max-w-md space-y-6 p-6 sm:p-10 border border-border rounded-xl shadow-lg bg-card max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold italic text-foreground">Logo</h1>
            <p className="text-muted-foreground text-sm">Powered By Clinic X</p>
          </div>

          {/* Welcome */}
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in to Testing pipeline continue
            </p>
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
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
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
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end -mt-2 mb-2">
              <Link
                href="/forget-password"
                className="text-sm text-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-primary-foreground bg-primary hover:bg-primary/90 rounded-md shadow-sm text-sm disabled:opacity-50 transition-colors"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Need an account? </span>
              <Link href="#" className="text-primary hover:underline">
                Contact Admin
              </Link>
            </div>
          </form>

          {/* Demo accounts */}
          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <UserCircle2 className="h-4 w-4 text-primary" />
              Demo accounts
            </div>
            <p className="text-xs text-muted-foreground">
              Click a role to sign in instantly — no backend required.
            </p>
            <div className="space-y-2">
              {DEMO_CREDENTIALS.map((credential) => (
                <button
                  key={credential.role}
                  type="button"
                  disabled={loading}
                  onClick={() => handleDemoLogin(credential)}
                  className="w-full text-left rounded-md border border-border bg-muted/40 px-3 py-2 hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {credential.label}
                    </span>
                    <span className="text-xs text-primary font-medium">
                      Sign in
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {credential.email}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {credential.password}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
