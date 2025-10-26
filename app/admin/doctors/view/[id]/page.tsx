"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {  useDispatch, useSelector } from "react-redux"
import { ArrowLeft, Camera } from "lucide-react"
import type { AppDispatch, RootState } from "@/lib/store"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { fetchDoctor } from "@/lib/slices/doctorSlice"

export default function ViewDoctorProfile() {
    const params = useParams()
    const router = useRouter()
    const { doctor, loading } = useSelector((state: RootState) => state.doctors)
    const dispatch = useDispatch<AppDispatch>()
    const doctorId = params.id as string

    useEffect(() => {
        // Fetch specific doctor data when component mounts
        if (doctorId) {
          dispatch(fetchDoctor(doctorId));
        }
      }, [dispatch, doctorId]);

    // Debug effect to track when doctor data changes
    useEffect(() => {
        if (doctor) {
            console.log("View page - Doctor data updated:", doctor);
        }
    }, [doctor])
    

    if (loading) {
        return (
            <ProtectedRoute allowedRoles={["admin"]}>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading doctor profile...</p>
                    </div>
                </div>
            </ProtectedRoute>
        )
    }

    if (!doctor) {
        return (
            <ProtectedRoute allowedRoles={["admin"]}>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-400">Doctor not found</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                            Looking for doctor ID: {doctorId}
                        </p>
                        {/* <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                            Total doctors in store: {doctor.length}
                        </p> */}
                        <Button onClick={() => router.push("/admin/doctors")} className="mt-4">
                            Back to Doctors
                        </Button>
                    </div>
                </div>
            </ProtectedRoute>
        )
    }

    // Helper function to format address
    const formatAddress = (address: any) => {
        if (typeof address === 'string') {
            return address;
        } else if (address && typeof address === 'object') {
            const parts = [];
            if (address.street) parts.push(address.street);
            if (address.city) parts.push(address.city);
            if (address.state) parts.push(address.state);
            if (address.country) parts.push(address.country);
            if (address.zipCode) parts.push(address.zipCode);
            return parts.length > 0 ? parts.join(', ') : 'Address not specified';
        }
        return "123 Main St, Anytown, USA";
    };

    // Helper function to format text fields
    const formatTextField = (value: any, fallback: string) => {
        if (typeof value === 'string') {
            return value;
        } else if (value && typeof value === 'object') {
            return JSON.stringify(value);
        }
        return fallback;
    };

    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <div className="min-h-screen bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto py-8 px-6">
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/admin/doctors")}
                            className="bg-[#1DA68F]/10 flex items-center gap-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:text-teal-300 dark:hover:bg-teal-950 p-2 -ml-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="text-sm">Back to Doctor</span>
                        </Button>
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            View doctor information and settings
                        </p>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Profile Picture Section */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                Profile Picture
                            </h3>
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage
                                            src={doctor.profilePicture || doctor.avatar || "/placeholder.svg?height=80&width=80"}
                                            alt={`${doctor.firstName} ${doctor.lastName}`}
                                        />
                                        <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-lg">
                                            {doctor.name
                                                ? doctor.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                : "DR"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                                        <Camera className="h-3 w-3 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Profile Image
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        The Proposed size is 512 x 512 px and no longer bigger than 2.5 MBs
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Basic Information */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Basic Information
                                </h3>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        First Name *
                                    </Label>
                                    <Input
                                        value={doctor.firstName || ""}
                                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Last Name *
                                    </Label>
                                    <Input
                                        value={doctor.lastName || ""}
                                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Full Name *
                                    </Label>
                                    <Input
                                        value={doctor.name || ""}
                                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email Address *
                                    </Label>
                                    <Input
                                        value={doctor.email || ""}
                                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Phone Number *
                                    </Label>
                                    <Input
                                        value={doctor.phone || ""}
                                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Age *
                                    </Label>
                                    <Input
                                        value={doctor.age?.toString() || ""}
                                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Date of Birth *
                                    </Label>
                                    <Input
                                        value={doctor.dateOfBirth || ""}
                                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Gender *
                                    </Label>
                                    <Input
                                        value={doctor.gender ? doctor.gender.charAt(0).toUpperCase() + doctor.gender.slice(1) : ""}
                                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Years of Experience
                                    </Label>
                                    <Input
                                        value={doctor.experience?.toString() || ""}
                                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</Label>
                                    <Textarea
                                        value={formatTextField(doctor.bio, "")}
                                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50 min-h-[80px]"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Education
                                    </Label>
                                    <Textarea
                                        value={formatTextField(doctor.educationSummary, "")}
                                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50 min-h-[60px]"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Address
                                    </Label>
                                    <Textarea
                                        value={formatAddress(doctor.address)}
                                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50 min-h-[60px]"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Status
                                    </Label>
                                    <div className="mt-1">
                                        <Badge
                                            variant={doctor.status === 'active' ? 'default' : 'destructive'}
                                            className={doctor.status === 'active'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }
                                        >
                                            {doctor.status === 'active' ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        HIPAA Consent
                                    </Label>
                                    <div className="mt-1">
                                        <Badge
                                            variant={doctor.hipaaConsent ? 'default' : 'destructive'}
                                            className={doctor.hipaaConsent
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }
                                        >
                                            {doctor.hipaaConsent ? 'Consented' : 'Not Consented'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Information */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Professional Information
                                </h3>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Specialty *
                                    </Label>
                                    <Input
                                        value={doctor.specialization || ""}
                                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        License Number *
                                    </Label>
                                    <Input
                                        value={doctor.licenseNumber || ""}
                                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50"
                                        readOnly
                                    />
                                </div>


                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Languages
                                    </Label>
                                    <div className="mt-1 space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            {["English", "Spanish", "French", "German", "Italian", "Portuguese", "Arabic", "Chinese"].map((language) => (
                                                <div key={language} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        checked={doctor.languages?.includes(language) || false}
                                                        className="border-gray-300 dark:border-gray-600"
                                                        disabled
                                                    />
                                                    <Label className="text-sm text-gray-700 dark:text-gray-300">
                                                        {language}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                        {doctor.languages && doctor.languages.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {doctor.languages.map((language: string) => (
                                                    <Badge
                                                        key={language}
                                                        variant="secondary"
                                                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700"
                                                    >
                                                        {language}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Availability Information */}
                                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                        Availability Information
                                    </h3>

                                    <div>
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Time Zone
                                        </Label>
                                        <Input
                                            value={doctor.timeZone || "Asia/Karachi"}
                                            className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-50"
                                            readOnly
                                        />
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Available Days
                                        </Label>
                                        <div className="mt-1 space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                                                    <div key={day} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            checked={doctor.availableDays?.some((daySlot: any) => daySlot.day === day) || false}
                                                            className="border-gray-300 dark:border-gray-600"
                                                            disabled
                                                        />
                                                        <Label className="text-sm text-gray-700 dark:text-gray-300">
                                                            {day}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                            {doctor.availableDays && doctor.availableDays.length > 0 && (
                                                <div className="space-y-2 mt-4">
                                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        Selected Time Slots:
                                                    </Label>
                                                    {doctor.availableDays.map((daySlot: any, index: number) => (
                                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                {daySlot.day}
                                                            </span>
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                {daySlot.from} - {daySlot.to}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/admin/doctors")}
                                className="px-6 py-2 text-sm font-medium border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
                            >
                                Back to Doctors
                            </Button>
                            <Button
                                type="button"
                                onClick={() => router.push(`/admin/doctors/edit/${doctor.id}`)}
                                className="px-6 py-2 text-sm font-medium bg-teal-600 hover:bg-teal-700 text-white"
                            >
                                Edit Doctor
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}