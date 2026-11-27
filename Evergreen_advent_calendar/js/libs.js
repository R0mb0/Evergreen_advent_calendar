/**
 * Third-party library loader.
 *
 * Every library is first requested from the local ./libs/ folder (fully offline,
 * same origin). If the local file is missing, the same pinned version is loaded
 * from a public CDN instead, so the app keeps working even before the libraries
 * have been downloaded (see tools/download_libs.py).
 *
 * Libraries are loaded on demand: e.g. PDF.js is only fetched when a PDF is opened.
 * Keep the versions in sync with tools/download_libs.py and service-worker.js.
 */
window.AdventLibs = (() => {
  'use strict';

  const LIBS = {
    lucide: {
      local: './libs/lucide.min.js',
      cdn: 'https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js',
      ready: () => Boolean(window.lucide)
    },
    confetti: {
      local: './libs/confetti.browser.min.js',
      cdn: 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js',
      ready: () => typeof window.confetti === 'function'
    },
    marked: {
      local: './libs/marked.min.js',
      cdn: 'https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js',
      ready: () => Boolean(window.marked)
    },
    purify: {
      local: './libs/purify.min.js',
      cdn: 'https://cdn.jsdelivr.net/npm/dompurify@3.1.7/dist/purify.min.js',
      ready: () => Boolean(window.DOMPurify)
    },
    mammoth: {
      local: './libs/mammoth.browser.min.js',
      cdn: 'https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js',
      ready: () => Boolean(window.mammoth)
    },
    pdf: {
      local: './libs/pdf.min.js',
      cdn: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
      ready: () => Boolean(window.pdfjsLib),
      worker: {
        local: './libs/pdf.worker.min.js',
        cdn: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      }
    },
    opus: {
      local: './libs/ogg-opus-decoder.min.js',
      cdn: 'https://cdn.jsdelivr.net/npm/ogg-opus-decoder@1.7.0/dist/ogg-opus-decoder.min.js',
      ready: () => Boolean(window['ogg-opus-decoder'])
    }
  };

  const pending = new Map(); // name -> Promise<boolean>
  const sources = {}; // name -> 'local' | 'cdn'

  function injectScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        script.remove();
        resolve(false);
      };
      document.head.appendChild(script);
    });
  }

  async function loadOne(name) {
    const lib = LIBS[name];
    if (!lib) return false;
    if (lib.ready()) return true;

    // 1. Local copy (works offline)
    if ((await injectScript(lib.local)) && lib.ready()) {
      sources[name] = 'local';
      return true;
    }

    // 2. CDN fallback (the file is missing locally or is not a valid script)
    if ((await injectScript(lib.cdn)) && lib.ready()) {
      sources[name] = 'cdn';
      return true;
    }

    return false;
  }

  /** Loads a library once. Resolves to true when it is available. */
  function load(name) {
    if (!pending.has(name)) {
      const promise = loadOne(name);
      pending.set(name, promise);
      // Allow a new attempt later if loading failed (e.g. temporarily offline)
      promise.then((ok) => {
        if (!ok) pending.delete(name);
      });
    }
    return pending.get(name);
  }

  function loadMany(names) {
    return Promise.all(names.map(load));
  }

  /** URL of the PDF.js worker matching the source the library was loaded from. */
  function pdfWorkerUrl() {
    const worker = LIBS.pdf.worker;
    return sources.pdf === 'local' ? worker.local : worker.cdn;
  }

  function sourceOf(name) {
    return sources[name] || null;
  }

  return { load, loadMany, pdfWorkerUrl, sourceOf };
})();
