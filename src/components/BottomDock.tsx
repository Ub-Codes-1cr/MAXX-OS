import React, { useState } from 'react';
import { WorkflowStep } from '../types';
import { 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  RotateCcw, 
  Camera, 
  Zap, 
  ShieldAlert, 
  CheckCircle,
  Sparkles,
  Layers,
  Radio,
  BrainCircuit,
  Terminal,
  ShieldCheck,
  Compass,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface BottomDockProps {
  activeStep: WorkflowStep;
  onStepChange: (step: WorkflowStep) => void;
  onEmergencyStop: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  activeStep,
  onStepChange,
  onEmergencyStop,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [autoExecute, setAutoExecute] = useState<boolean>(false);
  const [activeDivision, setActiveDivision] = useState<'MEDIA' | 'TECH' | 'MAFIA' | 'SAAS'>('MEDIA');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const divisions: ('MEDIA' | 'TECH' | 'MAFIA' | 'SAAS')[] = ['MEDIA', 'TECH', 'MAFIA', 'SAAS'];

  const cycleDivision = () => {
    const nextIdx = (divisions.indexOf(activeDivision) + 1) % divisions.length;
    setActiveDivision(divisions[nextIdx]);
  };

  const steps: { num: number; label: string; icon: React.ReactNode; isDivision?: boolean }[] = [
    { num: 1, label: 'Greet', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { num: 2, label: `Div: ${activeDivision}`, icon: <Layers className="w-3.5 h-3.5" />, isDivision: true },
    { num: 3, label: 'Idle', icon: <Radio className="w-3.5 h-3.5" /> },
    { num: 4, label: 'Listen', icon: <Compass className="w-3.5 h-3.5" /> },
    { num: 5, label: 'Think', icon: <BrainCircuit className="w-3.5 h-3.5" /> },
    { num: 6, label: 'Exec', icon: <Terminal className="w-3.5 h-3.5" /> },
    { num: 7, label: 'Approve', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[100] w-auto max-w-[96vw] sm:max-w-fit select-none drop-shadow-2xl">
      {/* FLOATING GLASSMORPHIC POPUP DOCK CONTAINER */}
      <footer className="flex flex-col items-center bg-[var(--bg-surface)]/95 backdrop-blur-2xl border border-[var(--color-border)] rounded-2xl sm:rounded-full p-1.5 sm:p-2 shadow-2xl shadow-black/70 transition-all duration-300">
        
        {/* COLLAPSED MINI BAR MODE (MOBILE TOGGLE) */}
        {!isExpanded ? (
          <div className="flex items-center gap-2 px-3 py-1">
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 text-xs font-bold text-[var(--color-accent)] bg-[var(--bg-card)] px-3 py-1.5 rounded-full border border-[var(--color-border)] hover:bg-[var(--bg-hover)] transition-all"
            >
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Maxxx Control Dock</span>
              <ChevronUp className="w-4 h-4" />
            </button>

            <button
              onClick={onEmergencyStop}
              className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-600 text-white flex items-center gap-1 shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Stop</span>
            </button>
          </div>
        ) : (
          /* EXPANDED FULL POPUP DOCK BAR */
          <div className="flex items-center gap-1.5 sm:gap-2 max-w-[94vw] sm:max-w-none overflow-x-auto scrollbar-none px-1">
            
            {/* GROUP 1: AUDIO & SYSTEM STATE */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`h-9 px-2.5 sm:px-3 text-xs font-semibold rounded-xl sm:rounded-full flex items-center gap-1.5 border transition-all duration-200 active:scale-95 ${
                  isMuted
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-sm'
                    : 'bg-[var(--bg-card)] border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--bg-hover)] hover:scale-105'
                }`}
                title="Toggle TTS Synthesizer Output"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400 shrink-0" /> : <Volume2 className="w-4 h-4 text-[var(--color-accent)] shrink-0" />}
                <span className="inline">{isMuted ? 'Muted' : 'TTS On'}</span>
              </button>

              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`h-9 px-2.5 sm:px-3 text-xs font-semibold rounded-xl sm:rounded-full flex items-center gap-1.5 border transition-all duration-200 active:scale-95 ${
                  isPaused
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-sm'
                    : 'bg-[var(--bg-card)] border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--bg-hover)] hover:scale-105'
                }`}
                title="Pause / Resume Swarm Pipeline"
              >
                {isPaused ? <Play className="w-4 h-4 text-amber-400 shrink-0" /> : <Pause className="w-4 h-4 text-[var(--color-text-dim)] shrink-0" />}
                <span className="inline">{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              <button
                onClick={() => onStepChange(1)}
                className="h-9 px-2.5 text-xs font-semibold rounded-xl sm:rounded-full flex items-center justify-center bg-[var(--bg-card)] border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-primary)] hover:bg-[var(--bg-hover)] hover:scale-105 active:scale-95 transition-all duration-200"
                title="Restart Workflow Step Cycle"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
              </button>
            </div>

            {/* DIVIDER */}
            <div className="w-px h-6 bg-[var(--color-border)] shrink-0 mx-0.5" />

            {/* GROUP 2: WORKFLOW STEP DOCK BUTTONS */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
              {steps.map((step) => {
                const isCurrent = activeStep === step.num;
                const isPassed = activeStep > step.num;

                return (
                  <button
                    key={step.num}
                    onClick={() => {
                      if (step.isDivision) {
                        cycleDivision();
                      } else {
                        onStepChange(step.num as WorkflowStep);
                      }
                    }}
                    className={`h-9 px-2.5 sm:px-3 text-xs font-medium rounded-xl sm:rounded-full border transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 shrink-0 active:scale-95 ${
                      isCurrent
                        ? 'bg-[var(--color-accent)] text-[#18181b] border-[var(--color-accent)] font-bold shadow-md shadow-[var(--color-accent)]/30 scale-105'
                        : isPassed
                        ? 'bg-[var(--bg-card)] text-[var(--color-primary)] border-[var(--color-border)] hover:bg-[var(--bg-hover)] hover:scale-102'
                        : 'bg-transparent text-[var(--color-text-dim)] border-transparent hover:bg-[var(--bg-hover)]/70 hover:text-[var(--color-primary)] hover:scale-102'
                    }`}
                    title={`Step ${step.num}: ${step.label}`}
                  >
                    <span className="shrink-0">{step.icon}</span>
                    <span className="text-[11px] sm:text-xs">
                      <span className="opacity-70 mr-0.5">{step.num}.</span>
                      {step.label}
                    </span>
                    {isPassed && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* DIVIDER */}
            <div className="w-px h-6 bg-[var(--color-border)] shrink-0 mx-0.5" />

            {/* GROUP 3: TOOLS & EMERGENCY STOP */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setCameraActive(!cameraActive)}
                className={`h-9 px-2.5 sm:px-3 text-xs font-semibold rounded-xl sm:rounded-full flex items-center gap-1.5 border transition-all duration-200 active:scale-95 ${
                  cameraActive
                    ? 'bg-sky-500/20 border-sky-500/40 text-sky-400 shadow-sm'
                    : 'bg-[var(--bg-card)] border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-primary)] hover:bg-[var(--bg-hover)] hover:scale-105'
                }`}
                title="Toggle Visual Inspection Camera"
              >
                <Camera className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">{cameraActive ? 'Cam On' : 'Cam Off'}</span>
              </button>

              <button
                onClick={() => setAutoExecute(!autoExecute)}
                className={`h-9 px-2.5 sm:px-3 text-xs font-semibold rounded-xl sm:rounded-full flex items-center gap-1.5 border transition-all duration-200 active:scale-95 ${
                  autoExecute
                    ? 'bg-[var(--color-accent)] text-[#18181b] font-bold border-[var(--color-accent)] shadow-sm'
                    : 'bg-[var(--bg-card)] border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-primary)] hover:bg-[var(--bg-hover)] hover:scale-105'
                }`}
                title="Toggle Auto Dispatch Pipeline"
              >
                <Zap className="w-4 h-4 shrink-0" />
                <span className="hidden md:inline">{autoExecute ? 'Auto' : 'Manual'}</span>
              </button>

              <button
                onClick={onEmergencyStop}
                className="h-9 px-3 text-xs font-bold rounded-xl sm:rounded-full flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/40 hover:scale-105 active:scale-95 transition-all duration-200"
                title="Emergency Stop All Swarm Agents"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Stop Swarm</span>
              </button>

              {/* COLLAPSE TOGGLE BUTTON FOR MOBILE */}
              <button
                onClick={() => setIsExpanded(false)}
                className="h-9 w-8 text-xs rounded-xl sm:rounded-full flex items-center justify-center bg-[var(--bg-card)] border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-primary)] hover:bg-[var(--bg-hover)] transition-all sm:hidden"
                title="Minimize Dock Bar"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
};
