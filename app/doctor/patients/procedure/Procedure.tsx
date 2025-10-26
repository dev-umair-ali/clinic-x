import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckIcon } from 'lucide-react';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import StepAppointments from './StepAppointments';
import StepNotes from '@/components/patients/procedure/steps/StepNotes';
import StepPrescription from './StepPrescription';
import StepBilling from './StepBilling';
import { useMainProvider } from '../context/Globalcontext';
const steps = [
    'Appointments',
    'Patient Notes',
    'Prescription',
    'Billing History'
];

type FormData = {
    appointments: {
        detail?: string;
        status?: string;
        rescheduleDate?: string;
        rescheduleTime?: string;
    };
    notes: Record<string, any>;
    prescription: Record<string, any>;
    billing: Record<string, any>;
};

const Procedure = ({ patient, goBack, initialStep = 0 }: { patient: any; goBack: () => void; initialStep?: number }) => {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const { setPatientBills, patientBills } = useMainProvider();

    const [rescheduleDate, setRescheduleDate] = useState('');
    const [rescheduleTime, setRescheduleTime] = useState('');
    const [formData, setFormData] = useState<FormData>({
        appointments: {},
        notes: {},
        prescription: {},
        billing: {}
    });

    const updateFormData = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const statusOptions = [
        { id: 1, name: 'Completed' },
        { id: 2, name: 'Cancelled' },
        { id: 3, name: 'Rescheduled' },
        { id: 4, name: 'No Show' }
    ];

    const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);

    useEffect(() => {
        const updated = {
            ...formData.appointments,
            status: selectedStatus.name
        };
        if (selectedStatus.name === 'Rescheduled') {
            updated.rescheduleDate = rescheduleDate;
            updated.rescheduleTime = rescheduleTime;
        }
        updateFormData('appointments', updated);
    }, [selectedStatus, rescheduleDate, rescheduleTime]);

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <StepAppointments
                        patient={patient}
                        value={formData.appointments}
                        onChange={(val: any) => updateFormData('appointments', val)}
                        selectedStatus={selectedStatus}
                        setSelectedStatus={setSelectedStatus}
                        rescheduleDate={rescheduleDate}
                        setRescheduleDate={setRescheduleDate}
                        rescheduleTime={rescheduleTime}
                        setRescheduleTime={setRescheduleTime}
                        statusOptions={statusOptions}
                    />
                );
            case 1:
                return <StepNotes formData={formData} updateFormData={updateFormData} />;
            case 2:
                return <StepPrescription formData={formData} updateFormData={updateFormData} />;
            case 3:
                return <StepBilling formData={formData} updateFormData={updateFormData} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex -ml-8 -mt-10 gap-2">
            <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-gray-200 p-6 sm:p-10 bg-white rounded-b-lg sm:rounded-br-lg">
                <button onClick={goBack} className="text-sm flex gap-2 text-black hover:underline mb-6">
                    <ArrowLeft className="size-5" /> Back to patient Detail
                </button>
                <h3 className="text-md font-semibold mb-4">Procedure Steps</h3>
                <ul>
                    {steps.map((label, index) => (
                        <li
                            key={index}
                            onClick={() => setCurrentStep(index)}
                            className={`cursor-pointer px-3 flex justify-start items-center py-3 rounded-md mb-2 text-xs max-w-[150px] ${index === currentStep ? 'bg-[#1DA68F] text-white font-medium' : 'hover:bg-gray-100'
                                }`}
                        >
                            <div
                                className={`mr-2 w-5 text-center bg-[#F1F1F1] text-sm rounded-full ${index === currentStep ? 'text-[#1DA68F]' : 'text-gray-500'
                                    }`}
                            >
                                {index + 1}
                            </div>
                            <p className='text-[14px]'>
                                {label}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex-1 p-6 border border-gray-300 rounded-lg bg-white mt-8">
                <h2 className="text-xl font-bold mb-2">{steps[currentStep]}</h2>

                {renderStepContent()}

                <div className="flex justify-end mt-6 gap-3">
                    {currentStep < steps.length - 1 ? (
                        <>
                            <button
                                onClick={() => setCurrentStep((prev) => prev + 1)}
                                className="px-4 py-2 bg-gray-100 min-w-[130px] text-gray-700 rounded hover:bg-gray-200 flex justify-center items-center gap-2 text-sm font-medium"
                            >
                                Skip <Image src="/assets/icons/skipicon.png" width={16} height={5} alt="skip" />
                            </button>
                            <button
                                onClick={() => setCurrentStep((prev) => prev + 1)}
                                className="px-4 py-2 bg-[#1DA68F] min-w-[130px] text-white rounded hover:bg-[#1DA68F]/70 flex justify-center items-center gap-2 text-sm"
                            >
                                Next <ArrowRightIcon className="size-5" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                const bills = patientBills[patient.id] || [];
                                const newBill = formData.billing;

                                setPatientBills({
                                    ...patientBills,
                                    [patient.id]: [...bills, newBill]
                                });
                              
                                goBack();
                            }}
                            className="px-4 py-2 bg-[#1DA68F] min-w-[130px] text-white rounded hover:bg-[#1DA68F]/70 flex justify-center items-center gap-2 text-sm"
                        >
                            <CheckIcon className="size-5" /> Save
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Procedure;
