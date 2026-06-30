"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store";

/* -------------------------------------------------
   Role-based banner config
---------------------------------------------------*/
const BANNER_CONFIG: Record<
  string,
  {
    title?: string;
    buttons: {
      label: string;
      path: string;
    }[];
  }
> = {
  admin: {
    buttons: [
      { label: "Clinic", path: "/admin/clinics" },
      { label: "Assistant", path: "/admin/assistants" },
      { label: "Doctor", path: "/admin/doctors" },
      { label: "Patient", path: "/admin/patients" },
    ],
  },
  assistant: {
    buttons: [
      { label: "Doctor", path: "/assistant/doctors" },
      { label: "Patient", path: "/assistant/patients" },
    ],
  },
  clinic: {
    buttons: [
      { label: "Assistant", path: "/clinic/assistants" },
      { label: "Doctor", path: "/clinic/doctors" },
      { label: "Patient", path: "/clinic/patients" },
    ],
  },
  doctor: {
    title: "Here’s your schedule and patient list for today.",
    buttons: [{ label: "View Schedule", path: "/doctor/schedule" }],
  },
  patient: {
    title: "Quick access to your records and upcoming appointments.",
    buttons: [
      { label: "Book Appointment", path: "/patient/appointments/book" },
      { label: "My Records", path: "/patient/records" },
    ],
  },
};

export default function HeaderBanner() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !user) return null;

  const role = user.role?.toLowerCase() ?? "patient";
  const cfg = BANNER_CONFIG[role] ?? BANNER_CONFIG.patient;

  const name =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.name ?? "User";

  return (
    <div
      className="
        relative overflow-hidden rounded-2xl
        bg-gradient-to-r
        from-[hsl(var(--color-brand-teal))]
        to-[hsl(var(--color-brand-teal-dark))]
        p-6 sm:p-8 text-white
        shadow-lg
      "
    >
      {/* Decorative blur */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left content */}
        <div className="max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </h1>

          <p className="mt-2 text-sm sm:text-base text-white/80">
            {cfg.title ??
              "Here’s an overview of your healthcare information and recent activity."}
          </p>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
          {cfg.buttons.map((btn) => (
            <button
              key={btn.path}
              onClick={() => router.push(btn.path)}
              className="
                group flex items-center justify-center gap-2
                rounded-xl px-4 py-3
                bg-white/95 dark:bg-gray-900/90
                text-[hsl(var(--color-brand-teal))]
                font-medium text-sm
                shadow-sm
                hover:shadow-md
                hover:-translate-y-[1px]
                transition-all
              "
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              <span className="text-center leading-tight">
                {btn.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
