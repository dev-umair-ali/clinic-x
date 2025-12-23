"use client";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function InsuranceCardUpload() {
  return (
    <div>
      <h3 className="text-base font-medium text-[hsl(var(--foreground))] mb-4">
        Insurance Card Upload
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2 block">
            Insurance Card (Front)
          </Label>
          <div className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-[hsl(var(--muted-foreground))] mx-auto mb-2" />
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">Click to upload front</p>
            <Button variant="outline" size="sm" className="border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]">
              Choose File
            </Button>
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-[hsl(var(--muted-foreground))] mb-2 block">
            Insurance Card (Back)
          </Label>
          <div className="border-2 border-dashed border-[hsl(var(--border))] rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-[hsl(var(--muted-foreground))] mx-auto mb-2" />
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">Click to upload back</p>
            <Button variant="outline" size="sm" className="border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]">
              Choose File
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}