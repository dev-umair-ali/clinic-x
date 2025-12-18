"use client";

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/ui/protected-route';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { LuCircleCheckBig } from 'react-icons/lu';

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

export default function Onboarding() {
  const router = useRouter();
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

  const handleComplete = () => router.push('/receptionist/appointments');

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
    <ProtectedRoute allowedRoles={['receptionist']}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Patient Onboarding
              </h1>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {getProgressPercentage()}% Complete
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-teal-600 dark:bg-teal-500 h-2 rounded-full transition-all"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-80 bg-white dark:bg-gray-800 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-6">
            <nav className="space-y-1 sticky top-6">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    step.id === currentStep
                      ? 'bg-teal-600 text-white'
                      : completedSteps.includes(step.id)
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                      step.id === currentStep
                        ? 'bg-white text-teal-600'
                        : completedSteps.includes(step.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
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
          <main className="flex-1 bg-white dark:bg-gray-800">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>Step {currentStep} of {steps.length}</span>
                <ChevronRight className="h-4 w-4" />
                <span>{steps[currentStep - 1].name}</span>
              </div>

              {/* STEP CONTENT */}
              <div className="space-y-8">{stepComponents[currentStep]}</div>

              {/* NAV BUTTONS */}
              <div className="flex justify-end pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
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
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white"
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
    </ProtectedRoute>
  );
}