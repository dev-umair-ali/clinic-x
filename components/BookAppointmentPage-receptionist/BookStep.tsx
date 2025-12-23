"use client";
import { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation"; // <-- NEW
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react"; // <-- NEW
import { format } from "date-fns";
import Calendar from "./Calendar";
import { services, doctors } from "./data";

interface Props {
  selectedServiceId: string | undefined;
  setSelectedServiceId: Dispatch<SetStateAction<string | undefined>>;
  selectedDoctorId: string | undefined;
  setSelectedDoctorId: Dispatch<SetStateAction<string | undefined>>;
  selectedDate: Date | undefined;
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
  selectedTimeSlot: string | undefined;
  setSelectedTimeSlot: Dispatch<SetStateAction<string | undefined>>;
  smsReminders: boolean;
  setSmsReminders: Dispatch<SetStateAction<boolean>>;
  emailReminders: boolean;
  setEmailReminders: Dispatch<SetStateAction<boolean>>;
  onContinue: () => void;
}

export default function BookStep(props: Props) {
  const router = useRouter(); // <-- NEW
  const [showCal, setShowCal] = useState(false);
  const selectedService = services.find(
    (s) => s.id === props.selectedServiceId
  );
  const slots = props.selectedDate
    ? ["01:00 PM - 02:00 PM", "03:00 PM - 04:00 PM", "06:00 PM - 07:00 PM"]
    : [];

  return (
    <div className="space-y-5">
    <Button
  variant="ghost"
  size="sm"
  onClick={() => router.push("/receptionist/appointments")}
  className="flex items-center gap-1 text-sm text-white
             bg-[hsl(var(--color-brand-teal-light))] hover:bg-[hsl(var(--color-brand-teal-light))/80]
             dark:bg-[hsl(var(--color-brand-teal-light))] dark:hover:bg-[hsl(var(--color-brand-teal-light))/80]"
>
  <ArrowLeft className="w-4 h-4" />
  Back to appointments
</Button>
      {/* Service */}
      <div>
        <label className="block text-sm font-medium mb-2">Select Service</label>
        <Select
          value={props.selectedServiceId}
          onValueChange={props.setSelectedServiceId}
        >
          <SelectTrigger className="w-full h-11 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
            <SelectValue placeholder="Choose a service" />
          </SelectTrigger>
          <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
            {services.map((s) => (
              <SelectItem
                key={s.id}
                value={s.id}
                className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50"
              >
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Doctor */}
      <div>
        <label className="block text-sm font-medium mb-2">Select Doctor</label>
        <Select
          value={props.selectedDoctorId}
          onValueChange={props.setSelectedDoctorId}
        >
          <SelectTrigger className="w-full h-11 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
            <SelectValue placeholder="Choose a doctor" />
          </SelectTrigger>
          <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
            {doctors.map((d) => (
              <SelectItem
                key={d.id}
                value={d.id}
                className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50"
              >
                {d.name} – {d.specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium mb-2">Choose Date</label>
        <div className="relative">
          <Input
            value={
              props.selectedDate ? format(props.selectedDate, "dd/MM/yyyy") : ""
            }
            placeholder="dd/mm/yyyy"
            readOnly
            onClick={() => setShowCal((v) => !v)}
            className="h-11 cursor-pointer bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
          />
          {showCal && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1">
              <Calendar
                selectedDate={props.selectedDate}
                onDateSelect={(d) => {
                  props.setSelectedDate(d);
                  setShowCal(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Time */}
      <div>
        <label className="block text-sm font-medium mb-2">Select Time</label>
        <Select
          value={props.selectedTimeSlot}
          onValueChange={props.setSelectedTimeSlot}
        >
          <SelectTrigger className="w-full h-11 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
            <SelectValue placeholder="Available slots" />
          </SelectTrigger>
          <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
            {slots.map((s) => (
              <SelectItem
                key={s}
                value={s}
                className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50"
              >
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reminders */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
          Reminder Preferences
        </h3>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
            SMS Reminders
          </span>
          <Switch
            checked={props.smsReminders}
            onCheckedChange={props.setSmsReminders}
          />
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
            Email Reminders
          </span>
          <Switch
            checked={props.emailReminders}
            onCheckedChange={props.setEmailReminders}
          />
        </div>
      </div>

      <Button
        className="w-full h-11 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white"
        onClick={props.onContinue}
        disabled={
          !selectedService ||
          !props.selectedDoctorId ||
          !props.selectedDate ||
          !props.selectedTimeSlot
        }
      >
        Continue
      </Button>
    </div>
  );
}
