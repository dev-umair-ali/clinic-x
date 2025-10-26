"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, CheckIcon } from "lucide-react"
import Image from "next/image"
import { ArrowRightIcon } from "@heroicons/react/20/solid"
import StepAppointments from "./procedure/steps/StepAppointments"
import StepNotes from "./procedure/steps/StepNotes"
import StepPrescription from "./procedure/steps/StepPrescription"
import StepBilling from "./procedure/steps/StepBilling"
import SectionsContent from "./SectionsContent"

const steps = ["Appointments", "Patient Notes", "Prescription", "Billing History"]

type FormData = {
  appointments: {
    detail?: string
    status?: string
    rescheduleDate?: string
    rescheduleTime?: string
  }
  notes: Record<string, any>
  prescription: Record<string, any>
  billing: Record<string, any>
}

const Procedure = ({
  patient,
  goBack,
  initialStep = 0,
}: { patient: any; goBack: () => void; initialStep?: number }) => {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [rescheduleDate, setRescheduleDate] = useState("")
  const [rescheduleTime, setRescheduleTime] = useState("")
  const [formData, setFormData] = useState<FormData>({
    appointments: {},
    notes: {},
    prescription: {},
    billing: {},
  })

  const [activeTab, setActiveTab] = useState("medical-history")

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const statusOptions = [
    { id: 1, name: "Completed" },
    { id: 2, name: "Cancelled" },
    { id: 3, name: "Rescheduled" },
    { id: 4, name: "No Show" },
  ]

  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0])

  useEffect(() => {
    const updated = {
      ...formData.appointments,
      status: selectedStatus.name,
    }
    if (selectedStatus.name === "Rescheduled") {
      updated.rescheduleDate = rescheduleDate
      updated.rescheduleTime = rescheduleTime
    }
    updateFormData("appointments", updated)
  }, [selectedStatus, rescheduleDate, rescheduleTime])

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepAppointments
            patient={patient}
            value={formData.appointments}
            onChange={(val: any) => updateFormData("appointments", val)}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            rescheduleDate={rescheduleDate}
            setRescheduleDate={setRescheduleDate}
            rescheduleTime={rescheduleTime}
            setRescheduleTime={setRescheduleTime}
            statusOptions={statusOptions}
          />
        )
      case 1:
        return <StepNotes formData={formData} updateFormData={updateFormData} />
      case 2:
        return <StepPrescription formData={formData} updateFormData={updateFormData} />
      case 3:
        return <StepBilling formData={formData} updateFormData={updateFormData} />
      default:
        return null
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row -ml-0 md:-ml-8 gap-2 px-5">
        <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 p-6 md:p-10 bg-white dark:bg-gray-800 rounded-b-lg sm:rounded-br-lg">
          <button onClick={goBack} className="text-sm flex gap-2 text-black dark:text-white hover:underline mb-6">
            <ArrowLeft className="size-5" /> Back to patient Detail
          </button>
          <h3 className="text-md font-semibold mb-4 text-gray-900 dark:text-white">Procedure Steps</h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-2">
            {steps.map((label, index) => (
              <li
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`cursor-pointer px-3 flex justify-start items-center py-3 rounded-md mb-2 text-xs max-w-[150px] ${
                  index === currentStep
                    ? "bg-[#1DA68F] text-white font-medium"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-300"
                }`}
              >
                <div
                  className={`mr-2 w-5 text-center bg-gray-100 dark:bg-gray-600 text-sm rounded-full ${
                    index === currentStep ? "text-[#1DA68F]" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                <p className="text-[14px]">{label}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 space-y-6">
          <div className="p-4 md:p-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 mt-4 md:mt-8">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{steps[currentStep]}</h2>

            {renderStepContent()}

            <div className="flex flex-col sm:flex-row justify-end mt-6 gap-3">
              {currentStep < steps.length - 1 ? (
                <>
                  <button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 min-w-[130px] text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex justify-center items-center gap-2 text-sm font-medium"
                  >
                    Skip <Image src="/assets/icons/skipicon.png" width={16} height={5} alt="skip" />
                  </button>
                  <button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    className="px-4 py-2 bg-[#1DA68F] min-w-[130px] text-white rounded hover:bg-[#1DA68F]/70 flex justify-center items-center gap-2 text-sm"
                  >
                    Next <ArrowRightIcon className="size-5" />
                  </button>
                </>
              ) : (
                <button className="px-4 py-2 bg-[#1DA68F] min-w-[130px] text-white rounded hover:bg-[#1DA68F]/70 flex justify-center items-center gap-2 text-sm">
                  <CheckIcon className="size-5" /> Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 px-5">
        <SectionsContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </>
  )
}

export default Procedure
