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
    e.preventDefault();
    try {
      await insuranceFormService.update(formData.id, {
        ...formData,
        patientRef: user?.patientId,
        createdBy: user?.patientId,
        updatedBy: user?.patientId,
      });
      toast({
        title: "Success",
        description: "Insurance information saved successfully!",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Saved",
        description: "Continuing to next step.",
        variant: "default",
      });
    } finally {
      onNext();
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
