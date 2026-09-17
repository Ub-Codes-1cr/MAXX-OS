import React, { useState, useEffect } from 'react';
import { ScreenId } from '../../types';
import { MaskyyOrb } from '../MaskyyOrb';
import { 
  BarChart3, 
  Globe2, 
  FileText, 
  CheckCircle2, 
  Radio, 
  Send, 
  RefreshCw, 
  ArrowRight, 
  Sparkles, 
  ExternalLink,
  Flame,
  ShieldCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenOrbModal: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onOpenOrbModal,
}) => {
  const [frequencies, setFrequencies] = useState<number[]>([
    25, 45, 80, 60, 95, 40, 70, 85, 30, 90, 65, 45, 75, 50, 85, 35
  ]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [voiceReportSent, setVoiceReportSent] = useState<boolean>(false);

  useEffect(() => {
    const audioInterval = setInterval(() => {
      setFrequencies(prev => 
        prev.map(() => Math.floor(Math.random() * 85) + 15)
      );
    }, 200);
    return () => clearInterval(audioInterval);
  }, []);

  const handleFetchMetrics = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleSendVoiceReport = () => {
    setVoiceReportSent(true);
    setTimeout(() => setVoiceReportSent(false), 3000);
  };

  const challenges = [
    { name: '75 Blind', status: 'Day 4', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', pct: 60 },
    { name: 'CodeNext', status: 'Day 4', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', pct: 55 },
    { name: 'Silly SaaS', status: 'Day 4', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', pct: 70 },
    { name: '1CR Agency', status: 'Day 3', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', pct: 40 },
    { name: 'Reddit Job', status: 'Active', color: 'text-sky-500 bg-sky-500/10 border-sky-500/20', pct: 85 },
    { name: 'Quora Q&A', status: 'Active', color: 'text-sky-500 bg-sky-500/10 border-sky-500/20', pct: 90 },
    { name: 'Dev.to', status: 'Active', color: 'text-sky-500 bg-sky-500/10 border-sky-500/20', pct: 75 },
    { name: 'Substack', status: 'Active', color: 'text-sky-500 bg-sky-500/10 border-sky-500/20', pct: 65 },
    { name: 'Shorts/Reels', status: 'Active', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', pct: 80 },
    { name: 'X Threads', status: 'Active', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', pct: 95 },
  ];

  const recentActivities = [
    { platform: 'X (Twitter)', action: 'Posted thread: "Building Sovereign AI on Termux"', time: '14m ago', status: 'Verified' },
    { platform: 'LinkedIn', action: 'Published technical breakdown: Local Hermes-3', time: '1h ago', status: 'Verified' },
    { platform: 'Reddit', action: 'Staged post in r/LocalLLaMA for HITL review', time: '3h ago', status: 'Staged' },
    { platform: 'Dev.to', action: 'Drafted 8-node LangGraph orchestration guide', time: '5h ago', status: 'Published' },
  ];

  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 overflow-y-auto">
      {/* Top Banner Notice */}
      <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span className="text-sm font-semibold text-[var(--color-primary)]">
            Station 01 — Operational Overview & Live Telemetry
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 font-medium">
            Sovereign Dispatch: Active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleFetchMetrics}
            disabled={isRefreshing}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--color-border)] text-[var(--color-text)] flex items-center gap-1.5 transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[var(--color-accent)]' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Fetch Metrics'}</span>
          </button>
          <button
            onClick={handleSendVoiceReport}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[#18181b] flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{voiceReportSent ? 'Report Dispatched!' : 'Send Voice Report'}</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Bento Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1 */}
        <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] flex flex-col justify-between shadow-xs hover:border-[var(--color-text-dim)] transition-all">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-dim)] font-medium">
            <span>Total Posts Dispatched</span>
            <BarChart3 className="w-4 h-4 text-[var(--color-accent)]" />
          </div>
          <div className="my-2.5">
            <div className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--color-primary)]">
              147
            </div>
            <div className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% from last cycle</span>
            </div>
          </div>
          <div className="w-full bg-[var(--bg-surface)] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[var(--color-accent)] h-full rounded-full w-[78%]" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] flex flex-col justify-between shadow-xs hover:border-[var(--color-text-dim)] transition-all">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-dim)] font-medium">
            <span>Connected Platforms</span>
            <Globe2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2.5">
            <div className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--color-primary)]">
              12 <span className="text-sm font-normal text-[var(--color-text-dim)]">/ 20</span>
            </div>
            <div className="text-xs text-sky-500 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>8 pending handshake</span>
            </div>
          </div>
          <div className="w-full bg-[var(--bg-surface)] h-1.5 rounded-full overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full w-[60%]" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] flex flex-col justify-between shadow-xs hover:border-[var(--color-text-dim)] transition-all">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-dim)] font-medium">
            <span>AI Drafts in Vault</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="my-2.5">
            <div className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--color-primary)]">
              89
            </div>
            <div className="text-xs text-purple-500 font-medium flex items-center gap-1 mt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+8 today in SQLite queue</span>
            </div>
          </div>
          <div className="w-full bg-[var(--bg-surface)] h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full w-[85%]" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] flex flex-col justify-between shadow-xs hover:border-[var(--color-text-dim)] transition-all">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-dim)] font-medium">
            <span>Golden Lint Pass Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2.5">
            <div className="text-2xl lg:text-3xl font-bold tracking-tight text-[var(--color-primary)]">
              94%
            </div>
            <div className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero AI slop detected</span>
            </div>
          </div>
          <div className="w-full bg-[var(--bg-surface)] h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-[94%]" />
          </div>
        </div>
      </div>

      {/* Main Center Stage: 10-Challenge Matrix + Tyler ASI Radar & Orb */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Col: 10-Challenge Matrix */}
        <div className="lg:col-span-6 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold text-[var(--color-primary)]">
                  10-Challenge Execution Matrix
                </span>
              </div>
              <span className="text-xs font-mono-code text-[var(--color-text-dim)]">
                Active Cohorts: 10/10
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {challenges.map((ch, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)]/70 flex flex-col gap-1.5 hover:border-[var(--color-accent)] transition-all"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--color-primary)]">{ch.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${ch.color}`}>{ch.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[var(--bg-card)] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[var(--color-accent)] h-full rounded-full"
                        style={{ width: `${ch.pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono-code text-[var(--color-text-dim)]">{ch.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Nav shortcut */}
          <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
            <span className="text-[var(--color-text-dim)]">Continuous Local Agent Pipeline</span>
            <button
              onClick={() => onNavigate('brain')}
              className="text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] flex items-center gap-1 font-semibold transition-colors"
            >
              <span>Configure Ingest Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Col: Tyler ASI Radar & Maskyy Orb Visualizer */}
        <div className="lg:col-span-6 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5 mb-2">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[var(--color-accent)] animate-pulse" />
              <span className="text-sm font-bold text-[var(--color-primary)]">
                Tyler ASI Radar & Acoustic Monitor
              </span>
            </div>
            <button
              onClick={onOpenOrbModal}
              className="text-xs px-2.5 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text)] font-medium transition-all"
            >
              Expand Orb HUD
            </button>
          </div>

          {/* Center Orb & Frequency Visualizer */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 my-2">
            {/* Maskyy Orb Interactive Element */}
            <div className="relative cursor-pointer group" onClick={onOpenOrbModal} title="Click to view full 4-state Maskyy Orb">
              <MaskyyOrb size="sm" showControls={false} />
              <div className="text-center mt-1 text-[10px] text-[var(--color-text-dim)] font-mono-code group-hover:text-[var(--color-accent)] transition-colors">
                [Orb: Harmonic Active]
              </div>
            </div>

            {/* Audio Waveform Oscillating Bars */}
            <div className="flex-1 w-full flex flex-col gap-2.5">
              <div className="text-xs font-semibold text-[var(--color-text-dim)] flex items-center justify-between">
                <span>Acoustic Frequency Matrix (Faster-Whisper)</span>
                <span className="text-[var(--color-accent)] font-mono-code font-medium">2.41 kHz Peak</span>
              </div>

              {/* Dynamic Bars */}
              <div className="h-16 bg-[var(--bg-surface)] border border-[var(--color-border)] rounded-lg p-2 flex items-end justify-between gap-1">
                {frequencies.map((f, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[var(--color-accent)] rounded-xs transition-all duration-150"
                    style={{
                      height: `${f}%`,
                      opacity: f > 70 ? 0.95 : 0.6,
                    }}
                  />
                ))}
              </div>

              {/* Live Deployment Progress Bar Gauges */}
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] font-mono-code mb-1">
                    <span className="text-[var(--color-text-dim)]">GitHub / Edge Auto-Deploy:</span>
                    <span className="font-semibold text-[var(--color-primary)]">68%</span>
                  </div>
                  <div className="w-full bg-[var(--bg-surface)] h-2 rounded-full overflow-hidden">
                    <div className="bg-[var(--color-accent)] h-full rounded-full w-[68%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-mono-code mb-1">
                    <span className="text-[var(--color-text-dim)]">Daily Challenge Progression:</span>
                    <span className="font-semibold text-emerald-500">85%</span>
                  </div>
                  <div className="w-full bg-[var(--bg-surface)] h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[85%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2.5 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-dim)] font-mono-code">
            <span>Runtime: Ubada // Snapdragon 8 Gen 2</span>
            <span className="text-emerald-500 font-semibold">Local Airlock: Secured</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity & Tactical Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Activity (Col 8) */}
        <div className="lg:col-span-8 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5 mb-3">
            <span className="text-sm font-bold text-[var(--color-primary)]">
              Dispatch Telemetry Log (Recent Events)
            </span>
            <button
              onClick={() => onNavigate('telemetry')}
              className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] flex items-center gap-1 font-semibold transition-colors"
            >
              <span>Full Telemetry Stream</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {recentActivities.map((act, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="px-2 py-0.5 rounded-md bg-[var(--bg-card)] text-[var(--color-primary)] border border-[var(--color-border)] font-semibold text-[10px] shrink-0">
                    {act.platform}
                  </span>
                  <span className="text-[var(--color-text)] font-medium truncate">
                    {act.action}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-[11px] text-[var(--color-text-dim)] font-mono-code">{act.time}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-semibold">
                    {act.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Quick Actions (Col 4) */}
        <div className="lg:col-span-4 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="border-b border-[var(--color-border)] pb-2.5 mb-3">
              <span className="text-sm font-bold text-[var(--color-primary)]">
                Workstation Navigation
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => onNavigate('brain')}
                className="w-full p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text)] flex items-center justify-between text-xs font-medium transition-all shadow-xs group"
              >
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[var(--color-accent)]" />
                  <span>Generate Draft (Brain Swarm)</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('review')}
                className="w-full p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text)] flex items-center justify-between text-xs font-medium transition-all shadow-xs group"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Post Now (HITL Approval Gate)</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('schedule')}
                className="w-full p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text)] flex items-center justify-between text-xs font-medium transition-all shadow-xs group"
              >
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-sky-500" />
                  <span>Schedule Queue (SQLite Matrix)</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('vision')}
                className="w-full p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text)] flex items-center justify-between text-xs font-medium transition-all shadow-xs group"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>Vision & Carousel Deck (Qwen)</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-[var(--color-text-dim)] text-center font-mono-code">
            Sovereign Creator Stack // Zero Auto-Post Gate
          </div>
        </div>
      </div>
    </div>
  );
};
