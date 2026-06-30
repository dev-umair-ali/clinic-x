"use client"

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Heart,
  Shield,
  Paperclip,
  Scissors,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "moment";
import { fetchClinicPatient } from "@/lib/slices/clinicPatientSlice"
import { fetchClinicDoctors } from "@/lib/slices/patientSlice"

export default function ViewPatientPage() {
  const router = useRouter();
  const params = useParams();
  const { loading } = useSelector((state: RootState) => state.clinicPatients);
  const { clinicDoctors } = useSelector((state: RootState) => state.patients);
  const { clinicPatient } = useSelector((state: RootState) => state.clinicPatients)

  const { user } = useSelector((state: RootState) => state.auth)

  const dispatch = useDispatch<AppDispatch>();
  const patientId = params.id as string;
  const [activeTab, setActiveTab] = useState<"overview" | "appointments">("overview");
  const [activeAppointmentTab, setActiveAppointmentTab] = useState("upcoming");
  const [doctorName, setDoctorName] = useState("")
  const patient = clinicPatient;

  useEffect(() => {
    if (patientId) dispatch(fetchClinicPatient(patientId))

  }, [dispatch, patientId])
  // Fetch doctors when clinic is selected
  useEffect(() => {
    if (user && 'clinicRef' in user && user.clinicRef) {
      dispatch(fetchClinicDoctors(user.clinicRef as string));
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["clinic"]}>
        <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--color-brand-teal))] mx-auto mb-4"></div>
            <p className="text-[hsl(var(--muted-foreground))]">Loading patient details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!patient) {
    return (
      <ProtectedRoute allowedRoles={["clinic"]}>
        <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-[hsl(var(--color-status-error))] mx-auto mb-4" />
            <p className="text-[hsl(var(--muted-foreground))]">Patient not found</p>
            <Button onClick={() => router.push("/clinic/patients")} className="mt-4">
              Back to Patients
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Helper function to format address
  const formatAddress = (address: any) => {
    if (typeof address === "string") {
      return address;
    } else if (address && typeof address === "object") {
      const parts = [];
      if (address.street) parts.push(address.street);
      if (address.city) parts.push(address.city);
      if (address.state) parts.push(address.state);
      if (address.zipCode) parts.push(address.zipCode);
      if (address.country) parts.push(address.country);
      return parts.length > 0 ? parts.join(", ") : "Address not specified";
    }
    return "Address not specified";
  };

  // Helper function to format text fields
  const formatTextField = (value: any, fallback: string) => {
    if (typeof value === "string") {
      return value;
    } else if (value && typeof value === "object") {
      return JSON.stringify(value);
    }
    return fallback;
  };

  // Helper function to check if a field has data
  const hasData = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim().length > 0;
    if (typeof value === "number") return true;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") return Object.keys(value).length > 0;
    return Boolean(value);
  };

  // Helper function to render field conditionally
  const renderField = (icon: React.ReactNode, label: string, value: any, fallback: string = "N/A") => {
    if (!hasData(value)) return null;

    return (
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{label}</p>
          <p className="font-medium text-[hsl(var(--foreground))]">
            {formatTextField(value, fallback)}
          </p>
        </div>
      </div>
    );
  };

  // Helper function to check if overview tab has data
  const hasOverviewData = () => {
    return hasData(patient.medicalHistory)
      || hasData(patient.allergies)
      || hasData(patient.currentMedication);
  };

  // Helper function to check if appointments tab has data
  const hasAppointmentsData = () => {
    return true; // For now, always show appointments tab
  };

  const appointments = [
    {
      date: "15/01/2024",
      time: "10:00 AM",
      doctor: "Dr. Sarah Johnson",
      type: "Follow-up",
      status: "completed",
    },
    {
      date: "22/01/2024",
      time: "2:30 PM",
      doctor: "Dr. Michael Chen",
      type: "Consultation",
      status: "upcoming",
    },
    {
      date: "05/02/2024",
      time: "9:15 AM",
      doctor: "Dr. Sarah Johnson",
      type: "Check-up",
      status: "scheduled",
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["clinic"]}>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-6 py-4 mb-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push("/clinic/patients")}
                  className="text-[hsl(var(--muted-foreground))]"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="ml-2 text-sm font-medium">Back to Patients</span>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Patient Details</h1>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">View and manage patient information</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/clinic/patients/edit/${patientId}`)}
                  className="border-[hsl(var(--color-brand-teal))] text-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal))] hover:text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Patient
                </Button>
              </div>
            </div>
          </div>

          {/* Patient Profile Card */}
          <Card className="border-[hsl(var(--border))] shadow-sm mb-6">
            <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                <User className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                Patient Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-[hsl(var(--card))]">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={patient.profilePicture || "/placeholder.svg?height=80&width=80"} alt={patient.firstName ? `${patient.firstName} ${patient.lastName}` : "Patient"} />
                  <AvatarFallback className="text-2xl bg-[hsl(var(--color-brand-teal))] text-white">
                    {patient.firstName ? patient.firstName.charAt(0).toUpperCase() + patient.lastName.charAt(0).toUpperCase() : "P"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">
                    {patient.firstName && patient.lastName ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient"}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-[hsl(var(--muted-foreground))]">
                    <span>Patient ID: {(patient as any)._id || "N/A"}</span>
                    <Badge
                      variant={patient.status === "active" ? "default" : "secondary"}
                      className={patient.status === "active" ? "bg-[hsl(var(--color-status-success)/0.1)] text-[hsl(var(--color-status-success))]" : ""}
                    >
                      {patient.status || "Unknown"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Information Section */}
          <Card className="border-[hsl(var(--border))] shadow-sm mb-6">
            <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                <User className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-[hsl(var(--card))]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderField(
                  <Mail className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />,
                  "Email",
                  patient.email
                )}
                {renderField(
                  <Phone className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />,
                  "Phone Number",
                  patient.phoneNumber
                )}
                {renderField(
                  <MapPin className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />,
                  "Address",
                  formatAddress(patient.address),
                  "Address not specified"
                )}
                {renderField(
                  <Calendar className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />,
                  "Date of Birth",
                  moment(patient.dateOfBirth).format('YYYY-MM-DD')
                )}

                {renderField(
                  <User className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />,
                  "Gender",
                  patient.gender
                )}

                {renderField(
                  <User className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />,
                  "Primary Doctor",
                  (patient?.doctorRef as any)?.firstName + " " + (patient?.doctorRef as any)?.lastName || "No doctor assigned"
                )}
                {renderField(
                  <Shield className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />,
                  "Insurance Provider",
                  patient.insuranceProvider || patient.insuranceInfo
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section - Only show if there's data for any tab */}
          {(hasOverviewData() || hasAppointmentsData()) && (
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <Heart className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Medical Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="border-b border-[hsl(var(--border))] mb-6">
                  <nav className="flex space-x-8">
                    {hasOverviewData() && (
                      <button
                        className={`py-4 px-1 border-b-2 ${activeTab === "overview"
                          ? "border-[hsl(var(--color-brand-teal))] text-[hsl(var(--color-brand-teal))]"
                          : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                          } font-medium text-sm`}
                        onClick={() => setActiveTab("overview")}
                      >
                        Overview
                      </button>
                    )}
                    {hasAppointmentsData() && (
                      <button
                        className={`py-4 px-1 border-b-2 ${activeTab === "appointments"
                          ? "border-[hsl(var(--color-brand-teal))] text-[hsl(var(--color-brand-teal))]"
                          : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                          } font-medium text-sm`}
                        onClick={() => setActiveTab("appointments")}
                      >
                        Appointments
                      </button>
                    )}
                  </nav>
                </div>

                {activeTab === "overview" && hasOverviewData() && (
                  <div>
                    {/* Key Patient Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <div className="bg-[hsl(var(--accent))] rounded-lg p-4 border border-[hsl(var(--border))]">
                        <div className="flex items-center gap-3">
                          <User className="h-8 w-8 text-[hsl(var(--color-brand-teal))]" />
                          <div>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">Age</p>
                            <p className="text-lg font-semibold text-[hsl(var(--foreground))]">
                              {patient.age || "N/A"} Years old
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[hsl(var(--accent))] rounded-lg p-4 border border-[hsl(var(--border))]">
                        <div className="flex items-center gap-3">
                          <Heart className="h-8 w-8 text-[hsl(var(--color-brand-teal))]" />
                          <div>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">Blood Type</p>
                            <p className="text-lg font-semibold text-[hsl(var(--foreground))]">
                              {patient.bloodType || "Unknown"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[hsl(var(--accent))] rounded-lg p-4 border border-[hsl(var(--border))]">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-8 w-8 text-[hsl(var(--color-brand-teal))]" />
                          <div>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">Last Visit</p>
                            <p className="text-lg font-semibold text-[hsl(var(--foreground))]">
                              {patient.lastVisit || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[hsl(var(--accent))] rounded-lg p-4 border border-[hsl(var(--border))]">
                        <div className="flex items-center gap-3">
                          <Shield className="h-8 w-8 text-[hsl(var(--color-brand-teal))]" />
                          <div>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">Insurance</p>
                            <p className="text-lg font-semibold text-[hsl(var(--foreground))]">
                              {patient.insuranceProvider || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Medical History Section - Only show if there's medical data */}
                    {hasOverviewData() && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-1">
                            Medical History
                          </h3>
                          <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            Comprehensive medical background and conditions
                          </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Critical Allergies - Only show if there are allergies */}
                          {(hasData(patient.allergies)) && (
                            <div className="bg-[hsl(var(--color-status-error-light))] border border-[hsl(var(--color-status-error))] rounded-lg p-4">
                              <h4 className="font-semibold text-[hsl(var(--color-status-error))] mb-3 uppercase text-sm tracking-wide">
                                Critical Allergies
                              </h4>
                              <div className="space-y-2">
                                {patient.allergies && (
                                  <div className="flex items-center justify-between rounded-md bg-white/70 dark:bg-[hsl(var(--color-status-error-dark))/0.2] px-3 py-2">
                                    <span className="text-[hsl(var(--color-status-error))] text-sm">
                                      {patient.allergies}
                                    </span>
                                    <Badge className="bg-[hsl(var(--color-status-error))/0.1] text-[hsl(var(--color-status-error))] text-xs">
                                      Critical
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Medical Conditions - Only show if there's medical history */}
                          {(hasData(patient.medicalHistory)) && (
                            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Heart className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                                <h4 className="font-semibold text-[hsl(var(--foreground))]">
                                  Medical Conditions
                                </h4>
                              </div>
                              <div className="space-y-2">
                                {patient.medicalHistory && (
                                  <div className="text-sm text-[hsl(var(--foreground))]">
                                    {patient.medicalHistory}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Current Medications - Only show if there are medications */}
                          {(hasData(patient.currentMedication)) && (
                            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Paperclip className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                                <h4 className="font-semibold text-[hsl(var(--foreground))]">
                                  Current Medications
                                </h4>
                              </div>
                              <div className="space-y-2">
                                {patient.currentMedication && (
                                  <div className="text-sm text-[hsl(var(--foreground))]">
                                    {patient.currentMedication}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Surgical History - Only show if there's surgical history */}
                          {hasData((patient as any).surgicalHistory) && (
                            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <Scissors className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                                <h4 className="font-semibold text-[hsl(var(--foreground))]">
                                  Surgical History
                                </h4>
                              </div>
                              <div className="text-sm text-[hsl(var(--foreground))]">
                                {(patient as any).surgicalHistory}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "appointments" && (
                  <div>
                    <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Appointment History</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">Complete history of patient appointments</p>

                    <div className="border-b border-[hsl(var(--border))] mb-6">
                      <nav className="flex space-x-8">
                        <button
                          className={`py-2 px-1 border-b-2 ${activeAppointmentTab === "upcoming"
                            ? "border-[hsl(var(--color-brand-teal))] text-[hsl(var(--color-brand-teal))]"
                            : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                            } font-medium text-sm`}
                          onClick={() => setActiveAppointmentTab("upcoming")}
                        >
                          Upcoming
                        </button>
                        <button
                          className={`py-2 px-1 border-b-2 ${activeAppointmentTab === "completed"
                            ? "border-[hsl(var(--color-brand-teal))] text-[hsl(var(--color-brand-teal))]"
                            : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
                            } font-medium text-sm`}
                          onClick={() => setActiveAppointmentTab("completed")}
                        >
                          Completed
                        </button>
                      </nav>
                    </div>

                    <div className="space-y-4">
                      {/* {appointments
                        .filter((appointment) => appointment.status === activeAppointmentTab)
                        .map((appointment, index) => (
                          <div
                            key={index}
                            className="bg-[hsl(var(--accent))] rounded-lg p-4 border border-[hsl(var(--border))]"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                                  <span className="font-medium text-[hsl(var(--foreground))]">{appointment.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                                  <span className="text-[hsl(var(--muted-foreground))]">{appointment.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                                  <span className="text-[hsl(var(--muted-foreground))]">{appointment.doctor}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    appointment.status === "completed"
                                      ? "default"
                                      : appointment.status === "upcoming"
                                      ? "secondary"
                                      : "outline"
                                  }
                                  className={
                                    appointment.status === "completed"
                                      ? "bg-[hsl(var(--color-status-success)/0.1)] text-[hsl(var(--color-status-success))]"
                                      : appointment.status === "upcoming"
                                      ? "bg-[hsl(var(--color-status-info)/0.1)] text-[hsl(var(--color-status-info))]"
                                      : ""
                                  }
                                >
                                  {appointment.status}
                                </Badge>
                                <span className="text-sm text-[hsl(var(--muted-foreground))]">{appointment.type}</span>
                              </div>
                            </div>
                          </div>
                        ))} */}
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <p className="text-sm text-[hsl(var(--muted-foreground))]">Showing 1-3 of 3 appointments</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>
                          Previous
                        </Button>
                        <Button variant="outline" size="sm">
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}