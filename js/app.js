// js/app.js
// Controlador simples do Projeto 365 (por enquanto):
// - calcula dia atual (com ?day= pra teste)
// - seta data-ato e data-dia
// - seta --auraT (0..1 dentro do ato)
// - renderiza poema em #poema usando window.getPoemaDoDia(dia)

(function () {
  const START_DATE_ISO = "2026-02-24"; // Dia 1
  const startDate = new Date(START_DATE_ISO + "T00:00:00");

  const tituloEl = document.getElementById("titulo");
  const poemaEl = document.getElementById("poema");

  function clamp01(n){ return Math.max(0, Math.min(1, n)); }

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

  function diffDaysFromStart(){
    const now = new Date();
    const H = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const I = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    return Math.floor((H - I) / (1000 * 60 * 60 * 24));
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
    if(!Number.isFinite(dia) || dia < 1){
      document.documentElement.style.setProperty("--auraT", "0");
      return;
    }
    const {start, end} = getFaixaAto(dia);
    const denom = Math.max(1, (end - start));
    const t = (dia - start) / denom;         // 0..1 dentro do ato
    document.documentElement.style.setProperty("--auraT", clamp01(t).toFixed(4));
  }

  function setTema(dia){
    const ato = getAto(dia);
    document.body.setAttribute("data-ato", String(ato));
    if(dia >= 0 && dia <= 365) document.body.setAttribute("data-dia", String(dia));
    else document.body.removeAttribute("data-dia");
    setAuraProgress(dia);
  }

  function render(dia){
    setTema(dia);

    // título em cima (você pode trocar depois)
    if(dia <= 0){
      tituloEl.textContent = "Antes do primeiro poema.";
    }else{
      tituloEl.textContent = `Dia ${dia} de 365`;
    }

    // poema
    const texto = (typeof window.getPoemaDoDia === "function")
      ? window.getPoemaDoDia(dia)
      : "Ainda não carregou getPoemaDoDia().";

    // simples (sem typing por enquanto)
    poemaEl.textContent = texto || "";
  }

  function boot(){
    const forced = getForcedDay();
    const dia = (forced !== null) ? forced : (diffDaysFromStart() + 1);
    render(dia);
  }

  boot();
})();
