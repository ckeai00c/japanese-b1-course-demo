#!/usr/bin/env python3
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

WORD_RUN_DIR = Path("/Users/chenying/.codex/cya-business-pack/runs/lesson1-word-images-20261008")
PHRASE_RUN_DIR = Path("/Users/chenying/.codex/cya-business-pack/runs/lesson1-phrase-images-20261008")
PROJECT_DIR = Path("/Users/chenying/Documents/ChatGPT/22/japanese-b1-course-demo")
PROMPT_FILE = PROJECT_DIR / "personalized/image-prompts-lesson1.md"
CYA_AI = Path("/Users/chenying/.codex/skills/cya-business-pack/bin/cya-ai")
TASKS = {
    "pilot": [("最強", "saikyo-word.png")],
    "batch": [("正義", "seigi-word.png"), ("完璧", "kanpeki-word.png")],
    "phrase-pilot": [("最強だから", "saikyo-phrase-v3.png")],
    "phrase-batch": [("正義だから", "seigi-phrase-v3.png"), ("完璧だから", "kanpeki-phrase-v3.png")],
}


def section(text: str, heading: str) -> str:
    match = re.search(rf"^## {re.escape(heading)}\s*$\n\n(.+?)(?=\n## |\Z)", text, re.M | re.S)
    if not match:
        raise RuntimeError(f"Prompt section not found: {heading}")
    return match.group(1).strip()


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def main() -> None:
    phase = sys.argv[1] if len(sys.argv) > 1 else "pilot"
    if phase not in TASKS:
        raise SystemExit("Usage: run-image-generation.py pilot|batch|phrase-pilot|phrase-batch")
    run_dir = PHRASE_RUN_DIR if phase.startswith("phrase-") else WORD_RUN_DIR
    subprocess.run([str(CYA_AI), "key-check", "--json"], check=True)
    prompt_text = PROMPT_FILE.read_text(encoding="utf-8")
    raw_dir = run_dir / "outputs/raw"
    raw_dir.mkdir(parents=True, exist_ok=True)
    progress = {"phase": phase, "total": len(TASKS[phase]), "completed": 0, "status": "running", "tasks": []}
    write_json(run_dir / "progress.json", progress)
    for heading, filename in TASKS[phase]:
        output = raw_dir / filename
        command = [
            str(CYA_AI), "image", "generate", "--json",
            "--model", "gpt-image-2", "--size", "1280x720",
            "--quality", "medium", "--prompt", section(prompt_text, heading),
            "--output", str(output), "--user-name", "chenying",
        ]
        result = subprocess.run(command, capture_output=True, text=True)
        if result.returncode != 0:
            error_payload = {
                "heading": heading,
                "returncode": result.returncode,
                "stdout": result.stdout,
                "stderr": result.stderr,
            }
            progress["status"] = "failed"
            progress["tasks"].append(error_payload)
            write_json(run_dir / "progress.json", progress)
            write_json(run_dir / "status.json", {"phase": phase, "status": "failed", "error": error_payload})
            print(json.dumps(error_payload, ensure_ascii=False, indent=2), file=sys.stderr)
            raise SystemExit(result.returncode)
        payload = json.loads(result.stdout)
        progress["tasks"].append({"heading": heading, "output": str(output), "result": payload})
        progress["completed"] += 1
        write_json(run_dir / "progress.json", progress)
    progress["status"] = "completed"
    progress["finished_at"] = datetime.now(timezone.utc).isoformat()
    write_json(run_dir / "progress.json", progress)
    write_json(run_dir / "status.json", {"phase": phase, "status": "completed", "outputs": [task["output"] for task in progress["tasks"]]})
    print(json.dumps(progress, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
