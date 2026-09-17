"""
MAXXX OS - Analytics Module
Performance tracking, engagement metrics, and daily digests
"""

import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional
from dataclasses import dataclass, field, asdict
from collections import defaultdict


ANALYTICS_DIR = Path(__file__).parent / "analytics"


@dataclass
class PostMetrics:
    post_id: str
    platform: str
    content_preview: str
    published_at: str = ""
    impressions: int = 0
    engagement: int = 0
    clicks: int = 0
    shares: int = 0
    comments: int = 0
    likes: int = 0
    saves: int = 0
    reach: int = 0
    url: str = ""
    metadata: dict = field(default_factory=dict)

    @property
    def engagement_rate(self) -> float:
        if self.impressions == 0:
            return 0.0
        return (self.engagement / self.impressions) * 100

    @property
    def total_engagement(self) -> int:
        return self.likes + self.comments + self.shares + self.saves


@dataclass
class DailyDigest:
    date: str
    total_posts: int = 0
    posts_by_platform: dict = field(default_factory=dict)
    total_impressions: int = 0
    total_engagement: int = 0
    avg_engagement_rate: float = 0.0
    top_post: Optional[str] = None
    top_platform: Optional[str] = None


class Analytics:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if not hasattr(self, '_initialized'):
            self._initialized = True
            ANALYTICS_DIR.mkdir(exist_ok=True)
            (ANALYTICS_DIR / "daily").mkdir(exist_ok=True)
            (ANALYTICS_DIR / "posts").mkdir(exist_ok=True)

    def _get_daily_file(self, date: str = None) -> Path:
        if date is None:
            date = datetime.now().strftime("%Y-%m-%d")
        return ANALYTICS_DIR / "daily" / f"{date}.json"

    def _get_posts_file(self) -> Path:
        return ANALYTICS_DIR / "posts" / "all_posts.jsonl"

    def track_post(self, post_id: str, platform: str, content: str,
                   url: str = "", metadata: dict = None) -> PostMetrics:
        metrics = PostMetrics(
            post_id=post_id,
            platform=platform,
            content_preview=content[:100],
            published_at=datetime.now().isoformat(),
            url=url,
            metadata=metadata or {}
        )

        posts_file = self._get_posts_file()
        with open(posts_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(asdict(metrics)) + "\n")

        self._update_daily_stats(platform)
        return metrics

    def update_metrics(self, post_id: str, **kwargs):
        posts_file = self._get_posts_file()
        if not posts_file.exists():
            return

        lines = posts_file.read_text(encoding="utf-8").strip().split("\n")
        updated_lines = []

        for line in lines:
            if not line:
                continue
            try:
                data = json.loads(line)
                if data.get("post_id") == post_id:
                    for key, value in kwargs.items():
                        if key in data:
                            data[key] = value
                updated_lines.append(json.dumps(data))
            except json.JSONDecodeError:
                updated_lines.append(line)

        posts_file.write_text("\n".join(updated_lines) + "\n", encoding="utf-8")

    def _update_daily_stats(self, platform: str):
        daily_file = self._get_daily_file()
        if daily_file.exists():
            stats = json.loads(daily_file.read_text(encoding="utf-8"))
        else:
            stats = {
                "date": datetime.now().strftime("%Y-%m-%d"),
                "total_posts": 0,
                "posts_by_platform": {},
                "total_impressions": 0,
                "total_engagement": 0
            }

        stats["total_posts"] += 1
        stats["posts_by_platform"][platform] = stats["posts_by_platform"].get(platform, 0) + 1

        daily_file.write_text(json.dumps(stats, indent=2), encoding="utf-8")

    def get_post_metrics(self, post_id: str) -> Optional[PostMetrics]:
        posts_file = self._get_posts_file()
        if not posts_file.exists():
            return None

        lines = posts_file.read_text(encoding="utf-8").strip().split("\n")
        for line in lines:
            if not line:
                continue
            try:
                data = json.loads(line)
                if data.get("post_id") == post_id:
                    return PostMetrics(**data)
            except (json.JSONDecodeError, KeyError):
                continue
        return None

    def get_daily_stats(self, date: str = None) -> dict:
        daily_file = self._get_daily_file(date)
        if daily_file.exists():
            return json.loads(daily_file.read_text(encoding="utf-8"))
        return {"date": date or datetime.now().strftime("%Y-%m-%d"), "total_posts": 0}

    def get_platform_stats(self, days: int = 7) -> dict:
        stats = defaultdict(lambda: {"posts": 0, "impressions": 0, "engagement": 0})

        posts_file = self._get_posts_file()
        if not posts_file.exists():
            return dict(stats)

        cutoff = datetime.now() - timedelta(days=days)
        lines = posts_file.read_text(encoding="utf-8").strip().split("\n")

        for line in lines:
            if not line:
                continue
            try:
                data = json.loads(line)
                published = datetime.fromisoformat(data.get("published_at", ""))
                if published >= cutoff:
                    platform = data.get("platform", "unknown")
                    stats[platform]["posts"] += 1
                    stats[platform]["impressions"] += data.get("impressions", 0)
                    stats[platform]["engagement"] += data.get("engagement", 0)
            except (json.JSONDecodeError, KeyError, ValueError):
                continue

        return dict(stats)

    def get_top_posts(self, limit: int = 10) -> list:
        posts_file = self._get_posts_file()
        if not posts_file.exists():
            return []

        posts = []
        lines = posts_file.read_text(encoding="utf-8").strip().split("\n")

        for line in lines:
            if not line:
                continue
            try:
                data = json.loads(line)
                posts.append(PostMetrics(**data))
            except (json.JSONDecodeError, KeyError):
                continue

        posts.sort(key=lambda p: p.total_engagement, reverse=True)
        return posts[:limit]

    def generate_daily_digest(self, date: str = None) -> DailyDigest:
        if date is None:
            date = datetime.now().strftime("%Y-%m-%d")

        daily_stats = self.get_daily_stats(date)
        platform_stats = self.get_platform_stats(days=1)

        total_impressions = sum(p.get("impressions", 0) for p in platform_stats.values())
        total_engagement = sum(p.get("engagement", 0) for p in platform_stats.values())
        avg_rate = (total_engagement / total_impressions * 100) if total_impressions > 0 else 0

        top_platform = max(platform_stats.items(), key=lambda x: x[1]["posts"])[0] if platform_stats else None

        digest = DailyDigest(
            date=date,
            total_posts=daily_stats.get("total_posts", 0),
            posts_by_platform=daily_stats.get("posts_by_platform", {}),
            total_impressions=total_impressions,
            total_engagement=total_engagement,
            avg_engagement_rate=avg_rate,
            top_platform=top_platform
        )

        digest_file = ANALYTICS_DIR / "daily" / f"digest_{date}.json"
        digest_file.write_text(json.dumps(asdict(digest), indent=2), encoding="utf-8")

        return digest

    def get_overview(self, days: int = 30) -> dict:
        platform_stats = self.get_platform_stats(days)
        top_posts = self.get_top_posts(5)

        total_posts = sum(p["posts"] for p in platform_stats.values())
        total_impressions = sum(p["impressions"] for p in platform_stats.values())
        total_engagement = sum(p["engagement"] for p in platform_stats.values())

        return {
            "period_days": days,
            "total_posts": total_posts,
            "total_impressions": total_impressions,
            "total_engagement": total_engagement,
            "avg_engagement_rate": (total_engagement / total_impressions * 100) if total_impressions > 0 else 0,
            "platform_breakdown": platform_stats,
            "top_posts": [{"platform": p.platform, "engagement": p.total_engagement} for p in top_posts]
        }


analytics = Analytics()
