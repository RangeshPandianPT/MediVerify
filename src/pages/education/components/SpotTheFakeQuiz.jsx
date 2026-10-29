import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Award, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    title: 'Hologram & Optical Security Check',
    scenario: 'You are inspecting a strip of premium antibiotics. When tilting the packaging under direct light, what indicates a genuine security hologram?',
    imageHint: 'Genuine security holograms show multi-depth 3D depth layers and kinetic rainbow reflections when tilted at 45° angles.',
    difficulty: 'Beginner',
    options: [
      {
        id: 'A',
        text: 'A static silver metallic sticker with no color shift or multi-layer depth when viewed from varying angles.',
        isCorrect: false,
        explanation: 'Counterfeiters frequently use inexpensive static foil stickers that reflect silver light but lack microscopic multi-layered optical diffraction.'
      },
      {
        id: 'B',
        text: 'A dynamic 3D kinetic color-shifting seal displaying the manufacturer crest with microtext at varying depth planes.',
        isCorrect: true,
        explanation: 'Correct! Genuine pharmaceutical security seals use specialized optically variable devices (OVDs) that shift color, reveal latent logos, and include legible microtext under magnification.'
      },
      {
        id: 'C',
        text: 'A paper sticker printed with silver glitter ink and coated in glossy laminate.',
        isCorrect: false,
        explanation: 'Glitter ink and glossy paper are hallmarks of crude cottage-counterfeit packaging, completely missing holographic optical diffraction.'
      }
    ],
    proTip: 'Always tilt the box in daylight or under a smartphone flashlight. Authentic holograms shift colors sharply without peeling edges.'
  },
  {
    id: 2,
    title: 'Batch Number & Expiry Font Verification',
    scenario: 'You receive two packs of Paracetamol 650mg. How are authentic expiry dates and batch codes typically applied to medicine cartons and blister foils?',
    imageHint: 'Batch and expiry dates are applied on factory packaging lines using dot-matrix inkjet or high-speed laser debossing, not flat pre-printed offset ink.',
    difficulty: 'Intermediate',
    options: [
      {
        id: 'A',
        text: 'Printed with the exact same flat offset cyan/magenta colors and texture as the rest of the brand artwork.',
        isCorrect: false,
        explanation: 'Batch numbers and expiry dates vary per production run, so genuine manufacturers never print them alongside static packaging artwork during mass offset printing.'
      },
      {
        id: 'B',
        text: 'Computerized dot-matrix laser debossing or specialized high-density thermal inkjet with crisp, smudge-resistant characters.',
        isCorrect: true,
        explanation: 'Correct! Regulatory standards mandate secondary in-line batch coding (dot-matrix ink or mechanical pressure debossing) that cannot be wiped away with alcohol or friction.'
      },
      {
        id: 'C',
        text: 'Hand-stamped with a rubber stamp using water-based ink that smudges slightly when touched with a moist thumb.',
        isCorrect: false,
        explanation: 'Rubber-stamped or easily smudged ink is a major red flag indicating re-labeled expired medicine or unregulated counterfeit batches.'
      }
    ],
    proTip: 'Gently rub the batch code with a dry fingernail. Genuine debossed codes can be felt as physical indentations.'
  },
  {
    id: 3,
    title: 'Blister Pack Perforations & Foil Sealing',
    scenario: 'You open a box of pain relievers and inspect the aluminum-PVC blister strip. Which of these indicates a potential counterfeit or repacked strip?',
    imageHint: 'Inspect the heat-seal waffle pattern around the capsule pockets for uniform pressure and clean perforation lines.',
    difficulty: 'Intermediate',
    options: [
      {
        id: 'A',
        text: 'Uniform knurled diamond waffle grid pattern sealing every pocket with clean, machine-cut perforation slits between tablets.',
        isCorrect: false,
        explanation: 'This describes automated pharmaceutical blister packaging adhering to Good Manufacturing Practices (GMP).'
      },
      {
        id: 'B',
        text: 'Uneven heat seals with bubbles, loose edge flaps that peel apart without tearing, or hand-cut scissors edges between blisters.',
        isCorrect: true,
        explanation: 'Correct! Manual sealing with handheld heat sealers leaves irregular edge bubbles, poor adhesion, and jagged edges—strong indicators of illicit repacking.'
      },
      {
        id: 'C',
        text: 'Thick, opaque aluminum backing foil that tears cleanly without stretching or separating into layers.',
        isCorrect: false,
        explanation: 'Medical-grade aluminum foil backing should be crisp and tear cleanly along the tablet boundary to preserve sterile moisture barrier.'
      }
    ],
    proTip: 'Look for signs of double-sealing (ghost waffle lines), which suggest old blister foil was re-pressed over spurious capsules.'
  },
  {
    id: 4,
    title: 'Physical Tablet & Solution Appearance',
    scenario: 'You dispense an uncoated tablet from the packaging. Which physical flaw is an immediate danger signal suggesting an unapproved formulation?',
    imageHint: 'Authentic pharmaceutical tablets have strict uniformity in color, weight, hardness, and bevel embossing.',
    difficulty: 'Advanced',
    options: [
      {
        id: 'A',
        text: 'Chalky powder accumulation in the blister cavity, uneven speckling/mottling, and visible micro-cracks along the perimeter.',
        isCorrect: true,
        explanation: 'Correct! Substandard or counterfeit tablets suffer from low-quality excipients, improper binder ratios, and high humidity during illicit pressing, causing crumbling and discoloration.'
      },
      {
        id: 'B',
        text: 'Uniform matte white finish with a razor-sharp embossed dosage score and zero loose powder.',
        isCorrect: false,
        explanation: 'High tablet hardness and crisp embossing are hallmarks of GMP-certified hydraulic tablet presses.'
      },
      {
        id: 'C',
        text: 'A smooth enteric polymer coating that resists moisture and retains a uniform gloss across all tablets.',
        isCorrect: false,
        explanation: 'Uniform enteric coating ensures active ingredients bypass stomach acid safely and indicates proper pharmaceutical formulation.'
      }
    ],
    proTip: 'Never consume a medicine that has changed color, smells unusually acidic or chemical, or has soft, crumbly edges.'
  },
  {
    id: 5,
    title: 'Sourcing & Regulatory Authentication Protocol',
    scenario: 'A website offers prescription diabetes injectables at an 80% discount with no prescription required and courier delivery in unbranded foil bags. What is the safest course of action?',
    imageHint: 'Over 50% of medicines purchased from unverified websites without prescription verification are estimated to be counterfeit by the WHO.',
    difficulty: 'Beginner',
    options: [
      {
        id: 'A',
        text: 'Order the medicine and verify the batch number yourself after receiving the parcel.',
        isCorrect: false,
        explanation: 'Purchasing from illicit sellers endangers your health and supports criminal counterfeiting syndicates. Counterfeits often contain toxic adulterants.'
      },
      {
        id: 'B',
        text: 'Refuse the purchase, verify pharmacy licensing via national drug registry, and report the website to regulatory authorities.',
        isCorrect: true,
        explanation: 'Correct! Legitimate pharmacies always require a valid prescription for regulated drugs and maintain documented cold-chain storage for temperature-sensitive injectables.'
      },
      {
        id: 'C',
        text: 'Take half the dosage to test for side effects before continuing the full course.',
        isCorrect: false,
        explanation: 'Extremely dangerous! Counterfeit injectables can cause severe sepsis, irreversible organ toxicity, or lack active insulin completely.'
      }
    ],
    proTip: 'Always verify pharmacy credentials on the official state or national drug controller registry before purchasing online.'
  }
];

const SpotTheFakeQuiz = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (optionId) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
    setIsAnswered(true);

    const chosen = currentQ.options.find(o => o.id === optionId);
    if (chosen?.isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowSummary(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowSummary(false);
  };

  const scorePercentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);

  const getRankBadge = () => {
    if (scorePercentage === 100) return { label: 'Master Vigilance Inspector', color: 'text-success bg-success/10 border-success/30' };
    if (scorePercentage >= 80) return { label: 'Senior Quality Guardian', color: 'text-primary bg-primary/10 border-primary/30' };
    if (scorePercentage >= 60) return { label: 'Informed Consumer', color: 'text-warning bg-warning/10 border-warning/30' };
    return { label: 'Safety Trainee - Review Tips', color: 'text-error bg-error/10 border-error/30' };
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
      {!showSummary ? (
        <div>
          {/* Progress Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                #{currentIdx + 1}
              </span>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
                </span>
                <h4 className="text-lg font-bold text-foreground">{currentQ.title}</h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                currentQ.difficulty === 'Beginner' 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : currentQ.difficulty === 'Intermediate'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}>
                {currentQ.difficulty} Level
              </span>
              <span className="text-xs font-semibold text-muted-foreground px-2 py-1 bg-muted rounded-md">
                Score: {score}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 mb-6 overflow-hidden">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Scenario Text */}
          <div className="bg-muted/40 border border-border/70 rounded-xl p-4 sm:p-5 mb-6">
            <p className="text-foreground font-medium text-base leading-relaxed">
              {currentQ.scenario}
            </p>
            {currentQ.imageHint && (
              <div className="flex items-start gap-2.5 mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span><strong className="text-foreground">Visual Clue:</strong> {currentQ.imageHint}</span>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQ.options.map((option) => {
              const isSelected = selectedOption === option.id;
              let optionStyle = 'border-border bg-card hover:bg-muted/30 hover:border-primary/40 text-foreground';

              if (isAnswered) {
                if (option.isCorrect) {
                  optionStyle = 'border-emerald-500/80 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 shadow-sm';
                } else if (isSelected && !option.isCorrect) {
                  optionStyle = 'border-rose-500/80 bg-rose-500/10 text-rose-950 dark:text-rose-200';
                } else {
                  optionStyle = 'border-border/60 bg-muted/20 text-muted-foreground opacity-60';
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-3.5 ${optionStyle}`}
                >
                  <span className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs ${
                    isAnswered && option.isCorrect
                      ? 'bg-emerald-600 text-white'
                      : isAnswered && isSelected && !option.isCorrect
                      ? 'bg-rose-600 text-white'
                      : isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {option.id}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-relaxed">{option.text}</p>
                    {isAnswered && (isSelected || option.isCorrect) && (
                      <p className={`text-xs mt-2 pt-2 border-t font-normal leading-relaxed ${
                        option.isCorrect 
                          ? 'border-emerald-500/20 text-emerald-800 dark:text-emerald-300' 
                          : 'border-rose-500/20 text-rose-800 dark:text-rose-300'
                      }`}>
                        {option.explanation}
                      </p>
                    )}
                  </div>
                  {isAnswered && option.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isSelected && !option.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Pro-Tip Box (revealed upon answer) */}
          {isAnswered && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                  Pharmacist Pro-Tip
                </span>
                <p className="text-xs text-amber-900 dark:text-amber-200 mt-0.5 leading-relaxed">
                  {currentQ.proTip}
                </p>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {isAnswered ? 'Review the explanation above before continuing' : 'Choose an answer to see verification analysis'}
            </span>
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                isAnswered
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm cursor-pointer'
                  : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
              }`}
            >
              <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Scenario' : 'View Results'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Summary Screen */
        <div className="text-center py-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 shadow-inner">
            <Award className="w-10 h-10" />
          </div>

          <h3 className="text-2xl font-bold text-foreground mb-1">
            Challenge Completed!
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            You scored {score} out of {QUIZ_QUESTIONS.length} ({scorePercentage}%) on counterfeit recognition tests.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-8 border-border">
            <span className={`px-2.5 py-0.5 rounded-full border text-xs font-bold ${getRankBadge().color}`}>
              {getRankBadge().label}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-8 text-left">
            <div className="bg-muted/40 p-4 rounded-xl border border-border">
              <span className="text-xs text-muted-foreground block">Correct Verifications</span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{score}</span>
              <span className="text-xs text-muted-foreground block mt-1">out of {QUIZ_QUESTIONS.length} scenarios</span>
            </div>
            <div className="bg-muted/40 p-4 rounded-xl border border-border">
              <span className="text-xs text-muted-foreground block">Accuracy Score</span>
              <span className="text-2xl font-bold text-primary">{scorePercentage}%</span>
              <span className="text-xs text-muted-foreground block mt-1">inspection proficiency</span>
            </div>
            <div className="bg-muted/40 p-4 rounded-xl border border-border">
              <span className="text-xs text-muted-foreground block">Safety Confidence</span>
              <span className="text-2xl font-bold text-foreground">
                {scorePercentage >= 80 ? 'High' : scorePercentage >= 60 ? 'Moderate' : 'Needs Review'}
              </span>
              <span className="text-xs text-muted-foreground block mt-1">regulatory readiness</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted font-medium text-sm text-foreground flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Challenge</span>
            </button>

            <button
              onClick={() => navigate('/medicine-verification')}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm flex items-center gap-2 shadow-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Scan Real Medicine Now</span>
            </button>

            <button
              onClick={() => navigate('/emergency-report')}
              className="px-5 py-2.5 rounded-xl bg-rose-600/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600/20 font-medium text-sm flex items-center gap-2 border border-rose-600/20 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Suspicious Drug</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotTheFakeQuiz;

