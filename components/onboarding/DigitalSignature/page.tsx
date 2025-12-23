"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DigitalSignature({
  formData,
  updateFormData,
}: {
  formData: any;
  updateFormData: (f: string, v: any) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] mb-4">
        Digital Signature
      </h3>
      <div className="mb-4">
        <Input
          value={formData.digitalSignature}
          onChange={(e) => updateFormData("digitalSignature", e.target.value)}
          placeholder="Type your full legal name as your digital signature"
          className="text-lg bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
        />
      </div>
      <p className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
        By typing your name above, you are providing your digital signature and
        agreeing to all terms.
      </p>
    </div>
  );
}