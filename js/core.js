// js/core.js
(function () {
  "use strict";

  const START_DATE_ISO = "2026-02-24"; // Dia 1
  const START_DATE = new Date(START_DATE_ISO + "T00:00:00");

  const STORAGE = {
    LOGIN_OK: "projeto365_login_ok",
    ATO1_UNLOCK: "projeto365_ato1_unlock", // 0..30
    LAST_VISIT: "projeto365_visita",
    TOAST_LAST: "projeto365_toast_last",
  };

  function clamp01(n) {
    return Math.max(0, Math.min(1, n));
  }

  function getForcedDay() {
    try {
      const p = new URLSearchParams(location.search);
      const raw = p.get("day");
      if (!raw) return null;
      const n = Number(raw);
      if (Number.isFinite(n) && n >= 0 && n <= 365) return Math.floor(n);
      return null;
    } catch (e) {
      return null;
    }
  }

  function diffDaysFromStart() {
    const now = new Date();
    const H = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const I = new Date(START_DATE.getFullYear(), START_DATE.getMonth(), START_DATE.getDate());
    return Math.floor((H - I) / (1000 * 60 * 60 * 24));
  }

  function getDiaAtual() {
    const forced = getForcedDay();
    if (forced !== null) return forced;

    const d = diffDaysFromStart() + 1;
    if (d < 0) return 0;
    if (d > 365) return 365;
    return d;
  }

  function getAto(dia) {
    if (dia >= 1 && dia <= 30) return 1;
    if (dia >= 31 && dia <= 90) return 2;
    if (dia >= 91 && dia <= 150) return 3;
    if (dia >= 151 && dia <= 240) return 4;
    if (dia >= 241 && dia <= 330) return 5;
    return 6;
  }

  function getFaixaAto(dia) {
    const ato = getAto(dia);
    if (ato === 1) return { start: 1, end: 30 };
    if (ato === 2) return { start: 31, end: 90 };
    if (ato === 3) return { start: 91, end: 150 };
    if (ato === 4) return { start: 151, end: 240 };
    if (ato === 5) return { start: 241, end: 330 };
    return { start: 331, end: 365 };
  }

  function setTema(dia) {
    const ato = getAto(dia);
    document.body.setAttribute("data-ato", String(ato));
    if (dia >= 0 && dia <= 365) document.body.setAttribute("data-dia", String(dia));
    else document.body.removeAttribute("data-dia");
  }

  function setAuraProgress(dia) {
    if (!Number.isFinite(dia) || dia < 1) {
      document.documentElement.style.setProperty("--auraT", "0");
      return;
    }
    const { start, end } = getFaixaAto(dia);
    const denom = Math.max(1, end - start);
    const t = (dia - start) / denom;
    document.documentElement.style.setProperty("--auraT", clamp01(t).toFixed(4));
  }

  // Ato 2 — gap 44 -> 10 conforme progresso
  function setAto2Progress(dia) {
    if (getAto(dia) !== 2) {
      document.documentElement.style.setProperty("--ato2Gap", "44px");
      return;
    }
    const start = 31, end = 90;
    const denom = Math.max(1, end - start);
    const t = clamp01((dia - start) / denom);
    const gap = 44 - (34 * t); // 44 -> 10
    document.documentElement.style.setProperty("--ato2Gap", `${gap.toFixed(2)}px`);
  }

  function aplicarTemaCompleto(dia) {
    setTema(dia);
    setAuraProgress(dia);
    setAto2Progress(dia);
  }

  function getAto1Unlocked() {
    const raw = Number(localStorage.getItem(STORAGE.ATO1_UNLOCK) || 0);
    if (!Number.isFinite(raw)) return 0;
    return Math.max(0, Math.min(30, Math.floor(raw)));
  }

  function setAto1Unlocked(n) {
    const clamped = Math.max(0, Math.min(30, Math.floor(n)));
    localStorage.setItem(STORAGE.ATO1_UNLOCK, String(clamped));
  }

  window.PROJETO365 = {
    START_DATE_ISO,
    STORAGE,
    clamp01,
    getForcedDay,
    getDiaAtual,
    getAto,
    getFaixaAto,
    aplicarTemaCompleto,
    getAto1Unlocked,
    setAto1Unlocked,
  };
})();
