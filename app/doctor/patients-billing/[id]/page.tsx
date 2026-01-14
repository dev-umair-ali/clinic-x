"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateInvoicePDF, type PDFInvoiceData } from "@/lib/utils/pdf-generator";
import { doctorBillingAPI, type Charge } from "@/lib/api/billing";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  User,
  Building2,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  Edit,
  Mail,
  CreditCard,
  MoreVertical,
  Download,
  Stethoscope,
  AlertCircle,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BillingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [charge, setCharge] = useState<Charge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharge();
  }, [params.id]);

  const fetchCharge = async () => {
    try {
      setLoading(true);
      const result = await doctorBillingAPI.getCharge(params.id);

      if (result.success && result.data) {
        setCharge(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch charge details",
          variant: "destructive",
        });
        router.push("/doctor/patients-billing");
      }
    } catch (error) {
      console.error('Error fetching charge:', error);
      toast({
        title: "Error",
        description: "Failed to load charge details",
        variant: "destructive",
      });
      router.push("/doctor/patients-billing");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!charge) {
    return (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Charge not found
            </h3>
            <Button onClick={() => router.push("/doctor/patients-billing")}>
              Back to Billing
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Sample billing detail data with ICD-10 codes, CPT codes, and modifiers
  const billingDetail = {
    id: charge.invoiceNumber,
    invoiceNumber: charge.invoiceNumber,
    status: charge.paymentStatus,
    claimStatus: charge.insuranceInfo?.claimStatus || 'pending',
    dateOfService: new Date(charge.serviceDate).toISOString().split('T')[0],
    dateCreated: new Date(charge.createdAt).toISOString().split('T')[0],
    dateDue: new Date(charge.dueDate).toISOString().split('T')[0],
    patient: {
      name: `${charge.patientId?.firstName || ''} ${charge.patientId?.lastName || ''}`,
      id: charge.patientId?._id || 'N/A',
      dob: charge.patientId?.dateOfBirth ? new Date(charge.patientId.dateOfBirth).toISOString().split('T')[0] : 'N/A',
      email: charge.patientId?.email || 'N/A',
      phone: charge.patientId?.phone || 'N/A',
      address: charge.patientId?.address || 'N/A',
    },
    insurance: {
      provider: charge.insuranceInfo?.providerName || 'No Insurance',
      policyNumber: charge.insuranceInfo?.policyNumber || 'N/A',
      groupNumber: charge.insuranceInfo?.groupNumber || 'N/A',
      subscriberName: charge.insuranceInfo?.subscriberName || 'N/A',
      relationship: charge.insuranceInfo?.relationshipToPatient || 'N/A',
    },
    provider: {
      name: `Dr. ${charge.doctorId?.firstName || ''} ${charge.doctorId?.lastName || ''}`,
      npi: charge.doctorId?.npi || 'N/A',
      specialty: charge.doctorId?.specialty || 'N/A',
      facility: charge.clinicId?.name || 'ClinicX',
      phone: charge.doctorId?.phone || 'N/A',
      address: charge.clinicId?.address || 'N/A',
    },
    // Diagnosis codes (ICD-10) - from charge items
    diagnosisCodes: charge.items.flatMap(item => 
      (item.diagnosisCodes || []).map((code, idx) => ({
        pointer: idx + 1,
        code: code,
        description: item.description,
      }))
    ).slice(0, 4), // Limit to 4 codes
    // Service charges with CPT codes from charge items
    charges: charge.items.map(item => ({
      cptCode: item.cptCode,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.totalPrice,
      modifier: item.modifiers?.join(', ') || '',
      diagnosisPointers: item.diagnosisCodes || [],
    })),
    payments: charge.payments || [],
    adjustments: charge.discountAmount ? [
      {
        id: 'DISC-001',
        date: new Date(charge.updatedAt).toISOString().split('T')[0],
        type: 'Discount',
        reason: charge.discountReason || 'Discount applied',
        amount: -charge.discountAmount,
      }
    ] : [],
    notes: charge.notes || 'No additional notes.',
  };

  const subtotal = billingDetail.charges.reduce((sum: number, item: any) => sum + item.total, 0);
  const totalAdjustments = billingDetail.adjustments.reduce((sum: number, adj: any) => sum + adj.amount, 0);
  const totalPayments = billingDetail.payments.reduce((sum: number, pay: any) => sum + (pay.amount || 0), 0);
  // Calculate balance dynamically instead of using stale database value
  const balance = subtotal + totalAdjustments - totalPayments;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "partial":
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "unpaid":
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  // Handle PDF Download
  const handleDownloadPDF = () => {
    const pdfData: PDFInvoiceData = {
      invoiceNumber: billingDetail.invoiceNumber,
      dateOfService: billingDetail.dateOfService,
      dateCreated: billingDetail.dateCreated,
      dateDue: billingDetail.dateDue,
      status: billingDetail.status,
      patient: billingDetail.patient,
      insurance: billingDetail.insurance,
      provider: billingDetail.provider,
      charges: billingDetail.charges,
      diagnosisCodes: billingDetail.diagnosisCodes,
      payments: billingDetail.payments,
      adjustments: billingDetail.adjustments,
      subtotal,
      totalAdjustments,
      totalPayments,
      balance,
      notes: billingDetail.notes,
    };
    
    generateInvoicePDF(pdfData);
  };

  // Handle Edit Invoice
  const handleEditInvoice = () => {
    router.push(`/doctor/patients-billing/edit/${params.id}`);
  };

  // Handle Void Invoice
  const handleVoidInvoice = async () => {
    if (!confirm('Are you sure you want to void this invoice? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await doctorBillingAPI.deleteCharge(params.id);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Invoice voided successfully",
        });
        router.push("/doctor/patients-billing");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to void invoice",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error voiding invoice:', error);
      toast({
        title: "Error",
        description: "Failed to void invoice",
        variant: "destructive",
      });
    }
  };

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="w-fit"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Billing
              </Button>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {billingDetail.invoiceNumber}
                    </h1>
                    <Badge className={getStatusColor(billingDetail.status)}>
                      <span className="capitalize">{billingDetail.status}</span>
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Service Date: {new Date(billingDetail.dateOfService).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleEditInvoice}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Record Payment
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={handleVoidInvoice}>
                        Void Invoice
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Diagnosis Codes Section - Prominent Display */}
              <Card className="border-2 border-amber-500/20">
                <CardHeader className="bg-gradient-to-r from-amber-500/5 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <FileText className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle>Diagnosis Codes (ICD-10)</CardTitle>
                      <CardDescription>Medical necessity documentation</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {billingDetail.diagnosisCodes.map((dx) => (
                      <div
                        key={dx.pointer}
                        className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white font-bold rounded flex items-center justify-center">
                          {dx.pointer}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="font-mono text-amber-700 border-amber-300">
                              {dx.code}
                            </Badge>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {dx.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="charges" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="charges">Service Charges</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                  <TabsTrigger value="claim">Claim Info</TabsTrigger>
                </TabsList>

                <TabsContent value="charges" className="mt-6">
                  <Card className="border-2 border-[#1DA68F]/20">
                    <CardHeader className="bg-gradient-to-r from-[#1DA68F]/5 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#1DA68F]/10 rounded-lg">
                          <DollarSign className="w-5 h-5 text-[#1DA68F]" />
                        </div>
                        <CardTitle>Service Charges (CPT Codes)</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>CPT Code</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {billingDetail.charges.map((charge, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <div className="space-y-2">
                                  <div>
                                    <Badge className="bg-[#1DA68F] hover:bg-[#1DA68F]/90 font-mono text-white">
                                      {charge.cptCode}
                                    </Badge>
                                    {charge.modifier && (
                                      <Badge variant="outline" className="ml-2 font-mono text-xs border-blue-300 text-blue-700">
                                        MOD: {charge.modifier}
                                      </Badge>
                                    )}
                                  </div>
                                  {charge.diagnosisPointers && charge.diagnosisPointers.length > 0 && (
                                    <div className="flex items-center gap-1 flex-wrap">
                                      <span className="text-xs text-gray-500">Linked to Dx:</span>
                                      {charge.diagnosisPointers.map((pointer) => (
                                        <Badge
                                          key={pointer}
                                          variant="outline"
                                          className="text-xs bg-amber-50 border-amber-300 text-amber-700"
                                        >
                                          {pointer}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="max-w-xs">
                                {charge.description}
                              </TableCell>
                              <TableCell className="text-right">{charge.quantity}</TableCell>
                              <TableCell className="text-right">
                                ${charge.unitPrice.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                ${charge.total.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-gray-50 dark:bg-gray-900">
                            <TableCell colSpan={4} className="text-right font-semibold">
                              Subtotal
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              ${subtotal.toFixed(2)}
                            </TableCell>
                          </TableRow>
                          {billingDetail.adjustments.map((adj) => (
                            <TableRow key={adj.id}>
                              <TableCell colSpan={4} className="text-right text-sm">
                                {adj.type}
                              </TableCell>
                              <TableCell className="text-right text-sm text-red-600 dark:text-red-400">
                                ${adj.amount.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-[#1DA68F]/10">
                            <TableCell colSpan={4} className="text-right font-semibold text-lg">
                              Total Amount
                            </TableCell>
                            <TableCell className="text-right font-bold text-lg text-[#1DA68F]">
                              ${(subtotal + totalAdjustments).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>

                      {billingDetail.notes && (
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Stethoscope className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                Clinical Notes
                              </h4>
                              <p className="text-sm text-blue-800 dark:text-blue-200">
                                {billingDetail.notes}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payments" className="mt-6">
                  <Card className="border-2 border-green-500/20">
                    <CardHeader className="bg-gradient-to-r from-green-500/5 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <CreditCard className="w-5 h-5 text-green-600" />
                        </div>
                        <CardTitle>Payment History</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Payer</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {billingDetail.payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>
                                {new Date(payment.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </TableCell>
                              <TableCell>{payment.method}</TableCell>
                              <TableCell>{payment.payer}</TableCell>
                              <TableCell className="font-mono text-sm">
                                {payment.referenceNumber}
                              </TableCell>
                              <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                                ${payment.amount.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(payment.status)}>
                                  {payment.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-green-50 dark:bg-green-900/10">
                            <TableCell colSpan={4} className="text-right font-semibold">
                              Total Payments
                            </TableCell>
                            <TableCell className="text-right font-bold text-green-600 dark:text-green-400">
                              ${totalPayments.toFixed(2)}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="claim" className="mt-6">
                  <Card className="border-2 border-purple-500/20">
                    <CardHeader className="bg-gradient-to-r from-purple-500/5 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <CardTitle>Insurance Claim Information</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <div>
                            <p className="font-semibold text-green-900 dark:text-green-100">
                              Claim Approved
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-300">
                              Processed on January 20, 2024
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          Approved
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Claim Number</p>
                          <p className="font-semibold">CLM-2024-001</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Submission Date</p>
                          <p className="font-semibold">January 16, 2024</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Approved Amount</p>
                          <p className="font-semibold text-green-600 dark:text-green-400">
                            $140.00
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Payment Date</p>
                          <p className="font-semibold">January 20, 2024</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-3">Insurance Information</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Provider</p>
                            <p className="font-medium">{billingDetail.insurance.provider}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Policy Number</p>
                            <p className="font-medium font-mono">{billingDetail.insurance.policyNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Group Number</p>
                            <p className="font-medium font-mono">{billingDetail.insurance.groupNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Subscriber</p>
                            <p className="font-medium">{billingDetail.insurance.subscriberName}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Balance Summary */}
              <Card className="border-2 border-[#1DA68F]/30">
                <CardHeader className="bg-gradient-to-r from-[#1DA68F]/5 to-transparent">
                  <CardTitle>Balance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Adjustments</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      ${totalAdjustments.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                    <span className="font-semibold">
                      ${(subtotal + totalAdjustments).toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Paid</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ${totalPayments.toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between pt-2">
                    <span className="font-bold text-lg">Balance Due</span>
                    <span className={`font-bold text-xl ${balance > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                      ${balance.toFixed(2)}
                    </span>
                  </div>
                  {balance > 0 && (
                    <Button className="w-full mt-4 bg-[#1DA68F] hover:bg-[#1DA68F]/90">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Record Payment
                    </Button>
                  )}
                  {balance === 0 && (
                    <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">
                        Paid in Full
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Patient Information */}
              <Card className="border-2 border-blue-500/20">
                <CardHeader className="bg-gradient-to-r from-blue-500/5 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <User className="w-5 h-5" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-6">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Name</p>
                    <p className="font-semibold">{billingDetail.patient.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Patient ID</p>
                    <p className="font-mono text-sm">{billingDetail.patient.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Date of Birth</p>
                    <p>{new Date(billingDetail.patient.dob).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Email</p>
                    <p className="text-sm">{billingDetail.patient.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Phone</p>
                    <p>{billingDetail.patient.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Address</p>
                    <p className="text-sm">{billingDetail.patient.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Provider Information */}
              <Card className="border-2 border-purple-500/20">
                <CardHeader className="bg-gradient-to-r from-purple-500/5 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Provider Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-6">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Provider</p>
                    <p className="font-semibold">{billingDetail.provider.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">NPI</p>
                    <p className="font-mono text-sm">{billingDetail.provider.npi}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Specialty</p>
                    <p>{billingDetail.provider.specialty}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Facility</p>
                    <p>{billingDetail.provider.facility}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Phone</p>
                    <p>{billingDetail.provider.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Address</p>
                    <p className="text-sm">{billingDetail.provider.address}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
