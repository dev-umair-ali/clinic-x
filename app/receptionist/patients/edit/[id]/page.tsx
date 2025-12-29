"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/ui/protected-route"
import { updatePatient, fetchPatient } from "@/lib/slices/patientSlice"
import { fetchDoctors } from "@/lib/slices/doctorSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Loader2,
  Camera,
  User,
  Heart,
  Phone,
  Save,
  } from "lucide-react"
import type { AppDispatch, RootState } from "@/lib/store"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import moment from "moment";
import { UpdatePatientRequest } from "@/lib/api/services/patientService"

interface FormData {
  firstName: string
  lastName: string
  fullName: string
  email: string
  password: string
  phone: string
  age: string
  gender: string
  profilePicture: string
  dateOfBirth: string
  bloodType: string
  medicalHistory: string
  allergies: string
  currentMedication: string
  insuranceProvide: string
  eContactName: string
  ePhoneNumber: string
  eRelationship: string
  primaryDoctor: string
  address: string
  status: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
  allergiesArray: string[]
  medicationsArray: string[]
}

export default function EditPatientPage() {
  const router = useRouter()
  const params = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { patient, loading } = useSelector((state: RootState) => state.patients)
  const { doctors } = useSelector((state: RootState) => state.doctors)
  const patientId = params.id as string

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    gender: "",
    profilePicture: "/placeholder.svg?height=80&width=80",
    dateOfBirth: "",
    bloodType: "",
    medicalHistory: "",
    allergies: "",
    currentMedication: "",
    insuranceProvide: "",
    eContactName: "",
    ePhoneNumber: "",
    eRelationship: "",
    primaryDoctor: "",
    address: "",
    status: "active",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    allergiesArray: [],
    medicationsArray: [],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Fetch specific patient data when component mounts
  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatient(patientId));
    }
    dispatch(fetchDoctors());
  }, [dispatch, patientId]);

  // Populate form data when patient data is loaded
  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        fullName: patient.fullName || `${patient.firstName || ""} ${patient.lastName || ""}`.trim(),
        email: patient.email || "",
        password: "", // Don't populate password for security
        phone: patient.phone || "",
        age: patient.age?.toString() || "",
        gender: patient.gender || "",
        profilePicture: patient.profilePicture || "/placeholder.svg?height=80&width=80",
        dateOfBirth: patient.dateOfBirth || "",
        bloodType: patient.bloodType || "",
        medicalHistory: patient.medicalHistory || "",
        allergies: patient.allergies || "",
        currentMedication: patient.currentMedication || "",
        insuranceProvide: patient.insuranceProvide || "",
        eContactName: patient.eContactName || patient.emergencyContactName || "",
        ePhoneNumber: patient.ePhoneNumber || patient.emergencyContactPhone || "",
        eRelationship: patient.eRelationship || patient.emergencyContactRelationship || "",
        primaryDoctor: patient.assignedDoctor || "",
        address: patient.address || "",
        status: patient.status || "active",
        emergencyContactName: patient.emergencyContactName || patient.eContactName || "",
        emergencyContactPhone: patient.emergencyContactPhone || patient.ePhoneNumber || "",
        emergencyContactRelationship: patient.emergencyContactRelationship || patient.eRelationship || "",
        allergiesArray: patient.allergiesArray || [],
        medicationsArray: patient.medicationsArray || [],
      });

      // Set profile image if available
      if (patient.profilePicture) {
        setProfileImage(patient.profilePicture);
      }
    }
  }, [patient]);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    // Get the authentication token from localStorage
    const token = localStorage.getItem('assistant-ai-token');

    if (!token) {
      toast.error('No authentication token found. Please login again.');
      return "";
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}api/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    return result.fileUrl || result.profilePicture || result.data?.fileUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (2.5MB limit)
    if (file.size > 2.5 * 1024 * 1024) {
      toast.error("Image size should not exceed 2.5MB");
      return;
    }

    setImageUploading(true);
    setImageFile(file);

    try {
      // Upload image to server
      const profilePicture = await uploadImage(file);
      // Update form data with the uploaded image URL
      setFormData(prev => ({
        ...prev,
        profilePicture: profilePicture
      }));

      // Set preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setImageUploading(false);

      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
      setImageFile(null);
      setProfileImage(null);
      setImageUploading(false);
    } 
  };

  const triggerImageUpload = () => {
    const input = document.getElementById('profile-image-upload') as HTMLInputElement;
    input?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const updatedFormData = { ...formData, [name]: value }

    // Auto-concatenate first name and last name for full name
    if (name === "firstName" || name === "lastName") {
      const firstName = name === "firstName" ? value : formData.firstName
      const lastName = name === "lastName" ? value : formData.lastName
      updatedFormData.fullName = `${firstName} ${lastName}`.trim()
    }

    setFormData(updatedFormData)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.age ||
      !formData.dateOfBirth ||
      !formData.gender ||
      !formData.address ||
      !formData.primaryDoctor
    ) {
      toast.error("Please fill in all required fields.")
      return
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    if (formData.password && formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.")
      return
    }

    // Check for password complexity requirements if password is provided
    if (formData.password) {
      const hasUpperCase = /[A-Z]/.test(formData.password)
      const hasLowerCase = /[a-z]/.test(formData.password)
      const hasNumbers = /\d/.test(formData.password)
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)

      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        toast.error("Password must contain uppercase, lowercase, number, and special character.")
        return
      }
    }

    try {
      setIsLoading(true)

      const response = await dispatch(updatePatient({ id: patientId, patientData: formData as unknown as UpdatePatientRequest }))
      
      if (response.meta.requestStatus === "fulfilled") {
        setIsLoading(false)
        toast.success("Patient updated successfully!")
      }
    } catch (err: any) {
      toast.error(err || "Failed to update patient. Please try again.");
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["assistant"]}>
        <div className="flex-1 overflow-y-auto p-6 bg-[hsl(var(--color-gray-50))] dark:bg-[hsl(var(--background))]">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--color-brand-teal))] mx-auto mb-4" />
                <p className="text-[hsl(var(--muted-foreground))]">Loading patient data...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!patient) {
    return (
      <ProtectedRoute allowedRoles={["assistant"]}>
        <div className="flex-1 overflow-y-auto p-6 bg-[hsl(var(--color-gray-50))] dark:bg-[hsl(var(--background))]">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-[hsl(var(--muted-foreground))] mb-4">Patient not found</p>
                <Button onClick={() => router.push("/assistant/patients")}>
                  Back to Patients
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["assistant"]}>
      <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--secondary))]/20 to-[hsl(var(--primary))]/5 dark:from-[hsl(var(--background))] dark:via-[hsl(var(--card))]/20 dark:to-[hsl(var(--primary))]/10">
        <ToastContainer />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
              {/* Back Button */}
              <div className="mb-4">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="flex items-center gap-2 rounded-md bg-[hsl(var(--color-brand-teal-light))] text-[hsl(var(--color-brand-teal))] px-3 py-2 hover:bg-[hsl(var(--color-brand-teal-light))]/80 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm font-medium">Back to Patients</span>
                </Button>
              </div>

              {/* Title */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--foreground))]">Edit Patient</h1>
                  <p className="text-[hsl(var(--muted-foreground))] mt-1">Update patient information and medical details</p>
                </div>
              </div>
            </div>

            <div className="bg-[hsl(var(--card))] dark:bg-[hsl(var(--card))] rounded-lg shadow-sm border border-[hsl(var(--border))]">
              <div className="px-6 py-4 border-b border-[hsl(var(--border))]">
                <h2 className="text-xl font-semibold text-[hsl(var(--foreground))]">
                  Edit Patient Information
                </h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
                  Update the patient's personal and medical information
                </p>
              </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Profile Picture Section */}
              <div>
                <h3 className="text-lg font-medium text-[hsl(var(--foreground))] mb-4">
                  Profile Picture
                </h3>
                <div className="flex items-center space-x-4">
                  <div
                    className={`relative cursor-pointer ${imageUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={imageUploading ? undefined : triggerImageUpload}
                  >
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={
                          profileImage || formData.profilePicture || "/placeholder.svg?height=80&width=80"
                        }
                      />
                      <AvatarFallback className="bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] text-lg">
                        {formData.fullName
                          ? formData.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                          : "PT"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[hsl(var(--color-brand-teal))] rounded-full flex items-center justify-center">
                      {imageUploading ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                    className="hidden"
                  />
                  <div>
                    <p className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Profile Image
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      The Proposed size is 512 x 512 px and no longer bigger
                      than 2.5 MBs
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="form-section">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[hsl(var(--border))]/50">
                  <div className="p-2 bg-[hsl(var(--primary))]/10 rounded-lg">
                    <User className="h-5 w-5 text-[hsl(var(--primary))]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                      disabled={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Age
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter age"
                      className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Gender
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
                        <SelectItem value="male" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Male</SelectItem>
                        <SelectItem value="female" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Female</SelectItem>
                        <SelectItem value="other" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth ? moment(formData.dateOfBirth).format("YYYY-MM-DD") : ""}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: moment(e.target.value).format("YYYY-MM-DD") })}
                      className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter full address"
                      className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
                        <SelectItem value="active" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Active</SelectItem>
                        <SelectItem value="inactive" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Inactive</SelectItem>
                        <SelectItem value="pending" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="form-section">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[hsl(var(--border))]/50">
                  <div className="p-2 bg-[hsl(var(--color-chart-blue))]/10 rounded-lg">
                    <Heart className="h-5 w-5 text-[hsl(var(--color-chart-blue))]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">Medical Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Blood Type
                    </Label>
                    <Select
                      value={formData.bloodType}
                      onValueChange={(value) => setFormData({ ...formData, bloodType: value })}
                    >
                      <SelectTrigger className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
                        <SelectItem value="A+" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">A+</SelectItem>
                        <SelectItem value="A-" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">A-</SelectItem>
                        <SelectItem value="B+" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">B+</SelectItem>
                        <SelectItem value="B-" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">B-</SelectItem>
                        <SelectItem value="AB+" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">AB+</SelectItem>
                        <SelectItem value="AB-" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">AB-</SelectItem>
                        <SelectItem value="O+" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">O+</SelectItem>
                        <SelectItem value="O-" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryDoctor" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Primary Doctor
                    </Label>
                    <Select
                      value={formData.primaryDoctor}
                      onValueChange={(value) => setFormData({ ...formData, primaryDoctor: value })}
                    >
                      <SelectTrigger className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
                        <SelectValue placeholder="Select primary doctor" />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
                          {doctors && doctors.map((doctor) => (
                            <SelectItem 
                              key={doctor.id} 
                              value={doctor.id || ""} 
                              className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50"
                            >
                              Dr. {doctor.firstName} {doctor.lastName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="medicalHistory" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Medical History
                    </Label>
                    <Textarea
                      id="medicalHistory"
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleChange}
                      placeholder="Enter medical history"
                      className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="allergies" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Allergies
                    </Label>
                    <Textarea
                      id="allergies"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      placeholder="Enter known allergies"
                      className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="currentMedication" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Current Medications
                    </Label>
                    <Textarea
                      id="currentMedication"
                      name="currentMedication"
                      value={formData.currentMedication}
                      onChange={handleChange}
                      placeholder="Enter current medications"
                      className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="insuranceProvide" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Insurance Provider
                    </Label>
                    <Input
                      id="insuranceProvide"
                      name="insuranceProvide"
                      value={formData.insuranceProvide}
                      onChange={handleChange}
                      placeholder="Enter insurance provider"
                      className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="form-section">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[hsl(var(--border))]/50">
                  <div className="p-2 bg-[hsl(var(--destructive))]/10 rounded-lg">
                    <Phone className="h-5 w-5 text-[hsl(var(--destructive))]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">Emergency Contact</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="eContactName" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Contact Name
                    </Label>
                    <Input
                      id="eContactName"
                      name="eContactName"
                      value={formData.eContactName}
                      onChange={handleChange}
                      placeholder="Enter emergency contact name"
                      className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ePhoneNumber" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Contact Phone
                    </Label>
                    <Input
                      id="ePhoneNumber"
                      name="ePhoneNumber"
                      value={formData.ePhoneNumber}
                      onChange={handleChange}
                      placeholder="Enter emergency contact phone"
                      className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eRelationship" className="text-sm font-medium text-[hsl(var(--foreground))]">
                      Relationship
                    </Label>
                    <Select
                      value={formData.eRelationship}
                      onValueChange={(value) => setFormData({ ...formData, eRelationship: value })}
                    >
                      <SelectTrigger className="bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent className="bg-[hsl(var(--card))] border-[hsl(var(--border))]">
                        <SelectItem value="spouse" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Spouse</SelectItem>
                        <SelectItem value="parent" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Parent</SelectItem>
                        <SelectItem value="child" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Child</SelectItem>
                        <SelectItem value="sibling" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Sibling</SelectItem>
                        <SelectItem value="friend" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Friend</SelectItem>
                        <SelectItem value="other" className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/50">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                  className="flex-1 h-12 border-[hsl(var(--border))]/50 hover:bg-[hsl(var(--muted))]/50 dark:bg-[hsl(var(--muted))]/50 transition-all duration-200 bg-[hsl(var(--color-gray-100))]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-12 bg-[hsl(var(--color-brand-teal))] hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Patient...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Patient
                    </>
                  )}
                </Button>
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}