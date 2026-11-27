window.AdventI18n = (() => {
  'use strict';

  const STORAGE_LANG_KEY = 'advent_user_language_v1';

  const SUPPORTED_LANGUAGES = [
    { code: 'it', label: 'Italiano', short: 'IT', locale: 'it-IT', flag: '🇮🇹' },
    { code: 'en', label: 'English', short: 'EN', locale: 'en-GB', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', short: 'FR', locale: 'fr-FR', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', short: 'DE', locale: 'de-DE', flag: '🇩🇪' },
    { code: 'es', label: 'Español', short: 'ES', locale: 'es-ES', flag: '🇪🇸' },
    { code: 'pt', label: 'Português', short: 'PT', locale: 'pt-PT', flag: '🇵🇹' },
    { code: 'nl', label: 'Nederlands', short: 'NL', locale: 'nl-NL', flag: '🇳🇱' },
    { code: 'pl', label: 'Polski', short: 'PL', locale: 'pl-PL', flag: '🇵🇱' }
  ];

  const TRANSLATIONS = {
    it: {
      defaultTitle: "Calendario dell'Avvento",
      defaultSubtitle: 'Una piccola sorpresa al giorno fino a Natale',
      install: 'Installa',
      snowTooltip: 'Attiva o disattiva neve',
      langTooltip: 'Cambia lingua',
      installTooltip: 'Installa applicazione',
      progress: '{opened} / {total} sorprese scoperte',
      doorLocked: 'Bloccata',
      doorToday: 'Oggi!',
      doorAvailable: 'Apribile',
      doorTapToOpen: 'Tocca per aprire',
      doorUnlockOn: 'Dal {date}',
      doorInsideDay: 'Giorno {day}',
      doorInsideCta: 'Apri sorpresa',
      doorOpenedIn: 'Aperta nel {year}',
      modalBadge: 'Giorno {day}',
      modalTitle: 'Sorpresa del {date}',
      btnComment: 'Commento',
      btnDownload: 'Scarica',
      toastLocked: 'Pazienza! La casella {day} si sblocca il {date}.',
      toastLockedWrongMonth: 'Il calendario si attiva a {month}! Torna a trovarci presto.',
      toastLangChanged: 'Lingua impostata su {lang}',
      toastReset: 'Memoria locale azzerata.',
      toastIter3: 'Lettore Markdown per Readme.md in arrivo nell’Iterazione 3!',
      toastIter4: 'Installazione PWA nativa in arrivo nell’Iterazione 4!',
      offMonthNotice: 'Le sorprese si sbloccano a {month}. Nel frattempo puoi ammirare il calendario!',
      timeSourceServer: 'Ora verificata dal server ({tz})',
      timeSourceLocal: 'Ora locale del dispositivo ({tz})',
      timeSourceDemo: 'Modalità anteprima ({tz})',
      demoTag: 'Anteprima Dev',
      demoYear: 'Anno',
      demoMonth: 'Mese',
      demoDay: 'Giorno',
      demoReset: 'Reset',
      placeholderTitle: "Contenuto pronto per l'Iterazione 3!",
      placeholderDesc: 'Qui verranno visualizzati immagini, video, audio (incluso Opus), PDF, Word, RTF e testi dalla cartella'
    },
    en: {
      defaultTitle: 'Advent Calendar',
      defaultSubtitle: 'A little surprise every day until Christmas',
      install: 'Install',
      snowTooltip: 'Toggle snow',
      langTooltip: 'Change language',
      installTooltip: 'Install app',
      progress: '{opened} / {total} surprises unlocked',
      doorLocked: 'Locked',
      doorToday: 'Today!',
      doorAvailable: 'Ready',
      doorTapToOpen: 'Tap to open',
      doorUnlockOn: 'Opens {date}',
      doorInsideDay: 'Day {day}',
      doorInsideCta: 'View surprise',
      doorOpenedIn: 'Opened in {year}',
      modalBadge: 'Day {day}',
      modalTitle: 'Surprise for {date}',
      btnComment: 'Note',
      btnDownload: 'Download',
      toastLocked: 'Not yet! Door {day} unlocks on {date}.',
      toastLockedWrongMonth: 'This calendar unlocks in {month}! Come back soon.',
      toastLangChanged: 'Language switched to {lang}',
      toastReset: 'Local progress reset.',
      toastIter3: 'Markdown viewer for Readme.md coming in Iteration 3!',
      toastIter4: 'Native PWA installation coming in Iteration 4!',
      offMonthNotice: 'Surprises unlock in {month}. Come back when the season begins!',
      timeSourceServer: 'Server-verified date ({tz})',
      timeSourceLocal: 'Device local date ({tz})',
      timeSourceDemo: 'Preview mode ({tz})',
      demoTag: 'Dev Preview',
      demoYear: 'Year',
      demoMonth: 'Month',
      demoDay: 'Day',
      demoReset: 'Reset',
      placeholderTitle: 'Ready for Iteration 3!',
      placeholderDesc: 'Images, videos, audio (including Opus), PDF, Word, RTF, and text files will render here from'
    },
    fr: {
      defaultTitle: "Calendrier de l'Avent",
      defaultSubtitle: "Une petite surprise chaque jour jusqu'à Noël",
      install: 'Installer',
      snowTooltip: 'Activer ou désactiver la neige',
      langTooltip: 'Changer de langue',
      installTooltip: "Installer l'application",
      progress: '{opened} / {total} surprises découvertes',
      doorLocked: 'Fermée',
      doorToday: "Aujourd'hui !",
      doorAvailable: 'Ouverte',
      doorTapToOpen: 'Toucher pour ouvrir',
      doorUnlockOn: 'Dès le {date}',
      doorInsideDay: 'Jour {day}',
      doorInsideCta: 'Voir la surprise',
      doorOpenedIn: 'Ouverte en {year}',
      modalBadge: 'Jour {day}',
      modalTitle: 'Surprise du {date}',
      btnComment: 'Message',
      btnDownload: 'Télécharger',
      toastLocked: 'Patience ! La case {day} s’ouvre le {date}.',
      toastLockedWrongMonth: 'Le calendrier commence en {month} ! Revenez bientôt.',
      toastLangChanged: 'Langue changée en {lang}',
      toastReset: 'Progression locale réinitialisée.',
      toastIter3: 'Lecteur Markdown pour Readme.md prévu à l’Itération 3 !',
      toastIter4: 'Installation PWA prévue à l’Itération 4 !',
      offMonthNotice: 'Les surprises se débloquent en {month}. Un peu de patience !',
      timeSourceServer: 'Date vérifiée par le serveur ({tz})',
      timeSourceLocal: 'Date locale de l’appareil ({tz})',
      timeSourceDemo: 'Mode aperçu ({tz})',
      demoTag: 'Aperçu Dev',
      demoYear: 'Année',
      demoMonth: 'Mois',
      demoDay: 'Jour',
      demoReset: 'Reset',
      placeholderTitle: "Prêt pour l'Itération 3 !",
      placeholderDesc: 'Images, vidéos, audio (Opus inclus), PDF, Word, RTF et textes s’afficheront ici depuis'
    },
    de: {
      defaultTitle: 'Adventskalender',
      defaultSubtitle: 'Jeden Tag eine kleine Überraschung bis Weihnachten',
      install: 'Installieren',
      snowTooltip: 'Schnee umschalten',
      langTooltip: 'Sprache ändern',
      installTooltip: 'App installieren',
      progress: '{opened} / {total} Überraschungen entdeckt',
      doorLocked: 'Gesperrt',
      doorToday: 'Heute!',
      doorAvailable: 'Bereit',
      doorTapToOpen: 'Zum Öffnen tippen',
      doorUnlockOn: 'Ab {date}',
      doorInsideDay: 'Tag {day}',
      doorInsideCta: 'Überraschung ansehen',
      doorOpenedIn: 'Geöffnet {year}',
      modalBadge: 'Tag {day}',
      modalTitle: 'Überraschung am {date}',
      btnComment: 'Kommentar',
      btnDownload: 'Herunterladen',
      toastLocked: 'Noch etwas Geduld! Türchen {day} öffnet am {date}.',
      toastLockedWrongMonth: 'Der Kalender startet im {month}! Schau bald wieder vorbei.',
      toastLangChanged: 'Sprache auf {lang} geändert',
      toastReset: 'Lokaler Fortschritt zurückgesetzt.',
      toastIter3: 'Markdown-Ansicht für Readme.md folgt in Iteration 3!',
      toastIter4: 'PWA-Installation folgt in Iteration 4!',
      offMonthNotice: 'Die Türchen lassen sich ab {month} öffnen!',
      timeSourceServer: 'Vom Server geprüfte Zeit ({tz})',
      timeSourceLocal: 'Lokale Gerätezeit ({tz})',
      timeSourceDemo: 'Vorschaumodus ({tz})',
      demoTag: 'Dev-Vorschau',
      demoYear: 'Jahr',
      demoMonth: 'Monat',
      demoDay: 'Tag',
      demoReset: 'Reset',
      placeholderTitle: 'Bereit für Iteration 3!',
      placeholderDesc: 'Bilder, Videos, Audio (inkl. Opus), PDF, Word, RTF und Texte erscheinen hier aus'
    },
    es: {
      defaultTitle: 'Calendario de Adviento',
      defaultSubtitle: 'Una pequeña sorpresa cada día hasta Navidad',
      install: 'Instalar',
      snowTooltip: 'Activar o desactivar nieve',
      langTooltip: 'Cambiar idioma',
      installTooltip: 'Instalar aplicación',
      progress: '{opened} / {total} sorpresas descubiertas',
      doorLocked: 'Bloqueada',
      doorToday: '¡Hoy!',
      doorAvailable: 'Disponible',
      doorTapToOpen: 'Toca para abrir',
      doorUnlockOn: 'Desde el {date}',
      doorInsideDay: 'Día {day}',
      doorInsideCta: 'Ver sorpresa',
      doorOpenedIn: 'Abierta en {year}',
      modalBadge: 'Día {day}',
      modalTitle: 'Sorpresa del {date}',
      btnComment: 'Nota',
      btnDownload: 'Descargar',
      toastLocked: '¡Paciencia! La casilla {day} se abre el {date}.',
      toastLockedWrongMonth: '¡El calendario se activa en {month}! Vuelve pronto.',
      toastLangChanged: 'Idioma cambiado a {lang}',
      toastReset: 'Progreso local reiniciado.',
      toastIter3: '¡Visor Markdown para Readme.md en la Iteración 3!',
      toastIter4: '¡Instalación PWA nativa en la Iteración 4!',
      offMonthNotice: 'Las sorpresas se desbloquean en {month}. ¡Ya falta menos!',
      timeSourceServer: 'Fecha verificada por servidor ({tz})',
      timeSourceLocal: 'Fecha local del dispositivo ({tz})',
      timeSourceDemo: 'Modo vista previa ({tz})',
      demoTag: 'Vista Dev',
      demoYear: 'Año',
      demoMonth: 'Mes',
      demoDay: 'Día',
      demoReset: 'Reset',
      placeholderTitle: '¡Listo para la Iteración 3!',
      placeholderDesc: 'Aquí se mostrarán imágenes, vídeos, audio (incluido Opus), PDF, Word, RTF y textos desde'
    },
    pt: {
      defaultTitle: 'Calendário do Advento',
      defaultSubtitle: 'Uma pequena surpresa todos os dias até o Natal',
      install: 'Instalar',
      snowTooltip: 'Ativar ou desativar neve',
      langTooltip: 'Mudar idioma',
      installTooltip: 'Instalar aplicação',
      progress: '{opened} / {total} surpresas descobertas',
      doorLocked: 'Bloqueada',
      doorToday: 'Hoje!',
      doorAvailable: 'Disponível',
      doorTapToOpen: 'Toque para abrir',
      doorUnlockOn: 'A partir de {date}',
      doorInsideDay: 'Dia {day}',
      doorInsideCta: 'Ver surpresa',
      doorOpenedIn: 'Aberta em {year}',
      modalBadge: 'Dia {day}',
      modalTitle: 'Surpresa de {date}',
      btnComment: 'Mensagem',
      btnDownload: 'Descarregar',
      toastLocked: 'Paciência! A casa {day} abre a {date}.',
      toastLockedWrongMonth: 'O calendário ativa-se em {month}! Volta em breve.',
      toastLangChanged: 'Idioma alterado para {lang}',
      toastReset: 'Progresso local reiniciado.',
      toastIter3: 'Leitor Markdown para Readme.md na Iteração 3!',
      toastIter4: 'Instalação PWA nativa na Iteração 4!',
      offMonthNotice: 'As surpresas desbloqueiam-se em {month}. Falta pouco!',
      timeSourceServer: 'Data verificada pelo servidor ({tz})',
      timeSourceLocal: 'Data local do dispositivo ({tz})',
      timeSourceDemo: 'Modo pré-visualização ({tz})',
      demoTag: 'Prévia Dev',
      demoYear: 'Ano',
      demoMonth: 'Mês',
      demoDay: 'Dia',
      demoReset: 'Reset',
      placeholderTitle: 'Pronto para a Iteração 3!',
      placeholderDesc: 'Imagens, vídeos, áudio (incluindo Opus), PDF, Word, RTF e textos aparecerão aqui de'
    },
    nl: {
      defaultTitle: 'Adventskalender',
      defaultSubtitle: 'Elke dag een kleine verrassing tot Kerstmis',
      install: 'Installeren',
      snowTooltip: 'Sneeuw aan/uit',
      langTooltip: 'Taal wijzigen',
      installTooltip: 'App installeren',
      progress: '{opened} / {total} verrassingen geopend',
      doorLocked: 'Gesloten',
      doorToday: 'Vandaag!',
      doorAvailable: 'Klaar',
      doorTapToOpen: 'Tik om te openen',
      doorUnlockOn: 'Vanaf {date}',
      doorInsideDay: 'Dag {day}',
      doorInsideCta: 'Bekijk verrassing',
      doorOpenedIn: 'Geopend in {year}',
      modalBadge: 'Dag {day}',
      modalTitle: 'Verrassing van {date}',
      btnComment: 'Bericht',
      btnDownload: 'Downloaden',
      toastLocked: 'Nog even geduld! Vakje {day} opent op {date}.',
      toastLockedWrongMonth: 'De kalender start in {month}! Kom snel terug.',
      toastLangChanged: 'Taal ingesteld op {lang}',
      toastReset: 'Lokale voortgang gereset.',
      toastIter3: 'Markdown-weergave voor Readme.md komt in Iteratie 3!',
      toastIter4: 'PWA-installatie komt in Iteratie 4!',
      offMonthNotice: 'De vakjes gaan open in {month}. Nog even wachten!',
      timeSourceServer: 'Datum geverifieerd via server ({tz})',
      timeSourceLocal: 'Lokale apparaatdatum ({tz})',
      timeSourceDemo: 'Voorbeeldmodus ({tz})',
      demoTag: 'Dev-voorbeeld',
      demoYear: 'Jaar',
      demoMonth: 'Maand',
      demoDay: 'Dag',
      demoReset: 'Reset',
      placeholderTitle: 'Klaar voor Iteratie 3!',
      placeholderDesc: 'Afbeeldingen, video’s, audio (incl. Opus), PDF, Word, RTF en tekst verschijnen hier uit'
    },
    pl: {
      defaultTitle: 'Kalendarz Adwentowy',
      defaultSubtitle: 'Mała niespodzianka każdego dnia aż do Świąt',
      install: 'Zainstaluj',
      snowTooltip: 'Włącz lub wyłącz śnieg',
      langTooltip: 'Zmień język',
      installTooltip: 'Zainstaluj aplikację',
      progress: 'Odkryto {opened} / {total} niespodzianek',
      doorLocked: 'Zamknięte',
      doorToday: 'Dziś!',
      doorAvailable: 'Gotowe',
      doorTapToOpen: 'Kliknij, aby otworzyć',
      doorUnlockOn: 'Od {date}',
      doorInsideDay: 'Dzień {day}',
      doorInsideCta: 'Zobacz niespodziankę',
      doorOpenedIn: 'Otwarto w {year}',
      modalBadge: 'Dzień {day}',
      modalTitle: 'Niespodzianka na {date}',
      btnComment: 'Wiadomość',
      btnDownload: 'Pobierz',
      toastLocked: 'Cierpliwości! Okienko {day} otworzy się {date}.',
      toastLockedWrongMonth: 'Kalendarz rusza w miesiącu: {month}! Wróć wkrótce.',
      toastLangChanged: 'Zmieniono język na {lang}',
      toastReset: 'Zresetowano zapisany postęp.',
      toastIter3: 'Obsługa Markdown dla Readme.md pojawi się w Iteracji 3!',
      toastIter4: 'Instalacja PWA pojawi się w Iteracji 4!',
      offMonthNotice: 'Niespodzianki odblokują się w miesiącu: {month}.',
      timeSourceServer: 'Data zweryfikowana przez serwer ({tz})',
      timeSourceLocal: 'Lokalna data urządzenia ({tz})',
      timeSourceDemo: 'Tryb podglądu ({tz})',
      demoTag: 'Podgląd Dev',
      demoYear: 'Rok',
      demoMonth: 'Miesiąc',
      demoDay: 'Dzień',
      demoReset: 'Reset',
      placeholderTitle: 'Gotowe na Iterację 3!',
      placeholderDesc: 'Obrazy, wideo, audio (w tym Opus), PDF, Word, RTF i pliki tekstowe pojawią się tutaj z folderu'
    }
  };

  let currentLang = 'it';

  function isSupported(code) {
    return SUPPORTED_LANGUAGES.some((l) => l.code === code);
  }

  function detectBrowserLanguage() {
    const candidates = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language || 'en'];

    for (const raw of candidates) {
      const base = String(raw).toLowerCase().split('-')[0];
      if (isSupported(base)) return base;
    }
    return 'en';
  }

  function init(defaultFromConfig = 'auto') {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_LANG_KEY);
    } catch {
      saved = null;
    }

    if (saved && isSupported(saved)) {
      currentLang = saved;
    } else if (defaultFromConfig && defaultFromConfig !== 'auto' && isSupported(defaultFromConfig)) {
      currentLang = defaultFromConfig;
    } else {
      currentLang = detectBrowserLanguage();
    }

    document.documentElement.lang = currentLang;
    return currentLang;
  }

  function setLanguage(code) {
    if (!isSupported(code)) return false;
    currentLang = code;
    document.documentElement.lang = code;
    try {
      localStorage.setItem(STORAGE_LANG_KEY, code);
    } catch {
      // Ignora errori in modalità privata
    }
    return true;
  }

  function getLanguage() {
    return currentLang;
  }

  function getLanguageMeta(code = currentLang) {
    return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
  }

  function getLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  function t(key, vars = {}) {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    let template = dict[key] ?? TRANSLATIONS.en[key] ?? key;

    for (const [k, v] of Object.entries(vars)) {
      template = template.replaceAll(`{${k}}`, String(v));
    }
    return template;
  }

  // Risolve un campo di config.json sia se è una stringa unica sia se è un dizionario per lingua
  function pickConfigText(value, fallbackKey) {
    if (typeof value === 'string' && value.trim()) return value;
    if (value && typeof value === 'object') {
      return value[currentLang] || value.en || value.it || t(fallbackKey);
    }
    return t(fallbackKey);
  }

  function formatDayMonth(day, month, style = 'long') {
    const locale = getLanguageMeta().locale;
    // Usiamo un anno bisestile neutro (2024) in UTC per evitare slittamenti di fuso orario
    const date = new Date(Date.UTC(2024, month - 1, day, 12, 0, 0));
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: style,
      timeZone: 'UTC'
    }).format(date);
  }

  function formatMonthName(month) {
    const locale = getLanguageMeta().locale;
    const date = new Date(Date.UTC(2024, month - 1, 15, 12, 0, 0));
    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      timeZone: 'UTC'
    }).format(date);
  }

  return {
    init,
    setLanguage,
    getLanguage,
    getLanguageMeta,
    getLanguages,
    t,
    pickConfigText,
    formatDayMonth,
    formatMonthName
  };
})();