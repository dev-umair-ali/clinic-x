"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EditAppointmentModal from "@/components/ui/edit-appointment-modal";
import PatientDetailsModal from "@/components/ui/patient-details-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarView } from "@/components/ui/calendar-view";
import {
  updateAppointment,
  type Appointment,
} from "@/lib/slices/appointmentSlice";
import {
  Calendar,
  List,
  MoreHorizontal,
  Search,
  Clock,
  CalendarCheck,
  X,
  ArrowLeft,
  Plus,
  DollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import OnboardingForm from "./onboarding/page";

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

function parseAppointmentDate(appointment: Appointment): Date {
  return new Date(`${appointment.date} ${appointment.time}`);
}

export default function PatientAppointmentsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { appointments } = useSelector(
    (state: RootState) => state.appointments
  );

  const dummyAppointments: Appointment[] = [
    {
      _id: "apt_001",
      doctorName: "Dr. Sarah Chen",
      doctor: "doc_101",
      patient: "user_1",
      dateTime: "2025-09-01T10:30:00Z",
      status: "pending",
      notes: "Routine checkup",
      createdAt: "2025-08-28T08:15:00Z",
    },
    {
      _id: "apt_002",
      doctorName: "Dr. John Smith",
      doctor: "doc_102",
      patient: "user_2",
      dateTime: "2025-08-25T14:00:00Z",
      status: "confirmed",
      createdAt: "2025-08-20T11:45:00Z",
    },
  ];

  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const patientAppointments = useMemo(
    () => dummyAppointments.filter((a) => a.patientId === currentUser?.id),
    [dummyAppointments, currentUser?.id]
  );

  const upcomingAppointment = useMemo(() => {
    const future = [...patientAppointments]
      .filter(
        (a) =>
          a.status !== "cancelled" &&
          parseAppointmentDate(a).getTime() >= Date.now()
      )
      .sort(
        (a, b) =>
          parseAppointmentDate(a).getTime() - parseAppointmentDate(b).getTime()
      );
    return future[0];
  }, [patientAppointments]);

  const visitsThisYear = useMemo(() => {
    const year = new Date().getFullYear();
    return patientAppointments.filter(
      (a) => a.status === "completed" && new Date(a.date).getFullYear() === year
    ).length;
  }, [patientAppointments]);

  const scheduledCount = useMemo(
    () =>
      patientAppointments.filter(
        (a) => a.status === "pending" || a.status === "confirmed"
      ).length,
    [patientAppointments]
  );

  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [filterTab, setFilterTab] = useState<"Upcoming" | "Canceled" | "All">(
    "Upcoming"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Monthly");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);

  const [showOnboarding, setShowOnboarding] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);

  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
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
    hasInsurance: "yes",
    insuranceCompany: "",
    policyholderName: "",
    relationshipToPatient: "",
    memberId: "",
    groupNumber: "",
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
    healthConditions: [],
    currentMedications: "",
    bloodThinners: "",
    surgicalHistory: "",
    allergies: "",
    exerciseRegularly: "",
    workType: "",
    sleepQuality: "",
    sleepSupports: "",
    tobaccoUse: "",
    alcoholUse: "",
    recreationalDrugs: "",
    pregnant: "",
    menstrualCycle: "",
    pmsSymptoms: "",
    hormonalSymptoms: "",
    posturalSymptoms: "",
    birthControl: "",
    pregnancyHistory: "",
    informationAccurate: false,
    consentTreatment: false,
    physicalExamination: false,
    privacyPolicy: false,
    digitalSignature: "",
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReschedule = () => {
    setShowOnboarding(true);
  };

  const closeOnboarding = () => {
    setShowOnboarding(false);
  };

  const calendarEvents = useMemo(
    () =>
      patientAppointments.map((apt) => ({
        id: apt.id,
        title: `${apt.type} - ${apt.doctorName}`,
        date: apt.date,
        status: apt.status,
        type: "appointment" as const,
      })),
    [patientAppointments]
  );

  const onCancel = (appointment: Appointment) => {
    setCancelTarget(appointment);
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    if (!cancelTarget) return;
    dispatch(
      updateAppointment({
        appointmentId: cancelTarget._id,
        appointmentData: { status: "cancelled" },
      })
    );
    setShowCancelDialog(false);
    setCancelTarget(null);
  };

  const statusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-[hsl(var(--color-brand-teal))] text-white";
      case "pending":
        return "bg-[hsl(var(--color-chart-orange)/0.1)] text-[hsl(var(--color-chart-orange))] dark:bg-[hsl(var(--color-chart-orange)/0.1)] dark:text-[hsl(var(--color-chart-orange))]";
      case "cancelled":
        return "bg-[hsl(var(--color-status-error)/0.1)] text-[hsl(var(--color-status-error))] dark:bg-[hsl(var(--color-status-error)/0.1)] dark:text-[hsl(var(--color-status-error))]";
      case "completed":
        return "bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] dark:bg-[hsl(var(--color-chart-blue)/0.1)] dark:text-[hsl(var(--color-chart-blue))]";
      default:
        return "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] dark:bg-[hsl(var(--muted))] dark:text-[hsl(var(--muted-foreground))]";
    }
  };

  if (showOnboarding) {
    return <OnboardingForm />;
  }

  return (
    <ProtectedRoute allowedRoles={["assistant"]}>
      <div className="min-h-screen bg-[hsl(var(--color-gray-50))] dark:bg-[hsl(var(--background))]">
        <div className="px-6 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-1">
                  Appointments
                </h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                  Schedule and manage your appointments
                </p>
              </div>
              <Button
                onClick={() => router.push("/assistant/appointments/book")}
                className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Appointment
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Card className="bg-[hsl(var(--card))] shadow-sm h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]" />
                      <h2 className="text-lg font-semibold text-[hsl(var(--card-foreground))] dark:text-[hsl(var(--card-foreground))]">
                        Upcoming Appointment
                      </h2>
                    </div>

                    <div className="space-y-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] p-4 rounded-lg flex-1">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-1">
                            Annual Physical Exam
                          </h3>
                          <p className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mb-2">
                            Dr. Sarah Smith - Internal Medicine
                          </p>
                          <p className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-sm">
                            July 30, 2024 at 4:00 PM
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[hsl(var(--color-status-success-light))] dark:bg-[hsl(var(--color-status-success-light))] text-white dark:text-white">
                            {" "}
                            Confirmed
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => {
                            setEditingAppointment(dummyAppointments[0]);
                            setShowEditModal(true);
                          }}
                          variant="outline"
                          className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] dark:hover:bg-[hsl(var(--muted))] bg-transparent"
                        >
                          Reschedule
                        </Button>
                        <Button
                          onClick={() => onCancel(dummyAppointments[0])}
                          variant="outline"
                          className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] dark:hover:bg-[hsl(var(--muted))] bg-transparent"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4 h-full flex flex-col">
                <Card className="bg-[hsl(var(--card))] shadow-sm flex-1">
                  <CardContent className="p-4 h-full flex items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.1)] rounded-lg">
                        <Clock className="h-5 w-5 text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))]" />
                      </div>
                      <div>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                          Total Visits This Year
                        </p>
                        <p className="text-2xl font-bold text-[hsl(var(--card-foreground))] dark:text-[hsl(var(--card-foreground))]">
                          32
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>


                 <Card className="bg-[hsl(var(--card))] shadow-sm flex-1">
                  <CardContent className="p-4 h-full flex items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.1)] rounded-lg">
                        <DollarSign  className="h-5 w-5 text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))]" />
                      </div>
                      <div>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                          Appointments Scheduled
                        </p>
                        <p className="text-2xl font-bold text-[hsl(var(--card-foreground))] dark:text-[hsl(var(--card-foreground))]">
                          32
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                onClick={() => setViewMode("calendar")}
                className={`flex items-center gap-2 ${
                  viewMode === "calendar"
                    ? "bg-[hsl(var(--foreground))] text-[hsl(var(--background))] dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]"
                    : "text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))] bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))]"
                }`}
              >
                <Calendar className="h-4 w-4" /> Calendar View
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 ${
                  viewMode === "list"
                    ? "bg-[hsl(var(--color-brand-teal))] text-white hover:bg-[hsl(var(--color-brand-teal-dark))]"
                    : "text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))] bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))]"
                }`}
              >
                <List className="h-4 w-4" /> Appointment List View
              </Button>
            </div>

            {viewMode === "calendar" ? (
              <CalendarView events={calendarEvents} />
            ) : (
              <div className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
                <div className="p-6 border-b border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
                  <h3 className="text-lg font-semibold text-[hsl(var(--card-foreground))] dark:text-[hsl(var(--card-foreground))] mb-4">
                    Appointment List View
                  </h3>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                      {(["Upcoming", "Canceled", "All"] as const).map((tab) => (
                        <Button
                          key={tab}
                          variant={filterTab === tab ? "default" : "outline"}
                          onClick={() => setFilterTab(tab)}
                          className={`text-sm px-4 py-2 ${
                            filterTab === tab
                              ? "bg-[hsl(var(--foreground))] text-[hsl(var(--background))] dark:bg-[hsl(var(--background))] dark:text-[hsl(var(--foreground))]"
                              : "text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))] bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))]"
                          }`}
                        >
                          {tab}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] h-4 w-4" />
                        <Input
                          placeholder="Search Appointment"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 w-full sm:w-64 border-[hsl(var(--border))] dark:border-[hsl(var(--border))] bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))]"
                        />
                      </div>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[140px] border-[hsl(var(--border))] dark:border-[hsl(var(--border))] bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))]">
                          <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))]">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] uppercase tracking-wider">
                          DOCTOR
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] uppercase tracking-wider">
                          DATE
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] uppercase tracking-wider">
                          TIME
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] uppercase tracking-wider">
                          SERVICE
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] uppercase tracking-wider">
                          STATUS
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] divide-y divide-[hsl(var(--border))] dark:divide-[hsl(var(--border))]">
                      {dummyAppointments.map((appointment) => (
                        <tr
                          key={appointment.id}
                          className="hover:bg-[hsl(var(--muted))] dark:hover:bg-[hsl(var(--muted))]"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                            Dr. {appointment.doctorName}
                          </td>
                          <td className="px-6 py-4 text-sm text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                            {new Date(appointment.date).toLocaleDateString(
                              "en-US",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                            {appointment.time}
                          </td>
                          <td className="px-6 py-4 text-sm text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                            {appointment.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${statusColor(
                                appointment.status
                              )}`}
                            >
                              {appointment.status.charAt(0).toUpperCase() +
                                appointment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] dark:hover:text-[hsl(var(--foreground))] p-1">
                                  <MoreHorizontal className="h-5 w-5" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] border border-[hsl(var(--border))] dark:border-[hsl(var(--border))]"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push("/patient/appointments/book")
                                  }
                                  className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] dark:hover:bg-[hsl(var(--muted))]"
                                >
                                  Mark Complete
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditingAppointment(appointment);
                                    setShowEditModal(true);
                                  }}
                                  className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] dark:hover:bg-[hsl(var(--muted))]"
                                >
                                  Reschedule
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onCancel(appointment)}
                                  className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] dark:hover:bg-[hsl(var(--muted))]"
                                >
                                  Cancel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-4 border-t border-[hsl(var(--border))] dark:border-[hsl(var(--border))] flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button className="px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] dark:hover:text-[hsl(var(--foreground))]">
                      Previous
                    </button>
                    <button className="px-3 py-2 text-sm bg-[hsl(var(--color-brand-teal))] text-white rounded font-medium">
                      1
                    </button>
                    <button className="px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] dark:hover:text-[hsl(var(--foreground))]">
                      2
                    </button>
                    <button className="px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] dark:hover:text-[hsl(var(--foreground))]">
                      Next
                    </button>
                  </div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                    10 / Pages
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditAppointmentModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        appointment={editingAppointment}
        onSaved={() => {
          console.log("onSaved fired – opening patient details");
          setShowEditModal(false);
          const patient = {
            _id: editingAppointment?.patient?.id || "dummy",
            name: editingAppointment?.patientName || "Emma Wilson",
            patientId: "#PAT-2024-001",
            email: "sarah.johnson@email.com",
            phone: "(555) 123-4567",
            dateOfBirth: "1992-03-15",
            age: 32,
            gender: "Female",
            bloodType: "O+",
            address: "123 Main St, City, State 12345",
            lastVisit: "Dec 15, 2024",
            avatar: "/placeholder.svg?height=80&width=80",
          };
          setSelectedPatient(patient);
          setTimeout(() => setShowPatientDetails(true), 0); // ← only this line changed
        }}
        onError={(msg) => setError(msg)}
      />

      <PatientDetailsModal
        open={showPatientDetails}
        onClose={() => setShowPatientDetails(false)}
        patient={selectedPatient}
      />

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] border-0 shadow-xl max-w-lg mx-auto rounded-lg">
          <div className="p-3">
            <DialogHeader className="flex flex-row items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[hsl(var(--color-status-error)/0.1)] dark:bg-[hsl(var(--color-status-error)/0.1)] rounded-full flex items-center justify-center"></div>
                <DialogTitle className="text-lg font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                  Appointment Cancel
                </DialogTitle>
              </div>
              <button
                onClick={() => setShowCancelDialog(false)}
                className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] dark:hover:text-[hsl(var(--foreground))]"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogHeader>
            {cancelTarget && (
              <div className="space-y-4">
                <div className="bg-[hsl(var(--color-brand-teal-light))] dark:bg-[hsl(var(--color-brand-teal)/0.1)] rounded-lg p-4">
                  <h4 className="font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-1">
                    {cancelTarget.type}
                  </h4>
                  <p className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-sm mb-2">
                    Dr. {cancelTarget.doctorName} - Internal Medicine
                  </p>
                  <p className="text-[hsl(var(--color-brand-teal))] text-sm font-medium">
                    {new Date(cancelTarget.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    at {cancelTarget.time}
                  </p>
                </div>
                <p className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-sm">
                  Are you sure you want to cancel this appointment?
                </p>
                <Button
                  onClick={confirmCancel}
                  className="w-full bg-[hsl(var(--color-status-error))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white py-3 rounded-lg font-medium"
                >
                  Yes, Cancel Appointment
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}
