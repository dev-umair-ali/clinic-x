import React from 'react';

interface Props {
    current: number;
    total: number;
    referenceCode?: string;
}

const PatientStatusProgress = ({ current, total, referenceCode }: Props) => {
    return (
        <div className="flex items-start flex-col text-[#3c3c3c] text-sm">
            {/* Progress dots */}
            <div className="flex items-center gap-2">
                <div className="flex items-center rounded ">
                    {[...Array(total)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 w-10 ${i < current ? 'bg-[#166435] rounded' : 'bg-[#1DA68F]/10 rounded-r'}`}
                        ></div>
                    ))}
                </div>
            </div>

            <span className="text-xs text-gray-600 pt-1">{current}/{total}</span>

        </div>
    );
};

export default PatientStatusProgress;
