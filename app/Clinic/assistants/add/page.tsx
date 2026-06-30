"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  MapPin,
  Phone,
  ArrowLeft,
  Save,
  Loader2,
  Briefcase,
  AlertCircle,
  Camera,
} from "lucide-react";
import type { AppDispatch } from "@/lib/store";
import { createClinicAssistant } from "@/lib/slices/clinicAssistantSlice";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import moment from "moment";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { DatePicker } from "@/components/ui/date-picker";
import { getClinicId } from "@/lib/utils/auth-utils";

/* ---------  TYPES  --------- */
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
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  profilePicture: string;
}

/* ---------  MAIN PAGE  --------- */
export default function AddAssistantPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [clinicId, setClinicId] = useState<string | null>(null);

  const [formData, setFormData] = useState<AssistantFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    age: "",
    gender: "",
    dateOfBirth: "",
    department: "",
    position: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
    profilePicture: "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    // Get clinic ID when component mounts
    const id = getClinicId();
    setClinicId(id);
    
    if (!id) {
      toast({
        title: "Error",
        description: "Unable to determine clinic ID. Please log in again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  /* ----------  HANDLERS  ---------- */
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
          setFormData((prev) => ({ ...prev, profilePicture }));
          setProfileImage(profilePicture);
          toast({
            title: "Success",
            description: "Profile picture uploaded successfully!",
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
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // // Validate clinic ID
    // if (!clinicId) {
    //   toast({
    //     title: "Error",
    //     description: "Clinic ID not found. Please log in again.",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    const newErrors: string[] = [];
    if (!formData.firstName.trim()) newErrors.push("First Name is required");
    if (!formData.lastName.trim()) newErrors.push("Last Name is required");
    if (!formData.email.trim()) newErrors.push("Email is required");
    if (!formData.phoneNumber.trim())
      newErrors.push("Phone Number is required");
    if (!formData.dateOfBirth) newErrors.push("Date of Birth is required");
    if (!formData.gender) newErrors.push("Gender is required");

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
        role: "assistant" as const,
        clinicRef: clinicId ?? undefined, // Ensure clinicRef is string or undefined
      };

      const response = await dispatch(createClinicAssistant(assistantData));
      if (response.meta.requestStatus === "fulfilled") {
        router.push("/Clinic/assistants/view/" + (response.payload as any)._id);
      } 
      else if (response.meta.requestStatus === "rejected") {
        toast({
          title: "Error",
          description:
            typeof response.payload === "string"
              ? response.payload
              : "Failed to add assistant",
          variant: "destructive",
        });
        
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add assistant",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ----------  RENDER  ---------- */
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
                onClick={() => router.push("/Clinic/assistants")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                  Add New Assistant
                </h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Register a new assistant for your clinic
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
                        alt="Assistant"
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

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="w-1/2 border-[hsl(var(--border))] bg-transparent"
                onClick={() => router.push("/Clinic/assistants")}
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
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
                    <Save className="h-4 w-4 mr-2" />
                    Save Assistant
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
