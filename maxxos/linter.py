"""
MAXXX OS - Golden Lint Engine
Pre-Publish Syntax & Length Rules Validator
Enforces the 40 Golden Rules across 20 platforms
"""

import re
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class LintResult:
    passed: bool
    platform: str
    errors: list = field(default_factory=list)
    warnings: list = field(default_factory=list)

    def add_error(self, msg: str):
        self.errors.append(msg)
        self.passed = False

    def add_warning(self, msg: str):
        self.warnings.append(msg)


BANNED_WORDS = [
    "game-changer", "synergy", "disrupt", "leverage", "paradigm shift",
    "unlock", "elevate", "transformative", "innovative", "cutting-edge",
    "seamless", "holistic", "ecosystem", "roi", "best-in-class",
    "world-class", "next-generation", "revolutionary", "game-changing",
    "deep dive", "thought leadership", "move the needle", "low-hanging fruit",
    "circle back", "bandwidth", "thought leader", "passionate about",
    "think outside the box", "value-add", "pillars", "synergize"
]

PLATFORM_RULES = {
    "x": {
        "name": "X (Twitter)",
        "division": "tech",
        "max_chars": 280,
        "rules": [
            ("no_raw_url_first", "No raw URLs in the first tweet of a thread"),
            ("contrarian_hook", "Must start with a contrarian hook or strong data point"),
        ]
    },
    "linkedin": {
        "name": "LinkedIn",
        "division": "tech",
        "min_chars": 800,
        "max_chars": 1200,
        "rules": [
            ("line_breaks", "Must contain at least 3 double-spaced line breaks"),
        ]
    },
    "github": {
        "name": "GitHub",
        "division": "tech",
        "rules": [
            ("valid_markdown", "Must be valid Markdown"),
            ("code_blocks", "All code snippets must be wrapped in ``` blocks"),
            ("install_usage", "README must include Installation and Usage sections"),
        ]
    },
    "devto": {
        "name": "Dev.to",
        "division": "tech",
        "rules": [
            ("headings", "Must contain at least one H2 (##) and one H3 (###) heading"),
            ("code_block", "Must include at least one code block if technical"),
        ]
    },
    "medium": {
        "name": "Medium",
        "division": "media",
        "rules": [
            ("paragraph_length", "Paragraphs must not exceed 4 sentences"),
            ("subheaders", "Sub-headers required every 150 words"),
            ("featured_image", "Must include a high-quality featured image with alt-text"),
        ]
    },
    "peerlist": {
        "name": "Peerlist",
        "division": "tech",
        "max_chars": 400,
        "rules": [
            ("build_focus", "Focus strictly on what I built and tech stack"),
            ("tag_tools", "Must tag specific tools/frameworks used"),
        ]
    },
    "reddit": {
        "name": "Reddit",
        "division": "tech",
        "rules": [
            ("no_self_promo", "Zero blatant self-promotion in first 2 sentences"),
            ("no_clickbait_title", "Title must not use clickbait"),
        ]
    },
    "leetcode": {
        "name": "LeetCode",
        "division": "tech",
        "rules": [
            ("complexity", "Must include Time and Space Complexity (Big O) notes"),
            ("comments", "Code must be heavily commented"),
        ]
    },
    "hashnode": {
        "name": "Hashnode",
        "division": "tech",
        "rules": [
            ("canonical_url", "Must include a canonical URL tag if cross-posting"),
            ("tags", "Must select at least 3 relevant tags"),
        ]
    },
    "hackernews": {
        "name": "HackerNews",
        "division": "tech",
        "rules": [
            ("plain_title", "Title must be plain text, no clickbait, no exclamation marks"),
            ("working_link", "Show HN posts must include a direct working link"),
        ]
    },
    "instagram": {
        "name": "Instagram",
        "division": "media",
        "rules": [
            ("hashtags", "Caption must end with 5-10 relevant hashtags"),
            ("punchy_hook", "First line must be a punchy hook under 50 characters"),
        ]
    },
    "youtube": {
        "name": "YouTube",
        "division": "media",
        "rules": [
            ("timestamps", "Description must include timestamp links if video > 2 mins"),
            ("channel_cta", "Must include a clear Channel CTA at the end"),
        ]
    },
    "quora": {
        "name": "Quora",
        "division": "media",
        "min_words": 300,
        "rules": [
            ("direct_answer", "Must directly answer the question in the first sentence"),
            ("cite_source", "Must cite at least one authoritative source"),
        ]
    },
    "linkedout": {
        "name": "LinkedOut",
        "division": "media",
        "rules": [
            ("paradoxical", "Must contain paradoxical career insight or satirical humor"),
            ("narrative_structure", "Must use Setup -> Twist -> Punchline structure"),
        ]
    },
    "threads": {
        "name": "Threads",
        "division": "media",
        "max_chars": 500,
        "rules": [
            ("conversational", "Must be conversational, ending with a question"),
            ("no_links_main", "No external links in main post; place in first reply"),
        ]
    },
    "facebook": {
        "name": "Facebook",
        "division": "media",
        "rules": [
            ("conversational_tone", "Tone must be conversational and community-focused"),
            ("engaging_visual", "Must include an engaging visual"),
        ]
    },
    "substack": {
        "name": "Substack",
        "division": "media",
        "rules": [
            ("subscriber_cta", "Must include a clear subscriber CTA"),
            ("editorial_depth", "Minimum 3 distinct sections required"),
        ]
    },
    "telegram": {
        "name": "Telegram",
        "division": "media",
        "rules": [
            ("markdown_formatting", "Must use Markdown formatting for key insights"),
            ("direct_links", "Must include direct, un-shortened links"),
        ]
    },
    "producthunt": {
        "name": "ProductHunt",
        "division": "saas",
        "max_words": 100,
        "rules": [
            ("makers_note", "Pitch must include Maker's note perspective"),
            ("specific_feedback", "Must ask for specific feedback, not just upvotes"),
        ]
    },
    "discord": {
        "name": "Discord",
        "division": "mafia",
        "rules": [
            ("syntax_highlighting", "Code snippets must use language-specific syntax highlighting"),
            ("no_spam_tag", "Must use role tags ONLY if critical; no spam tagging"),
        ]
    },
}


def _count_words(text: str) -> int:
    return len(text.split())


def _count_chars(text: str) -> int:
    return len(text)


def _count_sentences(text: str) -> int:
    return len(re.split(r'[.!?]+', text.strip())) - 1


def _has_double_spaced_breaks(text: str) -> bool:
    return "\n\n" in text


def _extract_hashtags(text: str) -> list:
    return re.findall(r'#\w+', text)


def _is_valid_markdown(text: str) -> bool:
    if not re.search(r'^#+\s', text, re.MULTILINE):
        return False
    return True


def _count_headings(text: str) -> dict:
    h2 = len(re.findall(r'^##\s', text, re.MULTILINE))
    h3 = len(re.findall(r'^###\s', text, re.MULTILINE))
    return {"h2": h2, "h3": h3}


def _count_code_blocks(text: str) -> int:
    return len(re.findall(r'```[\s\S]*?```', text))


def _count_paragraphs(text: str) -> list:
    paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
    return paragraphs


def _has_banned_words(text: str) -> list:
    found = []
    text_lower = text.lower()
    for word in BANNED_WORDS:
        if word in text_lower:
            found.append(word)
    return found


def _extract_urls(text: str) -> list:
    return re.findall(r'https?://[^\s]+', text)


def _has_timestamps(text: str) -> bool:
    return bool(re.search(r'\d+:\d{2}', text))


def _count_sections(text: str) -> int:
    return len(re.findall(r'^#+\s', text, re.MULTILINE))


def validate_draft(platform: str, draft: str) -> LintResult:
    platform = platform.lower().strip()
    result = LintResult(passed=True, platform=platform)

    if platform not in PLATFORM_RULES:
        result.add_error(f"Unknown platform: {platform}. Valid: {list(PLATFORM_RULES.keys())}")
        return result

    config = PLATFORM_RULES[platform]

    banned = _has_banned_words(draft)
    for word in banned:
        result.add_warning(f"Banned word detected: '{word}' - Consider rephrasing")

    char_count = _count_chars(draft)
    word_count = _count_words(draft)

    if "max_chars" in config and char_count > config["max_chars"]:
        result.add_error(f"Exceeds max character limit ({config['max_chars']}): {char_count} chars")

    if "min_chars" in config and char_count < config["min_chars"]:
        result.add_error(f"Below min character limit ({config['min_chars']}): {char_count} chars")

    if "min_words" in config and word_count < config["min_words"]:
        result.add_error(f"Below min word count ({config['min_words']}): {word_count} words")

    if "max_words" in config and word_count > config["max_words"]:
        result.add_error(f"Exceeds max word count ({config['max_words']}): {word_count} words")

    _validate_platform_rules(platform, draft, result)

    return result


def _validate_platform_rules(platform: str, draft: str, result: LintResult):
    if platform == "x":
        urls = _extract_urls(draft)
        if urls and not draft.strip().startswith("https"):
            result.add_warning("URL detected - ensure it's not in the first tweet of a thread")

        if not draft.strip()[0].isupper() and not draft.strip()[0].isdigit():
            result.add_warning("Consider starting with a strong hook or data point")

    elif platform == "linkedin":
        double_breaks = draft.count("\n\n")
        if double_breaks < 3:
            result.add_error(f"Needs at least 3 double-spaced line breaks: found {double_breaks}")

    elif platform == "github":
        if not _is_valid_markdown(draft):
            result.add_error("Must be valid Markdown with headings")
        if _count_code_blocks(draft) == 0 and any(kw in draft.lower() for kw in ["code", "function", "class", "def ", "import"]):
            result.add_warning("Technical content detected but no code blocks found")

    elif platform == "devto":
        headings = _count_headings(draft)
        if headings["h2"] == 0:
            result.add_error("Missing H2 (##) heading")
        if headings["h3"] == 0:
            result.add_error("Missing H3 (###) heading")

    elif platform == "medium":
        paragraphs = _count_paragraphs(draft)
        for i, p in enumerate(paragraphs):
            sentences = _count_sentences(p)
            if sentences > 4:
                result.add_warning(f"Paragraph {i+1} has {sentences} sentences (max 4)")

    elif platform == "peerlist":
        if "built" not in draft.lower() and "created" not in draft.lower():
            result.add_warning("Consider focusing on 'what I built'")

    elif platform == "reddit":
        first_two_sentences = ' '.join(draft.split('.')[:2]).lower()
        promo_words = ["check out", "my app", "i built", "my project", "visit"]
        if any(word in first_two_sentences for word in promo_words):
            result.add_error("Self-promotion detected in first 2 sentences")

    elif platform == "leetcode":
        if "o(" not in draft.lower() and "complexity" not in draft.lower():
            result.add_error("Missing Time/Space Complexity (Big O) notes")
        if draft.count("#") < 3 and draft.count("//") < 3:
            result.add_warning("Consider adding more comments to code")

    elif platform == "hashnode":
        if "canonical" not in draft.lower():
            result.add_warning("Consider adding canonical URL tag")

    elif platform == "hackernews":
        if "!" in draft.split('\n')[0]:
            result.add_error("Title must not contain exclamation marks")
        if "show hn" in draft.lower() and "http" not in draft.lower():
            result.add_error("Show HN posts must include a working link")

    elif platform == "instagram":
        hashtags = _extract_hashtags(draft)
        if len(hashtags) < 5:
            result.add_error(f"Needs at least 5 hashtags: found {len(hashtags)}")
        first_line = draft.split('\n')[0]
        if len(first_line) > 50:
            result.add_warning(f"First line hook exceeds 50 chars: {len(first_line)}")

    elif platform == "youtube":
        if not _has_timestamps(draft) and _count_words(draft) > 300:
            result.add_warning("Consider adding timestamps for longer content")
        if "subscribe" not in draft.lower() and "cta" not in draft.lower():
            result.add_warning("Consider adding a Channel CTA")

    elif platform == "quora":
        first_sentence = draft.split('.')[0]
        if "?" in first_sentence:
            result.add_warning("First sentence should directly answer the question")

    elif platform == "linkedout":
        if "->" not in draft and "twist" not in draft.lower():
            result.add_warning("Consider using Setup -> Twist -> Punchline structure")

    elif platform == "threads":
        urls = _extract_urls(draft)
        if urls:
            result.add_warning("No external links allowed in main post")

    elif platform == "producthunt":
        if "maker" not in draft.lower() and "note" not in draft.lower():
            result.add_warning("Consider including Maker's note perspective")

    elif platform == "discord":
        if "```" in draft and not re.search(r'```\w+', draft):
            result.add_warning("Code blocks should specify language for syntax highlighting")


def validate_all_platforms(draft: str) -> dict:
    results = {}
    for platform in PLATFORM_RULES:
        results[platform] = validate_draft(platform, draft)
    return results


def get_platform_config(platform: str) -> Optional[dict]:
    return PLATFORM_RULES.get(platform.lower())


def list_platforms() -> list:
    return list(PLATFORM_RULES.keys())


if __name__ == "__main__":
    test_draft = """
## Building Maxxx OS: A Local-First AI Agent

I spent the last 40 hours building something wild.

### The Problem
Content creators waste hours reformatting posts for 20 platforms. Existing tools rely on APIs that rate-limit, shadowban, and leak your data.

### The Solution
Maxxx OS uses local LLMs + browser automation to control your actual Chrome. Zero APIs. Zero cloud. 100% privacy.

```python
from playwright.sync_api import sync_playwright
browser = p.chromium.launch_persistent_context(user_data_dir)
```

The key insight? Your browser already has the login. Why use an API?

### What's Next
- Voice input via local Whisper
- 20 platform support
- Human-in-the-loop approval

Star the repo if this resonates: https://github.com/maxxx-os
"""

    result = validate_draft("x", test_draft)
    print(f"Platform: {result.platform}")
    print(f"Passed: {result.passed}")
    if result.errors:
        print(f"Errors: {result.errors}")
    if result.warnings:
        print(f"Warnings: {result.warnings}")
