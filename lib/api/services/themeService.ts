import api from '../axios';

/* ---------  TYPES  --------- */

export interface ThemeSettings {
  primary: string;
  secondary: string;
  accent: string;
  logo: string | null;
}

export interface ClinicTheme {
  _id?: string;
  clinicId: string;
  theme: ThemeSettings;
  updatedAt?: string;
  createdAt?: string;
}

export interface FetchThemeResponse {
  success?: boolean;
  message?: string;
  data: ClinicTheme;
  clinicId: string;
}

export interface SaveThemeRequest {
  theme: ThemeSettings;
}

export interface SaveThemeResponse {
  _id: string;
  clinicId: string;
  theme: ThemeSettings;
  updatedAt: string;
  createdAt: string;
}

/* ---------  SERVICE  --------- */

export const themeService = {
  /**
   * Fetch clinic theme settings
   * GET /theme/clinic/:clinicId
   */
  async getClinicTheme(clinicId: string): Promise<FetchThemeResponse> {
    try {
      const response = await api.get<FetchThemeResponse>(`/clinic/settings/theme/${clinicId}`);
      return response.data;
    } catch (error: any) {
      // If 404, return default theme instead of throwing error
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Theme not found, using default',
          data: {
            clinicId,
            theme: {
              primary: "167 69% 39%",
              secondary: "167 69% 49%",
              accent: "167 69% 29%",
              logo: null,
            },
          },
          clinicId,
        };
      }
      throw error;
    }
  },

  /**
   * Save or update clinic theme settings
   * PUT /theme/clinic/:clinicId
   */
  async saveClinicTheme(
    clinicId: string,
    theme: ThemeSettings
  ): Promise<SaveThemeResponse> {
    const response = await api.patch<SaveThemeResponse>(
      `/clinic/settings/theme`,
      { theme }
    );
    return response.data;
  },

  /**
   * Delete clinic theme (reset to default)
   * DELETE /theme/clinic/:clinicId
   */
  async deleteClinicTheme(clinicId: string): Promise<{ message: string }> {
    const response = await api.delete(`/theme/clinic/${clinicId}`);
    return response.data;
  },
};
