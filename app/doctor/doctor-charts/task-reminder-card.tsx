import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from 'lucide-react'
import { cn } from "@/lib/utils"

interface TaskReminderItemProps {
  text: string
  completed: boolean
}

function TaskReminderItem({ text, completed }: TaskReminderItemProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        {completed ? (
          <div className="h-6 w-6 flex items-center justify-center rounded-full bg-green-500 text-white">
            <CheckCircle className="h-4 w-4" />
          </div>
        ) : (
          <div className="h-6 w-6 rounded-full border border-border" />
        )}
        <span
          className={cn(
            "text-sm",
            completed
              ? "text-muted-foreground line-through"
              : "text-foreground"
          )}
        >
          {text}
        </span>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="text-xs px-3 py-1 h-auto"
      >
        Complete
      </Button>
    </div>
  )
}

export function TaskRemindersCard() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Task Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <TaskReminderItem text="Review today's appointments" completed={true} />
        <TaskReminderItem text="Review pending refill requests" completed={false} />
        <TaskReminderItem text="Transcribe or verify voice note accuracy" completed={false} />
      </CardContent>
    </Card>
  )
}
