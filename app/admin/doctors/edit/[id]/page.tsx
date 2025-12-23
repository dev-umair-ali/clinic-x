"use client";

import type React from "react";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { updateDoctor, fetchDoctors, fetchDoctor } from "@/lib/slices/doctorSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Camera, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import type { AppDispatch, RootState } from "@/lib/store";
import type { Doctor } from "@/lib/slices/doctorSlice";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import moment from "moment";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

interface AvailableDay {
  day: string;
  from: string;
  to: string;
}

export default function EditDoctorPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const doctorId = params.id as string;

  const { doctor, doctors, loading: doctorsLoading } = useSelector(
    (state: RootState) => state.doctors
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    specialization: "",
    assignedClinic: "",
    languages: [] as string[],
    experience: "",
    licenseNumber: "",
    bio: "",
    educationSummary: "",
    address: "",
    status: "active",
    role: "doctor" as const,
    hipaaConsent: true,
    timeZone: "Asia/Karachi",
    profilePicture: "",
    availableDays: [
      { day: "Sunday", from: "09:00", to: "17:00" },
      { day: "Monday", from: "09:00", to: "17:00" },
      { day: "Tuesday", from: "09:00", to: "17:00" },
      { day: "Wednesday", from: "09:00", to: "17:00" },
      { day: "Thursday", from: "09:00", to: "17:00" },
      { day: "Friday", from: "09:00", to: "17:00" },
      { day: "Saturday", from: "09:00", to: "17:00" },
    ] as AvailableDay[],
  });

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);
  const [patient, setPatient] = useState<Doctor | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch specific doctor data when component mounts
    if (doctorId) {
      dispatch(fetchDoctor(doctorId));

    }
  }, [dispatch, doctorId]);

  // Populate form data when single doctor is loaded
  useEffect(() => {
    if (doctor && doctor.id === doctorId) {
      setSelectedDays(doctor.availableDays?.map((day) => day.day as string) || [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ]);
      setPatient(doctor);
      setFormData({
        firstName: doctor.firstName || "",
        lastName: doctor.lastName || "",
        name:
          doctor.name ||
          `${doctor.firstName || ""} ${doctor.lastName || ""
            }`.trim(),
        email: doctor.email || "",
        password: "", // Don't populate password for security
        phone: doctor.phone || "",
        age: doctor.age?.toString() || "",
        dateOfBirth: doctor.dateOfBirth || "",
        gender: doctor.gender || "",
        address: typeof doctor.address === "string"
          ? doctor.address
          : "",
        specialization: doctor.specialization || "",
        assignedClinic: doctor.assignedClinic || "Downtown Clinic",
        languages: doctor.languages || ["English", "Spanish"],
        experience: doctor.experience?.toString() || "",
        licenseNumber: typeof doctor.licenseNumber === "string" ? doctor.licenseNumber : "",
        bio: typeof doctor.bio === "string" ? doctor.bio : "",
        educationSummary: typeof doctor.educationSummary === "string" ? doctor.educationSummary : "",
        status: doctor.status || "active",
        role: "doctor",
        hipaaConsent: doctor.hipaaConsent ?? true,
        timeZone: doctor.timeZone || "Asia/Karachi",
        profilePicture: doctor.profilePicture || "",
        availableDays: doctor.availableDays || [
          { day: "Sunday", from: "09:00", to: "17:00" },
          { day: "Monday", from: "09:00", to: "17:00" },
          { day: "Tuesday", from: "09:00", to: "17:00" },
          { day: "Wednesday", from: "09:00", to: "17:00" },
          { day: "Thursday", from: "09:00", to: "17:00" },
          { day: "Friday", from: "09:00", to: "17:00" },
          { day: "Saturday", from: "09:00", to: "17:00" },
        ],

      });
    }
  }, [doctor, doctorId]);



  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    // Auto-concatenate first name and last name for full name
    if (name === "firstName" || name === "lastName") {
      const firstName = name === "firstName" ? value : formData.firstName;
      const lastName = name === "lastName" ? value : formData.lastName;
      updatedFormData.name = `${firstName} ${lastName}`.trim();
    }

    setFormData(updatedFormData);
  };

  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleTimeChange = (
    day: string,
    field: "from" | "to",
    value: string
  ) => {
    const updatedDays = formData.availableDays.map((availableDay) =>
      availableDay.day === day
        ? { ...availableDay, [field]: value }
        : availableDay
    );
    setFormData({ ...formData, availableDays: updatedDays });
  };

  const addTimeSlot = (day: string) => {
    const updatedDays = [
      ...formData.availableDays,
      { day, from: "09:00", to: "17:00" },
    ];
    setFormData({ ...formData, availableDays: updatedDays });
  };

  const removeTimeSlot = (index: number) => {
    const updatedDays = formData.availableDays.filter((_, i) => i !== index);
    setFormData({ ...formData, availableDays: updatedDays });
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    // Get the authentication token from localStorage
    const token = localStorage.getItem('clinic-ai-token');

    if (!token) {
      toast.error('No authentication token found. Please login again.');
      return "";
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}api/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      toast.error(errorData.message || 'Failed to upload image');
      return "";
    }

    const result = await response.json();
    return result.fileUrl || result.profilePicture || result.data?.fileUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;
    setLoading(true);

    try {
      // Filter availableDays to only include selected days
      const filteredAvailableDays = formData.availableDays.filter(daySlot =>
        selectedDays.includes(daySlot.day)
      );

      const doctorData = {
        ...formData,
        age: Number.parseInt(formData.age),
        experience: Number.parseInt(formData.experience),
        gender: formData.gender as "male" | "female" | "other",
        status: formData.status as "active" | "inactive",
        timeZone: formData.timeZone,
        availableDays: filteredAvailableDays,
        profilePicture: formData.profilePicture || profileImage,
      };

      const response = await dispatch(updateDoctor({ id: doctorId, doctorData }));
      if (response.payload === "Doctor updated successfully") {
        toast.success("Doctor updated successfully!");
        setLoading(false);
        return;
      } else {
        toast.error(response.payload as string);
        setLoading(false);
      }
    } catch (err: any) {
      toast.error(err);
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (2.5MB)
      if (file.size > 2.5 * 1024 * 1024) {
        toast.error("Image size should not exceed 2.5MB");
        return;
      }

      setImageUploading(true);
      setImageFile(file);

      try {
        // Upload image to server
        const profilePicture = await uploadImage(file);
        // Update form data with the uploaded image URL
        setFormData(prev => ({
          ...prev,
          profilePicture: profilePicture
        }));

        // Set preview image
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        toast.success("Image uploaded successfully!");
      } catch (error) {
        toast.error("Failed to upload image. Please try again.");
        setImageFile(null);
        setProfileImage(null);
      } finally {
        setImageUploading(false);
      }
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  if (!patient && doctors.length > 0) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <ToastContainer />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[hsl(var(--color-status-error-light))] border border-[hsl(var(--color-status-error))] text-[hsl(var(--color-status-error))] px-4 py-3 rounded-lg text-sm">
              <h2 className="font-semibold mb-2">Doctor not found</h2>
              <p className="mb-2">Patient ID: {doctorId}</p>
              <p className="mb-2">Total doctors loaded: {doctors.length}</p>
              <p className="mb-4">
                Please check if the doctor exists or try refreshing the data.
              </p>
              <button
                onClick={() => dispatch(fetchDoctors())}
                className="px-4 py-2 bg-[hsl(var(--color-status-error))] text-white rounded hover:bg-[hsl(var(--color-status-error-dark))] transition-colors"
              >
                Refresh Doctor Data
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <ToastContainer />
      <div className="min-h-screen bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto py-8 px-6">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/doctors")}
              className=" bg-[hsl(var(--color-brand-teal)/0.1)] flex items-center gap-2 text-[hsl(var(--color-brand-teal))] hover:text-[hsl(var(--color-brand-teal-dark))] hover:bg-[hsl(var(--color-brand-teal-light))] dark:text-[hsl(var(--color-brand-teal))] dark:hover:text-[hsl(var(--color-brand-teal-dark))] dark:hover:bg-[hsl(var(--color-brand-teal)/0.1)] p-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Doctor</span>
            </Button>
          </div>

          <div className="mb-6">
            <p className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-sm">
              Update doctor information and settings
            </p>
          </div>

          {patient && (
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Profile Picture Section */}
              <div>
                <h3 className="text-lg font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-4">
                  Profile Picture
                </h3>
                <div className="flex items-center space-x-4">
                  <div
                    className={`relative cursor-pointer ${imageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={imageUploading ? undefined : triggerImageUpload}
                  >
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={
                          formData.profilePicture || "/placeholder.svg?height=80&width=80"
                        }
                      />
                      <AvatarFallback className="bg-[hsl(var(--color-gray-200))] dark:bg-[hsl(var(--color-gray-700))] text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-lg">
                        {formData.name
                          ? formData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                          : "DR"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[hsl(var(--color-brand-teal))] rounded-full flex items-center justify-center">
                      {imageUploading ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                    className="hidden"
                  />
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                      Profile Image
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                      The Proposed size is 512 x 512 px and no longer bigger
                      than 2.5 MBs
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                    Basic Information
                  </h3>

                  <div>
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                    >
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Dr. Sarah Johnson"
                      className="mt-1 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                    >
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Dr. Sarah Johnson"
                      className="mt-1 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      placeholder="Dr. Sarah Johnson"
                      className="mt-1 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      disabled
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                    >
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="sarah.johnson@clinical.com"
                      className="mt-1 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      disabled
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                      className="mt-1 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="age"
                      className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                    >
                      Age *
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="35"
                      min="18"
                      max="100"
                      className="mt-1 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="dateOfBirth"
                      className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                    >
                      Date of Birth *
                    </Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth ? moment(formData.dateOfBirth).format('YYYY-MM-DD') : ''}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: moment(e.target.value).format('YYYY-MM-DD') })}
                      className="mt-1 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="gender"
                      className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                    >
                      Gender *
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        setFormData({ ...formData, gender: value })
                      }
                    >
                      <SelectTrigger className="mt-1 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))]">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))]">
                        <SelectItem
                          value="male"
                          className="dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--color-gray-600))]"
                        >
                          Male
                        </SelectItem>
                        <SelectItem
                          value="female"
                          className="dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--color-gray-600))]"
                        >
                          Female
                        </SelectItem>
                        <SelectItem
                          value="other"
                          className="dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--color-gray-600))]"
                        >
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="bio"
                      className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                    >
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. She specializes in preventive cardiology and cardiac rehabilitation."
                      rows={4}
                      className="mt-1 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="status"
                      className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                    >
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger className="mt-1 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))]">
                        <SelectValue placeholder="Active" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))]">
                        <SelectItem
                          value="active"
                          className="dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--color-gray-600))]"
                        >
                          Active
                        </SelectItem>
                        <SelectItem
                          value="inactive"
                          className="dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--color-gray-600))]"
                        >
                          Inactive
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                    Professional Information
                  </h3>

                  <div>
                    <Label
                      htmlFor="education"
                      className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                    >
                      Education
                    </Label>
                    <Input
                      id="education"
                      name="educationSummary"
                      value={formData.educationSummary}
                      onChange={handleChange}
                      placeholder="MD from Johns Hopkins University, Residency at Mayo Clinic"
                      className="mt-1 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="specialty"
                      className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                    >
                      Specialty *
                    </Label>
                    <Select
                      value={formData.specialization}
                      onValueChange={(value) =>
                        setFormData({ ...formData, specialization: value })
                      }
                    >
                      <SelectTrigger className="mt-1 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))]">
                        <SelectValue placeholder="Cardiology" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))]">
                        <SelectItem
                          value="cardiology"
                          className="dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--color-gray-600))]"
                        >
                          Cardiology
                        </SelectItem>
                        <SelectItem
                          value="neurology"
                          className="dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--color-gray-600))]"
                        >
                          Neurology
                        </SelectItem>
                        <SelectItem
                          value="orthopedics"
                          className="dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--color-gray-600))]"
                        >
                          Orthopedics
                        </SelectItem>
                        <SelectItem
                          value="pediatrics"
                          className="dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--color-gray-600))]"
                        >
                          Pediatrics
                        </SelectItem>
                        <SelectItem
                          value="dermatology"
                          className="dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--color-gray-600))]"
                        >
                          Dermatology
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="experience"
                      className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                    >
                      Years of Experience
                    </Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) =>
                        setFormData({ ...formData, experience: value })
                      }
                    >
                      <SelectTrigger className="mt-1 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))]">
                        <SelectValue placeholder="15" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))]">
                        {Array.from({ length: 50 }, (_, i) => i + 1).map(
                          (year) => (
                            <SelectItem
                              key={year}
                              value={year.toString()}
                              className="dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--color-gray-600))]"
                            >
                              {year}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="licenseNumber"
                      className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                    >
                      License Number *
                    </Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="MD-123456"
                      className="mt-1 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="languages"
                      className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                    >
                      Languages
                    </Label>
                    <div className="mt-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {["English", "Spanish", "French", "German", "Italian", "Portuguese", "Arabic", "Chinese"].map((language) => (
                          <div key={language} className="flex items-center space-x-2">
                            <Checkbox
                              id={`language-${language.toLowerCase()}`}
                              checked={formData.languages.includes(language)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({
                                    ...formData,
                                    languages: [...formData.languages, language]
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    languages: formData.languages.filter(lang => lang !== language)
                                  });
                                }
                              }}
                              className="border-[hsl(var(--border))] dark:border-[hsl(var(--border))]"
                            />
                            <Label
                              htmlFor={`language-${language.toLowerCase()}`}
                              className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] cursor-pointer"
                            >
                              {language}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {formData.languages.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.languages.map((language) => (
                            <span
                              key={language}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[hsl(var(--color-chart-blue)/0.1)] dark:bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] dark:text-[hsl(var(--color-chart-blue))] border border-[hsl(var(--color-chart-blue))] dark:border-[hsl(var(--color-chart-blue))]"
                            >
                              {language}
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    languages: formData.languages.filter(lang => lang !== language)
                                  });
                                }}
                                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[hsl(var(--color-chart-blue))] hover:text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.2)] dark:hover:bg-[hsl(var(--color-chart-blue)/0.2)]"
                              >
                                <span className="sr-only">Remove {language}</span>
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="address"
                      className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                    >
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main St, Anytown, USA"
                      rows={4}
                      className="mt-1 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>
                </div>
              </div>

              {/* Manage Availability */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
                  Manage Availability
                </h3>

                <div>
                  <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                    Time Zone
                  </Label>
                  <Select
                    value={formData.timeZone}
                    onValueChange={(value) =>
                      setFormData({ ...formData, timeZone: value })
                    }
                  >
                    <SelectTrigger className="mt-1 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))]">
                      <SelectValue placeholder="Asia/Karachi" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))]">
                      <SelectItem
                        value="Asia/Karachi"
                        className="dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--color-gray-600))]"
                      >
                        Asia/Karachi (GMT +05:00)
                      </SelectItem>
                      <SelectItem
                        value="UTC"
                        className="dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--color-gray-600))]"
                      >
                        UTC (GMT +00:00)
                      </SelectItem>
                      <SelectItem
                        value="America/New_York"
                        className="dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--color-gray-600))]"
                      >
                        America/New_York (GMT -05:00)
                      </SelectItem>
                      <SelectItem
                        value="Europe/London"
                        className="dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--color-gray-600))]"
                      >
                        Europe/London (GMT +00:00)
                      </SelectItem>
                      <SelectItem
                        value="Asia/Dubai"
                        className="dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--color-gray-600))]"
                      >
                        Asia/Dubai (GMT +04:00)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mb-4 block">
                    Available Hours
                  </Label>

                  <div className="flex flex-wrap gap-3 mb-6 p-3  ">
                    {[
                      { label: "Select All", value: "Select All" },
                      { label: "Mon", value: "Monday" },
                      { label: "Tue", value: "Tuesday" },
                      { label: "Wed", value: "Wednesday" },
                      { label: "Thu", value: "Thursday" },
                      { label: "Fri", value: "Friday" },
                      { label: "Sat", value: "Saturday" },
                    ].map((day) => (
                      <div
                        key={day.value}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={day.value}
                          checked={
                            day.value === "Select All"
                              ? selectedDays.length === 7
                              : selectedDays.includes(day.value)
                          }
                          onCheckedChange={() => {
                            if (day.value === "Select All") {
                              if (selectedDays.length === 7) {
                                setSelectedDays([]);
                              } else {
                                setSelectedDays([
                                  "Monday",
                                  "Tuesday",
                                  "Wednesday",
                                  "Thursday",
                                  "Friday",
                                  "Saturday",
                                ]);
                              }
                            } else {
                              handleDayToggle(day.value);
                            }
                          }}
                          className="data-[state=checked]:bg-[hsl(var(--color-brand-teal))] data-[state=checked]:border-[hsl(var(--color-brand-teal))]"
                        />
                        <Label
                          htmlFor={day.value}
                          className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                        >
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ].map((day) => {
                      const daySlots = formData.availableDays.filter(
                        (slot) => slot.day === day
                      );
                      return (
                        <div key={day} className="flex items-center space-x-4">
                          <div className="w-24 text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                            {day}
                          </div>
                          {daySlots.length > 0 ? (
                            <div className="flex items-center space-x-3">
                              <Input
                                type="time"
                                value={daySlots[0].from}
                                onChange={(e) =>
                                  handleTimeChange(day, "from", e.target.value)
                                }
                                className="w-32 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))]"
                              />
                              <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] text-sm">
                                To
                              </span>
                              <Input
                                type="time"
                                value={daySlots[0].to}
                                onChange={(e) =>
                                  handleTimeChange(day, "to", e.target.value)
                                }
                                className="w-32 dark:bg-[hsl(var(--color-gray-700))] dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))]"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeTimeSlot(
                                    formData.availableDays.findIndex(
                                      (slot) => slot.day === day
                                    )
                                  )
                                }
                                className="text-[hsl(var(--color-status-error))] hover:text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))] dark:hover:text-[hsl(var(--color-status-error))]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => addTimeSlot(day)}
                              className="text-[hsl(var(--color-brand-teal))] hover:text-[hsl(var(--color-brand-teal-dark))] dark:text-[hsl(var(--color-brand-teal))] dark:hover:text-[hsl(var(--color-brand-teal-dark))] flex items-center space-x-1"
                            >
                              <Plus className="h-4 w-4" />
                              <span>Add Time</span>
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/doctors")}
                  disabled={loading}
                  className="flex-1 px-8 border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--color-gray-50))]
               dark:border-[hsl(var(--border))] dark:text-[hsl(var(--foreground))] dark:hover:bg-[hsl(var(--color-gray-700))]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white px-8 flex items-center justify-center space-x-2 
               dark:bg-[hsl(var(--color-brand-teal))] dark:hover:bg-[hsl(var(--color-brand-teal-dark))]"
                >
                  <Plus className="h-4 w-4" />
                  <span>{loading ? "Updating..." : "Update Doctor"}</span>
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}