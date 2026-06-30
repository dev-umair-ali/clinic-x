import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/lib/store";
import { fetchAllOnboardingForms } from "@/lib/slices/onboardingSlice";
import PatientAcknowledgment from "./PatientAcknowledgment/page";
import DigitalSignature from "./DigitalSignature/page";
import {
  consentLegalService,
  validateConsentLegal,
} from "@/lib/api/services/consentLegalService";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface ConsentLegalParentProps {
  onNext: () => void;
}

const ConsentLegalParent = ({ onNext }: ConsentLegalParentProps) => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: any) => state.auth);
  const { constantLegal, isLoading, error } = useSelector(
    (state: any) => state.onboarding,
  );
  const [formData, setFormData] = React.useState<any>(constantLegal || {});

  useEffect(() => {
    setFormData(constantLegal || {});
  }, [constantLegal]);

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
    const validationError = validateConsentLegal(formData);
    if (validationError) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validationError,
      });
      return;
    }
    try {
      const response = await consentLegalService.update(formData.id, {
        ...formData,
        patientRef: user?.patientId,
        updatedBy: user?.patientId,
      });
      if (response.success) {
        toast({
          title: "Success",
          description: "Consent & legal saved successfully!",
          variant: "default",
        });
        onNext();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to save consent & legal",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save consent & legal",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <Toaster />
      <PatientAcknowledgment
        formData={formData}
        updateFormData={handleInputChange}
      />
      <DigitalSignature
        formData={formData}
        updateFormData={handleInputChange}
      />
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

export default ConsentLegalParent;
