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
  Moon,
  Menu,
  X,
  LayoutDashboard,
  BrainCircuit,
  Mic,
  Eye,
  FileEdit,
  ShieldCheck,
  CalendarClock,
  Github,
  Mail,
  ExternalLink,
  Check
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
  onSelectScreen,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [latency, setLatency] = useState<number>(14);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isMobileThemeOpen, setIsMobileThemeOpen] = useState<boolean>(false);

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

  const navItems: { id: ScreenId; label: string; icon: React.ReactNode; badge: string }[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" />, badge: 'Live' },
    { id: 'brain', label: 'Brain & Agent Swarm', icon: <BrainCircuit className="w-4 h-4" />, badge: '11 Nodes' },
    { id: 'telemetry', label: 'Telemetry & Terminal', icon: <Activity className="w-4 h-4" />, badge: 'Logs' },
    { id: 'voice', label: 'Voice Input (Whisper)', icon: <Mic className="w-4 h-4" />, badge: 'VAD' },
    { id: 'vision', label: 'Vision & Media Lab', icon: <Eye className="w-4 h-4" />, badge: 'Qwen-VL' },
    { id: 'draft', label: 'Draft Editor & Linter', icon: <FileEdit className="w-4 h-4" />, badge: '40 Rules' },
    { id: 'review', label: 'Review & Post (HITL)', icon: <ShieldCheck className="w-4 h-4" />, badge: 'Gate' },
    { id: 'schedule', label: 'Schedule Calendar', icon: <CalendarClock className="w-4 h-4" />, badge: 'SQLite' },
  ];

  const themeOptions: { id: ThemeMode; label: string; dotColor: string }[] = [
    { id: 'notion-dark', label: 'Dark', dotColor: 'bg-zinc-400' },
    { id: 'notion-light', label: 'Paper', dotColor: 'bg-amber-400' },
    { id: 'obsidian', label: 'Obsidian', dotColor: 'bg-indigo-400' },
    { id: 'sage', label: 'Sage', dotColor: 'bg-emerald-400' },
    { id: 'amber', label: 'Amber', dotColor: 'bg-orange-400' },
  ];

  const handleSelectMobileScreen = (screen: ScreenId) => {
    onSelectScreen(screen);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-[var(--bg-surface)] border-b border-[var(--color-border)] px-4 py-2.5 select-none transition-colors duration-200 sticky top-0 z-40">
      {/* DESKTOP HEADER (MD & UP) */}
      <div className="hidden md:flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Workspace Breadcrumb */}
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

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--color-text-dim)]">
            <span>Workspace</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="font-medium text-[var(--color-primary)]">{screenNames[activeScreen]}</span>
          </div>

          {/* Real-time Telemetry Metrics */}
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

        {/* Desktop Controls & Theme Switcher */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block text-xs font-mono-code border border-[var(--color-border)] bg-[var(--bg-card)] text-[var(--color-text-dim)] px-2.5 py-1 rounded-md">
            {currentTime || '12:00:00 UTC'}
          </div>

          <button
            onClick={onOpenOrbModal}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-[var(--color-border)] text-[var(--color-text)] transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)] animate-spin" />
            <span>Maskyy Orb</span>
          </button>

          <button
            onClick={onToggleScanlines}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
              scanlinesEnabled
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                : 'border-[var(--color-border)] bg-[var(--bg-card)] text-[var(--color-text-dim)] hover:text-[var(--color-primary)]'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{scanlinesEnabled ? 'Scanlines On' : 'Scanlines Off'}</span>
          </button>

          <div className="flex items-center bg-[var(--bg-card)] border border-[var(--color-border)] rounded-lg p-0.5 gap-0.5 shadow-sm">
            {themeOptions.map((opt) => {
              const isSelected = currentTheme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onThemeChange(opt.id)}
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
      </div>

      {/* MOBILE NAVBAR (MD HIDDEN) */}
      <div className="flex md:hidden items-center justify-between w-full">
        {/* Left Mobile Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)] font-bold text-xs">
            M
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-[var(--color-primary)]">MAXXX Studio</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-mono-code">v2.6</span>
            </div>
            <span className="text-[10px] text-[var(--color-accent)] font-mono-code block leading-none">{screenNames[activeScreen]}</span>
          </div>
        </div>

        {/* Right Mobile Icons: Theme Icon + Orb Launcher + Hamburger Button */}
        <div className="flex items-center gap-1.5 relative">
          {/* Mobile Theme Switcher Icon */}
          <button
            onClick={() => setIsMobileThemeOpen(!isMobileThemeOpen)}
            className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--color-border)] text-[var(--color-accent)] shadow-xs"
            title="Change Theme"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Mobile Orb Launcher */}
          <button
            onClick={onOpenOrbModal}
            className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--color-border)] text-[var(--color-accent)] shadow-xs"
            title="Maskyy Orb"
          >
            <Sparkles className="w-4 h-4 animate-spin" />
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-[var(--color-accent)] text-[#18181b] font-bold shadow-xs flex items-center justify-center"
            title="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE THEME DROPDOWN POPUP */}
      {isMobileThemeOpen && (
        <div className="md:hidden absolute right-4 top-14 bg-[var(--bg-surface)] border border-[var(--color-border)] rounded-xl p-2 shadow-xl z-50 w-48 space-y-1">
          <div className="text-[10px] font-bold text-[var(--color-text-dim)] uppercase px-2 py-1 border-b border-[var(--color-border)]">
            Select Color Theme
          </div>
          {themeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                onThemeChange(opt.id);
                setIsMobileThemeOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all ${
                currentTheme === opt.id
                  ? 'bg-[var(--bg-card)] text-[var(--color-primary)] font-bold border border-[var(--color-border)]'
                  : 'text-[var(--color-text-dim)] hover:text-[var(--color-primary)]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${opt.dotColor}`} />
                <span>{opt.label}</span>
              </div>
              {currentTheme === opt.id && <Check className="w-3.5 h-3.5 text-[var(--color-accent)]" />}
            </button>
          ))}
        </div>
      )}

      {/* MOBILE FULL-SCREEN NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[52px] bg-[var(--bg-base)] z-50 flex flex-col p-4 overflow-y-auto space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Menu Title */}
          <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
            <span className="text-xs font-bold text-[var(--color-text-dim)] uppercase tracking-wider">
              NAVIGATION STATIONS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono-code">
              8 Stations Ready
            </span>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectMobileScreen(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[var(--bg-card)] text-[var(--color-primary)] font-bold border border-[var(--color-accent)]/40 shadow-sm'
                      : 'bg-[var(--bg-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-dim)]'}>
                      {item.icon}
                    </span>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--color-accent)] border border-[var(--color-border)] font-mono-code">
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* IMPRESSIVE MOBILE CONTACT & SYSTEM CONTENT CARD */}
          <div className="mt-4 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-[var(--color-primary)]">OPERATOR & CONTACT</span>
              </div>
              <span className="text-[10px] text-[var(--color-accent)] font-mono-code">v2.6</span>
            </div>

            <div className="space-y-1.5 text-xs text-[var(--color-text-dim)]">
              <div className="flex items-center justify-between">
                <span>Creator / Owner:</span>
                <span className="font-semibold text-[var(--color-primary)]">Syed Ubada (Ub-Codes-1cr)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Engine:</span>
                <span className="font-mono-code text-[var(--color-accent)]">Hermes-3 Local Swarm</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Email:</span>
                <span className="font-mono-code text-[var(--color-primary)]">ubada.devops@gmail.com</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a
                href="https://github.com/Ub-Codes-1cr/MAXX-OS"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 rounded-lg bg-[var(--color-accent)] text-[#18181b] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="mailto:ubada.devops@gmail.com"
                className="py-2 px-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)] text-[var(--color-primary)] font-semibold text-xs flex items-center justify-center gap-1"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
