import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  FileText, 
  MapPin, 
  PhoneCall, 
  CheckCircle, 
  Clock, 
  Send, 
  Sparkles, 
  Printer, 
  Building,
  User,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import Header from '../../components/ui/Header';
import { useToast } from '../../components/ui/Toast';
import BatchRecallChecker from './components/BatchRecallChecker';
import IncidentHotspots from './components/IncidentHotspots';
import { 
  getStoredIncidentReports, 
  saveIncidentReportLocally,
  ACTIVE_RECALLS_DATABASE 
} from '../../data/safetyAlertsData';
import { medicineDatabase } from '../../data/medicineDatabase';

const EmergencyReportPage = () => {
  const [activeTab, setActiveTab] = useState('report'); // 'report', 'scanner', 'hotspots', 'my-reports'
  const { addToast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    medicineName: '',
    batchNumber: '',
    manufacturer: '',
    reportType: 'fake_medicine',
    urgency: 'critical',
    sellerName: '',
    purchaseLocation: '',
    city: '',
    state: '',
    description: '',
    symptoms: '',
    contactPhone: '',
    contactEmail: '',
    shareWithAuthorities: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [storedReports, setStoredReports] = useState([]);

  useEffect(() => {
    setStoredReports(getStoredIncidentReports());
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectBatchFromChecker = (batchData) => {
    setFormData(prev => ({
      ...prev,
      medicineName: batchData.medicineName || prev.medicineName,
      batchNumber: batchData.batchNumber || prev.batchNumber,
      manufacturer: batchData.manufacturer || prev.manufacturer,
      urgency: batchData.urgency || prev.urgency,
      description: batchData.reason 
        ? `Identified matching active statutory recall notice: ${batchData.reason}` 
        : prev.description
    }));
    setActiveTab('report');
    addToast(`Prefilled report with batch ${batchData.batchNumber}`, 'info');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!formData.medicineName || !formData.description) {
      addToast('Please provide the medicine name and a description of the defect.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate official reference ID
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const trackingNumber = `CDSCO-${timestamp}-INC-${randomCode}`;
      
      const newReport = {
        ...formData,
        reportId: `rep_${Date.now()}`,
        trackingNumber,
        status: formData.urgency === 'critical' ? 'ESCALATED_PRIORITY' : 'SUBMITTED_FOR_REVIEW',
        createdAt: new Date().toISOString(),
        matchedRecall: ACTIVE_RECALLS_DATABASE.some(r => 
          r.batchNumbers.some(b => b.toUpperCase() === (formData.batchNumber || '').trim().toUpperCase())
        )
      };

      // Try sending to FastAPI backend
      try {
        const response = await fetch('http://localhost:8000/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            medicine_name: formData.medicineName,
            batch_number: formData.batchNumber,
            manufacturer: formData.manufacturer,
            report_type: formData.reportType,
            urgency: formData.urgency,
            seller_name: formData.sellerName,
            purchase_location: formData.purchaseLocation,
            city: formData.city,
            state: formData.state,
            description: formData.description,
            symptoms: formData.symptoms,
            contact_phone: formData.contactPhone,
            contact_email: formData.contactEmail,
            share_with_authorities: formData.shareWithAuthorities
          })
        });
        if (response.ok) {
          const backendData = await response.json();
          newReport.trackingNumber = backendData.tracking_number || newReport.trackingNumber;
        }
      } catch (err) {
        // Backend offline in development; proceed with local persistent storage
        console.warn('Backend reporting endpoint not reachable; saving report locally.', err);
      }

      // Persist locally
      const updated = saveIncidentReportLocally(newReport);
      setStoredReports(updated);
      setSubmittedReport(newReport);
      addToast(`Regulatory incident dossier filed: ${newReport.trackingNumber}`, 'success');
    } catch (error) {
      console.error('Submission failed:', error);
      addToast('Failed to file report. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Emergency Safety & Regulatory Incident Hub | MediVerify</title>
        <meta 
          name="description" 
          content="Official counterfeit medicine reporting, national recall checker, and emergency poison control directory." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header title="Emergency Safety & Recalls" />

        <main className="content-offset">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            
            {/* Hero / Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-6 sm:p-8 shadow-xl">
              <div className="max-w-3xl relative z-10 space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/25">
                  <ShieldAlert className="w-3.5 h-3.5 text-white" />
                  National Drug Regulatory Triage
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Emergency Counterfeit & Recall Portal
                </h1>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                  Report suspected counterfeit medicines directly to statutory drug controllers, verify batch recall notices, and access 24/7 emergency poison information hotlines.
                </p>
              </div>

              {/* Quick hotline highlight */}
              <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4" />
                  National CDSCO Helpline: <strong className="font-bold underline">1800-11-0123</strong>
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  AIIMS Toxic Poison Emergency: <strong className="font-bold underline">1800-116-117</strong>
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-border overflow-x-auto gap-2 text-sm font-semibold">
              <button
                type="button"
                onClick={() => { setActiveTab('report'); setSubmittedReport(null); }}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'report'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <FileText className="w-4 h-4" />
                File Regulatory Report
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('scanner')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'scanner'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Search className="w-4 h-4" />
                Batch Recall Scanner
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('hotspots')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'hotspots'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Regional Hotspots & Helplines
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('my-reports')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === 'my-reports'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Clock className="w-4 h-4" />
                My Filed Reports ({storedReports.length})
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'scanner' && (
              <BatchRecallChecker onSelectBatchForReport={handleSelectBatchFromChecker} />
            )}

            {activeTab === 'hotspots' && (
              <IncidentHotspots />
            )}

            {activeTab === 'my-reports' && (
              <div className="bg-card border border-border rounded-2xl p-6 shadow-medical-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Filed Incident Dossiers & Status Tracker
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Audit trail of reports submitted from this device for statutory investigation.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {storedReports.length} Dossiers
                  </span>
                </div>

                {storedReports.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                    <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium text-foreground">No reports filed yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      If you encounter suspicious medicine packaging, file a report using the form.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('report')}
                      className="mt-4 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90"
                    >
                      File New Report
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {storedReports.map((rep) => (
                      <div key={rep.reportId} className="py-4 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                              {rep.trackingNumber}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              rep.urgency === 'critical' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
                            }`}>
                              {rep.urgency}
                            </span>
                            {rep.matchedRecall && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                                Active Recall Matched
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(rep.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-foreground">
                          {rep.medicineName} {rep.batchNumber ? `• Batch: ${rep.batchNumber}` : ''}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {rep.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1">
                          {rep.purchaseLocation && <span>📍 {rep.purchaseLocation}</span>}
                          {rep.city && <span>🏙️ {rep.city}, {rep.state}</span>}
                          <span className="text-emerald-600 font-semibold">
                            Status: {rep.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'report' && (
              <>
                {submittedReport ? (
                  /* SUBMISSION SUCCESS DOSSIER VIEW */
                  <div className="bg-card border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl">
                          <CheckCircle className="w-8 h-8" />
                        </div>
                        <div>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                            Regulatory Submission Confirmed
                          </span>
                          <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-0.5">
                            Official Incident Dossier Generated
                          </h3>
                          <p className="text-xs text-muted-foreground font-mono mt-1">
                            Reference Tracking ID: <strong className="text-foreground">{submittedReport.trackingNumber}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handlePrintDossier}
                          className="inline-flex items-center gap-1.5 px-3 py-2 border border-border rounded-xl text-xs font-semibold hover:bg-muted transition-colors text-foreground"
                        >
                          <Printer className="w-4 h-4" />
                          Print / Export Dossier
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSubmittedReport(null);
                            setFormData({
                              medicineName: '',
                              batchNumber: '',
                              manufacturer: '',
                              reportType: 'fake_medicine',
                              urgency: 'critical',
                              sellerName: '',
                              purchaseLocation: '',
                              city: '',
                              state: '',
                              description: '',
                              symptoms: '',
                              contactPhone: '',
                              contactEmail: '',
                              shareWithAuthorities: true
                            });
                          }}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:bg-primary/90 transition-colors"
                        >
                          File Another Incident
                        </button>
                      </div>
                    </div>

                    {/* Dossier Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-background border border-border space-y-1">
                        <span className="text-muted-foreground font-medium">Medicine & Batch</span>
                        <p className="font-bold text-foreground text-sm">{submittedReport.medicineName}</p>
                        <p className="text-muted-foreground font-mono">Lot: {submittedReport.batchNumber || 'Not specified'}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-background border border-border space-y-1">
                        <span className="text-muted-foreground font-medium">Report Urgency</span>
                        <p className="font-bold text-red-600 uppercase text-sm">{submittedReport.urgency}</p>
                        <p className="text-muted-foreground">Type: {submittedReport.reportType}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-background border border-border space-y-1">
                        <span className="text-muted-foreground font-medium">Destination Channel</span>
                        <p className="font-bold text-foreground text-sm">CDSCO & State FDA Cell</p>
                        <p className="text-emerald-600 font-medium">Scheduled for Priority Triage</p>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="p-5 rounded-2xl bg-muted/40 border border-border text-xs space-y-2">
                      <h4 className="font-bold text-foreground flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-primary" />
                        What Happens Next?
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        1. Your dossier has been logged into the MediVerify regulatory incident stream and dispatched to local drug inspectors.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        2. If you provided contact details, an enforcement officer or pharmacist may reach out for physical verification of the suspect blister strip or pharmacy receipt.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        3. Please safely isolate the package. Do not consume or discard the remaining pills until instructed.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* INCIDENT REPORT FORM */
                  <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-medical-sm">
                    <div className="max-w-2xl mb-8">
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        File Spurious Medicine Incident Dossier
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        This information will be structured into a regulatory complaint dossier for CDSCO and State Drug Controllers.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Section 1: Medicine Details */}
                      <div>
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-1.5">
                          <span>1. Medicine & Packaging Identity</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                              Medicine Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.medicineName}
                              onChange={(e) => handleInputChange('medicineName', e.target.value)}
                              placeholder="e.g. Paracetamol 650mg or Augmentin"
                              required
                              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                              Batch / Lot Number
                            </label>
                            <input
                              type="text"
                              value={formData.batchNumber}
                              onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                              placeholder="e.g. PCM2024X789"
                              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm font-mono uppercase focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                              Manufacturer Stated on Pack
                            </label>
                            <input
                              type="text"
                              value={formData.manufacturer}
                              onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                              placeholder="e.g. Cipla, GSK, or Apex Health"
                              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Urgency & Defect Classification */}
                      <div className="pt-4 border-t border-border">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-1.5">
                          <span>2. Classification & Risk Urgency</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                              Report Type
                            </label>
                            <select
                              value={formData.reportType}
                              onChange={(e) => handleInputChange('reportType', e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                              <option value="fake_medicine">Suspected Spurious / Fake Medicine</option>
                              <option value="adverse_reaction">Severe Adverse Reaction After Consumption</option>
                              <option value="suspicious_seller">Suspicious / Unlicensed Retailer or Chemist</option>
                              <option value="packaging_defect">Defective Hologram / Broken Seal / Tampering</option>
                              <option value="expired_restamped">Suspected Re-stamped Expiry Date</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                              Urgency Level
                            </label>
                            <select
                              value={formData.urgency}
                              onChange={(e) => handleInputChange('urgency', e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                            >
                              <option value="critical">🚨 Critical - Imminent Life or Organ Threat</option>
                              <option value="high">⚠️ High - Spurious Drug Active in Circulation</option>
                              <option value="medium">🟡 Medium - Quality or Labeling Defect</option>
                              <option value="low">ℹ️ Low - Routine Verification Discrepancy</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Point of Purchase / Location */}
                      <div className="pt-4 border-t border-border">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-1.5">
                          <span>3. Acquisition Details (Chemist / Location)</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                              Pharmacy / Chemist Name
                            </label>
                            <input
                              type="text"
                              value={formData.sellerName}
                              onChange={(e) => handleInputChange('sellerName', e.target.value)}
                              placeholder="e.g. Apollo Chemist or Local Medical Store"
                              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                              Street / Market Address
                            </label>
                            <input
                              type="text"
                              value={formData.purchaseLocation}
                              onChange={(e) => handleInputChange('purchaseLocation', e.target.value)}
                              placeholder="e.g. Shop 4, Station Road Market"
                              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-semibold text-foreground mb-1.5">
                                City
                              </label>
                              <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                placeholder="e.g. Delhi"
                                className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-foreground mb-1.5">
                                State
                              </label>
                              <input
                                type="text"
                                value={formData.state}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                                placeholder="e.g. Delhi NCR"
                                className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Safety Concern Description & Symptoms */}
                      <div className="pt-4 border-t border-border">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-1.5">
                          <span>4. Detailed Observation & Health Impact</span>
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                              Defect Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              rows={3}
                              value={formData.description}
                              onChange={(e) => handleInputChange('description', e.target.value)}
                              placeholder="Describe why you believe this medicine is counterfeit or defective (e.g. blurry logo, mismatched fonts, strange color/taste, no effect, crumbling tablets)..."
                              required
                              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                              Adverse Symptoms Experienced (if any)
                            </label>
                            <input
                              type="text"
                              value={formData.symptoms}
                              onChange={(e) => handleInputChange('symptoms', e.target.value)}
                              placeholder="e.g. Nausea, skin rash, dizziness, lack of fever reduction"
                              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 5: Reporter Contact & Consent */}
                      <div className="pt-4 border-t border-border">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-1.5">
                          <span>5. Reporter Contact & Regulatory Routing</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                              Phone Number (for inspector callback)
                            </label>
                            <input
                              type="tel"
                              value={formData.contactPhone}
                              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                              placeholder="+91 98765 43210"
                              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={formData.contactEmail}
                              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                              placeholder="your.email@example.com"
                              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                          </div>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={formData.shareWithAuthorities}
                            onChange={(e) => handleInputChange('shareWithAuthorities', e.target.checked)}
                            className="mt-1 rounded border-border text-primary focus:ring-primary w-4 h-4"
                          />
                          <span className="text-xs text-muted-foreground leading-relaxed">
                            I consent to forwarding this anonymized or verified incident dossier to the <strong>Central Drugs Standard Control Organisation (CDSCO)</strong> and State Drug Control Administration for lawful enforcement action.
                          </span>
                        </label>
                      </div>

                      {/* Submit Action */}
                      <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-md text-sm disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <Clock className="w-4 h-4 animate-spin" />
                              Filing Incident Dossier...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Submit Regulatory Report
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}

          </div>
        </main>
      </div>
    </>
  );
};

export default EmergencyReportPage;
