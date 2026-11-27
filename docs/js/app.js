(() => {
  'use strict';

  const I18n = window.AdventI18n;
  const TimeStorage = window.AdventTimeStorage;
  const MediaViewer = window.AdventMediaViewer;

  const FALLBACK_CONFIG = {
    appTitle: "Calendario dell'Avvento",
    appSubtitle: 'Una piccola sorpresa al giorno fino a Natale',
    totalDays: 24,
    targetMonth: 12,
    allowDownload: false,
    enableSnow: true,
    enableConfetti: true,
    defaultLanguage: 'auto',
    timeApiFallbackUrl: 'https://timeapi.io/api/time/current/zone?timeZone=UTC',
    demoMode: {
      enabled: false,
      simulatedYear: 2026,
      simulatedMonth: 12,
      simulatedDay: 5
    }
  };

  const DOOR_THEMES = ['berry', 'mint', 'gold', 'sky'];

  const state = {
    config: { ...FALLBACK_CONFIG },
    dateInfo: {
      year: 2026,
      month: 12,
      day: 5,
      timeZone: 'UTC',
      source: 'local'
    },
    snowActive: true,
    activeModalDay: null
  };

  const els = {
    grid: document.getElementById('calendar-grid'),
    toolbarTitle: document.getElementById('toolbar-title'),
    heroTitle: document.getElementById('hero-title'),
    heroSubtitle: document.getElementById('hero-subtitle'),
    datePill: document.getElementById('date-pill'),
    datePillText: document.getElementById('date-pill-text'),
    timeSourceDot: document.getElementById('time-source-dot'),
    progressText: document.getElementById('progress-text'),
    offMonthBanner: document.getElementById('off-month-banner'),
    offMonthText: document.getElementById('off-month-text'),
    demoControls: document.getElementById('demo-controls'),
    demoTagLabel: document.getElementById('demo-tag-label'),
    demoYearLabel: document.getElementById('demo-year-label'),
    demoMonthLabel: document.getElementById('demo-month-label'),
    demoDayLabel: document.getElementById('demo-day-label'),
    demoResetLabel: document.getElementById('demo-reset-label'),
    demoYearSelect: document.getElementById('demo-year-select'),
    demoMonthSelect: document.getElementById('demo-month-select'),
    demoSlider: document.getElementById('demo-day-slider'),
    demoDayValue: document.getElementById('demo-day-value'),
    btnResetDemo: document.getElementById('btn-reset-demo'),
    btnSnow: document.getElementById('btn-snow'),
    btnLang: document.getElementById('btn-lang'),
    langCodeLabel: document.getElementById('lang-code-label'),
    langMenu: document.getElementById('lang-menu'),
    btnInstall: document.getElementById('btn-install'),
    btnInstallLabel: document.getElementById('btn-install-label'),
    modal: document.getElementById('day-modal'),
    modalBadge: document.getElementById('modal-day-badge'),
    modalTitle: document.getElementById('modal-title'),
    modalFileTabs: document.getElementById('modal-file-tabs'),
    modalBody: document.getElementById('modal-body'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnComment: document.getElementById('btn-comment'),
    btnCommentLabel: document.getElementById('btn-comment-label'),
    commentDot: document.getElementById('comment-dot'),
    btnDownloadMedia: document.getElementById('btn-download-media'),
    btnDownloadLabel: document.getElementById('btn-download-label'),
    toast: document.getElementById('toast'),
    snowCanvas: document.getElementById('snow-canvas'),
    pwaInstallTitle: document.getElementById('pwa-install-title'),
    pwaInstallDesc: document.getElementById('pwa-install-desc'),
    pwaInstallBtn: document.getElementById('pwa-install-btn'),
    iosInstallTitle: document.getElementById('ios-install-title'),
    iosInstallDesc: document.getElementById('ios-install-desc'),
    pwaUpdateTitle: document.getElementById('pwa-update-title'),
    pwaUpdateDesc: document.getElementById('pwa-update-desc'),
    pwaUpdateBtn: document.getElementById('pwa-update-btn')
  };

  let toastTimer = null;

  /* =========================================================
     INITIALIZATION
     ========================================================= */
  async function init() {
    await loadConfig();
    I18n.init(state.config.defaultLanguage);

    state.dateInfo = await TimeStorage.resolveCurrentDate(state.config);
    state.snowActive = Boolean(state.config.enableSnow);

    // Already running as an installed app: no need for the install button
    if (window.AdventPWA?.isStandalone()) els.btnInstall.hidden = true;

    renderLanguageMenu();
    syncDemoControls();
    applyTranslationsAndUI();
    renderGrid();
    bindEvents();
    initSnow();
  }

  async function loadConfig() {
    try {
      const response = await fetch('./config.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Config not found');
      const data = await response.json();
      state.config = { ...FALLBACK_CONFIG, ...data };
    } catch {
      state.config = { ...FALLBACK_CONFIG };
    }
  }

  /* =========================================================
     TRANSLATIONS & UI STATE
     ========================================================= */
  function applyTranslationsAndUI() {
    const title = I18n.pickConfigText(state.config.appTitle, 'defaultTitle');
    const subtitle = I18n.pickConfigText(state.config.appSubtitle, 'defaultSubtitle');
    const langMeta = I18n.getLanguageMeta();

    document.title = title;
    els.toolbarTitle.textContent = title;
    els.heroTitle.textContent = title;
    els.heroSubtitle.textContent = subtitle;

    els.langCodeLabel.textContent = langMeta.short;
    els.btnSnow.title = I18n.t('snowTooltip');
    els.btnSnow.setAttribute('aria-label', I18n.t('snowTooltip'));
    els.btnLang.title = I18n.t('langTooltip');
    els.btnLang.setAttribute('aria-label', I18n.t('langTooltip'));
    els.btnInstall.title = I18n.t('installTooltip');
    els.btnInstallLabel.textContent = I18n.t('install');

    els.btnCommentLabel.textContent = I18n.t('btnComment');
    els.btnDownloadLabel.textContent = I18n.t('btnDownload');

    els.demoTagLabel.textContent = I18n.t('demoTag');
    els.demoYearLabel.textContent = I18n.t('demoYear');
    els.demoMonthLabel.textContent = I18n.t('demoMonth');
    els.demoDayLabel.textContent = I18n.t('demoDay');
    els.demoResetLabel.textContent = I18n.t('demoReset');

    // PWA banners and generic aria-labels
    els.pwaInstallTitle.textContent = I18n.t('pwaInstallTitle');
    els.pwaInstallDesc.textContent = I18n.t('pwaInstallDesc');
    els.pwaInstallBtn.textContent = I18n.t('install');
    els.iosInstallTitle.textContent = I18n.t('iosTitle');
    els.iosInstallDesc.textContent = I18n.t('iosDesc');
    els.pwaUpdateTitle.textContent = I18n.t('pwaUpdateTitle');
    els.pwaUpdateDesc.textContent = I18n.t('pwaUpdateDesc');
    els.pwaUpdateBtn.textContent = I18n.t('pwaUpdateBtn');
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', I18n.t(el.dataset.i18nAria));
    });

    updateDateAndProgress();
    highlightActiveLanguage();

    if (state.activeModalDay !== null && !els.modal.hidden) {
      updateModalHeader(state.activeModalDay);
      MediaViewer.refreshLanguage();
    }
  }

  function updateDateAndProgress() {
    const { year, month, day, timeZone, source } = state.dateInfo;
    const { totalDays, targetMonth } = state.config;

    els.datePillText.textContent = `${I18n.formatDayMonth(day, month, 'long')} ${year}`;
    els.timeSourceDot.dataset.source = source;

    const sourceKey =
      source === 'server'
        ? 'timeSourceServer'
        : source === 'demo'
          ? 'timeSourceDemo'
          : 'timeSourceLocal';
    els.datePill.title = I18n.t(sourceKey, { tz: timeZone });

    const openedCount = TimeStorage.countOpenedForYear(totalDays, year);
    els.progressText.textContent = I18n.t('progress', {
      opened: openedCount,
      total: totalDays
    });

    const isTargetMonth = month === targetMonth;
    els.offMonthBanner.hidden = isTargetMonth;
    if (!isTargetMonth) {
      els.offMonthText.textContent = I18n.t('offMonthNotice', {
        month: I18n.formatMonthName(targetMonth)
      });
    }
  }

  function syncDemoControls() {
    if (!state.config.demoMode?.enabled) {
      els.demoControls.hidden = true;
      return;
    }

    els.demoControls.hidden = false;

    // Years from one before to three after the simulated one
    els.demoYearSelect.innerHTML = '';
    for (let y = state.dateInfo.year - 1; y <= state.dateInfo.year + 3; y++) {
      els.demoYearSelect.add(new Option(String(y), String(y)));
    }
    els.demoYearSelect.value = String(state.dateInfo.year);
    els.demoMonthSelect.value = String(state.dateInfo.month);
    els.demoSlider.max = String(Math.max(state.config.totalDays, 25));
    els.demoSlider.value = String(state.dateInfo.day);
    els.demoDayValue.textContent = String(state.dateInfo.day);
  }

  /* =========================================================
     LANGUAGE MENU
     ========================================================= */
  function renderLanguageMenu() {
    els.langMenu.innerHTML = '';

    for (const lang of I18n.getLanguages()) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('role', 'menuitem');
      btn.className = 'lang-option';
      btn.dataset.lang = lang.code;
      btn.innerHTML = `
        <span class="lang-option-left">
          <span aria-hidden="true">${lang.flag}</span>
          <span>${lang.label}</span>
        </span>
        <span class="lang-short">${lang.short}</span>
      `;

      btn.addEventListener('click', () => {
        I18n.setLanguage(lang.code);
        toggleLanguageMenu(false);
        applyTranslationsAndUI();
        renderGrid(false);
        showToast(I18n.t('toastLangChanged', { lang: lang.label }));
      });

      els.langMenu.appendChild(btn);
    }

    highlightActiveLanguage();
  }

  function highlightActiveLanguage() {
    const active = I18n.getLanguage();
    els.langMenu.querySelectorAll('.lang-option').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.lang === active);
    });
  }

  function toggleLanguageMenu(forceState) {
    const isCurrentlyOpen = !els.langMenu.hidden;
    const nextOpen = typeof forceState === 'boolean' ? forceState : !isCurrentlyOpen;
    els.langMenu.hidden = !nextOpen;
    els.btnLang.setAttribute('aria-expanded', String(nextOpen));
  }

  /* =========================================================
     UNLOCK LOGIC & 3D GRID RENDERING
     ========================================================= */
  function isDayUnlockable(day) {
    return state.dateInfo.month === state.config.targetMonth && day <= state.dateInfo.day;
  }

  function renderGrid(animateEntrance = true) {
    els.grid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    const { year, day: currentDay } = state.dateInfo;
    const { targetMonth, totalDays } = state.config;

    for (let day = 1; day <= totalDays; day++) {
      const unlockable = isDayUnlockable(day);
      const record = TimeStorage.getDayRecord(day);
      const isOpened = unlockable && TimeStorage.isOpenedForYear(day, year);
      const isToday = unlockable && day === currentDay;
      const theme = DOOR_THEMES[(day - 1) % DOOR_THEMES.length];

      const wrapper = document.createElement('article');
      wrapper.className = 'door-wrapper';
      wrapper.dataset.day = String(day);
      wrapper.dataset.theme = theme;

      if (animateEntrance) {
        wrapper.style.animationDelay = `${Math.min(day * 26, 520)}ms`;
      } else {
        wrapper.style.animation = 'none';
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'none';
      }

      wrapper.classList.add(unlockable ? 'is-available' : 'is-locked');
      if (isToday) wrapper.classList.add('is-today');
      if (isOpened) wrapper.classList.add('is-open');

      const chipLabel = !unlockable
        ? I18n.t('doorLocked')
        : isToday
          ? I18n.t('doorToday')
          : I18n.t('doorAvailable');

      const statusIcon = !unlockable ? 'lock' : isToday ? 'sparkles' : 'gift';
      const shortDate = I18n.formatDayMonth(day, targetMonth, 'short');
      const caption = unlockable
        ? I18n.t('doorTapToOpen')
        : I18n.t('doorUnlockOn', { date: shortDate });

      const openedYearBadge = record
        ? `<span class="inside-year-tag">${I18n.t('doorOpenedIn', { year: record.year })}</span>`
        : '';

      wrapper.innerHTML = `
        <div class="door-frame">
          <button class="door-inside" type="button" aria-label="${I18n.t('doorInsideDay', { day })}">
            <span class="inside-icon"><i data-lucide="heart"></i></span>
            <span class="inside-day">${I18n.t('doorInsideDay', { day })}</span>
            <span class="inside-cta">${I18n.t('doorInsideCta')}</span>
            ${openedYearBadge}
          </button>

          <button class="door-panel" type="button" aria-label="${I18n.t('doorInsideDay', { day })}">
            <div class="door-front">
              <div class="door-top-row">
                <span class="door-chip">${chipLabel}</span>
                <span class="door-status-icon"><i data-lucide="${statusIcon}"></i></span>
              </div>
              <span class="door-number">${day}</span>
              <span class="door-caption">${caption}</span>
            </div>
            <div class="door-back" aria-hidden="true"></div>
          </button>
        </div>
      `;

      const doorPanel = wrapper.querySelector('.door-panel');
      const doorInside = wrapper.querySelector('.door-inside');

      doorPanel.addEventListener('click', (e) => handleDoorClick(day, wrapper, e));
      doorInside.addEventListener('click', () => openModal(day));

      fragment.appendChild(wrapper);
    }

    els.grid.appendChild(fragment);

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function handleDoorClick(day, wrapper, event) {
    const { year, month, day: currentDay } = state.dateInfo;
    const { targetMonth } = state.config;

    if (!isDayUnlockable(day)) {
      wrapper.classList.remove('is-shaking');
      void wrapper.offsetWidth;
      wrapper.classList.add('is-shaking');

      if (month !== targetMonth) {
        showToast(I18n.t('toastLockedWrongMonth', {
          month: I18n.formatMonthName(targetMonth)
        }));
      } else {
        showToast(I18n.t('toastLocked', {
          day,
          date: I18n.formatDayMonth(day, targetMonth, 'long')
        }));
      }
      return;
    }

    if (TimeStorage.canBeOpenedFresh(day, year)) {
      const savedRecord = TimeStorage.markDayOpened(day, year, month, currentDay);
      wrapper.classList.add('is-open');

      const insideBtn = wrapper.querySelector('.door-inside');
      let yearTag = insideBtn.querySelector('.inside-year-tag');
      if (!yearTag) {
        yearTag = document.createElement('span');
        yearTag.className = 'inside-year-tag';
        insideBtn.appendChild(yearTag);
      }
      yearTag.textContent = I18n.t('doorOpenedIn', { year: savedRecord.year });

      updateDateAndProgress();

      if (state.config.enableConfetti) {
        triggerConfetti(event.clientX, event.clientY);
      }

      setTimeout(() => openModal(day), 520);
    } else {
      openModal(day);
    }
  }

  function triggerConfetti(x, y) {
    if (typeof window.confetti !== 'function') return;
    const originX = x ? x / window.innerWidth : 0.5;
    const originY = y ? y / window.innerHeight : 0.5;

    window.confetti({
      particleCount: 55,
      spread: 68,
      startVelocity: 28,
      origin: { x: originX, y: originY },
      colors: ['#ff5d7d', '#ffb74d', '#4ecdc4', '#7ea8ff', '#ffffff']
    });
  }

  /* =========================================================
     MODAL & MEDIA VIEWER INTEGRATION
     ========================================================= */
  function updateModalHeader(day) {
    const longDate = I18n.formatDayMonth(day, state.config.targetMonth, 'long');
    els.modalBadge.textContent = I18n.t('modalBadge', { day });
    els.modalTitle.textContent = I18n.t('modalTitle', { date: longDate });
  }

  function syncModalFooter(viewerState) {
    els.btnComment.disabled = !viewerState.canToggleComment;
    els.btnComment.title = viewerState.hasComment ? '' : viewerState.noCommentTooltip;
    els.btnComment.classList.toggle('is-active-toggle', viewerState.showingComment && viewerState.hasMedia);
    els.btnCommentLabel.textContent = viewerState.commentButtonLabel;
    els.commentDot.hidden = !(viewerState.hasComment && !viewerState.showingComment);

    els.btnDownloadMedia.hidden = !viewerState.canDownload;
  }

  function openModal(day) {
    state.activeModalDay = day;
    updateModalHeader(day);

    els.modal.hidden = false;
    requestAnimationFrame(() => els.modal.classList.add('is-visible'));
    document.body.style.overflow = 'hidden';

    MediaViewer.loadDay({
      day,
      container: els.modalBody,
      tabsContainer: els.modalFileTabs,
      allowDownload: state.config.allowDownload,
      onStateChange: syncModalFooter
    });
  }

  function closeModal() {
    MediaViewer.cleanup();
    els.modal.classList.remove('is-visible');
    document.body.style.overflow = '';
    setTimeout(() => {
      els.modal.hidden = true;
      els.modalBody.innerHTML = '';
      els.modalFileTabs.hidden = true;
    }, 240);
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.classList.remove('is-visible');
    }, 2800);
  }

  /* =========================================================
     UI EVENTS
     ========================================================= */
  function bindEvents() {
    els.btnCloseModal.addEventListener('click', closeModal);

    els.modal.addEventListener('click', (e) => {
      if (e.target === els.modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!els.langMenu.hidden) toggleLanguageMenu(false);
        if (!els.modal.hidden) closeModal();
      }
    });

    document.addEventListener('click', (e) => {
      if (!els.langMenu.hidden && !e.target.closest('.lang-picker')) {
        toggleLanguageMenu(false);
      }
    });

    els.btnLang.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleLanguageMenu();
    });

    els.btnSnow.addEventListener('click', () => {
      state.snowActive = !state.snowActive;
      els.btnSnow.classList.toggle('is-off', !state.snowActive);
      els.snowCanvas.style.opacity = state.snowActive ? '1' : '0';
    });

    els.btnInstall.addEventListener('click', async () => {
      const pwa = window.AdventPWA;
      const result = pwa ? await pwa.requestInstall() : 'unavailable';
      if (result === 'unavailable') showToast(I18n.t('installUnavailable'));
    });

    els.btnComment.addEventListener('click', () => {
      MediaViewer.toggleCommentView();
    });

    els.btnDownloadMedia.addEventListener('click', () => {
      const msg = MediaViewer.downloadCurrentFile();
      if (msg) showToast(msg);
    });

    // Demo controls (year, month, day)
    els.demoYearSelect.addEventListener('change', (e) => {
      state.dateInfo.year = Number(e.target.value);
      updateDateAndProgress();
      renderGrid(false);
    });

    els.demoMonthSelect.addEventListener('change', (e) => {
      state.dateInfo.month = Number(e.target.value);
      updateDateAndProgress();
      renderGrid(false);
    });

    els.demoSlider.addEventListener('input', (e) => {
      state.dateInfo.day = Number(e.target.value);
      els.demoDayValue.textContent = String(state.dateInfo.day);
      updateDateAndProgress();
      renderGrid(false);
    });

    els.btnResetDemo.addEventListener('click', () => {
      TimeStorage.clearAllRecords();
      updateDateAndProgress();
      renderGrid(false);
      showToast(I18n.t('toastReset'));
    });
  }

  /* =========================================================
     SOFT BACKGROUND SNOW
     ========================================================= */
  function initSnow() {
    const canvas = els.snowCanvas;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const flakeCount = Math.min(55, Math.floor(width / 22));
    const flakes = Array.from({ length: flakeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3.2 + 1.4,
      speedY: Math.random() * 0.75 + 0.35,
      drift: Math.random() * Math.PI * 2
    }));

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    function animate() {
      ctx.clearRect(0, 0, width, height);

      if (state.snowActive) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
        for (const f of flakes) {
          f.y += f.speedY;
          f.drift += 0.012;
          f.x += Math.sin(f.drift) * 0.45;

          if (f.y > height + 8) {
            f.y = -8;
            f.x = Math.random() * width;
          }

          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      requestAnimationFrame(animate);
    }

    animate();
  }

  document.addEventListener('DOMContentLoaded', init);
})();