"""
MAXX OS - Secure Credentials Store
"""

import os
import json
from pathlib import Path
from typing import Optional
from dataclasses import dataclass

VAULT_PATH = Path(__file__).parent.parent / "maskyyy" / "vault"
CREDS_FILE = VAULT_PATH / "00-Core" / "credentials.json"


@dataclass
class PlatformCreds:
    platform: str
    username: str
    password: str
    email: Optional[str] = None
    extra: Optional[dict] = None


class CredentialStore:
    def __init__(self):
        self._creds = self._load_creds()

    def _load_creds(self) -> dict:
        if not CREDS_FILE.exists():
            return {}
        try:
            with open(CREDS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}

    def _save_creds(self):
        CREDS_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(CREDS_FILE, "w", encoding="utf-8") as f:
            json.dump(self._creds, f, indent=2)

    def set_creds(self, platform: str, username: str, password: str, email: Optional[str] = None, extra: Optional[dict] = None):
        self._creds[platform.lower()] = {
            "username": username,
            "password": password,
            "email": email,
            "extra": extra or {}
        }
        self._save_creds()

    def get_creds(self, platform: str) -> Optional[PlatformCreds]:
        data = self._creds.get(platform.lower())
        if not data:
            return None
        return PlatformCreds(
            platform=platform,
            username=data.get("username", ""),
            password=data.get("password", ""),
            email=data.get("email"),
            extra=data.get("extra")
        )

    def has_creds(self, platform: str) -> bool:
        return platform.lower() in self._creds


credential_store = CredentialStore()
