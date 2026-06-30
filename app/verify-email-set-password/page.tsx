"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, CheckCircle, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster";

import api from "@/lib/api/axios";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showCnf, setShowCnf] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");

  const token = searchParams.get("token");
  const role = searchParams.get("role");

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !role) {
        setError("Invalid verification link");
        setVerifying(false);
        return;
      }

      try {
        // Verify the token with the backend
        const response = await api.get(`/auth/verify-email-token`, {
          params: { token, role }
        });

        if (response.data.success) {
          setTokenValid(true);
        } else {
          setError(response.data.message || "Invalid or expired token");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Token verification failed");
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token, role]);

  const handleSubmit = async () => {
    setLoading(true);
    // Validation
    if (!password || !confirm) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all fields",
      });
      return;
    }

    if (password.length < 8) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Password must be at least 8 characters",
      });
      return;
    }

    if (password !== confirm) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Passwords do not match",
      });
      return;
    }


    try {
      const response = await api.post("/auth/set-password", {
        token,
        role,
        password,
        confirmPassword: confirm,
      });

      if (response.data.success) {
        setDone(true);
        toast({
          title: "Success",
          description: "Your password has been set successfully!",
          variant: "default",
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
      else {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data.message || "Failed to set password",
        });
      }
    } catch (err: any) {
      console.error(err.response, 'response');
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to set password",
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state while verifying token
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] px-4">
        <div className="w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-lg">
          <div className="text-center space-y-4">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[hsl(var(--primary))]" />
            <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
              Verifying your email...
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Please wait while we verify your token
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] px-4">
        <div className="w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-lg">
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
              Verification Failed
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {error || "Invalid or expired verification link"}
            </p>
            <Button onClick={() => router.push("/login")} className="w-full">
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-lg">
        {done ? (
          /* SUCCESS STATE */
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--accent))]">
              <CheckCircle className="h-7 w-7 text-[hsl(var(--primary))]" />
            </div>

            <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
              Password Set Successfully
            </h2>

            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Your email has been verified and password has been set. Redirecting to login...
            </p>

            <Button className="w-full" onClick={() => router.push("/login")}>
              Go to Login
            </Button>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="mb-6 text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--accent))]">
                <ShieldCheck className="h-6 w-6 text-[hsl(var(--primary))]" />
              </div>

              <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
                Set Your Password
              </h1>

              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Welcome! Please set a password for your {role} account
              </p>
            </div>

            {/* FORM */}
            <div className="space-y-4">
              {/* PASSWORD */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                  New password
                </label>
                <div className="relative">
                  <Input
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                    disabled={loading}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Minimum 8 characters, include letters & numbers
                </p>
              </div>

              {/* CONFIRM */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                  Confirm password
                </label>
                <div className="relative">
                  <Input
                    type={showCnf ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCnf(!showCnf)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                    disabled={loading}
                  >
                    {showCnf ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* ACTION */}
              <Button
                className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting Password...
                  </>
                ) : (
                  "Set Password"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SetNewPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <Toaster />
      <VerifyEmailContent />
    </Suspense>
  );
}