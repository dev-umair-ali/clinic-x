import React, { useState } from "react";
import Input from "@/app/doctor/patients/ProcedureInput";
import Image from "next/image";

const AddPatientModal = ({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (patient: any) => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isValid = name.trim() && email.trim() && phone.trim();

  const handleSubmit = () => {
    if (!isValid) return;
    const newPatient = {
      id: `pat-${Date.now()}`,
      name,
      email,
      phone,
      age: "42/female",
      gender: "",
      lastVisit: new Date().toISOString(),
      progress: 1,
    };
    onAdd(newPatient);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-card dark:bg-gray-900 rounded-lg w-full max-w-md p-6 border border-border dark:border-gray-700 shadow-lg">
        {!submitted ? (
          <>
            <h2 className="text-lg font-semibold mb-2 text-foreground dark:text-gray-100">Add Patient</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center gap-4 mb-2">
                <Input
                  label="Patient Name"
                  placeholder="Enter Patient Name"
                  value={name}
                  onChange={setName}
                />
                <Input
                  label="Email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={setEmail}
                  
                />
              </div>
              <Input
                label="Phone Number"
                placeholder="Enter Phone Number"
                value={phone}
                onChange={setPhone}
              />
            </div>
            <div className="flex justify-between items-center mt-6 gap-3">
              <button
                onClick={onClose}
                className="px-4 w-full py-2 bg-muted dark:bg-gray-800 text-muted-foreground dark:text-gray-300 rounded hover:bg-muted/80 dark:hover:bg-gray-700 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isValid}
                className={`px-4 py-2 text-white w-full rounded text-sm transition-colors ${
                  isValid
                    ? "bg-[#1DA68F] hover:bg-[#1DA68F]/80"
                    : "bg-muted dark:bg-gray-800 text-muted-foreground dark:text-gray-400 cursor-not-allowed"
                }`}
              >
                Onboard Patient
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start flex-col justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground dark:text-gray-100">Patient Onboarded</h2>
              <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                {name} has been added, Click Add new Patient Button to add
                another Patient
              </p>
            </div>
            <div>
              <Image
                src="/assets/icons/ticksubmit.png"
                width={80}
                height={24}
                alt="Success"
              />
            </div>
            <div className="flex justify-between items-center gap-3 w-full mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 w-full bg-muted dark:bg-gray-800 text-muted-foreground dark:text-gray-300 rounded hover:bg-muted/80 dark:hover:bg-gray-700 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setName("");
                  setEmail("");
                  setPhone("");
                  setSubmitted(false);
                }}
                className="px-4 py-2 w-full bg-[#1DA68F] text-white rounded hover:bg-[#1DA68F]/80 text-sm transition-colors"
              >
                Add New Patient
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddPatientModal;
