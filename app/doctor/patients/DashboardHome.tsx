"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import { fetchDoctorPatients, deleteDoctorPatient } from "@/lib/slices/doctorPatientSlice";
import Cards from "@/app/doctor/patients/Cards";
import { MainTable } from "@/components/ui/MainTable";
import { useRouter } from "next/navigation";
import {
  PencilSquareIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import SearchBar from "@/app/doctor/patients/SearchBar";
import PatientStatusProgress from "@/app/doctor/patients/PatientStatusProgress";
import { toast } from "sonner";


const columns = [
  {
    header: "Name",
    accessor: (row: any) => (
      <div className="flex items-center gap-2">
        <img
          alt="User avatar"
          src={row.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"}
          className="w-6 h-6 rounded-full bg-muted"
        />
        <span className="font-medium text-foreground">{row.fullName || `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'Unknown Patient'}</span>
      </div>
    ),
  },
  {
    header: "Age/Gender",
    accessor: (row: any) => (
      <span className="text-foreground">{`${row.age}/${row.gender}`}</span>
    ),
  },
  {
    header: "Email",
    accessor: (row: any) => (
      <span className="text-foreground text-sm">{row.email}</span>
    ),
  },
  {
    header: "Phone",
    accessor: (row: any) => (
      <span className="text-foreground text-sm">{row.phone}</span>
    ),
  },
  {
    header: "Status",
    accessor: (row: any) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        row.status === 'active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {row.status}
      </span>
    ),
  },
  // {
  //   header: "Last Visit",
  //   accessor: (row: any) => (
  //     <span className="text-foreground">
  //       {row.lastVisit ? new Date(row.lastVisit).toLocaleDateString() : "N/A"}
  //     </span>
  //   ),
  // },
];

const DashboardHome = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { patients, loading } = useSelector((state: RootState) => state.doctorPatients);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Ensure patients is always an array
  const safePatients = Array.isArray(patients) ? patients : [];

  // Fetch patients on component mount
  useEffect(() => {
    dispatch(fetchDoctorPatients());
  }, [dispatch]);
  
  const filteredPatients = safePatients.filter((p) => {
    if (!p) return false; // Skip null/undefined patients
    
    const searchTerm = search.toLowerCase();
    return (
      p.fullName?.toLowerCase().includes(searchTerm) || 
      p.firstName?.toLowerCase().includes(searchTerm) ||
      p.lastName?.toLowerCase().includes(searchTerm) ||
      p.email?.toLowerCase().includes(searchTerm)
    );
  });

  const handleDeletePatient = async (patientId: string) => {
    try {
      await dispatch(deleteDoctorPatient(patientId)).unwrap();
      toast.success("Patient deleted successfully!");
    } catch (error: any) {
      console.error('Error deleting patient:', error);
      toast.error("Failed to delete patient. Please try again.");
    }
  };

  const patientActions = [
    {
      label: "Edit Patient",
      icon: PencilSquareIcon,
      onClick: (row: any) => {
        router.push(`/doctor/patients/edit/${row._id}`);
      },
    },
    {
      label: "Add Notes",
      icon: PencilSquareIcon,
      onClick: (row: any) => {
        const query = new URLSearchParams({
          id: row._id,
          name: row.fullName || `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'Unknown Patient',
          age: row.age?.toString() || '0',
          gender: row.gender || 'unknown',
          lastVisit: row.lastVisit || '',
          step: "1", // Notes step
        }).toString();
        router.push(`/doctor/patients/procedure/${row._id}?${query}`);
      },
    },
    {
      label: "Write Prescription",
      icon: DocumentTextIcon,
      onClick: (row: any) => {
        const query = new URLSearchParams({
          id: row._id,
          name: row.fullName || `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'Unknown Patient',
          age: row.age?.toString() || '0',
          gender: row.gender || 'unknown',
          lastVisit: row.lastVisit || '',
          step: "2", // Prescription step
        }).toString();
        router.push(`/doctor/patients/procedure/${row._id}?${query}`);
      },
    },
    {
      label: "Add Bill",
      icon: CurrencyDollarIcon,
      onClick: (row: any) => {
        const query = new URLSearchParams({
          id: row._id,
          name: row.fullName || `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'Unknown Patient',
          age: row.age?.toString() || '0',
          gender: row.gender || 'unknown',
          lastVisit: row.lastVisit || '',
          step: "3", // Billing step
        }).toString();
        router.push(`/doctor/patients/procedure/${row._id}?${query}`);
      },
    },
    {
      label: "Manage Appointment",
      icon: CalendarIcon,
      onClick: (row: any) => {
        const query = new URLSearchParams({
          id: row._id,
          name: row.fullName || `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'Unknown Patient',
          age: row.age?.toString() || '0',
          gender: row.gender || 'unknown',
          lastVisit: row.lastVisit || '',
          step: "0", // Appointments step
        }).toString();
        router.push(`/doctor/patients/procedure/${row._id}?${query}`);
      },
    },
    {
      label: "View Profile",
      icon: UserCircleIcon,
      onClick: (row: any) => {
        const query = new URLSearchParams({
          id: row._id,
          name: row.fullName || `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'Unknown Patient',
          age: row.age?.toString() || '0',
          gender: row.gender || 'unknown',
          lastVisit: row.lastVisit || '',
        }).toString();
        router.push(`/doctor/patients/profile/${row._id}?${query}`);
      },
    },
    {
      label: "Delete Patient",
      icon: PencilSquareIcon,
      onClick: (row: any) => {
        if (window.confirm(`Are you sure you want to delete ${row.fullName || `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'Unknown Patient'}?`)) {
          handleDeletePatient(row._id);
        }
      },
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 bg-background text-foreground">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1DA68F] mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading patients...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-background text-foreground">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Patient Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            View, track, and manage all your Patients.
          </p>
        </div>
        <button
          onClick={() => router.push('/doctor/patients/add')}
          className="px-4 py-2 bg-[#1DA68F] min-w-[130px] text-white rounded hover:bg-[#1DA68F]/70 flex justify-center items-center gap-2 font-bold text-sm transition-colors"
        >
          + Add Patient
        </button>
      </div>

      <Cards />

      <div className="flex items-center justify-between flex-wrap gap-4 mt-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div className="mt-8 border rounded-lg border-border bg-card w-full">
        {/* <p className="text-lg font-semibold p-4 text-foreground">
          Patient List ({filteredPatients.length} patients)
        </p> */}
        {filteredPatients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No patients found.</p>
            <p className="text-sm mt-1">Add your first patient to get started.</p>
          </div>
        ) : (
          <MainTable
            columns={columns}
            data={filteredPatients}
            actions={patientActions}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
