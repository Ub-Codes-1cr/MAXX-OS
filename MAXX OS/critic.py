from maskos.linter import golden_lint

class MultiAgentCritic:
    """
    Multi-Agent Critic Loop for MAXX OS.
    Audits generated drafts against platform linter rules and instructs the Writer Agent to self-correct before presenting to the user.
    """
    def __init__(self, agent_instance=None):
        self.agent = agent_instance

    def audit_and_refine(self, platform: str, draft: str, division: str = "Tech") -> dict:
        lint_result = golden_lint(platform, draft, division)
        
        if lint_result["passed"]:
            return {
                "final_draft": draft,
                "critic_approved": True,
                "iterations": 1,
                "feedback": "Passed Critic audit on first attempt."
            }

        # Iterative feedback loop simulation
        fixed_draft = draft
        feedback_notes = []
        for error in lint_result["errors"]:
            feedback_notes.append(f"Critic Flagged: {error}")
            if "banned anti-word" in error.lower():
                for bw in ["game-changer", "revolutionary", "synergy", "unleash"]:
                    fixed_draft = fixed_draft.replace(bw, "high-impact solution")
                    fixed_draft = fixed_draft.replace(bw.capitalize(), "High-impact solution")
            if "double-spaced" in error.lower():
                fixed_draft = fixed_draft.replace("\n", "\n\n")

        second_check = golden_lint(platform, fixed_draft, division)

        return {
            "final_draft": fixed_draft,
            "critic_approved": second_check["passed"],
            "iterations": 2,
            "feedback": " ".join(feedback_notes)
        }
