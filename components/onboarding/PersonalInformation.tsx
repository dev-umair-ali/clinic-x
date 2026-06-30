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
    if (formData?.legalName === "" || !formData?.legalName) {
      toast({
        title: "Error",
        description: "Legal Name is required.",
        variant: "destructive",
      });
      return;
    }
    if (
      formData?.emergencyContactName === "" ||
      !formData?.emergencyContactName
    ) {
      toast({
        title: "Error",
        description: "Emergency Contact Name is required.",
        variant: "destructive",
      });
      return;
    }
    if (
      formData?.emergencyPhoneNumber === "" ||
      !formData?.emergencyPhoneNumber
    ) {
      toast({
        title: "Error",
        description: "Emergency Phone Number is required.",
        variant: "destructive",
      });
      return;
    }
    if (
      formData?.relationshipToPatient === "" ||
      !formData?.relationshipToPatient
    ) {
      toast({
        title: "Error",
        description: "Relationship to Patient is required.",
        variant: "destructive",
      });
      return;
    }
    if (formData?.occupation === "" || !formData?.occupation) {
      toast({
        title: "Error",
        description: "Occupation is required.",
        variant: "destructive",
      });
      return;
    }
    if (formData?.primaryLanguage === "" || !formData?.primaryLanguage) {
      toast({
        title: "Error",
        description: "Primary Language is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      // PATCH request to save/update personal info
      const response = await onBoardingFormService.updatePersonalInfo({
        ...formData,
        patientRef: user?.patientId,
        createdBy: user?.patientId,
        updatedBy: user?.patientId,
      });
      if (response.success) {
        toast({
          title: "Success",
          description: "Personal Information saved successfully.",
          variant: "default",

        });
        onNext();
      } else {
        toast({
          title: "Error",
          description:
            response.message || "Failed to save personal information",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save personal information",
        variant: "destructive",
      });
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
