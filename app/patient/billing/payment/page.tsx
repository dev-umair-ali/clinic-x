"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  CreditCard,
  DollarSign,
  Lock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Shield,
  Building2,
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
import { Separator } from "@/components/ui/separator";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceParam = searchParams.get("invoice");

  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentType, setPaymentType] = useState<"full" | "partial" | "custom">("full");
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"new" | "saved">("new");
  const [savedCard, setSavedCard] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  // Mock invoice data
  const invoice = {
    invoiceNumber: invoiceParam || "INV-2024-001",
    patientName: "Emma Wilson",
    dateOfService: "January 15, 2024",
    provider: "Dr. Sarah Johnson",
    totalBalance: 295.00,
    minimumPayment: 50.00,
  };

  // Mock saved cards
  const savedCards = [
    { id: "1", last4: "4532", brand: "Visa", expiry: "12/25" },
    { id: "2", last4: "8901", brand: "Mastercard", expiry: "06/26" },
  ];

  useEffect(() => {
    if (paymentType === "full") {
      setPaymentAmount(invoice.totalBalance.toFixed(2));
    } else if (paymentType === "partial") {
      setPaymentAmount(invoice.minimumPayment.toFixed(2));
    } else {
      setPaymentAmount(customAmount);
    }
  }, [paymentType, customAmount, invoice.totalBalance, invoice.minimumPayment]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.replace(/\//g, "").length <= 4) {
      setExpiryDate(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, "");
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setPaymentSuccess(true);

    // Redirect after success
    setTimeout(() => {
      router.push("/patient/billing");
    }, 3000);
  };

  const isFormValid = () => {
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0 || amount > invoice.totalBalance) {
      return false;
    }

    if (paymentMethod === "new") {
      return (
        cardNumber.replace(/\s/g, "").length === 16 &&
        cardName.length > 0 &&
        expiryDate.length === 5 &&
        cvv.length >= 3 &&
        zipCode.length >= 5
      );
    } else {
      return savedCard !== "";
    }
  };

  if (paymentSuccess) {
    return (
      <ProtectedRoute allowedRoles={["patient"]}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your payment of ${parseFloat(paymentAmount).toFixed(2)} has been processed successfully.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Invoice</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Amount Paid</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">${parseFloat(paymentAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Remaining Balance</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    ${(invoice.totalBalance - parseFloat(paymentAmount)).toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                A confirmation email has been sent to your registered email address.
              </p>
              <Button
                onClick={() => router.push("/patient/billing")}
                className="w-full bg-[#1DA68F] hover:bg-[#1DA68F]/90"
              >
                Return to Billing
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

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
                    Make a Payment
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Secure payment processing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Amount Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#1DA68F]" />
                    Payment Amount
                  </CardTitle>
                  <CardDescription>Choose how much you'd like to pay</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup value={paymentType} onValueChange={(value: any) => setPaymentType(value)}>
                    <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#1DA68F] transition-colors cursor-pointer">
                      <RadioGroupItem value="full" id="full" />
                      <Label htmlFor="full" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">Pay Full Balance</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Clear your entire balance</p>
                          </div>
                          <p className="text-lg font-bold text-[#1DA68F]">${invoice.totalBalance.toFixed(2)}</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#1DA68F] transition-colors cursor-pointer">
                      <RadioGroupItem value="partial" id="partial" />
                      <Label htmlFor="partial" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">Minimum Payment</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pay the minimum amount due</p>
                          </div>
                          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">${invoice.minimumPayment.toFixed(2)}</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#1DA68F] transition-colors cursor-pointer">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Custom Amount</p>
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            className="max-w-xs"
                            min={0}
                            max={invoice.totalBalance}
                            step={0.01}
                            disabled={paymentType !== "custom"}
                          />
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#1DA68F]" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>Select or add a payment method</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {savedCards.length > 0 && (
                    <>
                      <div className="space-y-3">
                        <Label>Saved Payment Methods</Label>
                        <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                          {savedCards.map((card) => (
                            <div
                              key={card.id}
                              className="flex items-center space-x-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#1DA68F] transition-colors cursor-pointer"
                            >
                              <RadioGroupItem
                                value="saved"
                                id={`card-${card.id}`}
                                onClick={() => setSavedCard(card.id)}
                              />
                              <Label htmlFor={`card-${card.id}`} className="flex-1 cursor-pointer">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-white text-xs font-semibold">
                                      {card.brand}
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {card.brand} •••• {card.last4}
                                      </p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">Expires {card.expiry}</p>
                                    </div>
                                  </div>
                                </div>
                              </Label>
                            </div>
                          ))}

                          <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#1DA68F] transition-colors cursor-pointer">
                            <RadioGroupItem value="new" id="new-card" />
                            <Label htmlFor="new-card" className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded flex items-center justify-center">
                                  <CreditCard className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-gray-100">Add New Card</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Use a different payment method</p>
                                </div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <Separator />
                    </>
                  )}

                  {paymentMethod === "new" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="JOHN DOE"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={handleExpiryDateChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            type="password"
                            value={cvv}
                            onChange={handleCvvChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            placeholder="12345"
                            value={zipCode}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/gi, "");
                              if (value.length <= 5) setZipCode(value);
                            }}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="saveCard"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="saveCard" className="text-sm cursor-pointer">
                          Save this card for future payments
                        </Label>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    onClick={handleProcessPayment}
                    disabled={!isFormValid() || isProcessing}
                    className="w-full bg-[#1DA68F] hover:bg-[#1DA68F]/90 h-12 text-lg"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing Payment...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Pay ${parseFloat(paymentAmount || "0").toFixed(2)}
                      </span>
                    )}
                  </Button>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                    Your payment information is encrypted and secure
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Order Summary */}
            <div className="space-y-6">
              {/* Invoice Summary */}
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Invoice Number</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{invoice.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Patient</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{invoice.patientName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Date of Service</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{invoice.dateOfService}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Provider</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{invoice.provider}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Total Balance</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">${invoice.totalBalance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Amount to Pay</span>
                      <span className="font-bold text-[#1DA68F] text-lg">${parseFloat(paymentAmount || "0").toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Remaining Balance</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        ${(invoice.totalBalance - parseFloat(paymentAmount || "0")).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Secure Payment</h4>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Your payment is protected with bank-level 256-bit SSL encryption. We never store your complete card information.
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Lock className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-900 dark:text-blue-100">PCI DSS Compliant</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Building2 className="w-4 h-4" />
                    Contact Billing Support
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Calendar className="w-4 h-4" />
                    Set Up Payment Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
