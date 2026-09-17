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
  Cpu,
  Layers,
  Sparkles
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

  const divisions: ('MEDIA' | 'TECH' | 'MAFIA' | 'SAAS')[] = ['MEDIA', 'TECH', 'MAFIA', 'SAAS'];

  const cycleDivision = () => {
    const nextIdx = (divisions.indexOf(activeDivision) + 1) % divisions.length;
    setActiveDivision(divisions[nextIdx]);
  };

  const steps = [
    { num: 1, label: 'Greet' },
    { num: 2, label: `Div: ${activeDivision}`, isDivision: true },
    { num: 3, label: 'Idle' },
    { num: 4, label: 'Listen' },
    { num: 5, label: 'Think' },
    { num: 6, label: 'Exec' },
    { num: 7, label: 'Approve (HITL)' },
  ];

  return (
    <footer className="w-full bg-[var(--bg-surface)] border-t border-[var(--color-border)] px-4 py-2 flex flex-wrap items-center justify-between gap-3 select-none shrink-0 z-20 transition-colors duration-200">
      {/* Left Studio Audio Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 border transition-all ${
            isMuted
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
              : 'bg-[var(--bg-card)] border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--bg-hover)]'
          }`}
          title="Toggle TTS Synthesizer Output"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-[var(--color-accent)]" />}
          <span>{isMuted ? 'Muted' : 'TTS On'}</span>
        </button>

        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 border transition-all ${
            isPaused
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
              : 'bg-[var(--bg-card)] border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--bg-hover)]'
          }`}
          title="Pause / Resume Swarm Pipeline"
        >
          {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5 text-[var(--color-text-dim)]" />}
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>

        <button
          onClick={() => {
            onStepChange(1);
          }}
          className="px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-primary)] hover:bg-[var(--bg-hover)] transition-all"
          title="Restart Workflow Step Cycle"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Restart</span>
        </button>
      </div>

      {/* Center 7-Step Workflow State Machine */}
      <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
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
              className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isCurrent
                  ? 'bg-[var(--color-accent)] text-[#18181b] border-[var(--color-accent)] font-semibold shadow-xs'
                  : isPassed
                  ? 'bg-[var(--bg-card)] text-[var(--color-primary)] border-[var(--color-border)]'
                  : 'bg-transparent text-[var(--color-text-dim)] border-transparent hover:bg-[var(--bg-hover)]'
              }`}
            >
              <span className="text-[10px] opacity-70">{step.num}.</span>
              <span>{step.label}</span>
              {isPassed && <CheckCircle className="w-3 h-3 text-emerald-500" />}
            </button>
          );
        })}
      </div>

      {/* Right Controls: Camera, Auto, Stop All */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCameraActive(!cameraActive)}
          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 border transition-all ${
            cameraActive
              ? 'bg-sky-500/15 border-sky-500/30 text-sky-400'
              : 'bg-[var(--bg-card)] border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-primary)] hover:bg-[var(--bg-hover)]'
          }`}
          title="Toggle Visual Inspection Camera"
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">{cameraActive ? 'Camera On' : 'Camera Off'}</span>
        </button>

        <button
          onClick={() => setAutoExecute(!autoExecute)}
          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 border transition-all ${
            autoExecute
              ? 'bg-[var(--color-accent)] text-[#18181b] font-semibold border-[var(--color-accent)] shadow-xs'
              : 'bg-[var(--bg-card)] border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-primary)] hover:bg-[var(--bg-hover)]'
          }`}
          title="Toggle Auto Dispatch Pipeline"
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">{autoExecute ? 'Auto: Active' : 'Auto: Manual'}</span>
        </button>

        <button
          onClick={onEmergencyStop}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white shadow-xs transition-all active:translate-y-0.5"
          title="Emergency Stop All Swarm Agents"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Stop Swarm</span>
        </button>
      </div>
    </footer>
  );
};
