import React, { useState } from 'react';
import { ScreenId } from '../../types';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  RotateCcw, 
  Play, 
  ExternalLink, 
  Share2, 
  Lock, 
  Cpu, 
  Sliders
} from 'lucide-react';

interface ReviewPostScreenProps {
  draftContent?: string;
  onNavigate: (screen: ScreenId) => void;
}

export const ReviewPostScreen: React.FC<ReviewPostScreenProps> = ({
  draftContent = `1/6 ⚡ The cloud AI trap is real: paying monthly rent for API keys that rate-limit your workflows and inspect your telemetry payload.

Here is how we built a sovereign 11-node LangGraph multi-agent swarm running 100% local on edge hardware:

2/6 Architecture stack:
- Hardware: Snapdragon 8 Gen 2 / Termux A13
- Core Runtime: Hermes-3 8B (4-bit GGUF via Ollama)
- Orchestration: Cyclic LangGraph state graph
- Local Bus: /tmp/swarm_bus.sock with zero egress leaks

3/6 Why cyclic multi-agent graphs beat single-prompt generation:
When Agent 03 (Synth Writer) outputs a draft, Agent 04 (Eval Critic) audits for AI slop and character constraints. If score < 95, a reflection edge loops it back instantly.

4/6 Latency benchmarks:
- Local IPC socket ping: 1.2ms
- Inference: 42 tokens/sec
- Total pipeline execution: 8.4s end-to-end
Zero cloud roundtrips. Zero recurring API invoices.

5/6 Rule #01 of Sovereign Operation: ZERO AUTO-POSTING.
Every draft terminates at Gate://HITL-Staging for human inspection. Playwright emulates human typing vectors only upon biometric confirmation.

6/6 The future of AI isn't centralized megaclouds. It's autonomous local swarms that you actually own.`,
  onNavigate,
}) => {
  const [activePlatform, setActivePlatform] = useState<'X' | 'LINKEDIN' | 'REDDIT' | 'DEVTO'>('X');
  const [isStaging, setIsStaging] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [pipelineStep, setPipelineStep] = useState<number>(4); // Step 5: HITL Gate

  const [playwrightLogs, setPlaywrightLogs] = useState<string[]>([
    '[00:01.12] [PLAYWRIGHT] Initialized Chromium sandbox [pid 8412] in Termux isolate.',
    '[00:02.45] [NAVIGATE] Routed to target DOM endpoint: https://x.com/compose/post',
    '[00:03.90] [BEZIER] Generated 12-waypoint natural human mouse trajectory curve.',
    '[00:05.18] [JITTER] Injected typing variance (40-80ms per keystroke).',
    '[00:06.84] [UPLOAD] Attached local buffer: architecture_diagram.png [412 KB].',
    '[00:07.02] [HITL_INTERCEPT] ZERO AUTO-POSTING TRIGGERED. Execution halted at human authorization gate.'
  ]);

  const handleApprove = () => {
    setIsStaging(true);
    setPlaywrightLogs(prev => [
      ...prev,
      `[${new Date().toISOString().substring(14, 22)}] [SOVEREIGN_AUTH] Operator biometric / manual click verified.`,
      `[${new Date().toISOString().substring(14, 22)}] [DISPATCH] Committing payload to ${activePlatform} DOM target...`,
      `[${new Date().toISOString().substring(14, 22)}] [SUCCESS] Broadcast staged & published with zero telemetry leaks!`
    ]);

    setTimeout(() => {
      setIsStaging(false);
      setIsApproved(true);
      setPipelineStep(6);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReject = () => {
    onNavigate('draft');
  };

  const pipelineStages = [
    { num: 1, label: 'Launch' },
    { num: 2, label: 'Navigate' },
    { num: 3, label: 'Typed' },
    { num: 4, label: 'Upload' },
    { num: 5, label: 'HITL Gate' },
    { num: 6, label: 'Post' },
  ];

  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 overflow-y-auto">
      {/* Top Banner Notice */}
      <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="text-sm font-semibold text-[var(--color-primary)]">
            Station 07 — Gate://HITL-Staging • Human Authorization Intercept
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-medium">
            Zero Auto-Posting Enforced
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)] font-mono-code">
          <span className="text-emerald-500">Playwright Reverse-Proxy</span>
          <span>•</span>
          <span className="text-[var(--color-accent)] font-semibold">Directive 001-Alpha</span>
        </div>
      </div>

      {/* Main Grid: Left Social Preview Stage, Right Playwright Engine & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Col (7 cols): High-Fidelity Client Preview */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs">
            {/* Platform Selection Tabs */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5 text-xs font-semibold">
              <span className="text-[var(--color-text-dim)]">Target Dispatch Canvas:</span>
              <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-0.5 rounded-lg border border-[var(--color-border)]">
                {(['X', 'LINKEDIN', 'REDDIT', 'DEVTO'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setActivePlatform(p)}
                    className={`px-3 py-0.5 text-xs font-semibold rounded-md transition-all ${
                      activePlatform === p
                        ? 'bg-[var(--color-accent)] text-[#18181b] shadow-xs'
                        : 'text-[var(--color-text-dim)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* High-Fidelity Post Canvas */}
            <div className="p-4 bg-[var(--bg-surface)] border border-[var(--color-border)] rounded-xl flex flex-col gap-3 text-xs leading-relaxed shadow-xs">
              {/* User Avatar & Identification */}
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center text-sm shadow-xs">
                    U
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-[var(--color-primary)]">
                      <span>Ubada</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                      <span className="text-[var(--color-text-dim)] text-xs font-normal">@ubada_dev</span>
                    </div>
                    <div className="text-[11px] text-[var(--color-text-dim)]">
                      Dispatched from Sovereign Termux Node // No Cloud Telemetry
                    </div>
                  </div>
                </div>
                <div className="text-[11px] px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 font-semibold font-mono-code">
                  HITL Staged
                </div>
              </div>

              {/* Rendered Post Body */}
              <div className="whitespace-pre-wrap text-[var(--color-text)] py-1 max-h-56 overflow-y-auto font-sans text-xs leading-relaxed">
                {draftContent}
              </div>

              {/* Attached Media Frame */}
              <div className="p-2.5 bg-[var(--bg-card)] border border-dashed border-[var(--color-border)] rounded-lg flex items-center justify-between text-xs font-mono-code">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 text-[10px] font-bold">
                    PNG
                  </div>
                  <span className="text-[var(--color-primary)] font-medium">
                    architecture_diagram.png
                  </span>
                  <span className="text-[var(--color-text-dim)]">[412.8 KB]</span>
                </div>
                <span className="text-emerald-500 font-semibold text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">Attached</span>
              </div>

              {/* Engagement Emulation Bar */}
              <div className="pt-2 border-t border-[var(--color-border)] flex justify-between text-[11px] text-[var(--color-text-dim)] font-mono-code">
                <span>Replies (Enabled)</span>
                <span>Retweets (HITL)</span>
                <span>Viral Hook: 98%</span>
                <span>No Trackers</span>
              </div>
            </div>
          </div>

          {/* Playwright Headless Terminal Stream */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2 text-xs font-semibold">
              <span className="flex items-center gap-2 text-[var(--color-primary)]">
                <Terminal className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span>Playwright Headless Driver STDOUT/STDERR</span>
              </span>
              <span className="text-emerald-500 text-xs font-mono-code">PID: 8412 [Sandboxed]</span>
            </div>

            <div className="p-3 bg-[var(--bg-surface)] border border-[var(--color-border)] rounded-lg text-xs font-mono-code text-[var(--color-text)] h-28 overflow-y-auto space-y-1 leading-relaxed">
              {playwrightLogs.map((line, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-emerald-500 shrink-0">»</span>
                  <span className="break-all">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col (5 cols): Playwright Engine Controls & Sovereign Auth */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Dispatch Vector Pipeline Stepper */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs">
            <div className="border-b border-[var(--color-border)] pb-2 text-xs font-semibold text-[var(--color-primary)]">
              Dispatch Vector Pipeline State
            </div>

            <div className="grid grid-cols-6 gap-1.5">
              {pipelineStages.map((st) => {
                const isCurrent = pipelineStep === st.num;
                const isDone = pipelineStep > st.num;

                return (
                  <div
                    key={st.num}
                    className={`p-2 rounded-lg border text-center text-xs font-mono-code transition-all ${
                      isCurrent
                        ? 'bg-amber-500/20 text-amber-500 border-amber-500/50 font-bold shadow-xs'
                        : isDone
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-medium'
                        : 'bg-[var(--bg-surface)] text-[var(--color-text-dim)] border-[var(--color-border)]'
                    }`}
                  >
                    <div className="text-[10px] opacity-70">0{st.num}</div>
                    <div className="truncate font-semibold">{st.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Anti-Telemetry Behavioral Emulation Shield */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs">
            <div className="border-b border-[var(--color-border)] pb-2 text-xs font-semibold flex justify-between">
              <span className="text-[var(--color-primary)]">Anti-Telemetry & Behavioral Shield</span>
              <span className="text-emerald-500 text-xs font-semibold">Active</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono-code">
              <div className="flex justify-between p-2 rounded-md bg-[var(--bg-surface)] border border-[var(--color-border)]">
                <span className="text-[var(--color-text-dim)]">Keystroke Jitter:</span>
                <span className="font-semibold text-emerald-500">40-80ms Human Variance</span>
              </div>
              <div className="flex justify-between p-2 rounded-md bg-[var(--bg-surface)] border border-[var(--color-border)]">
                <span className="text-[var(--color-text-dim)]">Bezier Mouse Curve:</span>
                <span className="font-semibold text-sky-500">12 Natural Waypoints</span>
              </div>
              <div className="flex justify-between p-2 rounded-md bg-[var(--bg-surface)] border border-[var(--color-border)]">
                <span className="text-[var(--color-text-dim)]">Canvas Fingerprint:</span>
                <span className="font-semibold text-purple-400">Isolated Off-Screen</span>
              </div>
              <div className="flex justify-between p-2 rounded-md bg-[var(--bg-surface)] border border-[var(--color-border)]">
                <span className="text-[var(--color-text-dim)]">IP Routing:</span>
                <span className="font-semibold text-emerald-500">Local Residential Mesh</span>
              </div>
            </div>
          </div>

          {/* Sovereign Authorization Protocol Buttons */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs flex-1">
            <div className="border-b border-[var(--color-border)] pb-2 text-xs font-semibold text-amber-500 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4" />
              <span>Sovereign Authorization Protocol</span>
            </div>

            <p className="text-xs text-[var(--color-text-dim)] leading-relaxed">
              Directive 001-Alpha strictly forbids unconfirmed autonomous publishing. You must explicitly execute authorization below:
            </p>

            <div className="flex flex-col gap-2.5 mt-auto pt-2">
              {/* Button 1: Approve */}
              <button
                onClick={handleApprove}
                disabled={isStaging || isApproved}
                className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-md active:translate-y-0.5 ${
                  isApproved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[#18181b]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isApproved
                    ? 'Post Published to Dispatch Target'
                    : isStaging
                    ? 'Staging Through Playwright Reverse-Proxy...'
                    : 'Approve & Launch Browser for Staging'}
                </span>
              </button>

              {/* Button 2: Copy to Clipboard */}
              <button
                onClick={handleCopy}
                className="py-2.5 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text)] flex items-center justify-center gap-2 text-xs font-medium transition-all shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard (Nuclear Fallback)'}</span>
              </button>

              {/* Button 3: Reject & Return */}
              <button
                onClick={handleReject}
                className="py-2.5 px-3 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center gap-2 text-xs font-medium transition-all shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reject & Return (Revert to Draft Lint)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
