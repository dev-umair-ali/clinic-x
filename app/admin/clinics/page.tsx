"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Building2,
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
    Search,
    Loader2,
    AlertCircle
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import api from "@/lib/api/axios"

interface Clinic {
    _id: string
    name: string
    address?: {
        city: string
        state: string
        country: string
    }
    ownerUser?: string
    clinicEmail?: string // If present in response
    clinicPhone?: string
    createdAt?: string
}

export default function ClinicsListPage() {
    const router = useRouter()
    const [clinics, setClinics] = useState<Clinic[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchClinics = async () => {
        try {
            setIsLoading(true)
            const res = await api.get("/clinics")
            // Check if content is wrapped or array
            const data = Array.isArray(res.data) ? res.data : (res.data.content || [])
            setClinics(data)
        } catch (err) {
            console.error("Failed to fetch clinics", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchClinics()
    }, [])

    const handleDelete = async () => {
        if (!deleteId) return
        setIsDeleting(true)
        try {
            await api.delete(`/clinics/${deleteId}`)
            setClinics((prev) => prev.filter((c) => c._id !== deleteId))
            setDeleteId(null)
        } catch (err) {
            console.error("Failed to delete clinic", err)
            alert("Failed to delete clinic. Please try again.")
        } finally {
            setIsDeleting(false)
        }
    }

    const filteredClinics = clinics.filter((clinic) => {
        const name = clinic.name || ""
        const city = clinic.address?.city || ""
        const query = searchQuery.toLowerCase()

        return name.toLowerCase().includes(query) || city.toLowerCase().includes(query)
    })

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Building2 className="h-8 w-8 text-[#1DA68F]" />
                            Clinics
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Manage all registered clinics in the system.
                        </p>
                    </div>
                    <Link href="/admin/add-clinic">
                        <Button className="bg-[#1DA68F] hover:bg-[#168f73] text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Clinic
                        </Button>
                    </Link>
                </div>

                {/* Filters & Content */}
                <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Search clinics..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Clinic Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            <div className="flex justify-center items-center gap-2 text-gray-500">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Loading clinics...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredClinics.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                                            No clinics found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredClinics.map((clinic) => (
                                        <TableRow key={clinic._id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[#1DA68F]">
                                                        <Building2 className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-gray-900 dark:text-white">{clinic.name}</span>
                                                        <span className="text-xs text-gray-500">ID: {clinic._id.slice(-6)}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {clinic.address ? (
                                                    <span className="text-gray-600 dark:text-gray-300">
                                                        {clinic.address.city}, {clinic.address.state}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 italic">No address</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-gray-500">
                                                {clinic.createdAt ? new Date(clinic.createdAt).toLocaleDateString() : "-"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <Link href={`/admin/clinics/${clinic._id}`}>
                                                            <DropdownMenuItem>
                                                                <Eye className="mr-2 h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <Link href={`/admin/clinics/${clinic._id}/edit`}>
                                                            <DropdownMenuItem>
                                                                <Pencil className="mr-2 h-4 w-4" /> Edit Clinic
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={() => setDeleteId(clinic._id)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Delete Confirmation */}
                <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the clinic and potentially associated data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={(e) => { e.preventDefault(); handleDelete(); }}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete Clinic"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>
        </div>
    )
}
