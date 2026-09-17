"""
MAXXX OS - Platform Login Automation
Auto-login for X, Instagram, Facebook, Threads, LinkedIn
"""

import time
from playwright.sync_api import Page
from credentials import credential_store


class PlatformAuth:
    """Handles auto-login for supported platforms"""

    def __init__(self, page: Page):
        self.page = page

    def login_x(self, username: str, password: str, email: str = None) -> bool:
        """Login to X/Twitter"""
        try:
            print("[Auth] Navigating to X login...")
            self.page.goto("https://x.com/i/flow/login", wait_until="networkidle", timeout=30000)
            time.sleep(3)

            # Enter username/email/phone
            username_field = self.page.locator("input[autocomplete='username'], input[name='text'], input[data-testid='ocfEnterTextTextInput']")
            if username_field.count() > 0:
                username_field.first.click()
                time.sleep(0.5)
                username_field.first.fill(email or username)
                time.sleep(0.5)
                # Click Next
                next_btn = self.page.locator("button:has-text('Next'), button:has-text('Continue'), div[role='button']:has-text('Next')")
                if next_btn.count() > 0:
                    next_btn.first.click()
                    time.sleep(2)

            # Check if X asks for phone/username verification (unusual activity)
            verify_field = self.page.locator("input[data-testid='ocfEnterTextTextInput']")
            if verify_field.count() > 0:
                print("[Auth] X asking for verification, entering username...")
                verify_field.first.fill(username)
                time.sleep(0.5)
                next_btn = self.page.locator("button:has-text('Next'), button:has-text('Continue')")
                if next_btn.count() > 0:
                    next_btn.first.click()
                    time.sleep(2)

            # Enter password
            password_field = self.page.locator("input[name='password'], input[type='password']")
            if password_field.count() > 0:
                password_field.first.click()
                time.sleep(0.5)
                password_field.first.fill(password)
                time.sleep(0.5)
                # Click Log in
                login_btn = self.page.locator("button[data-testid='LoginForm_Login_Button'], button:has-text('Log in'), button:has-text('Sign in')")
                if login_btn.count() > 0:
                    login_btn.first.click()
                    time.sleep(5)
                    print("[Auth] X login submitted")
                    return True

            print("[Auth] X login failed - could not find fields")
            return False
        except Exception as e:
            print(f"[Auth] X login error: {e}")
            return False

    def login_instagram(self, username: str, password: str) -> bool:
        """Login to Instagram"""
        try:
            print("[Auth] Navigating to Instagram login...")
            self.page.goto("https://www.instagram.com/accounts/login/", wait_until="networkidle", timeout=30000)
            time.sleep(3)

            # Handle cookie consent if present
            try:
                accept_btn = self.page.locator("button:has-text('Allow'), button:has-text('Accept'), button:has-text('OK')")
                if accept_btn.count() > 0:
                    accept_btn.first.click()
                    time.sleep(1)
            except:
                pass

            # Enter username
            username_field = self.page.locator("input[name='username'], input[aria-label='Phone number, username, or email']")
            if username_field.count() > 0:
                username_field.first.click()
                time.sleep(0.5)
                username_field.first.fill(username)
                time.sleep(0.5)

            # Enter password
            password_field = self.page.locator("input[name='password'], input[type='password']")
            if password_field.count() > 0:
                password_field.first.click()
                time.sleep(0.5)
                password_field.first.fill(password)
                time.sleep(0.5)

            # Click Log in
            login_btn = self.page.locator("button[type='submit'], button:has-text('Log in'), button:has-text('Log In')")
            if login_btn.count() > 0:
                login_btn.first.click()
                time.sleep(5)
                print("[Auth] Instagram login submitted")
                return True

            print("[Auth] Instagram login failed - could not find fields")
            return False
        except Exception as e:
            print(f"[Auth] Instagram login error: {e}")
            return False

    def login_facebook(self, username: str, password: str) -> bool:
        """Login to Facebook"""
        try:
            print("[Auth] Navigating to Facebook login...")
            self.page.goto("https://www.facebook.com/login", wait_until="networkidle", timeout=30000)
            time.sleep(3)

            # Enter email
            email_field = self.page.locator("input[name='email'], input#email")
            if email_field.count() > 0:
                email_field.first.click()
                time.sleep(0.5)
                email_field.first.fill(username)
                time.sleep(0.5)

            # Enter password
            password_field = self.page.locator("input[name='pass'], input[type='password']")
            if password_field.count() > 0:
                password_field.first.click()
                time.sleep(0.5)
                password_field.first.fill(password)
                time.sleep(0.5)

            # Click Log In
            login_btn = self.page.locator("button[name='login'], button[type='submit'], button:has-text('Log In')")
            if login_btn.count() > 0:
                login_btn.first.click()
                time.sleep(5)
                print("[Auth] Facebook login submitted")
                return True

            print("[Auth] Facebook login failed - could not find fields")
            return False
        except Exception as e:
            print(f"[Auth] Facebook login error: {e}")
            return False

    def login_threads(self, username: str, password: str) -> bool:
        """Login to Threads (uses Instagram credentials)"""
        try:
            print("[Auth] Navigating to Threads login...")
            self.page.goto("https://www.threads.net/login", wait_until="networkidle", timeout=30000)
            time.sleep(3)

            # Threads uses Instagram login - try Instagram auth
            username_field = self.page.locator("input[name='username'], input[aria-label='Phone number, username, or email']")
            if username_field.count() > 0:
                username_field.first.click()
                time.sleep(0.5)
                username_field.first.fill(username)
                time.sleep(0.5)

            password_field = self.page.locator("input[name='password'], input[type='password']")
            if password_field.count() > 0:
                password_field.first.click()
                time.sleep(0.5)
                password_field.first.fill(password)
                time.sleep(0.5)

            login_btn = self.page.locator("button[type='submit'], button:has-text('Log in')")
            if login_btn.count() > 0:
                login_btn.first.click()
                time.sleep(5)
                print("[Auth] Threads login submitted")
                return True

            print("[Auth] Threads login failed - could not find fields")
            return False
        except Exception as e:
            print(f"[Auth] Threads login error: {e}")
            return False

    def login_linkedin(self, username: str, password: str) -> bool:
        """Login to LinkedIn"""
        try:
            print("[Auth] Navigating to LinkedIn login...")
            self.page.goto("https://www.linkedin.com/login", wait_until="networkidle", timeout=30000)
            time.sleep(3)

            # Enter username
            username_field = self.page.locator("input#username, input[name='session_key']")
            if username_field.count() > 0:
                username_field.first.click()
                time.sleep(0.5)
                username_field.first.fill(username)
                time.sleep(0.5)

            # Enter password
            password_field = self.page.locator("input#password, input[name='session_password']")
            if password_field.count() > 0:
                password_field.first.click()
                time.sleep(0.5)
                password_field.first.fill(password)
                time.sleep(0.5)

            # Click Sign in
            login_btn = self.page.locator("button[type='submit'], button:has-text('Sign in')")
            if login_btn.count() > 0:
                login_btn.first.click()
                time.sleep(5)
                print("[Auth] LinkedIn login submitted")
                return True

            print("[Auth] LinkedIn login failed - could not find fields")
            return False
        except Exception as e:
            print(f"[Auth] LinkedIn login error: {e}")
            return False

    def login(self, platform: str, username: str, password: str, email: str = None) -> bool:
        """Universal login dispatcher"""
        platform = platform.lower()
        if platform in ("x", "twitter"):
            return self.login_x(username, password, email)
        elif platform == "instagram":
            return self.login_instagram(username, password)
        elif platform == "facebook":
            return self.login_facebook(username, password)
        elif platform == "threads":
            return self.login_threads(username, password)
        elif platform == "linkedin":
            return self.login_linkedin(username, password)
        else:
            print(f"[Auth] No login method for {platform}")
            return False

    def auto_login(self, platform: str) -> bool:
        """Auto-login using stored credentials"""
        creds = credential_store.get_creds(platform)
        if not creds:
            print(f"[Auth] No credentials stored for {platform}")
            return False
        return self.login(platform, creds.username, creds.password, creds.email)

    def is_logged_in(self, platform: str) -> bool:
        """Check if already logged in"""
        content = self.page.content()
        url = self.page.url

        if platform in ("x", "twitter"):
            has_login = "See what's happening" in content or "Happening now" in content
            has_logged_in = (
                'data-testid="SideNav_NewTweet_Button"' in content or
                'data-testid="AppTabBar_Home_Link"' in content
            )
            return has_logged_in or (not has_login and "/login" not in url)
        elif platform == "instagram":
            return "/accounts/login" not in url and "instagram.com" in url
        elif platform == "facebook":
            return "/login" not in url and "facebook.com" in url
        elif platform == "threads":
            return "/login" not in url and "threads.net" in url
        elif platform == "linkedin":
            return "feed" in url or "mynetwork" in content
        return False
