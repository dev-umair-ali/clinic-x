import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/lib/store'; // adjust the path if needed
import { fetchAllOnboardingForms } from '@/lib/slices/onboardingSlice';
import ReviewComplete from './ReviewComplete/page';

const ReviewCompleteParent = ({ onSubmit }: { onSubmit: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const onboarding = useSelector((state: any) => state.onboarding);

  useEffect(() => {
    const patientId = localStorage.getItem('clinic-ai-user') ? JSON.parse(localStorage.getItem('clinic-ai-user')!).patientId : null;
    if (patientId) dispatch(fetchAllOnboardingForms(patientId));
  }, [dispatch]);

  // Pass all onboarding data to ReviewComplete for review
  return <ReviewComplete />;
};

export default ReviewCompleteParent;
