"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { doctorBillingAPI, type Charge } from "@/lib/api/billing";
import {
  ArrowLeft,
  Download,
  Send,
  DollarSign,
  Calendar,
  User,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  Receipt,
  Loader2,
  Mail,
  MessageSquare,
  Building,
  Phone,
  MapPin,
  Stethoscope,
  Tag,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface ChargeDetailsProps {
  chargeId: string;
}

export default function ChargeDetailsIntegrated({ chargeId }: ChargeDetailsProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [charge, setCharge] = useState<Charge | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Dialog states
  const [discountOpen, setDiscountOpen] = useState(false);
  const [discountAmount, setDiscountAmount] = useState("");
  const [discountReason, setDiscountReason] = useState("");

  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderMethod, setReminderMethod] = useState<"email" | "sms" | "portal">("email");

  useEffect(() => {
    if (chargeId) {
      fetchChargeDetails();
      fetchPayments();
    }
  }, [chargeId]);

  const fetchChargeDetails = async () => {
    setLoading(true);
    try {
      const result = await doctorBillingAPI.getCharge(chargeId);
      if (result.success && result.data) {
        setCharge(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load charge details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching charge:", error);
      toast({
        title: "Error",
        description: "Failed to load charge details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const result = await doctorBillingAPI.listChargePayments(chargeId);
      if (result.success && result.data) {
        setPayments(result.data);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleSubmitToInsurance = async () => {
    if (!charge?.insuranceInfo) {
      toast({
        title: "Cannot Submit",
        description: "No insurance information available",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      const result = await doctorBillingAPI.submitToInsurance(chargeId);
      if (result.success) {
        toast({
          title: "Success",
          description: "Charge submitted to insurance successfully",
        });
        fetchChargeDetails();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit to insurance",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting to insurance:", error);
      toast({
        title: "Error",
        description: "Failed to submit to insurance",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApplyDiscount = async () => {
    const amount = parseFloat(discountAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid discount amount",
        variant: "destructive",
      });
      return;
    }

    if (!discountReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for the discount",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      const result = await doctorBillingAPI.applyDiscount(
        chargeId,
        amount,
        discountReason
      );
      if (result.success) {
        toast({
          title: "Success",
          description: `Discount of $${amount} applied successfully`,
        });
        setDiscountOpen(false);
        setDiscountAmount("");
        setDiscountReason("");
        fetchChargeDetails();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to apply discount",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error applying discount:", error);
      toast({
        title: "Error",
        description: "Failed to apply discount",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendReminder = async () => {
    setActionLoading(true);
    try {
      const result = await doctorBillingAPI.sendReminder(chargeId, reminderMethod);
      if (result.success) {
        toast({
          title: "Success",
          description: `Payment reminder sent via ${reminderMethod}`,
        });
        setReminderOpen(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send reminder",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast({
        title: "Error",
        description: "Failed to send reminder",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this charge?")) return;

    setActionLoading(true);
    try {
      const result = await doctorBillingAPI.deleteCharge(chargeId);
      if (result.success) {
        toast({
          title: "Success",
          description: "Charge deleted successfully",
        });
        router.push("/doctor/patients-billing/list");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete charge",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting charge:", error);
      toast({
        title: "Error",
        description: "Failed to delete charge",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[hsl(var(--background))]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!charge) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[hsl(var(--background))]">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Charge Not Found</h2>
          <Button onClick={() => router.push("/doctor/patients-billing/list")}>
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  const patient = charge.patientId as any;

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[hsl(var(--background))]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/doctor/patients-billing/list")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Billing
          </Button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-1">{charge.invoiceNumber}</h1>
              <p className="text-muted-foreground">
                Created on {new Date(charge.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              {charge.status === "draft" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/doctor/patients-billing/edit/${chargeId}`)
                  }
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Status Banner */}
        {charge.isOverdue && (
          <Card className="mb-6 border-red-500 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-semibold text-red-900">Payment Overdue</p>
                  <p className="text-sm text-red-700">
                    This invoice is overdue by{" "}
                    {Math.floor(
                      (new Date().getTime() - new Date(charge.dueDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold text-xl">
                    {patient.firstName?.[0]}
                    {patient.lastName?.[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {patient.contactNumber}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {patient.email}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {patient.address?.city}, {patient.address?.state}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  Service Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Visit Type</p>
                    <p className="font-semibold">{charge.visitType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service Date</p>
                    <p className="font-semibold">
                      {new Date(charge.serviceDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Place of Service</p>
                    <p className="font-semibold">{charge.placeOfService}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Doctor</p>
                    <p className="font-semibold">
                      Dr. {charge.doctorId?.firstName} {charge.doctorId?.lastName}
                    </p>
                  </div>
                </div>

                {charge.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{charge.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Charge Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Charge Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {charge.items.map((item, index) => (
                    <div key={index} className="pb-3 border-b last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{item.cptCode}</Badge>
                            <span className="font-semibold">{item.description}</span>
                          </div>
                          {item.diagnosisCodes && item.diagnosisCodes.length > 0 && (
                            <div className="flex items-center gap-2 mt-1">
                              <Tag className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {item.diagnosisCodes.join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${item.totalPrice.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} × ${item.unitPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${charge.totalCharge.toFixed(2)}</span>
                    </div>
                    {charge.discountAmount && charge.discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-${charge.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {charge.taxAmount && charge.taxAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>${charge.taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${charge.totalCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Paid</span>
                      <span>
                        ${(charge.totalCharge - charge.balance).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-xl text-red-600">
                      <span>Balance Due</span>
                      <span>${charge.balance.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insurance Information */}
            {charge.insuranceInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Insurance Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Provider</p>
                      <p className="font-semibold">
                        {charge.insuranceInfo.providerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Policy Number</p>
                      <p className="font-semibold">
                        {charge.insuranceInfo.policyNumber}
                      </p>
                    </div>
                    {charge.insuranceInfo.groupNumber && (
                      <div>
                        <p className="text-sm text-muted-foreground">Group Number</p>
                        <p className="font-semibold">
                          {charge.insuranceInfo.groupNumber}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Coverage Level</p>
                      <p className="font-semibold capitalize">
                        {charge.insuranceInfo.coverageLevel}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment History */}
            {payments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {payments.map((payment, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded"
                      >
                        <div>
                          <p className="font-semibold">${payment.amount.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.paymentDate).toLocaleDateString()} •{" "}
                            {payment.paymentMethod}
                          </p>
                        </div>
                        <Badge
                          variant={
                            payment.status === "completed" ? "default" : "secondary"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Charge Status</p>
                  <Badge className="capitalize">{charge.status.replace("_", " ")}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Payment Status</p>
                  <Badge
                    variant={charge.paymentStatus === "paid" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {charge.paymentStatus.replace("_", " ")}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                  <p className="font-semibold">
                    {new Date(charge.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {charge.insuranceInfo &&
                  charge.status !== "submitted_to_insurance" &&
                  charge.status !== "paid" && (
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={handleSubmitToInsurance}
                      disabled={actionLoading}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit to Insurance
                    </Button>
                  )}

                {charge.balance > 0 && (
                  <>
                    <Dialog open={discountOpen} onOpenChange={setDiscountOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full justify-start" variant="outline">
                          <Tag className="w-4 h-4 mr-2" />
                          Apply Discount
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Apply Discount</DialogTitle>
                          <DialogDescription>
                            Apply a discount to this charge
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Discount Amount</Label>
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={discountAmount}
                              onChange={(e) => setDiscountAmount(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>Reason</Label>
                            <Textarea
                              placeholder="Reason for discount..."
                              value={discountReason}
                              onChange={(e) => setDiscountReason(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setDiscountOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleApplyDiscount}
                            disabled={actionLoading}
                          >
                            Apply Discount
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={reminderOpen} onOpenChange={setReminderOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full justify-start" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send Payment Reminder
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Send Payment Reminder</DialogTitle>
                          <DialogDescription>
                            Choose how to send the payment reminder
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Method</Label>
                            <Select
                              value={reminderMethod}
                              onValueChange={(value: any) => setReminderMethod(value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="sms">SMS</SelectItem>
                                <SelectItem value="portal">Patient Portal</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setReminderOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSendReminder}
                            disabled={actionLoading}
                          >
                            Send Reminder
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}

                {charge.status === "draft" && (
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={handleDelete}
                    disabled={actionLoading}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Draft
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Charge ID</span>
                  <span className="font-mono">{charge.chargeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span>{charge.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(charge.createdAt).toLocaleDateString()}</span>
                </div>
                {charge.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span>{new Date(charge.updatedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
