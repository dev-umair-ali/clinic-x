"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { fetchClinicDoctors } from "@/lib/slices/patientSlice";
import { createAssistantPatient } from "@/lib/slices/assistantPatientSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Loader2,
  Camera,
  User,
  Heart,
  Stethoscope,
  UserPlus,
} from "lucide-react";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateAssistantPatientRequest } from "@/lib/api/services/assistantPatientService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/ui/date-picker";
import moment from "moment";

/* --------------  TYPES  -------------- */
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age: string;
  gender: string;
  profilePicture: string;
  dateOfBirth: string;
  bloodType: string;
  medicalHistory: string; // Will be converted to array on submit
  allergies: string;
  currentMedication: string;
  insuranceProvider: string;
  insuranceInfo: string;
  doctorRef: string; // Maps to doctorRef
  clinicRef: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

/* --------------  MAIN PAGE  -------------- */
export default function AddPatientStyled() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { clinicDoctors } = useSelector((state: RootState) => state.patients);
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  /* --------------  STATE  -------------- */
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    age: "",
    gender: "",
    profilePicture: "/placeholder.svg?height=80&width=80",
    dateOfBirth: "",
    bloodType: "",
    medicalHistory: "",
    allergies: "",
    currentMedication: "",
    insuranceProvider: "",
    insuranceInfo: "",
    doctorRef: "",
    clinicRef: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Fetch doctors when clinic is selected
  useEffect(() => {
    if (user && "clinicRef" in user && user.clinicRef) {
      dispatch(fetchClinicDoctors(user.clinicRef as string));
    }
  }, [dispatch, user]);

  /* --------------  HANDLERS  -------------- */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle nested address fields
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

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
        toast({ title: "Success", description: "Picture uploaded!", variant: "default" });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      age: Number(formData.age),
    };
    try {
      setIsLoading(true);
      const res = await dispatch(
        createAssistantPatient(
          payload as unknown as CreateAssistantPatientRequest
        )
      );
      if (res.meta.requestStatus === "fulfilled") {
        toast({ title: "Success", description: "Patient added!", variant: "default" });
        router.push("/assistant/patients/view/" + (res.payload as any)._id);
      } else {
        toast({
          title: "Error",
          description: (res.payload as string) || "",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to add patient",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* --------------  RENDER  -------------- */
  return (
    <ProtectedRoute allowedRoles={["assistant"]}>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Toaster />
        {/* ------- HEADER ------- */}
        <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-6 py-4 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="text-[hsl(var(--muted-foreground))]"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                  Add New Patient
                </h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Fill in the details to add a new patient
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ------- BODY ------- */}
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
                        src={profileImage || formData.profilePicture}
                        alt="Patient"
                      />
                      <AvatarFallback className="bg-[hsl(var(--color-gray-200))] text-[hsl(var(--muted-foreground))] text-lg">
                        {formData.firstName && formData.lastName
                          ? `${formData.firstName[0]}${formData.lastName[0]}`
                          : "PT"}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("profile-image-input")?.click()
                      }
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
                      id="profile-image-input"
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

            {/* Basic Information */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <User className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))] space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      First Name{" "}
                      <span className="text-[hsl(var(--destructive))]">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      required
                      className=" dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      Last Name{" "}
                      <span className="text-[hsl(var(--destructive))]">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                      className=" dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      Email Address{" "}
                      <span className="text-[hsl(var(--destructive))]">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                      required
                      className=" dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneNumber"
                      className="text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      Phone Number{" "}
                      <span className="text-[hsl(var(--destructive))]">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      required
                      className=" dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="age"
                      className="text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      Age{" "}
                      <span className="text-[hsl(var(--destructive))]">*</span>
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="35"
                      min="0"
                      required
                      className=" dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="gender"
                      className="text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      Gender{" "}
                      <span className="text-[hsl(var(--destructive))]">*</span>
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(v) =>
                        setFormData({ ...formData, gender: v })
                      }
                    >
                      <SelectTrigger className=" dark:text-[hsl(var(--foreground))]">
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
                      onChange={(iso) => setFormData((p) => ({ ...p, dateOfBirth: iso }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="address.street"
                      className="text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      Street Address{" "}
                      <span className="text-[hsl(var(--destructive))]">*</span>
                    </Label>
                    <Input
                      id="address.street"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                      required
                      className=" dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="address.city"
                      className="text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      City{" "}
                      <span className="text-[hsl(var(--destructive))]">*</span>
                    </Label>
                    <Input
                      id="address.city"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      placeholder="City"
                      required
                      className=" dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="address.state"
                      className="text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      State{" "}
                      <span className="text-[hsl(var(--destructive))]">*</span>
                    </Label>
                    <Input
                      id="address.state"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      placeholder="State"
                      required
                      className=" dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="address.zipCode"
                      className="text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      Zip Code{" "}
                      <span className="text-[hsl(var(--destructive))]">*</span>
                    </Label>
                    <Input
                      id="address.zipCode"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                      placeholder="12345"
                      required
                      className=" dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="bloodType"
                      className="text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      Blood Type
                    </Label>
                    <Select
                      value={formData.bloodType}
                      onValueChange={(v) =>
                        setFormData({ ...formData, bloodType: v })
                      }
                    >
                      <SelectTrigger className=" dark:text-[hsl(var(--foreground))]">
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (bt) => (
                            <SelectItem key={bt} value={bt}>
                              {bt}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Assignment */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <Stethoscope className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Medical Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))] space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="doctorRef"
                      className="text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      Primary Doctor{" "}
                      <span className="text-[hsl(var(--destructive))]">*</span>
                    </Label>
                    <Select
                      value={formData.doctorRef}
                      onValueChange={(v) =>
                        setFormData({ ...formData, doctorRef: v })
                      }
                    >
                      <SelectTrigger className=" dark:text-[hsl(var(--foreground))]">
                        <SelectValue placeholder={"Select Doctor"} />
                      </SelectTrigger>
                      <SelectContent>
                        {clinicDoctors && clinicDoctors.length > 0 ? (
                          clinicDoctors
                            .filter((d) => d._id)
                            .map((d) => (
                              <SelectItem key={d._id} value={d._id!}>
                                Dr. {d.firstName} {d.lastName} -{" "}
                                {d.specialization}
                              </SelectItem>
                            ))
                        ) : (
                          <SelectItem value="no-doctors" disabled>
                            {"No doctors available in this clinic"}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="insuranceProvider"
                      className="text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      Insurance Provider
                    </Label>
                    <Input
                      id="insuranceProvider"
                      name="insuranceProvider"
                      value={formData.insuranceProvider}
                      onChange={handleChange}
                      placeholder="Blue Cross Blue Shield"
                      className=" dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="insuranceInfo"
                      className="text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      Insurance Information
                    </Label>
                    <Input
                      id="insuranceInfo"
                      name="insuranceInfo"
                      value={formData.insuranceInfo}
                      onChange={handleChange}
                      placeholder="Policy number or additional info"
                      className=" dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <Heart className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Medical Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))] space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="medicalHistory"
                    className="text-sm font-medium text-[hsl(var(--foreground))]"
                  >
                    Medical History
                  </Label>
                  <Textarea
                    id="medicalHistory"
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    placeholder="Diabetes, Hypertension, Previous surgeries..."
                    rows={4}
                    className=" dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="allergies"
                      className="text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      Allergies
                    </Label>
                    <Input
                      id="allergies"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      placeholder="Penicillin, Shellfish, Pollen..."
                      className=" dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="currentMedication"
                      className="text-sm font-medium text-[hsl(var(--foreground))]"
                    >
                      Current Medication
                    </Label>
                    <Input
                      id="currentMedication"
                      name="currentMedication"
                      value={formData.currentMedication}
                      onChange={handleChange}
                      placeholder="Metformin, Lisinopril, Aspirin..."
                      className=" dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-1/2 border-[hsl(var(--border))] bg-transparent"
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
                    Creating Patient...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Patient
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
