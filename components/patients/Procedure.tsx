"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, CheckIcon } from "lucide-react";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import StepNotes from "./procedure/steps/StepNotes";
import SectionsContent from "./SectionsContent";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  appointmentService,
} from "@/lib/api/services/appointmentService";
import axios from "axios";

const steps = ["Patient Notes", "Prescription"];

type FormData = {
  notes: Record<string, any>;
  prescription: Record<string, any>;
};

const Procedure = ({
  patient,
  appointmentId,
  patientId,
  goBack,
  initialStep = 0,
}: {
  patient: any;
  appointmentId: string;
  patientId: string;
  goBack: () => void;
  initialStep?: number;
}) => {
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState<FormData>({
    notes: {},
    prescription: {},
  });
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const doctorId = user?.doctorId || "";
  const [activeTab, setActiveTab] = useState("medical-history");
  const role = user?.role || "";
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (currentStep === 1) {
      getERXIframeSession();
    }
  }, [currentStep]);


  const getERXIframeSession = async () => {
    setIsLoadingSession(true);
    try {
      const token = user?.token || localStorage.getItem('clinic-ai-token') || '';
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/doctor/erx/generate-session`,
        {
          patientId: patientId,
          doctorId: doctorId,
          appointmentId: appointmentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      // Store the session data in formData
      updateFormData('prescription', {
        sessionToken: data.sessionToken,
        chartId: data.chartId,
        iframeUrl: data.iframeUrl,
      });
    } catch (error) {
      console.error('Error generating eRx session:', error);
      toast({
        title: "Error",
        description: "Failed to load prescription session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSession(false);
    }
  };


  // Handle Next button - just move to next step (no API call needed here)
  const handleNext = async () => {

    // Move to next step if not last step
    if (currentStep < steps.length - 1) {
      // Call API to generate session for eRx before moving to prescription step
      if (currentStep === 0) {
        getERXIframeSession();
      }
      setCurrentStep((prev) => prev + 1);
    }
    if (currentStep > 0) {
      try {
        const res = await appointmentService.updateAppointmentStatus(role || "", appointmentId, "completed");
        if (res?.success) {
          toast({
            title: "Success",
            description: "Appointment completed successfully.",
            variant: "default",
          });
          router.push(`/doctor/appointments`);
        } else {
          toast({
            title: "Error",
            description: res?.message || "Failed to update appointment status",
            variant: "destructive",
          });

        }
      } catch (e: any) {
        const msg = e.message || e.response?.data?.message || "Failed to update appointment status";
        toast({
          title: "Error",
          description: msg,
          variant: "destructive",
        });
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepNotes
            formData={formData}
            updateFormData={updateFormData}
            patient={patient}
            doctorId={doctorId}
            appointmentId={appointmentId}
            patientId={patientId}
          />
        );

      case 1:
        if (isLoadingSession) {
          return (
            <div className="w-full h-[800px] rounded-lg overflow-hidden border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--color-brand-teal))] mx-auto mb-4"></div>
                <p className="text-[hsl(var(--muted-foreground))]">Loading prescription session...</p>
              </div>
            </div>
          );
        }
        
        if (!formData.prescription.sessionToken || !formData.prescription.chartId) {
          return (
            <div className="w-full h-[800px] rounded-lg overflow-hidden border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] flex items-center justify-center">
              <div className="text-center">
                <p className="text-[hsl(var(--muted-foreground))]">No prescription session available</p>
              </div>
            </div>
          );
        }
        
        const erxUrl = `https://ssu.scriptsure.com/chart/${formData.prescription.chartId}/prescriptions?sessiontoken=${formData.prescription.sessionToken}&darkmode=off`;
        return (
          <div className="w-full h-[800px] rounded-lg overflow-hidden border border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
            <iframe
              src={erxUrl}
              className="w-full h-full"
              title="Electronic Prescription (eRx)"
              allow="clipboard-write"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row -ml-0 md:-ml-8 gap-2 px-5">
        <Toaster />
        <div className="flex-1 space-y-6">
          <div className="p-4 md:p-6 border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] mt-4 md:mt-8">
            {/* Header with Back button and Tab Navigation */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
              <button
                onClick={goBack}
                className="text-sm flex items-center gap-2 text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] hover:text-[hsl(var(--color-brand-teal))] transition-colors group"
              >
                <ArrowLeft className="size-5 shrink-0 transition-transform group-hover:-translate-x-1" />
                <span>Back to patient Detail</span>
              </button>

              {/* Step Indicators */}
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                {steps.map((label, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-md text-xs sm:text-sm whitespace-nowrap transition-all shrink-0
                      ${index === currentStep
                        ? "bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))] font-medium shadow-sm"
                        : "hover:bg-[hsl(var(--muted))] dark:hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--muted-foreground))]"
                      }
                    `}
                  >
                    <div
                      className={`
                        shrink-0 w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full transition-colors
                        ${index === currentStep
                          ? "bg-[hsl(var(--primary-foreground))] text-[hsl(var(--color-brand-teal))]"
                          : "bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                        }
                      `}
                    >
                      {index + 1}
                    </div>
                    <span className="truncate leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2 text-[hsl(var(--foreground))]">
              {steps[currentStep]}
            </h2>

            {renderStepContent()}

            <div className="flex flex-col sm:flex-row justify-end mt-6 gap-3">
              {/* <button
                onClick={handleSkip}
                className="px-4 py-2 bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] min-w-[130px] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] rounded hover:bg-[hsl(var(--muted))]/80 dark:hover:bg-[hsl(var(--muted))]/80 flex justify-center items-center gap-2 text-sm font-medium"
              >
                Skip <Image src="/assets/icons/skipicon.png" width={16} height={5} alt="skip" />
              </button> */}
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-[hsl(var(--color-brand-teal))] min-w-[130px] text-[hsl(var(--primary-foreground))] rounded hover:bg-[hsl(var(--color-brand-teal)/0.7)] flex justify-center items-center gap-2 text-sm"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <CheckIcon className="size-5" /> Complete
                  </>
                ) : (
                  <>
                    Next <ArrowRightIcon className="size-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 px-5">
        <SectionsContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </>
  );
};

export default Procedure;
