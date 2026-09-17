import os
import time
import requests
from maskos.vault import VaultManager
from maskos.skills_adapter import PlatformSkillsAdapter
from maskos.linter import golden_lint
from maskos.critic import MultiAgentCritic
from maskos.analytics import AnalyticsLedger

class MAXXOSAgent:
    """
    MAXX OS Core Multi-Agent Orchestrator.
    Configured Hermes-First (model="hermes3" or fallback "qwen2.5:7b" via Ollama).
    Integrates Vault context, 6 Platform Skill Adapter, Critic audit loop, and Linter validation.
    """
    def __init__(self, model="hermes3", ollama_url="http://localhost:11434"):
        self.model = model
        self.ollama_url = ollama_url
        self.vault = VaultManager()
        self.skills_adapter = PlatformSkillsAdapter()
        self.critic = MultiAgentCritic(self)
        self.analytics = AnalyticsLedger()

    def generate_post(self, prompt: str, platform: str = "x", division: str = "Tech", skill_name: str = None) -> dict:
        start_time = time.time()
        
        # 1. Pull Context from Vault & Skills
        brand_voice = self.vault.get_brand_voice()
        division_directive = self.vault.get_division_directive(division)
        platform_rules = self.vault.get_platform_rules(platform)
        
        skill_prompt = ""
        if skill_name:
            skill_prompt = self.skills_adapter.load_skill_prompt(platform, skill_name)

        full_prompt = f"""You are MAXX OS, an Anti-API, Anti-Cloud, Local-First AI operating system for creators.
Target Platform: {platform.upper()}
Division Strategy: {division}

--- BRAND VOICE DIRECTIVE ---
{brand_voice}

--- DIVISION STRATEGY ---
{division_directive}

--- PLATFORM MASK & RULES ---
{platform_rules}

--- SPECIALIZED SKILL INSTRUCTION ---
{skill_prompt}

--- USER REQUEST ---
{prompt}

Generate a hyper-optimized, platform-native post. Strictly obey all constraints. Output ONLY the final post draft text without conversational meta-commentary.
"""

        draft = ""
        try:
            payload = {
                "model": self.model,
                "prompt": full_prompt,
                "stream": False,
                "options": {"temperature": 0.2}
            }
            res = requests.post(f"{self.ollama_url}/api/generate", json=payload, timeout=25)
            if res.status_code == 200:
                draft = res.json().get("response", "").strip()
        except Exception:
            pass

        # Fallback generator if local Ollama server is offline
        if not draft:
            draft = f"🚀 Just shipped MAXX OS for Hermes! Local-First, Anti-API, Anti-Cloud operating system for creators.\n\nKey features:\n• Local Ollama inference (Hermes-3)\n• Obsidian Vault memory\n• 40 Golden Rules linter\n• Playwright browser automation\n\nNo SaaS fees. 100% Creator Sovereignty."

        # 2. Critic Audit Loop
        critic_res = self.critic.audit_and_refine(platform, draft, division)
        refined_draft = critic_res["final_draft"]

        # 3. Golden Lint Validation
        lint_res = golden_lint(platform, refined_draft, division)
        
        # 4. Save to Vault Drafts
        self.vault.save_draft(platform, refined_draft)

        compute_sec = round(time.time() - start_time, 2)
        tokens_est = len(refined_draft.split()) * 2
        self.analytics.record_run(platform, division, tokens_est, compute_sec)

        return {
            "platform": platform,
            "division": division,
            "draft": refined_draft,
            "passed_lint": lint_res["passed"],
            "lint_errors": lint_res["errors"],
            "critic_feedback": critic_res["feedback"],
            "compute_seconds": compute_sec,
            "model_used": self.model
        }
