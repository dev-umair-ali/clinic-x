"use client"
import { Dispatch, SetStateAction } from "react"
import { Button, } from "@/components/ui/button"
import {  Card,} from "@/components/ui/card"
import {  Input, } from "@/components/ui/input"
import { RadioGroup, } from "@/components/ui/radio-group"
import {  RadioGroupItem } from "@/components/ui/radio-group"

import { Switch } from "@/components/ui/switch"
import { AppointmentDetails } from "./types"
import { paymentMethods, PaymentMethod } from "./data"

interface Props {
  details: AppointmentDetails
  total: number
  coPay: boolean
  setCoPay: Dispatch<SetStateAction<boolean>>
  selectedPM: string | undefined
  setSelectedPM: Dispatch<SetStateAction<string | undefined>>
  cardHolder: string; setCardHolder: Dispatch<SetStateAction<string>>
  cardNumber: string; setCardNumber: Dispatch<SetStateAction<string>>
  expiry: string; setExpiry: Dispatch<SetStateAction<string>>
  cvv: string; setCvv: Dispatch<SetStateAction<string>>
  onPay: () => void
  onBack: () => void
}

export default function BillingStep({
  details, total, coPay, setCoPay,
  selectedPM, setSelectedPM,
  cardHolder, setCardHolder,
  cardNumber, setCardNumber,
  expiry, setExpiry,
  cvv, setCvv,
  onPay, onBack
}: Props) {
  const payNow = coPay ? total / 2 : total
  const remaining = coPay ? total / 2 : 0

  const showCardForm = selectedPM === "mastercard"

  return (
    <div className="space-y-6">
      {/* summary card */}
      <Card className="p-4 text-center border-[hsl(var(--color-brand-teal))] bg-[hsl(var(--color-brand-teal-light))] dark:bg-[hsl(var(--color-brand-teal))/0.1]">
        <div className="font-medium mb-1 text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{details.type}</div>
        <div className="text-sm text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))] mb-2">{details.doctorName}</div>
        <div className="text-sm text-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--color-brand-teal))] font-medium">
          {details.date} at {details.time}
        </div>
      </Card>

      {/* price card */}
      <Card className="p-6 bg-[hsl(var(--muted))]/30 dark:bg-[hsl(var(--muted))]/20">
        <div className="text-center mb-6">
          <div className="text-sm font-medium mb-2">Total Charge</div>
          <div className="text-3xl font-bold text-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--color-brand-teal))]">${total.toFixed(2)}</div>
        </div>

        <div className="flex items-center justify-between py-4 border-t border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
          <span className="text-sm text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Co-Pay Option (50% now)</span>
          <Switch checked={coPay} onCheckedChange={setCoPay} />
        </div>

        <div className="space-y-3 pt-4 border-t border-[hsl(var(--border))] dark:border-[hsl(var(--border))] text-sm">
          <div className="flex justify-between">
            <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Pay now:</span>
            <span className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">${payNow.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]">Remaining due at visit:</span>
            <span className="font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">${remaining.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {/* payment method or card form */}
      {showCardForm ? (
        <div className="space-y-6">
          <h3 className="text-base font-medium text-center text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Enter Card Details</h3>
          <div>
            <label className="block text-sm font-medium mb-2 text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Card Holder Name</label>
            <Input value={cardHolder} onChange={e => setCardHolder(e.target.value)} placeholder="Enter Holder Name" className="h-11 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Card Number</label>
            <Input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="Enter Card Number" className="h-11 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Expiry Date</label>
              <Input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="02/23" className="h-11 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">CVV</label>
              <Input value={cvv} onChange={e => setCvv(e.target.value)} placeholder="127" className="h-11 bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]" />
            </div>
          </div>
          <Button className="w-full h-11 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white" onClick={onPay}>Continue to Pay ${payNow.toFixed(2)}</Button>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-base font-medium text-center text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">Select the Payment method you want to use</h3>
          <div className="space-y-3">
            {paymentMethods.map(m => (
              <Card
                key={m.id}
                onClick={() => setSelectedPM(m.id)}
                className={`p-4 cursor-pointer transition border ${selectedPM === m.id ? "border-[hsl(var(--color-brand-teal))] ring-1 ring-[hsl(var(--color-brand-teal))] bg-[hsl(var(--color-brand-teal-light))] dark:bg-[hsl(var(--color-brand-teal))/0.1]" : "border-[hsl(var(--border))] hover:border-[hsl(var(--muted-foreground))] dark:border-[hsl(var(--border))] dark:hover:border-[hsl(var(--muted-foreground))]"}`}
              >
                <div className="flex items-center">
                  <RadioGroup value={selectedPM} className="mr-3">
                    <RadioGroupItem value={m.id} />
                  </RadioGroup>
                  <img src={m.icon || "/placeholder.svg"} alt={m.name} className="w-6 h-6 mr-3 object-contain" />
                  <span className="text-sm font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]">{m.name}</span>
                </div>
              </Card>
            ))}
          </div>
          <Button className="w-full h-11 bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white" disabled={!selectedPM} onClick={onPay}>Continue</Button>
        </div>
      )}
    </div>
  )
}