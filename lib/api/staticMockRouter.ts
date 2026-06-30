import { getStaticStore } from "@/lib/data/static/store";
import { pagination } from "@/lib/data/static/seed";

type HttpMethod = string;

function parsePath(url: string): { path: string; search: URLSearchParams } {
  const raw = url.replace(/^https?:\/\/[^/]+/, "");
  const [pathPart, query] = raw.split("?");
  const path = pathPart.startsWith("/") ? pathPart : `/${pathPart}`;
  return { path, search: new URLSearchParams(query || "") };
}

function parseBody(data: unknown): Record<string, unknown> {
  if (!data) return {};
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return data as Record<string, unknown>;
}

function ok(data: unknown) {
  return data;
}

function success(data: unknown, message = "Success") {
  return { success: true, data, message };
}

function doctorsList(doctors: ReturnType<typeof getStaticStore>["doctors"], page = 1, limit = 10) {
  return {
    success: true,
    doctors,
    pagination: pagination(doctors, page, limit),
  };
}

function patientsList(patients: ReturnType<typeof getStaticStore>["patients"], page = 1, limit = 10) {
  return {
    success: true,
    patients,
    pagination: pagination(patients, page, limit),
  };
}

function appointmentsList(appts: ReturnType<typeof getStaticStore>["appointments"]) {
  return { success: true, data: appts };
}

function notesList(notes: ReturnType<typeof getStaticStore>["notes"], page = 1, limit = 10) {
  return {
    success: true,
    notes,
    pagination: pagination(notes, page, limit),
  };
}

function auditList(logs: ReturnType<typeof getStaticStore>["auditLogs"], page = 1, limit = 10) {
  return {
    success: true,
    logs,
    pagination: pagination(logs, page, limit),
  };
}

/**
 * Resolves a static mock response for portfolio mode.
 * Returns `undefined` if no mock applies (caller may fall through to real API).
 */
export function resolveStaticMock(
  method: HttpMethod,
  url: string,
  body?: unknown
): unknown {
  const s = getStaticStore();
  const { path, search } = parsePath(url);
  const m = (method || "GET").toUpperCase();
  const b = parseBody(body);
  const page = Number(search.get("page") || 1);
  const limit = Number(search.get("limit") || 10);

  // ── Dashboards ──
  if (m === "GET" && path === "/admin/dashboard/stats") return { data: s.adminDashboard };
  if (m === "GET" && path.startsWith("/admin/dashboard/")) return { data: s.adminDashboard };
  if (m === "GET" && (path.startsWith("/clinic/dashboard/") || path === "/clinic/dashboard/stats"))
    return { data: s.clinicDashboard };
  if (m === "GET" && (path.startsWith("/assistant/dashboard/") || path === "/assistant/dashboard/stats"))
    return { data: s.assistantDashboard };
  if (m === "GET" && (path.startsWith("/doctor/dashboard/") || path === "/doctor/dashboard/stats"))
    return { data: s.doctorDashboard };
  if (m === "GET" && (path.startsWith("/patient/dashboard/") || path === "/patient/dashboard/stats"))
    return { data: s.patientDashboard };

  // ── Clinics ──
  if (m === "GET" && path === "/admin/clinic/all/clinics") return s.clinics;
  if (m === "GET" && path.match(/^\/admin\/clinic\/[^/]+$/)) {
    const id = path.split("/").pop()!;
    return success(s.clinics.find((c) => c._id === id) || s.clinics[0]);
  }
  if (m === "POST" && path === "/admin/clinic/create-clinic") return success({ ...s.clinics[0], ...b, _id: `clinic-${Date.now()}` });
  if (m === "PUT" && path.includes("/admin/clinic/update-clinic")) return success(s.clinics[0]);

  // ── Doctors (all role prefixes) ──
  if (m === "GET" && /\/(admin|clinic|assistant)\/doctor\/all\/doctors/.test(path))
    return doctorsList(s.doctors, page, limit);
  if (m === "GET" && path.match(/\/(admin|clinic|assistant)\/doctor\/[^/]+$/)) {
    const id = path.split("/").pop()!;
    const doc = s.doctors.find((d) => d._id === id) || s.doctors[0];
    return { success: true, doctor: doc };
  }
  if (m === "POST" && path.includes("/create-doctor")) return { success: true, doctor: { ...s.doctors[0], ...b } };
  if (m === "PUT" && path.includes("/update-doctor")) return { success: true, message: "Updated" };

  // ── Patients (all role prefixes) ──
  if (m === "GET" && /\/(admin|clinic|assistant)\/patient\/all\/patients/.test(path))
    return patientsList(s.patients, page, limit);
  if (m === "GET" && path.match(/\/(admin|clinic|assistant)\/patient\/[^/]+$/)) {
    const id = path.split("/").pop()!;
    const p = s.patients.find((x) => x._id === id) || s.patients[0];
    return { success: true, patient: p };
  }
  if (m === "GET" && path === "/doctor/patient/all/patients")
    return { success: true, patients: s.doctorPatients };
  if (m === "GET" && path.startsWith("/doctors/patients"))
    return { success: true, data: { user: s.doctorPatients.find((p) => path.includes(p._id)) || s.doctorPatients[0] } };
  if (m === "POST" && path.includes("/create-patient")) return { success: true, patient: { ...s.patients[0], ...b } };
  if (m === "PUT" && path.includes("/update-patient")) return { success: true, patient: s.patients[0] };

  // ── Assistants ──
  if (m === "GET" && /\/(admin|clinic)\/assistant\/all\/assistants/.test(path))
    return { success: true, data: s.assistants, pagination: pagination(s.assistants, page, limit) };
  if (m === "GET" && path.match(/\/(admin|clinic)\/assistant\/[^/]+$/)) {
    const id = path.split("/").pop()!;
    return { success: true, data: s.assistants.find((a) => a._id === id) || s.assistants[0] };
  }
  if (m === "POST" && path.includes("/create-assistant")) return { success: true, assistant: s.assistants[0] };
  if (m === "PUT" && path.includes("/update-assistant")) return { success: true };

  // ── Appointments ──
  if (m === "GET" && (path.startsWith("/doctors/appointments") || path === "/appointments"))
    return appointmentsList(s.appointments);
  if (m === "GET" && path.match(/\/doctors\/appointments\/[^/]+$/))
    return success(s.appointments[0]);
  if (m === "GET" && path.includes("/doctors/appointments/status/")) {
    const status = path.split("/").pop()!.replace("cancelled", "cancelled");
    const filtered = s.appointments.filter((a) => a.status === status || (status === "cancelled" && a.status === "cancelled"));
    return appointmentsList(filtered.length ? filtered : s.appointments);
  }
  if (m === "GET" && /\/(doctor|patient|clinic|assistant)\/appointments/.test(path))
    return appointmentsList(s.appointments);
  if (m === "GET" && path.includes("/patient/appointment"))
    return appointmentsList(s.appointments);
  if (m === "GET" && path.includes("/clinic/appointments/list"))
    return appointmentsList(s.appointments);
  if (m === "GET" && path.includes("/doctor/availability/"))
    return success(s.availability);
  if (m === "GET" && path.includes("/clinic/doctor/list/"))
    return doctorsList(s.doctors);
  if (m === "GET" && path.includes("/clinic/patient/patient-list/"))
    return patientsList(s.patients);
  if (m === "POST" && path.includes("/appointments/create")) return success(s.appointments[0]);
  if (m === "PUT" && path.includes("/appointments/")) return success(s.appointments[0]);
  if (m === "PATCH" && path.includes("/appointments/")) return success(s.appointments[0]);
  if (m === "DELETE" && path.includes("/appointments")) return success(null);

  // ── Notes ──
  if (m === "GET" && path.includes("/notes/all")) return notesList(s.notes, page, limit);
  if (m === "GET" && path.match(/\/doctor\/notes\/[^/]+$/) && !path.includes("appointment"))
    return success(s.notes.find((n) => path.includes(n._id)) || s.notes[0]);
  if (m === "GET" && path.includes("/notes/appointment/")) return notesList(s.notes);
  if (m === "POST" && path.includes("/notes/create")) return success({ ...s.notes[0], ...b, _id: `note-${Date.now()}` });
  if (m === "PUT" && path.includes("/notes/update")) return success(s.notes[0]);
  if (m === "DELETE" && path.includes("/notes/delete")) return { success: true };
  if (m === "POST" && path.includes("/upload-audio")) return { success: true, audioUrl: "/placeholder.svg", fileSize: "1.2MB" };
  if (m === "POST" && path.includes("/transcribe")) return success(s.notes[0]);

  // ── Audit logs ──
  if (m === "GET" && path.includes("/audit-log/all/audit-logs")) return auditList(s.auditLogs, page, limit);
  if (m === "GET" && path.includes("/audit-log/audit-log/"))
    return { success: true, log: s.auditLogs[0] };

  // ── Theme ──
  if (m === "GET" && path.includes("/clinic/settings/theme/"))
    return { success: true, data: s.clinicTheme, clinicId: s.clinicTheme.clinicId };
  if (m === "PATCH" && path.includes("/clinic/settings/theme/")) return success(s.clinicTheme);
  if (m === "DELETE" && path.includes("/theme/clinic/")) return { success: true };

  // ── Availability ──
  if (m === "GET" && (path === "/doctors/availability" || path.includes("/doctor/availability/")))
    return success(s.availability);
  if (m === "PUT" && path.includes("/availability")) return success(s.availability);

  // ── Google Calendar ──
  if (m === "GET" && path.includes("/doctor/connection/google/status/"))
    return { googleCalendarConnected: false, googleEmail: null };
  if (m === "POST" && path.includes("/doctor/connection/google/")) return { success: true };

  // ── Onboarding ──
  if (m === "GET" && (path === "/patients/forms/me" || path.includes("/all-forms/") || path.includes("/patients/forms/")))
    return success(s.onboardingForms);
  if (m === "PATCH" && path.includes("/patient/onboarding/")) return success(s.onboardingForms);

  // ── Billing (axios paths) ──
  if (path.startsWith("/billing/doctor/charges") && m === "GET") {
    if (path.match(/\/charges\/[^/]+$/)) return success(s.billingCharges[0]);
    return success({ charges: s.billingCharges, pagination: pagination(s.billingCharges) });
  }
  if (path.startsWith("/billing/doctor/stats")) return success(s.doctorStats);
  if (path.startsWith("/billing/claims") && m === "GET")
    return success(path.match(/\/claims\/[^/]+$/) ? s.billingClaims[0] : { claims: s.billingClaims, pagination: pagination(s.billingClaims) });
  if (path.includes("/billing/codes/cpt")) return success(s.cptCodes);
  if (path.includes("/billing/codes/icd10")) return success(s.icd10Codes);
  if (path.startsWith("/billing/") && m === "POST") return success(s.billingCharges[0]);
  if (path.startsWith("/billing/") && (m === "PUT" || m === "PATCH")) return success(s.billingCharges[0]);

  // ── Auth ──
  if (m === "POST" && path === "/auth/logout") return { success: true };
  if (m === "POST" && path === "/auth/forgot-password") return { message: "Reset link sent (demo)" };
  if (m === "POST" && path === "/auth/reset-password") return { message: "Password reset (demo)" };
  if (m === "GET" && path === "/auth/profile") return { success: true, data: { role: "doctor", name: "Demo User" } };

  // ── Uploads ──
  if (m === "POST" && (path.includes("/upload/image") || path.includes("/upload/audio") || path.includes("/upload/video")))
    return { success: true, url: "/placeholder.svg?height=200&width=200", imageUrl: "/placeholder.svg?height=200&width=200" };

  // ── Profile, prescriptions, bills, reports ──
  if (m === "GET" && path.startsWith("/profile")) return success({ name: "Demo User", role: "doctor" });
  if (m === "GET" && path === "/prescriptions") return success([]);
  if (m === "GET" && path === "/bills") return success([]);
  if (m === "GET" && path === "/reports") return success([]);
  if (m === "GET" && path === "/refills") return success([]);

  // ── Patient full details ──
  if (m === "GET" && path.includes("/patient-full-details") || path.includes("/details"))
    return success({ patient: s.patients[0], lastAppointment: s.appointments[2] });

  // ── Mutations default ──
  if (m === "POST" || m === "PUT" || m === "PATCH" || m === "DELETE")
    return { success: true, message: "Saved (portfolio demo)" };

  // ── Safe fallback ──
  if (m === "GET") return { success: true, data: [] };
  return { success: true };
}

/** For fetch()-based clients (billing.ts, direct component fetches) */
export function resolveStaticFetch(
  method: string,
  endpoint: string,
  body?: unknown
): { ok: boolean; status: number; json: unknown } {
  const json = resolveStaticMock(method, endpoint, body);
  return { ok: true, status: 200, json };
}
