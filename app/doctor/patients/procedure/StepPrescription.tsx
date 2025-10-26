import React from 'react';
import Input from '../ProcedureInput';
import AudioRecorder from './AudioRecorder';
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import Disclaimer from './Disclaimer';
import Image from 'next/image';

const StepPrescription = ({ formData, updateFormData }: any) => {
    const updateField = (key: string, value: any) => {
        updateFormData('prescription', {
            ...formData.prescription,
            [key]: value
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <AudioRecorder
                audioUrl={formData.prescriptionVoiceUrl}
                onSave={(url: string) => updateFormData('prescriptionVoiceUrl', url)}
            />

            <div className='flex justify-between items-center'>
                <div className=" text-sm font-medium flex justify-center items-center gap-2">
                    <div className='bg-[#1A73E8]/10 p-2 rounded-sm' >
                        <Image src="/assets/icons/file.png" width={12} height={10} alt='fileicon' />
                    </div>
                    <p className='font-semibold'> Prescription Transcript</p>
                </div>
                <div className=" text-sm font-medium flex justify-center items-center gap-2">
                    {new Date().toLocaleDateString()}
                </div>
            </div>

            <div className=" p-4 rounded-lg border border-[#E4E4E4] flex flex-col gap-2">
                <p className="text-[#777777] text-sm mb-2 flex gap-2">Saved Medication</p>
                {[1, 2].map((_, idx) => (
                    <div
                        key={idx}
                        className="flex justify-between items-center bg-white p-2 rounded-md border border-[#1DA68F] border-dashed"
                    >
                        <input
                            type="text"
                            value={formData.prescription?.medications?.[idx] || ''}
                            onChange={(e) => {
                                const newMeds = [...(formData.prescription?.medications || [])];
                                newMeds[idx] = e.target.value;
                                updateField('medications', newMeds);
                            }}
                            placeholder="Medication Name - Date"
                            className="text-[#777777] text-xs w-full outline-none border-none bg-transparent"
                        />
                        <div className="flex gap-2 pl-2">
                            <PencilIcon className="h-4 w-4 text-black/70 cursor-pointer" />
                            <TrashIcon className="h-4 w-4 text-red-400 cursor-pointer" />
                        </div>
                    </div>
                ))}
            </div>

            <div className='flex w-full gap-2'>
                <Input
                    label=""
                    placeholder="Medication Name"
                    value={formData.prescription?.medicationName || ''}
                    onChange={(val: string) => updateField('medicationName', val)}
                />

                <Input
                    label=""
                    placeholder="Dosage"
                    value={formData.prescription?.dosage || ''}
                    onChange={(val: string) => updateField('dosage', val)}
                />
            </div>

            <Input
                label=""
                type="textarea"
                placeholder="Instructions / SIG (how to take it)"
                value={formData.prescription?.instructions || ''}
                onChange={(val: string) => updateField('instructions', val)}
            />

            <div className='flex w-full gap-2'>
                <Input
                    label=""
                    placeholder="Form (tablet, liquid, etc.)"
                    value={formData.prescription?.form || ''}
                    onChange={(val: string) => updateField('form', val)}
                />

                <Input
                    label=""
                    placeholder="Refills"
                    value={formData.prescription?.refills || ''}
                    onChange={(val: string) => updateField('refills', val)}
                />
            </div>

            <div className="grid grid-cols-3 gap-4 text-[#777777] text-sm">
                <label className="flex items-center gap-2 text-xs">
                    <input
                        type="checkbox"
                        checked={formData.prescription?.noRefill || false}
                        onChange={(e) => updateField('noRefill', e.target.checked)}
                        className='border-[#777777]'
                    />
                    Do Not Refill
                </label>

                <label className="flex items-center gap-2 text-xs">
                    <input
                        type="checkbox"
                        checked={formData.prescription?.substitutionPermissible || false}
                        onChange={(e) => updateField('substitutionPermissible', e.target.checked)}
                        className='border-[#777777]'
                    />
                    Substitution Permissible
                </label>

                <label className="flex items-center gap-2 text-xs">
                    <input
                        type="checkbox"
                        checked={formData.prescription?.doNotSubstitute || false}
                        onChange={(e) => updateField('doNotSubstitute', e.target.checked)}
                        className='border-[#777777]'
                    />
                    Do Not Substitute
                </label>
            </div>

            <Input
                label=""
                type="textarea"
                placeholder="Diagnosis or notes (optional)"
                value={formData.prescription?.notes || ''}
                onChange={(val: string) => updateField('notes', val)}
            />

            <button className='text-[#1da68f] text-xs font-semibold text-start'>+ Add New Medication</button>

            <Disclaimer />
        </div>
    );
};

export default StepPrescription;
