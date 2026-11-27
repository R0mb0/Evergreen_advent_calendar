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
      offMonthNotice: 'Le sorprese si sbloccano a {month}. Nel frattempo puoi ammirare il calendario!',
      timeSourceServer: 'Ora verificata dal server ({tz})',
      timeSourceLocal: 'Ora locale del dispositivo ({tz})',
      timeSourceDemo: 'Modalità anteprima ({tz})',
      demoTag: 'Anteprima Dev',
      demoYear: 'Anno',
      demoMonth: 'Mese',
      demoDay: 'Giorno',
      demoReset: 'Reset',
      close: "Chiudi",
      installUnavailable: "L'installazione non è disponibile su questo browser. Usa il menu del browser per aggiungere l'app alla Home.",
      pwaInstallTitle: "Installa l'app",
      pwaInstallDesc: "Accesso rapido e funzionamento offline.",
      iosTitle: "Installa su iPhone / iPad",
      iosDesc: "Tocca Condividi (quadrato con freccia) → Aggiungi alla schermata Home.",
      pwaUpdateTitle: "Aggiornamento pronto",
      pwaUpdateDesc: "È disponibile una nuova versione dell'app.",
      pwaUpdateBtn: "Aggiorna"
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
      offMonthNotice: 'Surprises unlock in {month}. Come back when the season begins!',
      timeSourceServer: 'Server-verified date ({tz})',
      timeSourceLocal: 'Device local date ({tz})',
      timeSourceDemo: 'Preview mode ({tz})',
      demoTag: 'Dev Preview',
      demoYear: 'Year',
      demoMonth: 'Month',
      demoDay: 'Day',
      demoReset: 'Reset',
      close: "Close",
      installUnavailable: "Installation is not available in this browser. Use the browser menu to add the app to your home screen.",
      pwaInstallTitle: "Install the app",
      pwaInstallDesc: "Quick access and offline use.",
      iosTitle: "Install on iPhone / iPad",
      iosDesc: "Tap Share (square with arrow) → Add to Home Screen.",
      pwaUpdateTitle: "Update ready",
      pwaUpdateDesc: "A new version of the app is available.",
      pwaUpdateBtn: "Update"
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
      offMonthNotice: 'Les surprises se débloquent en {month}. Un peu de patience !',
      timeSourceServer: 'Date vérifiée par le serveur ({tz})',
      timeSourceLocal: 'Date locale de l’appareil ({tz})',
      timeSourceDemo: 'Mode aperçu ({tz})',
      demoTag: 'Aperçu Dev',
      demoYear: 'Année',
      demoMonth: 'Mois',
      demoDay: 'Jour',
      demoReset: 'Reset',
      close: "Fermer",
      installUnavailable: "L'installation n'est pas disponible sur ce navigateur. Utilisez le menu du navigateur pour ajouter l'app à l'écran d'accueil.",
      pwaInstallTitle: "Installer l'application",
      pwaInstallDesc: "Accès rapide et utilisation hors ligne.",
      iosTitle: "Installer sur iPhone / iPad",
      iosDesc: "Touchez Partager (carré avec flèche) → Sur l'écran d'accueil.",
      pwaUpdateTitle: "Mise à jour prête",
      pwaUpdateDesc: "Une nouvelle version de l'application est disponible.",
      pwaUpdateBtn: "Mettre à jour"
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
      offMonthNotice: 'Die Türchen lassen sich ab {month} öffnen!',
      timeSourceServer: 'Vom Server geprüfte Zeit ({tz})',
      timeSourceLocal: 'Lokale Gerätezeit ({tz})',
      timeSourceDemo: 'Vorschaumodus ({tz})',
      demoTag: 'Dev-Vorschau',
      demoYear: 'Jahr',
      demoMonth: 'Monat',
      demoDay: 'Tag',
      demoReset: 'Reset',
      close: "Schließen",
      installUnavailable: "Die Installation wird von diesem Browser nicht unterstützt. Nutze das Browsermenü, um die App zum Startbildschirm hinzuzufügen.",
      pwaInstallTitle: "App installieren",
      pwaInstallDesc: "Schneller Zugriff und Offline-Nutzung.",
      iosTitle: "Auf iPhone / iPad installieren",
      iosDesc: "Tippe auf Teilen (Quadrat mit Pfeil) → Zum Home-Bildschirm.",
      pwaUpdateTitle: "Update bereit",
      pwaUpdateDesc: "Eine neue Version der App ist verfügbar.",
      pwaUpdateBtn: "Aktualisieren"
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
      offMonthNotice: 'Las sorpresas se desbloquean en {month}. ¡Ya falta menos!',
      timeSourceServer: 'Fecha verificada por servidor ({tz})',
      timeSourceLocal: 'Fecha local del dispositivo ({tz})',
      timeSourceDemo: 'Modo vista previa ({tz})',
      demoTag: 'Vista Dev',
      demoYear: 'Año',
      demoMonth: 'Mes',
      demoDay: 'Día',
      demoReset: 'Reset',
      close: "Cerrar",
      installUnavailable: "La instalación no está disponible en este navegador. Usa el menú del navegador para añadir la app a la pantalla de inicio.",
      pwaInstallTitle: "Instalar la aplicación",
      pwaInstallDesc: "Acceso rápido y uso sin conexión.",
      iosTitle: "Instalar en iPhone / iPad",
      iosDesc: "Toca Compartir (cuadrado con flecha) → Añadir a pantalla de inicio.",
      pwaUpdateTitle: "Actualización lista",
      pwaUpdateDesc: "Hay una nueva versión de la aplicación.",
      pwaUpdateBtn: "Actualizar"
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
      offMonthNotice: 'As surpresas desbloqueiam-se em {month}. Falta pouco!',
      timeSourceServer: 'Data verificada pelo servidor ({tz})',
      timeSourceLocal: 'Data local do dispositivo ({tz})',
      timeSourceDemo: 'Modo pré-visualização ({tz})',
      demoTag: 'Prévia Dev',
      demoYear: 'Ano',
      demoMonth: 'Mês',
      demoDay: 'Dia',
      demoReset: 'Reset',
      close: "Fechar",
      installUnavailable: "A instalação não está disponível neste navegador. Usa o menu do navegador para adicionar a app ao ecrã principal.",
      pwaInstallTitle: "Instalar a aplicação",
      pwaInstallDesc: "Acesso rápido e utilização offline.",
      iosTitle: "Instalar no iPhone / iPad",
      iosDesc: "Toca em Partilhar (quadrado com seta) → Adicionar ao ecrã principal.",
      pwaUpdateTitle: "Atualização pronta",
      pwaUpdateDesc: "Está disponível uma nova versão da aplicação.",
      pwaUpdateBtn: "Atualizar"
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
      offMonthNotice: 'De vakjes gaan open in {month}. Nog even wachten!',
      timeSourceServer: 'Datum geverifieerd via server ({tz})',
      timeSourceLocal: 'Lokale apparaatdatum ({tz})',
      timeSourceDemo: 'Voorbeeldmodus ({tz})',
      demoTag: 'Dev-voorbeeld',
      demoYear: 'Jaar',
      demoMonth: 'Maand',
      demoDay: 'Dag',
      demoReset: 'Reset',
      close: "Sluiten",
      installUnavailable: "Installeren is niet beschikbaar in deze browser. Gebruik het browsermenu om de app aan je beginscherm toe te voegen.",
      pwaInstallTitle: "App installeren",
      pwaInstallDesc: "Snelle toegang en offline gebruik.",
      iosTitle: "Installeren op iPhone / iPad",
      iosDesc: "Tik op Deel (vierkant met pijl) → Zet op beginscherm.",
      pwaUpdateTitle: "Update beschikbaar",
      pwaUpdateDesc: "Er is een nieuwe versie van de app beschikbaar.",
      pwaUpdateBtn: "Bijwerken"
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
      offMonthNotice: 'Niespodzianki odblokują się w miesiącu: {month}.',
      timeSourceServer: 'Data zweryfikowana przez serwer ({tz})',
      timeSourceLocal: 'Lokalna data urządzenia ({tz})',
      timeSourceDemo: 'Tryb podglądu ({tz})',
      demoTag: 'Podgląd Dev',
      demoYear: 'Rok',
      demoMonth: 'Miesiąc',
      demoDay: 'Dzień',
      demoReset: 'Reset',
      close: "Zamknij",
      installUnavailable: "Instalacja nie jest dostępna w tej przeglądarce. Użyj menu przeglądarki, aby dodać aplikację do ekranu głównego.",
      pwaInstallTitle: "Zainstaluj aplikację",
      pwaInstallDesc: "Szybki dostęp i działanie offline.",
      iosTitle: "Instalacja na iPhone / iPad",
      iosDesc: "Stuknij Udostępnij (kwadrat ze strzałką) → Do ekranu początkowego.",
      pwaUpdateTitle: "Aktualizacja gotowa",
      pwaUpdateDesc: "Dostępna jest nowa wersja aplikacji.",
      pwaUpdateBtn: "Aktualizuj"
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