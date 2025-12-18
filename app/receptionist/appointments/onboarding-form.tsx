"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/doctor/doctor-charts/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/doctor/doctor-charts/select";
import { Slider } from "@/components/ui/slider";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Check, ArrowLeft, Upload, ChevronRight } from "lucide-react";
import { LuCircleCheckBig } from "react-icons/lu";

const steps = [
  { id: 1, name: "Personal Information", completed: false },
  { id: 2, name: "Insurance Information", completed: false },
  { id: 3, name: "Present Condition", completed: false },
  { id: 4, name: "Health History", completed: false },
  { id: 5, name: "Lifestyle & Habits", completed: false },
  { id: 6, name: "For Women", completed: false },
  { id: 7, name: "Consent & Legal", completed: false },
  { id: 8, name: "Uploads", completed: false },
  { id: 9, name: "Review & Complete", completed: false },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    preferredName: "",
    dateOfBirth: "",
    gender: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    emailAddress: "",
    phoneNumber: "",
    preferredContactMethod: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    relationshipToPatient: "",
    occupation: "",
    primaryLanguage: "",
    referredBy: "",

    // Insurance Information
    hasInsurance: "",
    insuranceCompanyName: "",
    policyholderName: "",
    relationshipToPatient: "",
    memberSubscriberID: "",
    groupNumber: "",

    // Present Condition
    mainConcern: "",
    symptomStartDate: "",
    hadThisBefore: "",
    painLevel: 0,
    painCharacteristics: [],
    whatImprovesIt: "",
    whatWorsensIt: "",
    activitiesAffected: "",
    seenAnyoneElse: "",
    treatmentsTried: "",

    // Health History
    healthConditions: [],
    otherConditions: "",
    currentMedications: "",
    bloodThinners: "",
    surgicalHistory: "",
    allergies: "",

    // Lifestyle & Habits
    exerciseRegularly: "",
    workType: "",
    sleepQuality: "",
    sleepSupports: "",
    tobaccoUse: "",
    alcoholUse: "",
    recreationalDrugUse: "",

    // For Women
    currentlyPregnant: "",
    menstrualCycleInfo: "",
    pmsSymptoms: "",
    hormonalSymptoms: "",
    posturalSymptoms: "",
    birthControl: "",
    pregnancyHistory: "",

    // Consent & Legal
    informationComplete: false,
    consentToTreatment: false,
    physicalExamination: false,
    privacyPolicies: false,
    digitalSignature: "",

    // Document Uploads
    uploadedFiles: {
      idFront: null,
      idBack: null,
      xraysScans: null,
      medicalRecords: null,
      otherDocuments: null,
    },
  });

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCompletedSteps((prev) => {
        // Only add the step if it's not already completed
        if (!prev.includes(currentStep)) {
          return [...prev, currentStep];
        }
        return prev;
      });
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getProgressPercentage = () => {
    const uniqueCompletedSteps = [...new Set(completedSteps)];
    return Math.round((uniqueCompletedSteps.length / steps.length) * 100);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    router.push("/patient/appointments");
  };

  const handleCancel = () => {
    router.push("/patient/appointments");
  };

  const renderPersonalInformation = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <span>Step 1 of 9</span>
        <ChevronRight className="h-4 w-4" />
        <span>Personal Information</span>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
        Personal Information
      </h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Full Name *
              </Label>
              <Input
                placeholder="Enter your full Legal Name"
                value={formData.fullName}
                onChange={(e) => updateFormData("fullName", e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Preferred Name
              </Label>
              <Input
                placeholder="What would you like to be called"
                value={formData.preferredName}
                onChange={(e) =>
                  updateFormData("preferredName", e.target.value)
                }
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
            Address
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Street Address
              </Label>
              <Input
                placeholder="123 Main Street"
                value={formData.streetAddress}
                onChange={(e) =>
                  updateFormData("streetAddress", e.target.value)
                }
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  City
                </Label>
                <Input
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  State
                </Label>
                <Input
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => updateFormData("state", e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  ZIP Code
                </Label>
                <Input
                  placeholder="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => updateFormData("zipCode", e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Email Address *
              </Label>
              <Input
                type="email"
                placeholder="your@example.com"
                value={formData.emailAddress}
                onChange={(e) => updateFormData("emailAddress", e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Phone Number *
              </Label>
              <Input
                placeholder="(555) 123-4567"
                value={formData.phoneNumber}
                onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Preferred Contact Method
            </Label>
            <Select
              value={formData.preferredContactMethod}
              onValueChange={(value) =>
                updateFormData("preferredContactMethod", value)
              }
            >
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="How would you like us to contact you" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="text">Text Message</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
            Emergency Contact
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Emergency Contact Name
              </Label>
              <Input
                placeholder="Person's Name"
                value={formData.emergencyContactName}
                onChange={(e) =>
                  updateFormData("emergencyContactName", e.target.value)
                }
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Emergency Contact Phone
              </Label>
              <Input
                placeholder="(555) 123-4567"
                value={formData.emergencyContactPhone}
                onChange={(e) =>
                  updateFormData("emergencyContactPhone", e.target.value)
                }
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Relationship to Patient
            </Label>
            <Select
              value={formData.relationshipToPatient}
              onValueChange={(value) =>
                updateFormData("relationshipToPatient", value)
              }
            >
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="child">Child</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
            Additional Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Occupation
              </Label>
              <Input
                placeholder="Your Job Title or Profession"
                value={formData.occupation}
                onChange={(e) => updateFormData("occupation", e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Primary Language
              </Label>
              <Select
                value={formData.primaryLanguage}
                onValueChange={(value) =>
                  updateFormData("primaryLanguage", value)
                }
              >
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Referred By (Optional)
            </Label>
            <Input
              placeholder="Who referred you to our practice?"
              value={formData.referredBy}
              onChange={(e) => updateFormData("referredBy", e.target.value)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsuranceInformation = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>Step 2 of 9</span>
        <span>›</span>
        <span>Insurance Information</span>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Insurance Information
        </h2>
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">
          Insurance Coverage
        </h3>

        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Do you have insurance? *
          </Label>
          <RadioGroup
            value={formData.hasInsurance}
            onValueChange={(value) => updateFormData("hasInsurance", value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="insurance-yes" />
              <Label htmlFor="insurance-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="insurance-no" />
              <Label htmlFor="insurance-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {formData.hasInsurance === "no" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              No worries! We offer flexible payment options for patients without
              insurance. Our team will discuss payment plans and self-pay rates
              during your visit.
            </p>
          </div>
        )}

        {formData.hasInsurance === "yes" && (
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-4">
              Insurance Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <Label
                  htmlFor="insuranceCompanyName"
                  className="text-sm font-medium text-gray-700"
                >
                  Insurance Company Name *
                </Label>
                <Input
                  id="insuranceCompanyName"
                  value={formData.insuranceCompanyName}
                  onChange={(e) =>
                    updateFormData("insuranceCompanyName", e.target.value)
                  }
                  placeholder="e.g Blue Cross Shield Blue Cross"
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="policyholderName"
                  className="text-sm font-medium text-gray-700"
                >
                  Policyholder Name *
                </Label>
                <Input
                  id="policyholderName"
                  value={formData.policyholderName}
                  onChange={(e) =>
                    updateFormData("policyholderName", e.target.value)
                  }
                  placeholder="Name on the insurance policy"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Relationship to Patient
                </Label>
                <Select
                  value={formData.relationshipToPatient}
                  onValueChange={(value) =>
                    updateFormData("relationshipToPatient", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self">Self</SelectItem>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="memberSubscriberID"
                  className="text-sm font-medium text-gray-700"
                >
                  Member/Subscriber ID *
                </Label>
                <Input
                  id="memberSubscriberID"
                  value={formData.memberSubscriberID}
                  onChange={(e) =>
                    updateFormData("memberSubscriberID", e.target.value)
                  }
                  placeholder="Insurance member ID"
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="groupNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  Group Number
                </Label>
                <Input
                  id="groupNumber"
                  value={formData.groupNumber}
                  onChange={(e) =>
                    updateFormData("groupNumber", e.target.value)
                  }
                  placeholder="Group or policy number (if applicable)"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <h3 className="text-base font-medium text-gray-900 mb-4">
                Insurance Card Upload
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Insurance Card (Front)
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload front
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    Insurance Card (Back)
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload back
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPresentCondition = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <span>Step 3 of 9</span>
        <ChevronRight className="h-4 w-4" />
        <span>Present Condition</span>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
        Present Condition
      </h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
            Main Concern
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Main reason for visit *
              </Label>
              <Textarea
                placeholder="Please describe what brought you in today."
                value={formData.mainConcern}
                onChange={(e) => updateFormData("mainConcern", e.target.value)}
                className="min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                When did symptoms begin? *
              </Label>
              <Input
                type="date"
                value={formData.symptomStartDate}
                onChange={(e) =>
                  updateFormData("symptomStartDate", e.target.value)
                }
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Have you had this before?
              </Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hadBefore"
                    value="yes"
                    checked={formData.hadThisBefore === "yes"}
                    onChange={(e) =>
                      updateFormData("hadThisBefore", e.target.value)
                    }
                    className="text-teal-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Yes
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hadBefore"
                    value="no"
                    checked={formData.hadThisBefore === "no"}
                    onChange={(e) =>
                      updateFormData("hadThisBefore", e.target.value)
                    }
                    className="text-teal-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    No
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
            Pain Assessment
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Pain Level (0 = No Pain, 10 = Worst Pain)
              </Label>
              <div className="space-y-2">
                <Slider
                  value={[formData.painLevel || 0]}
                  onValueChange={(value) =>
                    updateFormData("painLevel", value[0])
                  }
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>0</span>
                  <span className="font-medium">
                    Current: {formData.painLevel || 0}
                  </span>
                  <span>10</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Pain characteristics (check all that apply):
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Constant",
                  "Intermittent",
                  "Sharp",
                  "Dull",
                  "Burning",
                  "Throbbing",
                  "Aching",
                  "Shooting",
                ].map((characteristic) => (
                  <label
                    key={characteristic}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      value={characteristic}
                      checked={formData.painCharacteristics.includes(
                        characteristic
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFormData("painCharacteristics", [
                            ...formData.painCharacteristics,
                            characteristic,
                          ]);
                        } else {
                          updateFormData(
                            "painCharacteristics",
                            formData.painCharacteristics.filter(
                              (c) => c !== characteristic
                            )
                          );
                        }
                      }}
                      className="text-teal-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {characteristic}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">
            Symptom Details
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                What improves it?
              </Label>
              <Textarea
                placeholder="Activities, positions, treatments that help..."
                value={formData.whatImprovesIt}
                onChange={(e) =>
                  updateFormData("whatImprovesIt", e.target.value)
                }
                className="min-h-[80px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                What worsens it?
              </Label>
              <Textarea
                placeholder="Activities, positions, treatments that make it worse..."
                value={formData.whatWorsensIt}
                onChange={(e) =>
                  updateFormData("whatWorsensIt", e.target.value)
                }
                className="min-h-[80px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                What activities are affected?
              </Label>
              <Textarea
                placeholder="Daily activities that are difficult due to your condition..."
                value={formData.activitiesAffected}
                onChange={(e) =>
                  updateFormData("activitiesAffected", e.target.value)
                }
                className="min-h-[80px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Have you seen anyone else for this?
          </Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="seenAnyoneElse"
                value="yes"
                checked={formData.seenAnyoneElse === "yes"}
                onChange={(e) =>
                  updateFormData("seenAnyoneElse", e.target.value)
                }
                className="text-teal-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Yes
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="seenAnyoneElse"
                value="no"
                checked={formData.seenAnyoneElse === "no"}
                onChange={(e) =>
                  updateFormData("seenAnyoneElse", e.target.value)
                }
                className="text-teal-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                No
              </span>
            </label>
          </div>

          {formData.seenAnyoneElse === "yes" && (
            <div className="mt-4">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Please describe who you've seen and what treatments you've
                tried:
              </Label>
              <Textarea
                placeholder="Doctors, therapists, treatments, medications..."
                value={formData.treatmentsTried}
                onChange={(e) =>
                  updateFormData("treatmentsTried", e.target.value)
                }
                className="min-h-[80px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderHealthHistory = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>Step 4 of 9</span>
        <span>›</span>
        <span>Health History</span>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Health History
        </h2>
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">
          Health Conditions
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Check all conditions that apply to you:
        </p>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            "Headaches",
            "Back Pain",
            "Neck Pain",
            "Sports Injuries",
            "Arthritis",
            "Cancer",
            "High Blood Pressure",
            "Osteoporosis",
            "Scoliosis",
            "Numbness/Tingling",
            "Diabetes",
          ].map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={condition.toLowerCase().replace(/[^a-z0-9]/g, "-")}
                checked={formData.healthConditions.includes(condition)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFormData("healthConditions", [
                      ...formData.healthConditions,
                      condition,
                    ]);
                  } else {
                    updateFormData(
                      "healthConditions",
                      formData.healthConditions.filter((c) => c !== condition)
                    );
                  }
                }}
              />
              <Label
                htmlFor={condition.toLowerCase().replace(/[^a-z0-9]/g, "-")}
                className="text-sm"
              >
                {condition}
              </Label>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <Label
            htmlFor="otherConditions"
            className="text-sm font-medium text-gray-700"
          >
            Other conditions not listed:
          </Label>
          <Textarea
            id="otherConditions"
            value={formData.otherConditions}
            onChange={(e) => updateFormData("otherConditions", e.target.value)}
            placeholder="Please specify any other health conditions..."
            rows={2}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">
          Current Medications
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          List all medications you are currently taking:
        </p>

        <Textarea
          value={formData.currentMedications}
          onChange={(e) => updateFormData("currentMedications", e.target.value)}
          placeholder="Include prescription medications, over-the-counter drugs, vitamins, and supplements..."
          rows={3}
          className="mb-6"
        />
      </div>

      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Do you take blood thinners?
        </Label>
        <RadioGroup
          value={formData.bloodThinners}
          onValueChange={(value) => updateFormData("bloodThinners", value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="blood-thinners-yes" />
            <Label htmlFor="blood-thinners-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="blood-thinners-no" />
            <Label htmlFor="blood-thinners-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">
          Surgical History
        </h3>
        <p className="text-sm text-gray-600 mb-3">Past surgeries and dates:</p>

        <Textarea
          value={formData.surgicalHistory}
          onChange={(e) => updateFormData("surgicalHistory", e.target.value)}
          placeholder="List any surgeries you've had and approximate dates..."
          rows={3}
          className="mb-6"
        />
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">Allergies</h3>
        <p className="text-sm text-gray-600 mb-3">
          Allergies (medications, foods, environmental):
        </p>

        <Textarea
          value={formData.allergies}
          onChange={(e) => updateFormData("allergies", e.target.value)}
          placeholder="List any known allergies and reactions..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderLifestyleHabits = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>Step 5 of 9</span>
        <span>›</span>
        <span>Lifestyle & Habits</span>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Lifestyle & Habits
        </h2>
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">
          Exercise & Physical Activity
        </h3>

        <div className="mb-4">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Do you exercise regularly?
          </Label>
          <RadioGroup
            value={formData.exerciseRegularly}
            onValueChange={(value) =>
              updateFormData("exerciseRegularly", value)
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="exercise-yes" />
              <Label htmlFor="exercise-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="exercise-no" />
              <Label htmlFor="exercise-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            What type of work do you do?
          </Label>
          <RadioGroup
            value={formData.workType}
            onValueChange={(value) => updateFormData("workType", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mostly-sitting" id="mostly-sitting" />
              <Label htmlFor="mostly-sitting">Mostly sitting (desk job)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mostly-standing" id="mostly-standing" />
              <Label htmlFor="mostly-standing">Mostly standing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="physical-labor" id="physical-labor" />
              <Label htmlFor="physical-labor">Physical labor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mixed-activities" id="mixed-activities" />
              <Label htmlFor="mixed-activities">Mixed activities</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mb-4">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Sleep Quality:
          </Label>
          <RadioGroup
            value={formData.sleepQuality}
            onValueChange={(value) => updateFormData("sleepQuality", value)}
            className="flex items-center gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="poor" id="sleep-poor" />
              <Label htmlFor="sleep-poor">Poor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fair" id="sleep-fair" />
              <Label htmlFor="sleep-fair">Fair</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="good" id="sleep-good" />
              <Label htmlFor="sleep-good">Good</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mb-6">
          <Label
            htmlFor="sleepSupports"
            className="text-sm font-medium text-gray-700"
          >
            Do you use pillows or sleep supports?
          </Label>
          <Textarea
            id="sleepSupports"
            value={formData.sleepSupports}
            onChange={(e) => updateFormData("sleepSupports", e.target.value)}
            placeholder="Describe any pillows, wedges, or supports you use while sleeping..."
            rows={2}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">
          Substance Use
        </h3>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Tobacco Use:
            </Label>
            <RadioGroup
              value={formData.tobaccoUse}
              onValueChange={(value) => updateFormData("tobaccoUse", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="tobacco-yes" />
                <Label htmlFor="tobacco-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="tobacco-no" />
                <Label htmlFor="tobacco-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Alcohol Use:
            </Label>
            <RadioGroup
              value={formData.alcoholUse}
              onValueChange={(value) => updateFormData("alcoholUse", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="alcohol-yes" />
                <Label htmlFor="alcohol-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="alcohol-no" />
                <Label htmlFor="alcohol-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Recreational Drug Use:
            </Label>
            <RadioGroup
              value={formData.recreationalDrugUse}
              onValueChange={(value) =>
                updateFormData("recreationalDrugUse", value)
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="drugs-yes" />
                <Label htmlFor="drugs-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="drugs-no" />
                <Label htmlFor="drugs-no">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );

  const renderForWomen = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>Step 6 of 9</span>
        <span>›</span>
        <span>For Women</span>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">For Women</h2>
        <p className="text-sm text-gray-600 mb-6">Women's Health Information</p>
      </div>

      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Are you currently pregnant?
        </Label>
        <RadioGroup
          value={formData.currentlyPregnant}
          onValueChange={(value) => updateFormData("currentlyPregnant", value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="pregnant-yes" />
            <Label htmlFor="pregnant-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="pregnant-no" />
            <Label htmlFor="pregnant-no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unsure" id="pregnant-unsure" />
            <Label htmlFor="pregnant-unsure">Unsure</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <div>
          <Label
            htmlFor="menstrualCycleInfo"
            className="text-sm font-medium text-gray-700"
          >
            Menstrual Cycle Information
          </Label>
          <Textarea
            id="menstrualCycleInfo"
            value={formData.menstrualCycleInfo}
            onChange={(e) =>
              updateFormData("menstrualCycleInfo", e.target.value)
            }
            placeholder="Regular/Irregular, cycle length, last period, etc."
            rows={2}
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="pmsSymptoms"
            className="text-sm font-medium text-gray-700"
          >
            PMS Symptoms
          </Label>
          <Textarea
            id="pmsSymptoms"
            value={formData.pmsSymptoms}
            onChange={(e) => updateFormData("pmsSymptoms", e.target.value)}
            placeholder="Describe any PMS-related symptoms you experience"
            rows={2}
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="hormonalSymptoms"
            className="text-sm font-medium text-gray-700"
          >
            Hormonal Symptoms
          </Label>
          <Textarea
            id="hormonalSymptoms"
            value={formData.hormonalSymptoms}
            onChange={(e) => updateFormData("hormonalSymptoms", e.target.value)}
            placeholder="Hot flashes, mood changes, sleep disturbances, etc."
            rows={2}
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="posturalSymptoms"
            className="text-sm font-medium text-gray-700"
          >
            Postural Symptoms
          </Label>
          <Textarea
            id="posturalSymptoms"
            value={formData.posturalSymptoms}
            onChange={(e) => updateFormData("posturalSymptoms", e.target.value)}
            placeholder="Back pain, posture changes, joint pain, etc."
            rows={2}
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="birthControl"
            className="text-sm font-medium text-gray-700"
          >
            Birth Control
          </Label>
          <Textarea
            id="birthControl"
            value={formData.birthControl}
            onChange={(e) => updateFormData("birthControl", e.target.value)}
            placeholder="Type of birth control used, if any"
            rows={2}
            className="mt-1"
          />
        </div>

        <div>
          <Label
            htmlFor="pregnancyHistory"
            className="text-sm font-medium text-gray-700"
          >
            Pregnancy History
          </Label>
          <Textarea
            id="pregnancyHistory"
            value={formData.pregnancyHistory}
            onChange={(e) => updateFormData("pregnancyHistory", e.target.value)}
            placeholder="Number of pregnancies, births, complications, etc."
            rows={2}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );

  const renderConsentLegal = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>Step 7 of 9</span>
        <span>›</span>
        <span>Consent & Legal</span>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Consent & Legal
        </h2>
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">
          Patient Acknowledgment
        </h3>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="informationComplete"
                checked={formData.informationComplete}
                onCheckedChange={(checked) =>
                  updateFormData("informationComplete", checked)
                }
                className="mt-1"
              />
              <Label
                htmlFor="informationComplete"
                className="text-sm leading-relaxed"
              >
                I confirm that the information I have provided above is complete
                and accurate to the best of my knowledge.
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="consentToTreatment"
                checked={formData.consentToTreatment}
                onCheckedChange={(checked) =>
                  updateFormData("consentToTreatment", checked)
                }
                className="mt-1"
              />
              <Label
                htmlFor="consentToTreatment"
                className="text-sm leading-relaxed"
              >
                I consent to chiropractic/dental evaluation and treatment by the
                licensed healthcare provider.
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="physicalExamination"
                checked={formData.physicalExamination}
                onCheckedChange={(checked) =>
                  updateFormData("physicalExamination", checked)
                }
                className="mt-1"
              />
              <Label
                htmlFor="physicalExamination"
                className="text-sm leading-relaxed"
              >
                I understand that this evaluation and treatment may involve
                physical touch and examination.
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacyPolicies"
                checked={formData.privacyPolicies}
                onCheckedChange={(checked) =>
                  updateFormData("privacyPolicies", checked)
                }
                className="mt-1"
              />
              <Label
                htmlFor="privacyPolicies"
                className="text-sm leading-relaxed"
              >
                I have read and agree to the clinic's Privacy, Financial, and
                HIPAA Policies.
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">
          Digital Signature
        </h3>

        <div className="mb-4">
          <Input
            value={formData.digitalSignature}
            onChange={(e) => updateFormData("digitalSignature", e.target.value)}
            placeholder="Type your full legal name as your digital signature"
            className="text-lg"
          />
        </div>

        <p className="text-sm text-gray-600">
          By typing your name above, you are providing your digital signature
          and agreeing to all terms.
        </p>
      </div>
    </div>
  );

  const renderUploads = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>Step 8 of 9</span>
        <span>›</span>
        <span>Uploads</span>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Consent & Legal
        </h2>
      </div>

      <div>
        <h3 className="text-base font-medium text-gray-900 mb-4">
          Document Uploads
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Upload ID (Front)
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Click to upload</p>
                <p className="text-xs text-gray-500 mb-2">
                  Drag & drop or click to select
                </p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Driver's license, passport, or other government-issued ID
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Upload ID (Back)
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Click to upload</p>
                <p className="text-xs text-gray-500 mb-2">
                  Drag & drop or click to select
                </p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Upload X-rays or Scans
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Click to upload</p>
              <p className="text-xs text-gray-500 mb-2">
                Drag & drop or click to select
              </p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Any recent X-rays, MRIs, CT scans, or other imaging studies
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Upload Medical/Dental Records
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Click to upload</p>
              <p className="text-xs text-gray-500 mb-2">
                Drag & drop or click to select
              </p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Previous treatment records, lab results, or other relevant medical
              documents
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Other Documents
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Click to upload</p>
              <p className="text-xs text-gray-500 mb-2">
                Drag & drop or click to select
              </p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Any other relevant documents or forms
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h4 className="font-medium text-blue-900 mb-2">Upload Guidelines</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Accepted file types: Images (JPG, PNG), PDFs, Word documents
            </li>
            <li>• Maximum file size: 10MB per file</li>
            <li>• All uploads are securely encrypted and HIPAA compliant</li>
            <li>
              • You can upload documents now or bring them to your appointment
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderReviewComplete = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>Step 9 of 9</span>
        <span>›</span>
        <span>Review & Complete</span>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Review & Complete
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Please review your information below. Click Submit to finalize when
          ready.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Personal Information
            </h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Full Name:</span>
                <span>{formData.fullName || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Preferred Name:</span>
                <span>{formData.preferredName || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date of Birth:</span>
                <span>{formData.dateOfBirth || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span>{formData.gender || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span>{formData.emailAddress || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span>{formData.phoneNumber || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Address:</span>
                <span>{formData.streetAddress || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Emergency Contact:</span>
                <span>{formData.emergencyContactName || "Not provided"}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Insurance Information
            </h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Has Insurance:</span>
                <span>
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
                    <span className="text-gray-600">Insurance Company:</span>
                    <span>
                      {formData.insuranceCompanyName || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Policyholder:</span>
                    <span>{formData.policyholderName || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member ID:</span>
                    <span>{formData.memberSubscriberID || "Not provided"}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Present Condition
            </h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Main Reason for Visit:</span>
                <span>
                  {formData.mainConcern ? "Provided" : "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Symptom Start:</span>
                <span>{formData.symptomStartDate || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pain Level:</span>
                <span>{formData.painLevel[0]}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Had Before:</span>
                <span>
                  {formData.hadThisBefore === "yes"
                    ? "Yes"
                    : formData.hadThisBefore === "no"
                    ? "No"
                    : "Not provided"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Health History</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Blood Thinners:</span>
                <span>
                  {formData.bloodThinners === "yes"
                    ? "Yes"
                    : formData.bloodThinners === "no"
                    ? "No"
                    : "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Medications:</span>
                <span>
                  {formData.currentMedications ? "Provided" : "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Past Surgeries:</span>
                <span>
                  {formData.surgicalHistory ? "Provided" : "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Allergies:</span>
                <span>{formData.allergies ? "Provided" : "Not provided"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Lifestyle & Habits
            </h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Exercise Regularly:</span>
                <span>
                  {formData.exerciseRegularly === "yes"
                    ? "Yes"
                    : formData.exerciseRegularly === "no"
                    ? "No"
                    : "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Work Type:</span>
                <span>{formData.workType || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sleep Quality:</span>
                <span>{formData.sleepQuality || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tobacco Use:</span>
                <span>
                  {formData.tobaccoUse === "yes"
                    ? "Yes"
                    : formData.tobaccoUse === "no"
                    ? "No"
                    : "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Alcohol Use:</span>
                <span>
                  {formData.alcoholUse === "yes"
                    ? "Yes"
                    : formData.alcoholUse === "no"
                    ? "No"
                    : "Not provided"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">For Women</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Currently Pregnant:</span>
                <span>{formData.currentlyPregnant || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Menstrual Info:</span>
                <span>
                  {formData.menstrualCycleInfo ? "Provided" : "Not provided"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Birth Control:</span>
                <span>
                  {formData.birthControl ? "Provided" : "Not provided"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Consent & Legal</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Information Confirmed:</span>
                <span>{formData.informationComplete ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Treatment Consent:</span>
                <span>{formData.consentToTreatment ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Privacy Agreed:</span>
                <span>{formData.privacyPolicies ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Digital Signature:</span>
                <span>{formData.digitalSignature || "Not provided"}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Document Uploads</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Upload ID (Front):</span>
                <span>Not uploaded</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Upload ID (Back):</span>
                <span>Not uploaded</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">X-rays/Scans:</span>
                <span>Not uploaded</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Medical Records:</span>
                <span>Not uploaded</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8 text-center">
        {/* Icon on top */}
        <div className="flex justify-center mb-3">
          <LuCircleCheckBig className="h-12 w-12 text-green-500" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Onboarding Complete!
        </h3>

        {/* Description */}
        <p className="text-green-700 mb-4 max-w-md mx-auto">
          You've successfully filled out all required sections. Click below to
          submit your information and book your patient onboard.
        </p>

        {/* Button */}
        <Button
          onClick={handleComplete}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInformation();
      case 2:
        return renderInsuranceInformation();
      case 3:
        return renderPresentCondition();
      case 4:
        return renderHealthHistory();
      case 5:
        return renderLifestyleHabits();
      case 6:
        return renderForWomen();
      case 7:
        return renderConsentLegal();
      case 8:
        return renderUploads();
      case 9:
        return renderReviewComplete();
      default:
        return <div>Step {currentStep} content coming soon...</div>;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Patient Onboarding
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {getProgressPercentage()}% Complete
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-teal-600 dark:bg-teal-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-80 bg-white dark:bg-gray-800 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 min-h-[calc(100vh-97px)] md:min-h-0 p-4 md:p-6">

            <nav className="space-y-1 sticky top-6">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    step.id === currentStep
                      ? "bg-teal-600 text-white"
                      : completedSteps.includes(step.id)
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                      step.id === currentStep
                        ? "bg-white text-teal-600"
                        : completedSteps.includes(step.id)
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {completedSteps.includes(step.id) ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white dark:bg-gray-800">
            <div className="p-6 md:p-8">
              {renderCurrentStep()}

              <div className="flex justify-end pt-6 md:pt-8 mt-6 md:mt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={
                      currentStep === steps.length ? handleComplete : nextStep
                    }
                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    Next
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
