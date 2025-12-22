"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/ui/protected-route"
import {  createPatientInCollection, fetchPatients } from "@/lib/slices/patientSlice"
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
  Eye,
  EyeOff,
  Camera,
  User,
  Heart,
  Shield,
  Phone,
  Calendar,
  MapPin,
  Stethoscope,
  UserPlus,
} from "lucide-react"
import type { AppDispatch, RootState } from "@/lib/store"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreatePatientRequest } from "@/lib/api/services/patientService"

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

export default function AddPatientStyled() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { doctors } = useSelector((state: RootState) => state.doctors)

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
  const [showPassword, setShowPassword] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Fetch doctors on component mount
  useEffect(() => {
    dispatch(fetchDoctors())
  }, [dispatch])

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
      console.log(profilePicture, "profilePicture")
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
    const input = document.getElementById('profile-image-input') as HTMLInputElement;
    input?.click();
  };

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // // Validation
    // if (
    //   !formData.firstName ||
    //   !formData.lastName ||
    //   !formData.email ||
    //   !formData.password ||
    //   !formData.phone ||
    //   !formData.age ||
    //   !formData.dateOfBirth ||
    //   !formData.gender ||
    //   !formData.address ||
    //   !formData.primaryDoctor
    // ) {
      // toast.error("Please fill in all required fields.")
    //   return
    // }

    // if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
    //   toast.error("Please enter a valid email address")
    //   return
    // }

    // if (formData.password.length < 8) {
    //   toast.error("Password must be at least 8 characters long.")
    //   return
    // }

    // // Check for password complexity requirements
    // const hasUpperCase = /[A-Z]/.test(formData.password)
    // const hasLowerCase = /[a-z]/.test(formData.password)
    // const hasNumbers = /\d/.test(formData.password)
    // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)

    // if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
    //   toast.error("Password must contain uppercase, lowercase, number, and special character.")
    //   return
    // }

    // try {
    //   setIsLoading(true)
    //   const response = await dispatch(
    //     createPatientInCollection(formData as unknown as CreatePatientRequest) as any,
    //   )
    //   console.log(response, "response")
    //   if (response.meta.requestStatus === "fulfilled") {
    //     // Reset image states
    //     setProfileImage(null);
    //     setImageFile(null);
    //     setIsLoading(false)
    //     toast.success("Patient added successfully!")
    //     await dispatch(fetchPatients())
        router.push(`/clinic/patients/onboarding`)
    //   }
    // } catch (err: any) {
    //   toast.error(err)
    //   setIsLoading(false)
    // }
  }

  return (
    <ProtectedRoute allowedRoles={["clinic"]}>
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
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Add New Patient</h1>
                  <p className="text-gray-500 mt-1">Fill in the details to add a new patient</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Patient
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Fill in the details to add a new patient
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
                      id="profile-image-input"
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

                <div className="form-section">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Basic Information</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                          First Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          // required
                          className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                          Last Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          // required
                          className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-foreground">
                          Email Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john.doe@example.com"
                          // required
                          className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-foreground">
                          Password <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="SecurePassword123!"
                            // required
                            minLength={8}
                            className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                          Phone Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="text"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                          // required
                          className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bloodType" className="text-sm font-medium text-foreground">
                          Blood Type
                        </Label>
                        <Select
                          value={formData.bloodType}
                          onValueChange={(value) =>
                            setFormData({ ...formData, bloodType: value })
                          }
                        >
                          <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                            <SelectItem
                              value="A+"
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              A+
                            </SelectItem>
                            <SelectItem
                              value="A-"
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              A-
                            </SelectItem>
                            <SelectItem
                              value="B+"
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              B+
                            </SelectItem>
                            <SelectItem
                              value="B-"
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              B-
                            </SelectItem>
                            <SelectItem
                              value="AB+"
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              AB+
                            </SelectItem>
                            <SelectItem
                              value="AB-"
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              AB-
                            </SelectItem>
                            <SelectItem
                              value="O+"
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              O+
                            </SelectItem>
                            <SelectItem
                              value="O-"
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              O-
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-medium text-foreground">
                          Gender <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) =>
                            setFormData({ ...formData, gender: value })
                          }
                        >
                          <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                            <SelectItem
                              value="male"
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              Male
                            </SelectItem>
                            <SelectItem
                              value="female"
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              Female
                            </SelectItem>
                            <SelectItem
                              value="other"
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium text-foreground">
                          Address <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Main Street, City, State 12345"
                            rows={3}
                            // required
                            className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors resize-none"
                          />
                          <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="age" className="text-sm font-medium text-foreground">
                          Age <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="35"
                          min="0"
                          // required
                          className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground">
                          Date of Birth <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            // required
                            className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="form-section">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                    <div className="p-2 bg-medical/10 rounded-lg">
                      <Stethoscope className="h-5 w-5 text-medical" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Medical Assignment</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="primaryDoctor" className="text-sm font-medium text-foreground">
                          Primary Doctor <span className="text-destructive">*</span>
                        </Label>
                        <select
                          id="primaryDoctor"
                          name="primaryDoctor"
                          value={formData.primaryDoctor}
                          onChange={handleChange}
                          className="w-full border border-border/50 rounded-lg p-3 text-sm text-foreground bg-[#F6F6F6] dark:bg-gray-700 hover:border-border focus:border-medical focus:ring-2 focus:ring-medical/20 transition-all"
                          // required
                        >
                          <option value="">Select Doctor</option>
                          {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                              Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="insuranceProvide" className="text-sm font-medium text-foreground">
                          Insurance Provider
                        </Label>
                        <div className="relative">
                          <Input
                            id="insuranceProvide"
                            name="insuranceProvide"
                            type="text"
                            value={formData.insuranceProvide}
                            onChange={handleChange}
                            placeholder="Blue Cross Blue Shield"
                            className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors pl-10"
                          />
                          <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>


                  </div>
                </div>

                <div className="form-section">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                    <div className="p-2 bg-info/10 rounded-lg">
                      <Heart className="h-5 w-5 text-info" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Medical Information</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="medicalHistory" className="text-sm font-medium text-foreground">
                          Medical History
                        </Label>
                        <div className="flex items-center gap-3">
                          <Textarea
                            id="medicalHistory"
                            name="medicalHistory"
                            value={formData.medicalHistory}
                            onChange={handleChange}
                            placeholder="Diabetes, Hypertension, Previous surgeries..."
                            rows={4}
                            className="flex-1 focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="allergies" className="text-sm font-medium text-foreground">
                          Allergies
                        </Label>
                        <div className="flex items-center gap-3">
                          <Input
                            id="allergies"
                            name="allergies"
                            type="text"
                            value={formData.allergies}
                            onChange={handleChange}
                            placeholder="Penicillin, Shellfish, Pollen..."
                            className="flex-1 focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currentMedication" className="text-sm font-medium text-foreground">
                          Current Medication
                        </Label>
                        <div className="flex items-center gap-3">
                          <Input
                            id="currentMedication"
                            name="currentMedication"
                            type="text"
                            value={formData.currentMedication}
                            onChange={handleChange}
                            placeholder="Metformin, Lisinopril, Aspirin..."
                            className="flex-1 focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                    <div className="p-2 bg-destructive/10 rounded-lg">
                      <Phone className="h-5 w-5 text-destructive" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Emergency Contact</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="eContactName" className="text-sm font-medium text-foreground">
                          Emergency Contact Name
                        </Label>
                        <Input
                          id="eContactName"
                          name="eContactName"
                          type="text"
                          value={formData.eContactName}
                          onChange={handleChange}
                          placeholder="Jane Doe"
                          className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ePhoneNumber" className="text-sm font-medium text-foreground">
                          Emergency Phone Number
                        </Label>
                        <Input
                          id="ePhoneNumber"
                          name="ePhoneNumber"
                          type="text"
                          value={formData.ePhoneNumber}
                          onChange={handleChange}
                          placeholder="+1 (555) 987-6543"
                          className="focus-ring bg-[#F6F6F6] dark:bg-gray-700 border-border/50 hover:border-border transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="eRelationship" className="text-sm font-medium text-foreground">
                          Emergency Relationship
                        </Label>
                        <Select
                          value={formData.eRelationship}
                          onValueChange={(value) =>
                            setFormData({ ...formData, eRelationship: value })
                          }
                        >
                          <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                            <SelectItem
                              value="spouse"
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              Spouse
                            </SelectItem>
                            <SelectItem
                              value="parent"
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              Parent
                            </SelectItem>
                            <SelectItem
                              value="sibling"
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              Sibling
                            </SelectItem>
                            <SelectItem
                              value="child"
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              Child
                            </SelectItem>
                            <SelectItem
                              value="friend"
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              Friend
                            </SelectItem>
                            <SelectItem
                              value="other"
                              className="dark:text-white dark:hover:bg-gray-600"
                            >
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>



                <div className="form-section">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                    <div className="p-2 bg-medical/10 rounded-lg">
                      <UserPlus className="h-5 w-5 text-medical" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Patient Status</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium text-foreground">
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem
                          value="active"
                          className="dark:text-white dark:hover:bg-gray-600"
                        >
                          Active
                        </SelectItem>
                        <SelectItem
                          value="inactive"
                          className="dark:text-white dark:hover:bg-gray-600"
                        >
                          Inactive
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Active patients can schedule appointments and access services.
                    </p>
                  </div>
                </div>

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
                        Creating Patient...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Patient
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
