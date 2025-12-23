"use client";
import { useEffect, useState } from "react";
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
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (viewMode === "calendar") {
      fetchCalendar();
    } else {
      fetchList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter, currentPage, viewMode]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (viewMode === "list") {
        fetchList();
      }
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, viewMode]);

  const fetchList = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page: currentPage, limit: pageLimit };
      if (searchQuery?.trim()) params.patientName = searchQuery.trim();

      if (selectedFilter === "Canceled") {
        const res = await appointmentService.getDoctorAppointmentsByStatus("cancelled");
        if (res?.success && res.data) {
          setAppointments(Array.isArray(res.data) ? res.data : []);
          setTotalPages(1);
        } else {
          setAppointments([]);
          setTotalPages(1);
        }
        return;
      } else if (selectedFilter === "Upcoming") {
        params.status = "scheduled";
      }

      const res = await appointmentService.getDoctorAppointments(params);
      if (res?.success) {
        setAppointments(Array.isArray(res.data) ? res.data : []);
        if (res.total !== undefined && res.limit) {
          setTotalPages(Math.ceil(res.total / res.limit));
        } else setTotalPages(1);
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

  const fetchCalendar = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await appointmentService.getDoctorAppointmentsCalendar();
      if (res?.success && res.data) {
        setAppointments(Array.isArray(res.data) ? res.data : []);
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

  const fetchAppointmentListView = async (doctorId: string) => {
    if (!doctorId) return;
    try {
      const res = await appointmentService.getDoctorAppointmentListView(doctorId);
      if (res?.success && res.data) {
        setAppointments(Array.isArray(res.data) ? res.data : []);
        if (res.total !== undefined && res.limit) {
          setTotalPages(Math.ceil(res.total / res.limit));
        } else setTotalPages(1);
      } else {
        fetchList();
      }
    } catch (e) {
      fetchList();
    }
  };

  const fetchPatientDetails = async (appointmentId: string) => {
    if (!appointmentId) throw new Error("Invalid appointment ID");
    const res = await appointmentService.getDoctorAppointmentDetails(appointmentId);
    if (res?.success && res.data?.patient) return res.data.patient;
    throw new Error(res?.message || "Patient details not found");
  };

  const updateStatus = async (id: string, status: string) => {
    if (!id) throw new Error("Invalid appointment ID");
    if (!["scheduled", "completed", "cancelled"].includes(status)) throw new Error("Invalid status");
    const res = await appointmentService.updateDoctorAppointmentStatus(id, status);
    if (res?.success) return;
    throw new Error(res?.message || "Failed to update appointment status");
  };

  const createAppointment = async (data: CreateAppointmentRequest) => {
    if (!data.doctor || !data.patient || !data.dateTime) throw new Error("Missing required fields");
    const res = await appointmentService.createAppointment(data);
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
    fetchAppointmentListView,
    fetchPatientDetails,
    updateStatus,
    createAppointment,
    updateAppointment,
  };
}