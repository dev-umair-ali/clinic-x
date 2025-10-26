import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import { Loader } from './Loader'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost'
    loading?: boolean
}

export const Button = ({ children, className, variant = 'primary', loading = false, ...props }: ButtonProps) => {
    const base = 'relative flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-2 focus:outline-offset-2 focus:outline-primary shadow transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-gradient-to-r from-[#5EC9BD] to-[#2C7F75] text-white hover:opacity-90',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-50',
    }

    return (
        <button className={clsx(base, variants[variant], className)} disabled={loading || props.disabled} {...props}>
            {loading ? <LoaderInline /> : children}
        </button>
    )
}

const LoaderInline = () => (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
)
