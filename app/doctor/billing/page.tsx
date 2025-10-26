"use client"

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
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Credit Tracking</h1>
              <p className="text-gray-600 dark:text-gray-400">Monitor AI service usage and credit consumption</p>
            </div>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Buy More Credits
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Total Purchased Section */}
            <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Purchased</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">1,000</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: "62%" }}></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-right">62%</p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">1000</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Purchased</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">515</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Credits Used</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">485</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Credits Left</p>
                </div>
              </div>
            </Card>

            {/* Usage Tracking */}
            <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Play className="w-5 h-5 text-purple-500 mr-3" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Video Summary</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">156/200</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-black dark:bg-white h-2 rounded-full" style={{ width: "78%" }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Volume2 className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Audio Summary</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">106/200</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-black dark:bg-white h-2 rounded-full" style={{ width: "53%" }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-orange-500 mr-3" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Text Analysis</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">180/200</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-black dark:bg-white h-2 rounded-full" style={{ width: "90%" }}></div>
                </div>
              </div>
            </Card>
          </div>

          {/* Usage Trend Chart */}
          <Card className="w-full bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 mb-8">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Usage Trend</h2>

              <div className="flex items-center gap-4">
                {/* Toggle Buttons */}
                <div className="flex bg-gray-50 dark:bg-gray-700 rounded-lg p-1 shadow-sm border dark:border-gray-600">
                  <button
                    onClick={() => setActiveToggle("weekly")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeToggle === "weekly"
                        ? "bg-teal-500 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setActiveToggle("daily")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeToggle === "daily"
                        ? "bg-teal-500 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    Daily
                  </button>
                </div>

                {/* Dropdown */}
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg shadow-sm border dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">July 2025</span>
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "#6b7280",
                      className: "dark:fill-gray-300",
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "#6b7280",
                      className: "dark:fill-gray-300",
                    }}
                    tickFormatter={(value) => `${value / 1000}k`}
                    domain={[0, 5000]}
                    ticks={[0, 1000, 2000, 3000, 4000, 5000]}
                  />
                  <Bar dataKey="dark" stackId="a" fill="#0d9488" radius={[0, 0, 4, 4]} className="dark:fill-teal-600" />
                  <Bar
                    dataKey="light"
                    stackId="a"
                    fill="#5eead4"
                    radius={[4, 4, 0, 0]}
                    className="dark:fill-teal-300"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Credit Packages */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Credit Packages</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic Package */}
              <Card className="p-6 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Basic</h4>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">$49.99</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">500 Credits</p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Voice Notes</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Transcription</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Basic Analytics</span>
                  </div>
                </div>
                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">Purchase</Button>
              </Card>

              {/* Professional Package */}
              <Card className="p-6 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Professional</h4>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">$99.99</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">1,200 Credits</p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Everything in Basic</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Priority Processing</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Advanced Analytics</span>
                  </div>
                </div>
                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">Purchase</Button>
              </Card>

              {/* Enterprise Package */}
              <Card className="p-6 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Enterprise</h4>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">$249.99</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">3,249.99 Credits</p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Everything in Professional</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Custom AI Training</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-3" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Dedicated Support</span>
                  </div>
                </div>
                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">Purchase</Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
