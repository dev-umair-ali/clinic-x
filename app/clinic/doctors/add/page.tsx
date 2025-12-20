"use client";

import type React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import {
  createDoctorInCollection,
  fetchDoctors,
} from "@/lib/slices/doctorSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Camera, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import type { AppDispatch } from "@/lib/store";
import { toast, ToastContainer } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface AvailableDay {
  day: string;
  from: string;
  to: string;
}

export default function AddDoctorPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

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

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

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


    const result = await response.json();
    if (result.success === true) {
      toast.success(result.message || 'Image uploaded successfully!');
      return result.fileUrl || result.profilePicture || result.data?.fileUrl;
    } 
    return "";
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
    document.getElementById("profile-image-input")?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.age ||
      !formData.dateOfBirth ||
      !formData.gender ||
      !formData.specialization ||
      !formData.experience ||
      !formData.licenseNumber ||
      !formData.address
    ) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    // Check for password complexity requirements
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      toast.error(
        "Password must contain uppercase, lowercase, number, and special character."
      );
      setLoading(false);
      return;
    }

    try {

      // Filter availableDays to only include selected days
      const filteredAvailableDays = formData.availableDays.filter(daySlot =>
        selectedDays.includes(daySlot.day)
      );

      // Fix: Convert age and experience to numbers, and ensure gender and status are correct types
      const doctorData = {
        ...formData,
        age: Number.parseInt(formData.age),
        experience: Number.parseInt(formData.experience),
        gender: formData.gender as "male" | "female" | "other",
        status: formData.status as "active" | "inactive",
        timeZone: formData.timeZone,
        availableDays: filteredAvailableDays,
      };
      const response = await dispatch(createDoctorInCollection(doctorData));

      if(response.meta.requestStatus === 'fulfilled') {
      // Refresh the doctor list to show the new doctor
      await dispatch(fetchDoctors());

      // Reset form
      setFormData({
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
        experience: "",
        licenseNumber: "",
        bio: "",
        educationSummary: "",
        address: "",
        status: "active",
        role: "doctor",
        hipaaConsent: true,
        timeZone: "Asia/Karachi",
        profilePicture: "",
        availableDays: [],
        assignedClinic: "",
        languages: [],
      });
  
      // Reset image states
      setProfileImage(null);
      setImageFile(null);
      setLoading(false);

      toast.success("Doctor added successfully!");
  
      // Redirect immediately after success
      router.push("/admin/doctors");
    } else {
      toast.error(response.payload as string);
      setLoading(false);
      return;
    }

    } catch (err: any) {
      toast.error(err);
      setLoading(false);
      return;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["clinic"]}>
      <ToastContainer />
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/doctors")}
              className="bg-[#1DA68F]/10 flex items-center space-x-2 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Doctor</span>
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Doctor
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Fill in the details to add a new doctor
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Profile Picture Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
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
                          profileImage || formData.profilePicture || "/placeholder.svg?height=80&width=80"
                        }
                      />
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-lg">
                        {formData.name
                          ? formData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                          : "DR"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                      {imageUploading ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                  <input
                    id="profile-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                    className="hidden"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Profile Image
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      The Proposed size is 512 x 512 px and no longer bigger
                      than 2.5 MBs
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Basic Information
                  </h3>

                  <div>
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      // onChange={handleChange}
                      placeholder="Dr. Sarah Johnson"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      disabled
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className="mt-1 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="age"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="dateOfBirth"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Date of Birth *
                    </Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="gender"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Gender *
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        setFormData({ ...formData, gender: value })
                      }
                    >
                      <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem
                          value="male"
                          className="dark:text-white dark:hover:bg-gray-600"
                        >
                          Male
                        </SelectItem>
                        <SelectItem
                          value="female"
                          className="dark:text-white dark:hover:bg-gray-600"
                        >
                          Female
                        </SelectItem>
                        <SelectItem
                          value="other"
                          className="dark:text-white dark:hover:bg-gray-600"
                        >
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>



                  <div>
                    <Label
                      htmlFor="bio"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>



                  <div>
                    <Label
                      htmlFor="status"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Active" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem
                          value="active"
                          className="dark:text-white dark:hover:bg-gray-600"
                        >
                          Active
                        </SelectItem>
                        <SelectItem
                          value="inactive"
                          className="dark:text-white dark:hover:bg-gray-600"
                        >
                          Inactive
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Professional Information
                  </h3>

                  <div>
                    <Label
                      htmlFor="education"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Education
                    </Label>
                    <Input
                      id="education"
                      name="educationSummary"
                      value={formData.educationSummary}
                      onChange={handleChange}
                      placeholder="MD from Johns Hopkins University, Residency at Mayo Clinic"
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>



                  <div>
                    <Label
                      htmlFor="specialty"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Specialty *
                    </Label>
                    <Select
                      value={formData.specialization}
                      onValueChange={(value) =>
                        setFormData({ ...formData, specialization: value })
                      }
                    >
                      <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Cardiology" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem
                          value="cardiology"
                          className="dark:text-white dark:hover:bg-gray-600"
                        >
                          Cardiology
                        </SelectItem>
                        <SelectItem
                          value="neurology"
                          className="dark:text-white dark:hover:bg-gray-600"
                        >
                          Neurology
                        </SelectItem>
                        <SelectItem
                          value="orthopedics"
                          className="dark:text-white dark:hover:bg-gray-600"
                        >
                          Orthopedics
                        </SelectItem>
                        <SelectItem
                          value="pediatrics"
                          className="dark:text-white dark:hover:bg-gray-600"
                        >
                          Pediatrics
                        </SelectItem>
                        <SelectItem
                          value="dermatology"
                          className="dark:text-white dark:hover:bg-gray-600"
                        >
                          Dermatology
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="experience"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Years of Experience
                    </Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) =>
                        setFormData({ ...formData, experience: value })
                      }
                    >
                      <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="15" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        {Array.from({ length: 50 }, (_, i) => i + 1).map(
                          (year) => (
                            <SelectItem
                              key={year}
                              value={year.toString()}
                              className="dark:text-white dark:hover:bg-gray-600"
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
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="languages"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                              className="border-gray-300 dark:border-gray-600"
                            />
                            <Label
                              htmlFor={`language-${language.toLowerCase()}`}
                              className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
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
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700"
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
                                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-800"
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
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>

                </div>
              </div>

              {/* Manage Availability */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Manage Availability
                </h3>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Time Zone
                  </Label>
                  <Select
                    value={formData.timeZone}
                    onValueChange={(value) =>
                      setFormData({ ...formData, timeZone: value })
                    }
                  >
                    <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Asia/Karachi" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectItem
                        value="Asia/Karachi"
                        className="dark:text-white dark:hover:bg-gray-600"
                      >
                        Asia/Karachi (GMT +05:00)
                      </SelectItem>
                      <SelectItem
                        value="UTC"
                        className="dark:text-white dark:hover:bg-gray-600"
                      >
                        UTC (GMT +00:00)
                      </SelectItem>
                      <SelectItem
                        value="America/New_York"
                        className="dark:text-white dark:hover:bg-gray-600"
                      >
                        America/New_York (GMT -05:00)
                      </SelectItem>
                      <SelectItem
                        value="Europe/London"
                        className="dark:text-white dark:hover:bg-gray-600"
                      >
                        Europe/London (GMT +00:00)
                      </SelectItem>
                      <SelectItem
                        value="Asia/Dubai"
                        className="dark:text-white dark:hover:bg-gray-600"
                      >
                        Asia/Dubai (GMT +04:00)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 block">
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
                          className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                        />
                        <Label
                          htmlFor={day.value}
                          className="text-sm text-gray-700 dark:text-gray-300"
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
                          <div className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300">
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
                                className="w-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                              <span className="text-gray-500 dark:text-gray-400 text-sm">
                                To
                              </span>
                              <Input
                                type="time"
                                value={daySlots[0].to}
                                onChange={(e) =>
                                  handleTimeChange(day, "to", e.target.value)
                                }
                                className="w-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
                              className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 flex items-center space-x-1"
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

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/doctors")}
                  disabled={loading}
                  className="flex-1 px-8 border-gray-300 text-gray-700 hover:bg-gray-50 
               dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-8 flex items-center justify-center space-x-2 
               dark:bg-teal-500 dark:hover:bg-teal-600"
                >
                  <Plus className="h-4 w-4" />
                  <span>{loading ? "Adding..." : "Add Doctor"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
