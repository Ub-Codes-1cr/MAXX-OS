import React, { useState } from 'react';
import { OrbState } from '../types';
import { Radio, Activity, Cpu, Zap, Volume2, Sparkles, X, Layers } from 'lucide-react';

interface MaskyyOrbProps {
  initialState?: OrbState;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showControls?: boolean;
  onStateChange?: (state: OrbState) => void;
}

export const MaskyyOrb: React.FC<MaskyyOrbProps> = ({
  initialState = 'orb-idle',
  size = 'md',
  showControls = true,
  onStateChange,
}) => {
  const [orbState, setOrbState] = useState<OrbState>(initialState);

  const handleStateChange = (state: OrbState) => {
    setOrbState(state);
    if (onStateChange) onStateChange(state);
  };

  const getDimensionClass = () => {
    switch (size) {
      case 'sm':
        return 'w-24 h-24';
      case 'lg':
        return 'w-60 h-60';
      case 'full':
        return 'w-72 h-72';
      case 'md':
      default:
        return 'w-44 h-44';
    }
  };

  const getOrbDescription = () => {
    switch (orbState) {
      case 'orb-silent':
        return {
          title: 'State 1: Orb-Silent',
          status: 'Dormant Acoustic Standby',
          desc: 'Low-power acoustic monitoring. Acoustic floor baseline locked at -51.2 dB.',
          rpm: '0 RPM',
          freq: '8.0 kHz',
          flux: '0.12 T',
          badgeClass: 'bg-zinc-800/60 text-zinc-300 border-zinc-700',
        };
      case 'orb-idle':
        return {
          title: 'State 2: Orb-Idle',
          status: 'Harmonic Pulse & Listening',
          desc: 'Continuous standby ring rotation. Swarm sync locked at 98.4% coherence.',
          rpm: '120 RPM',
          freq: '48.0 kHz',
          flux: '0.88 T',
          badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        };
      case 'orb-active':
        return {
          title: 'State 3: Orb-Active',
          status: 'Real-Time Ingestion & Dispatch',
          desc: 'Acoustic spectral tracking, vector token routing, LangGraph state cycling.',
          rpm: '480 RPM',
          freq: '96.0 kHz',
          flux: '2.45 T',
          badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
        };
      case 'orb-processing':
        return {
          title: 'State 4: Orb-Processing',
          status: 'Multi-Agent Reflection Loop',
          desc: 'Hermes-3 & Qwen-2.5 multi-agent reflection loop at 42 tok/s. Zero egress leak.',
          rpm: '960 RPM',
          freq: '192.0 kHz',
          flux: '5.60 T',
          badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
        };
    }
  };

  const info = getOrbDescription();

  return (
    <div className="flex flex-col items-center justify-center p-3 select-none">
      {/* Harmonic Acoustic Orb Canvas */}
      <div className={`relative flex items-center justify-center ${getDimensionClass()} my-2`}>
        {/* Ambient Soft Glow Behind Orb */}
        <div 
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none opacity-40 ${
            orbState === 'orb-silent' ? 'bg-zinc-600/20' :
            orbState === 'orb-idle' ? 'bg-emerald-500/25' :
            orbState === 'orb-active' ? 'bg-sky-500/30' :
            'bg-purple-500/35'
          }`}
        />

        {/* Fluid SVG Acoustic Ring Construction */}
        <div className={`relative w-full h-full flex items-center justify-center ${orbState}`}>
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="orbGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="orbGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
              </linearGradient>

              <linearGradient id="orbGradProcessing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
              </linearGradient>

              <radialGradient id="orbCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="40%" stopColor="var(--color-accent)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Outer Subtle Acoustic Boundary Ring */}
            <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" opacity="0.2" />
            <circle cx="100" cy="100" r="74" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
            <circle cx="100" cy="100" r="56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />

            {/* Fluid Orbital Rings */}
            {orbState === 'orb-silent' && (
              <circle cx="100" cy="100" r="34" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            )}

            {orbState === 'orb-idle' && (
              <>
                <circle cx="100" cy="100" r="44" fill="none" stroke="url(#orbGrad1)" strokeWidth="2.5" opacity="0.75" />
                <circle cx="100" cy="100" r="30" fill="url(#orbCore)" opacity="0.6" />
                <circle cx="100" cy="100" r="16" fill="currentColor" opacity="0.7" />
              </>
            )}

            {orbState === 'orb-active' && (
              <>
                <circle cx="100" cy="100" r="50" fill="none" stroke="url(#orbGradActive)" strokeWidth="3" opacity="0.9" />
                <circle cx="100" cy="100" r="34" fill="url(#orbCore)" opacity="0.8" />
                <circle cx="100" cy="100" r="18" fill="#38bdf8" opacity="0.9" />
                {/* Acoustic Orbit nodes */}
                <circle cx="100" cy="26" r="3.5" fill="#38bdf8" />
                <circle cx="100" cy="174" r="3.5" fill="#10b981" />
              </>
            )}

            {orbState === 'orb-processing' && (
              <>
                <circle cx="100" cy="100" r="58" fill="none" stroke="url(#orbGradProcessing)" strokeWidth="3.5" opacity="0.9" />
                <circle cx="100" cy="100" r="40" fill="none" stroke="url(#orbGrad1)" strokeWidth="2" strokeDasharray="6 3" opacity="0.8" />
                <circle cx="100" cy="100" r="24" fill="url(#orbCore)" opacity="0.85" />
                <circle cx="100" cy="100" r="14" fill="#a855f7" />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* State Information Cards */}
      <div className="w-full max-w-xs text-center mt-2 space-y-1">
        <div className="flex items-center justify-center gap-1.5">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${info.badgeClass}`}>
            {info.status}
          </span>
        </div>
        <div className="text-xs font-semibold text-[var(--color-primary)]">
          {info.title}
        </div>
        <p className="text-[11px] text-[var(--color-text-dim)] leading-relaxed">
          {info.desc}
        </p>
      </div>

      {/* Hardware / Acoustic Flux Telemetry */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs mt-3 pt-3 border-t border-[var(--color-border)] text-[10px] text-center">
        <div className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)]">
          <div className="text-[var(--color-text-dim)]">Vortex</div>
          <div className="font-mono-code font-semibold text-[var(--color-primary)]">{info.rpm}</div>
        </div>
        <div className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)]">
          <div className="text-[var(--color-text-dim)]">Bandwidth</div>
          <div className="font-mono-code font-semibold text-[var(--color-primary)]">{info.freq}</div>
        </div>
        <div className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)]">
          <div className="text-[var(--color-text-dim)]">Magnetic</div>
          <div className="font-mono-code font-semibold text-[var(--color-primary)]">{info.flux}</div>
        </div>
      </div>

      {/* Manual State Selector Controls */}
      {showControls && (
        <div className="w-full max-w-xs mt-4">
          <div className="text-[10px] font-semibold text-[var(--color-text-dim)] uppercase tracking-wider mb-1.5 text-center">
            Acoustic Visualizer Mode
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {(['orb-silent', 'orb-idle', 'orb-active', 'orb-processing'] as OrbState[]).map((stateKey) => (
              <button
                key={stateKey}
                onClick={() => handleStateChange(stateKey)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all text-left flex items-center justify-between ${
                  orbState === stateKey
                    ? 'bg-[var(--color-accent)] text-[#18181b] border-[var(--color-accent)] font-semibold shadow-xs'
                    : 'bg-[var(--bg-card)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                <span className="capitalize">{stateKey.replace('orb-', '')}</span>
                {orbState === stateKey && <span className="w-1.5 h-1.5 rounded-full bg-[#18181b]" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface MaskyyOrbModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MaskyyOrbModal: React.FC<MaskyyOrbModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-[var(--bg-card)] border border-[var(--color-border)] p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--color-primary)]">Maskyy Acoustic Orb</h3>
              <p className="text-[10px] text-[var(--color-text-dim)]">Harmonic Visualizer & Swarm Acoustic Monitor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--color-text-dim)] hover:text-[var(--color-primary)] hover:bg-[var(--bg-hover)] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Orb Body */}
        <MaskyyOrb size="lg" showControls={true} />

        {/* Footer Note */}
        <div className="pt-2 text-center text-[11px] text-[var(--color-text-dim)]">
          Continuous local telemetry stream // Zero cloud egress
        </div>
      </div>
    </div>
  );
};
