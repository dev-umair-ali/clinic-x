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

export default function EditChargePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [charges, setCharges] = useState<ChargeItem[]>([]);
  const [patientSearchOpen, setPatientSearchOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const [amountPaid, setAmountPaid] = useState(0); // Track payments made on original charge
  
  const [newCharge, setNewCharge] = useState({
    cptCode: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
    modifiers: "",
    diagnosisPointers: "",
  });

  // Fetch patients and existing charge data
  useEffect(() => {
    fetchPatients();
    fetchExistingCharge();
  }, [params.id]);

  const fetchExistingCharge = async () => {
    try {
      setLoading(true);
      const result = await doctorBillingAPI.getCharge(params.id);

      if (result.success && result.data) {
        const charge = result.data;
        
        // Store amount paid for balance calculation
        setAmountPaid(charge.amountPaid || 0);
        
        // Set patient
        if (charge.patientId) {
          const patient = {
            id: typeof charge.patientId === 'object' ? charge.patientId._id : charge.patientId,
            name: typeof charge.patientId === 'object' ? `${charge.patientId.firstName} ${charge.patientId.lastName}` : '',
            dob: typeof charge.patientId === 'object' ? charge.patientId.dateOfBirth : '',
            email: typeof charge.patientId === 'object' ? charge.patientId.email : '',
            phone: typeof charge.patientId === 'object' ? charge.patientId.phone : '',
            address: typeof charge.patientId === 'object' ? charge.patientId.address : '',
            insuranceProvider: typeof charge.patientId === 'object' ? charge.patientId.insuranceProvider : '',
            policyNumber: typeof charge.patientId === 'object' ? charge.patientId.policyNumber : '',
          };
          setSelectedPatient(patient);
          
          // Update form data with patient insurance info and charge data
          setFormData({
            dateOfService: charge.serviceDate ? new Date(charge.serviceDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            provider: "",
            facility: "",
            placeOfService: charge.items[0]?.placeOfService || "",
            renderingProviderNPI: "",
            billingProviderNPI: "",
            referringPhysicianNPI: "",
            insuranceProvider: charge.insuranceInfo?.providerName || patient.insuranceProvider || "",
            policyNumber: charge.insuranceInfo?.policyNumber || patient.policyNumber || "",
            groupNumber: charge.insuranceInfo?.groupNumber || "",
            subscriberName: charge.insuranceInfo?.subscriberName || patient.name,
            diagnosisCodes: Array(12).fill(""),
            notes: charge.notes || "",
          });
        }

        // Set charges/items
        const chargeItems = charge.items.map((item: any, index: number) => ({
          id: `charge-${index}`,
          cptCode: item.cptCode,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.totalPrice,
          modifiers: item.modifiers?.join(', ') || '',
          diagnosisPointers: item.diagnosisCodes?.join(', ') || '',
        }));
        setCharges(chargeItems);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch charge",
          variant: "destructive",
        });
        router.push("/doctor/patients-billing");
      }
    } catch (error) {
      console.error('Error fetching charge:', error);
      toast({
        title: "Error",
        description: "Failed to load charge data",
        variant: "destructive",
      });
      router.push("/doctor/patients-billing");
    } finally {
      setLoading(false);
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
      
      // Transform patients to match interface
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

  // Filter patients based on search
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

  // Common CPT codes for quick selection
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
    diagnosisCodes: Array(12).fill(""), // 12 diagnosis codes
    notes: "",
  });

  // Handle patient selection
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
  const balanceDue = subtotal - amountPaid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
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
      setSubmitting(true); // Set submitting to true
      
      // Don't send doctorId - let backend assign it from the authenticated user's token
      // This avoids ID mismatch between JWT userId (UUID) and MongoDB ObjectId
      
      // Prepare charge data according to backend API
      const chargeData = {
        patientId: selectedPatient.id,
        serviceDate: formData.dateOfService,
        visitType: "Office Visit", // You can add this to formData if needed
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

      // Call the billing API to update charge
      const result = await doctorBillingAPI.updateCharge(params.id, chargeData);

      if (result.success) {
        toast({
          title: "Success",
          description: "Charge updated successfully",
        });
        // Navigate back to billing page or charge details
        router.push(`/doctor/patients-billing/${params.id}`);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update charge",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating charge:", error);
      toast({
        title: "Error",
        description: "Failed to update charge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false); // Reset submitting state
    }
  };

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-[#1DA68F]" />
        </div>
      ) : (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
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
                    Edit Charge
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Update service charges and billing information
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Patient Information - Enhanced with Search */}
                <Card className="border-2 border-[#1DA68F]/20">
                  <CardHeader className="bg-gradient-to-r from-[#1DA68F]/5 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#1DA68F]/10 rounded-lg">
                        <User className="w-5 h-5 text-[#1DA68F]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Patient Information</CardTitle>
                        <CardDescription>
                          Search and select patient from onboarded records
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    {/* Patient Search */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Search Patient *</Label>
                      <Popover open={patientSearchOpen} onOpenChange={setPatientSearchOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={patientSearchOpen}
                            className="w-full justify-between h-11 text-left font-normal hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            {selectedPatient ? (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-[#1DA68F]" />
                                <span className="font-medium">{selectedPatient.name}</span>
                                <span className="text-gray-500">({selectedPatient.id})</span>
                              </div>
                            ) : (
                              <span className="text-gray-500">Search by name or patient ID...</span>
                            )}
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[600px] p-0" align="start">
                          <Command>
                            <CommandInput 
                              placeholder="Search patients by name or ID..." 
                              value={patientSearch}
                              onValueChange={setPatientSearch}
                            />
                            <CommandList>
                              {loadingPatients ? (
                                <div className="flex items-center justify-center p-8">
                                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                </div>
                              ) : filteredPatients.length === 0 ? (
                                <CommandEmpty>No patient found.</CommandEmpty>
                              ) : (
                                <CommandGroup heading="Patients">
                                  {filteredPatients.map((patient) => (
                                    <CommandItem
                                      key={patient.id}
                                      value={`${patient.name} ${patient.id}`}
                                      onSelect={() => handlePatientSelect(patient)}
                                      className="cursor-pointer"
                                    >
                                      <div className="flex items-start justify-between w-full py-2">
                                        <div className="flex items-start gap-3">
                                          <div className="p-2 bg-[#1DA68F]/10 rounded-lg">
                                            <User className="w-4 h-4 text-[#1DA68F]" />
                                          </div>
                                          <div>
                                            <p className="font-semibold text-sm">{patient.name}</p>
                                            <p className="text-xs text-gray-500">ID: {patient.id}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                              DOB: {patient.dob !== 'N/A' ? new Date(patient.dob).toLocaleDateString() : 'N/A'} | {patient.phone}
                                            </p>
                                          </div>
                                        </div>
                                        {selectedPatient?.id === patient.id && (
                                          <CheckCircle2 className="w-5 h-5 text-[#1DA68F]" />
                                        )}
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Selected Patient Details */}
                    {selectedPatient && (
                      <div className="bg-[#1DA68F]/5 border border-[#1DA68F]/20 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#1DA68F]" />
                            Patient Selected
                          </h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPatient(null)}
                            className="h-7 text-xs"
                          >
                            Change Patient
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">Patient Name</p>
                            <p className="font-medium">{selectedPatient.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Patient ID</p>
                            <p className="font-medium font-mono">{selectedPatient.id}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Date of Birth</p>
                            <p className="font-medium">{new Date(selectedPatient.dob).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Phone</p>
                            <p className="font-medium">{selectedPatient.phone}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-gray-500 text-xs">Address</p>
                            <p className="font-medium text-sm">{selectedPatient.address}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Insurance Information - Moved after Patient */}
                {selectedPatient && (
                  <Card className="border-2 border-blue-500/20">
                    <CardHeader className="bg-gradient-to-r from-blue-500/5 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Insurance Information</CardTitle>
                          <CardDescription>
                            Verify and update insurance details for claim submission
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="insuranceProvider">Insurance Provider *</Label>
                          <Select 
                            name="insuranceProvider" 
                            value={formData.insuranceProvider}
                            onValueChange={(value) => setFormData({ ...formData, insuranceProvider: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bcbs">Blue Cross Blue Shield</SelectItem>
                              <SelectItem value="uhc">United Healthcare</SelectItem>
                              <SelectItem value="aetna">Aetna</SelectItem>
                              <SelectItem value="cigna">Cigna</SelectItem>
                              <SelectItem value="medicare">Medicare</SelectItem>
                              <SelectItem value="medicaid">Medicaid</SelectItem>
                              <SelectItem value="humana">Humana</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="policyNumber">Policy Number *</Label>
                          <Input
                            id="policyNumber"
                            name="policyNumber"
                            value={formData.policyNumber}
                            onChange={handleInputChange}
                            placeholder="Policy number"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="groupNumber">Group Number</Label>
                          <Input
                            id="groupNumber"
                            name="groupNumber"
                            value={formData.groupNumber}
                            onChange={handleInputChange}
                            placeholder="Group number (optional)"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subscriberName">Subscriber Name</Label>
                          <Input
                            id="subscriberName"
                            name="subscriberName"
                            value={formData.subscriberName}
                            onChange={handleInputChange}
                            placeholder="Subscriber name"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Service Details - Now comes after Insurance */}
                {selectedPatient && (
                  <Card className="border-2 border-purple-500/20">
                    <CardHeader className="bg-gradient-to-r from-purple-500/5 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <Stethoscope className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Service Details</CardTitle>
                          <CardDescription>
                            Provide service date, location, and provider information
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfService" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          Date of Service *
                        </Label>
                        <Input
                          id="dateOfService"
                          name="dateOfService"
                          type="date"
                          value={formData.dateOfService}
                          onChange={handleInputChange}
                          required
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="placeOfService">Place of Service *</Label>
                        <Select 
                          name="placeOfService" 
                          value={formData.placeOfService}
                          onValueChange={(value) => setFormData({ ...formData, placeOfService: value })}
                          required
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select place of service" />
                          </SelectTrigger>
                          <SelectContent className="max-h-64 overflow-y-auto">
                            {placeOfServiceCodes.slice(0, 15).map((pos) => (
                              <SelectItem key={pos.code} value={pos.code}>
                                {pos.code} - {pos.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="provider">Attending Provider *</Label>
                        <Select name="provider" required>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dr-johnson">Dr. Sarah Johnson</SelectItem>
                            <SelectItem value="dr-smith">Dr. Michael Smith</SelectItem>
                            <SelectItem value="dr-williams">Dr. Emily Williams</SelectItem>
                            <SelectItem value="dr-davis">Dr. Robert Davis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="facility">Facility</Label>
                        <Select name="facility">
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select facility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="main">ClinicX Medical Center</SelectItem>
                            <SelectItem value="north">North Branch Clinic</SelectItem>
                            <SelectItem value="south">South Branch Clinic</SelectItem>
                            <SelectItem value="east">East Side Medical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Provider NPIs */}
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-600" />
                        National Provider Identifiers (NPI)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="renderingProviderNPI">Rendering Provider NPI *</Label>
                          <Input
                            id="renderingProviderNPI"
                            name="renderingProviderNPI"
                            value={formData.renderingProviderNPI}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (value.length <= 10) {
                                setFormData({ ...formData, renderingProviderNPI: value });
                              }
                            }}
                            placeholder="1234567890"
                            maxLength={10}
                            required
                            className={
                              formData.renderingProviderNPI &&
                              !validateNPI(formData.renderingProviderNPI)
                                ? "border-red-500"
                                : formData.renderingProviderNPI && validateNPI(formData.renderingProviderNPI)
                                ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                                : ""
                            }
                          />
                          {formData.renderingProviderNPI &&
                            !validateNPI(formData.renderingProviderNPI) && (
                              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                NPI must be exactly 10 digits
                              </p>
                            )}
                          {formData.renderingProviderNPI && validateNPI(formData.renderingProviderNPI) && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                              ✓ Valid
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingProviderNPI">Billing Provider NPI</Label>
                          <Input
                            id="billingProviderNPI"
                            name="billingProviderNPI"
                            value={formData.billingProviderNPI}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (value.length <= 10) {
                                setFormData({ ...formData, billingProviderNPI: value });
                              }
                            }}
                            placeholder="Optional"
                            maxLength={10}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="referringPhysicianNPI">Referring Physician NPI</Label>
                          <Input
                            id="referringPhysicianNPI"
                            name="referringPhysicianNPI"
                            value={formData.referringPhysicianNPI}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              if (value.length <= 10) {
                                setFormData({ ...formData, referringPhysicianNPI: value });
                              }
                            }}
                            placeholder="Optional"
                            maxLength={10}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  </Card>
                )}

                {/* Diagnosis Codes - MOVED BEFORE CHARGES */}
                {selectedPatient && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Diagnosis Codes (ICD-10)</CardTitle>
                        <CardDescription>
                          Enter primary and secondary diagnosis codes - Required for service charges
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        CMS-1500 Standard
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          <p className="font-medium">ICD-10 Format Guide:</p>
                          <p className="text-xs mt-1">Enter codes in format: Letter + 2 digits + optional decimal + 1-4 digits (e.g., Z00.00, J45.909)</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {formData.diagnosisCodes.map((code, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <Input
                              value={code}
                              onChange={(e) => {
                                const newCodes = [...formData.diagnosisCodes];
                                newCodes[index] = e.target.value.toUpperCase();
                                setFormData({ ...formData, diagnosisCodes: newCodes });
                              }}
                              placeholder={
                                index === 0
                                  ? "Primary diagnosis (Required) - e.g., Z00.00"
                                  : `Diagnosis ${index + 1} (Optional)`
                              }
                              required={index === 0}
                              className={
                                code && !validateICD10(code)
                                  ? "border-red-500 focus:ring-red-500"
                                  : code ? "border-green-500 bg-green-50 dark:bg-green-950/20" : ""
                              }
                            />
                            {code && !validateICD10(code) && (
                              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Invalid ICD-10 format
                              </p>
                            )}
                            {code && validateICD10(code) && (
                              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                ✓ Valid
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-3 border-t">
                      <Label htmlFor="notes" className="text-sm font-medium">Clinical Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Additional clinical notes, special instructions, or medical necessity documentation..."
                        rows={3}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
                )}

                {/* Service Charges - MOVED AFTER DIAGNOSIS */}
                {selectedPatient && (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Service Charges</CardTitle>
                        <CardDescription>
                          Add CPT codes with modifiers and link to diagnosis codes
                        </CardDescription>
                      </div>
                      {formData.diagnosisCodes.filter(c => c && validateICD10(c)).length > 0 && (
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">
                          {formData.diagnosisCodes.filter(c => c && validateICD10(c)).length} Dx Available
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Show warning if no diagnosis codes */}
                    {formData.diagnosisCodes.filter(c => c && validateICD10(c)).length === 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-yellow-700 dark:text-yellow-300">
                            <p className="font-medium">Add diagnosis codes first</p>
                            <p className="text-xs mt-1">Enter at least one valid diagnosis code above to link with service charges</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Quick CPT Selection */}
                    <div>
                      <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                        Quick Add Common Services
                        <Badge variant="secondary" className="text-xs">Most Used</Badge>
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                        {commonCPTCodes.slice(0, 6).map((cpt) => (
                          <Button
                            key={cpt.code}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleCPTSelect(cpt)}
                            className="text-xs h-auto py-2 flex flex-col items-start hover:bg-[#1DA68F]/5 hover:border-[#1DA68F]"
                          >
                            <span className="font-mono font-semibold">{cpt.code}</span>
                            <span className="text-[10px] text-gray-500 truncate w-full text-left">{cpt.description}</span>
                            <span className="text-[#1DA68F] font-semibold mt-1">${cpt.price}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Manual Charge Entry */}
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 space-y-4">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <Plus className="w-4 h-4 text-[#1DA68F]" />
                        Add Custom Service
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <Label htmlFor="cptCode" className="text-xs font-medium">CPT Code *</Label>
                          <Input
                            id="cptCode"
                            value={newCharge.cptCode}
                            onChange={(e) =>
                              setNewCharge({ ...newCharge, cptCode: e.target.value.toUpperCase() })
                            }
                            placeholder="99213"
                            className="text-sm font-mono mt-1"
                            maxLength={5}
                          />
                        </div>
                        
                        <div className="sm:col-span-1 lg:col-span-2">
                          <Label htmlFor="description" className="text-xs font-medium">Service Description *</Label>
                          <Input
                            id="description"
                            value={newCharge.description}
                            onChange={(e) =>
                              setNewCharge({ ...newCharge, description: e.target.value })
                            }
                            placeholder="Enter service description"
                            className="text-sm mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="quantity" className="text-xs font-medium">Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={newCharge.quantity}
                            onChange={(e) =>
                              setNewCharge({ ...newCharge, quantity: parseInt(e.target.value) || 1 })
                            }
                            className="text-sm mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="unitPrice" className="text-xs font-medium">Unit Price ($) *</Label>
                          <Input
                            id="unitPrice"
                            type="number"
                            min="0"
                            step="0.01"
                            value={newCharge.unitPrice}
                            onChange={(e) =>
                              setNewCharge({ ...newCharge, unitPrice: parseFloat(e.target.value) || 0 })
                            }
                            placeholder="0.00"
                            className="text-sm mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="modifiers" className="text-xs font-medium flex items-center gap-1">
                            CPT Modifiers
                            <span className="text-xs font-normal text-gray-500">(Optional, comma-separated)</span>
                          </Label>
                          <Input
                            id="modifiers"
                            value={newCharge.modifiers}
                            onChange={(e) =>
                              setNewCharge({ ...newCharge, modifiers: e.target.value.toUpperCase() })
                            }
                            placeholder="e.g., 25, 59, GT"
                            className="text-sm font-mono mt-1"
                            maxLength={20}
                          />
                          <p className="text-xs text-gray-500 mt-1">Common: 25, 26, 50, 59, GT, TC, LT, RT</p>
                        </div>
                      </div>
                      
                      {/* Diagnosis Pointer Mapping */}
                      {formData.diagnosisCodes.filter(c => c && validateICD10(c)).length > 0 && (
                        <div>
                          <Label className="text-xs font-medium flex items-center gap-2">
                            <LinkIcon className="w-3 h-3 text-[#1DA68F]" />
                            Link to Diagnosis Codes (Pointer Mapping) *
                          </Label>
                          <p className="text-xs text-gray-500 mb-2">Select which diagnosis codes justify this service (e.g., 1,2,3)</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                            {formData.diagnosisCodes.map((code, idx) => 
                              code && validateICD10(code) ? (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    const pointers = newCharge.diagnosisPointers.split(',').map(s => s.trim()).filter(Boolean);
                                    const pointer = (idx + 1).toString();
                                    if (pointers.includes(pointer)) {
                                      pointers.splice(pointers.indexOf(pointer), 1);
                                    } else {
                                      pointers.push(pointer);
                                    }
                                    setNewCharge({ ...newCharge, diagnosisPointers: pointers.sort((a, b) => parseInt(a) - parseInt(b)).join(', ') });
                                  }}
                                  className={`text-left p-2 rounded-lg border-2 transition-all ${
                                    newCharge.diagnosisPointers.split(',').map(s => s.trim()).includes((idx + 1).toString())
                                      ? 'border-[#1DA68F] bg-[#1DA68F]/10 text-[#1DA68F]'
                                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <span className="font-semibold text-sm">{idx + 1}.</span>
                                    <span className="text-xs font-mono truncate flex-1">{code}</span>
                                  </div>
                                </button>
                              ) : null
                            )}
                          </div>
                          {newCharge.diagnosisPointers && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                              Selected pointers: <span className="font-mono font-semibold text-[#1DA68F]">{newCharge.diagnosisPointers}</span>
                            </p>
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-end pt-2">
                        <Button
                          type="button"
                          onClick={handleAddCharge}
                          size="sm"
                          className="bg-[#1DA68F] hover:bg-[#1DA68F]/90"
                          disabled={!newCharge.cptCode || !newCharge.description || newCharge.unitPrice <= 0}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Charge
                        </Button>
                      </div>
                    </div>

                    {/* Charges Table */}
                    {charges.length > 0 && (
                      <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b">
                          <h4 className="text-sm font-semibold">Added Charges ({charges.length})</h4>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-32">CPT Code</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="w-20 text-center">Qty</TableHead>
                              <TableHead className="w-24 text-right">Price</TableHead>
                              <TableHead className="w-24 text-right">Total</TableHead>
                              <TableHead className="w-12"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {charges.map((charge) => (
                              <TableRow key={charge.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <TableCell>
                                  <div className="space-y-1">
                                    <Badge variant="secondary" className="font-mono text-xs font-semibold">
                                      {charge.cptCode}
                                    </Badge>
                                    {charge.modifiers && (
                                      <div className="flex gap-1 flex-wrap">
                                        {charge.modifiers.split(',').map((mod, idx) => (
                                          <Badge key={idx} variant="outline" className="text-xs">
                                            {mod.trim()}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <p className="text-sm">{charge.description}</p>
                                    {charge.diagnosisPointers && (
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <LinkIcon className="w-3 h-3 text-[#1DA68F]" />
                                        <span>Linked to Dx: <span className="font-mono font-semibold text-[#1DA68F]">{charge.diagnosisPointers}</span></span>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-center font-medium">{charge.quantity}</TableCell>
                                <TableCell className="text-right font-medium">
                                  ${charge.unitPrice.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right font-semibold text-[#1DA68F]">
                                  ${charge.total.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveCharge(charge.id)}
                                    className="hover:bg-red-50 dark:hover:bg-red-950/20"
                                  >
                                    <X className="w-4 h-4 text-red-500" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
                )}
              </div>

              {/* Sidebar - Summary */}
              <div className="space-y-6">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Charge Summary</span>
                      {charges.length > 0 && (
                        <Badge variant="default" className="bg-[#1DA68F]">
                          {charges.length} {charges.length === 1 ? 'Item' : 'Items'}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Patient Info Summary */}
                    {selectedPatient && (
                      <div className="space-y-2 pb-3 border-b">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-[#1DA68F]" />
                          <span className="font-semibold">{selectedPatient.name}</span>
                        </div>
                        <p className="text-xs text-gray-500">{selectedPatient.id}</p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm py-2">
                        <span className="text-gray-600 dark:text-gray-400">Service Charges</span>
                        <span className="font-medium">{charges.length}</span>
                      </div>
                      <div className="border-t pt-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Subtotal</span>
                          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">${subtotal.toFixed(2)}</span>
                        </div>
                        {amountPaid > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Amount Paid</span>
                            <span className="font-medium text-green-600 dark:text-green-400">-${amountPaid.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="font-bold text-gray-900 dark:text-gray-100">Balance Due</span>
                          <span className="text-2xl font-bold text-[#1DA68F]">${balanceDue.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {/* Diagnosis Summary */}
                      {formData.diagnosisCodes.filter(c => c && validateICD10(c)).length > 0 && (
                        <div className="border-t pt-3">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Diagnosis Codes</p>
                          <div className="flex flex-wrap gap-1">
                            {formData.diagnosisCodes.map((code, idx) => 
                              code && validateICD10(code) ? (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {idx + 1}. {code}
                                </Badge>
                              ) : null
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 space-y-2 border-t">
                      <Button
                        type="submit"
                        className="w-full bg-[#1DA68F] hover:bg-[#1DA68F]/90 h-11"
                        disabled={!selectedPatient || charges.length === 0 || submitting}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {submitting ? "Updating..." : "Update Charge"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                    </div>

                    {!selectedPatient && (
                      <div className="text-center py-4 border-t">
                        <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Select a patient to begin
                        </p>
                      </div>
                    )}

                    {selectedPatient && charges.length === 0 && (
                      <div className="text-center py-4 border-t">
                        <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Add at least one service charge to continue
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
      )}
    </ProtectedRoute>
  );
}
