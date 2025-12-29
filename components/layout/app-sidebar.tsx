"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ArrowRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { IoHome } from "react-icons/io5";
import { HiMiniUserGroup } from "react-icons/hi2";
import { TiMicrophone } from "react-icons/ti";
import { RiVolumeUpFill } from "react-icons/ri";
import { IoSettingsSharp } from "react-icons/io5";
import { AiFillDollarCircle } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/store";
import { logout } from "@/lib/slices/authSlice";
import { CiCalendar } from "react-icons/ci";
import { FaCreditCard } from "react-icons/fa";
import { FaClinicMedical } from "react-icons/fa";
import { IoIosPersonAdd } from "react-icons/io";
import { FaRegClipboard } from "react-icons/fa";

const menuItems = {
  admin: [
  { icon: IoHome, label: "Dashboard", href: "/admin/dashboard" },

  { icon: FaClinicMedical, label: "Clinics", href: "/admin/clinics" },
  { icon: IoIosPersonAdd, label: "Assistants", href: "/admin/add-assistant" },
  { icon: HiMiniUserGroup, label: "Doctors", href: "/admin/doctors" },
  { icon: HiMiniUserGroup, label: "Patients", href: "/admin/patients" },

  { icon: FaRegClipboard, label: "Dashboard Log", href: "/admin/dashlogs" },
],

clinic: [
  { icon: IoHome, label: "Dashboard", href: "/clinic/dashboard" },
  { icon: IoIosPersonAdd, label: "Assistants", href: "/clinic/add-assistant" },
  { icon: HiMiniUserGroup, label: "Patients", href: "/clinic/patients" },
  
  { icon: CiCalendar, label: "Appointments", href: "/clinic/appointments" },
  { icon: RiVolumeUpFill, label: "Patient Notes", href: "/clinic/notes" },
  { icon: TiMicrophone, label: "Prescription", href: "/clinic/prescription" },
  { icon: CiCalendar, label: "Patients Billing", href: "/clinic/patients-billing" },

  { icon: FaRegClipboard, label: "Dashboard Log", href: "/clinic/dashlogs" },
  { icon: FaCreditCard, label: "Theme Settings", href: "/clinic/theme-settings" },
],

receptionist: [
  { icon: IoHome, label: "Dashboard", href: "/receptionist/dashboard" },

  { icon: HiMiniUserGroup, label: "Patients", href: "/receptionist/patients" },

  { icon: CiCalendar, label: "Appointments", href: "/receptionist/appointments" },
  { icon: TiMicrophone, label: "Prescription", href: "/receptionist/prescription" },
  { icon: FaCreditCard, label: "Patients Billing", href: "/receptionist/patients-billing" },
],

doctor: [
  { icon: IoHome, label: "Dashboard", href: "/doctor/dashboard" },
  
  { icon: HiMiniUserGroup, label: "Patients", href: "/doctor/patients" },

  { icon: CiCalendar, label: "Appointments", href: "/doctor/appointments" },
  { icon: RiVolumeUpFill, label: "Patient Notes", href: "/doctor/notes" },
  { icon: TiMicrophone, label: "Prescription", href: "/doctor/prescription" },
  { icon: FaCreditCard, label: "Patients Billing", href: "/doctor/patients-billing" },
  { icon: IoSettingsSharp, label: "Settings", href: "/doctor/settings" },
],

patient: [
  { icon: IoHome, label: "Dashboard", href: "/patient/dashboard" },

  { icon: CiCalendar, label: "Appointments", href: "/patient/appointments" },
  { icon: TiMicrophone, label: "Prescriptions", href: "/patient/prescriptions" },
  { icon: AiFillDollarCircle, label: "Billing", href: "/patient/billing" },
],
};

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (!user) return null;

  const role = user.role as keyof typeof menuItems;
  const items = menuItems[role] || [];

  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-gradient-to-r from-[hsl(var(--gradient-sidebar-start))] to-[hsl(var(--gradient-sidebar-end))] text-[hsl(var(--sidebar-foreground))] border-none h-screen"
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <SidebarHeader className="px-6 py-6 shrink-0">
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold">Logo</div>
            <div className="text-xs text-[hsl(var(--sidebar-foreground))]">Powered By Clinic X</div>
          </div>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent className="flex-1 px-6 overflow-y-auto scrollbar-hide">
          <div className="flex flex-col h-full">
            {/* Main Menu */}
            <SidebarGroup className="mb-6">
              <SidebarGroupLabel className="text-xs font-medium text-[hsl(var(--sidebar-foreground))] mb-4 uppercase tracking-wider">
                MAIN MENU
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-gradient-to-r from-[hsl(var(--color-brand-teal))] to-[hsl(var(--color-teal-gradient-mid))] text-[hsl(var(--sidebar-foreground))] font-semibold"
                              : "text-[hsl(var(--sidebar-foreground))] hover:bg-[linear-gradient(94.25deg,_hsl(var(--color-brand-teal))_0%,_hsl(var(--color-teal-gradient-mid))_100%)] hover:text-[hsl(var(--sidebar-foreground))]"
                          }`}
                        >
                          <Link
                            href={item.href}
                            className="flex items-center gap-3"
                          >
                            <item.icon className="h-6 w-6 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {role === "doctor" || role === "patient" ? (
              <SidebarGroup className="mb-6">
                {/* <SidebarGroupLabel className="text-xs font-medium text-white mb-4 uppercase tracking-wider">
                  {role === "doctor" || role === "patient" ? "OTHER" : ""}
                </SidebarGroupLabel> */}
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {/* Settings - only for admin */}
                    {/* {role === "admin" && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out ${
                          pathname === `/settings/${role}`
                            ? "bg-gradient-to-r from-[#1DA68F] to-[#27DEBF] text-white font-semibold"
                            : "text-white hover:bg-white/10"
                        }`}
                      >
                        <Link
                          href={`/settings/${role}`}
                          className="flex items-center gap-3"
                        >
                          <IoSettingsSharp className="h-6 w-6 shrink-0" />
                          <span className="truncate">Settings</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )} */}

                    {/* Billing - only for doctor */}
                    {/* {role === "doctor" && (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out ${
                            pathname === `/billing/${role}`
                              ? "bg-gradient-to-r from-[#1DA68F] to-[#27DEBF] text-white font-semibold"
                              : "text-white hover:bg-white/10"
                          }`}
                        >
                          <Link
                            href={`/billing/${role}`}
                            className="flex items-center gap-3"
                          >
                            <AiFillDollarCircle className="h-6 w-6 shrink-0" />
                            <span className="truncate">Billing</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )} */}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ) : (
              <></>
            )}

            {/* Logout */}
           <div className="mb-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleLogout}
                    className="px-3 py-2.5 rounded-xl text-sm font-medium bg-[hsl(var(--color-status-error))] hover:bg-[hsl(var(--color-status-error-dark))] text-[hsl(var(--destructive-foreground))] shadow-lg w-full"
                  >
                    <LogOut className="h-6 w-6 shrink-0" />
                    <span>Sign Out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>

            <SidebarGroup className="shrink-0">
              <SidebarGroupContent>
                <div className="relative rounded-2xl p-6 bg-gradient-to-br from-[hsl(var(--color-brand-teal-dark)/0.9)] to-[hsl(var(--color-medical)/0.8)] overflow-hidden">
                  {/* Background medical cross icon */}
                  <div className="absolute -right-4 -bottom-2 transform ">
                    <img
                      src="/images/Element.png"
                      alt=""
                      className="w-30 h-30"
                    />
                  </div>

                  {/* Question mark icon */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-[hsl(var(--color-white-alpha-20))] mb-4">
                    <span className="text-[hsl(var(--sidebar-foreground))] text-sm font-bold">?</span>
                  </div>

                  {/* Content */}
                  <h3 className="text-[hsl(var(--sidebar-foreground))] text-lg font-semibold mb-2 leading-tight">
                    Still have more questions?
                  </h3>
                  <p className="text-[hsl(var(--color-white-alpha-80))] text-sm mb-4 leading-relaxed">
                    We will be ready to help you, always available 24/7 hours
                  </p>

                  {/* Contact button */}
                  <button className="flex items-center gap-2 text-[hsl(var(--sidebar-foreground))] text-sm font-medium underline hover:text-[hsl(var(--color-white-alpha-90))] transition-colors group">
                    <span>Contact Us</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </SidebarContent>
      </div>

      <SidebarRail />
    </Sidebar>
  );
}