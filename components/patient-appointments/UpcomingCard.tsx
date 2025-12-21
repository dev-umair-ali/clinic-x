"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onReschedule: () => void;
  onCancel: () => void;
}

export default function UpcomingCard({ onReschedule, onCancel }: Props) {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upcoming Appointment
          </h2>
        </div>

        <div className="space-y-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex-1">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                Annual Physical Exam
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Dr. Sarah Smith - Internal Medicine
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                July 30, 2024 at 4:00 PM
              </p>
            </div>
            <div className="ml-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                Confirmed
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onReschedule}
              variant="outline"
              className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
            >
              Reschedule
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
