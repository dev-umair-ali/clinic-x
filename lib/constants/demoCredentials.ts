import type { User } from "@/lib/slices/authSlice";
import { IDS } from "@/lib/data/static/ids";

export type DemoRole = User["role"];

export interface DemoCredential {
  role: DemoRole;
  label: string;
  email: string;
  password: string;
  name: string;
  user: User;
}

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    role: "admin",
    label: "Admin",
    email: "admin@clinicx.demo",
    password: "Admin@123",
    name: "Demo Admin",
    user: {
      id: "demo-admin",
      _id: "demo-admin",
      email: "admin@clinicx.demo",
      name: "Demo Admin",
      firstName: "Demo",
      lastName: "Admin",
      role: "admin",
      profilePicture: "/placeholder.svg?height=40&width=40",
      hasCompletedOnboarding: true,
    },
  },
  {
    role: "doctor",
    label: "Doctor",
    email: "doctor@clinicx.demo",
    password: "Doctor@123",
    name: "Dr. Sarah Chen",
    user: {
      id: "demo-doctor",
      _id: "demo-doctor",
      email: "doctor@clinicx.demo",
      name: "Dr. Sarah Chen",
      firstName: "Sarah",
      lastName: "Chen",
      role: "doctor",
      doctorId: IDS.DOCTOR_1,
      doctorRef: IDS.DOCTOR_1,
      clinicId: IDS.CLINIC_1,
      clinicRef: IDS.CLINIC_1,
      profilePicture: "/placeholder.svg?height=40&width=40",
      hasCompletedOnboarding: true,
    },
  },
  {
    role: "patient",
    label: "Patient",
    email: "patient@clinicx.demo",
    password: "Patient@123",
    name: "Emily Johnson",
    user: {
      id: "demo-patient",
      _id: "demo-patient",
      email: "patient@clinicx.demo",
      name: "Emily Johnson",
      firstName: "Emily",
      lastName: "Johnson",
      role: "patient",
      patientId: IDS.PATIENT_1,
      patientRef: IDS.PATIENT_1,
      clinicId: IDS.CLINIC_1,
      clinicRef: IDS.CLINIC_1,
      profilePicture: "/placeholder.svg?height=40&width=40",
      hasCompletedOnboarding: true,
    },
  },
  {
    role: "assistant",
    label: "Assistant / Receptionist",
    email: "assistant@clinicx.demo",
    password: "Assistant@123",
    name: "Anna Reed",
    user: {
      id: "demo-assistant",
      _id: "demo-assistant",
      email: "assistant@clinicx.demo",
      name: "Anna Reed",
      firstName: "Anna",
      lastName: "Reed",
      role: "assistant",
      assistantId: IDS.ASSISTANT_1,
      assistantRef: IDS.ASSISTANT_1,
      clinicId: IDS.CLINIC_1,
      clinicRef: IDS.CLINIC_1,
      profilePicture: "/placeholder.svg?height=40&width=40",
      hasCompletedOnboarding: true,
    },
  },
  {
    role: "clinic",
    label: "Clinic",
    email: "clinic@clinicx.demo",
    password: "Clinic@123",
    name: "Demo Clinic Owner",
    user: {
      id: "demo-clinic",
      _id: "demo-clinic",
      email: "clinic@clinicx.demo",
      name: "Demo Clinic Owner",
      firstName: "Demo",
      lastName: "Clinic Owner",
      role: "clinic",
      clinicId: IDS.CLINIC_1,
      clinicRef: IDS.CLINIC_1,
      profilePicture: "/placeholder.svg?height=40&width=40",
      hasCompletedOnboarding: true,
    },
  },
];

export function findDemoCredential(
  email: string,
  password: string
): DemoCredential | undefined {
  return DEMO_CREDENTIALS.find(
    (cred) => cred.email === email && cred.password === password
  );
}

export const DASHBOARD_ROUTES: Record<DemoRole, string> = {
  admin: "/admin/dashboard",
  doctor: "/doctor/dashboard",
  patient: "/patient/dashboard",
  assistant: "/assistant/dashboard",
  clinic: "/Clinic/dashboard",
};
