import { Wrench } from "lucide-react"

export function ComingSoonPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-600">
      <Wrench className="h-16 w-16 mb-4 text-gray-400" />
      <h2 className="text-2xl font-bold mb-2">Coming Soon!</h2>
      <p className="text-lg text-center">We're working hard to bring you this feature.</p>
      <p className="text-sm text-center mt-2">Stay tuned for updates!</p>
    </div>
  )
}
