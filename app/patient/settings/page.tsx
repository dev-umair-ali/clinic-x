"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  uploadDate: string
  type: "front" | "back"
}

export default function PatientSettingsPage() {
  const { user: currentUser } = useSelector((state: RootState) => state.auth)

  // Mock data - in real app this would come from API
  const [profileData, setProfileData] = useState({
    firstName: "Steven",
    lastName: "Adesanya",
    email: "doctor@clinic.ai",
    phone: "",
    profileImage: "/placeholder.svg?height=80&width=80&text=Profile",
  })

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: "1",
      name: "insurance-card-front.jpg",
      uploadDate: "2024-11-15",
      type: "front",
    },
    {
      id: "2",
      name: "insurance-card-back.jpg",
      uploadDate: "2024-11-15",
      type: "back",
    },
  ])

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEditInformation = () => {
    // Handle form submission
    console.log("Updating profile information:", profileData)
  }

  const handleFileUpload = (type: "front" | "back") => {
    // Handle file upload
    console.log(`Uploading ${type} ID`)
  }

  const handleViewFile = (fileId: string) => {
    // Handle viewing uploaded file
    console.log(`Viewing file ${fileId}`)
  }

  const handleProfileImageUpload = () => {
    // Handle profile image upload
    console.log("Uploading profile image")
  }

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">My Profile</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your personal information and insurance details</p>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Contact Information</h2>

                  {/* Profile Image */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      <img
                        src={profileData.profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                      />
                      <button
                        onClick={handleProfileImageUpload}
                        className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#1DA68F] rounded-full flex items-center justify-center hover:bg-[#1DA68F]/90 transition-colors"
                      >
                        <Camera className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Profile Image</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 break-words">
                        The Proposed size 512 x 512 px and no longer bigger than 2.5 MBs
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          placeholder="Phone"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <Button
                    onClick={handleEditInformation}
                    className="mt-6 text-white font-medium"
                    style={{
                      backgroundColor: "#1DA68F",
                      borderColor: "#1DA68F",
                    }}
                  >
                    Edit Information
                  </Button>
                </CardContent>
              </Card>

              {/* Insurance Information */}
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Insurance Information</h2>

                  {/* Upload Areas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Upload ID (front)
                      </Label>
                      <div
                        onClick={() => handleFileUpload("front")}
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Click to upload</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Drag & drop or click to select</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Upload ID (back)
                      </Label>
                      <div
                        onClick={() => handleFileUpload("back")}
                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Click to upload</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Drag & drop or click to select</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Driver's license, passport, or other government-issued ID
                  </p>

                  {/* Uploaded Cards */}
                  <div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Uploaded Cards</h3>
                    <div className="space-y-3">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                            <p className="text-xs text-green-600 dark:text-green-400">Uploaded on {file.uploadDate}</p>
                          </div>
                          <Button
                            onClick={() => handleViewFile(file.id)}
                            size="sm"
                            className="text-white font-medium"
                            style={{
                              backgroundColor: "#1DA68F",
                              borderColor: "#1DA68F",
                            }}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
