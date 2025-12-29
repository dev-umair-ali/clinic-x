// src/context/GlobalContext.tsx
'use client'
import "../lib/awsConfig"

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from 'react'
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth'
// import { fetchDoctorScheduleTimes } from "@/services/calendlyService"// Extend SessionUser to include role
interface SessionUser {
    name: string
    email: string
    username: string
    role: string
    raw: any
}

interface PatientBilling {
    [patientId: string]: any[]; // array of bills per patient
}
interface SessionData {
    user: SessionUser
}

interface MainContextType {
    session: SessionData | null
    setSession: (session: SessionData | null) => void
    checkingSession: boolean
    setCheckingSession: (checking: boolean) => void
    doctorScheduleTimes?: any
    setDoctorScheduleTimes?: (data: any) => void
    patientBills: PatientBilling;
    setPatientBills: (bills: PatientBilling) => void;
}



const MainContext = createContext<MainContextType | undefined>(undefined)

export const MainProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<SessionData | null>(null)
    const [checkingSession, setCheckingSession] = useState(true)
    const [doctorScheduleTimes, setDoctorScheduleTimes] = useState<any>(null);
    const [patientBills, setPatientBills] = useState<PatientBilling>({});

    useEffect(() => {
        const checkAuthAndFetchSchedule = async () => {
            setCheckingSession(true);
            try {
                const user = await getCurrentUser();
                const attributes = await fetchUserAttributes();

                const name = attributes.name || attributes.email || user.signInDetails?.loginId;
                const email = attributes.email || user.signInDetails?.loginId;
                const role = attributes['custom:role'] || 'doctor'; // fallback default
                const username = user.username;

                setSession({
                    user: {
                        name: name ?? '',
                        email: email ?? '',
                        username: user.username,
                        role,
                        raw: { ...user, attributes },
                    },
                });

                // // Only fetch timings if Calendly is connected
                // if (statusData.connected) {
                //     try {
                //         const timings = await fetchDoctorScheduleTimes(username);
                //         console.log("timings", timings)
                //         setDoctorScheduleTimes(timings);
                //     } catch {
                //         setDoctorScheduleTimes(null);
                //     }
                // } else {
                //     setDoctorScheduleTimes(null);
                // }
            } catch {
                setSession(null);
                setDoctorScheduleTimes(null);
            } finally {
                setCheckingSession(false);
            }
        };

        checkAuthAndFetchSchedule();
    }, []);



    return (
        <MainContext.Provider
            value={{
                session,
                setSession,
                checkingSession,
                setCheckingSession,
                doctorScheduleTimes,
                setDoctorScheduleTimes,
                patientBills,
                setPatientBills,
            }}
        >
            {children}
        </MainContext.Provider>
    )
}

export const useMainProvider = () => {
    const context = useContext(MainContext)
    // if (!context) {
    //     throw new Error('useMainProvider must be used within a MainProvider')
    // }
    return context
}
