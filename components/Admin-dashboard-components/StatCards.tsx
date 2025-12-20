"use client"
import { BsBuildingsFill } from "react-icons/bs"
import { Users, DollarSign, TrendingUp } from "lucide-react"

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      <div className="group bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:bg-gradient-to-r from-[#5EC9BD] to-[#2C7F75] transition">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-teal-100 dark:bg-orange-900/30 p-3 rounded-lg group-hover:bg-white/20">
            <BsBuildingsFill className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500 dark:text-teal-500 group-hover:text-white" />
          </div>
          <span className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 group-hover:bg-white/20 group-hover:text-white">
            +2
          </span>
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-sm sm:text-base group-hover:text-white">
          Total Doctors
        </div>
        <div className="text-2xl sm:text-3xl font-bold mb-1 text-teal-500 dark:text-white group-hover:text-white">
          156
        </div>
      </div>

      <div className="group bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:bg-gradient-to-r from-[#5EC9BD] to-[#2C7F75] transition">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg group-hover:bg-white/20">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#947311] dark:text-[#947311] group-hover:text-white" />
          </div>
          <span className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 group-hover:bg-white/20 group-hover:text-white">
            +2
          </span>
        </div>
        <div className="text-[#999B9D] dark:text-gray-400 text-sm sm:text-base group-hover:text-white">
          Total Doctors
        </div>
        <div className="text-2xl sm:text-3xl font-bold mb-1 text-[#947311] dark:text-white group-hover:text-white">
          156
        </div>
      </div>

      <div className="group bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:bg-gradient-to-r from-[#5EC9BD] to-[#2C7F75] transition">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-[#3B82F6]/20 dark:bg-blue-900/30 p-3 rounded-lg group-hover:bg-white/20">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B82F6] dark:text-blue-400 group-hover:text-white" />
          </div>
          <span className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 group-hover:bg-white/20 group-hover:text-white">
            +22
          </span>
        </div>
        <div className="text-[#999B9D] dark:text-gray-400 text-sm sm:text-base group-hover:text-white">
          Total Revenue
        </div>
        <div className="text-2xl sm:text-3xl font-bold mb-1 text-[#3B82F6] dark:text-white group-hover:text-white">
          $127,450
        </div>
      </div>

      <div className="group bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:bg-gradient-to-r from-[#5EC9BD] to-[#2C7F75] transition">
        <div className="flex items-center justify-between mb-4">
          <div className=" bg-[#D022C4]/20 dark:bg-pink-900/30 p-3 rounded-lg group-hover:bg-white/20">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#D022C4] dark:text-pink-400 group-hover:text-white" />
          </div>
          <span className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 group-hover:bg-white/20 group-hover:text-white">
            +222
          </span>
        </div>
        <div className="text-[#999B9D] dark:text-gray-400 text-sm sm:text-base group-hover:text-white">
          Total Patients
        </div>
        <div className="text-2xl sm:text-3xl font-bold mb-1 text-[#D022C4] dark:text-white group-hover:text-white">
          2,847
        </div>
      </div>
    </div>
  )
}