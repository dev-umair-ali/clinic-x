"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MailCheck, ArrowLeft, ShieldCheck } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true); // FRONTEND ONLY
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-lg">
        {sent ? (
          /* SUCCESS STATE */
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--accent))]">
              <MailCheck className="h-7 w-7 text-[hsl(var(--primary))]" />
            </div>

            <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
              Check your email
            </h2>

            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              If an account exists for <span className="font-medium">{email}</span>,  
              you’ll receive a password reset link shortly.
            </p>

            <Link href="/login">
              <Button
                variant="outline"
                className="mt-4 w-full border-[hsl(var(--border))]"
              >
                Back to login
              </Button>
            </Link>
          </div>
        ) : (
          /* FORM */
          <>
            {/* HEADER */}
            <div className="mb-6 text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--accent))]">
                <ShieldCheck className="h-6 w-6 text-[hsl(var(--primary))]" />
              </div>

              <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))]">
                Reset your password
              </h1>

              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Enter your email and we’ll send you a reset link
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                  Email address
                </label>

                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white"
              >
                Send reset link
              </Button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-1 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
