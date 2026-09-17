from maxxos.linter import validate_draft

class MultiAgentCritic:
    """
    Multi-Agent Critic Loop for MAXX OS.
    Audits generated drafts against platform linter rules and self-corrects.
    """
    def __init__(self, agent_instance=None):
        self.agent = agent_instance

    def audit_and_refine(self, platform: str, draft: str, division: str = "Tech") -> dict:
        lint_result = validate_draft(platform, draft)
        
        if lint_result.passed:
            return {
                "final_draft": draft,
                "critic_approved": True,
                "iterations": 1,
                "feedback": "Passed Critic audit on first attempt."
            }

        fixed_draft = draft
        feedback_notes = []
        for error in lint_result.errors:
            feedback_notes.append(f"Critic Flagged: {error}")
            if "banned" in error.lower() or "anti-word" in error.lower():
                for bw in ["game-changer", "revolutionary", "synergy", "unleash"]:
                    fixed_draft = fixed_draft.replace(bw, "high-impact solution")
                    fixed_draft = fixed_draft.replace(bw.capitalize(), "High-impact solution")
            if "double-spaced" in error.lower():
                fixed_draft = fixed_draft.replace("\n", "\n\n")

        second_check = validate_draft(platform, fixed_draft)

        return {
            "final_draft": fixed_draft,
            "critic_approved": second_check.passed,
            "iterations": 2,
            "feedback": " ".join(feedback_notes)
        }
