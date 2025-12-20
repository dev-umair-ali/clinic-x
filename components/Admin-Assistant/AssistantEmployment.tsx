"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase } from "lucide-react"

const clinicOptions = [
  "Main Street Clinic",
  "Downtown Medical Center",
  "Westside Health Clinic",
  "Eastside Family Practice",
  "Central Hospital Outpatient",
]

const departmentOptions = [
  "Front Desk",
  "Administration",
  "Billing",
  "Patient Services",
  "Medical Records",
  "Human Resources",
]

const roleOptions = [
  "Receptionist",
  "Medical Assistant",
  "Administrative Assistant",
  "Billing Coordinator",
  "Patient Coordinator",
  "Office Manager",
  "Data Entry Clerk",
  "Appointment Scheduler",
]

const employmentTypes = ["Full-time", "Part-time", "Contract", "Temporary"]

interface Props {
  data: {
    assignedClinic: string
    department: string
    role: string
    employeeId: string
    hireDate: string
    employmentType: string
    salary: string
  }
  onChange: (field: string, val: string) => void
}

export default function AssistantEmployment({ data, onChange }: Props) {
  return (
    <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="bg-[#F8F9FA] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
          <Briefcase className="h-5 w-5 text-[#1DA68F]" />
          Employment Information
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 bg-white dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="assignedClinic" className="text-gray-700 dark:text-gray-300">
              Assigned Clinic <span className="text-red-500">*</span>
            </Label>
            <Select value={data.assignedClinic} onValueChange={(v) => onChange("assignedClinic", v)}>
              <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]">
                <SelectValue placeholder="Select clinic" />
              </SelectTrigger>
              <SelectContent>
                {clinicOptions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-gray-700 dark:text-gray-300">
              Department
            </Label>
            <Select value={data.department} onValueChange={(v) => onChange("department", v)}>
              <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-gray-700 dark:text-gray-300">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select value={data.role} onValueChange={(v) => onChange("role", v)}>
              <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeId" className="text-gray-700 dark:text-gray-300">
              Employee ID
            </Label>
            <Input
              id="employeeId"
              value={data.employeeId}
              onChange={(e) => onChange("employeeId", e.target.value)}
              placeholder="Enter employee ID"
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hireDate" className="text-gray-700 dark:text-gray-300">
              Hire Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="hireDate"
              type="date"
              value={data.hireDate}
              onChange={(e) => onChange("hireDate", e.target.value)}
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employmentType" className="text-gray-700 dark:text-gray-300">
              Employment Type <span className="text-red-500">*</span>
            </Label>
            <Select value={data.employmentType} onValueChange={(v) => onChange("employmentType", v)}>
              <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {employmentTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary" className="text-gray-700 dark:text-gray-300">
              Salary
            </Label>
            <Input
              id="salary"
              value={data.salary}
              onChange={(e) => onChange("salary", e.target.value)}
              placeholder="Enter salary"
              className="border-gray-300 dark:border-gray-600 focus:border-[#1DA68F] focus:ring-[#1DA68F]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}