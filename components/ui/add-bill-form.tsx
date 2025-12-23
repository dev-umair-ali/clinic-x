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
  /*  ⬇️  EVERYTHING THAT WAS AFTER "return" GOES HERE  */
  return (
    <div className="p-6 bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] min-h-screen">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--color-brand-teal))] hover:text-[hsl(var(--color-brand-teal-dark))] dark:hover:text-[hsl(var(--color-brand-teal-dark))] mb-6 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Patient Billing
      </button>

      <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-8">
        Add Bill
      </h1>

      <div className="mb-8">
        <h2 className="text-lg font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-4">
          Saved Bills
        </h2>
        <div className="border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] rounded-lg overflow-hidden">
          {savedBills.map((bill, index) => (
            <div
              key={bill.id}
              className={`flex items-center justify-between p-4 ${
                index !== savedBills.length - 1
                  ? "border-b border-[hsl(var(--border))] dark:border-[hsl(var(--border))]"
                  : ""
              } bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] hover:bg-[hsl(var(--accent))] dark:hover:bg-[hsl(var(--accent))]`}
            >
              <span className="text-[hsl(var(--card-foreground))] dark:text-[hsl(var(--card-foreground))] text-sm font-medium">
                {bill.text}
              </span>
              <div className="flex items-center gap-3">
                <button className="p-1 hover:bg-[hsl(var(--accent))] dark:hover:bg-[hsl(var(--accent))] rounded">
                  <MdOutlineModeEdit className="w-8 h-8 lg:w-8 lg:h-8" />
                </button>
                <button
                  onClick={() => onDeleteSaved(bill.id)}
                  className="p-1 hover:bg-[hsl(var(--accent))] dark:hover:bg-[hsl(var(--accent))] rounded"
                >
                  <Trash2 className="w-4 h-4 text-[hsl(var(--color-status-error))] dark:text-[hsl(var(--color-status-error))]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">
              CPT Codes <span className="text-[hsl(var(--color-status-error))]">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter CPT Codes"
              value={form.cptCodes}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, cptCodes: e.target.value }))
              }
              className="w-full px-3 py-2 border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-brand-teal))] focus:border-[hsl(var(--color-brand-teal))] text-sm bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">
              Description <span className="text-[hsl(var(--color-status-error))]">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full px-3 py-2 border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-brand-teal))] focus:border-[hsl(var(--color-brand-teal))] text-sm bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">
              Charge
            </label>
            <input
              type="text"
              placeholder="Enter Charge Value"
              value={form.charge}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, charge: e.target.value }))
              }
              className="w-full px-3 py-2 border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-brand-teal))] focus:border-[hsl(var(--color-brand-teal))] text-sm bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">
              Adjustment
            </label>
            <input
              type="text"
              placeholder="Enter Adjustment"
              value={form.adjustment}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, adjustment: e.target.value }))
              }
              className="w-full px-3 py-2 border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-brand-teal))] focus:border-[hsl(var(--color-brand-teal))] text-sm bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">
              Insurance Paid
            </label>
            <input
              type="text"
              placeholder="Enter Insurance Paid"
              value={form.insurancePaid}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, insurancePaid: e.target.value }))
              }
              className="w-full px-3 py-2 border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-brand-teal))] focus:border-[hsl(var(--color-brand-teal))] text-sm bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">
              Patient Paid
            </label>
            <input
              type="text"
              placeholder="Enter Patient Paid"
              value={form.patientPaid}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, patientPaid: e.target.value }))
              }
              className="w-full px-3 py-2 border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-brand-teal))] focus:border-[hsl(var(--color-brand-teal))] text-sm bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-2">
            Patient Responsibility
          </label>
          <input
            type="text"
            placeholder="Enter Patient Responsibility"
            value={form.patientResponsibility}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, patientResponsibility: e.target.value }))
            }
            className="w-full px-3 py-2 border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-brand-teal))] focus:border-[hsl(var(--color-brand-teal))] text-sm bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
          />
        </div>
      </div>

      <button
        onClick={onAddNew}
        className="flex items-center gap-2 text-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--color-brand-teal))] hover:text-[hsl(var(--color-brand-teal-dark))] dark:hover:text-[hsl(var(--color-brand-teal-dark))] font-medium mb-8 text-sm"
      >
        <Plus className="w-4 h-4" />
        Add New Bill
      </button>

      <button
        onClick={onSave}
        className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))] px-8 py-2 rounded-md font-medium text-sm"
      >
        Save
      </button>
    </div>
  );
}