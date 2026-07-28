import moment from "moment";

type NamedRef = {
  _id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  clinicName?: string;
};

export function resolveDoctorName(
  doctorRef: unknown,
  fallback = "No doctor assigned"
): string {
  if (!doctorRef) return fallback;
  if (typeof doctorRef === "string") return fallback;
  if (Array.isArray(doctorRef)) {
    return resolveDoctorName(doctorRef[0], fallback);
  }
  const ref = doctorRef as NamedRef;
  if (ref.name?.trim()) return ref.name.startsWith("Dr.") ? ref.name : `Dr. ${ref.name}`;
  const first = ref.firstName?.trim();
  const last = ref.lastName?.trim();
  if (first || last) {
    return `Dr. ${[first, last].filter(Boolean).join(" ")}`;
  }
  return fallback;
}

export function resolveClinicName(
  clinicRef: unknown,
  fallback = "No clinic assigned"
): string {
  if (!clinicRef) return fallback;
  if (typeof clinicRef === "string") return fallback;
  const ref = clinicRef as NamedRef;
  return ref.clinicName?.trim() || ref.name?.trim() || fallback;
}

export type DisplayAppointment = {
  id: string;
  date: string;
  time: string;
  doctor: string;
  type: string;
  status: "upcoming" | "completed" | "cancelled" | string;
};

const UPCOMING_STATUSES = new Set([
  "scheduled",
  "upcoming",
  "confirmed",
  "rescheduled",
  "pending",
]);

export function normalizeAppointmentStatus(status: string | undefined): string {
  const s = (status || "").toLowerCase();
  if (s === "completed") return "completed";
  if (s === "cancelled" || s === "canceled" || s === "no-show") return "cancelled";
  if (UPCOMING_STATUSES.has(s)) return "upcoming";
  return s || "upcoming";
}

export function mapAppointmentForDisplay(appt: Record<string, unknown>): DisplayAppointment {
  const dateTime = String(appt.dateTime || appt.date || "");
  const dt = dateTime ? moment(dateTime) : null;
  const doctorRef = appt.doctorRef as NamedRef | string | undefined;
  const doctorFromRef =
    typeof doctorRef === "object" && doctorRef
      ? resolveDoctorName(doctorRef, "")
      : "";

  return {
    id: String(appt._id || appt.id || Math.random()),
    date: dt?.isValid() ? dt.format("DD/MM/YYYY") : String(appt.date || "—"),
    time: dt?.isValid() ? dt.format("h:mm A") : String(appt.time || "—"),
    doctor:
      String(appt.doctorName || doctorFromRef || appt.doctor || "Doctor").trim() ||
      "Doctor",
    type: String(appt.service || appt.title || appt.type || "Appointment"),
    status: normalizeAppointmentStatus(String(appt.status || "")),
  };
}

export function filterAppointmentsByTab(
  appointments: DisplayAppointment[],
  tab: string
): DisplayAppointment[] {
  if (tab === "completed") {
    return appointments.filter((a) => a.status === "completed");
  }
  return appointments.filter((a) => a.status === "upcoming");
}
