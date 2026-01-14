// Utility functions for billing operations

// Print functionality
export const handlePrint = (elementId?: string) => {
  if (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .header { text-align: center; margin-bottom: 30px; }
                .logo { font-size: 24px; font-weight: bold; color: #1DA68F; }
                @media print {
                  button { display: none; }
                }
              </style>
            </head>
            <body>
              ${element.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  } else {
    window.print();
  }
};

// Export to CSV
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values with commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvContent += values.join(',') + '\n';
  });

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export to PDF (using browser print)
export const exportToPDF = (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Content not found for export');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
              color: #000;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
            }
            th { 
              background-color: #f2f2f2; 
              font-weight: bold;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
            }
            .logo { 
              font-size: 24px; 
              font-weight: bold; 
              color: #1DA68F; 
              margin-bottom: 10px;
            }
            .date { 
              font-size: 12px; 
              color: #666; 
            }
            @media print {
              button, .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">ClinicX Medical Center</div>
            <div class="date">Generated: ${new Date().toLocaleString()}</div>
          </div>
          ${element.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};

// Common CPT Modifiers
export const cptModifiers = [
  { code: '25', description: 'Significant, separately identifiable E/M service' },
  { code: '59', description: 'Distinct procedural service' },
  { code: '76', description: 'Repeat procedure by same physician' },
  { code: '77', description: 'Repeat procedure by another physician' },
  { code: '78', description: 'Return to OR for related procedure' },
  { code: '79', description: 'Unrelated procedure by same physician' },
  { code: '91', description: 'Repeat clinical diagnostic lab test' },
  { code: 'GT', description: 'Via interactive telecommunications' },
  { code: 'GQ', description: 'Via asynchronous telecommunications' },
  { code: 'TC', description: 'Technical component only' },
  { code: '26', description: 'Professional component only' },
  { code: '50', description: 'Bilateral procedure' },
  { code: 'RT', description: 'Right side' },
  { code: 'LT', description: 'Left side' },
  { code: 'E1', description: 'Upper left eyelid' },
  { code: 'E2', description: 'Lower left eyelid' },
  { code: 'E3', description: 'Upper right eyelid' },
  { code: 'E4', description: 'Lower right eyelid' },
  { code: 'F1', description: 'Left hand, second digit' },
  { code: 'F2', description: 'Left hand, third digit' },
  { code: 'F3', description: 'Left hand, fourth digit' },
  { code: 'F4', description: 'Left hand, fifth digit' },
  { code: 'F5', description: 'Right hand, thumb' },
  { code: 'F6', description: 'Right hand, second digit' },
  { code: 'F7', description: 'Right hand, third digit' },
  { code: 'F8', description: 'Right hand, fourth digit' },
  { code: 'F9', description: 'Right hand, fifth digit' },
];

// Place of Service Codes
export const placeOfServiceCodes = [
  { code: '11', description: 'Office' },
  { code: '12', description: 'Home' },
  { code: '21', description: 'Inpatient Hospital' },
  { code: '22', description: 'Outpatient Hospital' },
  { code: '23', description: 'Emergency Room - Hospital' },
  { code: '24', description: 'Ambulatory Surgical Center' },
  { code: '31', description: 'Skilled Nursing Facility' },
  { code: '32', description: 'Nursing Facility' },
  { code: '49', description: 'Independent Clinic' },
  { code: '50', description: 'Federally Qualified Health Center' },
  { code: '51', description: 'Inpatient Psychiatric Facility' },
  { code: '52', description: 'Psychiatric Facility Partial Hospitalization' },
  { code: '53', description: 'Community Mental Health Center' },
  { code: '54', description: 'Intermediate Care Facility/Mentally Retarded' },
  { code: '55', description: 'Residential Substance Abuse Treatment Facility' },
  { code: '56', description: 'Psychiatric Residential Treatment Center' },
  { code: '57', description: 'Non-residential Substance Abuse Treatment Facility' },
  { code: '60', description: 'Mass Immunization Center' },
  { code: '61', description: 'Comprehensive Inpatient Rehabilitation Facility' },
  { code: '62', description: 'Comprehensive Outpatient Rehabilitation Facility' },
  { code: '65', description: 'End-Stage Renal Disease Treatment Facility' },
  { code: '71', description: 'State or Local Public Health Clinic' },
  { code: '72', description: 'Rural Health Clinic' },
  { code: '81', description: 'Independent Laboratory' },
  { code: '99', description: 'Other Unlisted Facility' },
  { code: '02', description: 'Telehealth - Patient Home' },
  { code: '10', description: 'Telehealth - Patient Location' },
];

// Validate ICD-10 code format
export const validateICD10 = (code: string): boolean => {
  // ICD-10 format: Letter followed by 2 digits, then optional decimal and up to 4 more characters
  const icd10Pattern = /^[A-Z]\d{2}(\.\d{1,4})?$/;
  return icd10Pattern.test(code);
};

// Validate CPT code format
export const validateCPT = (code: string): boolean => {
  // CPT format: 5 digits or 4 digits followed by a letter (for Category II and III)
  const cptPattern = /^\d{5}$|^\d{4}[A-Z]$/;
  return cptPattern.test(code);
};

// Validate NPI number
export const validateNPI = (npi: string): boolean => {
  // NPI is exactly 10 digits
  const npiPattern = /^\d{10}$/;
  return npiPattern.test(npi);
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format date
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Calculate age from DOB
export const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Generate invoice number
export const generateInvoiceNumber = (): string => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}-${month}-${random}`;
};

// Generate claim number
export const generateClaimNumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `CLM-${year}-${random}`;
};

// Timeout code status
export const getTimingStatus = (submissionDate: string): {
  status: 'current' | 'warning' | 'expired';
  daysRemaining: number;
} => {
  const submitted = new Date(submissionDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - submitted.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Most insurers have 90-day timely filing
  const timelyFilingLimit = 90;
  const daysRemaining = timelyFilingLimit - diffDays;
  
  if (daysRemaining > 30) {
    return { status: 'current', daysRemaining };
  } else if (daysRemaining > 0) {
    return { status: 'warning', daysRemaining };
  } else {
    return { status: 'expired', daysRemaining };
  }
};

// Common insurance providers
export const insuranceProviders = [
  'Medicare',
  'Medicaid',
  'Blue Cross Blue Shield',
  'Aetna',
  'UnitedHealthcare',
  'Cigna',
  'Humana',
  'Anthem',
  'Kaiser Permanente',
  'Centene',
  'Health Net',
  'WellCare',
  'Molina Healthcare',
  'Tricare',
  'Veterans Affairs',
  'Self-Pay',
  'Other',
];
