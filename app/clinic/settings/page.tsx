"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Plus, Trash2, Camera, ArrowRight, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/ui/protected-route"

type SettingsSection = "availability" | "roles" | "profile" | "appearance"

interface TimeSlot {
  id: string
  start: string
  end: string
}

interface DaySchedule {
  [key: string]: TimeSlot[]
}

export function DoctorSettings() {
  const router = useRouter()
  const [currentSection, setCurrentSection] = useState<SettingsSection>("roles")
  const [showAddPatientModal, setShowAddPatientModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [patientData, setPatientData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [selectedRole, setSelectedRole] = useState<string>("doctor")
  const [selectedDays, setSelectedDays] = useState({
    sun: true,
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: true,
  })

  const [schedule, setSchedule] = useState<DaySchedule>({
    sunday: [{ id: "1", start: "01:00 PM", end: "02:00 PM" }],
    monday: [{ id: "2", start: "09:00 AM", end: "10:00 PM" }],
    tuesday: [{ id: "3", start: "09:00 AM", end: "10:00 PM" }],
    wednesday: [{ id: "4", start: "09:00 AM", end: "10:00 PM" }],
    thursday: [{ id: "5", start: "09:00 AM", end: "10:00 PM" }],
    friday: [{ id: "6", start: "09:00 AM", end: "10:00 PM" }],
    saturday: [{ id: "7", start: "09:00 AM", end: "10:00 PM" }],
  })

  const [permissions, setPermissions] = useState({
    dashboard: true,
    viewAppointments: true,
    accessBilling: true,
  })

  const [profileData, setProfileData] = useState({
    firstName: "Steven",
    lastName: "Adesanya",
    email: "doctor@clinic.ai",
    phone: "",
    specialty: "General Practice",
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const [selectedColor, setSelectedColor] = useState<string>("#1DA68F")
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false)

  const colorPalette = [
    "#1DA68F", // Current teal
    "#3B82F6", // Blue
    "#8B5CF6", // Purple
    "#EF4444", // Red
    "#F59E0B", // Orange
    "#10B981", // Green
    "#EC4899", // Pink
    "#6B7280", // Gray
    "#1F2937", // Dark gray
    "#7C3AED", // Violet
    "#DC2626", // Dark red
    "#059669", // Dark green
  ]

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
  }

  const days = [
    { key: "sun", label: "Sun", full: "sunday" },
    { key: "mon", label: "Mon", full: "monday" },
    { key: "tue", label: "Tue", full: "tuesday" },
    { key: "wed", label: "Wed", full: "wednesday" },
    { key: "thu", label: "Thu", full: "thursday" },
    { key: "fri", label: "Fri", full: "friday" },
    { key: "sat", label: "Sat", full: "saturday" },
  ]

  const addTimeSlot = (day: string) => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: "09:00 AM",
      end: "10:00 PM",
    }
    setSchedule((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), newSlot],
    }))
  }

  const removeTimeSlot = (day: string, slotId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day]?.filter((slot) => slot.id !== slotId) || [],
    }))
  }

  const updateTimeSlot = (day: string, slotId: string, field: "start" | "end", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day]?.map((slot) => (slot.id === slotId ? { ...slot, [field]: value } : slot)) || [],
    }))
  }

  const handleBack = () => {
    if (currentSection === "roles" || currentSection === "profile" || currentSection === "appearance") {
      setCurrentSection("availability")
    } else {
      router.push("/settings")
    }
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (2.5MB limit)
      if (file.size > 2.5 * 1024 * 1024) {
        alert("File size must be less than 2.5MB")
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }

      setLogoFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const renderSidebar = () => (
    <div className="w-full sm:w-64 bg-card border-b sm:border-b-0 sm:border-r border-border p-4 sm:min-h-0">
      <div
        className="flex items-center gap-2 mb-6 cursor-pointer hover:text-foreground transition-colors"
        onClick={handleBack}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm text-muted-foreground">Back</span>
      </div>

      <h2 className="font-semibold text-foreground mb-4">Manage Users</h2>

      <div className="space-y-2">
        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            currentSection === "appearance" ? "bg-[#1DA68F] text-white" : "text-muted-foreground hover:bg-muted/50"
          }`}
          onClick={() => setCurrentSection("appearance")}
        >
          <span className="w-6 h-6 rounded-full bg-[#1DA68F] text-white text-xs flex items-center justify-center font-medium">
            1
          </span>
          <span className="text-sm">Clinic Info</span>
        </div>

        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            currentSection === "profile" ? "bg-[#1DA68F] text-white" : "text-muted-foreground hover:bg-muted/50"
          }`}
          onClick={() => setCurrentSection("profile")}
        >
          <span className="w-6 h-6 rounded-full bg-[#1DA68F] text-white text-xs flex items-center justify-center font-medium">
            2
          </span>
          <span className="text-sm">User Info</span>
        </div>

        <div
          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
            currentSection === "roles" ? "bg-[#1DA68F] text-white" : "text-muted-foreground hover:bg-muted/50"
          }`}
          onClick={() => setCurrentSection("roles")}
        >
          <span className="w-6 h-6 rounded-full bg-[#1DA68F] text-white text-xs flex items-center justify-center font-medium">
            3
          </span>
          <span className="text-sm">Roles & Permissions</span>
        </div>
      </div>
    </div>
  )

  const renderAvailabilitySection = () => (
    <div className="flex-1 p-6 bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and system settings</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            className="bg-[#1DA68F] hover:bg-[#1DA68F]/80 text-white px-4 py-2 w-full sm:w-auto"
            onClick={() => setShowAddPatientModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Patient
          </Button>
          <Button
            className="bg-[#1DA68F] hover:bg-[#1DA68F]/80 text-white px-4 py-2 w-full sm:w-auto"
            onClick={() => setCurrentSection("appearance")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Other Settings
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Manage Availability</h2>

        <div className="mb-6">
          <Label className="text-sm font-medium text-foreground mb-2 block">Time Zone</Label>
          <Select defaultValue="gmt+5">
            <SelectTrigger className="w-full sm:w-64 bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="gmt+5" className="text-foreground hover:bg-muted/50">
                GMT + 05:00 Asia/Karachi (PKT)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Available Hours</h3>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant="outline"
              size="sm"
              className="text-[#1DA68F] border-[#1DA68F]/20 hover:bg-[#1DA68F]/10 bg-background"
              onClick={() =>
                setSelectedDays((prev) => {
                  const allSelected = Object.values(prev).every(Boolean)
                  return {
                    sun: !allSelected,
                    mon: !allSelected,
                    tue: !allSelected,
                    wed: !allSelected,
                    thu: !allSelected,
                    fri: !allSelected,
                    sat: !allSelected,
                  }
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
                    ? "bg-[#1DA68F]/10 text-[#1DA68F] border-[#1DA68F]/20"
                    : "text-muted-foreground border-border bg-background hover:bg-muted/50"
                }`}
                onClick={() => setSelectedDays((prev) => ({ ...prev, [day.key]: !prev[day.key as keyof typeof prev] }))}
              >
                {day.label}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {days.map((day) => (
              <div key={day.full} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-full sm:w-20 text-sm text-foreground capitalize font-medium">{day.full}</div>
                <div className="flex-1 space-y-2">
                  {schedule[day.full]?.map((slot) => (
                    <div key={slot.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <Input
                        value={slot.start}
                        onChange={(e) => updateTimeSlot(day.full, slot.id, "start", e.target.value)}
                        className="w-full sm:w-24 text-sm bg-background border-border"
                      />
                      <span className="text-muted-foreground text-sm hidden sm:inline">To</span>
                      <Input
                        value={slot.end}
                        onChange={(e) => updateTimeSlot(day.full, slot.id, "end", e.target.value)}
                        className="w-full sm:w-24 text-sm bg-background border-border"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeSlot(day.full, slot.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 w-full sm:w-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addTimeSlot(day.full)}
                    className="text-[#1DA68F] hover:text-[#1DA68F]/80 hover:bg-[#1DA68F]/10 w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Time
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button className="bg-[#1DA68F] hover:bg-[#1DA68F]/80 text-white w-full sm:w-auto">Update Availability</Button>
      </div>
    </div>
  )

  const renderRolesSection = () => (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {renderSidebar()}
      <div className="flex-1 p-6 bg-background">
        <h1 className="text-xl font-semibold text-foreground mb-6">Roles & Permissions</h1>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-6">
            <Label className="text-sm font-medium text-foreground mb-2 block">Select Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="doctor" className="text-foreground hover:bg-muted/50">
                  Doctor
                </SelectItem>
                <SelectItem value="admin" className="text-foreground hover:bg-muted/50">
                  Admin
                </SelectItem>
                <SelectItem value="assistant" className="text-foreground hover:bg-muted/50">
                  Assistant
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-foreground">Dashboard</h3>
                <Switch
                  checked={permissions.dashboard}
                  onCheckedChange={(checked) => setPermissions((prev) => ({ ...prev, dashboard: checked }))}
                />
              </div>
              <div className="space-y-2 ml-4">
                {rolePermissions[selectedRole as keyof typeof rolePermissions]?.dashboard?.map((permissionText, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Checkbox id={`dashboard-${i}`} />
                    <Label htmlFor={`dashboard-${i}`} className="text-sm text-muted-foreground">
                      {permissionText}
                    </Label>
                  </div>
                )) || []}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-foreground">View Appointments</h3>
                <Switch
                  checked={permissions.viewAppointments}
                  onCheckedChange={(checked) => setPermissions((prev) => ({ ...prev, viewAppointments: checked }))}
                />
              </div>
              <div className="space-y-2 ml-4">
                {rolePermissions[selectedRole as keyof typeof rolePermissions]?.viewAppointments?.map(
                  (permissionText, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Checkbox id={`appointments-${i}`} />
                      <Label htmlFor={`appointments-${i}`} className="text-sm text-muted-foreground">
                        {permissionText}
                      </Label>
                    </div>
                  ),
                ) || []}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-foreground">Access Billing</h3>
                <Switch
                  checked={permissions.accessBilling}
                  onCheckedChange={(checked) => setPermissions((prev) => ({ ...prev, accessBilling: checked }))}
                />
              </div>
              <div className="space-y-2 ml-4">
                {rolePermissions[selectedRole as keyof typeof rolePermissions]?.accessBilling?.map(
                  (permissionText, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Checkbox id={`billing-${i}`} />
                      <Label htmlFor={`billing-${i}`} className="text-sm text-muted-foreground">
                        {permissionText}
                      </Label>
                    </div>
                  ),
                ) || []}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-muted/50 bg-transparent">
              Cancel
            </Button>
            <Button className="flex-1 bg-[#1DA68F] hover:bg-[#1DA68F]/80 text-white">Save</Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProfileSection = () => (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {renderSidebar()}
      <div className="flex-1 p-6 bg-background">
        <h1 className="text-xl font-semibold text-foreground mb-6">Profile Settings</h1>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-6">
            <Label className="text-sm font-medium text-foreground mb-2 block">Profile Image</Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/caring-doctor.png" />
                  <AvatarFallback className="bg-muted text-muted-foreground">SA</AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1DA68F] hover:bg-[#1DA68F]/80 p-0"
                >
                  <Camera className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                The Proposed size is 512 x 512 px and no longer bigger than 2.5 MBs
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-foreground mb-1 block">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={profileData.firstName}
                onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                className="bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-foreground mb-1 block">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={profileData.lastName}
                onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground mb-1 block">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                className="bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-foreground mb-1 block">
                Phone
              </Label>
              <Input
                id="phone"
                placeholder="Phone"
                value={profileData.phone}
                onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                className="bg-background border-border placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="specialty" className="text-sm font-medium text-foreground mb-1 block">
              Specialty
            </Label>
            <Input
              id="specialty"
              value={profileData.specialty}
              onChange={(e) => setProfileData((prev) => ({ ...prev, specialty: e.target.value }))}
              className="bg-background border-border"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-muted/50 bg-transparent">
              Cancel
            </Button>
            <Button className="flex-1 bg-[#1DA68F] hover:bg-[#1DA68F]/80 text-white">
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAppearanceSection = () => (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {renderSidebar()}
      <div className="flex-1 p-6 bg-background">
        <h1 className="text-xl font-semibold text-foreground mb-6">Change Dashboard Appearance</h1>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="mb-6">
            <Label className="text-sm font-medium text-foreground mb-2 block">Change Logo</Label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative">
                <div
                  className="w-32 h-20 bg-muted rounded border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors overflow-hidden"
                  onClick={() => document.getElementById("logo-upload")?.click()}
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview || "/placeholder.svg"}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-lg font-bold text-muted-foreground">Logo</span>
                  )}
                </div>
                <Button
                  size="sm"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1DA68F] hover:bg-[#1DA68F]/80 p-0"
                  onClick={() => document.getElementById("logo-upload")?.click()}
                >
                  <Camera className="w-3 h-3" />
                </Button>
                <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="font-medium text-foreground">Logo</div>
                <div>The Proposed size is 512 x 512 px and no longer bigger than 2.5 MBs</div>
                {logoFile && (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("logo-upload")?.click()}
                      className="text-xs"
                    >
                      Choose File
                    </Button>
                    <span className="ml-2 text-xs text-muted-foreground">{logoFile.name}</span>
                  </div>
                )}
                {!logoFile && (
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("logo-upload")?.click()}
                      className="text-xs"
                    >
                      Choose File
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <Label className="text-sm font-medium text-foreground mb-2 block">Change Color</Label>
            <div className="space-y-3">
              {/* Current color display */}
              <div
                className="w-20 h-12 rounded border border-border cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: selectedColor }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />

              {/* Color picker palette */}
              {showColorPicker && (
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <div className="grid grid-cols-6 gap-2 mb-3">
                    {colorPalette.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                          selectedColor === color
                            ? "border-foreground shadow-md"
                            : "border-border hover:border-foreground/50"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setSelectedColor(color)
                          setShowColorPicker(false)
                        }}
                        title={color}
                      />
                    ))}
                  </div>

                  {/* Custom color input */}
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground">Custom:</Label>
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-8 h-8 rounded border border-border cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="flex-1 text-xs bg-background border-border"
                      placeholder="#1DA68F"
                    />
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Click the color box to choose a new theme color for your dashboard
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-muted/50 bg-transparent">
              Cancel
            </Button>
            <Button className="flex-1 bg-[#1DA68F] hover:bg-[#1DA68F]/80 text-white">
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const handleAddPatient = () => {
    setShowAddPatientModal(true)
  }

  const handleCloseAddPatientModal = () => {
    setShowAddPatientModal(false)
    setPatientData({ name: "", email: "", phone: "" })
  }

  const handleOnboardPatient = () => {
    // Here you would typically save the patient data
    setShowAddPatientModal(false)
    setShowSuccessModal(true)
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    setPatientData({ name: "", email: "", phone: "" })
  }

  const handleAddNewPatient = () => {
    setShowSuccessModal(false)
    setPatientData({ name: "", email: "", phone: "" })
    setShowAddPatientModal(true)
  }

  const renderAddPatientModal = () =>
    showAddPatientModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg shadow-lg w-full max-w-md border border-border">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Add Patient</h2>
            <button onClick={handleCloseAddPatientModal} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <Label htmlFor="patientName" className="text-sm font-medium text-foreground mb-1 block">
                Patient Name
              </Label>
              <Input
                id="patientName"
                placeholder="Enter Patient Name"
                value={patientData.name}
                onChange={(e) => setPatientData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-background border-border placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <Label htmlFor="patientEmail" className="text-sm font-medium text-foreground mb-1 block">
                Email
              </Label>
              <Input
                id="patientEmail"
                placeholder="Enter Email"
                type="email"
                value={patientData.email}
                onChange={(e) => setPatientData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full bg-background border-border placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <Label htmlFor="patientPhone" className="text-sm font-medium text-foreground mb-1 block">
                Phone Number
              </Label>
              <Input
                id="patientPhone"
                placeholder="Enter Phone Number"
                value={patientData.phone}
                onChange={(e) => setPatientData((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-background border-border placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex gap-3 p-6 pt-0">
            <Button
              variant="outline"
              onClick={handleCloseAddPatientModal}
              className="flex-1 bg-muted text-muted-foreground border-border hover:bg-muted/80"
            >
              Cancel
            </Button>
            <Button onClick={handleOnboardPatient} className="flex-1 bg-[#1DA68F] hover:bg-[#1DA68F]/80 text-white">
              Onboard Patient
            </Button>
          </div>
        </div>
      </div>
    )

  const renderSuccessModal = () =>
    showSuccessModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg shadow-lg w-full max-w-md border border-border">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Patient Onboarded</h2>
            <button onClick={handleCloseSuccessModal} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 text-center">
            <div className="mb-4 flex ">
              <img src="/images/success-checkmark.png" alt="Success" className="w-16 h-16" />
            </div>
            <p className="text-muted-foreground mb-6">
              {patientData.name || "Sara John"} has been added, Click Add new Patient Button to add another Patient
            </p>
          </div>

          <div className="flex gap-3 p-6 pt-0">
            <Button
              variant="outline"
              onClick={handleCloseSuccessModal}
              className="flex-1 bg-muted text-muted-foreground border-border hover:bg-muted/80"
            >
              Cancel
            </Button>
            <Button onClick={handleAddNewPatient} className="flex-1 bg-[#1DA68F] hover:bg-[#1DA68F]/80 text-white">
              Add New Patient
            </Button>
          </div>
        </div>
      </div>
    )

  return (
    <ProtectedRoute allowedRoles={["clinic"]}>
      <div className="min-h-screen bg-background">
        {currentSection === "availability" && renderAvailabilitySection()}
        {currentSection === "roles" && renderRolesSection()}
        {currentSection === "profile" && renderProfileSection()}
        {currentSection === "appearance" && renderAppearanceSection()}
        {renderAddPatientModal()}
        {renderSuccessModal()}
      </div>
    </ProtectedRoute>
  )
}

export default DoctorSettings
