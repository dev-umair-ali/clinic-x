"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateInvoicePDF, type PDFInvoiceData } from "@/lib/utils/pdf-generator";
import {
  ArrowLeft,
  Download,
  Printer,
  Calendar,
  Building2,
  User,
  CreditCard,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  Stethoscope,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface InvoiceLineItem {
  cptCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export default function BillingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;

  // Mock invoice data - in real app, fetch based on invoiceId
  const invoice = {
    id: invoiceId,
    invoiceNumber: "INV-2024-001",
    dateOfService: "January 15, 2024",
    dateIssued: "January 16, 2024",
    dueDate: "February 15, 2024",
    status: "pending" as "paid" | "pending" | "overdue",
    
    // Patient Info
    patient: {
      name: "Emma Wilson",
      patientId: "PT-10234",
      dateOfBirth: "May 15, 1990",
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },

    // Provider Info
    provider: {
      name: "Dr. Sarah Johnson",
      specialty: "Family Medicine",
      npi: "1234567890",
      clinic: "ClinicX Medical Center",
      address: "456 Healthcare Blvd",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      phone: "(555) 123-4567",
    },

    // Insurance Info
    insurance: {
      provider: "Blue Cross Blue Shield",
      policyNumber: "BCBS-123456789",
      groupNumber: "GRP-456789",
      planType: "PPO Plus",
    },

    // Line Items
    lineItems: [
      {
        cptCode: "99213",
        description: "Office Visit - Level 3 (Established Patient, Moderate Complexity)",
        quantity: 1,
        unitPrice: 150.0,
        total: 150.0,
      },
      {
        cptCode: "81002",
        description: "Urinalysis - Non-automated, without microscopy",
        quantity: 1,
        unitPrice: 35.0,
        total: 35.0,
      },
      {
        cptCode: "85025",
        description: "Complete Blood Count (CBC) with automated differential",
        quantity: 1,
        unitPrice: 100.0,
        total: 100.0,
      },
    ],

    // Charges Summary
    subtotal: 285.0,
    insuranceDiscount: 45.0,
    insurancePaid: 200.0,
    patientPaid: 0,
    adjustment: 0,
    yourBalance: 40.0,

    // Diagnosis
    diagnosisCodes: [
      { code: "Z00.00", description: "Encounter for general adult medical examination without abnormal findings" },
      { code: "R53.83", description: "Other fatigue" },
    ],

    // Notes
    notes: "Annual wellness visit with routine laboratory tests. Patient advised to return in 6 months for follow-up.",
  };

  const handleDownloadPDF = () => {
    const pdfData: PDFInvoiceData = {
      invoiceNumber: invoice.invoiceNumber,
      dateOfService: invoice.dateOfService,
      dateCreated: invoice.dateIssued,
      dateDue: invoice.dueDate,
      status: invoice.status,
      patient: {
        name: invoice.patient.name,
        id: invoice.patient.patientId,
        dob: invoice.patient.dateOfBirth,
        address: `${invoice.patient.address}, ${invoice.patient.city}, ${invoice.patient.state} ${invoice.patient.zipCode}`,
      },
      insurance: {
        provider: invoice.insurance.provider,
        policyNumber: invoice.insurance.policyNumber,
        groupNumber: invoice.insurance.groupNumber,
      },
      provider: {
        name: invoice.provider.name,
        npi: invoice.provider.npi,
        specialty: invoice.provider.specialty,
        facility: invoice.provider.clinic,
        phone: invoice.provider.phone,
        address: `${invoice.provider.address}, ${invoice.provider.city}, ${invoice.provider.state} ${invoice.provider.zipCode}`,
      },
      charges: invoice.lineItems.map(item => ({
        cptCode: item.cptCode,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
      diagnosisCodes: invoice.diagnosisCodes.map((diag, idx) => ({
        code: diag.code,
        description: diag.description,
        pointer: idx + 1,
      })),
      subtotal: invoice.subtotal,
      totalAdjustments: invoice.insuranceDiscount,
      totalPayments: invoice.insurancePaid + invoice.patientPaid,
      balance: invoice.yourBalance,
      notes: invoice.notes,
    };
    generateInvoicePDF(pdfData);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "overdue":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
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
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Invoice Details
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {invoice.invoiceNumber} • {invoice.dateOfService}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDF}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
                {invoice.yourBalance > 0 && (
                  <Button
                    size="sm"
                    onClick={() => router.push(`/patient/billing/payment?invoice=${invoice.invoiceNumber}`)}
                    className="gap-2 bg-[#1DA68F] hover:bg-[#1DA68F]/90"
                  >
                    <CreditCard className="w-4 h-4" />
                    Pay ${invoice.yourBalance.toFixed(2)}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Invoice Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                      <Badge className={`${getStatusColor(invoice.status)} px-3 py-1 text-sm font-medium`}>
                        <span className="flex items-center gap-2">
                          {getStatusIcon(invoice.status)}
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Due Date</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {invoice.dueDate}
                      </p>
                    </div>
                  </div>
                  
                  {invoice.status === "overdue" && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
                        <div>
                          <h4 className="text-sm font-semibold text-red-900 dark:text-red-100">Payment Overdue</h4>
                          <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                            This invoice is past due. Please make a payment to avoid any late fees.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Invoice Number</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{invoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date of Service</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{invoice.dateOfService}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date Issued</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{invoice.dateIssued}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Provider Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-[#1DA68F]" />
                    Provider Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Provider</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{invoice.provider.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.provider.specialty}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Facility</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.provider.clinic}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {invoice.provider.address}<br />
                        {invoice.provider.city}, {invoice.provider.state} {invoice.provider.zipCode}<br />
                        {invoice.provider.phone}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">NPI Number</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.provider.npi}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#1DA68F]" />
                    Service Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">CPT Code</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Description</th>
                          <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Qty</th>
                          <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Unit Price</th>
                          <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.lineItems.map((item, index) => (
                          <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-4 px-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                {item.cptCode}
                              </span>
                            </td>
                            <td className="py-4 px-2 text-sm text-gray-900 dark:text-gray-100">{item.description}</td>
                            <td className="py-4 px-2 text-center text-sm text-gray-900 dark:text-gray-100">{item.quantity}</td>
                            <td className="py-4 px-2 text-right text-sm text-gray-900 dark:text-gray-100">${item.unitPrice.toFixed(2)}</td>
                            <td className="py-4 px-2 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">${item.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Charges Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">${invoice.subtotal.toFixed(2)}</span>
                      </div>
                      {invoice.insuranceDiscount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Insurance Discount</span>
                          <span className="font-medium text-green-600 dark:text-green-400">-${invoice.insuranceDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Insurance Paid</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">${invoice.insurancePaid.toFixed(2)}</span>
                      </div>
                      {invoice.patientPaid > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">You Paid</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">${invoice.patientPaid.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Your Balance</span>
                        <span className="font-bold text-[#1DA68F]">${invoice.yourBalance.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Diagnosis Codes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#1DA68F]" />
                    Diagnosis Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {invoice.diagnosisCodes.map((diagnosis, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                          {diagnosis.code}
                        </span>
                        <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{diagnosis.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Clinical Notes */}
              {invoice.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Clinical Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{invoice.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Patient Information */}
              <Card className="border-2 border-purple-500/20">
                <CardHeader className="bg-gradient-to-r from-purple-500/5 to-transparent">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Name</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{invoice.patient.name}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Patient ID</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.patient.patientId}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date of Birth</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.patient.dateOfBirth}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Address</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {invoice.patient.address}<br />
                      {invoice.patient.city}, {invoice.patient.state} {invoice.patient.zipCode}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Information */}
              <Card className="border-2 border-blue-500/20">
                <CardHeader className="bg-gradient-to-r from-blue-500/5 to-transparent">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Insurance Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Provider</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{invoice.insurance.provider}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Policy Number</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.insurance.policyNumber}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Group Number</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.insurance.groupNumber}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Plan Type</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{invoice.insurance.planType}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    Questions?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    If you have questions about this invoice or need help understanding your charges, we're here to help.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <Building2 className="w-4 h-4" />
                      Contact Billing Department
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <FileText className="w-4 h-4" />
                      Request Itemized Bill
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <Shield className="w-4 h-4" />
                      Insurance Questions
                    </Button>
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
