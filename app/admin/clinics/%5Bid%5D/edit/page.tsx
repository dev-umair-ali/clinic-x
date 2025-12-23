"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Building2,
    MapPin,
    User,
    Loader2,
    Save,
    ArrowLeft,
    CheckCircle,
    AlertCircle
} from "lucide-react"
import api from "@/lib/api/axios"

const timezones = [
    "UTC", "America/New_York", "America/Chicago", "America/Denver",
    "America/Los_Angeles", "Europe/London", "Europe/Paris", "Europe/Berlin",
    "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore", "Asia/Tokyo", "Australia/Sydney"
]

interface ClinicFormData {
    clinicName: string
    timezone: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    ownerUser: string
}

export default function EditClinicPage() {
    const params = useParams()
    const router = useRouter()
    const [formData, setFormData] = useState<ClinicFormData>({
        clinicName: "",
        timezone: "UTC",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        ownerUser: ""
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchClinic = async () => {
            try {
                setIsLoading(true)
                const res = await api.get(`/clinics/${params.id}`)
                const data = res.data
                setFormData({
                    clinicName: data.name || "",
                    timezone: data.settings?.timezone || "UTC",
                    street: data.address?.street || "",
                    city: data.address?.city || "",
                    state: data.address?.state || "",
                    zipCode: data.address?.zipCode || "",
                    country: data.address?.country || "",
                    ownerUser: data.ownerUser || ""
                })
            } catch (err: any) {
                setError("Failed to load clinic details.")
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        if (params.id) fetchClinic()
    }, [params.id])

    const handleInputChange = (field: keyof ClinicFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        setError(null)
        setIsSaving(true)

        try {
            const payload = {
                name: formData.clinicName,
                ownerUser: formData.ownerUser,
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: formData.country,
                },
                settings: {
                    timezone: formData.timezone,
                    currency: "USD",
                },
            }

            await api.put(`/clinics/${params.id}`, payload)
            setShowSuccess(true)
            setTimeout(() => router.push("/admin/clinics"), 1500)
        } catch (err: any) {
            console.error(err)
            setError(err.response?.data?.message || "Failed to update clinic.")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#1DA68F]" />
            </div>
        )
    }

    if (error && !formData.clinicName) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => router.push("/admin/clinics")}>Back to List</Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">

            {showSuccess && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
                    <CheckCircle className="h-5 w-5" />
                    Clinic updated successfully!
                </div>
            )}
            {error && (
                <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                </div>
            )}

            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Clinic</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Update clinic details.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Section 1: Clinic Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-[#1DA68F]" />
                                Clinic Details
                            </h3>
                        </div>

                        <Card className="lg:col-span-2 border-gray-200 dark:border-gray-700 shadow-sm">
                            <CardContent className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="clinicName">Clinic Name *</Label>
                                        <Input
                                            id="clinicName"
                                            value={formData.clinicName}
                                            onChange={(e) => handleInputChange("clinicName", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="timezone">Timezone *</Label>
                                        <Select
                                            value={formData.timezone}
                                            onValueChange={(val) => handleInputChange("timezone", val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Timezone" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {timezones.map((tz) => (
                                                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ownerUser">Owner User ID</Label>
                                    <Input
                                        id="ownerUser"
                                        value={formData.ownerUser}
                                        onChange={(e) => handleInputChange("ownerUser", e.target.value)}
                                        className="bg-gray-50"
                                    />
                                    <p className="text-xs text-gray-500">ID of the user who owns this clinic.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Section 2: Address */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-[#1DA68F]" />
                                Location
                            </h3>
                        </div>

                        <Card className="lg:col-span-2 border-gray-200 dark:border-gray-700 shadow-sm">
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="street">Street Address *</Label>
                                    <Input
                                        id="street"
                                        value={formData.street}
                                        onChange={(e) => handleInputChange("street", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => handleInputChange("city", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">State/Province *</Label>
                                        <Input
                                            id="state"
                                            value={formData.state}
                                            onChange={(e) => handleInputChange("state", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="zipCode">Zip/Postal Code *</Label>
                                        <Input
                                            id="zipCode"
                                            value={formData.zipCode}
                                            onChange={(e) => handleInputChange("zipCode", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country *</Label>
                                        <Input
                                            id="country"
                                            value={formData.country}
                                            onChange={(e) => handleInputChange("country", e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#1DA68F] hover:bg-[#168f73] min-w-[140px]" disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Update Clinic
                                </>
                            )}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    )
}
