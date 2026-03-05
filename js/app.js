// js/app.js
(function () {
  "use strict";

  const C = window.PROJETO365;
  if (!C) {
    console.error("PROJETO365 core não carregou.");
    return;
  }

  // ====== CONFIG (igual teu site antigo, mas modular) ======
  const SENHA_CORRETA = "10022024";

  // Ato 1 — palavras (Dia 1..30)
  const ATO1_PALAVRAS = [
    "Eu","te","escolho","todos","os","dias,","mesmo","quando","o","mundo","pesa","e","medo","grita,",
    "porque","amar","você","é","decisão","firme:","transformar","incerteza","em","casa,","silêncio",
    "em","abrigo,","futuro","em","promessa."
  ];

  // Saudade (mesmo tom do antigo)
  const SAUDADE_TEXTO =
    "Se você sentiu saudade, é porque o que temos é real.\n" +
    "E eu escolho você — hoje e todos os dias.";

  // ====== DOM ======
  const loginView = document.getElementById("loginView");
  const mainView = document.getElementById("mainView");

  const loginForm = document.getElementById("loginForm");
  const senhaInput = document.getElementById("senhaInput");
  const loginMsg = document.getElementById("loginMsg");

  const btnSair = document.getElementById("btnSair");
  const btnArquivo = document.getElementById("btnArquivo");
  const btnMemoria = document.getElementById("btnMemoria");
  const btnSaudade = document.getElementById("btnSaudade");

  const diaLabel = document.getElementById("diaLabel");
  const atoLabel = document.getElementById("atoLabel");
  const subfrase = document.getElementById("subfrase");

  const poemaEl = document.getElementById("poema");
  const cursorEl = document.getElementById("cursor");

  const ato2Linhas = document.getElementById("ato2Linhas");
  const ato1Interacao = document.getElementById("ato1Interacao");
  const ato2Interacao = document.getElementById("ato2Interacao");

  const toastEl = document.getElementById("toast");

  // Modais
  const memoriaModal = document.getElementById("memoriaModal");
  const memoriaConteudo = document.getElementById("memoriaConteudo");

  const saudadeModal = document.getElementById("saudadeModal");
  const saudadeConteudo = document.getElementById("saudadeConteudo");

  const arquivoModal = document.getElementById("arquivoModal");
  const arquivoLista = document.getElementById("arquivoLista");
  const arquivoBuscar = document.getElementById("arquivoBuscar");
  const arquivoDia = document.getElementById("arquivoDia");
  const btnIrDia = document.getElementById("btnIrDia");

  // ====== STATE ======
  let DIA_ATUAL = 0;
  let DIA_EM_TELA = 0;

  let typingTimer = null;
  let toastTimer = null;

  // ====== HELPERS UI ======
  function showView(which) {
    const isLogin = which === "login";
    loginView.dataset.visible = isLogin ? "true" : "false";
    mainView.dataset.visible = isLogin ? "false" : "true";
    loginView.hidden = !isLogin ? true : false;
    mainView.hidden = isLogin ? true : false;
  }

  function setSubfrase() {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) subfrase.textContent = "Que seu dia seja leve. Eu já escolhi você hoje.";
    else if (hora >= 12 && hora < 18) subfrase.textContent = "No meio do seu dia, eu ainda penso em você.";
    else if (hora >= 18 && hora < 23) subfrase.textContent = "Eu gosto quando você vem aqui no fim do dia.";
    else subfrase.textContent = "Eu gosto quando você aparece antes de dormir.";
  }

  function marcarRetorno() {
    const hoje = new Date().toDateString();
    const last = localStorage.getItem(C.STORAGE.LAST_VISIT);
    if (last === hoje) {
      subfrase.textContent += " Você voltou. Eu gosto disso.";
    }
    localStorage.setItem(C.STORAGE.LAST_VISIT, hoje);
  }

  function showToast(text) {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 4200);
  }

  // ====== TYPEWRITER ======
  function typeText(el, text, speed = 12, onDone = null) {
    clearTimeout(typingTimer);
    el.textContent = "";
    if (cursorEl) cursorEl.classList.add("on");

    let i = 0;
    function step() {
      el.textContent = text.slice(0, i);
      i++;
      if (i <= text.length) {
        typingTimer = setTimeout(step, speed);
      } else {
        if (cursorEl) cursorEl.classList.remove("on");
        if (typeof onDone === "function") onDone();
      }
    }
    step();
  }

  // ====== POEMA / DATA API ======
  function getPoema(dia) {
    if (typeof window.getPoemaDoDia === "function") return window.getPoemaDoDia(dia) || "";
    return "Ainda não carregou getPoemaDoDia().";
  }

  function getMemoriaTexto(dia) {
    if (typeof window.getMemoriaDoDia === "function") return window.getMemoriaDoDia(dia) || "";
    return "";
  }

  function memoryDays() {
    const out = [];
    for (let d = 30; d <= 330; d += 30) out.push(d);
    return out;
  }

  function latestUnlockedMemoryDay(diaAtual) {
    const days = memoryDays().filter(d => d <= diaAtual);
    if (!days.length) return null;
    return days[days.length - 1];
  }

  // ====== ATO 1 — INTERAÇÃO ======
  function renderAto1(dia) {
    ato1Interacao.innerHTML = "";

    if (C.getAto(dia) !== 1) return;

    // No modo teste, libera até o dia em tela (igual teu feeling do antigo)
    const forced = C.getForcedDay();
    if (forced !== null) {
      if (dia >= 1 && dia <= 30) C.setAto1Unlocked(Math.max(C.getAto1Unlocked(), dia));
    } else {
      // produção: só libera quando for o dia atual
      if (dia === DIA_ATUAL && dia >= 1 && dia <= 30) C.setAto1Unlocked(Math.max(C.getAto1Unlocked(), dia));
    }

    const unlocked = C.getAto1Unlocked();
    if (dia < 1 || dia > unlocked) return;

    // Palavra do dia
    const box = document.createElement("div");
    box.className = "ato1-box";
    box.innerHTML = `
      <div class="ato1-tag">ENTRELINHAS</div>
      <div class="ato1-word">${escapeHtml(ATO1_PALAVRAS[dia - 1] || "")}</div>
    `;
    ato1Interacao.appendChild(box);

    // Dia 30: montagem
    if (dia === 30 && unlocked >= 30) {
      const montagem = document.createElement("div");
      montagem.className = "ato1-montagem";
      ATO1_PALAVRAS.forEach((w, i) => {
        const s = document.createElement("span");
        s.className = "ato1-piece";
        s.textContent = w;
        s.style.transitionDelay = `${60 + i * 28}ms`;
        montagem.appendChild(s);
      });
      ato1Interacao.appendChild(montagem);

      requestAnimationFrame(() => montagem.classList.add("show"));
      setTimeout(() => montagem.classList.add("assemble"), 1100);
    }
  }

  // ====== ATO 2 — INTERAÇÃO ======
  function renderAto2Linhas(dia) {
    if (!ato2Linhas) return;

    const isAto2 = C.getAto(dia) === 2;
    ato2Linhas.innerHTML = "";
    if (!isAto2) {
      ato2Linhas.classList.remove("on");
      return;
    }
    ato2Linhas.classList.add("on");
    ato2Linhas.innerHTML = `<div class="line"></div><div class="line"></div>`;
  }

  function pickUnderlineTarget(text) {
    const t = String(text || "");
    const candidates = [
      "presença","verdade","silêncio","calma","paz","casa","cuidado","confiança",
      "futuro","conversar","orgulho","perto","voltar","ficar","leve","luz","simples",
      "detalhe","respirar","seguro","aprender"
    ];

    function findWord(w) {
      const re = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\b`, "i");
      const m = t.match(re);
      if (m && typeof m.index === "number") {
        return { word: t.slice(m.index, m.index + m[0].length), idx: m.index };
      }
      return null;
    }

    for (const w of candidates) {
      const found = findWord(w);
      if (found) return found;
    }

    // fallback: maior palavra (>=5) não-stopword
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

  function ato2Thought(keywordRaw, poemRaw) {
    const k = (keywordRaw || "").toLowerCase();
    const poem = (poemRaw || "").toLowerCase();

    const map = [
      { keys:["presença","presenca"], out:"presença é quando eu fico — mesmo sem barulho." },
      { keys:["verdade"], out:"verdade é isso: não fazer cena… só ficar." },
      { keys:["silêncio","silencio"], out:"no teu silêncio eu não me perco — eu descanso." },
      { keys:["calma","paz"], out:"com você, calma não é intervalo — é destino." },
      { keys:["casa"], out:"casa é quando o peito para de se defender." },
      { keys:["cuidado"], out:"cuidado é te escolher no detalhe, sem pressa." },
      { keys:["confiança","confianca"], out:"confiança é deixar a mão aberta — e ainda assim ficar." },
      { keys:["futuro"], out:"pensar em futuro contigo me dá silêncio bom por dentro." },
      { keys:["conversar"], out:"se doer, eu volto pra conversa. eu volto pra nós." },
      { keys:["orgulho"], out:"eu prefiro nós ao meu orgulho." },
      { keys:["perto"], out:"perto é onde eu fico mais simples." },
      { keys:["voltar"], out:"eu sempre volto pro que importa." },
      { keys:["ficar"], out:"eu fico quando não tem plateia." },
      { keys:["leve"], out:"eu tô aprendendo a ser leve contigo — sem fugir de nada." },
      { keys:["luz"], out:"eu não quero incêndio. eu quero luz." },
      { keys:["simples"], out:"o simples contigo vira raro." },
      { keys:["detalhe"], out:"é no detalhe que eu percebo: eu tô aqui." },
      { keys:["respirar"], out:"quando você aparece, eu respiro melhor." },
      { keys:["seguro"], out:"você me deixa seguro do jeito mais calmo." },
      { keys:["aprender"], out:"eu aprendo a te amar melhor — um dia de cada vez." },
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

  function applyAto2Underline(dia, rawText) {
    ato2Interacao.innerHTML = "";

    if (C.getAto(dia) !== 2) return;
    if (!rawText || !rawText.trim()) return;

    const target = pickUnderlineTarget(rawText);
    if (!target) return;

    const before = escapeHtml(rawText.slice(0, target.idx));
    const word = escapeHtml(target.word);
    const after = escapeHtml(rawText.slice(target.idx + target.word.length));

    const thought = ato2Thought(target.word, rawText);

    // re-render no DOM do poema com underline clicável
    poemaEl.innerHTML = `${before}<span class="ato2U" data-thought="${escapeHtml(thought)}">${word}</span>${after}`;

    const u = poemaEl.querySelector(".ato2U");
    if (u) {
      u.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const t = u.getAttribute("data-thought") || "";
        showToast(t);
      }, { passive: false });
    }
  }

  // ====== MODAIS ======
  function openModal(el) {
    if (!el) return;
    el.hidden = false;
    document.body.classList.add("modal-open");
  }
  function closeModal(el) {
    if (!el) return;
    el.hidden = true;
    // fecha body class se nenhum modal aberto
    const anyOpen = [...document.querySelectorAll(".modal")].some(m => !m.hidden);
    if (!anyOpen) document.body.classList.remove("modal-open");
  }

  function wireModalClose() {
    document.querySelectorAll("[data-close]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-close");
        const el = document.getElementById(id);
        closeModal(el);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        // fecha o último modal aberto
        const open = [...document.querySelectorAll(".modal")].filter(m => !m.hidden);
        if (open.length) closeModal(open[open.length - 1]);
      }
    });
  }

  // ====== ARQUIVO (poemas antigos) ======
  function tituloPrimeiraLinha(texto) {
    const linha = String(texto || "").split("\n")[0].trim();
    if (!linha) return "Sem título";
    return linha.length > 60 ? (linha.slice(0, 60).trim() + "…") : linha;
  }

  function renderArquivoLista(maxDia, filtro = "") {
    arquivoLista.innerHTML = "";
    const f = String(filtro || "").trim().toLowerCase();

    for (let d = maxDia; d >= 1; d--) {
      const p = getPoema(d);
      const match = !f || p.toLowerCase().includes(f) || tituloPrimeiraLinha(p).toLowerCase().includes(f);
      if (!match) continue;

      const item = document.createElement("button");
      item.type = "button";
      item.className = "arquivo-item";
      item.innerHTML = `
        <span class="arquivo-dia">Dia ${d}</span>
        <span class="arquivo-titulo">${escapeHtml(tituloPrimeiraLinha(p))}</span>
      `;
      item.addEventListener("click", () => {
        closeModal(arquivoModal);
        carregarDia(d);
      });
      arquivoLista.appendChild(item);
    }

    if (!arquivoLista.children.length) {
      const empty = document.createElement("div");
      empty.className = "muted";
      empty.style.padding = "10px 4px";
      empty.textContent = "Nada encontrado.";
      arquivoLista.appendChild(empty);
    }
  }

  function abrirArquivo() {
    if (DIA_ATUAL <= 1) {
      showToast("Ainda não há poemas anteriores.");
      return;
    }
    const max = DIA_ATUAL - 1;
    renderArquivoLista(max, arquivoBuscar.value);
    openModal(arquivoModal);
    arquivoBuscar.focus();
  }

  // ====== MEMÓRIA ======
  function abrirMemoria() {
    const mDay = latestUnlockedMemoryDay(DIA_ATUAL);
    if (!mDay) return;

    const texto = getMemoriaTexto(mDay);
    memoriaConteudo.textContent = "";
    typeText(memoriaConteudo, texto && texto.trim() ? texto : "Em breve...", 12);
    openModal(memoriaModal);
  }

  function updateMemoriaButton() {
    const mDay = latestUnlockedMemoryDay(DIA_ATUAL);
    btnMemoria.disabled = !mDay;
  }

  // ====== SAUDADE ======
  function abrirSaudade() {
    saudadeConteudo.textContent = SAUDADE_TEXTO;
    openModal(saudadeModal);
  }

  // ====== LOGIN ======
  function setLoginMsg(msg) {
    loginMsg.textContent = msg || "";
  }

  function doLogin(pass) {
    if (pass === SENHA_CORRETA) {
      localStorage.setItem(C.STORAGE.LOGIN_OK, "1");
      setLoginMsg("");
      showView("main");
      bootMain();
    } else {
      setLoginMsg("Senha incorreta.");
      showToast("Senha incorreta.");
    }
  }

  function doLogout() {
    localStorage.removeItem(C.STORAGE.LOGIN_OK);
    // limpa input
    senhaInput.value = "";
    setLoginMsg("");
    showView("login");
  }

  // ====== RENDER PRINCIPAL ======
  function setMetaTopo(dia) {
    const ato = C.getAto(dia);
    diaLabel.textContent = (dia <= 0) ? "Prefácio" : `Dia ${dia} de 365`;
    atoLabel.textContent = (dia <= 0) ? "" : `Ato ${ato}`;
  }

  function renderPoema(dia) {
    C.aplicarTemaCompleto(dia);
    setMetaTopo(dia);

    const texto = getPoema(dia);

    // sempre escreve com typewriter (como teu antigo)
    poemaEl.innerHTML = ""; // importante: zera pra underline depois
    ato1Interacao.innerHTML = "";
    ato2Interacao.innerHTML = "";

    typeText(poemaEl, texto, 12, () => {
      // depois de escrever, aplica interações
      renderAto1(dia);
      renderAto2Linhas(dia);

      // Ato 2: underline + thought
      if (C.getAto(dia) === 2) {
        applyAto2Underline(dia, texto);
      }
    });
  }

  function carregarDia(dia) {
    DIA_EM_TELA = dia;
    renderPoema(dia);
  }

  function carregarHoje() {
    const dia = C.getDiaAtual();
    DIA_ATUAL = dia;
    DIA_EM_TELA = dia;

    // subfrase + retorno + “segredinho” por inatividade (igual teu antigo)
    setSubfrase();
    marcarRetorno();
    updateMemoriaButton();

    renderPoema(dia);
  }

  // ====== SEGREDO POR INATIVIDADE (toast) ======
  function iniciarSegredoInatividade() {
    const cooldownMs = 2 * 60 * 60 * 1000; // 2h

    function pickSegredo() {
      if (typeof window.getSegredoAleatorio === "function") return window.getSegredoAleatorio();
      return "Eu ainda estou aqui.";
    }

    function reset() {
      clearTimeout(window.__p365_inatividade);
      window.__p365_inatividade = setTimeout(() => {
        if (document.hidden) return;

        const last = Number(localStorage.getItem(C.STORAGE.TOAST_LAST) || 0);
        const now = Date.now();
        if (now - last >= cooldownMs) {
          localStorage.setItem(C.STORAGE.TOAST_LAST, String(now));
          showToast(pickSegredo());
        }
      }, 10000);
    }

    if (window.__p365_segredoInit) {
      reset();
      return;
    }
    window.__p365_segredoInit = true;

    window.addEventListener("mousemove", reset, { passive: true });
    window.addEventListener("keydown", reset);
    window.addEventListener("touchstart", reset, { passive: true });
    window.addEventListener("scroll", reset, { passive: true });
    document.addEventListener("visibilitychange", () => { if (!document.hidden) reset(); });
    window.addEventListener("focus", reset);

    reset();
  }

  // ====== SANITY: Dia 29/30 ======
  function sanityCheckAto1() {
    // Se o teu Ato 1 vier curto (falta 29/30), isso pega na hora.
    if (Array.isArray(window.POEMAS_ATO_1) && window.POEMAS_ATO_1.length < 30) {
      console.warn("POEMAS_ATO_1 curto:", window.POEMAS_ATO_1.length, "=> Dia 29/30 podem virar placeholder.");
      showToast("Aviso: Ato 1 parece estar incompleto (Dia 29/30).");
    }
  }

  // ====== UTILS ======
  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ====== BOOT ======
  function bootMain() {
    sanityCheckAto1();
    iniciarSegredoInatividade();
    carregarHoje();
  }

  function boot() {
    wireModalClose();

    // Login auto
    const ok = localStorage.getItem(C.STORAGE.LOGIN_OK) === "1";
    showView(ok ? "main" : "login");
    if (ok) bootMain();

    // listeners
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      doLogin(String(senhaInput.value || "").trim());
    });

    btnSair.addEventListener("click", doLogout);

    btnArquivo.addEventListener("click", abrirArquivo);
    btnMemoria.addEventListener("click", abrirMemoria);
    btnSaudade.addEventListener("click", abrirSaudade);

    arquivoBuscar.addEventListener("input", () => {
      const max = Math.max(1, DIA_ATUAL - 1);
      renderArquivoLista(max, arquivoBuscar.value);
    });

    btnIrDia.addEventListener("click", () => {
      const n = Number(arquivoDia.value);
      if (!Number.isFinite(n) || n < 1 || n > 365) {
        showToast("Escolhe um dia entre 1 e 365.");
        return;
      }
      closeModal(arquivoModal);
      carregarDia(Math.floor(n));
    });
  }

  boot();
})();
