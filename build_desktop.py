"""
PyInstaller Bundling Script for MAXX OS
Builds standalone executable.
"""
import subprocess
import os

def build():
    print("Building MAXX OS Executable...")
    cmd = [
        "pyinstaller",
        "--noconfirm",
        "--onedir",
        "--windowed",
        "--name", "MAXX_OS",
        "--add-data", f"maskyyy{os.pathsep}maskyyy",
        "app.py"
    ]
    subprocess.run(cmd)

if __name__ == "__main__":
    build()
