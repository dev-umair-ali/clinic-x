import api from '../../lib/api/axios';

export async function fetchDoctorScheduleTimes(cognitoId: string) {
  try {
    const response = await api.get(`/api/calendly/availability/${cognitoId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch doctor schedule times');
  }
}


