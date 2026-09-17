import React, { useState } from 'react';
import { ScreenId } from '../../types';
import { 
  Eye, 
  Upload, 
  Code, 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Image as ImageIcon,
  Cpu,
  Scan,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface VisionMediaScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSendToDraft: (content: string) => void;
}

export const VisionMediaScreen: React.FC<VisionMediaScreenProps> = ({
  onNavigate,
  onSendToDraft,
}) => {
  const [activeSample, setActiveSample] = useState<'arch' | 'bench' | 'terminal'>('arch');
  const [ocrExtracted, setOcrExtracted] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedManifest, setCopiedManifest] = useState<boolean>(false);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const pythonSnippet = `import httpx
import json

async def stream_sovereign_vision(image_bytes: bytes):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://127.0.0.1:11434/api/generate",
            json={
                "model": "qwen2-vl:7b",
                "prompt": "Extract UI bounding boxes and architectural blocks",
                "images": [image_bytes.hex()],
                "stream": True
            }
        )
        async for chunk in response.aiter_lines():
            payload = json.loads(chunk)
            print(payload.get("response", ""), end="", flush=True)`;

  const cognitiveManifest = {
    model: "qwen2-vl-7b-instruct",
    inference_time_sec: 8.42,
    detected_objects: [
      { label: "Terminal Window", confidence: 0.99, bbox: [20, 20, 360, 220] },
      { label: "Benchmark Matrix", confidence: 0.96, bbox: [200, 80, 480, 260] },
      { label: "Hardware Load HUD", confidence: 0.94, bbox: [20, 240, 480, 340] }
    ],
    ocr_tokens: 142,
    semantic_density: "HIGH_TECH_BENCHMARK"
  };

  const slides = [
    { num: '01', title: 'The Cloud Trap', desc: 'Paying monthly rent for throttled API quotas vs owning your hardware.' },
    { num: '02', title: 'Local Cognition', desc: 'Hermes-3 8B running 100% offline via Ollama GGUF on Termux.' },
    { num: '03', title: '11-Agent Swarm', desc: 'LangGraph cyclic state graph with reflection feedback loops.' },
    { num: '04', title: '42 T/S Benchmark', desc: 'Sub-15ms local IPC bus with zero telemetry leaks.' },
    { num: '05', title: 'Sovereign Runtime', desc: 'HITL Staging gate before autonomous Playwright dispatch.' },
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(JSON.stringify(cognitiveManifest, null, 2));
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  const handlePushToEditor = () => {
    const copyContent = `[VISION ARTIFACT // SLIDE 0${activeSlide + 1}]\n\n${slides[activeSlide].title}\n${slides[activeSlide].desc}\n\nKey takeaways extracted via Qwen2-VL Local Visual Director: 42 tok/s throughput on edge node.`;
    onSendToDraft(copyContent);
    onNavigate('draft');
  };

  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 overflow-y-auto">
      {/* Top Banner Notice */}
      <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Eye className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="text-sm font-semibold text-[var(--color-primary)]">
            Station 05 — Qwen2-VL Local Visual Director & Carousel Engine
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
            Qwen2-VL-7B-Instruct
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)] font-mono-code">
          <span>Local GPU: 8.4s</span>
          <span>•</span>
          <span className="text-emerald-500">VRAM: 5.8 / 12 GB</span>
        </div>
      </div>

      {/* Grid: Left Inspection Canvas, Right Cognitive Manifest & Carousels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Col (7 cols): Frame Inspection Stage */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Active Frame Stage */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between text-xs border-b border-[var(--color-border)] pb-2 font-semibold">
              <span className="flex items-center gap-2 text-[var(--color-primary)]">
                <Scan className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span>Active Frame Inspection Stage (Bounding Boxes)</span>
              </span>
              <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-0.5 rounded-lg border border-[var(--color-border)]">
                {(['arch', 'bench', 'terminal'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveSample(s)}
                    className={`px-2 py-0.5 text-xs font-semibold rounded-md uppercase transition-all ${
                      activeSample === s
                        ? 'bg-[var(--color-accent)] text-[#18181b] shadow-xs'
                        : 'text-[var(--color-text-dim)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Screen Emulation Canvas */}
            <div className="relative w-full h-64 bg-[#18181b] border border-[var(--color-border)] rounded-xl overflow-hidden flex items-center justify-center p-4 shadow-inner">
              {/* Retro coordinate grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />

              {/* Graphic Mock Stage with Bounding Boxes */}
              <div className="relative w-full h-full border border-dashed border-emerald-500/30 rounded-lg p-3 flex flex-col justify-between z-10 bg-black/40">
                <div className="flex justify-between items-start gap-2">
                  {/* Bounding Box 1: Terminal */}
                  <div className="border border-emerald-500 rounded-lg p-2.5 bg-emerald-950/40 relative shadow-xs">
                    <span className="absolute -top-2.5 left-2 bg-emerald-500 text-black text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                      Terminal [0.99]
                    </span>
                    <div className="font-mono-code text-[10px] text-emerald-300">
                      $ ollama run hermes-3:8b<br/>
                      [LOCAL-BUS] socket connected.
                    </div>
                  </div>

                  {/* Bounding Box 2: Benchmark Matrix */}
                  <div className="border border-sky-500 rounded-lg p-2.5 bg-sky-950/40 relative shadow-xs">
                    <span className="absolute -top-2.5 left-2 bg-sky-500 text-black text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                      Benchmark [0.96]
                    </span>
                    <div className="font-mono-code text-[10px] text-sky-300">
                      Latency: 14.2ms<br/>
                      Throughput: 42 tok/s
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end gap-2">
                  {/* Bounding Box 3: Hardware HUD */}
                  <div className="border border-purple-500 rounded-lg p-2 bg-purple-950/40 relative shadow-xs">
                    <span className="absolute -top-2.5 left-2 bg-purple-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                      Hardware HUD [0.94]
                    </span>
                    <div className="font-mono-code text-[9px] text-purple-200">
                      Snapdragon 8 Gen 2 • VRAM 5.8 GB
                    </div>
                  </div>

                  <div className="text-[10px] font-mono-code text-[var(--color-text-dim)] text-right">
                    Target: Qwen-VL Cognitive Matrix
                  </div>
                </div>
              </div>
            </div>

            {/* Inspection Controls Toolbar */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-xs">
              <button
                onClick={() => setOcrExtracted(!ocrExtracted)}
                className={`py-2 px-2.5 rounded-lg border font-medium flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                  ocrExtracted 
                    ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-semibold' 
                    : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border-[var(--color-border)] text-[var(--color-text)]'
                }`}
              >
                <span>{ocrExtracted ? 'OCR Extracted' : 'Extract OCR'}</span>
              </button>

              <button
                onClick={() => alert('Alt text generated: "Screenshot of sovereign edge AI swarm terminal benchmarking Hermes-3 at 42 tokens per second."')}
                className="py-2 px-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text)] font-medium flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <span>Gen Alt Text</span>
              </button>

              <button
                onClick={() => alert('Aspect ratio locked to 16:9 for X & LinkedIn.')}
                className="py-2 px-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text)] font-medium flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <span>Crop 16:9</span>
              </button>

              <button
                onClick={() => alert('Aspect ratio locked to 1:1 for Instagram & Carousel.')}
                className="py-2 px-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text)] font-medium flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <span>Crop 1:1</span>
              </button>
            </div>

            {/* Ingest Telemetry Badges */}
            <div className="grid grid-cols-4 gap-2 p-2.5 bg-[var(--bg-surface)] border border-[var(--color-border)] rounded-lg text-xs font-mono-code text-[var(--color-text-dim)]">
              <div>Res: <strong className="text-[var(--color-primary)]">1920x1080</strong></div>
              <div>Format: <strong className="text-[var(--color-primary)]">PNG</strong></div>
              <div>Color: <strong className="text-[var(--color-primary)]">sRGB</strong></div>
              <div>Size: <strong className="text-[var(--color-primary)]">412.8 KB</strong></div>
            </div>
          </div>

          {/* Extracted Syntactic Python Snippet */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between text-xs border-b border-[var(--color-border)] pb-2 font-semibold">
              <span className="flex items-center gap-2 text-[var(--color-primary)]">
                <Code className="w-3.5 h-3.5 text-sky-400" />
                <span>Ollama Local Streaming Client (Python)</span>
              </span>
              <button
                onClick={handleCopyCode}
                className="px-2 py-1 text-xs rounded-md border border-[var(--color-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text)] transition-colors flex items-center gap-1.5 font-medium shadow-xs"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-3 bg-[var(--bg-surface)] border border-[var(--color-border)] rounded-lg text-xs font-mono-code text-[var(--color-text)] overflow-x-auto leading-relaxed">
              {pythonSnippet}
            </pre>
          </div>
        </div>

        {/* Right Col (5 cols): Cognitive Manifest & Multi-Slide Carousel */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Qwen-VL Cognitive Manifest */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between text-xs border-b border-[var(--color-border)] pb-2 font-semibold">
              <span className="flex items-center gap-2 text-[var(--color-primary)]">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Qwen-VL Cognitive Manifest (JSON)</span>
              </span>
              <button
                onClick={handleCopyManifest}
                className="px-2 py-1 text-xs rounded-md border border-[var(--color-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text)] transition-colors flex items-center gap-1.5 font-medium shadow-xs"
              >
                {copiedManifest ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedManifest ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-3 bg-[var(--bg-surface)] border border-[var(--color-border)] rounded-lg text-xs font-mono-code text-emerald-400 h-36 overflow-y-auto leading-relaxed">
              {JSON.stringify(cognitiveManifest, null, 2)}
            </pre>
          </div>

          {/* Multi-Slide Carousel Synthesis */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs flex-1">
            <div className="flex items-center justify-between text-xs border-b border-[var(--color-border)] pb-2 font-semibold">
              <span className="flex items-center gap-2 text-[var(--color-primary)]">
                <Layers className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span>Multi-Slide Carousel Synthesis (5 Slides)</span>
              </span>
              <span className="text-xs font-mono-code text-sky-500 font-medium">Slide {activeSlide + 1} / 5</span>
            </div>

            {/* Slide Navigation Thumbnails */}
            <div className="grid grid-cols-5 gap-1.5">
              {slides.map((s, idx) => (
                <button
                  key={s.num}
                  onClick={() => setActiveSlide(idx)}
                  className={`p-1.5 rounded-lg border text-center text-xs font-mono-code font-semibold transition-all ${
                    activeSlide === idx
                      ? 'bg-[var(--color-accent)] text-[#18181b] border-[var(--color-accent)] shadow-xs'
                      : 'bg-[var(--bg-surface)] text-[var(--color-text-dim)] border-[var(--color-border)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  Slide {s.num}
                </button>
              ))}
            </div>

            {/* Active Slide Preview Card */}
            <div className="p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)] flex flex-col justify-between my-1">
              <div>
                <span className="text-[11px] font-semibold text-[var(--color-accent)]">
                  Slide {slides[activeSlide].num} — Hero Frame
                </span>
                <h3 className="text-sm font-bold text-[var(--color-primary)] mt-1">
                  {slides[activeSlide].title}
                </h3>
                <p className="text-xs text-[var(--color-text-dim)] mt-2 leading-relaxed">
                  {slides[activeSlide].desc}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-[var(--color-border)] flex justify-between items-center text-xs font-mono-code text-[var(--color-text-dim)]">
                <span>Local Render: PNG 1080x1080</span>
                <span className="text-emerald-500 font-semibold">Ready to Stage</span>
              </div>
            </div>

            {/* Carousel Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handlePushToEditor}
                className="py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--color-border)] text-[var(--color-primary)] transition-all shadow-xs"
              >
                <span>Push to Draft</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => alert('Generating full 5-slide carousel assets at 1080x1080 into ./artifacts/carousel/')}
                className="py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-400 transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Export Carousel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
