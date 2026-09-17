"""
MAXXX OS - Voice Pipeline
Local Speech-to-Text (faster-whisper) & Text-to-Speech (edge-tts)
Zero cloud dependency for voice processing
"""

import asyncio
import os
import tempfile
from pathlib import Path
from typing import Optional

import edge_tts
from faster_whisper import WhisperModel


class VoicePipeline:
    def __init__(self, model_size: str = "base"):
        self.model_size = model_size
        self.whisper_model = None
        self._load_model()

    def _load_model(self):
        try:
            self.whisper_model = WhisperModel(
                self.model_size,
                device="cpu",
                compute_type="int8"
            )
            print(f"[VoicePipeline] Loaded Whisper model: {self.model_size}")
        except Exception as e:
            print(f"[VoicePipeline] Error loading Whisper: {e}")
            self.whisper_model = None

    def transcribe(self, audio_path: str) -> str:
        if not self.whisper_model:
            raise RuntimeError("Whisper model not loaded")

        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        segments, info = self.whisper_model.transcribe(
            audio_path,
            beam_size=5,
            language="en",
            vad_filter=True
        )

        full_text = " ".join([segment.text for segment in segments])
        return full_text.strip()

    async def text_to_speech(
        self,
        text: str,
        output_path: Optional[str] = None,
        voice: str = "en-US-GuyNeural",
        rate: str = "+0%",
        pitch: str = "+0Hz"
    ) -> str:
        if output_path is None:
            output_path = os.path.join(tempfile.gettempdir(), "maxxx_tts_output.mp3")

        communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
        await communicate.save(output_path)

        return output_path

    def speak(self, text: str, voice: str = "en-US-GuyNeural") -> str:
        output_path = os.path.join(tempfile.gettempdir(), "maxxx_tts_output.mp3")
        asyncio.run(self.text_to_speech(text, output_path, voice))
        return output_path

    def confirm_draft_ready(self, platform: str, char_count: int) -> str:
        message = f"Draft generated for {platform}. {char_count} characters. Ready for review."
        return self.speak(message)

    def confirm_post_staged(self, platform: str) -> str:
        message = f"Post staged on {platform}. Awaiting your approval."
        return self.speak(message)

    def alert_lint_failure(self, errors: list) -> str:
        error_count = len(errors)
        message = f"Lint check failed. {error_count} issues found. Sending back for revision."
        return self.speak(message)


def record_audio(duration: int = 10, output_path: Optional[str] = None) -> str:
    try:
        import sounddevice as sd
        import soundfile as sf
    except ImportError:
        raise RuntimeError("sounddevice and soundfile required for recording")

    if output_path is None:
        output_path = os.path.join(tempfile.gettempdir(), "maxxx_voice_input.wav")

    sample_rate = 16000
    print(f"[VoicePipeline] Recording for {duration} seconds...")
    audio = sd.rec(int(duration * sample_rate), samplerate=sample_rate, channels=1)
    sd.wait()
    sf.write(output_path, audio, sample_rate)
    print(f"[VoicePipeline] Recording saved to: {output_path}")

    return output_path


if __name__ == "__main__":
    pipeline = VoicePipeline(model_size="base")
    print("[VoicePipeline] Voice pipeline initialized")
    print("[VoicePipeline] Ready for voice input/output")
