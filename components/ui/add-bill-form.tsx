"use client";

import { Plus, ArrowLeft, Trash2 } from "lucide-react";
import { MdOutlineModeEdit } from "react-icons/md";

interface SavedBill { id: number; text: string; }

interface FormShape {
  cptCodes: string;
  description: string;
  charge: string;
  adjustment: string;
  insurancePaid: string;
  patientPaid: string;
  patientResponsibility: string;
}

interface AddBillFormProps {
  savedBills: SavedBill[];
  form: FormShape;
  setForm: (updater: (prev: FormShape) => FormShape) => void;
  onBack: () => void;
  onSave: () => void;
  onAddNew: () => void;
  onDeleteSaved: (id: number) => void;
}

export default function AddBillForm({
  savedBills,
  form,
  setForm,
  onBack,
  onSave,
  onAddNew,
  onDeleteSaved,
}: AddBillFormProps) {
  /*  ⬇️  EVERYTHING THAT WAS AFTER “return” GOES HERE  */
  return (
    <div className="p-6 bg-background dark:bg-gray-900 min-h-screen">
      <button
        onClick={onBack}
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
                  onClick={() => onDeleteSaved(bill.id)}
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
              value={form.cptCodes}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, cptCodes: e.target.value }))
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
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
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
              value={form.charge}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, charge: e.target.value }))
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
              value={form.adjustment}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, adjustment: e.target.value }))
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
              value={form.insurancePaid}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, insurancePaid: e.target.value }))
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
              value={form.patientPaid}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, patientPaid: e.target.value }))
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
            value={form.patientResponsibility}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, patientResponsibility: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <button
        onClick={onAddNew}
        className="flex items-center gap-2 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium mb-8 text-sm"
      >
        <Plus className="w-4 h-4" />
        Add New Bill
      </button>

      <button
        onClick={onSave}
        className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2 rounded-md font-medium text-sm"
      >
        Save
      </button>
    </div>
  );
}