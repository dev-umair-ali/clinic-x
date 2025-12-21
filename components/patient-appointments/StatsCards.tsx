"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign } from "lucide-react";

export default function StatsCards() {
  return (
    <div className="space-y-4 h-full flex flex-col">
      <Card className="bg-white dark:bg-gray-800 shadow-sm flex-1">
        <CardContent className="p-4 h-full flex items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Visits This Year
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">32</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 shadow-sm flex-1">
        <CardContent className="p-4 h-full flex items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Appointments Scheduled
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">03</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}