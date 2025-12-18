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
    const token = localStorage.getItem('clinic-ai-token');

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
      <ProtectedRoute allowedRoles={["receptionist"]}>
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#1DA68F] mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading patient data...</p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!patient) {
    return (
      <ProtectedRoute allowedRoles={["receptionist"]}>
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Patient not found</p>
                <Button onClick={() => router.push("/receptionist/patients")}>
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
    <ProtectedRoute allowedRoles={["receptionist"]}>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5 dark:from-background dark:via-card/20 dark:to-primary/10">
        <ToastContainer />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
              {/* Back Button */}
              <div className="mb-4">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="flex items-center gap-2 rounded-md bg-teal-50 text-teal-600 px-3 py-2 hover:bg-teal-100 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm font-medium">Back to Patients</span>
                </Button>
              </div>

              {/* Title */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Edit Patient</h1>
                  <p className="text-gray-500 mt-1">Update patient information and medical details</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Patient Information
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Update the patient's personal and medical information
                </p>
              </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Profile Picture Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
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
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-lg">
                        {formData.fullName
                          ? formData.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                          : "PT"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
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
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Profile Image
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      The Proposed size is 512 x 512 px and no longer bigger
                      than 2.5 MBs
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="form-section">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      disabled={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Age
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter age"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Gender
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem value="male" className="dark:text-white dark:hover:bg-gray-600">Male</SelectItem>
                        <SelectItem value="female" className="dark:text-white dark:hover:bg-gray-600">Female</SelectItem>
                        <SelectItem value="other" className="dark:text-white dark:hover:bg-gray-600">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth ? moment(formData.dateOfBirth).format("YYYY-MM-DD") : ""}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: moment(e.target.value).format("YYYY-MM-DD") })}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter full address"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem value="active" className="dark:text-white dark:hover:bg-gray-600">Active</SelectItem>
                        <SelectItem value="inactive" className="dark:text-white dark:hover:bg-gray-600">Inactive</SelectItem>
                        <SelectItem value="pending" className="dark:text-white dark:hover:bg-gray-600">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="form-section">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                  <div className="p-2 bg-info/10 rounded-lg">
                    <Heart className="h-5 w-5 text-info" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Medical Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Blood Type
                    </Label>
                    <Select
                      value={formData.bloodType}
                      onValueChange={(value) => setFormData({ ...formData, bloodType: value })}
                    >
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem value="A+" className="dark:text-white dark:hover:bg-gray-600">A+</SelectItem>
                        <SelectItem value="A-" className="dark:text-white dark:hover:bg-gray-600">A-</SelectItem>
                        <SelectItem value="B+" className="dark:text-white dark:hover:bg-gray-600">B+</SelectItem>
                        <SelectItem value="B-" className="dark:text-white dark:hover:bg-gray-600">B-</SelectItem>
                        <SelectItem value="AB+" className="dark:text-white dark:hover:bg-gray-600">AB+</SelectItem>
                        <SelectItem value="AB-" className="dark:text-white dark:hover:bg-gray-600">AB-</SelectItem>
                        <SelectItem value="O+" className="dark:text-white dark:hover:bg-gray-600">O+</SelectItem>
                        <SelectItem value="O-" className="dark:text-white dark:hover:bg-gray-600">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="primaryDoctor" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Primary Doctor
                    </Label>
                    <Select
                      value={formData.primaryDoctor}
                      onValueChange={(value) => setFormData({ ...formData, primaryDoctor: value })}
                    >
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select primary doctor" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                          {doctors && doctors.map((doctor) => (
                            <SelectItem 
                              key={doctor.id} 
                              value={doctor.id || ""} 
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              Dr. {doctor.firstName} {doctor.lastName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="medicalHistory" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Medical History
                    </Label>
                    <Textarea
                      id="medicalHistory"
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleChange}
                      placeholder="Enter medical history"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="allergies" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Allergies
                    </Label>
                    <Textarea
                      id="allergies"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      placeholder="Enter known allergies"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="currentMedication" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Medications
                    </Label>
                    <Textarea
                      id="currentMedication"
                      name="currentMedication"
                      value={formData.currentMedication}
                      onChange={handleChange}
                      placeholder="Enter current medications"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="insuranceProvide" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Insurance Provider
                    </Label>
                    <Input
                      id="insuranceProvide"
                      name="insuranceProvide"
                      value={formData.insuranceProvide}
                      onChange={handleChange}
                      placeholder="Enter insurance provider"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="form-section">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <Phone className="h-5 w-5 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Emergency Contact</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="eContactName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Contact Name
                    </Label>
                    <Input
                      id="eContactName"
                      name="eContactName"
                      value={formData.eContactName}
                      onChange={handleChange}
                      placeholder="Enter emergency contact name"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ePhoneNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Contact Phone
                    </Label>
                    <Input
                      id="ePhoneNumber"
                      name="ePhoneNumber"
                      value={formData.ePhoneNumber}
                      onChange={handleChange}
                      placeholder="Enter emergency contact phone"
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eRelationship" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Relationship
                    </Label>
                    <Select
                      value={formData.eRelationship}
                      onValueChange={(value) => setFormData({ ...formData, eRelationship: value })}
                    >
                      <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem value="spouse" className="dark:text-white dark:hover:bg-gray-600">Spouse</SelectItem>
                        <SelectItem value="parent" className="dark:text-white dark:hover:bg-gray-600">Parent</SelectItem>
                        <SelectItem value="child" className="dark:text-white dark:hover:bg-gray-600">Child</SelectItem>
                        <SelectItem value="sibling" className="dark:text-white dark:hover:bg-gray-600">Sibling</SelectItem>
                        <SelectItem value="friend" className="dark:text-white dark:hover:bg-gray-600">Friend</SelectItem>
                        <SelectItem value="other" className="dark:text-white dark:hover:bg-gray-600">Other</SelectItem>
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
                  className="flex-1 h-12 border-border/50 hover:bg-muted/50 dark:bg-muted/50 transition-all duration-200 bg-[#EFEFEF]"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-12 bg-[#1DA68F] hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
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