import * as seed from "./seed";

function deepClone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

let store: typeof seed | null = null;

export function getStaticStore() {
  if (!store) {
    store = deepClone(seed);
  }
  return store;
}

export function resetStaticStore() {
  store = null;
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function addAppointment(appt: Record<string, unknown>) {
  const s = getStaticStore();
  s.appointments.unshift(appt as (typeof s.appointments)[0]);
  return appt;
}

export function updateAppointment(id: string, patch: Record<string, unknown>) {
  const s = getStaticStore();
  const idx = s.appointments.findIndex((a) => a._id === id);
  if (idx === -1) return null;
  s.appointments[idx] = { ...s.appointments[idx], ...patch, updatedAt: new Date().toISOString() };
  return s.appointments[idx];
}

export function addPatient(patient: Record<string, unknown>) {
  const s = getStaticStore();
  const created = { ...patient, _id: patient._id || newId("patient") };
  s.patients.unshift(created as (typeof s.patients)[0]);
  s.doctorPatients.unshift(created as (typeof s.doctorPatients)[0]);
  return created;
}

export function updatePatient(id: string, patch: Record<string, unknown>) {
  const s = getStaticStore();
  const idx = s.patients.findIndex((p) => p._id === id);
  if (idx === -1) return null;
  s.patients[idx] = { ...s.patients[idx], ...patch };
  const dIdx = s.doctorPatients.findIndex((p) => p._id === id);
  if (dIdx !== -1) s.doctorPatients[dIdx] = { ...s.doctorPatients[dIdx], ...patch };
  return s.patients[idx];
}

export function addDoctor(doctor: Record<string, unknown>) {
  const s = getStaticStore();
  const created = { ...doctor, _id: doctor._id || newId("doctor") };
  s.doctors.unshift(created as (typeof s.doctors)[0]);
  return created;
}

export function updateDoctor(id: string, patch: Record<string, unknown>) {
  const s = getStaticStore();
  const idx = s.doctors.findIndex((d) => d._id === id);
  if (idx === -1) return null;
  s.doctors[idx] = { ...s.doctors[idx], ...patch };
  return s.doctors[idx];
}

export function addAssistant(assistant: Record<string, unknown>) {
  const s = getStaticStore();
  const created = { ...assistant, _id: assistant._id || newId("assistant") };
  s.assistants.unshift(created as (typeof s.assistants)[0]);
  return created;
}

export function updateAssistant(id: string, patch: Record<string, unknown>) {
  const s = getStaticStore();
  const idx = s.assistants.findIndex((a) => a._id === id);
  if (idx === -1) return null;
  s.assistants[idx] = { ...s.assistants[idx], ...patch };
  return s.assistants[idx];
}

export function addClinic(clinic: Record<string, unknown>) {
  const s = getStaticStore();
  const created = { ...clinic, _id: clinic._id || newId("clinic") };
  s.clinics.unshift(created as (typeof s.clinics)[0]);
  return created;
}

export function updateClinic(id: string, patch: Record<string, unknown>) {
  const s = getStaticStore();
  const idx = s.clinics.findIndex((c) => c._id === id);
  if (idx === -1) return null;
  s.clinics[idx] = { ...s.clinics[idx], ...patch };
  return s.clinics[idx];
}

export function addNote(note: Record<string, unknown>) {
  const s = getStaticStore();
  const created = { ...note, _id: note._id || newId("note") };
  s.notes.unshift(created as (typeof s.notes)[0]);
  return created;
}

export function updateNote(id: string, patch: Record<string, unknown>) {
  const s = getStaticStore();
  const idx = s.notes.findIndex((n) => n._id === id);
  if (idx === -1) return null;
  s.notes[idx] = { ...s.notes[idx], ...patch };
  return s.notes[idx];
}

export function addBillingCharge(charge: Record<string, unknown>) {
  const s = getStaticStore();
  const created = { ...charge, _id: charge._id || newId("charge") };
  s.billingCharges.unshift(created as (typeof s.billingCharges)[0]);
  return created;
}

export function addBillingClaim(claim: Record<string, unknown>) {
  const s = getStaticStore();
  const created = { ...claim, _id: claim._id || newId("claim") };
  s.billingClaims.unshift(created as (typeof s.billingClaims)[0]);
  return created;
}
