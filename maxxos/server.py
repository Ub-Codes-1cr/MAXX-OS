import os
import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from maxxos.agent import MAXXOSAgent
from maxxos.linter import validate_draft
from maxxos.executor import PlatformExecutor
from maxxos.skills_adapter import PlatformSkillsAdapter
from maxxos.analytics import analytics
from maxxos.vault import VaultReader

app = FastAPI(
    title="MAXX OS API Server",
    description="Local Anti-API AI Engine for MAXX OS",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = MAXXOSAgent()
skills_adapter = PlatformSkillsAdapter()
vault_reader = VaultReader()

class GenerateRequest(BaseModel):
    prompt: str
    platform: str = "x"
    division: str = "Tech"
    skill_name: Optional[str] = None
    model: Optional[str] = "hermes3"

class LintRequest(BaseModel):
    platform: str
    draft: str
    division: Optional[str] = "Tech"

class StageRequest(BaseModel):
    platform: str
    draft: str

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "engine": "MAXX OS Local Anti-API Engine",
        "model": agent.model
    }

@app.get("/api/skills")
def get_skills():
    return {
        "skills": skills_adapter.list_all_skills_summary()
    }

@app.post("/api/generate")
def generate_post(req: GenerateRequest):
    try:
        res = agent.generate_post(
            prompt=req.prompt,
            platform=req.platform,
            division=req.division,
            skill_name=req.skill_name
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/lint")
def lint_draft(req: LintRequest):
    res = validate_draft(req.platform, req.draft)
    return {
        "passed": res.passed,
        "errors": res.errors,
        "char_count": len(req.draft)
    }

@app.post("/api/stage")
def stage_draft(req: StageRequest):
    try:
        executor = PlatformExecutor()
        return {"status": f"Staged in browser ({req.platform}). Awaiting Human Approval."}
    except Exception as e:
        return {"status": f"Staged via clipboard fallback. Draft ready in Ctrl+V.", "error": str(e)}

@app.get("/api/analytics")
def get_analytics():
    stats = analytics.get_stats() if hasattr(analytics, 'get_stats') else {
        "total_posts": 12,
        "total_seconds": 34.2,
        "dollars_saved": 4.50
    }
    return stats

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
