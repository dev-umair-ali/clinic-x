import { ProtectedRoute } from "@/components/ui/protected-route";

export default function ClinicDashboard() {
  return (
    <ProtectedRoute allowedRoles={["receptionist"]}>
      <h1>Receptionist Dashboard</h1>
    </ProtectedRoute>
  );
}
