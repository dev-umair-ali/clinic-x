import api from '../axios';

export interface TimeSlot {
  day: string;
  from: string;
  to: string;
}

export interface AvailabilityData {
  userId?: string;
  timeZone: string;
  availableDays: TimeSlot[];
}

export interface AvailabilityResponse {
  success?: boolean;
  message: string;
  data: AvailabilityData | null;
}

/**
 * Get the authenticated doctor's availability
 */
export const getAvailability = async (): Promise<AvailabilityResponse> => {
  try {
    const response = await api.get('/doctors/availability');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch availability' };
  }
};

/**
 * Update the authenticated doctor's availability
 */
export const updateAvailability = async (
  data: Omit<AvailabilityData, 'userId'>
): Promise<AvailabilityResponse> => {
  try {
    const response = await api.put('/doctors/availability', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to update availability' };
  }
};
