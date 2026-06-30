/**
 * Field Mapping Utilities
 * Converts frontend form data to backend-compatible format
 * Handles field name changes, type conversions, and structure transformations
 */

import { fileToBase64 } from '@/lib/utils/fileUtils';

// ==================== OnBoarding Form Mapping ====================

export interface FrontendOnBoardingData {
  fullName: string;
  preferredName: string;
  dateOfBirth: string;
  gender: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  emailAddress: string; // ⚠️ Frontend name
  phoneNumber: string;
  preferredContactMethod: string;
  emergencyContactName: string;
  emergencyContactPhone: string; // ⚠️ Frontend name
  relationshipToPatient: string;
  occupation: string;
  primaryLanguage: string;
  referredBy?: string; // ⚠️ Frontend spelling
}

export function mapOnBoardingToBackend(data: any, patientId: string) {
  return {
    refPatientObjectId: patientId,
    fullName: data.fullName,
    preferredName: data.preferredName,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    streetAddress: data.streetAddress,
    city: data.city,
    state: data.state,
    zipCode: data.zipCode,
    email: data.emailAddress, // ⚠️ Changed from emailAddress
    phoneNumber: data.phoneNumber,
    preferredContactMethod: data.preferredContactMethod,
    emergencyContactName: data.emergencyContactName,
    emergencyPhoneNumber: data.emergencyContactPhone, // ⚠️ Changed from emergencyContactPhone
    relationshipToPatient: data.relationshipToPatient,
    occupation: data.occupation,
    primaryLanguage: data.primaryLanguage,
    refferedBy: data.referredBy, // ⚠️ Changed spelling (backend typo)
  };
}

// ==================== Insurance Form Mapping ====================

export interface FrontendInsuranceData {
  hasInsurance: 'yes' | 'no'; // ⚠️ Frontend type
  insuranceCompanyName?: string; // ⚠️ Frontend name
  policyholderName?: string; // ⚠️ Frontend name
  memberSubscriberID?: string; // ⚠️ Frontend name
  groupNumber?: string;
}

export async function mapInsuranceToBackend(data: any, patientId: string) {
  // Convert files to base64 if they exist
  let cardFrontBase64 = 'N/A';
  let cardBackBase64 = 'N/A';

  if (data.insuranceCardFront && data.insuranceCardFront instanceof File) {
    try {
      cardFrontBase64 = await fileToBase64(data.insuranceCardFront);
    } catch (error) {
      console.error('❌ Error converting card front:', error);
      cardFrontBase64 = 'Upload failed';
    }
  } else if (data.hasInsurance === 'yes') {
    cardFrontBase64 = 'Pending upload';
  }

  if (data.insuranceCardBack && data.insuranceCardBack instanceof File) {
    try {
      cardBackBase64 = await fileToBase64(data.insuranceCardBack);
    } catch (error) {
      console.error('❌ Error converting card back:', error);
      cardBackBase64 = 'Upload failed';
    }
  } else if (data.hasInsurance === 'yes') {
    cardBackBase64 = 'Pending upload';
  }

  // If no insurance, return minimal data
  if (data.hasInsurance === 'no') {
    return {
      refPatientObjectId: patientId,
      haveInsurance: false,
      insuranceCompany: 'N/A',
      policyHolderName: 'N/A',
      relationshipToPatient: 'N/A',
      memberId: 'N/A',
      groupNumber: 'N/A',
      cardFront: 'N/A',
      cardBack: 'N/A',
    };
  }

  // If yes insurance, map all fields
  return {
    refPatientObjectId: patientId,
    haveInsurance: true, // ⚠️ Changed from hasInsurance (string → boolean)
    insuranceCompany: data.insuranceCompanyName || 'Not provided', // ⚠️ Changed from insuranceCompanyName
    policyHolderName: data.policyholderName || 'Not provided', // ⚠️ Changed from policyholderName (capital H)
    relationshipToPatient: data.relationshipToPatient || 'self', // ⚠️ Required field - defaulting to 'self'
    memberId: data.memberSubscriberID || 'Not provided', // ⚠️ Changed from memberSubscriberID
    groupNumber: data.groupNumber || 'Not provided',
    cardFront: cardFrontBase64, // ⚠️ Base64 encoded file or placeholder
    cardBack: cardBackBase64, // ⚠️ Base64 encoded file or placeholder
  };
}

// ==================== Present Condition Form Mapping ====================

export interface FrontendPresentConditionData {
  mainConcern: string; // ⚠️ Frontend name
  symptomStartDate: string; // ⚠️ Frontend name
  hadThisBefore?: string; // ⚠️ Frontend type (string)
  painLevel?: number; // ⚠️ Frontend type (number)
  painCharacteristics?: string[]; // ⚠️ Frontend spelling
  whatImprovesIt?: string; // ⚠️ Frontend name
  whatWorsensIt?: string; // ⚠️ Frontend name
  activitiesAffected?: string; // ⚠️ Frontend name
  seenAnyoneElse?: string; // ⚠️ Frontend name
  treatmentsTried?: string; // ⚠️ Frontend name
}

export function mapPresentConditionToBackend(data: any, patientId: string) {
  return {
    refPatientObjectId: patientId,
    reason: data.mainConcern || 'Not specified', // ⚠️ Changed from mainConcern - required
    symptomsDate: data.symptomStartDate || new Date().toISOString().split('T')[0], // ⚠️ Changed from symptomStartDate - required
    hadSymptomBefore: data.hadThisBefore === 'yes', // ⚠️ Changed from hadThisBefore (string → boolean) - required
    painAssesment: data.painLevel?.toString() || '0', // ⚠️ Changed from painLevel (number → string) - required
    painCharacterstics: data.painCharacteristics || ['Not specified'], // ⚠️ Backend typo: painCharacterstics - required
    symptomsDetails: { // ⚠️ Changed from flat structure to nested - all required
      improve: data.whatImprovesIt || 'Not specified',
      worsen: data.whatWorsensIt || 'Not specified',
      activities: data.activitiesAffected || 'Not specified',
      seen: data.seenAnyoneElse || 'Not specified',
      describe: data.treatmentsTried || 'Not specified',
    },
  };
}

// ==================== History Health Form Mapping ====================

export interface FrontendHistoryHealthData {
  healthConditions?: string[]; // ⚠️ Frontend name (plural)
  otherConditions?: string; // ⚠️ Frontend name
  currentMedications?: string; // ⚠️ Frontend name (plural)
  bloodThinners?: string; // ⚠️ Frontend type (string)
  surgicalHistory?: string; // ⚠️ Frontend name
  allergies?: string;
}

export function mapHistoryHealthToBackend(data: any, patientId: string) {
  return {
    refPatientObjectId: patientId,
    healthCondition: data.healthConditions || ['None reported'], // ⚠️ Changed from healthConditions (plural → singular) - required
    notListed: data.otherConditions || 'None', // ⚠️ Changed from otherConditions - required
    currentMedication: data.currentMedications || 'None', // ⚠️ Changed from currentMedications (plural → singular) - required
    bloodThinner: data.bloodThinners === 'yes', // ⚠️ Changed from bloodThinners (string → boolean) - required
    pastSurgeryAndDate: data.surgicalHistory || 'None', // ⚠️ Changed from surgicalHistory - required
    allergies: data.allergies || 'None known', // Required
  };
}

// ==================== Lifestyle Form Mapping ====================

export interface FrontendLifestyleData {
  exerciseRegularly?: string; // ⚠️ Frontend type (string)
  workType?: string; // ⚠️ Frontend name
  sleepQuality?: string;
  sleepSupports?: string; // ⚠️ Frontend name
  tobaccoUse?: string; // ⚠️ Frontend type (string)
  alcoholUse?: string; // ⚠️ Frontend type (string)
  recreationalDrugUse?: string; // ⚠️ Frontend name & type
}

export function mapLifestyleToBackend(data: any, patientId: string) {
  return {
    refPatientObjectId: patientId,
    exercise: data.exerciseRegularly === 'yes', // ⚠️ Changed from exerciseRegularly (string → boolean) - required
    work: data.workType || 'Not specified', // ⚠️ Changed from workType - required
    sleepQuality: data.sleepQuality || 'Not specified', // Required
    pillows: data.sleepSupports || 'Not specified', // ⚠️ Changed from sleepSupports - required
    tobaccoUse: data.tobaccoUse === 'yes', // ⚠️ Changed from string → boolean - required
    alcoholUse: data.alcoholUse === 'yes', // ⚠️ Changed from string → boolean - required
    drugUse: data.recreationalDrugUse === 'yes', // ⚠️ Changed from recreationalDrugUse (string → boolean) - required
  };
}

// ==================== Women Form Mapping ====================

export interface FrontendWomenData {
  currentlyPregnant?: string; // ⚠️ Frontend name
  menstrualCycleInfo?: string; // ⚠️ Frontend name
  pmsSymptoms?: string; // ⚠️ Frontend name (plural)
  hormonalSymptoms?: string; // ⚠️ Frontend name (plural)
  posturalSymptoms?: string; // ⚠️ Frontend name (plural)
  birthControl?: string;
  pregnancyHistory?: string;
}

export function mapWomenToBackend(data: any, patientId: string) {
  return {
    refPatientObjectId: patientId,
    pregnant: (data.currentlyPregnant || 'notsure') as "yes" | "no" | "notsure", // ⚠️ Changed from currentlyPregnant
    cycleInfo: data.menstrualCycleInfo || 'Not specified', // ⚠️ Changed from menstrualCycleInfo
    pmsSymptom: data.pmsSymptoms || 'None', // ⚠️ Changed from pmsSymptoms (plural → singular)
    hormonalSymptom: data.hormonalSymptoms || 'None', // ⚠️ Changed from hormonalSymptoms (plural → singular)
    posturalSymptom: data.posturalSymptoms || 'None', // ⚠️ Changed from posturalSymptoms (plural → singular)
    birthControl: data.birthControl || 'Not specified',
    pregnancyHistory: data.pregnancyHistory || 'Not specified',
  };
}

// ==================== Constant Legal Form Mapping ====================

export interface FrontendLegalData {
  informationComplete: boolean;
  consentToTreatment: boolean;
  physicalExamination: boolean;
  privacyPolicies: boolean;
  digitalSignature: string;
}

export async function mapLegalToBackend(data: any, patientId: string) {
  // Convert all document files to base64
  let idFrontBase64 = 'N/A';
  let idBackBase64 = 'N/A';
  let scansBase64 = 'N/A';
  let medicalRecordBase64 = 'N/A';
  let otherDocumentBase64 = 'N/A';

  // Convert ID front
  if (data.idFront && data.idFront instanceof File) {
    try {
      idFrontBase64 = await fileToBase64(data.idFront);
    } catch (error) {
      console.error('❌ Error converting ID front:', error);
      idFrontBase64 = 'Upload failed';
    }
  } else {
    idFrontBase64 = 'Pending upload';
  }

  // Convert ID back
  if (data.idBack && data.idBack instanceof File) {
    try {
      idBackBase64 = await fileToBase64(data.idBack);
    } catch (error) {
      console.error('❌ Error converting ID back:', error);
      idBackBase64 = 'Upload failed';
    }
  } else {
    idBackBase64 = 'Pending upload';
  }

  // Convert scans
  if (data.scans && data.scans instanceof File) {
    try {
      scansBase64 = await fileToBase64(data.scans);
    } catch (error) {
      console.error('❌ Error converting scans:', error);
      scansBase64 = 'Upload failed';
    }
  } else {
    scansBase64 = 'Pending upload';
  }

  // Convert medical record
  if (data.medicalRecord && data.medicalRecord instanceof File) {
    try {
      medicalRecordBase64 = await fileToBase64(data.medicalRecord);
    } catch (error) {
      console.error('❌ Error converting medical record:', error);
      medicalRecordBase64 = 'Upload failed';
    }
  } else {
    medicalRecordBase64 = 'Pending upload';
  }

  // Convert other document
  if (data.otherDoc && data.otherDoc instanceof File) {
    try {
      otherDocumentBase64 = await fileToBase64(data.otherDoc);
    } catch (error) {
      console.error('❌ Error converting other document:', error);
      otherDocumentBase64 = 'Upload failed';
    }
  } else {
    otherDocumentBase64 = 'Pending upload';
  }

  return {
    refPatientObjectId: patientId,
    digitalSignature: data.digitalSignature || 'Pending',
    idFront: idFrontBase64, // ⚠️ Base64 encoded file or placeholder
    idBack: idBackBase64, // ⚠️ Base64 encoded file or placeholder
    scans: scansBase64, // ⚠️ Base64 encoded file or placeholder
    medicalRecord: medicalRecordBase64, // ⚠️ Base64 encoded file or placeholder
    otherDocument: otherDocumentBase64, // ⚠️ Base64 encoded file or placeholder
    acknowledgement: [ // ⚠️ Changed from individual boolean fields to array
      {
        label: 'I confirm that all information provided is complete and accurate',
        checked: data.informationComplete,
      },
      {
        label: 'I consent to treatment',
        checked: data.consentToTreatment,
      },
      {
        label: 'I consent to physical examination',
        checked: data.physicalExamination,
      },
      {
        label: 'I agree to the privacy policies',
        checked: data.privacyPolicies,
      },
    ],
  };
}

// ==================== Export All Mappers ====================

// ==================== Export All Mappers ====================

export const fieldMappers = {
  onBoarding: mapOnBoardingToBackend,
  insurance: mapInsuranceToBackend,
  presentCondition: mapPresentConditionToBackend,
  historyHealth: mapHistoryHealthToBackend,
  lifestyle: mapLifestyleToBackend,
  women: mapWomenToBackend,
  legal: mapLegalToBackend,
};

// ==================== REVERSE Mappers (Backend → Frontend) ====================
// These functions convert backend data back to frontend format for loading saved forms

export function mapOnBoardingFromBackend(backendData: any) {
  return {
    fullName: backendData.fullName || '',
    preferredName: backendData.preferredName || '',
    dateOfBirth: backendData.dateOfBirth || '',
    gender: backendData.gender || '',
    streetAddress: backendData.streetAddress || '',
    city: backendData.city || '',
    state: backendData.state || '',
    zipCode: backendData.zipCode || '',
    emailAddress: backendData.email || '', // ⚠️ Backend: email → Frontend: emailAddress
    phoneNumber: backendData.phoneNumber || '',
    preferredContactMethod: backendData.preferredContactMethod || '',
    emergencyContactName: backendData.emergencyContactName || '',
    emergencyContactPhone: backendData.emergencyPhoneNumber || '', // ⚠️ Backend: emergencyPhoneNumber → Frontend: emergencyContactPhone
    relationshipToPatient: backendData.relationshipToPatient || '',
    occupation: backendData.occupation || '',
    primaryLanguage: backendData.primaryLanguage || '',
    referredBy: backendData.refferedBy || '', // ⚠️ Backend typo: refferedBy
  };
}

export function mapInsuranceFromBackend(backendData: any) {

  return {
    hasInsurance: backendData.haveInsurance ? 'yes' : 'no', // ⚠️ Backend: haveInsurance (boolean) → Frontend: hasInsurance (string)
    insuranceCompanyName: backendData.insuranceCompany || '', // ⚠️ Backend: insuranceCompany
    policyholderName: backendData.policyHolderName || '', // ⚠️ Backend: policyHolderName (capital H)
    memberSubscriberID: backendData.memberId || '', // ⚠️ Backend: memberId
    groupNumber: backendData.groupNumber || '',
    // File data stored as base64 strings
    insuranceCardFrontBase64: backendData.cardFront && backendData.cardFront !== 'N/A' && backendData.cardFront !== 'Pending upload' ? backendData.cardFront : null,
    insuranceCardBackBase64: backendData.cardBack && backendData.cardBack !== 'N/A' && backendData.cardBack !== 'Pending upload' ? backendData.cardBack : null,
  };
}

export function mapPresentConditionFromBackend(backendData: any) {
  return {
    mainConcern: backendData.reason || '', // ⚠️ Backend: reason
    symptomStartDate: backendData.symptomsDate || '', // ⚠️ Backend: symptomsDate
    hadThisBefore: backendData.hadSymptomBefore ? 'yes' : 'no', // ⚠️ Backend: hadSymptomBefore (boolean)
    painLevel: parseInt(backendData.painAssesment) || 0, // ⚠️ Backend: painAssesment (string) → Frontend: painLevel (number)
    painCharacteristics: backendData.painCharacterstics || [], // ⚠️ Backend typo: painCharacterstics
    whatImprovesIt: backendData.symptomsDetails?.improve || '', // ⚠️ Backend: nested in symptomsDetails
    whatWorsensIt: backendData.symptomsDetails?.worsen || '',
    activitiesAffected: backendData.symptomsDetails?.activities || '',
    seenAnyoneElse: backendData.symptomsDetails?.seen || '',
    treatmentsTried: backendData.symptomsDetails?.describe || '',
  };
}

export function mapHistoryHealthFromBackend(backendData: any) {
  return {
    healthConditions: backendData.healthCondition || [], // ⚠️ Backend: healthCondition (singular)
    otherConditions: backendData.notListed || '', // ⚠️ Backend: notListed
    currentMedications: backendData.currentMedication || '', // ⚠️ Backend: currentMedication (singular)
    bloodThinners: backendData.bloodThinner ? 'yes' : 'no', // ⚠️ Backend: bloodThinner (boolean)
    surgicalHistory: backendData.pastSurgeryAndDate || '', // ⚠️ Backend: pastSurgeryAndDate
    allergies: backendData.allergies || '',
  };
}

export function mapLifestyleFromBackend(backendData: any) {
  return {
    exerciseRegularly: backendData.exercise ? 'yes' : 'no', // ⚠️ Backend: exercise (boolean)
    workType: backendData.work || '', // ⚠️ Backend: work
    sleepQuality: backendData.sleepQuality || '',
    sleepSupports: backendData.pillows || '', // ⚠️ Backend: pillows
    tobaccoUse: backendData.tobaccoUse ? 'yes' : 'no', // ⚠️ Backend: boolean
    alcoholUse: backendData.alcoholUse ? 'yes' : 'no', // ⚠️ Backend: boolean
    recreationalDrugUse: backendData.drugUse ? 'yes' : 'no', // ⚠️ Backend: drugUse (boolean)
  };
}

export function mapWomenFromBackend(backendData: any) {
  return {
    currentlyPregnant: backendData.pregnant || '', // ⚠️ Backend: pregnant
    menstrualCycleInfo: backendData.cycleInfo || '', // ⚠️ Backend: cycleInfo
    pmsSymptoms: backendData.pmsSymptom || '', // ⚠️ Backend: pmsSymptom (singular)
    hormonalSymptoms: backendData.hormonalSymptom || '', // ⚠️ Backend: hormonalSymptom (singular)
    posturalSymptoms: backendData.posturalSymptom || '', // ⚠️ Backend: posturalSymptom (singular)
    birthControl: backendData.birthControl || '',
    pregnancyHistory: backendData.pregnancyHistory || '',
  };
}

export function mapLegalFromBackend(backendData: any) {

  // Convert acknowledgement array back to individual boolean fields
  const acknowledgement = backendData.acknowledgement || [];
  return {
    informationComplete: acknowledgement[0]?.checked || false,
    consentToTreatment: acknowledgement[1]?.checked || false,
    physicalExamination: acknowledgement[2]?.checked || false,
    privacyPolicies: acknowledgement[3]?.checked || false,
    digitalSignature: backendData.digitalSignature || '',
    // File data stored as base64 strings
    idFrontBase64: backendData.idFront && backendData.idFront !== 'N/A' && backendData.idFront !== 'Pending upload' ? backendData.idFront : null,
    idBackBase64: backendData.idBack && backendData.idBack !== 'N/A' && backendData.idBack !== 'Pending upload' ? backendData.idBack : null,
    scansBase64: backendData.scans && backendData.scans !== 'N/A' && backendData.scans !== 'Pending upload' ? backendData.scans : null,
    medicalRecordBase64: backendData.medicalRecord && backendData.medicalRecord !== 'N/A' && backendData.medicalRecord !== 'Pending upload' ? backendData.medicalRecord : null,
    otherDocBase64: backendData.otherDocument && backendData.otherDocument !== 'N/A' && backendData.otherDocument !== 'Pending upload' ? backendData.otherDocument : null,
  };
}

export const reverseFieldMappers = {
  onBoarding: mapOnBoardingFromBackend,
  insurance: mapInsuranceFromBackend,
  presentCondition: mapPresentConditionFromBackend,
  historyHealth: mapHistoryHealthFromBackend,
  lifestyle: mapLifestyleFromBackend,
  women: mapWomenFromBackend,
  legal: mapLegalFromBackend,
};

export default fieldMappers;
