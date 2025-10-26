import React from 'react'
import '../../styles/loader.css'

export const Loader = () => {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-white">
            <div className="relative h-12 w-12">
                <div className="loader10"></div>
            </div>
        </div>
    )
}