"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { updateClinicDoctor, fetchClinicDoctor } from "@/lib/slices/clinicDoctorSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Camera, Plus, Loader2, User, MapPin, Phone, Briefcase, Globe } from "lucide-react";
import type { AppDispatch, RootState } from "@/lib/store";
import type { ClinicDoctor } from "@/lib/slices/clinicDoctorSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import moment from "moment";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

/* ------------------------------------------------------------------ */
/*  IDENTICAL  STATE / LOGIC / HANDLERS  –  NOTHING  CHANGED          */
/* ------------------------------------------------------------------ */
export default function EditDoctorPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const doctorId = params.id as string;
  const { toast } = useToast();

  const { clinicDoctor, clinicDoctors, loading: doctorsLoading } = useSelector(
    (state: RootState) => state.clinicDoctors
  );
  
  const [formData, setFormData] = useState({
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
      country: "",
    },
    role: "doctor" as const,
    hipaaConsent: true,
    timeZone: "Asia/Karachi",
    profilePicture: "",
  });

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [doctor, setDoctor] = useState<ClinicDoctor | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (doctorId) dispatch(fetchClinicDoctor(doctorId));
  }, [dispatch, doctorId]);

  useEffect(() => {
    if (clinicDoctor && clinicDoctor._id === doctorId) {
      setDoctor(clinicDoctor as any);
      setFormData({
        firstName: clinicDoctor.firstName || "",
        lastName: clinicDoctor.lastName || "",
        name: `${clinicDoctor.firstName || ""} ${clinicDoctor.lastName || ""}`.trim(),
        email: clinicDoctor.email || "",
        password: "",
        phoneNumber: clinicDoctor.phoneNumber || "",
        age: clinicDoctor.age?.toString() || "",
        dateOfBirth: clinicDoctor.dateOfBirth || "",
        gender: clinicDoctor.gender || "",
        specialization: clinicDoctor.specialization || "",
        languages: clinicDoctor.languages || [],
        yearOfExperience: clinicDoctor.yearsOfExperience?.toString() || "",
        licenseNumber: typeof clinicDoctor.licenseNumber === "string" ? clinicDoctor.licenseNumber : "",
        bio: typeof clinicDoctor.bio === "string" ? clinicDoctor.bio : "",
        educationSummary: typeof clinicDoctor.educationSummary === "string" ? clinicDoctor.educationSummary : "",
        address:
          typeof clinicDoctor.address === "object" && clinicDoctor.address
            ? {
                street: clinicDoctor.address.street || "",
                city: clinicDoctor.address.city || "",
                state: clinicDoctor.address.state || "",
                zipCode: clinicDoctor.address.zipCode || "",
                country: clinicDoctor.address.country || "",
              }
            : {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
              },
        role: "doctor",
        hipaaConsent: clinicDoctor.hipaaConsent ?? true,
        timeZone: (clinicDoctor as any).timeZone || "Asia/Karachi",
        profilePicture: clinicDoctor.profilePicture || "",
      });
      setProfileImage(clinicDoctor.profilePicture || null);
    }
  }, [clinicDoctor, doctorId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    if (name === "firstName" || name === "lastName") {
      updated.name = `${name === "firstName" ? value : formData.firstName} ${name === "lastName" ? value : formData.lastName}`.trim();
    }
    setFormData(updated);
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
      throw new Error("No authentication token found. Please login again.");
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/upload/image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      if (result.success === true) {
        const fileUrl = result.fileUrl || result.profilePicture || result.data?.fileUrl;
        if (!fileUrl) {
          throw new Error("No file URL returned from server");
        }
        return fileUrl;
      }
      throw new Error(result.message || "Upload failed");
    } catch (error: any) {
      throw new Error(error.message || "Failed to upload image");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload a valid image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should not exceed 2.5MB",
        variant: "destructive",
      });
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

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Image upload failed:", error);
      toast({
        title: "Success",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      setImageFile(null);
      setProfileImage(null);
      setFormData((prev) => ({ ...prev, profilePicture: "" }));
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;
    setLoading(true);
    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        yearOfExperience: Number(formData.yearOfExperience),
        gender: formData.gender as "male" | "female" | "other",
        timeZone: formData.timeZone,
        profilePicture: formData.profilePicture || profileImage || undefined,
      };
      const response = await dispatch(updateClinicDoctor({ id: doctorId, doctorData: payload }));
      if (response.type === updateClinicDoctor.fulfilled.type) {
        toast({
          title: "Success",
          description: "Doctor updated successfully!",
          variant: "default",
        });
        router.push("/clinic/doctors/view/" + `${(response.payload as any)._id}`);
        setLoading(false);
        return;
      } else {
        toast({
          title: "Error",
          description: (typeof response.payload === 'string' ? response.payload : null) || "Failed to update doctor. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update doctor",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (!doctor && clinicDoctors.length > 0)
    return (
      <ProtectedRoute allowedRoles={["clinic"]}>
        <Toaster />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              <h2 className="font-semibold mb-2">Doctor not found</h2>
              <p className="mb-2">Doctor ID: {doctorId}</p>
              <p className="mb-4">Please check if the doctor exists or try refreshing the data.</p>
              <button
                onClick={() => router.push("/clinic/doctors")}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Back to Doctors
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );

  /* ------------------------------------------------------------------ */
  /*           NEW  LAYOUT  –  100 %  ADMIN  LOOK  –  ZERO  LOGIC       */
  /* ------------------------------------------------------------------ */
  return (
    <ProtectedRoute allowedRoles={["clinic"]}>
      <Toaster />
      <div className="min-h-screen bg-[hsl(var(--background))]">
        {/* ------- HEADER  (admin style) ------- */}
        <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-[hsl(var(--muted-foreground))]"
                onClick={() => router.push("/clinic/doctors")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Edit Doctor</h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Update doctor information and settings</p>
              </div>
            </div>
          </div>
        </div>

        {/* ------- BODY  (admin card layout) ------- */}
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
                    <Label htmlFor="firstName" className="text-[hsl(var(--foreground))]">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-[hsl(var(--foreground))]">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[hsl(var(--foreground))]">Full Name *</Label>
                    <Input id="name" name="name" value={formData.name} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[hsl(var(--foreground))]">Email Address *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-[hsl(var(--foreground))]">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-[hsl(var(--foreground))]">Age *</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Date of Birth *</Label>
                    <DatePicker
                      value={formData.dateOfBirth || undefined}
                      onChange={(iso: string) => {
                        if (iso) {
                          // Store in YYYY-MM-DD format
                          handleInputChange("dateOfBirth", iso);

                          // Calculate age using moment
                          const age = moment().diff(moment(iso, 'YYYY-MM-DD'), 'years');

                          if (age >= 0) {
                            handleInputChange("age", age.toString());
                          }
                        } else {
                          handleInputChange("dateOfBirth", "");
                          handleInputChange("age", "");
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-[hsl(var(--foreground))]">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio" className="text-[hsl(var(--foreground))]">Bio</Label>
                    <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={3} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <Plus className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="educationSummary" className="text-[hsl(var(--foreground))]">Education</Label>
                    <Input
                      id="educationSummary"
                      name="educationSummary"
                      value={formData.educationSummary}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization" className="text-[hsl(var(--foreground))]">Specialty *</Label>
                    <Select value={formData.specialization} onValueChange={(v) => setFormData({ ...formData, specialization: v })}>
                      <SelectTrigger>
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
                    <Label htmlFor="yearOfExperience" className="text-[hsl(var(--foreground))]">Years of Experience *</Label>
                    <Select
                      value={formData.yearOfExperience}
                      onValueChange={(v) => setFormData({ ...formData, yearOfExperience: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select years" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 50 }, (_, i) => i + 1).map((y) => (
                          <SelectItem key={y} value={String(y)}>
                            {y} {y === 1 ? "year" : "years"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber" className="text-[hsl(var(--foreground))]">License Number *</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-2 mt-6">
                  <Label className="text-[hsl(var(--foreground))]">Languages</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["English", "Spanish", "French", "German", "Italian", "Portuguese", "Arabic", "Chinese"].map((lang) => (
                      <div key={lang} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lang-${lang}`}
                          checked={formData.languages.includes(lang)}
                          onCheckedChange={(c) =>
                            setFormData((p) => ({
                              ...p,
                              languages: c ? [...p.languages, lang] : p.languages.filter((l) => l !== lang),
                            }))
                          }
                        />
                        <Label htmlFor={`lang-${lang}`} className="text-sm text-[hsl(var(--muted-foreground))]">
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
                            onClick={() => setFormData((p) => ({ ...p, languages: p.languages.filter((l) => l !== lang) }))}
                            className="ml-1.5 w-4 h-4 rounded-full text-[hsl(var(--color-chart-blue))] hover:bg-[hsl(var(--color-chart-blue)/0.2)]"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
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
                    <Label className="text-[hsl(var(--foreground))]">Street Address</Label>
                    <Input
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">City</Label>
                      <Input
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">State</Label>
                      <Input
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">Zip Code</Label>
                      <Input
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">Country</Label>
                      <Input
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-1/2 border-[hsl(var(--border))] bg-transparent"
                onClick={() => router.push("/clinic/doctors")}
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
                    Updating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Update Doctor
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