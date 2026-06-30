"use client";

import React, { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/ui/protected-route';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import patientOnboardingService from '@/lib/api/services/patientOnboardingService';
import { useSelector } from 'react-redux';
/* ----------  STEP COMPONENTS  ---------- */
import PersonalInformation from '@/components/onboarding/PersonalInformation';
import InsuranceInformation from '@/components/onboarding/InsuranceInformation';
import PresentCondition from '@/components/onboarding/PresentCondition';
import HealthHistory from '@/components/onboarding/HealthHistory';
import DentalHistoryParent from '@/components/onboarding/DentalHistoryParent';
import MedicalProfileParent from '@/components/onboarding/MedicalProfileParent';
import WomensHealthInformationParent from '@/components/onboarding/WomensHealthInformationParent';
import LifestyleHabitsParent from '@/components/onboarding/LifestyleHabitsParent';
import ConsentLegalParent from '@/components/onboarding/ConsentLegalParent';
import DocumentUploadsParent from '@/components/onboarding/DocumentUploadsParent';
import ReviewCompleteParent from '@/components/onboarding/ReviewCompleteParent';
import { Toaster } from "@/components/ui/toaster";

/* --------------------------------------- */

const getSteps = (isFemale: boolean) => {
  const baseSteps = [
    { id: 1, name: 'Personal Information', completed: false },
    { id: 2, name: 'Insurance Information', completed: false },
    { id: 3, name: 'Present Condition', completed: false },
    { id: 4, name: 'Health History', completed: false },
    { id: 5, name: 'Dental History', completed: false },
    { id: 6, name: 'Medical Profile', completed: false },
    
    { id: 8, name: 'Lifestyle & Habits', completed: false },
    { id: 9, name: 'Consent & Legal', completed: false },
    { id: 10, name: 'Uploads', completed: false },
    { id: 11, name: 'Review & Complete', completed: false },
  ];
  if (isFemale) {
    baseSteps.splice(6, 0, { id: 7, name: 'For Women', completed: false });
  }
  return baseSteps;
};


export default function Onboarding() {
  const router = useRouter();
  const { toast } = useToast();
  const user = useSelector((state: any) => state.auth.user);
  const isFemale = user?.gender && user.gender.toLowerCase() === 'female';
  const steps = getSteps(isFemale);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get patient ID from user context or localStorage
  const getPatientId = (): string => {
    if (user?.patientId) return user.patientId;
    const patientId = user?.patientId;
    if (!patientId) {
      toast({
        title: "Error",
        description: "Patient ID not found. Please log in again.",
        variant: "destructive",
      });
      router.push('/login');
      return '';
    }
    return patientId;
  };

  // Load existing form data on mount
  useEffect(() => {
    const fetchForms = async () => {
      setIsLoading(true);
      try {
        // Get all forms for the logged-in patient
        const formsResponse = await patientOnboardingService.getAllOnboardingForms(getPatientId());

        if (formsResponse.success && formsResponse.data) {
          const forms = formsResponse.data;
          const completed: number[] = [];
          if (forms.onBoarding) {
            completed.push(1);
          }
          if (forms.insurance) {
            completed.push(2);
          }
          if (forms.presentCondition) {
            completed.push(3);
          }
          if (forms.history && forms.history.length > 0) {
            completed.push(4);
          }
          if (forms.lifeStyle) {
            completed.push(5);
          }
          if (forms.womenForm) {
            completed.push(6);
          }
          if (forms.constantLegal) {
            completed.push(7);
          }

          setCompletedSteps(completed);
          setIsLoading(false);

          if (completed.length > 0) {
            toast({
              title: "Forms Loaded",
              description: `${completed.length} saved form(s) loaded successfully.`,
            });
          }
        }
      } catch (error: any) {
        console.error('Error loading existing forms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForms();
  }, []);

  const nextStep = async () => {
    // Find current step index in the steps array
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    
    if (currentIndex !== -1 && currentIndex < steps.length - 1) {
      setCompletedSteps((prev) =>
        prev.includes(currentStep) ? prev : [...prev, currentStep]
      );
      // Move to the next step ID in the array (handles skipping for gender)
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    // Find current step index in the steps array
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    
    if (currentIndex > 0) {
      // Move to the previous step ID in the array (handles skipping for gender)
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const getProgressPercentage = () =>
    Math.round((new Set(completedSteps).size / steps.length) * 100);

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      toast({
        title: "Onboarding Complete!",
        description: "Your information has been submitted successfully.",
        variant: "default",
      });

      setTimeout(() => {
        router.push('/patient/dashboard');
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Submission Error",
        description: error.message || "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* step render map */
  const stepComponents: Record<number, React.ReactNode> = {
    1: <PersonalInformation onNext={nextStep} />,
    2: <InsuranceInformation onNext={nextStep} />,
    3: <PresentCondition onNext={nextStep} />,
    4: <HealthHistory onNext={nextStep} />,
    5: <DentalHistoryParent onNext={nextStep} />,
    6: <MedicalProfileParent onNext={nextStep} />,
    7: isFemale ? <WomensHealthInformationParent onNext={nextStep} /> : null,
    8: <LifestyleHabitsParent onNext={nextStep} />,
    9: <ConsentLegalParent onNext={nextStep} />,
    10: <DocumentUploadsParent onNext={nextStep} />,
    11: <ReviewCompleteParent onSubmit={handleComplete} />,
  };

  return (
    <ProtectedRoute allowedRoles={['assistant', 'clinic', 'patient']}>
      <Toaster />
        <div className="min-h-screen bg-[hsl(var(--background))]">
          {/* Loading State */}
          {isLoading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[hsl(var(--card))] p-8 rounded-lg shadow-xl">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--color-brand-teal))]"></div>
                  <p className="text-[hsl(var(--foreground))]">Loading your forms...</p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-[hsl(var(--card-foreground))]">
                  Patient Onboarding
                </h1>
                <div className="text-sm text-[hsl(var(--muted-foreground))]">
                  {getProgressPercentage()}% Complete
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-[hsl(var(--muted))] rounded-full h-2">
                  <div
                    className="bg-[hsl(var(--color-brand-teal))] h-2 rounded-full transition-all"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-80 bg-[hsl(var(--card))] border-b md:border-b-0 md:border-r border-[hsl(var(--border))] p-6">
              <nav className="space-y-1 sticky top-6">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${step.id === currentStep
                      ? 'bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))]'
                      : completedSteps.includes(step.id)
                        ? 'bg-[hsl(var(--color-status-success)/0.1)] text-[hsl(var(--color-status-success))]'
                        : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]'
                      }`}
                  >
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${step.id === currentStep
                        ? 'bg-[hsl(var(--primary-foreground))] text-[hsl(var(--color-brand-teal))]'
                        : completedSteps.includes(step.id)
                          ? 'bg-[hsl(var(--color-status-success))] text-[hsl(var(--primary-foreground))]'
                          : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
                        }`}
                    >
                      {completedSteps.includes(step.id) ? '✓' : step.id}
                    </div>
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-[hsl(var(--background))]">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] mb-4">
                  <span>Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>{steps.find(s => s.id === currentStep)?.name}</span>
                </div>

                {/* STEP CONTENT */}
                <div className="space-y-8">{stepComponents[currentStep]}</div>

                  <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={steps.findIndex(s => s.id === currentStep) === 0 || isSubmitting}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
              </div>
            </main>
          </div>
        </div>
    </ProtectedRoute>
  );
}