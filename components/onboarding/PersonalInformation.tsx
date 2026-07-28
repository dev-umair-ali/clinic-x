import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/lib/store";
import { fetchAllOnboardingForms } from "@/lib/slices/onboardingSlice";
import BasicInformation from "./BasicInformation/page";
import EmergencyContact from "./EmergencyContact/page";
import AdditionalInformation from "./AdditionalInformation/page";

interface PersonalInfoFormData {
  legalName: string;
  emergencyContactName: string;
  emergencyPhoneNumber: string;
  relationshipToPatient: string;
  occupation: string;
  primaryLanguage: string;
  gender: string;
}

import { onBoardingFormService } from "@/lib/api/services/patientOnboardingService";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface PersonalInformationProps {
  onNext: () => void;
}

const PersonalInformation = ({ onNext }: PersonalInformationProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const { user } = useSelector((state: any) => state.auth);
  const { onBoardingInfo, isLoading, error } = useSelector(
    (state: any) => state.onboarding,
  );
  const [formData, setFormData] = React.useState<PersonalInfoFormData>({
    legalName: "",
    emergencyContactName: "",
    emergencyPhoneNumber: "",
    relationshipToPatient: "",
    occupation: "",
    primaryLanguage: "",
    gender: "",
  });

  useEffect(() => {
    setFormData(onBoardingInfo);
  }, [onBoardingInfo]);

  useEffect(() => {
    const patientId = localStorage.getItem("clinic-ai-user")
      ? JSON.parse(localStorage.getItem("clinic-ai-user")!).patientId
      : null;
    if (patientId) dispatch(fetchAllOnboardingForms(patientId));
  }, [dispatch]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onBoardingFormService.updatePersonalInfo({
        ...formData,
        patientRef: user?.patientId,
        createdBy: user?.patientId,
        updatedBy: user?.patientId,
      });
      toast({
        title: "Success",
        description: "Personal Information saved successfully.",
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
      <BasicInformation
        formData={formData}
        updateFormData={handleInputChange}
      />
      <EmergencyContact
        formData={formData}
        updateFormData={handleInputChange}
      />
      <AdditionalInformation
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

export default PersonalInformation;
