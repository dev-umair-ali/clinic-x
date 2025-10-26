"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Upload, Check, ChevronLeft, ChevronRight } from "lucide-react"

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
]

export default function PatientOnboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
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
    email: "",
    phone: "",
    preferredContact: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    occupation: "",
    language: "",
    referredBy: "",
    // Insurance
    hasInsurance: "yes",
    insuranceCompany: "",
    policyholderName: "",
    relationshipToPatient: "",
    memberId: "",
    groupNumber: "",
    // Present Condition
    mainConcern: "",
    symptomOnset: "",
    hadBefore: "",
    painLevel: [5],
    painCharacteristics: [],
    symptomsImprove: "",
    symptomsWorsen: "",
    activitiesAffected: "",
    seekingTreatment: "",
    treatmentDescription: "",
    // Health History
    healthConditions: [],
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
    recreationalDrugs: "",
    // For Women
    pregnant: "",
    menstrualCycle: "",
    pmsSymptoms: "",
    hormonalSymptoms: "",
    posturalSymptoms: "",
    birthControl: "",
    pregnancyHistory: "",
    // Consent & Legal
    informationAccurate: false,
    consentTreatment: false,
    physicalExamination: false,
    privacyPolicy: false,
    digitalSignature: "",
  })

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCompletedSteps((prev) => [...prev, currentStep])
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getProgressPercentage = () => {
    return Math.round((completedSteps.length / steps.length) * 100)
  }

  const renderPersonalInformation = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Personal Information</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Step 1 of 9 • Personal Information</p>
      </div>
      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="Enter your full legal name"
              value={formData.fullName}
              onChange={(e) => updateFormData("fullName", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="preferredName">Preferred Name</Label>
            <Input
              id="preferredName"
              placeholder="What would you like to be called"
              value={formData.preferredName}
              onChange={(e) => updateFormData("preferredName", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Address</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              id="streetAddress"
              placeholder="123 Main Street"
              value={formData.streetAddress}
              onChange={(e) => updateFormData("streetAddress", e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="City"
                value={formData.city}
                onChange={(e) => updateFormData("city", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="State"
                value={formData.state}
                onChange={(e) => updateFormData("state", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="ZIP Code"
                value={formData.zipCode}
                onChange={(e) => updateFormData("zipCode", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Contact Information</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@example.com"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => updateFormData("phone", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="preferredContact">Preferred Contact Method</Label>
          <Select
            value={formData.preferredContact}
            onValueChange={(value) => updateFormData("preferredContact", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="How would you like us to contact you" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="text">Text Message</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="emergencyName">Emergency Contact Name</Label>
            <Input
              id="emergencyName"
              placeholder="Parent Name"
              value={formData.emergencyName}
              onChange={(e) => updateFormData("emergencyName", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
            <Input
              id="emergencyPhone"
              placeholder="(555) 123-4567"
              value={formData.emergencyPhone}
              onChange={(e) => updateFormData("emergencyPhone", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="emergencyRelation">Relationship to Patient</Label>
          <Select
            value={formData.emergencyRelation}
            onValueChange={(value) => updateFormData("emergencyRelation", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="How would you like us to contact you" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="spouse">Spouse</SelectItem>
              <SelectItem value="sibling">Sibling</SelectItem>
              <SelectItem value="friend">Friend</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Additional Information</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              placeholder="Your Job Title or Profession"
              value={formData.occupation}
              onChange={(e) => updateFormData("occupation", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="language">Primary Language</Label>
            <Select value={formData.language} onValueChange={(value) => updateFormData("language", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="referredBy">Referred By (Optional)</Label>
          <Input
            id="referredBy"
            placeholder="Who referred you to our practice?"
            value={formData.referredBy}
            onChange={(e) => updateFormData("referredBy", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  )

  const renderInsuranceInformation = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Insurance Information</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Step 2 of 9 • Insurance Information</p>
      </div>
      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Insurance Coverage</h3>
        <div className="mb-4">
          <Label className="text-sm font-medium">Do you have insurance? *</Label>
          <RadioGroup
            value={formData.hasInsurance}
            onValueChange={(value) => updateFormData("hasInsurance", value)}
            className="flex gap-6 mt-2"
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
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              No worries! We offer flexible payment options for patients without insurance. Our team will discuss
              payment plans and self-pay rates during your visit.
            </p>
          </div>
        )}
        {formData.hasInsurance === "yes" && (
          <>
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Insurance Details</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="insuranceCompany">Insurance Company Name *</Label>
                  <Input
                    id="insuranceCompany"
                    placeholder="e.g Blue Cross Shield Blue Cross"
                    value={formData.insuranceCompany}
                    onChange={(e) => updateFormData("insuranceCompany", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="policyholderName">Policyholder Name *</Label>
                  <Input
                    id="policyholderName"
                    placeholder="Name on the insurance policy"
                    value={formData.policyholderName}
                    onChange={(e) => updateFormData("policyholderName", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="relationshipToPatient">Relationship to Patient</Label>
                  <Select
                    value={formData.relationshipToPatient}
                    onValueChange={(value) => updateFormData("relationshipToPatient", value)}
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
                  <Label htmlFor="memberId">Member/Subscriber ID *</Label>
                  <Input
                    id="memberId"
                    placeholder="Insurance member ID"
                    value={formData.memberId}
                    onChange={(e) => updateFormData("memberId", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="groupNumber">Group Number</Label>
                  <Input
                    id="groupNumber"
                    placeholder="Group or policy number (if applicable)"
                    value={formData.groupNumber}
                    onChange={(e) => updateFormData("groupNumber", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Insurance Card Upload</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Insurance Card (Front)</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload front</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Drag & drop or click to select</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Insurance Card (Back)</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload back</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Drag & drop or click to select</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )

  const renderPresentCondition = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Present Condition</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Step 3 of 9 • Present Condition</p>
      </div>
      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Main Concern</h3>
        <div className="mb-4">
          <Label htmlFor="mainConcern">Main reason for visit *</Label>
          <Textarea
            id="mainConcern"
            placeholder="Please describe what brought you in today..."
            value={formData.mainConcern}
            onChange={(e) => updateFormData("mainConcern", e.target.value)}
            className="mt-1 min-h-[100px]"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="symptomOnset">When did symptoms begin? *</Label>
          <Input
            id="symptomOnset"
            placeholder="Select Date"
            value={formData.symptomOnset}
            onChange={(e) => updateFormData("symptomOnset", e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="mb-4">
          <Label className="text-sm font-medium">Have you had this before?</Label>
          <RadioGroup
            value={formData.hadBefore}
            onValueChange={(value) => updateFormData("hadBefore", value)}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="had-before-yes" />
              <Label htmlFor="had-before-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="had-before-no" />
              <Label htmlFor="had-before-no">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Pain Assessment</h3>
        <div className="mb-6">
          <Label className="text-sm font-medium">Pain Level (0 = No Pain, 10 = Worst Pain)</Label>
          <div className="mt-4 px-4">
            <Slider
              value={formData.painLevel}
              onValueChange={(value) => updateFormData("painLevel", value)}
              max={10}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>0</span>
              <span className="font-medium text-lg text-gray-900 dark:text-white">{formData.painLevel[0]}</span>
              <span>10</span>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <Label className="text-sm font-medium mb-3 block">Pain characteristics (check all that apply):</Label>
          <div className="grid grid-cols-4 gap-3">
            {["Constant", "Intermittent", "Sharp", "Dull", "Burning", "Throbbing", "Aching", "Shooting"].map(
              (characteristic) => (
                <div key={characteristic} className="flex items-center space-x-2">
                  <Checkbox
                    id={characteristic.toLowerCase()}
                    checked={formData.painCharacteristics.includes(characteristic)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFormData("painCharacteristics", [...formData.painCharacteristics, characteristic])
                      } else {
                        updateFormData(
                          "painCharacteristics",
                          formData.painCharacteristics.filter((c) => c !== characteristic),
                        )
                      }
                    }}
                  />
                  <Label htmlFor={characteristic.toLowerCase()} className="text-sm">
                    {characteristic}
                  </Label>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Symptom Details</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="symptomsImprove">What improves it?</Label>
            <Textarea
              id="symptomsImprove"
              placeholder="Activities, positions, treatments that help..."
              value={formData.symptomsImprove}
              onChange={(e) => updateFormData("symptomsImprove", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="symptomsWorsen">What worsens it?</Label>
            <Textarea
              id="symptomsWorsen"
              placeholder="Activities, positions, treatments that make it worse..."
              value={formData.symptomsWorsen}
              onChange={(e) => updateFormData("symptomsWorsen", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="activitiesAffected">What activities are affected?</Label>
            <Textarea
              id="activitiesAffected"
              placeholder="Daily activities that are difficult due to your condition..."
              value={formData.activitiesAffected}
              onChange={(e) => updateFormData("activitiesAffected", e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>
      <div>
        <div className="mb-4">
          <Label className="text-sm font-medium">Have you seen anyone else for this?</Label>
          <RadioGroup
            value={formData.seekingTreatment}
            onValueChange={(value) => updateFormData("seekingTreatment", value)}
            className="flex gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="seeking-yes" />
              <Label htmlFor="seeking-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="seeking-no" />
              <Label htmlFor="seeking-no">No</Label>
            </div>
          </RadioGroup>
        </div>
        {formData.seekingTreatment === "yes" && (
          <div>
            <Label htmlFor="treatmentDescription">
              Please describe who you've seen and what treatments you've tried:
            </Label>
            <Textarea
              id="treatmentDescription"
              placeholder="Doctors, therapists, treatments, medications..."
              value={formData.treatmentDescription}
              onChange={(e) => updateFormData("treatmentDescription", e.target.value)}
              className="mt-1"
            />
          </div>
        )}
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInformation()
      case 2:
        return renderInsuranceInformation()
      case 3:
        return renderPresentCondition()
      default:
        return <div>Step {currentStep} content coming soon...</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Patient Onboarding</h1>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${getProgressPercentage()}%`,
                  background: "linear-gradient(244.21deg, #5EC9BD 1.48%, #2C7F75 98.52%)",
                }}
              />
            </div>
            <span className="ml-4 text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {getProgressPercentage()}% Complete
            </span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <nav className="space-y-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      step.id === currentStep
                        ? "bg-teal-500 text-white"
                        : completedSteps.includes(step.id)
                          ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                        step.id === currentStep
                          ? "bg-white text-teal-500"
                          : completedSteps.includes(step.id)
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {completedSteps.includes(step.id) ? <Check className="h-3 w-3" /> : step.id}
                    </div>
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                ))}
              </nav>
            </div>
          </div>
          {/* Main Content */}
          <div className="col-span-9">
            <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
              <CardContent className="p-8">
                {renderCurrentStep()}
                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={currentStep === steps.length}
                    className="flex items-center gap-2"
                    style={{
                      background: "linear-gradient(244.21deg, #5EC9BD 1.48%, #2C7F75 98.52%)",
                    }}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
