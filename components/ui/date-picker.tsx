"use client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange?: (iso: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export function DatePicker({
  value,
  onChange,
  disabled,
  required,
}: DatePickerProps) {
  const date = value ? new Date(value) : undefined;
  const [displayYear, setDisplayYear] = useState(
    date?.getFullYear() || new Date().getFullYear()
  );
  const [displayMonth, setDisplayMonth] = useState(
    date?.getMonth() || new Date().getMonth()
  );

  // Year picker helpers
  const currentYear = new Date().getFullYear();
  const fromYear = currentYear - 50;
  const toYear = currentYear + 20;
  const years = Array.from(
    { length: toYear - fromYear + 1 },
    (_, i) => fromYear + i
  );

  const months = [
    { label: "January", value: 0 },
    { label: "February", value: 1 },
    { label: "March", value: 2 },
    { label: "April", value: 3 },
    { label: "May", value: 4 },
    { label: "June", value: 5 },
    { label: "July", value: 6 },
    { label: "August", value: 7 },
    { label: "September", value: 8 },
    { label: "October", value: 9 },
    { label: "November", value: 10 },
    { label: "December", value: 11 },
  ];

  const handleYearChange = (y: string) => {
    const yearNum = Number(y);
    setDisplayYear(yearNum);
    const newDate = new Date(yearNum, displayMonth, date?.getDate() || 1);
    onChange?.(format(newDate, "yyyy-MM-dd"));
  };

  const handleMonthChange = (m: string) => {
    const monthNum = Number(m);
    setDisplayMonth(monthNum);
    const newDate = new Date(displayYear, monthNum, date?.getDate() || 1);
    onChange?.(format(newDate, "yyyy-MM-dd"));
  };

  const handleDateSelect = (d: Date | undefined) => {
    if (d) {
      setDisplayYear(d.getFullYear());
      setDisplayMonth(d.getMonth());
      onChange?.(format(d, "yyyy-MM-dd"));
    } else {
      onChange?.("");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-9 px-3 text-sm",
            "w-full justify-start text-left font-normal",
            "border-[hsl(var(--border))] focus:border-[hsl(var(--color-brand-teal))]",
            "dark:text-[hsl(var(--foreground))] dark:placeholder-[hsl(var(--muted-foreground))]",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
          <span className="dark:text-[hsl(var(--muted-foreground))]">
            {date ? format(date, "PPP") : "YYYY-MM-DD"}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex items-center justify-between gap-2 p-3 border-b">
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Year
            </label>
            <Select
              value={String(displayYear)}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="h-8 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {years.map((y) => (
                  <SelectItem
                    key={y}
                    value={String(y)}
                    className="text-xs py-1"
                  >
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground block mb-1">
              Month
            </label>
            <Select
              value={String(displayMonth)}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="h-8 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {months.map((m) => (
                  <SelectItem
                    key={m.value}
                    value={String(m.value)}
                    className="text-xs py-1"
                  >
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          required={required}
          month={new Date(displayYear, displayMonth)}
          onMonthChange={(m) => {
            setDisplayYear(m.getFullYear());
            setDisplayMonth(m.getMonth());
          }}
          classNames={{
            months: "space-y-1",
            month: "space-y-1",
            day: "h-7 w-7 text-xs",
            head_row: "flex",
            head_cell: "text-xs",
            row: "flex mt-1",
            cell: "h-7 w-7 text-xs",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
