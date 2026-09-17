"""
MAXXX OS - Vault Reader
Reads platform rules and brand voice from the Obsidian vault
Single source of truth for all content governance
"""

import os
from pathlib import Path
from typing import Optional
from dataclasses import dataclass


VAULT_PATH = Path(__file__).parent / "vault"


@dataclass
class PlatformRules:
    name: str
    division: str
    raw_content: str
    char_limit: Optional[int] = None
    word_limit: Optional[int] = None


@dataclass
class BrandVoice:
    raw_content: str
    tone: str = ""
    anti_words: list = None

    def __post_init__(self):
        if self.anti_words is None:
            self.anti_words = []


class VaultReader:
    def __init__(self, vault_path: str = None):
        self.vault_path = Path(vault_path) if vault_path else VAULT_PATH
        self._cache = {}

    def _read_file(self, relative_path: str) -> str:
        file_path = self.vault_path / relative_path
        if not file_path.exists():
            return ""
        return file_path.read_text(encoding="utf-8")

    def get_brand_voice(self) -> BrandVoice:
        if "brand_voice" in self._cache:
            return self._cache["brand_voice"]

        content = self._read_file("00-Core/BRAND-VOICE.md")

        anti_words = []
        in_anti_section = False
        for line in content.split("\n"):
            if "Anti-Words" in line or "anti-words" in line.lower():
                in_anti_section = True
                continue
            if in_anti_section:
                if line.startswith("#") or line.startswith("**"):
                    in_anti_section = False
                    continue
                word = line.strip().lstrip("- ").strip()
                if word:
                    anti_words.append(word)

        voice = BrandVoice(
            raw_content=content,
            tone="builder",
            anti_words=anti_words
        )
        self._cache["brand_voice"] = voice
        return voice

    def get_platform_rules(self, platform: str) -> PlatformRules:
        cache_key = f"platform_{platform}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        platform = platform.lower().strip()
        content = self._read_file(f"10-Platforms/{platform}.md")

        if not content:
            return PlatformRules(
                name=platform,
                division="unknown",
                raw_content="No rules found"
            )

        char_limit = None
        word_limit = None
        division = "tech"

        for line in content.split("\n"):
            if "Division:" in line:
                division = line.split("Division:")[-1].strip().lower()
            if "Max:" in line and "characters" in line:
                try:
                    char_limit = int(line.split("Max:")[-1].split("characters")[0].strip().replace(",", ""))
                except (ValueError, IndexError):
                    pass
            if "optimal" in line.lower() and "words" in line.lower():
                try:
                    parts = line.split("-")
                    if len(parts) >= 2:
                        word_limit = int(parts[-1].strip().split("words")[0].strip())
                except (ValueError, IndexError):
                    pass

        rules = PlatformRules(
            name=platform,
            division=division,
            raw_content=content,
            char_limit=char_limit,
            word_limit=word_limit
        )
        self._cache[cache_key] = rules
        return rules

    def get_division_rules(self, division: str) -> str:
        cache_key = f"division_{division}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        division = division.lower().strip()
        content = self._read_file(f"00-Core/divisions/{division}.md")
        self._cache[cache_key] = content
        return content

    def get_daily_dashboard(self) -> str:
        return self._read_file("00-Core/TODAY.md")

    def list_platforms(self) -> list:
        platforms_dir = self.vault_path / "10-Platforms"
        if not platforms_dir.exists():
            return []
        return [
            f.stem for f in platforms_dir.glob("*.md")
            if f.stem != "README"
        ]

    def get_platform_hint(self, platform: str) -> str:
        rules = self.get_platform_rules(platform)
        lines = rules.raw_content.split("\n")
        hints = []
        for line in lines:
            if line.startswith("- ") and not line.startswith("- ["):
                hints.append(line[2:])
        return "\n".join(hints[:5])


vault = VaultReader()
