"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Pill,
  DollarSign,

} from "lucide-react";

import Procedure from "@/components/patients/Procedure";
import PatientHistory from "@/app/doctor/patients/PatientHistory";


export default function PatientProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("medical-history");
  const [currentView, setCurrentView] = useState("profile"); // "profile", "procedure", "history", "sections"

  const handleStartProcedure = () => {
    setCurrentView("procedure");
  };

  const handleViewHistory = () => {
    setCurrentView("history");
  };

  const handleShowOtherSections = () => {
    setCurrentView("sections");
  };

  const handleGoBack = () => {
    setCurrentView("profile");
  };

  const patientData = {
    id: Array.isArray(params.id) ? params.id[0] : params.id || "PAT-2024-001",
    name: searchParams.get("name") || "Sarah Johnson",
    age: searchParams.get("age") || "32",
    gender: searchParams.get("gender") || "Female",
    lastVisit: searchParams.get("lastVisit") || "Dec 15, 2024",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    location: "123 Main St, City, State 12345",
    dob: "March 15, 1992",
    bloodType: "O+",
    allergies: ["Penicillin", "Dust"],
    medications: ["Lisinopril (for hypertension)"],
    conditions: ["Hypertension", "Seasonal Allergies"],
  };

  // If showing procedure, render it without header
  if (currentView === "procedure") {
    return (
      <Procedure patient={patientData} goBack={handleGoBack} initialStep={0} />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Patient Header - Always visible */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt={patientData.name}
              />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold text-lg">
                {patientData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {patientData.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span>Patient ID: {patientData.id}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3 flex-wrap md:flex-nowrap w-full md:w-auto md:justify-end">
            <Button
              onClick={handleStartProcedure}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6"
            >
              Start Visit{" "}
            </Button>
 
            <Button
              onClick={handleViewHistory}
              variant={currentView === "history" ? "default" : "outline"}
              className={
                currentView === "history"
                  ? "bg-teal-600 hover:bg-teal-700 text-white px-6 border-teal-600"
                  : "border-teal-600 text-teal-600 hover:bg-teal-50 px-6"
              }
            >
              History
            </Button>
          </div>
        </div>
 
         {/* Patient Basic Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 mb-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Age</div>
            <div className="font-semibold text-foreground">
              {patientData.age} years
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Gender</div>
            <div className="font-semibold text-foreground">
              {patientData.gender}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Blood Type</div>
            <div className="font-semibold text-foreground">
              {patientData.bloodType}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Last Visit</div>
            <div className="font-semibold text-foreground">
              {patientData.lastVisit}
            </div>
          </div>
        </div>
 
         {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-sm">
          <div className="flex items-center gap-2 text-foreground">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{patientData.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{patientData.email}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>DOB: {patientData.dob}</span>
          </div>
        </div>
      </div>
 
       {/* Dynamic Content Based on Current View */}
       {currentView === "profile" && (
         <ProfileContent patientData={patientData} />
       )}
       {currentView === "history" && (
         <div className="bg-card rounded-lg shadow-sm border border-border">
           <PatientHistory patient={patientData} goBack={handleGoBack} />
         </div>
       )}
       {/* {currentView === "sections" && (
         <SectionsContent activeTab={activeTab} setActiveTab={setActiveTab} />
       )} */}
     </div>
   );
 }
 
 // Profile content component
 function ProfileContent({ patientData }: { patientData: any }) {
   return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Appointments */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-foreground">
            <Calendar className="w-5 h-5 text-teal-600" />
            Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm font-medium text-foreground mb-2">
              Latest Appointment
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-medium text-sm text-foreground">
                  Mon 21 July, 2:30 PM
                </div>
                <div className="text-xs text-muted-foreground">
                  Annual Checkup
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
 
      {/* Patient Notes */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-foreground">
            <FileText className="w-5 h-5 text-red-500" />
            Patient Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm font-medium text-foreground mb-2">
              Latest Notes
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Mon 21 July, 2:30 PM
                </span>
              </div>
              <div className="text-sm">
                <div className="font-medium mb-1 text-foreground">Summary:</div>
                <div className="text-muted-foreground">
                  Patient reported recurring headache and blurred vision. Blood
                  pressure elevated. Recommended initial tests before
                  medication.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
 
      {/* Prescriptions */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-foreground">
            <Pill className="w-5 h-5 text-orange-500" />
            Prescriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm font-medium text-foreground mb-2">
              Latest Prescriptions
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Mon 21 July, 2:30 PM
                </span>
              </div>
              <div className="text-sm space-y-1">
                <div className="font-medium text-foreground">Medicines:</div>
                <div className="text-muted-foreground">
                  Panadol 500mg - 1 Tablet - Twice Daily - 5 days
                </div>
                <div className="text-muted-foreground">
                  Omeprazole 20mg - 1 tablet - Before breakfast - 7 days
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
 
      {/* Billing History */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-foreground">
            <DollarSign className="w-5 h-5 text-blue-500" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm font-medium text-foreground mb-2">
              Latest Billing
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Mon 21 July, 2:30 PM
                </span>
              </div>
              <div className="text-sm space-y-1">
                <div className="text-muted-foreground">CPT Code: 99213</div>
                <div className="text-muted-foreground">
                  Description: Follow-up Consultation
                </div>
                <div className="font-medium text-foreground">Charge: $150</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
 }

