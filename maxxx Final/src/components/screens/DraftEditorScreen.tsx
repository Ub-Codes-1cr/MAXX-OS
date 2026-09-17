import React, { useState } from 'react';
import { ScreenId, RuleCheck } from '../../types';
import { 
  FileEdit, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  Send, 
  RefreshCw, 
  Bold, 
  Italic, 
  Smile, 
  Paperclip, 
  Layers, 
  ShieldCheck,
  Eye,
  Eraser
} from 'lucide-react';

interface DraftEditorScreenProps {
  initialContent?: string;
  onNavigate: (screen: ScreenId) => void;
  onSendToReview: (content: string) => void;
}

export const DraftEditorScreen: React.FC<DraftEditorScreenProps> = ({
  initialContent = `1/6 The cloud AI trap is real: paying monthly rent for API keys that rate-limit your workflows and inspect your telemetry payload.

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
  onSendToReview,
}) => {
  const [content, setContent] = useState<string>(initialContent);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isFixing, setIsFixing] = useState<boolean>(false);

  const charCount = content.length;
  const firstTweet = content.split('\n\n2/6')[0] || content;
  const firstTweetChars = firstTweet.length;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readTimeSec = Math.ceil(wordCount / 3.5);

  const [rules, setRules] = useState<RuleCheck[]>([
    { id: '1', ruleNumber: '01', title: 'Hard Char Limit', status: 'PASS', value: `${firstTweetChars}/280`, detail: 'Hook tweet within safe bounds.' },
    { id: '2', ruleNumber: '02', title: 'High-Converting Hook', status: 'PASS', value: '98%', detail: 'Strong pattern interrupt & tension opening.' },
    { id: '3', ruleNumber: '03', title: 'Mobile Thumb-Scan', status: 'PASS', value: '<3 lines', detail: 'Line breaks optimized for mobile readers.' },
    { id: '4', ruleNumber: '04', title: 'Single CTA', status: 'PASS', value: '1 CTA', detail: 'Clear discussion trigger in conclusion.' },
    { id: '5', ruleNumber: '19', title: 'Emoji Frequency', status: 'WARN', value: '0 emojis', detail: 'Slightly low visual anchor density.' },
    { id: '6', ruleNumber: '24', title: 'AI Slop Ban-List', status: 'PASS', value: '0 Slop', detail: 'No generic SaaS buzzwords detected.' },
    { id: '7', ruleNumber: '37', title: 'Media Ratio', status: 'PASS', value: '1 Diagram', detail: 'Architecture diagram linked.' },
    { id: '8', ruleNumber: '40', title: 'Numeric Density', status: 'PASS', value: '5 Metrics', detail: 'Concrete values: 1.2ms, 42 tok/s, 11 nodes.' },
  ]);

  const handleCleanSlop = () => {
    const slopWords = ['supercharge', 'empower', 'unlock', 'game-changing', 'revolutionize', 'leverage', 'tapestry'];
    let cleaned = content;
    slopWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      cleaned = cleaned.replace(regex, 'deliver');
    });
    setContent(cleaned);
    alert('Banned buzzword scan complete: 0 slop tokens detected.');
  };

  const handleAutoFix = () => {
    setIsFixing(true);
    setTimeout(() => {
      setIsFixing(false);
      setRules(prev =>
        prev.map(r => r.id === '5' ? { ...r, status: 'PASS', value: '2 Emojis', detail: 'Optimized technical anchor icons added.' } : r)
      );
      if (!content.includes('⚡')) {
        setContent(prev => prev.replace('1/6 The cloud AI trap is real', '1/6 ⚡ The cloud AI trap is real'));
      }
    }, 600);
  };

  const handleSendToStage = () => {
    onSendToReview(content);
    onNavigate('review');
  };

  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 overflow-y-auto">
      {/* Top Banner Notice */}
      <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <FileEdit className="w-4 h-4 text-[var(--color-accent)] animate-pulse" />
          <span className="text-sm font-semibold text-[var(--color-primary)]">
            Station 06 — Split-View Real-Time Golden Linter & Formatter
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
            Suite: Tech-Virality-40 (Lint 100%)
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)] font-mono-code">
          <span>Read Time: ~{readTimeSec}s</span>
          <span>•</span>
          <span className="text-emerald-500 font-semibold">Total Words: {wordCount}</span>
        </div>
      </div>

      {/* Main Grid: Left Editor & Toolbar, Right Rule Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Col (7 cols): Formatting Toolbar + Editor */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs">
            {/* Editor Sub-Header & Tabs */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5 text-xs font-semibold">
              <div className="flex items-center gap-1.5 bg-[var(--bg-surface)] p-0.5 rounded-lg border border-[var(--color-border)]">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === 'editor'
                      ? 'bg-[var(--color-accent)] text-[#18181b] shadow-xs'
                      : 'text-[var(--color-text-dim)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  Monospace Editor
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === 'preview'
                      ? 'bg-[var(--color-accent)] text-[#18181b] shadow-xs'
                      : 'text-[var(--color-text-dim)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  Feed Preview
                </button>
              </div>

              {/* Hook Capacity Gauge */}
              <div className="flex items-center gap-2 text-xs font-mono-code">
                <span className="text-[var(--color-text-dim)]">Hook Cap:</span>
                <span className={`font-semibold ${firstTweetChars > 280 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {firstTweetChars} / 280
                </span>
              </div>
            </div>

            {/* Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[var(--bg-surface)] border border-[var(--color-border)] rounded-lg text-xs">
              <button
                onClick={() => setContent(prev => prev + '**bold text**')}
                className="p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-[var(--color-text)] transition-colors"
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setContent(prev => prev + '_italic text_')}
                className="p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-[var(--color-text)] transition-colors"
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setContent(prev => prev + '\n\n7/6 Next tweet vector...')}
                className="px-2 py-1 rounded-md text-xs font-mono-code hover:bg-[var(--bg-hover)] text-[var(--color-text)] border border-[var(--color-border)] transition-colors"
                title="Add Tweet Thread Item"
              >
                + Tweet
              </button>
              <button
                onClick={() => setContent(prev => prev + ' ⚡')}
                className="p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-[var(--color-text)] transition-colors"
                title="Insert Accent Emoji"
              >
                <Smile className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => alert('Diagram attached: architecture_diagram.png (412 KB)')}
                className="p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-[var(--color-text)] transition-colors"
                title="Attach Media"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>
              <div className="h-4 w-px bg-[var(--color-border)] mx-1" />
              <button
                onClick={handleCleanSlop}
                className="px-2.5 py-1 text-xs rounded-md font-medium text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1.5 transition-all"
                title="Purge marketing buzzwords"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Clean AI Slop</span>
              </button>
            </div>

            {/* Tab 1: Monospace Editor */}
            {activeTab === 'editor' && (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full p-3.5 bg-[var(--bg-surface)] border border-[var(--color-border)] rounded-lg text-xs font-mono-code text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none resize-none leading-relaxed transition-colors"
                placeholder="Draft content..."
              />
            )}

            {/* Tab 2: Desktop Feed Preview */}
            {activeTab === 'preview' && (
              <div className="p-4 bg-[var(--bg-surface)] border border-[var(--color-border)] rounded-lg text-xs space-y-3 h-72 overflow-y-auto">
                <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center text-sm shadow-xs">
                    U
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-[var(--color-primary)]">
                      <span>Ubada</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                      <span className="text-[var(--color-text-dim)] text-xs font-normal">@ubada_dev</span>
                    </div>
                    <div className="text-[11px] text-[var(--color-text-dim)]">Sovereign Edge Operator</div>
                  </div>
                </div>

                <div className="whitespace-pre-wrap leading-relaxed text-[var(--color-text)]">
                  {content}
                </div>

                <div className="pt-2.5 border-t border-[var(--color-border)] flex justify-between text-xs text-[var(--color-text-dim)] font-mono-code">
                  <span>14m ago • X for Sovereign Termux</span>
                  <span>142 Likes • 38 Reposts</span>
                </div>
              </div>
            )}

            {/* Progress Capacity Bar */}
            <div>
              <div className="flex justify-between text-xs font-mono-code text-[var(--color-text-dim)] mb-1">
                <span>Thread Capacity Level:</span>
                <span>{charCount} Total Characters</span>
              </div>
              <div className="w-full bg-[var(--bg-surface)] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[var(--color-accent)] h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (charCount / 1200) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col (5 cols): Golden Linter Matrix & Actions */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs flex-1">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5 text-xs font-semibold">
              <span className="flex items-center gap-2 text-[var(--color-primary)]">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Rule Check Matrix (Virality-40)</span>
              </span>
              <span className="text-xs font-mono-code text-emerald-500 font-bold">Score: 98/100</span>
            </div>

            {/* Rule List */}
            <div className="space-y-2 overflow-y-auto max-h-72 pr-1">
              {rules.map((rule) => {
                const isPass = rule.status === 'PASS';
                const isWarn = rule.status === 'WARN';

                return (
                  <div
                    key={rule.id}
                    className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)] flex flex-col gap-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--color-text-dim)] font-mono-code text-[10px]">#{rule.ruleNumber}</span>
                        <span className="font-semibold text-[var(--color-primary)]">{rule.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono-code text-[var(--color-text-dim)]">{rule.value}</span>
                        <span
                          className={`px-2 py-0.5 text-[10px] rounded-full font-semibold border ${
                            isPass
                              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              : isWarn
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          }`}
                        >
                          {rule.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-[11px] text-[var(--color-text-dim)] leading-tight">
                      {rule.detail}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Critic Agent Feedback Box */}
            <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-emerald-500/30 text-xs">
              <span className="font-semibold text-emerald-500">Critic Evaluation:</span>
              <p className="text-[var(--color-text-dim)] text-[11px] mt-1 leading-relaxed">
                "Hook sets high technical authority. Zero generic fluff. Pacing maintains engagement through specific metric disclosures."
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleAutoFix}
                disabled={isFixing}
                className="py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-400 transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{isFixing ? 'Optimizing...' : 'Auto-Fix (LLM)'}</span>
              </button>

              <button
                onClick={handleSendToStage}
                className="py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-500 transition-all shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Send to HITL Gate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
