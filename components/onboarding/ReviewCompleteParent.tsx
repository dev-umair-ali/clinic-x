import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/lib/store';
import { fetchAllOnboardingForms, setOnboardingComplete } from '@/lib/slices/onboardingSlice';
import ReviewComplete from './ReviewComplete/page';

const ReviewCompleteParent = ({ onSubmit }: { onSubmit: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const patientId = localStorage.getItem('clinic-ai-user')
      ? JSON.parse(localStorage.getItem('clinic-ai-user')!).patientId
      : null;
    if (patientId) dispatch(fetchAllOnboardingForms(patientId));
  }, [dispatch]);

  const handleSubmit = () => {
    dispatch(setOnboardingComplete());
    onSubmit();
  };

  return <ReviewComplete onSubmit={handleSubmit} />;
};

export default ReviewCompleteParent;
