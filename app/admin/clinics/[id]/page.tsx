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
    Clock,
    User,
    ArrowLeft,
    Pencil,
    Loader2,
    Globe,
    Phone,
    Mail,
    DollarSign,
    Users,
    CheckCircle,
    XCircle,
    Calendar,
    Briefcase
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
                                    alt={clinic.clinicName || clinic.name || 'Clinic logo'}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Building2 className="h-12 w-12" />
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold">{clinic.clinicName || clinic.name}</h1>
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
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                                <span className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4" /> ID: {clinic._id.slice(-8)}
                                </span>
                                {clinic.createdAt && (
                                    <span className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Created: {new Date(clinic.createdAt).toLocaleDateString()}
                                    </span>
                                )}
                                {clinic.ownerUser && (
                                    <span className="flex items-center gap-2">
                                        <User className="h-4 w-4" /> Owner: {clinic.ownerUser}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {clinic.assignedDoctors !== undefined && (
                        <Card className="border-l-4 border-l-blue-500">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Assigned Doctors</p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {clinic.assignedDoctors.length}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {clinic.assignedPatients !== undefined && (
                        <Card className="border-l-4 border-l-purple-500">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Assigned Patients</p>
                                        <p className="text-3xl font-bold text-purple-600">
                                            {clinic.assignedPatients.length}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                                        <Users className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {clinic.revenue !== undefined && (
                        <Card className="border-l-4 border-l-green-500">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                                        <p className="text-3xl font-bold text-green-600">
                                            ${clinic.revenue.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                        <DollarSign className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Phone className="h-5 w-5 text-[#1DA68F]" />
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {clinic.phone && (
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Phone Number</p>
                                        <p className="font-medium">{clinic.phone}</p>
                                    </div>
                                </div>
                            )}
                            {clinic.email && (
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email Address</p>
                                        <p className="font-medium">{clinic.email}</p>
                                    </div>
                                </div>
                            )}
                            {!clinic.phone && !clinic.email && (
                                <p className="text-gray-500 italic">No contact information available.</p>
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
                                    <div className="flex items-start gap-2">
                                        <span className="text-xs text-gray-500 w-20">City:</span>
                                        <span className="font-medium flex-1">{clinic.address.city}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-xs text-gray-500 w-20">State:</span>
                                        <span className="font-medium flex-1">{clinic.address.state}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-xs text-gray-500 w-20">Zip Code:</span>
                                        <span className="font-medium flex-1">{clinic.address.zipCode}</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-xs text-gray-500 w-20">Country:</span>
                                        <span className="font-medium flex-1">{clinic.address.country}</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No address information available.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Globe className="h-5 w-5 text-[#1DA68F]" />
                                Settings & Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-2">
                                <span className="text-xs text-gray-500 w-24">Timezone:</span>
                                <Badge variant="outline">{clinic.settings?.timezone || "UTC"}</Badge>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-xs text-gray-500 w-24">Currency:</span>
                                <Badge variant="outline">{clinic.settings?.currency || "USD"}</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Services */}
                    {clinic.services && clinic.services.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Briefcase className="h-5 w-5 text-[#1DA68F]" />
                                    Services Offered
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {clinic.services.map((service, index) => (
                                        <Badge key={index} variant="secondary">
                                            {service}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                </div>
            </div>
        </div>
    )
}
