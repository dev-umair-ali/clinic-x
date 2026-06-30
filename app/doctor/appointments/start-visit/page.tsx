"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store";
import { fetchPatientFullDetails } from "@/lib/slices/appointmentSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Phone,
    Mail,
    Calendar,
    FileText,
    Pill,
    DollarSign,
} from "lucide-react";
import moment from "moment";
import { appointmentService } from "@/lib/api/services/appointmentService";

function PatientProfileContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const role = user?.role;

    const [currentView, setCurrentView] = useState("profile");
    const { patientDetails: patientData, loading, error } = useSelector((state: RootState) => state.appointments);
    const patientId = (params.patientId as string) || searchParams.get("patientId") || "";
    const appointmentId = (params.appointmentId as string) || searchParams.get("appointmentId") || "";


    useEffect(() => {
        if (patientId) {
            dispatch(fetchPatientFullDetails(patientId));
        }
    }, [dispatch, patientId]);

    const handleStartProcedure = async () => {
        const status = 'start_visit';
        try {
            const res = await appointmentService.updateAppointmentStatus(role || "", appointmentId, status);
            if (res?.success) {
                router.push(`/doctor/procedure?patientId=${patientId}&appointmentId=${appointmentId}`);
            } else {
                alert(res?.message || "Failed to update appointment status");
            }
        } catch (e: any) {
            const msg = e.message || e.response?.data?.message || "Failed to update appointment status";
            alert(msg);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[hsl(var(--background))] p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(var(--color-brand-teal))] mx-auto"></div>
                    <p className="mt-4 text-[hsl(var(--muted-foreground))]">Loading patient details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[hsl(var(--background))] p-6 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[hsl(var(--color-status-error))]">Error: {error}</p>
                    <Button onClick={() => dispatch(fetchPatientFullDetails(patientId))} className="mt-4">
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[hsl(var(--background))] p-6">
            {/* Patient Header - Always visible */}
            <div className="bg-[hsl(var(--card))] rounded-lg shadow-sm border border-[hsl(var(--border))] p-6 mb-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage
                                src={patientData?.patient?.profilePicture || "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80 "}
                                alt={"Patient Avatar"}
                            />
                            <AvatarFallback className="bg-[hsl(var(--color-status-success)/0.1)] text-[hsl(var(--color-status-success-dark))] font-semibold text-lg">
                                {"Patient Avatar"
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                                {patientData?.patient?.firstName || "Patient Avatar"}
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] mt-1">
                                <span>Patient ID: {patientId}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 sm:gap-3 flex-wrap md:flex-nowrap w-full md:w-auto md:justify-end">
                        <Button
                            onClick={() => handleStartProcedure()}
                            className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white px-6"
                        >
                            Start Visit{" "}
                        </Button>

                        {/* <Button
                            onClick={handleViewHistory}
                            variant={currentView === "history" ? "default" : "outline"}
                            className={
                                currentView === "history"
                                    ? "bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white px-6 border-[hsl(var(--color-brand-teal))]"
                                    : "border-[hsl(var(--color-brand-teal))] text-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-light))] px-6"
                            }
                        >
                            History
                        </Button> */}
                    </div>
                </div>

                {/* Patient Basic Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 mb-6">
                    <div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Age</div>
                        <div className="font-semibold text-[hsl(var(--foreground))]">
                            {patientData?.patient?.age} years
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Gender</div>
                        <div className="font-semibold text-[hsl(var(--foreground))]">
                            {patientData?.patient.gender}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Blood Type</div>
                        <div className="font-semibold text-[hsl(var(--foreground))]">
                            {patientData?.patient?.bloodType}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Last Visit</div>
                        <div className="font-semibold text-[hsl(var(--foreground))]">
                            {moment(patientData?.lastAppointment?.appointmentDate).format('MMMM Do, YYYY')} at {patientData?.lastAppointment?.appointmentTime}
                            {patientData?.lastAppointment?.doctorRef?.firstName && (
                                <span> with Dr. {patientData.lastAppointment.doctorRef.firstName} {patientData.lastAppointment.doctorRef.lastName}</span>
                            )}

                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-sm">
                    <div className="flex items-center gap-2 text-[hsl(var(--foreground))]">
                        <Phone className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                        <span>{patientData?.patient.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[hsl(var(--foreground))]">
                        <Mail className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                        <span>{patientData?.patient.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[hsl(var(--foreground))]">
                        <Calendar className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                        <span>DOB: {moment(patientData?.patient?.dateOfBirth).format('MMMM Do, YYYY')}</span>
                    </div>
                </div>
            </div>

            {/* Dynamic Content Based on Current View */}
            {currentView === "profile" && (
                <ProfileContent patientData={patientData} />
            )}
        </div>
    );
}

// Profile content component
function ProfileContent({ patientData }: { patientData: any }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Appointments */}
            <Card className="border-[hsl(var(--border))]">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                        <Calendar className="w-5 h-5 text-[hsl(var(--color-brand-teal))]" />
                        Appointments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                            Latest Appointment
                        </div>
                        {patientData?.lastAppointment ? (
                            <div className="flex items-center gap-3 p-3 bg-[hsl(var(--muted)/0.5)] rounded-lg">
                                <Calendar className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                                <div className="flex-1">
                                    <div className="font-medium text-sm text-[hsl(var(--foreground))]">
                                        {new Date(patientData.lastAppointment.appointmentDate).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            day: 'numeric',
                                            month: 'short'
                                        })}, {patientData.lastAppointment.appointmentTime}
                                    </div>
                                    <div className="text-xs text-[hsl(var(--muted-foreground))]">
                                        {patientData.lastAppointment.service || patientData.lastAppointment.title}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-[hsl(var(--muted)/0.5)] rounded-lg text-sm text-[hsl(var(--muted-foreground))]">
                                No recent appointments
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Patient Notes */}
            <Card className="border-[hsl(var(--border))]">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                        <FileText className="w-5 h-5 text-[hsl(var(--color-status-error))]" />
                        Patient Notes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                            Latest Notes
                        </div>
                        {patientData?.notes ? (
                            <div className="p-3 bg-[hsl(var(--muted)/0.5)] rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                                        {patientData.lastAppointment
                                            ? new Date(patientData.lastAppointment.appointmentDate).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                day: 'numeric',
                                                month: 'short'
                                            })
                                            : 'Recent'}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    {patientData.notes.title && (
                                        <div className="font-medium mb-1 text-[hsl(var(--foreground))]">{patientData.notes.title}</div>
                                    )}
                                    <div className="text-[hsl(var(--muted-foreground))]">
                                        {patientData.notes.additionalNotes || patientData.notes.rawText || 'No notes available'}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-[hsl(var(--muted)/0.5)] rounded-lg text-sm text-[hsl(var(--muted-foreground))]">
                                No recent notes
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Prescriptions */}
            <Card className="border-[hsl(var(--border))]">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                        <Pill className="w-5 h-5 text-[hsl(var(--color-chart-orange))]" />
                        Prescriptions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                            Latest Prescriptions
                        </div>
                        {patientData?.prescription?.medication && patientData.prescription.medication.length > 0 ? (
                            <div className="p-3 bg-[hsl(var(--muted)/0.5)] rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                                        {patientData.lastAppointment
                                            ? new Date(patientData.lastAppointment.appointmentDate).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                day: 'numeric',
                                                month: 'short'
                                            })
                                            : 'Recent'}
                                    </span>
                                </div>
                                <div className="text-sm space-y-1">
                                    <div className="font-medium text-[hsl(var(--foreground))]">Medicines:</div>
                                    {patientData.prescription.medication.slice(0, 3).map((med: any, idx: number) => (
                                        <div key={idx} className="text-[hsl(var(--muted-foreground))]">
                                            {typeof med === 'string' ? med : `${med.name} ${med.dosage || ''} - ${med.frequency || ''} - ${med.duration || ''}`}
                                        </div>
                                    ))}
                                    {patientData.prescription.medication.length > 3 && (
                                        <div className="text-xs text-[hsl(var(--muted-foreground))] italic">
                                            +{patientData.prescription.medication.length - 3} more...
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-[hsl(var(--muted)/0.5)] rounded-lg text-sm text-[hsl(var(--muted-foreground))]">
                                No recent prescriptions
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Billing History */}
            <Card className="border-[hsl(var(--border))]">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg text-[hsl(var(--foreground))]">
                        <DollarSign className="w-5 h-5 text-[hsl(var(--color-chart-blue))]" />
                        Billing History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                            Latest Billing
                        </div>
                        {patientData?.billing ? (
                            <div className="p-3 bg-[hsl(var(--muted)/0.5)] rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                                        {patientData.lastAppointment
                                            ? new Date(patientData.lastAppointment.appointmentDate).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                day: 'numeric',
                                                month: 'short'
                                            })
                                            : 'Recent'}
                                    </span>
                                </div>
                                <div className="text-sm space-y-1">
                                    <div className="text-[hsl(var(--muted-foreground))]">
                                        Description: {patientData.lastAppointment?.title || 'Consultation'}
                                    </div>
                                    <div className="font-medium text-[hsl(var(--foreground))]">Charge: ${patientData.billing.amount}</div>
                                    <div className="text-xs">
                                        <Badge variant={patientData.billing.status === 'paid' ? 'default' : 'secondary'}>
                                            {patientData.billing.status?.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-[hsl(var(--muted)/0.5)] rounded-lg text-sm text-[hsl(var(--muted-foreground))]">
                                No recent billing records
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function PatientProfilePage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
            <PatientProfileContent />
        </Suspense>
    );
}