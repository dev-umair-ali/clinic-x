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
    console.log("Admin Settings Saved:", { appName, notificationsEnabled })
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar is now handled by layout.tsx */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header is now handled by layout.tsx */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Settings</h1>

              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="appName">Application Name</Label>
                      <Input id="appName" value={appName} onChange={(e) => setAppName(e.target.value)} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications">Enable Notifications</Label>
                      <Switch
                        id="notifications"
                        checked={notificationsEnabled}
                        onCheckedChange={setNotificationsEnabled}
                      />
                    </div>
                    <Button onClick={handleSaveSettings}>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Management Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">Manage user roles and permissions.</p>
                    <Button variant="outline" onClick={() => alert("Navigating to User Roles Management")}>
                      Manage User Roles
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
