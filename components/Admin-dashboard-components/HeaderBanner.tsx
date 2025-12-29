"use client";

import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";

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
      { label: "Add Doctor", path: "/admin/doctors/add" },
      { label: "Add Patient", path: "/admin/patients/add" },
    ],
  },
  assistant: {
    buttons: [
      {
        label: "Add Doctor",
        path: "/assistant/doctors/add",
      },
      { label: "Add Patient", path: "/assistant/patients/add" },
    ],
  },
  clinic: {
    buttons: [
      { label: "Add Doctor", path: "/clinic/doctors/add" },
      { label: "Add Patient", path: "/clinic/patients/add" },
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

  /* ---- safety ---- */
  if (!user) return null;

  const role = user.role ?? "patient"; // fallback
  const cfg = BANNER_CONFIG[role] ?? BANNER_CONFIG.patient;

  const name =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.name ?? "User";

  return (
    <div
      className="bg-[hsl(var(--color-brand-teal))] dark:bg-[hsl(var(--color-brand-teal-dark))]
                 rounded-2xl p-4 sm:p-8 text-white relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </h1>
          <p
            className="text-[hsl(var(--color-brand-teal-light))] dark:text-[hsl(var(--color-brand-teal-light)/0.9)]
                        text-sm sm:text-base"
          >
            {cfg.title ??
              "Here’s an overview of your healthcare information and recent activity."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {cfg.buttons.map((btn) => (
            <button
              key={btn.path}
              onClick={() => router.push(btn.path)}
              className="bg-white dark:bg-gray-800
                         text-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--color-brand-teal))]
                         px-4 py-2 rounded-lg font-medium flex items-center justify-center 
                         gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
