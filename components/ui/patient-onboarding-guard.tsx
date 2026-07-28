"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter, usePathname } from "next/navigation"
import type { RootState, AppDispatch } from "@/lib/store"
import { OnboardingModal } from "./onboarding-modal"
import {
  fetchAllOnboardingForms,
  isOnboardingCompleteInStorage,
  consumeOnboardingLoginPrompt,
  dismissOnboardingLoginPrompt,
} from "@/lib/slices/onboardingSlice"

interface PatientOnboardingGuardProps {
    children: React.ReactNode
}

export function PatientOnboardingGuard({ children }: PatientOnboardingGuardProps) {
    const dispatch = useDispatch<AppDispatch>()
    const { user } = useSelector((state: RootState) => state.auth)
    const { hasCompletedOnboarding, isLoading } = useSelector((state: RootState) => state.onboarding)
    const router = useRouter()
    const pathname = usePathname()
    const [showOnboardingModal, setShowOnboardingModal] = useState(false)
    // null = not evaluated yet (avoid flash); true only right after login consume
    const [forceOnboarding, setForceOnboarding] = useState<boolean | null>(null)

    const patientId = user?.patientId || (typeof window !== "undefined" && localStorage.getItem("clinic-ai-user")
        ? JSON.parse(localStorage.getItem("clinic-ai-user")!).patientId
        : null)

    const completedInStorage = isOnboardingCompleteInStorage(patientId)
    const isComplete = hasCompletedOnboarding || completedInStorage

    useEffect(() => {
        if (user && user.role === "patient" && patientId) {
            dispatch(fetchAllOnboardingForms(patientId));
        }
    }, [user, dispatch, patientId])

    // Re-evaluate when completion changes; always re-check prompt (handles remounts)
    useEffect(() => {
        if (user?.role !== "patient") {
            setForceOnboarding(false)
            return
        }

        if (isComplete) {
            setForceOnboarding(false)
            dismissOnboardingLoginPrompt()
            return
        }

        setForceOnboarding(consumeOnboardingLoginPrompt())
    }, [user, isComplete])

    const allowedPaths = ["/patient/onboarding"]

    useEffect(() => {
        if (user && user.role === "patient" && !isLoading && forceOnboarding === true && !isComplete) {
            const isOnAllowedPath = allowedPaths.some(path => pathname?.startsWith(path))
            setShowOnboardingModal(!isOnAllowedPath)
        } else {
            setShowOnboardingModal(false)
        }
    }, [user, pathname, forceOnboarding, isComplete, isLoading])

    const handleStartOnboarding = () => {
        setShowOnboardingModal(false)
        router.push("/patient/onboarding")
    }

    // Still deciding (avoids dashboard flash before login prompt is read)
    if (user?.role === "patient" && forceOnboarding === null && !isComplete) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[hsl(var(--color-brand-teal))]" />
            </div>
        )
    }

    if (user?.role === "patient" && forceOnboarding && !isComplete && !isLoading) {
        const isOnAllowedPath = allowedPaths.some(path => pathname?.startsWith(path))

        if (!isOnAllowedPath) {
            return (
                <>
                    <OnboardingModal
                        isOpen={showOnboardingModal}
                        onOpenChange={(open) => {
                            // Don't allow dismissing without starting — keep modal until they continue
                            if (open) setShowOnboardingModal(true)
                        }}
                        onStartOnboarding={handleStartOnboarding}
                    />
                    <div className="min-h-screen bg-background flex items-center justify-center p-4">
                        <div className="text-center">
                            <p className="text-muted-foreground">
                                Please complete your onboarding to access this page.
                            </p>
                        </div>
                    </div>
                </>
            )
        }
    }

    return <>{children}</>
}
