"""
MAXXX OS - Scheduler System
Post scheduling, queuing, and cron management
"""

import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, Callable
from dataclasses import dataclass, field, asdict
from enum import Enum
import threading
import time


SCHEDULE_DIR = Path(__file__).parent / "schedules"


class ScheduleStatus(Enum):
    PENDING = "pending"
    QUEUED = "queued"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


@dataclass
class ScheduledPost:
    id: str
    platform: str
    content: str
    scheduled_time: str
    status: ScheduleStatus = ScheduleStatus.PENDING
    created_at: str = ""
    executed_at: str = ""
    error: str = ""
    retry_count: int = 0
    max_retries: int = 3
    metadata: dict = field(default_factory=dict)

    def __post_init__(self):
        if not self.created_at:
            self.created_at = datetime.now().isoformat()


class Scheduler:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if not hasattr(self, '_initialized'):
            self._initialized = True
            SCHEDULE_DIR.mkdir(exist_ok=True)
            self._running = False
            self._thread = None
            self._callback = None
            self._check_interval = 60

    def _get_queue_file(self) -> Path:
        return SCHEDULE_DIR / "queue.jsonl"

    def _get_archive_dir(self) -> Path:
        archive_dir = SCHEDULE_DIR / "archive"
        archive_dir.mkdir(exist_ok=True)
        return archive_dir

    def schedule_post(self, platform: str, content: str,
                      scheduled_time: datetime, metadata: dict = None) -> ScheduledPost:
        post_id = datetime.now().strftime("%Y%m%d%H%M%S%f")
        post = ScheduledPost(
            id=post_id,
            platform=platform,
            content=content,
            scheduled_time=scheduled_time.isoformat(),
            metadata=metadata or {}
        )

        queue_file = self._get_queue_file()
        post_dict = asdict(post)
        post_dict["status"] = post.status.value
        with open(queue_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(post_dict) + "\n")

        return post

    def schedule_multiple(self, posts: list) -> list:
        scheduled = []
        for post_data in posts:
            post = self.schedule_post(
                platform=post_data["platform"],
                content=post_data["content"],
                scheduled_time=post_data["scheduled_time"],
                metadata=post_data.get("metadata", {})
            )
            scheduled.append(post)
        return scheduled

    def get_pending_posts(self) -> list:
        queue_file = self._get_queue_file()
        if not queue_file.exists():
            return []

        posts = []
        lines = queue_file.read_text(encoding="utf-8").strip().split("\n")
        for line in lines:
            if not line:
                continue
            try:
                data = json.loads(line)
                data["status"] = ScheduleStatus(data["status"])
                post = ScheduledPost(**data)
                if post.status in [ScheduleStatus.PENDING, ScheduleStatus.QUEUED]:
                    posts.append(post)
            except (json.JSONDecodeError, KeyError):
                continue

        posts.sort(key=lambda p: p.scheduled_time)
        return posts

    def get_ready_posts(self) -> list:
        pending = self.get_pending_posts()
        now = datetime.now()
        ready = []
        for post in pending:
            scheduled_time = datetime.fromisoformat(post.scheduled_time)
            if scheduled_time <= now:
                ready.append(post)
        return ready

    def update_status(self, post_id: str, status: ScheduleStatus, error: str = ""):
        queue_file = self._get_queue_file()
        if not queue_file.exists():
            return

        lines = queue_file.read_text(encoding="utf-8").strip().split("\n")
        updated_lines = []

        for line in lines:
            if not line:
                continue
            try:
                data = json.loads(line)
                if data.get("id") == post_id:
                    data["status"] = status.value
                    if status == ScheduleStatus.EXECUTING:
                        data["executed_at"] = datetime.now().isoformat()
                    if error:
                        data["error"] = error
                    if status == ScheduleStatus.FAILED:
                        data["retry_count"] = data.get("retry_count", 0) + 1
                updated_lines.append(json.dumps(data))
            except json.JSONDecodeError:
                updated_lines.append(line)

        queue_file.write_text("\n".join(updated_lines) + "\n", encoding="utf-8")

    def cancel_post(self, post_id: str):
        self.update_status(post_id, ScheduleStatus.CANCELLED)

    def retry_post(self, post_id: str) -> bool:
        queue_file = self._get_queue_file()
        if not queue_file.exists():
            return False

        lines = queue_file.read_text(encoding="utf-8").strip().split("\n")
        for line in lines:
            if not line:
                continue
            try:
                data = json.loads(line)
                if data.get("id") == post_id:
                    if data.get("retry_count", 0) >= data.get("max_retries", 3):
                        return False
                    data["status"] = ScheduleStatus.PENDING.value
                    data["error"] = ""
                    self.update_status(post_id, ScheduleStatus.PENDING)
                    return True
            except json.JSONDecodeError:
                continue
        return False

    def clear_completed(self):
        queue_file = self._get_queue_file()
        if not queue_file.exists():
            return

        lines = queue_file.read_text(encoding="utf-8").strip().split("\n")
        archive_dir = self._get_archive_dir()
        today = datetime.now().strftime("%Y-%m-%d")
        archive_file = archive_dir / f"completed_{today}.jsonl"

        kept_lines = []
        archived_lines = []

        for line in lines:
            if not line:
                continue
            try:
                data = json.loads(line)
                status = data.get("status")
                if status in [ScheduleStatus.COMPLETED.value, ScheduleStatus.CANCELLED.value]:
                    archived_lines.append(line)
                else:
                    kept_lines.append(line)
            except json.JSONDecodeError:
                kept_lines.append(line)

        if archived_lines:
            with open(archive_file, "a", encoding="utf-8") as f:
                f.write("\n".join(archived_lines) + "\n")

        queue_file.write_text("\n".join(kept_lines) + "\n", encoding="utf-8")

    def start(self, callback: Callable, interval: int = 60):
        if self._running:
            return

        self._callback = callback
        self._check_interval = interval
        self._running = True
        self._thread = threading.Thread(target=self._run_loop, daemon=True)
        self._thread.start()

    def stop(self):
        self._running = False
        if self._thread:
            self._thread.join(timeout=5)

    def _run_loop(self):
        while self._running:
            try:
                ready_posts = self.get_ready_posts()
                for post in ready_posts:
                    self.update_status(post.id, ScheduleStatus.EXECUTING)
                    try:
                        if self._callback:
                            self._callback(post)
                        self.update_status(post.id, ScheduleStatus.COMPLETED)
                    except Exception as e:
                        self.update_status(post.id, ScheduleStatus.FAILED, str(e))
                        if post.retry_count < post.max_retries:
                            self.retry_post(post.id)

                self.clear_completed()
            except Exception as e:
                pass

            time.sleep(self._check_interval)

    def get_stats(self) -> dict:
        pending = self.get_pending_posts()
        queue_file = self._get_queue_file()
        total = 0
        completed = 0
        failed = 0

        if queue_file.exists():
            lines = queue_file.read_text(encoding="utf-8").strip().split("\n")
            for line in lines:
                if not line:
                    continue
                try:
                    data = json.loads(line)
                    total += 1
                    status = data.get("status")
                    if status == ScheduleStatus.COMPLETED.value:
                        completed += 1
                    elif status == ScheduleStatus.FAILED.value:
                        failed += 1
                except json.JSONDecodeError:
                    continue

        return {
            "pending": len(pending),
            "total": total,
            "completed": completed,
            "failed": failed
        }


scheduler = Scheduler()
