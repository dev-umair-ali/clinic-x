"use client";
import { LuCircleCheckBig } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from 'react-redux';
import { setOnboardingComplete } from '@/lib/slices/onboardingSlice';
import { useRouter } from 'next/navigation';

export default function ReviewComplete() {
  const dispatch = useDispatch();
  const router = useRouter();
  const onboarding = useSelector((state: any) => state.onboarding);

  const handleSubmit = () => {
    dispatch(setOnboardingComplete());
    router.push('/patient/dashboard');
  };

  const formData = {
    ...onboarding.onBoardingInfo,
    ...onboarding.insurance,
    ...onboarding.presentCondition,
    ...onboarding.history,
    ...onboarding.lifeStyle,
    ...onboarding.dentalHistory,
    ...onboarding.medicalProfile,
    ...onboarding.womenForm,
    ...onboarding.constantLegal,
    ...onboarding.onBoardingUploads,
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-6">
        Review & Complete
      </h3>
      <p className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mb-6">
        Please review your information below. Click Submit to finalize when
        ready.
      </p>

      <div className="grid grid-cols-2 gap-8">
        {/* Left column */}
        <div className="space-y-6">
          {/* Personal */}
          <div>
            <h4 className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">Personal Information</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Full Name:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.fullName || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Preferred Name:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.preferredName || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Date of Birth:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.dateOfBirth || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Gender:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.gender || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Email:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.emailAddress || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Phone:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.phoneNumber || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Address:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.streetAddress || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Emergency Contact:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.emergencyContactName || "Not provided"}</span>
              </div>
            </div>
          </div>

          {/* Insurance */}
          <div>
            <h4 className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">Insurance Information</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Has Insurance:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                  {formData.hasInsurance === "yes"
                    ? "Yes"
                    : formData.hasInsurance === "no"
                    ? "No"
                    : "Not provided"}
                </span>
              </div>
              {formData.hasInsurance === "yes" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Insurance Company:</span>
                    <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.insuranceCompanyName || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Policyholder:</span>
                    <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.policyholderName || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Member ID:</span>
                    <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.memberSubscriberID || "Not provided"}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Present Condition */}
          <div>
            <h4 className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">Present Condition</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Main Reason for Visit:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.mainConcern ? "Provided" : "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Symptom Start:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.symptomStartDate || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Pain Level:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.painLevel}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Had Before:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                  {formData.hadThisBefore === "yes"
                    ? "Yes"
                    : formData.hadThisBefore === "no"
                    ? "No"
                    : "Not provided"}
                </span>
              </div>
            </div>
          </div>

          {/* Health History */}
          <div>
            <h4 className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">Health History</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Blood Thinners:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                  {formData.bloodThinners === "yes"
                    ? "Yes"
                    : formData.bloodThinners === "no"
                    ? "No"
                    : "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Current Medications:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.currentMedications ? "Provided" : "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Past Surgeries:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.surgicalHistory ? "Provided" : "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Allergies:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.allergies ? "Provided" : "Not provided"}</span>
              </div>
            </div>
          </div>

          {/* Lifestyle */}
          <div>
            <h4 className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">Lifestyle & Habits</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Exercise Regularly:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                  {formData.exerciseRegularly === "yes"
                    ? "Yes"
                    : formData.exerciseRegularly === "no"
                    ? "No"
                    : "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Work Type:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.workType || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Sleep Quality:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.sleepQuality || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Tobacco Use:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                  {formData.tobaccoUse === "yes"
                    ? "Yes"
                    : formData.tobaccoUse === "no"
                    ? "No"
                    : "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Alcohol Use:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                  {formData.alcoholUse === "yes"
                    ? "Yes"
                    : formData.alcoholUse === "no"
                    ? "No"
                    : "Not provided"}
                </span>
              </div>
            </div>
          </div>

          {/* For Women */}
          <div>
            <h4 className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">For Women</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Currently Pregnant:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.currentlyPregnant || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Menstrual Info:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.menstrualCycleInfo ? "Provided" : "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Birth Control:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.birthControl ? "Provided" : "Not provided"}</span>
              </div>
            </div>
          </div>

          {/* Consent */}
          <div>
            <h4 className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">Consent & Legal</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Information Confirmed:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.informationComplete ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Treatment Consent:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.consentToTreatment ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Privacy Agreed:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.privacyPolicies ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Digital Signature:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{formData.digitalSignature || "Not provided"}</span>
              </div>
            </div>
          </div>

          {/* Uploads */}
          <div>
            <h4 className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">Document Uploads</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Upload ID (Front):</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Not uploaded</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Upload ID (Back):</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Not uploaded</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">X-rays/Scans:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Not uploaded</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Medical Records:</span>
                <span className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Not uploaded</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[hsl(var(--color-status-success-light))] dark:bg-[hsl(var(--color-status-success))/0.1] border border-[hsl(var(--color-status-success))] rounded-lg p-6 mt-8 text-center">
        <div className="flex justify-center mb-3">
          <LuCircleCheckBig className="h-12 w-12 text-[hsl(var(--color-status-success))]" />
        </div>
        <h3 className="text-lg font-semibold text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))] mb-2">
          Onboarding Complete!
        </h3>
        <p className="text-[hsl(var(--color-status-success))] dark:text-[hsl(var(--color-status-success))] mb-4 max-w-md mx-auto">
          You&apos;ve successfully filled out all required sections. Click below to
          submit your information and book your patient onboard.
        </p>
        <Button
          onClick={handleSubmit}
          className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}