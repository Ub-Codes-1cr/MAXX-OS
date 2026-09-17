import React, { useState } from 'react';
import { ScreenId, ScheduledPost } from '../../types';
import { 
  CalendarClock, 
  Database, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  Filter, 
  Play, 
  AlertCircle,
  FileText,
  X
} from 'lucide-react';

interface ScheduleScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onPostNow: (post: ScheduledPost) => void;
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({
  onNavigate,
  onPostNow,
}) => {
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New post modal form state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newPlatform, setNewPlatform] = useState<'X (TWITTER)' | 'LINKEDIN' | 'DEV.TO' | 'REDDIT' | 'SUBSTACK'>('X (TWITTER)');
  const [newDivision, setNewDivision] = useState<'MEDIA' | 'TECH' | 'MAFIA' | 'SAAS'>('TECH');
  const [newSlot, setNewSlot] = useState<string>('mon-0900');
  const [newTime, setNewTime] = useState<string>('Tomorrow, 09:00 UTC');

  const [posts, setPosts] = useState<ScheduledPost[]>([
    {
      id: '01',
      scheduledTime: 'Today, 18:00 UTC',
      timeRemaining: 'in 2h 14m',
      platform: 'X (TWITTER)',
      division: 'MEDIA',
      title: '1/6 ⚡ The cloud AI trap is real: paying monthly rent for throttled API keys...',
      media: 'architecture_diagram.png',
      status: 'READY',
      slot: 'mon-1800'
    },
    {
      id: '02',
      scheduledTime: 'Today, 21:00 UTC',
      timeRemaining: 'in 5h 14m',
      platform: 'LINKEDIN',
      division: 'TECH',
      title: 'Why local 11-node LangGraph swarms outperform centralized cloud agent frameworks.',
      media: 'benchmark_matrix.png',
      status: 'PENDING STAGE',
      slot: 'mon-2100'
    },
    {
      id: '03',
      scheduledTime: 'Tomorrow, 09:00 UTC',
      timeRemaining: 'in 17h 14m',
      platform: 'REDDIT',
      division: 'MAFIA',
      title: '[Show Reddit] We built an air-gapped AI media company on a phone with Termux',
      media: 'terminal_audit.png',
      status: 'READY',
      slot: 'tue-0900'
    },
    {
      id: '04',
      scheduledTime: 'Tomorrow, 15:00 UTC',
      timeRemaining: 'in 23h 14m',
      platform: 'DEV.TO',
      division: 'SAAS',
      title: 'Full Guide: Running Faster-Whisper and Qwen2-VL locally with zero cloud API keys',
      media: 'vision_nodes.png',
      status: 'PENDING STAGE',
      slot: 'tue-1500'
    },
    {
      id: '05',
      scheduledTime: 'Wed, 12:00 UTC',
      timeRemaining: 'in 2d 1h',
      platform: 'SUBSTACK',
      division: 'MEDIA',
      title: 'The Sovereign AI Manifesto: Escaping the API rent trap permanently',
      media: 'manifesto_cover.png',
      status: 'PENDING STAGE',
      slot: 'wed-1200'
    }
  ]);

  const timeSlots = ['09:00', '12:00', '15:00', '18:00', '21:00'];
  const days = [
    { key: 'mon', label: 'MON' },
    { key: 'tue', label: 'TUE' },
    { key: 'wed', label: 'WED' },
    { key: 'thu', label: 'THU' },
    { key: 'fri', label: 'FRI' },
    { key: 'sat', label: 'SAT' },
    { key: 'sun', label: 'SUN' },
  ];

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPost: ScheduledPost = {
      id: (posts.length + 1).toString().padStart(2, '0'),
      scheduledTime: newTime,
      timeRemaining: 'Scheduled',
      platform: newPlatform,
      division: newDivision,
      title: newTitle,
      media: 'attached_asset.png',
      status: 'READY',
      slot: newSlot
    };

    setPosts(prev => [newPost, ...prev]);
    setNewTitle('');
    setIsModalOpen(false);
  };

  const handleDeletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const handleTriggerPostNow = (post: ScheduledPost) => {
    onPostNow(post);
    onNavigate('review');
  };

  return (
    <div className="flex-1 p-4 md:p-6 flex flex-col gap-4 overflow-y-auto">
      {/* Top Banner Notice */}
      <div className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <CalendarClock className="w-4 h-4 text-[var(--color-accent)] animate-pulse" />
          <span className="text-sm font-semibold text-[var(--color-primary)]">
            Station 08 — Local SQLite Queue & Calendar Matrix
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20 font-medium">
            Queued Posts: {posts.length}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-dim)] font-mono-code">
          <span className="text-emerald-500">Daemon: Tick 1000ms</span>
          <span>•</span>
          <span>./maskyyy/db/schedule.sqlite3</span>
        </div>
      </div>

      {/* Action Bar: View Switcher, Add Post, Safety Rules */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-[var(--color-border)] pb-3">
        <div className="flex items-center gap-1.5 bg-[var(--bg-surface)] p-0.5 rounded-lg border border-[var(--color-border)]">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'calendar'
                ? 'bg-[var(--color-accent)] text-[#18181b] shadow-xs'
                : 'text-[var(--color-text-dim)] hover:text-[var(--color-primary)]'
            }`}
          >
            Week Matrix
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-[var(--color-accent)] text-[#18181b] shadow-xs'
                : 'text-[var(--color-text-dim)] hover:text-[var(--color-primary)]'
            }`}
          >
            SQLite Table (Raw)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-1.5 px-3 rounded-lg flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-500 font-semibold text-xs transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Scheduled Draft</span>
          </button>
        </div>
      </div>

      {/* Calendar Matrix View */}
      {viewMode === 'calendar' && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs">
          <div className="text-xs font-semibold text-[var(--color-text-dim)] flex justify-between border-b border-[var(--color-border)] pb-2.5">
            <span className="text-[var(--color-primary)]">Weekly Dispatch Grid (09:00 - 21:00 UTC)</span>
            <span className="text-emerald-500 font-mono-code font-medium">Queue Status: Active</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              {/* Day Headers */}
              <div className="grid grid-cols-8 gap-2 text-xs font-mono-code font-semibold text-center mb-2">
                <div className="p-1.5 text-[var(--color-text-dim)]">TIME</div>
                {days.map((d) => (
                  <div key={d.key} className="p-1.5 rounded-md bg-[var(--bg-surface)] border border-[var(--color-border)] text-[var(--color-primary)]">
                    {d.label}
                  </div>
                ))}
              </div>

              {/* Time Slots Rows */}
              {timeSlots.map((slotTime) => {
                const formattedTimeKey = slotTime.replace(':', '');
                return (
                  <div key={slotTime} className="grid grid-cols-8 gap-2 mb-2 font-mono-code text-xs">
                    {/* Time Label */}
                    <div className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)] flex items-center justify-center font-semibold text-[var(--color-text-dim)]">
                      {slotTime}
                    </div>

                    {/* 7 Days Cells */}
                    {days.map((d) => {
                      const currentSlotId = `${d.key}-${formattedTimeKey}`;
                      const postInSlot = posts.find(p => p.slot === currentSlotId);

                      return (
                        <div
                          key={d.key}
                          className={`p-2 min-h-[64px] rounded-lg border transition-all flex flex-col justify-between ${
                            postInSlot
                              ? 'bg-[var(--bg-surface)] border-[var(--color-accent)] shadow-xs'
                              : 'bg-[var(--bg-surface)]/40 border-[var(--color-border)]/60 hover:border-[var(--color-border)]'
                          }`}
                        >
                          {postInSlot ? (
                            <div className="flex flex-col justify-between h-full">
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-semibold border-b border-[var(--color-border)] pb-1 mb-1">
                                  <span className="text-[var(--color-accent)] truncate max-w-[50px]">{postInSlot.platform}</span>
                                  <span className="text-emerald-500 font-mono-code text-[9px]">{postInSlot.division}</span>
                                </div>
                                <p className="text-[11px] font-sans text-[var(--color-text)] line-clamp-2 leading-tight">
                                  {postInSlot.title}
                                </p>
                              </div>
                              <div className="flex items-center justify-between pt-1.5 border-t border-[var(--color-border)]/50 mt-1">
                                <button
                                  onClick={() => handleTriggerPostNow(postInSlot)}
                                  className="text-[10px] text-emerald-500 hover:underline font-semibold"
                                >
                                  Stage
                                </button>
                                <button
                                  onClick={() => handleDeletePost(postInSlot.id)}
                                  className="text-[10px] text-rose-400 hover:text-rose-500"
                                >
                                  Del
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center opacity-30 text-[10px] text-[var(--color-text-dim)]">
                              —
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Raw SQLite Table View */}
      {viewMode === 'table' && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-3 shadow-xs">
          <div className="text-xs font-semibold text-[var(--color-text-dim)] flex justify-between border-b border-[var(--color-border)] pb-2.5">
            <span className="text-[var(--color-primary)]">Table: posts_scheduled (SQLite Local Engine)</span>
            <span className="font-mono-code text-sky-500 text-xs">SELECT * FROM posts_scheduled ORDER BY timestamp ASC</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono-code text-left border border-[var(--color-border)] rounded-lg overflow-hidden">
              <thead className="bg-[var(--bg-surface)] text-[var(--color-text-dim)] border-b border-[var(--color-border)]">
                <tr>
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">Scheduled Time</th>
                  <th className="p-2.5">Platform</th>
                  <th className="p-2.5">Div</th>
                  <th className="p-2.5">Title / Hook</th>
                  <th className="p-2.5">Media</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--bg-surface)] transition-colors">
                    <td className="p-2.5 font-semibold text-[var(--color-accent)]">#{p.id}</td>
                    <td className="p-2.5 text-[var(--color-text)]">{p.scheduledTime}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-[var(--bg-surface)] text-[var(--color-primary)] border border-[var(--color-border)] text-[10px] font-semibold">
                        {p.platform}
                      </span>
                    </td>
                    <td className="p-2.5 text-sky-500 font-semibold">{p.division}</td>
                    <td className="p-2.5 max-w-xs truncate text-[var(--color-text)] font-sans">{p.title}</td>
                    <td className="p-2.5 text-[var(--color-text-dim)] truncate">{p.media}</td>
                    <td className="p-2.5">
                      <span className="text-emerald-500 font-semibold text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-2.5 flex items-center gap-2">
                      <button
                        onClick={() => handleTriggerPostNow(p)}
                        className="px-2 py-1 rounded-md text-xs font-semibold text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
                        title="Stage in HITL immediately"
                      >
                        Post Now
                      </button>
                      <button
                        onClick={() => handleDeletePost(p.id)}
                        className="px-2 py-1 rounded-md text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-all"
                        title="Delete from SQLite"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Daemon Safety Guardrails & SQLite Engine Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Guardrails Card */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-2.5 text-xs font-mono-code shadow-xs">
          <div className="flex items-center gap-2 font-semibold border-b border-[var(--color-border)] pb-2 text-[var(--color-primary)]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Daemon Safety Guardrails (Algorithmic Defense)</span>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between p-2 rounded-md bg-[var(--bg-surface)] border border-[var(--color-border)]">
              <span className="text-[var(--color-text-dim)]">Rule #01 Time Window:</span>
              <span className="font-semibold text-emerald-500">09:00 - 21:00 UTC (No Night Drop)</span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-[var(--bg-surface)] border border-[var(--color-border)]">
              <span className="text-[var(--color-text-dim)]">Rule #02 Rate Throttling:</span>
              <span className="font-semibold text-sky-500">Max 3 Posts / Platform / Day</span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-[var(--bg-surface)] border border-[var(--color-border)]">
              <span className="text-[var(--color-text-dim)]">Rule #03 Compute Guard:</span>
              <span className="font-semibold text-purple-400">Delay Dispatch if GPU Load &gt; 80%</span>
            </div>
          </div>
        </div>

        {/* SQLite Metrics Card */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--bg-card)] p-4 flex flex-col gap-2.5 text-xs font-mono-code shadow-xs">
          <div className="flex items-center gap-2 font-semibold border-b border-[var(--color-border)] pb-2 text-[var(--color-primary)]">
            <Database className="w-4 h-4 text-[var(--color-accent)]" />
            <span>SQLite Engine Telemetry</span>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between p-2 rounded-md bg-[var(--bg-surface)] border border-[var(--color-border)]">
              <span className="text-[var(--color-text-dim)]">WAL Journal Mode:</span>
              <span className="font-semibold text-emerald-500">Enabled (Zero Locks)</span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-[var(--bg-surface)] border border-[var(--color-border)]">
              <span className="text-[var(--color-text-dim)]">Write Latency:</span>
              <span className="font-semibold text-[var(--color-accent)]">0.42ms ACID Compliant</span>
            </div>
            <div className="flex justify-between p-2 rounded-md bg-[var(--bg-surface)] border border-[var(--color-border)]">
              <span className="text-[var(--color-text-dim)]">DB Integrity:</span>
              <span className="font-semibold text-emerald-500">PRAGMA integrity_check = OK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: New Scheduled Draft */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--color-border)] rounded-2xl p-5 shadow-2xl flex flex-col gap-3.5">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
              <span className="text-sm font-bold text-[var(--color-primary)]">
                New Scheduled Draft (SQLite)
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPost} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block text-[var(--color-text-dim)] font-semibold mb-1">
                  Post Content / Hook:
                </label>
                <textarea
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  rows={3}
                  required
                  placeholder="Enter hook or draft..."
                  className="w-full p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:border-[var(--color-accent)] outline-none resize-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--color-text-dim)] font-semibold mb-1">
                    Target Platform:
                  </label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)] text-[var(--color-text)] outline-none"
                  >
                    <option value="X (TWITTER)">X (Twitter)</option>
                    <option value="LINKEDIN">LinkedIn</option>
                    <option value="DEV.TO">Dev.to</option>
                    <option value="REDDIT">Reddit</option>
                    <option value="SUBSTACK">Substack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--color-text-dim)] font-semibold mb-1">
                    Division:
                  </label>
                  <select
                    value={newDivision}
                    onChange={(e) => setNewDivision(e.target.value as any)}
                    className="w-full p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)] text-[var(--color-text)] outline-none"
                  >
                    <option value="MEDIA">MEDIA</option>
                    <option value="TECH">TECH</option>
                    <option value="MAFIA">MAFIA</option>
                    <option value="SAAS">SAAS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[var(--color-text-dim)] font-semibold mb-1">
                    Calendar Slot:
                  </label>
                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)] text-[var(--color-text)] outline-none"
                  >
                    <option value="mon-0900">Mon - 09:00 UTC</option>
                    <option value="mon-1800">Mon - 18:00 UTC</option>
                    <option value="tue-0900">Tue - 09:00 UTC</option>
                    <option value="tue-1500">Tue - 15:00 UTC</option>
                    <option value="wed-1200">Wed - 12:00 UTC</option>
                    <option value="thu-1800">Thu - 18:00 UTC</option>
                    <option value="fri-1200">Fri - 12:00 UTC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[var(--color-text-dim)] font-semibold mb-1">
                    Time Display:
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--color-border)] text-[var(--color-text)] outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[var(--color-border)] mt-1">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--color-text)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[#18181b] font-semibold transition-all shadow-xs"
                >
                  Insert to SQLite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
