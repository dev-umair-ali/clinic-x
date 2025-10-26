"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { addDoctor, type Doctor } from "@/lib/slices/doctorSlice"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AddDoctorForm() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    avatar: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const specializations = [
    "Internal Medicine",
    "Cardiology",
    "Pediatrics",
    "Dermatology",
    "Orthopedics",
    "Neurology",
    "Oncology",
    "Radiology",
    "Anesthesiology",
    "General Surgery",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, specialization: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    // Basic validation
    if (!formData.name || !formData.email || !formData.specialization || !formData.experience) {
      setError("Please fill in all required fields.")
      setLoading(false)
      return
    }

    const newDoctor: Doctor = {
      id: `d${Date.now()}`, // Simple unique ID
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      specialization: formData.specialization,
      experience: Number.parseInt(formData.experience),
      avatar: formData.avatar || "/placeholder.svg?height=40&width=40", // Default avatar
    }

    try {
      dispatch(addDoctor(newDoctor))
      setSuccess("Doctor added successfully!")
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialization: "",
        experience: "",
        avatar: "",
      })
      // Optionally redirect after a short delay
      setTimeout(() => {
        router.push("/admin/doctors")
      }, 1500)
    } catch (err) {
      setError("Failed to add doctor. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">{success}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Doctor Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Dr. John Doe"
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@clinic.com"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(123) 456-7890"
          />
        </div>
        <div>
          <Label htmlFor="specialization">Specialization</Label>
          <Select onValueChange={handleSelectChange} value={formData.specialization} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a specialization" />
            </SelectTrigger>
            <SelectContent>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="experience">Experience (Years)</Label>
          <Input
            id="experience"
            name="experience"
            type="number"
            value={formData.experience}
            onChange={handleChange}
            placeholder="5"
            min="0"
            required
          />
        </div>
        <div>
          <Label htmlFor="avatar">Avatar URL (Optional)</Label>
          <Input
            id="avatar"
            name="avatar"
            type="text"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="/placeholder.svg?height=40&width=40"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Adding Doctor..." : "Add Doctor"}
      </Button>
    </form>
  )
}
