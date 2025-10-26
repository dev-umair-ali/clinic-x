import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ProgressTrackingCardProps {
  title: string
  value: string
  description: string
  progress: number
  gradient: string // use CSS gradient instead of tailwind color
}

export function ProgressTrackingCard({
  title,
  value,
  description,
  progress,
  gradient,
}: ProgressTrackingCardProps) {
  return (
    <Card className={cn("text-white shadow-sm")} style={{ background: gradient }}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <span className="text-2xl font-bold text-white">{value}</span>
        </div>
        <Progress value={progress} className="h-2 bg-white/30 [&>*]:bg-white" />
        <p className="text-sm mt-2 text-white/90">{description}</p>
      </CardContent>
    </Card>
  )
}
