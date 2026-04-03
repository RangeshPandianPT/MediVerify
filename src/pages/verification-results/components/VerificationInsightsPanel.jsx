import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import buildVerificationInsights from '../../../utils/verificationInsights';

const VerificationInsightsPanel = ({ verificationData = {}, className = '' }) => {
  const [copyState, setCopyState] = useState('idle');
  const insights = useMemo(() => buildVerificationInsights(verificationData), [verificationData]);

  const handleCopySummary = async () => {
    const summaryText = [
      `Medicine: ${verificationData?.medicineName || 'Unknown Medicine'}`,
      `Verdict: ${insights?.verdictLabel}`,
      `Confidence band: ${insights?.confidenceBand}`,
      `Recommendation: ${insights?.actionRecommendation}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1500);
    } catch (error) {
      console.error('Unable to copy verification summary:', error);
      setCopyState('error');
      window.setTimeout(() => setCopyState('idle'), 1500);
    }
  };

  const signalToneClass = (tone) => {
    switch (tone) {
      case 'strong':
        return 'bg-success/10 text-success border-success/20';
      case 'moderate':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-error/10 text-error border-error/20';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-2xl p-6 shadow-medical ${className}`}>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
              <Icon name="Sparkles" size={18} color="var(--color-primary)" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Why this result</h3>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl">
            A plain-language summary of the strongest signals in the scan so users can understand the decision,
            not just the score.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleCopySummary} iconName="Copy" iconPosition="left">
          {copyState === 'copied' ? 'Copied' : copyState === 'error' ? 'Copy failed' : 'Copy summary'}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        {insights?.quickFacts?.map((fact) => (
          <div key={fact?.label} className="rounded-xl border border-border/70 bg-muted/20 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{fact?.label}</p>
            <p className="font-semibold text-foreground">{fact?.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-success/20 bg-success/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="CheckCircle" size={16} color="var(--color-success)" />
            <h4 className="font-semibold text-foreground">Supporting signals</h4>
          </div>

          <div className="space-y-2">
            {insights?.positiveSignals?.length > 0 ? (
              insights.positiveSignals.map((signal, index) => (
                <div key={`${signal?.label}-${index}`} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${signalToneClass(signal?.tone)}`}>
                  <span className="text-sm font-medium">{signal?.label}</span>
                  <span className="font-mono text-sm font-semibold">{signal?.score}%</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No strong supporting signal was detected from this scan.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
            <h4 className="font-semibold text-foreground">Signals to double-check</h4>
          </div>

          <div className="space-y-2">
            {insights?.concernSignals?.length > 0 ? (
              insights.concernSignals.map((signal, index) => (
                <div key={`${signal?.label}-${index}`} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${signalToneClass('weak')}`}>
                  <span className="text-sm font-medium">{signal?.label}</span>
                  <span className="font-mono text-sm font-semibold">{signal?.score}%</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No material issues were flagged by the current scan.</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon name="Info" size={16} color="var(--color-primary)" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Recommended next step</h4>
            <p className="text-sm text-muted-foreground">{insights?.nextStep}</p>
            <p className="text-sm text-muted-foreground mt-2">{insights?.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationInsightsPanel;