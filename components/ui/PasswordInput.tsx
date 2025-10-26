// src/components/ui/PasswordInput.tsx
import { useState } from 'react'
import { InputHTMLAttributes } from 'react'
import { Input } from './Input'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
}

export const PasswordInput = ({ label, ...props }: PasswordInputProps) => {
    const [visible, setVisible] = useState(false)

    return (
        <div className="relative">
            <Input
                type={visible ? 'text' : 'password'}
                label={label}
                {...props}
                className="pr-10"
            />
            <button
                type="button"
                onClick={() => setVisible((v) => !v)}
                className="absolute right-2 top-[34px] text-gray-500 hover:text-gray-700 cursor-pointer"
            >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    )
}