"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, CheckCircle, ShieldCheck  ,ArrowLeft} from "lucide-react";
import Link from "next/link";

export default function SetNewPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showCnf, setShowCnf] = useState(false);
  const [done, setDone] = useState(false);

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
              Password updated
            </h2>

            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              Your password has been successfully changed.
            </p>
            <Link
              href="/login"
              className="flex items-center justify-center gap-1 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="mb-6 text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--accent))]">
                <ShieldCheck className="h-6 w-6 text-[hsl(var(--primary))]" />
              </div>

              <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
                Set a new password
              </h1>

              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Choose a strong password to keep your account secure
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowCnf(!showCnf)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
                  >
                    {showCnf ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* ACTION */}
              <Button
                className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white"
                onClick={() => setDone(true)}
              >
                Update password
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
