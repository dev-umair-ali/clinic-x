"use client";
import { useEffect, useState } from "react";

export default function useStats(appointments: any[]) {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcoming: 0,
    nextAppointment: "None",
  });

  useEffect(() => {
    calculateStats();
  }, [appointments]);

  const calculateStats = () => {
    const total = appointments.length;
    
    // Count upcoming appointments (scheduled status)
    const upcomingCount = appointments.filter(
      (a) => a.status === "scheduled" && new Date(a.dateTime) >= new Date()
    ).length;
    
    // Find next appointment
    const upcoming = appointments
      .filter((a) => a.status === "scheduled" && new Date(a.dateTime) >= new Date())
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0];
    
    let nextAppointmentStr = "None";
    if (upcoming) {
      const d = new Date(upcoming.dateTime);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const aptDate = new Date(d);
      aptDate.setHours(0, 0, 0, 0);
      
      if (aptDate.getTime() === today.getTime()) {
        nextAppointmentStr = `Today at ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
      } else {
        nextAppointmentStr = `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
      }
    }
    
    setStats({
      totalAppointments: total,
      upcoming: upcomingCount,
      nextAppointment: nextAppointmentStr,
    });
  };

  return stats;
}