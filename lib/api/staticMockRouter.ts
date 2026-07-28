import {
  getStaticStore,
  addAppointment,
  updateAppointment,
  addPatient,
  updatePatient,
  addDoctor,
  updateDoctor,
  addAssistant,
  updateAssistant,
  addClinic,
  updateClinic,
  addNote,
  updateNote,
  addBillingCharge,
  addBillingClaim,
  newId,
} from "@/lib/data/static/store";
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
  return { success: true, data: appts, appointments: appts };
}

function notesList(notes: ReturnType<typeof getStaticStore>["notes"], page = 1, limit = 10) {
  return {
    success: true,
    notes,
    pagination: pagination(notes, page, limit),
  };
}

function findById<T extends { _id?: string }>(items: T[], id: string): T | undefined {
  return items.find((x) => x._id === id);
}

function assistantDetail(a: ReturnType<typeof getStaticStore>["assistants"][0]) {
  return {
    ...a,
    userId: a.userRef,
    isEmailVerified: true,
    createdBy: "demo",
    createdAt: a.createdAt || new Date().toISOString(),
    updatedAt: a.updatedAt || new Date().toISOString(),
    address: (a as { address?: object }).address || {},
  };
}

function auditList(logs: ReturnType<typeof getStaticStore>["auditLogs"], page = 1, limit = 10) {
  return {
    success: true,
    logs,
    pagination: pagination(logs, page, limit),
  };
}

function buildAppointmentFromBody(b: Record<string, unknown>) {
  const s = getStaticStore();
  const doctorId = String(b.doctorRef || "");
  const patientId = String(b.patientRef || "");
  const doctor = findById(s.doctors, doctorId) || s.doctors[0];
  const patient = findById(s.patients, patientId) || s.patients[0];
  const date = String(b.date || "");
  const time = String(b.time || "09:00");
  const dateTime = b.dateTime
    ? String(b.dateTime)
    : date
      ? new Date(`${date}T${time.length === 5 ? time : time.slice(0, 5)}:00`).toISOString()
      : new Date().toISOString();
  const patientName = `${patient.firstName} ${patient.lastName}`.trim();
  const doctorName =
    (doctor as { name?: string }).name || `Dr. ${doctor.firstName} ${doctor.lastName}`;

  return {
    _id: newId("appt"),
    doctor: doctor._id,
    doctorRef: doctor,
    doctorName,
    patientRef: {
      _id: patient._id,
      name: patientName,
      email: patient.email,
      phone: patient.phoneNumber,
      avatar: patient.profilePicture,
    },
    patientName,
    patientId: patient._id,
    dateTime,
    date,
    time,
    timeZone: s.availability.timeZone,
    status: (b.status as string) || "scheduled",
    service: (b.service as string) || "Consultation",
    title: (b.service as string) || "Consultation",
    notes: b.notes,
    type: "In-person",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Resolves a static mock response for portfolio mode.
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
    const clinic = findById(s.clinics, id) || s.clinics[0];
    return { success: true, clinic, data: clinic };
  }
  if (m === "POST" && path === "/admin/clinic/create-clinic") {
    const created = addClinic({ ...s.clinics[0], ...b, _id: newId("clinic") });
    return { success: true, clinic: created, data: created };
  }
  if (m === "PUT" && path.includes("/admin/clinic/update-clinic")) {
    const id = path.split("/").pop()!;
    const updated = updateClinic(id, b) || { ...s.clinics[0], ...b };
    return { success: true, clinic: updated, data: updated };
  }

  // ── Doctors ──
  if (m === "GET" && /\/(admin|clinic|assistant)\/doctor\/all\/doctors/.test(path))
    return doctorsList(s.doctors, page, limit);
  if (m === "GET" && path.match(/\/(admin|clinic|assistant)\/doctor\/[^/]+$/)) {
    const id = path.split("/").pop()!;
    const doc = findById(s.doctors, id) || s.doctors[0];
    return { success: true, doctor: doc };
  }
  if (m === "POST" && path.includes("/create-doctor")) {
    const created = addDoctor({ ...s.doctors[0], ...b, _id: newId("doctor") });
    return { success: true, doctor: created };
  }
  if (m === "PUT" && path.includes("/update-doctor")) {
    const id = path.split("/").pop()!;
    const updated = updateDoctor(id, b) || { ...s.doctors[0], ...b };
    return { success: true, doctor: updated, message: "Updated" };
  }

  // ── Patients ──
  if (m === "GET" && /\/(admin|clinic|assistant)\/patient\/all\/patients/.test(path))
    return patientsList(s.patients, page, limit);
  if (m === "GET" && path.match(/\/(admin|clinic|assistant)\/patient\/[^/]+$/) && !path.includes("all")) {
    const id = path.split("/").pop()!;
    const p = findById(s.patients, id) || s.patients[0];
    return { success: true, patient: p };
  }
  if (m === "GET" && path.match(/\/doctor\/patient\/[^/]+$/) && !path.includes("all")) {
    const id = path.split("/").pop()!;
    const p = findById(s.patients, id) || s.doctorPatients[0] || s.patients[0];
    return { success: true, patient: p };
  }
  if (m === "GET" && path.match(/\/doctors\/patients\/[^/]+$/) && !path.includes("/doctor/")) {
    const id = path.split("/").pop()!;
    const p = findById(s.patients, id) || s.patients[0];
    return { success: true, data: p, patient: p };
  }
  if (m === "GET" && path === "/doctor/patient/all/patients")
    return { success: true, patients: s.doctorPatients };
  if (m === "GET" && path.startsWith("/doctors/patients"))
    return {
      success: true,
      data: { user: findById(s.doctorPatients, path.split("/").pop()!) || s.doctorPatients[0] },
    };
  if (m === "POST" && path.includes("/create-patient")) {
    const created = addPatient({ ...s.patients[0], ...b, _id: newId("patient") });
    return { success: true, patient: created };
  }
  if (m === "PUT" && path.includes("/update-patient")) {
    const id = path.split("/").pop()!;
    const updated = updatePatient(id, b) || { ...s.patients[0], ...b };
    return { success: true, patient: updated };
  }

  // ── Assistants ──
  if (m === "GET" && /\/(admin|clinic)\/assistant\/all\/assistants/.test(path))
    return { success: true, data: s.assistants, pagination: pagination(s.assistants, page, limit) };
  if (
    m === "GET" &&
    path.match(/\/clinic\/assistant\/[^/]+$/) &&
    !path.includes("all") &&
    !path.includes("create") &&
    !path.includes("update")
  ) {
    const id = path.split("/").pop()!;
    const a = findById(s.assistants, id) || s.assistants[0];
    return { success: true, data: { assistant: assistantDetail(a) } };
  }
  if (m === "GET" && path.match(/\/admin\/assistant\/[^/]+$/) && !path.includes("all")) {
    const id = path.split("/").pop()!;
    const a = findById(s.assistants, id) || s.assistants[0];
    return { success: true, data: assistantDetail(a) };
  }
  if (m === "POST" && path.includes("/create-assistant")) {
    const created = addAssistant({
      ...s.assistants[0],
      ...b,
      _id: newId("assistant"),
      name: `${b.firstName || s.assistants[0].firstName} ${b.lastName || s.assistants[0].lastName}`,
    });
    const detail = assistantDetail(created as (typeof s.assistants)[0]);
    return { success: true, assistant: detail, data: { assistant: detail } };
  }
  if (m === "PUT" && path.includes("/update-assistant")) {
    const id = path.split("/").pop()!;
    const updated = updateAssistant(id, b) || { ...s.assistants[0], ...b };
    const detail = assistantDetail(updated as (typeof s.assistants)[0]);
    return { success: true, data: { assistant: detail }, assistant: detail };
  }

  // ── Appointments: date-filtered slots first ──
  if (m === "GET" && path.match(/^\/doctor\/appointments\/[^/]+$/) && search.has("date")) {
    const doctorId = path.split("/").pop()!;
    const date = search.get("date")!;
    const filtered = s.appointments.filter((a) => {
      const aDoctor =
        typeof a.doctor === "string" ? a.doctor : (a.doctorRef as { _id?: string })?._id;
      const aDate = (a.dateTime || "").slice(0, 10);
      return aDoctor === doctorId && (aDate === date || (a as { date?: string }).date === date);
    });
    return { success: true, data: filtered, appointments: filtered };
  }

  if (m === "GET" && path === "/doctors/weekly-count") {
    return {
      success: true,
      totalAppointmentsThisWeek: s.appointments.filter((a) => a.status === "scheduled").length,
      data: { totalAppointmentsThisWeek: s.appointments.length },
    };
  }

  if (m === "GET" && (path.startsWith("/doctors/appointments") || path === "/appointments"))
    return appointmentsList(s.appointments);
  if (m === "GET" && path.match(/\/doctors\/appointments\/[^/]+\/details$/)) {
    const id = path.split("/")[3];
    const appt = findById(s.appointments, id) || s.appointments[0];
    const patient = findById(s.patients, appt.patientId as string) || s.patients[0];
    return success({ ...appt, patient });
  }
  if (m === "GET" && path.match(/\/doctors\/appointments\/[^/]+$/) && !path.includes("/calendar"))
    return success(findById(s.appointments, path.split("/").pop()!) || s.appointments[0]);
  if (m === "GET" && path.includes("/doctors/appointments/status/")) {
    const status = path.split("/").pop()!;
    const filtered = s.appointments.filter((a) => a.status === status);
    return appointmentsList(filtered.length ? filtered : s.appointments);
  }
  if (m === "GET" && /\/(doctor|patient|clinic|assistant)\/appointments/.test(path))
    return appointmentsList(s.appointments);
  if (m === "GET" && path.includes("/patient/appointment"))
    return appointmentsList(s.appointments);
  if (m === "GET" && path.includes("/clinic/appointments/list"))
    return appointmentsList(s.appointments);
  if (m === "GET" && path.includes("/doctor/availability/")) return success(s.availability);
  if (m === "GET" && path.includes("/clinic/doctor/list/")) return doctorsList(s.doctors);
  if (m === "GET" && path.includes("/clinic/patient/patient-list/")) return patientsList(s.patients);

  if (m === "POST" && path.includes("/appointments/create")) {
    const created = buildAppointmentFromBody(b);
    addAppointment(created);
    return {
      success: true,
      data: created,
      appointment: created,
      message: "Appointment created",
    };
  }
  if ((m === "PUT" || m === "PATCH") && path.includes("/appointments/")) {
    const parts = path.split("/").filter(Boolean);
    const apptId =
      parts.find((p) => p.startsWith("appt-")) ||
      parts[parts.length - 1];
    const realId =
      findById(s.appointments, apptId)?._id ||
      findById(s.appointments, parts[parts.length - 1])?._id ||
      s.appointments[0]?._id;
    let statusPatch: Record<string, unknown> = { ...b };
    if (path.includes("/cancel")) statusPatch = { ...statusPatch, status: "cancelled" };
    if (path.includes("/status") && b.status) statusPatch = { ...statusPatch, status: b.status };
    if (path.includes("/reschedule") && (b.dateTime || b.date)) {
      statusPatch = {
        ...statusPatch,
        dateTime:
          b.dateTime ||
          (b.date && b.time ? `${b.date}T${b.time}:00` : b.date),
        date: b.date,
        time: b.time,
        status: "scheduled",
      };
    }
    const updated = realId ? updateAppointment(realId, statusPatch) : null;
    return success(updated || s.appointments[0]);
  }
  if (m === "DELETE" && path.includes("/appointments")) return success(null);

  // ── Notes ──
  if (m === "GET" && path.includes("/notes/all")) return notesList(s.notes, page, limit);
  if (
    m === "GET" &&
    path.match(/\/(doctor|clinic|patient|assistant)\/notes\/[^/]+$/) &&
    !path.includes("appointment") &&
    !path.includes("all")
  ) {
    const id = path.split("/").pop()!;
    return success(findById(s.notes, id) || s.notes[0]);
  }
  if (m === "GET" && path.includes("/notes/appointment/")) return notesList(s.notes);
  if (m === "POST" && path.includes("/notes/create")) {
    const created = addNote({ ...s.notes[0], ...b, _id: newId("note") });
    return success(created);
  }
  if (m === "PUT" && path.includes("/notes/update")) {
    const id = path.split("/").pop()!;
    return success(updateNote(id, b) || s.notes[0]);
  }
  if (m === "DELETE" && path.includes("/notes/delete")) return { success: true };
  if (m === "POST" && path.includes("/upload-audio"))
    return { success: true, audioUrl: "/placeholder.svg", fileSize: "1.2MB" };
  if (m === "POST" && path.includes("/transcribe")) return success(s.notes[0]);

  // ── Audit logs ──
  if (m === "GET" && path.includes("/audit-log/all/audit-logs")) return auditList(s.auditLogs, page, limit);
  if (m === "GET" && path.includes("/audit-log/audit-log/"))
    return { success: true, log: s.auditLogs[0] };

  // ── Theme ──
  if (m === "GET" && path.includes("/clinic/settings/theme/"))
    return { success: true, data: s.clinicTheme, clinicId: s.clinicTheme.clinicId };
  if (m === "PATCH" && path.includes("/clinic/settings/theme")) return success(s.clinicTheme);
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
  if (
    m === "GET" &&
    (path === "/patients/forms/me" || path.includes("/all-forms/") || path.includes("/patients/forms/"))
  )
    return { success: true, data: s.onboardingForms, message: "Success" };
  if (m === "PATCH" && path.includes("/patient/onboarding/"))
    return { success: true, data: s.onboardingForms, message: "Saved" };
  if (m === "PUT" && path.includes("/patient/onboarding/"))
    return { success: true, data: s.onboardingForms, message: "Saved" };

  // ── Billing ──
  if (path.startsWith("/billing/doctor/charges") && m === "GET") {
    const chargeId = path.match(/\/charges\/([^/]+)$/)?.[1];
    if (chargeId) return success(findById(s.billingCharges, chargeId) || s.billingCharges[0]);
    return success({ charges: s.billingCharges, pagination: pagination(s.billingCharges) });
  }
  if (path.startsWith("/billing/doctor/stats")) return success(s.doctorStats);
  if (path.startsWith("/billing/claims") && m === "GET") {
    const claimId = path.match(/\/claims\/([^/]+)$/)?.[1];
    if (claimId) return success(findById(s.billingClaims, claimId) || s.billingClaims[0]);
    return success({ claims: s.billingClaims, pagination: pagination(s.billingClaims) });
  }
  if (path.includes("/billing/codes/cpt")) return success(s.cptCodes);
  if (path.includes("/billing/codes/icd10")) return success(s.icd10Codes);
  if (path.startsWith("/billing/") && m === "POST") {
    if (path.includes("/claims")) {
      const created = addBillingClaim({ ...s.billingClaims[0], ...b, _id: newId("claim") });
      return success(created);
    }
    const created = addBillingCharge({ ...s.billingCharges[0], ...b, _id: newId("charge") });
    return success(created);
  }
  if (path.startsWith("/billing/") && (m === "PUT" || m === "PATCH")) return success(s.billingCharges[0]);

  // ── Auth ──
  if (m === "POST" && path === "/auth/logout") return { success: true };
  if (m === "POST" && path === "/auth/forgot-password") return { message: "Reset link sent (demo)" };
  if (m === "POST" && path === "/auth/reset-password") return { message: "Password reset (demo)" };
  if (m === "GET" && path === "/auth/profile")
    return { success: true, data: { role: "doctor", name: "Demo User" } };

  // ── Uploads ──
  if (
    m === "POST" &&
    (path.includes("/upload/image") || path.includes("/upload/audio") || path.includes("/upload/video"))
  )
    return {
      success: true,
      url: "/placeholder.svg?height=200&width=200",
      imageUrl: "/placeholder.svg?height=200&width=200",
    };

  // ── Profile / misc ──
  if (m === "GET" && path.startsWith("/profile")) return success({ name: "Demo User", role: "doctor" });
  if (m === "GET" && path === "/prescriptions") return success([]);
  if (m === "GET" && path === "/bills") return success([]);
  if (m === "GET" && path === "/reports") return success([]);
  if (m === "GET" && path === "/refills") return success([]);

  if (m === "GET" && (path.includes("/patient-full-details") || path.endsWith("/patient/details")))
    return success({ patient: s.patients[0], lastAppointment: s.appointments[2] });

  if (m === "POST" || m === "PUT" || m === "PATCH" || m === "DELETE")
    return { success: true, message: "Saved (portfolio demo)", data: b };

  if (m === "GET") return { success: true, data: [] };
  return { success: true };
}

export function resolveStaticFetch(
  method: string,
  endpoint: string,
  body?: unknown
): { ok: boolean; status: number; json: unknown } {
  const json = resolveStaticMock(method, endpoint, body);
  return { ok: true, status: 200, json };
}
