"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PatientDetails } from "@/lib/api/services/appointmentService";

function fmt(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function PatientModal({
  open,
  setOpen,
  patient,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  patient: PatientDetails | null;
}) {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto bg-[hsl(var(--card))] border-[hsl(var(--border))]">
        <DialogHeader>
          <DialogTitle className="text-[hsl(var(--foreground))]">Patient Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={patient.avatar || "/placeholder.svg"}
              alt={patient.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-[hsl(var(--foreground))] truncate">{patient.name}</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{patient.patientId}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
            {patient.age !== undefined && (
              <div>
                <p className="text-[hsl(var(--muted-foreground))]">Age</p>
                <p className="font-medium text-[hsl(var(--foreground))]">{patient.age} years</p>
              </div>
            )}
            {patient.gender && (
              <div>
                <p className="text-[hsl(var(--muted-foreground))]">Gender</p>
                <p className="font-medium text-[hsl(var(--foreground))]">{patient.gender}</p>
              </div>
            )}
            {patient.bloodType && (
              <div>
                <p className="text-[hsl(var(--muted-foreground))]">Blood Type</p>
                <p className="font-medium text-[hsl(var(--foreground))]">{patient.bloodType}</p>
              </div>
            )}
          </div>

          {patient.lastVisit && (
            <div className="text-sm">
              <p className="text-[hsl(var(--muted-foreground))]">Last Visit</p>
              <p className="font-medium text-[hsl(var(--foreground))]">{patient.lastVisit}</p>
            </div>
          )}

          <div className="space-y-2 text-sm">
            {patient.phone && (
              <div className="flex items-center gap-2">
                <span className="text-[hsl(var(--muted-foreground))]">📞</span>
                <span className="truncate text-[hsl(var(--foreground))]">{patient.phone}</span>
              </div>
            )}
            {patient.email && (
              <div className="flex items-center gap-2">
                <span className="text-[hsl(var(--muted-foreground))]">✉️</span>
                <span className="truncate text-[hsl(var(--foreground))]">{patient.email}</span>
              </div>
            )}
            {patient.address && (
              <div className="flex items-center gap-2">
                <span className="text-[hsl(var(--muted-foreground))]">📍</span>
                <span className="text-xs sm:text-sm text-[hsl(var(--foreground))]">{patient.address}</span>
              </div>
            )}
            {patient.dateOfBirth && (
              <div className="flex items-center gap-2">
                <span className="text-[hsl(var(--muted-foreground))]">🎂</span>
                <span className="text-[hsl(var(--foreground))]">DOB: {fmt(patient.dateOfBirth)}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}