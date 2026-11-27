(() => {
  'use strict';

  // Configurazione di fallback se il file viene aperto direttamente via file://
  const FALLBACK_CONFIG = {
    appTitle: 'Il Nostro Calendario',
    appSubtitle: 'Una piccola sorpresa al giorno fino a Natale',
    totalDays: 24,
    targetMonth: 12,
    allowDownload: false,
    enableSnow: true,
    enableConfetti: true,
    demoMode: {
      enabled: true,
      simulatedMonth: 12,
      simulatedDay: 5
    }
  };

  const DOOR_THEMES = ['berry', 'mint', 'gold', 'sky'];
  const STORAGE_PREVIEW_KEY = 'advent_preview_opened_v1';

  const state = {
    config: { ...FALLBACK_CONFIG },
    currentMonth: 12,
    currentDay: 5,
    openedDays: new Set(),
    snowActive: true,
    activeModalDay: null
  };

  // Riferimenti DOM
  const els = {
    grid: document.getElementById('calendar-grid'),
    toolbarTitle: document.getElementById('toolbar-title'),
    heroTitle: document.getElementById('hero-title'),
    heroSubtitle: document.getElementById('hero-subtitle'),
    datePill: document.getElementById('date-pill'),
    progressText: document.getElementById('progress-text'),
    demoControls: document.getElementById('demo-controls'),
    demoSlider: document.getElementById('demo-day-slider'),
    demoDayValue: document.getElementById('demo-day-value'),
    btnResetDemo: document.getElementById('btn-reset-demo'),
    btnSnow: document.getElementById('btn-snow'),
    btnLang: document.getElementById('btn-lang'),
    btnInstall: document.getElementById('btn-install'),
    modal: document.getElementById('day-modal'),
    modalBadge: document.getElementById('modal-day-badge'),
    modalTitle: document.getElementById('modal-title'),
    modalFolderPath: document.getElementById('modal-folder-path'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnComment: document.getElementById('btn-comment'),
    btnDownloadMedia: document.getElementById('btn-download-media'),
    toast: document.getElementById('toast'),
    snowCanvas: document.getElementById('snow-canvas')
  };

  let toastTimer = null;

  /* =========================================================
     INIZIALIZZAZIONE
     ========================================================= */
  async function init() {
    await loadConfig();
    loadPreviewState();
    applyConfigToUI();
    renderGrid();
    bindEvents();
    initSnow();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  async function loadConfig() {
    try {
      const response = await fetch('./config.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('Config non trovata');
      const data = await response.json();
      state.config = { ...FALLBACK_CONFIG, ...data };
    } catch {
      // Fallback silenzioso per apertura locale senza server HTTP
      state.config = { ...FALLBACK_CONFIG };
    }

    state.snowActive = Boolean(state.config.enableSnow);

    if (state.config.demoMode?.enabled) {
      state.currentMonth = state.config.demoMode.simulatedMonth ?? 12;
      state.currentDay = state.config.demoMode.simulatedDay ?? 5;
    } else {
      const now = new Date();
      state.currentMonth = now.getMonth() + 1;
      state.currentDay = now.getDate();
    }
  }

  function loadPreviewState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_PREVIEW_KEY) || '[]');
      state.openedDays = new Set(saved);
    } catch {
      state.openedDays = new Set();
    }
  }

  function savePreviewState() {
    try {
      localStorage.setItem(STORAGE_PREVIEW_KEY, JSON.stringify([...state.openedDays]));
    } catch {
      // Ignora errori di storage in modalità privata restrittiva
    }
  }

  function applyConfigToUI() {
    const { appTitle, appSubtitle, allowDownload, demoMode, totalDays } = state.config;

    document.title = appTitle;
    els.toolbarTitle.textContent = appTitle;
    els.heroTitle.textContent = appTitle;
    els.heroSubtitle.textContent = appSubtitle;
    els.btnDownloadMedia.hidden = !allowDownload;

    if (demoMode?.enabled) {
      els.demoControls.hidden = false;
      els.demoSlider.max = String(Math.max(totalDays, 25));
      els.demoSlider.value = String(state.currentDay);
      els.demoDayValue.textContent = `${state.currentDay} Dic`;
    }

    updateDateAndProgress();
  }

  function updateDateAndProgress() {
    els.datePill.textContent = `${state.currentDay} Dicembre`;
    els.progressText.textContent = `${state.openedDays.size} / ${state.config.totalDays} sorprese scoperte`;
  }

  /* =========================================================
     RENDERING GRIGLIA 3D
     ========================================================= */
  function isDayUnlockable(day) {
    // Regola base dell'Iterazione 1 (nell'Iterazione 2 aggiungeremo data server + logica multi-anno)
    return state.currentMonth === state.config.targetMonth && day <= state.currentDay;
  }

  function renderGrid() {
    els.grid.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (let day = 1; day <= state.config.totalDays; day++) {
      const unlockable = isDayUnlockable(day);
      const isOpened = unlockable && state.openedDays.has(day);
      const isToday = unlockable && day === state.currentDay;
      const theme = DOOR_THEMES[(day - 1) % DOOR_THEMES.length];

      const wrapper = document.createElement('article');
      wrapper.className = 'door-wrapper';
      wrapper.dataset.day = String(day);
      wrapper.dataset.theme = theme;
      wrapper.style.animationDelay = `${Math.min(day * 28, 550)}ms`;

      if (unlockable) {
        wrapper.classList.add('is-available');
      } else {
        wrapper.classList.add('is-locked');
      }

      if (isToday) wrapper.classList.add('is-today');
      if (isOpened) wrapper.classList.add('is-open');

      const chipLabel = !unlockable
        ? 'Bloccata'
        : isToday
          ? 'Oggi!'
          : 'Apribile';

      const statusIcon = !unlockable ? 'lock' : isToday ? 'sparkles' : 'gift';

      wrapper.innerHTML = `
        <div class="door-frame">
          <button class="door-inside" type="button" aria-label="Rivedi sorpresa del giorno ${day}">
            <span class="inside-icon"><i data-lucide="heart"></i></span>
            <span class="inside-day">Giorno ${day}</span>
            <span class="inside-cta">Apri sorpresa</span>
          </button>

          <button class="door-panel" type="button" aria-label="Casella giorno ${day}">
            <div class="door-front">
              <div class="door-top-row">
                <span class="door-chip">${chipLabel}</span>
                <span class="door-status-icon"><i data-lucide="${statusIcon}"></i></span>
              </div>
              <span class="door-number">${day}</span>
              <span class="door-caption">${unlockable ? 'Tocca per aprire' : `Dal ${day} Dic`}</span>
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
    if (!isDayUnlockable(day)) {
      wrapper.classList.remove('is-shaking');
      void wrapper.offsetWidth; // Riavvia l'animazione wiggle
      wrapper.classList.add('is-shaking');
      showToast(`Pazienza! La casella ${day} si sblocca il ${day} dicembre.`);
      return;
    }

    // Prima apertura: anima sportello 3D + coriandoli + apertura modale
    if (!state.openedDays.has(day)) {
      state.openedDays.add(day);
      savePreviewState();
      wrapper.classList.add('is-open');
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
     MODALE & TOAST
     ========================================================= */
  function openModal(day) {
    state.activeModalDay = day;
    const padded = String(day).padStart(2, '0');

    els.modalBadge.textContent = `Giorno ${day}`;
    els.modalTitle.textContent = `Sorpresa del ${day} Dicembre`;
    els.modalFolderPath.textContent = `/days/${padded}/`;

    els.modal.hidden = false;
    requestAnimationFrame(() => els.modal.classList.add('is-visible'));
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    els.modal.classList.remove('is-visible');
    document.body.style.overflow = '';
    setTimeout(() => {
      els.modal.hidden = true;
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
     EVENTI INTERFACCIA
     ========================================================= */
  function bindEvents() {
    els.btnCloseModal.addEventListener('click', closeModal);

    els.modal.addEventListener('click', (e) => {
      if (e.target === els.modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !els.modal.hidden) closeModal();
    });

    els.btnSnow.addEventListener('click', () => {
      state.snowActive = !state.snowActive;
      els.btnSnow.classList.toggle('is-off', !state.snowActive);
      els.snowCanvas.style.opacity = state.snowActive ? '1' : '0';
    });

    // Pulsanti pronti per le iterazioni successive
    els.btnLang.addEventListener('click', () => {
      showToast('Selettore lingue europee in arrivo nell’Iterazione 2!');
    });

    els.btnInstall.addEventListener('click', () => {
      showToast('Installazione PWA nativa in arrivo nell’Iterazione 4!');
    });

    els.btnComment.addEventListener('click', () => {
      showToast('Lettore Markdown per Readme.md in arrivo nell’Iterazione 3!');
    });

    // Controlli Demo (Iterazione 1)
    els.demoSlider.addEventListener('input', (e) => {
      state.currentDay = Number(e.target.value);
      els.demoDayValue.textContent = `${state.currentDay} Dic`;
      updateDateAndProgress();
      renderGrid();
    });

    els.btnResetDemo.addEventListener('click', () => {
      state.openedDays.clear();
      savePreviewState();
      updateDateAndProgress();
      renderGrid();
      showToast('Tutte le caselle sono state richiuse.');
    });
  }

  /* =========================================================
     NEVE SOFFICE IN BACKGROUND (Canvas leggero)
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