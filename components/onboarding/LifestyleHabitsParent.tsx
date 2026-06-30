import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/lib/store";
import { fetchAllOnboardingForms } from "@/lib/slices/onboardingSlice";
import ExercisePhysicalActivity from "./ExercisePhysicalActivity/page";
import SubstanceUse from "./SubstanceUse/page";
import {
  lifestyleHabitsService,
  validateLifestyleHabits,
} from "@/lib/api/services/lifestyleHabitsService";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface LifestyleHabitsParentProps {
  onNext: () => void;
}

const LifestyleHabitsParent = ({ onNext }: LifestyleHabitsParentProps) => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: any) => state.auth);
  const { lifeStyle, isLoading, error } = useSelector(
    (state: any) => state.onboarding,
  );
  const [formData, setFormData] = React.useState<any>(lifeStyle || {});

  useEffect(() => {
    setFormData(lifeStyle || {});
  }, [lifeStyle]);

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
    const validationError = validateLifestyleHabits(formData);
    if (validationError) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validationError,
      });
      return;
    }
    try {
      const response = await lifestyleHabitsService.update(formData.id, {
        ...formData,
        patientRef: user?.patientId,
        updatedBy: user?.patientId,
      });
      if (response.success) {
        toast({
          title: "Success",
          description: "Lifestyle & habits saved successfully!",
          variant: "default",
          duration: 2000,
        });
        onNext();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to save lifestyle & habits",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save lifestyle & habits",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <Toaster />
      <ExercisePhysicalActivity
        formData={formData}
        updateFormData={handleInputChange}
      />
      <SubstanceUse formData={formData} updateFormData={handleInputChange} />
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

export default LifestyleHabitsParent;
