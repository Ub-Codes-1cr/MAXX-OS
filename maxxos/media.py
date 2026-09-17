"""
MAXXX OS - Media Handler
Image/video processing and upload support
"""

import os
import shutil
import hashlib
from pathlib import Path
from typing import Optional
from dataclasses import dataclass
from enum import Enum


MEDIA_DIR = Path(__file__).parent / "media"
TEMP_DIR = Path(__file__).parent / "temp"


class MediaType(Enum):
    IMAGE = "image"
    VIDEO = "video"
    GIF = "gif"
    DOCUMENT = "document"


@dataclass
class MediaFile:
    path: str
    filename: str
    media_type: MediaType
    size_bytes: int
    hash: str
    width: int = 0
    height: int = 0
    duration: float = 0.0
    metadata: dict = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


SUPPORTED_IMAGE_FORMATS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"}
SUPPORTED_VIDEO_FORMATS = {".mp4", ".mov", ".avi", ".mkv", ".webm"}
SUPPORTED_DOC_FORMATS = {".pdf", ".doc", ".docx", ".txt"}

PLATFORM_MEDIA_LIMITS = {
    "x": {"max_images": 4, "max_video_size_mb": 512, "max_image_size_mb": 5},
    "linkedin": {"max_images": 1, "max_video_size_mb": 5000, "max_image_size_mb": 5},
    "instagram": {"max_images": 10, "max_video_size_mb": 100, "max_image_size_mb": 30},
    "facebook": {"max_images": 10, "max_video_size_mb": 10000, "max_image_size_mb": 10},
    "reddit": {"max_images": 1, "max_video_size_mb": 100, "max_image_size_mb": 20},
    "youtube": {"max_video_size_mb": 128000, "max_image_size_mb": 2},
    "threads": {"max_images": 10, "max_video_size_mb": 100, "max_image_size_mb": 30},
    "telegram": {"max_images": 10, "max_video_size_mb": 2000, "max_image_size_mb": 10},
    "discord": {"max_images": 10, "max_video_size_mb": 500, "max_image_size_mb": 8},
    "default": {"max_images": 1, "max_video_size_mb": 100, "max_image_size_mb": 5},
}


class MediaHandler:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if not hasattr(self, '_initialized'):
            self._initialized = True
            MEDIA_DIR.mkdir(exist_ok=True)
            TEMP_DIR.mkdir(exist_ok=True)
            (MEDIA_DIR / "images").mkdir(exist_ok=True)
            (MEDIA_DIR / "videos").mkdir(exist_ok=True)
            (MEDIA_DIR / "processed").mkdir(exist_ok=True)

    def _calculate_hash(self, file_path: str) -> str:
        hasher = hashlib.md5()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(8192), b""):
                hasher.update(chunk)
        return hasher.hexdigest()

    def _get_media_type(self, filename: str) -> MediaType:
        ext = Path(filename).suffix.lower()
        if ext in SUPPORTED_IMAGE_FORMATS:
            return MediaType.IMAGE
        elif ext in SUPPORTED_VIDEO_FORMATS:
            return MediaType.VIDEO
        elif ext == ".gif":
            return MediaType.GIF
        else:
            return MediaType.DOCUMENT

    def register_media(self, file_path: str) -> Optional[MediaFile]:
        if not os.path.exists(file_path):
            return None

        filename = os.path.basename(file_path)
        media_type = self._get_media_type(filename)
        size_bytes = os.path.getsize(file_path)
        file_hash = self._calculate_hash(file_path)

        return MediaFile(
            path=file_path,
            filename=filename,
            media_type=media_type,
            size_bytes=size_bytes,
            hash=file_hash
        )

    def validate_for_platform(self, media: MediaFile, platform: str) -> dict:
        limits = PLATFORM_MEDIA_LIMITS.get(platform, PLATFORM_MEDIA_LIMITS["default"])
        errors = []
        warnings = []

        size_mb = media.size_bytes / (1024 * 1024)

        if media.media_type in [MediaType.IMAGE, MediaType.GIF]:
            max_size = limits.get("max_image_size_mb", 5)
            if size_mb > max_size:
                errors.append(f"Image too large: {size_mb:.1f}MB (max: {max_size}MB)")
        elif media.media_type == MediaType.VIDEO:
            max_size = limits.get("max_video_size_mb", 100)
            if size_mb > max_size:
                errors.append(f"Video too large: {size_mb:.1f}MB (max: {max_size}MB)")

        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings,
            "size_mb": size_mb,
            "limits": limits
        }

    def copy_to_media(self, source_path: str, subfolder: str = "images") -> Optional[str]:
        if not os.path.exists(source_path):
            return None

        dest_dir = MEDIA_DIR / subfolder
        dest_dir.mkdir(exist_ok=True)

        filename = os.path.basename(source_path)
        dest_path = dest_dir / filename

        counter = 1
        while dest_path.exists():
            stem = Path(filename).stem
            suffix = Path(filename).suffix
            dest_path = dest_dir / f"{stem}_{counter}{suffix}"
            counter += 1

        shutil.copy2(source_path, dest_path)
        return str(dest_path)

    def prepare_for_upload(self, file_path: str, platform: str) -> dict:
        media = self.register_media(file_path)
        if not media:
            return {"success": False, "error": "File not found"}

        validation = self.validate_for_platform(media, platform)
        if not validation["valid"]:
            return {"success": False, "errors": validation["errors"]}

        subfolder = "images" if media.media_type in [MediaType.IMAGE, MediaType.GIF] else "videos"
        copied_path = self.copy_to_media(file_path, subfolder)

        if not copied_path:
            return {"success": False, "error": "Failed to copy file"}

        return {
            "success": True,
            "media_path": copied_path,
            "original_path": file_path,
            "media_type": media.media_type.value,
            "size_mb": validation["size_mb"],
            "platform": platform
        }

    def cleanup_temp(self):
        if TEMP_DIR.exists():
            for file in TEMP_DIR.glob("*"):
                try:
                    file.unlink()
                except OSError:
                    pass

    def get_media_stats(self) -> dict:
        stats = {"images": 0, "videos": 0, "total_size_mb": 0}

        images_dir = MEDIA_DIR / "images"
        videos_dir = MEDIA_DIR / "videos"

        if images_dir.exists():
            for f in images_dir.glob("*"):
                stats["images"] += 1
                stats["total_size_mb"] += f.stat().st_size / (1024 * 1024)

        if videos_dir.exists():
            for f in videos_dir.glob("*"):
                stats["videos"] += 1
                stats["total_size_mb"] += f.stat().st_size / (1024 * 1024)

        stats["total_size_mb"] = round(stats["total_size_mb"], 2)
        return stats

    def list_media(self, media_type: MediaType = None) -> list:
        media_list = []

        for folder in ["images", "videos"]:
            dir_path = MEDIA_DIR / folder
            if not dir_path.exists():
                continue
            for file_path in dir_path.glob("*"):
                if file_path.is_file():
                    media = self.register_media(str(file_path))
                    if media:
                        if media_type is None or media.media_type == media_type:
                            media_list.append(media)

        return media_list


media_handler = MediaHandler()
