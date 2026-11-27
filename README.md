<div align="center">
<h1>🎄 Evergreen Advent Calendar 🎁</h1>

<p>
A cute, modern, 100% client-side 3D Advent Calendar Progressive Web App (PWA) built with pure HTML, CSS, and JavaScript—designed to be reused year after year. Featuring rounded 3D animated doors, anti-tamper server-time unlocking, multi-year state tracking, a universal multimedia viewer (including PDFs, Word, RTF, and WhatsApp Opus voice notes), Markdown companion comments, download protection, European multi-language support, and zero-backend folder indexing via Jekyll.
</p>

<div align="center">
  <a href="http://paypal.me/R0mb0">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/R0mb0/Support_the_dev_badge/blob/main/Badge/SVG/Support_the_dev_badge_Dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://github.com/R0mb0/Support_the_dev_badge/blob/main/Badge/SVG/Support_the_dev_badge_Light.svg">
      <img alt="Saved you time? Support the dev" src="https://github.com/R0mb0/Support_the_dev_badge/blob/main/Badge/SVG/Support_the_dev_badge_Default.svg">
    </picture>
  </a>
</div>

---

[![Build Jekyll & Deploy Evergreen Advent Calendar](https://github.com/R0mb0/Evergreen_advent_calendar/actions/workflows/jekyll_build.yml/badge.svg)](https://github.com/R0mb0/Evergreen_advent_calendar/actions/workflows/jekyll_build.yml)
[![pages-build-deployment](https://github.com/R0mb0/Evergreen_advent_calendar/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/R0mb0/Evergreen_advent_calendar/actions/workflows/pages/pages-build-deployment)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/R0mb0/Evergreen_advent_calendar)
[![Open Source Love svg3](https://badges.frapsoft.com/os/v3/open-source.svg?v=103)](https://github.com/R0mb0/Evergreen_advent_calendar)
[![MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/license/mit)
[![Donate](https://img.shields.io/badge/PayPal-Donate%20to%20Author-blue.svg)](http://paypal.me/R0mb0)

<h2><a href="https://r0mb0.github.io/Evergreen_advent_calendar/">👉 Click here to test the app! 👈</a></h2>

</div>

<!-- Replace with your own screenshots -->
[![01.png](https://github.com/R0mb0/Evergreen_advent_calendar/blob/main/Readme_imgs/01.png)](https://r0mb0.github.io/Evergreen_advent_calendar/)

<hr>

<h2>🚀 Features</h2>
<ul>
<li><strong>Modern 3D &amp; Cute Responsive UI</strong>: Rounded glassmorphic/clay-inspired design, smooth CSS 3D hinge-opening door animations, celebratory confetti, toggleable snowfall canvas, and a fluid layout tailored for both mobile phones and desktop monitors.</li>
<li><strong>Evergreen Multi-Year Unlocking Logic</strong>: Date validation checks only the <em>month and day</em> (ignoring the year), allowing the calendar to live on forever. Each door records the exact year it was last opened in <code>localStorage</code>/cookies—once opened, it stays open during the current season and automatically resets to closed whenever <code>currentYear &gt; lastOpenedYear</code>.</li>
<li><strong>Server-Verified Date &amp; Local Timezone Awareness</strong>: Fetches the real current date from an external time server (or server HTTP <code>Date</code> header) and maps it to the recipient's browser timezone/geographic locale—preventing casual clock-spoofing while falling back cleanly to device time when offline.</li>
<li><strong>Universal Client-Side Multimedia Viewer</strong>: Opens virtually any common personal media right inside the modal without external plugins:
  <ul>
    <li><strong>Images</strong>: PNG, JPG/JPEG, WebP, GIF, SVG, AVIF</li>
    <li><strong>Video</strong>: MP4, WebM, MOV (browser-supported codecs)</li>
    <li><strong>Audio</strong>: MP3, WAV, M4A, OGG, and <strong>WhatsApp voice notes (<code>.opus</code>)</strong></li>
    <li><strong>Documents</strong>: <strong>PDF</strong> (rendered client-side), <strong>Word (<code>.docx</code>)</strong>, <strong>RTF (<code>.rtf</code>)</strong>, and plain text (<code>.txt</code>)</li>
  </ul>
</li>
<li><strong>Markdown Companion Notes (<code>Readme.md</code>)</strong>: Drop a <code>Readme.md</code> inside any day's folder to attach a personal letter, poem, or note. Recipients can open it via the dedicated <strong>Comment</strong> button with full Markdown syntax rendering.</li>
<li><strong>Configurable Download Protection (<code>config.json</code>)</strong>: Media downloads are <strong>disabled by default</strong> (<code>"allowDownload": false</code>) to protect personal content—hiding download controls, disabling casual right-click/save actions, and rendering documents/media through protected viewers. Flip a single boolean in <code>config.json</code> whenever you want to enable downloads.</li>
<li><strong>Graceful Missing-Content Fallbacks</strong>: Forgot to upload today's surprise before midnight? Built-in fallback handling displays a charming placeholder message instead of a broken viewer or console crash.</li>
<li><strong>Installable PWA (Progressive Web App)</strong>: Includes a dedicated <strong>Install / Download App</strong> button right in the toolbar powered by Chrome's PWA install protocol (<code>beforeinstallprompt</code>), plus guided "Add to Home Screen" support for mobile devices so it behaves like a native app.</li>
<li><strong>European Multi-Language Support (Auto + Manual)</strong>: Automatically detects the user's browser language across major European languages and provides a manual language switcher in the toolbar.</li>
<li><strong>Offline-Ready Library Architecture</strong>: All external libraries are cleanly declared and grouped inside the <code>&lt;head&gt;</code> section so you can download them locally into a <code>libs/</code> folder for 100% self-contained offline operation.</li>
</ul>

<h2>💡 Motivation &amp; Why Use This?</h2>
<ul>
<li><strong>A Deeply Personal, Reusable Digital Gift</strong>: Built to share a daily surprise with a partner, family member, or close friend—combining photos, videos, letters, documents, and spontaneous WhatsApp voice notes inside one cohesive experience.</li>
<li><strong>Zero Subscriptions, Zero Third-Party Clouds</strong>: Most online Advent calendar tools charge fees, plaster watermarks over your memories, restrict file types, or delete your calendar after January. With this project, you own 100% of the code and media inside your own Git repository.</li>
<li><strong>Update Day-by-Day Without Stress</strong>: Because content is loaded dynamically from per-day folders, you don't even need all 24 days finished on November 30—you can commit and push new surprises throughout December, and the built-in fallback safely covers any day still in progress.</li>
</ul>

<h2>🛠️ How It Works</h2>
<ol>
<li><strong>Time Check</strong>: When the recipient opens the app, it retrieves the verified current date (adjusted to the browser's timezone) and compares it against the calendar month (e.g., December). On December 5, doors <strong>1 through 5</strong> are unlockable while doors <strong>6 through 24</strong> remain playfully locked.</li>
<li><strong>Persistent State</strong>: Clicking an unlockable door triggers the 3D swing-open animation and saves the opening year in browser storage. Reloading the app keeps previously opened doors visibly open for the rest of the year—and resets them automatically next December.</li>
<li><strong>Dynamic Folder Discovery (Jekyll)</strong>: Static front-end sites cannot browse server directories directly for security reasons. By leveraging <strong>Jekyll</strong> (built natively into GitHub Pages) or a lightweight static manifest, the app reads the exact files present inside each day's folder automatically on every deploy.</li>
<li><strong>Rich Media &amp; Notes</strong>: Clicking an open door launches the responsive viewer, rendering the day's multimedia file(s) along with the optional <code>Readme.md</code> note accessible through the <strong>Comment</strong> button.</li>
</ol>

<h2>📂 Content Structure &amp; Uploading Surprises</h2>
<p>Every door corresponds directly to a numbered folder inside your repository. Simply drop your media file(s) and an optional <code>Readme.md</code> into the matching day folder:</p>

```text
Evergreen_advent_calendar/
├── index.html
├── config.json                # Global settings (title, allowDownload, language, etc.)
├── manifest.webmanifest       # PWA metadata & icons
├── sw.js                      # Service Worker for PWA installability & caching
├── _config.yml                # Jekyll configuration (keeps Readme.md raw & indexed)
├── css/
├── js/
└── days/                      # Folder containing daily surprises (01 to 24/25)
    ├── 01/
    │   ├── surprise_photo.jpg
    │   └── Readme.md          # Optional personal comment rendered in Markdown
    ├── 02/
    │   ├── voice_note.opus    # WhatsApp audio supported!
    │   └── Readme.md
    ├── 03/
    │   ├── love_letter.pdf
    │   └── Readme.md
    └── ...
```

<a href="https://github.com/R0mb0/Crafted_with_AI">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://github.com/R0mb0/Crafted_with_AI/blob/main/Badge/SVG/CraftedWithAIDark.svg">
<source media="(prefers-color-scheme: light)" srcset="https://github.com/R0mb0/Crafted_with_AI/blob/main/Badge/SVG/NotMadeByAILight.svg">
<img alt="Crafted with AI" src="https://github.com/R0mb0/Crafted_with_AI/blob/main/Badge/SVG/NotMadeByAIDefault.svg">
</picture>
</a>
