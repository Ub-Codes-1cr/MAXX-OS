"""
MAXXX OS - Memory System
Conversation history persistence and context retrieval
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Optional
from dataclasses import dataclass, field, asdict
from enum import Enum


MEMORY_DIR = Path(__file__).parent / "memory"
VAULT_DIR = Path(__file__).parent / "vault"


class MemoryType(Enum):
    CONVERSATION = "conversation"
    DRAFT = "draft"
    PUBLISHED = "published"
    LEARNING = "learning"
    PATTERN = "pattern"


@dataclass
class MemoryEntry:
    id: str
    type: MemoryType
    content: str
    platform: str = ""
    metadata: dict = field(default_factory=dict)
    timestamp: str = ""
    tags: list = field(default_factory=list)

    def __post_init__(self):
        if not self.timestamp:
            self.timestamp = datetime.now().isoformat()


class MemorySystem:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if not hasattr(self, '_initialized'):
            self._initialized = True
            MEMORY_DIR.mkdir(exist_ok=True)
            (MEMORY_DIR / "conversations").mkdir(exist_ok=True)
            (MEMORY_DIR / "drafts").mkdir(exist_ok=True)
            (MEMORY_DIR / "published").mkdir(exist_ok=True)
            (MEMORY_DIR / "patterns").mkdir(exist_ok=True)
            self._cache = {}

    def _get_file_path(self, memory_type: MemoryType, date_str: str = None) -> Path:
        if date_str is None:
            date_str = datetime.now().strftime("%Y-%m-%d")
        type_dir = MEMORY_DIR / f"{memory_type.value}s"
        return type_dir / f"{date_str}.jsonl"

    def _generate_id(self) -> str:
        return datetime.now().strftime("%Y%m%d%H%M%S%f")

    def store(self, memory_type: MemoryType, content: str, platform: str = "",
              metadata: dict = None, tags: list = None) -> MemoryEntry:
        entry = MemoryEntry(
            id=self._generate_id(),
            type=memory_type,
            content=content,
            platform=platform,
            metadata=metadata or {},
            tags=tags or []
        )

        file_path = self._get_file_path(memory_type)
        entry_dict = asdict(entry)
        entry_dict["type"] = entry.type.value
        with open(file_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry_dict) + "\n")

        return entry

    def retrieve_recent(self, memory_type: MemoryType, count: int = 10) -> list:
        file_path = self._get_file_path(memory_type)
        if not file_path.exists():
            return []

        entries = []
        lines = file_path.read_text(encoding="utf-8").strip().split("\n")
        for line in reversed(lines):
            if not line:
                continue
            try:
                data = json.loads(line)
                data["type"] = MemoryType(data["type"])
                entries.append(MemoryEntry(**data))
                if len(entries) >= count:
                    break
            except (json.JSONDecodeError, KeyError):
                continue

        return entries

    def search(self, query: str, memory_type: MemoryType = None,
               platform: str = None, tags: list = None, limit: int = 20) -> list:
        results = []
        types_to_search = [memory_type] if memory_type else list(MemoryType)

        for mtype in types_to_search:
            type_dir = MEMORY_DIR / f"{mtype.value}s"
            if not type_dir.exists():
                continue

            for file_path in sorted(type_dir.glob("*.jsonl"), reverse=True):
                lines = file_path.read_text(encoding="utf-8").strip().split("\n")
                for line in lines:
                    if not line:
                        continue
                    try:
                        data = json.loads(line)
                        if query.lower() in data.get("content", "").lower():
                            if platform and data.get("platform") != platform:
                                continue
                            if tags and not all(t in data.get("tags", []) for t in tags):
                                continue
                            data["type"] = MemoryType(data["type"])
                            results.append(MemoryEntry(**data))
                            if len(results) >= limit:
                                return results
                    except (json.JSONDecodeError, KeyError):
                        continue

        return results

    def get_viral_patterns(self, platform: str = None) -> list:
        patterns = self.retrieve_recent(MemoryType.PATTERN, count=100)
        if platform:
            patterns = [p for p in patterns if p.platform == platform]
        return patterns

    def store_draft(self, platform: str, draft: str, metadata: dict = None) -> MemoryEntry:
        return self.store(
            MemoryType.DRAFT,
            content=draft,
            platform=platform,
            metadata=metadata or {},
            tags=["draft", platform]
        )

    def store_published(self, platform: str, content: str, url: str = "",
                        metrics: dict = None) -> MemoryEntry:
        metadata = {"url": url}
        if metrics:
            metadata["metrics"] = metrics
        return self.store(
            MemoryType.PUBLISHED,
            content=content,
            platform=platform,
            metadata=metadata,
            tags=["published", platform]
        )

    def store_pattern(self, pattern: str, platform: str,
                      success_rate: float = 0.0) -> MemoryEntry:
        return self.store(
            MemoryType.PATTERN,
            content=pattern,
            platform=platform,
            metadata={"success_rate": success_rate},
            tags=["pattern", platform]
        )

    def get_conversation_history(self, count: int = 20) -> list:
        return self.retrieve_recent(MemoryType.CONVERSATION, count)

    def store_conversation(self, role: str, content: str, metadata: dict = None) -> MemoryEntry:
        return self.store(
            MemoryType.CONVERSATION,
            content=content,
            metadata={"role": role, **(metadata or {})},
            tags=["conversation", role]
        )

    def get_stats(self) -> dict:
        stats = {}
        for mtype in MemoryType:
            type_dir = MEMORY_DIR / f"{mtype.value}s"
            if type_dir.exists():
                total_entries = 0
                for file_path in type_dir.glob("*.jsonl"):
                    lines = file_path.read_text(encoding="utf-8").strip().split("\n")
                    total_entries += len([l for l in lines if l])
                stats[mtype.value] = total_entries
            else:
                stats[mtype.value] = 0
        return stats

    def cleanup_old(self, days: int = 90):
        cutoff = datetime.now().timestamp() - (days * 86400)
        for mtype in MemoryType:
            type_dir = MEMORY_DIR / f"{mtype.value}s"
            if not type_dir.exists():
                continue
            for file_path in type_dir.glob("*.jsonl"):
                try:
                    date_str = file_path.stem
                    file_date = datetime.strptime(date_str, "%Y-%m-%d").timestamp()
                    if file_date < cutoff:
                        file_path.unlink()
                except (ValueError, OSError):
                    pass


memory = MemorySystem()
