"use client";

import { useState } from "react";
import {
  DollarSign,
  Clock,
  FileText,
  AlertCircle,
  ChevronDown,
  Edit,
  Trash2,
  Check,
  Calendar,
  Plus,
  X,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { MdOutlineModeEdit } from "react-icons/md";
import { BsFillSendFill } from "react-icons/bs";
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

  // Generate more data to support pagination and unique IDs
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

  const handleAddMoreBilling = () => {
    // Add more billing logic here
    console.log("Add more billing clicked");
  };

  const handleAddBillingClick = () => {
    setShowAddBillPage(true);
  };

  const handleBackToPatientBilling = () => {
    setShowAddBillPage(false);
  };

  const handleSaveBill = () => {
    // Handle save logic here
    console.log("Saving bill:", addBillForm);
    // Reset form after save
    setAddBillForm({
      cptCodes: "",
      description: "",
      charge: "",
      adjustment: "",
      insurancePaid: "",
      patientPaid: "",
      patientResponsibility: "",
    });
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
      <ProtectedRoute allowedRoles={["doctor"]}>
        <div className="p-6 bg-background dark:bg-gray-900 min-h-screen">
          <button
            onClick={handleBackToPatientBilling}
            className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 mb-6 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Patient Billing
          </button>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Add Bill
          </h1>

          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Saved Bills
            </h2>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {savedBills.map((bill, index) => (
                <div
                  key={bill.id}
                  className={`flex items-center justify-between p-4 ${
                    index !== savedBills.length - 1
                      ? "border-b border-gray-200 dark:border-gray-700"
                      : ""
                  } bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700`}
                >
                  <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                    {bill.text}
                  </span>
                  <div className="flex items-center gap-3">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                      <MdOutlineModeEdit className="w-8 h-8 lg:w-8 lg:h-8" />
                    </button>
                    <button
                      onClick={() => handleDeleteSavedBill(bill.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CPT Codes <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter CPT Codes"
                  value={addBillForm.cptCodes}
                  onChange={(e) =>
                    setAddBillForm({ ...addBillForm, cptCodes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Description"
                  value={addBillForm.description}
                  onChange={(e) =>
                    setAddBillForm({
                      ...addBillForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Charge
                </label>
                <input
                  type="text"
                  placeholder="Enter Charge Value"
                  value={addBillForm.charge}
                  onChange={(e) =>
                    setAddBillForm({ ...addBillForm, charge: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Adjustment
                </label>
                <input
                  type="text"
                  placeholder="Enter Adjustment"
                  value={addBillForm.adjustment}
                  onChange={(e) =>
                    setAddBillForm({
                      ...addBillForm,
                      adjustment: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Insurance Paid
                </label>
                <input
                  type="text"
                  placeholder="Enter Insurance Paid"
                  value={addBillForm.insurancePaid}
                  onChange={(e) =>
                    setAddBillForm({
                      ...addBillForm,
                      insurancePaid: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Patient Paid
                </label>
                <input
                  type="text"
                  placeholder="Enter Patient Paid"
                  value={addBillForm.patientPaid}
                  onChange={(e) =>
                    setAddBillForm({
                      ...addBillForm,
                      patientPaid: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Patient Responsibility
              </label>
              <input
                type="text"
                placeholder="Enter Patient Responsibility"
                value={addBillForm.patientResponsibility}
                onChange={(e) =>
                  setAddBillForm({
                    ...addBillForm,
                    patientResponsibility: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <button
            onClick={handleAddNewBill}
            className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium mb-8 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Bill
          </button>

          <button
            onClick={handleSaveBill}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2 rounded-md font-medium text-sm"
          >
            Save
          </button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="p-6 max-w-7xl mx-auto bg-background dark:bg-gray-900 min-h-screen">
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

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
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
          ].map((card, i) => (
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

        <div className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg shadow-sm">
          <div className="flex justify-between items-center p-4 border-b border-border dark:border-gray-700">
            <h2 className="text-lg font-semibold text-foreground dark:text-gray-100">
              Billing History
            </h2>
            <Button
              onClick={handleAddBillingClick}
              className="bg-[#1DA68F] hover:bg-[#1DA68F]/80 text-white"
            >
              Add Billing
            </Button>
          </div>

          <div className="w-full">
            <div className="overflow-x-auto border-t border-slate-200 dark:border-gray-700">
              <div className="min-w-[1600px] lg:min-w-[1800px]">
                {/* Main Header Row */}
                <div className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-3 bg-slate-100 dark:bg-gray-800 border-b border-border dark:border-gray-700 text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                  <div>PATIENT</div>
                  <div>CO PAY</div>
                  <div>DESCRIPTION</div>
                  <div>CHARGE</div>
                  <div>ADJUSTMENT</div>
                  <div>INSURANCE PAID</div>
                  <div>CLAIM STATUS</div>
                  <div
                    className="flex items-center gap-1 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    onClick={() => setEditPatientPaidModal(true)}
                  >
                    PATIENT PAID
                    <MdOutlineModeEdit className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>DATE</div>
                  <div>PATIENT RESPONSIBILITY</div>
                  <div>REASON</div>
                  <div>PAYMENT STATUS</div>
                  <div>ACTION</div>
                </div>

                {/* Emma Wilson Row */}
                <div className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-4 items-center text-sm border-b border-border dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full overflow-hidden flex-shrink-0 border border-slate-200 dark:border-gray-600">
                      <img
                        src="/woman-profile.png"
                        alt="Emma Wilson"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-gray-100 text-xs lg:text-sm truncate">
                      Emma Wilson
                    </span>
                  </div>
                  <div className="text-slate-900 dark:text-gray-100 font-medium text-xs lg:text-sm">
                    $20
                  </div>
                  <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                    FOLIC ACID (SR)
                  </div>
                  <div className="text-slate-900 dark:text-gray-100 font-medium text-xs lg:text-sm">
                    $250.00
                  </div>
                  <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                    ($118.12)
                  </div>
                  <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                    ($12.27)
                  </div>
                  <div>
                    <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900 text-xs px-2 py-1 font-medium border-0">
                      Pending
                    </Badge>
                  </div>
                  <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                    --
                  </div>
                  <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                    30/01/2024
                  </div>
                  <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                    ($12.27)
                  </div>
                  <div className="text-slate-600 dark:text-gray-400 text-xs">
                    Deductible/Coinsurance
                  </div>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 lg:h-8 px-2 lg:px-3 text-xs border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300"
                        >
                          Pending
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
                        <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                          Submitted
                        </DropdownMenuItem>
                        <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                          Paid
                        </DropdownMenuItem>
                        <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                          Denied
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-teal-50 dark:hover:bg-teal-900 text-teal-600 dark:text-teal-400"
                    >
                      <BsFillSendFill className="w-8 h-8 lg:w-8 lg:h-8" />{" "}
                    </Button>
                  </div>
                </div>

                {/* Detail Header Row */}
                <div className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-3 bg-slate-50 dark:bg-gray-800 border-b border-border dark:border-gray-700 text-xs font-medium text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                  <div>CPT CODE</div>
                  <div></div>
                  <div>DESCRIPTION</div>
                  <div>CHARGE</div>
                  <div>ADJUSTMENT</div>
                  <div>INSURANCE PAID</div>
                  <div>CLAIM STATUS</div>
                  <div
                    className="flex items-center gap-1 cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    onClick={() => setEditPatientPaidModal(true)}
                  >
                    PATIENT PAIDsds
                    <MdOutlineModeEdit className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>DATE</div>
                  <div>PATIENT RESPONSIBILITY</div>
                  <div>REASON</div>
                  <div></div>
                  <div>ACTION</div>
                </div>

                {/* Detail Rows */}
                <div className="bg-slate-25 dark:bg-gray-900">
                  {/* Submitted Row */}
                  <div className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-3 items-center text-sm border-b border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800">
                    <div className="text-slate-900 dark:text-gray-100 font-medium text-xs lg:text-sm">
                      86800
                    </div>
                    <div></div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      FOLIC ACID (SR)
                    </div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      $150.00
                    </div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      ($18.12)
                    </div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      ($10.27)
                    </div>
                    <div>
                      <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 text-xs px-2 py-1 font-medium border-0">
                        Submitted
                      </Badge>
                    </div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      --
                    </div>
                    <div className="flex items-center gap-1 lg:gap-2 text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-slate-400 dark:text-gray-500" />
                      08/02/2024
                    </div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      ($08.27)
                    </div>
                    <div className="text-slate-600 dark:text-gray-400 text-xs">
                      Deductible/Coinsurance
                    </div>
                    <div></div>
                    <div className="flex items-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-teal-50 dark:hover:bg-teal-900 text-teal-600 dark:text-teal-400"
                      >
                        <MdOutlineModeEdit className="w-8 h-8 lg:w-8 lg:h-8" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Approved Row */}
                  <div className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-3 items-center text-sm border-b border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800">
                    <div className="text-slate-900 dark:text-gray-100 font-medium text-xs lg:text-sm">
                      86800
                    </div>
                    <div></div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      FOLIC ACID (SR)
                    </div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      $150.00
                    </div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      ($18.12)
                    </div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      ($10.27)
                    </div>
                    <div>
                      <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900 text-xs px-2 py-1 font-medium border-0">
                        Approved
                      </Badge>
                    </div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      --
                    </div>
                    <div className="flex items-center gap-1 lg:gap-2 text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-slate-400 dark:text-gray-500" />
                      08/02/2024
                    </div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      ($08.27)
                    </div>
                    <div className="text-slate-600 dark:text-gray-400 text-xs">
                      Deductible/Coinsurance
                    </div>
                    <div></div>
                    <div className="flex items-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-green-50 dark:hover:bg-green-900 text-green-600 dark:text-green-400"
                      >
                        <Check className="w-3 h-3 lg:w-4 lg:h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Rejected Row */}
                  <div className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-3 items-center text-sm border-b border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800">
                    <div className="text-slate-900 dark:text-gray-100 font-medium text-xs lg:text-sm">
                      86800
                    </div>
                    <div></div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      FOLIC ACID (SR)
                    </div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      $150.00
                    </div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      ($18.12)
                    </div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      ($10.27)
                    </div>
                    <div>
                      <Badge className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900 text-xs px-2 py-1 font-medium border-0">
                        Rejected
                      </Badge>
                    </div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      --
                    </div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      08/02/2024
                    </div>
                    <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                      ($08.27)
                    </div>
                    <div className="text-slate-600 dark:text-gray-400 text-xs">
                      Deductible/Coinsurance
                    </div>
                    <div></div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-teal-50 dark:hover:bg-teal-900 text-teal-600 dark:text-teal-400"
                      >
                        <MdOutlineModeEdit className="w-8 h-8 lg:w-8 lg:h-8" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Add More Button */}
                <div className="px-3 lg:px-4 py-4 border-b border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900 h-8 px-3 text-sm font-medium"
                    onClick={handleAddMoreBilling}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add More
                  </Button>
                </div>

                {/* Sarah Corner Row */}
                <div className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-4 items-center text-sm border-b border-border dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full overflow-hidden flex-shrink-0 border border-slate-200 dark:border-gray-600">
                      <img
                        src="/woman-profile.png"
                        alt="Sarah Corner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-gray-100 text-xs lg:text-sm truncate">
                      Sarah Corner
                    </span>
                  </div>
                  <div className="text-slate-900 dark:text-gray-100 font-medium text-xs lg:text-sm">
                    $20
                  </div>
                  <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                    FOLIC ACID (SR)
                  </div>
                  <div className="text-slate-900 dark:text-gray-100 font-medium text-xs lg:text-sm">
                    $250.00
                  </div>
                  <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                    ($118.12)
                  </div>
                  <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                    ($12.27)
                  </div>
                  <div>
                    <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900 text-xs px-2 py-1 font-medium border-0">
                      Pending
                    </Badge>
                  </div>
                  <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                    --
                  </div>
                  <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                    30/01/2024
                  </div>
                  <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
                    ($12.27)
                  </div>
                  <div className="text-slate-600 dark:text-gray-400 text-xs">
                    Deductible/Coinsurance
                  </div>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 lg:h-8 px-2 lg:px-3 text-xs border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300"
                        >
                          Pending
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
                        <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                          Submitted
                        </DropdownMenuItem>
                        <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                          Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                          Paid
                        </DropdownMenuItem>
                        <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                          Denied
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 lg:h-8 lg:w-8 p-0 hover:bg-teal-50 dark:hover:bg-teal-900 text-teal-600 dark:text-teal-400"
                    >
                      <BsFillSendFill className="w-8 h-8 lg:w-8 lg:h-8" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 text-sm text-muted-foreground dark:text-gray-400">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="border-border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={page === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(i + 1)}
                  className={
                    page === i + 1
                      ? "bg-[#1DA68F] hover:bg-[#1DA68F]/80"
                      : "border-border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={page === totalPages}
                className="border-border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Next
              </Button>
            </div>
            <span>{totalPages} / Pages</span>
          </div>
        </div>

        {editPatientPaidModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-gray-100">
                  Edit Patient Paid
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditPatientPaidModal(false)}
                  className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
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
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
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
                    className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              <div className="flex gap-3 p-6 pt-0">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 bg-transparent dark:bg-gray-800"
                  onClick={() => setEditPatientPaidModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={() => {
                    // Handle save logic here
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
              ].map((method, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm text-foreground dark:text-gray-100 mb-1">
                    <span>{method.label}</span>
                    <span className="font-semibold">{method.percent}%</span>
                  </div>
                  <div className="h-2 bg-muted dark:bg-gray-700 rounded-full">
                    <div
                      className={`h-2 rounded-full ${method.color}`}
                      style={{ width: `${method.percent}%` }}
                    ></div>
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
                <span className="float-right font-semibold text-foreground dark:text-gray-100">
                  $43,800
                </span>
              </p>
              <p>
                YTD Total{" "}
                <span className="font-bold text-foreground dark:text-gray-100 float-right">
                  $547,200
                </span>
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
      </div>
    </ProtectedRoute>
  );
}
