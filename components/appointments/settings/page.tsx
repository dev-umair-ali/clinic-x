"use client"

import { ProtectedRoute } from "@/components/ui/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export default function AdminSettingsPage() {
  const [appName, setAppName] = useState("Clinic X")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const handleSaveSettings = () => {
    alert("Settings saved!")
