"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateClaimPDF, type PDFClaimData } from "@/lib/utils/pdf-generator";
import { claimsAPI, type InsuranceClaim } from "@/lib/api/billing";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  Building2,
  DollarSign,
  AlertTriangle,
  Mail,
  Phone,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ClaimDetailPage({ params }: { params: { claimId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [claim, setClaim] = useState<InsuranceClaim | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch claim data on mount
  useEffect(() => {
    fetchClaim();
  }, [params.claimId]);

  const fetchClaim = async () => {
    try {
      setLoading(true);
      const result = await claimsAPI.getClaim(params.claimId);
      
      if (result.success && result.data) {
        setClaim(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load claim details",
          variant: "destructive",
        });
        router.push('/doctor/patients-billing/claims');
      }
    } catch (error) {
      console.error('Error fetching claim:', error);
      toast({
        title: "Error",
        description: "Failed to load claim details",
        variant: "destructive",
      });
      router.push('/doctor/patients-billing/claims');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </ProtectedRoute>
    );
  }

  // Not found state
  if (!claim) {
    return (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <XCircle className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Claim Not Found</h2>
          <p className="text-gray-600 mb-4">The claim you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/doctor/patients-billing/claims')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Claims
          </Button>
        </div>
      </ProtectedRoute>
    );
  }

  // Transform claim data for display
  const patientName = typeof claim.patientId === 'object' && claim.patientId 
    ? `${claim.patientId.firstName || ''} ${claim.patientId.lastName || ''}`.trim()
    : 'Unknown Patient';

  const claimDetail = {
    claimNumber: claim.claimNumber || claim.claimId || params.claimId,
    invoiceNumber: claim.chargeId || 'N/A',
    status: claim.status,
    submissionDate: claim.submissionDate ? new Date(claim.submissionDate).toISOString().split('T')[0] : claim.submittedDate ? new Date(claim.submittedDate).toISOString().split('T')[0] : 'N/A',
    dateOfService: claim.serviceDate ? new Date(claim.serviceDate).toISOString().split('T')[0] : 'N/A',
    lastUpdate: claim.updatedAt ? new Date(claim.updatedAt).toISOString().split('T')[0] : 'N/A',
    responseDate: claim.processedDate ? new Date(claim.processedDate).toISOString().split('T')[0] : claim.updatedAt ? new Date(claim.updatedAt).toISOString().split('T')[0] : 'N/A',
    patient: {
      name: patientName,
      id: typeof claim.patientId === 'object' && claim.patientId?._id 
        ? claim.patientId._id.slice(-6)
        : typeof claim.patientId === 'string' ? claim.patientId.slice(-6) : 'N/A',
      dob: typeof claim.patientId === 'object' && claim.patientId?.dateOfBirth
        ? new Date(claim.patientId.dateOfBirth).toISOString().split('T')[0]
        : 'N/A',
      email: typeof claim.patientId === 'object' ? claim.patientId?.email || 'N/A' : 'N/A',
      phone: typeof claim.patientId === 'object' ? claim.patientId?.phone || 'N/A' : 'N/A',
      address: typeof claim.patientId === 'object' ? claim.patientId?.address || 'N/A' : 'N/A',
    },
    insurance: {
      provider: claim.insuranceProvider?.name || 'Unknown',
      policyNumber: 'N/A', // Not in claim schema
      groupNumber: 'N/A', // Not in claim schema
      subscriberName: patientName,
      relationship: 'Self', // Default
      phone: claim.insuranceProvider?.phone || 'N/A',
      address: claim.insuranceProvider?.address || 'N/A',
    },
    provider: {
      name: typeof claim.doctorId === 'object' && claim.doctorId
        ? `Dr. ${(claim.doctorId as any).firstName || ''} ${(claim.doctorId as any).lastName || ''}`.trim()
        : 'Unknown Provider',
      npi: typeof claim.doctorId === 'object' ? (claim.doctorId as any)?.npi || 'N/A' : 'N/A',
      taxId: 'N/A', // Not in schema
      specialty: typeof claim.doctorId === 'object' ? (claim.doctorId as any)?.specialty || 'N/A' : 'N/A',
      facility: typeof claim.clinicId === 'object' && claim.clinicId
        ? (claim.clinicId as any).name || 'ClinicX Medical Center'
        : 'ClinicX Medical Center',
      phone: typeof claim.clinicId === 'object' ? (claim.clinicId as any)?.phone || 'N/A' : 'N/A',
      address: typeof claim.clinicId === 'object' ? (claim.clinicId as any)?.address || 'N/A' : 'N/A',
    },
    charges: claim.procedureCodes?.map((item, index) => ({
      lineNumber: index + 1,
      cptCode: item.cptCode || 'N/A',
      description: item.description || 'N/A',
      quantity: item.quantity || 1,
      billedAmount: item.chargedAmount || 0,
      allowedAmount: item.allowedAmount || 0,
      approvedAmount: item.paidAmount || 0,
      deniedAmount: (item.chargedAmount || 0) - (item.paidAmount || 0),
      adjustmentReason: item.adjustmentAmount ? 'Insurance adjustment' : 'N/A',
      denialCode: undefined,
    })) || [],
    paymentInfo: {
      checkNumber: 'N/A', // Not in schema
      checkDate: claim.processedDate ? new Date(claim.processedDate).toISOString().split('T')[0] : 'N/A',
      paymentMethod: 'N/A', // Not in schema
      amountPaid: claim.paidAmount || 0,
    },
    adjustments: [] as Array<{type: string; amount: number; reason: string}>, // Not in schema - using procedureCodes adjustmentAmount instead
    remarkCodes: [] as Array<{code: string; description: string}>, // Not in schema
    timeline: [
      {
        date: claim.serviceDate ? new Date(claim.serviceDate).toISOString().split('T')[0] : 'N/A',
        event: "Service Provided",
        description: "Patient received medical services",
        icon: "calendar",
      },
      {
        date: claim.submissionDate ? new Date(claim.submissionDate).toISOString().split('T')[0] : claim.submittedDate ? new Date(claim.submittedDate).toISOString().split('T')[0] : 'N/A',
        event: "Claim Submitted",
        description: `Claim electronically submitted to ${claim.insuranceProvider?.name || 'insurance'}`,
        icon: "send",
      },
      ...(claim.processedDate ? [{
        date: new Date(claim.processedDate).toISOString().split('T')[0],
        event: "Claim Processed",
        description: "EOB generated, claim processed",
        icon: "file",
      }] : []),
      ...(claim.paidAmount && claim.paidAmount > 0 ? [{
        date: claim.updatedAt ? new Date(claim.updatedAt).toISOString().split('T')[0] : 'N/A',
        event: "Payment Issued",
        description: `Payment of $${claim.paidAmount.toFixed(2)} processed`,
        icon: "dollar",
      }] : []),
    ],
    diagnosis: {
      primary: claim.diagnosisCodes?.[0] || 'N/A',
      secondary: claim.diagnosisCodes?.slice(1) || [],
    },
  };

  const totalBilled = claimDetail.charges.reduce((sum, c) => sum + c.billedAmount, 0);
  const totalAllowed = claimDetail.charges.reduce((sum, c) => sum + c.allowedAmount, 0);
  const totalApproved = claimDetail.charges.reduce((sum, c) => sum + c.approvedAmount, 0);
  const totalDenied = claimDetail.charges.reduce((sum, c) => sum + c.deniedAmount, 0);

  const handleDownloadPDF = () => {
    const pdfData: PDFClaimData = {
      claimNumber: claimDetail.claimNumber,
      invoiceNumber: claimDetail.invoiceNumber,
      submissionDate: claimDetail.submissionDate,
      responseDate: claimDetail.responseDate || claimDetail.lastUpdate,
      dateOfService: claimDetail.dateOfService,
      dateCreated: claimDetail.submissionDate,
      status: claimDetail.status,
      patient: claimDetail.patient,
      insurance: claimDetail.insurance,
      provider: claimDetail.provider,
      charges: claimDetail.charges.map(charge => ({
        cptCode: charge.cptCode,
        description: charge.description,
        quantity: charge.quantity,
        unitPrice: charge.billedAmount / charge.quantity,
        total: charge.billedAmount,
      })),
      payments: [{
        date: claimDetail.paymentInfo.checkDate,
        method: claimDetail.paymentInfo.paymentMethod,
        payer: claimDetail.insurance.provider,
        amount: claimDetail.paymentInfo.amountPaid,
        referenceNumber: claimDetail.paymentInfo.checkNumber,
      }],
      remarkCodes: claimDetail.remarkCodes,
      timeline: claimDetail.timeline,
      subtotal: totalBilled,
      totalPayments: claimDetail.paymentInfo.amountPaid,
      totalAdjustments: totalBilled - totalApproved - totalDenied,
      balance: totalBilled - claimDetail.paymentInfo.amountPaid - (totalBilled - totalApproved - totalDenied),
    };

    generateClaimPDF(pdfData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "partially_approved":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "partially_approved":
        return <AlertTriangle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTimelineIcon = (iconType: string) => {
    switch (iconType) {
      case "calendar":
        return <Calendar className="w-5 h-5" />;
      case "send":
        return <Send className="w-5 h-5" />;
      case "check":
        return <CheckCircle className="w-5 h-5" />;
      case "file":
        return <FileText className="w-5 h-5" />;
      case "dollar":
        return <DollarSign className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
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
                Back to Claims
              </Button>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {claimDetail.claimNumber}
                    </h1>
                    <Badge className={`${getStatusColor(claimDetail.status)} flex items-center gap-1`}>
                      {getStatusIcon(claimDetail.status)}
                      <span className="capitalize">
                        {claimDetail.status.replace("_", " ")}
                      </span>
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Submitted: {new Date(claimDetail.submissionDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Check Status
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="claim-content">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="details">Claim Details</TabsTrigger>
                  <TabsTrigger value="payment">Payment Info</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Service Charges & EOB</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Line</TableHead>
                              <TableHead>CPT Code</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="text-right">Billed</TableHead>
                              <TableHead className="text-right">Allowed</TableHead>
                              <TableHead className="text-right">Approved</TableHead>
                              <TableHead className="text-right">Denied</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {claimDetail.charges.map((charge) => (
                              <TableRow key={charge.lineNumber}>
                                <TableCell>{charge.lineNumber}</TableCell>
                                <TableCell>
                                  <Badge variant="secondary" className="font-mono text-xs">
                                    {charge.cptCode}
                                  </Badge>
                                </TableCell>
                                <TableCell className="max-w-xs">
                                  {charge.description}
                                  {charge.adjustmentReason && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                      {charge.adjustmentReason}
                                      {charge.denialCode && ` (${charge.denialCode})`}
                                    </p>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  ${charge.billedAmount.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                  ${charge.allowedAmount.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <span className="font-semibold text-green-600 dark:text-green-400">
                                    ${charge.approvedAmount.toFixed(2)}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  {charge.deniedAmount > 0 ? (
                                    <span className="font-semibold text-red-600 dark:text-red-400">
                                      ${charge.deniedAmount.toFixed(2)}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400">--</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="font-semibold">
                              <TableCell colSpan={3}>Total</TableCell>
                              <TableCell className="text-right">
                                ${totalBilled.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right">
                                ${totalAllowed.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right text-green-600 dark:text-green-400">
                                ${totalApproved.toFixed(2)}
                              </TableCell>
                              <TableCell className="text-right text-red-600 dark:text-red-400">
                                ${totalDenied.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>

                      <Separator className="my-6" />

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Diagnosis Codes</h4>
                          <p className="text-sm">
                            <span className="font-medium">Primary:</span>{" "}
                            {claimDetail.diagnosis.primary}
                          </p>
                          {claimDetail.diagnosis.secondary.length > 0 && (
                            <div className="mt-2">
                              <span className="font-medium text-sm">Secondary:</span>
                              <ul className="text-sm space-y-1 mt-1">
                                {claimDetail.diagnosis.secondary.map((diag, idx) => (
                                  <li key={idx}>• {diag}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {claimDetail.remarkCodes.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Remark Codes</h4>
                            <div className="space-y-2">
                              {claimDetail.remarkCodes.map((code, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-2 text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded"
                                >
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {code.code}
                                  </Badge>
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {code.description}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payment" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Payment Method
                          </p>
                          <p className="font-semibold mt-1">
                            {claimDetail.paymentInfo.paymentMethod}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Reference Number
                          </p>
                          <p className="font-mono font-semibold mt-1">
                            {claimDetail.paymentInfo.checkNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Payment Date
                          </p>
                          <p className="font-semibold mt-1">
                            {new Date(claimDetail.paymentInfo.checkDate).toLocaleDateString(
                              "en-US",
                              { month: "long", day: "numeric", year: "numeric" }
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Amount Paid
                          </p>
                          <p className="font-bold text-lg text-green-600 dark:text-green-400 mt-1">
                            ${claimDetail.paymentInfo.amountPaid.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-3">Adjustments</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Type</TableHead>
                              <TableHead>Reason</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {claimDetail.adjustments.map((adj, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{adj.type}</TableCell>
                                <TableCell className="text-sm">{adj.reason}</TableCell>
                                <TableCell className="text-right font-semibold text-red-600 dark:text-red-400">
                                  ${adj.amount.toFixed(2)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <Separator />

                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                          Payment Breakdown
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Total Billed</span>
                            <span className="font-semibold">${totalBilled.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Allowed Amount</span>
                            <span className="font-semibold">${totalAllowed.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-red-600 dark:text-red-400">
                            <span>Adjustments</span>
                            <span className="font-semibold">
                              ${claimDetail.adjustments
                                .reduce((sum, adj) => sum + adj.amount, 0)
                                .toFixed(2)}
                            </span>
                          </div>
                          <Separator />
                          <div className="flex justify-between text-lg font-bold text-green-600 dark:text-green-400">
                            <span>Payment Received</span>
                            <span>${claimDetail.paymentInfo.amountPaid.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Claim Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />
                        <div className="space-y-6">
                          {claimDetail.timeline.map((item, idx) => (
                            <div key={idx} className="relative flex gap-4">
                              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center relative z-10">
                                <div className="text-blue-600 dark:text-blue-400">
                                  {getTimelineIcon(item.icon)}
                                </div>
                              </div>
                              <div className="flex-1 pt-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                    {item.event}
                                  </h4>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(item.date).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Financial Summary */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Billed Amount</span>
                    <span className="font-semibold">${totalBilled.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Allowed Amount</span>
                    <span className="font-semibold">${totalAllowed.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Approved</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ${totalApproved.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Denied</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      ${totalDenied.toFixed(2)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Payment Received</span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      ${claimDetail.paymentInfo.amountPaid.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                    <p className="font-semibold">{claimDetail.patient.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Patient ID</p>
                    <p className="font-mono">{claimDetail.patient.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                    <p>{new Date(claimDetail.patient.dob).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-sm">{claimDetail.patient.phone}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-sm">{claimDetail.patient.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Insurance Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Provider</p>
                    <p className="font-semibold">{claimDetail.insurance.provider}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Policy Number</p>
                    <p className="font-mono">{claimDetail.insurance.policyNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Group Number</p>
                    <p className="font-mono">{claimDetail.insurance.groupNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Subscriber</p>
                    <p>{claimDetail.insurance.subscriberName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ({claimDetail.insurance.relationship})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="text-sm">{claimDetail.insurance.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Provider Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Provider Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Provider</p>
                    <p className="font-semibold">{claimDetail.provider.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">NPI</p>
                    <p className="font-mono">{claimDetail.provider.npi}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tax ID</p>
                    <p className="font-mono">{claimDetail.provider.taxId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Specialty</p>
                    <p>{claimDetail.provider.specialty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Facility</p>
                    <p>{claimDetail.provider.facility}</p>
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
