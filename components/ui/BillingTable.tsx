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
    <div className="overflow-x-auto border-t border-slate-200 dark:border-gray-700">
      <div className="min-w-[1600px] lg:min-w-[1800px]">
        {/* Header */}
        <div className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-3 bg-slate-100 dark:bg-gray-800 border-b border-border dark:border-gray-700 text-xs font-medium text-slate-700 dark:text-gray-300 uppercase tracking-wider">
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
            className="grid grid-cols-[120px_70px_120px_90px_100px_110px_110px_90px_90px_120px_110px_110px_90px] lg:grid-cols-[140px_80px_140px_100px_110px_120px_120px_100px_100px_140px_120px_120px_100px] gap-2 lg:gap-4 px-3 lg:px-4 py-4 items-center text-sm border-b border-border dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800"
          >
            {/* PATIENT */}
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full overflow-hidden flex-shrink-0 border border-slate-200 dark:border-gray-600">
                <img
                  src="/woman-profile.png"
                  alt={row.patient}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium text-slate-900 dark:text-gray-100 text-xs lg:text-sm truncate">
                {row.patient}
              </span>
            </div>

            {/* CO PAY */}
            <div className="text-slate-900 dark:text-gray-100 font-medium text-xs lg:text-sm">
              {row.copay}
            </div>

            {/* DESCRIPTION */}
            <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
              {row.desc}
            </div>

            {/* CHARGE */}
            <div className="text-slate-900 dark:text-gray-100 font-medium text-xs lg:text-sm">
              {row.charge}
            </div>

            {/* ADJUSTMENT */}
            <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
              {row.adjustment}
            </div>

            {/* INSURANCE PAID */}
            <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
              {row.insurance}
            </div>

            {/* CLAIM STATUS */}
            <div>
              <Badge className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900 text-xs px-2 py-1 font-medium border-0">
                {row.status}
              </Badge>
            </div>

            {/* PATIENT PAID */}
            <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
              {row.paid}
            </div>

            {/* DATE */}
            <div className="flex items-center gap-1 lg:gap-2 text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
              <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-slate-400 dark:text-gray-500" />
              {row.date}
            </div>

            {/* PATIENT RESPONSIBILITY */}
            <div className="text-slate-900 dark:text-gray-100 text-xs lg:text-sm">
              {row.responsibility}
            </div>

            {/* REASON */}
            <div className="text-slate-600 dark:text-gray-400 text-xs">
              {row.reason}
            </div>

            {/* PAYMENT STATUS */}
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 lg:h-8 px-2 lg:px-3 text-xs border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300"
                  >
                    {row.status}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
                  {["Submitted", "Pending", "Paid", "Denied"].map((st) => (
                    <DropdownMenuItem
                      key={st}
                      className="dark:text-gray-300 dark:hover:bg-gray-700"
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
                className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-teal-50 dark:hover:bg-teal-900 text-teal-600 dark:text-teal-400"
                onClick={() => onSend?.(row.id)}
              >
                <BsFillSendFill className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-teal-50 dark:hover:bg-teal-900 text-teal-600 dark:text-teal-400"
                onClick={() => onEdit?.(row.id)}
              >
                <MdOutlineModeEdit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 lg:h-7 lg:w-7 p-0 hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
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