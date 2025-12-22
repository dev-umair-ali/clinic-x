"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Plus, Trash2, Camera, ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";

type SettingsSection = "availability" | "roles";

interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

interface DaySchedule {
  [key: string]: TimeSlot[];
}

export function DoctorSettings() {
  const router = useRouter();
  const [currentSection, setCurrentSection] =
    useState<SettingsSection>("roles");
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [patientData, setPatientData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [selectedRole, setSelectedRole] = useState<string>("doctor");
  const [selectedDays, setSelectedDays] = useState({
    sun: true,
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: true,
  });

  const [schedule, setSchedule] = useState<DaySchedule>({
    sunday: [{ id: "1", start: "01:00 PM", end: "02:00 PM" }],
    monday: [{ id: "2", start: "09:00 AM", end: "10:00 PM" }],
    tuesday: [{ id: "3", start: "09:00 AM", end: "10:00 PM" }],
    wednesday: [{ id: "4", start: "09:00 AM", end: "10:00 PM" }],
    thursday: [{ id: "5", start: "09:00 AM", end: "10:00 PM" }],
    friday: [{ id: "6", start: "09:00 AM", end: "10:00 PM" }],
    saturday: [{ id: "7", start: "09:00 AM", end: "10:00 PM" }],
  });

  const [permissions, setPermissions] = useState({
    dashboard: true,
    viewAppointments: true,
    accessBilling: true,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const rolePermissions = {
    doctor: {
      dashboard: [
        "View patient statistics",
        "Access medical records",
        "Review appointment history",
        "Generate medical reports",
        "Monitor treatment progress",
      ],
      viewAppointments: [
        "Schedule patient appointments",
        "Modify appointment times",
        "Cancel appointments",
        "View patient notes",
        "Send appointment reminders",
      ],
      accessBilling: [
        "View treatment costs",
        "Generate invoices",
        "Track payment status",
        "Apply insurance claims",
        "Review billing history",
      ],
    },
    admin: {
      dashboard: [
        "Manage system settings",
        "View all user activities",
        "Access administrative reports",
        "Monitor system performance",
        "Configure user permissions",
      ],
      viewAppointments: [
        "Manage all appointments",
        "Override scheduling conflicts",
        "Access staff schedules",
        "Generate appointment reports",
        "Configure booking settings",
      ],
      accessBilling: [
        "Full billing management",
        "Process refunds",
        "Manage payment methods",
        "Configure billing rates",
        "Export financial reports",
      ],
    },
    assistant: {
      dashboard: [
        "View assigned patients",
        "Access care protocols",
        "Monitor vital signs",
        "Update patient status",
        "Review medication schedules",
      ],
      viewAppointments: [
        "View patient appointments",
        "Prepare examination rooms",
        "Update appointment status",
        "Coordinate with doctors",
        "Manage waiting lists",
      ],
      accessBilling: [
        "View basic billing info",
        "Record treatment procedures",
        "Update insurance details",
        "Verify patient information",
        "Process co-payments",
      ],
    },
  };

  const days = [
    { key: "sun", label: "Sun", full: "sunday" },
    { key: "mon", label: "Mon", full: "monday" },
    { key: "tue", label: "Tue", full: "tuesday" },
    { key: "wed", label: "Wed", full: "wednesday" },
    { key: "thu", label: "Thu", full: "thursday" },
    { key: "fri", label: "Fri", full: "friday" },
    { key: "sat", label: "Sat", full: "saturday" },
  ];

  const addTimeSlot = (day: string) => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: "09:00 AM",
      end: "10:00 PM",
    };
    setSchedule((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), newSlot],
    }));
  };

  const removeTimeSlot = (day: string, slotId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day]?.filter((slot) => slot.id !== slotId) || [],
    }));
  };

  const updateTimeSlot = (
    day: string,
    slotId: string,
    field: "start" | "end",
    value: string
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [day]:
        prev[day]?.map((slot) =>
          slot.id === slotId ? { ...slot, [field]: value } : slot
        ) || [],
    }));
  };

  const handleBack = () => {
    if (currentSection === "availability") {
      router.push("/settings");
    } else {
      setCurrentSection("availability");
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (2.5MB limit)
      if (file.size > 2.5 * 1024 * 1024) {
        alert("File size must be less than 2.5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      setLogoFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderSidebar = () => (
    <div className="w-full sm:w-64 bg-[hsl(var(--card))] border-b sm:border-b-0 sm:border-r border-[hsl(var(--border))] p-4 sm:min-h-0">
      <div
        className="flex items-center gap-2 mb-6 cursor-pointer hover:text-[hsl(var(--foreground))] transition-colors"
        onClick={handleBack}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm text-[hsl(var(--muted-foreground))]">
          Back
        </span>
      </div>

      <h2 className="font-semibold text-[hsl(var(--card-foreground))] mb-4">
        Manage Users
      </h2>

      <div className="space-y-2">
        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            currentSection === "roles"
              ? "bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))]"
              : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]"
          }`}
          onClick={() => setCurrentSection("roles")}
        >
          <span className="w-6 h-6 rounded-full bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))] text-xs flex items-center justify-center font-medium">
            1
          </span>
          <span className="text-sm">Roles & Permissions</span>
        </div>
      </div>
    </div>
  );

  const renderAvailabilitySection = () => (
    <div className="flex-1 p-6 bg-[hsl(var(--background))] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-1">
            Settings
          </h1>
          <p className="text-[hsl(var(--muted-foreground))]">
            Manage your account preferences and system settings
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))] px-4 py-2 w-full sm:w-auto"
            onClick={() => setShowAddPatientModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      <div className="bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))] p-6">
        <h2 className="text-lg font-semibold text-[hsl(var(--card-foreground))] mb-6">
          Manage Availability
        </h2>

        <div className="mb-6">
          <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
            Time Zone
          </Label>
          <Select defaultValue="gmt+5">
            <SelectTrigger className="w-full sm:w-64 bg-[hsl(var(--background))] border-[hsl(var(--border))]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
              <SelectItem
                value="gmt+5"
                className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
              >
                GMT + 05:00 Asia/Karachi (PKT)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6">
          <h3 className="text-base font-semibold text-[hsl(var(--foreground))] mb-4">
            Available Hours
          </h3>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant="outline"
              size="sm"
              className="text-[hsl(var(--color-brand-teal))] border-[hsl(var(--color-brand-teal)/0.2)] hover:bg-[hsl(var(--color-brand-teal)/0.1)] bg-[hsl(var(--background))]"
              onClick={() =>
                setSelectedDays((prev) => {
                  const allSelected = Object.values(prev).every(Boolean);
                  return {
                    sun: !allSelected,
                    mon: !allSelected,
                    tue: !allSelected,
                    wed: !allSelected,
                    thu: !allSelected,
                    fri: !allSelected,
                    sat: !allSelected,
                  };
                })
              }
            >
              Select All
            </Button>
            {days.map((day) => (
              <Button
                key={day.key}
                variant="outline"
                size="sm"
                className={`${
                  selectedDays[day.key as keyof typeof selectedDays]
                    ? "bg-[hsl(var(--color-brand-teal)/0.1)] text-[hsl(var(--color-brand-teal))] border-[hsl(var(--color-brand-teal)/0.2)]"
                    : "text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--accent))]"
                }`}
                onClick={() =>
                  setSelectedDays((prev) => ({
                    ...prev,
                    [day.key]: !prev[day.key as keyof typeof prev],
                  }))
                }
              >
                {day.label}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {days.map((day) => (
              <div
                key={day.full}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div className="w-full sm:w-20 text-sm text-[hsl(var(--foreground))] capitalize font-medium">
                  {day.full}
                </div>
                <div className="flex-1 space-y-2">
                  {schedule[day.full]?.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-2"
                    >
                      <Input
                        value={slot.start}
                        onChange={(e) =>
                          updateTimeSlot(
                            day.full,
                            slot.id,
                            "start",
                            e.target.value
                          )
                        }
                        className="w-full sm:w-24 text-sm bg-[hsl(var(--background))] border-[hsl(var(--border))]"
                      />
                      <span className="text-[hsl(var(--muted-foreground))] text-sm hidden sm:inline">
                        To
                      </span>
                      <Input
                        value={slot.end}
                        onChange={(e) =>
                          updateTimeSlot(
                            day.full,
                            slot.id,
                            "end",
                            e.target.value
                          )
                        }
                        className="w-full sm:w-24 text-sm bg-[hsl(var(--background))] border-[hsl(var(--border))]"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeSlot(day.full, slot.id)}
                        className="text-[hsl(var(--color-status-error))] hover:text-[hsl(var(--color-status-error-dark))] hover:bg-[hsl(var(--color-status-error-light))] w-full sm:w-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addTimeSlot(day.full)}
                    className="text-[hsl(var(--color-brand-teal))] hover:text-[hsl(var(--color-brand-teal-dark))] hover:bg-[hsl(var(--color-brand-teal-light))] w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Time
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))] w-full sm:w-auto">
          Update Availability
        </Button>
      </div>
    </div>
  );

  const renderRolesSection = () => (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {renderSidebar()}
      <div className="flex-1 p-6 bg-[hsl(var(--background))]">
        <h1 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-6">
          Roles & Permissions
        </h1>

        <div className="bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))] p-6">
          <div className="mb-6">
            <Label className="text-sm font-medium text-[hsl(var(--foreground))] mb-2 block">
              Select Role
            </Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="bg-[hsl(var(--background))] border-[hsl(var(--border))]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
                <SelectItem
                  value="doctor"
                  className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
                >
                  Doctor
                </SelectItem>
                <SelectItem
                  value="admin"
                  className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
                >
                  Admin
                </SelectItem>
                <SelectItem
                  value="assistant"
                  className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
                >
                  Assistant
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-[hsl(var(--foreground))]">
                  Dashboard
                </h3>
                <Switch
                  checked={permissions.dashboard}
                  onCheckedChange={(checked) =>
                    setPermissions((prev) => ({ ...prev, dashboard: checked }))
                  }
                    className="data-[state=checked]:bg-[hsl(var(--color-brand-teal))]"

                />
              </div>
              <div className="space-y-2 ml-4">
                {rolePermissions[
                  selectedRole as keyof typeof rolePermissions
                ]?.dashboard?.map((permissionText, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dashboard-${i}`}
                      className="data-[state=checked]:bg-[hsl(var(--color-brand-teal))] data-[state=checked]:border-[hsl(var(--color-brand-teal))]"
                    />{" "}
                    <Label
                      htmlFor={`dashboard-${i}`}
                      className="text-sm text-[hsl(var(--muted-foreground))]"
                    >
                      {permissionText}
                    </Label>
                  </div>
                )) || []}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-[hsl(var(--foreground))]">
                  View Appointments
                </h3>
                <Switch
                  checked={permissions.viewAppointments}
                  onCheckedChange={(checked) =>
                    setPermissions((prev) => ({
                      ...prev,
                      viewAppointments: checked,
                    }))
                  }
                    className="data-[state=checked]:bg-[hsl(var(--color-brand-teal))]"

                />
              </div>
              <div className="space-y-2 ml-4">
                {rolePermissions[
                  selectedRole as keyof typeof rolePermissions
                ]?.viewAppointments?.map((permissionText, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Checkbox id={`appointments-${i}`} />
                    <Label
                      htmlFor={`appointments-${i}`}
                      className="text-sm text-[hsl(var(--muted-foreground))]"
                    >
                      {permissionText}
                    </Label>
                  </div>
                )) || []}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-[hsl(var(--foreground))]">
                  Access Billing
                </h3>
                <Switch
                  checked={permissions.accessBilling}
                  onCheckedChange={(checked) =>
                    setPermissions((prev) => ({
                      ...prev,
                      accessBilling: checked,
                    }))
                  }
                    className="data-[state=checked]:bg-[hsl(var(--color-brand-teal))]"

                />
              </div>
              <div className="space-y-2 ml-4">
                {rolePermissions[
                  selectedRole as keyof typeof rolePermissions
                ]?.accessBilling?.map((permissionText, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Checkbox id={`billing-${i}`} />
                    <Label
                      htmlFor={`billing-${i}`}
                      className="text-sm text-[hsl(var(--muted-foreground))]"
                    >
                      {permissionText}
                    </Label>
                  </div>
                )) || []}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              variant="outline"
              className="flex-1 border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] bg-transparent"
            >
              Cancel
            </Button>
            <Button className="flex-1 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))]">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleAddPatient = () => {
    setShowAddPatientModal(true);
  };

  const handleCloseAddPatientModal = () => {
    setShowAddPatientModal(false);
    setPatientData({ name: "", email: "", phone: "" });
  };

  const handleOnboardPatient = () => {
    // Here you would typically save the patient data
    setShowAddPatientModal(false);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setPatientData({ name: "", email: "", phone: "" });
  };

  const handleAddNewPatient = () => {
    setShowSuccessModal(false);
    setPatientData({ name: "", email: "", phone: "" });
    setShowAddPatientModal(true);
  };

  const renderAddPatientModal = () =>
    showAddPatientModal && (
      <div className="fixed inset-0 bg-[hsl(var(--color-black)/0.5)] flex items-center justify-center z-50 p-4">
        <div className="bg-[hsl(var(--card))] rounded-lg shadow-lg w-full max-w-md border border-[hsl(var(--border))]">
          <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
            <h2 className="text-lg font-semibold text-[hsl(var(--card-foreground))]">
              Add Patient
            </h2>
            <button
              onClick={handleCloseAddPatientModal}
              className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--card-foreground))]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <Label
                htmlFor="patientName"
                className="text-sm font-medium text-[hsl(var(--foreground))] mb-1 block"
              >
                Patient Name
              </Label>
              <Input
                id="patientName"
                placeholder="Enter Patient Name"
                value={patientData.name}
                onChange={(e) =>
                  setPatientData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full bg-[hsl(var(--background))] border-[hsl(var(--border))] placeholder:text-[hsl(var(--muted-foreground))]"
              />
            </div>

            <div>
              <Label
                htmlFor="patientEmail"
                className="text-sm font-medium text-[hsl(var(--foreground))] mb-1 block"
              >
                Email
              </Label>
              <Input
                id="patientEmail"
                placeholder="Enter Email"
                type="email"
                value={patientData.email}
                onChange={(e) =>
                  setPatientData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full bg-[hsl(var(--background))] border-[hsl(var(--border))] placeholder:text-[hsl(var(--muted-foreground))]"
              />
            </div>

            <div>
              <Label
                htmlFor="patientPhone"
                className="text-sm font-medium text-[hsl(var(--foreground))] mb-1 block"
              >
                Phone Number
              </Label>
              <Input
                id="patientPhone"
                placeholder="Enter Phone Number"
                value={patientData.phone}
                onChange={(e) =>
                  setPatientData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full bg-[hsl(var(--background))] border-[hsl(var(--border))] placeholder:text-[hsl(var(--muted-foreground))]"
              />
            </div>
          </div>

          <div className="flex gap-3 p-6 pt-0">
            <Button
              variant="outline"
              onClick={handleCloseAddPatientModal}
              className="flex-1 bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))/0.8]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleOnboardPatient}
              className="flex-1 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))]"
            >
              Onboard Patient
            </Button>
          </div>
        </div>
      </div>
    );

  const renderSuccessModal = () =>
    showSuccessModal && (
      <div className="fixed inset-0 bg-[hsl(var(--color-black)/0.5)] flex items-center justify-center z-50 p-4">
        <div className="bg-[hsl(var(--card))] rounded-lg shadow-lg w-full max-w-md border border-[hsl(var(--border))]">
          <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))]">
            <h2 className="text-lg font-semibold text-[hsl(var(--card-foreground))]">
              Patient Onboarded
            </h2>
            <button
              onClick={handleCloseSuccessModal}
              className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--card-foreground))]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 text-center">
            <div className="mb-4 flex ">
              <img
                src="/images/success-checkmark.png"
                alt="Success"
                className="w-16 h-16"
              />
            </div>
            <p className="text-[hsl(var(--muted-foreground))] mb-6">
              {patientData.name || "Sara John"} has been added, Click Add new
              Patient Button to add another Patient
            </p>
          </div>

          <div className="flex gap-3 p-6 pt-0">
            <Button
              variant="outline"
              onClick={handleCloseSuccessModal}
              className="flex-1 bg-[hsl(var(--accent))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))] hover:bg-[hsl(var(--accent))/0.8]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddNewPatient}
              className="flex-1 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))]"
            >
              Add New Patient
            </Button>
          </div>
        </div>
      </div>
    );

  return (
    <ProtectedRoute allowedRoles={["clinic"]}>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        {currentSection === "availability" && renderAvailabilitySection()}
        {currentSection === "roles" && renderRolesSection()}
        {renderAddPatientModal()}
        {renderSuccessModal()}
      </div>
    </ProtectedRoute>
  );
}

export default DoctorSettings;
