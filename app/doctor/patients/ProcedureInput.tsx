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
        <div className="w-full">
            {label && (
                <label className="block py-2 text-gray-700 dark:text-gray-300 text-xs font-semibold">
                    {label}
                </label>
            )}
            {type === "textarea" ? (
                <textarea
                    className="w-full border rounded p-2 text-xs 
                               border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-800 
                               text-gray-900 dark:text-gray-100"
                    rows={4}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <input
                    type={type}
                    className="w-full border rounded p-2 text-xs
                               border-gray-300 dark:border-gray-600
                               bg-white dark:bg-gray-800 
                               text-gray-900 dark:text-gray-100"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
        </div>
    );
};

export default Input;
