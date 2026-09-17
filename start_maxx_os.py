"""
MAXX OS - Master Launcher
Launches the Local Python API Engine (FastAPI on http://localhost:8000)
and the User's Custom React + Vite Frontend (http://localhost:5173).
"""

import subprocess
import time
import sys
import os

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(base_dir, "maxxx Final")

    print("=" * 60)
    print("🔮 STARTING MAXX OS LOCAL INFRASTRUCTURE...")
    print("=" * 60)

    # 1. Start Local Python API Server
    print("🚀 Launching Local API Engine (http://localhost:8000)...")
    api_cmd = [sys.executable, "-m", "uvicorn", "maxxos.server:app", "--host", "127.0.0.1", "--port", "8000"]
    api_proc = subprocess.Popen(api_cmd, cwd=base_dir)

    time.sleep(2)

    # 2. Launch React + Vite Frontend
    print(f"🎨 Launching React + Vite Frontend from: {frontend_dir}")
    if os.path.exists(frontend_dir):
        # Check npm install
        if not os.path.exists(os.path.join(frontend_dir, "node_modules")):
            print("📦 Installing npm dependencies...")
            subprocess.run(["npm", "install"], cwd=frontend_dir, shell=True)

        vite_cmd = ["npm", "run", "dev"]
        vite_proc = subprocess.Popen(vite_cmd, cwd=frontend_dir, shell=True)

        print("\n✅ MAXX OS IS ONLINE!")
        print("   - API Server: http://localhost:8000")
        print("   - Frontend UI: http://localhost:5173")
        print("=" * 60)

        try:
            vite_proc.wait()
        except KeyboardInterrupt:
            print("\nShutting down MAXX OS...")
            api_proc.terminate()
            vite_proc.terminate()

if __name__ == "__main__":
    main()
