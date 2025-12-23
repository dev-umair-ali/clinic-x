"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Building2,
    MapPin,
    Clock,
    User,
    ArrowLeft,
    Pencil,
    Loader2,
    Globe
} from "lucide-react"
import api from "@/lib/api/axios"

interface Clinic {
    _id: string
    name: string
    address?: {
        street: string
        city: string
        state: string
        zipCode: string
        country: string
    }
    ownerUser?: string
    settings?: {
        timezone?: string
        currency?: string
    }
    createdAt?: string
}

export default function ClinicDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [clinic, setClinic] = useState<Clinic | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchClinic = async () => {
            try {
                setIsLoading(true)
                const res = await api.get(`/clinics/${params.id}`)
                setClinic(res.data)
            } catch (err: any) {
                setError("Failed to load clinic details.")
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        if (params.id) fetchClinic()
    }, [params.id])

    if (isLoading) {
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
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Navigation & Actions */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" /> Back to Clinics
                    </Button>
                    <Link href={`/admin/clinics/${clinic._id}/edit`}>
                        <Button variant="outline" className="gap-2">
                            <Pencil className="h-4 w-4" /> Edit Clinic
                        </Button>
                    </Link>
                </div>

                {/* Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="h-20 w-20 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[#1DA68F]">
                        <Building2 className="h-10 w-10" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{clinic.name}</h1>
                            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                {clinic.settings?.timezone || "UTC"}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
                            <span className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" /> ID: {clinic._id}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" /> Created: {clinic.createdAt ? new Date(clinic.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Location */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPin className="h-5 w-5 text-[#1DA68F]" />
                                Location Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {clinic.address ? (
                                <>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <span className="text-gray-500">Street:</span>
                                        <span className="col-span-2 font-medium">{clinic.address.street}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <span className="text-gray-500">City:</span>
                                        <span className="col-span-2 font-medium">{clinic.address.city}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <span className="text-gray-500">State/Prov:</span>
                                        <span className="col-span-2 font-medium">{clinic.address.state}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <span className="text-gray-500">Zip Code:</span>
                                        <span className="col-span-2 font-medium">{clinic.address.zipCode}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <span className="text-gray-500">Country:</span>
                                        <span className="col-span-2 font-medium">{clinic.address.country}</span>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-500 italic">No address information available.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Admin & Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5 text-[#1DA68F]" />
                                Administrator & Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <span className="text-gray-500">Owner User ID:</span>
                                <span className="col-span-2 font-mono text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded truncate">
                                    {clinic.ownerUser || "Not Assigned"}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <span className="text-gray-500">Timezone:</span>
                                <span className="col-span-2 font-medium">{clinic.settings?.timezone || "UTC"}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm">
                                <span className="text-gray-500">Currency:</span>
                                <span className="col-span-2 font-medium">{clinic.settings?.currency || "USD"}</span>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}
