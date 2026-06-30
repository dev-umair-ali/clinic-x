"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { logout } from "@/lib/slices/authSlice";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  CreditCard, 
  FileText, 
  StickyNote, 
  Settings, 
  LogOut, 
  HelpCircle, 
  MessageCircle, 
  ArrowRight,
  Building2,
  UserPlus,
  ClipboardList,
  Volume2,
  DollarSign
} from 'lucide-react';

const menuItems = {
  admin: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Building2, label: "Clinics", href: "/admin/clinics" },
    { icon: UserPlus, label: "Assistants", href: "/admin/assistants" },
    { icon: Users, label: "Doctors", href: "/admin/doctors" },
    { icon: Users, label: "Patients", href: "/admin/patients" },
    { icon: Calendar, label: "Appointments", href: "/admin/appointments" },
    { icon: ClipboardList, label: "Dashboard Log", href: "/admin/dashlogs" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ],
  
  clinic: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/Clinic/dashboard" },
    { icon: UserPlus, label: "Assistants", href: "/Clinic/assistants" },
    { icon: Users, label: "Doctors", href: "/clinic/doctors" },
    { icon: Users, label: "Patients", href: "/clinic/patients" },
    { icon: Calendar, label: "Appointments", href: "/clinic/appointments" },
    { icon: Volume2, label: "Patient Notes", href: "/clinic/notes" },
    { icon: FileText, label: "Prescriptions", href: "/clinic/prescription" },
    // { icon: CreditCard, label: "Patients Billing", href: "/clinic/patients-billing" },
    { icon: ClipboardList, label: "Dashboard Log", href: "/clinic/dashlogs" },
    { icon: Settings, label: "Settings", href: "/clinic/settings" },
  ],
  
  assistant: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/assistant/dashboard" },
    { icon: Users, label: "Doctors", href: "/assistant/doctors" },
    { icon: Users, label: "Patients", href: "/assistant/patients" },
    { icon: Calendar, label: "Appointments", href: "/assistant/appointments" },
    { icon: FileText, label: "Prescriptions", href: "/assistant/prescription" },
    // { icon: CreditCard, label: "Patients Billing", href: "/assistant/patients-billing" },
    { icon: ClipboardList, label: "Dashboard Log", href: "/assistant/dashlogs" },
  ],
  
  doctor: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/doctor/dashboard" },
    { icon: Calendar, label: "Appointments", href: "/doctor/appointments" },
    { icon: Users, label: "Patients", href: "/doctor/patients" },
    { icon: Volume2, label: "Patient Notes", href: "/doctor/notes" },
    { icon: FileText, label: "Prescriptions", href: "/doctor/prescription" },
    // { icon: CreditCard, label: "Patients Billing", href: "/doctor/patients-billing" },
    { icon: ClipboardList, label: "Dashboard Log", href: "/doctor/dashlogs" },
    { icon: Settings, label: "Availability", href: "/doctor/settings/availability" },
  ],
  
  patient: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/patient/dashboard" },
    { icon: Calendar, label: "Appointments", href: "/patient/appointments" },
    { icon: FileText, label: "Prescriptions", href: "/patient/prescriptions" },
    // { icon: DollarSign, label: "Billing", href: "/patient/billing" },
    { icon: StickyNote, label: "Medical Records", href: "/patient/records" },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const themeState = useSelector((state: RootState) => state.theme)
  const { current: currentTheme, loading, isDefault } = themeState

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (!user) return null;

  const role = user.role as keyof typeof menuItems;
  const items = menuItems[role] || [];

  return (
    <div className="hidden md:flex h-screen w-64 flex-col bg-gradient-to-b from-teal-600 to-teal-700 text-white">
      {/* Logo Section */}
      <div className="px-6 py-8">
        {currentTheme.logo && !loading ? (
          <img
            src={currentTheme.logo}
            alt="Logo"
            style={{ width: '80px', height: '80px', borderRadius: '50%' }}
          />
        ) : (
          <>
            <div className="text-2xl font-bold text-white mb-1">Logo</div>
            <div className="text-sm text-teal-100 opacity-80">Powered By Clinic X</div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6">
        {/* Main Menu Section */}
        <div className="mb-8">
          {/* <div className="text-xs font-semibold text-teal-100 mb-4 uppercase tracking-wider opacity-80">
            MAIN MENU
          </div> */}
          <nav className="space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? "bg-teal-800 text-white shadow-lg"
                    : "text-white hover:bg-teal-800/50"
                    }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Other Section */}
        {/* <div className="mb-8">
          <div className="text-xs font-semibold text-teal-100 mb-4 uppercase tracking-wider opacity-80">
            OTHER
          </div>
          <nav className="space-y-1">
            {otherItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-teal-800 text-white shadow-lg"
                      : "text-white hover:bg-teal-800/50"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div> */}

        {/* Sign Out Button */}
        <div className="mb-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 transition-colors w-full text-white shadow-lg"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Help Section */}
      <div className="mx-6 mb-6">
        <div className="bg-teal-800/60 backdrop-blur-sm rounded-xl p-6 border border-teal-600/30">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-white mb-2">
            Still have more questions?
          </h3>
          <p className="text-xs text-teal-100 mb-4 opacity-90 leading-relaxed">
            We will be ready to help you, always available 24/7 hours
          </p>
          <button className="flex items-center gap-2 text-xs text-white hover:text-teal-100 transition-colors group">
            <MessageCircle className="h-4 w-4" />
            <span>Contact Us</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
