import React from "react";

interface InputProps {
    label: string;
    type?: "text" | "number" | "textarea";
    placeholder?: string;
    value?: string | number;
    onChange: (value: any) => void;
}

const Input: React.FC<InputProps> = ({ label, type = "text", placeholder, value, onChange }) => {
    return (
        <div className=" w-full">
            {label &&
                <label className="block  py-2 text-gray-700 text-xs font-semibold ">{label}</label>
            }
            {type === "textarea" ? (
                <textarea
                    className="w-full border border-gray-300 rounded p-2 bg-[#f6f6f6] text-xs "
                    rows={4}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <input
                    type={type}
                    className="w-full border rounded border-gray-300 p-2 bg-[#f6f6f6] text-xs"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
        </div>
    );
};

export default Input;
