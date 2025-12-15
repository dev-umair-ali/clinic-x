"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, ChevronRight } from "lucide-react"

interface OnboardingModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onStartOnboarding: () => void
}

export function OnboardingModal({ isOpen, onOpenChange, onStartOnboarding }: OnboardingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#126A5C] to-[#1DA68F] rounded-full flex items-center justify-center mb-2">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to Clinic X!
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-300">
            To provide you with the best healthcare experience, please complete your onboarding form first. 
            This helps us understand your medical history and current health needs.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Benefits section */}
          <div className="bg-[#1da68f1a] dark:bg-[#1da68f2a] rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Your onboarding form includes:
            </p>
            <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-[#1DA68F] flex-shrink-0" />
                <span>Personal & contact information</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-[#1DA68F] flex-shrink-0" />
                <span>Insurance details</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-[#1DA68F] flex-shrink-0" />
                <span>Medical history & current conditions</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-[#1DA68F] flex-shrink-0" />
                <span>Lifestyle & health habits</span>
              </li>
            </ul>
          </div>

          {/* Action button */}
          <Button 
            onClick={onStartOnboarding}
            className="w-full bg-gradient-to-r from-[#126A5C] to-[#1DA68F] hover:from-[#0f5549] hover:to-[#178d77] text-white font-semibold py-6 text-base shadow-md"
          >
            Complete Onboarding Form
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            This will only take a few minutes to complete
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
