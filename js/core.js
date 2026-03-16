const senhaCorreta = "10022024";
const dataInicioPadrao = new Date("2026-02-24T00:00:00");
const START_OVERRIDE_KEY = "projeto365_start_override";

let DIA_ATUAL = 1;
let DIA_EM_TELA = 1;

const ATO1_UNLOCK_KEY = "projeto365_ato1_unlock";
const ATO1_PALAVRAS = [
  "Eu","te","escolho","todos","os","dias,","mesmo","quando","o","mundo","pesa","e","medo","grita,",
  "porque","amar","você","é","decisão","firme:","transformar","incerteza","em","casa,","silêncio",
  "em","abrigo,","futuro","em","promessa."
];

const INTRO_ATOS = {
  31: { tag: "Ato 2 — Conexão", texto:
`Agora a gente se permite chegar mais perto.
Menos defesa.
Mais verdade.

Se o Ato 1 foi escolha,
o Ato 2 é presença.` },
  91: { tag: "Ato 3 — Fogo", texto:
`A intensidade não é pressa.
É entrega consciente.

Aqui, o desejo aparece
com elegância — e coragem.` },
  151:{ tag: "Ato 4 — Crescimento", texto:
`O amor amadurece quando escolhe evoluir.

Não é sobre sentir mais.
É sobre cuidar melhor.` },
  241:{ tag: "Ato 5 — Raiz", texto:
`Agora não é só sentir.
É pertencer.

O que era promessa
vira casa.` },
  331:{ tag: "Ato 6 — Recomeço", texto:
`Escolher de novo
é a forma mais madura de amar.

O fim não fecha.
Ele renova.` }
};

function getForcedDay(){
  try{
    const p = new URLSearchParams(location.search);
    const raw = p.get("day");
    if(!raw) return null;
    const n = Number(raw);
    if(Number.isFinite(n) && n >= 0 && n <= 365) return Math.floor(n);
    return null;
  }catch(e){
    return null;
  }
}

function detectarPrimeiroPlaceholder(){
  try{
    const idx = POEMAS.findIndex(p => (p || "").includes("(Em branco por enquanto)"));
    if(idx === -1) return null;
    return idx + 1;
  }catch(e){
    return null;
  }
}

window.debugPoema = function(dia){
  try{
    const t = (typeof getPoemaDoDia === "function") ? getPoemaDoDia(dia) : "";
    const a = getAto(dia);
    console.log("debugPoema:", {dia, ato:a, texto_inicio: String(t).slice(0, 80), placeholder: String(t).includes("(Em branco por enquanto)")});
    return t;
  }catch(e){
    console.warn("debugPoema erro:", e);
    return null;
  }
};

function getDataInicio(){
  const iso = localStorage.getItem(START_OVERRIDE_KEY);
  if(iso && /^\\d{4}-\\d{2}-\\d{2}$/.test(iso)){
    return new Date(iso + "T00:00:00");
  }
  return dataInicioPadrao;
}

function diffDias(){
  const dataInicio = getDataInicio();
  const hoje = new Date();
  const H = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const I = new Date(dataInicio.getFullYear(), dataInicio.getMonth(), dataInicio.getDate());
  return Math.floor((H - I) / (1000*60*60*24));
}

function getAto(dia){
  if(dia >= 1 && dia <= 30) return 1;
  if(dia >= 31 && dia <= 90) return 2;
  if(dia >= 91 && dia <= 150) return 3;
  if(dia >= 151 && dia <= 240) return 4;
  if(dia >= 241 && dia <= 330) return 5;
  return 6;
}

function getFaixaAto(dia){
  const ato = getAto(dia);
  if(ato === 1) return {start:1, end:30};
  if(ato === 2) return {start:31, end:90};
  if(ato === 3) return {start:91, end:150};
  if(ato === 4) return {start:151, end:240};
  if(ato === 5) return {start:241, end:330};
  return {start:331, end:365};
}

function setAuraProgress(dia){
  if(!Number.isFinite(dia) || dia < 1) {
    document.documentElement.style.setProperty("--auraT", "0");
    return;
  }
  const {start, end} = getFaixaAto(dia);
  const denom = Math.max(1, (end - start));
  const t = (dia - start) / denom;
  const clamped = Math.max(0, Math.min(1, t));
  document.documentElement.style.setProperty("--auraT", clamped.toFixed(4));
}

function setAto2Progress(dia){
  if(getAto(dia) !== 2){
    document.documentElement.style.setProperty("--ato2Gap", "44px");
    return;
  }
  const start = 31, end = 90;
  const denom = Math.max(1, (end - start));
  const t = Math.max(0, Math.min(1, (dia - start) / denom));
  const gap = 44 - (34 * t);
  document.documentElement.style.setProperty("--ato2Gap", `${gap.toFixed(2)}px`);
}

function setTemaPorAto(dia){
  document.body.setAttribute("data-ato", String(getAto(dia)));
  setAuraProgress(dia);
  setAto2Progress(dia);
}

function setDayAttr(dia){
  if(dia >= 1 && dia <= 365) document.body.setAttribute("data-dia", String(dia));
  else document.body.removeAttribute("data-dia");
}

function introKeyForDay(dia){ return `projeto365_intro_vista_${dia}`; }
function deveMostrarIntro(dia){
  if(dia !== DIA_ATUAL) return false;
  if(!INTRO_ATOS[dia]) return false;
  return localStorage.getItem(introKeyForDay(dia)) !== "1";
}
function marcarIntroComoVista(dia){ localStorage.setItem(introKeyForDay(dia), "1"); }

function getAto1Unlocked(){
  const raw = Number(localStorage.getItem(ATO1_UNLOCK_KEY) || 0);
  if(!Number.isFinite(raw)) return 0;
  return Math.max(0, Math.min(30, Math.floor(raw)));
}

function setAto1Unlocked(n){
  const clamped = Math.max(0, Math.min(30, Math.floor(n)));
  localStorage.setItem(ATO1_UNLOCK_KEY, String(clamped));
}
