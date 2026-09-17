"""
MAXXX OS - Brain Layer
LangChain Agent orchestration for autonomous content creation
Routes tasks, manages state, and executes tools
"""

import json
from typing import Optional
from dataclasses import dataclass, field
from enum import Enum

from ollama_client import ollama
from vault_reader import vault
from draft_generator import draft_generator, DraftResult
from golden_lint import validate_draft, list_platforms


class TaskState(Enum):
    IDLE = "idle"
    THINKING = "thinking"
    CLASSIFYING = "classifying"
    DRAFTING = "drafting"
    LINTING = "linting"
    REVISION = "revision"
    READY = "ready"
    ERROR = "error"


class Division(Enum):
    TECH = "tech"
    MEDIA = "media"
    MAFIA = "mafia"
    SAAS = "saas"


@dataclass
class AgentState:
    state: TaskState = TaskState.IDLE
    division: Optional[Division] = None
    platform: Optional[str] = None
    content_idea: str = ""
    draft: Optional[DraftResult] = None
    history: list = field(default_factory=list)
    error: Optional[str] = None


class MaxxxBrain:
    def __init__(self):
        self.state = AgentState()
        self.platforms_by_division = {
            Division.TECH: ["x", "linkedin", "github", "devto", "reddit", "leetcode", "hashnode", "hackernews", "peerlist"],
            Division.MEDIA: ["instagram", "youtube", "quora", "linkedout", "threads", "facebook", "substack", "telegram"],
            Division.MAFIA: ["discord", "producthunt"],
            Division.SAAS: ["producthunt"],
        }

    def _set_state(self, state: TaskState, error: str = None):
        self.state.state = state
        self.state.error = error
        self.state.history.append({
            "state": state.value,
            "error": error
        })

    def classify_input(self, user_input: str) -> dict:
        self._set_state(TaskState.THINKING)

        classification = ollama.classify_intent(user_input)
        division_str = classification.get("division", "tech")
        platform = classification.get("platform_suggestion", "x")

        try:
            division = Division(division_str)
        except ValueError:
            division = Division.TECH

        self.state.division = division
        self.state.platform = platform
        self.state.content_idea = user_input

        self._set_state(TaskState.CLASSIFYING)
        return classification

    def generate_draft(
        self,
        content_idea: str = None,
        platform: str = None,
        brand_voice: str = None
    ) -> DraftResult:
        self._set_state(TaskState.DRAFTING)

        if content_idea:
            self.state.content_idea = content_idea
        if platform:
            self.state.platform = platform

        if not self.state.content_idea:
            self._set_state(TaskState.ERROR, "No content idea provided")
            return DraftResult(
                success=False,
                platform=self.state.platform or "unknown",
                draft="",
                errors=["No content idea provided"]
            )

        platform = self.state.platform or "x"

        draft_result = draft_generator.generate_draft(
            content_idea=self.state.content_idea,
            platform=platform,
            brand_voice_override=brand_voice
        )

        self.state.draft = draft_result

        if draft_result.success:
            self._set_state(TaskState.READY)
        else:
            self._set_state(TaskState.LINTING)

        return draft_result

    def validate_draft(self, platform: str, draft: str) -> dict:
        self._set_state(TaskState.LINTING)
        result = validate_draft(platform, draft)
        if result.passed:
            self._set_state(TaskState.READY)
        return {
            "passed": result.passed,
            "errors": result.errors,
            "warnings": result.warnings
        }

    def generate_multi_platform(
        self,
        content_idea: str,
        platforms: list = None,
        brand_voice: str = None
    ) -> dict:
        self._set_state(TaskState.DRAFTING)

        if platforms is None:
            division = self.state.division or Division.TECH
            platforms = self.platforms_by_division.get(division, ["x"])

        results = {}
        for platform in platforms:
            self.state.platform = platform
            draft_result = draft_generator.generate_draft(
                content_idea=content_idea,
                platform=platform,
                brand_voice_override=brand_voice
            )
            results[platform] = draft_result

        self._set_state(TaskState.READY)
        return results

    def get_platform_suggestion(self, content_idea: str) -> list:
        classification = ollama.classify_intent(content_idea)
        division_str = classification.get("division", "tech")

        try:
            division = Division(division_str)
        except ValueError:
            division = Division.TECH

        platforms = self.platforms_by_division.get(division, ["x"])
        return platforms

    def get_brand_voice(self) -> str:
        return vault.get_brand_voice().raw_content

    def get_platform_rules(self, platform: str) -> str:
        return vault.get_platform_rules(platform).raw_content

    def list_all_platforms(self) -> list:
        return list_platforms()

    def get_status(self) -> dict:
        return {
            "state": self.state.state.value,
            "division": self.state.division.value if self.state.division else None,
            "platform": self.state.platform,
            "has_draft": self.state.draft is not None,
            "error": self.state.error
        }


brain = MaxxxBrain()
