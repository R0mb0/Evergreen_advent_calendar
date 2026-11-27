(() => {
  const DISMISS_KEY = 'pwa-install-dismissed-v4';
  let deferredPrompt = null;
  let waitingWorker = null;

  const installBanner = document.getElementById('pwa-install-banner');
  const installBtn = document.getElementById('pwa-install-btn');
  const dismissBtn = document.getElementById('pwa-dismiss-btn');

  const iosBanner = document.getElementById('ios-install-banner');
  const iosDismissBtn = document.getElementById('ios-dismiss-btn');

  const updateBanner = document.getElementById('pwa-update-banner');
  const updateBtn = document.getElementById('pwa-update-btn');

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const isIosDevice = () => {
    const ua = window.navigator.userAgent.toLowerCase();
    const isOldIos = /iphone|ipad|ipod/.test(ua);
    const isIpadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    return isOldIos || isIpadOs;
  };

  const isDismissed = () => localStorage.getItem(DISMISS_KEY) === '1';

  // 1. Registrazione Service Worker + gestione aggiornamenti
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register('./service-worker.js', {
          scope: './'
        });

        const showUpdate = (worker) => {
          waitingWorker = worker;
          if (updateBanner) updateBanner.hidden = false;
        };

        if (reg.waiting) showUpdate(reg.waiting);

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdate(newWorker);
            }
          });
        });

        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        });
      } catch (err) {
        console.error('Errore registrazione Service Worker:', err);
      }
    });
  }

  updateBtn?.addEventListener('click', () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  });

  // 2. Prompt nativo Android / Desktop (Chrome, Edge, Brave, Opera)
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (!isStandalone() && !isDismissed() && installBanner) {
      installBanner.hidden = false;
    }
  });

  installBtn?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (installBanner) installBanner.hidden = true;
    if (outcome === 'accepted') {
      localStorage.setItem(DISMISS_KEY, '1');
    }
  });

  dismissBtn?.addEventListener('click', () => {
    if (installBanner) installBanner.hidden = true;
    localStorage.setItem(DISMISS_KEY, '1');
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (installBanner) installBanner.hidden = true;
  });

  // 3. Guida rapida dedicata per iOS Safari
  window.addEventListener('load', () => {
    if (isIosDevice() && !isStandalone() && !isDismissed() && iosBanner) {
      iosBanner.hidden = false;
    }
  });

  iosDismissBtn?.addEventListener('click', () => {
    if (iosBanner) iosBanner.hidden = true;
    localStorage.setItem(DISMISS_KEY, '1');
  });
})();