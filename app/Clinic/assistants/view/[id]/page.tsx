"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  User,
  MapPin,
  Phone,
  Briefcase,
} from "lucide-react";
import type { AppDispatch, RootState } from "@/lib/store";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchClinicAssistant } from "@/lib/slices/clinicAssistantSlice";
import { fetchClinics } from "@/lib/slices/clinicSlice";
import moment from "moment";

export default function ViewAssistantProfile() {
  const params = useParams();
  const router = useRouter();
  const { clinicAssistant, loading } = useSelector(
    (state: RootState) => state.clinicAssistants
  );
  const { clinics } = useSelector((state: RootState) => state.clinics);
  const dispatch = useDispatch<AppDispatch>();
  const assistantId = params.id as string;

  useEffect(() => {
    // Fetch specific clinic clinicAssistant data when component mounts
    if (assistantId) {
      dispatch(fetchClinicAssistant(assistantId));
    }
  }, [dispatch, assistantId]);
  // useEffect(() => {
  //   // Fetch clinics for displaying assigned clinic
  //   dispatch(fetchClinics());
  // }, [dispatch]);

  const selectedClinic = useMemo(
    () => clinics.find((clinic) => clinic._id === clinicAssistant?.clinicRef),
    [clinics, clinicAssistant?.clinicRef]
  );

  if (!clinicAssistant) {
    return (
      <ProtectedRoute allowedRoles={["clinic"]}>
        <div className="min-h-screen bg-[hsl(var(--color-gray-50))] flex items-center justify-center">
          <div className="text-center">
            <p className="text-[hsl(var(--muted-foreground))]">
              Assistant not found
            </p>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
              Looking for clinicAssistant ID: {assistantId}
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
                  View Assistant
                </h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  View clinicAssistant information and settings
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-[hsl(var(--border))] bg-transparent"
                onClick={() => router.push("/clinic/assistants")}
              >
                Back to Assistants
              </Button>
              <Button
                onClick={() =>
                  router.push(`/clinic/assistants/edit/${clinicAssistant._id}`)
                }
                className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white"
              >
                Edit Assistant
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
                          clinicAssistant.profilePicture ||
                          "/placeholder.svg?height=80&width=80"
                        }
                        alt={`${clinicAssistant.firstName} ${clinicAssistant.lastName}`}
                      />
                      <AvatarFallback className="bg-[hsl(var(--color-gray-200))] text-[hsl(var(--muted-foreground))] text-lg">
                        {clinicAssistant.firstName && clinicAssistant.lastName
                          ? `${clinicAssistant.firstName[0]}${clinicAssistant.lastName[0]}`
                          : "AS"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Profile Image
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
                    <Label className="text-[hsl(var(--foreground))]">
                      First Name *
                    </Label>
                    <Input
                      value={clinicAssistant.firstName || ""}
                      className=" border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">
                      Last Name *
                    </Label>
                    <Input
                      value={clinicAssistant.lastName || ""}
                      className=" border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">
                      Date of Birth *
                    </Label>
                    <Input
                      value={moment(clinicAssistant.dateOfBirth).format("YYYY-MM-DD") || ""}
                      className=" border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">Age</Label>
                    <Input
                      value={clinicAssistant.age?.toString() || ""}
                      className=" border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">
                      Gender *
                    </Label>
                    <Input
                      value={
                        clinicAssistant.gender
                          ? clinicAssistant.gender.charAt(0).toUpperCase() +
                            clinicAssistant.gender.slice(1)
                          : ""
                      }
                      className=" border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
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
                      value={clinicAssistant.email || ""}
                      className=" border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">
                      Phone Number *
                    </Label>
                    <Input
                      value={clinicAssistant.phoneNumber || ""}
                      className=" border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
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
                      value={clinicAssistant.address?.street || ""}
                      className=" border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                      readOnly
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">
                        City
                      </Label>
                      <Input
                        value={clinicAssistant.address?.city || ""}
                        className=" border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">
                        State
                      </Label>
                      <Input
                        value={clinicAssistant.address?.state || ""}
                        className=" border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
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
                        value={clinicAssistant.address?.zipCode || ""}
                        className=" border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[hsl(var(--foreground))]">
                        Country
                      </Label>
                      <Input
                        value={clinicAssistant.address?.country || ""}
                        className=" border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                        readOnly
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
                    <Label className="text-[hsl(var(--foreground))]">
                      Assigned Clinic *
                    </Label>
                    <Input
                      value={selectedClinic?.clinicName || ""}
                      className=" border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">
                      Department
                    </Label>
                    <Input
                      value={clinicAssistant.department || ""}
                      className=" border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">
                      Position
                    </Label>
                    <Input
                      value={clinicAssistant.position || ""}
                      className=" border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                      readOnly
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[hsl(var(--foreground))]">
                      Status
                    </Label>
                    <Input
                      value={
                        clinicAssistant.status
                          ? clinicAssistant.status.charAt(0).toUpperCase() +
                            clinicAssistant.status.slice(1).replace("_", " ")
                          : ""
                      }
                      className=" border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]"
                      readOnly
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
