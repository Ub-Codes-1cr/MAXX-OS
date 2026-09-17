# MAXX OS v1 (Interactive Web Demo) 🚀
### The Local-First Anti-API Sovereign Creator Operating System

![License: MIT](https://img.shields.io/badge/License-MIT-white.svg)
![Philosophy](https://img.shields.io/badge/Philosophy-Anti--API%20%7C%20Anti--Cloud-black.svg)
![Models](https://img.shields.io/badge/LLM-Hermes--3%20%7C%20Qwen-black.svg)
![Author](https://img.shields.io/badge/Author-Ub--Codes--1cr-black.svg)
![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%20%7C%20Tailwind%20v4-blue.svg)
![Deployment](https://img.shields.io/badge/Deploy-Vercel%20%7C%20GitHub%20Pages-success.svg)

> ⚠️ **DEMO NOTICE**: This repository contains **MAXX OS v1 Interactive Studio & Web Demo**. It showcases the complete sovereign multi-station HUD, interactive floating Dock Bar, local swarm node monitors, draft linters, and multimodal sensors in an interactive web application demo.

> **Local-First. Anti-API. Anti-Cloud. 100% Creator Sovereignty.**  
> Developed & Maintained by [Syed Ubada (Ub-Codes-1cr)](https://github.com/Ub-Codes-1cr).

---

## 🌟 About MAXX OS

**MAXX OS** is an Anti-API operating system engineered for creators, developer advocates (DevRel), and founders. By leveraging local Large Language Models (Hermes-3 / Qwen via Ollama), a structured local Obsidian Vault for memory, and persistent browser automation, MAXX OS bypasses third-party API gateways and monthly SaaS paywalls entirely.

---

## ✨ Features & Architecture Highlights

### 📱 1. Mobile & Desktop Pop-Up Dock Bar
- **Floating Glassmorphic Pop-Up Dock**: Positioned at the bottom center (`fixed bottom-3 left-1/2 -translate-x-1/2 z-[100]`) with backdrop blur (`backdrop-blur-2xl`), pill contours, and micro-hover scaling.
- **Collapsible Mobile Toggle**: Toggle button to minimize/expand the dock bar cleanly on mobile screens.
- **Grouped Controls**:
  - **Audio & State**: Synthesizer `TTS On / Muted`, `Pause / Resume`, and Workflow `Restart`.
  - **7-Step Workflow Pipeline**: `1. Greet`, `2. Div: MEDIA`, `3. Idle`, `4. Listen`, `5. Think`, `6. Exec`, `7. Approve (HITL)`.
  - **Sensors & Emergency Controls**: Visual `Camera On/Off`, `Auto Dispatch`, and Emergency `Stop Swarm`.

### 🎛️ 2. 8 Multimodal Operational Stations
1. **Dashboard (HUD)**: Live system health metrics, Termux A13 hardware bento (Battery 92%, Temp 38.4°C, Tailscale, Ollama v0.5.4), IPC bus indicator, and quick actions.
2. **Brain & Agent Swarm**: Visual 11-node cyclic state graph with agent roles (Orchestrator, Research, Synth Writer, Eval Critic, Humanizer, Linter Guard, HITL Staging).
3. **Telemetry & Terminal**: Real-time streaming log feeds, IPC bus payload monitors, latency graphs, and Termux terminal command output.
4. **Voice Input (Whisper VAD)**: Local Faster-Whisper audio transcription panel with VAD spectrum visualizer and transcript-to-draft buffer.
5. **Vision & Media Lab (Qwen-VL)**: Multimodal image-to-text inspection engine for screenshot analysis and viral media prompt generation.
6. **Draft Editor & Linter**: Multi-tab draft editor enforcing **40 Golden Rules** (anti-AI slop word filter, character limits, formatting checks, line spacing).
7. **Review & Post (HITL)**: Human-In-The-Loop gate with biometric confirmation preview, Playwright anti-API execution simulator, and pyperclip fallback.
8. **Schedule Calendar**: SQLite-backed post queue visualizer with draft preview and "Post Now" trigger.

### 🎨 3. Ergonomic Design System & Themes
- **5 Premium Color Themes**: Notion Warm Dark, Notion Paper Light, Obsidian Titanium, Forest Sage, and Terracotta Amber.
- **CRT Scanline Mode**: Retro cybernetic scanlines toggle (`scanlinesEnabled`).
- **Maskyy Orb Acoustic Monitor**: Interactive 4-state 3D canvas visualizer modal (Idle, Listening, Thinking, Executing).

---

## 🚀 Quickstart & Local Setup

### 1. Installation
```bash
git clone https://github.com/Ub-Codes-1cr/MAXX-OS.git
cd MAXX-OS
npm install --legacy-peer-deps
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3001](http://localhost:3001) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## ⚡ Deployment to Vercel

This demo is ready to deploy on **Vercel** with zero configuration required (`vercel.json` included):

```bash
npx vercel --prod
```

Or deploy directly via the [Vercel Dashboard](https://vercel.com/new) by importing this GitHub repository: `https://github.com/Ub-Codes-1cr/MAXX-OS`.

---

## 📁 Repository Structure

```text
MAXX-OS/
├── src/
│   ├── App.tsx                 # Main Application Layout & State Container
│   ├── index.css               # Design System & Theme CSS Variables
│   ├── types.ts                # TypeScript Data Interfaces
│   ├── components/
│   │   ├── Header.tsx          # Top Header & Mobile Drawer Navigation
│   │   ├── Sidebar.tsx         # Left Navigation & Hardware Status Bento
│   │   ├── BottomDock.tsx      # Floating Glassmorphic Pop-Up Dock Bar
│   │   ├── MaskyyOrb.tsx       # Interactive Maskyy Orb Modal
│   │   └── screens/            # 8 Operational Station Screens
├── vercel.json                 # Vercel Deployment Config
├── vite.config.ts              # Vite & Path Configuration
├── package.json                # Project Dependencies
└── README.md                   # Project Documentation
```

---

## ⚖️ License
Distributed under the MIT License. Copyright (c) 2026 **Syed Ubada** ([Ub-Codes-1cr](https://github.com/Ub-Codes-1cr)).
