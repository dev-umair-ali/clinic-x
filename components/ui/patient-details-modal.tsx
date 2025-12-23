"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar as CalendarIcon,
  Heart,
  User,
} from "lucide-react";
import type React from "react";

export interface Patient {
  _id: string;
  name: string;
  patientId: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  bloodType: string;
  address: string;
  lastVisit: string;
  avatar?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  patient: Patient | null;
}

export default function PatientDetailsModal({ open, onClose, patient }: Props) {
  if (!patient) return null;

  const initials = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {/* close icon */}
        <button
          onClick={onClose}
          className={cn(
            "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          )}
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>Quick overview and contact info</DialogDescription>
        </DialogHeader>

        {/* top card */}
        <div className="flex items-center gap-4 rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={patient.avatar} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-2xl font-bold text-foreground">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">{patient.patientId}</p>
            <Badge variant="outline" className="mt-1">
              Active
            </Badge>
          </div>
        </div>

        {/* two-column grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <DataRow icon={User} label="Age" value={`${patient.age} years`} />
          <DataRow icon={Heart} label="Blood Type" value={patient.bloodType} />
          <DataRow icon={User} label="Gender" value={patient.gender} />
          <DataRow icon={CalendarIcon} label="Last Visit" value={patient.lastVisit} />
        </div>

        {/* contact block */}
        <div className="space-y-2 text-sm">
          <DataRow icon={Phone} label="Phone" value={patient.phone} />
          <DataRow icon={Mail} label="Email" value={patient.email} />
          <DataRow icon={MapPin} label="Address" value={patient.address} />
          <DataRow icon={CalendarIcon} label="DOB" value={patient.dateOfBirth} />
        </div>

        {/* footer */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onClose}>Edit Patient</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DataRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "N/A"}</p>
      </div>
    </div>
  );
}