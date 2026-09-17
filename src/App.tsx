import React, { useState, useEffect } from 'react';
import { ThemeMode, ScreenId, WorkflowStep, ScheduledPost } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomDock } from './components/BottomDock';
import { MaskyyOrbModal } from './components/MaskyyOrb';

import { DashboardScreen } from './components/screens/DashboardScreen';
import { BrainSwarmScreen } from './components/screens/BrainSwarmScreen';
import { TelemetryFeedScreen } from './components/screens/TelemetryFeedScreen';
import { VoiceInputScreen } from './components/screens/VoiceInputScreen';
import { VisionMediaScreen } from './components/screens/VisionMediaScreen';
import { DraftEditorScreen } from './components/screens/DraftEditorScreen';
import { ReviewPostScreen } from './components/screens/ReviewPostScreen';
import { ScheduleScreen } from './components/screens/ScheduleScreen';

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('notion-dark'); // Option 3: Notion Craft UI
  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [activeStep, setActiveStep] = useState<WorkflowStep>(1);
  const [isOrbModalOpen, setIsOrbModalOpen] = useState<boolean>(false);

  // Shared application state across tactical stations
  const [draftBuffer, setDraftBuffer] = useState<string>(`1/6 ⚡ The cloud AI trap is real: paying monthly rent for API keys that rate-limit your workflows and inspect your telemetry payload.

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

6/6 The future of AI isn't centralized megaclouds. It's autonomous local swarms that you actually own.`);

  // Emergency stop notification state
  const [emergencyAlert, setEmergencyAlert] = useState<boolean>(false);

  // Keyboard shortcut listener: Keys 1 to 8 switch stations
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const screenMap: Record<string, ScreenId> = {
        '1': 'dashboard',
        '2': 'brain',
        '3': 'telemetry',
        '4': 'voice',
        '5': 'vision',
        '6': 'draft',
        '7': 'review',
        '8': 'schedule',
      };

      if (screenMap[e.key]) {
        setActiveScreen(screenMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEmergencyStop = () => {
    setEmergencyAlert(true);
    setTimeout(() => setEmergencyAlert(false), 4000);
  };

  const handlePostNowFromSchedule = (post: ScheduledPost) => {
    setDraftBuffer(post.title);
    setActiveScreen('review');
  };

  const getThemeClass = () => {
    switch (currentTheme) {
      case 'notion-light':
        return 'theme-notion-light';
      case 'obsidian':
        return 'theme-obsidian';
      case 'sage':
      case 'green':
        return 'theme-sage';
      case 'amber':
      case 'red':
        return 'theme-amber';
      case 'blue':
        return 'theme-blue';
      case 'brutalist':
        return 'theme-brutalist';
      case 'notion-dark':
      case 'neutral':
      default:
        return 'theme-notion-dark';
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col bg-[var(--bg-base)] text-[var(--color-text)] select-none ${getThemeClass()} ${scanlinesEnabled ? 'crt-scanlines' : ''}`}>
      {/* Emergency Stop Banner Overlay */}
      {emergencyAlert && (
        <div className="w-full bg-rose-600 text-white font-semibold px-4 py-2 text-center text-xs tracking-wide z-50 flex items-center justify-center gap-2 shadow-lg">
          <span>⚠️ EMERGENCY PROTOCOL: ALL 11 LOCAL AGENTS HALTED IMMEDIATELY. IPC PIPELINE DISCONNECTED.</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        scanlinesEnabled={scanlinesEnabled}
        onToggleScanlines={() => setScanlinesEnabled(!scanlinesEnabled)}
        onOpenOrbModal={() => setIsOrbModalOpen(true)}
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
      />

      {/* Main Workspace Body: Sidebar + Active Screen Stage */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Tactical Navigation Sidebar */}
        <Sidebar
          activeScreen={activeScreen}
          onSelectScreen={setActiveScreen}
          onOpenOrbModal={() => setIsOrbModalOpen(true)}
        />

        {/* Center Stage Workspace */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[var(--bg-base)]">
          {activeScreen === 'dashboard' && (
            <DashboardScreen
              onNavigate={setActiveScreen}
              onOpenOrbModal={() => setIsOrbModalOpen(true)}
            />
          )}

          {activeScreen === 'brain' && (
            <BrainSwarmScreen
              onNavigate={setActiveScreen}
              onSendToDraft={(content) => {
                setDraftBuffer(content);
              }}
            />
          )}

          {activeScreen === 'telemetry' && (
            <TelemetryFeedScreen
              onNavigate={setActiveScreen}
            />
          )}

          {activeScreen === 'voice' && (
            <VoiceInputScreen
              onNavigate={setActiveScreen}
              onSendToBrain={(transcript) => {
                setDraftBuffer(transcript);
              }}
            />
          )}

          {activeScreen === 'vision' && (
            <VisionMediaScreen
              onNavigate={setActiveScreen}
              onSendToDraft={(content) => {
                setDraftBuffer(content);
              }}
            />
          )}

          {activeScreen === 'draft' && (
            <DraftEditorScreen
              initialContent={draftBuffer}
              onNavigate={setActiveScreen}
              onSendToReview={(content) => {
                setDraftBuffer(content);
              }}
            />
          )}

          {activeScreen === 'review' && (
            <ReviewPostScreen
              draftContent={draftBuffer}
              onNavigate={setActiveScreen}
            />
          )}

          {activeScreen === 'schedule' && (
            <ScheduleScreen
              onNavigate={setActiveScreen}
              onPostNow={handlePostNowFromSchedule}
            />
          )}
        </main>
      </div>

      {/* Bottom Master Dock */}
      <BottomDock
        activeStep={activeStep}
        onStepChange={setActiveStep}
        onEmergencyStop={handleEmergencyStop}
      />

      {/* Maskyy Orb Interactive Modal (4 Operational States) */}
      <MaskyyOrbModal
        isOpen={isOrbModalOpen}
        onClose={() => setIsOrbModalOpen(false)}
      />
    </div>
  );
}
