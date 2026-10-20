import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  Activity, 
  PhoneCall, 
  ExternalLink,
  Building,
  CheckCircle2
} from 'lucide-react';
import { REGIONAL_HOTSPOTS, EMERGENCY_HELPLINES } from '../../../data/safetyAlertsData';

const IncidentHotspots = () => {
  const [selectedHotspot, setSelectedHotspot] = useState(REGIONAL_HOTSPOTS[0]);
  const [helplineRegionFilter, setHelplineRegionFilter] = useState('All');

  // Chart data formatted from hotspots
  const chartData = REGIONAL_HOTSPOTS.map((h) => ({
    name: h.state,
    regionName: h.region,
    riskScore: h.riskScore,
    activeAlerts: h.activeAlerts,
    level: h.riskLevel,
    hotspotObj: h
  }));

  const getBarColor = (score) => {
    if (score >= 80) return '#ef4444'; // Red-500
    if (score >= 60) return '#f97316'; // Orange-500
    if (score >= 40) return '#eab308'; // Amber-500
    return '#10b981';                  // Emerald-500
  };

  const filteredHelplines = helplineRegionFilter === 'All'
    ? EMERGENCY_HELPLINES
    : EMERGENCY_HELPLINES.filter(h => 
        h.scope === 'All India' || 
        h.scope.toLowerCase().includes(helplineRegionFilter.toLowerCase())
      );

  return (
    <div className="space-y-6">
      {/* Top Intelligence Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-medical-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Critical Clusters</p>
              <h4 className="text-xl font-bold text-foreground">3 Regions</h4>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Elevated counterfeit transit in NCR & WB
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-medical-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Seizures (30d)</p>
              <h4 className="text-xl font-bold text-foreground">471k Units</h4>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Intercepted by joint state task forces
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-medical-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Active CDSCO Alerts</p>
              <h4 className="text-xl font-bold text-foreground">15 Bulletins</h4>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            6 high-risk batch recalls in effect
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-medical-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Resolved Cases</p>
              <h4 className="text-xl font-bold text-foreground">84% Traced</h4>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Wholesale supply chain identified
          </p>
        </div>
      </div>

      {/* Main Chart and Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Score Chart */}
        <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 shadow-medical-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Regional Spurious Drug Vulnerability Index
              </h3>
              <span className="text-xs text-muted-foreground">0 - 100 Risk Score</span>
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              Calculated based on seizure volume, counterfeit reports, and regulatory inspection failure rates. Click any bar to inspect regional details.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                onClick={(e) => {
                  if (e && e.activePayload && e.activePayload[0]) {
                    setSelectedHotspot(e.activePayload[0].payload.hotspotObj);
                  }
                }}
              >
                <XAxis 
                  dataKey="name" 
                  stroke="#888888" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  stroke="#888888" 
                  fontSize={11} 
                  domain={[0, 100]}
                  tickLine={false} 
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-popover border border-border p-3 rounded-xl shadow-lg text-xs space-y-1">
                          <p className="font-bold text-foreground">{data.regionName}</p>
                          <p className="text-muted-foreground">Risk Index: <span className="font-semibold text-foreground">{data.riskScore}/100</span></p>
                          <p className="text-muted-foreground">Active Warnings: <span className="font-semibold text-foreground">{data.activeAlerts}</span></p>
                          <p className="text-[10px] text-primary italic font-medium">Click to view region report</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="riskScore" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={getBarColor(entry.riskScore)}
                      opacity={selectedHotspot.id === entry.hotspotObj.id ? 1 : 0.65}
                      stroke={selectedHotspot.id === entry.hotspotObj.id ? '#000000' : 'none'}
                      strokeWidth={1.5}
                      className="cursor-pointer transition-all"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 border-t border-border text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical (80+)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High (60-79)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Moderate (40-59)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low (Under 40)</span>
          </div>
        </div>

        {/* Selected Region Detailed Card */}
        <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 shadow-medical-sm flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  Target Zone Intelligence
                </span>
                <h3 className="text-lg font-bold text-foreground mt-0.5">
                  {selectedHotspot.region}
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                selectedHotspot.riskLevel === 'CRITICAL' 
                  ? 'bg-red-500/10 text-red-600 border border-red-500/20' 
                  : selectedHotspot.riskLevel === 'HIGH'
                  ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20'
                  : selectedHotspot.riskLevel === 'MEDIUM'
                  ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
              }`}>
                {selectedHotspot.riskLevel} RISK ({selectedHotspot.riskScore})
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              {selectedHotspot.statusDescription}
            </p>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-border text-xs">
              <div>
                <span className="text-muted-foreground">30-Day Seizure Vol:</span>
                <p className="font-bold text-foreground text-sm mt-0.5">{selectedHotspot.seizuresLast30Days}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Quarterly Trend:</span>
                <p className="font-bold text-foreground text-sm mt-0.5">{selectedHotspot.trend}</p>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs font-semibold text-foreground block mb-2">
                Frequently Imitated Formulations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedHotspot.primaryCounterfeits.map((med) => (
                  <span 
                    key={med}
                    className="text-xs px-2.5 py-1 rounded-lg bg-muted text-foreground font-medium"
                  >
                    ⚠️ {med}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Select another region:</span>
            <select
              value={selectedHotspot.id}
              onChange={(e) => {
                const found = REGIONAL_HOTSPOTS.find(h => h.id === e.target.value);
                if (found) setSelectedHotspot(found);
              }}
              className="bg-background border border-border text-foreground text-xs rounded-lg px-2.5 py-1.5 font-medium"
            >
              {REGIONAL_HOTSPOTS.map(h => (
                <option key={h.id} value={h.id}>{h.region}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Emergency Helpline Directory */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-medical-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-primary" />
              Verified Regulatory & Emergency Poison Control Hotlines
            </h3>
            <p className="text-xs text-muted-foreground">
              Direct official contact numbers for rapid intervention, medical poison toxicity advice, and whistleblower reporting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Filter:</span>
            <select
              value={helplineRegionFilter}
              onChange={(e) => setHelplineRegionFilter(e.target.value)}
              className="bg-background border border-border text-foreground text-xs rounded-lg px-2.5 py-1.5 font-medium"
            >
              <option value="All">All Jurisdictions</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Telangana">Telangana</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHelplines.map((item) => (
            <div 
              key={item.id}
              className="p-4 rounded-xl border border-border bg-background/50 hover:bg-background hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {item.badge}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {item.scope}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-foreground leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {item.agency}
                </p>
                <p className="text-[11px] text-muted-foreground mt-2 italic">
                  🕒 {item.operatingHours}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <a
                  href={item.dialUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  {item.number}
                </a>

                {item.whatsapp && (
                  <a
                    href={`https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    WhatsApp Alert
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncidentHotspots;
