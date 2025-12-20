"use client"
import { Plus } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { useRouter } from "next/navigation"

export default function HeaderBanner() {
  const { user } = useSelector((state: RootState) => state.auth)
  const router = useRouter()

  const handleNav = (path: string) => router.push(path)

  return (
    <div className="bg-teal-500 dark:bg-teal-600 rounded-2xl p-4 sm:p-8 text-white relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {user?.firstName && user?.lastName
              ? `${user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)} ${
                  user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)
                }`
              : user?.name
              ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
              : "User"}
          </h1>
          <p className="text-teal-100 dark:text-teal-200 text-sm sm:text-base">
            Here's an overview of your healthcare information and recent activity.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => handleNav("/admin/doctors/add")}
            className="bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Doctor
          </button>
          <button
            onClick={() => handleNav("/admin/patients/add")}
            className="bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Patient
          </button>
        </div>
      </div>
    </div>
  )
}