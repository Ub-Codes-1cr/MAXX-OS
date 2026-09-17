import React from 'react';
import { ScreenId } from '../types';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Activity, 
  Mic, 
  Eye, 
  FileEdit, 
  ShieldCheck, 
  CalendarClock,
  BatteryCharging,
  Flame,
  Wifi,
  Radio,
  Server,
  Sparkles,
  Command
} from 'lucide-react';

interface SidebarProps {
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  onOpenOrbModal: () => void;
}

interface NavItem {
  id: ScreenId;
  label: string;
  badge?: string;
  icon: React.ReactNode;
  shortcut: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onSelectScreen,
  onOpenOrbModal,
}) => {
  const navSections: { title: string; items: NavItem[] }[] = [
    {
      title: 'OPERATIONAL HUBS',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard Overview',
          badge: 'Live',
          icon: <LayoutDashboard className="w-4 h-4" />,
          shortcut: '1',
        },
        {
          id: 'brain',
          label: 'Brain & Agent Swarm',
          badge: '11 Nodes',
          icon: <BrainCircuit className="w-4 h-4" />,
          shortcut: '2',
        },
        {
          id: 'telemetry',
          label: 'Telemetry & Terminal',
          badge: 'Logs',
          icon: <Activity className="w-4 h-4" />,
          shortcut: '3',
        },
      ],
    },
    {
      title: 'MULTIMODAL SENSORS',
      items: [
        {
          id: 'voice',
          label: 'Voice Input (Whisper)',
          badge: 'VAD',
          icon: <Mic className="w-4 h-4" />,
          shortcut: '4',
        },
        {
          id: 'vision',
          label: 'Vision & Media Lab',
          badge: 'Qwen-VL',
          icon: <Eye className="w-4 h-4" />,
          shortcut: '5',
        },
      ],
    },
    {
      title: 'SOVEREIGN PUBLISHING',
      items: [
        {
          id: 'draft',
          label: 'Draft Editor & Linter',
          badge: '40 Rules',
          icon: <FileEdit className="w-4 h-4" />,
          shortcut: '6',
        },
        {
          id: 'review',
          label: 'Review & Post (HITL)',
          badge: 'Gate',
          icon: <ShieldCheck className="w-4 h-4" />,
          shortcut: '7',
        },
        {
          id: 'schedule',
          label: 'Schedule Calendar',
          badge: 'SQLite',
          icon: <CalendarClock className="w-4 h-4" />,
          shortcut: '8',
        },
      ],
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-[var(--bg-surface)] border-r border-[var(--color-border)] flex flex-col justify-between select-none shrink-0 transition-colors duration-200">
      {/* Navigation List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-4">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-[var(--color-text-dim)] uppercase">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = activeScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectScreen(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                      isActive
                        ? 'bg-[var(--bg-card)] text-[var(--color-primary)] font-semibold shadow-sm border border-[var(--color-border)]'
                        : 'text-[var(--color-text)] hover:bg-[var(--bg-hover)] hover:text-[var(--color-primary)] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-dim)]'}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                            isActive
                              ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/30'
                              : 'bg-[var(--bg-surface)] text-[var(--color-text-dim)] border border-[var(--color-border)]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <span className="text-[10px] text-[var(--color-text-muted)] font-mono-code opacity-70 hidden sm:inline">
                        {item.shortcut}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Node Termux Telemetry Status Widget */}
      <div className="p-3 border-t border-[var(--color-border)] bg-[var(--bg-card)]/50 space-y-2.5">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-semibold flex items-center gap-1.5 text-[var(--color-primary)]">
            <Server className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <span>Node // Termux A13</span>
          </span>
          <span className="text-emerald-500 font-medium text-[10px] flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        </div>

        {/* Hardware Status Mini Bento */}
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          <div className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--bg-card)] flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-1 text-[var(--color-text-dim)] text-[10px]">
              <BatteryCharging className="w-3 h-3 text-emerald-500" />
              Battery
            </span>
            <span className="font-mono-code font-semibold text-emerald-500 text-[10px]">92%</span>
          </div>

          <div className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--bg-card)] flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-1 text-[var(--color-text-dim)] text-[10px]">
              <Flame className="w-3 h-3 text-amber-500" />
              Thermal
            </span>
            <span className="font-mono-code font-semibold text-amber-500 text-[10px]">38.4°C</span>
          </div>

          <div className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--bg-card)] flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-1 text-[var(--color-text-dim)] text-[10px]">
              <Wifi className="w-3 h-3 text-sky-500" />
              Tailscale
            </span>
            <span className="font-mono-code font-semibold text-sky-500 text-[10px]">100.84.*</span>
          </div>

          <div className="p-2 rounded-lg border border-[var(--color-border)] bg-[var(--bg-card)] flex items-center justify-between shadow-xs">
            <span className="flex items-center gap-1 text-[var(--color-text-dim)] text-[10px]">
              <Radio className="w-3 h-3 text-[var(--color-accent)]" />
              Ollama
            </span>
            <span className="font-mono-code font-semibold text-[var(--color-accent)] text-[10px]">v0.5.4</span>
          </div>
        </div>

        {/* Maskyy Orb Interactive Button */}
        <button
          onClick={onOpenOrbModal}
          className="w-full py-2 px-3 rounded-lg border border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] flex items-center justify-between text-xs transition-all shadow-xs"
        >
          <span className="flex items-center gap-2 text-[var(--color-accent)] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Harmonic Orb</span>
          </span>
          <span className="text-[10px] text-[var(--color-text-dim)]">Visualizer</span>
        </button>
      </div>
    </aside>
  );
};
