"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { fetchClinics, clinicStatusChange } from "@/lib/slices/clinicSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Building2,
    Plus,
    Pencil,
    RefreshCw,
    Eye,
    Search,
    Loader2,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Users,
    DollarSign,
    Globe,
    CheckCircle,
    XCircle
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Clinic } from "@/lib/api/services/clinicService"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ClinicsListPage() {
    const dispatch = useDispatch<AppDispatch>()
    const { clinics, loading, error } = useSelector((state: RootState) => state.clinics)
    const [searchQuery, setSearchQuery] = useState("")
    const [clinicIdForStatus, setClinicIdForStatus] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        dispatch(fetchClinics())
    }, [dispatch])

    const handleStatusChange = async (clinic: Clinic) => {
        if (!clinicIdForStatus) return
        setIsDeleting(true)
        try {
            if (!clinic) throw new Error("Clinic not found")
            await dispatch(clinicStatusChange({ id: clinic._id, data: { status: clinic.status === 'active' ? 'inactive' : 'active' } })).unwrap()
            dispatch(fetchClinics());
            setClinicIdForStatus(null)
            setIsDeleting(false)
        } catch (err: any) {
            setIsDeleting(false)
            setClinicIdForStatus(null)
            dispatch(fetchClinics());
            console.error("Failed to change clinic status", err)
            let errorMessage = err?.message || err?.error || err || "Something went wrong."
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false)
        }
    }

    const filteredClinics = clinics.filter((clinic) => {
        // Skip null/undefined clinics
        if (!clinic) return false

        const name = clinic.clinicName || ""
        const city = clinic.address?.city || ""
        const owner = clinic.ownerName || ""
        const query = searchQuery.toLowerCase()

        return name.toLowerCase().includes(query) ||
            city.toLowerCase().includes(query) ||
            owner.toLowerCase().includes(query)
    })

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
            <Toaster />
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Building2 className="h-8 w-8 text-[#1DA68F]" />
                            Clinics
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Manage all registered clinics in the system ({clinics.length} total)
                        </p>
                    </div>
                    <Link href="/admin/clinics/add">
                        <Button className="bg-[#1DA68F] hover:bg-[#168f73] text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Clinic
                        </Button>
                    </Link>
                </div>

                {/* Search Bar */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardContent className="p-4">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search by clinic name, city, or owner..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Loader2 className="h-6 w-6 animate-spin text-[#1DA68F]" />
                            <span>Loading clinics...</span>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900">
                        <CardContent className="p-6 flex items-center gap-3 text-red-600 dark:text-red-400">
                            <XCircle className="h-5 w-5" />
                            <span>Error loading clinics: {error}</span>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {!loading && !error && filteredClinics.length === 0 && (
                    <Card className="border-gray-200 dark:border-gray-700">
                        <CardContent className="p-12 text-center">
                            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No clinics found
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {searchQuery ? "Try adjusting your search" : "Get started by adding your first clinic"}
                            </p>
                            {!searchQuery && (
                                <Link href="/admin/clinics/add">
                                    <Button className="bg-[#1DA68F] hover:bg-[#168f73]">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Your First Clinic
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Clinics Grid */}
                {!loading && !error && filteredClinics.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
                        {filteredClinics.map((clinic) => {
                            // Additional safety check
                            if (!clinic || !clinic._id) return null;

                            return (
                                <Card key={clinic._id} className="border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        {/* Clinic Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#126A5C] to-[#1DA68F] flex items-center justify-center overflow-hidden">
                                                    {clinic.logo ? (
                                                        <img
                                                            src={clinic.logo}
                                                            alt={clinic.clinicName || 'Clinic logo'}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Building2 className="h-6 w-6 text-white" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                                        {clinic.clinicName || 'Unnamed Clinic'}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        ID: {clinic._id.slice(-8)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            {clinic.status && (
                                                <Badge
                                                    variant={clinic.status === "active" ? "default" : "secondary"}
                                                    className={clinic.status === "active"
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                                    }
                                                >
                                                    {clinic.status === "active" ? (
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                    ) : (
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                    )}
                                                    {clinic.status
                                                        ? clinic.status
                                                            .split('_')
                                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                            .join(' ')
                                                        : 'Unknown'}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Owner Info */}
                                        {clinic.ownerName && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                <Globe className="h-4 w-4" />
                                                <span>Owner: {clinic.ownerName}</span>
                                            </div>
                                        )}

                                        {/* Contact Information */}
                                        <div className="space-y-2 mb-4">
                                            {clinic.address && (
                                                <div className="flex items-start gap-2 text-sm">
                                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                                    <span className="text-gray-600 dark:text-gray-300">
                                                        {clinic.address.street && `${clinic.address.street}, `}
                                                        {clinic.address.city && `${clinic.address.city}, `}
                                                        {clinic.address.state} {clinic.address.zipCode}
                                                    </span>
                                                </div>
                                            )}

                                            {clinic.clinicPhone && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Phone className="h-4 w-4 text-gray-400" />
                                                    <span className="text-gray-600 dark:text-gray-300">{clinic.clinicPhone}</span>
                                                </div>
                                            )}

                                            {clinic.email && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                    <span className="text-gray-600 dark:text-gray-300">{clinic.email}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-gray-100 dark:border-gray-800">

                                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
                                                    <span className="text-xs font-medium">Assistants</span>
                                                </div>
                                                <p className="text-lg font-bold text-red-700 dark:text-red-300">
                                                    {clinic?.totalAssistants || 0}
                                                </p>
                                            </div>

                                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                                                    <Users className="h-4 w-4" />
                                                    <span className="text-xs font-medium">Doctors</span>
                                                </div>
                                                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                                                    {clinic?.totalDoctors || 0}
                                                </p>
                                            </div>

                                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                                                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                                                    <Users className="h-4 w-4" />
                                                    <span className="text-xs font-medium">Patients</span>
                                                </div>
                                                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                                    {clinic?.totalPatients || 0}
                                                </p>
                                            </div>

                                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 col-span-2">
                                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
                                                    <DollarSign className="h-4 w-4" />
                                                    <span className="text-xs font-medium">Revenue</span>
                                                </div>
                                                <p className="text-lg font-bold text-green-700 dark:text-green-300">
                                                    ${clinic?.totalRevenue || 0}
                                                </p>
                                            </div>

                                        </div>

                                        {/* Created Date */}
                                        {clinic.createdAt && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                                <Calendar className="h-3 w-3" />
                                                Created {new Date(clinic.createdAt).toLocaleDateString()}
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <Link href={`/admin/clinics/${clinic._id}`} className="flex-1">
                                                <Button variant="outline" className="w-full" size="sm">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/clinics/${clinic._id}/edit`} className="flex-1">
                                                <Button variant="outline" className="w-full" size="sm">
                                                    <Pencil className="h-4 w-4 mr-2" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                onClick={() => setClinicIdForStatus(clinic._id)}
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}

                {/* Delete Confirmation */}
                <AlertDialog open={!!clinicIdForStatus} onOpenChange={(open) => !open && setClinicIdForStatus(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action can be undone. This will change the status of the clinic and potentially associated data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const clinic = clinics.find(c => c._id === clinicIdForStatus);
                                    if (clinic) handleStatusChange(clinic);
                                }}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Changing..." : "Change Clinic Status"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </div>
    )
}
