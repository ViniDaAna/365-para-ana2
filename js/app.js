function showModoTeste(dia){
  const el = document.getElementById("modoTeste");
  if(dia === null){
    el.classList.add("hidden");
    el.textContent = "";
    return;
  }
  el.classList.remove("hidden");
  el.textContent = `Modo teste ativo: Dia ${dia}. (URL: ?day=${dia})`;
}

function showAvisoPoema(text){
  const el = document.getElementById("avisoPoema");
  if(!text){
    el.classList.add("hidden");
    el.textContent = "";
    return;
  }
  el.classList.remove("hidden");
  el.textContent = text;
}

function setCornerDates(){
  const agora = new Date();
  const dd = String(agora.getDate()).padStart(2,'0');
  const mm = String(agora.getMonth()+1).padStart(2,'0');
  const yyyy = agora.getFullYear();
  const data = `${dd}/${mm}/${yyyy}`;
  document.getElementById("cornerDateLogin").innerText = data;
  document.getElementById("cornerDate").innerText = data;
}

function aplicarFrasePorHorario(){
  const hora = new Date().getHours();
  const el = document.getElementById("fraseContexto");
  if(hora >= 5 && hora < 12) el.innerText = "Que seu dia seja leve. Eu já escolhi você hoje.";
  else if(hora >= 12 && hora < 18) el.innerText = "No meio do seu dia, eu ainda penso em você.";
  else if(hora >= 18 && hora < 23) el.innerText = "Eu gosto quando você vem aqui no fim do dia.";
  else el.innerText = "Eu gosto quando você aparece antes de dormir.";
}

function verificarRetorno(){
  const hoje = new Date().toDateString();
  const key = "projeto365_visita";
  const ultima = localStorage.getItem(key);
  if(ultima === hoje){
    const el = document.getElementById("fraseContexto");
    el.innerText += " Você voltou. Eu gosto disso.";
  }
  localStorage.setItem(key, hoje);
}

function revelarBloco(){
  const bloco = document.getElementById("blocoTexto");
  bloco.classList.remove("show");
  void bloco.offsetWidth;
  bloco.classList.add("show");
}

let typingTimer = null;
function typeText(el, text, speed=12, onDone=null){
  clearTimeout(typingTimer);
  el.textContent = "";
  let i = 0;
  function step(){
    el.textContent = text.slice(0, i);
    i++;
    if(i <= text.length){
      typingTimer = setTimeout(step, speed);
    } else {
      if(typeof onDone === "function") onDone();
    }
  }
  step();
}

function typeTextHuman(el, text, opts={}){
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
  el.textContent = "";
  let i = 0;

  function rand(a,b){ return a + Math.random() * (b-a); }
  function nextDelay(){ return Math.floor(rand(minDelay, maxDelay)); }
  function nextPause(){ return Math.floor(rand(minPause, maxPause)); }
  function doScroll(){
    if(scrollContainer && typeof scrollContainer.scrollTop === "number"){
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }

  function step(){
    if(Math.random() < pauseChance){
      typingTimer = setTimeout(step, nextPause());
      return;
    }

    if(i > 6 && i < text.length - 6 && Math.random() < mistakeChance){
      const current = el.textContent;
      const n = Math.max(1, Math.floor(rand(1, maxBackspace+1)));
      let j = 0;

      function back(){
        el.textContent = el.textContent.slice(0, -1);
        doScroll();
        j++;
        if(j < Math.min(n, current.length)){
          typingTimer = setTimeout(back, Math.floor(rand(26, 58)));
        } else {
          typingTimer = setTimeout(step, Math.floor(rand(90, 180)));
        }
      }
      back();
      return;
    }

    el.textContent = text.slice(0, i);
    i++;
    doScroll();

    if(i <= text.length){
      typingTimer = setTimeout(step, nextDelay());
    } else {
      doScroll();
      if(typeof onDone === "function") onDone();
    }
  }

  step();
}

function pickSegredo(){ return segredos[Math.floor(Math.random() * segredos.length)]; }

function mostrarToast(texto){
  const toast = document.getElementById("toastSegredo");
  toast.textContent = texto;

  toast.classList.remove("hidden");
  toast.classList.remove("show");
  void toast.offsetWidth;
  toast.classList.add("show");

  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 250);
  }, 4200);
}

function iniciarSegredo(){
  const cooldownKey = "projeto365_toast";
  const cooldownMs = 2 * 60 * 60 * 1000;

  function resetInatividade(){
    clearTimeout(window.__inatividadeTimer);
    window.__inatividadeTimer = setTimeout(() => {
      if(document.hidden) return;

      const last = Number(localStorage.getItem(cooldownKey) || 0);
      const now = Date.now();

      if(now - last >= cooldownMs){
        localStorage.setItem(cooldownKey, String(now));
        mostrarToast(pickSegredo());
      }
    }, 10000);
  }

  if(window.__segredoInit){
    resetInatividade();
    return;
  }
  window.__segredoInit = true;

  window.addEventListener("mousemove", resetInatividade, {passive:true});
  window.addEventListener("keydown", resetInatividade);
  window.addEventListener("touchstart", resetInatividade, {passive:true});
  window.addEventListener("scroll", resetInatividade, {passive:true});

  document.addEventListener("visibilitychange", () => { if(!document.hidden) resetInatividade(); });
  window.addEventListener("focus", resetInatividade);

  resetInatividade();
}

function esconderIntro(){
  const box = document.getElementById("introAtoBox");
  box.classList.add("hidden");
  document.getElementById("introAtoTexto").textContent = "";
}

function mostrarIntro(dia){
  const info = INTRO_ATOS[dia];
  const box = document.getElementById("introAtoBox");
  const tag = document.getElementById("introAtoTag");
  const txt = document.getElementById("introAtoTexto");
  const btn = document.getElementById("btnContinuarAto");

  tag.textContent = info.tag;
  txt.textContent = info.texto;

  box.classList.remove("hidden");

  btn.onclick = () => {
    marcarIntroComoVista(dia);
    esconderIntro();
    carregarPoema(dia);
  };
}

function animarFolha(direcao){
  const c = document.getElementById("conteudo");
  c.classList.remove("pageflip-in", "pageflip-out");
  void c.offsetWidth;
  c.classList.add(direcao === "in" ? "pageflip-in" : "pageflip-out");

  clearTimeout(window.__flipTimer);
  window.__flipTimer = setTimeout(() => {
    c.classList.remove("pageflip-in", "pageflip-out");
  }, 520);
}

function entrarModoLista(titulo){
  document.body.classList.add("modo-arquivo");
  document.getElementById("botoesNormal").classList.add("hidden");
  document.getElementById("botoesArquivo").classList.remove("hidden");
  document.getElementById("saudade").classList.add("hidden");

  document.getElementById("poema").textContent = "";
  document.getElementById("meta").textContent = "";
  esconderIntro();
  esconderCapsulaTrigger();
  fecharCapsulaPage(true);
  fecharMemoriaPage(true);
  esconderAto1UI(true);
  esconderAto2UI(true);
  esconderAto3UI(true);
  esconderAto4UI(true);

  document.getElementById("tituloTopo").innerText = titulo;
  animarFolha("in");
}

function sairModoLista(){
  if(document.body.classList.contains("modo-arquivo")){
    animarFolha("out");
  }
  document.body.classList.remove("modo-arquivo");
  document.getElementById("arquivoBox").classList.add("hidden");
  document.getElementById("memoriasBox").classList.add("hidden");
  document.getElementById("botoesNormal").classList.remove("hidden");
  document.getElementById("botoesArquivo").classList.add("hidden");
}

function primeiraLinha(texto){
  if(!texto) return "Sem título";
  const linha = String(texto).split("\n")[0].trim();
  return linha || "Sem título";
}

function tituloParaLista(dia){
  const texto = (typeof getPoemaDoDia === "function") ? getPoemaDoDia(dia) : "";
  let t = primeiraLinha(texto);
  if(t.length > 52) t = t.slice(0, 52).trim() + "…";
  return t;
}

function buildRanges(maxDay){
  const ranges = [];
  let start = 1;
  while(start <= maxDay){
    const end = Math.min(start + 29, maxDay);
    ranges.push({start, end});
    start += 30;
  }
  return ranges;
}

function renderRangeButtons(max){
  const row = document.getElementById("rangeRow");
  row.innerHTML = "";
  const ranges = buildRanges(max);

  function renderList(start, end){
    const lista = document.getElementById("listaArquivo");
    lista.innerHTML = "";
    for(let d = end; d >= start; d--){
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "arquivoItem";
      btn.innerHTML =
        `<span class="arquivoDia">Dia ${d}</span>
         <span class="arquivoTitulo">${tituloParaLista(d)}</span>`;
      btn.onclick = () => {
        sairModoLista();
        esconderIntro();
        carregarPoema(d);
      };
      lista.appendChild(btn);
    }
  }

  ranges.forEach((r) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "rangeBtn";
    b.textContent = `${r.start}–${r.end}`;
    b.onclick = () => {
      [...row.querySelectorAll(".rangeBtn")].forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      renderList(r.start, r.end);
    };
    row.appendChild(b);
  });

  const last = ranges[ranges.length - 1];
  if(last){
    row.lastChild.classList.add("active");
    renderList(last.start, last.end);
  }
}

function abrirArquivo(){
  if(DIA_ATUAL <= 1) return;

  const max = DIA_ATUAL - 1;
  document.getElementById("arquivoSub").innerText = `Disponíveis: Dias 1 a ${max}`;

  document.getElementById("arquivoBox").classList.remove("hidden");
  document.getElementById("memoriasBox").classList.add("hidden");

  setTemaPorAto(DIA_ATUAL);
  setDayAttr(DIA_ATUAL);

  entrarModoLista("Arquivo");
  renderRangeButtons(max);
}

function getMemoryDays(){
  const days = [];
  for(let d = 30; d <= 330; d += 30) days.push(d);
  return days;
}
function memoriaTituloPorIndice(idx){ return `Memória ${idx + 1}`; }

function abrirMemorias(){
  const days = getMemoryDays();
  document.getElementById("memoriasSub").innerText = `Total previsto: ${days.length}`;

  const lista = document.getElementById("listaMemorias");
  lista.innerHTML = "";

  days.forEach((diaMem, idx) => {
    const liberada = (DIA_ATUAL >= diaMem);
    const icon = liberada ? "🔓" : "🔒";
    const titulo = memoriaTituloPorIndice(idx);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "arquivoItem memoriaItem";
    btn.innerHTML =
      `<span class="lockIcon">${icon}</span>
       <span class="arquivoDia">Dia ${diaMem}</span>
       <span class="arquivoTitulo">${titulo}</span>`;

    btn.onclick = () => abrirMemoriaPage(diaMem, idx);
    lista.appendChild(btn);
  });

  setTemaPorAto(DIA_ATUAL);
  setDayAttr(DIA_ATUAL);

  document.getElementById("arquivoBox").classList.add("hidden");
  document.getElementById("memoriasBox").classList.remove("hidden");
  entrarModoLista("Memórias");
}

function abrirMemoriaPage(diaMem, idx){
  const page = document.getElementById("memoriaPage");
  const titleEl = document.getElementById("memoriaPaperTitle");
  const metaEl = document.getElementById("memoriaPaperMeta");
  const textoEl = document.getElementById("memoriaPageTexto");
  const btnVoltar = document.getElementById("btnMemoriaVoltar");

  const liberada = (DIA_ATUAL >= diaMem);
  const titulo = memoriaTituloPorIndice(idx);

  titleEl.textContent = titulo;

  if(!liberada){
    metaEl.textContent = `Bloqueada até o Dia ${diaMem}.`;
    textoEl.textContent = `Quando chegar o Dia ${diaMem}, essa memória vai abrir — e vai ficar disponível pra sempre.`;
  } else {
    metaEl.textContent = `Liberada no Dia ${diaMem}.`;
    const texto = (typeof getMemoriaDoDia === "function") ? getMemoriaDoDia(diaMem) : "";
    const conteudo = texto && texto.trim().length ? texto : "Em breve...";
    textoEl.textContent = "";
    typeText(textoEl, conteudo, 12);
  }

  page.classList.remove("hidden");
  page.setAttribute("aria-hidden", "false");
  document.body.classList.add("memoria-mode");

  btnVoltar.onclick = () => fecharMemoriaPage();
  page.scrollTop = 0;
}

function fecharMemoriaPage(silencioso=false){
  const page = document.getElementById("memoriaPage");
  if(!silencioso && page.classList.contains("hidden")) return;
  page.classList.add("hidden");
  page.setAttribute("aria-hidden", "true");
  document.body.classList.remove("memoria-mode");
  document.getElementById("memoriaPageTexto").textContent = "";
}

const CAPSULA_OPEN_KEY = "projeto365_capsula_365_aberta";

function esconderCapsulaTrigger(){
  document.getElementById("capsulaTrigger").classList.add("hidden");
}

function mostrarCapsulaTrigger(){
  const t = document.getElementById("capsulaTrigger");
  const btn = document.getElementById("btnAbrirCapsula");
  t.classList.remove("hidden");
  btn.onclick = () => abrirCapsulaPage();
}

function abrirCapsulaPage(){
  const page = document.getElementById("capsulaPage");
  const notebook = document.getElementById("notebook");
  const cartaEl = document.getElementById("capsulaCarta");
  const fecho = document.getElementById("capsulaFecho");
  const btnVoltar = document.getElementById("btnCapsulaVoltar");
  const btnFinal = document.getElementById("btnEscolherDeNovo");

  localStorage.setItem(CAPSULA_OPEN_KEY, "1");

  cartaEl.textContent = "";
  fecho.classList.add("hidden");

  page.classList.remove("hidden");
  page.setAttribute("aria-hidden", "false");
  document.body.classList.add("capsula-mode");

  page.scrollTop = 0;

  notebook.classList.remove("open");
  void notebook.offsetWidth;
  notebook.classList.add("open");

  btnVoltar.onclick = () => fecharCapsulaPage();
  btnFinal.onclick = () => escolherDeNovo();

  clearTimeout(window.__capsulaStartTimer);
  window.__capsulaStartTimer = setTimeout(() => {
    const carta = (typeof getCartaCapsula365 === "function") ? getCartaCapsula365() : "";
    typeTextHuman(cartaEl, carta || "Em breve...", {
      minDelay: 38,
      maxDelay: 82,
      mistakeChance: 0.075,
      maxBackspace: 4,
      pauseChance: 0.07,
      minPause: 260,
      maxPause: 760,
      scrollContainer: page,
      onDone: () => {
        fecho.classList.remove("hidden");
        page.scrollTop = page.scrollHeight;
      }
    });
  }, 640);
}

function fecharCapsulaPage(silencioso=false){
  const page = document.getElementById("capsulaPage");
  if(!silencioso && page.classList.contains("hidden")) return;

  page.classList.add("hidden");
  page.setAttribute("aria-hidden", "true");
  document.body.classList.remove("capsula-mode");

  clearTimeout(window.__capsulaStartTimer);
}

function clearProjeto365Storage(){
  const keys = [];
  for(let i = 0; i < localStorage.length; i++){
    const k = localStorage.key(i);
    if(k && k.startsWith("projeto365_")) keys.push(k);
  }
  keys.forEach(k => localStorage.removeItem(k));
}

function escolherDeNovo(){
  const overlay = document.getElementById("fadeOverlay");
  overlay.classList.add("show");

  setTimeout(() => {
    setTimeout(() => {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth()+1).padStart(2,'0');
      const d = String(now.getDate()).padStart(2,'0');
      const iso = `${y}-${m}-${d}`;

      clearProjeto365Storage();
      localStorage.setItem(START_OVERRIDE_KEY, iso);

      overlay.classList.remove("show");
      fecharCapsulaPage(true);
      carregarHoje();
    }, 1000);
  }, 3000);
}

function esconderAto1UI(silencioso=false){
  const chave = document.getElementById("ato1Chave");
  const palavra = document.getElementById("ato1Palavra");
  const montagem = document.getElementById("ato1Montagem");

  chave.classList.add("hidden");
  chave.setAttribute("aria-hidden","true");
  palavra.textContent = "";

  montagem.classList.add("hidden");
  montagem.classList.remove("show","assemble");
  montagem.setAttribute("aria-hidden","true");
  if(!silencioso) montagem.innerHTML = "";
}

function renderAto1Palavra(diaEmTela){
  const chave = document.getElementById("ato1Chave");
  const palavra = document.getElementById("ato1Palavra");
  const montagem = document.getElementById("ato1Montagem");

  if(document.body.classList.contains("modo-arquivo") || document.body.classList.contains("capsula-mode") || document.body.classList.contains("memoria-mode")){
    esconderAto1UI(true);
    return;
  }

  if(diaEmTela < 1 || diaEmTela > 30){
    esconderAto1UI(true);
    return;
  }

  const unlocked = getAto1Unlocked();
  if(diaEmTela > unlocked){
    esconderAto1UI(true);
    return;
  }

  const w = ATO1_PALAVRAS[diaEmTela - 1] || "";
  palavra.classList.remove("is-reveal");
  palavra.textContent = w;

  montagem.classList.add("hidden");
  montagem.classList.remove("show","assemble");
  montagem.setAttribute("aria-hidden","true");

  chave.classList.remove("hidden");
  chave.setAttribute("aria-hidden","false");

  void palavra.offsetWidth;
  palavra.classList.add("is-reveal");
}

function montarAto1FraseNoCentro(){
  const chave = document.getElementById("ato1Chave");
  const montagem = document.getElementById("ato1Montagem");

  montagem.innerHTML = "";
  montagem.classList.remove("show","assemble");

  chave.classList.add("hidden");
  chave.setAttribute("aria-hidden","true");

  ATO1_PALAVRAS.forEach((w, i) => {
    const s = document.createElement("span");
    s.className = "ato1Word";
    s.textContent = w;
    s.style.transitionDelay = `${90 + i * 34}ms`;
    montagem.appendChild(s);
  });

  montagem.classList.remove("hidden");
  montagem.setAttribute("aria-hidden","false");

  void montagem.offsetWidth;
  montagem.classList.add("show");

  clearTimeout(window.__ato1AssembleTimer);
  window.__ato1AssembleTimer = setTimeout(() => {
    montagem.classList.add("assemble");
  }, 1380);
}

function esconderAto2UI(silencioso=false){
  const linhas = document.getElementById("ato2Linhas");
  const box = document.getElementById("ato2ThoughtBox");
  const perguntaBox = document.getElementById("ato2PerguntaBox");

  if(linhas){
    linhas.classList.add("hidden");
    linhas.setAttribute("aria-hidden","true");
  }

  if(box){
    box.classList.add("hidden");
    box.classList.remove("show");
    box.setAttribute("aria-hidden","true");
    if(!silencioso) box.textContent = "";
  }

  if(perguntaBox){
    perguntaBox.classList.add("hidden");
    perguntaBox.setAttribute("aria-hidden","true");
    if(!silencioso) perguntaBox.innerHTML = "";
  }

  cleanupAto2Closer();
}

function esconderAto3UI(silencioso=false){
  const box = document.getElementById("ato3Fogueira");
  if(!box) return;

  box.classList.add("hidden");
  box.setAttribute("aria-hidden","true");
  box.classList.remove("is-extinguishing", "is-revealed");

  if(!silencioso){
    box.innerHTML = "";
  }
}

function esconderAto4UI(silencioso=false){
  const box = document.getElementById("ato4Puzzle");
  const grid = document.getElementById("ato4Grid");
  const hint = document.getElementById("ato4Hint");

  if(!box || !grid || !hint) return;

  box.classList.add("hidden");
  box.setAttribute("aria-hidden","true");
  box.classList.remove("is-complete");

  if(!silencioso){
    grid.innerHTML = "";
    hint.textContent = "";
  }
}

function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function pickUnderlineTarget(text){
  const t = String(text || "");

  const candidates = [
    "presença","verdade","silêncio","calma","paz","casa","cuidado","confiança","honesto","honestidade",
    "futuro","conversar","orgulho","perto","voltar","ficar","fica","leve","luz","simples","cotidiano",
    "detalhe","respirar","manso","seguro","aprender","calor","segredos","tensão","energia","curiosidade",
    "desejo","linha","corpos","proximidade","promessa","fogo","escolha"
  ];

  function findWord(w){
    const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\b`, "i");
    const m = t.match(re);
    if(m && typeof m.index === "number") return {word: t.slice(m.index, m.index + m[0].length), idx: m.index};
    return null;
  }

  for(const w of candidates){
    const found = findWord(w);
    if(found) return found;
  }

  const stop = new Set(["quando","porque","ainda","mesmo","sobre","entre","depois","antes","agora","assim","isso","aquilo","muito","pouco","tudo","nunca","sempre","também","apenas","pra","para","com","sem","que","uma","um","e","o","a","os","as","no","na","nos","nas","do","da","dos","das","eu","você","voce"]);
  const rx = /[A-Za-zÀ-ÿ]{5,}/g;
  let best = null;

  for(const m of t.matchAll(rx)){
    const w = (m[0] || "").toLowerCase();
    if(stop.has(w)) continue;
    const score = m[0].length + (["ção","dade","mente"].some(suf => w.endsWith(suf)) ? 2 : 0);
    if(!best || score > best.score){
      best = {word: m[0], idx: m.index, score};
    }
  }

  if(best && typeof best.idx === "number") return {word: best.word, idx: best.idx};
  return null;
}

function buildAto2ThoughtFromKeyword(keywordRaw, poemRaw){
  const k = (keywordRaw || "").toLowerCase();
  const poem = (poemRaw || "").toLowerCase();

  const map = [
    {keys:["presença","presenca"], out:"presença é quando eu fico — mesmo sem barulho."},
    {keys:["verdade"], out:"verdade é isso: não fazer cena… só ficar."},
    {keys:["silêncio","silencio"], out:"no teu silêncio eu não me perco — eu descanso."},
    {keys:["calma","paz"], out:"com você, calma não é intervalo — é destino."},
    {keys:["casa"], out:"casa é quando o peito para de se defender."},
    {keys:["cuidado"], out:"cuidado é te escolher no detalhe, sem pressa."},
    {keys:["confiança","confianca"], out:"confiança é deixar a mão aberta — e ainda assim ficar."},
    {keys:["honesto","honestidade"], out:"eu quero te amar do jeito mais honesto que eu tiver."},
    {keys:["futuro"], out:"pensar em futuro contigo me dá silêncio bom por dentro."},
    {keys:["conversar"], out:"se doer, eu volto pra conversa. eu volto pra nós."},
    {keys:["orgulho"], out:"eu prefiro nós ao meu orgulho."},
    {keys:["perto"], out:"perto é onde eu fico mais simples."},
    {keys:["voltar"], out:"eu sempre volto pro que importa."},
    {keys:["ficar","fica"], out:"eu fico quando não tem plateia."},
    {keys:["leve"], out:"eu tô aprendendo a ser leve contigo — sem fugir de nada."},
    {keys:["luz"], out:"eu não quero incêndio. eu quero luz."},
    {keys:["simples","cotidiano"], out:"o simples contigo vira raro."},
    {keys:["detalhe"], out:"é no detalhe que eu percebo: eu tô aqui."},
    {keys:["respirar"], out:"quando você aparece, eu respiro melhor."},
    {keys:["seguro"], out:"você me deixa seguro do jeito mais calmo."},
    {keys:["aprender"], out:"eu aprendo a te amar melhor — um dia de cada vez."},
  ];

  for(const row of map){
    if(row.keys.some(x => k.includes(x))) return row.out;
  }

  if(poem.includes("não") && (poem.includes("promessa") || poem.includes("prometer"))){
    return "eu não prometo alto. eu provo no dia comum.";
  }
  if(poem.includes("silêncio") || poem.includes("silencio")){
    return "eu gosto quando o silêncio não vira distância.";
  }
  return "eu fico — do jeito mais calmo que eu sei.";
}

function cleanupAto2Closer(){
  if(window.__ato2Closer){
    document.removeEventListener("pointerdown", window.__ato2Closer, true);
    document.removeEventListener("keydown", window.__ato2Esc, true);
    window.__ato2Closer = null;
    window.__ato2Esc = null;
  }
}

function openAto2Thought(text){
  const box = document.getElementById("ato2ThoughtBox");
  box.textContent = text;
  box.classList.remove("hidden");
  box.setAttribute("aria-hidden","false");
  box.classList.remove("show");
  void box.offsetWidth;
  box.classList.add("show");

  clearTimeout(window.__ato2ThoughtTimer);
  window.__ato2ThoughtTimer = setTimeout(() => closeAto2Thought(), 6200);

  cleanupAto2Closer();

  window.__ato2Closer = (e) => {
    const poemaEl = document.getElementById("poema");
    const u = poemaEl.querySelector(".ato2U, .ato3U");
    if(!box.classList.contains("hidden")){
      if(box.contains(e.target)) return;
      if(u && u.contains(e.target)) return;
      closeAto2Thought();
    }
  };

  window.__ato2Esc = (e) => {
    if(e.key === "Escape") closeAto2Thought();
  };

  document.addEventListener("pointerdown", window.__ato2Closer, true);
  document.addEventListener("keydown", window.__ato2Esc, true);
}

function closeAto2Thought(){
  const box = document.getElementById("ato2ThoughtBox");
  if(box.classList.contains("hidden")) return;

  box.classList.remove("show");
  clearTimeout(window.__ato2ThoughtTimer);

  setTimeout(() => {
    box.classList.add("hidden");
    box.setAttribute("aria-hidden","true");
    box.textContent = "";
    cleanupAto2Closer();
  }, 220);
}

function getAto2PerguntaDoDia(dia){
  if(!Array.isArray(window.ATO2_PERGUNTAS)) return null;
  return window.ATO2_PERGUNTAS.find(item => Number(item.dia) === Number(dia)) || null;
}

function getAto2RespostasSalvas(){
  try{
    return JSON.parse(localStorage.getItem(ATO2_RESPOSTAS_KEY) || "{}");
  }catch(_err){
    return {};
  }
}

function setAto2RespostaSalva(dia, resposta){
  try{
    const data = getAto2RespostasSalvas();
    data[String(dia)] = {
      resposta: String(resposta || ""),
      respondidoEm: new Date().toISOString()
    };
    localStorage.setItem(ATO2_RESPOSTAS_KEY, JSON.stringify(data));
  }catch(_err){
    // evita que falha de localStorage quebre a UI
  }
}

function renderAto2PerguntaUI(dia){
  const box = document.getElementById("ato2PerguntaBox");
  if(!box) return;

  const emModoEspecial =
    document.body.classList.contains("modo-arquivo") ||
    document.body.classList.contains("capsula-mode") ||
    document.body.classList.contains("memoria-mode");

  if(emModoEspecial || getAto(dia) !== 2){
    box.classList.add("hidden");
    box.setAttribute("aria-hidden","true");
    box.innerHTML = "";
    return;
  }

  const cfg = getAto2PerguntaDoDia(dia);
  if(!cfg){
    box.classList.add("hidden");
    box.setAttribute("aria-hidden","true");
    box.innerHTML = "";
    return;
  }

  const respostas = getAto2RespostasSalvas();
  const respostaSalva = respostas[String(dia)]?.resposta || "";
  const jaRespondeu = Boolean(respostaSalva.trim());

  box.classList.remove("hidden");
  box.setAttribute("aria-hidden","false");
  box.innerHTML = "";

  const card = document.createElement("div");
  card.className = "ato2PerguntaCard";

  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "ato2PerguntaBtn";
  botao.textContent = cfg.botao || "posso te perguntar algo?";

  const corpo = document.createElement("div");
  corpo.className = "ato2PerguntaCorpo hidden";

  const pergunta = document.createElement("div");
  pergunta.className = "ato2PerguntaTexto";
  pergunta.textContent = cfg.pergunta || "";

  const textarea = document.createElement("textarea");
  textarea.className = "ato2PerguntaInput";
  textarea.rows = 4;
  textarea.placeholder = "me responde aqui...";
  textarea.autocomplete = "off";
  textarea.spellcheck = false;

  const acoes = document.createElement("div");
  acoes.className = "ato2PerguntaAcoes";

  const enviar = document.createElement("button");
  enviar.type = "button";
  enviar.className = "ato2PerguntaEnviar";
  enviar.textContent = "Responder";

  const minhaRespostaWrap = document.createElement("div");
  minhaRespostaWrap.className = "ato2MinhaResposta hidden";
  minhaRespostaWrap.setAttribute("aria-hidden","true");

  const minhaRespostaTexto = document.createElement("div");
  minhaRespostaTexto.className = "ato2RespostaTexto";
  minhaRespostaTexto.textContent = cfg.minhaResposta || "";

  minhaRespostaWrap.appendChild(minhaRespostaTexto);

  botao.onclick = () => {
    botao.classList.add("hidden");
    corpo.classList.remove("hidden");
    corpo.setAttribute("aria-hidden","false");
    setTimeout(() => textarea.focus(), 60);
  };

  enviar.onclick = () => {
    const valor = textarea.value.trim();
    if(!valor){
      textarea.focus();
      return;
    }

    setAto2RespostaSalva(dia, valor);

    enviar.disabled = true;
    textarea.disabled = true;
    enviar.textContent = "Guardado";

    corpo.classList.add("hidden");
    corpo.setAttribute("aria-hidden","true");

    minhaRespostaWrap.classList.remove("hidden");
    minhaRespostaWrap.setAttribute("aria-hidden","false");

    card.scrollIntoView({ behavior: "smooth" });
  };

  if(jaRespondeu){
    botao.classList.add("hidden");
    minhaRespostaWrap.classList.remove("hidden");
    minhaRespostaWrap.setAttribute("aria-hidden","false");
  }

  acoes.appendChild(enviar);

  corpo.appendChild(pergunta);
  corpo.appendChild(textarea);
  corpo.appendChild(acoes);

  card.appendChild(botao);
  card.appendChild(corpo);
  card.appendChild(minhaRespostaWrap);

  box.appendChild(card);
}

function buildAto3ThoughtFromKeyword(keywordRaw, day){
  const k = (keywordRaw || "").toLowerCase();

  const discovery = {
    "calor":"— tem coisas em você que aquecem tudo sem esforço.",
    "segredos":"— acho que o ar entre nós já sabe antes da gente.",
    "fogo":"— ainda é começo, mas eu já sinto.",
    "perto":"— quando você chega perto, fica difícil fingir calma.",
    "silêncio":"— até o silêncio muda de temperatura.",
    "olhar":"— seu olhar sempre demora um pouco mais do que devia.",
    "curiosidade":"— às vezes o desejo começa assim: querendo entender mais.",
    "energia":"— tem algo entre nós que já não sabe mais se esconder."
  };

  const tension = {
    "tensão":"— eu percebo o quanto tudo muda quando você se aproxima.",
    "energia":"— o espaço entre nós está cheio demais de intenção.",
    "perto":"— parte de mim quer diminuir ainda mais essa distância.",
    "linha":"— a vontade mora exatamente nessa beira.",
    "corpos":"— nossos corpos entendem coisas que a boca ainda não diz.",
    "proximidade":"— eu noto quando a proximidade deixa de ser acaso.",
    "desejo":"— o desejo cresce quieto, mas ocupa tudo."
  };

  const surrender = {
    "escolha":"— o mais bonito é saber que isso não nasceu do impulso.",
    "promessa":"— o que era tensão agora começa a virar caminho.",
    "fogo":"— não é pressa; é entrega no tempo certo.",
    "perto":"— eu já não quero fugir do que sinto quando você está perto.",
    "desejo":"— agora já não parece dúvida; parece verdade.",
    "silêncio":"— até o silêncio entre nós parece aceitar.",
    "calor":"— esse calor já não assusta; ele só confirma."
  };

  const current = day <= 110 ? discovery : day <= 130 ? tension : surrender;

  for(const key in current){
    if(k.includes(key)) return current[key];
  }

  if(day <= 110) return "— tem coisas começando a arder em silêncio.";
  if(day <= 130) return "— às vezes eu quase deixo transparecer demais.";
  return "— depois de certo ponto, sentir também vira escolha.";
}

function applyAto3Underline(dia, rawText){
  if(getAto(dia)!==3) return;

  const poemaEl = document.getElementById("poema");

  const target = pickUnderlineTarget(rawText);
  if(!target) return;

  const before = escapeHtml(rawText.slice(0,target.idx));
  const word = escapeHtml(target.word);
  const after = escapeHtml(rawText.slice(target.idx + target.word.length));

  const thought = buildAto3ThoughtFromKeyword(target.word, dia);

  poemaEl.innerHTML =
  `${before}<span class="ato3U" data-thought="${escapeHtml(thought)}">${word}</span>${after}`;

  const u = poemaEl.querySelector(".ato3U");

  if(u){
    u.addEventListener("click",(e)=>{
      e.stopPropagation();
      openAto2Thought(u.getAttribute("data-thought"));
    });
  }
}

function applyAto2Underline(dia, rawText){
  const poemaEl = document.getElementById("poema");
  if(getAto(dia) !== 2) return;
  if(!rawText || !rawText.trim()) return;

  const target = pickUnderlineTarget(rawText);
  if(!target) return;

  const before = escapeHtml(rawText.slice(0, target.idx));
  const word = escapeHtml(target.word);
  const after = escapeHtml(rawText.slice(target.idx + target.word.length));

  const thought = buildAto2ThoughtFromKeyword(target.word, rawText);

  poemaEl.innerHTML = `${before}<span class="ato2U" data-thought="${escapeHtml(thought)}">${word}</span>${after}`;

  const u = poemaEl.querySelector(".ato2U");
  if(u){
    u.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const t = u.getAttribute("data-thought") || "";
      openAto2Thought(t);
    }, {passive:false});
  }
}

function renderAto2UI(dia){
  const linhas = document.getElementById("ato2Linhas");
  if(document.body.classList.contains("modo-arquivo") || document.body.classList.contains("capsula-mode") || document.body.classList.contains("memoria-mode")){
    esconderAto2UI(true);
    return;
  }
  if(getAto(dia) !== 2){
    esconderAto2UI(true);
    return;
  }
  linhas.classList.remove("hidden");
  linhas.setAttribute("aria-hidden","false");
}

function getAto4PuzzleBgPosition(piece, gridSize){
  const cols = Math.max(1, gridSize - 1);
  const x = cols === 0 ? 0 : (piece.col / cols) * 100;
  const y = cols === 0 ? 0 : (piece.row / cols) * 100;
  return `${x}% ${y}%`;
}

function renderAto4Puzzle(dia){
  const box = document.getElementById("ato4Puzzle");
  const grid = document.getElementById("ato4Grid");
  const hint = document.getElementById("ato4Hint");

  if(!box || !grid || !hint){
    return;
  }

  if(
    document.body.classList.contains("modo-arquivo") ||
    document.body.classList.contains("capsula-mode") ||
    document.body.classList.contains("memoria-mode")
  ){
    esconderAto4UI(true);
    return;
  }

  if(getAto(dia) !== 4 || typeof getAto4PuzzleConfig !== "function" || !isAto4PuzzleDay(dia)){
    esconderAto4UI(true);
    return;
  }

  const cfg = getAto4PuzzleConfig();
  const state = getAto4PuzzleState();
  const currentPieceIndex = getAto4PuzzlePieceIndexByDay(dia);
  const currentAlreadyRevealed = !!state[currentPieceIndex];

  box.classList.remove("hidden");
  box.setAttribute("aria-hidden","false");
  box.querySelector('.ato4PuzzleTitle').textContent = cfg.titulo || "Uma parte de nós.";
  grid.innerHTML = "";
  grid.style.setProperty("--ato4-grid-size", String(cfg.gridSize || 4));

  cfg.pecas.forEach((piece, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ato4Piece";
    btn.setAttribute("aria-label", `Peça ${idx + 1} do quebra-cabeça`);

    const isRevealed = !!state[idx];
    const isCurrent = idx === currentPieceIndex;
    const isLocked = !isRevealed && !isCurrent;

    btn.style.setProperty("--piece-row", String(piece.row));
    btn.style.setProperty("--piece-col", String(piece.col));
    btn.style.backgroundImage = `url("${cfg.image}")`;
    btn.style.backgroundSize = `${cfg.gridSize * 100}% ${cfg.gridSize * 100}%`;
    btn.style.backgroundPosition = getAto4PuzzleBgPosition(piece, cfg.gridSize);

    if(isRevealed){
      btn.classList.add("is-revealed");
      btn.disabled = true;
    } else if(isCurrent){
      btn.classList.add("is-current");
      if(!currentAlreadyRevealed){
        btn.title = cfg.hintAntes || "toque para revelar";
        btn.onclick = () => {
          if(btn.classList.contains("is-revealing")) return;
          btn.classList.add("is-revealing");
          btn.disabled = true;
          setTimeout(() => {
            revealAto4PuzzlePiece(idx);
            renderAto4Puzzle(dia);
          }, 340);
        };
      } else {
        btn.classList.add("is-revealed");
        btn.disabled = true;
      }
    } else if(isLocked){
      btn.classList.add("is-locked");
      btn.disabled = true;
      btn.style.backgroundImage = "none";
    }

    const inner = document.createElement("span");
    inner.className = "ato4PieceInner";

    if(isRevealed || (isCurrent && currentAlreadyRevealed)){
      inner.textContent = "";
      btn.classList.add("is-revealed");
    } else if(isCurrent){
      inner.textContent = "revelar";
    } else {
      inner.textContent = "";
    }

    btn.appendChild(inner);
    grid.appendChild(btn);
  });

  const total = cfg.pecas.length;
  const abertas = countAto4PuzzleRevealed();
  const completo = isAto4PuzzleComplete();

  box.classList.toggle("is-complete", completo);

  if(completo){
    hint.textContent = cfg.fraseFinal || "Peça por peça, fomos construindo algo que hoje eu chamo de nós.";
  } else if(currentAlreadyRevealed){
    hint.textContent = `${cfg.hintDepois || "mais uma peça da nossa história."} · ${abertas}/${total}`;
  } else {
    hint.textContent = `${cfg.hintAntes || "toque para revelar"} · ${abertas}/${total}`;
  }
}

function cleanupAto4Inline(){
  const poemaEl = document.getElementById("poema");
  if(!poemaEl) return;

  if(window.__ato4TouchCloser){
    document.removeEventListener("pointerdown", window.__ato4TouchCloser, true);
    window.__ato4TouchCloser = null;
  }

  if(window.__ato4ScrollObserver){
    window.__ato4ScrollObserver.disconnect();
    window.__ato4ScrollObserver = null;
  }
}

function pickAto4Keyword(text){
  const t = String(text || "");
  const candidates = [
    "calma","escolha","ficando","perto","conectado","certo","raiz","raízes",
    "futuro","vida","casa","presença","rotina","continuar","sólido","solido"
  ];

  function findWord(w){
    const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\b`, "i");
    const m = t.match(re);
    if(m && typeof m.index === "number") return {word: t.slice(m.index, m.index + m[0].length), idx: m.index};
    return null;
  }

  for(const w of candidates){
    const found = findWord(w);
    if(found) return found;
  }
  return pickUnderlineTarget(t);
}

function applyAto4TouchInline(rawText, extraText){
  const poemaEl = document.getElementById("poema");
  if(!poemaEl || !rawText || !extraText) return;

  const target = pickAto4Keyword(rawText);
  if(!target) return;

  const before = escapeHtml(rawText.slice(0, target.idx));
  const word = escapeHtml(target.word);
  const after = escapeHtml(rawText.slice(target.idx + target.word.length));
  const note = escapeHtml(extraText);

  poemaEl.innerHTML =
    `${before}<span class="ato4TouchWrap"><span class="ato4TouchWord">${word}</span><span class="ato4TouchReveal">${note}</span></span>${after}`;

  const wrap = poemaEl.querySelector(".ato4TouchWrap");
  if(!wrap) return;

  const close = () => wrap.classList.remove("is-open");

  wrap.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    wrap.classList.toggle("is-open");
    wrap.setAttribute("aria-expanded", wrap.classList.contains("is-open") ? "true" : "false");
  });

  wrap.setAttribute("role", "button");
  wrap.setAttribute("tabindex", "0");
  wrap.setAttribute("aria-expanded", "false");

  wrap.addEventListener("touchstart", (e) => {
    e.preventDefault();
    e.stopPropagation();
    wrap.classList.toggle("is-open");
    wrap.setAttribute("aria-expanded", wrap.classList.contains("is-open") ? "true" : "false");
  }, { passive: false });

  wrap.addEventListener("keydown", (e) => {
    if(e.key === "Enter" || e.key === " "){
      e.preventDefault();
      wrap.classList.toggle("is-open");
      wrap.setAttribute("aria-expanded", wrap.classList.contains("is-open") ? "true" : "false");
    } else if(e.key === "Escape"){
      close();
      wrap.setAttribute("aria-expanded", "false");
    }
  });

  window.__ato4TouchCloser = (e) => {
    if(!wrap.contains(e.target)){
      close();
      wrap.setAttribute("aria-expanded", "false");
    }
  };
  document.addEventListener("pointerdown", window.__ato4TouchCloser, true);
}

function applyAto4ScrollInline(rawText, extraText){
  const poemaEl = document.getElementById("poema");
  if(!poemaEl || !rawText || !extraText) return;

  const safePoem = escapeHtml(rawText).replace(/\n/g, "<br>");
  const safeExtra = escapeHtml(extraText).replace(/\n/g, "<br>");

  poemaEl.innerHTML =
    `${safePoem}<div class="ato4ScrollWrap"><div class="ato4ScrollReveal" id="ato4ScrollReveal">${safeExtra}</div></div>`;

  const reveal = document.getElementById("ato4ScrollReveal");
  if(!reveal) return;

  window.__ato4ScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting){
        reveal.classList.add("show");
      }
    });
  }, { threshold: 0.35 });

  window.__ato4ScrollObserver.observe(reveal);
}

function applyAto4ExtraInteraction(dia, rawText){
  cleanupAto4Inline();

  if(getAto(dia) !== 4) return;
  if(typeof getAto4Interacao !== "function") return;
  if(typeof isAto4PuzzleDay === "function" && isAto4PuzzleDay(dia)) return;

  const interacao = getAto4Interacao(dia);
  if(!interacao) return;

  if(interacao.type === "touch"){
    applyAto4TouchInline(rawText, interacao.extraText || "");
  } else if(interacao.type === "scroll"){
    applyAto4ScrollInline(rawText, interacao.extraText || "");
  }
}

function afterPoemTyped(dia, rawText){
  const forced = getForcedDay();
  const isTest = (forced !== null);

  if(!isTest && dia === DIA_ATUAL && dia >= 1 && dia <= 30){
    const current = getAto1Unlocked();
    if(dia > current) setAto1Unlocked(dia);
  }

  renderAto1Palavra(dia);
  if(dia === 30 && getAto1Unlocked() >= 30){
    clearTimeout(window.__ato1FinalTimer);
    window.__ato1FinalTimer = setTimeout(() => {
      montarAto1FraseNoCentro();
    }, 480);
  }

  renderAto2UI(dia);
  renderAto2PerguntaUI(dia);
  applyAto3Underline(dia, rawText);
  renderAto3Fogueira(dia);
  applyAto4ExtraInteraction(dia, rawText);
  renderAto4Puzzle(dia);
}

function carregarPoema(dia){
  DIA_EM_TELA = dia;

  const tituloTopo = document.getElementById("tituloTopo");
  const poemaEl = document.getElementById("poema");
  const metaEl = document.getElementById("meta");

  revelarBloco();

  setTemaPorAto(dia);
  setDayAttr(dia);

  esconderCapsulaTrigger();
  fecharCapsulaPage(true);
  fecharMemoriaPage(true);
  esconderAto1UI(true);
  esconderAto2UI(true);
  esconderAto3UI(true);
  esconderAto4UI(true);

  if(dia <= 0){
    document.body.removeAttribute("data-ato");
    document.body.removeAttribute("data-dia");
    document.documentElement.style.setProperty("--auraT", "0");
    tituloTopo.innerText = "Antes do primeiro poema";
    metaEl.innerText = "";
    const textoPrefacio = (typeof PREFACIO !== "undefined" && PREFACIO) ? PREFACIO : "Em breve.";
    typeText(poemaEl, textoPrefacio, 14);
    return;
  }

  if(dia > 365){
    tituloTopo.innerText = "365 dias com você";
    metaEl.innerText = "E mesmo assim, eu ainda escolheria você de novo.";
    typeText(poemaEl, "Fim de um ano.\nE o começo de tudo de novo.", 12);
    return;
  }

  if(dia === 365){
    tituloTopo.innerText = `Dia 365 de 365`;
    metaEl.innerText = "Um poema por dia.";

    const poema365 = (typeof getPoemaDoDia === "function") ? getPoemaDoDia(365) : "";
    typeText(poemaEl, poema365 || "Em breve...", 12, () => {
      mostrarCapsulaTrigger();
    });
    return;
  }

  tituloTopo.innerText = `Dia ${dia} de 365`;
  metaEl.innerText = "Um poema por dia.";

  const texto = (typeof getPoemaDoDia === "function") ? getPoemaDoDia(dia) : "Em breve...";
  typeText(poemaEl, texto, 12, () => afterPoemTyped(dia, texto));
}

function carregarHoje(){
  const forced = getForcedDay();
  showModoTeste(forced);

  if(forced !== null){
    const firstPH = detectarPrimeiroPlaceholder();
    if(firstPH && firstPH <= 160){
      showAvisoPoema(`Aviso: encontrei placeholder a partir do Dia ${firstPH}.`);
      console.warn("Projeto365: primeiro placeholder no Dia", firstPH);
    } else {
      showAvisoPoema("");
    }
  } else {
    showAvisoPoema("");
  }

  if(forced !== null){
    DIA_ATUAL = forced;

    if(DIA_ATUAL >= 1 && DIA_ATUAL <= 30){
      const cur = getAto1Unlocked();
      if(DIA_ATUAL > cur) setAto1Unlocked(DIA_ATUAL);
    }

    const btn = document.getElementById("btnAnteriores");
    btn.disabled = (DIA_ATUAL <= 1);
    sairModoLista();

    if(deveMostrarIntro(DIA_ATUAL)){
      revelarBloco();

      document.getElementById("tituloTopo").innerText = `Dia ${DIA_ATUAL} de 365`;
      document.getElementById("poema").textContent = "";
      document.getElementById("meta").textContent = "";
      setTemaPorAto(DIA_ATUAL);
      setDayAttr(DIA_ATUAL);
      esconderCapsulaTrigger();
      fecharCapsulaPage(true);
      fecharMemoriaPage(true);
      esconderAto1UI(true);
      esconderAto2UI(true);
      esconderAto4UI(true);
      mostrarIntro(DIA_ATUAL);
      return;
    }

    esconderIntro();
    carregarPoema(DIA_ATUAL);
    return;
  }

  const d = diffDias();
  DIA_ATUAL = d + 1;

  aplicarFrasePorHorario();
  verificarRetorno();
  iniciarSegredo();

  const btn = document.getElementById("btnAnteriores");
  btn.disabled = (DIA_ATUAL <= 1);

  sairModoLista();

  if(d < 0){
    esconderIntro();
    carregarPoema(DIA_ATUAL);
    return;
  }

  if(deveMostrarIntro(DIA_ATUAL)){
    revelarBloco();

    document.getElementById("tituloTopo").innerText = `Dia ${DIA_ATUAL} de 365`;
    document.getElementById("poema").textContent = "";
    document.getElementById("meta").textContent = "";
    setTemaPorAto(DIA_ATUAL);
    setDayAttr(DIA_ATUAL);
    esconderCapsulaTrigger();
    fecharCapsulaPage(true);
    fecharMemoriaPage(true);
    esconderAto1UI(true);
    esconderAto2UI(true);
    esconderAto4UI(true);
    mostrarIntro(DIA_ATUAL);
    return;
  }

  esconderIntro();
  carregarPoema(DIA_ATUAL);
}

function voltarParaHoje(){ carregarHoje(); }
function mostrarSaudade(){ document.getElementById("saudade").classList.toggle("hidden"); }

function verificarSenha(){
  const senha = document.getElementById("senha").value;
  if(senha === senhaCorreta){
    document.getElementById("login").classList.add("hidden");
    document.getElementById("conteudo").classList.remove("hidden");
    setCornerDates();
    carregarHoje();
  } else {
    alert("Senha incorreta.");
  }
}

setCornerDates();
setInterval(setCornerDates, 60000);
