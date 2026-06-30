/**
 * Get the current authenticated user from localStorage
 */
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('clinic-ai-user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Get the clinic ID for the current user
 * - For clinic role: returns user._id or user.id
 * - For other roles: returns null
 */
export const getClinicId = (): string | null => {
  const user = getCurrentUser();
  if (!user) return null;
  
  // For clinic role, the user's ID is the clinic ID
  if (user.role === 'clinic') {
    return user._id || user.id || null;
  }
  
  return null;
};

/**
 * Get the current user's role
 */
export const getUserRole = (): string | null => {
  const user = getCurrentUser();
  return user?.role || null;
};

/**
 * Check if current user is a clinic
 */
export const isClinicUser = (): boolean => {
  return getUserRole() === 'clinic';
};
