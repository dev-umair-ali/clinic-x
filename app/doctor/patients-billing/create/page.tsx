"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { doctorBillingAPI } from "@/lib/api/billing";
import {
  ArrowLeft,
  Plus,
  X,
  Save,
  Search,
  AlertCircle,
  User,
  FileText,
  Building2,
  CreditCard,
  Stethoscope,
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
  proc_code: string;
  charge: number;
  from_date: string;
  thru_date: string;
  place_of_service: string;
  units: string;
  diag_ref: string;
  mod1?: string;
  mod2?: string;
  mod3?: string;
  mod4?: string;
}

interface Patient {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  dob: string;
  sex: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  insuranceProvider?: string;
  policyNumber?: string;
}

export default function CreateClaimPage() {
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

  const [formData, setFormData] = useState({
    claim_form: "1500",
    accept_assign: "Y",
    auto_accident: "N",
    employment_related: "N",
    bill_name: "",
    bill_npi: "",
    bill_taxid: "",
    bill_taxid_type: "E",
    bill_addr_1: "",
    bill_city: "",
    bill_state: "",
    bill_zip: "",
    bill_phone: "",
    prov_name_f: "",
    prov_name_l: "",
    prov_name_m: "",
    prov_npi: "",
    prov_taxonomy: "",
    ref_name_f: "",
    ref_name_l: "",
    ref_name_m: "",
    ref_npi: "",
    pat_name_f: "",
    pat_name_l: "",
    pat_dob: "",
    pat_sex: "",
    pat_addr_1: "",
    pat_city: "",
    pat_state: "",
    pat_zip: "",
    pat_rel: "18",
    ins_name_f: "",
    ins_name_l: "",
    ins_dob: "",
    ins_sex: "",
    ins_addr_1: "",
    ins_city: "",
    ins_state: "",
    ins_zip: "",
    ins_number: "",
    ins_group: "",
    payerid: "",
    payer_name: "",
    payer_order: "Primary",
    diag_1: "",
    diag_2: "",
    diag_3: "",
    diag_4: "",
    diag_5: "",
    diag_6: "",
    diag_7: "",
    diag_8: "",
    clia_number: "",
    pcn: "",
  });

  const [newCharge, setNewCharge] = useState({
    proc_code: "",
    charge: 0,
    from_date: new Date().toISOString().split("T")[0],
    thru_date: new Date().toISOString().split("T")[0],
    place_of_service: "11",
    units: "1",
    diag_ref: "",
    mod1: "",
    mod2: "",
    mod3: "",
    mod4: "",
  });

  useEffect(() => {
    fetchPatients();
    fetchCurrentDoctor();
  }, []);

  const fetchCurrentDoctor = async () => {
    try {
      const token = localStorage.getItem("clinic-ai-token") || sessionStorage.getItem("clinic-ai-token");
      if (!token) return;
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000";
      const res = await fetch(baseUrl + "/doctors/me", {
        headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      });
      if (!res.ok) return;
      const data = await res.json();
      const doctor = data.data?.user || data.data?.profile || data.data || data;
      if (doctor) {
        setCurrentDoctor(doctor);
        setFormData((prev) => ({
          ...prev,
          prov_name_f: doctor.firstName || "",
          prov_name_l: doctor.lastName || "",
          prov_npi: doctor.npi || "",
          prov_taxonomy: doctor.taxonomy || "",
          ref_name_f: doctor.firstName || "",
          ref_name_l: doctor.lastName || "",
          ref_npi: doctor.npi || "",
        }));
      }
    } catch (e) {
      console.error("Error fetching doctor:", e);
    }
  };

  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      const token = localStorage.getItem("clinic-ai-token") || sessionStorage.getItem("clinic-ai-token");
      if (!token) {
        toast({ title: "Auth Error", description: "Please log in", variant: "destructive" });
        return;
      }
      const url = (process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3000") + "/doctors/patients?limit=100";
      const res = await fetch(url, {
        headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      const list = Array.isArray(data.data) ? data.data : [];
      setPatients(
        list.map((p: any) => ({
          id: p.id || p._id,
          name: ((p.firstName || "") + " " + (p.lastName || "")).trim(),
          firstName: p.firstName || "",
          lastName: p.lastName || "",
          dob: p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().split("T")[0] : "",
          sex: p.gender === "male" ? "M" : p.gender === "female" ? "F" : "",
          email: p.email || "",
          phone: p.phone || "",
          address: p.address?.street || p.address || "",
          city: p.address?.city || "",
          state: p.address?.state || "",
          zip: p.address?.zipCode || p.address?.zip || "",
          insuranceProvider: p.insuranceInfo?.providerName || "",
          policyNumber: p.insuranceInfo?.policyNumber || "",
        }))
      );
    } catch (e) {
      console.error("Error fetching patients:", e);
      toast({ title: "Error", description: "Failed to load patients", variant: "destructive" });
    } finally {
      setLoadingPatients(false);
    }
  };

  const filteredPatients = useMemo(() => {
    if (!patientSearch) return patients;
    const s = patientSearch.toLowerCase();
    return patients.filter((p) => p.name.toLowerCase().includes(s) || p.id.toLowerCase().includes(s));
  }, [patients, patientSearch]);

  const commonCPTCodes = [
    { code: "99213", price: 100 },
    { code: "99214", price: 150 },
    { code: "99215", price: 200 },
    { code: "99203", price: 120 },
    { code: "99204", price: 180 },
  ];

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData((prev) => ({
      ...prev,
      pat_name_f: patient.firstName,
      pat_name_l: patient.lastName,
      pat_dob: patient.dob,
      pat_sex: patient.sex,
      pat_addr_1: patient.address,
      pat_city: patient.city,
      pat_state: patient.state,
      pat_zip: patient.zip,
      ins_name_f: patient.firstName,
      ins_name_l: patient.lastName,
      ins_dob: patient.dob,
      ins_sex: patient.sex,
      ins_addr_1: patient.address,
      ins_city: patient.city,
      ins_state: patient.state,
      ins_zip: patient.zip,
      ins_number: patient.policyNumber || "",
      payer_name: patient.insuranceProvider || "",
      pcn: Date.now() + "-1",
    }));
    setPatientSearchOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddCharge = () => {
    if (newCharge.proc_code && newCharge.charge > 0) {
      setCharges([
        ...charges,
        {
          id: "CHG-" + Date.now(),
          proc_code: newCharge.proc_code,
          charge: newCharge.charge,
          from_date: newCharge.from_date,
          thru_date: newCharge.thru_date,
          place_of_service: newCharge.place_of_service,
          units: newCharge.units,
          diag_ref: newCharge.diag_ref,
          mod1: newCharge.mod1 || undefined,
          mod2: newCharge.mod2 || undefined,
          mod3: newCharge.mod3 || undefined,
          mod4: newCharge.mod4 || undefined,
        },
      ]);
      setNewCharge({
        proc_code: "",
        charge: 0,
        from_date: newCharge.from_date,
        thru_date: newCharge.thru_date,
        place_of_service: "11",
        units: "1",
        diag_ref: "",
        mod1: "",
        mod2: "",
        mod3: "",
        mod4: "",
      });
    }
  };

  const handleRemoveCharge = (id: string) => setCharges(charges.filter((c) => c.id !== id));

  const totalCharge = charges.reduce((sum, c) => sum + c.charge, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      toast({ title: "Error", description: "Select a patient", variant: "destructive" });
      return;
    }
    if (charges.length === 0) {
      toast({ title: "Error", description: "Add at least one charge", variant: "destructive" });
      return;
    }
    if (!formData.diag_1) {
      toast({ title: "Error", description: "Enter at least one diagnosis", variant: "destructive" });
      return;
    }
    try {
      setSubmitting(true);
      const claimData = {
        patientId: selectedPatient.id,
        serviceDate: charges[0]?.from_date || new Date().toISOString().split("T")[0],
        visitType: "Office Visit",
        placeOfService: charges[0]?.place_of_service || "11",
        claimMDData: { ...formData, total_charge: totalCharge.toFixed(2), balance_due: totalCharge.toFixed(2), charge: charges.map((c) => ({ proc_code: c.proc_code, charge: c.charge.toFixed(2), from_date: c.from_date, thru_date: c.thru_date, place_of_service: c.place_of_service, units: c.units, diag_ref: c.diag_ref, charge_record_type: "UN", ...(c.mod1 && { mod1: c.mod1 }), ...(c.mod2 && { mod2: c.mod2 }), ...(c.mod3 && { mod3: c.mod3 }), ...(c.mod4 && { mod4: c.mod4 }) })) },
        items: charges.map((c) => ({ cptCode: c.proc_code, description: "CPT " + c.proc_code, quantity: parseInt(c.units) || 1, unitPrice: c.charge, totalPrice: c.charge * (parseInt(c.units) || 1), modifiers: [c.mod1, c.mod2, c.mod3, c.mod4].filter(Boolean), diagnosisCodes: [formData.diag_1, formData.diag_2, formData.diag_3, formData.diag_4].filter(Boolean), placeOfService: c.place_of_service, dateOfService: c.from_date })),
        insuranceInfo: formData.ins_number ? { providerName: formData.payer_name, policyNumber: formData.ins_number, groupNumber: formData.ins_group, subscriberName: (formData.ins_name_f + " " + formData.ins_name_l).trim(), payerId: formData.payerid, coverageLevel: formData.payer_order.toLowerCase() } : undefined,
        notes: "",
      };
      const result = await doctorBillingAPI.createCharge(claimData);
      if (result.success) {
        toast({ title: "Success", description: "Claim created" });
        router.push("/doctor/patients-billing");
      } else {
        toast({ title: "Error", description: result.error || "Failed", variant: "destructive" });
      }
    } catch (e) {
      console.error("Error:", e);
      toast({ title: "Error", description: "Failed to create claim", variant: "destructive" });
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
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create CMS-1500 Claim</h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Complete all required fields</p>
                </div>
              </div>
              <Badge variant="outline">CMS-1500</Badge>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#1DA68F]/10 rounded-lg"><User className="w-5 h-5 text-[#1DA68F]" /></div>
                      <div><CardTitle>Patient Information</CardTitle><CardDescription>Select patient</CardDescription></div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold">Search Patient *</Label>
                      <Popover open={patientSearchOpen} onOpenChange={setPatientSearchOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between h-11 mt-2">
                            {selectedPatient ? <span>{selectedPatient.name}</span> : <span className="text-gray-500">Search...</span>}
                            <Search className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search..." value={patientSearch} onValueChange={setPatientSearch} />
                            <CommandList>
                              {loadingPatients ? <div className="p-4 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div> : filteredPatients.length === 0 ? <CommandEmpty>No patients</CommandEmpty> : (
                                <CommandGroup>
                                  {filteredPatients.map((p) => (
                                    <CommandItem key={p.id} onSelect={() => handlePatientSelect(p)}>
                                      <div><span className="font-medium">{p.name}</span><br /><span className="text-xs text-gray-500">DOB: {p.dob}</span></div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    {selectedPatient && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                        <div><Label className="text-xs text-gray-500">First Name</Label><Input name="pat_name_f" value={formData.pat_name_f} onChange={handleInputChange} className="mt-1" /></div>
                        <div><Label className="text-xs text-gray-500">Last Name</Label><Input name="pat_name_l" value={formData.pat_name_l} onChange={handleInputChange} className="mt-1" /></div>
                        <div><Label className="text-xs text-gray-500">DOB</Label><Input name="pat_dob" type="date" value={formData.pat_dob} onChange={handleInputChange} className="mt-1" /></div>
                        <div><Label className="text-xs text-gray-500">Sex</Label><Select value={formData.pat_sex} onValueChange={(v) => setFormData({ ...formData, pat_sex: v })}><SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="M">Male</SelectItem><SelectItem value="F">Female</SelectItem></SelectContent></Select></div>
                        <div className="col-span-2"><Label className="text-xs text-gray-500">Address</Label><Input name="pat_addr_1" value={formData.pat_addr_1} onChange={handleInputChange} className="mt-1" /></div>
                        <div><Label className="text-xs text-gray-500">City</Label><Input name="pat_city" value={formData.pat_city} onChange={handleInputChange} className="mt-1" /></div>
                        <div className="grid grid-cols-2 gap-2"><div><Label className="text-xs text-gray-500">State</Label><Input name="pat_state" value={formData.pat_state} onChange={handleInputChange} maxLength={2} className="mt-1" /></div><div><Label className="text-xs text-gray-500">ZIP</Label><Input name="pat_zip" value={formData.pat_zip} onChange={handleInputChange} className="mt-1" /></div></div>
                        <div className="col-span-2 md:col-span-4"><Label className="text-xs text-gray-500">Patient Rel to Insured</Label><Select value={formData.pat_rel} onValueChange={(v) => setFormData({ ...formData, pat_rel: v })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="18">Self</SelectItem><SelectItem value="01">Spouse</SelectItem><SelectItem value="19">Child</SelectItem></SelectContent></Select></div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                {selectedPatient && (
                  <Card>
                    <CardHeader><div className="flex items-center gap-3"><div className="p-2 bg-blue-500/10 rounded-lg"><CreditCard className="w-5 h-5 text-blue-600" /></div><div><CardTitle>Insurance Info</CardTitle><CardDescription>Payer details</CardDescription></div></div></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div><Label className="text-xs text-gray-500">Payer Name *</Label><Input name="payer_name" value={formData.payer_name} onChange={handleInputChange} className="mt-1" /></div>
                        <div><Label className="text-xs text-gray-500">Payer ID *</Label><Input name="payerid" value={formData.payerid} onChange={handleInputChange} className="mt-1" /></div>
                        <div><Label className="text-xs text-gray-500">Payer Order</Label><Select value={formData.payer_order} onValueChange={(v) => setFormData({ ...formData, payer_order: v })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Primary">Primary</SelectItem><SelectItem value="Secondary">Secondary</SelectItem></SelectContent></Select></div>
                        <div><Label className="text-xs text-gray-500">Policy Number *</Label><Input name="ins_number" value={formData.ins_number} onChange={handleInputChange} className="mt-1" /></div>
                        <div><Label className="text-xs text-gray-500">Group Number</Label><Input name="ins_group" value={formData.ins_group} onChange={handleInputChange} className="mt-1" /></div>
                      </div>
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold mb-3">Subscriber Info</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div><Label className="text-xs text-gray-500">First Name</Label><Input name="ins_name_f" value={formData.ins_name_f} onChange={handleInputChange} className="mt-1" /></div>
                          <div><Label className="text-xs text-gray-500">Last Name</Label><Input name="ins_name_l" value={formData.ins_name_l} onChange={handleInputChange} className="mt-1" /></div>
                          <div><Label className="text-xs text-gray-500">DOB</Label><Input name="ins_dob" type="date" value={formData.ins_dob} onChange={handleInputChange} className="mt-1" /></div>
                          <div><Label className="text-xs text-gray-500">Sex</Label><Select value={formData.ins_sex} onValueChange={(v) => setFormData({ ...formData, ins_sex: v })}><SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="M">Male</SelectItem><SelectItem value="F">Female</SelectItem></SelectContent></Select></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {selectedPatient && (
                  <Card>
                    <CardHeader><div className="flex items-center gap-3"><div className="p-2 bg-purple-500/10 rounded-lg"><Building2 className="w-5 h-5 text-purple-600" /></div><div><CardTitle>Billing Provider</CardTitle><CardDescription>Facility info</CardDescription></div></div></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="col-span-2"><Label className="text-xs text-gray-500">Name *</Label><Input name="bill_name" value={formData.bill_name} onChange={handleInputChange} className="mt-1" /></div>
                        <div><Label className="text-xs text-gray-500">NPI *</Label><Input name="bill_npi" value={formData.bill_npi} onChange={handleInputChange} maxLength={10} className="mt-1" /></div>
                        <div><Label className="text-xs text-gray-500">Tax ID *</Label><Input name="bill_taxid" value={formData.bill_taxid} onChange={handleInputChange} className="mt-1" /></div>
                        <div><Label className="text-xs text-gray-500">Tax Type</Label><Select value={formData.bill_taxid_type} onValueChange={(v) => setFormData({ ...formData, bill_taxid_type: v })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="E">EIN</SelectItem><SelectItem value="S">SSN</SelectItem></SelectContent></Select></div>
                        <div><Label className="text-xs text-gray-500">Phone</Label><Input name="bill_phone" value={formData.bill_phone} onChange={handleInputChange} className="mt-1" /></div>
                        <div className="col-span-2"><Label className="text-xs text-gray-500">Address</Label><Input name="bill_addr_1" value={formData.bill_addr_1} onChange={handleInputChange} className="mt-1" /></div>
                        <div><Label className="text-xs text-gray-500">City</Label><Input name="bill_city" value={formData.bill_city} onChange={handleInputChange} className="mt-1" /></div>
                        <div><Label className="text-xs text-gray-500">State</Label><Input name="bill_state" value={formData.bill_state} onChange={handleInputChange} maxLength={2} className="mt-1" /></div>
                        <div><Label className="text-xs text-gray-500">ZIP</Label><Input name="bill_zip" value={formData.bill_zip} onChange={handleInputChange} className="mt-1" /></div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {selectedPatient && (
                  <Card>
                    <CardHeader><div className="flex items-center gap-3"><div className="p-2 bg-green-500/10 rounded-lg"><Stethoscope className="w-5 h-5 text-green-600" /></div><div><CardTitle>Provider Info</CardTitle><CardDescription>Rendering/Referring</CardDescription></div></div></CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-3">Rendering Provider</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div><Label className="text-xs text-gray-500">First *</Label><Input name="prov_name_f" value={formData.prov_name_f} onChange={handleInputChange} className="mt-1" /></div>
                          <div><Label className="text-xs text-gray-500">Last *</Label><Input name="prov_name_l" value={formData.prov_name_l} onChange={handleInputChange} className="mt-1" /></div>
                          <div><Label className="text-xs text-gray-500">MI</Label><Input name="prov_name_m" value={formData.prov_name_m} onChange={handleInputChange} maxLength={1} className="mt-1" /></div>
                          <div><Label className="text-xs text-gray-500">NPI *</Label><Input name="prov_npi" value={formData.prov_npi} onChange={handleInputChange} maxLength={10} className="mt-1" /></div>
                          <div className="col-span-2"><Label className="text-xs text-gray-500">Taxonomy</Label><Input name="prov_taxonomy" value={formData.prov_taxonomy} onChange={handleInputChange} className="mt-1" /></div>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold mb-3">Referring Provider</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div><Label className="text-xs text-gray-500">First</Label><Input name="ref_name_f" value={formData.ref_name_f} onChange={handleInputChange} className="mt-1" /></div>
                          <div><Label className="text-xs text-gray-500">Last</Label><Input name="ref_name_l" value={formData.ref_name_l} onChange={handleInputChange} className="mt-1" /></div>
                          <div><Label className="text-xs text-gray-500">MI</Label><Input name="ref_name_m" value={formData.ref_name_m} onChange={handleInputChange} maxLength={1} className="mt-1" /></div>
                          <div><Label className="text-xs text-gray-500">NPI</Label><Input name="ref_npi" value={formData.ref_npi} onChange={handleInputChange} maxLength={10} className="mt-1" /></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {selectedPatient && (
                  <Card>
                    <CardHeader><div className="flex items-center gap-3"><div className="p-2 bg-orange-500/10 rounded-lg"><FileText className="w-5 h-5 text-orange-600" /></div><div><CardTitle>Diagnosis Codes</CardTitle><CardDescription>ICD-10 A-H</CardDescription></div></div></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
                          const letter = String.fromCharCode(64 + n);
                          const field = ("diag_" + n) as keyof typeof formData;
                          return <div key={n}><Label className="text-xs text-gray-500">{letter}. Diag {n} {n === 1 && "*"}</Label><Input name={field} value={formData[field]} onChange={handleInputChange} placeholder="J300" className="mt-1 font-mono" /></div>;
                        })}
                      </div>
                      <p className="text-xs text-gray-500 mt-3">Enter ICD-10 without periods</p>
                    </CardContent>
                  </Card>
                )}
                {selectedPatient && (
                  <Card>
                    <CardHeader><div className="flex items-center gap-3"><div className="p-2 bg-[#1DA68F]/10 rounded-lg"><Plus className="w-5 h-5 text-[#1DA68F]" /></div><div><CardTitle>Service Lines</CardTitle><CardDescription>CPT codes and charges</CardDescription></div></div></CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Quick Add</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {commonCPTCodes.map((c) => <Button key={c.code} type="button" variant="outline" size="sm" onClick={() => setNewCharge({ ...newCharge, proc_code: c.code, charge: c.price })}>{c.code} - ${c.price}</Button>)}
                        </div>
                      </div>
                      <div className="border rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div><Label className="text-xs">CPT *</Label><Input value={newCharge.proc_code} onChange={(e) => setNewCharge({ ...newCharge, proc_code: e.target.value.toUpperCase() })} placeholder="99213" className="mt-1 font-mono" /></div>
                          <div><Label className="text-xs">Charge *</Label><Input type="number" step="0.01" min="0" value={newCharge.charge || ""} onChange={(e) => setNewCharge({ ...newCharge, charge: parseFloat(e.target.value) || 0 })} className="mt-1" /></div>
                          <div><Label className="text-xs">From Date *</Label><Input type="date" value={newCharge.from_date} onChange={(e) => setNewCharge({ ...newCharge, from_date: e.target.value, thru_date: e.target.value })} className="mt-1" /></div>
                          <div><Label className="text-xs">Thru Date</Label><Input type="date" value={newCharge.thru_date} onChange={(e) => setNewCharge({ ...newCharge, thru_date: e.target.value })} className="mt-1" /></div>
                          <div><Label className="text-xs">POS</Label><Select value={newCharge.place_of_service} onValueChange={(v) => setNewCharge({ ...newCharge, place_of_service: v })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="11">11-Office</SelectItem><SelectItem value="21">21-Inpatient</SelectItem><SelectItem value="22">22-Outpatient</SelectItem><SelectItem value="23">23-ER</SelectItem></SelectContent></Select></div>
                          <div><Label className="text-xs">Units</Label><Input value={newCharge.units} onChange={(e) => setNewCharge({ ...newCharge, units: e.target.value })} className="mt-1" /></div>
                          <div><Label className="text-xs">Dx Ptr *</Label><Input value={newCharge.diag_ref} onChange={(e) => setNewCharge({ ...newCharge, diag_ref: e.target.value.toUpperCase() })} placeholder="A" maxLength={4} className="mt-1 font-mono" /></div>
                          <div><Label className="text-xs">Mods</Label><div className="grid grid-cols-4 gap-1 mt-1"><Input value={newCharge.mod1} onChange={(e) => setNewCharge({ ...newCharge, mod1: e.target.value.toUpperCase() })} maxLength={2} className="font-mono text-center" /><Input value={newCharge.mod2} onChange={(e) => setNewCharge({ ...newCharge, mod2: e.target.value.toUpperCase() })} maxLength={2} className="font-mono text-center" /><Input value={newCharge.mod3} onChange={(e) => setNewCharge({ ...newCharge, mod3: e.target.value.toUpperCase() })} maxLength={2} className="font-mono text-center" /><Input value={newCharge.mod4} onChange={(e) => setNewCharge({ ...newCharge, mod4: e.target.value.toUpperCase() })} maxLength={2} className="font-mono text-center" /></div></div>
                        </div>
                        <Button type="button" onClick={handleAddCharge} disabled={!newCharge.proc_code || newCharge.charge <= 0 || !newCharge.diag_ref} className="bg-[#1DA68F] hover:bg-[#1DA68F]/90"><Plus className="w-4 h-4 mr-2" />Add Line</Button>
                      </div>
                      {charges.length > 0 && (
                        <Table>
                          <TableHeader><TableRow><TableHead>CPT</TableHead><TableHead>Date</TableHead><TableHead>POS</TableHead><TableHead>Units</TableHead><TableHead>Dx</TableHead><TableHead>Mods</TableHead><TableHead className="text-right">Charge</TableHead><TableHead></TableHead></TableRow></TableHeader>
                          <TableBody>
                            {charges.map((c) => (
                              <TableRow key={c.id}>
                                <TableCell className="font-mono font-semibold">{c.proc_code}</TableCell>
                                <TableCell className="text-sm">{c.from_date}</TableCell>
                                <TableCell>{c.place_of_service}</TableCell>
                                <TableCell>{c.units}</TableCell>
                                <TableCell className="font-mono">{c.diag_ref}</TableCell>
                                <TableCell className="text-sm text-gray-500">{[c.mod1, c.mod2, c.mod3, c.mod4].filter(Boolean).join(",") || "-"}</TableCell>
                                <TableCell className="text-right font-semibold text-[#1DA68F]">${c.charge.toFixed(2)}</TableCell>
                                <TableCell><Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveCharge(c.id)}><X className="w-4 h-4 text-red-500" /></Button></TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                )}
                {selectedPatient && (
                  <Card>
                    <CardHeader><CardTitle>Additional Info</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2"><Checkbox id="accept" checked={formData.accept_assign === "Y"} onCheckedChange={(c) => setFormData({ ...formData, accept_assign: c ? "Y" : "N" })} /><Label htmlFor="accept" className="text-sm">Accept Assignment</Label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="emp" checked={formData.employment_related === "Y"} onCheckedChange={(c) => setFormData({ ...formData, employment_related: c ? "Y" : "N" })} /><Label htmlFor="emp" className="text-sm">Employment Related</Label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="auto" checked={formData.auto_accident === "Y"} onCheckedChange={(c) => setFormData({ ...formData, auto_accident: c ? "Y" : "N" })} /><Label htmlFor="auto" className="text-sm">Auto Accident</Label></div>
                        <div><Label className="text-xs text-gray-500">CLIA</Label><Input name="clia_number" value={formData.clia_number} onChange={handleInputChange} className="mt-1" /></div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className="space-y-6">
                <Card className="sticky top-6">
                  <CardHeader><CardTitle className="flex items-center justify-between"><span>Summary</span>{charges.length > 0 && <Badge className="bg-[#1DA68F]">{charges.length}</Badge>}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {selectedPatient && <div className="pb-3 border-b"><div className="flex items-center gap-2 text-sm"><User className="w-4 h-4 text-[#1DA68F]" /><span className="font-semibold">{selectedPatient.name}</span></div><p className="text-xs text-gray-500 mt-1">DOB: {formData.pat_dob}</p></div>}
                    {formData.payer_name && <div className="pb-3 border-b"><div className="flex items-center gap-2 text-sm"><CreditCard className="w-4 h-4 text-blue-500" /><span className="font-semibold">{formData.payer_name}</span></div><p className="text-xs text-gray-500 mt-1">Policy: {formData.ins_number}</p></div>}
                    {formData.diag_1 && <div className="pb-3 border-b"><p className="text-xs font-medium text-gray-500 mb-2">Diagnosis</p><div className="flex flex-wrap gap-1">{[formData.diag_1, formData.diag_2, formData.diag_3, formData.diag_4].filter(Boolean).map((c, i) => <Badge key={i} variant="outline" className="text-xs font-mono">{String.fromCharCode(65 + i)}:{c}</Badge>)}</div></div>}
                    <div className="space-y-2"><div className="flex justify-between text-sm"><span className="text-gray-500">Lines</span><span className="font-medium">{charges.length}</span></div><div className="flex justify-between text-lg font-bold pt-2 border-t"><span>Total</span><span className="text-[#1DA68F]">${totalCharge.toFixed(2)}</span></div></div>
                    <div className="pt-4 space-y-2">
                      <Button type="submit" className="w-full bg-[#1DA68F] hover:bg-[#1DA68F]/90 h-11" disabled={!selectedPatient || charges.length === 0 || submitting}>
                        {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</> : <><Save className="w-4 h-4 mr-2" />Create Claim</>}
                      </Button>
                      <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>Cancel</Button>
                    </div>
                    {!selectedPatient && <div className="text-center py-4 border-t"><AlertCircle className="w-6 h-6 text-gray-400 mx-auto mb-2" /><p className="text-sm text-gray-500">Select a patient</p></div>}
                    {selectedPatient && charges.length === 0 && <div className="text-center py-4 border-t"><AlertCircle className="w-6 h-6 text-gray-400 mx-auto mb-2" /><p className="text-sm text-gray-500">Add a service line</p></div>}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
