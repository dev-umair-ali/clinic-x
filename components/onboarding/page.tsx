"use client";

import React, { useContext } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/ui/protected-route';
import { ChevronRight, ArrowLeft } from 'lucide-react';

/* ----------  STEP COMPONENTS  ---------- */
import BasicInformation           from './BasicInformation/page';
import ContactInformation         from './ContactInformation/page';
import EmergencyContact           from './EmergencyContact/page';
import AdditionalInformation      from './AdditionalInformation/page';
import InsuranceCoverage          from './InsuranceCoverage/page';
import InsuranceDetails           from './InsuranceDetails/page';
import InsuranceCardUpload        from './InsuranceCardUpload/page';
import MainConcern                from './MainConcern/page';
import PainAssessment             from './PainAssessment/page';
import SymptomDetails             from './SymptomDetails/page';
import HealthConditions           from './HealthConditions/page';
import CurrentMedications         from './CurrentMedications/page';
import SurgicalHistory            from './SurgicalHistory/page';
import Allergies                  from './Allergies/page';
import ExercisePhysicalActivity   from './ExercisePhysicalActivity/page';
import SubstanceUse               from './SubstanceUse/page';
import WomensHealthInformation    from './WomensHealthInformation/page';
import PatientAcknowledgment      from './PatientAcknowledgment/page';
import DigitalSignature           from './DigitalSignature/page';
import DocumentUploads            from './DocumentUploads/page';
import ReviewComplete             from './ReviewComplete/page';

/* --------------------------------------- */

const steps = [
  { id: 1, name: 'Personal Information', completed: false },
  { id: 2, name: 'Insurance Information', completed: false },
  { id: 3, name: 'Present Condition', completed: false },
  { id: 4, name: 'Health History', completed: false },
  { id: 5, name: 'Lifestyle & Habits', completed: false },
  { id: 6, name: 'For Women', completed: false },
  { id: 7, name: 'Consent & Legal', completed: false },
  { id: 8, name: 'Uploads', completed: false },
  { id: 9, name: 'Review & Complete', completed: false },
];

const INITIAL_FORM_DATA = {
  fullName: '',
  preferredName: '',
  dateOfBirth: '',
  gender: '',
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  emailAddress: '',
  phoneNumber: '',
  preferredContactMethod: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  relationshipToPatient: '',
  occupation: '',
  primaryLanguage: '',
  referredBy: '',
  hasInsurance: '',
  insuranceCompanyName: '',
  policyholderName: '',
  memberSubscriberID: '',
  groupNumber: '',
  mainConcern: '',
  symptomStartDate: '',
  hadThisBefore: '',
  painLevel: 0,
  painCharacteristics: [],
  whatImprovesIt: '',
  whatWorsensIt: '',
  activitiesAffected: '',
  seenAnyoneElse: '',
  treatmentsTried: '',
  healthConditions: [],
  otherConditions: '',
  currentMedications: '',
  bloodThinners: '',
  surgicalHistory: '',
  allergies: '',
  exerciseRegularly: '',
  workType: '',
  sleepQuality: '',
  sleepSupports: '',
  tobaccoUse: '',
  alcoholUse: '',
  recreationalDrugUse: '',
  currentlyPregnant: '',
  menstrualCycleInfo: '',
  pmsSymptoms: '',
  hormonalSymptoms: '',
  posturalSymptoms: '',
  birthControl: '',
  pregnancyHistory: '',
  informationComplete: false,
  consentToTreatment: false,
  physicalExamination: false,
  privacyPolicies: false,
  digitalSignature: '',
  uploadedFiles: {
    idFront: null,
    idBack: null,
    xraysScans: null,
    medicalRecords: null,
    otherDocuments: null,
  },
};

/* ------------------------------------------------------------------ */
/*  If you already have an AuthContext / useAuth hook – use it here   */
/*  Below is a tiny placeholder so the file compiles out-of-the-box.  */
/* ------------------------------------------------------------------ */
const AuthContext = React.createContext<{ user?: { role: string } }>({});
const useAuth = () => React.useContext(AuthContext);

export default function Onboarding() {
  const router = useRouter();
  const { user } = useAuth();                       // ← current user (role inside)
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCompletedSteps((prev) =>
        prev.includes(currentStep) ? prev : [...prev, currentStep]
      );
      setCurrentStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const updateFormData = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const getProgressPercentage = () =>
    Math.round((new Set(completedSteps).size / steps.length) * 100);

  const handleComplete = () => {
    const target =
      user?.role === 'clinic'
        ? '/clinic/appointments'
        : '/assistant/appointments';
    router.push(target);
  };

  /* step render map */
  const stepComponents: Record<number, React.ReactNode> = {
    1: (
      <>
        <BasicInformation formData={formData} updateFormData={updateFormData} />
        <ContactInformation formData={formData} updateFormData={updateFormData} />
        <EmergencyContact formData={formData} updateFormData={updateFormData} />
        <AdditionalInformation formData={formData} updateFormData={updateFormData} />
      </>
    ),
    2: (
      <>
        <InsuranceCoverage formData={formData} updateFormData={updateFormData} />
        {formData.hasInsurance === 'yes' && (
          <>
            <InsuranceDetails formData={formData} updateFormData={updateFormData} />
            <InsuranceCardUpload />
          </>
        )}
      </>
    ),
    3: (
      <>
        <MainConcern formData={formData} updateFormData={updateFormData} />
        <PainAssessment formData={formData} updateFormData={updateFormData} />
        <SymptomDetails formData={formData} updateFormData={updateFormData} />
      </>
    ),
    4: (
      <>
        <HealthConditions formData={formData} updateFormData={updateFormData} />
        <CurrentMedications formData={formData} updateFormData={updateFormData} />
        <SurgicalHistory formData={formData} updateFormData={updateFormData} />
        <Allergies formData={formData} updateFormData={updateFormData} />
      </>
    ),
    5: (
      <>
        <ExercisePhysicalActivity formData={formData} updateFormData={updateFormData} />
        <SubstanceUse formData={formData} updateFormData={updateFormData} />
      </>
    ),
    6: <WomensHealthInformation formData={formData} updateFormData={updateFormData} />,
    7: (
      <>
        <PatientAcknowledgment formData={formData} updateFormData={updateFormData} />
        <DigitalSignature formData={formData} updateFormData={updateFormData} />
      </>
    ),
    8: <DocumentUploads />,
    9: <ReviewComplete formData={formData} onSubmit={handleComplete} />,
  };

  return (
    <ProtectedRoute allowedRoles={['assistant', 'clinic', 'patient']}>
      <AuthContext.Provider value={{ user }}>   {/* expose user to hook */}
        <div className="min-h-screen bg-[hsl(var(--background))]">
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
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      step.id === currentStep
                        ? 'bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))]'
                        : completedSteps.includes(step.id)
                        ? 'bg-[hsl(var(--color-status-success)/0.1)] text-[hsl(var(--color-status-success))]'
                        : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                        step.id === currentStep
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
                  <span>Step {currentStep} of {steps.length}</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>{steps[currentStep - 1].name}</span>
                </div>

                {/* STEP CONTENT */}
                <div className="space-y-8">{stepComponents[currentStep]}</div>

                {/* NAV BUTTONS */}
                <div className="flex justify-end pt-8 mt-8 border-t border-[hsl(var(--border))]">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button
                      onClick={currentStep === steps.length ? handleComplete : nextStep}
                      className="flex items-center gap-2 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))]"
                    >
                      {currentStep === steps.length ? 'Submit' : 'Next'}
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </AuthContext.Provider>
    </ProtectedRoute>
  );
}