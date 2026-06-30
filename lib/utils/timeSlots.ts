/**
 * Time Slot Utility for Appointment Booking
 * Generates 30-minute time slots based on doctor availability
 */

export interface TimeSlot {
  time: string; // 24-hour format: "09:00", "09:30", etc.
  displayTime: string; // 12-hour format with AM/PM: "9:00 AM"
  available: boolean;
  reason?: string; // Why slot is unavailable
}

export interface AvailabilityDayEntry {
  day: string; // "Monday", "Tuesday", etc.
  from: string; // "09:00 AM" or "09:00"
  to: string; // "05:00 PM" or "17:00"
  _id?: string;
}

export interface DoctorAvailability {
  _id?: string;
  userId: string;
  timeZone: string;
  availableDays: AvailabilityDayEntry[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ExistingAppointment {
  dateTime: string;
  status: string;
  time?: string; // Local time in 24-hour format like "09:00", "11:00"
  date?: string; // Date field (ISO string)
  timeZone?: string; // Timezone of the appointment
}

/**
 * Convert 12-hour time format to 24-hour format
 */
function convertTo24Hour(time12: string): string {
  // If already in 24-hour format (no AM/PM), return as is
  if (!time12.includes('AM') && !time12.includes('PM')) {
    return time12;
  }

  const [time, period] = time12.trim().split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Convert 24-hour time to 12-hour format with AM/PM
 */
export function formatTime12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Generate time string for next 30-minute slot
 */
function addThirtyMinutes(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + 30;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
}

/**
 * Check if time1 is before time2
 */
function isTimeBefore(time1: string, time2: string): boolean {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);
  return h1 * 60 + m1 < h2 * 60 + m2;
}

/**
 * Get day name from date
 */
function getDayName(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

/**
 * Generate all 30-minute time slots for a given date based on doctor availability
 */
export function generateTimeSlots(
  availability: DoctorAvailability | null,
  selectedDate: Date
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  
  // If no availability data, return empty array
  if (!availability) {
    return slots;
  }

  const dayName = getDayName(selectedDate);
  
  // Find availability for the selected day
  const dayAvailability = availability.availableDays.find(
    (day) => day.day === dayName
  );

  // If doctor is not available on this day
  if (!dayAvailability) {
    return slots;
  }

  // Convert times to 24-hour format
  const startTime = convertTo24Hour(dayAvailability.from);
  const endTime = convertTo24Hour(dayAvailability.to);
  
  let currentTime = startTime;

  // Generate slots in 30-minute intervals
  while (isTimeBefore(currentTime, endTime)) {
    const nextTime = addThirtyMinutes(currentTime);
    
    // Don't add slot if it would go past end time
    if (!isTimeBefore(nextTime, endTime) && nextTime !== endTime) {
      break;
    }

    const displayStart = formatTime12Hour(currentTime);

    slots.push({
      time: currentTime,
      displayTime: displayStart, // Only show start time
      available: true, // Will be updated when checking against existing appointments
    });

    currentTime = nextTime;
  }

  return slots;
}

/**
 * Filter out booked slots based on existing appointments
 */
export function filterBookedSlots(
  slots: TimeSlot[],
  existingAppointments: ExistingAppointment[],
  selectedDate: Date
): TimeSlot[] {
  // Get date in YYYY-MM-DD format for comparison (in local timezone)
  const selectedYear = selectedDate.getFullYear();
  const selectedMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
  const selectedDay = selectedDate.getDate().toString().padStart(2, '0');
  const selectedDateStr = `${selectedYear}-${selectedMonth}-${selectedDay}`;

  // Filter appointments for the selected date
  const appointmentsOnDate = existingAppointments.filter((apt) => {
    if (apt.status === 'cancelled') return false;
    
    // Use the 'date' field if available, otherwise fall back to 'dateTime'
    const dateToCheck = apt.date || apt.dateTime;
    const aptDate = new Date(dateToCheck);
    
    // Extract date components in local timezone
    const aptYear = aptDate.getFullYear();
    const aptMonth = (aptDate.getMonth() + 1).toString().padStart(2, '0');
    const aptDay = aptDate.getDate().toString().padStart(2, '0');
    const aptDateStr = `${aptYear}-${aptMonth}-${aptDay}`;
    
    const matches = aptDateStr === selectedDateStr;
    
    return matches;
  });

  // Mark slots as unavailable if they overlap with existing appointments
  return slots.map((slot) => {
    const isBooked = appointmentsOnDate.some((apt) => {
      // Use the stored 'time' field directly (it's in 24-hour format like "09:00", "11:00")
      const aptTimeStr = apt.time || '';
      
      if (!aptTimeStr) {
        // If no time field, extract from dateTime as fallback
        const aptTime = new Date(apt.dateTime);
        const extractedTime = `${aptTime.getHours().toString().padStart(2, '0')}:${aptTime.getMinutes().toString().padStart(2, '0')}`;
        console.warn('⚠️ Appointment missing time field, extracted:', extractedTime);
        return extractedTime === slot.time;
      }
      
      return aptTimeStr === slot.time;
    });

    if (isBooked) {
      return {
        ...slot,
        available: false,
        reason: 'Already booked',
      };
    }

    return slot;
  });
}

/**
 * Check if a date is in the past
 */
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate < today;
}

/**
 * Check if a time slot is in the past for today's date
 */
export function isPastTimeSlot(selectedDate: Date, slotTime: string): boolean {
  const today = new Date();
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const todayStr = today.toISOString().split('T')[0];
  
  // If not today, check date only
  if (selectedDateStr !== todayStr) {
    return isPastDate(selectedDate);
  }

  // If today, check time
  const [slotHours, slotMinutes] = slotTime.split(':').map(Number);
  const currentHours = today.getHours();
  const currentMinutes = today.getMinutes();
  
  return slotHours * 60 + slotMinutes < currentHours * 60 + currentMinutes;
}

/**
 * Filter out past time slots
 */
export function filterPastSlots(slots: TimeSlot[], selectedDate: Date): TimeSlot[] {
  return slots.map((slot) => {
    if (isPastTimeSlot(selectedDate, slot.time)) {
      return {
        ...slot,
        available: false,
        reason: 'Past time',
      };
    }
    return slot;
  });
}

/**
 * Main function to get available time slots for a doctor on a specific date
 */
export function getAvailableTimeSlots(
  availability: DoctorAvailability | null,
  selectedDate: Date,
  existingAppointments: ExistingAppointment[]
): TimeSlot[] {
  // Generate all possible slots based on availability and selected date (ignoring current time)
  let slots = generateTimeSlots(availability, selectedDate);
  // Filter out booked slots for the selected date only
  slots = filterBookedSlots(slots, existingAppointments, selectedDate);

  // If you want to filter out past slots for today, uncomment the next line:
  // slots = filterPastSlots(slots, selectedDate);

  return slots;
}
