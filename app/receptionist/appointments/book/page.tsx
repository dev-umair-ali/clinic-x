"use client"
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ProtectedRoute } from "@/components/ui/protected-route";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import type { RootState } from "@/lib/store";
import {
  services,
  doctors,
} from "@/components/BookAppointmentPage-receptionist/data";
import { AppointmentDetails } from "@/components/BookAppointmentPage-receptionist/types";

import BookStep from "@/components/BookAppointmentPage-receptionist/BookStep";
import BillingStep from "@/components/BookAppointmentPage-receptionist/BillingStep";
import ConfirmStep from "@/components/BookAppointmentPage-receptionist/ConfirmStep";

export default function BookAppointmentPage() {
  const router = useRouter();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [step, setStep] = useState<"book" | "billing" | "confirm">("book");

  /* ---------- book step ---------- */
  const [serviceId, setServiceId] = useState<string | undefined>();
  const [date, setDate] = useState<Date | undefined>();
  const [timeSlot, setTimeSlot] = useState<string | undefined>();
  const [sms, setSms] = useState(true);
  const [email, setEmail] = useState(false);

  /* ---------- billing step ---------- */
  const [coPay, setCoPay] = useState(false);
  const [pm, setPm] = useState<string | undefined>();
  const [holder, setHolder] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId),
    [serviceId]
  );
  const total = selectedService ? selectedService.price : 0;

  const appointmentDetails = useMemo<AppointmentDetails | null>(() => {
    if (!selectedService || !date || !timeSlot) return null;
    return {
      type: selectedService.name,
      doctorName: doctors[0].name,
      date: format(date, "yyyy-MM-dd"),
      time: timeSlot,
    };
  }, [selectedService, date, timeSlot]);

  const handleBook = () => {
    if (!selectedService || !date || !timeSlot || !currentUser) {
      alert(
        "Please fill all appointment details and ensure you are logged in."
      );
      return;
    }
    setStep("billing");
  };

  const handlePay = () => {
    /* TODO integrate real payment / appointment creation */
    setStep("confirm");
  };

  const handleReschedule = () => {
    setStep("book");
    setServiceId(undefined);
    setDate(undefined);
    setTimeSlot(undefined);
    setPm(undefined);
  };

  const wrapperWidth = step === "confirm" ? "max-w-lg" : "max-w-md";
  const [doctorId, setDoctorId] = useState<string | undefined>();

  return (
    <ProtectedRoute allowedRoles={["receptionist"]}>
      <div className="min-h-screen bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] py-4 px-4 sm:px-6 lg:px-8">
        {/* LEFT-ALIGNED WRAPPER */}
        <div className={`${wrapperWidth} ml-0`}>
          {step === "billing" && (
            <button
              onClick={() => setStep("book")}
              className="flex items-center text-[hsl(var(--color-brand-teal))] hover:text-[hsl(var(--color-brand-teal-dark))] mb-4 text-sm font-medium transition"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>
          )}

          <Card className="shadow-sm border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
            <CardContent
              className={`${step === "billing" ? "p-6 sm:p-8" : "p-4 sm:p-6"}`}
            >
              {step !== "confirm" && (
                <div className="mb-6">
                  <h1
                    className={`text-xl font-semibold mb-1 ${
                      step === "billing" ? "text-center" : ""
                    }`}
                  >
                    {step === "book"
                      ? "Book New Appointment"
                      : "Appointment Billing"}
                  </h1>
                  {step === "book" && (
                    <p className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">
                      Fill the fields to book new Appointment
                    </p>
                  )}
                </div>
              )}

              {step === "book" && (
                <BookStep
                  selectedServiceId={serviceId}
                  setSelectedServiceId={setServiceId}
                  selectedDoctorId={doctorId}
                  setSelectedDoctorId={setDoctorId}
                  selectedDate={date}
                  setSelectedDate={setDate}
                  selectedTimeSlot={timeSlot}
                  setSelectedTimeSlot={setTimeSlot}
                  smsReminders={sms}
                  setSmsReminders={setSms}
                  emailReminders={email}
                  setEmailReminders={setEmail}
                  onContinue={handleBook}
                />
              )}

              {step === "billing" && appointmentDetails && (
                <BillingStep
                  details={appointmentDetails}
                  total={total}
                  coPay={coPay}
                  setCoPay={setCoPay}
                  selectedPM={pm}
                  setSelectedPM={setPm}
                  cardHolder={holder}
                  setCardHolder={setHolder}
                  cardNumber={number}
                  setCardNumber={setNumber}
                  expiry={expiry}
                  setExpiry={setExpiry}
                  cvv={cvv}
                  setCvv={setCvv}
                  onPay={handlePay}
                  onBack={() => setStep("book")}
                />
              )}

              {step === "confirm" && appointmentDetails && (
                <ConfirmStep
                  details={appointmentDetails}
                  onReschedule={handleReschedule}
                  onCancel={() => setStep("book")}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}