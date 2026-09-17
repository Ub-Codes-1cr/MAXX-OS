def get_theme_css(theme_name: str = "ultron") -> str:
    """
    Returns CSS styling for MAXX OS based on selected theme:
    - 'brutalist': Classic Black & White Brutalist Theme
    - 'ultron': Cybernetic Ultron Theme (Dark Navy/Black, Crimson Neon Glow, Cybernetic Cards)
    """
    if theme_name.lower() == "brutalist":
        return """
        <style>
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
            html, body, [class*="css"] {
                font-family: 'JetBrains Mono', monospace !important;
                background-color: #000000 !important;
                color: #ffffff !important;
            }
            .stApp { background-color: #000000 !important; }
            section[data-testid="stSidebar"] {
                background-color: #0a0a0a !important;
                border-right: 2px solid #ffffff !important;
            }
            .stButton > button {
                border: 2px solid #ffffff !important;
                background-color: #000000 !important;
                color: #ffffff !important;
                border-radius: 0px !important;
                font-weight: 700 !important;
                font-family: 'JetBrains Mono', monospace !important;
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
            .card-theme {
                border: 2px solid #ffffff;
                padding: 20px;
                background-color: #050505;
                margin-bottom: 20px;
            }
            /* Maskyy Orb Grayscale */
            .maskyy-orb {
                width: 140px; height: 140px; border-radius: 50%;
                border: 2px solid #ffffff; position: relative;
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
            }
            .orb-idle {
                animation: breath 3s infinite ease-in-out;
                background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(0,0,0,1) 70%);
            }
            .orb-active {
                animation: pulse-active 1s infinite alternate;
                background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(0,0,0,1) 60%);
                border: 3px solid #ffffff;
            }
            .orb-processing {
                animation: spin-process 1.5s infinite linear;
                border: 3px dashed #ffffff;
                background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(0,0,0,1) 80%);
            }
            .orb-silent { border: 1px solid #444444; background: #000000; }
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
        </style>
        """
    else:  # ULTRON CYBER THEME
        return """
        <style>
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap');
            html, body, [class*="css"] {
                font-family: 'JetBrains Mono', monospace !important;
                background-color: #030308 !important;
                color: #ff3355 !important;
            }
            .stApp { background-color: #030308 !important; }
            section[data-testid="stSidebar"] {
                background-color: #080812 !important;
                border-right: 2px solid #ff0033 !important;
                box-shadow: 4px 0px 15px rgba(255, 0, 51, 0.2);
            }
            h1, h2, h3, h4, h5, h6 {
                color: #ffffff !important;
                text-shadow: 0 0 8px rgba(255, 0, 51, 0.6);
            }
            .stButton > button {
                border: 2px solid #ff0033 !important;
                background-color: #0c0005 !important;
                color: #ffffff !important;
                border-radius: 0px !important;
                font-weight: 700 !important;
                font-family: 'JetBrains Mono', monospace !important;
                text-transform: uppercase;
                transition: all 0.2s ease;
                box-shadow: 0 0 10px rgba(255, 0, 51, 0.3);
            }
            .stButton > button:hover {
                background-color: #ff0033 !important;
                color: #ffffff !important;
                box-shadow: 0 0 20px #ff0033;
            }
            .stTextInput input, .stTextArea textarea, .stSelectbox div {
                border: 1px solid #ff0033 !important;
                background-color: #0a0306 !important;
                color: #ffffff !important;
                border-radius: 0px !important;
                font-family: 'JetBrains Mono', monospace !important;
            }
            .card-theme {
                border: 1px solid #ff0033;
                padding: 20px;
                background-color: #070205;
                margin-bottom: 20px;
                box-shadow: 0 0 15px rgba(255, 0, 51, 0.15);
            }
            /* Maskyy Orb Cyber Crimson */
            .maskyy-orb {
                width: 140px; height: 140px; border-radius: 50%;
                border: 2px solid #ff0033; position: relative;
                box-shadow: 0 0 25px rgba(255, 0, 51, 0.5);
            }
            .orb-idle {
                animation: ultron-breath 3s infinite ease-in-out;
                background: radial-gradient(circle, rgba(255,0,51,0.4) 0%, rgba(3,3,8,1) 75%);
            }
            .orb-active {
                animation: ultron-pulse 1s infinite alternate;
                background: radial-gradient(circle, rgba(255,51,85,0.7) 0%, rgba(3,3,8,1) 60%);
                border: 3px solid #ff3355;
            }
            .orb-processing {
                animation: ultron-spin 1.2s infinite linear;
                border: 3px dashed #ff0033;
                background: radial-gradient(circle, rgba(255,0,51,0.5) 0%, rgba(3,3,8,1) 80%);
            }
            .orb-silent { border: 1px solid #440011; background: #030308; }
            @keyframes ultron-breath {
                0% { transform: scale(0.95); box-shadow: 0 0 15px rgba(255,0,51,0.3); }
                50% { transform: scale(1.05); box-shadow: 0 0 35px rgba(255,0,51,0.7); }
                100% { transform: scale(0.95); box-shadow: 0 0 15px rgba(255,0,51,0.3); }
            }
            @keyframes ultron-pulse {
                0% { transform: scale(0.98); border-color: #ff0033; }
                100% { transform: scale(1.08); border-color: #ffffff; box-shadow: 0 0 45px #ff0033; }
            }
            @keyframes ultron-spin {
                0% { transform: rotate(0deg) scale(1); }
                50% { transform: rotate(180deg) scale(1.08); }
                100% { transform: rotate(360deg) scale(1); }
            }
        </style>
        """
