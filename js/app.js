// js/app.js
// Projeto 365 — App (DOM modular do teu index atual)
//
// Depende de (se existirem):
// - data/segredos.js: INTRO_ATOS, ATO1_PALAVRAS, ATO1_UNLOCK_KEY (opcional), pickSegredo (opcional)
// - data/poemas.index.js: window.getPoemaDoDia(dia)
// - data/memorias.js: window.getMemoriaDoDia(dia) (ou equivalente)
// - data/prefacio.js: window.PREFACIO (opcional)
// - js/core.js: getForcedDay, diffDias, getAto, getFaixaAto, setTemaPorAto, setDayAttr (opcional)
//
// Ele também tem fallbacks internos caso algum helper não exista.

(function () {
  "use strict";

  // =========================
  // CONFIG
  // =========================
  const SENHA_CORRETA = "10022024";

  const START_OVERRIDE_KEY = "projeto365_start_override";
  const INTRO_KEY_PREFIX = "projeto365_intro_vista_";

  // Toast de inatividade (segredinhos)
  const TOAST_COOLDOWN_KEY = "projeto365_toast";
  const TOAST_COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2h
  const TOAST_IDLE_MS = 10000; // 10s

  // Typewriter
  const TYPE_SPEED = 12;

  // Saudade (texto)
  const SAUDADE_TEXTO =
    "Se você sentiu saudade, é porque o que temos é real.\n" +
    "E eu escolho você — hoje e todos os dias.";

  // =========================
  // DOM HELPERS
  // =========================
  const $ = (id) => document.getElementById(id);
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

  function showView(sectionEl) {
    // seu layout usa data-visible
    sectionEl.dataset.visible = "true";
  }
  function hideView(sectionEl) {
    sectionEl.dataset.visible = "false";
  }

  function openModal(modalId) {
    const m = $(modalId);
    if (!m) return;
    m.hidden = false;
    document.body.classList.add("modal-open");
    // foca no primeiro botão de fechar (se existir)
    const closeBtn = qs(`[data-close="${modalId}"]`, m);
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modalId) {
    const m = $(modalId);
    if (!m) return;
    m.hidden = true;
    // se não tem nenhum modal aberto, remove classe
    const algumAberto = qsa(".modal").some(x => x.hidden === false);
    if (!algumAberto) document.body.classList.remove("modal-open");
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // =========================
  // CORE FALLBACKS (caso core.js não tenha algo)
  // =========================
  const START_DATE_ISO_DEFAULT = "2026-02-24"; // Dia 1
  function getDataInicioISO() {
    const iso = localStorage.getItem(START_OVERRIDE_KEY);
    if (iso && /^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
    return START_DATE_ISO_DEFAULT;
  }

  function getForcedDayFallback() {
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

  function diffDiasFallback() {
    const iso = getDataInicioISO();
    const start = new Date(iso + "T00:00:00");
    const hoje = new Date();
    const H = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const I = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    return Math.floor((H - I) / (1000 * 60 * 60 * 24));
  }

  function getAtoFallback(dia) {
    if (dia >= 1 && dia <= 30) return 1;
    if (dia >= 31 && dia <= 90) return 2;
    if (dia >= 91 && dia <= 150) return 3;
    if (dia >= 151 && dia <= 240) return 4;
    if (dia >= 241 && dia <= 330) return 5;
    return 6;
  }

  function getFaixaAtoFallback(dia) {
    const ato = getAtoFallback(dia);
    if (ato === 1) return { start: 1, end: 30 };
    if (ato === 2) return { start: 31, end: 90 };
    if (ato === 3) return { start: 91, end: 150 };
    if (ato === 4) return { start: 151, end: 240 };
    if (ato === 5) return { start: 241, end: 330 };
    return { start: 331, end: 365 };
  }

  function setTemaPorAtoFallback(dia) {
    const ato = getAtoFallback(dia);
    document.body.setAttribute("data-ato", String(ato));
    // aura progress
    const { start, end } = getFaixaAtoFallback(dia);
    const denom = Math.max(1, (end - start));
    const t = (dia - start) / denom;
    const clamped = Math.max(0, Math.min(1, t));
    document.documentElement.style.setProperty("--auraT", clamped.toFixed(4));

    // ato2 gap (linhas se aproximando)
    if (ato !== 2) {
      document.documentElement.style.setProperty("--ato2Gap", "44px");
    } else {
      const aStart = 31, aEnd = 90;
      const denom2 = Math.max(1, (aEnd - aStart));
      const t2 = Math.max(0, Math.min(1, (dia - aStart) / denom2));
      const gap = 44 - (34 * t2); // 44 -> 10
      document.documentElement.style.setProperty("--ato2Gap", `${gap.toFixed(2)}px`);
    }
  }

  function setDayAttrFallback(dia) {
    if (Number.isFinite(dia) && dia >= 0 && dia <= 365) {
      document.body.setAttribute("data-dia", String(dia));
    } else {
      document.body.removeAttribute("data-dia");
    }
  }

  // wrappers (usa core.js se existir)
  function getForcedDay() {
    return (typeof window.getForcedDay === "function") ? window.getForcedDay() : getForcedDayFallback();
  }
  function diffDias() {
    return (typeof window.diffDias === "function") ? window.diffDias() : diffDiasFallback();
  }
  function getAto(dia) {
    return (typeof window.getAto === "function") ? window.getAto(dia) : getAtoFallback(dia);
  }
  function getFaixaAto(dia) {
    return (typeof window.getFaixaAto === "function") ? window.getFaixaAto(dia) : getFaixaAtoFallback(dia);
  }
  function setTemaPorAto(dia) {
    return (typeof window.setTemaPorAto === "function") ? window.setTemaPorAto(dia) : setTemaPorAtoFallback(dia);
  }
  function setDayAttr(dia) {
    return (typeof window.setDayAttr === "function") ? window.setDayAttr(dia) : setDayAttrFallback(dia);
  }

  function calcularDia() {
    // dia “real”
    const d = diffDias();
    let dia = d + 1;
    if (dia < 0) dia = 0;
    if (dia > 365) dia = 365;
    return dia;
  }

  // =========================
  // DOM (do teu index modular)
  // =========================
  const dom = {
    // views
    loginView: $("loginView"),
    mainView: $("mainView"),

    // login
    loginForm: $("loginForm"),
    senhaInput: $("senhaInput"),
    loginMsg: $("loginMsg"),

    // topo
    titulo: $("titulo"),
    subfrase: $("subfrase"),

    // botões
    btnArquivo: $("btnArquivo"),
    btnMemoria: $("btnMemoria"),
    btnSaudade: $("btnSaudade"),
    btnSair: $("btnSair"),

    // labels
    diaLabel: $("diaLabel"),
    atoLabel: $("atoLabel"),

    // poema
    poema: $("poema"),
    cursor: $("cursor"),

    // ato2 linhas
    ato2Linhas: $("ato2Linhas"),

    // áreas de interatividade
    ato1Interacao: $("ato1Interacao"),
    ato2Interacao: $("ato2Interacao"),

    // toast
    toast: $("toast"),

    // modais
    memoriaModal: $("memoriaModal"),
    memoriaConteudo: $("memoriaConteudo"),

    saudadeModal: $("saudadeModal"),
    saudadeConteudo: $("saudadeConteudo"),

    arquivoModal: $("arquivoModal"),
    arquivoLista: $("arquivoLista"),
    arquivoBuscar: $("arquivoBuscar"),
    arquivoDia: $("arquivoDia"),
    btnIrDia: $("btnIrDia"),
  };

  // =========================
  // STATE
  // =========================
  let DIA_ATUAL = 1;
  let DIA_EM_TELA = 1;

  // =========================
  // TYPEWRITER
  // =========================
  let typingTimer = null;

  function setCursor(on) {
    if (!dom.cursor) return;
    dom.cursor.style.opacity = on ? "1" : "0";
  }

  function typeText(targetEl, text, speed = TYPE_SPEED, onDone = null) {
    if (!targetEl) return;
    clearTimeout(typingTimer);

    const t = String(text ?? "");
    targetEl.textContent = "";
    setCursor(true);

    let i = 0;
    function step() {
      targetEl.textContent = t.slice(0, i);
      i++;
      if (i <= t.length) {
        typingTimer = setTimeout(step, speed);
      } else {
        setCursor(false);
        if (typeof onDone === "function") onDone();
      }
    }
    step();
  }

  // =========================
  // FRASE CONTEXTO + RETORNO
  // =========================
  function aplicarFrasePorHorario() {
    if (!dom.subfrase) return;
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) dom.subfrase.textContent = "Que seu dia seja leve. Eu já escolhi você hoje.";
    else if (hora >= 12 && hora < 18) dom.subfrase.textContent = "No meio do seu dia, eu ainda penso em você.";
    else if (hora >= 18 && hora < 23) dom.subfrase.textContent = "Eu gosto quando você vem aqui no fim do dia.";
    else dom.subfrase.textContent = "Eu gosto quando você aparece antes de dormir.";
  }

  function verificarRetorno() {
    if (!dom.subfrase) return;
    const hoje = new Date().toDateString();
    const key = "projeto365_visita";
    const ultima = localStorage.getItem(key);
    if (ultima === hoje) dom.subfrase.textContent += " Você voltou. Eu gosto disso.";
    localStorage.setItem(key, hoje);
  }

  // =========================
  // TOAST (segredos)
  // =========================
  function mostrarToast(texto) {
    if (!dom.toast) return;
    dom.toast.textContent = texto;
    dom.toast.classList.add("show");
    clearTimeout(window.__toastHide);
    window.__toastHide = setTimeout(() => dom.toast.classList.remove("show"), 4200);
  }

  function pickSegredoFallback() {
    if (Array.isArray(window.SEGREDOS) && window.SEGREDOS.length) {
      return window.SEGREDOS[Math.floor(Math.random() * window.SEGREDOS.length)];
    }
    return "";
  }

  function iniciarSegredoInatividade() {
    function reset() {
      clearTimeout(window.__idleTimer);
      window.__idleTimer = setTimeout(() => {
        if (document.hidden) return;

        const last = Number(localStorage.getItem(TOAST_COOLDOWN_KEY) || 0);
        const now = Date.now();
        if (now - last < TOAST_COOLDOWN_MS) return;

        localStorage.setItem(TOAST_COOLDOWN_KEY, String(now));
        const txt = (typeof window.pickSegredo === "function") ? window.pickSegredo() : pickSegredoFallback();
        if (txt) mostrarToast(txt);
      }, TOAST_IDLE_MS);
    }

    if (window.__segredoInit) {
      reset();
      return;
    }
    window.__segredoInit = true;

    window.addEventListener("mousemove", reset, { passive: true });
    window.addEventListener("keydown", reset);
    window.addEventListener("touchstart", reset, { passive: true });
    window.addEventListener("scroll", reset, { passive: true });
    document.addEventListener("visibilitychange", () => { if (!document.hidden) reset(); });
    window.addEventListener("focus", reset);

    reset();
  }

  // =========================
  // ATO LABEL (bonitinho)
  // =========================
  function nomeAto(ato) {
    if (ato === 1) return "Ato 1 — Escolha";
    if (ato === 2) return "Ato 2 — Conexão";
    if (ato === 3) return "Ato 3 — Fogo";
    if (ato === 4) return "Ato 4 — Crescimento";
    if (ato === 5) return "Ato 5 — Raiz";
    return "Ato 6 — Recomeço";
  }

  function setMetaLabels(dia) {
    if (dom.diaLabel) {
      dom.diaLabel.textContent = (dia <= 0) ? "Antes do primeiro poema" : `Dia ${dia} de 365`;
    }
    if (dom.atoLabel) {
      dom.atoLabel.textContent = (dia <= 0) ? "" : nomeAto(getAto(dia));
    }
  }

  // =========================
  // INTRO DE ATO (transição)
  // =========================
  function introKeyForDay(dia) { return `${INTRO_KEY_PREFIX}${dia}`; }

  function deveMostrarIntro(dia) {
    if (!window.INTRO_ATOS) return false;
    if (!window.INTRO_ATOS[dia]) return false;
    if (dia !== DIA_ATUAL) return false;
    return localStorage.getItem(introKeyForDay(dia)) !== "1";
  }

  function marcarIntroComoVista(dia) {
    localStorage.setItem(introKeyForDay(dia), "1");
  }

  function renderIntroAto(dia) {
    const info = window.INTRO_ATOS?.[dia];
    if (!info) return false;

    // coloca o intro dentro da área ato2Interacao (fica “no meio do conteúdo”)
    if (!dom.ato2Interacao) return false;

    dom.ato2Interacao.innerHTML = `
      <div class="intro-ato-box">
        <div class="intro-ato-tag">${escapeHtml(info.tag || "Novo Ato")}</div>
        <div class="intro-ato-text">${escapeHtml(info.texto || "")}</div>
        <button type="button" id="btnContinuarIntro">Continuar</button>
      </div>
    `;

    const btn = $("btnContinuarIntro");
    if (btn) {
      btn.onclick = () => {
        marcarIntroComoVista(dia);
        dom.ato2Interacao.innerHTML = "";
        carregarPoema(dia);
      };
    }

    // limpa poema enquanto intro tá ativo
    dom.poema.textContent = "";
    setCursor(false);
    return true;
  }

  // =========================
  // ATO 1 — INTERATIVIDADE
  // =========================
  function getAto1UnlockKey() {
    return window.ATO1_UNLOCK_KEY || "projeto365_ato1_unlock";
  }

  function getAto1Unlocked() {
    const raw = Number(localStorage.getItem(getAto1UnlockKey()) || 0);
    if (!Number.isFinite(raw)) return 0;
    return Math.max(0, Math.min(30, Math.floor(raw)));
  }

  function setAto1Unlocked(n) {
    const v = Math.max(0, Math.min(30, Math.floor(n)));
    localStorage.setItem(getAto1UnlockKey(), String(v));
  }

  function renderAto1Interacao(dia) {
    if (!dom.ato1Interacao) return;

    // só Ato 1
    if (dia < 1 || dia > 30) {
      dom.ato1Interacao.innerHTML = "";
      return;
    }

    const unlocked = getAto1Unlocked();
    if (dia > unlocked) {
      dom.ato1Interacao.innerHTML = "";
      return;
    }

    const palavras = window.ATO1_PALAVRAS || [];
    const palavra = palavras[dia - 1] || "";

    // dia 30: montagem (se já liberou 30)
    if (dia === 30 && unlocked >= 30) {
      const frase = palavras.map(w => `<span class="ato1-word">${escapeHtml(w)}</span>`).join(" ");
      dom.ato1Interacao.innerHTML = `
        <div class="ato1-box">
          <div class="ato1-label">ENTRELINHAS</div>
          <div class="ato1-montagem">${frase}</div>
        </div>
      `;
      return;
    }

    dom.ato1Interacao.innerHTML = `
      <div class="ato1-box">
        <div class="ato1-label">ENTRELINHAS</div>
        <div class="ato1-palavra">${escapeHtml(palavra)}</div>
      </div>
    `;
  }

  // =========================
  // ATO 2 — LINHAS (DOM do teu index)
  // =========================
  function renderAto2Linhas(dia) {
    if (!dom.ato2Linhas) return;

    const ato = getAto(dia);
    if (ato !== 2) {
      dom.ato2Linhas.innerHTML = "";
      dom.ato2Linhas.setAttribute("aria-hidden", "true");
      return;
    }

    dom.ato2Linhas.setAttribute("aria-hidden", "false");
    // deixa o CSS fazer a mágica; aqui só garante os elementos
    if (!dom.ato2Linhas.children.length) {
      dom.ato2Linhas.innerHTML = `
        <div class="ato2Line"></div>
        <div class="ato2Line"></div>
      `;
    }
  }

  // =========================
  // ATO 2/3 — palavra sublinhada + pensamento
  // =========================
  function pickUnderlineTarget(text) {
    const t = String(text || "");

    const candidates = [
      "presença","verdade","silêncio","calma","paz","casa","cuidado","confiança","honesto","honestidade",
      "futuro","conversar","orgulho","perto","voltar","ficar","fica","leve","luz","simples","cotidiano",
      "detalhe","respirar","manso","seguro","aprender",
      "desejo","pele","olhar","fogo","corpo"
    ];

    function escRe(w) { return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

    for (const w of candidates) {
      const re = new RegExp(`\\b${escRe(w)}\\b`, "i");
      const m = t.match(re);
      if (m && typeof m.index === "number") {
        return { word: t.slice(m.index, m.index + m[0].length), idx: m.index };
      }
    }

    // fallback: maior palavra boa
    const stop = new Set(["quando","porque","ainda","mesmo","sobre","entre","depois","antes","agora","assim","isso","aquilo","muito","pouco","tudo","nunca","sempre","também","apenas","pra","para","com","sem","que","uma","um","e","o","a","os","as","no","na","nos","nas","do","da","dos","das","eu","você","voce"]);
    const rx = /[A-Za-zÀ-ÿ]{5,}/g;
    let best = null;

    for (const m of t.matchAll(rx)) {
      const w = (m[0] || "").toLowerCase();
      if (stop.has(w)) continue;
      const score = m[0].length + (["ção","dade","mente"].some(suf => w.endsWith(suf)) ? 2 : 0);
      if (!best || score > best.score) best = { word: m[0], idx: m.index, score };
    }

    if (best && typeof best.idx === "number") return { word: best.word, idx: best.idx };
    return null;
  }

  function buildAto2ThoughtFromKeyword(keywordRaw, poemRaw) {
    const k = (keywordRaw || "").toLowerCase();
    const poem = (poemRaw || "").toLowerCase();

    const map = [
      { keys: ["presença", "presenca"], out: "presença é quando eu fico — mesmo sem barulho." },
      { keys: ["verdade"], out: "verdade é isso: não fazer cena… só ficar." },
      { keys: ["silêncio", "silencio"], out: "no teu silêncio eu não me perco — eu descanso." },
      { keys: ["calma", "paz"], out: "com você, calma não é intervalo — é destino." },
      { keys: ["casa"], out: "casa é quando o peito para de se defender." },
      { keys: ["cuidado"], out: "cuidado é te escolher no detalhe, sem pressa." },
      { keys: ["confiança", "confianca"], out: "confiança é deixar a mão aberta — e ainda assim ficar." },
      { keys: ["honesto", "honestidade"], out: "eu quero te amar do jeito mais honesto que eu tiver." },
      { keys: ["futuro"], out: "pensar em futuro contigo me dá silêncio bom por dentro." },
      { keys: ["conversar"], out: "se doer, eu volto pra conversa. eu volto pra nós." },
      { keys: ["orgulho"], out: "eu prefiro nós ao meu orgulho." },
      { keys: ["perto"], out: "perto é onde eu fico mais simples." },
      { keys: ["voltar"], out: "eu sempre volto pro que importa." },
      { keys: ["ficar", "fica"], out: "eu fico quando não tem plateia." },
      { keys: ["leve"], out: "eu tô aprendendo a ser leve contigo — sem fugir de nada." },
      { keys: ["luz"], out: "eu não quero incêndio. eu quero luz." },
      { keys: ["simples", "cotidiano"], out: "o simples contigo vira raro." },
      { keys: ["detalhe"], out: "é no detalhe que eu percebo: eu tô aqui." },
      { keys: ["respirar"], out: "quando você aparece, eu respiro melhor." },
      { keys: ["seguro"], out: "você me deixa seguro do jeito mais calmo." },
      { keys: ["aprender"], out: "eu aprendo a te amar melhor — um dia de cada vez." },
    ];

    for (const row of map) {
      if (row.keys.some(x => k.includes(x))) return row.out;
    }

    if (poem.includes("não") && (poem.includes("promessa") || poem.includes("prometer"))) {
      return "eu não prometo alto. eu provo no dia comum.";
    }
    if (poem.includes("silêncio") || poem.includes("silencio")) {
      return "eu gosto quando o silêncio não vira distância.";
    }
    return "eu fico — do jeito mais calmo que eu sei.";
  }

  function pickAto3Thought(keyword) {
    const map = {
      "desejo": "amar você também é desejar você.",
      "perto": "quando você chega perto o mundo fica menor.",
      "pele": "tem algo na sua pele que acende tudo aqui.",
      "olhar": "seu olhar às vezes me desmonta.",
      "fogo": "eu tento parecer calmo… mas por dentro pega fogo.",
      "respirar": "tem horas que eu esqueço de respirar direito perto de você.",
      "silêncio": "o silêncio entre nós também é intensidade.",
      "silencio": "o silêncio entre nós também é intensidade.",
      "corpo": "às vezes eu sinto você antes mesmo de tocar."
    };

    for (const k in map) {
      if (keyword.includes(k)) return map[k];
    }

    const fallback = [
      "às vezes o que eu sinto por você passa do que cabe em silêncio.",
      "tem algo em você que acende tudo aqui dentro.",
      "eu tento parecer calmo… mas por dentro pega fogo.",
      "tem coisas que eu sinto por você que nem poesia explica."
    ];
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  function ensureThoughtBox() {
    if (!dom.ato2Interacao) return null;
    let box = qs("#thoughtBox", dom.ato2Interacao);
    if (!box) {
      dom.ato2Interacao.insertAdjacentHTML(
        "beforeend",
        `<div id="thoughtBox" class="thought-box" hidden></div>`
      );
      box = qs("#thoughtBox", dom.ato2Interacao);
    }
    return box;
  }

  function openThought(text) {
    const box = ensureThoughtBox();
    if (!box) return;

    box.textContent = text;
    box.hidden = false;
    box.classList.remove("show");
    void box.offsetWidth;
    box.classList.add("show");

    clearTimeout(window.__thoughtTimer);
    window.__thoughtTimer = setTimeout(() => closeThought(), 5200);
  }

  function closeThought() {
    const box = ensureThoughtBox();
    if (!box) return;
    if (box.hidden) return;

    box.classList.remove("show");
    clearTimeout(window.__thoughtTimer);
    setTimeout(() => {
      box.hidden = true;
      box.textContent = "";
    }, 160);
  }

  function applyUnderlineThought(dia, rawText) {
    const ato = getAto(dia);
    if (ato !== 2 && ato !== 3) return;
    if (!rawText || !rawText.trim()) return;

    const target = pickUnderlineTarget(rawText);
    if (!target) return;

    const before = escapeHtml(rawText.slice(0, target.idx));
    const word = escapeHtml(target.word);
    const after = escapeHtml(rawText.slice(target.idx + target.word.length));

    const thought = (ato === 2)
      ? buildAto2ThoughtFromKeyword(target.word, rawText)
      : pickAto3Thought(String(target.word).toLowerCase());

    const cls = (ato === 2) ? "ato2U" : "ato3U";
    dom.poema.innerHTML = `${before}<span class="${cls}" data-thought="${escapeHtml(thought)}">${word}</span>${after}`;

    const u = qs(`.${cls}`, dom.poema);
    if (u) {
      u.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openThought(u.getAttribute("data-thought") || "");
      }, { passive: false });
    }
  }

  // fecha thought clicando fora / esc
  document.addEventListener("pointerdown", (e) => {
    const box = ensureThoughtBox();
    if (!box || box.hidden) return;

    if (box.contains(e.target)) return;
    if (dom.poema?.querySelector(".ato2U")?.contains(e.target)) return;
    if (dom.poema?.querySelector(".ato3U")?.contains(e.target)) return;

    closeThought();
  }, true);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeThought();
  });

  // =========================
  // POEMA + EXTRAS
  // =========================
  function getPoema(dia) {
    if (typeof window.getPoemaDoDia === "function") return window.getPoemaDoDia(dia) || "";
    return "Ainda não carregou getPoemaDoDia().";
  }

  function getPrefacio() {
    if (typeof window.PREFACIO === "string" && window.PREFACIO.trim()) return window.PREFACIO;
    // fallback
    return "Antes do primeiro dia, existe a intenção.\nNão é pressa — é constância.\n\nUm poema por dia.\nUm jeito calmo de dizer:\n“eu escolhi ficar.”";
  }

  function afterPoemTyped(dia, rawText) {
    const forced = getForcedDay();
    const isTest = (forced !== null);

    // progresso do Ato 1 (igual o antigão)
    if (!isTest && dia === DIA_ATUAL && dia >= 1 && dia <= 30) {
      const cur = getAto1Unlocked();
      if (dia > cur) setAto1Unlocked(dia);
    }

    renderAto1Interacao(dia);
    renderAto2Linhas(dia);

    // aplica underline (Ato2/Ato3) depois do type (pra não brigar com textContent)
    applyUnderlineThought(dia, rawText);

    // memórias: habilita botão
    syncMemoriaButton();
  }

  function renderDay(dia) {
    DIA_EM_TELA = dia;

    setTemaPorAto(dia);
    setDayAttr(dia);
    setMetaLabels(dia);

    // limpa interações “depois”
    if (dom.ato1Interacao) dom.ato1Interacao.innerHTML = "";
    if (dom.ato2Interacao) dom.ato2Interacao.innerHTML = "";
    closeThought();
    renderAto2Linhas(dia);

    if (dia <= 0) {
      typeText(dom.poema, getPrefacio(), TYPE_SPEED);
      return;
    }

    const texto = getPoema(dia);
    typeText(dom.poema, texto, TYPE_SPEED, () => afterPoemTyped(dia, texto));
  }

  function detectarPrimeiroPlaceholder() {
    try {
      // modular: window.POEMAS (opcional)
      if (Array.isArray(window.POEMAS)) {
        const idx = window.POEMAS.findIndex(p => (p || "").includes("(Em branco por enquanto)"));
        return (idx === -1) ? null : (idx + 1);
      }
      // legado: window.poemas (opcional)
      if (Array.isArray(window.poemas)) {
        const idx = window.poemas.findIndex(p => (p || "").includes("(Em branco por enquanto)"));
        return (idx === -1) ? null : (idx + 1);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function carregarHoje() {
    const forced = getForcedDay();
    DIA_ATUAL = (forced !== null) ? forced : calcularDia();

    aplicarFrasePorHorario();
    verificarRetorno();
    iniciarSegredoInatividade();

    // debug: avisar placeholder (só no modo teste)
    if (forced !== null) {
      const firstPH = detectarPrimeiroPlaceholder();
      if (firstPH && firstPH <= 150) {
        mostrarToast(`Aviso (teste): achei placeholder a partir do Dia ${firstPH}.`);
      }
    }

    // unlock de ato 1 também no teste (pra você conseguir ver)
    if (forced !== null && DIA_ATUAL >= 1 && DIA_ATUAL <= 30) {
      const cur = getAto1Unlocked();
      if (DIA_ATUAL > cur) setAto1Unlocked(DIA_ATUAL);
    }

    // intro de ato (uma vez no dia real)
    if (deveMostrarIntro(DIA_ATUAL)) {
      setTemaPorAto(DIA_ATUAL);
      setDayAttr(DIA_ATUAL);
      setMetaLabels(DIA_ATUAL);
      // render intro; ao clicar continua ele chama carregarPoema
      const ok = renderIntroAto(DIA_ATUAL);
      if (ok) return;
    }

    renderDay(DIA_ATUAL);
  }

  function carregarPoema(dia) {
    // usado por arquivo (abrir por dia)
    renderDay(dia);
  }

  // =========================
  // ARQUIVO (poemas antigos)
  // =========================
  function primeiraLinha(texto) {
    if (!texto) return "Sem título";
    const linha = String(texto).split("\n")[0].trim();
    return linha || "Sem título";
  }

  function tituloParaLista(dia) {
    const texto = getPoema(dia);
    let t = primeiraLinha(texto);
    if (t.length > 60) t = t.slice(0, 60).trim() + "…";
    return t;
  }

  function buildArquivoList(maxDay) {
    if (!dom.arquivoLista) return;
    dom.arquivoLista.innerHTML = "";

    // lista do mais recente pro mais antigo
    for (let d = maxDay; d >= 1; d--) {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "arquivo-item";
      item.dataset.day = String(d);

      item.innerHTML = `
        <div class="arquivo-item-dia">Dia ${d}</div>
        <div class="arquivo-item-titulo">${escapeHtml(tituloParaLista(d))}</div>
      `;

      item.onclick = () => {
        closeModal("arquivoModal");
        carregarPoema(d);
      };

      dom.arquivoLista.appendChild(item);
    }
  }

  function filtrarArquivo(query) {
    if (!dom.arquivoLista) return;
    const q = String(query || "").trim().toLowerCase();
    const items = qsa(".arquivo-item", dom.arquivoLista);

    if (!q) {
      items.forEach(i => i.hidden = false);
      return;
    }

    items.forEach((i) => {
      const dia = i.dataset.day || "";
      const titulo = qs(".arquivo-item-titulo", i)?.textContent || "";
      const match = (dia.includes(q) || titulo.toLowerCase().includes(q));
      i.hidden = !match;
    });
  }

  function abrirArquivoModal() {
    // só mostra dias anteriores ao atual (igual teu “antigão”)
    const max = Math.max(1, Math.min(365, DIA_ATUAL - 1));
    buildArquivoList(max);
    if (dom.arquivoBuscar) dom.arquivoBuscar.value = "";
    if (dom.arquivoDia) dom.arquivoDia.value = "";
    openModal("arquivoModal");
  }

  // =========================
  // MEMÓRIA (modal)
  // =========================
  function isMemoryDay(d) {
    return d > 0 && d % 30 === 0 && d !== 365;
  }

  function syncMemoriaButton() {
    if (!dom.btnMemoria) return;

    // habilita quando já existe alguma memória liberada (>=30)
    dom.btnMemoria.disabled = (DIA_ATUAL < 30);
  }

  function abrirMemoriaModal() {
    if (!dom.memoriaConteudo) return;

    // se hoje é dia de memória (30/60/90/120/150...) e já chegou, mostra a memória do dia
    if (isMemoryDay(DIA_ATUAL)) {
      const texto = (typeof window.getMemoriaDoDia === "function") ? (window.getMemoriaDoDia(DIA_ATUAL) || "") : "";
      dom.memoriaConteudo.textContent = texto && texto.trim() ? texto : "Em breve...";
      openModal("memoriaModal");
      return;
    }

    // se não é dia de memória: mostra a última liberada
    const last = Math.floor(DIA_ATUAL / 30) * 30;
    if (last >= 30) {
      const texto = (typeof window.getMemoriaDoDia === "function") ? (window.getMemoriaDoDia(last) || "") : "";
      dom.memoriaConteudo.innerHTML =
        `<div class="muted" style="margin-bottom:10px;">Hoje não é dia de memória. Última liberada: Dia ${last}.</div>` +
        `<div style="white-space:pre-wrap;">${escapeHtml(texto && texto.trim() ? texto : "Em breve...")}</div>`;
      openModal("memoriaModal");
      return;
    }

    dom.memoriaConteudo.textContent = "A primeira memória libera no Dia 30.";
    openModal("memoriaModal");
  }

  // =========================
  // SAUDADE (modal)
  // =========================
  function abrirSaudadeModal() {
    if (dom.saudadeConteudo) {
      dom.saudadeConteudo.style.whiteSpace = "pre-wrap";
      dom.saudadeConteudo.textContent = SAUDADE_TEXTO;
    }
    openModal("saudadeModal");
  }

  // =========================
  // LOGIN + LOGOUT
  // =========================
  function entrar() {
    hideView(dom.loginView);
    showView(dom.mainView);
    carregarHoje();
  }

  function sair() {
    // limpa só o “estado de sessão” (não apaga progressos do projeto)
    hideView(dom.mainView);
    showView(dom.loginView);
    if (dom.senhaInput) dom.senhaInput.value = "";
    if (dom.loginMsg) dom.loginMsg.textContent = "";
    // opcional: fecha modais
    ["memoriaModal", "saudadeModal", "arquivoModal"].forEach(closeModal);
  }

  // =========================
  // EVENTS
  // =========================
  function bindEvents() {
    // login submit
    if (dom.loginForm) {
      dom.loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const senha = (dom.senhaInput?.value || "").trim();

        if (senha === SENHA_CORRETA) {
          if (dom.loginMsg) dom.loginMsg.textContent = "";
          entrar();
        } else {
          if (dom.loginMsg) dom.loginMsg.textContent = "Senha incorreta.";
        }
      });
    }

    // botões topo
    if (dom.btnArquivo) dom.btnArquivo.addEventListener("click", abrirArquivoModal);
    if (dom.btnMemoria) dom.btnMemoria.addEventListener("click", abrirMemoriaModal);
    if (dom.btnSaudade) dom.btnSaudade.addEventListener("click", abrirSaudadeModal);
    if (dom.btnSair) dom.btnSair.addEventListener("click", sair);

    // fechar modais via data-close
    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const close = t.getAttribute("data-close");
      if (close) closeModal(close);
    });

    // ESC fecha modais
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      // fecha o último modal aberto que achar
      const aberto = qsa(".modal").filter(m => m.hidden === false);
      if (!aberto.length) return;
      const last = aberto[aberto.length - 1];
      closeModal(last.id);
    });

    // arquivo: busca
    if (dom.arquivoBuscar) {
      dom.arquivoBuscar.addEventListener("input", () => {
        filtrarArquivo(dom.arquivoBuscar.value);
      });
    }

    // arquivo: ir pro dia
    if (dom.btnIrDia) {
      dom.btnIrDia.addEventListener("click", () => {
        const n = Number(dom.arquivoDia?.value || "");
        if (!Number.isFinite(n) || n < 1 || n > 365) {
          mostrarToast("Escolhe um dia válido (1–365).");
          return;
        }
        closeModal("arquivoModal");
        carregarPoema(Math.floor(n));
      });
    }
  }

  // =========================
  // BOOT
  // =========================
  function boot() {
    bindEvents();

    // inicial: deixa login visível, main escondido (como teu HTML)
    // mas se você estiver em modo teste (?day=), ainda assim exige senha (igual teu apego emocional)
    syncMemoriaButton();

    // se você quiser auto-entrar em dev, descomenta isso:
    // if (location.hostname === "localhost") entrar();
  }

  boot();
})();
