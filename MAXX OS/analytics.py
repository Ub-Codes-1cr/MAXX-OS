import os
import csv
from datetime import datetime

class AnalyticsLedger:
    """
    Local Compute and Cost Analytics Ledger for MAXX OS.
    Tracks local inference runtimes, staged posts, and simulated SaaS/API cost savings in CSV/SQLite.
    """
    def __init__(self, ledger_file=None):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.ledger_file = ledger_file or os.path.join(base_dir, "maskyyy", "vault", "60-Analytics", "cost_ledger.csv")
        self._ensure_file()

    def _ensure_file(self):
        os.makedirs(os.path.dirname(self.ledger_file), exist_ok=True)
        if not os.path.exists(self.ledger_file):
            with open(self.ledger_file, "w", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow(["timestamp", "platform", "division", "tokens_generated", "local_compute_seconds", "simulated_api_cost_saved_usd"])

    def record_run(self, platform: str, division: str, tokens: int, compute_sec: float):
        saved_cost = round(tokens * 0.00003 + 0.01, 3)
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        with open(self.ledger_file, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([now_str, platform, division, tokens, compute_sec, saved_cost])

    def get_summary_stats(self) -> dict:
        total_runs = 0
        total_compute = 0.0
        total_saved = 0.0
        if os.path.exists(self.ledger_file):
            with open(self.ledger_file, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    total_runs += 1
                    total_compute += float(row.get("local_compute_seconds", 0) or 0)
                    total_saved += float(row.get("simulated_api_cost_saved_usd", 0) or 0)

        return {
            "total_runs": total_runs,
            "total_compute_seconds": round(total_compute, 2),
            "total_api_dollars_saved": round(total_saved, 2)
        }
