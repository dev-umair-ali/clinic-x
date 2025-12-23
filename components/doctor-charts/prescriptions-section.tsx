"use client";

import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LineChartWithArea } from "./line-chart-with-area"
import { ChevronDown, Pill, RefreshCcw } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface PrescriptionStatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative"
  icon: React.ReactNode
}

function PrescriptionStatCard({ title, value, change, changeType, icon }: PrescriptionStatCardProps) {
  const changeColorClass = changeType === "positive" ? "text-[hsl(var(--color-status-success))]" : "text-[hsl(var(--color-status-error))]"
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-full p-2 bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">{icon}</div>
          <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">{title}</CardTitle>
        </div>
        {change && (
          <span className={`text-xs font-medium ${changeColorClass}`}>{change}</span>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[hsl(var(--foreground))]">{value}</div>
      </CardContent>
    </Card>
  )
}

export function PrescriptionsSection() {
  const prescriptionChartData = [
    { name: "Sat", total: 10, pending: 2 },
    { name: "Sun", total: 12, pending: 4 },
    { name: "Mon", total: 8, pending: 3 },
    { name: "Tue", total: 15, pending: 6 },
    { name: "Wed", total: 11, pending: 5 },
    { name: "Thu", total: 13, pending: 7 },
    { name: "Fri", total: 9, pending: 4 },
  ]

  return (
    <div className="bg-[hsl(var(--card))] p-4 rounded border border-[hsl(var(--border))]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">Prescriptions Trends</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-[hsl(var(--foreground))] border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]">
              Weekly <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>Weekly</DropdownMenuItem>
            <DropdownMenuItem>Monthly</DropdownMenuItem>
            <DropdownMenuItem>Quarterly</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <PrescriptionStatCard
          title="Total Prescriptions"
          value="245"
          change="+8%"
          changeType="positive"
          icon={<Pill className="h-5 w-5" />}
        />
        <PrescriptionStatCard
          title="Pending Refills"
          value="23"
          change="-2%"
          changeType="negative"
          icon={<RefreshCcw className="h-5 w-5" />}
        />
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">Most Prescribed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[hsl(var(--foreground))]">Metformin</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm p-4">
        <LineChartWithArea
          data={prescriptionChartData}
          totalColor="hsl(var(--custom-dashboard-green-DEFAULT))"
          pendingColor="hsl(var(--custom-dashboard-blue-DEFAULT))"
        />
        <div className="flex justify-center gap-6 mt-4 text-sm text-[hsl(var(--muted-foreground))]">
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-[hsl(var(--color-brand-teal))] mr-2" /> Total Prescriptions
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-[hsl(var(--custom-dashboard-blue-DEFAULT))] mr-2" /> Pending Refills
          </div>
        </div>
      </Card>
    </div>
  )
}