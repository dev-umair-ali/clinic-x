"use client"

import { Bell, User, Moon, Sun, Clock, CheckCircle, AlertCircle, FileText, MessageCircle, X } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const ROLE_NOTIFICATIONS: Record<string, any[]> = {
  admin: [
    { id: 1, icon: AlertCircle,  title: "System Update",         description: "Server maintenance scheduled tonight",               time: "2 min ago",  bgGradient: "from-red-500  to-rose-600",     lightBg: "bg-red-50 dark:bg-red-900/20" },
    { id: 2, icon: CheckCircle, title: "New Clinic Registered", description: "City Health Center has been added",                time: "15 min ago", bgGradient: "from-green-500 to-emerald-600", lightBg: "bg-green-50 dark:bg-green-900/20" },
    { id: 3, icon: FileText,    title: "Monthly Report Ready",  description: "Admin dashboard PDF is available for download",    time: "1 hour ago", bgGradient: "from-purple-500 to-indigo-600", lightBg: "bg-purple-50 dark:bg-purple-900/20" },
  ],
  assistant: [
    { id: 1, icon: Clock,       title: "Schedule Updated",      description: "Dr. Smith added new slots tomorrow",               time: "5 min ago",  bgGradient: "from-blue-500 to-cyan-600",     lightBg: "bg-blue-50 dark:bg-blue-900/20" },
    { id: 2, icon: MessageCircle, title: "Patient Message",   description: "Mr. Doe sent a follow-up question",                time: "20 min ago", bgGradient: "from-orange-500 to-amber-600", lightBg: "bg-orange-50 dark:bg-orange-900/20" },
  ],
  clinic: [
    { id: 1, icon: CheckCircle, title: "Doctor Verified",       description: "Dr. Johnson documents have been approved",         time: "10 min ago", bgGradient: "from-green-500 to-emerald-600", lightBg: "bg-green-50 dark:bg-green-900/20" },
    { id: 2, icon: AlertCircle,  title: "Invoice Overdue",      description: "Outstanding balance for March services",           time: "1 day ago",  bgGradient: "from-red-500  to-rose-600",     lightBg: "bg-red-50 dark:bg-red-900/20" },
  ],
  doctor: [
    { id: 1, icon: Clock,       title: "Appointment Soon",      description: "Patient appointment in 30 minutes",                time: "Just now",   bgGradient: "from-blue-500 to-cyan-600",     lightBg: "bg-blue-50 dark:bg-blue-900/20" },
    { id: 2, icon: FileText,    title: "Lab Results Uploaded",  description: "Blood-work for patient #1234 is ready",            time: "15 min ago", bgGradient: "from-purple-500 to-indigo-600", lightBg: "bg-purple-50 dark:bg-purple-900/20" },
  ],
  patient: [
    { id: 1, icon: CheckCircle, title: "Prescription Approved", description: "Your prescription has been sent to pharmacy",      time: "30 min ago", bgGradient: "from-green-500 to-emerald-600", lightBg: "bg-green-50 dark:bg-green-900/20" },
    { id: 2, icon: Clock,       title: "Appointment Reminder",  description: "Upcoming appointment with Dr. Smith tomorrow 10 AM", time: "1 hour ago", bgGradient: "from-blue-500 to-cyan-600",     lightBg: "bg-blue-50 dark:bg-blue-900/20" },
    { id: 3, icon: MessageCircle, title: "New Message",       description: "Clinic staff sent you a message",                  time: "3 hours ago", bgGradient: "from-orange-500 to-amber-600", lightBg: "bg-orange-50 dark:bg-orange-900/20" },
  ],
};

export function Header() {
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true)
  }, [])

if (!mounted || pathname === "/login" || pathname === "/verify-email-set-password" || pathname === "/forget-password") return null;
  const notifications = ROLE_NOTIFICATIONS[user?.role as string] ?? [];
  const active = notifications.find((n) => n.id === activeId);

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <SidebarTrigger className="" />
            <div className="flex-1 max-w-[280px] sm:max-w-md"></div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
            </button>

            <Popover>
              <PopoverTrigger asChild>
                <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors duration-200 hover:scale-110">
                  <Bell className="h-5 w-5 transition-transform duration-300" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {notifications.length}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 sm:w-96 p-0 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base">Notifications</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">You have {notifications.length} new notifications</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => {
                      const IconComponent = notif.icon;
                      return (
                        <div
                          key={notif.id}
                          onClick={() => setActiveId(notif.id)}
                          className="p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer border-b dark:border-gray-700 last:border-b-0 group"
                        >
                          <div className="flex gap-3 sm:gap-4">
                            <div className={`relative flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br ${notif.bgGradient} flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-200`}>
                              <IconComponent className="h-6 w-6 text-white" />
                              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-200`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {notif.description}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{notif.time}</p>
                                <div className="h-2 w-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-3 sm:p-4 text-center bg-gray-50 dark:bg-gray-800/50">
                    <a href={`/${user?.role}/notifications`} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-2 group">
                      View All Notifications
                      <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </a>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)} ${user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}`
                    : user?.name
                    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                    : "User"}
                </div>
              </div>
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                {user?.profilePicture ? (
                  <img src={user.profilePicture || "/placeholder.svg"} alt={user.name} className="h-8 w-8 rounded-full" />
                ) : (
                  <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ----------  DETAIL POP-UP  ---------- */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setActiveId(null)}
        >
          <div
            className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* close button */}
            <button
              onClick={() => setActiveId(null)}
              className="absolute top-3 right-3 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* icon + title */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br ${active.bgGradient} flex items-center justify-center`}>
                <active.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">{active.title}</h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{active.time}</p>
              </div>
            </div>

            {/* body */}
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{active.description}</p>

            {/* footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveId(null)}
                className="px-4 py-2 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white rounded-lg transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
