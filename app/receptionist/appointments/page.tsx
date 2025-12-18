"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import OnboardingForm from "./onboarding-form";

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
  const dispatch = useDispatch();
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
console.log('Patient Appointments:', patientAppointments);
console.log(dummyAppointments , 'dummyAppointments');
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

  // const filteredAppointments = useMemo(() => {
  //   let list = [...patientAppointments];
  //   // if (filterTab === "Upcoming") {
  //   //   list = list.filter(
  //   //     (a) => a.status === "pending" || a.status === "confirmed"
  //   //   );
  //   // } else if (filterTab === "Canceled") {
  //   //   list = list.filter((a) => a.status === "cancelled");
  //   // }

  //   // if (searchQuery.trim()) {
  //   //   const q = searchQuery.toLowerCase();
  //   //   list = list.filter(
  //   //     (a) =>
  //   //       a.doctorName.toLowerCase().includes(q) ||
  //   //       a.type.toLowerCase().includes(q)
  //   //   );
  //   // }

  //   if (sortBy === "Monthly") {
  //     list.sort(
  //       (a, b) =>
  //         parseAppointmentDate(a).getTime() - parseAppointmentDate(b).getTime()
  //     );
  //   } else if (sortBy === "Weekly") {
  //     const order = {
  //       confirmed: 0,
  //       pending: 1,
  //       completed: 2,
  //       cancelled: 3,
  //     } as const;
  //     list.sort((a, b) => order[a.status] - order[b.status]);
  //   }

  //   return list;
  // }, [patientAppointments, filterTab, searchQuery, sortBy]);

  // console.log('Filtered Appointments:', filteredAppointments);

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
    dispatch(updateAppointment({ ...cancelTarget, status: "cancelled" }));
    setShowCancelDialog(false);
    setCancelTarget(null);
  };

  const statusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-[#1DA68F] text-white";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
    }
  };

  if (showOnboarding) {
    return <OnboardingForm onClose={closeOnboarding} />;
  }

  return (
    <ProtectedRoute allowedRoles={["receptionist"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="px-6 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                  Appointments
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Schedule and manage your appointments
                </p>
              </div>
              <Button
                onClick={() => router.push("/receptionist/appointments/book")}
                className="bg-[#1DA68F] hover:bg-[#168f73] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Appointment
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Main Appointment Card */}
              <div>
                <Card className="bg-white dark:bg-gray-800 shadow-sm h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Upcoming Appointment
                      </h2>
                    </div>

                    <div className="space-y-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex-1">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                            Annual Physical Exam
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-2">
                            Dr. Sarah Smith - Internal Medicine
                          </p>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            July 30, 2024 at 4:00 PM
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                            Confirmed
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleReschedule}
                          variant="outline"
                          className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
                        >
                          Reschedule
                        </Button>
                        <Button
                          // onClick={ onCancel(appointment)}
                          variant="outline"
                          className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stats Cards */}
              <div className="space-y-4 h-full flex flex-col">
                <Card className="bg-white dark:bg-gray-800 shadow-sm flex-1">
                  <CardContent className="p-4 h-full flex items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Total Visits This Year
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          32
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800 shadow-sm flex-1">
                  <CardContent className="p-4 h-full flex items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Appointments Scheduled
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          03
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
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                }`}
              >
                <Calendar className="h-4 w-4" /> Calendar View
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 ${
                  viewMode === "list"
                    ? "bg-[#1DA68F] text-white hover:bg-[#168f73]"
                    : "text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                }`}
              >
                <List className="h-4 w-4" /> Appointment List View
              </Button>
            </div>

            {viewMode === "calendar" ? (
              <CalendarView events={calendarEvents} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
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
                              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                              : "text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                          }`}
                        >
                          {tab}
                        </Button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search Appointment"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 w-full sm:w-64 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        />
                      </div>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[140px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
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
                    <thead className="bg-[#F8F9FA] dark:bg-gray-700/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          DOCTOR
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          DATE
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          TIME
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          SERVICE
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          STATUS
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {dummyAppointments.map((appointment) => (
                        <tr
                          key={appointment.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            Dr. {appointment.doctorName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {new Date(appointment.date).toLocaleDateString(
                              "en-US",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {appointment.time}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
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
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
                                  <MoreHorizontal className="h-5 w-5" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push("/patient/appointments/book")
                                  }
                                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  Schedule
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={handleReschedule}
                                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  Reschedule
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => onCancel(appointment)}
                                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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

                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      Previous
                    </button>
                    <button className="px-3 py-2 text-sm bg-[#1DA68F] text-white rounded font-medium">
                      1
                    </button>
                    <button className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      2
                    </button>
                    <button className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                      Next
                    </button>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    10 / Pages
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="bg-white dark:bg-gray-800 border-0 shadow-xl max-w-lg mx-auto rounded-lg">
          <div className="p-3">
            <DialogHeader className="flex flex-row items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                </div>
                <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Appointment Cancel
                </DialogTitle>
              </div>
              <button
                onClick={() => setShowCancelDialog(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
              </button>
            </DialogHeader>
            {cancelTarget && (
              <div className="space-y-4">
                <div className="bg-[#D1F2EB] dark:bg-[#1DA68F]/10 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {cancelTarget.type}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Dr. {cancelTarget.doctorName} - Internal Medicine
                  </p>
                  <p className="text-[#1DA68F] text-sm font-medium">
                    {new Date(cancelTarget.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    at {cancelTarget.time}
                  </p>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Are you sure you want to cancel this appointment?
                </p>
                <Button
                  onClick={confirmCancel}
                  className="w-full bg-[#1DA68F] hover:bg-[#168f73] text-white py-3 rounded-lg font-medium"
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
