// js/app.js
// Projeto 365 — App (render do poema do dia + ato/aura base)
// Preparado para crescer até o Ato 6.

(function () {
  "use strict";

  // ===== Config =====
  const SENHA_CORRETA = "10022024";

  // Dia 1 = 24/02/2026 (como era antes)
  const DATA_INICIO_PADRAO = new Date("2026-02-24T00:00:00");
  const START_OVERRIDE_KEY = "projeto365_start_override";

  // ===== Helpers =====
  function $(id) { return document.getElementById(id); }

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

  function getDataInicio() {
    const iso = localStorage.getItem(START_OVERRIDE_KEY);
    if (iso && /^\d{4}-\d{2}-\d{2}$/.test(iso)) {
      return new Date(iso + "T00:00:00");
    }
    return DATA_INICIO_PADRAO;
  }

  function diffDias() {
    const dataInicio = getDataInicio();
    const hoje = new Date();
    const H = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const I = new Date(dataInicio.getFullYear(), dataInicio.getMonth(), dataInicio.getDate());
    return Math.floor((H - I) / (1000 * 60 * 60 * 24));
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

  // Aura progressiva por ato (0..1) -> CSS usa --auraT
  function setAuraProgress(dia) {
    if (!Number.isFinite(dia) || dia < 1) {
      document.documentElement.style.setProperty("--auraT", "0");
      return;
    }
    const { start, end } = getFaixaAto(dia);
    const denom = Math.max(1, (end - start));
    const t = (dia - start) / denom;
    const clamped = Math.max(0, Math.min(1, t));
    document.documentElement.style.setProperty("--auraT", clamped.toFixed(4));
  }

  function setTema(dia) {
    const ato = getAto(dia);
    document.body.setAttribute("data-ato", String(ato));
    document.body.setAttribute("data-dia", String(dia));
    setAuraProgress(dia);
  }

  function render(dia) {
    const tituloEl = $("titulo");
    const poemaEl = $("poema");

    // dia 0 = prefácio
    if (dia <= 0) {
      document.body.removeAttribute("data-ato");
      document.body.setAttribute("data-dia", "0");
      document.documentElement.style.setProperty("--auraT", "0");
      tituloEl.textContent = "Antes do primeiro poema";
      poemaEl.textContent = (window.PREFACIO || "Em breve.");
      return;
    }

    setTema(dia);

    tituloEl.textContent = `Dia ${dia} de 365`;

    // usa o agregador window.getPoemaDoDia (do data/poemas.index.js)
    const texto = (typeof window.getPoemaDoDia === "function")
      ? window.getPoemaDoDia(dia)
      : "Em breve...";

    poemaEl.textContent = texto;
  }

  // ===== Boot =====
  function boot() {
    // login (por enquanto não tem UI de login nesse HTML simples,
    // mas já deixo a senha aqui pronta pra quando você voltar com o layout completo)
    // SENHA_CORRETA está guardada para integrar depois.

    const forced = getForcedDay();
    const dia = (forced !== null) ? forced : (diffDias() + 1);
    render(dia);
  }

  boot();
})();
