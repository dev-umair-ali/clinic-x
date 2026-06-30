"use client";

import type React from "react";
import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { updateClinicAssistant, fetchClinicAssistant } from "@/lib/slices/clinicAssistantSlice";
import { fetchClinics } from "@/lib/slices/clinicSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Camera,
  User,
  MapPin,
  Phone,
  Briefcase,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { DatePicker } from "@/components/ui/date-picker";

interface AssistantFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  age: string;
  gender: string;
  dateOfBirth: string;
  department: string;
  position: string;
  clinicRef: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  profilePicture: string;
}

export default function EditAssistantPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const assistantId = params.id as string;

  const { clinicAssistant, loading: assistantsLoading } = useSelector(
    (state: RootState) => state.clinicAssistants
  );
  const { clinics } = useSelector((state: RootState) => state.clinics);

  const [formData, setFormData] = useState<AssistantFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
    department: "",
    position: "",
    clinicRef: "",
    profilePicture: "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   // Fetch clinics for dropdown
  //   dispatch(fetchClinics());
  // }, [dispatch]);

  useEffect(() => {
    // Fetch specific clinicAssistant data when component mounts
    if (assistantId) {
      dispatch(fetchClinicAssistant(assistantId));
    }
  }, [dispatch, assistantId]);

  // Find selected clinic to show its data - memoized for performance
  const selectedClinic = useMemo(
    () => clinics.find((clinic) => clinic._id === formData.clinicRef),
    [clinics, formData.clinicRef]
  );

  // Populate form data when single clinicAssistant is loaded
  useEffect(() => {
    if (clinicAssistant && clinicAssistant._id === assistantId) {
      setFormData({
        firstName: clinicAssistant.firstName || "",
        lastName: clinicAssistant.lastName || "",
        email: clinicAssistant.email || "",
        phoneNumber: clinicAssistant.phoneNumber || "",
        age: clinicAssistant.age?.toString() || "",
        dateOfBirth: clinicAssistant.dateOfBirth || "",
        gender: clinicAssistant.gender || "",
        address: {
          street: clinicAssistant.address?.street || "",
          city: clinicAssistant.address?.city || "",
          state: clinicAssistant.address?.state || "",
          zipCode: clinicAssistant.address?.zipCode || "",
          country: clinicAssistant.address?.country || "USA",
        },
        department: clinicAssistant.department || "",
        position: clinicAssistant.position || "",
        clinicRef: clinicAssistant.clinicRef || "",
        profilePicture: clinicAssistant.profilePicture || "",
      });
      setProfileImage(clinicAssistant.profilePicture || null);
    }
  }, [clinicAssistant, assistantId]);

  const handleInputChange = (field: keyof AssistantFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (
    field: keyof AssistantFormData["address"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("clinic-ai-token");

    if (!token) {
      toast({
        title: "Error",
        description: "No authentication token found. Please login again.",
        variant: "destructive",
      });
      return "";
    }

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
      toast({
        title: "Error",
        description: errorData.message || "Failed to upload image",
        variant: "destructive",
      });
      return "";
    }

    const result = await response.json();
    return result.fileUrl || result.profilePicture || result.data?.fileUrl;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!clinicAssistant) return;

    const newErrors: string[] = [];
    if (!formData.firstName.trim()) newErrors.push("First Name is required");
    if (!formData.lastName.trim()) newErrors.push("Last Name is required");
    if (!formData.email.trim()) newErrors.push("Email is required");
    if (!formData.phoneNumber.trim())
      newErrors.push("Phone Number is required");
    if (!formData.dateOfBirth) newErrors.push("Date of Birth is required");
    if (!formData.gender) newErrors.push("Gender is required");
    if (!formData.clinicRef) newErrors.push("Assigned Clinic is required");

    if (newErrors.length) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErrors([]);
    setIsLoading(true);

    try {
      const assistantData = {
        ...formData,
        age: Number.parseInt(formData.age) || 0,
        gender: formData.gender as "male" | "female" | "other",
        profilePicture: formData.profilePicture || profileImage || "",
      };

      const response = await dispatch(
        updateClinicAssistant({ id: assistantId, assistantData })
      );

      if (response.meta.requestStatus === "fulfilled") {
        toast({
          title: "Success",
          description: "Assistant updated successfully!",
        });
        setTimeout(() => {
          router.push("/clinic/assistants/view/" + assistantId);
        }, 1500);
      } else if (response.meta.requestStatus === "rejected") {
        toast({
          title: "Error",
          description:
            typeof response.payload === "string"
              ? response.payload
              : "Failed to update clinicAssistant",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update clinicAssistant",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Please select a valid image file",
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

        if (profilePicture) {
          setFormData((prev) => ({
            ...prev,
            profilePicture: profilePicture,
          }));
          setProfileImage(profilePicture);
          toast({
            title: "Success",
            description: "Profile picture uploaded successfully!",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Error",
          description: "Failed to upload profile picture",
          variant: "destructive",
        });
      } finally {
        setImageUploading(false);
      }
    }
  };
  if (assistantsLoading) {
    return (
      <ProtectedRoute allowedRoles={["clinic"]}>
        <div className="min-h-screen bg-[hsl(var(--color-gray-50))] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--color-brand-teal))] mx-auto"></div>
            <p className="mt-4 text-[hsl(var(--muted-foreground))]">
              Loading clinicAssistant data...
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!clinicAssistant) {
    return (
      <ProtectedRoute allowedRoles={["clinic"]}>
        <div className="min-h-screen bg-[hsl(var(--color-gray-50))] flex items-center justify-center">
          <div className="text-center">
            <p className="text-[hsl(var(--muted-foreground))]">
              Assistant not found
            </p>
            <Button
              onClick={() => router.push("/clinic/assistants")}
              className="mt-4"
            >
              Back to Assistants
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["clinic"]}>
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Toaster />
        {/* Header */}
        <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-[hsl(var(--muted-foreground))]"
                onClick={() => router.push("/clinic/assistants")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                  Edit Assistant
                </h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Update clinicAssistant information and settings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {errors.length > 0 && (
            <div className="mb-6 bg-[hsl(var(--color-status-error-light))] border border-[hsl(var(--color-status-error-dark))] rounded-lg p-4">
              <h3 className="text-[hsl(var(--color-status-error-dark))] font-medium mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Please fix the following errors:
              </h3>
              <ul className="list-disc list-inside text-[hsl(var(--color-status-error-dark))] text-sm space-y-1">
                {errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

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
                        alt={`${formData.firstName} ${formData.lastName}`}
                      />
                      <AvatarFallback className="bg-[hsl(var(--color-gray-200))] text-[hsl(var(--muted-foreground))] text-lg">
                        {formData.firstName && formData.lastName
                          ? `${formData.firstName[0]}${formData.lastName[0]}`
                          : "AS"}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={imageUploading}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-[hsl(var(--color-brand-teal))] rounded-full flex items-center justify-center hover:bg-[hsl(var(--color-brand-teal-dark))] disabled:opacity-50"
                    >
                      <Camera className="h-3 w-3 text-[hsl(var(--primary-foreground))]" />
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
                      The Proposed size is 512 x 512 px and no longer bigger
                      than 2.5 MBs
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
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
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
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
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

                    {/* new calendar picker */}
                    <DatePicker
                      value={formData.dateOfBirth ?? ""} // YYYY-MM-DD string
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
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
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
                      onValueChange={(value) =>
                        handleInputChange("gender", value)
                      }
                    >
                      <SelectTrigger className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
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
                      placeholder="Enter email address"
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
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
                      placeholder="Enter phone number"
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
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
                      placeholder="Enter street address"
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
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
                        className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
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
                        className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
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
                        placeholder="Enter zip code"
                        className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
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
                        className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employment Information */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <Briefcase className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Employment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="clinicRef"
                      className="text-[hsl(var(--foreground))]"
                    >
                      Assigned Clinic *
                    </Label>
                    <Select
                      value={formData.clinicRef}
                      onValueChange={(value) =>
                        handleInputChange("clinicRef", value)
                      }
                    >
                      <SelectTrigger className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]">
                        <SelectValue placeholder="Select clinic">
                          {selectedClinic
                            ? selectedClinic.clinicName
                            : "Select clinic"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {clinics.map((clinic) => (
                          <SelectItem key={clinic._id} value={clinic._id}>
                            {clinic.clinicName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="department"
                      className="text-[hsl(var(--foreground))]"
                    >
                      Department
                    </Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                      placeholder="Enter department"
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="position"
                      className="text-[hsl(var(--foreground))]"
                    >
                      Position
                    </Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) =>
                        handleInputChange("position", e.target.value)
                      }
                      placeholder="e.g., Medical Assistant, Receptionist"
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex-1 border-[hsl(var(--border))] bg-transparent"
                onClick={() => router.push("/clinic/assistants")}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={isLoading || imageUploading}
                className="flex-1 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Assistant
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
