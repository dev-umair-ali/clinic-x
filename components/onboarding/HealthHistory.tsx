import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/lib/store";
import { fetchAllOnboardingForms } from "@/lib/slices/onboardingSlice";
import HealthConditions from "./HealthConditions/page";
import CurrentMedications from "./CurrentMedications/page";
import SurgicalHistory from "./SurgicalHistory/page";
import Allergies from "./Allergies/page";
import {
  healthHistoryService,
  validateHealthHistory,
} from "@/lib/api/services/healthHistoryService";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface HealthHistoryProps {
  onNext: () => void;
}

const HealthHistory = ({ onNext }: HealthHistoryProps) => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: any) => state.auth);
  const { history, isLoading, error } = useSelector(
    (state: any) => state.onboarding,
  );
  const [formData, setFormData] = React.useState<any>(history || {});

  useEffect(() => {
    setFormData(history || {});
  }, [history]);

  useEffect(() => {
    const patientId = localStorage.getItem("clinic-ai-user")
      ? JSON.parse(localStorage.getItem("clinic-ai-user")!).patientId
      : null;
    if (patientId) dispatch(fetchAllOnboardingForms(patientId));
  }, [dispatch]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateHealthHistory(formData);
    if (validationError) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validationError,
      });
      return;
    }
    try {
      const response = await healthHistoryService.update(formData.id, {
        ...formData,
        patientRef: user?.patientId,
        updatedBy: user?.patientId,
      });
      if (response.success) {
        toast({
          title: "Success",
          description: "Health history saved successfully!",
          variant: "default",
        });
        onNext();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to save health history",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save health history",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <Toaster />
      <HealthConditions
        formData={formData}
        updateFormData={handleInputChange}
      />
      <CurrentMedications
        formData={formData}
        updateFormData={handleInputChange}
      />
      <SurgicalHistory formData={formData} updateFormData={handleInputChange} />
      <Allergies formData={formData} updateFormData={handleInputChange} />
      <button
        type="submit"
        className="
    mt-6
    px-6 py-3
    rounded-lg
    font-semibold
    text-white
    bg-[hsl(var(--color-brand-teal))]
    hover:bg-[hsl(var(--color-brand-teal-dark))]
    focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-brand-teal))]
    disabled:opacity-60 disabled:cursor-not-allowed
    transition-colors
  "
      >
        Save & Continue
      </button>{" "}
    </form>
  );
};

export default HealthHistory;
