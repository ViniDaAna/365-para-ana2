// js/app.js
// Projeto 365 — App (UI + fluxo)
// Baseado no "antigão" (visual/comportamento), mas organizado.
// Depende de:
// - js/core.js  (calcularDia, setTemaPorAto, setDayAttr, getAto, getForcedDay, diffDias...)
// - data/segredos.js (SEGREDOS, pickSegredo, INTRO_ATOS, ATO1_PALAVRAS, ATO1_UNLOCK_KEY)
// - poemas.js (getPoemaDoDia, getMemoriaDoDia, getCartaCapsula365)

(function () {
  "use strict";

  // =========================
  // CONFIG
  // =========================
  const SENHA_CORRETA = "10022024";

  // Toast de inatividade
  const TOAST_COOLDOWN_KEY = "projeto365_toast";
  const TOAST_COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2h
  const TOAST_IDLE_MS = 10000; // 10s

  // Cápsula 365
  const CAPSULA_OPEN_KEY = "projeto365_capsula_365_aberta";
  const START_OVERRIDE_KEY = "projeto365_start_override";

  // Estado (espelha o antigão)
  let DIA_EM_TELA = 1;

  // =========================
  // DOM
  // =========================
  const $ = (id) => document.getElementById(id);

  const el = {
    login: $("login"),
    conteudo: $("conteudo"),

    cornerDateLogin: $("cornerDateLogin"),
    cornerDate: $("cornerDate"),

    senha: $("senha"),

    fraseContexto: $("fraseContexto"),
    modoTeste: $("modoTeste"),
    avisoPoema: $("avisoPoema"),

    tituloTopo: $("tituloTopo"),
    blocoTexto: $("blocoTexto"),

    introAtoBox: $("introAtoBox"),
    introAtoTag: $("introAtoTag"),
    introAtoTexto: $("introAtoTexto"),
    btnContinuarAto: $("btnContinuarAto"),

    ato2Linhas: $("ato2Linhas"),
    ato2ThoughtBox: $("ato2ThoughtBox"),

    poema: $("poema"),
    meta: $("meta"),

    ato1Chave: $("ato1Chave"),
    ato1Palavra: $("ato1Palavra"),
    ato1Montagem: $("ato1Montagem"),

    capsulaTrigger: $("capsulaTrigger"),
    btnAbrirCapsula: $("btnAbrirCapsula"),

    arquivoBox: $("arquivoBox"),
    memoriasBox: $("memoriasBox"),
    arquivoSub: $("arquivoSub"),
    memoriasSub: $("memoriasSub"),
    rangeRow: $("rangeRow"),
    listaArquivo: $("listaArquivo"),
    listaMemorias: $("listaMemorias"),

    botoesNormal: $("botoesNormal"),
    botoesArquivo: $("botoesArquivo"),

    saudade: $("saudade"),

    capsulaPage: $("capsulaPage"),
    btnCapsulaVoltar: $("btnCapsulaVoltar"),
    notebook: $("notebook"),
    capsulaCarta: $("capsulaCarta"),
    capsulaFecho: $("capsulaFecho"),
    btnEscolherDeNovo: $("btnEscolherDeNovo"),

    memoriaPage: $("memoriaPage"),
    btnMemoriaVoltar: $("btnMemoriaVoltar"),
    memoriaPaperTitle: $("memoriaPaperTitle"),
    memoriaPaperMeta: $("memoriaPaperMeta"),
    memoriaPageTexto: $("memoriaPageTexto"),

    toastSegredo: $("toastSegredo"),
    fadeOverlay: $("fadeOverlay"),
  };

  // =========================
  // HELPERS UI
  // =========================
  function show(elm) { if (elm) elm.classList.remove("hidden"); }
  function hide(elm) { if (elm) elm.classList.add("hidden"); }

  function setText(elm, txt) { if (elm) elm.textContent = (txt ?? ""); }

  function revelarBloco() {
    if (!el.blocoTexto) return;
    el.blocoTexto.classList.remove("show");
    void el.blocoTexto.offsetWidth;
    el.blocoTexto.classList.add("show");
  }

  function animarFolha(direcao) {
    if (!el.conteudo) return;
    el.conteudo.classList.remove("pageflip-in", "pageflip-out");
    void el.conteudo.offsetWidth;
    el.conteudo.classList.add(direcao === "in" ? "pageflip-in" : "pageflip-out");

    clearTimeout(window.__flipTimer);
    window.__flipTimer = setTimeout(() => {
      el.conteudo.classList.remove("pageflip-in", "pageflip-out");
    }, 520);
  }

  // =========================
  // DATAS (corner)
  // =========================
  function setCornerDates() {
    const agora = new Date();
    const dd = String(agora.getDate()).padStart(2, "0");
    const mm = String(agora.getMonth() + 1).padStart(2, "0");
    const yyyy = agora.getFullYear();
    const data = `${dd}/${mm}/${yyyy}`;
    if (el.cornerDateLogin) el.cornerDateLogin.innerText = data;
    if (el.cornerDate) el.cornerDate.innerText = data;
  }

  // =========================
  // FRASE POR HORÁRIO + RETORNO
  // =========================
  function aplicarFrasePorHorario() {
    if (!el.fraseContexto) return;
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) el.fraseContexto.innerText = "Que seu dia seja leve. Eu já escolhi você hoje.";
    else if (hora >= 12 && hora < 18) el.fraseContexto.innerText = "No meio do seu dia, eu ainda penso em você.";
    else if (hora >= 18 && hora < 23) el.fraseContexto.innerText = "Eu gosto quando você vem aqui no fim do dia.";
    else el.fraseContexto.innerText = "Eu gosto quando você aparece antes de dormir.";
  }

  function verificarRetorno() {
    if (!el.fraseContexto) return;
    const hoje = new Date().toDateString();
    const key = "projeto365_visita";
    const ultima = localStorage.getItem(key);
    if (ultima === hoje) {
      el.fraseContexto.innerText += " Você voltou. Eu gosto disso.";
    }
    localStorage.setItem(key, hoje);
  }

  // =========================
  // MODO TESTE UI
  // =========================
  function showModoTeste(diaForced) {
    if (!el.modoTeste) return;
    if (diaForced === null) {
      hide(el.modoTeste);
      el.modoTeste.textContent = "";
      return;
    }
    show(el.modoTeste);
    el.modoTeste.textContent = `Modo teste ativo: Dia ${diaForced}. (URL: ?day=${diaForced})`;
  }

  function showAvisoPoema(text) {
    if (!el.avisoPoema) return;
    if (!text) {
      hide(el.avisoPoema);
      el.avisoPoema.textContent = "";
      return;
    }
    show(el.avisoPoema);
    el.avisoPoema.textContent = text;
  }

  function detectarPrimeiroPlaceholder() {
    // funciona com poemas.js antigo (array poemas) OU com POEMAS modular
    try {
      if (Array.isArray(window.poemas)) {
        const idx = window.poemas.findIndex(p => (p || "").includes("(Em branco por enquanto)"));
        return (idx === -1) ? null : (idx + 1);
      }
      if (Array.isArray(window.POEMAS)) {
        const idx = window.POEMAS.findIndex(p => (p || "").includes("(Em branco por enquanto)"));
        return (idx === -1) ? null : (idx + 1);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // =========================
  // TYPEWRITER
  // =========================
  let typingTimer = null;

  function typeText(targetEl, text, speed = 12, onDone = null) {
    if (!targetEl) return;
    clearTimeout(typingTimer);
    targetEl.textContent = "";
    const t = String(text ?? "");
    let i = 0;

    function step() {
      targetEl.textContent = t.slice(0, i);
      i++;
      if (i <= t.length) typingTimer = setTimeout(step, speed);
      else if (typeof onDone === "function") onDone();
    }
    step();
  }

  function typeTextHuman(targetEl, text, opts = {}) {
    if (!targetEl) return;
    const {
      minDelay = 34,
      maxDelay = 68,
      mistakeChance = 0.06,
      maxBackspace = 4,
      pauseChance = 0.05,
      minPause = 220,
      maxPause = 520,
      scrollContainer = null,
      onDone = null
    } = opts;

    clearTimeout(typingTimer);
    targetEl.textContent = "";
    const t = String(text ?? "");
    let i = 0;

    function rand(a, b) { return a + Math.random() * (b - a); }
    function nextDelay() { return Math.floor(rand(minDelay, maxDelay)); }
    function nextPause() { return Math.floor(rand(minPause, maxPause)); }
    function doScroll() {
      if (scrollContainer && typeof scrollContainer.scrollTop === "number") {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }

    function step() {
      if (Math.random() < pauseChance) {
        typingTimer = setTimeout(step, nextPause());
        return;
      }

      if (i > 6 && i < t.length - 6 && Math.random() < mistakeChance) {
        const current = targetEl.textContent;
        const n = Math.max(1, Math.floor(rand(1, maxBackspace + 1)));
        let j = 0;

        function back() {
          targetEl.textContent = targetEl.textContent.slice(0, -1);
          doScroll();
          j++;
          if (j < Math.min(n, current.length)) typingTimer = setTimeout(back, Math.floor(rand(26, 58)));
          else typingTimer = setTimeout(step, Math.floor(rand(90, 180)));
        }
        back();
        return;
      }

      targetEl.textContent = t.slice(0, i);
      i++;
      doScroll();

      if (i <= t.length) typingTimer = setTimeout(step, nextDelay());
      else {
        doScroll();
        if (typeof onDone === "function") onDone();
      }
    }

    step();
  }

  // =========================
  // TOAST (inatividade + cooldown)
  // =========================
  function mostrarToast(texto) {
    if (!el.toastSegredo) return;

    el.toastSegredo.textContent = texto;

    hide(el.toastSegredo);
    el.toastSegredo.classList.remove("show");
    void el.toastSegredo.offsetWidth;

    show(el.toastSegredo);
    el.toastSegredo.classList.add("show");

    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      el.toastSegredo.classList.remove("show");
      setTimeout(() => hide(el.toastSegredo), 250);
    }, 4200);
  }

  function iniciarSegredo() {
    function resetInatividade() {
      clearTimeout(window.__inatividadeTimer);
      window.__inatividadeTimer = setTimeout(() => {
        if (document.hidden) return;

        const last = Number(localStorage.getItem(TOAST_COOLDOWN_KEY) || 0);
        const now = Date.now();

        if (now - last >= TOAST_COOLDOWN_MS) {
          localStorage.setItem(TOAST_COOLDOWN_KEY, String(now));
          const texto = (typeof window.pickSegredo === "function") ? window.pickSegredo() : "";
          if (texto) mostrarToast(texto);
        }
      }, TOAST_IDLE_MS);
    }

    if (window.__segredoInit) {
      resetInatividade();
      return;
    }
    window.__segredoInit = true;

    window.addEventListener("mousemove", resetInatividade, { passive: true });
    window.addEventListener("keydown", resetInatividade);
    window.addEventListener("touchstart", resetInatividade, { passive: true });
    window.addEventListener("scroll", resetInatividade, { passive: true });

    document.addEventListener("visibilitychange", () => { if (!document.hidden) resetInatividade(); });
    window.addEventListener("focus", resetInatividade);

    resetInatividade();
  }

  // =========================
  // INTRO DE ATO
  // =========================
  function introKeyForDay(dia) { return `projeto365_intro_vista_${dia}`; }

  function deveMostrarIntro(dia) {
    if (dia !== window.DIA_ATUAL) return false;
    const map = window.INTRO_ATOS || {};
    if (!map[dia]) return false;
    return localStorage.getItem(introKeyForDay(dia)) !== "1";
  }

  function marcarIntroComoVista(dia) { localStorage.setItem(introKeyForDay(dia), "1"); }

  function esconderIntro() {
    if (!el.introAtoBox) return;
    hide(el.introAtoBox);
    setText(el.introAtoTexto, "");
  }

  function mostrarIntro(dia) {
    const map = window.INTRO_ATOS || {};
    const info = map[dia];
    if (!info) return;

    setText(el.introAtoTag, info.tag || "Novo Ato");
    setText(el.introAtoTexto, info.texto || "");
    show(el.introAtoBox);

    if (el.btnContinuarAto) {
      el.btnContinuarAto.onclick = () => {
        marcarIntroComoVista(dia);
        esconderIntro();
        carregarPoema(dia);
      };
    }
  }

  // =========================
  // ATO 1 — ENTRELINHAS
  // =========================
  function getAto1Unlocked() {
    const key = window.ATO1_UNLOCK_KEY || "projeto365_ato1_unlock";
    const raw = Number(localStorage.getItem(key) || 0);
    if (!Number.isFinite(raw)) return 0;
    return Math.max(0, Math.min(30, Math.floor(raw)));
  }

  function setAto1Unlocked(n) {
    const key = window.ATO1_UNLOCK_KEY || "projeto365_ato1_unlock";
    const clamped = Math.max(0, Math.min(30, Math.floor(n)));
    localStorage.setItem(key, String(clamped));
  }

  function esconderAto1UI(silencioso = false) {
    if (!el.ato1Chave || !el.ato1Palavra || !el.ato1Montagem) return;

    hide(el.ato1Chave);
    el.ato1Chave.setAttribute("aria-hidden", "true");
    setText(el.ato1Palavra, "");

    hide(el.ato1Montagem);
    el.ato1Montagem.classList.remove("show", "assemble");
    el.ato1Montagem.setAttribute("aria-hidden", "true");
    if (!silencioso) el.ato1Montagem.innerHTML = "";
  }

  function renderAto1Palavra(diaEmTela) {
    if (!el.ato1Chave || !el.ato1Palavra || !el.ato1Montagem) return;

    if (document.body.classList.contains("modo-arquivo") ||
        document.body.classList.contains("capsula-mode") ||
        document.body.classList.contains("memoria-mode")) {
      esconderAto1UI(true);
      return;
    }

    if (diaEmTela < 1 || diaEmTela > 30) {
      esconderAto1UI(true);
      return;
    }

    const unlocked = getAto1Unlocked();
    if (diaEmTela > unlocked) {
      esconderAto1UI(true);
      return;
    }

    const palavras = window.ATO1_PALAVRAS || [];
    const w = palavras[diaEmTela - 1] || "";
    setText(el.ato1Palavra, w);

    hide(el.ato1Montagem);
    el.ato1Montagem.classList.remove("show", "assemble");
    el.ato1Montagem.setAttribute("aria-hidden", "true");

    show(el.ato1Chave);
    el.ato1Chave.setAttribute("aria-hidden", "false");
  }

  function montarAto1FraseNoCentro() {
    if (!el.ato1Chave || !el.ato1Montagem) return;

    el.ato1Montagem.innerHTML = "";
    el.ato1Montagem.classList.remove("show", "assemble");

    hide(el.ato1Chave);
    el.ato1Chave.setAttribute("aria-hidden", "true");

    const palavras = window.ATO1_PALAVRAS || [];
    palavras.forEach((w, i) => {
      const s = document.createElement("span");
      s.className = "ato1Word";
      s.textContent = w;
      s.style.transitionDelay = `${60 + i * 28}ms`;
      el.ato1Montagem.appendChild(s);
    });

    show(el.ato1Montagem);
    el.ato1Montagem.setAttribute("aria-hidden", "false");

    void el.ato1Montagem.offsetWidth;
    el.ato1Montagem.classList.add("show");

    clearTimeout(window.__ato1AssembleTimer);
    window.__ato1AssembleTimer = setTimeout(() => {
      el.ato1Montagem.classList.add("assemble");
    }, 1100);
  }

  // =========================
  // ATO 2/3 — SUBLINHADO + THOUGHT BOX
  // (reaproveita seu thoughtbox do ato2 pra ato3 também)
  // =========================
  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function pickUnderlineTarget(text) {
    const t = String(text || "");

    const candidates = [
      "presença","verdade","silêncio","calma","paz","casa","cuidado","confiança","honesto","honestidade",
      "futuro","conversar","orgulho","perto","voltar","ficar","fica","leve","luz","simples","cotidiano",
      "detalhe","respirar","manso","seguro","aprender","desejo","pele","olhar","fogo","corpo"
    ];

    function escRe(w) { return w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
    function findWord(w) {
      const re = new RegExp(`\\b${escRe(w)}\\b`, "i");
      const m = t.match(re);
      if (m && typeof m.index === "number") return { word: t.slice(m.index, m.index + m[0].length), idx: m.index };
      return null;
    }

    for (const w of candidates) {
      const found = findWord(w);
      if (found) return found;
    }

    // fallback: maior palavra “boa”
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

  function openThought(text) {
    if (!el.ato2ThoughtBox) return;
    el.ato2ThoughtBox.textContent = text;

    show(el.ato2ThoughtBox);
    el.ato2ThoughtBox.setAttribute("aria-hidden", "false");

    el.ato2ThoughtBox.classList.remove("show");
    void el.ato2ThoughtBox.offsetWidth;
    el.ato2ThoughtBox.classList.add("show");

    clearTimeout(window.__thoughtTimer);
    window.__thoughtTimer = setTimeout(() => closeThought(), 5200);
  }

  function closeThought() {
    if (!el.ato2ThoughtBox) return;
    if (el.ato2ThoughtBox.classList.contains("hidden")) return;

    el.ato2ThoughtBox.classList.remove("show");
    clearTimeout(window.__thoughtTimer);

    setTimeout(() => {
      hide(el.ato2ThoughtBox);
      el.ato2ThoughtBox.setAttribute("aria-hidden", "true");
      el.ato2ThoughtBox.textContent = "";
    }, 180);
  }

  function esconderAto2UI(silencioso = false) {
    if (el.ato2Linhas) {
      hide(el.ato2Linhas);
      el.ato2Linhas.setAttribute("aria-hidden", "true");
    }
    if (!silencioso) closeThought();
  }

  function renderAto2UI(dia) {
    if (!el.ato2Linhas) return;

    if (document.body.classList.contains("modo-arquivo") ||
        document.body.classList.contains("capsula-mode") ||
        document.body.classList.contains("memoria-mode")) {
      esconderAto2UI(true);
      return;
    }

    if (window.getAto(dia) !== 2) {
      esconderAto2UI(true);
      return;
    }

    show(el.ato2Linhas);
    el.ato2Linhas.setAttribute("aria-hidden", "false");
  }

  function applyUnderlineThought(dia, rawText) {
    if (!el.poema) return;
    if (!rawText || !rawText.trim()) return;

    const ato = window.getAto(dia);
    if (ato !== 2 && ato !== 3) return;

    const target = pickUnderlineTarget(rawText);
    if (!target) return;

    const before = escapeHtml(rawText.slice(0, target.idx));
    const word = escapeHtml(target.word);
    const after = escapeHtml(rawText.slice(target.idx + target.word.length));

    const thought = (ato === 2)
      ? buildAto2ThoughtFromKeyword(target.word, rawText)
      : pickAto3Thought(target.word.toLowerCase());

    const cls = (ato === 2) ? "ato2U" : "ato3U";
    el.poema.innerHTML = `${before}<span class="${cls}" data-thought="${escapeHtml(thought)}">${word}</span>${after}`;

    const u = el.poema.querySelector(`.${cls}`);
    if (u) {
      u.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openThought(u.getAttribute("data-thought") || "");
      }, { passive: false });
    }
  }

  // clique fora / ESC fecha thought
  document.addEventListener("pointerdown", (e) => {
    if (!el.ato2ThoughtBox) return;
    if (el.ato2ThoughtBox.classList.contains("hidden")) return;
    if (el.ato2ThoughtBox.contains(e.target)) return;

    // não fecha se clicou no sublinhado
    if (el.poema) {
      if (el.poema.querySelector(".ato2U")?.contains(e.target)) return;
      if (el.poema.querySelector(".ato3U")?.contains(e.target)) return;
    }

    closeThought();
  }, true);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeThought();
  });

  // =========================
  // MODOS (arquivo/memória/cápsula)
  // =========================
  function entrarModoLista(titulo) {
    document.body.classList.add("modo-arquivo");
    hide(el.botoesNormal);
    show(el.botoesArquivo);
    hide(el.saudade);

    setText(el.poema, "");
    setText(el.meta, "");
    esconderIntro();
    esconderCapsulaTrigger();
    fecharCapsulaPage(true);
    fecharMemoriaPage(true);
    esconderAto1UI(true);
    esconderAto2UI(true);

    setText(el.tituloTopo, titulo);
    animarFolha("in");
  }

  function sairModoLista() {
    if (document.body.classList.contains("modo-arquivo")) animarFolha("out");
    document.body.classList.remove("modo-arquivo");
    hide(el.arquivoBox);
    hide(el.memoriasBox);
    show(el.botoesNormal);
    hide(el.botoesArquivo);
  }

  // =========================
  // ARQUIVO: POEMAS
  // =========================
  function primeiraLinha(texto) {
    if (!texto) return "Sem título";
    const linha = String(texto).split("\n")[0].trim();
    return linha || "Sem título";
  }

  function tituloParaLista(dia) {
    const texto = (typeof window.getPoemaDoDia === "function") ? window.getPoemaDoDia(dia) : "";
    let t = primeiraLinha(texto);
    if (t.length > 52) t = t.slice(0, 52).trim() + "…";
    return t;
  }

  function buildRanges(maxDay) {
    const ranges = [];
    let start = 1;
    while (start <= maxDay) {
      const end = Math.min(start + 29, maxDay);
      ranges.push({ start, end });
      start += 30;
    }
    return ranges;
  }

  function renderRangeButtons(max) {
    if (!el.rangeRow || !el.listaArquivo) return;

    el.rangeRow.innerHTML = "";
    const ranges = buildRanges(max);

    function renderList(start, end) {
      el.listaArquivo.innerHTML = "";
      for (let d = end; d >= start; d--) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "arquivoItem";
        btn.innerHTML =
          `<span class="arquivoDia">Dia ${d}</span>
           <span class="arquivoTitulo">${escapeHtml(tituloParaLista(d))}</span>`;
        btn.onclick = () => {
          sairModoLista();
          esconderIntro();
          carregarPoema(d);
        };
        el.listaArquivo.appendChild(btn);
      }
    }

    ranges.forEach((r) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "rangeBtn";
      b.textContent = `${r.start}–${r.end}`;
      b.onclick = () => {
        [...el.rangeRow.querySelectorAll(".rangeBtn")].forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        renderList(r.start, r.end);
      };
      el.rangeRow.appendChild(b);
    });

    const last = ranges[ranges.length - 1];
    if (last) {
      el.rangeRow.lastChild.classList.add("active");
      renderList(last.start, last.end);
    }
  }

  window.abrirArquivo = function abrirArquivo() {
    if (window.DIA_ATUAL <= 1) return;

    const max = window.DIA_ATUAL - 1;
    if (el.arquivoSub) el.arquivoSub.innerText = `Disponíveis: Dias 1 a ${max}`;

    show(el.arquivoBox);
    hide(el.memoriasBox);

    window.setTemaPorAto(window.DIA_ATUAL);
    window.setDayAttr(window.DIA_ATUAL);

    entrarModoLista("Arquivo");
    renderRangeButtons(max);
  };

  // =========================
  // ARQUIVO: MEMÓRIAS
  // =========================
  function getMemoryDays() {
    const days = [];
    for (let d = 30; d <= 330; d += 30) days.push(d);
    return days;
  }

  function memoriaTituloPorIndice(idx) { return `Memória ${idx + 1}`; }

  window.abrirMemorias = function abrirMemorias() {
    const days = getMemoryDays();
    if (el.memoriasSub) el.memoriasSub.innerText = `Total previsto: ${days.length}`;

    if (el.listaMemorias) el.listaMemorias.innerHTML = "";

    days.forEach((diaMem, idx) => {
      const liberada = (window.DIA_ATUAL >= diaMem);
      const icon = liberada ? "🔓" : "🔒";
      const titulo = memoriaTituloPorIndice(idx);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "arquivoItem memoriaItem";
      btn.innerHTML =
        `<span class="lockIcon">${icon}</span>
         <span class="arquivoDia">Dia ${diaMem}</span>
         <span class="arquivoTitulo">${escapeHtml(titulo)}</span>`;

      btn.onclick = () => abrirMemoriaPage(diaMem, idx);
      el.listaMemorias.appendChild(btn);
    });

    window.setTemaPorAto(window.DIA_ATUAL);
    window.setDayAttr(window.DIA_ATUAL);

    hide(el.arquivoBox);
    show(el.memoriasBox);
    entrarModoLista("Memórias");
  };

  function abrirMemoriaPage(diaMem, idx) {
    const liberada = (window.DIA_ATUAL >= diaMem);
    const titulo = memoriaTituloPorIndice(idx);

    setText(el.memoriaPaperTitle, titulo);

    if (!liberada) {
      setText(el.memoriaPaperMeta, `Bloqueada até o Dia ${diaMem}.`);
      setText(el.memoriaPageTexto, `Quando chegar o Dia ${diaMem}, essa memória vai abrir — e vai ficar disponível pra sempre.`);
    } else {
      setText(el.memoriaPaperMeta, `Liberada no Dia ${diaMem}.`);
      const texto = (typeof window.getMemoriaDoDia === "function") ? window.getMemoriaDoDia(diaMem) : "";
      const conteudo = texto && texto.trim().length ? texto : "Em breve...";
      setText(el.memoriaPageTexto, "");
      typeText(el.memoriaPageTexto, conteudo, 12);
    }

    show(el.memoriaPage);
    el.memoriaPage.setAttribute("aria-hidden", "false");
    document.body.classList.add("memoria-mode");

    if (el.btnMemoriaVoltar) el.btnMemoriaVoltar.onclick = () => fecharMemoriaPage();
    el.memoriaPage.scrollTop = 0;
  }

  function fecharMemoriaPage(silencioso = false) {
    if (!silencioso && el.memoriaPage?.classList.contains("hidden")) return;
    hide(el.memoriaPage);
    el.memoriaPage?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("memoria-mode");
    if (el.memoriaPageTexto) el.memoriaPageTexto.textContent = "";
  }

  // =========================
  // DIA 365 — CÁPSULA
  // =========================
  function esconderCapsulaTrigger() { hide(el.capsulaTrigger); }
  function mostrarCapsulaTrigger() {
    show(el.capsulaTrigger);
    if (el.btnAbrirCapsula) el.btnAbrirCapsula.onclick = () => abrirCapsulaPage();
  }

  function abrirCapsulaPage() {
    localStorage.setItem(CAPSULA_OPEN_KEY, "1");

    if (el.capsulaCarta) el.capsulaCarta.textContent = "";
    hide(el.capsulaFecho);

    show(el.capsulaPage);
    el.capsulaPage?.setAttribute("aria-hidden", "false");
    document.body.classList.add("capsula-mode");
    el.capsulaPage.scrollTop = 0;

    if (el.notebook) {
      el.notebook.classList.remove("open");
      void el.notebook.offsetWidth;
      el.notebook.classList.add("open");
    }

    if (el.btnCapsulaVoltar) el.btnCapsulaVoltar.onclick = () => fecharCapsulaPage();
    if (el.btnEscolherDeNovo) el.btnEscolherDeNovo.onclick = () => escolherDeNovo();

    clearTimeout(window.__capsulaStartTimer);
    window.__capsulaStartTimer = setTimeout(() => {
      const carta = (typeof window.getCartaCapsula365 === "function") ? window.getCartaCapsula365() : "";
      typeTextHuman(el.capsulaCarta, carta || "Em breve...", {
        minDelay: 38,
        maxDelay: 82,
        mistakeChance: 0.075,
        maxBackspace: 4,
        pauseChance: 0.07,
        minPause: 260,
        maxPause: 760,
        scrollContainer: el.capsulaPage,
        onDone: () => {
          show(el.capsulaFecho);
          el.capsulaPage.scrollTop = el.capsulaPage.scrollHeight;
        }
      });
    }, 640);
  }

  function fecharCapsulaPage(silencioso = false) {
    if (!silencioso && el.capsulaPage?.classList.contains("hidden")) return;
    hide(el.capsulaPage);
    el.capsulaPage?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("capsula-mode");
    clearTimeout(window.__capsulaStartTimer);
  }

  function clearProjeto365Storage() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("projeto365_")) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
  }

  function escolherDeNovo() {
    if (!el.fadeOverlay) return;

    el.fadeOverlay.classList.add("show");

    setTimeout(() => {
      setTimeout(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, "0");
        const d = String(now.getDate()).padStart(2, "0");
        const iso = `${y}-${m}-${d}`;

        clearProjeto365Storage();
        localStorage.setItem(START_OVERRIDE_KEY, iso);

        el.fadeOverlay.classList.remove("show");
        fecharCapsulaPage(true);
        carregarHoje();
      }, 1000);
    }, 3000);
  }

  // =========================
  // SAUDADE
  // =========================
  window.mostrarSaudade = function mostrarSaudade() {
    if (el.saudade) el.saudade.classList.toggle("hidden");
  };

  // =========================
  // LOGIN
  // =========================
  window.verificarSenha = function verificarSenha() {
    const senha = el.senha ? el.senha.value : "";
    if (senha === SENHA_CORRETA) {
      hide(el.login);
      show(el.conteudo);
      setCornerDates();
      carregarHoje();
    } else {
      alert("Senha incorreta.");
    }
  };

  // =========================
  // RENDER PRINCIPAL
  // =========================
  function afterPoemTyped(dia, rawText) {
    const forced = (typeof window.getForcedDay === "function") ? window.getForcedDay() : null;
    const isTest = (forced !== null);

    // progresso ato 1 (só no dia real)
    if (!isTest && dia === window.DIA_ATUAL && dia >= 1 && dia <= 30) {
      const current = getAto1Unlocked();
      if (dia > current) setAto1Unlocked(dia);
    }

    renderAto1Palavra(dia);
    if (dia === 30 && getAto1Unlocked() >= 30) {
      clearTimeout(window.__ato1FinalTimer);
      window.__ato1FinalTimer = setTimeout(() => montarAto1FraseNoCentro(), 480);
    }

    renderAto2UI(dia);
    applyUnderlineThought(dia, rawText);
  }

  function carregarPoema(dia) {
    DIA_EM_TELA = dia;

    revelarBloco();

    window.setTemaPorAto(dia);
    window.setDayAttr(dia);

    esconderCapsulaTrigger();
    fecharCapsulaPage(true);
    fecharMemoriaPage(true);
    esconderAto1UI(true);
    esconderAto2UI(true);
    esconderIntro();

    // Prefácio (antes do Dia 1)
    if (dia <= 0) {
      document.body.removeAttribute("data-ato");
      document.body.removeAttribute("data-dia");
      document.documentElement.style.setProperty("--auraT", "0");

      setText(el.tituloTopo, "Antes do primeiro poema");
      setText(el.meta, "");
      const textoPrefacio = (typeof window.PREFACIO !== "undefined" && window.PREFACIO) ? window.PREFACIO : "Em breve.";
      typeText(el.poema, textoPrefacio, 14);
      return;
    }

    // Fora do range
    if (dia > 365) {
      setText(el.tituloTopo, "365 dias com você");
      setText(el.meta, "E mesmo assim, eu ainda escolheria você de novo.");
      typeText(el.poema, "Fim de um ano.\nE o começo de tudo de novo.", 12);
      return;
    }

    // Dia 365
    if (dia === 365) {
      setText(el.tituloTopo, `Dia 365 de 365`);
      setText(el.meta, "Um poema por dia.");

      const poema365 = (typeof window.getPoemaDoDia === "function") ? window.getPoemaDoDia(365) : "";
      typeText(el.poema, poema365 || "Em breve...", 12, () => {
        mostrarCapsulaTrigger();
      });
      return;
    }

    // Normal
    setText(el.tituloTopo, `Dia ${dia} de 365`);
    setText(el.meta, "Um poema por dia.");

    const texto = (typeof window.getPoemaDoDia === "function") ? window.getPoemaDoDia(dia) : "Em breve...";
    typeText(el.poema, texto, 12, () => afterPoemTyped(dia, texto));
  }

  function carregarHoje() {
    const forced = (typeof window.getForcedDay === "function") ? window.getForcedDay() : null;
    showModoTeste(forced);

    // aviso placeholder: só no modo teste
    if (forced !== null) {
      const firstPH = detectarPrimeiroPlaceholder();
      if (firstPH && firstPH <= 120) {
        showAvisoPoema(`Aviso: encontrei placeholder a partir do Dia ${firstPH}. (isso geralmente é desalinhamento de poemas no arquivo de poemas)`);
        console.warn("Projeto365: primeiro placeholder no Dia", firstPH);
      } else {
        showAvisoPoema("");
      }
    } else {
      showAvisoPoema("");
    }

    // DIA_ATUAL vem do core.js
    window.DIA_ATUAL = (typeof window.calcularDia === "function")
      ? window.calcularDia()
      : 1;

    // em modo teste, também atualiza progresso ato 1 (igual seu antigão)
    if (forced !== null && window.DIA_ATUAL >= 1 && window.DIA_ATUAL <= 30) {
      const cur = getAto1Unlocked();
      if (window.DIA_ATUAL > cur) setAto1Unlocked(window.DIA_ATUAL);
    }

    aplicarFrasePorHorario();
    verificarRetorno();
    iniciarSegredo();

    // botão anteriores desabilitado quando não tem anterior
    const btnAnteriores = document.getElementById("btnAnteriores");
    if (btnAnteriores) btnAnteriores.disabled = (window.DIA_ATUAL <= 1);

    sairModoLista();

    // se antes do início, mostra dia 0 (prefácio)
    if (typeof window.diffDias === "function") {
      const d = window.diffDias();
      if (d < 0) {
        carregarPoema(window.DIA_ATUAL);
        return;
      }
    }

    // intro do ato (somente no dia real)
    if (deveMostrarIntro(window.DIA_ATUAL)) {
      revelarBloco();
      setText(el.tituloTopo, `Dia ${window.DIA_ATUAL} de 365`);
      setText(el.poema, "");
      setText(el.meta, "");

      window.setTemaPorAto(window.DIA_ATUAL);
      window.setDayAttr(window.DIA_ATUAL);

      esconderCapsulaTrigger();
      fecharCapsulaPage(true);
      fecharMemoriaPage(true);
      esconderAto1UI(true);
      esconderAto2UI(true);

      mostrarIntro(window.DIA_ATUAL);
      return;
    }

    carregarPoema(window.DIA_ATUAL);
  }

  window.voltarParaHoje = function voltarParaHoje() {
    carregarHoje();
  };

  // =========================
  // BOOT
  // =========================
  function boot() {
    setCornerDates();
    setInterval(setCornerDates, 60000);
    // Não auto-login: mantém o gate com senha, como no antigão.
  }

  boot();
})();
