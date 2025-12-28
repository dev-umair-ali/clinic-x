"use client";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppointmentBookingModal from "./AppointmentBookingModal";
import AppointmentDetailsModal from "./AppointmentDetailsModal";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "follow-up" | "consultation" | "check-up" | "appointment";
  appointment?: any; // Full appointment data
}

interface Day {
  date: number;
  isCurrentMonth: boolean;
  fullDate: Date;
}

export default function CalendarView({
  currentMonth,
  setCurrentMonth,
  calendarEvents,
  doctorId,
  onAppointmentChange,
}: {
  currentMonth: Date;
  setCurrentMonth: (d: Date) => void;
  calendarEvents: CalendarEvent[];
  doctorId: string;
  onAppointmentChange?: () => void;
}) {
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const handleDayClick = (day: Day, clickedEvent?: CalendarEvent) => {
    if (!day.isCurrentMonth) return;
    
    if (clickedEvent) {
      // If a specific event was clicked, show event details
      setSelectedAppointment(clickedEvent.appointment || clickedEvent);
      setDetailsModalOpen(true);
    } else {
      // If day was clicked (not specific event), open booking modal
      setSelectedDate(day.fullDate);
      setBookingModalOpen(true);
    }
  };
  
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const getDaysInMonth = (date: Date): Day[] => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const startOffset = first.getDay();
    const days: Day[] = [];

    for (let i = 0; i < startOffset; i++) {
      const d = new Date(y, m, -startOffset + i + 1);
      days.push({ date: d.getDate(), isCurrentMonth: false, fullDate: d });
    }
    for (let d = 1; d <= last.getDate(); d++) {
      days.push({ date: d, isCurrentMonth: true, fullDate: new Date(y, m, d) });
    }
    const rem = 42 - days.length;
    for (let i = 1; i <= rem; i++) {
      const d = new Date(y, m + 1, i);
      days.push({ date: i, isCurrentMonth: false, fullDate: d });
    }
    return days;
  };

  const navigate = (dir: "prev" | "next") => {
    const n = new Date(currentMonth);
    n.setMonth(currentMonth.getMonth() + (dir === "prev" ? -1 : 1));
    setCurrentMonth(n);
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const days = useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);

  const getEventColor = (type: string) => {
    const colors = {
      "follow-up": "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-500",
      "consultation": "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-500",
      "check-up": "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-500",
      "emergency": "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-500",
      "appointment": "bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300 border-lime-500",
    };
    return colors[type as keyof typeof colors] || colors["appointment"];
  };

  return (
    <>
      <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))]/80 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <p className="text-sm text-white/80 mt-0.5">
                  {calendarEvents.length} appointment{calendarEvents.length !== 1 ? 's' : ''} this month
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("prev")}
                className="bg-white/10 hover:bg-white/20 text-white border-0 h-9 px-3"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToToday}
                className="bg-white/10 hover:bg-white/20 text-white border-0 h-9 px-4 font-semibold"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("next")}
                className="bg-white/10 hover:bg-white/20 text-white border-0 h-9 px-3"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {weekDays.map((d) => (
              <div key={d} className="p-2 text-center text-xs sm:text-sm font-bold text-[hsl(var(--muted-foreground))] tracking-wider">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {days.map((day, idx) => {
              // Format date as local YYYY-MM-DD to match appointment dates
              const year = day.fullDate.getFullYear();
              const month = String(day.fullDate.getMonth() + 1).padStart(2, '0');
              const dayNum = String(day.fullDate.getDate()).padStart(2, '0');
              const dayStr = `${year}-${month}-${dayNum}`;
              
              const evts = calendarEvents.filter((e) => e.date === dayStr);
              
              const isTodayDay = isToday(day.fullDate);
              const isHovered = hoveredDay === dayStr;
              
              return (
                <div
                  key={idx}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => setHoveredDay(dayStr)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={'relative p-1 sm:p-2 h-20 sm:h-24 rounded-lg border-2 transition-all duration-200 ' + (day.isCurrentMonth ? "bg-[hsl(var(--card))] border-[hsl(var(--border))] cursor-pointer hover:border-[hsl(var(--primary))] hover:shadow-md" : "bg-[hsl(var(--muted)/0.3)] border-transparent") + ' ' + (evts.length > 0 && day.isCurrentMonth ? "hover:scale-[1.02]" : "") + ' ' + (isTodayDay ? "ring-2 ring-[hsl(var(--primary))] ring-offset-2 bg-[hsl(var(--primary)/0.05)]" : "") + ' ' + (isHovered && day.isCurrentMonth ? "shadow-lg z-10" : "")}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={'inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 text-xs sm:text-sm font-semibold rounded-full ' + (isTodayDay ? "bg-[hsl(var(--primary))] text-white shadow-sm" : day.isCurrentMonth ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))]")}>
                      {day.date}
                    </span>
                    {evts.length > 0 && day.isCurrentMonth && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-[hsl(var(--primary))] text-white">
                        {evts.length}
                      </span>
                    )}
                  </div>

                  {evts.length > 0 && day.isCurrentMonth && (
                    <div className="space-y-0.5">
                      {evts.slice(0, 2).map((e) => (
                        <div 
                          key={e.id} 
                          onClick={(ev) => {
                            ev.stopPropagation(); // Prevent day click
                            handleDayClick(day, e); // Pass the specific event
                          }}
                          className={'text-xs px-1.5 py-0.5 rounded border-l-2 truncate font-medium transition-all duration-200 cursor-pointer hover:opacity-80 ' + getEventColor(e.type) + ' ' + (isHovered ? "shadow-sm" : "")} 
                          title={e.title}
                        >
                          {e.title.length > 15 ? e.title.substring(0, 15) + '...' : e.title}
                        </div>
                      ))}
                      {evts.length > 2 && (
                        <div className="text-xs text-[hsl(var(--muted-foreground))] font-semibold px-1.5">
                          +{evts.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AppointmentBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedDate={selectedDate}
        doctorId={doctorId}
        onSuccess={() => {
          setBookingModalOpen(false);
          if (onAppointmentChange) {
            onAppointmentChange();
          }
        }}
      />

      <AppointmentDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        appointment={selectedAppointment}
        onSuccess={() => {
          setDetailsModalOpen(false);
          if (onAppointmentChange) {
            onAppointmentChange();
          }
        }}
      />
    </>
  );
}
