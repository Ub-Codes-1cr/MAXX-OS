import React, { useState, useEffect, useRef } from 'react';
import { ScreenId } from '../../types';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Activity, 
  Upload, 
  FileAudio, 
  Download, 
  Trash2, 
  Send, 
  Sliders, 
  Radio, 
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface VoiceInputScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSendToBrain: (prompt: string) => void;
}

export const VoiceInputScreen: React.FC<VoiceInputScreenProps> = ({
  onNavigate,
  onSendToBrain,
}) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isVadMuted, setIsVadMuted] = useState<boolean>(false);
  const [noiseFloor, setNoiseFloor] = useState<number>(-51.2);
  const [ch1Level, setCh1Level] = useState<number>(65);
  const [ch2Level, setCh2Level] = useState<number>(60);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    'voice_memo_sovereign_dag_2026.wav (4.2 MB)',
    'termux_acoustic_session_04.wav (1.8 MB)'
  ]);

  const [transcripts, setTranscripts] = useState<Array<{ id: string; time: string; speaker: string; text: string; confidence: string }>>([
    {
      id: '1',
      time: '00:01.40',
      speaker: 'SPEAKER_01 [UBADA]',
      text: 'We need to dispatch an 11-node LangGraph cyclic state graph to benchmark Hermes-3 local throughput against centralized cloud APIs.',
      confidence: '98.6%'
    },
    {
      id: '2',
      time: '00:08.12',
      speaker: 'SPEAKER_01 [UBADA]',
      text: 'Ensure zero telemetry leaks across the private socket bus and route the final output to the X Thread Builder skill mask for HITL staging.',
      confidence: '99.1%'
    },
    {
      id: '3',
      time: '00:15.50',
      speaker: 'SPEAKER_01 [UBADA]',
      text: 'Check SQLite queue for scheduled posts at 15:00 UTC and auto-lint formatting rules.',
      confidence: '97.8%'
    }
  ]);

  // Audio level VU meter simulator
  useEffect(() => {
    const vuInterval = setInterval(() => {
      if (isRecording) {
        setCh1Level(Math.floor(Math.random() * 50) + 45);
        setCh2Level(Math.floor(Math.random() * 50) + 40);
      } else {
        setCh1Level(Math.floor(Math.random() * 15) + 10);
        setCh2Level(Math.floor(Math.random() * 15) + 10);
      }
    }, 150);
    return () => clearInterval(vuInterval);
  }, [isRecording]);

  // Oscilloscope Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let phase = 0;

    const renderOscilloscope = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, width, height);

      // Draw faint coordinate grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 25) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 25) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Draw sine/noise waveform
      ctx.strokeStyle = isRecording ? '#10b981' : '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const sliceWidth = width / 100;
      let x = 0;

      for (let i = 0; i <= 100; i++) {
        const amplitude = isRecording ? 32 : 8;
        const freq1 = Math.sin((i * 0.1) + phase) * amplitude;
        const freq2 = Math.sin((i * 0.05) + phase * 1.5) * (amplitude * 0.5);
        const noise = (Math.random() - 0.5) * (isRecording ? 5 : 1.5);
        const y = height / 2 + freq1 + freq2 + noise;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();
      phase += isRecording ? 0.18 : 0.04;
      animationFrameId = requestAnimationFrame(renderOscilloscope);
    };

    renderOscilloscope();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRecording]);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Add simulated new transcription line after 2.5s
      setTimeout(() => {
        const now = new Date();
        const timeStr = `00:${now.getSeconds().toString().padStart(2, '0')}.45`;
        setTranscripts(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            time: timeStr,
            speaker: 'SPEAKER_01 [UBADA]',
            text: 'Live audio chunk captured via Faster-Whisper: "Prepare SQLite staging vector for cross-channel distribution."',
            confidence: '98.9%'
          }
        ]);
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  const handleCalibrate = () => {
    setNoiseFloor(-51.8);
  };

  const handleExportTranscript = () => {
    const content = transcripts.map(t => `[${t.time}] ${t.speaker}: ${t.text} (${t.confidence})`).join('\n\n');
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice_transcript_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendToBrainSwarm = () => {
    const combined = transcripts.map(t => t.text).join(' ');
    onSendToBrain(combined);
    onNavigate('brain');
  };

  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 overflow-y-auto">
      {/* Top Banner Notice */}
      <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Mic className="w-4 h-4 text-[var(--color-accent)] animate-pulse" />
          <span className="text-sm font-semibold text-[var(--color-primary)]">
            Station 04 — Faster-Whisper Local Acoustic Ingestion & VAD
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
            Latency: 18.4ms (Local VAD)
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)] font-mono-code">
          <span>Target: Ubada</span>
          <span>•</span>
          <span className="text-[var(--color-accent)] font-semibold">Spectral Peak: 2.41 kHz</span>
        </div>
      </div>

      {/* Main Grid: Visualizer & Controls (Left), Transcriber (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Col (6 cols): Oscilloscope & Radar & Levels */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Oscilloscope Canvas Box */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between text-xs border-b border-[var(--color-border)] pb-2 font-semibold">
              <span className="flex items-center gap-2 text-[var(--color-primary)]">
                <Radio className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                <span>Tyler ASI Radar & Oscilloscope Sphere</span>
              </span>
              <span className="text-xs font-mono-code text-emerald-500 font-medium">
                {isRecording ? 'Live Ingestion' : 'Standby Idle'}
              </span>
            </div>

            {/* Canvas Oscilloscope */}
            <div className="w-full h-40 bg-[#18181b] border border-[var(--color-border)] rounded-xl relative overflow-hidden flex items-center justify-center shadow-inner">
              <canvas
                ref={canvasRef}
                width={500}
                height={160}
                className="w-full h-full block"
              />
              <div className="absolute top-2.5 left-2.5 text-[10px] font-mono-code text-zinc-400 bg-black/60 px-2 py-0.5 rounded-md border border-white/10">
                Sweep: 48.0 kHz • 16-Bit PCM
              </div>
              <div className="absolute bottom-2.5 right-2.5 text-[10px] font-mono-code text-emerald-400 bg-black/60 px-2 py-0.5 rounded-md border border-white/10">
                Zero Clipping
              </div>
            </div>

            {/* Audio Controls Bar */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={toggleRecording}
                className={`py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-all shadow-xs ${
                  isRecording 
                    ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                    : 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[#18181b]'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? 'Stop Recording' : 'Start Mic'}</span>
              </button>

              <button
                onClick={() => setIsVadMuted(!isVadMuted)}
                className={`py-2.5 px-3 rounded-lg border border-[var(--color-border)] flex items-center justify-center gap-2 text-xs font-medium transition-all shadow-xs ${
                  isVadMuted 
                    ? 'bg-amber-500/15 text-amber-500 border-amber-500/30 font-semibold' 
                    : 'bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text)]'
                }`}
              >
                {isVadMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isVadMuted ? 'Unmute VAD' : 'Mute VAD'}</span>
              </button>

              <button
                onClick={handleCalibrate}
                className="py-2.5 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text)] flex items-center justify-center gap-2 text-xs font-medium transition-all shadow-xs"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Calibrate</span>
              </button>
            </div>
          </div>

          {/* Audio Levels Matrix */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between text-xs border-b border-[var(--color-border)] pb-2 font-semibold">
              <span className="text-[var(--color-primary)]">Acoustic Levels Matrix & VU Meters</span>
              <span className="text-xs font-mono-code text-[var(--color-accent)]">
                Floor: {noiseFloor.toFixed(1)} dB
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono-code">
              {/* Channel 1 */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[var(--color-text-dim)]">CH_01 [L] Input:</span>
                  <span className="font-semibold text-[var(--color-primary)]">
                    {isRecording ? '-7.4 dB' : '-51.2 dB'}
                  </span>
                </div>
                <div className="w-full bg-[var(--bg-surface)] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--color-accent)] h-full rounded-full transition-all duration-100"
                    style={{ width: `${ch1Level}%` }}
                  />
                </div>
              </div>

              {/* Channel 2 */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[var(--color-text-dim)]">CH_02 [R] Input:</span>
                  <span className="font-semibold text-[var(--color-primary)]">
                    {isRecording ? '-8.1 dB' : '-51.2 dB'}
                  </span>
                </div>
                <div className="w-full bg-[var(--bg-surface)] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--color-accent)] h-full rounded-full transition-all duration-100"
                    style={{ width: `${ch2Level}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col (6 cols): Speech Transcriber & Audio Spool */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Live Diarization Feed */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs flex-1">
            <div className="flex items-center justify-between text-xs border-b border-[var(--color-border)] pb-2 font-semibold">
              <span className="flex items-center gap-2 text-[var(--color-primary)]">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>Live Speech Transcriber & Diarization</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
                Faster-Whisper
              </span>
            </div>

            {/* Transcript Lines */}
            <div className="p-3 bg-[var(--bg-surface)] border border-[var(--color-border)] rounded-lg text-xs font-mono-code h-56 overflow-y-auto space-y-2.5">
              {transcripts.map((t) => (
                <div key={t.id} className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--color-border)] flex flex-col gap-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] text-[var(--color-text-dim)] border-b border-[var(--color-border)] pb-1">
                    <span className="font-semibold text-[var(--color-accent)]">{t.speaker}</span>
                    <div className="flex items-center gap-2">
                      <span>{t.time}</span>
                      <span className="text-emerald-500 font-medium">Conf: {t.confidence}</span>
                    </div>
                  </div>
                  <p className="text-[var(--color-text)] font-sans text-xs leading-relaxed">
                    "{t.text}"
                  </p>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleExportTranscript}
                className="py-2 px-3 rounded-lg text-xs font-medium border border-[var(--color-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text)] flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .md</span>
              </button>

              <button
                onClick={handleSendToBrainSwarm}
                className="py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-500 flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Brain Swarm</span>
              </button>
            </div>
          </div>

          {/* Audio Buffer Archive & Upload */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between text-xs border-b border-[var(--color-border)] pb-2 font-semibold">
              <span className="flex items-center gap-2 text-[var(--color-primary)]">
                <FileAudio className="w-3.5 h-3.5 text-purple-400" />
                <span>Buffer Archive & Spool</span>
              </span>
              <span className="text-xs text-[var(--color-text-dim)] font-mono-code">Max 50 MB WAV</span>
            </div>

            <div className="space-y-1.5 text-xs font-mono-code">
              {uploadedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)] flex items-center justify-between"
                >
                  <span className="text-[var(--color-text)] truncate">{file}</span>
                  <span className="text-emerald-500 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">Buffered</span>
                </div>
              ))}
            </div>

            {/* Drag & drop trigger */}
            <label className="border border-dashed border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-lg p-3 text-center text-xs cursor-pointer bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] block transition-all">
              <Upload className="w-4 h-4 mx-auto mb-1 text-[var(--color-text-dim)]" />
              <span className="text-[var(--color-text-dim)]">Drag & drop audio (.wav, .mp3, .m4a)</span>
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setUploadedFiles(prev => [...prev, `${e.target.files![0].name} (${(e.target.files![0].size / 1024 / 1024).toFixed(1)} MB)`]);
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
