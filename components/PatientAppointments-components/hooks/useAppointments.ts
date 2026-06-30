"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import {
  appointmentService,
  DoctorAppointment,
  CreateAppointmentRequest,
} from "@/lib/api/services/appointmentService";

export default function useAppointments(
  viewMode: "calendar" | "list",
  selectedFilter: string,
  searchQuery: string,
  currentPage: number,
  pageLimit: number
) {
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const role = authUser?.role;

  // Get user ID - for patients, prefer patientId over user id
  const userId = authUser?.patientId;

  useEffect(() => {
    // Only auto-fetch for list view - calendar view is fetched manually with date range
    if (viewMode === "list" && userId) {
      fetchList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, currentPage, viewMode, userId]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (viewMode === "list" && userId) {
        fetchList();
      }
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, viewMode, userId]);

  const fetchList = async () => {

    setLoading(true);
    setError(null);
    try {
      const res = await appointmentService.getPatientAppointments(role || "", userId ?? "");

      if (res?.success && res.appointments) {
        let appts = Array.isArray(res.appointments) ? res.appointments : [];

        if (searchQuery?.trim()) {
          const query = searchQuery.toLowerCase();
          appts = appts.filter((apt: any) => {
            const doctorName = apt.doctorName ||
              (typeof apt.doctor === 'object' ? apt.doctor?.name : '') || '';
            return doctorName.toLowerCase().includes(query);
          });
        }

        setAppointments(appts);
        setTotalPages(1);
      } else {
        setAppointments([]);
        setError(res?.message || "No appointments found");
      }
    } catch (e: any) {
      const msg = e.message || e.response?.data?.message || "Failed to fetch appointments";
      setError(msg);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendar = async (startDate?: string, endDate?: string) => {
    setLoading(true);
    setError(null);
    try {
      // For patient calendar, we still fetch all their appointments and filter by date
      const res = await appointmentService.getPatientAppointments(role || "", userId ?? "");

      if (res?.success && res?.appointments) {
        let appts = Array.isArray(res.appointments) ? res.appointments : [];

        // Filter by date range if provided
        if (startDate && endDate) {
          appts = appts.filter((apt: any) => {
            const aptDate = apt.dateTime ? new Date(apt.dateTime).toISOString().split('T')[0] : apt.date;
            return aptDate >= startDate && aptDate <= endDate;
          });
        }

        setAppointments(appts);
      } else {
        setAppointments([]);
        setError(res?.message || "No calendar appointments found");
      }
    } catch (e: any) {
      const msg = e.message || e.response?.data?.message || "Failed to fetch calendar appointments";
      setError(msg);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorDetails = async (appointmentId: string) => {
    if (!appointmentId) throw new Error("Invalid appointment ID");
    const res = await appointmentService.getPatientAppointmentDetails(appointmentId);
    if (res?.success && res.data?.doctor) return res.data.doctor;
    throw new Error(res?.message || "Doctor details not found");
  };

  const updateStatus = async (id: string, status: string) => {
    if (!id) throw new Error("Invalid appointment ID");
    if (status === "cancelled") {
      // Patients can only cancel appointments
      const res = await appointmentService.cancelPatientAppointment(id);
      if (res?.success) return;
      throw new Error(res?.message || "Failed to cancel appointment");
    }
    throw new Error("Patients can only cancel appointments");
  };

  const createAppointment = async (data: CreateAppointmentRequest) => {
    if (!data.doctorRef || !data.patientRef || !data.date || !data.time) throw new Error("Missing required fields");
    const res = await appointmentService.createAppointment(role || "", data);
    if (res?.success) return;
    throw new Error(res?.message || "Failed to create appointment");
  };

  const updateAppointment = async (id: string, data: { dateTime: string }) => {
    if (!id) throw new Error("Invalid appointment ID");
    const res = await appointmentService.updateAppointment(id, data);
    if (res?.success) return;
    throw new Error(res?.message || "Failed to update appointment");
  };

  return {
    appointments,
    loading,
    error,
    totalPages,
    fetchList,
    fetchCalendar,
    fetchDoctorDetails,
    updateStatus,
    createAppointment,
    updateAppointment,
  };
}