"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  uploadDate: string
  type: "front" | "back"
  url: string
  size: number
}

export default function PatientSettingsPage() {
  const { user: currentUser } = useSelector((state: RootState) => state.auth)

  const frontFileInputRef = useRef<HTMLInputElement>(null)
  const backFileInputRef = useRef<HTMLInputElement>(null)
  const profileImageInputRef = useRef<HTMLInputElement>(null)

  const [viewerOpen, setViewerOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const [profileData, setProfileData] = useState({
    firstName: "Steven",
    lastName: "Adesanya",
    email: "doctor@clinic.ai",
    phone: "",
    insuranceNumber: "",
    profileImage: "/placeholder.svg?height=80&width=80&text=Profile",
  })

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: "1",
      name: "insurance-card-front.jpg",
      uploadDate: "2024-11-15",
      type: "front",
      url: "/placeholder.svg?height=400&width=600&text=Insurance+Card+Front",
      size: 245760,
    },
    {
      id: "2",
      name: "insurance-card-back.jpg",
      uploadDate: "2024-11-15",
      type: "back",
      url: "/placeholder.svg?height=400&width=600&text=Insurance+Card+Back",
      size: 198432,
    },
  ])

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEditInformation = () => {
    console.log("Updating profile information:", profileData)
  }

  const handleFileUpload = (type: "front" | "back") => {
    const inputRef = type === "front" ? frontFileInputRef : backFileInputRef
    inputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: "front" | "back") => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        uploadDate: new Date().toISOString().split("T")[0],
        type,
        url: e.target?.result as string,
        size: file.size,
      }

      setUploadedFiles((prev) => [...prev.filter((f) => f.type !== type), newFile])
    }
    reader.readAsDataURL(file)

    event.target.value = ""
  }

  const handleViewFile = (fileId: string) => {
    const fileIndex = uploadedFiles.findIndex((f) => f.id === fileId)
    if (fileIndex !== -1) {
      setCurrentImageIndex(fileIndex)
      setViewerOpen(true)
    }
  }

  const handleDeleteFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
    console.log(`Deleting file ${fileId}`)
  }

  const handleProfileImageUpload = () => {
    profileImageInputRef.current?.click()
  }

  const handleProfileImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    if (file.size > 2.5 * 1024 * 1024) {
      alert("Profile image must be less than 2.5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setProfileData((prev) => ({
        ...prev,
        profileImage: e.target?.result as string,
      }))
    }
    reader.readAsDataURL(file)

    event.target.value = ""
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : uploadedFiles.length - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < uploadedFiles.length - 1 ? prev + 1 : 0))
  }

  const currentFile = uploadedFiles[currentImageIndex]

  return (
    <ProtectedRoute allowedRoles={["patient"]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <input
          ref={frontFileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e, "front")}
          className="hidden"
        />
        <input
          ref={backFileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e, "back")}
          className="hidden"
        />
        <input
          ref={profileImageInputRef}
          type="file"
          accept="image/*"
          onChange={handleProfileImageSelect}
          className="hidden"
        />

        {viewerOpen && currentFile && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative max-w-4xl max-h-full p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{currentFile.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{currentFile.type} side</p>
                  </div>
                  <button
                    onClick={() => setViewerOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                <div className="relative">
                  <img
                    src={currentFile.url || "/placeholder.svg"}
                    alt={currentFile.name}
                    className="max-w-full max-h-[70vh] object-contain mx-auto"
                  />

                  {uploadedFiles.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <Button
                        onClick={() => setViewerOpen(false)}
                        variant="outline"
                        className="text-gray-600 border-gray-300 hover:bg-gray-50 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700"
                      >
                        Back to Preview
                      </Button>
                      {uploadedFiles.length > 1 && (
                        <div className="flex gap-2">
                          {uploadedFiles.map((file, index) => (
                            <Button
                              key={file.id}
                              onClick={() => setCurrentImageIndex(index)}
                              size="sm"
                              variant={index === currentImageIndex ? "default" : "outline"}
                              className={index === currentImageIndex ? "text-white" : ""}
                              style={
                                index === currentImageIndex
                                  ? {
                                      backgroundColor: "#1DA68F",
                                      borderColor: "#1DA68F",
                                    }
                                  : {}
                              }
                            >
                              {file.type === "front" ? "Front" : "Back"}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentImageIndex + 1} of {uploadedFiles.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">My Profile</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your personal information and insurance details</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Contact Information</h2>

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

                    <div>
                      <Label htmlFor="insuranceNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Insurance Number
                      </Label>
                      <Input
                        id="insuranceNumber"
                        placeholder="Enter your insurance number"
                        value={profileData.insuranceNumber}
                        onChange={(e) => handleInputChange("insuranceNumber", e.target.value)}
                        className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>

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

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Insurance Information</h2>

                  <div className="mb-6">
                    <Label
                      htmlFor="insuranceNumberInsurance"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Insurance Number
                    </Label>
                    <Input
                      id="insuranceNumberInsurance"
                      placeholder="Enter your insurance number"
                      value={profileData.insuranceNumber}
                      onChange={(e) => handleInputChange("insuranceNumber", e.target.value)}
                      className="mt-1 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                  </div>

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
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleDeleteFile(file.id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
