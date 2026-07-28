/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/clinic/assistants", destination: "/Clinic/assistants", permanent: false },
      { source: "/clinic/assistants/:path*", destination: "/Clinic/assistants/:path*", permanent: false },
      { source: "/clinic/settings/theme", destination: "/Clinic/settings/theme", permanent: false },
      { source: "/clinic/settings/theme/:path*", destination: "/Clinic/settings/theme/:path*", permanent: false },
      { source: "/clinic/settings/permission", destination: "/Clinic/settings/permission", permanent: false },
      { source: "/clinic/settings/permission/:path*", destination: "/Clinic/settings/permission/:path*", permanent: false },
      { source: "/clinic/notifications", destination: "/Clinic/notifications", permanent: false },
      { source: "/clinic/notifications/:path*", destination: "/Clinic/notifications/:path*", permanent: false },
      { source: "/clinic/notes/view/:path*", destination: "/Clinic/notes/view/:path*", permanent: false },
      { source: "/doctor/patients-billing/claims/create", destination: "/doctor/patients-billing/claims/submit", permanent: false },
      { source: "/doctor/patients-billing/claims/edit/:id", destination: "/doctor/patients-billing/claims/submit", permanent: false },
      { source: "/billing/doctor", destination: "/doctor/patients-billing", permanent: false },
      { source: "/billing/patient", destination: "/patient/billing", permanent: false },
      { source: "/billing/clinic", destination: "/clinic/patients-billing", permanent: false },
      { source: "/billing/assistant", destination: "/assistant/patients-billing", permanent: false },
    ];
  },
}

export default nextConfig