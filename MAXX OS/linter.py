import re

def golden_lint(platform: str, draft: str, division: str = "Tech") -> dict:
    """
    MAXX OS Deterministic Linter (golden_lint.py)
    Validates draft content against hardcoded platform rules, anti-word filters, and formatting constraints.
    """
    errors = []
    p = platform.lower()

    # Rule 31: Global Anti-Word Filter
    banned_words = ["game-changer", "revolutionary", "synergy", "unleash", "paradigm shift", "disruptive", "secret sauce"]
    for word in banned_words:
        if word.lower() in draft.lower():
            errors.append(f"FAIL: Banned anti-word detected: '{word}'.")

    # 1 & 2: X (Twitter)
    if p == "x":
        if len(draft) > 280 and not draft.startswith("1/"):
            errors.append(f"FAIL: Single tweet is {len(draft)} chars (max 280). Format as thread starting with '1/' if multi-tweet.")
        if division == "Tech" and ("http://" in draft.split('\n')[0] or "https://" in draft.split('\n')[0]):
            errors.append("FAIL: Tech Division Rule: No raw URLs in the first tweet.")

    # 3 & 4: LinkedIn
    elif p == "linkedin":
        if len(draft) < 300 or len(draft) > 1500:
            errors.append(f"FAIL: LinkedIn draft is {len(draft)} chars. Target is 300-1500 chars.")
        if draft.count('\n\n') < 3:
            errors.append("FAIL: LinkedIn requires at least 3 double-spaced line breaks for mobile readability.")

    # 5 & 6: GitHub
    elif p == "github":
        if "```" not in draft:
            errors.append("FAIL: GitHub post/issue must include code blocks with syntax highlighting.")

    # 7 & 8: Dev.to
    elif p == "devto":
        if not re.search(r'##\s', draft):
            errors.append("FAIL: Dev.to requires at least one H2 (##) heading.")
        if division == "Tech" and "```" not in draft:
            errors.append("FAIL: Tech Division Rule: Dev.to post must include a code block.")

    # 21 & 22: Instagram
    elif p == "instagram":
        first_line = draft.split('\n')[0]
        if len(first_line) > 50:
            errors.append(f"FAIL: Instagram caption hook line is {len(first_line)} chars (max 50).")
        if "#" not in draft:
            errors.append("FAIL: Instagram caption must include relevant hashtags.")

    # 29 & 30: Threads
    elif p == "threads":
        if len(draft) > 500:
            errors.append(f"FAIL: Threads post is {len(draft)} chars (max 500).")
        if not draft.strip().endswith("?"):
            errors.append("FAIL: Threads post should end with a conversational question.")

    # 23 & 24: YouTube
    elif p == "youtube":
        if "0:00" not in draft and "Intro" not in draft:
            errors.append("FAIL: YouTube description should include chapter timestamps (e.g. 0:00 Intro).")

    # 13 & 14: Reddit
    elif p == "reddit":
        if "buy" in draft.lower() or "link in bio" in draft.lower():
            errors.append("FAIL: Reddit self-promotion rule: No marketing links or CTA spam in main body.")

    return {
        "platform": platform,
        "division": division,
        "passed": len(errors) == 0,
        "errors": errors,
        "char_count": len(draft),
        "draft": draft
    }
