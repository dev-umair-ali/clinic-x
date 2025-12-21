"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  appointment: any;
  onCancel: (apt: any) => void;
}

export default function UpcomingCard({ appointment, onCancel }: Props) {
  if (!appointment) {
    return (
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <p className="text-gray-500 dark:text-gray-400">No upcoming appointments</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upcoming Appointment
          </h2>
        </div>

        {/* Appointment Info */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {appointment.type}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            Dr. {appointment.doctorName}
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
          </p>
        </div>

        {/* Cancel Button */}
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => onCancel(appointment)}
            className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
