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

import { Badge } from "@/app/doctor/doctor-charts/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/doctor/doctor-charts/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/doctor/doctor-charts/tabs"
import { Button } from "@/app/doctor/doctor-charts/button"

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

function PatientInfo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        <img src="/patient-profile.png" alt="Sarah Johnson" className="w-full h-full object-cover" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-foreground">Sarah Johnson</h1>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>Patient ID: #PAT-2024-001</span>
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
                <PatientInfo />
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
          <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <span className="font-medium text-red-800 dark:text-red-300">Penicillin - Rash</span>
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300">
              Critical
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <span className="font-medium text-red-800 dark:text-red-300">Shellfish - Hives</span>
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300">
              Critical
            </Badge>
          </div>
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
            <p className="font-semibold text-foreground">Dr. Jennifer Martinez</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Blood Thinner Use</p>
            <p className="font-medium text-foreground">Yes - Currently Taking</p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
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
              Patient reports family history of cardiovascular disease. Father had MI at age 58. Mother has diabetes.
              Patient is compliant with medications and follows diabetic diet.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MedicalHistoryRightColumn() {
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
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
              Hypertension
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
              Type 2 Diabetes
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
              High Cholesterol
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
              Asthma
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
              Asthma
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
              Asthma
            </Badge>
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
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
              Lisinopril 10mg daily
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
              Metformin 500mg twice daily
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
              Atorvastatin 20mg daily
            </Badge>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
              Albuterol inhaler as needed
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Surgical History */}
      <Card className="border border-border bg-card text-card-foreground rounded-lg shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <RiScissorsFill className="w-5 h-5" />
            Surgical History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-md bg-muted/50">
            <p className="font-medium">Appendectomy</p>
            <p className="text-sm text-muted-foreground">2018-03-15 • City General Hospital</p>
          </div>
          <div className="p-3 rounded-md bg-muted/50">
            <p className="font-medium">Cholecystectomy</p>
            <p className="text-sm text-muted-foreground">2020-11-08 • Metropolitan Medical Center</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DentalHistoryTab() {
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
                <p className="text-2xl font-bold text-foreground">2024-01-15</p>
                <p className="text-sm text-muted-foreground">6 months ago</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Dental Anxiety Level</p>
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300">
                    Moderate
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Smoking Status</p>
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300">
                    Former
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Vaping</p>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                    No
                  </Badge>
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
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Bleeding Gums
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Tooth Sensitivity
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  TMJ/Jaw Pain
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Dry Mouth
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Bad Breath
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Tooth Pain
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Loose Teeth
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Difficulty Chewing
                </Badge>
              </div>
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
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Dental Implants
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Braces
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Fillings
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Crowns
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Root Canal
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Teeth Cleaning
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Extractions
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Whitening
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Dentures
                </Badge>
              </div>
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
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Nightguard
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  CPAP Machine
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Retainer
                </Badge>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                  Partial Denture
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function LifestyleLeftColumn() {
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
              Good
            </Badge>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg space-y-2">
            <p className="font-medium text-sm text-foreground">Sleep Setup</p>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>
                Pillow: <span className="font-medium text-foreground">Memory foam</span>
              </p>
              <p>
                Mattress: <span className="font-medium text-foreground">Medium firm</span>
              </p>
              <p>
                Position: <span className="font-medium text-foreground">Side sleeper</span>
              </p>
            </div>
          </div>
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
            <p className="text-sm text-foreground mb-2">Exercise Frequency</p>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
              Weekly
            </Badge>
          </div>
          <div>
            <p className="text-sm text-foreground mb-2">Occupation Type</p>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
              Sitting Work
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LifestyleRightColumn() {
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
                Occasionally
              </Badge>
            </div>
            <div>
              <p className="text-sm text-foreground mb-2">Tobacco Use</p>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                Never
              </Badge>
            </div>
            <div>
              <p className="text-sm text-foreground mb-2">Recreational Drugs</p>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                No
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reproductive Health */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
            <MdChildCare className="w-5 h-5" />
            Reproductive Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-sm text-foreground mb-2">Pregnancy Status</p>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
              Not Applicable
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment Summary */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
            <FileText className="w-5 h-5" />
            Risk Assessment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <div className="text-lg font-semibold text-foreground mb-1">Low</div>
              <div className="text-sm text-muted-foreground">Cardiovascular Risk</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <div className="text-lg font-semibold text-foreground mb-1">Moderate</div>
              <div className="text-sm text-muted-foreground">Musculoskeletal Risk</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <div className="text-lg font-semibold text-foreground mb-1">Low</div>
              <div className="text-sm text-muted-foreground">Substance Use Risk</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function InsuranceInfoTab() {
  return (
    <div className="space-y-6">
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
              <p className="font-semibold text-foreground">Blue Cross Blue Shield</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Policy Holder</p>
                <p className="font-medium text-foreground">John Smith</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Group ID</p>
                <p className="font-medium text-foreground">BCBS-98765</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Member ID</p>
                <p className="font-medium text-foreground">BC-123456789</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dental Insurance */}
        <Card className="border border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                <CreditCard className="w-5 h-5" />
                Dental Insurance
              </CardTitle>
              <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300">
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Insurance Company</p>
              <p className="font-semibold text-foreground">Delta Dental</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Policy Holder</p>
                <p className="font-medium text-foreground">John Smith</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Group ID</p>
                <p className="font-medium text-foreground">BCBS-98765</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Member ID</p>
                <p className="font-medium text-foreground">BC-123456789</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insurance Emergency Contact */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
              <IoShieldOutline className="w-5 h-5" />
              Insurance Emergency Contact
            </CardTitle>
            <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300">
              Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Contact Name</p>
              <p className="font-medium text-foreground">Sarah Smith (Spouse)</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
              <p className="font-medium text-foreground">(555) 123-4567</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Relationship</p>
              <p className="font-medium text-foreground">Spouse</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Authority Level</p>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                Full Authorization
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Summary */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
            <FileText className="w-5 h-5" />
            Insurance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-teal-600 mb-1">2</div>
              <div className="text-sm text-muted-foreground">Active Policies</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">2</div>
              <div className="text-sm text-muted-foreground">Cards Uploaded</div>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">1</div>
              <div className="text-sm text-muted-foreground">Missing Coverage</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ConsentLegalTab() {
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
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      <IoMdCheckmark className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">HIPAA Privacy Authorization</p>
                      <p className="text-sm text-muted-foreground">Signed: 2024-07-10 • Digital signature</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                    Signed
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      <IoMdCheckmark className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Financial Responsibility Agreement</p>
                      <p className="text-sm text-muted-foreground">Signed: 2024-07-10 • Digital signature</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                    Signed
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      <IoMdCheckmark className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">General Privacy Policy</p>
                      <p className="text-sm text-muted-foreground">Signed: 2024-07-10 • Digital signature</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                    Signed
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center">
                      <IoMdCheckmark className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Treatment Consent Form</p>
                      <p className="text-sm text-muted-foreground">Digital signature • Witness required</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
                    Signed
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full flex items-center justify-center">
                      <GoDotFill className="w-8 h-8 text-yellow-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Research Participation Consent</p>
                      <p className="text-sm text-muted-foreground">Signed: 2024-07-10 • Digital signature</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300">
                    Pending
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full flex items-center justify-center">
                      <RxCross2 className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Research Participation Consent</p>
                      <p className="text-sm text-muted-foreground">Signed: 2024-07-10 • Digital signature</p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300">
                    Declined
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
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">Driver's License</h4>
                    <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300">
                      Verified
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Uploaded: 2024-07-10</p>
                  <p className="text-sm text-muted-foreground">Expires: 2027-03-15</p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">Insurance Card (Front & Back)</h4>
                    <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-300">
                      Verified
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Uploaded: 2024-07-10</p>
                  <p className="text-sm text-muted-foreground">Expires: 2024-12-31</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consent & Legal Agreements Summary */}
          <Card className="border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-medium text-foreground">
                <FileText className="w-5 h-5" />
                Consent & Legal Agreements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">3</div>
                  <div className="text-sm text-muted-foreground">Signed</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">1</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">1</div>
                  <div className="text-sm text-muted-foreground">Declined</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">80%</div>
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

function UploadsDocumentsTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Smaller width (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document Statistics */}
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
                  <div className="text-2xl font-bold text-foreground mb-1">5</div>
                  <div className="text-sm text-muted-foreground">Total Documents</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">2</div>
                  <div className="text-sm text-muted-foreground">Radiology</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">1</div>
                  <div className="text-sm text-muted-foreground">Lab Results</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">1</div>
                  <div className="text-sm text-muted-foreground">Referrals</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Larger width (3 columns) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Chest X-Ray Document */}
          <div className="flex items-start gap-4 p-4 border border-border rounded-lg bg-card">
            <div className="w-8 h-8 flex-shrink-0 mt-1">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-foreground">Chest X-Ray - Frontal View</h4>
                  <p className="text-sm text-muted-foreground">Radiology</p>
                </div>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 ml-2 flex-shrink-0">
                  X-ray
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>Size: 2.4 MB</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Uploaded: 2024-07-20</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>By: Dr. Sarah Johnson</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-teal-600 border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 bg-transparent"
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-teal-600 border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 bg-transparent"
                >
                  Download
                </Button>
              </div>
            </div>
          </div>

          {/* Blood Work Document */}
          <div className="flex items-start gap-4 p-4 border border-border rounded-lg bg-card">
            <div className="w-8 h-8 flex-shrink-0 mt-1">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-foreground">Blood Work - Comprehensive Panel</h4>
                  <p className="text-sm text-muted-foreground">Laboratory</p>
                </div>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 ml-2 flex-shrink-0">
                  Lab Result
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>Size: 2.4 MB</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Uploaded: 2024-07-20</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>By: Dr. Sarah Johnson</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-teal-600 border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 bg-transparent"
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-teal-600 border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 bg-transparent"
                >
                  Download
                </Button>
              </div>
            </div>
          </div>

          {/* Cardiology Referral Document */}
          <div className="flex items-start gap-4 p-4 border border-border rounded-lg bg-card">
            <div className="w-8 h-8 flex-shrink-0 mt-1">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-foreground">Cardiology Referral Letter</h4>
                  <p className="text-sm text-muted-foreground">Referrals</p>
                </div>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 ml-2 flex-shrink-0">
                  Referral
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>Size: 2.4 MB</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Uploaded: 2024-07-20</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>By: Dr. Sarah Johnson</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-teal-600 border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 bg-transparent"
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-teal-600 border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 bg-transparent"
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { InsuranceInfoTab, ConsentLegalTab }

export default SectionsContent
