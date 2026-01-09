"use client"

import { Calendar, CreditCard, FileText, User } from "lucide-react"
import { FaRegHeart } from "react-icons/fa"
import { FiMoon, FiTool } from "react-icons/fi"
import { GoAlert, GoDotFill } from "react-icons/go"
import { IoMdCheckmark } from "react-icons/io"
import { IoShieldOutline } from "react-icons/io5"

import { LuDumbbell } from "react-icons/lu"
import { MdChildCare } from "react-icons/md"
import { RiScissorsFill } from "react-icons/ri"
import { RxCross2 } from "react-icons/rx"

import { Badge } from "@/components/doctor-charts/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/doctor-charts/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/doctor-charts/tabs"
import { Button } from "@/components/doctor-charts/button"

const sections = [
  {
    id: "medical-history",
    name: "Medical History",
    tagline: "Comprehensive medical background and conditions",
  },
  {
    id: "dental-history",
    name: "Dental History",
    tagline: "Dental care history, symptoms, and treatments",
  },
  {
    id: "insurance-info",
    name: "Insurance Info",
    tagline: "Medical, dental, and chiropractic insurance details",
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    tagline: "Sleep, exercise, substance use, and occupational factors",
  },
  {
    id: "consent-legal",
    name: "Consent & Legal",
    tagline: "Legal documents, consent forms, and digital signatures",
  },
  {
    id: "uploads-documents",
    name: "Uploads & Documents",
    tagline: "Patient documents, scans, and medical records",
  },
]

function PatientInfo({ patient }: { patient?: any }) {
  if (!patient) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        {patient.avatar ? (
          <img src={patient.avatar} alt={patient.name} className="w-full h-full object-cover" />
        ) : (
          <img src="/patient-profile.png" alt={patient.name} className="w-full h-full object-cover" />
        )}
      </div>
      <div>
        <h1 className="text-lg font-semibold text-foreground">{patient.name || 'Unknown Patient'}</h1>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>Patient ID: {patient.patientId || 'N/A'}</span>
        </div>
      </div>
    </div>
  )
}

// Sections content component
function SectionsContent({
  activeTab,
  setActiveTab,
  patient,
  patientForms,
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
  patient?: any
  patientForms?: any
}) {
  console.log('📄 SectionsContent loaded with patient:', patient);
  console.log('📄 Patient forms:', patientForms);

  return (
    <div className="pt-4 border rounded-2xl border-border bg-card">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-border px-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto p-0 bg-transparent -mb-px">
            {sections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className={`w-full border-b-2 px-1 py-2 lg:py-3 text-center text-sm font-medium whitespace-nowrap rounded-none
                  data-[state=active]:border-[#1DA68F] data-[state=active]:text-[#1DA68F] data-[state=active]:bg-[#1DA68F]/10 data-[state=active]:font-semibold
                  data-[state=inactive]:border-transparent data-[state=inactive]:text-foreground hover:border-border hover:text-muted-foreground`}
              >
                {section.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="mt-0">
            <div className="pt-4 px-6 pb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-1">{section.name}</h2>
                  <p className="text-sm text-muted-foreground italic">{section.tagline}</p>
                </div>
                <PatientInfo patient={patient} />
              </div>
              {/* Tab Content */}
              {section.id === "medical-history" && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Left column - smaller */}
                    <MedicalHistoryLeftColumn patientForms={patientForms} />
                  </div>
                  <div className="lg:col-span-3 space-y-6">
                    {/* Right column - bigger */}
                    <MedicalHistoryRightColumn patientForms={patientForms} />
                  </div>
                </div>
              )}
              {section.id === "dental-history" && <DentalHistoryTab patientForms={patientForms} />}
              {section.id === "insurance-info" && <InsuranceInfoTab patientForms={patientForms} />}
              {section.id === "lifestyle" && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <LifestyleLeftColumn patientForms={patientForms} />
                  </div>
                  <div className="lg:col-span-3 space-y-6">
                    <LifestyleRightColumn patientForms={patientForms} />
                  </div>
                </div>
              )}
              {section.id === "consent-legal" && <ConsentLegalTab patientForms={patientForms} />}
              {section.id === "uploads-documents" && <UploadsDocumentsTab patientForms={patientForms} />}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function MedicalHistoryLeftColumn({ patientForms }: { patientForms?: any }) {
  // Backend getAllFormsForPatient returns: history (array), medicalProfile
  const healthHistory = patientForms?.history?.[0]; // Get first history entry
  const medicalProfile = patientForms?.medicalProfile;
  
  console.log('🏥 Medical History Left - Forms:', { history: patientForms?.history, medicalProfile: patientForms?.medicalProfile });
  
  const allergies = healthHistory?.allergies || '';
  const bloodThinner = healthHistory?.bloodThinner;
  const primaryCarePhysician = medicalProfile?.primaryCarePhysician || '';
  const additionalNotes = medicalProfile?.additionalNotes || healthHistory?.notListed || '';

  // Parse allergies - split by comma or semicolon
  const allergyList = allergies ? allergies.split(/[,;]/).map((a: string) => a.trim()).filter((a: string) => a) : [];

  return (
    <div className="space-y-6">
      {/* Critical Allergies */}
      <Card className="border border-border bg-red-50 dark:bg-red-900/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-red-800 dark:text-red-300">
            <GoAlert className="w-5 h-5" />
            CRITICAL ALLERGIES
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {allergyList.length > 0 ? (
            allergyList.map((allergy: string, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <span className="font-medium text-red-800 dark:text-red-300">{allergy}</span>
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300">
                  Critical
                </Badge>
              </div>
            ))
          ) : (
            <div className="p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <p className="text-sm text-muted-foreground">No allergies reported</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Primary Care Information */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
            <User className="w-5 h-5" />
            Primary Care Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Primary Care Physician</p>
            <p className="font-semibold text-foreground">
              {primaryCarePhysician || 'Not provided'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Blood Thinner Use</p>
            <p className="font-medium text-foreground">
              {bloodThinner ? 'Yes - Currently Taking' : bloodThinner === false ? 'No' : 'Not specified'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      {additionalNotes && (
        <Card className="border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
              <FaRegHeart className="w-5 h-5" />
              Additional Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {additionalNotes}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function MedicalHistoryRightColumn({ patientForms }: { patientForms?: any }) {
  // Backend getAllFormsForPatient returns: history (array)
  const healthHistory = patientForms?.history?.[0]; // Get first history entry
  
  console.log('🏥 Medical History Right - Forms:', { history: patientForms?.history });
  
  const healthConditions = healthHistory?.healthCondition || [];
  const currentMedications = healthHistory?.currentMedication || '';
  const surgicalHistory = healthHistory?.pastSurgeryAndDate || '';

  // Parse medications - split by newline, comma, or semicolon
  const medicationList = currentMedications ? 
    currentMedications.split(/[\n,;]/).map((m: string) => m.trim()).filter((m: string) => m) : [];

  return (
    <div className="space-y-6">
      {/* Medical Conditions */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
            <FaRegHeart className="w-5 h-5" />
            Medical Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {healthConditions.length > 0 ? (
              healthConditions.map((condition: string, index: number) => (
                <Badge key={index} className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  {condition}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No medical conditions reported</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Medications */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
            <GoAlert className="w-5 h-5" />
            Current Medications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {medicationList.length > 0 ? (
              medicationList.map((medication: string, index: number) => (
                <Badge key={index} className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  {medication}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No current medications reported</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Surgical History */}
      {surgicalHistory && (
        <Card className="border border-border bg-card text-card-foreground rounded-lg shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium">
              <RiScissorsFill className="w-5 h-5" />
              Surgical History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-md bg-muted/50">
              <p className="text-sm text-foreground whitespace-pre-wrap">{surgicalHistory}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function DentalHistoryTab({ patientForms }: { patientForms?: any }) {
  // Backend getAllFormsForPatient returns: dentalHistory
  const dental = patientForms?.dentalHistory;
  
  console.log('🦷 Dental History - Forms:', { dentalHistory: dental });

  // Parse symptoms from dental form
  const symptoms = dental?.dentalSymptoms 
    ? dental.dentalSymptoms.split(/[,;]/).map((s: string) => s.trim()).filter(Boolean) 
    : [];

  // Parse treatments from dental form
  const treatments = dental?.dentalTreatments 
    ? dental.dentalTreatments.split(/[,;]/).map((t: string) => t.trim()).filter(Boolean) 
    : [];

  // Parse devices from dental form
  const devices = dental?.dentalDevices 
    ? dental.dentalDevices.split(/[,;]/).map((d: string) => d.trim()).filter(Boolean) 
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Smaller width (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Last Dental Visit */}
          <Card className="border border-border bg-teal-50 dark:bg-teal-900/10">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                <Calendar className="w-5 h-5" />
                Last Dental Visit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
                <p className="text-2xl font-bold text-foreground">
                  {dental?.lastDentalVisit || 'Not provided'}
                </p>
                {dental?.lastDentalVisit && (
                  <p className="text-sm text-muted-foreground">Last visit date</p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Dental Anxiety</p>
                  {dental?.dentalAnxiety ? (
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300">
                      {dental.dentalAnxiety}
                    </Badge>
                  ) : (
                    <p className="text-sm text-foreground">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Smoking</p>
                  {dental?.smoking !== undefined ? (
                    <Badge className={dental.smoking ? "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300" : "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300"}>
                      {dental.smoking ? 'Yes' : 'No'}
                    </Badge>
                  ) : (
                    <p className="text-sm text-foreground">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Vaping</p>
                  {dental?.vaping !== undefined ? (
                    <Badge className={dental.vaping ? "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300" : "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300"}>
                      {dental.vaping ? 'Yes' : 'No'}
                    </Badge>
                  ) : (
                    <p className="text-sm text-foreground">Not provided</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Larger width (3 columns) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Current Symptoms */}
          <Card className="border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                <GoAlert className="w-5 h-5" />
                Current Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent>
              {symptoms.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom: string, index: number) => (
                    <Badge key={index} className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No dental symptoms reported</p>
              )}
            </CardContent>
          </Card>

          {/* Treatments Received */}
          <Card className="border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                <FiTool className="w-5 h-5" />
                Treatments Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              {treatments.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {treatments.map((treatment: string, index: number) => (
                    <Badge key={index} className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                      {treatment}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No dental treatments recorded</p>
              )}
            </CardContent>
          </Card>

          {/* Devices & Equipment */}
          <Card className="border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                <FiMoon className="w-5 h-5" />
                Devices & Equipment
              </CardTitle>
            </CardHeader>
            <CardContent>
              {devices.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {devices.map((device: string, index: number) => (
                    <Badge key={index} className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                      {device}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No dental devices or equipment</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function LifestyleLeftColumn({ patientForms }: { patientForms?: any }) {
  // Backend getAllFormsForPatient returns: lifeStyle
  const lifestyle = patientForms?.lifeStyle;
  
  console.log('🏃 Lifestyle Left - Forms:', { lifeStyle: lifestyle });
  
  const sleepQuality = lifestyle?.sleepQuality || '';
  const pillows = lifestyle?.pillows || '';
  const exercise = lifestyle?.exercise;
  const work = lifestyle?.work || '';

  return (
    <div className="space-y-6">
      {/* Sleep & Rest */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
            <FiMoon className="w-5 h-5" />
            Sleep & Rest
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-foreground mb-2">Sleep Quality</p>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
              {sleepQuality || 'Not specified'}
            </Badge>
          </div>
          {pillows && (
            <div className="bg-muted/50 p-3 rounded-lg space-y-2">
              <p className="font-medium text-sm text-foreground">Sleep Setup</p>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>
                  Pillow/Support: <span className="font-medium text-foreground">{pillows}</span>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exercise & Activity */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
            <LuDumbbell className="w-5 h-5" />
            Exercise & Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-foreground mb-2">Regular Exercise</p>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
              {exercise === true ? 'Yes' : exercise === false ? 'No' : 'Not specified'}
            </Badge>
          </div>
          {work && (
            <div>
              <p className="text-sm text-foreground mb-2">Work/Occupation Type</p>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                {work}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function LifestyleRightColumn({ patientForms }: { patientForms?: any }) {
  // Backend getAllFormsForPatient returns: lifeStyle and womenForm
  const lifestyle = patientForms?.lifeStyle;
  const women = patientForms?.womenForm;
  
  console.log('🏃 Lifestyle Right - Forms:', { lifeStyle: lifestyle, womenForm: women });

  const alcoholUse = lifestyle?.alcoholUse;
  const tobaccoUse = lifestyle?.tobaccoUse;
  const drugUse = lifestyle?.drugUse;

  return (
    <div className="space-y-6">
      {/* Substance Use */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
            <GoAlert className="w-5 h-5" />
            Substance Use
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-foreground mb-2">Alcohol Use</p>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                {alcoholUse === true ? 'Yes' : alcoholUse === false ? 'No' : 'Not specified'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-foreground mb-2">Tobacco Use</p>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                {tobaccoUse === true ? 'Yes' : tobaccoUse === false ? 'No' : 'Not specified'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-foreground mb-2">Recreational Drugs</p>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                {drugUse === true ? 'Yes' : drugUse === false ? 'No' : 'Not specified'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reproductive Health */}
      {women && (
        <Card className="border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
              <MdChildCare className="w-5 h-5" />
              Reproductive Health (Women's Health Data Available)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Women's health information has been provided.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function InsuranceInfoTab({ patientForms }: { patientForms?: any }) {
  // Backend getAllFormsForPatient returns: insurance and onBoarding
  const insurance = patientForms?.insurance;
  const onBoarding = patientForms?.onBoarding;
  
  console.log('💳 Insurance Info - Forms:', { insurance: insurance, onBoarding: onBoarding });

  const hasInsurance = insurance?.haveInsurance;
  const insuranceCompany = insurance?.insuranceCompany || '';
  const policyHolder = insurance?.policyHolderName || '';
  const memberId = insurance?.memberId || '';
  const groupNumber = insurance?.groupNumber || '';
  const relationship = insurance?.relationshipToPatient || '';
  
  // Emergency contact from onboarding
  const emergencyContactName = onBoarding?.emergencyContactName || '';
  const emergencyPhone = onBoarding?.emergencyPhoneNumber || '';
  const emergencyRelationship = onBoarding?.relationshipToPatient || '';

  return (
    <div className="space-y-6">
      {hasInsurance ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Medical Insurance */}
            <Card className="border border-border bg-teal-50 dark:bg-teal-900/10">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                    <IoShieldOutline className="w-5 h-5" />
                    Medical Insurance
                  </CardTitle>
                  <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Insurance Company</p>
                  <p className="font-semibold text-foreground">{insuranceCompany || 'Not provided'}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Policy Holder</p>
                    <p className="font-medium text-foreground">{policyHolder || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Group ID</p>
                    <p className="font-medium text-foreground">{groupNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Member ID</p>
                    <p className="font-medium text-foreground">{memberId || 'N/A'}</p>
                  </div>
                </div>
                {relationship && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Relationship to Patient</p>
                    <p className="font-medium text-foreground">{relationship}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Insurance Cards */}
            <Card className="border border-border">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                  <CreditCard className="w-5 h-5" />
                  Insurance Cards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {insurance?.cardFront && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Card Front</p>
                    <img src={insurance.cardFront} alt="Insurance Card Front" className="w-full rounded border" />
                  </div>
                )}
                {insurance?.cardBack && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Card Back</p>
                    <img src={insurance.cardBack} alt="Insurance Card Back" className="w-full rounded border" />
                  </div>
                )}
                {!insurance?.cardFront && !insurance?.cardBack && (
                  <p className="text-sm text-muted-foreground">No insurance cards uploaded</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Insurance Emergency Contact */}
          {(emergencyContactName || emergencyPhone) && (
            <Card className="border border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                    <IoShieldOutline className="w-5 h-5" />
                    Emergency Contact
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Contact Name</p>
                    <p className="font-medium text-foreground">{emergencyContactName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                    <p className="font-medium text-foreground">{emergencyPhone}</p>
                  </div>
                  {emergencyRelationship && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Relationship</p>
                      <p className="font-medium text-foreground">{emergencyRelationship}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="border border-border">
          <CardContent className="py-8">
            <div className="text-center">
              <IoShieldOutline className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Insurance Information</h3>
              <p className="text-sm text-muted-foreground">Patient has indicated they do not have insurance coverage.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ConsentLegalTab({ patientForms }: { patientForms?: any }) {
  // Backend getAllFormsForPatient returns: constantLegal
  const legal = patientForms?.constantLegal;
  
  console.log('📋 Consent Legal - Forms:', { constantLegal: legal });

  // Check if consents are signed
  const hipaaConsent = legal?.hipaaConsent;
  const financialConsent = legal?.financialConsent;
  const privacyConsent = legal?.privacyConsent;
  const treatmentConsent = legal?.treatmentConsent;

  // Count signed/pending consents
  const signedCount = [hipaaConsent, financialConsent, privacyConsent, treatmentConsent].filter(Boolean).length;
  const totalCount = 4;
  const completionPercentage = Math.round((signedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Smaller width (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Consent Forms & Agreements */}
          <Card className="border border-border bg-teal-50 dark:bg-teal-900/10">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                <FileText className="w-5 h-5" />
                Consent Forms & Agreements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* HIPAA Consent */}
                <div className={`flex items-center justify-between p-4 border border-border rounded-lg ${hipaaConsent ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      {hipaaConsent ? (
                        <IoMdCheckmark className="w-6 h-6 text-green-500" />
                      ) : (
                        <GoDotFill className="w-8 h-8 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">HIPAA Privacy Authorization</p>
                      <p className="text-sm text-muted-foreground">
                        {hipaaConsent ? 'Signed - Digital signature' : 'Pending signature'}
                      </p>
                    </div>
                  </div>
                  <Badge className={hipaaConsent ? "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300"}>
                    {hipaaConsent ? 'Signed' : 'Pending'}
                  </Badge>
                </div>

                {/* Financial Consent */}
                <div className={`flex items-center justify-between p-4 border border-border rounded-lg ${financialConsent ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      {financialConsent ? (
                        <IoMdCheckmark className="w-6 h-6 text-green-500" />
                      ) : (
                        <GoDotFill className="w-8 h-8 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Financial Responsibility Agreement</p>
                      <p className="text-sm text-muted-foreground">
                        {financialConsent ? 'Signed - Digital signature' : 'Pending signature'}
                      </p>
                    </div>
                  </div>
                  <Badge className={financialConsent ? "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300"}>
                    {financialConsent ? 'Signed' : 'Pending'}
                  </Badge>
                </div>

                {/* Privacy Consent */}
                <div className={`flex items-center justify-between p-4 border border-border rounded-lg ${privacyConsent ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      {privacyConsent ? (
                        <IoMdCheckmark className="w-6 h-6 text-green-500" />
                      ) : (
                        <GoDotFill className="w-8 h-8 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">General Privacy Policy</p>
                      <p className="text-sm text-muted-foreground">
                        {privacyConsent ? 'Signed - Digital signature' : 'Pending signature'}
                      </p>
                    </div>
                  </div>
                  <Badge className={privacyConsent ? "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300"}>
                    {privacyConsent ? 'Signed' : 'Pending'}
                  </Badge>
                </div>

                {/* Treatment Consent */}
                <div className={`flex items-center justify-between p-4 border border-border rounded-lg ${treatmentConsent ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      {treatmentConsent ? (
                        <IoMdCheckmark className="w-6 h-6 text-green-500" />
                      ) : (
                        <GoDotFill className="w-8 h-8 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Treatment Consent Form</p>
                      <p className="text-sm text-muted-foreground">
                        {treatmentConsent ? 'Digital signature • Witness required' : 'Pending signature'}
                      </p>
                    </div>
                  </div>
                  <Badge className={treatmentConsent ? "bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300"}>
                    {treatmentConsent ? 'Signed' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Larger width (3 columns) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Identity Documents */}
          <Card className="border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                <IoShieldOutline className="w-5 h-5" />
                Identity Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {legal?.idFront && (
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">Driver's License / ID</h4>
                      <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300">
                        Verified
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">ID Front</p>
                        <img src={legal.idFront} alt="ID Front" className="w-full rounded border" />
                      </div>
                      {legal?.idBack && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">ID Back</p>
                          <img src={legal.idBack} alt="ID Back" className="w-full rounded border" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {!legal?.idFront && (
                  <p className="text-sm text-muted-foreground">No identity documents uploaded</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Consent & Legal Agreements Summary */}
          <Card className="border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                <FileText className="w-5 h-5" />
                Consent & Legal Agreements Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">{signedCount}</div>
                  <div className="text-sm text-muted-foreground">Signed</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">{totalCount - signedCount}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">{completionPercentage}%</div>
                  <div className="text-sm text-muted-foreground">Completion</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function UploadsDocumentsTab({ patientForms }: { patientForms?: any }) {
  // Backend getAllFormsForPatient returns: constantLegal for documents
  const legal = patientForms?.constantLegal;
  
  console.log('📁 Uploads Documents - Forms:', { constantLegal: legal });

  const documents = [
    { name: 'ID Front', file: legal?.idFront, type: 'Identity Document' },
    { name: 'ID Back', file: legal?.idBack, type: 'Identity Document' },
    { name: 'X-rays/Scans', file: legal?.scans, type: 'Medical Imaging' },
    { name: 'Medical Records', file: legal?.medicalRecord, type: 'Medical Records' },
    { name: 'Other Documents', file: legal?.otherDocument, type: 'Other' }
  ].filter(doc => doc.file && doc.file !== 'N/A' && doc.file !== 'Pending upload');

  const totalDocs = documents.length;

  return (
    <div className="space-y-6">
      {totalDocs > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column - Statistics */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border border-border bg-teal-50 dark:bg-teal-900/10">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                    <FileText className="w-5 h-5" />
                    Uploads & Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">{totalDocs}</div>
                      <div className="text-sm text-muted-foreground">Total Documents</div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {documents.filter(d => d.type === 'Medical Imaging').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Medical Imaging</div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {documents.filter(d => d.type === 'Identity Document').length}
                      </div>
                      <div className="text-sm text-muted-foreground">ID Documents</div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {documents.filter(d => d.type === 'Medical Records').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Medical Records</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Document List */}
            <div className="lg:col-span-3 space-y-4">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border border-border rounded-lg bg-card">
                  <div className="w-8 h-8 flex-shrink-0 mt-1">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-foreground">{doc.name}</h4>
                        <p className="text-sm text-muted-foreground">{doc.type}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 ml-2 flex-shrink-0">
                        {doc.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>Size: {(doc.file.length / 1024).toFixed(0)} KB</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-teal-600 border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 bg-transparent"
                        onClick={() => {
                          const win = window.open();
                          if (win) {
                            win.document.write(`<iframe src="${doc.file}" frameborder="0" style="width:100%;height:100vh"></iframe>`);
                          }
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-teal-600 border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 bg-transparent"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = doc.file;
                          link.download = `${doc.name}.${doc.file.includes('pdf') ? 'pdf' : 'jpg'}`;
                          link.click();
                        }}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <Card className="border border-border">
          <CardContent className="py-8">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Documents Uploaded</h3>
              <p className="text-sm text-muted-foreground">Patient has not uploaded any documents yet.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export { InsuranceInfoTab, ConsentLegalTab }

export default SectionsContent
