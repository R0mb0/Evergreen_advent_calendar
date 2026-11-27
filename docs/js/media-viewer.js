window.AdventMediaViewer = (() => {
  'use strict';

  const I18n = window.AdventI18n;

  const Libs = window.AdventLibs;

  const EXT_MAP = {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg', 'bmp'],
    video: ['mp4', 'webm', 'mov', 'm4v', 'ogv'],
    audio: ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'opus', 'weba'],
    pdf: ['pdf'],
    docx: ['docx'],
    rtf: ['rtf'],
    text: ['txt', 'log', 'csv'],
    markdown: ['md', 'markdown']
  };

  // File names probed automatically if the day is not listed in days/manifest.json
  const AUTO_PROBE_FILES = [
    'content.jpg', 'content.jpeg', 'content.png', 'content.webp', 'content.gif',
    'content.mp4', 'content.webm',
    'content.opus', 'content.mp3', 'content.ogg', 'content.m4a', 'content.wav',
    'content.pdf', 'content.docx', 'content.rtf', 'content.txt'
  ];

  const UI_STRINGS = {
    it: {
      loading: 'Caricamento della sorpresa...',
      emptyTitle: 'Ancora nessuna sorpresa qui',
      emptyDesc: 'Aggiungi uno o più file nella cartella {folder}: il calendario li trova da solo.',
      errorTitle: 'Impossibile aprire il file',
      errorDesc: 'Controlla che il file {file} sia presente nella cartella {folder}.',
      unsupportedTitle: 'Anteprima non disponibile',
      unsupportedDesc: 'Il formato del file {file} non supporta la visualizzazione diretta.',
      backToMedia: 'Torna alla sorpresa',
      noComment: 'Nessun commento per oggi',
      commentHeading: 'Nota del giorno',
      audioVoiceNote: 'Messaggio vocale',
      audioTrack: 'Traccia audio',
      audioDecoding: 'Decodifica audio Opus in corso...',
      audioError: 'Formato audio non supportato da questo browser.',
      pdfPage: 'Pagina {current} di {total}',
      pdfLoading: 'Preparazione pagine PDF...',
      pdfMissingLib: 'Libreria PDF.js non caricata. Verifica la connessione.',
      docxMissingLib: 'Libreria Mammoth.js non caricata.',
      downloadStarted: 'Download avviato: {file}'
    },
    en: {
      loading: 'Loading surprise...',
      emptyTitle: 'No surprise added yet',
      emptyDesc: 'Add one or more files inside {folder}: the calendar picks them up automatically.',
      errorTitle: 'Unable to load file',
      errorDesc: 'Please check that {file} exists inside {folder}.',
      unsupportedTitle: 'Preview unavailable',
      unsupportedDesc: 'Direct preview is not available for {file}.',
      backToMedia: 'Back to surprise',
      noComment: 'No note for today',
      commentHeading: 'Daily Note',
      audioVoiceNote: 'Voice note',
      audioTrack: 'Audio track',
      audioDecoding: 'Decoding Opus audio...',
      audioError: 'This audio format is not supported by your browser.',
      pdfPage: 'Page {current} of {total}',
      pdfLoading: 'Rendering PDF pages...',
      pdfMissingLib: 'PDF.js library not loaded.',
      docxMissingLib: 'Mammoth.js library not loaded.',
      downloadStarted: 'Download started: {file}'
    },
    fr: {
      loading: 'Chargement de la surprise...',
      emptyTitle: 'Aucune surprise pour le moment',
      emptyDesc: 'Ajoutez vos fichiers dans {folder} : le calendrier les détecte automatiquement.',
      errorTitle: 'Impossible d’ouvrir le fichier',
      errorDesc: 'Vérifiez que {file} se trouve bien dans {folder}.',
      unsupportedTitle: 'Aperçu indisponible',
      unsupportedDesc: 'Le format de {file} ne peut pas être affiché directement.',
      backToMedia: 'Retour à la surprise',
      noComment: 'Aucun message pour ce jour',
      commentHeading: 'Mot du jour',
      audioVoiceNote: 'Message vocal',
      audioTrack: 'Piste audio',
      audioDecoding: 'Décodage audio Opus...',
      audioError: 'Format audio non pris en charge par ce navigateur.',
      pdfPage: 'Page {current} sur {total}',
      pdfLoading: 'Préparation du PDF...',
      pdfMissingLib: 'Bibliothèque PDF.js non chargée.',
      docxMissingLib: 'Bibliothèque Mammoth.js non chargée.',
      downloadStarted: 'Téléchargement lancé : {file}'
    },
    de: {
      loading: 'Überraschung wird geladen...',
      emptyTitle: 'Noch keine Überraschung vorhanden',
      emptyDesc: 'Lege Dateien in {folder} ab: Der Kalender findet sie automatisch.',
      errorTitle: 'Datei konnte nicht geladen werden',
      errorDesc: 'Prüfe, ob {file} im Ordner {folder} liegt.',
      unsupportedTitle: 'Keine Vorschau verfügbar',
      unsupportedDesc: 'Für {file} ist keine direkte Vorschau verfügbar.',
      backToMedia: 'Zurück zur Überraschung',
      noComment: 'Kein Kommentar für heute',
      commentHeading: 'Notiz des Tages',
      audioVoiceNote: 'Sprachnachricht',
      audioTrack: 'Audiodatei',
      audioDecoding: 'Opus-Audio wird dekodiert...',
      audioError: 'Dieses Audioformat wird vom Browser nicht unterstützt.',
      pdfPage: 'Seite {current} von {total}',
      pdfLoading: 'PDF wird vorbereitet...',
      pdfMissingLib: 'PDF.js-Bibliothek nicht geladen.',
      docxMissingLib: 'Mammoth.js-Bibliothek nicht geladen.',
      downloadStarted: 'Download gestartet: {file}'
    },
    es: {
      loading: 'Cargando sorpresa...',
      emptyTitle: 'Aún no hay sorpresa aquí',
      emptyDesc: 'Añade archivos en {folder}: el calendario los detecta automáticamente.',
      errorTitle: 'No se pudo abrir el archivo',
      errorDesc: 'Comprueba que {file} exista dentro de {folder}.',
      unsupportedTitle: 'Vista previa no disponible',
      unsupportedDesc: 'El formato de {file} no admite visualización directa.',
      backToMedia: 'Volver a la sorpresa',
      noComment: 'Sin nota para hoy',
      commentHeading: 'Nota del día',
      audioVoiceNote: 'Nota de voz',
      audioTrack: 'Pista de audio',
      audioDecoding: 'Decodificando audio Opus...',
      audioError: 'Formato de audio no compatible con este navegador.',
      pdfPage: 'Página {current} de {total}',
      pdfLoading: 'Preparando PDF...',
      pdfMissingLib: 'Librería PDF.js no cargada.',
      docxMissingLib: 'Librería Mammoth.js no cargada.',
      downloadStarted: 'Descarga iniciada: {file}'
    },
    pt: {
      loading: 'A carregar surpresa...',
      emptyTitle: 'Ainda sem surpresa aqui',
      emptyDesc: 'Adiciona ficheiros em {folder}: o calendário encontra-os automaticamente.',
      errorTitle: 'Não foi possível abrir o ficheiro',
      errorDesc: 'Verifica se {file} está na pasta {folder}.',
      unsupportedTitle: 'Pré-visualização indisponível',
      unsupportedDesc: 'O formato de {file} não suporta visualização direta.',
      backToMedia: 'Voltar à surpresa',
      noComment: 'Sem mensagem para hoje',
      commentHeading: 'Nota do dia',
      audioVoiceNote: 'Mensagem de voz',
      audioTrack: 'Faixa de áudio',
      audioDecoding: 'A descodificar áudio Opus...',
      audioError: 'Formato de áudio não suportado neste navegador.',
      pdfPage: 'Página {current} de {total}',
      pdfLoading: 'A preparar PDF...',
      pdfMissingLib: 'Biblioteca PDF.js não carregada.',
      docxMissingLib: 'Biblioteca Mammoth.js não carregada.',
      downloadStarted: 'Transferência iniciada: {file}'
    },
    nl: {
      loading: 'Verrassing laden...',
      emptyTitle: 'Nog geen verrassing toegevoegd',
      emptyDesc: 'Plaats bestanden in {folder}: de kalender vindt ze automatisch.',
      errorTitle: 'Bestand kan niet worden geopend',
      errorDesc: 'Controleer of {file} aanwezig is in {folder}.',
      unsupportedTitle: 'Voorbeeld niet beschikbaar',
      unsupportedDesc: 'Directe weergave is niet beschikbaar voor {file}.',
      backToMedia: 'Terug naar verrassing',
      noComment: 'Geen bericht voor vandaag',
      commentHeading: 'Bericht van de dag',
      audioVoiceNote: 'Spraakbericht',
      audioTrack: 'Audiobestand',
      audioDecoding: 'Opus-audio decoderen...',
      audioError: 'Dit audioformaat wordt niet ondersteund door deze browser.',
      pdfPage: 'Pagina {current} van {total}',
      pdfLoading: 'PDF voorbereiden...',
      pdfMissingLib: 'PDF.js-bibliotheek niet geladen.',
      docxMissingLib: 'Mammoth.js-bibliotheek niet geladen.',
      downloadStarted: 'Download gestart: {file}'
    },
    pl: {
      loading: 'Ładowanie niespodzianki...',
      emptyTitle: 'Brak niespodzianki na ten dzień',
      emptyDesc: 'Dodaj pliki do folderu {folder}: kalendarz znajdzie je automatycznie.',
      errorTitle: 'Nie udało się otworzyć pliku',
      errorDesc: 'Sprawdź, czy plik {file} znajduje się w {folder}.',
      unsupportedTitle: 'Podgląd niedostępny',
      unsupportedDesc: 'Format pliku {file} nie obsługuje bezpośredniego podglądu.',
      backToMedia: 'Wróć do niespodzianki',
      noComment: 'Brak wiadomości na dziś',
      commentHeading: 'Wiadomość dnia',
      audioVoiceNote: 'Wiadomość głosowa',
      audioTrack: 'Ścieżka dźwiękowa',
      audioDecoding: 'Dekodowanie dźwięku Opus...',
      audioError: 'Ten format audio nie jest obsługiwany przez przeglądarkę.',
      pdfPage: 'Strona {current} z {total}',
      pdfLoading: 'Przygotowywanie PDF...',
      pdfMissingLib: 'Biblioteka PDF.js nie została załadowana.',
      docxMissingLib: 'Biblioteka Mammoth.js nie została załadowana.',
      downloadStarted: 'Rozpoczęto pobieranie: {file}'
    }
  };

  let manifestCache = undefined; // undefined = not loaded yet, null = missing
  let activeObjectUrls = [];
  let activeMediaElements = [];
  let currentRenderId = 0;

  const session = {
    day: null,
    padded: '01',
    allowDownload: false,
    files: [],
    readmeUrl: null,
    activeFileIndex: 0,
    showingComment: false,
    container: null,
    tabsContainer: null,
    onStateChange: null
  };

  function tr(key, vars = {}) {
    const lang = I18n ? I18n.getLanguage() : 'it';
    const dict = UI_STRINGS[lang] || UI_STRINGS.en;
    let text = dict[key] ?? UI_STRINGS.en[key] ?? key;
    for (const [k, v] of Object.entries(vars)) {
      text = text.replaceAll(`{${k}}`, String(v));
    }
    return text;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function getExt(filename) {
    const clean = String(filename).split('?')[0].split('#')[0];
    const parts = clean.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
  }

  function detectType(filename) {
    const ext = getExt(filename);
    for (const [type, list] of Object.entries(EXT_MAP)) {
      if (list.includes(ext)) return type;
    }
    return 'unknown';
  }

  function isReadmeName(name) {
    return /^readme\.md$/i.test(String(name).trim());
  }

  function getFileIcon(type) {
    switch (type) {
      case 'image': return 'image';
      case 'video': return 'film';
      case 'audio': return 'mic';
      case 'pdf': return 'file-text';
      case 'docx':
      case 'rtf':
      case 'text': return 'file-type';
      case 'markdown': return 'book-open';
      default: return 'file';
    }
  }

  // "version" is a short hash of the day's content (from days/manifest.json). Putting it in
  // the URL lets the service worker keep files offline and still pick up replaced files.
  function buildDayUrl(padded, filename, version = '') {
    if (/^https?:\/\//i.test(filename) || filename.startsWith('./') || filename.startsWith('/')) {
      return filename;
    }
    const query = version ? `?v=${encodeURIComponent(version)}` : '';
    return `./days/${padded}/${encodeURIComponent(filename)}${query}`;
  }

  function registerObjectUrl(url) {
    activeObjectUrls.push(url);
    return url;
  }

  function registerMediaEl(el) {
    activeMediaElements.push(el);
    return el;
  }

  function cleanupMedia() {
    currentRenderId++;
    for (const el of activeMediaElements) {
      try {
        el.pause();
        el.removeAttribute('src');
        el.load();
      } catch {
        // Ignore
      }
    }
    activeMediaElements = [];

    for (const url of activeObjectUrls) {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // Ignore
      }
    }
    activeObjectUrls = [];
  }

  /* =========================================================
     DAY CONTENT DISCOVERY (manifest.json + auto-probe)
     ========================================================= */

  async function loadRootManifest() {
    if (manifestCache !== undefined) return manifestCache;
    if (window.location.protocol === 'file:') {
      manifestCache = null;
      return null;
    }

    try {
      const res = await fetch('./days/manifest.json', { cache: 'no-store' });
      if (!res.ok) {
        manifestCache = null;
        return null;
      }
      manifestCache = await res.json();
      return manifestCache;
    } catch {
      manifestCache = null;
      return null;
    }
  }

  async function urlExists(url) {
    if (window.location.protocol === 'file:') return false;
    try {
      const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
      return res.ok;
    } catch {
      return false;
    }
  }

  async function resolveDayAssets(day) {
    const padded = String(day).padStart(2, '0');
    const rootManifest = await loadRootManifest();
    const daysMap = rootManifest?.days || rootManifest || null;
    let entry = daysMap ? (daysMap[padded] ?? daysMap[String(day)] ?? null) : null;

    // Attempt B: dedicated manifest inside /days/XX/manifest.json
    // (only if the global manifest is unavailable: when present, it is the source of truth)
    if (!entry && !daysMap && window.location.protocol !== 'file:') {
      try {
        const res = await fetch(`./days/${padded}/manifest.json`, { cache: 'no-store' });
        if (res.ok) entry = await res.json();
      } catch {
        // Ignore
      }
    }

    const rawFiles = [];
    let readmeName = null;
    const version = entry && typeof entry === 'object' && !Array.isArray(entry) ? entry.v || '' : '';

    if (typeof entry === 'string') {
      if (isReadmeName(entry)) readmeName = entry;
      else rawFiles.push(entry);
    } else if (Array.isArray(entry)) {
      for (const item of entry) {
        if (isReadmeName(item)) readmeName = item;
        else rawFiles.push(item);
      }
    } else if (entry && typeof entry === 'object') {
      const list = Array.isArray(entry.files)
        ? entry.files
        : entry.file
          ? [entry.file]
          : [];
      for (const item of list) {
        if (isReadmeName(item)) readmeName = item;
        else rawFiles.push(item);
      }
      if (entry.readme) readmeName = entry.readme;
    }

    // Attempt C: auto-detection of standard file names, only if the global manifest is missing
    // (e.g. local development without having generated it). With a manifest, a missing day is empty.
    if (!entry && !daysMap) {
      const probePromises = AUTO_PROBE_FILES.map(async (name) => {
        const url = buildDayUrl(padded, name);
        return (await urlExists(url)) ? name : null;
      });
      const readmeProbe = Promise.all([
        urlExists(buildDayUrl(padded, 'Readme.md')).then((ok) => (ok ? 'Readme.md' : null)),
        urlExists(buildDayUrl(padded, 'readme.md')).then((ok) => (ok ? 'readme.md' : null))
      ]);

      const [foundFiles, foundReadmes] = await Promise.all([
        Promise.all(probePromises),
        readmeProbe
      ]);

      for (const f of foundFiles) {
        if (f) rawFiles.push(f);
      }
      readmeName = foundReadmes.find(Boolean) || null;
    }

    const files = rawFiles.map((name) => ({
      name,
      url: buildDayUrl(padded, name, version),
      type: detectType(name),
      ext: getExt(name)
    }));

    return {
      padded,
      files,
      readmeUrl: readmeName ? buildDayUrl(padded, readmeName, version) : null
    };
  }

  /**
   * URLs of the daily files that should be kept offline.
   * urls: files of days <= maxDay. keep: every file in the manifest (used to prune old versions).
   */
  async function getOfflineUrls(maxDay) {
    const rootManifest = await loadRootManifest();
    const daysMap = rootManifest?.days || null;
    const urls = [];
    const keep = [];
    if (!daysMap) return { urls, keep };

    for (const [padded, entry] of Object.entries(daysMap)) {
      const names = [...(Array.isArray(entry.files) ? entry.files : [])];
      if (entry.readme) names.push(entry.readme);

      for (const name of names) {
        const absolute = new URL(buildDayUrl(padded, name, entry.v || ''), window.location.href).href;
        keep.push(absolute);
        if (Number(padded) <= maxDay) urls.push(absolute);
      }
    }
    return { urls, keep };
  }

  /* =========================================================
     PUBLIC API
     ========================================================= */

  async function loadDay({ day, container, tabsContainer, allowDownload, onStateChange }) {
    cleanupMedia();

    session.day = day;
    session.padded = String(day).padStart(2, '0');
    session.allowDownload = Boolean(allowDownload);
    session.container = container;
    session.tabsContainer = tabsContainer;
    session.onStateChange = onStateChange;
    session.files = [];
    session.readmeUrl = null;
    session.activeFileIndex = 0;
    session.showingComment = false;

    applyProtectionAttributes(container, !session.allowDownload);
    tabsContainer.hidden = true;
    tabsContainer.innerHTML = '';

    renderLoading(container);
    notifyState();

    const renderId = ++currentRenderId;
    const assets = await resolveDayAssets(day);
    if (renderId !== currentRenderId) return;

    session.files = assets.files;
    session.readmeUrl = assets.readmeUrl;

    // If there are no media files but a Readme.md exists, show it directly
    if (session.files.length === 0 && session.readmeUrl) {
      session.showingComment = true;
      renderTabs();
      await renderMarkdownView(session.readmeUrl, true);
      notifyState();
      return;
    }

    // If the folder is completely empty -> friendly fallback screen
    if (session.files.length === 0) {
      renderEmptyFallback(container, `/days/${session.padded}/`);
      notifyState();
      return;
    }

    renderTabs();
    await renderActiveFile();
    notifyState();
  }

  async function toggleCommentView() {
    if (!session.readmeUrl) return;
    // If the day has ONLY the Readme.md, stay on the Readme view
    if (session.files.length === 0) return;

    session.showingComment = !session.showingComment;
    cleanupMedia();

    if (session.showingComment) {
      if (session.tabsContainer) session.tabsContainer.hidden = true;
      await renderMarkdownView(session.readmeUrl, false);
    } else {
      renderTabs();
      await renderActiveFile();
    }
    notifyState();
  }

  async function refreshLanguage() {
    if (!session.container || session.day === null) return;
    if (session.showingComment && session.readmeUrl) {
      await renderMarkdownView(session.readmeUrl, session.files.length === 0);
    } else if (session.files.length === 0) {
      renderEmptyFallback(session.container, `/days/${session.padded}/`);
    } else {
      renderTabs();
      await renderActiveFile();
    }
    notifyState();
  }

  function downloadCurrentFile() {
    if (!session.allowDownload) return null;
    const file = getCurrentFile();
    if (!file) return null;

    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();

    return tr('downloadStarted', { file: file.name });
  }

  function getCurrentFile() {
    if (session.showingComment) {
      return session.readmeUrl
        ? { name: 'Readme.md', url: session.readmeUrl, type: 'markdown' }
        : null;
    }
    return session.files[session.activeFileIndex] || null;
  }

  function notifyState() {
    if (typeof session.onStateChange !== 'function') return;
    const hasComment = Boolean(session.readmeUrl);
    const hasMedia = session.files.length > 0;
    const currentFile = getCurrentFile();

    session.onStateChange({
      hasComment,
      hasMedia,
      showingComment: session.showingComment,
      canToggleComment: hasComment && hasMedia,
      commentButtonLabel: session.showingComment && hasMedia
        ? tr('backToMedia')
        : (I18n ? I18n.t('btnComment') : 'Commento'),
      noCommentTooltip: tr('noComment'),
      canDownload: session.allowDownload && Boolean(currentFile)
    });
  }

  /* =========================================================
     ANTI-DOWNLOAD PROTECTION
     ========================================================= */

  function applyProtectionAttributes(container, isProtected) {
    container.dataset.protected = isProtected ? 'true' : 'false';

    if (!container._protectionBound) {
      container.addEventListener('contextmenu', (e) => {
        if (container.dataset.protected === 'true') e.preventDefault();
      });
      container.addEventListener('dragstart', (e) => {
        if (container.dataset.protected === 'true') e.preventDefault();
      });
      container._protectionBound = true;
    }
  }

  /* =========================================================
     TABS FOR MULTI-FILE DAYS
     ========================================================= */

  function renderTabs() {
    const bar = session.tabsContainer;
    if (!bar) return;

    if (session.files.length <= 1 || session.showingComment) {
      bar.hidden = true;
      bar.innerHTML = '';
      return;
    }

    bar.hidden = false;
    bar.innerHTML = '';

    session.files.forEach((file, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'media-tab';
      if (index === session.activeFileIndex) btn.classList.add('is-active');

      const shortName = file.name.replace(/\.[^.]+$/, '');
      btn.innerHTML = `
        <i data-lucide="${getFileIcon(file.type)}"></i>
        <span>${escapeHtml(shortName)}</span>
      `;

      btn.addEventListener('click', async () => {
        if (session.activeFileIndex === index) return;
        session.activeFileIndex = index;
        renderTabs();
        await renderActiveFile();
        notifyState();
      });

      bar.appendChild(btn);
    });

    refreshIcons();
  }

  /* =========================================================
     RENDERING DISPATCHER BY FILE TYPE
     ========================================================= */

  async function renderActiveFile() {
    cleanupMedia();
    const renderId = ++currentRenderId;
    const file = session.files[session.activeFileIndex];
    const container = session.container;

    if (!file) {
      renderEmptyFallback(container, `/days/${session.padded}/`);
      return;
    }

    renderLoading(container);

    try {
      switch (file.type) {
        case 'image':
          await renderImage(container, file, renderId);
          break;
        case 'video':
          renderVideo(container, file);
          break;
        case 'audio':
          await renderAudio(container, file, renderId);
          break;
        case 'pdf':
          await renderPdf(container, file, renderId);
          break;
        case 'docx':
          await renderDocx(container, file, renderId);
          break;
        case 'rtf':
          await renderRtf(container, file, renderId);
          break;
        case 'text':
          await renderText(container, file, renderId);
          break;
        case 'markdown':
          await renderMarkdownView(file.url, true);
          break;
        default:
          renderUnsupportedFallback(container, file);
      }
    } catch (err) {
      if (renderId !== currentRenderId) return;
      console.error('[MediaViewer]', err);
      renderErrorFallback(container, file.name, `/days/${session.padded}/`);
    }

    refreshIcons();
  }

  /* ---------- 1. IMAGES ---------- */
  function renderImage(container, file, renderId) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.className = 'media-image';
      img.alt = file.name;
      img.draggable = !session.allowDownload ? false : true;
      img.decoding = 'async';

      img.onload = () => {
        if (renderId !== currentRenderId) return resolve();
        container.innerHTML = '';
        const wrap = document.createElement('div');
        wrap.className = 'media-visual-frame';
        wrap.appendChild(img);
        container.appendChild(wrap);
        resolve();
      };

      img.onerror = () => reject(new Error('Image load failed'));
      img.src = file.url;
    });
  }

  /* ---------- 2. VIDEO ---------- */
  function renderVideo(container, file) {
    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'media-visual-frame';

    const video = registerMediaEl(document.createElement('video'));
    video.className = 'media-video';
    video.src = file.url;
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';

    if (!session.allowDownload) {
      video.setAttribute('controlsList', 'nodownload noplaybackrate');
      video.disablePictureInPicture = true;
    }

    video.addEventListener('error', () => {
      renderErrorFallback(container, file.name, `/days/${session.padded}/`);
      refreshIcons();
    });

    wrap.appendChild(video);
    container.appendChild(wrap);
  }

  /* ---------- 3. AUDIO (WITH SUPPORT FOR WHATSAPP .OPUS VOICE NOTES) ---------- */
  async function renderAudio(container, file, renderId) {
    const isOpus = file.ext === 'opus';
    const label = isOpus ? tr('audioVoiceNote') : tr('audioTrack');
    const cleanTitle = file.name.replace(/\.[^.]+$/, '');

    container.innerHTML = `
      <div class="audio-card">
        <div class="audio-visual">
          <div class="audio-badge-icon"><i data-lucide="${isOpus ? 'mic' : 'music'}"></i></div>
          <div class="audio-wave" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
        <div class="audio-meta">
          <span class="audio-kind">${escapeHtml(label)}</span>
          <h3 class="audio-title">${escapeHtml(cleanTitle)}</h3>
        </div>
        <div class="audio-controls">
          <button type="button" class="audio-play-btn" aria-label="Play / Pausa">
            <i data-lucide="play"></i>
          </button>
          <div class="audio-progress-wrap">
            <input type="range" class="audio-seek" min="0" max="100" value="0" step="0.1" />
            <div class="audio-times">
              <span class="audio-current">0:00</span>
              <span class="audio-duration">0:00</span>
            </div>
          </div>
          <button type="button" class="icon-btn icon-btn--ghost audio-mute-btn" aria-label="Audio">
            <i data-lucide="volume-2"></i>
          </button>
        </div>
        <p class="audio-status" hidden></p>
      </div>
    `;
    refreshIcons();

    const card = container.querySelector('.audio-card');
    const playBtn = card.querySelector('.audio-play-btn');
    const seek = card.querySelector('.audio-seek');
    const curEl = card.querySelector('.audio-current');
    const durEl = card.querySelector('.audio-duration');
    const muteBtn = card.querySelector('.audio-mute-btn');
    const statusEl = card.querySelector('.audio-status');

    const audio = registerMediaEl(new Audio());
    audio.preload = 'metadata';

    // Source loading: for .opus we force the correct MIME type and use the WASM fallback if needed (Safari/iOS)
    if (isOpus) {
      const res = await fetch(file.url);
      if (!res.ok) throw new Error('Audio fetch failed');
      const arrayBuffer = await res.arrayBuffer();
      if (renderId !== currentRenderId) return;

      const canPlayNativeOpus = Boolean(audio.canPlayType('audio/ogg; codecs="opus"'));
      if (canPlayNativeOpus) {
        const blobUrl = registerObjectUrl(
          URL.createObjectURL(new Blob([arrayBuffer], { type: 'audio/ogg; codecs=opus' }))
        );
        audio.src = blobUrl;
      } else {
        // WASM fallback for Safari/iOS
        statusEl.hidden = false;
        statusEl.textContent = tr('audioDecoding');
        const wavUrl = await decodeOpusToWavUrl(arrayBuffer);
        if (renderId !== currentRenderId) return;

        if (wavUrl) {
          audio.src = registerObjectUrl(wavUrl);
          statusEl.hidden = true;
        } else {
          // Last direct attempt
          audio.src = file.url;
          statusEl.textContent = tr('audioError');
        }
      }
    } else {
      audio.src = file.url;
    }

    const setPlayIcon = (playing) => {
      card.classList.toggle('is-playing', playing);
      playBtn.innerHTML = `<i data-lucide="${playing ? 'pause' : 'play'}"></i>`;
      refreshIcons();
    };

    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().catch(() => {
          statusEl.hidden = false;
          statusEl.textContent = tr('audioError');
        });
      } else {
        audio.pause();
      }
    });

    muteBtn.addEventListener('click', () => {
      audio.muted = !audio.muted;
      muteBtn.innerHTML = `<i data-lucide="${audio.muted ? 'volume-x' : 'volume-2'}"></i>`;
      refreshIcons();
    });

    audio.addEventListener('play', () => setPlayIcon(true));
    audio.addEventListener('pause', () => setPlayIcon(false));
    audio.addEventListener('ended', () => {
      setPlayIcon(false);
      seek.value = '0';
      curEl.textContent = '0:00';
    });

    audio.addEventListener('loadedmetadata', () => {
      if (Number.isFinite(audio.duration)) {
        durEl.textContent = formatDuration(audio.duration);
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      seek.value = String((audio.currentTime / audio.duration) * 100);
      curEl.textContent = formatDuration(audio.currentTime);
    });

    seek.addEventListener('input', () => {
      if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
      audio.currentTime = (Number(seek.value) / 100) * audio.duration;
    });
  }

  async function decodeOpusToWavUrl(arrayBuffer) {
    try {
      await Libs.load('opus');
      const lib = window['ogg-opus-decoder'];
      if (!lib || !lib.OggOpusDecoder) return null;

      const decoder = new lib.OggOpusDecoder();
      await decoder.ready;
      const decoded = await decoder.decodeFile(new Uint8Array(arrayBuffer));
      decoder.free();

      const wavBlob = pcmToWavBlob(decoded.channelData, decoded.sampleRate || 48000);
      return URL.createObjectURL(wavBlob);
    } catch {
      return null;
    }
  }

  function pcmToWavBlob(channelData, sampleRate) {
    const numChannels = channelData.length;
    const length = channelData[0].length;
    const buffer = new ArrayBuffer(44 + length * numChannels * 2);
    const view = new DataView(buffer);

    const writeStr = (offset, str) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + length * numChannels * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, length * numChannels * 2, true);

    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        const sample = Math.max(-1, Math.min(1, channelData[ch][i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }

    return new Blob([buffer], { type: 'audio/wav' });
  }

  function formatDuration(sec) {
    const total = Math.max(0, Math.floor(sec));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  /* ---------- 4. PDF ON CANVAS (PDF.js) ---------- */
  async function renderPdf(container, file, renderId) {
    await Libs.load('pdf');
    if (renderId !== currentRenderId) return;
    if (!window.pdfjsLib) {
      renderCustomMessage(container, 'file-warning', tr('errorTitle'), tr('pdfMissingLib'));
      return;
    }

    window.pdfjsLib.GlobalWorkerOptions.workerSrc = Libs.pdfWorkerUrl();
    renderLoading(container, tr('pdfLoading'));

    const res = await fetch(file.url);
    if (!res.ok) throw new Error('PDF fetch failed');
    const data = await res.arrayBuffer();
    if (renderId !== currentRenderId) return;

    const pdfDoc = await window.pdfjsLib.getDocument({ data }).promise;
    if (renderId !== currentRenderId) return;

    let currentPage = 1;
    let zoom = 1;
    let pageRenderTask = null;

    container.innerHTML = `
      <div class="pdf-viewer">
        <div class="pdf-toolbar">
          <div class="pdf-nav">
            <button type="button" class="mini-btn pdf-prev" aria-label="Pagina precedente">
              <i data-lucide="chevron-left"></i>
            </button>
            <span class="pdf-page-label"></span>
            <button type="button" class="mini-btn pdf-next" aria-label="Pagina successiva">
              <i data-lucide="chevron-right"></i>
            </button>
          </div>
          <div class="pdf-zoom">
            <button type="button" class="mini-btn pdf-zoom-out" aria-label="Riduci">
              <i data-lucide="zoom-out"></i>
            </button>
            <span class="pdf-zoom-val">100%</span>
            <button type="button" class="mini-btn pdf-zoom-in" aria-label="Ingrandisci">
              <i data-lucide="zoom-in"></i>
            </button>
          </div>
        </div>
        <div class="pdf-canvas-stage">
          <canvas class="pdf-canvas"></canvas>
        </div>
      </div>
    `;
    refreshIcons();

    const canvas = container.querySelector('.pdf-canvas');
    const ctx = canvas.getContext('2d');
    const stage = container.querySelector('.pdf-canvas-stage');
    const pageLabel = container.querySelector('.pdf-page-label');
    const zoomLabel = container.querySelector('.pdf-zoom-val');
    const btnPrev = container.querySelector('.pdf-prev');
    const btnNext = container.querySelector('.pdf-next');
    const btnZoomOut = container.querySelector('.pdf-zoom-out');
    const btnZoomIn = container.querySelector('.pdf-zoom-in');

    async function drawPage() {
      if (renderId !== currentRenderId) return;
      if (pageRenderTask) {
        try { pageRenderTask.cancel(); } catch { /* ignore */ }
      }

      const page = await pdfDoc.getPage(currentPage);
      const baseViewport = page.getViewport({ scale: 1 });
      const availableWidth = Math.max(260, stage.clientWidth - 24);
      const fitScale = Math.min(1.6, availableWidth / baseViewport.width);
      const scale = fitScale * zoom;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = page.getViewport({ scale: scale * dpr });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
      canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

      pageLabel.textContent = tr('pdfPage', { current: currentPage, total: pdfDoc.numPages });
      zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
      btnPrev.disabled = currentPage <= 1;
      btnNext.disabled = currentPage >= pdfDoc.numPages;

      pageRenderTask = page.render({ canvasContext: ctx, viewport });
      try {
        await pageRenderTask.promise;
      } catch (e) {
        if (e?.name !== 'RenderingCancelledException') throw e;
      }
    }

    btnPrev.addEventListener('click', () => {
      if (currentPage > 1) { currentPage--; drawPage(); }
    });
    btnNext.addEventListener('click', () => {
      if (currentPage < pdfDoc.numPages) { currentPage++; drawPage(); }
    });
    btnZoomIn.addEventListener('click', () => {
      zoom = Math.min(2.2, Number((zoom + 0.2).toFixed(2)));
      drawPage();
    });
    btnZoomOut.addEventListener('click', () => {
      zoom = Math.max(0.6, Number((zoom - 0.2).toFixed(2)));
      drawPage();
    });

    await drawPage();
  }

  /* ---------- 5. WORD (.docx via Mammoth.js) ---------- */
  async function renderDocx(container, file, renderId) {
    await Libs.loadMany(['mammoth', 'purify']);
    if (renderId !== currentRenderId) return;
    if (!window.mammoth) {
      renderCustomMessage(container, 'file-warning', tr('errorTitle'), tr('docxMissingLib'));
      return;
    }

    const res = await fetch(file.url);
    if (!res.ok) throw new Error('DOCX fetch failed');
    const arrayBuffer = await res.arrayBuffer();
    if (renderId !== currentRenderId) return;

    const result = await window.mammoth.convertToHtml({ arrayBuffer });
    const safeHtml = sanitizeHtml(result.value);

    container.innerHTML = `<article class="doc-sheet">${safeHtml}</article>`;
  }

  /* ---------- 6. RTF (.rtf, pure JS parser) ---------- */
  async function renderRtf(container, file, renderId) {
    await Libs.load('purify');
    const res = await fetch(file.url);
    if (!res.ok) throw new Error('RTF fetch failed');
    const raw = await res.text();
    if (renderId !== currentRenderId) return;

    const safeHtml = sanitizeHtml(rtfToHtml(raw));
    container.innerHTML = `<article class="doc-sheet">${safeHtml}</article>`;
  }

  function rtfToHtml(rtf) {
    const SKIP_DESTINATIONS = new Set([
      'fonttbl', 'colortbl', 'stylesheet', 'info', 'pict', 'object',
      'header', 'footer', 'headerl', 'headerr', 'headerf', 'footerl', 'footerr', 'footerf',
      'listtable', 'listoverridetable', 'revtbl', 'rsidtbl', 'mmathPr',
      'generator', 'themedata', 'colorschememapping', 'datastore', 'latentstyles'
    ]);

    const win1252 = new TextDecoder('windows-1252');
    const stack = [{ b: false, i: false, u: false, skip: false }];
    let out = '<p>';
    let idx = 0;
    const len = rtf.length;

    const current = () => stack[stack.length - 1];

    const pushChar = (ch) => {
      const st = current();
      if (st.skip) return;
      let html = escapeHtml(ch);
      if (st.u) html = `<u>${html}</u>`;
      if (st.i) html = `<em>${html}</em>`;
      if (st.b) html = `<strong>${html}</strong>`;
      out += html;
    };

    while (idx < len) {
      const ch = rtf[idx];

      if (ch === '{') {
        const parent = current();
        stack.push({ ...parent });
        idx++;
        continue;
      }

      if (ch === '}') {
        if (stack.length > 1) stack.pop();
        idx++;
        continue;
      }

      if (ch === '\r' || ch === '\n') {
        idx++;
        continue;
      }

      if (ch === '\\') {
        idx++;
        if (idx >= len) break;
        const next = rtf[idx];

        if (next === '\\' || next === '{' || next === '}') {
          pushChar(next);
          idx++;
          continue;
        }
        if (next === '*') {
          current().skip = true;
          idx++;
          continue;
        }
        if (next === '~') {
          pushChar('\u00A0');
          idx++;
          continue;
        }
        if (next === "'") {
          const hex = rtf.slice(idx + 1, idx + 3);
          const byte = parseInt(hex, 16);
          if (!Number.isNaN(byte)) {
            pushChar(win1252.decode(new Uint8Array([byte])));
          }
          idx += 3;
          continue;
        }

        // Control word
        const match = /^[a-zA-Z]+(-?\d+)? ?/.exec(rtf.slice(idx));
        if (match) {
          const full = match[0];
          const word = full.match(/^[a-zA-Z]+/)[0];
          const param = match[1] !== undefined ? Number(match[1]) : null;
          idx += full.length;

          if (SKIP_DESTINATIONS.has(word)) {
            current().skip = true;
            continue;
          }
          if (current().skip) continue;

          if (word === 'par') {
            out += '</p><p>';
          } else if (word === 'line') {
            out += '<br />';
          } else if (word === 'tab') {
            out += '&emsp;';
          } else if (word === 'b') {
            current().b = param !== 0;
          } else if (word === 'i') {
            current().i = param !== 0;
          } else if (word === 'ul') {
            current().u = param !== 0;
          } else if (word === 'ulnone') {
            current().u = false;
          } else if (word === 'plain') {
            current().b = false;
            current().i = false;
            current().u = false;
          } else if (word === 'u' && param !== null) {
            const codePoint = param < 0 ? param + 65536 : param;
            pushChar(String.fromCharCode(codePoint));
            // Skip the fallback '?' character after \uN
            if (rtf[idx] === '?') idx++;
          }
          continue;
        }

        idx++;
        continue;
      }

      pushChar(ch);
      idx++;
    }

    out += '</p>';
    return out.replaceAll('<p></p>', '');
  }

  /* ---------- 7. PLAIN TEXT (.txt) ---------- */
  async function renderText(container, file, renderId) {
    const res = await fetch(file.url);
    if (!res.ok) throw new Error('Text fetch failed');
    const text = await res.text();
    if (renderId !== currentRenderId) return;

    const sheet = document.createElement('article');
    sheet.className = 'doc-sheet doc-sheet--plain';
    sheet.textContent = text;
    container.innerHTML = '';
    container.appendChild(sheet);
  }

  /* ---------- 8. MARKDOWN (Readme.md) ---------- */
  async function renderMarkdownView(url, isMainContent) {
    const renderId = ++currentRenderId;
    const container = session.container;
    renderLoading(container);

    try {
      await Libs.loadMany(['marked', 'purify']);
      if (renderId !== currentRenderId) return;

      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('Markdown fetch failed');
      const mdText = await res.text();
      if (renderId !== currentRenderId) return;

      const rendered = window.marked
        ? window.marked.parse(mdText, { breaks: true, gfm: true })
        : `<p>${escapeHtml(mdText).replaceAll('\n', '<br />')}</p>`;

      const safeHtml = sanitizeHtml(rendered);
      const badgeHtml = isMainContent
        ? ''
        : `<div class="md-banner"><i data-lucide="message-square-heart"></i><span>${escapeHtml(tr('commentHeading'))}</span></div>`;

      container.innerHTML = `
        <article class="doc-sheet doc-sheet--markdown">
          ${badgeHtml}
          <div class="markdown-body">${safeHtml}</div>
        </article>
      `;

      // Open external links safely in a new tab
      container.querySelectorAll('.markdown-body a').forEach((a) => {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      });

      refreshIcons();
    } catch {
      if (renderId !== currentRenderId) return;
      renderErrorFallback(container, 'Readme.md', `/days/${session.padded}/`);
      refreshIcons();
    }
  }

  /* =========================================================
     STATUS SCREENS & FALLBACKS
     ========================================================= */

  function renderLoading(container, text = tr('loading')) {
    container.innerHTML = `
      <div class="viewer-state">
        <div class="viewer-spinner" aria-hidden="true"></div>
        <p>${escapeHtml(text)}</p>
      </div>
    `;
  }

  function renderEmptyFallback(container, folder) {
    renderCustomMessage(
      container,
      'gift',
      tr('emptyTitle'),
      tr('emptyDesc', { folder })
    );
  }

  function renderErrorFallback(container, file, folder) {
    renderCustomMessage(
      container,
      'file-warning',
      tr('errorTitle'),
      tr('errorDesc', { file, folder })
    );
  }

  function renderUnsupportedFallback(container, file) {
    renderCustomMessage(
      container,
      'file-question',
      tr('unsupportedTitle'),
      tr('unsupportedDesc', { file: file.name })
    );
  }

  function renderCustomMessage(container, icon, title, desc) {
    container.innerHTML = `
      <div class="placeholder-stage">
        <div class="placeholder-icon">
          <i data-lucide="${icon}"></i>
        </div>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(desc)}</p>
      </div>
    `;
    refreshIcons();
  }

  function sanitizeHtml(html) {
    if (window.DOMPurify) {
      return window.DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true }
      });
    }

    // Fail-safe: if the sanitizer could not be loaded, never inject raw HTML.
    // Show the plain text content only.
    const text = new DOMParser().parseFromString(html, 'text/html').body.textContent || '';
    return `<p>${escapeHtml(text).replaceAll('\n', '<br />')}</p>`;
  }

  function refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  return {
    loadDay,
    toggleCommentView,
    refreshLanguage,
    downloadCurrentFile,
    getOfflineUrls,
    cleanup: cleanupMedia
  };
})();