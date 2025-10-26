// src/components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className="space-y-1">
                {label && <label className="text-sm font-medium text-gray-900">{label}</label>}
                <input
                    ref={ref}
                    {...props}
                    className={clsx(
                        'w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400  focus:outline-offset-2',
                        error ? 'border-red-500 focus:outline-red-500' : 'border-gray-300 focus:outline-primary',
                        className
                    )}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        )
    }
)

Input.displayName = 'Input'

