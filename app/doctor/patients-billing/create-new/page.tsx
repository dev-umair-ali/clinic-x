"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { doctorBillingAPI, type CreateChargeInput, type ChargeItem } from "@/lib/api/billing";
import {
  ArrowLeft,
  Plus,
  X,
  Save,
  Search,
  AlertCircle,
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
import { useToast } from "@/hooks/use-toast";

interface Patient {
  _id?: string;
  id: string; // Backend uses 'id' field (MongoDB _id converted to id)
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  phoneNumber?: string;
  insuranceInfo?: string; // Backend stores as string, not object
  insuranceProvide?: string; // Alternative field name in backend
}

export default function CreateChargePageIntegrated() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [items, setItems] = useState<ChargeItem[]>([]);
  const [newItem, setNewItem] = useState({
    cptCode: "",
    description: "",
    quantity: 1,
    unitPrice: 0,
    diagnosisCodes: [] as string[],
    placeOfService: "Office",
    dateOfService: new Date().toISOString().split("T")[0],
  });

  const [formData, setFormData] = useState({
    visitType: "Office Visit",
    serviceDate: new Date().toISOString().split("T")[0],
    placeOfService: "Office",
    notes: "",
    insuranceInfo: {
      providerName: "",
      policyNumber: "",
      groupNumber: "",
      subscriberName: "",
      coverageLevel: "primary" as "primary" | "secondary" | "tertiary",
    },
  });

  // Common CPT codes
  const commonCPTCodes = [
    { code: "99213", description: "Office visit - established patient (20-29 min)", price: 150 },
    { code: "99214", description: "Office visit - established patient (30-39 min)", price: 220 },
    { code: "99203", description: "Office visit - new patient (30-44 min)", price: 180 },
    { code: "99204", description: "Office visit - new patient (45-59 min)", price: 250 },
    { code: "80053", description: "Comprehensive metabolic panel", price: 75 },
    { code: "81002", description: "Urinalysis", price: 15 },
    { code: "87086", description: "Urine culture", price: 25 },
    { code: "36415", description: "Blood draw", price: 10 },
    { code: "85025", description: "Complete blood count (CBC)", price: 35 },
  ];

  // Common ICD-10 codes
  const commonICD10Codes = [
    { code: "Z00.00", description: "General adult medical examination" },
    { code: "E11.9", description: "Type 2 diabetes without complications" },
    { code: "I10", description: "Essential hypertension" },
    { code: "J06.9", description: "Upper respiratory infection" },
    { code: "R50.9", description: "Fever, unspecified" },
  ];

  // Fetch patients on mount
  useEffect(() => {
    fetchPatients();
  }, []); // Empty dependency - fetch once on mount

  // Fetch patients based on search query
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.length >= 2 || searchQuery.length === 0) {
        fetchPatients();
      }
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('clinic-ai-token') || sessionStorage.getItem('clinic-ai-token') || localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        });
        setPatients([]);
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        limit: '100', // Increased limit to get more patients
        page: '1',
      });

      // Add search query if provided
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000'}/doctors/patients?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          // Backend returns array directly in data field
          const patientsData = Array.isArray(result.data) ? result.data : [];
          setPatients(patientsData);
          
          if (patientsData.length === 0) {
            toast({
              title: "No Patients Found",
              description: "No patients are assigned to you yet. Please contact your administrator.",
              variant: "default",
            });
          }
        } else {
          console.error('Failed to fetch patients:', result.message);
          toast({
            title: "Error",
            description: result.message || "Failed to fetch patients",
            variant: "destructive",
          });
          setPatients([]);
        }
      } else {
        const errorData = await response.json();
        console.error('Error fetching patients:', errorData);
        toast({
          title: "Error",
          description: errorData.message || "Failed to fetch patients",
          variant: "destructive",
        });
        setPatients([]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to connect to server. Please check your connection.",
        variant: "destructive",
      });
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // Add item to charge
  const handleAddItem = () => {
    if (!newItem.cptCode || !newItem.description || newItem.unitPrice <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const item: ChargeItem = {
      cptCode: newItem.cptCode,
      description: newItem.description,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      totalPrice: newItem.quantity * newItem.unitPrice,
      diagnosisCodes: newItem.diagnosisCodes.filter(code => code),
      placeOfService: newItem.placeOfService,
      dateOfService: newItem.dateOfService,
    };

    setItems([...items, item]);

    // Reset form
    setNewItem({
      cptCode: "",
      description: "",
      quantity: 1,
      unitPrice: 0,
      diagnosisCodes: [],
      placeOfService: "Office",
      dateOfService: new Date().toISOString().split("T")[0],
    });
  };

  // Remove item
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const taxAmount = 0; // Configure as needed
  const total = subtotal + taxAmount;

  // Submit charge
  const handleSubmit = async () => {
    if (!selectedPatient) {
      toast({
        title: "Validation Error",
        description: "Please select a patient",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one charge item",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Don't send doctorId - let backend assign it from the authenticated user's token
      // This avoids ID mismatch between JWT userId (UUID) and MongoDB ObjectId

      const chargeData: CreateChargeInput = {
        patientId: selectedPatient.id, // Use 'id' field from backend
        serviceDate: formData.serviceDate,
        visitType: formData.visitType,
        placeOfService: formData.placeOfService,
        items: items,
        notes: formData.notes,
      };

      // Add insurance info if provided
      if (formData.insuranceInfo.providerName && formData.insuranceInfo.policyNumber) {
        chargeData.insuranceInfo = {
          providerName: formData.insuranceInfo.providerName,
          policyNumber: formData.insuranceInfo.policyNumber,
          groupNumber: formData.insuranceInfo.groupNumber,
          subscriberName: formData.insuranceInfo.subscriberName || `${selectedPatient.firstName} ${selectedPatient.lastName}`,
          coverageLevel: formData.insuranceInfo.coverageLevel,
          patientResponsibility: total, // Will be calculated by backend based on insurance
        };
      }

      const result = await doctorBillingAPI.createCharge(chargeData);

      if (result.success && result.data) {
        toast({
          title: "Success",
          description: `Charge created successfully! Invoice: ${result.data.invoiceNumber}`,
        });
        
        // Redirect to charge details or billing list
        router.push(`/doctor/patients-billing/${result.data._id}`);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create charge",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating charge:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["doctor", "admin"]}>
      <div className="flex-1 overflow-y-auto p-6 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                Create New Charge
              </h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Create a new billing charge for a patient
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Patient Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                  <CardDescription>Select the patient for this charge</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Search Patient</Label>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {selectedPatient ? (
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">
                            {selectedPatient.firstName} {selectedPatient.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            DOB: {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedPatient.email}
                          </p>
                          {(selectedPatient.insuranceInfo || selectedPatient.insuranceProvide) && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Insurance: {selectedPatient.insuranceInfo || selectedPatient.insuranceProvide}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPatient(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-lg max-h-60 overflow-y-auto">
                      {loading ? (
                        <div className="p-4 text-center text-muted-foreground">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                          Loading patients...
                        </div>
                      ) : patients.length > 0 ? (
                        patients.map((patient) => (
                          <button
                            key={patient.id}
                            onClick={() => setSelectedPatient(patient)}
                            className="w-full p-3 text-left hover:bg-muted/50 transition-colors border-b last:border-b-0"
                          >
                            <p className="font-medium">
                              {patient.firstName} {patient.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {patient.email}
                            </p>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No patients found
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Service Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Service Date</Label>
                      <Input
                        type="date"
                        value={formData.serviceDate}
                        onChange={(e) =>
                          setFormData({ ...formData, serviceDate: e.target.value })
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Visit Type</Label>
                      <Input
                        value={formData.visitType}
                        onChange={(e) =>
                          setFormData({ ...formData, visitType: e.target.value })
                        }
                        placeholder="e.g., Annual Physical"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Place of Service</Label>
                    <Select
                      value={formData.placeOfService}
                      onValueChange={(value) =>
                        setFormData({ ...formData, placeOfService: value })
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Hospital">Hospital</SelectItem>
                        <SelectItem value="Telemedicine">Telemedicine</SelectItem>
                        <SelectItem value="Home">Home</SelectItem>
                        <SelectItem value="Emergency Room">Emergency Room</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Charge Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Charge Items</CardTitle>
                  <CardDescription>Add procedures and services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Item Form */}
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>CPT Code</Label>
                        <Select
                          value={newItem.cptCode}
                          onValueChange={(value) => {
                            const cpt = commonCPTCodes.find((c) => c.code === value);
                            setNewItem({
                              ...newItem,
                              cptCode: value,
                              description: cpt?.description || "",
                              unitPrice: cpt?.price || 0,
                            });
                          }}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select CPT" />
                          </SelectTrigger>
                          <SelectContent>
                            {commonCPTCodes.map((cpt) => (
                              <SelectItem key={cpt.code} value={cpt.code}>
                                {cpt.code} - {cpt.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Diagnosis Code (ICD-10)</Label>
                        <Select
                          onValueChange={(value) => {
                            if (!newItem.diagnosisCodes.includes(value)) {
                              setNewItem({
                                ...newItem,
                                diagnosisCodes: [...newItem.diagnosisCodes, value],
                              });
                            }
                          }}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select ICD-10" />
                          </SelectTrigger>
                          <SelectContent>
                            {commonICD10Codes.map((icd) => (
                              <SelectItem key={icd.code} value={icd.code}>
                                {icd.code} - {icd.description}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Input
                        value={newItem.description}
                        onChange={(e) =>
                          setNewItem({ ...newItem, description: e.target.value })
                        }
                        placeholder="Service description"
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={newItem.quantity}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              quantity: parseInt(e.target.value) || 1,
                            })
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Unit Price ($)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newItem.unitPrice}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              unitPrice: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label>Total</Label>
                        <div className="mt-2 px-3 py-2 bg-muted rounded-md text-sm font-medium">
                          ${(newItem.quantity * newItem.unitPrice).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {newItem.diagnosisCodes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newItem.diagnosisCodes.map((code, idx) => (
                          <Badge key={idx} variant="secondary" className="gap-2">
                            {code}
                            <button
                              onClick={() =>
                                setNewItem({
                                  ...newItem,
                                  diagnosisCodes: newItem.diagnosisCodes.filter(
                                    (_, i) => i !== idx
                                  ),
                                })
                              }
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Button onClick={handleAddItem} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>

                  {/* Items List */}
                  {items.length > 0 && (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>CPT Code</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {item.cptCode}
                              </TableCell>
                              <TableCell>{item.description}</TableCell>
                              <TableCell className="text-right">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="text-right">
                                ${item.unitPrice.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ${item.totalPrice.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveItem(index)}
                                >
                                  <X className="w-4 h-4" />
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

              {/* Insurance Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Insurance Information (Optional)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Insurance Provider</Label>
                      <Input
                        value={formData.insuranceInfo.providerName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            insuranceInfo: {
                              ...formData.insuranceInfo,
                              providerName: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g., Blue Cross Blue Shield"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Policy Number</Label>
                      <Input
                        value={formData.insuranceInfo.policyNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            insuranceInfo: {
                              ...formData.insuranceInfo,
                              policyNumber: e.target.value,
                            },
                          })
                        }
                        placeholder="Policy #"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Group Number</Label>
                      <Input
                        value={formData.insuranceInfo.groupNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            insuranceInfo: {
                              ...formData.insuranceInfo,
                              groupNumber: e.target.value,
                            },
                          })
                        }
                        placeholder="Group #"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Coverage Level</Label>
                      <Select
                        value={formData.insuranceInfo.coverageLevel}
                        onValueChange={(value: any) =>
                          setFormData({
                            ...formData,
                            insuranceInfo: {
                              ...formData.insuranceInfo,
                              coverageLevel: value,
                            },
                          })
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Primary</SelectItem>
                          <SelectItem value="secondary">Secondary</SelectItem>
                          <SelectItem value="tertiary">Tertiary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Add any additional notes or comments..."
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Charge Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax:</span>
                      <span className="font-medium">${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between">
                      <span className="font-medium">Total:</span>
                      <span className="text-lg font-bold">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <div className="flex items-center gap-2 text-sm">
                      {selectedPatient ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                      <span>Patient selected</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {items.length > 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                      <span>{items.length} items added</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedPatient || items.length === 0 || submitting}
                    className="w-full"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Charge...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Charge
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-muted-foreground">
                  <p>• Select a patient before adding charges</p>
                  <p>• Add insurance info for claim submission</p>
                  <p>• Use common CPT codes for faster entry</p>
                  <p>• Include diagnosis codes for each procedure</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
