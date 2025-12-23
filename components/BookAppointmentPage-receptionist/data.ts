export interface Service { id: string; name: string; price: number }
export interface PaymentMethod { id: string; name: string; icon: string }

export const services: Service[] = [
  { id: "1", name: "General Checkup", price: 100 },
  { id: "2", name: "Dental Cleaning", price: 120 },
  { id: "3", name: "Eye Exam", price: 80 },
  { id: "4", name: "Physical Therapy", price: 150 },
  { id: "5", name: "Check Up on Cavity", price: 150 },
]

export const doctors = [
  { id: "doctor1", name: "Dr. Sarah Smith", specialty: "Internal Medicine" },
  { id: "doctor2", name: "Dr. John Doe", specialty: "Dentistry" },
  { id: "doctor3", name: "Dr. Emily White", specialty: "Ophthalmology" },
  { id: "doctor4", name: "Dr. Ahmed", specialty: "Physical Therapy" },
  { id: "doctor5", name: "Dr. Sarah Ahmed", specialty: "General Practice" },
]

export const paymentMethods: PaymentMethod[] = [
  { id: "discover", name: "Discover", icon: "/discover-card-logo.png" },
  { id: "visa", name: "Visa", icon: "/visa-card-logo.png" },
  { id: "mastercard", name: "MasterCard", icon: "/mastercard-logo.png" },
  { id: "amex", name: "American Express", icon: "/american-express-logo.png" },
  { id: "paypal", name: "Paypal", icon: "/paypal-logo.png" },
]