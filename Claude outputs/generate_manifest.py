#!/usr/bin/env python3
"""Generates docs/days/manifest.json by scanning the docs/days/NN/ folders.

Usage (from the repository root, also locally):
    python3 .github/scripts/generate_manifest.py

Rules:
  - only folders with a two-digit name (01, 02, ... 24) are considered;
  - Readme.md (any capitalization) is the "note of the day" and goes into the "readme" field;
  - hidden files (.name), system files and files starting with "_" are ignored
    (Jekyll does not publish files starting with "_" or "."): a warning is
    printed in that case;
  - days with neither files nor a Readme do not appear in the manifest.

The site folder path can be changed with the SITE_DIR environment
variable (default: docs).
"""
import json
import os
import re
import sys
from pathlib import Path

IGNORED_FILES = {".ds_store", ".gitkeep", "thumbs.db", "desktop.ini", "manifest.json"}


def build_manifest(days_dir: Path) -> dict:
    manifest = {"days": {}}

    day_folders = [
        d for d in days_dir.iterdir()
        if d.is_dir() and re.fullmatch(r"\d{2}", d.name)
    ]

    for folder in sorted(day_folders, key=lambda d: int(d.name)):
        files = []
        readme = None

        for item in sorted(folder.iterdir(), key=lambda p: p.name.lower()):
            if not item.is_file():
                continue

            name = item.name
            lower_name = name.lower()

            if name.startswith(".") or lower_name in IGNORED_FILES:
                continue
            if name.startswith("_"):
                print(f"WARNING: {folder.name}/{name} ignored (Jekyll does not publish files starting with '_')",
                      file=sys.stderr)
                continue

            if lower_name == "readme.md":
                readme = name
            else:
                files.append(name)

        if not files and not readme:
            continue

        entry = {"files": files}
        if readme:
            entry["readme"] = readme
        manifest["days"][folder.name] = entry

    return manifest


def main() -> int:
    site_dir = Path(os.environ.get("SITE_DIR", "docs"))
    days_dir = site_dir / "days"
    days_dir.mkdir(parents=True, exist_ok=True)

    manifest = build_manifest(days_dir)

    out_file = days_dir / "manifest.json"
    out_file.write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Generated {out_file} with {len(manifest['days'])} days.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
