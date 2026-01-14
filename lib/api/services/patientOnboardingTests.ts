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
  console.log('🧪 Testing OnBoarding Form...');
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/patients/forms/onBoardingForm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('clinic-ai-token')}`,
      },
      body: JSON.stringify(testData.onBoarding),
    });
    const result = await response.json();
    console.log('✅ OnBoarding Form:', result);
    return result;
  } catch (error) {
    console.error('❌ OnBoarding Form Error:', error);
    return null;
  }
}

async function testInsuranceForm() {
  console.log('🧪 Testing Insurance Form...');
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/patients/forms/insuranceForm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('clinic-ai-token')}`,
      },
      body: JSON.stringify(testData.insurance),
    });
    const result = await response.json();
    console.log('✅ Insurance Form:', result);
    return result;
  } catch (error) {
    console.error('❌ Insurance Form Error:', error);
    return null;
  }
}

async function testPresentConditionForm() {
  console.log('🧪 Testing Present Condition Form...');
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/patients/forms/presentConditionForm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('clinic-ai-token')}`,
      },
      body: JSON.stringify(testData.presentCondition),
    });
    const result = await response.json();
    console.log('✅ Present Condition Form:', result);
    return result;
  } catch (error) {
    console.error('❌ Present Condition Form Error:', error);
    return null;
  }
}

async function testHealthHistoryForm() {
  console.log('🧪 Testing Health History Form...');
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/patients/forms/historyHealthForm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('clinic-ai-token')}`,
      },
      body: JSON.stringify(testData.healthHistory),
    });
    const result = await response.json();
    console.log('✅ Health History Form:', result);
    return result;
  } catch (error) {
    console.error('❌ Health History Form Error:', error);
    return null;
  }
}

async function testLifestyleForm() {
  console.log('🧪 Testing Lifestyle Form...');
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/patients/forms/lifeStyleForm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('clinic-ai-token')}`,
      },
      body: JSON.stringify(testData.lifestyle),
    });
    const result = await response.json();
    console.log('✅ Lifestyle Form:', result);
    return result;
  } catch (error) {
    console.error('❌ Lifestyle Form Error:', error);
    return null;
  }
}

async function testWomenForm() {
  console.log('🧪 Testing Women Form...');
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/patients/forms/womenForm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('clinic-ai-token')}`,
      },
      body: JSON.stringify(testData.women),
    });
    const result = await response.json();
    console.log('✅ Women Form:', result);
    return result;
  } catch (error) {
    console.error('❌ Women Form Error:', error);
    return null;
  }
}

async function testLegalForm() {
  console.log('🧪 Testing Legal Form...');
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/patients/forms/constantLegalForm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('clinic-ai-token')}`,
      },
      body: JSON.stringify(testData.legal),
    });
    const result = await response.json();
    console.log('✅ Legal Form:', result);
    return result;
  } catch (error) {
    console.error('❌ Legal Form Error:', error);
    return null;
  }
}

async function testGetMyForms() {
  console.log('🧪 Testing Get My Forms...');
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/patients/forms/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('clinic-ai-token')}`,
      },
    });
    const result = await response.json();
    console.log('✅ My Forms:', result);
    return result;
  } catch (error) {
    console.error('❌ Get My Forms Error:', error);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Patient Onboarding API Tests...');
  console.log('Patient ID:', getPatientId());
  console.log('Base URL:', TEST_CONFIG.baseUrl);
  console.log('---');

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

  console.log('---');
  console.log('📊 Test Summary:');
  Object.entries(results).forEach(([name, result]) => {
    const status = result?.success ? '✅' : '❌';
    console.log(`${status} ${name}: ${result?.success ? 'PASSED' : 'FAILED'}`);
  });

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
  
  console.log('✅ Patient Onboarding Tests loaded!');
  console.log('Run tests with: window.patientOnboardingTests.runAllTests()');
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
