import React, { useState, useEffect } from 'react';
import { ScreenId, LogEntry } from '../../types';
import { 
  Activity, 
  Terminal, 
  Cpu, 
  HardDrive, 
  Wifi, 
  ShieldCheck, 
  RefreshCw, 
  Pause, 
  Play, 
  Trash2, 
  Copy, 
  Download, 
  Radio, 
  Send,
  Zap,
  Server
} from 'lucide-react';

interface TelemetryFeedScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const TelemetryFeedScreen: React.FC<TelemetryFeedScreenProps> = ({
  onNavigate,
}) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [cmdInput, setCmdInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: '14:22:01.012', category: 'IPC_BUS', message: 'Socket connection established at /tmp/swarm_bus.sock [1.2ms latency]', type: 'primary' },
    { id: '2', timestamp: '14:22:04.421', category: 'LANGGRAPH', message: 'Cyclic graph loop iter #04 completed. Ingest->Research->Writer verified.', type: 'accent' },
    { id: '3', timestamp: '14:22:08.882', category: 'OLLAMA', message: 'Hermes-3 8B Q4_K_M allocated to GPU layer 32. 42 tok/s throughput nominal.', type: 'secondary' },
    { id: '4', timestamp: '14:22:15.109', category: 'FIREWALL', message: 'Outbound DNS inspection: ZERO external egress leaks detected. Air-gapped.', type: 'primary' },
    { id: '5', timestamp: '14:22:20.340', category: 'SQLITE', message: 'WAL checkpoint completed on ./maskyyy/db/schedule.sqlite3 [0.42ms write]', type: 'dim' },
    { id: '6', timestamp: '14:22:27.712', category: 'TELEGRAM', message: 'Inbound command from @Ubada: /status -> dispatched 8-metric composite.', type: 'warning' },
    { id: '7', timestamp: '14:22:33.992', category: 'WHISPER', message: 'VAD silence detected at -51.2 dB. Audio segment committed to buffer.', type: 'secondary' },
    { id: '8', timestamp: '14:22:40.115', category: 'HITL_GATE', message: 'Draft staged for X (Twitter). Waiting human biometric or click authorization.', type: 'accent' },
  ]);

  // Live incoming log stream simulator
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toISOString().substring(11, 23);
      const possibleCategories = ['SWARM_04', 'OLLAMA_NODE', 'PLAYWRIGHT', 'VAD_ENGINE', 'TAILSCALE', 'LANCEDB'];
      const cat = possibleCategories[Math.floor(Math.random() * possibleCategories.length)];
      
      const messages = [
        `Vector similarity query matched 4 chunks in LanceDB vault (score: 0.94)`,
        `Playwright browser driver warmed up in headless isolation mode [PID 8412]`,
        `Context KV cache pruned: 94.2% retained, memory reclamation nominal`,
        `Telemetry heartbeat ACK received from Termux A13 edge node [ping: 8ms]`,
        `Agent 04 (Eval Critic) completed heuristic scan: slop index = 0.00`,
        `WireGuard peer 100.84.192.12 re-keyed cryptographic handshake successfully`
      ];
      const msg = messages[Math.floor(Math.random() * messages.length)];

      setLogs(prev => [
        ...prev.slice(-40),
        {
          id: Math.random().toString(),
          timestamp: timeStr,
          category: cat,
          message: msg,
          type: 'secondary'
        }
      ]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;

    const input = cmdInput.trim();
    const now = new Date();
    const timeStr = now.toISOString().substring(11, 23);

    // Append command
    let response = `Command executed: ${input}`;
    if (input.toLowerCase() === 'help') {
      response = `AVAILABLE SOVEREIGN COMMANDS: status, agents, ping, routes, flush, kill, inspect`;
    } else if (input.toLowerCase() === 'status') {
      response = `ALL 11 NODES HEALTHY // SWARM SYNCHRONIZED // 99.98% UPTIME`;
    } else if (input.toLowerCase() === 'ping') {
      response = `PONG: Local IPC bus latency = 1.14ms | Tailscale = 9.2ms`;
    } else if (input.toLowerCase() === 'agents') {
      response = `ACTIVE: IngestRouter, Researcher, Writer, Critic, Linter, Scheduler, AudioVAD, VisionQwen, PlaywrightProxy, TelegramBridge, SovereignCore`;
    }

    setLogs(prev => [
      ...prev,
      { id: Math.random().toString(), timestamp: timeStr, category: 'USER_STDIN', message: `> ${input}`, type: 'accent' },
      { id: Math.random().toString(), timestamp: timeStr, category: 'SWARM_RESP', message: response, type: 'primary' },
    ]);

    setCmdInput('');
  };

  const handleCopyLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.category}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const telemetryMetrics = [
    { id: '01', name: 'Latency Ping', val: '8ms', sub: 'P2P WireGuard', color: 'text-emerald-500' },
    { id: '02', name: 'Active Agents', val: '11', sub: 'LangGraph Swarm', color: 'text-[var(--color-primary)]' },
    { id: '03', name: 'Task Queue', val: '05', sub: 'Active DAG pipeline', color: 'text-sky-500' },
    { id: '04', name: 'Context Cache', val: '94.2%', sub: 'KV FlashAttention', color: 'text-purple-500' },
    { id: '05', name: 'Vault Vectors', val: '1,420', sub: 'LanceDB Store', color: 'text-emerald-500' },
    { id: '06', name: 'Daily Streak', val: '140d', sub: 'Autonomous tracker', color: 'text-amber-500' },
    { id: '07', name: 'RTK Compression', val: '-42%', sub: 'Zero semantic loss', color: 'text-sky-500' },
    { id: '08', name: 'Firewall Egress', val: 'Airgap', sub: 'Zero external leaks', color: 'text-emerald-500' },
  ];

  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 overflow-y-auto">
      {/* Top Banner Notice */}
      <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="text-sm font-semibold text-[var(--color-primary)]">
            Station 03 — Real-Time Telemetry & Gateway Terminal
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
            Uptime 99.98% (42h 18m)
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)] font-mono-code">
          <span className="text-sky-500">Tailscale: 100.84.192.12</span>
          <span>•</span>
          <span className="text-emerald-500">Ollama Healthy</span>
        </div>
      </div>

      {/* 8 Telemetry Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {telemetryMetrics.map((m) => (
          <div key={m.id} className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] flex flex-col justify-between shadow-xs hover:border-[var(--color-text-dim)] transition-all">
            <div className="text-[10px] font-semibold text-[var(--color-text-dim)] flex justify-between">
              <span>{m.id}.</span>
              <span className="truncate">{m.name}</span>
            </div>
            <div className={`my-1.5 text-xl font-bold tracking-tight ${m.color}`}>
              {m.val}
            </div>
            <div className="text-[10px] text-[var(--color-text-dim)] font-mono-code truncate">
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Hardware Composite & Load Status */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5 mb-3 text-xs font-semibold">
          <span className="flex items-center gap-2 text-[var(--color-primary)]">
            <Server className="w-4 h-4 text-[var(--color-accent)]" />
            <span>Sovereign Hardware Load Composite</span>
          </span>
          <span className="text-xs font-mono-code text-[var(--color-text-dim)]">
            Host: Snapdragon 8 Gen 2 // Termux A13 + RTX 4090 Compute Slave
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono-code">
          {/* CPU Bar */}
          <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)] flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-dim)]">CPU Utilization:</span>
              <span className="font-semibold text-emerald-500">36.4%</span>
            </div>
            <div className="w-full bg-[var(--bg-card)] h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-[36.4%]" />
            </div>
            <div className="text-[10px] text-[var(--color-text-dim)]">8 Cores Active • 3.2 GHz Frequency</div>
          </div>

          {/* VRAM Bar */}
          <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)] flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-dim)]">GPU VRAM Allocation:</span>
              <span className="font-semibold text-[var(--color-primary)]">11.8 / 16 GB</span>
            </div>
            <div className="w-full bg-[var(--bg-card)] h-2 rounded-full overflow-hidden">
              <div className="bg-[var(--color-accent)] h-full rounded-full w-[73.7%]" />
            </div>
            <div className="text-[10px] text-[var(--color-text-dim)]">Hermes-3 8B (32 layers on CUDA)</div>
          </div>

          {/* RAM Bar */}
          <div className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)] flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-[var(--color-text-dim)]">System Memory:</span>
              <span className="font-semibold text-sky-500">24.2 / 64 GB</span>
            </div>
            <div className="w-full bg-[var(--bg-card)] h-2 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full w-[37.8%]" />
            </div>
            <div className="text-[10px] text-[var(--color-text-dim)]">LanceDB Vector Index cached in RAM</div>
          </div>
        </div>
      </div>

      {/* Terminal & Log Stream Box */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs flex-1">
        {/* Terminal Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border)] pb-2.5 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[var(--color-accent)]" />
            <span className="text-[var(--color-primary)]">Interactive Runtime Terminal & Gateway Stream</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono-code font-medium">
              Live Stream
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-[var(--color-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text)] flex items-center gap-1.5 transition-all shadow-xs"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-amber-500" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
            <button
              onClick={handleCopyLogs}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-[var(--color-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text)] flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleClearLogs}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Live Logs Window */}
        <div className="p-3 bg-[var(--bg-surface)] border border-[var(--color-border)] rounded-lg text-xs font-mono-code h-64 overflow-y-auto space-y-1.5">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-[var(--color-text-dim)] shrink-0 select-none text-[11px]">
                [{log.timestamp}]
              </span>
              <span className="text-[var(--color-accent)] font-semibold shrink-0">
                [{log.category}]
              </span>
              <span className="text-[var(--color-text)] break-all">
                {log.message}
              </span>
            </div>
          ))}
          <div className="text-[var(--color-accent)] flex items-center gap-1 animate-pulse">
            <span>_</span>
          </div>
        </div>

        {/* Interactive CLI Command Input */}
        <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-1">
          <span className="font-mono-code text-xs text-[var(--color-accent)] font-semibold shrink-0">
            maxx-os@sovereign:~$
          </span>
          <input
            type="text"
            value={cmdInput}
            onChange={(e) => setCmdInput(e.target.value)}
            placeholder="Type 'help', 'status', 'ping', 'agents', or shell command..."
            className="flex-1 p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)] text-xs font-mono-code text-[var(--color-primary)] focus:border-[var(--color-accent)] outline-none transition-colors"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[#18181b] transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send STDIN</span>
          </button>
        </form>
      </div>
    </div>
  );
};
