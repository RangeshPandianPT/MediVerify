import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  Layers, 
  Eye, 
  QrCode, 
  Sparkles, 
  FileCheck, 
  ArrowRight, 
  Info, 
  CheckSquare, 
  Square, 
  ExternalLink,
  PhoneCall,
  Search,
  Award
} from 'lucide-react';
import Header from '../../components/ui/Header';
import SpotTheFakeQuiz from './components/SpotTheFakeQuiz';

const INSPECTION_PILLARS = [
  {
    id: 'packaging',
    icon: Layers,
    title: 'Packaging & Hologram Verification',
    subtitle: 'The primary physical defense against counterfeit pharmaceuticals',
    keyPoints: [
      {
        title: 'Dynamic 3D Holograms',
        authentic: 'Multi-plane optical depth; displays crisp rainbow diffraction when tilted under directional lighting; difficult to peel off without tearing.',
        fake: 'Flat, dull 2D silver foil stickers with no true kinetic color change; peels off cleanly like adhesive scotch tape.'
      },
      {
        title: 'Carton Print Typography & Kerning',
        authentic: 'Razor-sharp micro-typography with even character kerning, uniform brand PMS color matching, and no registration bleed.',
        fake: 'Slightly blurred letter edges, irregular character spacing, color shifts (e.g. magenta tint), and cheap non-aqueous cardstock.'
      },
      {
        title: 'Tamper-Evident Seals',
        authentic: 'Security tape leaving a VOID pattern upon removal, or unbroken carton tuck-in seals that tear the carton fiber when opened.',
        fake: 'Re-taped carton flaps, double-layer stickers, or seals that open and close without showing tamper evidence.'
      }
    ]
  },
  {
    id: 'blister',
    icon: Eye,
    title: 'Blister Pack & Foil Integrity',
    subtitle: 'Assessing aluminum barrier layers, sealing patterns, and batch debossing',
    keyPoints: [
      {
        title: 'Knurled Diamond Heat Sealing',
        authentic: 'Precision automated waffle or diamond grid sealing pattern around each capsule pocket without edge air tunnels.',
        fake: 'Uneven or wavy heat lines from manual handheld sealers; localized bubble pockets where moisture can enter.'
      },
      {
        title: 'In-Line Debossed Batch Coding',
        authentic: 'Mechanical pressure debossing or high-contrast dot-matrix laser etching; characters can be physically felt and do not wipe off.',
        fake: 'Flat rubber-stamped text or standard surface ink that smudges when rubbed with an alcohol swab or damp finger.'
      },
      {
        title: 'Perforation Slits',
        authentic: 'Machine-cut uniform micro-perforations that allow individual tablets to separate cleanly with gentle bending.',
        fake: 'Rough, hand-cut scissors or razor marks, or uncut borders requiring tearing that punctures adjacent pill pockets.'
      }
    ]
  },
  {
    id: 'tablet',
    icon: Sparkles,
    title: 'Tablet & Capsule Physical Appearance',
    subtitle: 'Detecting adulterated formulations and poor chemical binder ratios',
    keyPoints: [
      {
        title: 'Surface Uniformity & Hardness',
        authentic: 'Smooth, consistent texture with high tensile hardness; zero loose powder residue rattling inside the blister cavity.',
        fake: 'Chalky powder accumulation, chipped edges, soft crumble when gently pressed, or visible surface pitting.'
      },
      {
        title: 'Color Pigment Consistency',
        authentic: 'Homogeneous color dispersion throughout tablet cross-section; no mottling, specks, or faded blotches.',
        fake: 'Inconsistent color shades across different tablets in the same strip; noticeable dark flecks or yellowish discoloration.'
      },
      {
        title: 'Embossing & Score Lines',
        authentic: 'Precision hydraulic die stamping with crisp, deep bevels and perfectly centered score break lines.',
        fake: 'Shallow, crooked, or faint markings; inconsistent font size compared to the genuine manufacturer reference.'
      }
    ]
  },
  {
    id: 'regulatory',
    icon: QrCode,
    title: 'Barcodes, QR Codes & Regulatory Standards',
    subtitle: 'Checking statutory CDSCO/FDA compliance and digital traceability',
    keyPoints: [
      {
        title: 'GS1 2D DataMatrix Codes',
        authentic: 'Contains standardized GTIN, unique serial number, batch, and expiry date. Scans instantly with standardized medical decoders.',
        fake: 'Generic 1D UPC barcodes copied directly from old packaging, or static non-resolving QR codes that redirect to phishing websites.'
      },
      {
        title: 'Statutory Warning Labels',
        authentic: 'Clear Schedule H / H1 warning box with mandatory red vertical border on the left margin as prescribed by CDSCO.',
        fake: 'Missing mandatory schedule warning box, generic unformatted text, or outdated regulatory symbols.'
      },
      {
        title: 'Manufacturing License Format',
        authentic: 'Displays compliant state drug licensing code (e.g., MNB/08/123) verifiable on national food and drug portals.',
        fake: 'Invented or expired license formats; missing manufacturer manufacturing facility address.'
      }
    ]
  }
];

const CHECKLIST_ITEMS = [
  { id: 'hologram', text: 'Hologram is flat, non-reflective, or peels off without voiding packaging', riskWeight: 25 },
  { id: 'spelling', text: 'Spelling mistakes, misaligned fonts, or blurry brand logo on outer carton', riskWeight: 30 },
  { id: 'smudge_batch', text: 'Batch number or expiry date smudges easily when rubbed with a thumb', riskWeight: 20 },
  { id: 'sealing', text: 'Blister foil has uneven hand-seals, air bubbles, or scissor-cut edges', riskWeight: 20 },
  { id: 'tablet_flaw', text: 'Tablets are chalky, crumbling, discolored, or have uneven flecks', riskWeight: 25 },
  { id: 'no_receipt', text: 'Vendor refused to issue an official GST tax invoice with batch number', riskWeight: 15 },
  { id: 'unrealistic_price', text: 'Price is drastically discounted (>60% below standard MRP) from unregulated seller', riskWeight: 15 },
  { id: 'tamper_seal', text: 'Safety seal or bottle neck shrink-wrap was already punctured or broken', riskWeight: 30 }
];

const EducationPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('guide'); // 'guide', 'checklist', 'quiz', 'regulations'
  const [activePillar, setActivePillar] = useState('packaging');
  const [checkedItems, setCheckedItems] = useState({});

  const toggleChecklistItem = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const calculatedRiskScore = Object.keys(checkedItems).reduce((acc, curr) => {
    if (checkedItems[curr]) {
      const item = CHECKLIST_ITEMS.find(i => i.id === curr);
      return acc + (item ? item.riskWeight : 0);
    }
    return acc;
  }, 0);

  const getRiskStatus = () => {
    if (calculatedRiskScore === 0) {
      return { 
        level: 'Normal / Low Risk', 
        color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        advice: 'No major physical red flags selected. For automated confidence verification, run a photo scan.'
      };
    }
    if (calculatedRiskScore < 40) {
      return { 
        level: 'Moderate Suspicion', 
        color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30',
        advice: 'Caution advised. Inspect batch against active recall lists and do not ingest if seals are compromised.'
      };
    }
    return { 
      level: 'CRITICAL WARNING: High Likelihood of Counterfeit', 
      color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30',
      advice: 'DO NOT CONSUME THIS PRODUCT. Retain the packaging and immediately submit an emergency regulatory report.'
    };
  };

  const currentPillarData = INSPECTION_PILLARS.find(p => p.id === activePillar) || INSPECTION_PILLARS[0];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Helmet>
        <title>Medicine Safety & Counterfeit Detection Guide | MediVerify</title>
        <meta 
          name="description" 
          content="Comprehensive visual inspection guide, spot-the-fake practice quiz, and packaging red flag checklist to identify counterfeit pharmaceuticals." 
        />
      </Helmet>

      <Header title="Safety Education Hub" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Banner / Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-card border border-primary/20 rounded-3xl p-6 sm:p-10 mb-8 shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Pharmaceutical Vigilance & Anti-Spurious Protocol</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
              Medicine Safety & Authentication Guide
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
              Empowering consumers, caretakers, and pharmacists with systematic visual inspection techniques to recognize counterfeit, substandard, and tampered medications before ingestion.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/medicine-verification')}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Medicine Scan</span>
              </button>
              <button
                onClick={() => navigate('/emergency-report')}
                className="px-5 py-2.5 rounded-xl bg-card border border-border hover:bg-muted font-medium text-sm text-foreground flex items-center gap-2 transition-colors"
              >
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Report Counterfeit Drug</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-border mb-8 overflow-x-auto no-scrollbar gap-2">
          {[
            { id: 'guide', label: 'Visual Inspection Guide', icon: Eye },
            { id: 'checklist', label: 'Packaging Red Flag Checklist', icon: CheckSquare },
            { id: 'quiz', label: 'Interactive Spot-The-Fake Challenge', icon: Award },
            { id: 'regulations', label: 'Safety Guidelines & Hotlines', icon: Info }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-primary text-primary font-bold'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Visual Inspection Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-8">
            {/* Pillar Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {INSPECTION_PILLARS.map((pillar) => {
                const isSelected = activePillar === pillar.id;
                const IconComp = pillar.icon;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => setActivePillar(pillar.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border bg-card hover:border-primary/30 hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-primary text-white' : 'bg-muted text-foreground'}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {pillar.title.split('&')[0]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{pillar.subtitle}</p>
                  </button>
                );
              })}
            </div>

            {/* Active Pillar Card */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <currentPillarData.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{currentPillarData.title}</h3>
                  <p className="text-sm text-muted-foreground">{currentPillarData.subtitle}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6">
                {currentPillarData.keyPoints.map((point, index) => (
                  <div 
                    key={index} 
                    className="border border-border/80 rounded-xl p-5 bg-background/50 hover:border-primary/30 transition-colors"
                  >
                    <h4 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      {point.title}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Genuine characteristics */}
                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs mb-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>GENUINE MEDICINE INDICATOR</span>
                        </div>
                        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                          {point.authentic}
                        </p>
                      </div>

                      {/* Fake / Counterfeit characteristics */}
                      <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold text-xs mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>COUNTERFEIT / SPURIOUS RED FLAG</span>
                        </div>
                        <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                          {point.fake}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Packaging Red Flag Checklist */}
        {activeTab === 'checklist' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    Physical Packaging Risk Assessment
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Inspect your physical medicine package and check all anomalies that match what you observe:
                  </p>
                </div>

                <div className="space-y-3">
                  {CHECKLIST_ITEMS.map((item) => {
                    const isChecked = !!checkedItems[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleChecklistItem(item.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 select-none ${
                          isChecked 
                            ? 'bg-rose-500/10 border-rose-500/40 text-foreground' 
                            : 'bg-background hover:bg-muted/40 border-border text-foreground'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                          ) : (
                            <Square className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-relaxed">{item.text}</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                          +{item.riskWeight} pts
                        </span>
                      </div>
                    );
                  })}
                </div>

                {Object.keys(checkedItems).filter(k => checkedItems[k]).length > 0 && (
                  <div className="mt-6 pt-4 border-t border-border flex justify-end">
                    <button
                      onClick={() => setCheckedItems({})}
                      className="text-xs text-muted-foreground hover:text-foreground font-medium underline"
                    >
                      Clear All Selections
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Live Risk Score Panel */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-6">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                  Calculated Risk Index
                </h4>

                <div className="mb-4">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-3xl font-extrabold text-foreground">{calculatedRiskScore}</span>
                    <span className="text-xs text-muted-foreground">Max 175 pts</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        calculatedRiskScore === 0 ? 'bg-emerald-500' :
                        calculatedRiskScore < 40 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, (calculatedRiskScore / 175) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className={`p-4 rounded-xl border text-xs leading-relaxed mb-6 ${getRiskStatus().color}`}>
                  <p className="font-bold text-sm mb-1">{getRiskStatus().level}</p>
                  <p>{getRiskStatus().advice}</p>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => navigate('/medicine-verification')}
                    className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-primary/90 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Scan with AI Verifier</span>
                  </button>

                  <button
                    onClick={() => navigate('/emergency-report')}
                    className="w-full py-2.5 px-4 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>File Counterfeit Incident</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Interactive Spot-The-Fake Challenge */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-bold text-foreground">Spot the Fake Challenge</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Put your counterfeit detection knowledge to the test across 5 realistic pharmaceutical scenarios.
              </p>
            </div>
            <SpotTheFakeQuiz />
          </div>
        )}

        {/* Tab 4: Safety Guidelines & Hotlines */}
        {activeTab === 'regulations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">CDSCO & WHO Safe Buying Rules</h3>
                  <p className="text-xs text-muted-foreground">Standard operating procedures for safe medicines</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-sm text-foreground/90">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Always buy from pharmacies licensed by state drug control authorities with an active retail license.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Insist on receiving a computerized tax invoice (GST receipt) displaying medicine batch number and expiry.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Avoid purchasing prescription-only medicines (Schedule H/H1/X) from websites that do not mandate a signed doctor's prescription.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Store packaging cartons and receipts for at least 30 days in case of adverse drug reaction or recall.</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Emergency Regulatory Contacts</h3>
                  <p className="text-xs text-muted-foreground">24/7 Verified poison control and statutory reporting</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="p-3.5 rounded-xl border border-border bg-muted/30 flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-foreground">National Poison Information Centre (AIIMS)</h5>
                    <p className="text-xs text-muted-foreground">24x7 Emergency Poisoning Line</p>
                  </div>
                  <a 
                    href="tel:1800116117" 
                    className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90"
                  >
                    1800-116-117
                  </a>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-muted/30 flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-foreground">CDSCO Spurious Drug Grievance Cell</h5>
                    <p className="text-xs text-muted-foreground">Central Drugs Standard Control Organisation</p>
                  </div>
                  <a 
                    href="tel:1800111494" 
                    className="px-3 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs font-semibold hover:bg-muted/80"
                  >
                    1800-111-494
                  </a>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-muted/30 flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-foreground">FDA Adverse Event Reporting (MedWatch)</h5>
                    <p className="text-xs text-muted-foreground">International Drug Safety Line</p>
                  </div>
                  <a 
                    href="tel:18003321088" 
                    className="px-3 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs font-semibold hover:bg-muted/80"
                  >
                    1-800-FDA-1088
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EducationPage;

