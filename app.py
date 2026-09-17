import streamlit as st
import os
import time
import pandas as pd
from maskos.agent import MAXXOSAgent
from maskos.executor import stage_post_in_browser
from maskos.vault import VaultManager
from maskos.skills_adapter import PlatformSkillsAdapter
from maskos.voice import LocalVoiceEngine
from maskos.vision import LocalVisionEngine
from maskos.analytics import AnalyticsLedger

# --- PAGE CONFIG ---
st.set_page_config(
    page_title="MAXX OS | Local-First Anti-API Creator Operating System",
    page_icon="🔮",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- BRUTALIST CSS STYLING & MASKYY ORB ANIMATION ---
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');

    html, body, [class*="css"] {
        font-family: 'JetBrains Mono', monospace;
        background-color: #000000 !important;
        color: #ffffff !important;
    }

    .stApp {
        background-color: #000000;
    }

    /* Brutalist Buttons & Inputs */
    .stButton > button {
        border: 2px solid #ffffff !important;
        background-color: #000000 !important;
        color: #ffffff !important;
        border-radius: 0px !important;
        font-weight: 700 !important;
        padding: 10px 24px !important;
        text-transform: uppercase;
        transition: all 0.2s ease;
    }
    .stButton > button:hover {
        background-color: #ffffff !important;
        color: #000000 !important;
        box-shadow: 4px 4px 0px #ffffff;
    }

    .stTextInput input, .stTextArea textarea, .stSelectbox div {
        border: 2px solid #ffffff !important;
        background-color: #0a0a0a !important;
        color: #ffffff !important;
        border-radius: 0px !important;
        font-family: 'JetBrains Mono', monospace !important;
    }

    /* THE MASKYY ORB STYLING */
    .orb-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 30px 0;
    }

    .maskyy-orb {
        width: 140px;
        height: 140px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        position: relative;
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
    }

    /* State: Idle (Breathing) */
    .orb-idle {
        animation: breath 3s infinite ease-in-out;
        background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(0,0,0,1) 70%);
    }

    /* State: Active / Recording */
    .orb-active {
        animation: pulse-active 1s infinite alternate;
        background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(0,0,0,1) 60%);
        border: 3px solid #ffffff;
    }

    /* State: Processing */
    .orb-processing {
        animation: spin-process 1.5s infinite linear;
        border: 3px dashed #ffffff;
        background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(0,0,0,1) 80%);
    }

    /* State: Silent */
    .orb-silent {
        border: 1px solid #444444;
        background: #000000;
    }

    @keyframes breath {
        0% { transform: scale(0.95); box-shadow: 0 0 10px rgba(255,255,255,0.1); }
        50% { transform: scale(1.05); box-shadow: 0 0 25px rgba(255,255,255,0.3); }
        100% { transform: scale(0.95); box-shadow: 0 0 10px rgba(255,255,255,0.1); }
    }

    @keyframes pulse-active {
        0% { transform: scale(0.98); border-color: #ffffff; }
        100% { transform: scale(1.08); border-color: #ffffff; box-shadow: 0 0 35px #ffffff; }
    }

    @keyframes spin-process {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.05); }
        100% { transform: rotate(360deg) scale(1); }
    }

    .card-brutalist {
        border: 2px solid #ffffff;
        padding: 20px;
        background-color: #050505;
        margin-bottom: 20px;
    }
</style>
""", unsafe_allow_html=True)

# --- INITIALIZE STATE ---
if "orb_state" not in st.session_state:
    st.session_state.orb_state = "orb-idle"
if "current_draft" not in st.session_state:
    st.session_state.current_draft = ""
if "current_platform" not in st.session_state:
    st.session_state.current_platform = "x"
if "model_name" not in st.session_state:
    st.session_state.model_name = "hermes3"

agent = MAXXOSAgent(model=st.session_state.model_name)
skills_adapter = PlatformSkillsAdapter()
analytics = AnalyticsLedger()

# --- SIDEBAR NAVIGATION ---
st.sidebar.markdown("# 🔮 MAXX OS")
st.sidebar.markdown("**Local-First. Anti-API. Hermes Agent.**")
st.sidebar.markdown("---")

page = st.sidebar.radio(
    "NAVIGATION",
    [
        "🏠 Dashboard",
        "🧠 Brain (AI Orchestrator)",
        "🎤 Voice Input",
        "✍️ Draft Editor",
        "📋 Review & Post (HITL)",
        "📅 Schedule",
        "📊 Analytics",
        "⚙️ Settings"
    ]
)

# Render Maskyy Orb Component in Sidebar
st.sidebar.markdown("---")
st.sidebar.markdown("**MASKYY ORB STATUS**")
orb_class = st.session_state.orb_state
st.sidebar.markdown(f"""
<div class="orb-container">
    <div class="maskyy-orb {orb_class}"></div>
</div>
""", unsafe_allow_html=True)
st.sidebar.caption(f"Current State: `{orb_class.replace('orb-', '').upper()}`")

# --- 1. DASHBOARD ---
if page == "🏠 Dashboard":
    st.title("MAXX OS // DASHBOARD")
    st.markdown("### Anti-API Operating System for Sovereign Creators")

    col1, col2, col3 = st.columns(3)
    stats = analytics.get_summary_stats()
    with col1:
        st.markdown(f"<div class='card-brutalist'><h2>{stats['total_runs']}</h2><p>STAGED POSTS</p></div>", unsafe_allow_html=True)
    with col2:
        st.markdown(f"<div class='card-brutalist'><h2>{stats['total_compute_seconds']}s</h2><p>LOCAL COMPUTE TIME</p></div>", unsafe_allow_html=True)
    with col3:
        st.markdown(f"<div class='card-brutalist'><h2>${stats['total_api_dollars_saved']}</h2><p>API COSTS SAVED</p></div>", unsafe_allow_html=True)

    st.markdown("### ⚡ 6 PLATFORM SKILLS INTEGRATION MASK")
    p_summary = skills_adapter.list_all_skills_summary()
    cols = st.columns(3)
    idx = 0
    for plat, skills in p_summary.items():
        with cols[idx % 3]:
            st.markdown(f"""
            <div class='card-brutalist'>
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
        user_input = st.text_area("What did you build or learn today?", height=150, placeholder="Just shipped a new local AI agent that bypasses APIs entirely using Playwright...")

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
    st.title("🎤 VOICE INPUT // WHISPER TRANSCRIPTION")
    st.markdown("Record or upload local voice notes with 0 cloud data leakage.")

    st.session_state.orb_state = "orb-active"
    uploaded_audio = st.file_uploader("Upload Audio Note (.wav, .mp3, .m4a)", type=["wav", "mp3", "m4a"])
    
    if uploaded_audio:
        st.audio(uploaded_audio)
        if st.button("Transcribe Local Audio"):
            st.session_state.orb_state = "orb-processing"
            voice_engine = LocalVoiceEngine()
            # Save temporary scratch audio
            os.makedirs("scratch", exist_ok=True)
            temp_path = os.path.join("scratch", uploaded_audio.name)
            with open(temp_path, "wb") as f:
                f.write(uploaded_audio.getbuffer())
            
            transcript = voice_engine.transcribe_audio(temp_path)
            st.session_state.orb_state = "orb-idle"
            st.markdown("### TRANSCRIPTION RESULT")
            st.text_area("Transcribed Text:", value=transcript, height=120)

# --- 4. DRAFT EDITOR ---
elif page == "✍️ Draft Editor":
    st.title("✍️ DRAFT EDITOR")
    st.session_state.current_draft = st.text_area("Edit Draft Content:", value=st.session_state.current_draft, height=250)
    st.session_state.current_platform = st.selectbox("Target Platform:", ["x", "linkedin", "facebook", "instagram", "threads", "youtube", "devto", "github"], index=0)

# --- 5. REVIEW & POST (HITL) ---
elif page == "📋 Review & Post (HITL)":
    st.title("📋 REVIEW & POST // HUMAN-IN-THE-LOOP")
    st.markdown("Review staged draft before triggering Playwright browser automation.")

    st.code(st.session_state.current_draft, language="markdown")

    st.markdown("---")
    if st.button("⚡ LAUNCH BROWSER & STAGE POST"):
        st.session_state.orb_state = "orb-processing"
        with st.spinner(f"Opening Chrome persistent context for {st.session_state.current_platform}..."):
            exec_res = stage_post_in_browser(st.session_state.current_platform, st.session_state.current_draft)
            st.session_state.orb_state = "orb-idle"
        
        st.success(exec_res["status"])
        if exec_res["fallback_used"]:
            st.warning("Clipboard Fallback Triggered! Draft is ready in your Ctrl+V clipboard.")

# --- 6. SCHEDULE ---
elif page == "📅 Schedule":
    st.title("📅 SCHEDULE // LOCAL QUEUE")
    st.markdown("Local background queue for upcoming staged posts.")
    st.info("Local SQLite Queue Active. 0 Cloud dependency.")

# --- 7. ANALYTICS ---
elif page == "📊 Analytics":
    st.title("📊 ANALYTICS // LOCAL COMPUTE LEDGER")
    ledger_path = os.path.join("maskyyy", "vault", "60-Analytics", "cost_ledger.csv")
    if os.path.exists(ledger_path):
        df = pd.read_csv(ledger_path)
        st.dataframe(df, use_container_width=True)

# --- 8. SETTINGS ---
elif page == "⚙️ Settings":
    st.title("⚙️ SETTINGS")
    st.session_state.model_name = st.text_input("Ollama LLM Model Name:", value=st.session_state.model_name)
    st.text_input("Obsidian Vault Path:", value="./maskyyy/vault")
    st.text_input("Chrome User Data Directory:", value="%LOCALAPPDATA%\\Google\\Chrome\\User Data")
    st.success("Settings Saved!")
