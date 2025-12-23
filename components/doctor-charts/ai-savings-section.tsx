// AISavingsSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressCircle } from "./progress-circle";
import { FileText, Mic, RefreshCcw, DollarSign } from 'lucide-react';

interface AISavingsItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function AISavingsItem({ icon, title, value }: AISavingsItemProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-md bg-[hsl(var(--muted)/0.5)]">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-[hsl(var(--card))] p-2 text-[hsl(var(--muted-foreground))] shadow-sm border border-[hsl(var(--border))]">
          {icon}
        </div>
        <div className="text-sm font-medium text-[hsl(var(--muted-foreground))]">{title}</div>
      </div>
      <div className="text-right">
        <p className="text-base font-semibold text-[hsl(var(--foreground))]">{value}</p>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">Saved</p>
      </div>
    </div>
  );
}

export function AISavingsSection() {
  return (
    <Card className="shadow-sm rounded-xl">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-[hsl(var(--foreground))]">
          Clinic X Saved You 7.5 Hours This Week
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        {/* Progress circle */}
        <div className="flex justify-center md:justify-start w-full md:w-auto">
          <ProgressCircle
            percentage={65}
            size={110}
            strokeWidth={10}
            label="Efficiency"
            color="hsl(var(--color-brand-teal))"
            bgColor="hsl(var(--muted))"
          />
        </div>
        {/* Savings Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <AISavingsItem icon={<Mic className="h-5 w-5" />} title="Voice-to-Text" value="3.2h" />
          <AISavingsItem icon={<FileText className="h-5 w-5" />} title="Auto Summaries" value="2.1h" />
          <AISavingsItem icon={<RefreshCcw className="h-5 w-5" />} title="Refill Automation" value="1.2h" />
          <AISavingsItem icon={<DollarSign className="h-5 w-5" />} title="Smart Billing" value="5.1h" />
        </div>
      </CardContent>
    </Card>
  );
}