import os

class PlatformSkillsAdapter:
    """
    Adapter that loads MAXX OS native platform skills directly from the internal skills/ directory.
    """
    def __init__(self, base_dir=None):
        base = base_dir or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.skills_dir = os.path.join(base, "skills")
        self.platforms = ["x", "linkedin", "facebook", "instagram", "threads", "youtube"]

    def get_platform_skills(self, platform: str) -> list:
        platform = platform.lower()
        p_path = os.path.join(self.skills_dir, platform)
        if os.path.exists(p_path):
            return [d for d in os.listdir(p_path) if os.path.isdir(os.path.join(p_path, d))]
        return []

    def load_skill_prompt(self, platform: str, skill_name: str) -> str:
        platform = platform.lower()
        skill_md = os.path.join(self.skills_dir, platform, skill_name, "SKILL.md")
        if os.path.exists(skill_md):
            with open(skill_md, "r", encoding="utf-8") as f:
                return f.read()
        return f"Specialized skill '{skill_name}' for platform '{platform}' loaded."

    def list_all_skills_summary(self) -> dict:
        summary = {}
        for p in self.platforms:
            summary[p] = self.get_platform_skills(p)
        return summary
