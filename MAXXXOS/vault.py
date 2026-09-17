import os
import glob

class VaultManager:
    """
    Obsidian Vault Manager for MAXX OS.
    Reads brand guidelines, division directives, platform masks, and few-shot viral data.
    """
    def __init__(self, vault_path=None):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.vault_path = vault_path or os.path.join(base_dir, "maskyyy", "vault")

    def get_brand_voice(self) -> str:
        bv_file = os.path.join(self.vault_path, "00-Core", "BRAND-VOICE.md")
        if os.path.exists(bv_file):
            with open(bv_file, "r", encoding="utf-8") as f:
                return f.read()
        return "Brand Voice: Direct, concise, technical, no fluff."

    def get_division_directive(self, division: str) -> str:
        div_file = os.path.join(self.vault_path, "00-Core", "divisions", f"{division.lower()}.md")
        if os.path.exists(div_file):
            with open(div_file, "r", encoding="utf-8") as f:
                return f.read()
        return f"Division {division}: Focus on high quality output."

    def get_platform_rules(self, platform: str) -> str:
        p_file = os.path.join(self.vault_path, "10-Platforms", f"{platform.lower()}.md")
        if os.path.exists(p_file):
            with open(p_file, "r", encoding="utf-8") as f:
                return f.read()
        return f"Platform {platform}: Strictly adhere to platform rules and character limits."

    def get_viral_examples(self, topic: str = "") -> str:
        viral_dir = os.path.join(self.vault_path, "Viral_Data")
        if not os.path.exists(viral_dir):
            return "No few-shot viral examples found."

        examples = []
        for file in glob.glob(os.path.join(viral_dir, "*.md")):
            with open(file, "r", encoding="utf-8") as f:
                examples.append(f.read())
        
        return "\n---\n".join(examples[:3]) if examples else "No specific viral examples matching topic."

    def save_draft(self, platform: str, content: str, title: str = "draft") -> str:
        drafts_dir = os.path.join(self.vault_path, "40-Drafts")
        os.makedirs(drafts_dir, exist_ok=True)
        file_path = os.path.join(drafts_dir, f"{platform}_{title}.md")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        return file_path
