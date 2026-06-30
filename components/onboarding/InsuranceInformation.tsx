import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/lib/store";
import { fetchAllOnboardingForms } from "@/lib/slices/onboardingSlice";
import InsuranceCoverage from "./InsuranceCoverage/page";
import InsuranceDetails from "./InsuranceDetails/page";
import InsuranceCardUpload from "./InsuranceCardUpload/page";
import { insuranceFormService } from "@/lib/api/services/patientOnboardingService";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface InsuranceInformationProps {
  onNext: () => void;
}

const InsuranceInformation = ({ onNext }: InsuranceInformationProps) => {
  const { toast } = useToast();
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { insurance, isLoading, error } = useSelector(
    (state: any) => state.onboarding,
  );

  useEffect(() => {
    // Replace 'patientId' with actual patient id from context or props
    const patientId = localStorage.getItem("clinic-ai-user")
      ? JSON.parse(localStorage.getItem("clinic-ai-user")!).patientId
      : null;
    if (patientId) dispatch(fetchAllOnboardingForms(patientId));
  }, [dispatch]);

  const [formData, setFormData] = React.useState<any>(insurance || {});

  useEffect(() => {
    setFormData(insurance || {});
  }, [insurance]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // Required field validation if patient has insurance
    if (formData.hasInsurance === "yes") {
      const requiredFields = [
        "insuranceProvider",
        "policyNumber",
        "groupNumber",
        "insuranceCardFront",
        "insuranceCardBack",
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);
      if (missingFields.length > 0) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: `Please fill all required insurance fields: ${missingFields.join(", ")}`,
        });
        return;
      }
    }
    e.preventDefault();
    try {
      // PATCH/PUT request to save/update insurance info
      const response = await insuranceFormService.update(formData.id, {
        ...formData,
        patientRef: user?.patientId,
        createdBy: user?.patientId,
        updatedBy: user?.patientId,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Insurance information saved successfully!",
          variant: "default",
        });
        onNext();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            response.message || "Failed to save insurance information",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save insurance information",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <Toaster />
      <InsuranceCoverage
        formData={formData}
        updateFormData={handleInputChange}
      />
      {formData?.hasInsurance === "yes" && (
        <>
          <InsuranceDetails
            formData={formData}
            updateFormData={handleInputChange}
          />
          <InsuranceCardUpload
            formData={formData}
            updateFormData={handleInputChange}
          />
        </>
      )}
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

export default InsuranceInformation;
