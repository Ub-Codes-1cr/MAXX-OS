import React, { useState, useEffect } from 'react';
import { ThemeMode, ScreenId } from '../types';
import { 
  Radio, 
  Terminal, 
  Activity, 
  Tv, 
  Palette, 
  Sparkles, 
  ShieldAlert, 
  Cpu, 
  Layers,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

interface HeaderProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
  onOpenOrbModal: () => void;
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  onThemeChange,
  scanlinesEnabled,
  onToggleScanlines,
  onOpenOrbModal,
  activeScreen,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [latency, setLatency] = useState<number>(14);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().substring(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pingInterval = setInterval(() => {
      setLatency(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(9, Math.min(22, prev + delta));
      });
    }, 3000);
    return () => clearInterval(pingInterval);
  }, []);

  const screenNames: Record<ScreenId, string> = {
    dashboard: 'Dashboard (HUD)',
    brain: 'Brain (Swarm)',
    telemetry: 'Telemetry & Feed',
    voice: 'Voice Input (Whisper)',
    vision: 'Vision & Media (Qwen-VL)',
    draft: 'Draft Editor & Linter',
    review: 'Review & Post (HITL)',
    schedule: 'Schedule Calendar',
  };

  const themeOptions: { id: ThemeMode; label: string; dotColor: string }[] = [
    { id: 'notion-dark', label: 'Dark', dotColor: 'bg-zinc-400' },
    { id: 'notion-light', label: 'Paper', dotColor: 'bg-amber-400' },
    { id: 'obsidian', label: 'Obsidian', dotColor: 'bg-indigo-400' },
    { id: 'sage', label: 'Sage', dotColor: 'bg-emerald-400' },
    { id: 'amber', label: 'Amber', dotColor: 'bg-orange-400' },
  ];

  return (
    <header className="w-full bg-[var(--bg-surface)] border-b border-[var(--color-border)] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none transition-colors duration-200">
      {/* Brand & Notion Workspace Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 pr-3 border-r border-[var(--color-border)]">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)] font-bold text-xs shadow-sm">
            M
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs tracking-tight font-bold text-[var(--color-primary)]">
                MAXXX Studio
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 font-medium font-mono-code">
                v2.6
              </span>
            </div>
            <div className="text-[10px] text-[var(--color-text-dim)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>Sovereign Operator // Ubada</span>
            </div>
          </div>
        </div>

        {/* Breadcrumb to active station */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--color-text-dim)]">
          <span>Workspace</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="font-medium text-[var(--color-primary)]">{screenNames[activeScreen]}</span>
        </div>

        {/* Real-time Telemetry Metrics in Quiet Notion Badges */}
        <div className="hidden xl:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--color-border)] rounded-md px-2.5 py-1 text-[11px]">
            <Cpu className="w-3 h-3 text-[var(--color-accent)]" />
            <span className="text-[var(--color-text-dim)]">IPC:</span>
            <span className="font-mono-code text-[var(--color-primary)] font-medium">/tmp/swarm_bus.sock</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--color-border)] rounded-md px-2.5 py-1 text-[11px]">
            <Activity className="w-3 h-3 text-emerald-500" />
            <span className="text-[var(--color-text-dim)]">Latency:</span>
            <span className="font-mono-code text-[var(--color-primary)] font-medium">{latency}ms</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[var(--bg-card)] border border-[var(--color-border)] rounded-md px-2.5 py-1 text-[11px]">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span className="text-[var(--color-text-dim)]">Gateway:</span>
            <span className="text-emerald-500 font-medium">@MaxxxOpsBot</span>
          </div>
        </div>
      </div>

      {/* Right Controls & Ergonomic Theme Palette */}
      <div className="flex items-center gap-2">
        {/* Real-time UTC Clock */}
        <div className="hidden md:block text-xs font-mono-code border border-[var(--color-border)] bg-[var(--bg-card)] text-[var(--color-text-dim)] px-2.5 py-1 rounded-md">
          {currentTime || '12:00:00 UTC'}
        </div>

        {/* Maskyy Orb Quick Studio Launcher */}
        <button
          onClick={onOpenOrbModal}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-[var(--color-border)] text-[var(--color-text)] transition-all shadow-sm"
          title="Open Maskyy Harmonic Acoustic Orb"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)] animate-spin" />
          <span>Maskyy Orb</span>
        </button>

        {/* Scanlines Studio Filter Toggle (Optional) */}
        <button
          onClick={onToggleScanlines}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
            scanlinesEnabled
              ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
              : 'border-[var(--color-border)] bg-[var(--bg-card)] text-[var(--color-text-dim)] hover:text-[var(--color-primary)]'
          }`}
          title="Toggle Visual Scanline Overlay"
        >
          <Tv className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">{scanlinesEnabled ? 'Scanlines On' : 'Scanlines Off'}</span>
        </button>

        {/* Notion Craft Theme Switcher */}
        <div className="flex items-center bg-[var(--bg-card)] border border-[var(--color-border)] rounded-lg p-0.5 gap-0.5 shadow-sm">
          {themeOptions.map((opt) => {
            const isSelected = currentTheme === opt.id || 
              (opt.id === 'notion-dark' && currentTheme === 'neutral') ||
              (opt.id === 'sage' && currentTheme === 'green') ||
              (opt.id === 'amber' && currentTheme === 'red');
            return (
              <button
                key={opt.id}
                onClick={() => onThemeChange(opt.id)}
                title={`Switch to ${opt.label} Theme`}
                className={`px-2 py-1 text-xs rounded-md font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[var(--bg-hover)] text-[var(--color-primary)] shadow-sm font-semibold'
                    : 'text-[var(--color-text-dim)] hover:text-[var(--color-primary)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${opt.dotColor}`} />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
