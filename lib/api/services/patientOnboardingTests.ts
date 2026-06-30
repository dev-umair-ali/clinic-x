/**
 * Patient Onboarding API Test Script
 * 
 * Run this in the browser console while on the onboarding page
 * to test the API integration
 */

// Test configuration
const TEST_CONFIG = {
  patientId: 'YOUR_PATIENT_ID_HERE', // Replace with actual patient ID
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000',
};

// Get patient ID from localStorage
function getPatientId() {
  try {
    const userStr = localStorage.getItem('clinic-ai-user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user._id || user.id;
    }
  } catch (error) {
    console.error('Error getting patient ID:', error);
  }
  return TEST_CONFIG.patientId;
}

// Test data for each form
const testData = {
  onBoarding: {
    refPatientObjectId: getPatientId(),
    fullName: 'Test Patient',
    preferredName: 'Test',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    streetAddress: '123 Test St',
    city: 'Test City',
    state: 'CA',
    zipCode: '12345',
    emailAddress: 'test@example.com',
    phoneNumber: '555-1234',
    emergencyContactName: 'Emergency Contact',
    emergencyContactPhone: '555-5678',
    relationshipToPatient: 'Spouse',
  },
  insurance: {
    refPatientObjectId: getPatientId(),
    hasInsurance: 'yes',
    insuranceCompanyName: 'Test Insurance Co',
    policyholderName: 'Test Patient',
    memberSubscriberID: 'TEST123456',
    groupNumber: 'GRP001',
  },
  presentCondition: {
    refPatientObjectId: getPatientId(),
    mainConcern: 'Test concern',
    symptomStartDate: '2026-01-01',
    painLevel: 5,
    painCharacteristics: ['Sharp', 'Constant'],
  },
  healthHistory: {
    refPatientObjectId: getPatientId(),
    healthConditions: ['None'],
    currentMedications: 'None',
    allergies: 'None',
  },
  lifestyle: {
    refPatientObjectId: getPatientId(),
    exerciseRegularly: 'yes',
    tobaccoUse: 'no',
    alcoholUse: 'occasionally',
  },
  women: {
    refPatientObjectId: getPatientId(),
    pregnant: 'no',
    cycleInfo: 'regular',
  },
  legal: {
    refPatientObjectId: getPatientId(),
    informationComplete: true,
    consentToTreatment: true,
    physicalExamination: true,
    privacyPolicies: true,
    digitalSignature: 'Test Signature',
  },
};

// Test functions
async function testOnboardingForm() {
    const result = await response.json();
    return null;
  }
}

async function testInsuranceForm() {
    const result = await response.json();
    return null;
  }
}

async function testPresentConditionForm() {
    const result = await response.json();
    return null;
  }
}

async function testHealthHistoryForm() {
    const result = await response.json();
    return null;
  }
}

async function testLifestyleForm() {
    const result = await response.json();
    return null;
  }
}

async function testWomenForm() {
    const result = await response.json();
    return null;
  }
}

async function testLegalForm() {
    const result = await response.json();
    return null;
  }
}

async function testGetMyForms() {
    const result = await response.json();
    return null;
  }
}

// Run all tests
async function runAllTests() {

  const results = {
    onBoarding: await testOnboardingForm(),
    insurance: await testInsuranceForm(),
    presentCondition: await testPresentConditionForm(),
    healthHistory: await testHealthHistoryForm(),
    lifestyle: await testLifestyleForm(),
    women: await testWomenForm(),
    legal: await testLegalForm(),
    myForms: await testGetMyForms(),
  };

  Object.entries(results).forEach(([name, result]) => {
    const status = result?.success ? '✅' : '❌';

  return results;
}

// Export for use
if (typeof window !== 'undefined') {
  (window as any).patientOnboardingTests = {
    runAllTests,
    testOnboardingForm,
    testInsuranceForm,
    testPresentConditionForm,
    testHealthHistoryForm,
    testLifestyleForm,
    testWomenForm,
    testLegalForm,
    testGetMyForms,
    testData,
  };
  
}

export default {
  runAllTests,
  testOnboardingForm,
  testInsuranceForm,
  testPresentConditionForm,
  testHealthHistoryForm,
  testLifestyleForm,
  testWomenForm,
  testLegalForm,
  testGetMyForms,
  testData,
};
