"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Camera,
  User,
  Phone,
  MapPin,
  Briefcase,
  Globe,
  Loader2,
} from "lucide-react";
import type { AppDispatch, RootState } from "@/lib/store";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchClinicDoctor } from "@/lib/slices/clinicDoctorSlice";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function ViewDoctorProfile() {
  const params = useParams();
  const router = useRouter();
  const { clinicDoctor, loading } = useSelector(
    (state: RootState) => state.clinicDoctors,
  );
  const dispatch = useDispatch<AppDispatch>();
  const doctorId = params.id as string;
  const { toast } = useToast();

  useEffect(() => {
    if (doctorId) {
      dispatch(fetchClinicDoctor(doctorId));
    }
  }, [dispatch, doctorId]);

  // Helper function to format text fields
  const formatTextField = (value: any, fallback: string) => {
    if (typeof value === "string") {
      return value;
    } else if (value && typeof value === "object") {
      return JSON.stringify(value);
    }
    return fallback;
  };

  return (
    <ProtectedRoute allowedRoles={["clinic"]}>
      <Toaster />
      <div className="min-h-screen bg-[hsl(var(--background))]">
        {/* Header */}
        <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
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
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                  View Doctor
                </h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  View doctor information and settings
                </p>
              </div>
            </div>
            {/* Actions */}
            <div>
              <Button
                type="button"
                onClick={() =>
                  router.push(`/clinic/doctors/edit/${clinicDoctor?._id}`)
                }
                className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white"
              >
                Edit Doctor
              </Button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-6">
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
                          clinicDoctor?.profilePicture ||
                          "/placeholder.svg?height=80&width=80"
                        }
                        alt={`${clinicDoctor?.firstName} ${clinicDoctor?.lastName}`}
                      />
                      <AvatarFallback className="bg-[hsl(var(--color-gray-200))] text-[hsl(var(--muted-foreground))] text-lg">
                        {clinicDoctor?.name
                          ? `${clinicDoctor?.name.split(" ")[0][0]}${clinicDoctor?.name.split(" ")[1]?.[0] || ""}`
                          : "DR"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[hsl(var(--color-brand-teal))] rounded-full flex items-center justify-center">
                      <Camera className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Profile Image
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
                    <Label className="text-[hsl(var(--foreground))]">
                      First Name *
                    </Label>
                    <Input
                      value={clinicDoctor?.firstName || ""}
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">
                      Last Name *
                    </Label>
                    <Input
                      value={clinicDoctor?.lastName || ""}
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">
                      Date of Birth *
                    </Label>
                    <Input
                      value={clinicDoctor?.dateOfBirth || ""}
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Age</Label>
                    <Input
                      value={clinicDoctor?.age?.toString() || ""}
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">
                      Gender *
                    </Label>
                    <Input
                      value={
                        clinicDoctor?.gender
                          ? clinicDoctor?.gender.charAt(0).toUpperCase() +
                            clinicDoctor?.gender.slice(1)
                          : ""
                      }
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Bio</Label>
                    <Textarea
                      value={formatTextField(clinicDoctor?.bio, "")}
                      rows={3}
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      readOnly
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
                    <Label className="text-[hsl(var(--foreground))]">
                      Email Address *
                    </Label>
                    <Input
                      value={clinicDoctor?.email || ""}
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">
                      Phone Number *
                    </Label>
                    <Input
                      value={clinicDoctor?.phoneNumber || ""}
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      readOnly
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
                    <Label className="text-[hsl(var(--foreground))]">
                      Street Address
                    </Label>
                    <Input
                      value={(clinicDoctor?.address as any)?.street || ""}
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      readOnly
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">
                        City
                      </Label>
                      <Input
                        value={(clinicDoctor?.address as any)?.city || ""}
                        className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">
                        State
                      </Label>
                      <Input
                        value={(clinicDoctor?.address as any)?.state || ""}
                        className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">
                        Zip Code
                      </Label>
                      <Input
                        value={(clinicDoctor?.address as any)?.zipCode || ""}
                        className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">
                        Country
                      </Label>
                      <Input
                        value={(clinicDoctor?.address as any)?.country || ""}
                        className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                        readOnly
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
                    <Label className="text-[hsl(var(--foreground))]">
                      Specialty *
                    </Label>
                    <Input
                      value={clinicDoctor?.specialization || ""}
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">
                      Years of Experience *
                    </Label>
                    <Input
                      value={clinicDoctor?.yearsOfExperience?.toString() || ""}
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">
                      License Number *
                    </Label>
                    <Input
                      value={clinicDoctor?.licenseNumber || ""}
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">
                      Education Summary
                    </Label>
                    <Input
                      value={formatTextField(
                        clinicDoctor?.educationSummary,
                        "",
                      )}
                      className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">
                      Status
                    </Label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          clinicDoctor?.status === "active"
                            ? "default"
                            : "destructive"
                        }
                        className={
                          clinicDoctor?.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }
                      >
                        {clinicDoctor?.status === "active"
                          ? "Active"
                          : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">
                      HIPAA Consent
                    </Label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          clinicDoctor?.hipaaConsent ? "default" : "destructive"
                        }
                        className={
                          clinicDoctor?.hipaaConsent
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }
                      >
                        {clinicDoctor?.hipaaConsent
                          ? "Consented"
                          : "Not Consented"}
                      </Badge>
                    </div>
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
                  ].map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <Checkbox
                        checked={
                          clinicDoctor?.languages?.includes(language) || false
                        }
                        disabled
                        className="border-[hsl(var(--border))] dark:border-[hsl(var(--border))]"
                      />
                      <Label className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                        {language}
                      </Label>
                    </div>
                  ))}
                </div>
                {clinicDoctor?.languages &&
                  clinicDoctor?.languages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {clinicDoctor?.languages.map((language: string) => (
                        <span
                          key={language}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] border border-[hsl(var(--color-chart-blue))]"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Availability Information */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <Briefcase className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Availability Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))]">
                <div className="space-y-2">
                  <Label className="text-[hsl(var(--foreground))]">
                    Time Zone
                  </Label>
                  <Input
                    value={(clinicDoctor as any)?.timeZone || "Asia/Karachi"}
                    className="border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]"
                    readOnly
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
