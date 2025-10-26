'use client'

import React, { useState } from 'react';
import Input from '@/components/ui/ProcedureInput';
import AudioRecorder from '@/components/ui/AudioRecorder';
import { PencilIcon, TrashIcon, PlusIcon, DocumentTextIcon } from '@heroicons/react/20/solid';
import Disclaimer from '@/components/ui/Disclaimer';

const StepPrescription = ({ formData, updateFormData }: any) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const updateField = (key: string, value: any) => {
        updateFormData('prescription', {
            ...formData.prescription,
            [key]: value
        });
    };

    const addMedication = () => {
        const newMedication = {
            name: formData.prescription?.medicationName || '',
            dosage: formData.prescription?.dosage || '',
            instructions: formData.prescription?.instructions || '',
            form: formData.prescription?.form || '',
            refills: formData.prescription?.refills || '',
            noRefill: formData.prescription?.noRefill || false,
            substitutionPermissible: formData.prescription?.substitutionPermissible || false,
            doNotSubstitute: formData.prescription?.doNotSubstitute || false,
            notes: formData.prescription?.notes || '',
            dateAdded: new Date().toLocaleDateString()
        };

        // Validation
        if (!newMedication.name || !newMedication.dosage) {
            alert('Please fill in at least medication name and dosage');
            return;
        }

        const currentMedications = [...(formData.prescription?.savedMedications || [])];
        
        if (editingIndex !== null) {
            currentMedications[editingIndex] = newMedication;
            setEditingIndex(null);
        } else {
            currentMedications.push(newMedication);
        }

        updateFormData('prescription', {
            ...formData.prescription,
            savedMedications: currentMedications,
            // Clear form fields
            medicationName: '',
            dosage: '',
            instructions: '',
            form: '',
            refills: '',
            noRefill: false,
            substitutionPermissible: false,
            doNotSubstitute: false,
            notes: ''
        });
    };

    const editMedication = (index: number) => {
        const medication = formData.prescription?.savedMedications?.[index];
        if (medication) {
            updateFormData('prescription', {
                ...formData.prescription,
                medicationName: medication.name,
                dosage: medication.dosage,
                instructions: medication.instructions,
                form: medication.form,
                refills: medication.refills,
                noRefill: medication.noRefill,
                substitutionPermissible: medication.substitutionPermissible,
                doNotSubstitute: medication.doNotSubstitute,
                notes: medication.notes
            });
            setEditingIndex(index);
        }
    };

    const removeMedication = (index: number) => {
        const updatedMedications = [...(formData.prescription?.savedMedications || [])];
        updatedMedications.splice(index, 1);
        updateFormData('prescription', {
            ...formData.prescription,
            savedMedications: updatedMedications
        });
        
        if (editingIndex === index) {
            setEditingIndex(null);
            // Clear form when deleting the item being edited
            updateFormData('prescription', {
                ...formData.prescription,
                medicationName: '',
                dosage: '',
                instructions: '',
                form: '',
                refills: '',
                noRefill: false,
                substitutionPermissible: false,
                doNotSubstitute: false,
                notes: ''
            });
        }
    };

    const cancelEdit = () => {
        updateFormData('prescription', {
            ...formData.prescription,
            medicationName: '',
            dosage: '',
            instructions: '',
            form: '',
            refills: '',
            noRefill: false,
            substitutionPermissible: false,
            doNotSubstitute: false,
            notes: ''
        });
        setEditingIndex(null);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Audio Recorder Section */}
            <div className="w-full">
                <AudioRecorder
                    label="Prescription Voice Note"
                    audioUrl={formData.prescriptionVoiceUrl}
                    onSave={(url: string) => updateFormData('prescriptionVoiceUrl', url)}
                />
            </div>

            {/* Header Section */}
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-card dark:bg-card/50 border border-border rounded-lg transition-colors duration-200'>
                <div className="text-sm font-medium flex items-center gap-3">
                    <div className='bg-blue-500/10 dark:bg-blue-400/20 p-2.5 rounded-md border border-blue-200 dark:border-blue-400/30'>
                        <DocumentTextIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className='font-semibold text-foreground'>Prescription Transcript</p>
                </div>
                <div className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                    {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* Saved Medications Section */}
            <div className="p-4 rounded-lg border border-border bg-card dark:bg-background/50 flex flex-col gap-3 transition-colors duration-200">
                <p className="text-muted-foreground text-sm mb-2 font-medium">Saved Medications</p>
                
                {(!formData.prescription?.savedMedications || formData.prescription.savedMedications.length === 0) && (
                    <p className="text-sm italic text-muted-foreground/70">No medications added yet.</p>
                )}

                {(formData.prescription?.savedMedications || []).map((medication: any, idx: number) => (
                    <div
                        key={idx}
                        className="flex justify-between items-center bg-background dark:bg-card p-3 rounded-md border border-primary/30 border-dashed hover:bg-accent/50 transition-colors duration-200"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="text-foreground text-sm font-medium truncate">
                                {medication.name} - {medication.dosage}
                            </p>
                            <p className="text-muted-foreground text-xs mt-1">
                                {medication.form && `${medication.form} • `}
                                {medication.refills && `${medication.refills} refills • `}
                                {medication.dateAdded}
                            </p>
                            {medication.instructions && (
                                <p className="text-muted-foreground text-xs mt-1 italic">
                                    "{medication.instructions}"
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2 ml-3 flex-shrink-0">
                            <button
                                onClick={() => editMedication(idx)}
                                className="p-1.5 hover:bg-accent rounded-md transition-colors duration-200"
                                title="Edit medication"
                            >
                                <PencilIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </button>
                            <button
                                onClick={() => removeMedication(idx)}
                                className="p-1.5 hover:bg-destructive/10 rounded-md transition-colors duration-200"
                                title="Delete medication"
                            >
                                <TrashIcon className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Medication Form */}
            <div className="space-y-4 p-4 bg-muted/30 dark:bg-muted/20 border border-border rounded-lg transition-colors duration-200">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                    {editingIndex !== null ? 'Edit Medication' : 'Add New Medication'}
                </h3>

                {/* Name and Dosage */}
                <div className='flex flex-col sm:flex-row w-full gap-3'>
                    <Input
                        label="Medication Name"
                        placeholder="Enter medication name"
                        value={formData.prescription?.medicationName || ''}
                        onChange={(val: string) => updateField('medicationName', val)}
                    />
                    <Input
                        label="Dosage"
                        placeholder="e.g., 10mg, 1 tablet"
                        value={formData.prescription?.dosage || ''}
                        onChange={(val: string) => updateField('dosage', val)}
                    />
                </div>

                {/* Instructions */}
                <Input
                    label="Instructions / SIG"
                    type="textarea"
                    placeholder="How to take the medication (e.g., Take 1 tablet by mouth twice daily with food)"
                    value={formData.prescription?.instructions || ''}
                    onChange={(val: string) => updateField('instructions', val)}
                />

                {/* Form and Refills */}
                <div className='flex flex-col sm:flex-row w-full gap-3'>
                    <Input
                        label="Form"
                        placeholder="tablet, liquid, capsule, etc."
                        value={formData.prescription?.form || ''}
                        onChange={(val: string) => updateField('form', val)}
                    />
                    <Input
                        label="Refills"
                        placeholder="Number of refills"
                        value={formData.prescription?.refills || ''}
                        onChange={(val: string) => updateField('refills', val)}
                    />
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground transition-colors">
                        <input
                            type="checkbox"
                            checked={formData.prescription?.noRefill || false}
                            onChange={(e) => updateField('noRefill', e.target.checked)}
                            className='w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 transition-colors'
                        />
                        <span className="text-foreground">Do Not Refill</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground transition-colors">
                        <input
                            type="checkbox"
                            checked={formData.prescription?.substitutionPermissible || false}
                            onChange={(e) => updateField('substitutionPermissible', e.target.checked)}
                            className='w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 transition-colors'
                        />
                        <span className="text-foreground">Substitution Permissible</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground transition-colors">
                        <input
                            type="checkbox"
                            checked={formData.prescription?.doNotSubstitute || false}
                            onChange={(e) => updateField('doNotSubstitute', e.target.checked)}
                            className='w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 transition-colors'
                        />
                        <span className="text-foreground">Do Not Substitute</span>
                    </label>
                </div>

                {/* Notes */}
                <Input
                    label="Diagnosis or Notes"
                    type="textarea"
                    placeholder="Additional notes, diagnosis, or special instructions (optional)"
                    value={formData.prescription?.notes || ''}
                    onChange={(val: string) => updateField('notes', val)}
                />

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                    <button 
                        onClick={addMedication}
                        className='px-4 py-2 bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground rounded-md font-medium text-sm flex items-center gap-2 transition-all duration-200 hover:shadow-md active:scale-95'
                    >
                        <PlusIcon className="h-4 w-4" />
                        {editingIndex !== null ? 'Update Medication' : 'Add Medication'}
                    </button>
                    
                    {editingIndex !== null && (
                        <button 
                            onClick={cancelEdit}
                            className='px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-md font-medium text-sm transition-all duration-200'
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </div>

            <Disclaimer />
        </div>
    );
};

export default StepPrescription;
