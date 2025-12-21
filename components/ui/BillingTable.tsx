"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, ChevronDown, Trash2 } from "lucide-react";
import { MdOutlineModeEdit } from "react-icons/md";
import { BsFillSendFill } from "react-icons/bs";

export interface BillingItem {
  id: number;
  cpt: string;
  patient: string;
  copay: string;
  desc: string;
  charge: string;
  adjustment: string;
  insurance: string;
  paid: string;
  date: string;
  responsibility: string;
  reason: string;
  status: string;
}

interface BillingTableProps {
  data: BillingItem[];
  onStatusChange?: (id: number, newStatus: string) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onSend?: (id: number) => void;
}

export default function BillingTable({
  data,
  onStatusChange,
  onEdit,
  onDelete,
  onSend,
}: BillingTableProps) {
  return (
    <div className="overflow-x-auto border-t border-[hsl(var(--border))]">
      <div className="min-w-[1600px] lg:min-w-[1800px]">
        {/* Header */}
        <div className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-3 bg-[hsl(var(--accent))] border-b border-[hsl(var(--border))] text-xs font-medium text-[hsl(var(--foreground))] uppercase tracking-wider">
          <div>PATIENT</div>
          <div>CO PAY</div>
          <div>DESCRIPTION</div>
          <div>CHARGE</div>
          <div>ADJUSTMENT</div>
          <div>INSURANCE PAID</div>
          <div>CLAIM STATUS</div>
          <div>PATIENT PAID</div>
          <div>DATE</div>
          <div>PATIENT RESPONSIBILITY</div>
          <div>REASON</div>
          <div>PAYMENT STATUS</div>
          <div>ACTION</div>
        </div>

        {/* Rows */}
        {data.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-4 items-center text-sm border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--accent))]"
          >
            {/* PATIENT */}
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full overflow-hidden flex-shrink-0 border border-[hsl(var(--border))]">
                <img
                  src="/woman-profile.png"
                  alt={row.patient}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium text-[hsl(var(--foreground))] text-xs lg:text-sm truncate">
                {row.patient}
              </span>
            </div>

            {/* CO PAY */}
            <div className="text-[hsl(var(--foreground))] font-medium text-xs lg:text-sm">
              {row.copay}
            </div>

            {/* DESCRIPTION */}
            <div className="text-[hsl(var(--foreground))] text-xs lg:text-sm">
              {row.desc}
            </div>

            {/* CHARGE */}
            <div className="text-[hsl(var(--foreground))] font-medium text-xs lg:text-sm">
              {row.charge}
            </div>

            {/* ADJUSTMENT */}
            <div className="text-[hsl(var(--foreground))] text-xs lg:text-sm">
              {row.adjustment}
            </div>

            {/* INSURANCE PAID */}
            <div className="text-[hsl(var(--foreground))] text-xs lg:text-sm">
              {row.insurance}
            </div>

            {/* CLAIM STATUS */}
            <div>
              <Badge className="bg-[hsl(var(--color-status-warning-light))] text-[hsl(var(--color-status-warning))] hover:bg-[hsl(var(--color-status-warning-light))] text-xs px-2 py-1 font-medium border-0">
                {row.status}
              </Badge>
            </div>

            {/* PATIENT PAID */}
            <div className="text-[hsl(var(--foreground))] text-xs lg:text-sm">
              {row.paid}
            </div>

            {/* DATE */}
            <div className="flex items-center gap-1 lg:gap-2 text-[hsl(var(--foreground))] text-xs lg:text-sm">
              <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-[hsl(var(--muted-foreground))]" />
              {row.date}
            </div>

            {/* PATIENT RESPONSIBILITY */}
            <div className="text-[hsl(var(--foreground))] text-xs lg:text-sm">
              {row.responsibility}
            </div>

            {/* REASON */}
            <div className="text-[hsl(var(--muted-foreground))] text-xs">
              {row.reason}
            </div>

            {/* PAYMENT STATUS */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 lg:h-8 px-2 lg:px-3 text-xs border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]"
                  >
                    {row.status}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
                  {["Submitted", "Pending", "Paid", "Denied"].map((st) => (
                    <DropdownMenuItem
                      key={st}
                      className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]"
                      onClick={() => onStatusChange?.(row.id, st)}
                    >
                      {st}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* ACTION */}
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-[hsl(var(--color-brand-teal-light))] text-[hsl(var(--color-brand-teal))]"
                onClick={() => onSend?.(row.id)}
              >
                <BsFillSendFill className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-[hsl(var(--color-brand-teal-light))] text-[hsl(var(--color-brand-teal))]"
                onClick={() => onEdit?.(row.id)}
              >
                <MdOutlineModeEdit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-[hsl(var(--color-status-error-light))] text-[hsl(var(--color-status-error))]"
                onClick={() => onDelete?.(row.id)}
              >
                <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}