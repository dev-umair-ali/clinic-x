"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Camera, User, MapPin, Briefcase, Globe } from "lucide-react";
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
import { fetchAssistantDoctors } from "@/lib/slices/assistantDoctorSlice";

export default function ViewDoctorProfile() {
  const params = useParams();
  const router = useRouter();
  const { assistantDoctor, loading } = useSelector((state: RootState) => state.assistantDoctors);
  const dispatch = useDispatch<AppDispatch>();
  const doctorId = params.id as string;

  useEffect(() => {
    if (doctorId) dispatch(fetchAssistantDoctors());
  }, [dispatch, doctorId]);

  const formatTextField = (value: any, fallback: string) =>
    typeof value === "string" ? value : value && typeof value === "object" ? JSON.stringify(value) : fallback;

  /* ---------------------------------------------------------- */
  /*    NEW LAYOUT  –  100 %  CLINIC  STYLE  –  ZERO  LOGIC     */
  /* ---------------------------------------------------------- */
  return (
    <ProtectedRoute allowedRoles={["assistant"]}>
      <div className="min-h-screen bg-[hsl(var(--background))]">
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
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">View Doctor</h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">View doctor information and settings</p>
              </div>
            </div>
          </div>
        </div>

        {/* ------- BODY (clinic card layout) ------- */}
        <div className="max-w-7xl mx-auto px-6 py-8">
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
                <Avatar className="h-20 w-20">
                  <AvatarImage src={assistantDoctor?.profilePicture || "/placeholder.svg?height=80&width=80"} />
                  <AvatarFallback className="bg-[hsl(var(--color-gray-200))] text-[hsl(var(--muted-foreground))] text-lg">
                    {assistantDoctor?.firstName ? assistantDoctor.firstName.split(" ").map((n) => n[0]).join("") : "DR"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--foreground))]">Profile Image</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Proposed size 512 × 512 px, max 2.5 MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Basic Information */}
            <Card className="border-[hsl(var(--border))] shadow-sm">
              <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                  <User className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-[hsl(var(--card))] space-y-4">
                <div>
                  <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">First Name</Label>
                  <Input value={assistantDoctor?.firstName || ""} readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Last Name</Label>
                  <Input value={assistantDoctor?.lastName || ""} readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Full Name</Label>
                  <Input value={`${assistantDoctor?.firstName || ""} ${assistantDoctor?.lastName || ""}`.trim()} readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Email Address</Label>
                  <Input value={assistantDoctor?.email || ""} readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Phone Number</Label>
                  <Input value={assistantDoctor?.phoneNumber || ""} readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Age</Label>
                  <Input value={assistantDoctor?.age?.toString() || ""} readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Date of Birth</Label>
                  <Input value={assistantDoctor?.dateOfBirth || ""} readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Gender</Label>
                  <Input
                    value={assistantDoctor?.gender ? assistantDoctor.gender.charAt(0).toUpperCase() + assistantDoctor.gender.slice(1) : ""}
                    readOnly
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Years of Experience</Label>
                  <Input value={assistantDoctor?.yearsOfExperience?.toString() || ""} readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Bio</Label>
                  <Textarea value={formatTextField(assistantDoctor?.bio, "")} readOnly className="mt-1 min-h-[80px]" />
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
                  <div>
                    <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Street</Label>
                    <Input value={(assistantDoctor?.address as any)?.street || ""} readOnly className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">City</Label>
                      <Input value={(assistantDoctor?.address as any)?.city || ""} readOnly className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">State</Label>
                      <Input value={(assistantDoctor?.address as any)?.state || ""} readOnly className="mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Zip Code</Label>
                      <Input value={(assistantDoctor?.address as any)?.zipCode || ""} readOnly className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Country</Label>
                      <Input value={(assistantDoctor?.address as any)?.country || ""} readOnly className="mt-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Professional Information */}
          <Card className="border-[hsl(var(--border))] shadow-sm mt-6">
            <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                <Briefcase className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-[hsl(var(--card))]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Specialty</Label>
                  <Input value={assistantDoctor?.specialization || ""} readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">License Number</Label>
                  <Input value={assistantDoctor?.licenseNumber || ""} readOnly className="mt-1" />
                </div>
              </div>

              {/* Languages */}
              <div className="mt-6">
                <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Languages</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {["English", "Spanish", "French", "German", "Italian", "Portuguese", "Arabic", "Chinese"].map((lang) => (
                    <div key={lang} className="flex items-center space-x-2">
                      <Checkbox id={`lang-${lang}`} checked={assistantDoctor?.languages?.includes(lang) || false} disabled />
                      <Label htmlFor={`lang-${lang}`} className="text-sm text-[hsl(var(--muted-foreground))]">
                        {lang}
                      </Label>
                    </div>
                  ))}
                </div>
                {assistantDoctor?.languages && assistantDoctor.languages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {assistantDoctor.languages.map((lang: string) => (
                      <Badge key={lang} className="bg-[hsl(var(--color-chart-blue)/0.1)] text-[hsl(var(--color-chart-blue))] border border-[hsl(var(--color-chart-blue))]">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status & Actions */}
          <Card className="border-[hsl(var(--border))] shadow-sm mt-6">
            <CardHeader className="bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                <Globe className="h-5 w-5 text-[hsl(var(--color-brand-teal))]" />
                Status & Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-[hsl(var(--card))]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Status</Label>
                  <Badge
                    variant={assistantDoctor?.status === "active" ? "default" : "destructive"}
                    className={
                      assistantDoctor?.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }
                  >
                    {assistantDoctor?.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))]">HIPAA Consent</Label>
                  <Badge
                    variant={assistantDoctor?.hipaaConsent ? "default" : "destructive"}
                    className={
                      assistantDoctor?.hipaaConsent
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }
                  >
                    {assistantDoctor?.hipaaConsent ? "Consented" : "Not Consented"}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/assistant/doctors")}
                  className="border-[hsl(var(--border))] bg-transparent"
                >
                  Back to Doctors
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push(`/assistant/doctors/edit/${assistantDoctor?._id}`)}
                  className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white"
                >
                  Edit Doctor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}