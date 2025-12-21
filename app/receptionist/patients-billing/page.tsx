"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { DoctorBillingTable } from "@/components/ui/DoctorBillingTable";
import { EditPatientPaidModal } from "@/components/ui/EditPatientPaidModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DollarSign,
  Clock,
  FileText,
  AlertCircle,
  ChevronDown,
  Plus,
} from "lucide-react";

export interface BillingItem {
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
  /* -------------- dummy data same as before -------------- */
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
  const [billingData] = useState<BillingItem[]>(
    Array.from({ length: 6 }, (_, idx) => ({ ...baseBillingItem, id: idx + 1 }))
  );

  /* -------------- UI toggles -------------- */
  const [showAddBillPage, setShowAddBillPage] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editAmount, setEditAmount] = useState("");
  const [editReason, setEditReason] = useState("");

  /* -------------- handlers -------------- */
  const handleAddBillingClick = () => setShowAddBillPage(true);
  const handleAddMoreBilling = () => console.log("Add more billing clicked");

  /* -------------- stat cards data -------------- */
  const statCards = [
    {
      label: "Outstanding Bills",
      value: "$12,340",
      icon: <FileText className="h-5 w-5 text-red-500" />,
      change: "+2.1%",
      changeColor:
        "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300",
    },
    {
      label: "Revenue Trend",
      value: "$47,500",
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      change: "+8.2%",
      changeColor:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300",
    },
    {
      label: "Payment Methods",
      value: "5 Active",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      change: "+1",
      changeColor:
        "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300",
    },
    {
      label: "Paid Invoices",
      value: "1,249",
      icon: <AlertCircle className="h-5 w-5 text-green-500" />,
      change: "+5.4%",
      changeColor:
        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300",
    },
  ];

  /* -------------- render -------------- */
  return (
    <ProtectedRoute allowedRoles={["receptionist"]}>
      <div className="p-6 max-w-7xl mx-auto bg-background dark:bg-gray-900 min-h-screen">
        {/* header bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground dark:text-gray-100">
            Patient Billing
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-border dark:border-gray-600 bg-transparent dark:bg-gray-800 text-foreground dark:text-gray-100"
              >
                Last 7 Days
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="dark:bg-gray-800 dark:border-gray-700"
            >
              <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                Last 30 Days
              </DropdownMenuItem>
              <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                Last 90 Days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((card, i) => (
            <Card
              key={i}
              className="shadow-sm border-border dark:border-gray-700 dark:bg-gray-800"
            >
              <CardHeader className="pb-2 flex flex-row justify-between items-center">
                <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                  {card.label}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground dark:text-gray-100 mb-1">
                  {card.value}
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${card.changeColor}`}
                >
                  {card.change}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* table */}
        <DoctorBillingTable
          data={billingData as unknown as any}
          onAddMore={handleAddMoreBilling}
          onEditPaid={() => setEditModal(true)}
        />

        {/* bottom 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="shadow-sm border-border dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Insurance", percent: 75, color: "bg-blue-500" },
                { label: "Credit Card", percent: 22, color: "bg-green-500" },
                { label: "Cash", percent: 5, color: "bg-orange-500" },
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm text-foreground dark:text-gray-100 mb-1">
                    <span>{m.label}</span>
                    <span className="font-semibold">{m.percent}%</span>
                  </div>
                  <div className="h-2 bg-muted dark:bg-gray-700 rounded-full">
                    <div
                      className={`h-2 rounded-full ${m.color}`}
                      style={{ width: `${m.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-foreground dark:text-gray-100">
              <p>
                This Month{" "}
                <span className="text-green-600 font-semibold float-right">
                  +8.2%
                </span>
              </p>
              <p>
                Last Month{" "}
                <span className="float-right font-semibold">$43,800</span>
              </p>
              <p>
                YTD Total{" "}
                <span className="font-bold float-right">$547,200</span>
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                Outstanding Bills
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="text-foreground dark:text-gray-100">
                0–30 days{" "}
                <span className="float-right text-green-600 font-semibold">
                  $8,450
                </span>
              </p>
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                23 invoices
              </p>
              <p className="text-foreground dark:text-gray-100">
                31–60 days{" "}
                <span className="float-right text-orange-500 font-semibold">
                  $2,890
                </span>
              </p>
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                6 invoices
              </p>
              <p className="text-foreground dark:text-gray-100">
                60+ days{" "}
                <span className="float-right text-red-600 font-semibold">
                  $1,000
                </span>
              </p>
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                3 invoices
              </p>
            </CardContent>
          </Card>
        </div>

        {/* modal */}
        <EditPatientPaidModal
          open={editModal}
          onClose={() => setEditModal(false)}
          amount={editAmount}
          setAmount={setEditAmount}
          reason={editReason}
          setReason={setEditReason}
        />
      </div>
    </ProtectedRoute>
  );
}