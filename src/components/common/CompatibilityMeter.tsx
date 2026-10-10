import React, { useState } from 'react';
import { Sparkles, Zap, ChevronDown, ChevronUp, Info, Gamepad2, Heart, Compass } from 'lucide-react';

interface CompatibilityMeterProps {
  score: number;
  breakdown?: {
    emotional: number;
    gaming: number;
    lifestyle: number;
  };
  variant?: 'card' | 'badge' | 'compact';
  onInspectDetails?: () => void;
}

export const CompatibilityMeter: React.FC<CompatibilityMeterProps> = ({
  score = 92,
  breakdown = {
    emotional: 95,
    gaming: 91,
    lifestyle: 93,
  },
  variant = 'card',
  onInspectDetails,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // SVG Circular Gauge calculation
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#191827]/90 border border-[#A77BFF]/30 backdrop-blur-md shadow-md">
        <div className="relative w-7 h-7 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 52 52">
            <circle
              cx="26"
              cy="26"
              r={radius}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="26"
              cy="26"
              r={radius}
              stroke="url(#gradient-pulse-gauge)"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient-pulse-gauge" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A77BFF" />
                <stop offset="100%" stopColor="#F58AC9" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute text-[9px] font-black text-white">{score}%</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-bold text-white tracking-tight">Compatibilité IA</span>
          <span className="text-[8px] text-[#82E3B1] font-semibold">Match Élevé</span>
        </div>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#A77BFF]/20 via-[#F58AC9]/20 to-[#48D9E6]/20 border border-[#A77BFF]/40 backdrop-blur-md shadow-lg">
        <Zap className="w-3.5 h-3.5 text-[#F58AC9] animate-pulse" />
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-white">{score}%</span>
          <span className="text-[10px] font-semibold text-[#C8C0D8]">Compatibilité IA</span>
        </div>
      </div>
    );
  }

  // Variant 'card' : Visual module on profile deck cards
  return (
    <div className="w-full rounded-2xl bg-[#191827]/95 border border-[#A77BFF]/35 backdrop-blur-xl p-3.5 shadow-xl transition-all">
      {/* Top Header with Circular Progress Meter & Score */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Radial Progress Gauge */}
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 52 52">
              <circle
                cx="26"
                cy="26"
                r={radius}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="4.5"
                fill="transparent"
              />
              <circle
                cx="26"
                cy="26"
                r={radius}
                stroke="url(#card-gauge-gradient)"
                strokeWidth="4.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="card-gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A77BFF" />
                  <stop offset="50%" stopColor="#F58AC9" />
                  <stop offset="100%" stopColor="#82E3B1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xs font-black text-white">{score}%</span>
            </div>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F58AC9] animate-pulse" />
              <span className="text-xs font-extrabold text-white tracking-wide font-heading">
                Score de Compatibilité IA
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold text-[#82E3B1] px-1.5 py-0.2 rounded bg-[#82E3B1]/15 border border-[#82E3B1]/20">
                {score >= 93 ? 'Alchimie Exceptionnelle' : score >= 88 ? 'Excellente Synergie' : 'Forte Complémentarité'}
              </span>
              <span className="text-[10px] text-[#C8C0D8]/60">• Matchmaking Vérifié</span>
            </div>
          </div>
        </div>

        {/* Toggle details / Inspect button */}
        <div className="flex items-center gap-1">
          {onInspectDetails && (
            <button
              onClick={onInspectDetails}
              className="text-[10px] font-bold text-[#A77BFF] hover:text-white px-2 py-1 rounded-lg bg-[#242139] hover:bg-[#A77BFF]/20 transition-all border border-white/5"
            >
              Analyse
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-[#C8C0D8]/70 hover:text-white rounded-lg bg-[#242139] transition-colors"
            title={isExpanded ? 'Masquer le détail' : 'Voir le détail des sous-scores'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Linear Progress Bar */}
      <div className="mt-2.5">
        <div className="w-full h-2 bg-[#10101B] rounded-full overflow-hidden p-0.5 border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#A77BFF] via-[#F58AC9] to-[#82E3B1] rounded-full transition-all duration-1000 shadow-sm"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Expandable Sub-Breakdown Progress Bars */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-white/5 space-y-2 animate-in fade-in duration-200">
          {/* Sub-bar 1: Emotional & Values */}
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="flex items-center gap-1.5 text-[#C8C0D8]">
                <Heart className="w-3 h-3 text-[#F58AC9]" />
                <span>Synergie Émotionnelle & Valeurs</span>
              </span>
              <span className="font-bold text-white">{breakdown.emotional}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#10101B] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#A77BFF] to-[#F58AC9] rounded-full transition-all duration-700"
                style={{ width: `${breakdown.emotional}%` }}
              />
            </div>
          </div>

          {/* Sub-bar 2: Gaming & Co-op Affinity */}
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="flex items-center gap-1.5 text-[#C8C0D8]">
                <Gamepad2 className="w-3 h-3 text-[#48D9E6]" />
                <span>Affinité Jeux & Co-op</span>
              </span>
              <span className="font-bold text-white">{breakdown.gaming}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#10101B] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#48D9E6] to-[#A77BFF] rounded-full transition-all duration-700"
                style={{ width: `${breakdown.gaming}%` }}
              />
            </div>
          </div>

          {/* Sub-bar 3: Lifestyle & Passions */}
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="flex items-center gap-1.5 text-[#C8C0D8]">
                <Compass className="w-3 h-3 text-[#82E3B1]" />
                <span>Style de Vie & Sorties</span>
              </span>
              <span className="font-bold text-white">{breakdown.lifestyle}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#10101B] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F58AC9] to-[#82E3B1] rounded-full transition-all duration-700"
                style={{ width: `${breakdown.lifestyle}%` }}
              />
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-[9px] text-[#C8C0D8]/60">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3 text-[#A77BFF]" />
              Calculé à partir de vos réponses mutuelles d'onboarding
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
