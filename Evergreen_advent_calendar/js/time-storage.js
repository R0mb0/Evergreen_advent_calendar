window.AdventTimeStorage = (() => {
  'use strict';

  const STORAGE_KEY = 'advent_calendar_opened_records_v2';

  /* =========================================================
     1. REAL DATE FROM THE SERVER + BROWSER TIME ZONE
     ========================================================= */

  function getBrowserTimeZone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
      return 'UTC';
    }
  }

  // Converts a Date object (UTC instant) into { year, month, day } in the user's local time zone
  function extractPartsInTimeZone(dateObj, timeZone) {
    try {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const parts = formatter.formatToParts(dateObj);
      const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));

      return {
        year: Number(map.year),
        month: Number(map.month),
        day: Number(map.day)
      };
    } catch {
      return {
        year: dateObj.getFullYear(),
        month: dateObj.getMonth() + 1,
        day: dateObj.getDate()
      };
    }
  }

  async function fetchWithTimeout(url, options = {}, timeoutMs = 3500) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  // Attempt A: reads the HTTP "Date" header from the same server (very fast on GitHub Pages)
  async function trySameOriginServerDate() {
    if (window.location.protocol === 'file:') return null;

    try {
      const res = await fetchWithTimeout(`./config.json?ts=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store'
      });
      const dateHeader = res.headers.get('Date');
      if (!dateHeader) return null;

      const parsed = new Date(dateHeader);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    } catch {
      return null;
    }
  }

  // Attempt B: public UTC time API as a fallback
  async function tryPublicTimeApi(apiUrl) {
    if (!apiUrl) return null;

    try {
      const res = await fetchWithTimeout(apiUrl, { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();

      // Compatible with timeapi.io (dateTime) and worldtimeapi (utc_datetime)
      const iso = data.dateTime || data.utc_datetime;
      if (!iso) return null;

      // timeapi.io with zone=UTC may omit the trailing 'Z'
      const normalized = iso.endsWith('Z') || /[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`;
      const parsed = new Date(normalized);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    } catch {
      return null;
    }
  }

  async function resolveCurrentDate(config) {
    const timeZone = getBrowserTimeZone();

    // If demoMode is enabled in config.json, use the simulated date
    if (config.demoMode?.enabled) {
      return {
        year: Number(config.demoMode.simulatedYear) || new Date().getFullYear(),
        month: Number(config.demoMode.simulatedMonth) || 12,
        day: Number(config.demoMode.simulatedDay) || 5,
        timeZone,
        source: 'demo'
      };
    }

    // 1. HTTP Date header of the hosting server (GitHub Pages / web server)
    let serverUtcDate = await trySameOriginServerDate();

    // 2. External public API
    if (!serverUtcDate) {
      serverUtcDate = await tryPublicTimeApi(config.timeApiFallbackUrl);
    }

    if (serverUtcDate) {
      const parts = extractPartsInTimeZone(serverUtcDate, timeZone);
      return { ...parts, timeZone, source: 'server' };
    }

    // 3. Offline fallback: the browser's local clock
    const localNow = new Date();
    const parts = extractPartsInTimeZone(localNow, timeZone);
    return { ...parts, timeZone, source: 'local' };
  }

  /* =========================================================
     2. MULTI-YEAR PERSISTENCE IN LOCALSTORAGE
     ========================================================= */

  function readAllRecords() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function writeAllRecords(records) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // Ignore errors in private mode or when storage is full
    }
  }

  function getDayRecord(day) {
    const records = readAllRecords();
    const rec = records[String(day)];
    if (!rec || typeof rec.year !== 'number') return null;
    return rec;
  }

  /**
   * Multi-year rule:
   * - If it has never been opened -> it can be opened (it is not open yet).
   * - If currentYear > lastOpenedYear -> it is a new year, so it is TO OPEN again.
   * - If currentYear <= lastOpenedYear -> it counts as ALREADY OPEN (avoids problems if the clock goes back).
   */
  function isOpenedForYear(day, currentYear) {
    const rec = getDayRecord(day);
    if (!rec) return false;
    return currentYear <= rec.year;
  }

  function canBeOpenedFresh(day, currentYear) {
    const rec = getDayRecord(day);
    if (!rec) return true;
    return currentYear > rec.year;
  }

  function markDayOpened(day, currentYear, currentMonth, currentDay) {
    const records = readAllRecords();
    const existing = records[String(day)];

    // Update only on the first opening or in a strictly later year
    if (!existing || currentYear > existing.year) {
      records[String(day)] = {
        year: currentYear,
        month: currentMonth,
        day: currentDay,
        openedAt: new Date().toISOString()
      };
      writeAllRecords(records);
    }

    return records[String(day)];
  }

  function countOpenedForYear(totalDays, currentYear) {
    let count = 0;
    for (let d = 1; d <= totalDays; d++) {
      if (isOpenedForYear(d, currentYear)) count++;
    }
    return count;
  }

  function clearAllRecords() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }

  return {
    resolveCurrentDate,
    getDayRecord,
    isOpenedForYear,
    canBeOpenedFresh,
    markDayOpened,
    countOpenedForYear,
    clearAllRecords
  };
})();