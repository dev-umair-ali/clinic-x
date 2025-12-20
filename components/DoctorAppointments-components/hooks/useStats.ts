"use client";
import { useEffect, useState } from "react";
import { appointmentService } from "@/lib/api/services/appointmentService";

export default function useStats(appointments: any[]) {
  const [stats, setStats] = useState({
    hoursAvailable: "0",
    appointmentsBooked: "0",
    nextAvailableSlot: "N/A",
  });

  useEffect(() => {
    fetchWeeklyCount();
  }, []);

  useEffect(() => {
    const upcoming = appointments
      .filter((a) => a.status === "scheduled")
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())[0];
    if (upcoming) {
      const d = new Date(upcoming.dateTime);
      const today = new Date();
      const slot = d.toDateString() === today.toDateString()
        ? `Today ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`
        : `${d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
      setStats((s) => ({ ...s, nextAvailableSlot: slot }));
    } else {
      setStats((s) => ({ ...s, nextAvailableSlot: "N/A" }));
    }
  }, [appointments]);

  const fetchWeeklyCount = async () => {
    try {
      const res = await appointmentService.getDoctorWeeklyCount();
      if (res?.success && typeof res.data?.count === "number") {
        setStats((s) => ({ ...s, appointmentsBooked: res.data.count.toString() }));
      }
    } catch (e) {
      // keep default
    }
  };

  return stats;
}