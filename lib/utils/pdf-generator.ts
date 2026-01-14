/**
 * Professional PDF Generator for ClinicX Billing System
 * Generates beautifully formatted, branded PDFs for invoices, claims, and reports
 * Following industry standards from Epic, Cerner, and Athenahealth
 */

interface PDFInvoiceData {
  invoiceNumber: string;
  dateOfService: string;
  dateCreated: string;
  dateDue?: string;
  status: string;
  patient: {
    name: string;
    id: string;
    dob: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
    subscriberName?: string;
  };
  provider: {
    name: string;
    npi: string;
    specialty?: string;
    facility: string;
    phone?: string;
    address?: string;
  };
  charges: Array<{
    cptCode: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    modifier?: string;
    diagnosisPointers?: string[];
  }>;
  diagnosisCodes?: Array<{
    code: string;
    description: string;
    pointer: number;
  }>;
  payments?: Array<{
    date: string;
    method: string;
    payer: string;
    amount: number;
    referenceNumber?: string;
  }>;
  adjustments?: Array<{
    date: string;
    type: string;
    reason: string;
    amount: number;
  }>;
  subtotal: number;
  totalAdjustments: number;
  totalPayments: number;
  balance: number;
  notes?: string;
}

interface PDFClaimData extends PDFInvoiceData {
  claimNumber: string;
  submissionDate: string;
  responseDate?: string;
  remarkCodes?: Array<{
    code: string;
    description: string;
  }>;
  timeline?: Array<{
    date: string;
    event: string;
    description: string;
  }>;
}

interface PDFPaymentsReportData {
  reportDate: string;
  dateRange: string;
  payments: Array<{
    transactionId: string;
    invoiceNumber: string;
    patientName: string;
    patientId: string;
    paymentDate: string;
    paymentMethod: string;
    paymentSource: string;
    amount: number;
    referenceNumber: string;
    status: string;
  }>;
  totalAmount: number;
  totalPayments: number;
  byMethod: Record<string, { count: number; amount: number }>;
  bySource: Record<string, { count: number; amount: number }>;
}

interface PDFAdjustmentsReportData {
  reportDate: string;
  dateRange: string;
  adjustments: Array<{
    adjustmentId: string;
    invoiceNumber: string;
    patientName: string;
    patientId: string;
    adjustmentDate: string;
    adjustmentType: string;
    adjustmentReason: string;
    originalAmount: number;
    adjustmentAmount: number;
    finalAmount: number;
    status: string;
    createdBy: string;
  }>;
  totalAdjustments: number;
  totalAdjustmentAmount: number;
  byType: Record<string, { count: number; amount: number }>;
}

interface PDFBillingSummaryData {
  reportDate: string;
  dateRange: string;
  billingRecords: Array<{
    id: string;
    patientName: string;
    patientId: string;
    dateOfService: string;
    cptCodes: string[];
    diagnosis: string;
    chargeAmount: number;
    insurancePaid: number;
    patientPaid: number;
    adjustment: number;
    balance: number;
    claimStatus: string;
    paymentStatus: string;
    insuranceProvider: string;
  }>;
  totalCharges: number;
  totalCollected: number;
  totalPending: number;
  pendingClaims: number;
}

/**
 * Generate professional branded PDF for invoice
 */
export const generateInvoicePDF = (data: PDFInvoiceData): void => {
  const content = generateInvoiceHTML(data);
  openPDFWindow(content, `Invoice-${data.invoiceNumber}`);
};

/**
 * Generate professional branded PDF for claim
 */
export const generateClaimPDF = (data: PDFClaimData): void => {
  const content = generateClaimHTML(data);
  openPDFWindow(content, `Claim-${data.claimNumber}`);
};

/**
 * Generate professional branded PDF for payments report
 */
export const generatePaymentsReportPDF = (data: PDFPaymentsReportData): void => {
  const content = generatePaymentsReportHTML(data);
  openPDFWindow(content, `Payments-Report-${data.reportDate}`);
};

/**
 * Generate professional branded PDF for adjustments report
 */
export const generateAdjustmentsReportPDF = (data: PDFAdjustmentsReportData): void => {
  const content = generateAdjustmentsReportHTML(data);
  openPDFWindow(content, `Adjustments-Report-${data.reportDate}`);
};

/**
 * Generate professional branded PDF for billing summary report
 */
export const generateBillingSummaryPDF = (data: PDFBillingSummaryData): void => {
  const content = generateBillingSummaryHTML(data);
  openPDFWindow(content, `Billing-Summary-${data.reportDate}`);
};

/**
 * Generate HTML content for invoice PDF
 */
const generateInvoiceHTML = (data: PDFInvoiceData): string => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${data.invoiceNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #1a1a1a;
      line-height: 1.6;
      background: #ffffff;
      padding: 40px;
    }
    
    .container {
      max-width: 850px;
      margin: 0 auto;
      background: white;
    }
    
    /* Header */
    .header {
      border-bottom: 4px solid #1DA68F;
      padding-bottom: 30px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .logo-section {
      flex: 1;
    }
    
    .logo {
      font-size: 32px;
      font-weight: 700;
      color: #1DA68F;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    
    .tagline {
      font-size: 13px;
      color: #666;
      font-weight: 500;
    }
    
    .invoice-info {
      text-align: right;
      flex: 1;
    }
    
    .invoice-number {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 8px;
    }
    
    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .status-paid {
      background: #D4EDDA;
      color: #155724;
    }
    
    .status-partial {
      background: #FFF3CD;
      color: #856404;
    }
    
    .status-unpaid {
      background: #F8D7DA;
      color: #721C24;
    }
    
    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }
    
    .info-card {
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 20px;
    }
    
    .info-card-header {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #1DA68F;
      margin-bottom: 12px;
      border-bottom: 2px solid #1DA68F;
      padding-bottom: 6px;
    }
    
    .info-row {
      margin-bottom: 8px;
      font-size: 13px;
    }
    
    .info-label {
      font-weight: 600;
      color: #4B5563;
      display: inline-block;
      width: 120px;
    }
    
    .info-value {
      color: #1a1a1a;
    }
    
    /* Diagnosis Codes Section */
    .diagnosis-section {
      margin-bottom: 30px;
      padding: 20px;
      background: #FEF3C7;
      border: 1px solid #FCD34D;
      border-radius: 8px;
    }
    
    .diagnosis-header {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #92400E;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .diagnosis-icon {
      width: 18px;
      height: 18px;
      background: #F59E0B;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 11px;
      font-weight: 700;
    }
    
    .diagnosis-list {
      display: grid;
      gap: 8px;
    }
    
    .diagnosis-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
    }
    
    .diagnosis-pointer {
      background: #F59E0B;
      color: white;
      font-weight: 700;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      flex-shrink: 0;
    }
    
    .diagnosis-code {
      font-weight: 700;
      color: #92400E;
      font-family: 'Courier New', monospace;
    }
    
    .diagnosis-description {
      color: #78350F;
    }
    
    /* Charges Table */
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #E5E7EB;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 13px;
    }
    
    thead {
      background: #F3F4F6;
    }
    
    th {
      padding: 12px;
      text-align: left;
      font-weight: 700;
      color: #374151;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #D1D5DB;
    }
    
    th.text-right,
    td.text-right {
      text-align: right;
    }
    
    td {
      padding: 12px;
      border-bottom: 1px solid #E5E7EB;
      color: #1a1a1a;
    }
    
    tbody tr:hover {
      background: #F9FAFB;
    }
    
    .cpt-code {
      font-weight: 700;
      color: #1DA68F;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      background: #ECFDF5;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline-block;
    }
    
    .modifier-badge {
      background: #DBEAFE;
      color: #1E40AF;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
      margin-left: 6px;
      font-family: 'Courier New', monospace;
    }
    
    .diagnosis-pointer-badge {
      background: #FEF3C7;
      color: #92400E;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
      margin-left: 4px;
      font-family: 'Courier New', monospace;
    }
    
    /* Totals */
    .totals-section {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
    }
    
    .totals-table {
      width: 400px;
    }
    
    .totals-table table {
      margin-bottom: 0;
    }
    
    .totals-row td {
      border-bottom: 1px solid #E5E7EB;
      padding: 10px 12px;
    }
    
    .totals-label {
      font-weight: 600;
      color: #4B5563;
    }
    
    .totals-value {
      text-align: right;
      font-weight: 700;
      color: #1a1a1a;
    }
    
    .balance-row {
      background: #1DA68F;
      color: white;
    }
    
    .balance-row td {
      border: none;
      font-size: 18px;
      font-weight: 700;
      padding: 16px 12px;
    }
    
    /* Payments Section */
    .payments-section {
      margin-top: 30px;
    }
    
    /* Notes */
    .notes-section {
      margin-top: 30px;
      padding: 20px;
      background: #F3F4F6;
      border-radius: 8px;
      border-left: 4px solid #1DA68F;
    }
    
    .notes-title {
      font-weight: 700;
      color: #374151;
      margin-bottom: 8px;
      font-size: 13px;
    }
    
    .notes-content {
      color: #4B5563;
      font-size: 13px;
      line-height: 1.6;
    }
    
    /* Footer */
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #E5E7EB;
      text-align: center;
    }
    
    .footer-contact {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-bottom: 15px;
      font-size: 12px;
      color: #6B7280;
    }
    
    .footer-text {
      font-size: 11px;
      color: #9CA3AF;
      margin-bottom: 5px;
    }
    
    .generated-date {
      font-size: 10px;
      color: #D1D5DB;
      font-style: italic;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .no-print {
        display: none !important;
      }
      
      .container {
        box-shadow: none;
      }
      
      table {
        page-break-inside: avoid;
      }
      
      .info-card,
      .diagnosis-section {
        page-break-inside: avoid;
      }
    }
    
    @page {
      margin: 1cm;
      size: letter;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo-section">
        <div class="logo">ClinicX</div>
        <div class="tagline">Excellence in Healthcare</div>
      </div>
      <div class="invoice-info">
        <div class="invoice-number">${data.invoiceNumber}</div>
        <div class="status-badge status-${data.status}">${data.status.toUpperCase()}</div>
      </div>
    </div>
    
    <!-- Info Grid -->
    <div class="info-grid">
      <!-- Patient Information -->
      <div class="info-card">
        <div class="info-card-header">👤 Patient Information</div>
        <div class="info-row">
          <span class="info-label">Name:</span>
          <span class="info-value">${data.patient.name}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Patient ID:</span>
          <span class="info-value">${data.patient.id}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Date of Birth:</span>
          <span class="info-value">${new Date(data.patient.dob).toLocaleDateString('en-US')}</span>
        </div>
        ${data.patient.phone ? `
        <div class="info-row">
          <span class="info-label">Phone:</span>
          <span class="info-value">${data.patient.phone}</span>
        </div>
        ` : ''}
        ${data.patient.email ? `
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value">${data.patient.email}</span>
        </div>
        ` : ''}
        ${data.patient.address ? `
        <div class="info-row">
          <span class="info-label">Address:</span>
          <span class="info-value">${data.patient.address}</span>
        </div>
        ` : ''}
      </div>
      
      <!-- Provider Information -->
      <div class="info-card">
        <div class="info-card-header">🏥 Provider Information</div>
        <div class="info-row">
          <span class="info-label">Provider:</span>
          <span class="info-value">${data.provider.name}</span>
        </div>
        <div class="info-row">
          <span class="info-label">NPI:</span>
          <span class="info-value">${data.provider.npi}</span>
        </div>
        ${data.provider.specialty ? `
        <div class="info-row">
          <span class="info-label">Specialty:</span>
          <span class="info-value">${data.provider.specialty}</span>
        </div>
        ` : ''}
        <div class="info-row">
          <span class="info-label">Facility:</span>
          <span class="info-value">${data.provider.facility}</span>
        </div>
        ${data.provider.phone ? `
        <div class="info-row">
          <span class="info-label">Phone:</span>
          <span class="info-value">${data.provider.phone}</span>
        </div>
        ` : ''}
      </div>
    </div>
    
    <!-- Insurance Information -->
    ${data.insurance ? `
    <div class="info-grid" style="grid-template-columns: 1fr;">
      <div class="info-card">
        <div class="info-card-header">💳 Insurance Information</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <div class="info-row">
              <span class="info-label">Provider:</span>
              <span class="info-value">${data.insurance.provider}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Policy #:</span>
              <span class="info-value">${data.insurance.policyNumber}</span>
            </div>
          </div>
          <div>
            ${data.insurance.groupNumber ? `
            <div class="info-row">
              <span class="info-label">Group #:</span>
              <span class="info-value">${data.insurance.groupNumber}</span>
            </div>
            ` : ''}
            ${data.insurance.subscriberName ? `
            <div class="info-row">
              <span class="info-label">Subscriber:</span>
              <span class="info-value">${data.insurance.subscriberName}</span>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
    ` : ''}
    
    <!-- Service Dates -->
    <div style="margin-bottom: 20px; padding: 16px; background: #F9FAFB; border-radius: 8px; display: flex; gap: 30px; font-size: 13px;">
      <div>
        <strong style="color: #6B7280;">Service Date:</strong>
        <span style="color: #1a1a1a; margin-left: 8px;">${new Date(data.dateOfService).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>
      <div>
        <strong style="color: #6B7280;">Invoice Date:</strong>
        <span style="color: #1a1a1a; margin-left: 8px;">${new Date(data.dateCreated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>
      ${data.dateDue ? `
      <div>
        <strong style="color: #6B7280;">Due Date:</strong>
        <span style="color: #1a1a1a; margin-left: 8px;">${new Date(data.dateDue).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>
      ` : ''}
    </div>
    
    <!-- Diagnosis Codes -->
    ${data.diagnosisCodes && data.diagnosisCodes.length > 0 ? `
    <div class="diagnosis-section">
      <div class="diagnosis-header">
        <span class="diagnosis-icon">ICD</span>
        Diagnosis Codes (ICD-10)
      </div>
      <div class="diagnosis-list">
        ${data.diagnosisCodes.map(dx => `
          <div class="diagnosis-item">
            <div class="diagnosis-pointer">${dx.pointer}</div>
            <span class="diagnosis-code">${dx.code}</span>
            <span class="diagnosis-description">${dx.description}</span>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}
    
    <!-- Service Charges -->
    <div class="section-title">Service Charges</div>
    <table>
      <thead>
        <tr>
          <th>CPT Code</th>
          <th>Description</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Unit Price</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${data.charges.map(charge => `
          <tr>
            <td>
              <span class="cpt-code">${charge.cptCode}</span>
              ${charge.modifier ? `<span class="modifier-badge">MOD: ${charge.modifier}</span>` : ''}
              ${charge.diagnosisPointers && charge.diagnosisPointers.length > 0 ? 
                charge.diagnosisPointers.map(p => `<span class="diagnosis-pointer-badge">Dx:${p}</span>`).join('') 
                : ''}
            </td>
            <td>${charge.description}</td>
            <td class="text-right">${charge.quantity}</td>
            <td class="text-right">$${charge.unitPrice.toFixed(2)}</td>
            <td class="text-right">$${charge.total.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <!-- Payments -->
    ${data.payments && data.payments.length > 0 ? `
    <div class="section-title">Payments Received</div>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Payment Method</th>
          <th>Payer</th>
          <th>Reference</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${data.payments.map(payment => `
          <tr>
            <td>${new Date(payment.date).toLocaleDateString('en-US')}</td>
            <td>${payment.method}</td>
            <td>${payment.payer}</td>
            <td>${payment.referenceNumber || '-'}</td>
            <td class="text-right">$${payment.amount.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    ` : ''}
    
    <!-- Adjustments -->
    ${data.adjustments && data.adjustments.length > 0 ? `
    <div class="section-title">Adjustments</div>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Reason</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${data.adjustments.map(adj => `
          <tr>
            <td>${new Date(adj.date).toLocaleDateString('en-US')}</td>
            <td>${adj.type}</td>
            <td>${adj.reason}</td>
            <td class="text-right">$${adj.amount.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    ` : ''}
    
    <!-- Totals -->
    <div class="totals-section">
      <div class="totals-table">
        <table>
          <tbody>
            <tr class="totals-row">
              <td class="totals-label">Subtotal:</td>
              <td class="totals-value">$${data.subtotal.toFixed(2)}</td>
            </tr>
            ${data.totalAdjustments !== 0 ? `
            <tr class="totals-row">
              <td class="totals-label">Adjustments:</td>
              <td class="totals-value">$${data.totalAdjustments.toFixed(2)}</td>
            </tr>
            ` : ''}
            ${data.totalPayments !== 0 ? `
            <tr class="totals-row">
              <td class="totals-label">Payments:</td>
              <td class="totals-value">-$${data.totalPayments.toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr class="balance-row">
              <td>Balance Due:</td>
              <td>$${data.balance.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Notes -->
    ${data.notes ? `
    <div class="notes-section">
      <div class="notes-title">Clinical Notes</div>
      <div class="notes-content">${data.notes}</div>
    </div>
    ` : ''}
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-contact">
        <div>📞 ${data.provider.phone || '(555) 100-2000'}</div>
        <div>📧 billing@clinicx.com</div>
        <div>🌐 www.clinicx.com</div>
      </div>
      <div class="footer-text">
        Thank you for choosing ClinicX Medical Center
      </div>
      <div class="footer-text">
        All charges are in accordance with CPT® codes and ICD-10 standards
      </div>
      <div class="generated-date">
        Document generated: ${currentDate}
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Generate HTML content for claim PDF
 */
const generateClaimHTML = (data: PDFClaimData): string => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claim - ${data.claimNumber}</title>
  <style>
    ${generateInvoiceHTML(data).match(/<style>([\s\S]*?)<\/style>/)?.[1] || ''}
    
    /* Additional claim-specific styles */
    .claim-header {
      background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
      color: white;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
    }
    
    .claim-number {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    
    .claim-dates {
      display: flex;
      gap: 30px;
      font-size: 14px;
      opacity: 0.95;
    }
    
    .timeline-section {
      margin-top: 30px;
    }
    
    .timeline-item {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      padding: 15px;
      background: #F9FAFB;
      border-left: 4px solid #1DA68F;
      border-radius: 4px;
    }
    
    .timeline-date {
      font-weight: 700;
      color: #1DA68F;
      min-width: 100px;
    }
    
    .timeline-content {
      flex: 1;
    }
    
    .timeline-event {
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
    }
    
    .timeline-description {
      font-size: 13px;
      color: #6B7280;
    }
    
    .remark-codes {
      display: grid;
      gap: 10px;
      margin-top: 20px;
    }
    
    .remark-item {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: #FEF3C7;
      border-radius: 6px;
      font-size: 13px;
    }
    
    .remark-code {
      font-weight: 700;
      color: #92400E;
      font-family: 'Courier New', monospace;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Claim Header -->
    <div class="claim-header">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">INSURANCE CLAIM</div>
          <div class="claim-number">${data.claimNumber}</div>
          <div class="claim-dates">
            <div>📅 Submitted: ${new Date(data.submissionDate).toLocaleDateString('en-US')}</div>
            ${data.responseDate ? `<div>✓ Processed: ${new Date(data.responseDate).toLocaleDateString('en-US')}</div>` : ''}
          </div>
        </div>
        <div class="status-badge status-${data.status}" style="font-size: 14px;">${data.status.toUpperCase().replace('_', ' ')}</div>
      </div>
    </div>
    
    ${generateInvoiceHTML(data).match(/<div class="info-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/)?.[0] || ''}
    
    <!-- Remark Codes -->
    ${data.remarkCodes && data.remarkCodes.length > 0 ? `
    <div class="section-title">Claim Adjustment Reason Codes (CARC)</div>
    <div class="remark-codes">
      ${data.remarkCodes.map(code => `
        <div class="remark-item">
          <span class="remark-code">${code.code}</span>
          <span>${code.description}</span>
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    <!-- Timeline -->
    ${data.timeline && data.timeline.length > 0 ? `
    <div class="timeline-section">
      <div class="section-title">Claim Timeline</div>
      ${data.timeline.map(item => `
        <div class="timeline-item">
          <div class="timeline-date">${new Date(item.date).toLocaleDateString('en-US')}</div>
          <div class="timeline-content">
            <div class="timeline-event">${item.event}</div>
            <div class="timeline-description">${item.description}</div>
          </div>
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    ${generateInvoiceHTML(data).match(/<div class="footer">([\s\S]*?)<\/div>\s*<\/div>\s*<\/body>/)?.[0] || ''}
  </div>
</body>
</html>
  `;
};

/**
 * Generate HTML content for payments report PDF
 */
const generatePaymentsReportHTML = (data: PDFPaymentsReportData): string => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Report - ${data.reportDate}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1a1a1a;
      padding: 30px;
      background: white;
    }
    
    @media print {
      body { padding: 15px; }
      @page { size: letter; margin: 0.5in; }
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #1DA68F;
    }
    
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #1DA68F;
      margin-bottom: 10px;
    }
    
    .report-title {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 10px 0;
    }
    
    .report-info {
      font-size: 12px;
      color: #6B7280;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .summary-card {
      padding: 15px;
      background: #F3F4F6;
      border-radius: 8px;
      border-left: 4px solid #1DA68F;
    }
    
    .summary-label {
      font-size: 11px;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    
    .summary-value {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
    }
    
    .table-container {
      margin: 20px 0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }
    
    thead {
      background: #1DA68F;
      color: white;
    }
    
    th {
      padding: 10px 8px;
      text-align: left;
      font-weight: 600;
      font-size: 10px;
    }
    
    td {
      padding: 8px;
      border-bottom: 1px solid #E5E7EB;
    }
    
    tbody tr:nth-child(even) {
      background: #F9FAFB;
    }
    
    .status-completed {
      display: inline-block;
      padding: 3px 8px;
      background: #D1FAE5;
      color: #065F46;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 600;
    }
    
    .status-pending {
      display: inline-block;
      padding: 3px 8px;
      background: #FEF3C7;
      color: #92400E;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 600;
    }
    
    .amount {
      font-weight: 600;
      color: #1DA68F;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #E5E7EB;
      text-align: center;
      font-size: 10px;
      color: #6B7280;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">ClinicX</div>
    <div class="report-title">Payment History Report</div>
    <div class="report-info">
      Date Range: ${data.dateRange} | Generated: ${currentDate}
    </div>
  </div>
  
  <div class="summary-grid">
    <div class="summary-card">
      <div class="summary-label">Total Collected</div>
      <div class="summary-value">$${data.totalAmount.toFixed(2)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Total Payments</div>
      <div class="summary-value">${data.totalPayments}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Average Payment</div>
      <div class="summary-value">$${(data.totalAmount / data.totalPayments).toFixed(2)}</div>
    </div>
  </div>
  
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Transaction ID</th>
          <th>Invoice</th>
          <th>Patient</th>
          <th>Date</th>
          <th>Method</th>
          <th>Source</th>
          <th>Reference</th>
          <th style="text-align: right;">Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${data.payments.map(payment => `
          <tr>
            <td>${payment.transactionId}</td>
            <td>${payment.invoiceNumber}</td>
            <td>
              <div style="font-weight: 600;">${payment.patientName}</div>
              <div style="font-size: 9px; color: #6B7280;">${payment.patientId}</div>
            </td>
            <td>${new Date(payment.paymentDate).toLocaleDateString('en-US')}</td>
            <td>${payment.paymentMethod}</td>
            <td>${payment.paymentSource}</td>
            <td style="font-family: monospace; font-size: 9px;">${payment.referenceNumber}</td>
            <td style="text-align: right;"><span class="amount">$${payment.amount.toFixed(2)}</span></td>
            <td><span class="status-${payment.status}">${payment.status.toUpperCase()}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="footer">
    <p><strong>ClinicX Medical Center</strong> | 123 Medical Plaza, Los Angeles, CA 90001</p>
    <p>Phone: (555) 100-2000 | Email: billing@clinicx.com</p>
    <p style="margin-top: 10px;">This is a computer-generated report. Generated on ${currentDate}</p>
  </div>
</body>
</html>
  `;
};

/**
 * Generate HTML content for adjustments report PDF
 */
const generateAdjustmentsReportHTML = (data: PDFAdjustmentsReportData): string => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Adjustments Report - ${data.reportDate}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1a1a1a;
      padding: 30px;
      background: white;
    }
    
    @media print {
      body { padding: 15px; }
      @page { size: letter; margin: 0.5in; }
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #EF4444;
    }
    
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #1DA68F;
      margin-bottom: 10px;
    }
    
    .report-title {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 10px 0;
    }
    
    .report-info {
      font-size: 12px;
      color: #6B7280;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .summary-card {
      padding: 15px;
      background: #FEF2F2;
      border-radius: 8px;
      border-left: 4px solid #EF4444;
    }
    
    .summary-label {
      font-size: 11px;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    
    .summary-value {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
    }
    
    .table-container {
      margin: 20px 0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9px;
    }
    
    thead {
      background: #EF4444;
      color: white;
    }
    
    th {
      padding: 10px 6px;
      text-align: left;
      font-weight: 600;
      font-size: 9px;
    }
    
    td {
      padding: 8px 6px;
      border-bottom: 1px solid #E5E7EB;
    }
    
    tbody tr:nth-child(even) {
      background: #F9FAFB;
    }
    
    .adjustment-type {
      display: inline-block;
      padding: 3px 6px;
      background: #FEE2E2;
      color: #991B1B;
      border-radius: 4px;
      font-size: 8px;
      font-weight: 600;
    }
    
    .amount-negative {
      font-weight: 600;
      color: #EF4444;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #E5E7EB;
      text-align: center;
      font-size: 10px;
      color: #6B7280;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">ClinicX</div>
    <div class="report-title">Billing Adjustments Report</div>
    <div class="report-info">
      Date Range: ${data.dateRange} | Generated: ${currentDate}
    </div>
  </div>
  
  <div class="summary-grid">
    <div class="summary-card">
      <div class="summary-label">Total Adjustments</div>
      <div class="summary-value">${data.totalAdjustments}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Total Amount</div>
      <div class="summary-value">$${Math.abs(data.totalAdjustmentAmount).toFixed(2)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Average Adjustment</div>
      <div class="summary-value">$${Math.abs(data.totalAdjustmentAmount / data.totalAdjustments).toFixed(2)}</div>
    </div>
  </div>
  
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Adj. ID</th>
          <th>Invoice</th>
          <th>Patient</th>
          <th>Date</th>
          <th>Type</th>
          <th>Reason</th>
          <th style="text-align: right;">Original</th>
          <th style="text-align: right;">Adjustment</th>
          <th style="text-align: right;">Final</th>
          <th>Created By</th>
        </tr>
      </thead>
      <tbody>
        ${data.adjustments.map(adj => `
          <tr>
            <td>${adj.adjustmentId}</td>
            <td>${adj.invoiceNumber}</td>
            <td>
              <div style="font-weight: 600;">${adj.patientName}</div>
              <div style="font-size: 8px; color: #6B7280;">${adj.patientId}</div>
            </td>
            <td>${new Date(adj.adjustmentDate).toLocaleDateString('en-US')}</td>
            <td><span class="adjustment-type">${adj.adjustmentType}</span></td>
            <td style="font-size: 8px;">${adj.adjustmentReason}</td>
            <td style="text-align: right;">$${adj.originalAmount.toFixed(2)}</td>
            <td style="text-align: right;"><span class="amount-negative">-$${Math.abs(adj.adjustmentAmount).toFixed(2)}</span></td>
            <td style="text-align: right; font-weight: 600;">$${adj.finalAmount.toFixed(2)}</td>
            <td style="font-size: 8px;">${adj.createdBy}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="footer">
    <p><strong>ClinicX Medical Center</strong> | 123 Medical Plaza, Los Angeles, CA 90001</p>
    <p>Phone: (555) 100-2000 | Email: billing@clinicx.com</p>
    <p style="margin-top: 10px;">This is a computer-generated report. Generated on ${currentDate}</p>
  </div>
</body>
</html>
  `;
};

/**
 * Generate HTML content for billing summary report PDF
 */
const generateBillingSummaryHTML = (data: PDFBillingSummaryData): string => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Billing Summary - ${data.reportDate}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1a1a1a;
      padding: 30px;
      background: white;
    }
    
    @media print {
      body { padding: 15px; }
      @page { size: letter landscape; margin: 0.5in; }
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #1DA68F;
    }
    
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #1DA68F;
      margin-bottom: 10px;
    }
    
    .report-title {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 10px 0;
    }
    
    .report-info {
      font-size: 12px;
      color: #6B7280;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    
    .summary-card {
      padding: 15px;
      background: #F3F4F6;
      border-radius: 8px;
      border-left: 4px solid #1DA68F;
    }
    
    .summary-label {
      font-size: 11px;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    
    .summary-value {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
    }
    
    .table-container {
      margin: 20px 0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9px;
    }
    
    thead {
      background: #1DA68F;
      color: white;
    }
    
    th {
      padding: 10px 6px;
      text-align: left;
      font-weight: 600;
      font-size: 9px;
    }
    
    td {
      padding: 8px 6px;
      border-bottom: 1px solid #E5E7EB;
    }
    
    tbody tr:nth-child(even) {
      background: #F9FAFB;
    }
    
    .status-paid {
      display: inline-block;
      padding: 3px 6px;
      background: #D1FAE5;
      color: #065F46;
      border-radius: 4px;
      font-size: 8px;
      font-weight: 600;
    }
    
    .status-submitted, .status-pending {
      display: inline-block;
      padding: 3px 6px;
      background: #FEF3C7;
      color: #92400E;
      border-radius: 4px;
      font-size: 8px;
      font-weight: 600;
    }
    
    .status-rejected {
      display: inline-block;
      padding: 3px 6px;
      background: #FEE2E2;
      color: #991B1B;
      border-radius: 4px;
      font-size: 8px;
      font-weight: 600;
    }
    
    .amount {
      font-weight: 600;
      color: #1DA68F;
    }
    
    .balance-due {
      font-weight: 600;
      color: #EF4444;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #E5E7EB;
      text-align: center;
      font-size: 10px;
      color: #6B7280;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">ClinicX</div>
    <div class="report-title">Billing Summary Report</div>
    <div class="report-info">
      Date Range: ${data.dateRange} | Generated: ${currentDate}
    </div>
  </div>
  
  <div class="summary-grid">
    <div class="summary-card">
      <div class="summary-label">Total Charges</div>
      <div class="summary-value">$${data.totalCharges.toFixed(2)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Total Collected</div>
      <div class="summary-value">$${data.totalCollected.toFixed(2)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Total Pending</div>
      <div class="summary-value">$${data.totalPending.toFixed(2)}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Pending Claims</div>
      <div class="summary-value">${data.pendingClaims}</div>
    </div>
  </div>
  
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Invoice #</th>
          <th>Patient</th>
          <th>Date of Service</th>
          <th>CPT Codes</th>
          <th>Diagnosis</th>
          <th>Insurance</th>
          <th style="text-align: right;">Charge</th>
          <th style="text-align: right;">Ins. Paid</th>
          <th style="text-align: right;">Pt. Paid</th>
          <th style="text-align: right;">Balance</th>
          <th>Claim Status</th>
          <th>Pay Status</th>
        </tr>
      </thead>
      <tbody>
        ${data.billingRecords.map(record => `
          <tr>
            <td style="font-family: monospace; font-weight: 600;">${record.id}</td>
            <td>
              <div style="font-weight: 600;">${record.patientName}</div>
              <div style="font-size: 8px; color: #6B7280;">${record.patientId}</div>
            </td>
            <td>${new Date(record.dateOfService).toLocaleDateString('en-US')}</td>
            <td style="font-family: monospace; font-size: 8px;">${record.cptCodes.join(', ')}</td>
            <td style="font-size: 8px;">${record.diagnosis}</td>
            <td style="font-size: 8px;">${record.insuranceProvider}</td>
            <td style="text-align: right;">$${record.chargeAmount.toFixed(2)}</td>
            <td style="text-align: right;">$${record.insurancePaid.toFixed(2)}</td>
            <td style="text-align: right;">$${record.patientPaid.toFixed(2)}</td>
            <td style="text-align: right;"><span class="${record.balance > 0 ? 'balance-due' : 'amount'}">$${record.balance.toFixed(2)}</span></td>
            <td><span class="status-${record.claimStatus}">${record.claimStatus.toUpperCase()}</span></td>
            <td><span class="status-${record.paymentStatus}">${record.paymentStatus.toUpperCase()}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div class="footer">
    <p><strong>ClinicX Medical Center</strong> | 123 Medical Plaza, Los Angeles, CA 90001</p>
    <p>Phone: (555) 100-2000 | Email: billing@clinicx.com</p>
    <p style="margin-top: 10px;">This is a computer-generated report. Generated on ${currentDate}</p>
  </div>
</body>
</html>
  `;
};

/**
 * Open PDF in new window for printing/saving
 */
const openPDFWindow = (htmlContent: string, filename: string): void => {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow popups to download PDF');
    return;
  }
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Auto-print after content loads
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 250);
  };
  
  // Optional: Close window after printing
  printWindow.onafterprint = () => {
    // Uncomment to auto-close after printing
    // setTimeout(() => printWindow.close(), 100);
  };
};

/**
 * Export types
 */
export type { PDFInvoiceData, PDFClaimData, PDFPaymentsReportData, PDFAdjustmentsReportData, PDFBillingSummaryData };
