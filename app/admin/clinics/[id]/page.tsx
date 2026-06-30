"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/store"
import { fetchClinicById } from "@/lib/slices/clinicSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Building2,
    MapPin,
    User,
    ArrowLeft,
    Pencil,
    Loader2,
    Phone,
    Mail,
    CheckCircle,
    XCircle,
    Calendar,
    Briefcase,
    Clock,
    FileText,
    Users,
    DollarSign
} from "lucide-react"


export default function ClinicDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const { currentClinic: clinic, loading, error } = useSelector((state: RootState) => state.clinics)

    useEffect(() => {
        if (params.id) {
            dispatch(fetchClinicById(params.id as string))
        }
    }, [params.id, dispatch])

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#1DA68F]" />
            </div>
        )
    }

    if (error || !clinic) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <p className="text-red-500">{error || "Clinic not found"}</p>
                <Button onClick={() => router.push("/admin/clinics")}>Back to List</Button>
            </div>
        )
    }
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Navigation & Actions */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" /> Back to Clinics
                    </Button>
                    <Link href={`/admin/clinics/${clinic._id}/edit`}>
                        <Button className="gap-2 bg-[#1DA68F] hover:bg-[#168f73]">
                            <Pencil className="h-4 w-4" /> Edit Clinic
                        </Button>
                    </Link>
                </div>

                {/* Header Card */}
                <div className="bg-gradient-to-r from-[#126A5C] to-[#1DA68F] rounded-xl p-8 shadow-lg text-white">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="h-24 w-24 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                            {clinic.logo ? (
                                <img 
                                    src={clinic.logo} 
                                    alt={clinic.clinicName || 'Clinic logo'}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Building2 className="h-12 w-12" />
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold">{clinic.clinicName}</h1>
                                {clinic.status && (
                                    <Badge 
                                        variant={clinic.status === "active" ? "default" : "secondary"}
                                        className={clinic.status === "active" 
                                            ? "bg-green-500 text-white hover:bg-green-600" 
                                            : "bg-gray-500 text-white hover:bg-gray-600"
                                        }
                                    >
                                        {clinic.status === "active" ? (
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                        ) : (
                                            <XCircle className="h-3 w-3 mr-1" />
                                        )}
                                        {clinic.status}
                                    </Badge>
                                )}
                                {clinic.isEmailVerified && (
                                    <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Email Verified
                                    </Badge>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                                {clinic.createdAt && (
                                    <span className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Created: {new Date(clinic.createdAt).toLocaleDateString()}
                                    </span>
                                )}
                                {clinic.ownerName && (
                                    <span className="flex items-center gap-2">
                                        <User className="h-4 w-4" /> Owner: {clinic.ownerName}
                                    </span>
                                )}
                            </div>
                        </div>
                       
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Briefcase className="h-5 w-5 text-[#1DA68F]" />
                            Clinic Speciality Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {clinic.clinicSpecaility && clinic.clinicSpecaility.length > 0 ? (
                                clinic.clinicSpecaility.map((specialty, index) => (
                                    <div key={index} className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-2">
                                            <Briefcase className="h-4 w-4" />
                                            <span className="text-sm font-medium">Specialty</span>
                                        </div>
                                        <p className="text-lg font-bold text-teal-700 dark:text-teal-300 capitalize">
                                            {specialty}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 md:col-span-4 text-center text-gray-500 italic p-4">
                                    No specialties available
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Cards - ONLY THING ADDED */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Briefcase className="h-5 w-5 text-[#1DA68F]" />
                            Clinic Statistics
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                                    <Users className="h-4 w-4" />
                                    <span className="text-sm font-medium">Assistants</span>
                                </div>
                                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                                    {clinic?.totalAssistants || 0}
                                </p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                                    <Users className="h-4 w-4" />
                                    <span className="text-sm font-medium">Doctors</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                    {clinic?.totalDoctors || 0}
                                </p>
                            </div>

                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                                    <Users className="h-4 w-4" />
                                    <span className="text-sm font-medium">Patients</span>
                                </div>
                                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                    {clinic?.totalPatients || 0}
                                </p>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                                    <DollarSign className="h-4 w-4" />
                                    <span className="text-sm font-medium">Revenue</span>
                                </div>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                    ${clinic?.totalRevenue || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Clinic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Building2 className="h-5 w-5 text-[#1DA68F]" />
                                Clinic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {clinic.email && (
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Clinic Email</p>
                                        <p className="font-medium">{clinic.email}</p>
                                    </div>
                                </div>
                            )}
                            {clinic.clinicPhone && (
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Clinic Phone</p>
                                        <p className="font-medium">{clinic.clinicPhone}</p>
                                    </div>
                                </div>
                            )}
                            {clinic.clinicFax && (
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Clinic Fax</p>
                                        <p className="font-medium">{clinic.clinicFax}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Owner Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5 text-[#1DA68F]" />
                                Owner Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {clinic.ownerName && (
                                <div className="flex items-start gap-2">
                                    <span className="text-xs text-gray-500 w-24">Name:</span>
                                    <span className="font-medium flex-1">{clinic.ownerName}</span>
                                </div>
                            )}
                            {clinic.ownerEmail && (
                                <div className="flex items-start gap-2">
                                    <span className="text-xs text-gray-500 w-24">Email:</span>
                                    <span className="font-medium flex-1">{clinic.ownerEmail}</span>
                                </div>
                            )}
                            {clinic.ownerPhone && (
                                <div className="flex items-start gap-2">
                                    <span className="text-xs text-gray-500 w-24">Phone:</span>
                                    <span className="font-medium flex-1">{clinic.ownerPhone}</span>
                                </div>
                            )}
                            {clinic.ownerAge && (
                                <div className="flex items-start gap-2">
                                    <span className="text-xs text-gray-500 w-24">Age:</span>
                                    <span className="font-medium flex-1">{clinic.ownerAge}</span>
                                </div>
                            )}
                            {clinic.ownerGender && (
                                <div className="flex items-start gap-2">
                                    <span className="text-xs text-gray-500 w-24">Gender:</span>
                                    <Badge variant="outline" className="capitalize">
                                        {clinic.ownerGender}
                                    </Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Location */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPin className="h-5 w-5 text-[#1DA68F]" />
                                Location Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {clinic.address ? (
                                <div className="space-y-2">
                                    {clinic.address.street && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-xs text-gray-500 w-20">Street:</span>
                                            <span className="font-medium flex-1">{clinic.address.street}</span>
                                        </div>
                                    )}
                                    {clinic.address.city && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-xs text-gray-500 w-20">City:</span>
                                            <span className="font-medium flex-1">{clinic.address.city}</span>
                                        </div>
                                    )}
                                    {clinic.address.state && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-xs text-gray-500 w-20">State:</span>
                                            <span className="font-medium flex-1">{clinic.address.state}</span>
                                        </div>
                                    )}
                                    {clinic.address.zipCode && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-xs text-gray-500 w-20">Zip Code:</span>
                                            <span className="font-medium flex-1">{clinic.address.zipCode}</span>
                                        </div>
                                    )}
                                    {clinic.address.country && (
                                        <div className="flex items-start gap-2">
                                            <span className="text-xs text-gray-500 w-20">Country:</span>
                                            <span className="font-medium flex-1">{clinic.address.country}</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No address information available.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Additional Information */}
                    {(clinic.bio || clinic.description) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <FileText className="h-5 w-5 text-[#1DA68F]" />
                                    Additional Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {clinic.bio && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Bio</p>
                                        <p className="text-sm">{clinic.bio}</p>
                                    </div>
                                )}
                                {clinic.description && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Description</p>
                                        <p className="text-sm">{clinic.description}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Timezone */}
                    {clinic.timezone && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Clock className="h-5 w-5 text-[#1DA68F]" />
                                    Timezone
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Badge variant="outline">{clinic.timezone}</Badge>
                            </CardContent>
                        </Card>
                    )}

                </div>
            </div>
        </div>
    )
}