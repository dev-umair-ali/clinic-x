"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { placeOfServiceCodes, validateNPI, validateICD10, validateCPT } from "@/lib/utils/billing-utils";
import { useToast } from "@/hooks/use-toast";
import { doctorBillingAPI } from "@/lib/api/billing";
import {
  ArrowLeft,
  Plus,
  X,
  Save,
  Search,
  AlertCircle,
  Info,
  Link as LinkIcon,
  User,
  Calendar,
  FileText,
  Building2,
  CreditCard,
  Stethoscope,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ChargeItem {
  id: string;
  cptCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  modifiers: string;
  diagnosisPointers: string;
}

interface Patient {
  id: string;
  name: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  insuranceProvider?: string;
  policyNumber?: string;
}

export default function CreateChargePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [charges, setCharges] = useState<ChargeItem[]>([]);
  const [patientSearchOpen, setPatientSearchOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const [currentDoctor, setCurrentDoctor] = useState<any>(null);
  
  const [newCharge, setNewCharge] = useState({
    cptCode: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
    modifiers: "",
    diagnosisPointers: "",
  });

  useEffect(() => {
    fetchPatients();
    fetchCurrentDoctor();
  }, []);

  const fetchCurrentDoctor = async () => {
    try {
      const token = localStorage.getItem('clinic-ai-token') || sessionStorage.getItem('clinic-ai-token');
      if (!token) {
        console.error('No token found for fetching doctor');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000';
      
      const doctorResponse = await fetch(`${baseUrl}/doctors/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!doctorResponse.ok) {
        console.error('Failed to fetch doctor profile:', doctorResponse.status);
        const errorText = await doctorResponse.text();
        console.error('Error details:', errorText);
        return;
      }

      const doctorData = await doctorResponse.json();
      console.log('Doctor profile data from /doctors/me:', doctorData);
      
      const doctor = doctorData.data?.user || doctorData.data?.profile || doctorData.data || doctorData;
      
      if (doctor) {
        setCurrentDoctor(doctor);
        
        const doctorId = doctor.id || doctor._id;
        console.log('Setting provider to doctor ID:', doctorId);
        console.log('Doctor name:', doctor.firstName, doctor.lastName);
        
        setFormData(prev => ({
          ...prev,
          provider: doctorId,
        }));
      } else {
        console.error('No doctor data found in response:', doctorData);
      }
    } catch (error) {
      console.error('Error fetching current doctor:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      const token = localStorage.getItem('clinic-ai-token') || sessionStorage.getItem('clinic-ai-token') || localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        });
        return;
      }

      const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000'}/doctors/patients?limit=100`;
      console.log('Fetching patients from:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to fetch patients');
      }

      const data = await response.json();
      console.log('Patients API response:', data);
      console.log('Data.data type:', Array.isArray(data.data) ? 'array' : typeof data.data);
      console.log('Data.data length:', data.data?.length);

      const patientsData = Array.isArray(data.data) ? data.data : [];
      
      const transformedPatients = patientsData.map((p: any) => ({
        id: p.id || p._id,
        name: `${p.firstName || ''} ${p.lastName || ''}`.trim(),
        dob: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split('T')[0] : 'N/A',
        email: p.email || 'N/A',
        phone: p.phone || 'N/A',
        address: p.address || 'N/A',
        insuranceProvider: p.insuranceInfo || p.insuranceProvide || undefined,
        policyNumber: p.policyNumber || undefined,
      }));

      console.log('Setting patients:', transformedPatients.length, 'patients');
      setPatients(transformedPatients);

      if (transformedPatients.length === 0) {
        toast({
          title: "No Patients Found",
          description: "No patients are assigned to you yet. Please contact your administrator.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load patients. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoadingPatients(false);
    }
  };

  const filteredPatients = useMemo(() => {
    if (!patientSearch) return patients;
    const searchLower = patientSearch.toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.id.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower)
    );
  }, [patients, patientSearch]);

  const commonCPTCodes = [
    { code: "99213", description: "Office visit, established patient, level 3", price: 150 },
    { code: "99214", description: "Office visit, established patient, level 4", price: 220 },
    { code: "99215", description: "Office visit, established patient, level 5", price: 310 },
    { code: "99203", description: "Office visit, new patient, level 3", price: 180 },
    { code: "99204", description: "Office visit, new patient, level 4", price: 250 },
    { code: "81002", description: "Urinalysis, non-automated", price: 15 },
    { code: "87086", description: "Urine culture, bacterial", price: 25 },
    { code: "36415", description: "Venipuncture", price: 10 },
    { code: "85025", description: "Complete blood count with differential", price: 35 },
    { code: "80053", description: "Comprehensive metabolic panel", price: 45 },
  ];

  const [formData, setFormData] = useState({
    dateOfService: new Date().toISOString().split("T")[0],
    provider: "",
    facility: "",
    placeOfService: "",
    renderingProviderNPI: "",
    billingProviderNPI: "",
    referringPhysicianNPI: "",
    insuranceProvider: "",
    policyNumber: "",
    groupNumber: "",
    subscriberName: "",
    diagnosisCodes: Array(12).fill(""),
    notes: "",
  });

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData(prev => ({
      ...prev,
      insuranceProvider: patient.insuranceProvider || "",
      policyNumber: patient.policyNumber || "",
      subscriberName: patient.name,
    }));
    setPatientSearchOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCPTSelect = (cpt: typeof commonCPTCodes[0]) => {
    setNewCharge({
      cptCode: cpt.code,
      description: cpt.description,
      quantity: 1,
      unitPrice: cpt.price,
      modifiers: "",
      diagnosisPointers: "",
    });
  };

  const handleAddCharge = () => {
    if (newCharge.cptCode && newCharge.description && newCharge.unitPrice > 0) {
      const charge: ChargeItem = {
        id: `CHG-${Date.now()}`,
        cptCode: newCharge.cptCode,
        description: newCharge.description,
        quantity: newCharge.quantity,
        unitPrice: newCharge.unitPrice,
        total: newCharge.quantity * newCharge.unitPrice,
        modifiers: newCharge.modifiers,
        diagnosisPointers: newCharge.diagnosisPointers,
      };
      setCharges([...charges, charge]);
      setNewCharge({
        cptCode: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        modifiers: "",
        diagnosisPointers: "",
      });
    }
  };

  const handleRemoveCharge = (id: string) => {
    setCharges(charges.filter((charge) => charge.id !== id));
  };

  const subtotal = charges.reduce((sum, charge) => sum + charge.total, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      toast({
        title: "Validation Error",
        description: "Please select a patient",
        variant: "destructive",
      });
      return;
    }

    if (charges.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one charge item",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const chargeData = {
        patientId: selectedPatient.id,
        serviceDate: formData.dateOfService,
        visitType: "Office Visit",
        placeOfService: formData.placeOfService || "Office",
        items: charges.map(charge => ({
          cptCode: charge.cptCode,
          description: charge.description,
          quantity: charge.quantity,
          unitPrice: charge.unitPrice,
          totalPrice: charge.total,
          modifiers: charge.modifiers ? charge.modifiers.split(',').map(m => m.trim()) : [],
          diagnosisCodes: charge.diagnosisPointers ? charge.diagnosisPointers.split(',').map(d => d.trim()) : formData.diagnosisCodes.filter(d => d),
          placeOfService: formData.placeOfService || "Office",
          dateOfService: formData.dateOfService,
        })),
        insuranceInfo: formData.insuranceProvider ? {
          providerName: formData.insuranceProvider,
          policyNumber: formData.policyNumber,
          groupNumber: formData.groupNumber,
          subscriberName: formData.subscriberName || selectedPatient.name,
          coverageLevel: 'primary' as const,
        } : undefined,
        notes: formData.notes,
      };

      console.log("Submitting charge data:", chargeData);

      const result = await doctorBillingAPI.createCharge(chargeData);

      if (result.success) {
        toast({
          title: "Success",
          description: "Charge created successfully",
        });
        router.push("/doctor/patients-billing");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create charge",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating charge:", error);
      toast({
        title: "Error",
        description: "Failed to create charge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Create New Charge
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Add service charges and billing information
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center py-20">
              <p className="text-gray-500">BACKUP FILE - Original Create Charge Page</p>
              <p className="text-sm text-gray-400 mt-2">This file is a backup. Please use the main page.tsx file.</p>
            </div>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
