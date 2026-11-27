(() => {
  const DISMISS_KEY = 'pwa-install-dismissed-v4';
  let deferredPrompt = null;
  let waitingWorker = null;
  let updateRequested = false;

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

  const safeGet = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const safeSet = (key, value) => {
    try { localStorage.setItem(key, value); } catch { /* storage not available */ }
  };

  const isDismissed = () => safeGet(DISMISS_KEY) === '1';

  // 1. Service Worker registration + update handling
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

        // Reload only after the user accepted the update: on the very first install
        // the new worker takes control (clients.claim) and no reload is needed.
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!updateRequested || refreshing) return;
          refreshing = true;
          window.location.reload();
        });
      } catch (err) {
        console.error('Service Worker registration failed:', err);
      }
    });
  }

  updateBtn?.addEventListener('click', () => {
    if (waitingWorker) {
      updateRequested = true;
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  });

  // 2. Native install prompt on Android / Desktop (Chrome, Edge, Brave, Opera)
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (!isStandalone() && !isDismissed() && installBanner) {
      installBanner.hidden = false;
    }
  });

  async function promptInstall() {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (installBanner) installBanner.hidden = true;
    if (outcome === 'accepted') safeSet(DISMISS_KEY, '1');
    return outcome === 'accepted';
  }

  installBtn?.addEventListener('click', promptInstall);

  dismissBtn?.addEventListener('click', () => {
    if (installBanner) installBanner.hidden = true;
    safeSet(DISMISS_KEY, '1');
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (installBanner) installBanner.hidden = true;
  });

  // 3. Quick install guide for iOS Safari
  window.addEventListener('load', () => {
    if (isIosDevice() && !isStandalone() && !isDismissed() && iosBanner) {
      iosBanner.hidden = false;
    }
  });

  iosDismissBtn?.addEventListener('click', () => {
    if (iosBanner) iosBanner.hidden = true;
    safeSet(DISMISS_KEY, '1');
  });

  // API used by the toolbar "Install" button in app.js.
  // Returns 'prompted' | 'ios' | 'standalone' | 'unavailable'.
  window.AdventPWA = {
    isStandalone,
    async requestInstall() {
      if (isStandalone()) return 'standalone';
      if (deferredPrompt) {
        await promptInstall();
        return 'prompted';
      }
      if (isIosDevice() && iosBanner) {
        iosBanner.hidden = false;
        return 'ios';
      }
      return 'unavailable';
    }
  };
})();
