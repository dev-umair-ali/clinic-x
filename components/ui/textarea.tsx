import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        `
        flex min-h-[80px] w-full rounded-md
        border border-[hsl(var(--border))]
        bg-[hsl(var(--background))]
        px-3 py-2 text-base
        placeholder:text-[hsl(var(--muted-foreground))]
        ring-offset-[hsl(var(--background))]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[hsl(var(--color-brand-teal))]
        focus-visible:border-[hsl(var(--color-brand-teal))]
        focus-visible:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-50
        md:text-sm
        `,
        className
      )}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"
export { Textarea }
