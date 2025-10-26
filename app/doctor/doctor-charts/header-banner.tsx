"use client"

// HeaderBanner.tsx

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowRight, ChevronDown } from "lucide-react"

interface HeaderBannerProps {
  userName: string
  date: string
  onGoToAppointments: () => void // Added callback prop for navigation
}

export function HeaderBanner({ userName, date, onGoToAppointments }: HeaderBannerProps) {
  return (
    <>
      <div className="relative w-full overflow-hidden rounded-xl bg-[linear-gradient(94.25deg,_#1da68f_0%,_#27debf_100%)] p-6">
        <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
          <div className="text-white max-w-md">
            <h2 className="text-xl font-semibold mb-1">Welcome back, {userName}</h2>
            <p className="text-sm opacity-90 mb-4">Ready to make today productive?</p>
            <Button
              className="bg-white text-custom-dashboard-green-dark hover:bg-gray-100"
              onClick={onGoToAppointments} // Added click handler
            >
              Go to Appointments <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 md:mt-0 md:ml-6 w-40 h-24 md:w-[260px] md:h-[100px] shrink-0">
            <img src="/doctor-illustration.png" alt="Doctor" className="w-full h-full object-cover rounded-md" />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-4 z-20 relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-36 h-10 md:w-[150px] md:h-[40px] bg-white text-black border border-gray-300 pr-[13px] pl-[13px] gap-[15px] rounded-[12px]"
            >
              Last 7 Days <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
            <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
            <DropdownMenuItem>Last 90 Days</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
