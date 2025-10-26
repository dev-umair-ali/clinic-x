'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Procedure from '@/components/patients/Procedure';

const ProcedurePage = () => {
    const params = useParams();
    const query = useSearchParams();
    const router = useRouter();

    const stepParam = query.get("step");
    const parsedStep = stepParam ? parseInt(stepParam, 10) : 0;
    const initialStep = !isNaN(parsedStep) ? parsedStep : 0;

    const patientData = {
        id: Array.isArray(params.id) ? params.id[0] : params.id || '',
        name: query.get("name") || "",
        age: query.get("age") || "",
        gender: query.get("gender") || "",
        lastVisit: query.get("lastVisit") || ""
    };

    return (
        <Procedure
            patient={patientData}
            initialStep={initialStep}
            goBack={() => router.push('/dashboard/patients')}
        />
    );
};

export default ProcedurePage;
