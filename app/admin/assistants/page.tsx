"use client";

import { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { AssistantTable } from "@/components/ui/assistant-table";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { useRouter } from "next/navigation";
import { fetchAssistants } from "@/lib/slices/assistantSlice";
import { fetchClinics } from "@/lib/slices/clinicSlice";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Users, UserCheck, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AdminAssistantsPage() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { assistants, pagination, loading, error } = useSelector(
        (state: RootState) => state.assistants
    );
    const { clinics } = useSelector((state: RootState) => state.clinics);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [clinicFilter, setClinicFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const assistantsData = useMemo(() => assistants, [assistants]);
    const totalPages = pagination?.totalPages || 1;

    useEffect(() => {
        // Fetch clinics for the filter dropdown
        dispatch(fetchClinics());
    }, [dispatch]);

    useEffect(() => {
        // Fetch assistants with filters and pagination
        const params: any = {};
        if (searchQuery) params.search = searchQuery;
        if (statusFilter && statusFilter !== "all") params.status = statusFilter;
        if (clinicFilter && clinicFilter !== "all") params.clinicId = clinicFilter;
        params.page = currentPage;
        params.limit = itemsPerPage;

        dispatch(fetchAssistants(params));
    }, [dispatch, searchQuery, statusFilter, clinicFilter, currentPage, itemsPerPage]);

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const handleSearch = (value: string) => {
        setSearchQuery(value);
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
    };

    const handleClinicChange = (value: string) => {
        setClinicFilter(value);
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setClinicFilter("all");
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (limit: number) => {
        setItemsPerPage(limit);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    // Calculate active assistants count
    const activeAssistantsCount = assistantsData?.filter(
        (assistant: any) => assistant.status === "active"
    ).length;
     const pendingAssistantsCount = assistantsData?.filter(
        (assistant: any) => assistant.status === "pending_verification"
    ).length;
     const suspendedAssistantsCount = assistantsData?.filter(
        (assistant: any) => assistant.status === "suspended"
    ).length;
    const inactiveAssistantsCount = assistantsData?.filter(
        (assistant: any) => assistant.status === "inactive"
    ).length;

    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <div className="flex-1 overflow-y-auto bg-[hsl(var(--background))] min-h-screen">
                <div className="max-w-7xl mx-auto p-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                                Assistants
                            </h1>
                            <p className="text-[hsl(var(--muted-foreground))] mt-1">
                                Manage and monitor all assistants across clinics
                            </p>
                        </div>
                        <Button
                            onClick={() => handleNavigation("/admin/assistants/add")}
                            className="mt-4 md:mt-0 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))] flex items-center space-x-2"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Assistant</span>
                        </Button>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-[hsl(var(--card))] rounded-lg shadow-sm border border-[hsl(var(--border))] p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Search Input */}
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                                    <Input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <Select value={statusFilter} onValueChange={handleStatusChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="pending_verification">Pending Verification</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Clinic Filter */}
                            <div>
                                <Select value={clinicFilter} onValueChange={handleClinicChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by clinic" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Clinics</SelectItem>
                                        {clinics.map((clinic) => (
                                            <SelectItem key={clinic._id} value={clinic._id}>
                                                {clinic.clinicName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(searchQuery || statusFilter !== "all" || clinicFilter !== "all") && (
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-sm text-[hsl(var(--muted-foreground))]">
                                    Active filters:
                                </span>
                                {searchQuery && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-[hsl(var(--color-brand-teal)/0.1)] text-[hsl(var(--color-brand-teal))]">
                                        Search: {searchQuery}
                                    </span>
                                )}
                                {statusFilter !== "all" && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-[hsl(var(--color-brand-teal)/0.1)] text-[hsl(var(--color-brand-teal))]">
                                        Status: {statusFilter}
                                    </span>
                                )}
                                {clinicFilter !== "all" && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-[hsl(var(--color-brand-teal)/0.1)] text-[hsl(var(--color-brand-teal))]">
                                        Clinic: {clinics.find(c => c._id === clinicFilter)?.clinicName}
                                    </span>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearFilters}
                                    className="text-xs"
                                >
                                    Clear all
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Stats Boxes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                        <div className="flex items-center p-6 min-h-[110px] bg-[hsl(var(--card))] rounded-xl shadow-sm border border-[hsl(var(--border))]">
                            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[hsl(var(--color-chart-blue)/0.1)]">
                                <Users className="h-7 w-7 text-[hsl(var(--color-chart-blue))]" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                    Total Assistants
                                </p>
                                <p className="text-lg font-semibold text-[hsl(var(--color-chart-blue))]">
                                    {assistantsData.length}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center p-6 min-h-[110px] bg-[hsl(var(--card))] rounded-xl shadow-sm border border-[hsl(var(--border))]">
                            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[hsl(var(--color-status-success)/0.1)]">
                                <UserCheck className="h-7 w-7 text-[hsl(var(--color-status-success))]" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                    Active Assistants
                                </p>
                                <p className="text-lg font-semibold text-[hsl(var(--color-status-success))]">
                                    {activeAssistantsCount}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center p-6 min-h-[110px] bg-[hsl(var(--card))] rounded-xl shadow-sm border border-[hsl(var(--border))]">
                            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[hsl(var(--color-status-warning)/0.1)]">
                                <UserCheck className="h-7 w-7 text-[hsl(var(--color-status-warning))]" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                    Pending Assistants
                                </p>
                                <p className="text-lg font-semibold text-[hsl(var(--color-status-warning))]">
                                    {pendingAssistantsCount}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center p-6 min-h-[110px] bg-[hsl(var(--card))] rounded-xl shadow-sm border border-[hsl(var(--border))]">
                            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[hsl(var(--color-status-error)/0.1)]">
                                <User className="h-7 w-7 text-[hsl(var(--color-status-error))]" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                    Inactive Assistants
                                </p>
                                <p className="text-lg font-semibold text-[hsl(var(--color-status-error))]">
                                    {inactiveAssistantsCount}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center p-6 min-h-[110px] bg-[hsl(var(--card))] rounded-xl shadow-sm border border-[hsl(var(--border))]">
                            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[hsl(var(--color-status-error)/0.1)]">
                                <User className="h-7 w-7 text-[hsl(var(--color-status-error))]" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                    Suspended Assistants
                                </p>
                                <p className="text-lg font-semibold text-[hsl(var(--color-status-error))]">
                                    {suspendedAssistantsCount}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Error Handling */}
                    {error && assistantsData.length === 0 && (
                        <div className="mb-4 bg-[hsl(var(--color-status-error)/0.1)] border border-[hsl(var(--color-status-error))] text-[hsl(var(--color-status-error))] px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Loading / Table */}
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--color-brand-teal))]"></div>
                            <span className="ml-2 text-[hsl(var(--muted-foreground))]">
                                Loading assistants...
                            </span>
                        </div>
                    ) : (
                        <AssistantTable
                            assistants={assistantsData}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={handleItemsPerPageChange}
                        />
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
