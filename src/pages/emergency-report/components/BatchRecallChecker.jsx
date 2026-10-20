import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  Check, 
  FileText, 
  PhoneCall, 
  ExternalLink,
  Info,
  Building2,
  Calendar,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { checkBatchInLocalRegistry, RECALL_HAZARD_LEVELS, ACTIVE_RECALLS_DATABASE } from '../../../data/safetyAlertsData';

const SAMPLE_BATCHES = [
  { batch: 'PCM2024X789', label: 'Paracetamol 650 (Class I Recall)', type: 'danger' },
  { batch: 'AUG2024B102', label: 'Augmentin 625 (Spurious Lot)', type: 'danger' },
  { batch: 'MON2024L55', label: 'Montair-LC (Class II Mislabeled)', type: 'warning' },
  { batch: 'CIP2024E88', label: 'Cipcal 500 (Class III Foil Issue)', type: 'info' },
  { batch: 'PAR2026CLEAN', label: 'Verified Genuine Lot', type: 'safe' }
];

const BatchRecallChecker = ({ onSelectBatchForReport }) => {
  const [batchInput, setBatchInput] = useState('');
  const [result, setResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSearch = (overrideBatch) => {
    const query = (overrideBatch !== undefined ? overrideBatch : batchInput).trim().toUpperCase();
    if (!query) return;

    setIsSearching(true);
    setCopied(false);

    // Simulate search with realistic responsiveness
    setTimeout(() => {
      const match = checkBatchInLocalRegistry(query);
      setResult(match);
      setIsSearching(false);
    }, 250);
  };

  const handleSampleClick = (sampleBatch) => {
    setBatchInput(sampleBatch);
    handleSearch(sampleBatch);
  };

  const handleCopySummary = (text) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Input Bar */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-medical-sm">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            National Drug Safety Index
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Instant Batch Recall & Seizure Lookup
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Check your medicine packaging lot/batch code against verified CDSCO, WHO, and State FDA recall advisories.
          </p>
        </div>

        {/* Search input */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="mt-6 flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              id="batch-search-input"
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              placeholder="e.g. PCM2024X789, AUG2024B102, or MON2024L55"
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-mono uppercase tracking-wider"
            />
          </div>
          <button
            type="submit"
            disabled={!batchInput.trim() || isSearching}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-md"
          >
            {isSearching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Check Recall Status
              </>
            )}
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            Try testing against known alert records:
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_BATCHES.map((sample) => (
              <button
                key={sample.batch}
                type="button"
                onClick={() => handleSampleClick(sample.batch)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all hover:scale-105 ${
                  sample.type === 'danger'
                    ? 'bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20 dark:text-red-400'
                    : sample.type === 'warning'
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 dark:text-amber-400'
                    : sample.type === 'info'
                    ? 'bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20 dark:text-blue-400'
                    : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-400'
                }`}
              >
                {sample.batch} • {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results View */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.isRecalled ? result.recall.id : 'clean'}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {result.isRecalled ? (
              /* DANGER / RECALL NOTICE FOUND */
              <div className="bg-card border-2 border-red-500/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500" />
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-border">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl border border-red-500/20">
                      <ShieldAlert className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600 text-white shadow-sm">
                          {result.hazardConfig?.level || 'Active Recall'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                          {result.hazardConfig?.label || 'Life Threatening'}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          Ref: {result.recall.id}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {result.recall.medicineName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {result.recall.genericName} • {result.recall.brandName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    <button
                      type="button"
                      onClick={() => handleCopySummary(`${result.recall.medicineName} [Batch: ${batchInput}] - ${result.recall.reason} (${result.recall.actionGuidance})`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors text-foreground"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied Advisory' : 'Copy Advisory'}
                    </button>
                  </div>
                </div>

                {/* Recall Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-5 border-b border-border text-sm">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      Manufacturer on Record
                    </span>
                    <p className="font-semibold text-foreground text-xs leading-snug">
                      {result.recall.manufacturer}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Issue Date & Authority
                    </span>
                    <p className="font-semibold text-foreground text-xs leading-snug">
                      {result.recall.dateIssued} • {result.recall.issuingAuthority}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      Affected Territories
                    </span>
                    <p className="font-semibold text-foreground text-xs leading-snug">
                      {result.recall.affectedStates?.join(', ')}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      Enforcement Status
                    </span>
                    <p className="font-semibold text-red-600 dark:text-red-400 text-xs leading-snug">
                      {result.recall.seizureCount}
                    </p>
                  </div>
                </div>

                {/* Reason & Action Required */}
                <div className="pt-5 space-y-4">
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-sm">
                    <h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      Official Recall Reason
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {result.recall.reason}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm">
                    <h4 className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-1">
                      <ShieldAlert className="w-4 h-4" />
                      Mandatory Health Guidance
                    </h4>
                    <p className="text-foreground font-medium leading-relaxed">
                      {result.recall.actionGuidance}
                    </p>
                  </div>

                  {/* Actions for this batch */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Affected Batch Codes:</span>
                      <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                        {result.recall.batchNumbers?.map((b) => (
                          <span key={b} className="px-2 py-0.5 rounded bg-muted font-bold text-foreground">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {onSelectBatchForReport && (
                        <button
                          type="button"
                          onClick={() => onSelectBatchForReport({
                            medicineName: result.recall.medicineName,
                            batchNumber: batchInput.toUpperCase(),
                            manufacturer: result.recall.manufacturer,
                            urgency: 'critical',
                            reason: result.recall.reason
                          })}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          File Incident Report with this Batch
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* CLEAN / NO ACTIVE RECALL NOTICE */
              <div className="bg-card border-2 border-emerald-500/30 rounded-2xl p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        No Active Recall on Record
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        Batch: {result.queryBatch}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      Batch {result.queryBatch} is Not Flagged on Active Recall Registries
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We cross-referenced batch code <span className="font-mono font-semibold text-foreground">{result.queryBatch}</span> against our synchronized CDSCO, WHO, and state recall alerts. No statutory seizure or recall notices are recorded for this code.
                    </p>
                    <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span>Remember: A cleared batch code does not guarantee physical authenticity. Use MediVerify photo scanning to verify holograms and seal integrity.</span>
                      <a
                        href="/medicine-verification"
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                      >
                        Scan Packaging Photo Now →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overview Table of Active Recalls */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-medical-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Current Active National Drug Recalls
            </h3>
            <p className="text-xs text-muted-foreground">
              Public safety advisories published by statutory drug control administrations
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {ACTIVE_RECALLS_DATABASE.length} Active Bulletins
          </span>
        </div>

        <div className="divide-y divide-border">
          {ACTIVE_RECALLS_DATABASE.map((item) => {
            const hazard = RECALL_HAZARD_LEVELS[item.hazardLevel];
            return (
              <div 
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/40 px-2 rounded-xl transition-colors cursor-pointer"
                onClick={() => handleSampleClick(item.batchNumbers[0])}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${hazard.bg}`}>
                      {hazard.level}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground">
                      {item.medicineName}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {item.reason}
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:text-right shrink-0">
                  <div className="text-xs">
                    <p className="font-mono font-medium text-foreground">
                      {item.batchNumbers.join(', ')}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {item.dateIssued}
                    </p>
                  </div>
                  <button 
                    type="button"
                    className="text-xs font-semibold text-primary hover:underline px-2 py-1 rounded bg-primary/5"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BatchRecallChecker;
