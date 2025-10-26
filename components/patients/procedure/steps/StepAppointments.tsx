import React from 'react';
import Input from '@/components/ui/ProcedureInput';
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Label
} from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';

const StepAppointments = ({
    patient,
    value,
    onChange,
    selectedStatus,
    setSelectedStatus,
    rescheduleDate,
    setRescheduleDate,
    rescheduleTime,
    setRescheduleTime,
    statusOptions
}: any) => {
    return (
        <div>
            <div className='bg-[#1DA68F]/10 dark:bg-[#1DA68F]/20 p-3 w-full rounded-lg border border-[#1DA68F]/20 dark:border-[#1DA68F]/30'>
                <p className='text-[14px] text-xs font-semibold text-foreground/80 dark:text-foreground/90'>Current Appointment</p>
                <p className='text-xs font-light pt-1 text-muted-foreground'>{patient.lastVisit}</p>
            </div>

            <Input
                label="Service"
                placeholder="Enter Service Name"
                value={value?.detail || ''}
                onChange={(val: string) => onChange({ ...value, detail: val })}
            />

            <div className="mt-4">
                <p className="block text-sm font-medium text-foreground mb-1">Appointment Status</p>
                <Listbox value={selectedStatus} onChange={setSelectedStatus}>
                    <div className="relative mt-1">
                        <ListboxButton className="w-full rounded-md bg-background dark:bg-card py-1.5 pl-3 pr-10 text-left shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-[#1DA68F]/50 focus:border-[#1DA68F] sm:text-sm text-muted-foreground transition-colors">
                            <span className="block truncate text-foreground">{selectedStatus.name}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                            </span>
                        </ListboxButton>
                        <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover dark:bg-card shadow-lg ring-1 ring-border focus:outline-none sm:text-sm border border-[#1DA68F]/50 shadow-[#1DA68F]/20 dark:shadow-[#1DA68F]/10">
                            {statusOptions.map((option: any) => (
                                <ListboxOption
                                    key={option.id}
                                    value={option}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 transition-colors ${
                                            active 
                                                ? 'bg-[#1DA68F]/10 dark:bg-[#1DA68F]/20 text-foreground' 
                                                : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                                        }`
                                    }
                                >
                                    {({ selected }) => (
                                        <>
                                            <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                                {option.name}
                                            </span>
                                            {selected && (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#1DA68F]">
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </div>
                </Listbox>
            </div>

            {selectedStatus.name === 'Rescheduled' && (
                <div>
                    <p className="block text-sm font-medium text-foreground mt-4 mb-2">Rescheduled Appointment</p>
                    <div className="flex gap-4 bg-card dark:bg-background/50 py-2 px-4 rounded-md border border-border">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-foreground mb-1">Date</label>
                            <input
                                type="date"
                                value={rescheduleDate}
                                onChange={(e) => setRescheduleDate(e.target.value)}
                                className="mt-2 block w-full rounded-md border border-border text-foreground bg-background dark:bg-card px-3 py-1.5 text-base focus:outline-none focus:ring-2 focus:ring-[#1DA68F]/50 focus:border-[#1DA68F] transition-colors"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-foreground mb-1">Slot</label>
                            <input
                                type="time"
                                value={rescheduleTime}
                                onChange={(e) => setRescheduleTime(e.target.value)}
                                className="mt-2 block w-full rounded-md border border-border bg-background dark:bg-card px-3 text-foreground py-1.5 text-base focus:outline-none focus:ring-2 focus:ring-[#1DA68F]/50 focus:border-[#1DA68F] transition-colors"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StepAppointments;
