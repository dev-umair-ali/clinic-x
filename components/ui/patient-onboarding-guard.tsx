"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter, usePathname } from "next/navigation"
import type { RootState, AppDispatch } from "@/lib/store"
import { OnboardingModal } from "./onboarding-modal"
import { fetchAllOnboardingForms } from "@/lib/slices/onboardingSlice"

interface PatientOnboardingGuardProps {
    children: React.ReactNode
}

export function PatientOnboardingGuard({ children }: PatientOnboardingGuardProps) {
    const dispatch = useDispatch<AppDispatch>()
    const { user } = useSelector((state: RootState) => state.auth)
    const { hasCompletedOnboarding, presentCondition, insurance, history, lifeStyle, womenForm, constantLegal, dentalHistory, medicalProfile, isLoading } = useSelector((state: RootState) => state.onboarding)
    const router = useRouter()
    const pathname = usePathname()
    const [showOnboardingModal, setShowOnboardingModal] = useState(false)

useEffect(() => {
    if (user && user.role === "patient") {
        const patientId = user.patientId || (localStorage.getItem("clinic-ai-user")
            ? JSON.parse(localStorage.getItem("clinic-ai-user")!).patientId
            : null);
        if (patientId) dispatch(fetchAllOnboardingForms(patientId));
    }
}, [user, dispatch])

    // Paths that are allowed even without onboarding
    const allowedPaths = [
        "/patient/onboarding"
    ]

    useEffect(() => {
        if (user && user.role === "patient" && !isLoading) {
            const isOnAllowedPath = allowedPaths.some(path => pathname?.startsWith(path))
            // Show modal if onboarding not completed and not on allowed path
            if (!hasCompletedOnboarding && !isOnAllowedPath) {
                setShowOnboardingModal(true)
            }
        }
    }, [user, pathname, hasCompletedOnboarding, isLoading])

    const handleStartOnboarding = () => {
        setShowOnboardingModal(false)
        router.push("/patient/onboarding")
    }

    // If onboarding not completed and trying to access restricted pages, show modal
    if (user?.role === "patient" && !hasCompletedOnboarding && !isLoading) {
        const isOnAllowedPath = allowedPaths.some(path => pathname?.startsWith(path))

        if (!isOnAllowedPath) {
            return (
                <>
                    <OnboardingModal
                        isOpen={showOnboardingModal}
                        onOpenChange={setShowOnboardingModal}
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
