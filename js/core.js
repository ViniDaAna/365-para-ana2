// js/core.js
// Núcleo do Projeto 365
// - data de início (com override)
// - modo teste (?day=)
// - cálculo de dia (0..365)
// - ato / faixa do ato
// - data-ato, data-dia
// - aura progressiva (--auraT)
// - Ato 2: linhas se aproximando (--ato2Gap)

(function () {
  "use strict";

  // ===== CONFIG =====
  const DATA_INICIO_PADRAO = new Date("2026-02-24T00:00:00");
  const START_OVERRIDE_KEY = "projeto365_start_override";

  // expõe DIA_ATUAL como no seu antigão
  window.DIA_ATUAL = 1;

  // =============================
  // MODO TESTE: /?day=60
  // =============================
  window.getForcedDay = function getForcedDay() {
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
  };

  // =============================
  // DATA INÍCIO (override)
  // =============================
  window.getDataInicio = function getDataInicio() {
    try {
      const iso = localStorage.getItem(START_OVERRIDE_KEY);
      if (iso && /^\d{4}-\d{2}-\d{2}$/.test(iso)) {
        return new Date(iso + "T00:00:00");
      }
    } catch (e) {}
    return DATA_INICIO_PADRAO;
  };

  // =============================
  // DIFERENÇA DE DIAS
  // =============================
  window.diffDias = function diffDias() {
    const dataInicio = window.getDataInicio();
    const hoje = new Date();

    const H = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const I = new Date(dataInicio.getFullYear(), dataInicio.getMonth(), dataInicio.getDate());

    return Math.floor((H - I) / (1000 * 60 * 60 * 24));
  };

  // =============================
  // ATO / FAIXA
  // =============================
  window.getAto = function getAto(dia) {
    if (dia >= 1 && dia <= 30) return 1;
    if (dia >= 31 && dia <= 90) return 2;
    if (dia >= 91 && dia <= 150) return 3;
    if (dia >= 151 && dia <= 240) return 4;
    if (dia >= 241 && dia <= 330) return 5;
    return 6;
  };

  window.getFaixaAto = function getFaixaAto(dia) {
    const ato = window.getAto(dia);
    if (ato === 1) return { start: 1, end: 30 };
    if (ato === 2) return { start: 31, end: 90 };
    if (ato === 3) return { start: 91, end: 150 };
    if (ato === 4) return { start: 151, end: 240 };
    if (ato === 5) return { start: 241, end: 330 };
    return { start: 331, end: 365 };
  };

  // =============================
  // AURA PROGRESSIVA
  // =============================
  window.setAuraProgress = function setAuraProgress(dia) {
    if (!Number.isFinite(dia) || dia < 1) {
      document.documentElement.style.setProperty("--auraT", "0");
      return;
    }

    const { start, end } = window.getFaixaAto(dia);
    const denom = Math.max(1, (end - start));
    const t = (dia - start) / denom;
    const clamped = Math.max(0, Math.min(1, t));

    document.documentElement.style.setProperty("--auraT", clamped.toFixed(4));
  };

  // =============================
  // ATO 2 — PROGRESSO DAS LINHAS
  // (gap 44px -> 10px)
  // =============================
  window.setAto2Progress = function setAto2Progress(dia) {
    if (window.getAto(dia) !== 2) {
      document.documentElement.style.setProperty("--ato2Gap", "44px");
      return;
    }

    const start = 31, end = 90;
    const denom = Math.max(1, (end - start));
    const t = Math.max(0, Math.min(1, (dia - start) / denom));
    const gap = 44 - (34 * t);

    document.documentElement.style.setProperty("--ato2Gap", `${gap.toFixed(2)}px`);
  };

  // =============================
  // TEMA + ATRIBUTOS
  // =============================
  window.setTemaPorAto = function setTemaPorAto(dia) {
    document.body.setAttribute("data-ato", String(window.getAto(dia)));
    window.setAuraProgress(dia);
    window.setAto2Progress(dia);
  };

  window.setDayAttr = function setDayAttr(dia) {
    if (dia >= 1 && dia <= 365) document.body.setAttribute("data-dia", String(dia));
    else document.body.removeAttribute("data-dia");
  };

  // =============================
  // CALCULAR DIA ATUAL (0..365)
  // =============================
  window.calcularDia = function calcularDia() {
    const forced = window.getForcedDay();
    if (forced !== null) {
      window.DIA_ATUAL = forced;
      return window.DIA_ATUAL;
    }

    const d = window.diffDias();
    window.DIA_ATUAL = d + 1;

    if (window.DIA_ATUAL < 1) window.DIA_ATUAL = 0;
    if (window.DIA_ATUAL > 365) window.DIA_ATUAL = 365;

    return window.DIA_ATUAL;
  };
})();
