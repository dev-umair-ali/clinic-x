"use client";

import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/ui/protected-route';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import patientOnboardingService from '@/lib/api/services/patientOnboardingService';
import fieldMappers, { reverseFieldMappers } from '@/lib/api/services/fieldMappers';

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
  insuranceCardFront: null as File | null,
  insuranceCardBack: null as File | null,
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
  idFront: null as File | null,
  idBack: null as File | null,
  scans: null as File | null,
  medicalRecord: null as File | null,
  otherDoc: null as File | null,
  uploadedFiles: {
    idFront: null,
    idBack: null,
    xraysScans: null,
    medicalRecords: null,
    otherDocuments: null,
  },
};

/* ------------------------------------------------------------------ */
/*  Get User ID helper - used to get patient ID from localStorage      */
/* ------------------------------------------------------------------ */
const getUserId = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      const userStr = localStorage.getItem('clinic-ai-user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user._id || user.id || null;
      }
    } catch (error) {
      console.error('Error getting user ID:', error);
    }
  }
  return null;
};

/* ------------------------------------------------------------------ */
/*  If you already have an AuthContext / useAuth hook – use it here   */
/*  Below is a tiny placeholder so the file compiles out-of-the-box.  */
/* ------------------------------------------------------------------ */
const AuthContext = React.createContext<{ user?: { role: string; _id?: string } }>({});
const useAuth = () => React.useContext(AuthContext);

export default function Onboarding() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();                       // ← current user (role inside)
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formIds, setFormIds] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Get patient ID from user context or localStorage
  const getPatientId = (): string => {
    if (user?._id) return user._id;
    const userId = getUserId();
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found. Please log in again.",
        variant: "destructive",
      });
      router.push('/login');
      return '';
    }
    return userId;
  };

  // Load existing form data on mount
  useEffect(() => {
    const loadExistingForms = async () => {
      setIsLoading(true);
      try {
        // Get all forms for the logged-in patient
        const formsResponse = await patientOnboardingService.forms.getMyForms();
        
        console.log('🔍 Backend Response:', formsResponse);
        
        if (formsResponse.success && formsResponse.data) {
          const forms = formsResponse.data;
          console.log('📋 Forms object:', forms);
          console.log('📋 Available forms:', Object.keys(forms));
          
          const loadedFormIds: Record<string, string> = {};
          const updatedFormData: any = { ...INITIAL_FORM_DATA };
          const completed: number[] = [];

          // Step 1: OnBoarding Form (Personal Information)
          if (forms.onBoarding) {
            const form = forms.onBoarding;
            console.log('✅ Step 1 - OnBoarding Form found:', form);
            loadedFormIds.onBoarding = form._id;
            // Use reverse mapper to convert backend field names to frontend
            const mappedData = reverseFieldMappers.onBoarding(form);
            console.log('🔄 Step 1 - Mapped data:', mappedData);
            Object.assign(updatedFormData, mappedData);
            completed.push(1);
          } else {
            console.log('❌ Step 1 - OnBoarding Form NOT found');
          }

          // Step 2: Insurance Form
          if (forms.insurance) {
            const form = forms.insurance;
            console.log('✅ Step 2 - Insurance Form found:', form);
            loadedFormIds.insurance = form._id;
            // Use reverse mapper to convert backend field names to frontend
            const mappedData = reverseFieldMappers.insurance(form);
            console.log('🔄 Step 2 - Mapped data:', mappedData);
            Object.assign(updatedFormData, mappedData);
            completed.push(2);
          } else {
            console.log('❌ Step 2 - Insurance Form NOT found');
          }

          // Step 3: Present Condition Form
          if (forms.presentCondition) {
            const form = forms.presentCondition;
            console.log('✅ Step 3 - Present Condition Form found:', form);
            loadedFormIds.presentCondition = form._id;
            // Use reverse mapper to convert backend field names to frontend
            const mappedData = reverseFieldMappers.presentCondition(form);
            console.log('🔄 Step 3 - Mapped data:', mappedData);
            Object.assign(updatedFormData, mappedData);
            completed.push(3);
          } else {
            console.log('❌ Step 3 - Present Condition Form NOT found');
          }

          // Step 4: Health History Form (Note: backend returns 'history' as an array)
          if (forms.history && forms.history.length > 0) {
            const form = forms.history[0]; // Take the first (most recent) history
            console.log('✅ Step 4 - Health History Form found:', form);
            loadedFormIds.healthHistory = form._id;
            // Use reverse mapper to convert backend field names to frontend
            const mappedData = reverseFieldMappers.historyHealth(form);
            console.log('🔄 Step 4 - Mapped data:', mappedData);
            Object.assign(updatedFormData, mappedData);
            completed.push(4);
          } else {
            console.log('❌ Step 4 - Health History Form NOT found');
          }

          // Step 5: Lifestyle Form
          if (forms.lifeStyle) {
            const form = forms.lifeStyle;
            console.log('✅ Step 5 - Lifestyle Form found:', form);
            loadedFormIds.lifestyle = form._id;
            // Use reverse mapper to convert backend field names to frontend
            const mappedData = reverseFieldMappers.lifestyle(form);
            console.log('🔄 Step 5 - Mapped data:', mappedData);
            Object.assign(updatedFormData, mappedData);
            completed.push(5);
          } else {
            console.log('❌ Step 5 - Lifestyle Form NOT found');
          }

          // Step 6: Women's Health Form
          if (forms.womenForm) {
            const form = forms.womenForm;
            console.log('✅ Step 6 - Women Form found:', form);
            loadedFormIds.women = form._id;
            // Use reverse mapper to convert backend field names to frontend
            const mappedData = reverseFieldMappers.women(form);
            console.log('🔄 Step 6 - Mapped data:', mappedData);
            Object.assign(updatedFormData, mappedData);
            completed.push(6);
          } else {
            console.log('❌ Step 6 - Women Form NOT found');
          }

          // Step 7: Legal Form
          if (forms.constantLegal) {
            const form = forms.constantLegal;
            console.log('✅ Step 7 - Legal Form found:', form);
            loadedFormIds.legal = form._id;
            // Use reverse mapper to convert backend field names to frontend
            const mappedData = reverseFieldMappers.legal(form);
            console.log('🔄 Step 7 - Mapped data:', mappedData);
            Object.assign(updatedFormData, mappedData);
            completed.push(7);
          } else {
            console.log('❌ Step 7 - Legal Form NOT found');
          }

          // Update state with loaded data
          console.log('📦 Final updatedFormData:', updatedFormData);
          console.log('🎯 Completed steps:', completed);
          setFormData(updatedFormData);
          setFormIds(loadedFormIds);
          setCompletedSteps(completed);

          if (completed.length > 0) {
            toast({
              title: "Forms Loaded",
              description: `${completed.length} saved form(s) loaded successfully.`,
            });
          }
        }
      } catch (error: any) {
        console.error('Error loading existing forms:', error);
        // Don't show error toast on initial load, just log it
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingForms();
  }, []); // Run once on mount

  // Auto-save form data when step is completed
  const saveStepData = async (step: number) => {
    const patientId = getPatientId();
    if (!patientId) {
      console.error('No patient ID found');
      return;
    }

    console.log(`💾 Saving step ${step} data...`, { patientId, formIds });
    setIsSubmitting(true);
    try {
      switch (step) {
        case 1: {
          // Personal Information - OnBoarding Form
          // Validate required fields
          const requiredFields = {
            fullName: formData.fullName,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            streetAddress: formData.streetAddress,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            emailAddress: formData.emailAddress,
            phoneNumber: formData.phoneNumber,
            emergencyContactName: formData.emergencyContactName,
            emergencyContactPhone: formData.emergencyContactPhone,
            relationshipToPatient: formData.relationshipToPatient,
          };

          const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value || value.trim() === '')
            .map(([key]) => key);

          if (missingFields.length > 0) {
            console.warn('⚠️ Step 1 - Missing required fields:', missingFields);
            toast({
              title: "Incomplete Information",
              description: `Please fill in all required fields: ${missingFields.join(', ')}`,
              variant: "destructive",
            });
            setIsSubmitting(false);
            return;
          }

          const onBoardingData = fieldMappers.onBoarding(formData, patientId);

          console.log('Step 1 - OnBoarding data:', onBoardingData);
          if (formIds.onBoarding) {
            const result = await patientOnboardingService.onBoarding.update(formIds.onBoarding, onBoardingData);
            console.log('Step 1 - Update result:', result);
          } else {
            const result = await patientOnboardingService.onBoarding.create(onBoardingData);
            console.log('Step 1 - Create result:', result);
            if (result.data?._id) {
              setFormIds(prev => ({ ...prev, onBoarding: result.data._id }));
            }
          }
          break;
        }

        case 2: {
          // Insurance Information
          console.log('🔍 Step 2 - Form data before mapping:', {
            hasInsurance: formData.hasInsurance,
            insuranceCardFront: formData.insuranceCardFront,
            insuranceCardBack: formData.insuranceCardBack,
            insuranceCardFrontType: typeof formData.insuranceCardFront,
            insuranceCardBackType: typeof formData.insuranceCardBack,
          });

          if (formData.hasInsurance === 'yes') {
            // Validate required insurance fields
            const requiredInsuranceFields = {
              insuranceCompanyName: formData.insuranceCompanyName,
              policyholderName: formData.policyholderName,
              memberSubscriberID: formData.memberSubscriberID,
            };

            const missingFields = Object.entries(requiredInsuranceFields)
              .filter(([_, value]) => !value || value.trim() === '')
              .map(([key]) => key);

            if (missingFields.length > 0) {
              console.warn('⚠️ Step 2 - Missing required fields:', missingFields);
              toast({
                title: "Incomplete Information",
                description: `Please fill in required insurance fields: ${missingFields.join(', ')}`,
                variant: "destructive",
              });
              setIsSubmitting(false);
              return;
            }

            const insuranceData = await fieldMappers.insurance(formData, patientId);

            console.log('Step 2 - Insurance data:', insuranceData);
            if (formIds.insurance) {
              const result = await patientOnboardingService.insurance.update(formIds.insurance, insuranceData);
              console.log('Step 2 - Update result:', result);
            } else {
              const result = await patientOnboardingService.insurance.create(insuranceData);
              console.log('Step 2 - Create result:', result);
              if (result.data?._id) {
                setFormIds(prev => ({ ...prev, insurance: result.data._id }));
              }
            }
          } else if (formData.hasInsurance === 'no') {
            // Save record that patient has no insurance
            const insuranceData = await fieldMappers.insurance(formData, patientId);

            console.log('Step 2 - Insurance data (no insurance):', insuranceData);
            if (formIds.insurance) {
              const result = await patientOnboardingService.insurance.update(formIds.insurance, insuranceData);
              console.log('Step 2 - Update result:', result);
            } else {
              const result = await patientOnboardingService.insurance.create(insuranceData);
              console.log('Step 2 - Create result:', result);
              if (result.data?._id) {
                setFormIds(prev => ({ ...prev, insurance: result.data._id }));
              }
            }
          } else {
            console.log('Step 2 - Skipped (insurance selection not made)');
            toast({
              title: "Selection Required",
              description: "Please select whether you have insurance or not",
              variant: "destructive",
            });
            setIsSubmitting(false);
            return;
          }
          break;
        }

        case 3: {
          // Present Condition - Validate required fields
          const requiredPresentConditionFields = {
            mainConcern: formData.mainConcern,
            symptomStartDate: formData.symptomStartDate,
          };

          const missingFields = Object.entries(requiredPresentConditionFields)
            .filter(([_, value]) => !value || value.toString().trim() === '')
            .map(([key]) => key);

          if (missingFields.length > 0) {
            console.warn('⚠️ Step 3 - Missing required fields:', missingFields);
            toast({
              title: "Incomplete Information",
              description: `Please fill in: ${missingFields.join(', ')}`,
              variant: "destructive",
            });
            setIsSubmitting(false);
            return;
          }

          const presentConditionData = fieldMappers.presentCondition(formData, patientId);

          console.log('Step 3 - Present Condition data:', presentConditionData);
          if (formIds.presentCondition) {
            const result = await patientOnboardingService.presentCondition.update(formIds.presentCondition, presentConditionData);
            console.log('Step 3 - Update result:', result);
          } else {
            const result = await patientOnboardingService.presentCondition.create(presentConditionData);
            console.log('Step 3 - Create result:', result);
            if (result.data?._id) {
              setFormIds(prev => ({ ...prev, presentCondition: result.data._id }));
            }
          }
          break;
        }

        case 4: {
          // Health History - Most fields are optional, just need at least some data
          const healthHistoryData = fieldMappers.historyHealth(formData, patientId);

          console.log('Step 4 - Health History data:', healthHistoryData);
          if (formIds.healthHistory) {
            const result = await patientOnboardingService.healthHistory.update(formIds.healthHistory, healthHistoryData);
            console.log('Step 4 - Update result:', result);
          } else {
            const result = await patientOnboardingService.healthHistory.create(healthHistoryData);
            console.log('Step 4 - Create result:', result);
            if (result.data?._id) {
              setFormIds(prev => ({ ...prev, healthHistory: result.data._id }));
            }
          }
          break;
        }

        case 5: {
          // Lifestyle - Optional fields
          const lifestyleData = fieldMappers.lifestyle(formData, patientId);

          console.log('Step 5 - Lifestyle data:', lifestyleData);
          if (formIds.lifestyle) {
            const result = await patientOnboardingService.lifestyle.update(formIds.lifestyle, lifestyleData);
            console.log('Step 5 - Update result:', result);
          } else {
            const result = await patientOnboardingService.lifestyle.create(lifestyleData);
            console.log('Step 5 - Create result:', result);
            if (result.data?._id) {
              setFormIds(prev => ({ ...prev, lifestyle: result.data._id }));
            }
          }
          break;
        }

        case 6: {
          // Women's Health (optional based on gender)
          if (formData.gender === 'female' || formData.currentlyPregnant || formData.menstrualCycleInfo) {
            const womenData = fieldMappers.women(formData, patientId);

            console.log('Step 6 - Women\'s Health data:', womenData);
            if (formIds.women) {
              const result = await patientOnboardingService.women.update(formIds.women, womenData);
              console.log('Step 6 - Update result:', result);
            } else {
              const result = await patientOnboardingService.women.create(womenData);
              console.log('Step 6 - Create result:', result);
              if (result.data?._id) {
                setFormIds(prev => ({ ...prev, women: result.data._id }));
              }
            }
          } else {
            console.log('Step 6 - Skipped (not applicable)');
          }
          break;
        }

        case 7: {
          // Legal & Consent - Validate all checkboxes are checked
          const requiredConsents = {
            informationComplete: formData.informationComplete,
            consentToTreatment: formData.consentToTreatment,
            physicalExamination: formData.physicalExamination,
            privacyPolicies: formData.privacyPolicies,
            digitalSignature: formData.digitalSignature,
          };

          const missingConsents = Object.entries(requiredConsents)
            .filter(([key, value]) => {
              if (key === 'digitalSignature') {
                return !value || (typeof value === 'string' && value.trim() === '');
              }
              return value !== true;
            })
            .map(([key]) => key);

          if (missingConsents.length > 0) {
            console.warn('⚠️ Step 7 - Missing required consents:', missingConsents);
            toast({
              title: "Consent Required",
              description: `Please complete all required acknowledgments: ${missingConsents.join(', ')}`,
              variant: "destructive",
            });
            setIsSubmitting(false);
            return;
          }

          const legalData = await fieldMappers.legal(formData, patientId);

          console.log('Step 7 - Legal data:', legalData);
          if (formIds.legal) {
            const result = await patientOnboardingService.legal.update(formIds.legal, legalData);
            console.log('Step 7 - Update result:', result);
          } else {
            const result = await patientOnboardingService.legal.create(legalData);
            console.log('Step 7 - Create result:', result);
            if (result.data?._id) {
              setFormIds(prev => ({ ...prev, legal: result.data._id }));
            }
          }
          break;
        }

        case 8: {
          // Document uploads - handled separately in DocumentUploads component
          console.log('Step 8 - Document uploads (handled separately)');
          break;
        }
      }

      console.log(`✅ Step ${step} saved successfully`);
      toast({
        title: "Progress Saved",
        description: "Your information has been saved successfully.",
      });
    } catch (error: any) {
      console.error(`❌ Error saving step ${step} data:`, error);
      toast({
        title: "Error Saving Data",
        description: error.message || "Failed to save your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    if (currentStep < steps.length) {
      // Save current step data before moving to next
      await saveStepData(currentStep);
      
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

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      console.log('🎉 Completing onboarding...');
      
      // Step 9 is just review, no need to save it
      // All previous steps should already be saved via nextStep()

      toast({
        title: "Onboarding Complete!",
        description: "Your information has been submitted successfully.",
      });

      // Redirect based on user role
      const target =
        user?.role === 'clinic'
          ? '/clinic/appointments'
          : user?.role === 'patient'
          ? '/patient/dashboard'
          : '/assistant/appointments';
      
      setTimeout(() => {
        router.push(target);
      }, 1500);
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Submission Error",
        description: error.message || "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <InsuranceCardUpload formData={formData} updateFormData={updateFormData} />
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
    8: <DocumentUploads formData={formData} updateFormData={updateFormData} />,
    9: <ReviewComplete formData={formData} onSubmit={handleComplete} />,
  };

  return (
    <ProtectedRoute allowedRoles={['assistant', 'clinic', 'patient']}>
      <AuthContext.Provider value={{ user }}>   {/* expose user to hook */}
        <div className="min-h-screen bg-[hsl(var(--background))]">
          {/* Loading State */}
          {isLoading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[hsl(var(--card))] p-8 rounded-lg shadow-xl">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--color-brand-teal))]"></div>
                  <p className="text-[hsl(var(--foreground))]">Loading your forms...</p>
                </div>
              </div>
            </div>
          )}

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
                      disabled={currentStep === 1 || isSubmitting}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button
                      onClick={currentStep === steps.length ? handleComplete : nextStep}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))]"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          {currentStep === steps.length ? 'Submitting...' : 'Saving...'}
                        </>
                      ) : (
                        <>
                          {currentStep === steps.length ? 'Submit' : 'Next'}
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </>
                      )}
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