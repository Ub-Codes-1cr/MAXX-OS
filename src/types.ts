export type ThemeMode = 
  | 'notion-dark' 
  | 'notion-light' 
  | 'obsidian' 
  | 'sage' 
  | 'amber' 
  | 'green' 
  | 'red' 
  | 'brutalist' 
  | 'blue' 
  | 'neutral';

export type ScreenId = 
  | 'dashboard'
  | 'brain'
  | 'telemetry'
  | 'voice'
  | 'vision'
  | 'draft'
  | 'review'
  | 'schedule';

export type OrbState = 'orb-silent' | 'orb-idle' | 'orb-active' | 'orb-processing';

export type WorkflowStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface LogEntry {
  id: string;
  timestamp: string;
  category: string;
  message: string;
  type?: 'primary' | 'secondary' | 'accent' | 'warning' | 'error' | 'dim';
}

export interface ScheduledPost {
  id: string;
  scheduledTime: string;
  timeRemaining: string;
  platform: 'X (TWITTER)' | 'LINKEDIN' | 'DEV.TO' | 'REDDIT' | 'SUBSTACK';
  division: 'MEDIA' | 'TECH' | 'MAFIA' | 'SAAS';
  title: string;
  subtitle?: string;
  media: string;
  status: 'PENDING STAGE' | 'READY' | 'POSTED';
  slot: string; // e.g. 'mon-0900'
}

export interface RuleCheck {
  id: string;
  ruleNumber: string;
  title: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  value: string;
  detail: string;
}
