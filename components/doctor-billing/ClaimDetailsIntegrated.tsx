"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { claimsAPI, type InsuranceClaim } from "@/lib/api/billing";
import {
  ArrowLeft,
  Download,
  Send,
  FileText,
  Calendar,
  User,
  Building,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Loader2,
  Receipt,
  Tag,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Separator } from "@/components/ui/separator";

interface ClaimDetailsProps {
  claimId: string;
}

export default function ClaimDetailsIntegrated({ claimId }: ClaimDetailsProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [claim, setClaim] = useState<InsuranceClaim | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Dialog states
  const [submitOpen, setSubmitOpen] = useState(false);
  const [submissionMethod, setSubmissionMethod] = useState<"electronic" | "paper" | "manual">("electronic");
  const [submissionNotes, setSubmissionNotes] = useState("");

  const [appealOpen, setAppealOpen] = useState(false);
  const [appealReason, setAppealReason] = useState("");
  const [appealDocuments, setAppealDocuments] = useState("");

  useEffect(() => {
    if (claimId) {
      fetchClaimDetails();
    }
  }, [claimId]);

  const fetchClaimDetails = async () => {
    setLoading(true);
    try {
      const result = await claimsAPI.getClaim(claimId);
      if (result.success && result.data) {
        setClaim(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load claim details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching claim:", error);
      toast({
        title: "Error",
        description: "Failed to load claim details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitClaim = async () => {
    if (!submissionNotes.trim()) {
      toast({
        title: "Notes Required",
        description: "Please provide submission notes",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      const result = await claimsAPI.submitClaim(claimId, {
        submissionMethod,
        notes: submissionNotes,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Claim submitted to insurance successfully",
          variant: "default",
        });
        setSubmitOpen(false);
        setSubmissionNotes("");
        fetchClaimDetails();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit claim",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting claim:", error);
      toast({
        title: "Error",
        description: "Failed to submit claim",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitAppeal = async () => {
    if (!appealReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for the appeal",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      const result = await claimsAPI.submitAppeal(claimId, {
        reason: appealReason,
        supportingDocuments: appealDocuments ? appealDocuments.split(",").map(d => d.trim()) : [],
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Appeal submitted successfully",
          variant: "default",
        });
        setAppealOpen(false);
        setAppealReason("");
        setAppealDocuments("");
        fetchClaimDetails();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit appeal",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting appeal:", error);
      toast({
        title: "Error",
        description: "Failed to submit appeal",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this claim?")) return;

    setActionLoading(true);
    try {
      const result = await claimsAPI.deleteClaim(claimId);
      if (result.success) {
        toast({
          title: "Success",
          description: "Claim deleted successfully",
          variant: "default",
        });
        router.push("/doctor/patients-billing/claims");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete claim",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting claim:", error);
      toast({
        title: "Error",
        description: "Failed to delete claim",
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

  if (!claim) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[hsl(var(--background))]">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Claim Not Found</h2>
          <Button onClick={() => router.push("/doctor/patients-billing/claims")}>
            Back to Claims
          </Button>
        </div>
      </div>
    );
  }

  const patient = claim.patientId as any;
  const statusColor = {
    draft: "bg-gray-500",
    submitted: "bg-blue-500",
    in_review: "bg-yellow-500",
    approved: "bg-green-500",
    denied: "bg-red-500",
    appealed: "bg-purple-500",
    paid: "bg-teal-500",
  }[claim.status];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[hsl(var(--background))]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/doctor/patients-billing/claims")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Claims
          </Button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-1">{claim.claimId}</h1>
              <p className="text-muted-foreground">
                Created on {new Date(claim.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              {claim.status === "draft" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/doctor/patients-billing/claims/edit/${claimId}`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Status Banner */}
        {claim.status === "denied" && claim.denialInfo && (
          <Card className="mb-6 border-red-500 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <div className="flex-1">
                  <p className="font-semibold text-red-900">Claim Denied</p>
                  <p className="text-sm text-red-700">
                    Reason: {claim.denialInfo.denialReason || claim.denialInfo.reasonDescription}
                  </p>
                  {claim.denialInfo.appealDeadline && (
                    <p className="text-sm text-red-700 mt-1">
                      Appeal by: {new Date(claim.denialInfo.appealDeadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {claim.denialInfo.isAppealable && (
                  <Button onClick={() => setAppealOpen(true)} size="sm">
                    Submit Appeal
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {claim.status === "appealed" && claim.appealInfo && (
          <Card className="mb-6 border-purple-500 bg-purple-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-purple-900">Appeal Submitted</p>
                  <p className="text-sm text-purple-700">
                    Submitted on {new Date(claim.appealInfo.appealDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-purple-700">
                    Status: {claim.appealInfo.appealStatus}
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
              <CardContent>
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

            {/* Insurance Information */}
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
                    <p className="font-semibold">{claim.insuranceProvider.name}</p>
                  </div>
                  {claim.insuranceProvider.payerId && (
                    <div>
                      <p className="text-sm text-muted-foreground">Payer ID</p>
                      <p className="font-semibold">{claim.insuranceProvider.payerId}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Claim Type</p>
                    <p className="font-semibold capitalize">{claim.claimType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service Date</p>
                    <p className="font-semibold">
                      {new Date(claim.serviceDate).toLocaleDateString()}
                    </p>
                  </div>
                  {claim.submissionDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted Date</p>
                      <p className="font-semibold">
                        {new Date(claim.submissionDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {claim.processedDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Processed Date</p>
                      <p className="font-semibold">
                        {new Date(claim.processedDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Procedure Codes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Procedure Codes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {claim.procedureCodes.map((procedure, index) => (
                    <div key={index} className="pb-3 border-b last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{procedure.cptCode}</Badge>
                            <span className="font-semibold">{procedure.description}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Quantity: {procedure.quantity}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <div>
                            <p className="text-xs text-muted-foreground">Charged</p>
                            <p className="font-semibold">
                              ${procedure.chargedAmount.toFixed(2)}
                            </p>
                          </div>
                          {procedure.allowedAmount > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground">Allowed</p>
                              <p className="font-semibold text-blue-600">
                                ${procedure.allowedAmount.toFixed(2)}
                              </p>
                            </div>
                          )}
                          {procedure.paidAmount > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground">Paid</p>
                              <p className="font-semibold text-green-600">
                                ${procedure.paidAmount.toFixed(2)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {claim.diagnosisCodes && claim.diagnosisCodes.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-semibold mb-2">Diagnosis Codes</p>
                    <div className="flex flex-wrap gap-2">
                      {claim.diagnosisCodes.map((code, index) => (
                        <Badge key={index} variant="secondary">
                          {code}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Charges</span>
                    <span className="font-semibold">
                      ${claim.totalCharges.toFixed(2)}
                    </span>
                  </div>
                  {claim.allowedAmount > 0 && (
                    <div className="flex justify-between">
                      <span>Allowed Amount</span>
                      <span className="font-semibold">
                        ${claim.allowedAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {claim.deductible > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Deductible</span>
                      <span>${claim.deductible.toFixed(2)}</span>
                    </div>
                  )}
                  {claim.coinsurance > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Coinsurance</span>
                      <span>${claim.coinsurance.toFixed(2)}</span>
                    </div>
                  )}
                  {claim.copay > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Copay</span>
                      <span>${claim.copay.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Insurance Paid</span>
                    <span className="text-green-600">
                      ${claim.paidAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Patient Responsibility</span>
                    <span className="text-red-600">
                      ${claim.patientResponsibility.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {claim.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{claim.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Claim Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div
                    className={`w-12 h-12 rounded-full ${statusColor} bg-opacity-10 flex items-center justify-center mx-auto mb-2`}
                  >
                    {claim.status === "approved" || claim.status === "paid" ? (
                      <CheckCircle className={`w-6 h-6 ${statusColor.replace("bg-", "text-")}`} />
                    ) : claim.status === "denied" ? (
                      <XCircle className={`w-6 h-6 ${statusColor.replace("bg-", "text-")}`} />
                    ) : (
                      <Clock className={`w-6 h-6 ${statusColor.replace("bg-", "text-")}`} />
                    )}
                  </div>
                  <p className="text-center font-semibold capitalize">
                    {claim.status.replace("_", " ")}
                  </p>
                </div>

                {claim.submissionMethod && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Submission Method</p>
                    <p className="font-semibold capitalize">{claim.submissionMethod}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {claim.status === "draft" && (
                  <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full justify-start" variant="outline">
                        <Send className="w-4 h-4 mr-2" />
                        Submit Claim
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Claim</DialogTitle>
                        <DialogDescription>
                          Submit this claim to the insurance provider
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Submission Method</Label>
                          <select
                            className="w-full mt-1 p-2 border rounded"
                            value={submissionMethod}
                            onChange={(e) => setSubmissionMethod(e.target.value as any)}
                          >
                            <option value="electronic">Electronic</option>
                            <option value="paper">Paper</option>
                            <option value="manual">Manual</option>
                          </select>
                        </div>
                        <div>
                          <Label>Notes</Label>
                          <Textarea
                            placeholder="Submission notes..."
                            value={submissionNotes}
                            onChange={(e) => setSubmissionNotes(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSubmitOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSubmitClaim} disabled={actionLoading}>
                          Submit Claim
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {claim.status === "denied" && claim.denialInfo?.isAppealable && (
                  <Dialog open={appealOpen} onOpenChange={setAppealOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full justify-start" variant="outline">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Submit Appeal
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Appeal</DialogTitle>
                        <DialogDescription>
                          Appeal this denied claim
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Appeal Reason</Label>
                          <Textarea
                            placeholder="Explain why this claim should be reconsidered..."
                            value={appealReason}
                            onChange={(e) => setAppealReason(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <div>
                          <Label>Supporting Documents (comma-separated)</Label>
                          <Input
                            placeholder="doc1.pdf, doc2.pdf"
                            value={appealDocuments}
                            onChange={(e) => setAppealDocuments(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAppealOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSubmitAppeal} disabled={actionLoading}>
                          Submit Appeal
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {claim.status === "draft" && (
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

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Claim ID</span>
                  <span className="font-mono">{claim.claimId}</span>
                </div>
                {claim.claimNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Claim Number</span>
                    <span className="font-mono">{claim.claimNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Procedures</span>
                  <span>{claim.procedureCodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(claim.createdAt).toLocaleDateString()}</span>
                </div>
                {claim.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated</span>
                    <span>{new Date(claim.updatedAt).toLocaleDateString()}</span>
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
