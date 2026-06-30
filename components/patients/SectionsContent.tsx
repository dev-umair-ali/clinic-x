"use client"

import { Calendar, CreditCard, FileText, User } from "lucide-react"
import { FaRegHeart } from "react-icons/fa"
import { FiMoon, FiTool } from "react-icons/fi"
import { GoAlert, GoDotFill } from "react-icons/go"
import { IoMdCheckmark } from "react-icons/io"
import { IoShieldOutline } from "react-icons/io5"
import { useSelector } from "react-redux"
import { LuDumbbell } from "react-icons/lu"
import { MdChildCare } from "react-icons/md"
import { RiScissorsFill } from "react-icons/ri"
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
      <div className="w-12 h-12 rounded-full bg-[hsl(var(--color-gray-200))] flex items-center justify-center overflow-hidden">
        {patient.profilePicture ? (
          <img src={patient.profilePicture} alt={patient.firstName} className="w-full h-full object-cover" />
        ) : (
          <img src="/patient-profile.png" alt={patient.firstName} className="w-full h-full object-cover" />
        )}
      </div>
      <div>
        <h1 className="text-lg font-semibold text-[hsl(var(--foreground))]">{patient.firstName + " " + patient.lastName || 'Unknown Patient'}</h1>
        <div className="flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))]">
          <User className="w-4 h-4" />
          <span>Patient ID: {patient._id || 'N/A'}</span>
        </div>
      </div>
    </div>
  )
}

// Sections content component
function SectionsContent({
  activeTab,
  setActiveTab,
}: {
  activeTab: string
  setActiveTab: (tab: string) => void
}) {
  const { patient } = useSelector(
    (state: any) => state.onboarding,
  );

  return (
    <div className="pt-4 border rounded-2xl border-[hsl(var(--border))] bg-[hsl(var(--card))]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-[hsl(var(--border))] px-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto p-0 bg-transparent -mb-px">
            {sections.map((section) => (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className={`w-full border-b-2 px-1 py-2 lg:py-3 text-center text-sm font-medium whitespace-nowrap rounded-none
                  data-[state=active]:border-[hsl(var(--color-brand-teal))] data-[state=active]:text-[hsl(var(--color-brand-teal))] data-[state=active]:bg-[hsl(var(--color-brand-teal)/0.1)] data-[state=active]:font-semibold
                  data-[state=inactive]:border-transparent data-[state=inactive]:text-[hsl(var(--foreground))] hover:border-[hsl(var(--border))] hover:text-[hsl(var(--muted-foreground))]`}
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
                  <h2 className="text-lg font-bold text-[hsl(var(--foreground))] mb-1">{section.name}</h2>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] italic">{section.tagline}</p>
                </div>
                <PatientInfo patient={patient} />
              </div>
              {/* Tab Content */}
              {section.id === "medical-history" && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Left column - smaller */}
                    <MedicalHistoryLeftColumn />
                  </div>
                  <div className="lg:col-span-3 space-y-6">
                    {/* Right column - bigger */}
                    <MedicalHistoryRightColumn />
                  </div>
                </div>
              )}
              {section.id === "dental-history" && <DentalHistoryTab />}
              {section.id === "insurance-info" && <InsuranceInfoTab />}
              {section.id === "lifestyle" && (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <LifestyleLeftColumn />
                  </div>
                  <div className="lg:col-span-3 space-y-6">
                    <LifestyleRightColumn />
                  </div>
                </div>
              )}
              {section.id === "consent-legal" && <ConsentLegalTab />}
              {section.id === "uploads-documents" && <UploadsDocumentsTab />}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function MedicalHistoryLeftColumn() {

  const { history, medicalProfile } = useSelector((state: any) => state.onboarding);

  return (
    <div className="space-y-6">
      {/* Critical Allergies */}
      <Card className="border border-[hsl(var(--border))] bg-[hsl(var(--color-status-error-light))] dark:bg-[hsl(var(--color-status-error)/0.1)]">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--color-status-error-dark))] dark:text-[hsl(var(--color-status-error))]">
            <GoAlert className="w-5 h-5" />
            CRITICAL ALLERGIES
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {medicalProfile?.criticalAllergies !== '' ? (
            // allergyList.map((allergy: string, index: number) => (
            <div className="flex items-center justify-between p-3 bg-[hsl(var(--color-status-error-light))] dark:bg-[hsl(var(--color-status-error)/0.2)] rounded-lg border border-[hsl(var(--color-status-error))]">
              <span className="font-medium text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]">{medicalProfile?.criticalAllergies}</span>
              <Badge className="bg-[hsl(var(--color-status-error)/0.1)] text-[hsl(var(--color-status-error))] hover:bg-[hsl(var(--color-status-error)/0.1)] dark:bg-[hsl(var(--color-status-error)/0.2)] dark:text-[hsl(var(--color-status-error))]">
                Critical
              </Badge>
            </div>
            //  ))
          ) : (
            <div className="p-3 bg-[hsl(var(--muted)/0.5)] dark:bg-[hsl(var(--muted)/0.5)] rounded-lg">
              <p className="text-sm text-[hsl(var(--muted-foreground))]">No allergies reported</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Primary Care Information */}
      <Card className="border border-[hsl(var(--border))]">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
            <User className="w-5 h-5" />
            Primary Care Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Primary Care Information</p>
            <p className="font-semibold text-[hsl(var(--foreground))]">
              {medicalProfile?.primaryCareInformation || 'Not provided'}
            </p>
          </div>
          <div>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Blood Thinner Use</p>
            <p className="font-medium text-[hsl(var(--foreground))]">
              {history.bloodThinner ? 'Yes - Currently Taking' : history.bloodThinner === false ? 'No' : 'Not specified'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card className="border border-[hsl(var(--border))]">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
            <FaRegHeart className="w-5 h-5" />
            Additional Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-[hsl(var(--muted)/0.5)] p-3 rounded-lg">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {medicalProfile?.additionalNotes}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MedicalHistoryRightColumn() {
  const { history, medicalProfile } = useSelector((state: any) => state.onboarding);

  return (
    <div className="space-y-6">
      {/* Medical Conditions */}
      <Card className="border border-[hsl(var(--border))]">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
            <FaRegHeart className="w-5 h-5" />
            Health Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {history.healthConditions?.length > 0 ? (
              history.healthConditions.map((condition: string, index: number) => (
                <Badge key={index} className="bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)] dark:text-[hsl(var(--color-chart-blue))]">
                  {condition}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-[hsl(var(--muted-foreground))]">No medical conditions reported</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Medications */}
      <Card className="border border-[hsl(var(--border))]">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
            <GoAlert className="w-5 h-5" />
            Current Medications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {history.currentMedication !== "" ? (
              <Badge className="bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)] dark:text-[hsl(var(--color-chart-blue))]">
                {history.currentMedication}
              </Badge>
            )
              : (
                <p className="text-sm text-[hsl(var(--muted-foreground))]">No current medications reported</p>
              )}
          </div>
        </CardContent>
      </Card>

      {/* Surgical History */}
      {medicalProfile?.surgicalHistory.length > 0 &&
        medicalProfile.surgicalHistory.map((surgery: string, index: number) => (
          <Card key={index} className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-lg shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <RiScissorsFill className="w-5 h-5" />
                Surgical History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-md bg-[hsl(var(--muted)/0.5)]">
                <p className="text-sm text-[hsl(var(--foreground))] whitespace-pre-wrap">{surgery}</p>
              </div>
            </CardContent>
          </Card>
        ))}

    </div>
  )
}

function DentalHistoryTab() {
  const { dentalHistory } = useSelector((state: any) => state.onboarding);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Smaller width (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Last Dental Visit */}
          <Card className="border border-[hsl(var(--border))] bg-[hsl(var(--color-brand-teal-light))] dark:bg-[hsl(var(--color-brand-teal)/0.1)]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
                <Calendar className="w-5 h-5" />
                Last Dental Visit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-[hsl(var(--color-brand-teal-light))] dark:bg-[hsl(var(--color-brand-teal)/0.2)] p-4 rounded-lg">
                <p className="text-2xl font-bold text-[hsl(var(--foreground))]">
                  {dentalHistory?.lastDentalVisit || 'Not provided'}
                </p>
                {dentalHistory?.lastDentalVisit && (
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">Last visit date</p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">Dental Anxiety</p>
                  {dentalHistory?.dentalAnxietyLevel ? (
                    <Badge className="bg-[hsl(var(--color-chart-orange)/0.1)] text-[hsl(var(--color-chart-orange))] hover:bg-[hsl(var(--color-chart-orange)/0.1)] dark:bg-[hsl(var(--color-chart-orange)/0.2)] dark:text-[hsl(var(--color-chart-orange))]">
                      {dentalHistory.dentalAnxietyLevel}
                    </Badge>
                  ) : (
                    <p className="text-sm text-[hsl(var(--foreground))]">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">Smoking</p>
                  {dentalHistory?.smokingStatus !== undefined ? (
                    <Badge className={dentalHistory.smokingStatus ? "bg-[hsl(var(--color-status-error)/0.1)] text-[hsl(var(--color-status-error))] hover:bg-[hsl(var(--color-status-error)/0.1)] dark:bg-[hsl(var(--color-status-error)/0.2)] dark:text-[hsl(var(--color-status-error))]" : "bg-[hsl(var(--color-status-success)/0.1)] text-[hsl(var(--color-status-success-dark))] hover:bg-[hsl(var(--color-status-success)/0.1)] dark:bg-[hsl(var(--color-status-success)/0.2)] dark:text-[hsl(var(--color-status-success))]"}>
                      {dentalHistory.smokingStatus ? 'Yes' : 'No'}
                    </Badge>
                  ) : (
                    <p className="text-sm text-[hsl(var(--foreground))]">Not provided</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">Vaping</p>
                  {dentalHistory?.vaping !== undefined ? (
                    <Badge className={dentalHistory.vaping ? "bg-[hsl(var(--color-status-error)/0.1)] text-[hsl(var(--color-status-error))] hover:bg-[hsl(var(--color-status-error)/0.1)] dark:bg-[hsl(var(--color-status-error)/0.2)] dark:text-[hsl(var(--color-status-error))]" : "bg-[hsl(var(--color-status-success)/0.1)] text-[hsl(var(--color-status-success-dark))] hover:bg-[hsl(var(--color-status-success)/0.1)] dark:bg-[hsl(var(--color-status-success)/0.2)] dark:text-[hsl(var(--color-status-success))]"}>
                      {dentalHistory.vaping ? 'Yes' : 'No'}
                    </Badge>
                  ) : (
                    <p className="text-sm text-[hsl(var(--foreground))]">Not provided</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Larger width (3 columns) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Current Symptoms */}
          <Card className="border border-[hsl(var(--border))]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
                <GoAlert className="w-5 h-5" />
                Current Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dentalHistory.currentSymptoms.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {dentalHistory.currentSymptoms.map((symptom: string, index: number) => (
                    <Badge key={index} className="bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)] dark:text-[hsl(var(--color-chart-blue))]">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[hsl(var(--muted-foreground))]">No dental symptoms reported</p>
              )}
            </CardContent>
          </Card>

          {/* Treatments Received */}
          <Card className="border border-[hsl(var(--border))]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
                <FiTool className="w-5 h-5" />
                Treatments Received
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dentalHistory.treatmentReceived.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {dentalHistory.treatmentReceived.map((treatment: string, index: number) => (
                    <Badge key={index} className="bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)] dark:text-[hsl(var(--color-chart-blue))]">
                      {treatment}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[hsl(var(--muted-foreground))]">No dental treatments recorded</p>
              )}
            </CardContent>
          </Card>

          {/* Devices & Equipment */}
          <Card className="border border-[hsl(var(--border))]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
                <FiMoon className="w-5 h-5" />
                Devices & Equipment
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dentalHistory.deviceAndEquipment.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {dentalHistory.deviceAndEquipment.map((device: string, index: number) => (
                    <Badge key={index} className="bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)] dark:text-[hsl(var(--color-chart-blue))]">
                      {device}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[hsl(var(--muted-foreground))]">No dental devices or equipment</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function LifestyleLeftColumn() {
  const { lifeStyle } = useSelector((state: any) => state.onboarding);

  const sleepQuality = lifeStyle?.sleepQuality;
  const pillows = lifeStyle?.sleepSupport;
  const exercise = lifeStyle?.exerciseRegularly;
  const work = lifeStyle?.workType;

  return (
    <div className="space-y-6">
      {/* Sleep & Rest */}
      <Card className="border border-[hsl(var(--border))]">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
            <FiMoon className="w-5 h-5" />
            Sleep & Rest
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-[hsl(var(--foreground))] mb-2">Sleep Quality</p>
            <Badge className="bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)] dark:text-[hsl(var(--color-chart-blue))]">
              {sleepQuality || 'Not specified'}
            </Badge>
          </div>
          {pillows && (
            <div className="bg-[hsl(var(--muted)/0.5)] p-3 rounded-lg space-y-2">
              <p className="font-medium text-sm text-[hsl(var(--foreground))]">Sleep Setup</p>
              <div className="text-sm space-y-1 text-[hsl(var(--muted-foreground))]">
                <p>
                  Pillow/Support: <span className="font-medium text-[hsl(var(--foreground))]">{pillows}</span>
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exercise & Activity */}
      <Card className="border border-[hsl(var(--border))]">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
            <LuDumbbell className="w-5 h-5" />
            Exercise & Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-[hsl(var(--foreground))] mb-2">Regular Exercise</p>
            <Badge className="bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)] dark:text-[hsl(var(--color-chart-blue))]">
              {exercise === true ? 'Yes' : exercise === false ? 'No' : 'Not specified'}
            </Badge>
          </div>
          {work && (
            <div>
              <p className="text-sm text-[hsl(var(--foreground))] mb-2">Work/Occupation Type</p>
              <Badge className="bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)] dark:text-[hsl(var(--color-chart-blue))]">
                {work}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function LifestyleRightColumn() {
  const { lifeStyle, womenForm } = useSelector((state: any) => state.onboarding);
  // Backend getAllFormsForPatient returns: lifeStyle and womenForm
  const lifestyle = lifeStyle;
  const women = womenForm;


  const alcoholUse = lifestyle?.alcoholUse;
  const tobaccoUse = lifestyle?.tobaccoUse;
  const drugUse = lifestyle?.drugUse;

  return (
    <div className="space-y-6">
      {/* Substance Use */}
      <Card className="border border-[hsl(var(--border))]">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
            <GoAlert className="w-5 h-5" />
            Substance Use
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-[hsl(var(--foreground))] mb-2">Alcohol Use</p>
              <Badge className="bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)] dark:text-[hsl(var(--color-chart-blue))]">
                {alcoholUse === true ? 'Yes' : alcoholUse === false ? 'No' : 'Not specified'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-[hsl(var(--foreground))] mb-2">Tobacco Use</p>
              <Badge className="bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)] dark:text-[hsl(var(--color-chart-blue))]">
                {tobaccoUse === true ? 'Yes' : tobaccoUse === false ? 'No' : 'Not specified'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-[hsl(var(--foreground))] mb-2">Recreational Drugs</p>
              <Badge className="bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)] dark:text-[hsl(var(--color-chart-blue))]">
                {drugUse === true ? 'Yes' : drugUse === false ? 'No' : 'Not specified'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reproductive Health */}
      {women && (
        <Card className="border border-[hsl(var(--border))]">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
              <MdChildCare className="w-5 h-5" />
              Reproductive Health (Women's Health Data Available)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Women's health information has been provided.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function InsuranceInfoTab() {
  const { insurance, onBoardingInfo } = useSelector((state: any) => state.onboarding);
  // Backend getAllFormsForPatient returns: insurance and onBoarding
  const onBoarding = onBoardingInfo;


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
            <Card className="border border-[hsl(var(--border))] bg-[hsl(var(--color-brand-teal-light))] dark:bg-[hsl(var(--color-brand-teal)/0.1)]">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
                    <IoShieldOutline className="w-5 h-5" />
                    Medical Insurance
                  </CardTitle>
                  <Badge className="bg-[hsl(var(--color-brand-teal)/0.1)] text-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal)/0.1)] dark:bg-[hsl(var(--color-brand-teal)/0.2)] dark:text-[hsl(var(--color-brand-teal))]">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Insurance Company</p>
                  <p className="font-semibold text-[hsl(var(--foreground))]">{insuranceCompany || 'Not provided'}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Policy Holder</p>
                    <p className="font-medium text-[hsl(var(--foreground))]">{policyHolder || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Group ID</p>
                    <p className="font-medium text-[hsl(var(--foreground))]">{groupNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Member ID</p>
                    <p className="font-medium text-[hsl(var(--foreground))]">{memberId || 'N/A'}</p>
                  </div>
                </div>
                {relationship && (
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Relationship to Patient</p>
                    <p className="font-medium text-[hsl(var(--foreground))]">{relationship}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Insurance Cards */}
            <Card className="border border-[hsl(var(--border))]">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
                  <CreditCard className="w-5 h-5" />
                  Insurance Cards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {insurance?.cardFront && (
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">Card Front</p>
                    <img src={insurance.cardFront} alt="Insurance Card Front" className="w-full rounded border border-[hsl(var(--border))]" />
                  </div>
                )}
                {insurance?.cardBack && (
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">Card Back</p>
                    <img src={insurance.cardBack} alt="Insurance Card Back" className="w-full rounded border border-[hsl(var(--border))]" />
                  </div>
                )}
                {!insurance?.cardFront && !insurance?.cardBack && (
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">No insurance cards uploaded</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Insurance Emergency Contact */}
          {(emergencyContactName || emergencyPhone) && (
            <Card className="border border-[hsl(var(--border))]">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
                    <IoShieldOutline className="w-5 h-5" />
                    Emergency Contact
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Contact Name</p>
                    <p className="font-medium text-[hsl(var(--foreground))]">{emergencyContactName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Phone Number</p>
                    <p className="font-medium text-[hsl(var(--foreground))]">{emergencyPhone}</p>
                  </div>
                  {emergencyRelationship && (
                    <div>
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Relationship</p>
                      <p className="font-medium text-[hsl(var(--foreground))]">{emergencyRelationship}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="border border-[hsl(var(--border))]">
          <CardContent className="py-8">
            <div className="text-center">
              <IoShieldOutline className="w-12 h-12 mx-auto mb-4 text-[hsl(var(--muted-foreground))]" />
              <h3 className="text-lg font-medium text-[hsl(var(--foreground))] mb-2">No Insurance Information</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Patient has indicated they do not have insurance coverage.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function ConsentLegalTab() {
  const { consentLegal } = useSelector((state: any) => state.onboarding);
  // Backend getAllFormsForPatient returns: constantLegal
  const legal = consentLegal;


  // Check if consents are signed
  const hipaaConsent = legal?.consentToTreatment;
  const financialConsent = legal?.informationComplete;
  const privacyConsent = legal?.privacyPoliciesAcknowledged;
  const treatmentConsent = legal?.consentToTreatment;

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
          <Card className="border border-[hsl(var(--border))] bg-[hsl(var(--color-brand-teal-light))] dark:bg-[hsl(var(--color-brand-teal)/0.1)]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
                <FileText className="w-5 h-5" />
                Consent Forms & Agreements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* HIPAA Consent */}
                <div className={`flex items-center justify-between p-4 border border-[hsl(var(--border))] rounded-lg ${hipaaConsent ? 'bg-[hsl(var(--color-status-success-light))] dark:bg-[hsl(var(--color-status-success)/0.2)]' : 'bg-[hsl(var(--color-status-warning)/0.1)] dark:bg-[hsl(var(--color-status-warning)/0.2)]'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      {hipaaConsent ? (
                        <IoMdCheckmark className="w-6 h-6 text-[hsl(var(--color-status-success))]" />
                      ) : (
                        <GoDotFill className="w-8 h-8 text-[hsl(var(--color-status-warning))]" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[hsl(var(--foreground))]">HIPAA Privacy Authorization</p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        {hipaaConsent ? 'Signed - Digital signature' : 'Pending signature'}
                      </p>
                    </div>
                  </div>
                  <Badge className={hipaaConsent ? "bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)] dark:text-[hsl(var(--color-chart-blue))]" : "bg-[hsl(var(--color-status-warning)/0.1)] text-[hsl(var(--color-status-warning))] hover:bg-[hsl(var(--color-status-warning)/0.1)] dark:bg-[hsl(var(--color-status-warning)/0.2)] dark:text-[hsl(var(--color-status-warning))]"}>
                    {hipaaConsent ? 'Signed' : 'Pending'}
                  </Badge>
                </div>

                {/* Financial Consent */}
                <div className={`flex items-center justify-between p-4 border border-[hsl(var(--border))] rounded-lg ${financialConsent ? 'bg-[hsl(var(--color-status-success-light))] dark:bg-[hsl(var(--color-status-success)/0.2)]' : 'bg-[hsl(var(--color-status-warning)/0.1)] dark:bg-[hsl(var(--color-status-warning)/0.2)]'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      {financialConsent ? (
                        <IoMdCheckmark className="w-6 h-6 text-[hsl(var(--color-status-success))]" />
                      ) : (
                        <GoDotFill className="w-8 h-8 text-[hsl(var(--color-status-warning))]" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[hsl(var(--foreground))]">Financial Responsibility Agreement</p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        {financialConsent ? 'Signed - Digital signature' : 'Pending signature'}
                      </p>
                    </div>
                  </div>
                  <Badge className={financialConsent ? "bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)] dark:text-[hsl(var(--color-chart-blue))]" : "bg-[hsl(var(--color-status-warning)/0.1)] text-[hsl(var(--color-status-warning))] hover:bg-[hsl(var(--color-status-warning)/0.1)] dark:bg-[hsl(var(--color-status-warning)/0.2)] dark:text-[hsl(var(--color-status-warning))]"}>
                    {financialConsent ? 'Signed' : 'Pending'}
                  </Badge>
                </div>

                {/* Privacy Consent */}
                <div className={`flex items-center justify-between p-4 border border-[hsl(var(--border))] rounded-lg ${privacyConsent ? 'bg-[hsl(var(--color-status-success-light))] dark:bg-[hsl(var(--color-status-success)/0.2)]' : 'bg-[hsl(var(--color-status-warning)/0.1)] dark:bg-[hsl(var(--color-status-warning)/0.2)]'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      {privacyConsent ? (
                        <IoMdCheckmark className="w-6 h-6 text-[hsl(var(--color-status-success))]" />
                      ) : (
                        <GoDotFill className="w-8 h-8 text-[hsl(var(--color-status-warning))]" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[hsl(var(--foreground))]">General Privacy Policy</p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        {privacyConsent ? 'Signed - Digital signature' : 'Pending signature'}
                      </p>
                    </div>
                  </div>
                  <Badge className={privacyConsent ? "bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)] dark:text-[hsl(var(--color-chart-blue))]" : "bg-[hsl(var(--color-status-warning)/0.1)] text-[hsl(var(--color-status-warning))] hover:bg-[hsl(var(--color-status-warning)/0.1)] dark:bg-[hsl(var(--color-status-warning)/0.2)] dark:text-[hsl(var(--color-status-warning))]"}>
                    {privacyConsent ? 'Signed' : 'Pending'}
                  </Badge>
                </div>

                {/* Treatment Consent */}
                <div className={`flex items-center justify-between p-4 border border-[hsl(var(--border))] rounded-lg ${treatmentConsent ? 'bg-[hsl(var(--color-status-success-light))] dark:bg-[hsl(var(--color-status-success)/0.2)]' : 'bg-[hsl(var(--color-status-warning)/0.1)] dark:bg-[hsl(var(--color-status-warning)/0.2)]'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      {treatmentConsent ? (
                        <IoMdCheckmark className="w-6 h-6 text-[hsl(var(--color-status-success))]" />
                      ) : (
                        <GoDotFill className="w-8 h-8 text-[hsl(var(--color-status-warning))]" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[hsl(var(--foreground))]">Treatment Consent Form</p>
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        {treatmentConsent ? 'Digital signature • Witness required' : 'Pending signature'}
                      </p>
                    </div>
                  </div>
                  <Badge className={treatmentConsent ? "bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.2)] dark:text-[hsl(var(--color-chart-blue))]" : "bg-[hsl(var(--color-status-warning)/0.1)] text-[hsl(var(--color-status-warning))] hover:bg-[hsl(var(--color-status-warning)/0.1)] dark:bg-[hsl(var(--color-status-warning)/0.2)] dark:text-[hsl(var(--color-status-warning))]"}>
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
          <Card className="border border-[hsl(var(--border))]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
                <IoShieldOutline className="w-5 h-5" />
                Identity Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {legal?.idFront && (
                  <div className="p-4 border border-[hsl(var(--border))] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-[hsl(var(--foreground))]">Driver's License / ID</h4>
                      <Badge className="bg-[hsl(var(--color-brand-teal)/0.1)] text-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal)/0.1)] dark:bg-[hsl(var(--color-brand-teal)/0.2)] dark:text-[hsl(var(--color-brand-teal))]">
                        Verified
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">ID Front</p>
                        <img src={legal.idFront} alt="ID Front" className="w-full rounded border border-[hsl(var(--border))]" />
                      </div>
                      {legal?.idBack && (
                        <div>
                          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">ID Back</p>
                          <img src={legal.idBack} alt="ID Back" className="w-full rounded border border-[hsl(var(--border))]" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!legal?.idFront && (
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">No identity documents uploaded</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Consent & Legal Agreements Summary */}
          <Card className="border border-[hsl(var(--border))]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
                <FileText className="w-5 h-5" />
                Consent & Legal Agreements Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[hsl(var(--muted)/0.5)] p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[hsl(var(--foreground))] mb-1">{signedCount}</div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))]">Signed</div>
                </div>
                <div className="bg-[hsl(var(--muted)/0.5)] p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[hsl(var(--foreground))] mb-1">{totalCount - signedCount}</div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))]">Pending</div>
                </div>
                <div className="bg-[hsl(var(--muted)/0.5)] p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[hsl(var(--foreground))] mb-1">{completionPercentage}%</div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))]">Completion</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function UploadsDocumentsTab() {
  const { onBoardingUploads, constantLegal } = useSelector((state: any) => state.onboarding);
  // Backend getAllFormsForPatient returns: constantLegal for documents
  const legal = constantLegal;


  const documents = [
    { name: 'ID Front', file: onBoardingUploads?.idFront, type: 'Identity Document' },
    { name: 'ID Back', file: onBoardingUploads?.idBack, type: 'Identity Document' },
    { name: 'X-rays/Scans', file: onBoardingUploads?.xrayOrScans, type: 'Medical Imaging' },
    { name: 'Medical Records', file: onBoardingUploads?.medicalReport, type: 'Medical Records' },
    { name: 'Other Documents', file: onBoardingUploads?.otherDocs, type: 'Other' }
  ].filter(doc => doc.file && doc.file !== 'N/A' && doc.file !== 'Pending upload');

  const totalDocs = documents.length;
  return (
    <div className="space-y-6">
      {totalDocs > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column - Statistics */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border border-[hsl(var(--border))] bg-[hsl(var(--color-brand-teal-light))] dark:bg-[hsl(var(--color-brand-teal)/0.1)]">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base font-medium text-[hsl(var(--foreground))]">
                    <FileText className="w-5 h-5" />
                    Uploads & Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[hsl(var(--muted)/0.5)] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-[hsl(var(--foreground))] mb-1">{totalDocs}</div>
                      <div className="text-sm text-[hsl(var(--muted-foreground))]">Total Documents</div>
                    </div>
                    <div className="bg-[hsl(var(--muted)/0.5)] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-[hsl(var(--foreground))] mb-1">
                        {documents.filter(d => d.type === 'Medical Imaging').length}
                      </div>
                      <div className="text-sm text-[hsl(var(--muted-foreground))]">Medical Imaging</div>
                    </div>
                    <div className="bg-[hsl(var(--muted)/0.5)] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-[hsl(var(--foreground))] mb-1">
                        {documents.filter(d => d.type === 'Identity Document').length}
                      </div>
                      <div className="text-sm text-[hsl(var(--muted-foreground))]">ID Documents</div>
                    </div>
                    <div className="bg-[hsl(var(--muted)/0.5)] p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-[hsl(var(--foreground))] mb-1">
                        {documents.filter(d => d.type === 'Medical Records').length}
                      </div>
                      <div className="text-sm text-[hsl(var(--muted-foreground))]">Medical Records</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Document List */}
            <div className="lg:col-span-3 space-y-4">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--card))]">
                  <div className="w-8 h-8 flex-shrink-0 mt-1">
                    <FileText className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-[hsl(var(--foreground))]">{doc.name}</h4>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">{doc.type}</p>
                      </div>
                      <Badge className="bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.1)] ml-2 flex-shrink-0 dark:bg-[hsl(var(--color-chart-blue)/0.2)] dark:text-[hsl(var(--color-chart-blue))]">
                        {doc.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[hsl(var(--muted-foreground))] mb-3">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>Size: {(doc.file.length / 1024).toFixed(0)} KB</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-[hsl(var(--color-brand-teal))] border-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-light))] dark:hover:bg-[hsl(var(--color-brand-teal)/0.2)] bg-transparent"
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
                        className="flex-1 text-[hsl(var(--color-brand-teal))] border-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-light))] dark:hover:bg-[hsl(var(--color-brand-teal)/0.2)] bg-transparent"
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
        <Card className="border border-[hsl(var(--border))]">
          <CardContent className="py-8">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-[hsl(var(--muted-foreground))]" />
              <h3 className="text-lg font-medium text-[hsl(var(--foreground))] mb-2">No Documents Uploaded</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Patient has not uploaded any documents yet.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export { InsuranceInfoTab, ConsentLegalTab }

export default SectionsContent