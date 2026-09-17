# MAXX OS: The Local-First Anti-API Creator Operating System

![License: MIT](https://img.shields.io/badge/License-MIT-white.svg)
![Philosophy](https://img.shields.io/badge/Philosophy-Anti--API%20%7C%20Anti--Cloud-black.svg)
![Models](https://img.shields.io/badge/LLM-Hermes--3%20%7C%20Qwen-black.svg)
![Author](https://img.shields.io/badge/Author-Ub--Codes--1cr-black.svg)

> **Local-First. Anti-API. Anti-Cloud. 100% Creator Sovereignty.**
> Developed & Maintained by [Ub-Codes-1cr](https://github.com/Ub-Codes-1cr).

MAXX OS is an Anti-API operating system engineered for creators, developer advocates (DevRel), and founders. By leveraging local Large Language Models (Hermes-3 / Qwen via Ollama), a structured local Obsidian Vault for memory, and Playwright persistent browser automation, MAXX OS bypasses third-party API gateways and monthly SaaS paywalls entirely.

---

## 🔮 Key Architectural Pillars

1. **Hermes-First Local Intelligence:** All LLM inference runs locally via Ollama (`hermes3:8b` or `qwen2.5:7b`). Zero data leaves your machine.
2. **Obsidian Vault Memory Layer:** Stored in standard Markdown (`./maskyyy/vault/`). Houses brand guidelines, platform masks, and past few-shot viral data.
3. **40 Golden Rules Linter:** Deterministic validation (`golden_lint.py`) enforcing character limits, formatting, line-spacing, code blocks, and global anti-word filters across 20 platform masks.
4. **6 Native Platform Skill Suites:**
   - **X (Twitter):** Tweet writer, Thread builder, Hook extractor, Humanizer, Audience insights.
   - **LinkedIn:** Thought leadership writer, Comment drafter, Employee advocacy, Repurposer.
   - **Facebook:** Page post writer, Engagement prompt generator, Page optimizer.
   - **Instagram:** Caption writer, Carousel planner, Hashtag strategist, Visual hook extractor.
   - **Threads:** Micro-thread builder, Conversational writer, Reply drafter.
   - **YouTube:** Scriptwriter, Timestamp/Description generator, Title optimizer.
5. **Playwright Anti-API Execution:** Connects directly to your existing Chrome browser session, types drafts with human keystroke delays (50ms), and pauses for Human-In-The-Loop (HITL) approval before publishing. Includes `pyperclip` fallback.
6. **Maskyy Orb Visual Identity:** Brutalist black-and-white dashboard (`app.py`) featuring an animated 4-state orb (Silent, Idle, Active, Processing).

---

## 🛠️ Quickstart Guide

### 1. Prerequisites
- Python 3.10+
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
```

### 4. Run MAXX OS
```bash
streamlit run app.py
```
Open your browser at `http://localhost:8501`.

---

## 📁 Repository Structure

```text
MAXX-OS/
├── app.py                      # Main Streamlit UI with Maskyy Orb animation & 8 pages
├── requirements.txt            # Python dependencies
├── README.md                   # Technical manifesto & setup guide
├── LICENSE                     # MIT License
├── installer_script.iss        # Inno Setup desktop package script
├── build_desktop.py            # PyInstaller build script
├── maskos/                     # Core Package
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
        ├── 00-Core/            # Brand voice & Division strategy
        ├── 10-Platforms/       # Platform rules & masks
        ├── 40-Drafts/          # Staged drafts
        ├── 60-Analytics/       # Cost & compute CSV ledger
        └── Viral_Data/         # Few-shot examples
```

---

## ⚖️ License
Distributed under the MIT License. Copyright (c) 2026 [Ub-Codes-1cr](https://github.com/Ub-Codes-1cr).
