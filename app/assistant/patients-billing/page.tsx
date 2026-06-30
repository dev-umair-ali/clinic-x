"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProtectedRoute } from "@/components/ui/protected-route";
import AddBillForm from "@/components/ui/add-bill-form";
import { BillingSummaryCards } from "@/components/Doctor-Payment-Methods-Charts/BillingSummaryCards";
import { DashboardKPIs } from "@/components/Doctor-Payment-Methods-Charts/DashboardKPIs";
import { DoctorBillingTable } from "@/components/ui/DoctorBillingTable";

interface BillingItem {
  id: number;
  cpt: string;
  patient: string;
  copay: string;
  desc: string;
  charge: string;
  adjustment: string;
  insurance: string;
  paid: string;
  date: string;
  responsibility: string;
  reason: string;
  status: string;
}

export default function DoctorBillingPage() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;
  const baseBillingItem = {
    cpt: "86800",
    patient: "Emma Wilson",
    copay: "$20",
    desc: "FOLIC ACID (SR)",
    charge: "$250.00",
    adjustment: "($118.12)",
    insurance: "($12.27)",
    paid: "--",
    date: "30/01/2024",
    responsibility: "($12.27)",
    reason: "Deductible/Coinsurance",
    status: "Pending",
  };

  const [billingData, setBillingData] = useState<BillingItem[]>(
    Array.from({ length: 6 }, (_, idx) => ({ ...baseBillingItem, id: idx + 1 }))
  );

  const [editPatientPaidModal, setEditPatientPaidModal] = useState(false);
  const [editPatientPaidData, setEditPatientPaidData] = useState({
    amount: "",
    reason: "",
  });

  const [showAddBillPage, setShowAddBillPage] = useState(false);
  const [savedBills, setSavedBills] = useState([
    { id: 1, text: "CPT Code 1 - Charger - Date" },
    { id: 2, text: "CPT Code 2 - Charger - Date" },
  ]);
  const [addBillForm, setAddBillForm] = useState({
    cptCodes: "",
    description: "",
    charge: "",
    adjustment: "",
    insurancePaid: "",
    patientPaid: "",
    patientResponsibility: "",
  });

  const paginatedData = billingData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const totalPages = Math.ceil(billingData.length / rowsPerPage);

  const handleAddBill = (newItem: BillingItem) => {
    setBillingData((prev) => [
      ...prev,
      {
        ...newItem,
        id: prev.length > 0 ? Math.max(...prev.map((item) => item.id)) + 1 : 1,
      },
    ]);
  };
  const handleEditBill = (updatedItem: BillingItem) => {
    setBillingData((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleAddBillingClick = () => setShowAddBillPage(true);
  const handleBackToPatientBilling = () => setShowAddBillPage(false);
  const handleSaveBill = () => {
  };
  const handleAddNewBill = () => {
    const newBill = {
      id: savedBills.length + 1,
      text: `CPT Code ${savedBills.length + 1} - Charger - Date`,
    };
    setSavedBills([...savedBills, newBill]);
  };
  const handleDeleteSavedBill = (id: number) => {
    setSavedBills(savedBills.filter((bill) => bill.id !== id));
  };

  if (showAddBillPage) {
    return (
      <ProtectedRoute allowedRoles={["assistant"]}>
        <AddBillForm
          savedBills={savedBills}
          form={addBillForm}
          setForm={setAddBillForm}
          onBack={handleBackToPatientBilling}
          onSave={handleSaveBill}
          onAddNew={handleAddNewBill}
          onDeleteSaved={handleDeleteSavedBill}
        />
      </ProtectedRoute>
    );
  }

  const openEditPaidModal = () => setEditPatientPaidModal(true);
  const doAddMore = () => handleAddMoreBilling();

  return (
    <ProtectedRoute allowedRoles={["assistant"]}>
      <div className="p-6 max-w-7xl mx-auto bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
            Patient Billing
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-[hsl(var(--border))] dark:border-[hsl(var(--border))] bg-transparent dark:bg-[hsl(var(--card))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
              >
                Last 7 Days
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="dark:bg-[hsl(var(--card))] dark:border-[hsl(var(--border))]"
            >
              <DropdownMenuItem className="dark:text-[hsl(var(--card-foreground))] dark:hover:bg-[hsl(var(--accent))]">
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem className="dark:text-[hsl(var(--card-foreground))] dark:hover:bg-[hsl(var(--accent))]">
                Last 30 Days
              </DropdownMenuItem>
              <DropdownMenuItem className="dark:text-[hsl(var(--card-foreground))] dark:hover:bg-[hsl(var(--accent))]">
                Last 90 Days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/*  Stat Cards  */}
        <DashboardKPIs />

        <div className="w-full overflow-x-auto rounded-lg border border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
          {" "}
          <div className="flex justify-between items-center p-4 border-b border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
            <h2 className="text-lg font-semibold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">
              Billing History
            </h2>
            <Button
              onClick={handleAddBillingClick}
              className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))]"
            >
              Add Billing
            </Button>
          </div>
          <DoctorBillingTable
            data={[
              {
                id: "1",
                patient: "Emma Wilson",
                coPay: "$20",
                description: "FOLIC ACID (SR)",
                charge: "$250.00",
                adjustment: "($118.12)",
                insurancePaid: "($12.27)",
                claimStatus: "Pending",
                patientPaid: "--",
                date: "30/01/2024",
                patientResponsibility: "($12.27)",
                reason: "Deductible/Coinsurance",
                paymentStatus: "Pending",
                type: "main",
              },
              {
                id: "2",
                cptCode: "86800",
                description: "FOLIC ACID (SR)",
                charge: "$150.00",
                adjustment: "($18.12)",
                insurancePaid: "($10.27)",
                claimStatus: "Submitted",
                patientPaid: "--",
                date: "08/02/2024",
                patientResponsibility: "($08.27)",
                reason: "Deductible/Coinsurance",
                paymentStatus: "Submitted",
                type: "detail",
              },
              {
                id: "3",
                cptCode: "86800",
                description: "FOLIC ACID (SR)",
                charge: "$150.00",
                adjustment: "($18.12)",
                insurancePaid: "($10.27)",
                claimStatus: "Approved",
                patientPaid: "--",
                date: "08/02/2024",
                patientResponsibility: "($08.27)",
                reason: "Deductible/Coinsurance",
                paymentStatus: "Approved",
                type: "detail",
              },
              {
                id: "4",
                cptCode: "86800",
                description: "FOLIC ACID (SR)",
                charge: "$150.00",
                adjustment: "($18.12)",
                insurancePaid: "($10.27)",
                claimStatus: "Rejected",
                patientPaid: "--",
                date: "08/02/2024",
                patientResponsibility: "($08.27)",
                reason: "Deductible/Coinsurance",
                paymentStatus: "Rejected",
                type: "detail",
              },
            ]}
            onAddMore={doAddMore}
            onEditPaid={openEditPaidModal}
          />
        </div>
        {editPatientPaidModal && (
          <div className="fixed inset-0 bg-[hsl(var(--background)/0.5)] flex items-center justify-center z-50 p-4">
            <div className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
                <h2 className="text-lg font-semibold text-[hsl(var(--card-foreground))] dark:text-[hsl(var(--card-foreground))]">
                  Edit Patient Paid
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditPatientPaidModal(false)}
                  className="h-8 w-8 p-0 hover:bg-[hsl(var(--accent))] dark:hover:bg-[hsl(var(--accent))]"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mb-2">
                    New Amount Paid
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Patient Name"
                    value={editPatientPaidData.amount}
                    onChange={(e) =>
                      setEditPatientPaidData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-[hsl(var(--input))] dark:border-[hsl(var(--input))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-[hsl(var(--ring))] bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mb-2">
                    Reason for Change
                  </label>
                  <textarea
                    placeholder="Short note explaining why the amount was modified"
                    value={editPatientPaidData.reason}
                    onChange={(e) =>
                      setEditPatientPaidData((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-[hsl(var(--input))] dark:border-[hsl(var(--input))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-[hsl(var(--ring))] resize-none bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
                  />
                </div>
              </div>
              <div className="flex gap-3 p-6 pt-0">
                <Button
                  variant="outline"
                  className="flex-1 border-[hsl(var(--border))] dark:border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))] dark:hover:bg-[hsl(var(--accent))] bg-transparent dark:bg-transparent"
                  onClick={() => setEditPatientPaidModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                  onClick={() => {
                    setEditPatientPaidModal(false);
                    setEditPatientPaidData({ amount: "", reason: "" });
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

        <BillingSummaryCards />
      </div>
    </ProtectedRoute>
  );
}