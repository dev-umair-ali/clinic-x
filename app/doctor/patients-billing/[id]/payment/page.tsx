"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Save,
  CreditCard,
  DollarSign,
  Calendar,
  FileText,
  User,
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

export default function RecordPaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    paymentAmount: "",
    paymentMethod: "",
    paymentDate: new Date().toISOString().split("T")[0],
    referenceNumber: "",
    notes: "",
    cardLastFour: "",
    checkNumber: "",
    bankName: "",
  });

  // Sample invoice data
  const invoice = {
    id: "INV-2024-001",
    patientName: "Emma Wilson",
    patientId: "PT-10234",
    dateOfService: "2024-01-15",
    totalAmount: 175.0,
    paidAmount: 160.0,
    balance: 15.0,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.back();
  };

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                  Record Payment
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add a payment to invoice {invoice.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Payment Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                    <CardDescription>
                      Enter the payment details and method
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentAmount">Payment Amount *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="paymentAmount"
                            name="paymentAmount"
                            type="number"
                            step="0.01"
                            min="0"
                            max={invoice.balance}
                            value={formData.paymentAmount}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            className="pl-9"
                            required
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Balance due: ${invoice.balance.toFixed(2)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentDate">Payment Date *</Label>
                        <Input
                          id="paymentDate"
                          name="paymentDate"
                          type="date"
                          value={formData.paymentDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method *</Label>
                      <Select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, paymentMethod: value }))
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="debit_card">Debit Card</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="insurance">Insurance Payment</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Conditional fields based on payment method */}
                    {(formData.paymentMethod === "credit_card" || formData.paymentMethod === "debit_card") && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardLastFour">Card Last 4 Digits</Label>
                          <Input
                            id="cardLastFour"
                            name="cardLastFour"
                            value={formData.cardLastFour}
                            onChange={handleInputChange}
                            placeholder="1234"
                            maxLength={4}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="referenceNumber">Transaction ID</Label>
                          <Input
                            id="referenceNumber"
                            name="referenceNumber"
                            value={formData.referenceNumber}
                            onChange={handleInputChange}
                            placeholder="TXN-123456"
                          />
                        </div>
                      </div>
                    )}

                    {formData.paymentMethod === "check" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="checkNumber">Check Number</Label>
                          <Input
                            id="checkNumber"
                            name="checkNumber"
                            value={formData.checkNumber}
                            onChange={handleInputChange}
                            placeholder="1234"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleInputChange}
                            placeholder="Bank name"
                          />
                        </div>
                      </div>
                    )}

                    {(formData.paymentMethod === "bank_transfer" || formData.paymentMethod === "insurance") && (
                      <div className="space-y-2">
                        <Label htmlFor="referenceNumber">Reference Number</Label>
                        <Input
                          id="referenceNumber"
                          name="referenceNumber"
                          value={formData.referenceNumber}
                          onChange={handleInputChange}
                          placeholder="Reference or confirmation number"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="notes">Payment Notes</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Add any additional notes about this payment..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Guidelines */}
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                          Payment Recording Guidelines
                        </h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• Ensure the payment amount does not exceed the balance due</li>
                          <li>• Always obtain and record reference/confirmation numbers</li>
                          <li>• For cash payments, ensure proper receipt documentation</li>
                          <li>• Insurance payments should match EOB documentation</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Invoice Summary */}
              <div className="space-y-6">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Invoice Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Invoice Number</p>
                      <p className="font-mono font-semibold">{invoice.id}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Patient</p>
                      <p className="font-semibold">{invoice.patientName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.patientId}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Service Date</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          {new Date(invoice.dateOfService).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
                        <span className="font-semibold">${invoice.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Already Paid</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          -${invoice.paidAmount.toFixed(2)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-bold">Balance Due</span>
                        <span className="font-bold text-lg text-red-600 dark:text-red-400">
                          ${invoice.balance.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {formData.paymentAmount && parseFloat(formData.paymentAmount) > 0 && (
                      <>
                        <Separator />
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            New Balance After Payment
                          </p>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                            ${(invoice.balance - parseFloat(formData.paymentAmount)).toFixed(2)}
                          </p>
                        </div>
                      </>
                    )}
                    
                    <div className="pt-4 space-y-2">
                      <Button
                        type="submit"
                        className="w-full bg-[#1DA68F] hover:bg-[#1DA68F]/90"
                        disabled={!formData.paymentAmount || !formData.paymentMethod}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Record Payment
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
