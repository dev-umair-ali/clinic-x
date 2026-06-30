"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { createDoctor, fetchDoctors } from "@/lib/slices/doctorSlice";
import { fetchClinics } from "@/lib/slices/clinicSlice";
import type { RootState, AppDispatch } from "@/lib/store";
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
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { DatePicker } from "@/components/ui/date-picker";

/* ----------  TYPES  ---------- */
interface DoctorFormData {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  phone: string;
  age: string;
  dateOfBirth: string;
  gender: string;
  specialization: string;
  clinicRef: string;
  languages: string[];
  yearsOfExperience: string;
  experience: string;
  licenseNumber: string;
  bio: string;
  educationSummary: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  role: "doctor";
  hipaaConsent: boolean;
  timeZone: string;
  profilePicture: string;
}

/* ----------  MAIN PAGE  ---------- */
export default function AddDoctorPage() {
  const dispatch = useDispatch<AppDispatch>();
  // const router = useRouter();
  const { toast } = useToast();
  const { clinics } = useSelector((state: RootState) => state.clinics);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ----------  FORM STATE  ---------- */
  const [formData, setFormData] = useState<DoctorFormData>({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    phone: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    specialization: "",
    clinicRef: "",
    languages: [],
    yearsOfExperience: "",
    experience: "",
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
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  /* ----------  HOOKS  ---------- */
  useEffect(() => {
    dispatch(fetchClinics());
  }, [dispatch]);

  /* ----------  HANDLERS  ---------- */
  const handleInputChange = (field: keyof DoctorFormData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      
      if (field === "firstName" || field === "lastName") {
        const fn = field === "firstName" ? value : prev.firstName;
        const ln = field === "lastName" ? value : prev.lastName;
        updated.name = `${fn} ${ln}`.trim();
      }
      
      if (field === "phoneNumber") {
        updated.phone = value;
      }
      
      if (field === "yearsOfExperience") {
        updated.experience = value;
      }
      
      return updated;
    });
  };

  const handleAddressChange = (k: keyof DoctorFormData["address"], v: string) =>
    setFormData((p) => ({ ...p, address: { ...p.address, [k]: v } }));

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const token = localStorage.getItem("clinic-ai-token");
    if (!token) {
      toast({
        title: "Error",
        description: "No auth token",
        variant: "destructive",
      });
      return "";
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/upload/image`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      }
    );
    if (!res.ok) {
      toast({
        title: "Error",
        description: "Upload failed",
        variant: "destructive",
      });
      return "";
    }
    const result = await res.json();
    return result.fileUrl || result.profilePicture || result.data?.fileUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Invalid image",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 2.5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Max 2.5 MB",
        variant: "destructive",
      });
      return;
    }
    setImageUploading(true);
    try {
      const url = await uploadImage(file);
      if (url) {
        setFormData((p) => ({ ...p, profilePicture: url }));
        setProfileImage(url);
        toast({ title: "Success", description: "Picture uploaded!" });
      }
    } catch {
      toast({
        title: "Error",
        description: "Upload error",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmitForm = async () => {
    setIsLoading(true);
    try {
      const doctorData = {
        ...formData,
        age: Number(formData.age),
        gender: formData.gender as "male" | "female" | "other",
        phone: formData.phoneNumber,
        phoneNumber: formData.phoneNumber,
        experience: Number(formData.yearsOfExperience || "0"),
        yearsOfExperience: formData.yearsOfExperience,
      };

      const response = await dispatch(createDoctor(doctorData));
      
      if (response.meta.requestStatus === "fulfilled") {
        toast({ 
          title: "Success", 
          description: "Doctor added successfully!" 
        });
        
        // Add a small delay and check if router exists before navigation
        window.location.href = `/admin/doctors/view/${(response.payload as any)._id}`;
      } else if (response.meta.requestStatus === "rejected") {
        toast({
          title: "Error",
          description: response.payload as string || "Failed to add doctor",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add doctor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ----------  RENDER  ---------- */
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Toaster />
        {/* ------- HEADER ------- */}
        <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-[hsl(var(--muted-foreground))]"
                // onClick={() => router.push("/admin/doctors")}
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

        {/* ------- BODY ------- */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitForm();
            }}
            className="space-y-6"
          >
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
                          ? `${formData.name.split(" ")[0][0]}${
                              formData.name.split(" ")[1]?.[0] || ""
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
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="Enter first name"
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
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
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="Enter last name"
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
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
                      value={formData.dateOfBirth}
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
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="Enter age"
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
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
                        className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]  dark:text-[hsl(var(--foreground))]"
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
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Short bio..."
                      rows={3}
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
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
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter email"
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
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
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      placeholder="Enter phone"
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
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
                      value={formData.address.street}
                      onChange={(e) =>
                        handleAddressChange("street", e.target.value)
                      }
                      placeholder="Enter street"
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
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
                        value={formData.address.city}
                        onChange={(e) =>
                          handleAddressChange("city", e.target.value)
                        }
                        placeholder="Enter city"
                        className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
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
                        value={formData.address.state}
                        onChange={(e) =>
                          handleAddressChange("state", e.target.value)
                        }
                        placeholder="Enter state"
                        className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
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
                        value={formData.address.zipCode}
                        onChange={(e) =>
                          handleAddressChange("zipCode", e.target.value)
                        }
                        placeholder="Enter zip"
                        className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
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
                        value={formData.address.country}
                        onChange={(e) =>
                          handleAddressChange("country", e.target.value)
                        }
                        placeholder="Enter country"
                        className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
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
                      htmlFor="clinicRef"
                      className="text-[hsl(var(--foreground))]"
                    >
                      Assigned Clinic
                    </Label>
                    <Select
                      value={formData.clinicRef}
                      onValueChange={(v) => handleInputChange("clinicRef", v)}
                    >
                      <SelectTrigger
                        id="clinicRef"
                        className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]  dark:text-[hsl(var(--foreground))]"
                      >
                        <SelectValue placeholder="Select clinic" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinics.map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.clinicName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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
                        className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]  dark:text-[hsl(var(--foreground))]"
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
                      htmlFor="yearsOfExperience"
                      className="text-[hsl(var(--foreground))]"
                    >
                      Years of Experience *
                    </Label>
                    <Select
                      value={formData.yearsOfExperience}
                      onValueChange={(v) =>
                        handleInputChange("yearsOfExperience", v)
                      }
                    >
                      <SelectTrigger
                        id="yearsOfExperience"
                        className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]  dark:text-[hsl(var(--foreground))]"
                      >
                        <SelectValue placeholder="Select years" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 50 }, (_, i) => i + 1).map(
                          (y) => (
                            <SelectItem key={y} value={String(y)}>
                              {y} {y === 1 ? "year" : "years"}
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
                      value={formData.licenseNumber}
                      onChange={(e) =>
                        handleInputChange("licenseNumber", e.target.value)
                      }
                      placeholder="Enter license"
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
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
                      value={formData.educationSummary}
                      onChange={(e) =>
                        handleInputChange("educationSummary", e.target.value)
                      }
                      placeholder="MD from Johns Hopkins, Residency at Mayo"
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]  dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
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
                variant="outline"
                className="w-1/2 border-[hsl(var(--border))] bg-transparent"
                // onClick={() => router.push("/admin/doctors")}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-1/2 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white"
              >
                {isLoading ? (
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
