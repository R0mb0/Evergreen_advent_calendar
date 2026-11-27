#!/usr/bin/env python3
"""Genera docs/days/manifest.json scansionando le cartelle docs/days/NN/.

Uso (dalla radice del repository, anche in locale):
    python3 .github/scripts/generate_manifest.py

Regole:
  - vengono considerate solo le cartelle con nome a due cifre (01, 02, ... 24);
  - Readme.md (qualsiasi maiuscola) è la "nota del giorno" e va nel campo "readme";
  - file nascosti (.nome), file di sistema e file che iniziano con "_" sono ignorati
    (Jekyll non pubblica i file che iniziano con "_" o "."): in quel caso viene
    stampato un avviso;
  - i giorni senza file né Readme non compaiono nel manifest.

Il percorso della cartella del sito può essere cambiato con la variabile
d'ambiente SITE_DIR (default: docs).
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
                print(f"AVVISO: {folder.name}/{name} ignorato (Jekyll non pubblica i file che iniziano con '_')",
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
    print(f"Generato {out_file} con {len(manifest['days'])} giorni.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
