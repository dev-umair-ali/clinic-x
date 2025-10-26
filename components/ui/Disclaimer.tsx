import React from 'react'
import { InfoIcon } from 'lucide-react'

const Disclaimer = () => {
  return (
    <div className="w-full rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 p-4 shadow-sm transition-colors duration-200">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center mt-1">
          <InfoIcon className="text-primary size-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-primary mb-1">AI-Generated Content Disclaimer</h3>
          <p className="text-xs text-foreground/80 leading-relaxed">
            This note was <span className="font-semibold text-foreground">generated using AI tools</span> (e.g., voice-to-text, auto-summarization).
            It <span className="font-semibold text-destructive">may contain errors</span> or misinterpretations of medical language.
            <br />
            <span className="font-medium text-foreground">
              Please review carefully and edit before finalizing or adding to the patient's record.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Disclaimer
