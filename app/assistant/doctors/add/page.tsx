"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import {
  createAssistantDoctor,
  fetchAssistantDoctors,
} from "@/lib/slices/assistantDoctorSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Camera,
  Plus,
  Loader2,
  User,
  Phone,
  MapPin,
  Briefcase,
  Globe,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import type { AppDispatch } from "@/lib/store";
import { getClinicId } from "@/lib/utils/auth-utils";
import { DatePicker } from "@/components/ui/date-picker";
import moment from "moment";
interface AvailableDay {
  day: string;
  from: string;
  to: string;
}

export default function AddDoctorPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clinicId, setClinicId] = useState<string | null>(null);

  useEffect(() => {
    const id = getClinicId();
    setClinicId(id);
    if (!id) {
      toast.error("Unable to determine clinic ID. Please log in again.");
    }
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    age: "",
    dateOfBirth: moment().format("YYYY-MM-DD"),
    gender: "",
    specialization: "",
    languages: [] as string[],
    yearOfExperience: "",
    licenseNumber: "",
    bio: "",
    educationSummary: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
    role: "doctor" as const,
    hipaaConsent: true,
    timeZone: "Asia/Karachi",
    profilePicture: "",
  });

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    if (name === "firstName" || name === "lastName") {
      const firstName = name === "firstName" ? value : formData.firstName;
      const lastName = name === "lastName" ? value : formData.lastName;
      updatedFormData.name = `${firstName} ${lastName}`.trim();
    }

    setFormData(updatedFormData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "firstName" || field === "lastName") {
        const fn = field === "firstName" ? value : prev.firstName;
        const ln = field === "lastName" ? value : prev.lastName;
        updated.name = `${fn} ${ln}`.trim();
      }

      return updated;
    });
  };

  const handleAddressChange = (k: keyof typeof formData.address, v: string) =>
    setFormData((p) => ({ ...p, address: { ...p.address, [k]: v } }));

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("clinic-ai-token");

    if (!token) {
      toast.error("No authentication token found. Please login again.");
      return "";
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}api/upload/image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const result = await response.json();
    if (result.success === true) {
      toast.success(result.message || "Image uploaded successfully!");
      return result.fileUrl || result.profilePicture || result.data?.fileUrl;
    }
    return "";
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      toast.error("Image size should not exceed 2.5MB");
      return;
    }

    setImageUploading(true);
    setImageFile(file);

    try {
      const profilePicture = await uploadImage(file);
      setFormData((prev) => ({ ...prev, profilePicture }));

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // if (!clinicId) {
    //   toast.error("Clinic ID not found. Please log in again.");
    //   setLoading(false);
    //   return;
    // }

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.age ||
      !formData.dateOfBirth ||
      !formData.gender ||
      !formData.specialization ||
      !formData.yearOfExperience ||
      !formData.licenseNumber
    ) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const doctorData = {
        ...formData,
        age: Number.parseInt(formData.age),
        yearOfExperience: Number.parseInt(formData.yearOfExperience),
        gender: formData.gender as "male" | "female" | "other",
        timeZone: formData.timeZone,
        clinicRef: clinicId ?? undefined,
      };
      const response = await dispatch(createAssistantDoctor(doctorData));

      if (response.meta.requestStatus === "fulfilled") {
        await dispatch(fetchAssistantDoctors({ clinicRef: clinicId ?? undefined }));

        setFormData({
          firstName: "",
          lastName: "",
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
          age: "",
          dateOfBirth: "",
          gender: "",
          specialization: "",
          yearOfExperience: "",
          licenseNumber: "",
          bio: "",
          educationSummary: "",
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "USA",
          },
          role: "doctor",
          hipaaConsent: true,
          timeZone: "Asia/Karachi",
          profilePicture: "",
          languages: [],
        });

        setProfileImage(null);
        setImageFile(null);
        setLoading(false);

        toast.success("Doctor added successfully!");
        router.push(
          "/assistant/doctors/view/" + `${(response.payload as any).doctor._id}`
        );
      } else {
        toast.error(response.payload as string);
        setLoading(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add doctor");
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["assistant"]}>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <ToastContainer />
        {/* Header */}
        <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-[hsl(var(--muted-foreground))]"
                onClick={() => router.push("/assistant/doctors")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                  Add New Doctor
                </h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Register a new doctor for your clinic
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <User className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={
                          profileImage ||
                          formData.profilePicture ||
                          "/placeholder.svg?height=80&width=80"
                        }
                        alt="Doctor"
                      />
                      <AvatarFallback className="bg-[hsl(var(--color-gray-200))] text-[hsl(var(--muted-foreground))] text-lg">
                        {formData.name
                          ? `${formData.name.split(" ")[0][0]}${formData.name.split(" ")[1]?.[0] || ""
                          }`
                          : "DR"}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={imageUploading}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-[hsl(var(--color-brand-teal))] rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-brand-teal-dark))] disabled:opacity-50"
                    >
                      {imageUploading ? (
                        <Loader2 className="h-3 w-3 text-white animate-spin" />
                      ) : (
                        <Camera className="h-3 w-3 text-white" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                      {imageUploading ? "Uploading..." : "Profile Image"}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Proposed size 512 × 512 px, max 2.5 MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <User className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-[hsl(var(--foreground))]"
                    >
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      className="border-[hsl(var(--border))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-[hsl(var(--foreground))]"
                    >
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      className="border-[hsl(var(--border))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="dateOfBirth"
                      className="text-[hsl(var(--foreground))]"
                    >
                      Date of Birth *
                    </Label>
                    <DatePicker
                      value={
                        formData.dateOfBirth
                          ? moment(formData.dateOfBirth).format("YYYY-MM-DD")
                          : ""
                      }
                      onChange={(iso) => handleInputChange("dateOfBirth", iso)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="age"
                      className="text-[hsl(var(--foreground))]"
                    >
                      Age
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter age"
                      className="border-[hsl(var(--border))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="gender"
                      className="text-[hsl(var(--foreground))]"
                    >
                      Gender *
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(v) => handleInputChange("gender", v)}
                    >
                      <SelectTrigger
                        id="gender"
                        className="border-[hsl(var(--border))]  dark:text-[hsl(var(--foreground))]"
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="bio"
                      className="text-[hsl(var(--foreground))]"
                    >
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Short bio..."
                      rows={3}
                      className="border-[hsl(var(--border))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <Phone className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-[hsl(var(--foreground))]"
                    >
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      className="border-[hsl(var(--border))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneNumber"
                      className="text-[hsl(var(--foreground))]"
                    >
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter phone"
                      className="border-[hsl(var(--border))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <MapPin className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="street"
                      className="text-[hsl(var(--foreground))]"
                    >
                      Street Address
                    </Label>
                    <Input
                      id="street"
                      name="street"
                      value={formData.address.street}
                      onChange={(e) =>
                        handleAddressChange("street", e.target.value)
                      }
                      placeholder="Enter street"
                      className="border-[hsl(var(--border))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="city"
                        className="text-[hsl(var(--foreground))]"
                      >
                        City
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.address.city}
                        onChange={(e) =>
                          handleAddressChange("city", e.target.value)
                        }
                        placeholder="Enter city"
                        className="border-[hsl(var(--border))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="state"
                        className="text-[hsl(var(--foreground))]"
                      >
                        State
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.address.state}
                        onChange={(e) =>
                          handleAddressChange("state", e.target.value)
                        }
                        placeholder="Enter state"
                        className="border-[hsl(var(--border))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="zipCode"
                        className="text-[hsl(var(--foreground))]"
                      >
                        Zip Code
                      </Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.address.zipCode}
                        onChange={(e) =>
                          handleAddressChange("zipCode", e.target.value)
                        }
                        placeholder="Enter zip"
                        className="border-[hsl(var(--border))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="country"
                        className="text-[hsl(var(--foreground))]"
                      >
                        Country
                      </Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.address.country}
                        onChange={(e) =>
                          handleAddressChange("country", e.target.value)
                        }
                        placeholder="Enter country"
                        className="border-[hsl(var(--border))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <Briefcase className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="specialization"
                      className="text-[hsl(var(--foreground))]"
                    >
                      Specialty *
                    </Label>
                    <Select
                      value={formData.specialization}
                      onValueChange={(v) =>
                        handleInputChange("specialization", v)
                      }
                    >
                      <SelectTrigger
                        id="specialization"
                        className="border-[hsl(var(--border))]  dark:text-[hsl(var(--foreground))]"
                      >
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="dermatology">Dermatology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="yearOfExperience"
                      className="text-[hsl(var(--foreground))]"
                    >
                      Years of Experience *
                    </Label>
                    <Select
                      value={formData.yearOfExperience}
                      onValueChange={(v) =>
                        handleInputChange("yearOfExperience", v)
                      }
                    >
                      <SelectTrigger
                        id="yearOfExperience"
                        className="border-[hsl(var(--border))]  dark:text-[hsl(var(--foreground))]"
                      >
                        <SelectValue placeholder="Select years" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 50 }, (_, i) => i + 1).map(
                          (year) => (
                            <SelectItem key={year} value={String(year)}>
                              {year} {year === 1 ? "year" : "years"}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="licenseNumber"
                      className="text-[hsl(var(--foreground))]"
                    >
                      License Number *
                    </Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="Enter license"
                      className="border-[hsl(var(--border))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="educationSummary"
                      className="text-[hsl(var(--foreground))]"
                    >
                      Education Summary
                    </Label>
                    <Input
                      id="educationSummary"
                      name="educationSummary"
                      value={formData.educationSummary}
                      onChange={handleChange}
                      placeholder="MD from Johns Hopkins, Residency at Mayo"
                      className="border-[hsl(var(--border))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <Globe className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "English",
                    "Spanish",
                    "French",
                    "German",
                    "Italian",
                    "Portuguese",
                    "Arabic",
                    "Chinese",
                  ].map((lang) => (
                    <div key={lang} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lang-${lang}`}
                        checked={formData.languages.includes(lang)}
                        onCheckedChange={(c) =>
                          setFormData((p) => ({
                            ...p,
                            languages: c
                              ? [...p.languages, lang]
                              : p.languages.filter((l) => l !== lang),
                          }))
                        }
                        className="border-[hsl(var(--border))] dark:border-[hsl(var(--border))]"
                      />
                      <Label
                        htmlFor={`lang-${lang}`}
                        className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                      >
                        {lang}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.languages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.languages.map((lang) => (
                      <span
                        key={lang}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] border border-[hsl(var(--color-chart-blue))]"
                      >
                        {lang}
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((p) => ({
                              ...p,
                              languages: p.languages.filter((l) => l !== lang),
                            }))
                          }
                          className="ml-1.5 w-4 h-4 rounded-full hover:bg-[hsl(var(--color-chart-blue)/0.2)]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-1/2 border-[hsl(var(--border))] bg-transparent"
                onClick={() => router.push("/assistant/doctors")}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="w-1/2 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Save Doctor
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}