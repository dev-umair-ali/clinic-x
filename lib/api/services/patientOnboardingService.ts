import api from '../axios';
// ==================== Type Definitions ====================

export interface OnBoardingFormData {
  id?: string;
  clinicRef?: String;
  doctorRef?: String;
  patientRef?: string;
  createdBy?: string;
  createdAt?: string;
  legalName: string;
  emergencyContactName: string;
  emergencyPhoneNumber: string;
  relationshipToPatient: string;
  occupation: string;
  primaryLanguage: string;
  gender: string;
  refferedBy?: string;
  updatedBy?: string;
}

export interface InsuranceFormData {
  id?: string;
  patientRef: string;
  clinicRef?: string;
  doctorRef?: string;
  createdBy: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  haveInsurance: boolean;
  insuranceCompany: string;
  policyHolderName: string;
  relationshipToPatient: string;
  memberId: string;
  groupNumber: string;
  cardFront: string;
  cardBack: string;
  serviceDate?: string;
}

export interface VerifiedStatus {
  status: string;
}

export interface PresentConditionFormData {
  _id?: string;
  patientRef: string;
  clinicRef?: string | null;
  doctorRef?: string | null;
  createdBy: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  verifiedStatus?: VerifiedStatus;
  __v?: number;
  symptomStartDate?: string;
  mainConcern?: string;
  hadThisBefore?: string;
  painLevel?: number;
  painCharacteristics?: string[];
  whatImprovesIt?: string;
  whatWorsensIt?: string;
  activitiesAffected?: string;
  seenAnyoneElse?: string;
  treatmentsTried?: string;
}

export interface HistoryHealthFormData {
  id?: string;
  patientRef: string;
  doctorRef: string;
  clinicRef: string;
  createdBy: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  healthCondition: string[];
  notListed: string;
  currentMedication: string;
  bloodThinner: boolean;
  pastSurgeryAndDate: string;
  allergies: string;
}

export interface DentalHealthHistoryFormData {
  id?: string;
  clinicRef: string;
  doctorRef: string;
  patientRef: string;
  lastDentalVisit: string;
  dentalAnxietyLevel: string;
  smokingStatus: string;
  vaping: string;
  currentSymptoms: string[];
  treatmentReceived: string[];
  deviceAndEquipment: string[];
  createdBy: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface PrimaryCareInfo {
  providerName: string;
  contactNumber?: string;
  address?: string;
  notes?: string;
}

export interface SurgicalHistoryInfo {
  procedure: string;
  date?: string;
  hospital?: string;
  notes?: string;
}

export interface MedicalProfileFormData {
  id?: string;
  patientRef: string;
  clinicRef?: string;
  doctorRef?: string;
  createdBy: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  criticalAllergies: string[];
  primaryCareInformation?: PrimaryCareInfo[];
  medicalConditions: string[];
  currentMedications: string[];
  surgicalHistory?: SurgicalHistoryInfo[];
  additionalNotes?: string;
}

export interface LifeStyleFormData {
  id?: string;
  patientRef: string;
  clinicRef?: string;
  doctorRef?: string;
  createdBy: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  exercise: boolean;
  work: string;
  sleepQuality: string;
  pillows: string;
  tobaccoUse: boolean;
  alcoholUse: boolean;
  drugUse: boolean;
}

export interface WomenFormData {
  id?: string;
  patientRef: string;
  doctorRef?: string;
  clinicRef?: string;
  createdBy: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  pregnant?: string;
  cycleInfo?: string;
  pmsSymptom?: string;
  hormonalSymptom?: string;
  posturalSymptom?: string;
  birthControl?: string;
  pregnancyHistory?: string;
}

export interface ConstantLegalFormData {
  id?: string;
  patientRef: string;
  doctorRef: string;
  clinicRef: string;
  digitalSignature: string;
  idFront?: string;
  idBack?: string;
  scans?: string;
  medicalRecord?: string;
  otherDocument?: string;
  acknowledgement: Array<{
    label: string;
    checked: boolean;
  }>;
  createdBy: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ==================== OnBoarding Form Service ====================

export const onBoardingFormService = {
  async updatePersonalInfo(data: OnBoardingFormData): Promise<ApiResponse> {
    try {
      const response = await api.patch('/patient/onboarding/personal-info', data);
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
};

// ==================== Insurance Form Service ====================

export const insuranceFormService = {
  async update(id: string, data: Partial<InsuranceFormData>): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/patient/onboarding/insurance`, data);
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
};

// ==================== Present Condition Form Service ====================
export const presentConditionFormService = {
  async update(id: string, data: Partial<PresentConditionFormData>): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/patient/onboarding/present-condition`, data);
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
};

// ==================== History Health Form Service ====================

export const historyHealthFormService = {
  async update(id: string, data: Partial<HistoryHealthFormData>): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/patient/onboarding/history-health`, data);
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
};

// ==================== LifeStyle Form Service ====================

export const lifeStyleFormService = {
  async update(id: string, data: Partial<LifeStyleFormData>): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/patient/onboarding/lifestyle`, data);
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
};

// ==================== Women's Health Form Service ====================

export const womenFormService = {
  async update(id: string, data: Partial<WomenFormData>): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/patient/onboarding/women-form`, data);
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
};

// ==================== Constant Legal Form Service ====================

export const constantLegalFormService = {
  async update(id: string, data: Partial<ConstantLegalFormData>): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/patient/onboarding/constant-legal`, data);
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
};

// ==================== Additional Forms ====================

export const dentalHistoryFormService = {
  async update(id: string, data: any): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/patient/onboarding/dental-history`, data);
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
  async update(id: string, data: any): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/patient/onboarding/medical-profile`, data);
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

  async getFormsByPatientId(patientId: string): Promise<ApiResponse> {
    try {
      // Use the patients/forms/:patientId endpoint
      const response = await api.get(`/patients/forms/${patientId}`);
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

 
  async getAllOnboardingForms(patientId: string): Promise<ApiResponse<{
    onBoarding: any;
    presentCondition: any;
    insurance: any;
    history: any[];
    lifeStyle: any;
    womenForm: any;
    constantLegal: any;
    dentalHistory: any;
    medicalProfile: any;
    onBoardingUploads: any;
  }>> {
    try {
      const response = await api.get(`/patient/onboarding/all-forms/${patientId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all onboarding forms:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch onboarding forms',
        error: error.response?.data?.error || error.message,
      };
    }
  },

   async getAllOnboardingFormsForAppointment(patientId: string): Promise<ApiResponse<{
    onBoarding: any;
    presentCondition: any;
    insurance: any;
    history: any[];
    lifeStyle: any;
    womenForm: any;
    constantLegal: any;
    dentalHistory: any;
    medicalProfile: any;
    onBoardingUploads: any;
  }>> {
    try {
      const response = await api.get(`/doctor/patient/onboarding/all-forms/${patientId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all onboarding forms:', error);
      throw {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch onboarding forms',
        error: error.response?.data?.error || error.message,
      };
    }
  },
};

export default patientOnboardingService;