"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DoctorModal({
  open,
  setOpen,
  doctor,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  doctor: any | null;
}) {
  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto bg-[hsl(var(--card))] border-[hsl(var(--border))]">
        <DialogHeader>
          <DialogTitle className="text-[hsl(var(--foreground))]">Doctor Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={doctor.avatar || doctor.profilePicture || "/placeholder.svg"}
              alt={doctor.name || "Doctor"}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-[hsl(var(--foreground))] truncate">
                Dr. {doctor.name || doctor.fullName}
              </h3>
              {doctor.specialization && (
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{doctor.specialization}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
            {doctor.experience !== undefined && (
              <div>
                <p className="text-[hsl(var(--muted-foreground))]">Experience</p>
                <p className="font-medium text-[hsl(var(--foreground))]">{doctor.experience} years</p>
              </div>
            )}
            {doctor.department && (
              <div>
                <p className="text-[hsl(var(--muted-foreground))]">Department</p>
                <p className="font-medium text-[hsl(var(--foreground))]">{doctor.department}</p>
              </div>
            )}
            {doctor.qualification && (
              <div className="col-span-full">
                <p className="text-[hsl(var(--muted-foreground))]">Qualification</p>
                <p className="font-medium text-[hsl(var(--foreground))]">{doctor.qualification}</p>
              </div>
            )}
          </div>

          {doctor.bio && (
            <div className="text-sm">
              <p className="text-[hsl(var(--muted-foreground))]">About</p>
              <p className="font-medium text-[hsl(var(--foreground))] mt-1">{doctor.bio}</p>
            </div>
          )}

          <div className="space-y-2 text-sm">
            {doctor.phone && (
              <div className="flex items-center gap-2">
                <span className="text-[hsl(var(--muted-foreground))]">📞</span>
                <span className="truncate text-[hsl(var(--foreground))]">{doctor.phone}</span>
              </div>
            )}
            {doctor.email && (
              <div className="flex items-center gap-2">
                <span className="text-[hsl(var(--muted-foreground))]">✉️</span>
                <span className="truncate text-[hsl(var(--foreground))]">{doctor.email}</span>
              </div>
            )}
            {doctor.consultationFee && (
              <div className="flex items-center gap-2">
                <span className="text-[hsl(var(--muted-foreground))]">💰</span>
                <span className="text-[hsl(var(--foreground))]">Fee: ${doctor.consultationFee}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
