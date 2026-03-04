// data/poemas.index.js
// Junta os poemas de todos os atos e expõe getPoemaDoDia()

(function () {
  // Array final com 365 posições
  const POEMAS = new Array(365).fill(null);

  // Helper para preencher uma faixa
  function fillRange(startDia, arr) {
    for (let i = 0; i < arr.length; i++) {
      const dia = startDia + i;           // dia real (1..365)
      const idx = dia - 1;                // índice 0..364
      if (idx >= 0 && idx < 365) {
        POEMAS[idx] = String(arr[i] ?? "").trim();
      }
    }
  }

  // ====== Atos (cada arquivo define um array global) ======
  // Esperados:
  // window.POEMAS_ATO_1 (1..30)
  // window.POEMAS_ATO_2 (31..90)
  // window.POEMAS_ATO_3 (91..150)
  // window.POEMAS_ATO_4 (151..240)
  // window.POEMAS_ATO_5 (241..330)
  // window.POEMAS_ATO_6 (331..365)

  if (Array.isArray(window.POEMAS_ATO_1)) fillRange(1,   window.POEMAS_ATO_1);
  if (Array.isArray(window.POEMAS_ATO_2)) fillRange(31,  window.POEMAS_ATO_2);
  if (Array.isArray(window.POEMAS_ATO_3)) fillRange(91,  window.POEMAS_ATO_3);
  if (Array.isArray(window.POEMAS_ATO_4)) fillRange(151, window.POEMAS_ATO_4);
  if (Array.isArray(window.POEMAS_ATO_5)) fillRange(241, window.POEMAS_ATO_5);
  if (Array.isArray(window.POEMAS_ATO_6)) fillRange(331, window.POEMAS_ATO_6);

  // Placeholder quando não houver poema
  function placeholder(dia) {
    return `Dia ${dia}

(Em branco por enquanto)

Se você está vendo isso, é porque esse poema ainda não foi escrito no arquivo do ato correspondente.`;
  }

  // API pública
  function getPoemaDoDia(dia) {
    const d = Number(dia);
    if (!Number.isFinite(d)) return "Em breve...";
    if (d <= 0) return (window.PREFACIO || "Em breve.");
    if (d > 365) return POEMAS[364] || placeholder(365);
    return POEMAS[d - 1] || placeholder(d);
  }

  // expõe global
  window.getPoemaDoDia = getPoemaDoDia;
})();
