'use client'

import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--background))] to-[hsl(var(--secondary))/0.05] flex items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--primary))/0.05] rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--primary))/0.05] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* 404 Number with animation */}
          <div className="relative">
            <div className="text-9xl md:text-[140px] font-black bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))/0.6] bg-clip-text text-transparent leading-none animate-bounce" style={{ animationDuration: '3s' }}>
              404
            </div>
            <div className="absolute inset-0 text-9xl md:text-[140px] font-black text-[hsl(var(--primary))/0.10] blur-xl -z-10">
              404
            </div>
          </div>

          {/* Icon with rotation animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--color-brand-teal))/0.20] to-[hsl(var(--color-brand-teal))/0] rounded-full blur-2xl animate-spin" style={{ animationDuration: '4s' }} />
              <div className="relative bg-[hsl(var(--color-brand-teal))/0.5] p-6 rounded-full backdrop-blur-sm border border-[hsl(var(--primary))/0.20] animate-in zoom-in duration-500" style={{ animationDelay: '0.2s' }}>
                <AlertCircle className="w-16 h-16 text-[hsl(var(--color-brand-teal))] animate-pulse" />
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-[hsl(var(--foreground))] text-balance animate-in fade-in slide-in-from-top-8 duration-700" style={{ animationDelay: '0.3s' }}>
              Page Not Found
            </h1>
            <p className="text-base md:text-lg text-[hsl(var(--muted-foreground))] max-w-md mx-auto text-balance animate-in fade-in slide-in-from-top-8 duration-700" style={{ animationDelay: '0.4s' }}>
              The page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '0.5s' }}>
            <Link href="/" className="group relative inline-flex items-center justify-center gap-2 px-8 py-3 md:py-4 bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))] font-semibold rounded-lg hover:shadow-lg hover:shadow-[hsl(var(--primary))/0.25] transition-all duration-300 hover:-translate-y-1 active:translate-y-0">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
          </div>

          {/* Floating elements animation */}
          <div className="absolute top-1/4 left-5 w-3 h-3 bg-[hsl(var(--primary))/0.40] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-1/3 right-8 w-2 h-2 bg-[hsl(var(--primary))/0.30] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-2/3 left-1/4 w-1 h-1 bg-[hsl(var(--primary))/0.20] rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Subtle animated grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
    </main>
  )
}