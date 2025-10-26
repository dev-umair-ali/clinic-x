'use client'

import React from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchBarProps {
    placeholder?: string
    onChange?: (value: string) => void
    value?: string
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search...', onChange, value }) => {
    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="flex-1 hidden sm:grid grid-cols-1 relative "
        >
            <input
                type="search"
                name="search"
                placeholder={placeholder}
                aria-label="Search"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className="col-start-1 row-start-1 block w-full bg-white pl-10 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm p-3 rounded-lg border border-gray-200"
            />
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
        </form>
    )
}

export default SearchBar
