import api from '../axios';

/**
 * Patient Onboarding Service
 * Handles all form submissions for patient onboarding process
 * 
 * Form Mapping:
 * Step 1 (Personal Information): onBoardingForm
 * Step 2 (Insurance): insuranceForm
 * Step 3 (Present Condition): presentConditionForm
 * Step 4 (Health History): historyHealthForm
 * Step 5 (Lifestyle): lifeStyleForm
 * Step 6 (Women's Health): womenForm
 * Step 7 (Consent & Legal): constantLegalForm
 * Step 8 (Documents): File uploads
 */

// ==================== Type Definitions ====================

export interface OnBoardingFormData {
  refPatientObjectId: string;
  createdBy?: string; // Will be auto-populated from auth
  fullName: string;
  preferredName: string;
  dateOfBirth: string;
  gender: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  email: string; // ⚠️ Changed from emailAddress
  phoneNumber: string;
  preferredContactMethod: string;
  emergencyContactName: string;
  emergencyPhoneNumber: string; // ⚠️ Changed from emergencyContactPhone
  relationshipToPatient: string;
  occupation: string;
  primaryLanguage: string;
  refferedBy?: string; // ⚠️ Note: typo in backend (reffered vs referred)
}

export interface InsuranceFormData {
  refPatientObjectId: string;
  createdBy?: string; // Will be auto-populated from auth
  haveInsurance: boolean; // ⚠️ Changed from hasInsurance (string)
  insuranceCompany: string; // ⚠️ Changed from insuranceCompanyName
  policyHolderName: string; // ⚠️ Changed from policyholderName
  relationshipToPatient: string; // ⚠️ Added (missing in frontend)
  memberId: string; // ⚠️ Changed from memberSubscriberID
  groupNumber: string;
  cardFront?: string; // ⚠️ Added (file upload)
  cardBack?: string; // ⚠️ Added (file upload)
  serviceDate?: string;
  insuranceNumber?: string;
  providerNpi?: string;
  providerTaxId?: string;
}

export interface PresentConditionFormData {
  refPatientObjectId: string;
  createdBy?: string; // Will be auto-populated from auth
  reason: string; // ⚠️ Changed from mainConcern
  symptomsDate: string; // ⚠️ Changed from symptomStartDate
  hadSymptomBefore: boolean; // ⚠️ Changed from hadThisBefore (string → boolean)
  painAssesment: string; // ⚠️ Changed from painLevel (number → string)
  painCharacterstics: string[]; // ⚠️ Changed from painCharacteristics
  symptomsDetails: { // ⚠️ Changed from flat structure to nested
    improve: string; // ⚠️ Changed from whatImprovesIt
    worsen: string; // ⚠️ Changed from whatWorsensIt
    activities: string; // ⚠️ Changed from activitiesAffected
    seen: string; // ⚠️ Changed from seenAnyoneElse
    describe: string; // ⚠️ Changed from treatmentsTried
  };
}

export interface HistoryHealthFormData {
  refPatientObjectId: string;
  createdBy?: string; // Will be auto-populated from auth
  healthCondition: string[]; // ⚠️ Changed from healthConditions (plural)
  notListed: string; // ⚠️ Changed from otherConditions
  currentMedication: string; // ⚠️ Changed from currentMedications (plural)
  bloodThinner: boolean; // ⚠️ Changed from bloodThinners (string → boolean)
  pastSurgeryAndDate: string; // ⚠️ Changed from surgicalHistory
  allergies: string;
}

export interface LifeStyleFormData {
  refPatientObjectId: string;
  createdBy?: string; // Will be auto-populated from auth
  exercise: boolean; // ⚠️ Changed from exerciseRegularly (string → boolean)
  work: string; // ⚠️ Changed from workType
  sleepQuality: string;
  pillows: string; // ⚠️ Changed from sleepSupports
  tobaccoUse: boolean; // ⚠️ Changed from string → boolean
  alcoholUse: boolean; // ⚠️ Changed from string → boolean
  drugUse: boolean; // ⚠️ Changed from recreationalDrugUse (string → boolean)
}

export interface WomenFormData {
  refPatientObjectId: string;
  createdBy?: string; // Will be auto-populated from auth
  pregnant?: "yes" | "no" | "notsure"; // ⚠️ Changed from currentlyPregnant
  cycleInfo?: string; // ⚠️ Changed from menstrualCycleInfo
  pmsSymptom?: string; // ⚠️ Changed from pmsSymptoms (plural)
  hormonalSymptom?: string; // ⚠️ Changed from hormonalSymptoms (plural)
  posturalSymptom?: string; // ⚠️ Changed from posturalSymptoms (plural)
  birthControl?: string;
  pregnancyHistory?: string;
}

export interface ConstantLegalFormData {
  refPatientObjectId: string;
  createdBy?: string; // Will be auto-populated from auth
  digitalSignature: string;
  idFront?: string; // ⚠️ Added (file upload)
  idBack?: string; // ⚠️ Added (file upload)
  scans?: string; // ⚠️ Added (file upload)
  medicalRecord?: string; // ⚠️ Added (file upload)
  otherDocument?: string; // ⚠️ Added (file upload)
  acknowledgement: Array<{ // ⚠️ Changed from individual boolean fields
    label: string;
    checked: boolean;
  }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ==================== OnBoarding Form Service ====================

export const onBoardingFormService = {
  /**
   * Create a new onboarding form
   * POST /api/patients/forms/onBoardingForm
   */
  async create(data: OnBoardingFormData): Promise<ApiResponse> {
    try {
      const response = await api.post('/patients/forms/onBoardingForm', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating onboarding form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to create onboarding form',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Update an existing onboarding form
   * PUT /api/patients/forms/onBoardingForm/:id
   */
  async update(id: string, data: Partial<OnBoardingFormData>): Promise<ApiResponse> {
    try {
      const response = await api.put(`/patients/forms/onBoardingForm/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating onboarding form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update onboarding form',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Get onboarding form by patient ID
   * GET /api/patients/forms/onBoarding/:patientId
   */
  async getByPatientId(patientId: string): Promise<ApiResponse> {
    try {
      const response = await api.get(`/patients/forms/onBoarding/${patientId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching onboarding form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch onboarding form',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Get onboarding form for logged-in patient
   * Uses /patients/forms/me to get all forms, then extracts onboarding
   */
  async getMine(): Promise<ApiResponse> {
    try {
      const response = await api.get('/patients/forms/me');
      // Extract onboarding form from response
      const onBoardingForm = response.data?.data?.onBoardingForm || null;
      return {
        success: true,
        data: onBoardingForm,
      };
    } catch (error: any) {
      console.error('Error fetching my onboarding form:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'No onboarding form found',
      };
    }
  },
};

// ==================== Insurance Form Service ====================

export const insuranceFormService = {
  /**
   * Create a new insurance form
   * POST /api/patients/forms/insuranceForm
   */
  async create(data: InsuranceFormData): Promise<ApiResponse> {
    try {
      const response = await api.post('/patients/forms/insuranceForm', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating insurance form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to create insurance form',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Update an existing insurance form
   * PUT /api/patients/forms/insuranceForm/:id
   */
  async update(id: string, data: Partial<InsuranceFormData>): Promise<ApiResponse> {
    try {
      const response = await api.put(`/patients/forms/insuranceForm/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating insurance form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update insurance form',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Verify insurance
   * POST /api/patients/insurance/verify/:formId
   */
  async verify(formId: string): Promise<ApiResponse> {
    try {
      const response = await api.post(`/patients/insurance/verify/${formId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error verifying insurance:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to verify insurance',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Get insurance card front image
   * GET /api/patients/insurance/:formId/front
   */
  async getCardFront(formId: string): Promise<string> {
    try {
      const response = await api.get(`/patients/insurance/${formId}/front`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching insurance card front:', error);
      throw error;
    }
  },

  /**
   * Get insurance card back image
   * GET /api/patients/insurance/:formId/back
   */
  async getCardBack(formId: string): Promise<string> {
    try {
      const response = await api.get(`/patients/insurance/${formId}/back`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching insurance card back:', error);
      throw error;
    }
  },

  /**
   * Get insurance form for logged-in patient
   */
  async getMine(): Promise<ApiResponse> {
    try {
      const response = await api.get('/patients/forms/me');
      const insuranceForm = response.data?.data?.insuranceForm || null;
      return {
        success: true,
        data: insuranceForm,
      };
    } catch (error: any) {
      console.error('Error fetching my insurance form:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'No insurance form found',
      };
    }
  },
};

// ==================== Present Condition Form Service ====================

export const presentConditionFormService = {
  /**
   * Create a new present condition form
   * POST /api/patients/forms/presentConditionForm
   */
  async create(data: PresentConditionFormData): Promise<ApiResponse> {
    try {
      const response = await api.post('/patients/forms/presentConditionForm', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating present condition form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to create present condition form',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Update an existing present condition form
   * PUT /api/patients/forms/presentConditionForm/:id
   */
  async update(id: string, data: Partial<PresentConditionFormData>): Promise<ApiResponse> {
    try {
      const response = await api.put(`/patients/forms/presentConditionForm/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating present condition form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update present condition form',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Get present condition form for logged-in patient
   */
  async getMine(): Promise<ApiResponse> {
    try {
      const response = await api.get('/patients/forms/me');
      const presentConditionForm = response.data?.data?.presentConditionForm || null;
      return {
        success: true,
        data: presentConditionForm,
      };
    } catch (error: any) {
      console.error('Error fetching my present condition form:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'No present condition form found',
      };
    }
  },
};

// ==================== History Health Form Service ====================

export const historyHealthFormService = {
  /**
   * Create a new history health form
   * POST /api/patients/forms/historyHealthForm
   */
  async create(data: HistoryHealthFormData): Promise<ApiResponse> {
    try {
      const response = await api.post('/patients/forms/historyHealthForm', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating history health form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to create history health form',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Update an existing history health form
   * PUT /api/patients/forms/historyHealthForm/:id
   */
  async update(id: string, data: Partial<HistoryHealthFormData>): Promise<ApiResponse> {
    try {
      const response = await api.put(`/patients/forms/historyHealthForm/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating history health form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update history health form',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Get history health form for logged-in patient
   */
  async getMine(): Promise<ApiResponse> {
    try {
      const response = await api.get('/patients/forms/me');
      const historyHealthForm = response.data?.data?.historyHealthForm || null;
      return {
        success: true,
        data: historyHealthForm,
      };
    } catch (error: any) {
      console.error('Error fetching my history health form:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'No history health form found',
      };
    }
  },
};

// ==================== LifeStyle Form Service ====================

export const lifeStyleFormService = {
  /**
   * Create a new lifestyle form
   * POST /api/patients/forms/lifeStyleForm
   */
  async create(data: LifeStyleFormData): Promise<ApiResponse> {
    try {
      const response = await api.post('/patients/forms/lifeStyleForm', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating lifestyle form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to create lifestyle form',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Update an existing lifestyle form
   * PUT /api/patients/forms/lifeStyleForm/:id
   */
  async update(id: string, data: Partial<LifeStyleFormData>): Promise<ApiResponse> {
    try {
      const response = await api.put(`/patients/forms/lifeStyleForm/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating lifestyle form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update lifestyle form',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Get lifestyle form for logged-in patient
   */
  async getMine(): Promise<ApiResponse> {
    try {
      const response = await api.get('/patients/forms/me');
      const lifeStyleForm = response.data?.data?.lifeStyleForm || null;
      return {
        success: true,
        data: lifeStyleForm,
      };
    } catch (error: any) {
      console.error('Error fetching my lifestyle form:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'No lifestyle form found',
      };
    }
  },
};

// ==================== Women's Health Form Service ====================

export const womenFormService = {
  /**
   * Create a new women's health form
   * POST /api/patients/forms/womenForm
   */
  async create(data: WomenFormData): Promise<ApiResponse> {
    try {
      const response = await api.post('/patients/forms/womenForm', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating women form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to create women form',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Update an existing women's health form
   * PUT /api/patients/forms/womenForm/:id
   */
  async update(id: string, data: Partial<WomenFormData>): Promise<ApiResponse> {
    try {
      const response = await api.put(`/patients/forms/womenForm/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating women form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update women form',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Get women's health form for logged-in patient
   */
  async getMine(): Promise<ApiResponse> {
    try {
      const response = await api.get('/patients/forms/me');
      const womenForm = response.data?.data?.womenForm || null;
      return {
        success: true,
        data: womenForm,
      };
    } catch (error: any) {
      console.error('Error fetching my women form:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'No women form found',
      };
    }
  },
};

// ==================== Constant Legal Form Service ====================

export const constantLegalFormService = {
  /**
   * Create a new constant legal form
   * POST /api/patients/forms/constantLegalForm
   */
  async create(data: ConstantLegalFormData): Promise<ApiResponse> {
    try {
      const response = await api.post('/patients/forms/constantLegalForm', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating constant legal form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to create constant legal form',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Update an existing constant legal form
   * PUT /api/patients/forms/constantLegalForm/:id
   */
  async update(id: string, data: Partial<ConstantLegalFormData>): Promise<ApiResponse> {
    try {
      const response = await api.put(`/patients/forms/constantLegalForm/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating constant legal form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update constant legal form',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Get constant legal form for logged-in patient
   */
  async getMine(): Promise<ApiResponse> {
    try {
      const response = await api.get('/patients/forms/me');
      const constantLegalForm = response.data?.data?.constantLegalForm || null;
      return {
        success: true,
        data: constantLegalForm,
      };
    } catch (error: any) {
      console.error('Error fetching my constant legal form:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'No constant legal form found',
      };
    }
  },
};

// ==================== Additional Forms ====================

export const dentalHistoryFormService = {
  /**
   * Create a new dental history form
   * POST /api/patients/forms/dental-history
   */
  async create(data: any): Promise<ApiResponse> {
    try {
      const response = await api.post('/patients/forms/dental-history', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating dental history form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to create dental history form',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Update an existing dental history form
   * PUT /api/patients/forms/dental-history/:id
   */
  async update(id: string, data: any): Promise<ApiResponse> {
    try {
      const response = await api.put(`/patients/forms/dental-history/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating dental history form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update dental history form',
        error: error.response?.data?.error || error.message,
      };
    }
  },
};

export const medicalProfileFormService = {
  /**
   * Create a new medical profile form
   * POST /api/patients/forms/medical-profile
   */
  async create(data: any): Promise<ApiResponse> {
    try {
      const response = await api.post('/patients/forms/medical-profile', data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating medical profile form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to create medical profile form',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Update an existing medical profile form
   * PUT /api/patients/forms/medical-profile/:id
   */
  async update(id: string, data: any): Promise<ApiResponse> {
    try {
      const response = await api.put(`/patients/forms/medical-profile/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating medical profile form:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to update medical profile form',
        error: error.response?.data?.error || error.message,
      };
    }
  },
};

// ==================== Get All Forms ====================

export const patientFormsService = {
  /**
   * Get all forms for the logged-in patient
   * GET /api/patients/forms/me
   */
  async getMyForms(): Promise<ApiResponse> {
    try {
      const response = await api.get('/patients/forms/me');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching patient forms:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch patient forms',
        error: error.response?.data?.error || error.message,
      };
    }
  },

  /**
   * Get all forms for a specific patient (admin/doctor)
   * GET /api/patients/forms/:patientId
   */
  async getFormsByPatientId(patientId: string): Promise<ApiResponse> {
    try {
      // Use the patients/forms/:patientId endpoint
      const response = await api.get(`/patients/forms/${patientId}`);
      console.log('🔍 API Response for patient forms:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching patient forms by ID:', error);
      console.error('Error details:', error.response?.data);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch patient forms',
        error: error.response?.data?.error || error.message,
      };
    }
  },
};

// ==================== Complete Onboarding Service ====================

export interface CompleteOnboardingData {
  refPatientObjectId: string;
  personalInfo: OnBoardingFormData;
  insuranceInfo?: InsuranceFormData;
  presentCondition?: PresentConditionFormData;
  healthHistory?: HistoryHealthFormData;
  lifestyle?: LifeStyleFormData;
  womensHealth?: WomenFormData;
  legalConsent?: ConstantLegalFormData;
}

export const completeOnboardingService = {
  /**
   * Submit all onboarding forms sequentially
   * This is a helper function that submits all forms in the correct order
   */
  async submitAll(data: CompleteOnboardingData): Promise<{
    success: boolean;
    results: Record<string, ApiResponse>;
    errors: Record<string, any>;
  }> {
    const results: Record<string, ApiResponse> = {};
    const errors: Record<string, any> = {};

    try {
      // Step 1: Personal Information (OnBoarding Form)
      if (data.personalInfo) {
        try {
          results.onBoarding = await onBoardingFormService.create(data.personalInfo);
        } catch (error) {
          errors.onBoarding = error;
        }
      }

      // Step 2: Insurance Information
      if (data.insuranceInfo && data.insuranceInfo.haveInsurance === true) {
        try {
          results.insurance = await insuranceFormService.create(data.insuranceInfo);
        } catch (error) {
          errors.insurance = error;
        }
      }

      // Step 3: Present Condition
      if (data.presentCondition) {
        try {
          results.presentCondition = await presentConditionFormService.create(data.presentCondition);
        } catch (error) {
          errors.presentCondition = error;
        }
      }

      // Step 4: Health History
      if (data.healthHistory) {
        try {
          results.healthHistory = await historyHealthFormService.create(data.healthHistory);
        } catch (error) {
          errors.healthHistory = error;
        }
      }

      // Step 5: Lifestyle
      if (data.lifestyle) {
        try {
          results.lifestyle = await lifeStyleFormService.create(data.lifestyle);
        } catch (error) {
          errors.lifestyle = error;
        }
      }

      // Step 6: Women's Health (if applicable)
      if (data.womensHealth) {
        try {
          results.womensHealth = await womenFormService.create(data.womensHealth);
        } catch (error) {
          errors.womensHealth = error;
        }
      }

      // Step 7: Legal Consent
      if (data.legalConsent) {
        try {
          results.legalConsent = await constantLegalFormService.create(data.legalConsent);
        } catch (error) {
          errors.legalConsent = error;
        }
      }

      const hasErrors = Object.keys(errors).length > 0;
      return {
        success: !hasErrors,
        results,
        errors,
      };
    } catch (error) {
      console.error('Error submitting onboarding forms:', error);
      return {
        success: false,
        results,
        errors: { ...errors, general: error },
      };
    }
  },
};

// Export all services as a single object for convenience
export const patientOnboardingService = {
  onBoarding: onBoardingFormService,
  insurance: insuranceFormService,
  presentCondition: presentConditionFormService,
  healthHistory: historyHealthFormService,
  lifestyle: lifeStyleFormService,
  women: womenFormService,
  legal: constantLegalFormService,
  dental: dentalHistoryFormService,
  medicalProfile: medicalProfileFormService,
  forms: patientFormsService,
  complete: completeOnboardingService,
};

export default patientOnboardingService;
