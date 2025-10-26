'use client'

import React, { useState } from "react";
import {
  UsersIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { useMainProvider } from "./context/Globalcontext";
import Image from "next/image";

interface DoctorDashboardStats {
  totalPatients?: number;
  appointmentsThisWeek?: number;
  appointmentsDueToday?: number;
  [key: string]: any;
}

interface StatConfig {
  id: number;
  name: string;
  icon: React.ElementType;
  field: keyof DoctorDashboardStats;
  subheading: string;
  color: string;
  bg: string;
  valueFormat: (val: any) => string | number;
  percent: string;
  image: string;
}

const statsConfig: StatConfig[] = [
  {
    id: 1,
    name: "Total Patients",
    icon: UsersIcon,
    field: "totalPatients",
    subheading: "All patients you've attended",
    color: "text-[#85A7A0]",
    bg: "bg-[#85A7A0]/20",
    valueFormat: (val: number) => val ?? "800K",
    percent: "+20%",
    image: "/assets/icons/graph1.png"
  },
  {
    id: 2,
    name: "Appointments This Week",
    icon: CalendarIcon,
    field: "appointmentsThisWeek",
    subheading: "Scheduled appointments for this week",
    color: "text-[#85A7A0]",
    bg: "bg-[#85A7A0]/20",
    valueFormat: (val: number) => val ?? "160",
    percent: "-12%",
    image: "/assets/icons/graph2.png"
  },
  {
    id: 3,
    name: "Follow-Ups Due",
    icon: UserIcon,
    field: "appointmentsDueToday",
    subheading: "How many are scheduled today",
    color: "text-[#85A7A0]",
    bg: "bg-[#85A7A0]/20",
    valueFormat: (val: number) => val ?? "42",
    percent: "",
    image: ""
  },
];

export default function DoctorStatsCards() {
  const { doctorScheduleTimes } = useMainProvider() as {
    doctorScheduleTimes: DoctorDashboardStats
  }

  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <dl className="mt-5 flex gap-6 w-full flex-wrap lg:flex-nowrap">
      {statsConfig.map((item, index) => {
        const value = item.valueFormat(doctorScheduleTimes?.[item.field]);
        const Icon = item.icon;
        const isActive = index === activeIndex;

        return (
          <div
            key={item.id}
            onClick={() => setActiveIndex(index)}
            className={`
              relative w-full sm:w-1/2 lg:w-1/3 cursor-pointer overflow-hidden rounded-2xl 
              px-4 pt-5 shadow-xs sm:px-6 sm:pt-6 flex flex-col gap-2 border 
              transition-all duration-200
              ${isActive
                ? "bg-gradient-to-r from-[#126A5C] to-[#1DA68F] text-white border-transparent"
                : "bg-white dark:bg-gray-800 text-black dark:text-white border-gray-200 dark:border-gray-700 hover:bg-gradient-to-r hover:from-[#126A5C] hover:to-[#1DA68F] hover:text-white group"
              }
            `}
          >
            <div className="flex w-full justify-between items-center">
              <div className={`rounded-full ${item.bg} p-3 w-12 transition-colors duration-200 ${isActive ? "bg-white/20" : "group-hover:bg-white/20"}`}>
                <Icon
                  aria-hidden="true"
                  className={`size-6 ${item.color} ${isActive ? "text-white" : "group-hover:text-white"}`}
                />
              </div>
              {item.percent && (
                <div
                  className={`rounded-full ${item.bg} py-1 px-2 transition-colors duration-200 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "group-hover:bg-white/20 group-hover:text-white text-gray-900 dark:text-gray-200 text-[10px]"
                  }`}
                >
                  {item.percent}
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              <div>
                <p
                  className={`text-3xl font-semibold ${
                    isActive ? "text-white" : "text-gray-900 dark:text-gray-100"
                  } group-hover:text-white`}
                >
                  {value}
                </p>
                <p
                  className={`truncate text-xs font-medium ${
                    isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
                  } group-hover:text-white`}
                >
                  {item.name}
                </p>
              </div>
              {item.image && (
                <Image src={item.image} alt="graph" width={80} height={20} />
              )}
            </div>
          </div>
        )
      })}
    </dl>
  )
}
