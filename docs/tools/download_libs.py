#!/usr/bin/env python3
"""Downloads the third-party libraries and fonts so the app works fully offline.

Usage (from the repository root, internet connection required, Python 3 only):

    python3 tools/download_libs.py              # download what is missing
    python3 tools/download_libs.py --force      # download everything again
    python3 tools/download_libs.py --out libs   # choose the output folder

By default the files are saved in <site folder>/libs, where the site folder is the
repository root if it contains index.html, otherwise docs/.

The GitHub workflow runs this script automatically before every deploy, so you only
need to run it yourself to try the app locally offline or to commit the libraries
into the repository.

Keep the versions in sync with docs/js/libs.js and docs/service-worker.js.
"""
import argparse
import re
import sys
import time
import urllib.request
from pathlib import Path

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

# local file name -> (url, license)
LIBRARIES = {
    "lucide.min.js": ("https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js", "Lucide 0.460.0 (ISC)"),
    "confetti.browser.min.js": ("https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js", "canvas-confetti 1.9.3 (ISC)"),
    "marked.min.js": ("https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js", "marked 12.0.2 (MIT)"),
    "purify.min.js": ("https://cdn.jsdelivr.net/npm/dompurify@3.1.7/dist/purify.min.js", "DOMPurify 3.1.7 (Apache-2.0 or MPL-2.0)"),
    "mammoth.browser.min.js": ("https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js", "Mammoth.js 1.8.0 (BSD-2-Clause)"),
    "pdf.min.js": ("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js", "PDF.js 3.11.174 (Apache-2.0)"),
    "pdf.worker.min.js": ("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js", "PDF.js worker 3.11.174 (Apache-2.0)"),
    "ogg-opus-decoder.min.js": ("https://cdn.jsdelivr.net/npm/ogg-opus-decoder@1.7.0/dist/ogg-opus-decoder.min.js", "ogg-opus-decoder 1.7.0 (MIT)"),
}

FONTS_CSS_URL = (
    "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700"
    "&family=Nunito:wght@500;600;700;800&display=swap"
)
# Only the Latin alphabets are needed for the supported languages (it, en, fr, de, es, pt, nl, pl)
FONT_SUBSETS = {"latin", "latin-ext"}


def fetch(url: str, retries: int = 3) -> bytes:
    last_error = None
    for attempt in range(1, retries + 1):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(request, timeout=40) as response:
                return response.read()
        except Exception as error:  # network errors, HTTP errors...
            last_error = error
            time.sleep(attempt)
    raise RuntimeError(f"{url}: {last_error}")


def save(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".part")
    tmp.write_bytes(data)
    tmp.replace(path)


def download_libraries(out: Path, force: bool) -> int:
    failures = 0
    for name, (url, label) in LIBRARIES.items():
        target = out / name
        if target.exists() and target.stat().st_size > 1024 and not force:
            print(f"  = {name} (already present)")
            continue
        try:
            data = fetch(url)
            if len(data) < 1024 or data.lstrip()[:1] == b"<":
                raise RuntimeError("unexpected content (not a script)")
            save(target, data)
            print(f"  + {name}  <- {label}")
        except Exception as error:
            failures += 1
            print(f"  ! {name}: {error}", file=sys.stderr)
    return failures


def download_fonts(out: Path, force: bool) -> int:
    fonts_dir = out / "fonts"
    css_file = fonts_dir / "fonts.css"
    if css_file.exists() and not force:
        print("  = fonts/fonts.css (already present)")
        return 0

    try:
        css = fetch(FONTS_CSS_URL).decode("utf-8")
        blocks = re.findall(r"/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{[^}]*\})", css)
        kept = [(subset, block) for subset, block in blocks if subset in FONT_SUBSETS]
        if not kept:
            raise RuntimeError("no font blocks found")

        files = {}
        result = []
        for subset, block in kept:
            url = re.search(r"url\((https://[^)]+)\)", block).group(1)
            if url not in files:
                files[url] = f"{len(files) + 1:02d}-{subset}.woff2"
                save(fonts_dir / files[url], fetch(url))
            result.append(f"/* {subset} */\n" + block.replace(url, f"./{files[url]}"))

        save(css_file, ("\n".join(result) + "\n").encode("utf-8"))
        print(f"  + fonts/fonts.css and {len(files)} font file(s)  <- Fredoka & Nunito (SIL OFL 1.1)")
        return 0
    except Exception as error:
        print(f"  ! fonts: {error}", file=sys.stderr)
        return 1


def write_licenses(out: Path) -> None:
    lines = [
        "# Third-party libraries",
        "",
        "These files are downloaded by tools/download_libs.py and keep their original licenses:",
        "",
    ]
    lines += [f"- {label}" for _, label in LIBRARIES.values()]
    lines += ["- Fredoka and Nunito fonts (SIL Open Font License 1.1)", ""]
    save(out / "LICENSES.md", "\n".join(lines).encode("utf-8"))


def default_out() -> Path:
    site = Path(".") if Path("index.html").is_file() else Path("docs")
    return site / "libs"


def main() -> int:
    parser = argparse.ArgumentParser(description="Download the libraries needed for offline use.")
    parser.add_argument("--out", type=Path, default=None, help="output folder (default: <site folder>/libs)")
    parser.add_argument("--force", action="store_true", help="download again even if the files exist")
    args = parser.parse_args()

    out = args.out or default_out()
    print(f"Downloading libraries into {out}/")
    failures = download_libraries(out, args.force) + download_fonts(out, args.force)
    write_licenses(out)

    if failures:
        print(f"\n{failures} download(s) failed: the app will use the CDN for those files.", file=sys.stderr)
        return 1
    print("\nDone: the app can now work fully offline.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
