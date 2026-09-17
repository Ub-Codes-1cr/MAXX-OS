"""
MAXXX OS - Playwright Engine
Anti-API Browser Automation using Persistent Chrome Context
Controls the user's actual browser to bypass API restrictions
"""

import os
import time
import platform
from pathlib import Path
from typing import Optional
from dataclasses import dataclass
from functools import wraps

from playwright.sync_api import sync_playwright, Browser, Page, BrowserContext
from platform_auth import PlatformAuth


def retry_on_failure(max_retries=3, delay=2):
    """Decorator to retry function on failure"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_error = None
            for attempt in range(max_retries):
                try:
                    result = func(*args, **kwargs)
                    if result.success:
                        return result
                    last_error = result.error if hasattr(result, 'error') else "Post failed"
                except Exception as e:
                    last_error = str(e)
                
                if attempt < max_retries - 1:
                    print(f"[Retry] Attempt {attempt + 1} failed. Retrying in {delay}s...")
                    time.sleep(delay)
            
            # All retries failed
            return PostResult(
                success=False,
                platform=kwargs.get('platform', 'unknown'),
                message=f"Failed after {max_retries} attempts: {last_error}",
                error=last_error
            )
        return wrapper
    return decorator


@dataclass
class PostResult:
    success: bool
    platform: str
    message: str
    staged: bool = False
    error: Optional[str] = None


def get_chrome_user_data_dir() -> str:
    system = platform.system()
    if system == "Windows":
        return os.path.join(os.environ["LOCALAPPDATA"], "Google", "Chrome", "User Data")
    elif system == "Darwin":
        return os.path.expanduser("~/Library/Application Support/Google/Chrome")
    elif system == "Linux":
        return os.path.expanduser("~/.config/google-chrome")
    else:
        raise RuntimeError(f"Unsupported platform: {system}")


def get_chrome_executable() -> str:
    system = platform.system()
    if system == "Windows":
        paths = [
            r"C:\Program Files\Google\Chrome\Application\chrome.exe",
            r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            os.path.join(os.environ.get("LOCALAPPDATA", ""), "Google", "Chrome", "Application", "chrome.exe"),
        ]
        for path in paths:
            if os.path.exists(path):
                return path
    elif system == "Darwin":
        return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    elif system == "Linux":
        return "/usr/bin/google-chrome"
    return "chrome"


class PlaywrightEngine:
    PERSISTENT_PROFILE_DIR = os.path.join(os.path.dirname(__file__), "browser_profile")

    def __init__(self, headless: bool = False):
        self.headless = headless
        self.playwright = None
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None

    def _force_kill_chrome(self):
        import subprocess
        try:
            subprocess.run(["taskkill", "/F", "/IM", "chrome.exe"], 
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=5)
            subprocess.run(["taskkill", "/F", "/IM", "chromium.exe"], 
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=5)
            import time
            time.sleep(3)
        except:
            pass

    def launch(self, profile_directory: str = "Default") -> bool:
        try:
            import shutil
            import time
            
            # Step 1: Force kill Chrome to release any locks
            print("[PlaywrightEngine] Force closing Chrome...")
            self._force_kill_chrome()
            
            self.playwright = sync_playwright().start()
            user_data_dir = get_chrome_user_data_dir()
            chrome_exe = get_chrome_executable()

            if not os.path.exists(user_data_dir):
                print(f"[PlaywrightEngine] Chrome user data not found at: {user_data_dir}")
                return False

            # Step 2: Use PERSISTENT profile (saves login sessions across runs)
            persistent_user_data = os.path.join(self.PERSISTENT_PROFILE_DIR, "User Data")
            
            if not os.path.exists(persistent_user_data):
                print("[PlaywrightEngine] First run - copying Chrome profile to persistent folder...")
                os.makedirs(persistent_user_data, exist_ok=True)
                
                src_profile = os.path.join(user_data_dir, profile_directory)
                dst_profile = os.path.join(persistent_user_data, profile_directory)
                
                if os.path.exists(src_profile):
                    shutil.copytree(src_profile, dst_profile, dirs_exist_ok=True)
                else:
                    print(f"[PlaywrightEngine] Profile not found: {src_profile}")
                    return False
                
                # Copy Local State
                local_state_src = os.path.join(user_data_dir, "Local State")
                local_state_dst = os.path.join(persistent_user_data, "Local State")
                if os.path.exists(local_state_src):
                    shutil.copy2(local_state_src, local_state_dst)
                    
                print("[PlaywrightEngine] Profile copied. First-time users: please log in.")
            else:
                print("[PlaywrightEngine] Using existing browser profile (sessions preserved)")

            # Step 3: Launch with persistent profile
            print(f"[PlaywrightEngine] Launching Chrome...")
            self.context = self.playwright.chromium.launch_persistent_context(
                user_data_dir=persistent_user_data,
                executable_path=chrome_exe,
                headless=self.headless,
                args=[f"--profile-directory={profile_directory}", "--no-sandbox"],
                viewport={"width": 1280, "height": 800}
            )

            self.page = self.context.new_page()
            print(f"[PlaywrightEngine] Browser launched successfully!")
            return True

        except Exception as e:
            print(f"[PlaywrightEngine] Launch failed: {e}")
            return self._fallback_launch(profile_directory)

    def _fallback_launch(self, profile_directory: str = "Default") -> bool:
        try:
            print("[PlaywrightEngine] Trying fallback with Playwright Chromium...")
            self.playwright = sync_playwright().start()
            
            self.context = self.playwright.chromium.launch_persistent_context(
                user_data_dir=os.path.join(self.PERSISTENT_PROFILE_DIR, "fallback"),
                headless=self.headless,
                args=[f"--profile-directory={profile_directory}"],
                viewport={"width": 1280, "height": 800}
            )
            
            self.page = self.context.new_page()
            print("[PlaywrightEngine] Fallback launched (you may need to log in)")
            return True
            
        except Exception as e:
            print(f"[PlaywrightEngine] Fallback also failed: {e}")
            return False

    def close(self):
        if self.context:
            self.context.close()
        if self.playwright:
            self.playwright.stop()
        print("[PlaywrightEngine] Browser closed (profile saved for next run)")

    def _human_type(self, page: Page, text: str, selector: str = None, delay: int = 50):
        if selector:
            page.click(selector)
            time.sleep(0.5)
        for char in text:
            page.keyboard.type(char, delay=delay)
            time.sleep(0.01)

    def _human_click(self, page: Page, selector: str, wait: float = 1.0):
        page.click(selector)
        time.sleep(wait)

    def check_login_status(self, platform: str) -> bool:
        """Check if user is logged into platform"""
        if not self.page:
            return False

        content = self.page.content()
        url = self.page.url

        if platform == "x":
            has_login_page = "See what's happening" in content or "Happening now" in content
            has_login_url = "/login" in url
            has_logged_in = (
                'data-testid="SideNav_NewTweet_Button"' in content or
                'data-testid="AppTabBar_Home_Link"' in content
            )
            return has_logged_in or (not has_login_page and not has_login_url)
        elif platform == "linkedin":
            return "mynetwork" in content or "feed" in url
        elif platform == "github":
            return "dashboard" in url or "signed-in" in content
        elif platform == "reddit":
            return "inbox" in content or ".reddit.com/user/" in url
        else:
            return "login" not in url

    def wait_for_login(self, platform: str, timeout: int = 60) -> bool:
        """Wait for user to manually log in"""
        print(f"[PlaywrightEngine] Waiting for {platform} login (timeout: {timeout}s)...")
        for i in range(timeout // 5):
            time.sleep(5)
            if self.check_login_status(platform):
                print(f"[PlaywrightEngine] Login detected for {platform}!")
                return True
            print(f"  Waiting for login... ({(i+1)*5}s)")
        print(f"[PlaywrightEngine] Login timeout for {platform}")
        return False

    def take_screenshot(self, name: str = "post") -> str:
        """Take a screenshot and return the path"""
        if not self.page:
            return ""
        path = f"screenshot_{name}.png"
        self.page.screenshot(path=path)
        print(f"[PlaywrightEngine] Screenshot saved: {path}")
        return path


    def _click_post_button(self, platform: str) -> bool:
        """Click the Post/Submit button after typing draft"""
        try:
            # Platform-specific post button selectors
            post_selectors = {
                "x": [
                    'button[data-testid="tweetButton"]',
                    'button[data-testid="tweetButtonInline"]',
                    'div[role="button"]:has-text("Post")',
                    'button:has-text("Post")',
                ],
                "linkedin": [
                    'button:has-text("Post")',
                    'button:has-text("Publish")',
                    'button.artdeco-button--primary',
                ],
                "reddit": [
                    'button:has-text("Submit")',
                    'button[type="submit"]',
                ],
                "github": [
                    'button:has-text("Create repository")',
                    'button[type="submit"]',
                ],
                "devto": [
                    'button:has-text("Submit")',
                    'button:has-text("Publish")',
                ],
            }
            
            selectors = post_selectors.get(platform, ['button:has-text("Post")', 'button:has-text("Submit")', 'button[type="submit"]'])
            
            for selector in selectors:
                try:
                    button = self.page.locator(selector).first
                    if button.is_visible(timeout=3000):
                        # Wait a moment before clicking (human-like)
                        time.sleep(1)
                        button.click()
                        time.sleep(2)
                        print(f"[PlaywrightEngine] Clicked post button: {selector}")
                        return True
                except:
                    continue
            
            print(f"[PlaywrightEngine] Could not find post button for {platform}")
            return False
            
        except Exception as e:
            print(f"[PlaywrightEngine] Error clicking post button: {e}")
            return False


class PlatformExecutor(PlaywrightEngine):
    # User's actual logged-in URLs from their browser
    PLATFORMS = {
        "x": "https://x.com/compose/post",
        "linkedin": "https://www.linkedin.com/feed/",
        "github": "https://github.com/new",
        "devto": "https://dev.to/new",
        "medium": "https://medium.com/new-story",
        "reddit": "https://www.reddit.com/submit",
        "instagram": "https://www.instagram.com/",
        "youtube": "https://studio.youtube.com/",
        "threads": "https://www.threads.net/",
        "facebook": "https://www.facebook.com/",
        "telegram": "https://web.telegram.org/",
        "discord": "https://discord.com/channels/@me",
        "hackernews": "https://news.ycombinator.com/submit",
        "hashnode": "https://hashnode.com/new",
        "substack": "https://substack.com/publish",
        "producthunt": "https://www.producthunt.com/posts/new",
        "quora": "https://www.quora.com/",
        "peerlist": "https://peerlist.io/",
        "leetcode": "https://leetcode.com/problemset/",
        "linkedout": "https://www.linkedin.com/feed/",
        "bluesky": "https://bsky.app/",
        "twitch": "https://dashboard.twitch.tv/",
        "pinterest": "https://in.pinterest.com/",
        "tumblr": "https://www.tumblr.com/",
        "sharechat": "https://sharechat.com/",
    }

    def auto_login(self, platform: str) -> bool:
        """Auto-login using stored credentials"""
        if not self.page:
            return False
        auth = PlatformAuth(self.page)
        if auth.is_logged_in(platform):
            print(f"[PlaywrightEngine] Already logged in to {platform}")
            return True
        return auth.auto_login(platform)

    def navigate_to_platform(self, platform: str) -> bool:
        if not self.page:
            return False

        url = self.PLATFORMS.get(platform.lower())
        if not url:
            print(f"[PlaywrightEngine] Unknown platform: {platform}")
            return False

        try:
            self.page.goto(url, wait_until="networkidle", timeout=30000)
            time.sleep(2)
            print(f"[PlaywrightEngine] Navigated to {platform}: {url}")
            return True
        except Exception as e:
            print(f"[PlaywrightEngine] Navigation failed: {e}")
            return False

    @retry_on_failure(max_retries=3, delay=2)
    def post_to_x(self, draft: str, auto_post: bool = False) -> PostResult:
        try:
            # Navigate to X compose page
            self.page.goto("https://x.com/compose/post", wait_until="networkidle", timeout=30000)
            time.sleep(3)
            
            # Find the textbox and type
            textbox = self.page.locator("div[role='textbox'][data-testid='tweetTextarea_0']")
            if textbox.count() > 0:
                textbox.click()
                time.sleep(1)
                self._human_type(self.page, draft, delay=50)
                time.sleep(1)
                
                # Auto-click Post button if enabled
                if auto_post:
                    posted = self._click_post_button("x")
                    self.take_screenshot("x_post_attempt")
                    if posted:
                        # Verify post was submitted
                        time.sleep(3)
                        if "compose" not in self.page.url.lower():
                            print("[PlaywrightEngine] Post submitted on X!")
                            self.take_screenshot("x_post_success")
                            return PostResult(True, "x", "Post submitted on X", staged=False)
                        else:
                            print("[PlaywrightEngine] Post button clicked but may not have submitted")
                            return PostResult(True, "x", "Post button clicked on X", staged=True)
                    else:
                        print("[PlaywrightEngine] Post button not found. Draft staged.")
                        return PostResult(True, "x", "Draft staged on X (button not found)", staged=True)
                
                print("[PlaywrightEngine] Draft staged on X. Awaiting human approval.")
                return PostResult(True, "x", "Draft staged on X", staged=True)
            else:
                # Fallback: try any textbox
                textboxes = self.page.query_selector_all("div[role='textbox']")
                if textboxes:
                    textboxes[0].click()
                    time.sleep(1)
                    self._human_type(self.page, draft, delay=50)
                    time.sleep(1)
                    
                    if auto_post:
                        posted = self._click_post_button("x")
                        if posted:
                            time.sleep(3)
                            return PostResult(True, "x", "Post submitted on X (fallback)", staged=False)
                    
                    print("[PlaywrightEngine] Draft staged on X (fallback). Awaiting human approval.")
                    return PostResult(True, "x", "Draft staged on X", staged=True)
                else:
                    return PostResult(False, "x", "Could not find text input on X", error="No textbox found")

        except Exception as e:
            print(f"[PlaywrightEngine] X posting error: {e}")
            return PostResult(False, "x", f"Error posting to X: {str(e)}", error=str(e))

    def post_to_linkedin(self, draft: str, auto_post: bool = False) -> PostResult:
        try:
            # Navigate to LinkedIn feed
            self.page.goto("https://www.linkedin.com/feed/", wait_until="networkidle", timeout=30000)
            time.sleep(3)
            
            # Click "Start a post" button
            start_post = self.page.locator("button:has-text('Start a post'), div[role='button']:has-text('Start a post')")
            if start_post.count() > 0:
                start_post.first.click()
                time.sleep(2)
            
            # Find the textbox and type
            textbox = self.page.locator("div[role='textbox'][contenteditable='true']")
            if textbox.count() > 0:
                textbox.first.click()
                time.sleep(1)
                self._human_type(self.page, draft, delay=50)
                time.sleep(1)
                print("[PlaywrightEngine] Draft staged on LinkedIn. Awaiting human approval.")
                return PostResult(True, "linkedin", "Draft staged on LinkedIn", staged=True)
            else:
                return PostResult(False, "linkedin", "Could not find text input on LinkedIn")

        except Exception as e:
            return PostResult(False, "linkedin", f"Error: {str(e)}")

    def post_to_github(self, draft: str, repo_name: str = None) -> PostResult:
        try:
            if not self.navigate_to_platform("github"):
                return PostResult(False, "github", "Failed to navigate to GitHub")

            time.sleep(2)
            self._human_type(self.page, draft, delay=30)
            time.sleep(1)

            print("[PlaywrightEngine] Draft staged on GitHub. Awaiting human approval.")
            return PostResult(True, "github", "Draft staged on GitHub", staged=True)

        except Exception as e:
            return PostResult(False, "github", f"Error: {str(e)}")

    def post_to_reddit(self, draft: str, subreddit: str = "programming") -> PostResult:
        try:
            url = f"https://www.reddit.com/r/{subreddit}/submit"
            self.page.goto(url, wait_until="networkidle", timeout=30000)
            time.sleep(2)

            self._human_type(self.page, draft, delay=50)
            time.sleep(1)

            print("[PlaywrightEngine] Draft staged on Reddit. Awaiting human approval.")
            return PostResult(True, "reddit", "Draft staged on Reddit", staged=True)

        except Exception as e:
            return PostResult(False, "reddit", f"Error: {str(e)}")

    def post_generic(self, platform: str, draft: str) -> PostResult:
        try:
            # Navigate to platform
            url = self.PLATFORMS.get(platform.lower())
            if not url:
                return PostResult(False, platform, f"Unknown platform: {platform}")
            
            self.page.goto(url, wait_until="networkidle", timeout=30000)
            time.sleep(3)
            
            # Try to find and click compose/new post button
            compose_selectors = [
                "button:has-text('Create')",
                "button:has-text('New post')",
                "button:has-text('Compose')",
                "a:has-text('Create')",
                "[data-testid='new_post_button']",
                "div[role='button']:has-text('Create')",
            ]
            
            for selector in compose_selectors:
                try:
                    btn = self.page.locator(selector)
                    if btn.count() > 0:
                        btn.first.click()
                        time.sleep(2)
                        break
                except:
                    continue
            
            # Find textbox
            textbox_selectors = [
                "div[role='textbox']",
                "textarea",
                "[contenteditable='true']",
                "div[data-testid='tweetTextarea_0']",
                "div[role='textbox'][contenteditable='true']",
            ]
            
            for selector in textbox_selectors:
                try:
                    textbox = self.page.locator(selector)
                    if textbox.count() > 0:
                        textbox.first.click()
                        time.sleep(1)
                        self._human_type(self.page, draft, delay=50)
                        time.sleep(1)
                        print(f"[PlaywrightEngine] Draft staged on {platform}. Awaiting human approval.")
                        return PostResult(True, platform, f"Draft staged on {platform}", staged=True)
                except:
                    continue
            
            # If no textbox found, copy to clipboard
            print(f"[PlaywrightEngine] No textbox found on {platform}. Copying to clipboard.")
            import subprocess
            process = subprocess.Popen(
                ["clip"],
                stdin=subprocess.PIPE,
                shell=True
            )
            process.communicate(input=draft.encode("utf-16le"))
            return PostResult(True, platform, f"Draft copied to clipboard for {platform}. Paste manually.", staged=False)

        except Exception as e:
            return PostResult(False, platform, f"Error: {str(e)}")

    def stage_post(self, platform: str, draft: str, auto_post: bool = False, **kwargs) -> PostResult:
        platform = platform.lower().strip()
        
        try:
            if platform == "x":
                result = self.post_to_x(draft, auto_post=auto_post)
            elif platform == "linkedin":
                result = self.post_to_linkedin(draft, auto_post=auto_post)
            elif platform == "github":
                result = self.post_to_github(draft, kwargs.get("repo_name"))
            elif platform == "reddit":
                result = self.post_to_reddit(draft, kwargs.get("subreddit", "programming"))
            else:
                result = self.post_generic(platform, draft)
            
            # If browser posting failed, fallback to clipboard
            if not result.success:
                print(f"[PlaywrightEngine] Browser failed, falling back to clipboard...")
                return clipboard_fallback(platform, draft)
            
            return result
            
        except Exception as e:
            print(f"[PlaywrightEngine] Browser error: {e}, falling back to clipboard...")
            return clipboard_fallback(platform, draft)


def clipboard_fallback(platform: str, draft: str) -> PostResult:
    try:
        import subprocess
        process = subprocess.Popen(
            ["clip"],
            stdin=subprocess.PIPE,
            shell=True
        )
        process.communicate(input=draft.encode("utf-16le"))
        return PostResult(
            True,
            platform,
            f"Draft copied to clipboard for {platform}. Paste manually.",
            staged=False
        )
    except Exception as e:
        return PostResult(False, platform, f"Clipboard fallback failed: {str(e)}")


if __name__ == "__main__":
    print("[PlaywrightEngine] Anti-API Browser Automation Engine")
    print("[PlaywrightEngine] Available platforms:", list(PlatformExecutor.PLATFORMS.keys()))
