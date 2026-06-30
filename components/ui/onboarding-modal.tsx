"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, ChevronRight } from "lucide-react"

interface OnboardingModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onStartOnboarding: () => void
}

export function OnboardingModal({ isOpen, onStartOnboarding }: OnboardingModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[hsl(var(--color-brand-teal-dark))] to-[hsl(var(--color-brand-teal))] rounded-full flex items-center justify-center mb-2">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-[hsl(var(--foreground))]">
            Welcome to Clinic X!
          </DialogTitle>
          <DialogDescription className="text-base text-[hsl(var(--muted-foreground))]">
            To provide you with the best healthcare experience, please complete your onboarding form first.
            This helps us understand your medical history and current health needs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Benefits section */}
          <div className="bg-[hsl(var(--color-brand-teal-light))] dark:bg-[hsl(var(--color-brand-teal)/0.16)] rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-[hsl(var(--foreground))] mb-2">
              Your onboarding form includes:
            </p>
            <ul className="space-y-1.5 text-sm text-[hsl(var(--muted-foreground))]">
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-[hsl(var(--foreground))] flex-shrink-0" />
                <span  className="text-[hsl(var(--foreground))]">Personal & contact information</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-[hsl(var(--foreground))] flex-shrink-0" />
                <span  className="text-[hsl(var(--foreground))]">Insurance details</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-[hsl(var(--foreground))] flex-shrink-0" />
                <span  className="text-[hsl(var(--foreground))]">Medical history & current conditions</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-[hsl(var(--foreground))] flex-shrink-0" />
                <span
                className="text-[hsl(var(--foreground))]"
                >Lifestyle & health habits</span>
              </li>
            </ul>
          </div>

          {/* Action button */}
          <Button
            onClick={onStartOnboarding}
            className="w-full bg-gradient-to-r from-[hsl(var(--color-brand-teal-dark))] to-[hsl(var(--color-brand-teal))] hover:from-[hsl(var(--color-brand-teal-dark))] hover:to-[hsl(var(--color-brand-teal))] text-white font-semibold py-6 text-base shadow-md"
          >
            Complete Onboarding Form
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-xs text-center text-[hsl(var(--muted-foreground))]">
            This will only take a few minutes to complete
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}