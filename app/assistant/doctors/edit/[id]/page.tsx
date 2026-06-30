"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { updateAssistantDoctor, fetchAssistantDoctors } from "@/lib/slices/assistantDoctorSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Camera, Plus, Loader2, User, MapPin } from "lucide-react";
import type { AppDispatch, RootState } from "@/lib/store";
import type { AssistantDoctor } from "@/lib/slices/assistantDoctorSlice";
import { toast, ToastContainer } from "react-toastify";
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

export default function EditDoctorPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const doctorId = params.id as string;

  const { assistantDoctor, assistantDoctors, loading: doctorsLoading } = useSelector(
    (state: RootState) => state.assistantDoctors
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
  const [doctor, setDoctor] = useState<AssistantDoctor | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (doctorId) dispatch(fetchAssistantDoctors());
  }, [dispatch, doctorId]);

  useEffect(() => {
    if (assistantDoctor && assistantDoctor._id === doctorId) {
      setDoctor(assistantDoctor as any);
      setFormData({
        firstName: assistantDoctor.firstName || "",
        lastName: assistantDoctor.lastName || "",
        name: `${assistantDoctor.firstName || ""} ${assistantDoctor.lastName || ""}`.trim(),
        email: assistantDoctor.email || "",
        password: "",
        phoneNumber: assistantDoctor.phoneNumber || "",
        age: assistantDoctor.age?.toString() || "",
        dateOfBirth: assistantDoctor.dateOfBirth || "",
        gender: assistantDoctor.gender || "",
        specialization: assistantDoctor.specialization || "",
        languages: assistantDoctor.languages || [],
        yearOfExperience: assistantDoctor.yearsOfExperience?.toString() || "",
        licenseNumber: typeof assistantDoctor.licenseNumber === "string" ? assistantDoctor.licenseNumber : "",
        bio: typeof assistantDoctor.bio === "string" ? assistantDoctor.bio : "",
        educationSummary: typeof assistantDoctor.educationSummary === "string" ? assistantDoctor.educationSummary : "",
        address:
          typeof assistantDoctor.address === "object" && assistantDoctor.address
            ? {
                street: assistantDoctor.address.street || "",
                city: assistantDoctor.address.city || "",
                state: assistantDoctor.address.state || "",
                zipCode: assistantDoctor.address.zipCode || "",
                country: assistantDoctor.address.country || "",
              }
            : {
                street: "",
                city: "",
                state: "",
                zipCode: "",
                country: "",
              },
        role: "doctor",
        hipaaConsent: assistantDoctor.hipaaConsent ?? true,
        timeZone: (assistantDoctor as any).timeZone || "Asia/Karachi",
        profilePicture: assistantDoctor.profilePicture || "",
      });
      setProfileImage(assistantDoctor.profilePicture || null);
    }
  }, [assistantDoctor, doctorId]);

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

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    const token = localStorage.getItem("clinic-ai-token");
    if (!token) {
      toast.error("No auth token");
      return "";
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}api/upload/image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) {
      toast.error("Upload failed");
      return "";
    }
    const result = await res.json();
    return result.fileUrl || result.profilePicture || result.data?.fileUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid image");
      return;
    }
    if (file.size > 2.5 * 1024 * 1024) {
      toast.error("Max 2.5 MB");
      return;
    }
    setImageUploading(true);
    setImageFile(file);
    try {
      const url = await uploadImage(file);
      if (url) {
        setFormData((p) => ({ ...p, profilePicture: url }));
        setProfileImage(url);
        toast.success("Picture uploaded!");
      }
    } catch {
      toast.error("Upload error");
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
      const response = await dispatch(updateAssistantDoctor({ id: doctorId, doctorData: payload }));
      if (response.type === "assistant/doctor/update-doctor/:id/fulfilled") {
        router.push("/assistant/doctors/view/" + `${(response.payload as any)._id}`);
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

  const triggerImageUpload = () => fileInputRef.current?.click();

  if (!doctor && assistantDoctors.length > 0)
    return (
      <ProtectedRoute allowedRoles={["assistant"]}>
        <ToastContainer />
        <div className="min-h-screen bg-[hsl(var(--background))]">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              <h2 className="font-semibold mb-2">Doctor not found</h2>
              <p className="mb-2">Doctor ID: {doctorId}</p>
              <p className="mb-4">Please check if the doctor exists or try refreshing the data.</p>
              <button
                onClick={() => router.push("/assistant/doctors")}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Back to Doctors
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );

  /* ---------------------------------------------------------- */
  /*  NEW LAYOUT – 100 % CLINIC STYLE – ZERO LOGIC CHANGED      */
  /* ---------------------------------------------------------- */
  return (
    <ProtectedRoute allowedRoles={["assistant"]}>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <ToastContainer />
        {/* ------- HEADER (clinic style) ------- */}
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
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">Edit Doctor</h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Update doctor information and settings</p>
              </div>
            </div>
          </div>
        </div>

        {/* ------- BODY (clinic card layout) ------- */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <Camera className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Profile Picture
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="flex items-center space-x-4">
                  <div
                    className="relative cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={formData.profilePicture || "/placeholder.svg?height=80&width=80"}
                      />
                      <AvatarFallback className="bg-[hsl(var(--color-gray-200))] text-[hsl(var(--muted-foreground))] text-lg">
                        {formData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
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
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">Profile Image</p>
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
                      date={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
                      setDate={(d) =>
                        setFormData((p) => ({
                          ...p,
                          dateOfBirth: d ? moment(d).format("YYYY-MM-DD") : "",
                        }))
                      }
                      placeholder="Select date of birth"
                      required
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
                            className="ml-1.5 w-4 h-4 rounded-full hover:bg-[hsl(var(--color-chart-blue)/0.2)]"
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