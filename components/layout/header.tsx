"use client";

import { Search, Bell, User, Moon, Sun } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // ✅ import this

export function Header() {
  const pathname = usePathname(); // ✅ current route
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Hide only on the login page
  if (!mounted || pathname === "/login") return null;

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-3">
        {/* Sidebar Trigger & Search */}
        <div className="flex items-center gap-2 sm:gap-4">

          <SidebarTrigger className="" />
          <div className="flex-1 max-w-[280px] sm:max-w-md">
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div> */}
          </div>
        </div>

        {/* Right: Notifications, Theme Toggle, User Info */}
        <div className="flex items-center gap-2 sm:gap-4">
      
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-800" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)} ${user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}`
                  : user?.name 
                    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                    : 'User'
                }
              </div>
              {/* <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </div> */}
              {/* <div className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 capitalize">
                {user?.role || 'User'}
              </div> */}
            </div>
            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture || "/placeholder.svg"}
                  alt={user.name} 
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
