const escapeCsvCell = (value) => {
  const text = value === null || value === undefined ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

const escapeHtml = (value) => {
  const text = value === null || value === undefined ? '' : String(value);
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const formatDateTime = (value) => {
  if (!value) return 'N/A';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusLabel = (result = {}) => {
  if (result?.isAuthentic === true) return 'Authentic';
  if (result?.isAuthentic === false) return 'Fake Detected';
  return 'Suspicious';
};

const getReportData = (verificationData = {}) => ({
  verificationId: verificationData?.verificationId || verificationData?.id || 'N/A',
  medicineName: verificationData?.medicineName || verificationData?.medicineDetails?.name || 'Unknown Medicine',
  manufacturer: verificationData?.manufacturer || verificationData?.medicineDetails?.manufacturer || 'N/A',
  batchNumber: verificationData?.batchNumber || verificationData?.medicineDetails?.batchNumber || 'N/A',
  expiryDate: verificationData?.expiryDate || verificationData?.medicineDetails?.expDate || 'N/A',
  status: getStatusLabel(verificationData),
  confidence: `${verificationData?.credibilityPercentage || 0}%`,
  confidenceBand: verificationData?.confidenceBand || verificationData?.analysisDetails?.confidenceBand || 'unknown',
  ocrQualityScore: verificationData?.ocrQualityScore ?? verificationData?.analysisDetails?.ocrQualityScore ?? 'N/A',
  recommendation: verificationData?.actionRecommendation || verificationData?.analysisDetails?.recommendation || 'N/A',
  timestamp: verificationData?.timestamp || verificationData?.verificationDate || new Date().toISOString(),
  processingTime: verificationData?.processingTime || verificationData?.analysisDetails?.processingTime || 'N/A',
});

export const buildVerificationCsv = (verificationData = {}) => {
  const data = getReportData(verificationData);

  const headers = [
    'Verification ID',
    'Medicine Name',
    'Manufacturer',
    'Batch Number',
    'Expiry Date',
    'Status',
    'Confidence',
    'Confidence Band',
    'OCR Quality',
    'Recommendation',
    'Verified At',
    'Processing Time',
  ];

  const row = [
    data.verificationId,
    data.medicineName,
    data.manufacturer,
    data.batchNumber,
    data.expiryDate,
    data.status,
    data.confidence,
    data.confidenceBand,
    data.ocrQualityScore,
    data.recommendation,
    formatDateTime(data.timestamp),
    data.processingTime,
  ];

  return [headers, row].map((line) => line.map(escapeCsvCell).join(',')).join('\n');
};

export const downloadVerificationCsv = (verificationData = {}) => {
  const reportId = verificationData?.verificationId || verificationData?.id || 'verification';
  const csv = buildVerificationCsv(verificationData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = `MediVerify_Report_${reportId}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

const buildReportHtml = (verificationData = {}) => {
  const data = getReportData(verificationData);
  const safeSummary = escapeHtml(verificationData?.summary || verificationData?.analysisDetails?.summary || 'MediVerify verification report');

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>MediVerify Report ${data.verificationId}</title>
    <style>
      :root { color-scheme: light; }
      body { font-family: Arial, sans-serif; margin: 32px; color: #111827; }
      .page { max-width: 920px; margin: 0 auto; }
      .header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; border-bottom: 2px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 24px; }
      .brand { font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: .08em; }
      h1 { margin: 0; font-size: 28px; }
      .subtitle { color: #4b5563; margin-top: 8px; }
      .pill { display: inline-block; padding: 6px 12px; border-radius: 999px; background: #f3f4f6; font-weight: 700; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin: 24px 0; }
      .card { border: 1px solid #e5e7eb; border-radius: 14px; padding: 16px; background: #fafafa; }
      .label { font-size: 12px; text-transform: uppercase; letter-spacing: .08em; color: #6b7280; margin-bottom: 6px; }
      .value { font-size: 16px; font-weight: 700; }
      .section { margin-top: 24px; }
      .section h2 { font-size: 18px; margin-bottom: 12px; }
      table { width: 100%; border-collapse: collapse; }
      td { padding: 10px 0; border-bottom: 1px solid #eef2f7; vertical-align: top; }
      td:first-child { width: 220px; color: #6b7280; }
      .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
      @media print { body { margin: 0; } .page { max-width: none; padding: 24px; } }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="header">
        <div>
          <div class="brand">MediVerify</div>
          <h1>Verification Report</h1>
          <div class="subtitle">${safeSummary}</div>
        </div>
        <div class="pill">${data.status}</div>
      </div>

      <div class="grid">
          <div class="card"><div class="label">Medicine</div><div class="value">${escapeHtml(data.medicineName)}</div></div>
        <div class="card"><div class="label">Verification ID</div><div class="value">${escapeHtml(data.verificationId)}</div></div>
        <div class="card"><div class="label">Confidence</div><div class="value">${escapeHtml(data.confidence)} (${escapeHtml(data.confidenceBand)})</div></div>
        <div class="card"><div class="label">Verified At</div><div class="value">${escapeHtml(formatDateTime(data.timestamp))}</div></div>
      </div>

      <div class="section">
        <h2>Report Details</h2>
        <table>
          <tr><td>Manufacturer</td><td>${escapeHtml(data.manufacturer)}</td></tr>
          <tr><td>Batch Number</td><td>${escapeHtml(data.batchNumber)}</td></tr>
          <tr><td>Expiry Date</td><td>${escapeHtml(data.expiryDate)}</td></tr>
          <tr><td>OCR Quality</td><td>${escapeHtml(data.ocrQualityScore)}</td></tr>
          <tr><td>Processing Time</td><td>${escapeHtml(data.processingTime)}</td></tr>
          <tr><td>Recommendation</td><td>${escapeHtml(data.recommendation)}</td></tr>
        </table>
      </div>

      <div class="footer">Generated by MediVerify for personal verification and record keeping.</div>
    </div>
  </body>
</html>`;
};

export const downloadVerificationPdf = (verificationData = {}) => {
  const html = buildReportHtml(verificationData);
  const reportWindow = window.open('', '_blank', 'noopener,noreferrer,width=980,height=720');

  if (!reportWindow) {
    return false;
  }

  reportWindow.document.open();
  reportWindow.document.write(html);
  reportWindow.document.close();
  reportWindow.focus();

  window.setTimeout(() => {
    reportWindow.print();
  }, 300);

  return true;
};

export const buildVerificationReportSummary = (verificationData = {}) => {
  const data = getReportData(verificationData);
  return {
    ...data,
    title: `MediVerify Report ${data.verificationId}`,
  };
};

export default {
  buildVerificationCsv,
  downloadVerificationCsv,
  downloadVerificationPdf,
  buildVerificationReportSummary,
};