# MAXX OS: The Local-First Anti-API Creator Operating System

![License: MIT](https://img.shields.io/badge/License-MIT-white.svg)
![Philosophy](https://img.shields.io/badge/Philosophy-Anti--API%20%7C%20Anti--Cloud-black.svg)
![Models](https://img.shields.io/badge/LLM-Hermes--3%20%7C%20Qwen-black.svg)
![Author](https://img.shields.io/badge/Author-Ub--Codes--1cr-black.svg)
![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-blue.svg)

> **Local-First. Anti-API. Anti-Cloud. 100% Creator Sovereignty.**
> Developed & Maintained by [Ub-Codes-1cr](https://github.com/Ub-Codes-1cr).

MAXX OS is an Anti-API operating system engineered for creators, developer advocates (DevRel), and founders. By leveraging local Large Language Models (Hermes-3 / Qwen via Ollama), a structured local Obsidian Vault for memory, and Playwright persistent browser automation, MAXX OS bypasses third-party API gateways and monthly SaaS paywalls entirely.

---

## 🔮 Key Architectural Pillars

1. **Hermes-First Local Intelligence:** All LLM inference runs locally via Ollama (`hermes3:8b` or `qwen2.5:7b`). Zero data leaves your machine.
2. **Custom React + Vite Studio Frontend:** High-performance, multi-station cybernetic dashboard featuring the **Tyler ASI Radar & Maskyy Orb Acoustic Monitor**, live IPC bus indicators, station swapper, theme selector, and telemetry feed.
3. **Obsidian Vault Memory Layer:** Stored in standard Markdown (`./maskyyy/vault/`). Houses brand guidelines, platform masks, and past few-shot viral data.
4. **40 Golden Rules Linter:** Deterministic validation (`validate_draft`) enforcing character limits, formatting, line-spacing, code blocks, and global anti-word filters across 20 platform masks.
5. **6 Native Platform Skill Suites:**
   - **X (Twitter):** Tweet writer, Thread builder, Hook extractor, Humanizer, Audience insights.
   - **LinkedIn:** Thought leadership writer, Comment drafter, Employee advocacy, Repurposer.
   - **Facebook:** Page post writer, Engagement prompt generator, Page optimizer.
   - **Instagram:** Caption writer, Carousel planner, Hashtag strategist, Visual hook extractor.
   - **Threads:** Micro-thread builder, Conversational writer, Reply drafter.
   - **YouTube:** Scriptwriter, Timestamp/Description generator, Title optimizer.
6. **Playwright Anti-API Execution:** Connects directly to your existing Chrome browser session, types drafts with human keystroke delays (50ms), and pauses for Human-In-The-Loop (HITL) approval before publishing. Includes `pyperclip` fallback.

---

## 🛠️ Quickstart Guide

### 1. Prerequisites
- Python 3.10+ & Node.js 18+
- [Ollama](https://ollama.com/) running locally.
- Google Chrome browser.

### 2. Pull the Hermes Model
```bash
ollama run hermes3:8b
```

### 3. Installation
```bash
git clone https://github.com/Ub-Codes-1cr/MAXX-OS.git
cd MAXX-OS
pip install -r requirements.txt
playwright install chromium

cd "maxxx Final"
npm install --legacy-peer-deps
cd ..
```

### 4. Launch MAXX OS
```bash
python start_maxx_os.py
```
- **React Frontend**: `http://localhost:3000`
- **API Server**: `http://localhost:8000`

---

## 📁 Repository Structure

```text
MAXX-OS/
├── maxxx Final/                # Custom React + Vite Studio Frontend
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── BottomDock.tsx
│   │   │   ├── MaskyyOrb.tsx
│   │   │   └── screens/
│   │   │       ├── DashboardScreen.tsx
│   │   │       ├── BrainSwarmScreen.tsx
│   │   │       ├── VoiceInputScreen.tsx
│   │   │       ├── VisionMediaScreen.tsx
│   │   │       ├── DraftEditorScreen.tsx
│   │   │       ├── ReviewPostScreen.tsx
│   │   │       ├── ScheduleScreen.tsx
│   │   │       └── TelemetryFeedScreen.tsx
├── start_maxx_os.py            # Master launcher for API & Frontend
├── maxxos/                     # Core Local Engine
│   ├── server.py               # FastAPI Local API Server Bridge
│   ├── agent.py                # Multi-Agent Orchestrator
│   ├── linter.py               # 40 Golden Rules Linter
│   ├── vault.py                # Obsidian Vault Manager
│   ├── executor.py             # Playwright Anti-API Engine
│   ├── skills_adapter.py       # Native 6 Platform Skill Adapter
│   ├── voice.py                # Local Faster-Whisper Engine
│   ├── vision.py               # Local Qwen-VL Vision Engine
│   ├── critic.py               # Multi-Agent Critic Debate Loop
│   └── analytics.py            # Compute & API Cost Savings Ledger
├── skills/                     # Native Unified Skills (X, LinkedIn, FB, IG, Threads, YT)
└── maskyyy/
    └── vault/                  # Local Obsidian Vault Memory
```

---

## ⚖️ License
Distributed under the MIT License. Copyright (c) 2026 [Ub-Codes-1cr](https://github.com/Ub-Codes-1cr).
