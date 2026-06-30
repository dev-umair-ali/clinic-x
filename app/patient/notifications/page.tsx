"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Bell, AlertCircle, CheckCircle, FileText, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"

const ADMIN_NOTIFS = [
  {
    id: 1,
    icon: AlertCircle,
    title: "System Update",
    description: "Server maintenance scheduled tonight",
    time: "2 min ago",
    type: "alert",
    actionable: true,
    fullDetails:
      "The system will undergo scheduled maintenance tonight from 2:00 AM to 4:00 AM UTC. During this time, all services will be temporarily unavailable. We recommend backing up your data before this window.",
  },
  {
    id: 2,
    icon: CheckCircle,
    title: "New Clinic Registered",
    description: "City Health Center has been added to the network",
    time: "15 min ago",
    type: "success",
    actionable: false,
    fullDetails:
      "City Health Center (License #CH-2024-5821) has successfully completed onboarding and is now active on the network. Their admin team can now access the platform.",
  },
  {
    id: 3,
    icon: FileText,
    title: "Monthly Report Ready",
    description: "Your admin dashboard PDF is available for download",
    time: "1 hour ago",
    type: "info",
    actionable: true,
    fullDetails:
      "Your December 2024 admin dashboard report has been generated and is ready for download. The report includes all key metrics, user activity, and system performance data.",
  },
]

export default function PatientNotificationsPage() {
  const router = useRouter()
  const [read, setRead] = useState<Set<number>>(new Set())
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())
  const [selectedNotification, setSelectedNotification] = useState<(typeof ADMIN_NOTIFS)[0] | null>(null)

  const handleDismiss = (id: number) => {
    setDismissed((prev) => new Set(prev).add(id))
  }

  const visibleNotifs = ADMIN_NOTIFS.filter((n) => !dismissed.has(n.id))
  const unreadCount = visibleNotifs.filter((n) => !read.has(n.id)).length

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "alert":
        return {
          bg: "bg-red-50 dark:bg-red-950/30",
          border: "border-red-200 dark:border-red-900/50",
          icon: "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400",
        }
      case "success":
        return {
          bg: "bg-green-50 dark:bg-green-950/30",
          border: "border-green-200 dark:border-green-900/50",
          icon: "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400",
        }
      case "info":
      default:
        return {
          bg: "bg-blue-50 dark:bg-blue-950/30",
          border: "border-blue-200 dark:border-blue-900/50",
          icon: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
        }
    }
  }

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Header - removed max-width for full width */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 w-full">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-10 w-10 rounded-lg hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - removed max-width for full width */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {visibleNotifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-1">No notifications</h2>
            <p className="text-sm text-muted-foreground">You've cleared all your notifications</p>
          </div>
        ) : (
          <div className="space-y-3 max-w-7xl">
            {visibleNotifs.map((notification) => {
              const Icon = notification.icon
              const isRead = read.has(notification.id)
              const styles = getTypeStyles(notification.type)

              return (
                <Card
                  key={notification.id}
                  className={cn(
                    "transition-all duration-200 hover:shadow-md cursor-pointer",
                    styles.bg,
                    styles.border,
                    "border",
                    isRead && "opacity-70",
                  )}
                  onClick={() => {
                    setSelectedNotification(notification)
                    setRead((prev) => new Set(prev).add(notification.id))
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={cn(
                          "flex-shrink-0 h-11 w-11 rounded-lg flex items-center justify-center",
                          styles.icon,
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3
                              className={cn(
                                "font-semibold text-sm",
                                isRead ? "text-muted-foreground" : "text-foreground",
                              )}
                            >
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                              {notification.description}
                            </p>
                            <time className="text-xs text-muted-foreground mt-2 block">{notification.time}</time>
                          </div>

                          {/* Unread indicator */}
                          {!isRead && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDismiss(notification.id)}
                          className="h-8 w-8 hover:bg-muted/80"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md bg-card border-border animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Notification Details</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedNotification(null)}
                className="h-8 w-8 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <CardContent className="p-6">
              {/* Icon and Title */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={cn(
                    "flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center",
                    getTypeStyles(selectedNotification.type).icon,
                  )}
                >
                  {selectedNotification.icon && <selectedNotification.icon className="h-6 w-6" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-base">{selectedNotification.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{selectedNotification.time}</p>
                </div>
              </div>

              {/* Full Details */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-2">Details</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedNotification.fullDetails}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {selectedNotification.actionable && (
                  <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">Take Action</Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setSelectedNotification(null)
                  }}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
