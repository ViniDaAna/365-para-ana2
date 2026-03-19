const ATO3_FOGO_LEVEL_KEY = "projeto365_ato3_fogo_nivel";
const ATO3_FOGO_PAPEIS_KEY = "projeto365_ato3_papeis";
const ATO3_FOGO_FINAL_KEY = "projeto365_ato3_final_revelado";

function getAto3PapeisQueimados(){
  try{
    const data = JSON.parse(localStorage.getItem(ATO3_FOGO_PAPEIS_KEY) || "[]");
    return Array.isArray(data) ? data.map(Number).filter(Number.isFinite) : [];
  }catch(_err){
    return [];
  }
}

function setAto3PapeisQueimados(list){
  localStorage.setItem(ATO3_FOGO_PAPEIS_KEY, JSON.stringify(Array.from(new Set(list.map(Number).filter(Number.isFinite))).sort((a,b)=>a-b)));
}

function getAto3FogoNivel(){
  const queimados = getAto3PapeisQueimados().length;
  const saved = Number(localStorage.getItem(ATO3_FOGO_LEVEL_KEY) || 0);
  return Math.max(queimados, Number.isFinite(saved) ? saved : 0);
}

function setAto3FogoNivel(nivel){
  const safe = Math.max(0, Math.min(15, Number(nivel) || 0));
  localStorage.setItem(ATO3_FOGO_LEVEL_KEY, String(safe));
}

function isAto3PaperDay(dia){
  return !!(window.ATO3_FOGUEIRA_CONFIG && ATO3_FOGUEIRA_CONFIG.diasComPapel.includes(Number(dia)));
}

function getAto3PaperText(dia){
  if(!window.ATO3_FOGUEIRA_CONFIG) return "";
  return ATO3_FOGUEIRA_CONFIG.frases[String(dia)] || ATO3_FOGUEIRA_CONFIG.frases[Number(dia)] || "";
}

function wasAto3PaperBurned(dia){
  return getAto3PapeisQueimados().includes(Number(dia));
}

function markAto3PaperBurned(dia){
  const papers = getAto3PapeisQueimados();
  if(!papers.includes(Number(dia))){
    papers.push(Number(dia));
    setAto3PapeisQueimados(papers);
    setAto3FogoNivel(papers.length);
  }
}

function isAto3FinalRevealed(){
  return localStorage.getItem(ATO3_FOGO_FINAL_KEY) === "1";
}

function setAto3FinalRevealed(){
  localStorage.setItem(ATO3_FOGO_FINAL_KEY, "1");
}

function getAto3FogoClass(nivel){
  if(nivel <= 0) return "is-cold";
  if(nivel <= 2) return "is-ember";
  if(nivel <= 6) return "is-small";
  if(nivel <= 10) return "is-medium";
  if(nivel <= 14) return "is-strong";
  return "is-peak";
}

function escapeAto3Html(text){
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildAto3FogueiraHTML(dia){
  const nivel = getAto3FogoNivel();
  const fogoClass = getAto3FogoClass(nivel);
  const finalRevealed = isAto3FinalRevealed();
  const finalDay = Number(dia) === 150;
  const showPaper = isAto3PaperDay(dia) && !wasAto3PaperBurned(dia) && !finalDay;
  const paperText = getAto3PaperText(dia);
  const finalText = escapeAto3Html((window.ATO3_FOGUEIRA_CONFIG && ATO3_FOGUEIRA_CONFIG.mensagemFinal) || "").replace(/\n/g, "<br>");

  return `
    <div class="ato3FireWrap ${fogoClass} ${finalDay ? "is-final-day" : ""} ${finalRevealed ? "is-final-revealed" : ""}" data-fire-level="${nivel}">
      <div class="ato3Glow"></div>
      <div class="ato3PaperLaunch" id="ato3PaperLaunch" aria-hidden="true"></div>

      <div class="ato3PaperBlock ${showPaper ? "" : "hidden"}">
        <button type="button" class="ato3Paper" id="ato3PaperBtn">${escapeAto3Html(paperText)}</button>
      </div>

      <div class="ato3FireScene">
        <div class="ato3Ash"></div>
        <div class="ato3Logs">
          <span></span><span></span><span></span>
        </div>
        <div class="ato3Flames">
          <span class="flame flame-1"></span>
          <span class="flame flame-2"></span>
          <span class="flame flame-3"></span>
          <span class="flame flame-4"></span>
        </div>
        <div class="ato3Embers"></div>
      </div>

      <div class="ato3Hint ${showPaper ? "" : "hidden"}">toca no papel e deixa queimar.</div>

      <div class="ato3FinalText ${finalRevealed ? "show" : ""}" id="ato3FinalText">${finalText}</div>
    </div>
  `;
}

function attachAto3PaperHandler(dia){
  const btn = document.getElementById("ato3PaperBtn");
  if(!btn) return;

  btn.addEventListener("click", () => {
    if(btn.disabled) return;
    btn.disabled = true;

    const launch = document.getElementById("ato3PaperLaunch");
    if(launch){
      launch.textContent = btn.textContent;
      launch.classList.add("show", "fly");
    }

    btn.classList.add("is-burning");

    window.clearTimeout(window.__ato3BurnTimer);
    window.__ato3BurnTimer = window.setTimeout(() => {
      markAto3PaperBurned(dia);
      renderAto3Fogueira(dia);
    }, 900);
  }, { once: true });
}

function maybeTriggerAto3Final(){
  if(isAto3FinalRevealed()) return;

  const box = document.getElementById("ato3Fogueira");
  const wrap = box ? box.querySelector(".ato3FireWrap") : null;
  const finalText = document.getElementById("ato3FinalText");
  if(!box || !wrap || !finalText) return;

  window.clearTimeout(window.__ato3FinalStartTimer);
  window.clearTimeout(window.__ato3FinalRevealTimer);

  window.__ato3FinalStartTimer = window.setTimeout(() => {
    wrap.classList.add("is-extinguishing");

    window.__ato3FinalRevealTimer = window.setTimeout(() => {
      wrap.classList.add("is-final-revealed");
      finalText.classList.add("show");
      setAto3FinalRevealed();
    }, 2100);
  }, 900);
}

function renderAto3Fogueira(dia){
  const box = document.getElementById("ato3Fogueira");
  if(!box) return;

  const specialMode =
    document.body.classList.contains("modo-arquivo") ||
    document.body.classList.contains("capsula-mode") ||
    document.body.classList.contains("memoria-mode");

  if(getAto(dia) !== 3 || specialMode){
    box.classList.add("hidden");
    box.setAttribute("aria-hidden", "true");
    box.innerHTML = "";
    return;
  }

  box.classList.remove("hidden");
  box.setAttribute("aria-hidden", "false");
  box.innerHTML = buildAto3FogueiraHTML(dia);

  if(isAto3PaperDay(dia) && !wasAto3PaperBurned(dia) && Number(dia) !== 150){
    attachAto3PaperHandler(dia);
  }

  if(Number(dia) === 150){
    maybeTriggerAto3Final();
  }
}
