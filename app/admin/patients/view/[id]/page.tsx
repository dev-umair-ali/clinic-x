"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Heart,
  Shield,
  Paperclip,
  Scissors,
  Edit,
  ChevronDown,
} from "lucide-react";
import type { AppDispatch, RootState } from "@/lib/store";
import { fetchPatient } from "@/lib/slices/patientSlice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ViewPatientPage() {
  const params = useParams();
  const router = useRouter();
  const { patient, loading } = useSelector(
    (state: RootState) => state.patients
  );
  const dispatch = useDispatch<AppDispatch>();
  const patientId = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [activeAppointmentTab, setActiveAppointmentTab] = useState("upcoming"); // State for appointment tabs

  useEffect(() => {
    // Fetch specific patient data when component mounts
    if (patientId) {
      dispatch(fetchPatient(patientId));
    }
  }, [dispatch, patientId]);

  // Debug effect to track when patient data changes
  useEffect(() => {
    if (patient) {
      console.log("[v0] View page - Patient data updated:", patient);
    }
  }, [patient]);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading patient profile...
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!patient) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Patient not found
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Looking for patient ID: {patientId}
            </p>
            <Button
              onClick={() => router.push("/admin/patients")}
              className="mt-4"
            >
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
      if (address.country) parts.push(address.country);
      if (address.zipCode) parts.push(address.zipCode);
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

  const appointments = [
    {
      date: "15/01/2024",
      time: "10:00 AM",
      type: "Follow-up",
      doctor: "Dr. Sarah Johnson",
      status: "Scheduled",
    },
    {
      date: "15/01/2024",
      time: "10:00 AM",
      type: "Follow-up",
      doctor: "Dr. Sarah Johnson",
      status: "Scheduled",
    },
    {
      date: "15/01/2024",
      time: "10:00 AM",
      type: "Follow-up",
      doctor: "Dr. Sarah Johnson",
      status: "Scheduled",
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
        {" "}
        {/* Added dark mode background */}
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className=" items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/admin/patients")}
              className="p-2 text-[#1DA68F] hover:bg-gray-100  dark:hover:bg-gray-800 bg-[#1DA68F]/10" // Added dark mode classes
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="ml-2 text-sm font-medium">
                Back to Patients
              </span>{" "}
              {/* Added "Back to Patients" text */}
            </Button>
            <h1 className="text-2xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-5">
              View Profile
            </h1>{" "}
            {/* Added dark mode text */}
          </div>

          {/* Patient Summary Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            {" "}
            {/* Added dark mode classes */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={patient.avatar || "/placeholder-user.jpg"}
                      alt={`${patient.firstName} ${patient.lastName}`}
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-lg dark:bg-gray-700 dark:text-gray-300">
                      {" "}
                      {/* Added dark mode classes */}
                      {patient.fullName
                        ? patient.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "PT"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {patient.firstName} {patient.lastName}
                    </h2>{" "}
                    {/* Added dark mode text */}
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {" "}
                      {/* Added dark mode classes */}
                      Active
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {patient.age} years old •{" "}
                    {patient.gender
                      ? patient.gender.charAt(0).toUpperCase() +
                        patient.gender.slice(1)
                      : "N/A"}
                  </p>{" "}
                  {/* Added dark mode text */}
                </div>
              </div>
              <Button
                onClick={() =>
                  router.push(`/admin/patients/edit/${patient.id}`)
                }
                className="bg-[#1DA68F] hover:bg-[#1DA68F]/80 text-white dark:bg-[#1DA68F] dark:hover:bg-[#1DA68F]/80 dark:text-white" // Added dark mode classes
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            </div>
          </div>

          {/* Patient Information Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            {" "}
            {/* Added dark mode classes */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Patient Information
            </h3>{" "}
            {/* Added dark mode text */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />{" "}
                {/* Added dark mode icon color */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </p>{" "}
                  {/* Added dark mode text */}
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {patient.email || "N/A"}
                  </p>{" "}
                  {/* Added dark mode text */}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />{" "}
                {/* Added dark mode icon color */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Phone
                  </p>{" "}
                  {/* Added dark mode text */}
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {patient.phone || "N/A"}
                  </p>{" "}
                  {/* Added dark mode text */}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />{" "}
                {/* Added dark mode icon color */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Address
                  </p>{" "}
                  {/* Added dark mode text */}
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {formatAddress(patient.address)}
                  </p>{" "}
                  {/* Added dark mode text */}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />{" "}
                {/* Added dark mode icon color */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Date of Birth
                  </p>{" "}
                  {/* Added dark mode text */}
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {patient.dateOfBirth || "N/A"}
                  </p>{" "}
                  {/* Added dark mode text */}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />{" "}
                {/* Added dark mode icon color */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Primary Doctor
                  </p>{" "}
                  {/* Added dark mode text */}
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Dr. Sarah Johnson
                  </p>{" "}
                  {/* Added dark mode text */}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />{" "}
                {/* Added dark mode icon color */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Clinic
                  </p>{" "}
                  {/* Added dark mode text */}
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Downtown Clinic
                  </p>{" "}
                  {/* Added dark mode text */}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-gray-400 dark:text-gray-500" />{" "}
                {/* Added dark mode icon color */}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Insurance
                  </p>{" "}
                  {/* Added dark mode text */}
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Blue Cross
                  </p>{" "}
                  {/* Added dark mode text */}
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            {" "}
            {/* Added dark mode classes */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Emergency Contact
            </h3>{" "}
            {/* Added dark mode text */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>{" "}
                {/* Added dark mode text */}
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Jane Smith
                </p>{" "}
                {/* Added dark mode text */}
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Phone
                </p>{" "}
                {/* Added dark mode text */}
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  (555) 111-2222
                </p>{" "}
                {/* Added dark mode text */}
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Relationship
                </p>{" "}
                {/* Added dark mode text */}
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Spouse
                </p>{" "}
                {/* Added dark mode text */}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {" "}
            {/* Added dark mode classes */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              {" "}
              {/* Added dark mode border */}
              <nav className="flex space-x-8 px-6">
                <button
                  className={`py-4 px-1 border-b-2 ${
                    activeTab === "overview"
                      ? "border-[#1DA68F] text-[#1DA68F]"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  } font-medium text-sm`} // Added dark mode classes
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`py-4 px-1 border-b-2 ${
                    activeTab === "appointments"
                      ? "border-[#1DA68F] text-[#1DA68F]"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  } font-medium text-sm`} // Added dark mode classes
                  onClick={() => setActiveTab("appointments")}
                >
                  Appointments
                </button>
              </nav>
            </div>
            {activeTab === "overview" && (
              <div className="p-6">
                {/* Key Patient Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    {" "}
                    {/* Added dark mode background */}
                    <div className="flex items-center gap-3">
                      <User className="h-8 w-8 text-[#1DA68F]" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Age
                        </p>{" "}
                        {/* Added dark mode text */}
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {patient.age} Years old
                        </p>{" "}
                        {/* Added dark mode text */}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    {" "}
                    {/* Added dark mode background */}
                    <div className="flex items-center gap-3">
                      <Heart className="h-8 w-8 text-[#1DA68F]" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Blood Type
                        </p>{" "}
                        {/* Added dark mode text */}
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {patient.bloodType || "A+"} Blood group
                        </p>{" "}
                        {/* Added dark mode text */}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    {" "}
                    {/* Added dark mode background */}
                    <div className="flex items-center gap-3">
                      <Calendar className="h-8 w-8 text-[#1DA68F]" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Last Visit
                        </p>{" "}
                        {/* Added dark mode text */}
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          15/01/2024 Latest appointment
                        </p>{" "}
                        {/* Added dark mode text */}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    {" "}
                    {/* Added dark mode background */}
                    <div className="flex items-center gap-3">
                      <Shield className="h-8 w-8 text-[#1DA68F]" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Allergies
                        </p>{" "}
                        {/* Added dark mode text */}
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          2 Known allergies
                        </p>{" "}
                        {/* Added dark mode text */}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical History Section */}
                <div className="space-y-6">
                  {/* Section Heading */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Medical History
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Comprehensive medical background and conditions
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Critical Allergies */}
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3 uppercase text-sm tracking-wide">
                        Critical Allergies
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between rounded-md bg-white dark:bg-red-900/40 px-3 py-2">
                          <span className="text-red-800 dark:text-red-200 text-sm">
                            Penicillin - Rash
                          </span>
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs">
                            Critical
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between rounded-md bg-white dark:bg-red-900/40 px-3 py-2">
                          <span className="text-red-800 dark:text-red-200 text-sm">
                            Shellfish - Hives
                          </span>
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs">
                            Critical
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Medical Conditions */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Heart className="h-5 w-5 text-[#1DA68F]" />
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          Medical Conditions
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Hypertension",
                          "Type 2 Diabetes",
                          "High Cholesterol",
                          "Asthma",
                        ].map((condition) => (
                          <span
                            key={condition}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Current Medications */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Paperclip className="h-5 w-5 text-[#1DA68F]" />
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          Current Medications
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Lisinopril 10mg daily",
                          "Metformin 500mg twice daily",
                          "Atorvastatin 20mg daily",
                          "Albuterol inhaler as needed",
                        ].map((med) => (
                          <span
                            key={med}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            {med}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Surgical History */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Scissors className="h-5 w-5 text-[#1DA68F]" />
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          Surgical History
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                Appendectomy
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                2018-03-15
                              </p>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              City General Hospital
                            </p>
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                Cholecystectomy
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                2020-11-08
                              </p>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Metropolitan Medical Center
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "appointments" && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Appointment History
                </h3>{" "}
                {/* Added dark mode text */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Complete history of patient appointments
                </p>{" "}
                {/* Added dark mode text */}
                {/* Appointment Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                  {" "}
                  {/* Added dark mode border */}
                  <nav className="flex space-x-4">
                    <button
                      className={`py-2 px-3 text-sm font-medium ${
                        activeAppointmentTab === "upcoming"
                          ? "border-b-2 border-[#1DA68F] text-[#1DA68F]"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      }`} // Added dark mode classes
                      onClick={() => setActiveAppointmentTab("upcoming")}
                    >
                      Upcoming
                    </button>
                    <button
                      className={`py-2 px-3 text-sm font-medium ${
                        activeAppointmentTab === "canceled"
                          ? "border-b-2 border-[#1DA68F] text-[#1DA68F]"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      }`} // Added dark mode classes
                      onClick={() => setActiveAppointmentTab("canceled")}
                    >
                      Canceled
                    </button>
                    <button
                      className={`py-2 px-3 text-sm font-medium ${
                        activeAppointmentTab === "all"
                          ? "border-b-2 border-[#1DA68F] text-[#1DA68F]"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      }`} // Added dark mode classes
                      onClick={() => setActiveAppointmentTab("all")}
                    >
                      All
                    </button>
                  </nav>
                </div>
                {/* Appointment Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-700">
                      {" "}
                      {/* Added dark mode background */}
                      <TableRow>
                        <TableHead className="text-gray-600 dark:text-gray-300">
                          DATE & TIME
                        </TableHead>{" "}
                        {/* Added dark mode text */}
                        <TableHead className="text-gray-600 dark:text-gray-300">
                          TYPE
                        </TableHead>{" "}
                        {/* Added dark mode text */}
                        <TableHead className="text-gray-600 dark:text-gray-300">
                          DOCTOR
                        </TableHead>{" "}
                        {/* Added dark mode text */}
                        <TableHead className="text-right text-gray-600 dark:text-gray-300">
                          STATUS
                        </TableHead>{" "}
                        {/* Added dark mode text */}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white dark:bg-gray-800">
                      {" "}
                      {/* Added dark mode background */}
                      {appointments.map((appointment, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                            {" "}
                            {/* Added dark mode text */}
                            {appointment.date} <br /> {appointment.time}
                          </TableCell>
                          <TableCell className="text-gray-700 dark:text-gray-300">
                            {appointment.type}
                          </TableCell>{" "}
                          {/* Added dark mode text */}
                          <TableCell className="text-gray-700 dark:text-gray-300">
                            {appointment.doctor}
                          </TableCell>{" "}
                          {/* Added dark mode text */}
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 bg-transparent"
                                >
                                  {" "}
                                  {/* Added dark mode classes */}
                                  {appointment.status}
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                              >
                                {" "}
                                {/* Added dark mode classes */}
                                <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                                  Scheduled
                                </DropdownMenuItem>{" "}
                                {/* Added dark mode classes */}
                                <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                                  Completed
                                </DropdownMenuItem>{" "}
                                {/* Added dark mode classes */}
                                <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                                  Canceled
                                </DropdownMenuItem>{" "}
                                {/* Added dark mode classes */}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Pagination */}
                <div className="flex items-center  mt-6">
                  <Button
                    variant="outline"
                    className="text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 bg-transparent"
                  >
                    Previous
                  </Button>{" "}
                  {/* Added dark mode classes */}
                  <div className="flex items-center gap-2">
                    <Button className="bg-[#1DA68F] hover:bg-[#1DA68F]/80 text-white dark:bg-[#1DA68F] dark:hover:bg-[#1DA68F]/80 dark:text-white">
                      1
                    </Button>{" "}
                    {/* Added dark mode classes */}
                    <Button
                      variant="outline"
                      className="text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 bg-transparent"
                    >
                      2
                    </Button>{" "}
                    {/* Added dark mode classes */}
                    <span className="text-gray-500 dark:text-gray-400">
                      ...
                    </span>{" "}
                    {/* Added dark mode text */}
                    <Button
                      variant="outline"
                      className="text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 bg-transparent"
                    >
                      10
                    </Button>{" "}
                    {/* Added dark mode classes */}
                    <span className="text-gray-500 dark:text-gray-400">
                      /Pages
                    </span>{" "}
                    {/* Added dark mode text */}
                  </div>
                  <Button
                    variant="outline"
                    className="text-gray-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 bg-transparent"
                  >
                    Next
                  </Button>{" "}
                  {/* Added dark mode classes */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
