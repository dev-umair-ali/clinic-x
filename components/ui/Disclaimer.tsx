import React from 'react'
import { InfoIcon } from 'lucide-react'

const Disclaimer = () => {
  return (
    <div className="w-full rounded-lg bg-[hsl(var(--primary)/0.05)] dark:bg-[hsl(var(--primary)/0.1)] border border-[hsl(var(--primary)/0.2)] dark:border-[hsl(var(--primary)/0.3)] p-4 shadow-sm transition-colors duration-200">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center mt-1">
          <InfoIcon className="text-[hsl(var(--color-brand-teal))] size-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[hsl(var(--color-brand-teal))] mb-1">AI-Generated Content Disclaimer</h3>
          <p className="text-xs text-[hsl(var(--foreground)/0.8)] leading-relaxed">
            This note was <span className="font-semibold text-[hsl(var(--foreground))]">generated using AI tools</span> (e.g., voice-to-text, auto-summarization).
            It <span className="font-semibold text-[hsl(var(--destructive))]">may contain errors</span> or misinterpretations of medical language.
            <br />
            <span className="font-medium text-[hsl(var(--foreground))]">
              Please review carefully and edit before finalizing or adding to the patient's record.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Disclaimer