"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { exportToCSV, handlePrint } from "@/lib/utils/billing-utils";
import { doctorBillingAPI } from "@/lib/api/billing";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Send,
  Search,
  FileText,
  Upload,
  CheckCircle,
  AlertTriangle,
  Building2,
  User,
  Calendar,
  DollarSign,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

export default function SubmitClaimPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);
  const [currentDoctor, setCurrentDoctor] = useState<any>(null);
  const [formData, setFormData] = useState({
    submissionType: "electronic",
    billingProvider: "",
    renderingProvider: "",
    placeOfService: "",
    claimNote: "",
    attachments: [] as File[],
  });

  // Fetch pending invoices from API
  useEffect(() => {
    fetchPendingInvoices();
    fetchCurrentDoctor();
  }, []);

  const fetchPendingInvoices = async () => {
    try {
      setLoading(true);
      // Fetch charges that have insurance and are ready for claim submission
      const result = await doctorBillingAPI.listCharges({
        paymentStatus: 'unpaid',
        limit: 100,
      });

      if (result.success && result.data) {
        // Filter charges that have insurance information
        const charges = result.data.charges || result.data;
        const chargesWithInsurance = charges.filter((charge: any) => 
          charge.insuranceInfo && 
          charge.insuranceInfo.providerName &&
          charge.status !== 'cancelled'
        );

        // Transform to invoice format
        const invoices = chargesWithInsurance.map((charge: any) => ({
          id: charge.invoiceNumber,
          chargeId: charge._id,
          patientName: `${charge.patientId?.firstName || ''} ${charge.patientId?.lastName || ''}`,
          patientId: charge.patientId?._id,
          dateOfService: new Date(charge.serviceDate).toISOString().split('T')[0],
          insuranceProvider: charge.insuranceInfo?.providerName || '',
          policyNumber: charge.insuranceInfo?.policyNumber || '',
          totalAmount: charge.totalCharge,
          cptCodes: charge.items.map((item: any) => item.cptCode),
          diagnosis: charge.items.map((item: any) => item.description).join(', '),
          readyToSubmit: true,
          issues: [],
        }));

        setPendingInvoices(invoices);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch invoices",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Error",
        description: "Failed to load invoices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentDoctor = async () => {
    try {
      const token = localStorage.getItem('clinic-ai-token') || sessionStorage.getItem('clinic-ai-token');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentDoctor(data.user);
        // Set current doctor as default billing provider
        if (data.user) {
          setFormData(prev => ({
            ...prev,
            billingProvider: data.user._id || data.user.id,
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching current doctor:', error);
    }
  };

  const handleInvoiceToggle = (invoiceId: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId)
        ? prev.filter((id) => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const handleSelectAll = () => {
    const readyInvoices = pendingInvoices
      .filter((inv) => inv.readyToSubmit)
      .map((inv) => inv.id);
    setSelectedInvoices(
      selectedInvoices.length === readyInvoices.length ? [] : readyInvoices
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...filesArray],
      }));
    }
  };

  const selectedInvoiceData = pendingInvoices.filter((inv) =>
    selectedInvoices.includes(inv.id)
  );
  const totalClaimAmount = selectedInvoiceData.reduce(
    (sum, inv) => sum + inv.totalAmount,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting claims:", {
      invoices: selectedInvoices,
      ...formData,
    });
    router.push("/doctor/patients-billing/claims");
  };

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Submit Insurance Claims
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Select invoices and submit claims to insurance providers
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Submission Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Claim Submission Settings</CardTitle>
                    <CardDescription>
                      Configure how the claims will be submitted
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="submissionType">Submission Type *</Label>
                        <Select
                          value={formData.submissionType}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              submissionType: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electronic">
                              Electronic (EDI)
                            </SelectItem>
                            <SelectItem value="paper">Paper Claim</SelectItem>
                            <SelectItem value="clearinghouse">
                              Via Clearinghouse
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingProvider">
                          Billing Provider *
                        </Label>
                        <Select 
                          name="billingProvider" 
                          required
                          value={formData.billingProvider}
                          onValueChange={(value) => setFormData({...formData, billingProvider: value})}
                        >
                          <SelectTrigger>
                            <SelectValue>
                              {currentDoctor ? `Dr. ${currentDoctor.firstName} ${currentDoctor.lastName}` : "Select provider"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {currentDoctor && (
                              <SelectItem value={currentDoctor._id || currentDoctor.id}>
                                Dr. {currentDoctor.firstName} {currentDoctor.lastName}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="placeOfService">Place of Service</Label>
                        <Select name="placeOfService">
                          <SelectTrigger>
                            <SelectValue placeholder="Select place" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="11">
                              11 - Office
                            </SelectItem>
                            <SelectItem value="22">
                              22 - Outpatient Hospital
                            </SelectItem>
                            <SelectItem value="23">
                              23 - Emergency Room
                            </SelectItem>
                            <SelectItem value="81">
                              81 - Independent Laboratory
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="claimNote">Claim Notes (Optional)</Label>
                      <Textarea
                        id="claimNote"
                        value={formData.claimNote}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            claimNote: e.target.value,
                          }))
                        }
                        placeholder="Add any special instructions or notes for the claim..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="attachments">
                        Supporting Documents (Optional)
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Drop files here or click to upload
                        </p>
                        <Input
                          id="attachments"
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document.getElementById("attachments")?.click()
                          }
                        >
                          Select Files
                        </Button>
                        {formData.attachments.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {formData.attachments.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded"
                              >
                                <span className="truncate">{file.name}</span>
                                <span className="text-gray-500 text-xs">
                                  {(file.size / 1024).toFixed(2)} KB
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Invoice Selection */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Select Invoices</CardTitle>
                        <CardDescription>
                          Choose which invoices to include in the claim
                          submission
                        </CardDescription>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                      >
                        {selectedInvoices.length ===
                        pendingInvoices.filter((inv) => inv.readyToSubmit).length
                          ? "Deselect All"
                          : "Select All"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-[#1DA68F]" />
                        <span className="ml-2 text-gray-500">Loading invoices...</span>
                      </div>
                    ) : pendingInvoices.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>No invoices with insurance information found</p>
                        <p className="text-sm mt-1">Create charges with insurance details to submit claims</p>
                      </div>
                    ) : (
                    pendingInvoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className={`border rounded-lg p-4 ${
                          invoice.readyToSubmit
                            ? "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                            : "border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10"
                        } transition-colors`}
                      >
                        <div className="flex items-start gap-4">
                          <Checkbox
                            id={invoice.id}
                            checked={selectedInvoices.includes(invoice.id)}
                            onCheckedChange={() =>
                              handleInvoiceToggle(invoice.id)
                            }
                            disabled={!invoice.readyToSubmit}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    {invoice.patientName}
                                  </h4>
                                  <Badge variant="outline" className="text-xs">
                                    {invoice.patientId}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-3.5 h-3.5" />
                                    {invoice.id}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(
                                      invoice.dateOfService
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                  ${invoice.totalAmount.toFixed(2)}
                                </p>
                                {invoice.readyToSubmit ? (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mt-1">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Ready
                                  </Badge>
                                ) : (
                                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 mt-1">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Issues
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">
                                  Insurance
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Building2 className="w-4 h-4 text-gray-400" />
                                  <span className="font-medium">
                                    {invoice.insuranceProvider}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                                  {invoice.policyNumber}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">
                                  Diagnosis
                                </p>
                                <p className="font-medium mt-1">
                                  {invoice.diagnosis}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {invoice.cptCodes.map((code: string) => (
                                <Badge
                                  key={code}
                                  variant="secondary"
                                  className="text-xs font-mono"
                                >
                                  {code}
                                </Badge>
                              ))}
                            </div>

                            {!invoice.readyToSubmit && invoice.issues.length > 0 && (
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="font-semibold text-yellow-900 dark:text-yellow-100 text-sm">
                                      Issues Found:
                                    </p>
                                    <ul className="text-sm text-yellow-800 dark:text-yellow-200 mt-1 space-y-1">
                                      {invoice.issues.map((issue: string, idx: number) => (
                                        <li key={idx}>• {issue}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Summary */}
              <div className="space-y-6">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Submission Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Selected Claims
                        </span>
                        <span className="font-semibold">
                          {selectedInvoices.length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Total Patients
                        </span>
                        <span className="font-semibold">
                          {
                            new Set(
                              selectedInvoiceData.map((inv) => inv.patientId)
                            ).size
                          }
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Submission Type
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {formData.submissionType === "electronic"
                            ? "Electronic"
                            : formData.submissionType === "paper"
                            ? "Paper"
                            : "Clearinghouse"}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-bold">Total Claim Amount</span>
                        <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                          ${totalClaimAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {selectedInvoices.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">
                            Selected Invoices:
                          </p>
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {selectedInvoiceData.map((inv) => (
                              <div
                                key={inv.id}
                                className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded"
                              >
                                <p className="font-medium">{inv.patientName}</p>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400 mt-1">
                                  <span className="font-mono">{inv.id}</span>
                                  <span>${inv.totalAmount.toFixed(2)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />

                    <div className="pt-2 space-y-2">
                      <Button
                        type="submit"
                        className="w-full bg-[#1DA68F] hover:bg-[#1DA68F]/90"
                        disabled={selectedInvoices.length === 0}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Submit {selectedInvoices.length} Claim
                        {selectedInvoices.length !== 1 ? "s" : ""}
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

                    {selectedInvoices.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-2">
                        Select at least one invoice to continue
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Guidelines */}
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Claim Submission Tips
                        </h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• Verify all patient insurance information</li>
                          <li>• Ensure CPT codes match documentation</li>
                          <li>• Check for pre-authorization requirements</li>
                          <li>• Include all necessary supporting documents</li>
                          <li>• Review claim for accuracy before submission</li>
                        </ul>
                      </div>
                    </div>
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
