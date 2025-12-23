"use client";
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { Card } from "@/components/ui/card"
import { Plus, Play, Volume2, FileText, Check } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const data = [
  { week: "Week 1", dark: 1500, light: 1500 },
  { week: "Week 2", dark: 2000, light: 2000 },
  { week: "Week 3", dark: 1000, light: 1500 },
  { week: "Week 4", dark: 2000, light: 2500 },
]

export default function BillingPage() {
  const [activeToggle, setActiveToggle] = useState<"weekly" | "daily">("weekly")

  return (
    <ProtectedRoute allowedRoles={["admin", "doctor", ]}>
      <div className="flex-1 overflow-y-auto p-6 bg-[hsl(var(--background))]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">Credit Tracking</h1>
              <p className="text-[hsl(var(--muted-foreground))]">Monitor AI service usage and credit consumption</p>
            </div>
            <Button className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))]">
              <Plus className="w-4 h-4 mr-2" />
              Buy More Credits
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Total Purchased Section */}
            <Card className="p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[hsl(var(--color-chart-blue)/0.1)] rounded-lg flex items-center justify-center mr-3">
                  <div className="w-4 h-4 bg-[hsl(var(--color-chart-blue))] rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">Total Purchased</p>
                  <p className="text-3xl font-bold text-[hsl(var(--foreground))]">1,000</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="w-full bg-[hsl(var(--muted))] rounded-full h-3 mb-2">
                  <div className="bg-[hsl(var(--color-chart-blue))] h-3 rounded-full" style={{ width: "62%" }}></div>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] text-right">62%</p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-[hsl(var(--foreground))]">1000</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Total Purchased</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-[hsl(var(--foreground))]">515</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Credits Used</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-[hsl(var(--foreground))]">485</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Credits Left</p>
                </div>
              </div>
            </Card>

            {/* Usage Tracking */}
            <Card className="p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Play className="w-5 h-5 text-[hsl(var(--color-chart-purple))] mr-3" />
                    <span className="text-sm font-medium text-[hsl(var(--foreground))]">Video Summary</span>
                  </div>
                  <span className="text-sm font-semibold text-[hsl(var(--foreground))]">156/200</span>
                </div>
                <div className="w-full bg-[hsl(var(--muted))] rounded-full h-2">
                  <div className="bg-[hsl(var(--foreground))] h-2 rounded-full" style={{ width: "78%" }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Volume2 className="w-5 h-5 text-[hsl(var(--color-status-warning))] mr-3" />
                    <span className="text-sm font-medium text-[hsl(var(--foreground))]">Audio Summary</span>
                  </div>
                  <span className="text-sm font-semibold text-[hsl(var(--foreground))]">106/200</span>
                </div>
                <div className="w-full bg-[hsl(var(--muted))] rounded-full h-2">
                  <div className="bg-[hsl(var(--foreground))] h-2 rounded-full" style={{ width: "53%" }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-[hsl(var(--color-chart-orange))] mr-3" />
                    <span className="text-sm font-medium text-[hsl(var(--foreground))]">Text Analysis</span>
                  </div>
                  <span className="text-sm font-semibold text-[hsl(var(--foreground))]">180/200</span>
                </div>
                <div className="w-full bg-[hsl(var(--muted))] rounded-full h-2">
                  <div className="bg-[hsl(var(--foreground))] h-2 rounded-full" style={{ width: "90%" }}></div>
                </div>
              </div>
            </Card>
          </div>

          {/* Usage Trend Chart */}
          <Card className="w-full bg-[hsl(var(--card))] p-6 border border-[hsl(var(--border))] mb-8">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Usage Trend</h2>

              <div className="flex items-center gap-4">
                {/* Toggle Buttons */}
                <div className="flex bg-[hsl(var(--muted))] rounded-lg p-1 shadow-sm border border-[hsl(var(--border))]">
                  <button
                    onClick={() => setActiveToggle("weekly")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeToggle === "weekly"
                        ? "bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))] shadow-sm"
                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setActiveToggle("daily")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeToggle === "daily"
                        ? "bg-[hsl(var(--color-brand-teal))] text-[hsl(var(--primary-foreground))] shadow-sm"
                        : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                    }`}
                  >
                    Daily
                  </button>
                </div>

                {/* Dropdown */}
                <div className="flex items-center gap-2 bg-[hsl(var(--muted))] px-3 py-2 rounded-lg shadow-sm border border-[hsl(var(--border))] cursor-pointer hover:bg-[hsl(var(--muted))] transition-colors">
                  <span className="text-sm font-medium text-[hsl(var(--foreground))]">July 2025</span>
                  <ChevronDown className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  barCategoryGap="10%"
                  maxBarSize={15}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" className="dark:stroke-[hsl(var(--border))]" />
                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                      className: "dark:fill-[hsl(var(--muted-foreground))]",
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                      className: "dark:fill-[hsl(var(--muted-foreground))]",
                    }}
                    tickFormatter={(value) => `${value / 1000}k`}
                    domain={[0, 5000]}
                    ticks={[0, 1000, 2000, 3000, 4000, 5000]}
                  />
                  <Bar dataKey="dark" stackId="a" fill="hsl(var(--color-brand-teal-dark))" radius={[0, 0, 4, 4]} className="dark:fill-[hsl(var(--color-brand-teal-dark))]" />
                  <Bar
                    dataKey="light"
                    stackId="a"
                    fill="hsl(var(--color-brand-teal-light))"
                    radius={[4, 4, 0, 0]}
                    className="dark:fill-[hsl(var(--color-brand-teal-light))]"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Credit Packages */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-6">Credit Packages</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Package */}
              <Card className="p-6 border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">Basic</h4>
                  <div className="text-3xl font-bold text-[hsl(var(--foreground))] mb-1">$49.99</div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">500 Credits</p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-[hsl(var(--color-status-success))] mr-3" />
                    <span className="text-sm text-[hsl(var(--foreground))]">Voice Notes</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-[hsl(var(--color-status-success))] mr-3" />
                    <span className="text-sm text-[hsl(var(--foreground))]">Transcription</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-[hsl(var(--color-status-success))] mr-3" />
                    <span className="text-sm text-[hsl(var(--foreground))]">Basic Analytics</span>
                  </div>
                </div>
                <Button className="w-full bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))]">
                  Purchase
                </Button>
              </Card>

              {/* Professional Package */}
              <Card className="p-6 border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">Professional</h4>
                  <div className="text-3xl font-bold text-[hsl(var(--foreground))] mb-1">$99.99</div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">1,200 Credits</p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-[hsl(var(--color-status-success))] mr-3" />
                    <span className="text-sm text-[hsl(var(--foreground))]">Everything in Basic</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-[hsl(var(--color-status-success))] mr-3" />
                    <span className="text-sm text-[hsl(var(--foreground))]">Priority Processing</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-[hsl(var(--color-status-success))] mr-3" />
                    <span className="text-sm text-[hsl(var(--foreground))]">Advanced Analytics</span>
                  </div>
                </div>
                <Button className="w-full bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))]">
                  Purchase
                </Button>
              </Card>

              {/* Enterprise Package */}
              <Card className="p-6 border-2 border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">Enterprise</h4>
                  <div className="text-3xl font-bold text-[hsl(var(--foreground))] mb-1">$249.99</div>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">3,249.99 Credits</p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-[hsl(var(--color-status-success))] mr-3" />
                    <span className="text-sm text-[hsl(var(--foreground))]">Everything in Professional</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-[hsl(var(--color-status-success))] mr-3" />
                    <span className="text-sm text-[hsl(var(--foreground))]">Custom AI Training</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-[hsl(var(--color-status-success))] mr-3" />
                    <span className="text-sm text-[hsl(var(--foreground))]">Dedicated Support</span>
                  </div>
                </div>
                <Button className="w-full bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-[hsl(var(--primary-foreground))]">
                  Purchase
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}