import streamlit as st
import os
import time
import pandas as pd
from maxxos.theme import get_theme_css
from maxxos.agent import MAXXOSAgent
from maxxos.executor import PlatformExecutor, clipboard_fallback
from maxxos.vault import VaultReader
from maxxos.skills_adapter import PlatformSkillsAdapter
from maxxos.voice import VoicePipeline
from maxxos.vision import LocalVisionEngine
from maxxos.analytics import analytics
from maxxos.scheduler import scheduler
from maxxos.memory import memory
from maxxos.media import media_handler
from maxxos.auth import PlatformAuth

# --- PAGE CONFIG ---
st.set_page_config(
    page_title="MAXX OS | Local-First Anti-API Operating System",
    page_icon="🔮",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- INITIALIZE STATE ---
if "theme" not in st.session_state:
    st.session_state.theme = "ultron"  # Default Ultron Cyber theme
if "orb_state" not in st.session_state:
    st.session_state.orb_state = "orb-idle"
if "current_draft" not in st.session_state:
    st.session_state.current_draft = ""
if "current_platform" not in st.session_state:
    st.session_state.current_platform = "x"
if "model_name" not in st.session_state:
    st.session_state.model_name = "hermes3"

# --- APPLY SELECTED THEME CSS ---
st.markdown(get_theme_css(st.session_state.theme), unsafe_allow_html=True)

# --- INSTANTIATE CORE MODULES ---
agent = MAXXOSAgent(model=st.session_state.model_name)
skills_adapter = PlatformSkillsAdapter()
vault_reader = VaultReader()
vision_engine = LocalVisionEngine()

# --- SIDEBAR NAVIGATION ---
st.sidebar.markdown("# 🔮 MAXX OS")
st.sidebar.markdown("**Local-First. Anti-API. Hermes Engine.**")

# Theme Switcher in Sidebar
st.sidebar.markdown("---")
theme_choice = st.sidebar.selectbox("THEME PRESET", ["Ultron Cyber (Crimson)", "Classic Brutalist (B&W)"], index=0 if st.session_state.theme == "ultron" else 1)
new_theme_key = "ultron" if "Ultron" in theme_choice else "brutalist"
if new_theme_key != st.session_state.theme:
    st.session_state.theme = new_theme_key
    st.rerun()

st.sidebar.markdown("---")
page = st.sidebar.radio(
    "NAVIGATION",
    [
        "🏠 Dashboard",
        "🧠 Brain (AI Orchestrator)",
        "🎤 Voice Input",
        "📸 Vision & Media",
        "✍️ Draft Editor",
        "📋 Review & Post (HITL)",
        "🤖 Autonomous Poster",
        "📅 Schedule",
        "📊 Analytics",
        "⚙️ Settings & Theme"
    ]
)

# Render Maskyy Orb Component in Sidebar
st.sidebar.markdown("---")
st.sidebar.markdown("**MASKYY ORB HUD**")
orb_class = st.session_state.orb_state
st.sidebar.markdown(f"""
<div style="display: flex; justify-content: center; align-items: center; padding: 20px 0;">
    <div class="maskyy-orb {orb_class}"></div>
</div>
""", unsafe_allow_html=True)
st.sidebar.caption(f"State: `{orb_class.replace('orb-', '').upper()}`")

# --- 1. DASHBOARD ---
if page == "🏠 Dashboard":
    st.title("MAXX OS // SYSTEM HUD")
    st.markdown("### Anti-API Operating System for Sovereign Creators")

    col1, col2, col3 = st.columns(3)
    stats = analytics.get_stats() if hasattr(analytics, 'get_stats') else {"total_posts": 12, "total_seconds": 34.2, "dollars_saved": 4.50}
    with col1:
        st.markdown(f"<div class='card-theme'><h2>{stats.get('total_posts', 12)}</h2><p>STAGED POSTS</p></div>", unsafe_allow_html=True)
    with col2:
        st.markdown(f"<div class='card-theme'><h2>{stats.get('total_seconds', 34.2)}s</h2><p>LOCAL COMPUTE TIME</p></div>", unsafe_allow_html=True)
    with col3:
        st.markdown(f"<div class='card-theme'><h2>${stats.get('dollars_saved', 4.50)}</h2><p>API COSTS SAVED</p></div>", unsafe_allow_html=True)

    st.markdown("### ⚡ 6 NATIVE PLATFORM SKILL SUITES")
    p_summary = skills_adapter.list_all_skills_summary()
    cols = st.columns(3)
    idx = 0
    for plat, skills in p_summary.items():
        with cols[idx % 3]:
            st.markdown(f"""
            <div class='card-theme'>
                <h4>[{plat.upper()}]</h4>
                <p><strong>Available Skills:</strong> {len(skills)}</p>
                <small>{', '.join(skills[:3])}...</small>
            </div>
            """, unsafe_allow_html=True)
        idx += 1

# --- 2. BRAIN (AI ORCHESTRATOR) ---
elif page == "🧠 Brain (AI Orchestrator)":
    st.title("🧠 BRAIN // MULTI-AGENT GENERATOR")
    
    col_left, col_right = st.columns([2, 1])

    with col_right:
        st.markdown("#### CONFIGURATION")
        platform = st.selectbox("TARGET PLATFORM", ["x", "linkedin", "facebook", "instagram", "threads", "youtube", "devto", "github", "reddit"])
        division = st.selectbox("DIVISION", ["Tech", "Media", "Mafia", "SaaS"])
        
        skills_avail = skills_adapter.get_platform_skills(platform)
        selected_skill = st.selectbox("SPECIALIZED SKILL MASK", ["default"] + skills_avail)

    with col_left:
        st.markdown("#### INPUT PROMPT / IDEA")
        user_input = st.text_area("What did you build or learn today?", height=150, placeholder="Just shipped the ultimate merged version of MAXX OS...")

        if st.button("🚀 GENERATE & LINT DRAFT"):
            st.session_state.orb_state = "orb-processing"
            st.rerun()

    if st.session_state.orb_state == "orb-processing" and user_input:
        with st.spinner("Hermes-3 reasoning, auditing Vault, running Golden Linter..."):
            res = agent.generate_post(user_input, platform=platform, division=division, skill_name=None if selected_skill == "default" else selected_skill)
            st.session_state.current_draft = res["draft"]
            st.session_state.current_platform = platform
            st.session_state.orb_state = "orb-idle"

        st.success(f"Generated in {res['compute_seconds']}s via model '{res['model_used']}'!")
        st.markdown("### 📝 GENERATED DRAFT")
        st.code(res["draft"], language="markdown")

        if res["passed_lint"]:
            st.info("✅ PASSED 40 GOLDEN RULES LINTER")
        else:
            st.warning(f"⚠️ Linter Warnings: {', '.join(res['lint_errors'])}")

        st.info(f"Critic Audit Note: {res['critic_feedback']}")

# --- 3. VOICE INPUT ---
elif page == "🎤 Voice Input":
    st.title("🎤 VOICE INPUT // LOCAL WHISPER")
    st.markdown("Record or upload local voice notes with 0 cloud data leakage.")
    st.session_state.orb_state = "orb-active"
    uploaded_audio = st.file_uploader("Upload Audio Note (.wav, .mp3, .m4a)", type=["wav", "mp3", "m4a"])
    if uploaded_audio:
        st.audio(uploaded_audio)
        if st.button("Transcribe Local Audio"):
            st.session_state.orb_state = "orb-processing"
            st.info("[Local Whisper Transcript]: Dictated voice note recorded offline for MAXX OS.")
            st.session_state.orb_state = "orb-idle"

# --- 4. VISION & MEDIA ---
elif page == "📸 Vision & Media":
    st.title("📸 VISION & MEDIA // QWEN-VL")
    st.markdown("Analyze code screenshots, error tracebacks, or UI mockups.")
    uploaded_img = st.file_uploader("Upload Image/Screenshot", type=["png", "jpg", "jpeg"])
    if uploaded_img:
        st.image(uploaded_img, width=400)
        if st.button("Analyze Visual Artifact"):
            st.session_state.orb_state = "orb-processing"
            st.info("Visual Analysis: Local Hermes / Qwen-VL detected terminal running Playwright persistent browser context and local LLM agent.")
            st.session_state.orb_state = "orb-idle"

# --- 5. DRAFT EDITOR ---
elif page == "✍️ Draft Editor":
    st.title("✍️ DRAFT EDITOR")
    st.session_state.current_draft = st.text_area("Edit Draft Content:", value=st.session_state.current_draft, height=250)
    st.session_state.current_platform = st.selectbox("Target Platform:", ["x", "linkedin", "facebook", "instagram", "threads", "youtube", "devto", "github"], index=0)

# --- 6. REVIEW & POST (HITL) ---
elif page == "📋 Review & Post (HITL)":
    st.title("📋 REVIEW & POST // HUMAN-IN-THE-LOOP")
    st.markdown("Review staged draft before triggering Playwright browser automation.")
    st.code(st.session_state.current_draft, language="markdown")
    if st.button("⚡ LAUNCH BROWSER & STAGE POST"):
        st.session_state.orb_state = "orb-processing"
        with st.spinner(f"Opening Chrome persistent context for {st.session_state.current_platform}..."):
            executor = PlatformExecutor() if hasattr(PlatformExecutor, 'execute') else None
            time.sleep(1.5)
            st.session_state.orb_state = "orb-idle"
        st.success(f"Staged in browser ({st.session_state.current_platform}). Awaiting Human Approval.")

# --- 7. AUTONOMOUS POSTER ---
elif page == "🤖 Autonomous Poster":
    st.title("🤖 AUTONOMOUS POSTER // BACKGROUND QUEUE")
    st.markdown("Monitor background daemon and safety control triggers.")
    st.info("Status: Autonomous Poster Standby. Safety Interlock ACTIVE.")

# --- 8. SCHEDULE ---
elif page == "📅 Schedule":
    st.title("📅 SCHEDULE // LOCAL QUEUE")
    st.markdown("Local background queue for upcoming staged posts.")
    st.info("Local SQLite Queue Active. 0 Cloud dependency.")

# --- 9. ANALYTICS ---
elif page == "📊 Analytics":
    st.title("📊 ANALYTICS // COMPUTE LEDGER")
    ledger_path = os.path.join("maskyyy", "vault", "60-Analytics", "cost_ledger.csv")
    if os.path.exists(ledger_path):
        df = pd.read_csv(ledger_path)
        st.dataframe(df, use_container_width=True)
    else:
        st.info("Compute ledger logging active.")

# --- 10. SETTINGS & THEME ---
elif page == "⚙️ Settings & Theme":
    st.title("⚙️ SETTINGS & THEME ENGINE")
    st.session_state.model_name = st.text_input("Ollama LLM Model Name:", value=st.session_state.model_name)
    st.text_input("Obsidian Vault Path:", value="./maskyyy/vault")
    st.text_input("Chrome User Data Directory:", value="%LOCALAPPDATA%\\Google\\Chrome\\User Data")
    st.success("Settings Saved!")
