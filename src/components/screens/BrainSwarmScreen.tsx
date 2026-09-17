import React, { useState } from 'react';
import { ScreenId } from '../../types';
import { 
  BrainCircuit, 
  Play, 
  RotateCw, 
  Cpu, 
  CheckCircle, 
  Layers, 
  Sparkles, 
  Terminal, 
  Copy, 
  Check, 
  ShieldCheck, 
  Flame, 
  ExternalLink,
  Sliders,
  Share2
} from 'lucide-react';

interface BrainSwarmScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSendToDraft: (content: string) => void;
}

export const BrainSwarmScreen: React.FC<BrainSwarmScreenProps> = ({
  onNavigate,
  onSendToDraft,
}) => {
  const [prompt, setPrompt] = useState<string>(
    'Synthesize a punchy technical breakdown of running local AI swarms on edge hardware (Termux + Ollama + LangGraph) with zero cloud telemetry dependencies. Highlight latency under 15ms and private sovereign IPC bus.'
  );
  const [skillMask, setSkillMask] = useState<string>('x-thread-builder');
  const [division, setDivision] = useState<'TECH' | 'MEDIA' | 'MAFIA' | 'SAAS'>('TECH');
  const [model, setModel] = useState<string>('Hermes-3 8B');
  const [temperature, setTemperature] = useState<number>(0.2);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [activeNode, setActiveNode] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    'X (Twitter)', 'LinkedIn', 'Dev.to', 'Reddit', 'Substack'
  ]);

  const allChannels = [
    'X (Twitter)', 'LinkedIn', 'Dev.to', 'Reddit', 'Substack', 'YT Shorts',
    'GitHub', 'Discord', 'HackerNews', 'Telegram', 'Mastodon', 'Quora',
    'Medium', 'Threads', 'TikTok', 'Instagram', 'Product Hunt', 'Bluesky',
    'Lemmy', 'Nostr'
  ];

  const toggleChannel = (channel: string) => {
    setSelectedChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel) 
        : [...prev, channel]
    );
  };

  const samplePresets = [
    'Analyze Local LLM quantization benchmarks on Snapdragon 8 Gen 2',
    'Break down zero-leak Termux architecture with SQLite state store',
    'Craft high-conversion launch thread for sovereign media pipeline',
    'Generate technical manifesto on decentralized AI autonomy'
  ];

  const generatedOutput = `1/6 The cloud AI trap is real: paying monthly rent for API keys that rate-limit your workflows and inspect your telemetry payload.

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

6/6 The future of AI isn't centralized megaclouds. It's autonomous local swarms that you actually own.

Drop your questions on edge quantization below. Full architecture diagrams in bio.`;

  const handleExecute = () => {
    setIsExecuting(true);
    setActiveNode(1);

    // Simulate cyclic 5-node swarm pipeline
    const timers = [
      setTimeout(() => setActiveNode(2), 600),
      setTimeout(() => setActiveNode(3), 1200),
      setTimeout(() => setActiveNode(4), 1800),
      setTimeout(() => setActiveNode(5), 2400),
      setTimeout(() => {
        setIsExecuting(false);
        setActiveNode(5);
      }, 3000)
    ];

    return () => timers.forEach(clearTimeout);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePushToEditor = () => {
    onSendToDraft(generatedOutput);
    onNavigate('draft');
  };

  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 overflow-y-auto">
      {/* Top Banner Notice */}
      <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <BrainCircuit className="w-4 h-4 text-[var(--color-accent)] animate-pulse" />
          <span className="text-sm font-semibold text-[var(--color-primary)]">
            Station 02 — LangGraph Multi-Agent Swarm Orchestrator
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
            11 Nodes Synced
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)] font-mono-code">
          <span>Cyclic State Graph</span>
          <span>•</span>
          <span className="text-[var(--color-accent)] font-semibold">Loop Iter #04/08</span>
        </div>
      </div>

      {/* Grid: Left Prompt & Tuning Controls, Right Output & Critic Flank */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Col (7 cols): Input & Tuning Matrix */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Prompt Directives Box */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between text-xs border-b border-[var(--color-border)] pb-2 font-semibold">
              <span className="flex items-center gap-2 text-[var(--color-primary)]">
                <Terminal className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span>Agent Command Directive (STDIN)</span>
              </span>
              <span className="text-[11px] text-[var(--color-text-dim)] font-mono-code">Whisper Ingest Armed</span>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full p-3 bg-[var(--bg-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] text-xs focus:border-[var(--color-accent)] outline-none resize-none leading-relaxed transition-colors font-mono-code"
              placeholder="Enter high-voltage synthesis directive..."
            />

            {/* Quick Prompt Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-[var(--color-text-dim)] font-semibold uppercase tracking-wider mr-1">Presets:</span>
              {samplePresets.map((pr, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(pr)}
                  className="text-xs px-2.5 py-1 rounded-md border border-[var(--color-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text-dim)] hover:text-[var(--color-primary)] transition-all truncate max-w-[220px]"
                >
                  {pr}
                </button>
              ))}
            </div>
          </div>

          {/* Tuning Matrix: Skills, Division, Model, Temp */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between text-xs border-b border-[var(--color-border)] pb-2 font-semibold">
              <span className="flex items-center gap-2 text-[var(--color-primary)]">
                <Sliders className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span>Swarm Tuning & Specialization Matrix</span>
              </span>
              <span className="text-emerald-500 text-xs font-medium">Local Airlock Active</span>
            </div>

            {/* Skill Mask Selector */}
            <div>
              <div className="text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
                Select Skill Mask:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'x-thread-builder', name: 'X Thread Builder', subtitle: 'Dense viral hook' },
                  { id: 'linkedin-post-writer', name: 'LinkedIn Writer', subtitle: 'B2B architecture' },
                  { id: 'devto-technical-deepdive', name: 'Dev.to Deepdive', subtitle: 'System design' },
                  { id: 'substack-manifesto', name: 'Substack Manifesto', subtitle: 'Long-form narrative' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSkillMask(s.id)}
                    className={`p-2.5 rounded-lg text-left border transition-all ${
                      skillMask === s.id
                        ? 'bg-[var(--color-accent)]/15 border-[var(--color-accent)] text-[var(--color-primary)] font-semibold shadow-xs'
                        : 'bg-[var(--bg-surface)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <div className="text-xs font-semibold">{s.name}</div>
                    <div className="text-[10px] text-[var(--color-text-dim)]">{s.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Division Selector & Local Model */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
                  Tactical Division:
                </div>
                <div className="flex gap-1 bg-[var(--bg-surface)] p-0.5 rounded-lg border border-[var(--color-border)]">
                  {(['TECH', 'MEDIA', 'MAFIA', 'SAAS'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDivision(d)}
                      className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all ${
                        division === d
                          ? 'bg-[var(--color-accent)] text-[#18181b] shadow-xs'
                          : 'text-[var(--color-text-dim)] hover:text-[var(--color-primary)]'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
                  Local Runtime Model:
                </div>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full p-1.5 bg-[var(--bg-surface)] border border-[var(--color-border)] rounded-lg text-xs font-mono-code text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)] transition-colors"
                >
                  <option value="Hermes-3 8B">Hermes-3 8B (4-bit GGUF)</option>
                  <option value="Qwen-2.5 14B">Qwen-2.5 14B (Q4_K_M)</option>
                  <option value="DeepSeek-Coder 6.7B">DeepSeek-Coder 6.7B</option>
                </select>
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-xs font-medium text-[var(--color-text-dim)] mb-1.5">
                <span>Temperature (Strictness):</span>
                <span className="text-[var(--color-accent)] font-mono-code">{temperature.toFixed(2)} [Deterministic]</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[var(--color-accent)] cursor-pointer"
              />
            </div>
          </div>

          {/* 20 Target Channels Selector */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-2.5 shadow-xs">
            <div className="flex items-center justify-between text-xs border-b border-[var(--color-border)] pb-2 font-semibold">
              <span className="flex items-center gap-2 text-[var(--color-primary)]">
                <Share2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Dispatch Target Channels (20 Platforms)</span>
              </span>
              <span className="text-sky-500 text-xs font-mono-code">
                Selected: {selectedChannels.length}/20
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-[var(--bg-surface)] border border-[var(--color-border)] rounded-lg">
              {allChannels.map((ch) => {
                const isSelected = selectedChannels.includes(ch);
                return (
                  <button
                    key={ch}
                    onClick={() => toggleChannel(ch)}
                    className={`px-2 py-1 text-xs rounded-md border transition-all ${
                      isSelected
                        ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] border-[var(--color-accent)]/40 font-semibold'
                        : 'bg-[var(--bg-card)] text-[var(--color-text-dim)] border-[var(--color-border)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{ch}
                  </button>
                );
              })}
            </div>
          </div>

          {/* High Voltage Action Trigger Button */}
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[#18181b] shadow-md transition-all active:translate-y-0.5"
          >
            {isExecuting ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Cycling 11 LangGraph Nodes // Synthesizing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Generate & Lint Draft (Trigger Swarm)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Col (5 cols): Cyclic State Machine Visualizer + STDOUT + Critic Audit */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Cyclic State Machine Node Visualizer */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-2.5 shadow-xs">
            <div className="flex items-center justify-between text-xs border-b border-[var(--color-border)] pb-2 font-semibold">
              <span className="flex items-center gap-2 text-[var(--color-primary)]">
                <Cpu className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span>Cyclic State Machine Visualizer</span>
              </span>
              <span className="text-xs font-mono-code text-emerald-500 font-semibold">14.2ms Local</span>
            </div>

            {/* 5-Step Node Path */}
            <div className="flex flex-col gap-1.5 py-1">
              {[
                { step: 1, name: '01. Ingest Router', role: 'Whisper + Vision parser' },
                { step: 2, name: '02. Query Researcher', role: 'Vector search in SQLite' },
                { step: 3, name: '03. Synth Writer', role: 'Hermes-3 draft generation' },
                { step: 4, name: '04. Eval Critic', role: 'Slop & viral audit filter' },
                { step: 5, name: '05. Verify Linter', role: 'Reflection edge to HITL' },
              ].map((n) => {
                const isActive = activeNode === n.step;
                const isDone = activeNode > n.step;

                return (
                  <div
                    key={n.step}
                    className={`p-2 rounded-lg border text-xs font-mono-code flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-[var(--color-accent)] text-[#18181b] border-[var(--color-accent)] font-semibold shadow-xs'
                        : isDone
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-[var(--bg-surface)] text-[var(--color-text-dim)] border-[var(--color-border)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-current" />
                      <span>{n.name}</span>
                    </div>
                    <span className="text-[10px] opacity-80">{n.role}</span>
                  </div>
                );
              })}
            </div>
            <div className="text-[10px] font-mono-code text-[var(--color-text-dim)] text-right">
              Reflection edge: Hook Score &gt; 95 && Slop == 0
            </div>
          </div>

          {/* STDOUT Stream Buffer */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-2.5 shadow-xs flex-1">
            <div className="flex items-center justify-between text-xs border-b border-[var(--color-border)] pb-2 font-semibold">
              <span className="flex items-center gap-2 text-[var(--color-primary)]">
                <Terminal className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span>Live STDOUT Buffer (Markdown)</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-md border border-[var(--color-border)] hover:bg-[var(--bg-hover)] text-[var(--color-text)] transition-colors"
                  title="Copy STDOUT to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-[var(--bg-surface)] border border-[var(--color-border)] rounded-lg text-xs font-mono-code text-[var(--color-text)] h-44 overflow-y-auto leading-relaxed whitespace-pre-wrap">
              {generatedOutput}
            </div>

            {/* Critic Agent Audit Flank */}
            <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-emerald-500/30 text-xs space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-emerald-500">Critic Agent Audit: Passed</span>
                <span className="text-emerald-500 font-mono-code">98/100 Viral Hook</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[var(--color-text-dim)] pt-1 border-t border-[var(--color-border)]">
                <div>Tone: Sovereign Tech</div>
                <div>Chars: 242/280 (Safe)</div>
                <div>Slop Detected: 0 words</div>
                <div>Security Leaks: 0</div>
              </div>
            </div>

            {/* Routing Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handlePushToEditor}
                className="py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--color-border)] text-[var(--color-primary)] transition-all shadow-xs"
              >
                <span>Push to Draft Lint</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('review')}
                className="py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-500 transition-all shadow-xs"
              >
                <span>Direct to HITL Stage</span>
                <ShieldCheck className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
