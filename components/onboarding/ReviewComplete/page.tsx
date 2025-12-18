"use client";
import { LuCircleCheckBig } from "react-icons/lu";
import { Button } from "@/components/ui/button";

export default function ReviewComplete({
  formData,
  onSubmit,
}: {
  formData: any;
  onSubmit: () => void;
}) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Review & Complete
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        Please review your information below. Click Submit to finalize when
        ready.
      </p>

      <div className="grid grid-cols-2 gap-8">
        {/* Left column */}
        <div className="space-y-6">
          {/* Personal */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
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

          {/* Insurance */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Insurance Information</h4>
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
                    <span>{formData.insuranceCompanyName || "Not provided"}</span>
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

          {/* Present Condition */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Present Condition</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Main Reason for Visit:</span>
                <span>{formData.mainConcern ? "Provided" : "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Symptom Start:</span>
                <span>{formData.symptomStartDate || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pain Level:</span>
                <span>{formData.painLevel}/10</span>
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

          {/* Health History */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Health History</h4>
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
                <span>{formData.currentMedications ? "Provided" : "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Past Surgeries:</span>
                <span>{formData.surgicalHistory ? "Provided" : "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Allergies:</span>
                <span>{formData.allergies ? "Provided" : "Not provided"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Lifestyle */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Lifestyle & Habits</h4>
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

          {/* For Women */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">For Women</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Currently Pregnant:</span>
                <span>{formData.currentlyPregnant || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Menstrual Info:</span>
                <span>{formData.menstrualCycleInfo ? "Provided" : "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Birth Control:</span>
                <span>{formData.birthControl ? "Provided" : "Not provided"}</span>
              </div>
            </div>
          </div>

          {/* Consent */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Consent & Legal</h4>
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

          {/* Uploads */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Document Uploads</h4>
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
        <div className="flex justify-center mb-3">
          <LuCircleCheckBig className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Onboarding Complete!
        </h3>
        <p className="text-green-700 mb-4 max-w-md mx-auto">
          You&apos;ve successfully filled out all required sections. Click below to
          submit your information and book your patient onboard.
        </p>
        <Button
          onClick={onSubmit}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}