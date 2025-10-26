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
                <label className="block py-2 text-foreground/80 text-xs font-semibold">
                    {label}
                </label>
            )}
            {type === "textarea" ? (
                <textarea
                    className="w-full border border-border rounded-md p-3 bg-background/50 dark:bg-card/50 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
                    rows={4}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <input
                    type={type}
                    className="w-full border border-border rounded-md p-3 bg-background/50 dark:bg-card/50 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}
        </div>
    );
};

export default Input;
