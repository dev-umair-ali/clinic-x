'use client';
import React, { useEffect, useState } from 'react';
import Input from '@/components/ui/ProcedureInput';
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

const StepBilling = ({ formData, updateFormData }: any) => {
    const searchParams = useSearchParams();
    const patientIdFromUrl = searchParams.get('id');
    const [error, setError] = useState('');
    const [editIndex, setEditIndex] = useState<number | null>(null);

    useEffect(() => {
        if (patientIdFromUrl && formData.billing?.patientId !== patientIdFromUrl) {
            updateFormData('billing', {
                ...formData.billing,
                patientId: patientIdFromUrl
            });
        }
    }, [patientIdFromUrl]);

    const updateField = (key: string, value: any) => {
        updateFormData('billing', {
            ...formData.billing,
            [key]: value
        });
    };

    const isValid = (fields: Record<string, any>) =>
        ['cpt', 'description', 'charge', 'adjustment', 'insurancePaid', 'patientPaid', 'patientResponsibility']
            .every(field => fields[field]);

    const saveBill = async () => {
        const billData = formData.billing;
        if (!isValid(billData)) {
            setError('Please fill in all required billing fields.');
            return;
        }

        const newBill = {
            patientId: billData.patientId,
            cpt: billData.cpt,
            description: billData.description,
            charge: billData.charge,
            adjustment: billData.adjustment,
            insurancePaid: billData.insurancePaid,
            patientPaid: billData.patientPaid,
            patientResponsibility: billData.patientResponsibility,
            date: new Date().toISOString()
        };

        const newSummary = `Patient: ${newBill.patientId} | ${newBill.cpt} - ${newBill.description} - $${newBill.charge} - ${new Date().toLocaleDateString()}`;

        const currentBills = [...(billData.bills || [])];
        const currentSaved = [...(billData.saved || [])];

        if (editIndex !== null) {
            currentBills[editIndex] = newBill;
            currentSaved[editIndex] = newSummary;
        } else {
            currentBills.push(newBill);
            currentSaved.push(newSummary);
        }

        updateFormData('billing', {
            ...billData,
            bills: currentBills,
            saved: currentSaved,
            cpt: '',
            description: '',
            charge: '',
            adjustment: '',
            insurancePaid: '',
            patientPaid: '',
            patientResponsibility: ''
        });

        setError('');
        setEditIndex(null);

        // 🔁 CREATE BILL IN STRIPE
        try {
            const response = await fetch('/api/create-stripe-invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: "cus_Skm2wIstRwNrDK",
                    amount: billData.charge,
                    description: billData.description || 'Medical Procedure',
                    cpt: billData.cpt,
                    patientId: billData.patientId,
                    adjustment: billData.adjustment,
                    insurancePaid: billData.insurancePaid,
                    patientPaid: billData.patientPaid,
                    patientResponsibility: billData.patientResponsibility,
                }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            toast.success("Stripe invoice created!", {
                onClick: () => window.open(result.invoiceUrl, '_blank'),
            });
        } catch (err: any) {
            console.error('Stripe invoice error:', err);
            toast.error('Failed to create Stripe invoice');
        }
    };

    const removeBill = (index: number) => {
        const updatedBills = [...(formData.billing?.bills || [])];
        const updatedSaved = [...(formData.billing?.saved || [])];
        updatedBills.splice(index, 1);
        updatedSaved.splice(index, 1);

        updateFormData('billing', {
            ...formData.billing,
            bills: updatedBills,
            saved: updatedSaved
        });

        // Reset if we were editing this one
        if (editIndex === index) {
            setEditIndex(null);
        }
    };

    const cancelEdit = () => {
        ['cpt', 'description', 'charge', 'adjustment', 'insurancePaid', 'patientPaid', 'patientResponsibility'].forEach(field =>
            updateField(field, '')
        );
        setEditIndex(null);
        setError('');
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Saved Bills Section */}
            <div className="p-4 rounded-lg border border-border bg-card dark:bg-background/50 flex flex-col gap-2">
                <p className="text-muted-foreground text-sm mb-2">Saved Bills</p>
                {(formData.billing?.saved || []).length === 0 && (
                    <p className="text-sm italic text-muted-foreground/60">No bills added yet.</p>
                )}
                {(formData.billing?.saved || []).map((bill: string, idx: number) => (
                    <div 
                        key={idx} 
                        className="flex justify-between items-center bg-background dark:bg-card p-2 rounded-md border border-[#1DA68F] border-dashed hover:bg-accent/50 transition-colors"
                    >
                        <input
                            type="text"
                            value={bill}
                            readOnly
                            placeholder="Patient ID - CPT - Description - Charge - Date"
                            className="text-foreground/80 text-xs w-full outline-none border-none bg-transparent placeholder:text-muted-foreground"
                        />
                        <div className="flex gap-2 pl-2">
                            <PencilIcon
                                className="h-4 w-4 text-foreground/70 hover:text-[#1DA68F] cursor-pointer transition-colors"
                                onClick={() => {
                                    const billToEdit = formData.billing?.bills?.[idx];
                                    if (billToEdit) {
                                        updateFormData('billing', {
                                            ...formData.billing,
                                            ...billToEdit
                                        });
                                        setEditIndex(idx);
                                    }
                                }}
                            />
                            <TrashIcon
                                className="h-4 w-4 text-muted-foreground hover:text-red-500 cursor-pointer transition-colors"
                                onClick={() => removeBill(idx)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                    label="CPT Codes" 
                    placeholder="Enter CPT Codes" 
                    value={formData.billing?.cpt || ''} 
                    onChange={(val: string) => updateField('cpt', val)} 
                />
                <Input 
                    label="Description" 
                    placeholder="Enter Description" 
                    value={formData.billing?.description || ''} 
                    onChange={(val: string) => updateField('description', val)} 
                />
                <Input 
                    type="number" 
                    label="Charge" 
                    placeholder="Enter Charge Value" 
                    value={formData.billing?.charge || ''} 
                    onChange={(val: string) => updateField('charge', val)} 
                />
                <Input 
                    type="number" 
                    label="Adjustment" 
                    placeholder="Enter Adjustment" 
                    value={formData.billing?.adjustment || ''} 
                    onChange={(val: string) => updateField('adjustment', val)} 
                />
                <Input 
                    type="number" 
                    label="Insurance Paid" 
                    placeholder="Enter Insurance Paid" 
                    value={formData.billing?.insurancePaid || ''} 
                    onChange={(val: string) => updateField('insurancePaid', val)} 
                />
                <Input 
                    type="number" 
                    label="Patient Paid" 
                    placeholder="Enter Patient Paid" 
                    value={formData.billing?.patientPaid || ''} 
                    onChange={(val: string) => updateField('patientPaid', val)} 
                />
                <div className="md:col-span-2">
                    <Input 
                        type="number" 
                        label="Patient Responsibility" 
                        placeholder="Enter Patient Responsibility" 
                        value={formData.billing?.patientResponsibility || ''} 
                        onChange={(val: string) => updateField('patientResponsibility', val)} 
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-red-600 dark:text-red-400 text-xs">{error}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button 
                    onClick={saveBill} 
                    className="text-[#1da68f] hover:text-[#1da68f]/80 text-xs font-semibold px-4 py-2 rounded-md border border-[#1da68f]/20 hover:bg-[#1da68f]/10 transition-colors"
                >
                    {editIndex !== null ? 'Update Bill' : '+ Add New Bill'}
                </button>
                {editIndex !== null && (
                    <button 
                        onClick={cancelEdit} 
                        className="text-muted-foreground hover:text-foreground text-xs font-medium px-4 py-2 rounded-md border border-border hover:bg-accent transition-colors"
                    >
                        Cancel
                    </button>
                )}
            </div>

            {/* Toast Container with dark mode support */}
            <ToastContainer 
                theme="colored"
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                className="!z-[9999]"
            />
        </div>
    );
};

export default StepBilling;
