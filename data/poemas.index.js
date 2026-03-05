// data/poemas.index.js
(function () {
  const POEMAS = new Array(365).fill(null);

  function fillRange(startDia, arr) {
    for (let i = 0; i < arr.length; i++) {
      const dia = startDia + i;
      const idx = dia - 1;
      if (idx >= 0 && idx < 365) {
        POEMAS[idx] = String(arr[i] ?? "").trim();
      }
    }
  }

  if (Array.isArray(window.POEMAS_ATO_1)) fillRange(1, window.POEMAS_ATO_1);
  if (Array.isArray(window.POEMAS_ATO_2)) fillRange(31, window.POEMAS_ATO_2);
  if (Array.isArray(window.POEMAS_ATO_3)) fillRange(91, window.POEMAS_ATO_3);
  if (Array.isArray(window.POEMAS_ATO_4)) fillRange(151, window.POEMAS_ATO_4);
  if (Array.isArray(window.POEMAS_ATO_5)) fillRange(241, window.POEMAS_ATO_5);
  if (Array.isArray(window.POEMAS_ATO_6)) fillRange(331, window.POEMAS_ATO_6);

  function placeholder(dia) {
    return `Dia ${dia}

(Em branco por enquanto)

Se você está vendo isso, é porque esse poema ainda não foi escrito no arquivo do ato correspondente.`;
  }

  // ✅ Sanity: garante que Dia 29/30 nunca "somem" por buraco de array
  for (let d = 1; d <= 365; d++) {
    if (!POEMAS[d - 1] || !String(POEMAS[d - 1]).trim()) {
      POEMAS[d - 1] = placeholder(d);
    }
  }

  function getPoemaDoDia(dia) {
    const d = Number(dia);
    if (!Number.isFinite(d)) return "Em breve...";
    if (d <= 0) return (window.PREFACIO || "Em breve.");
    if (d > 365) return POEMAS[364] || placeholder(365);
    return POEMAS[d - 1] || placeholder(d);
  }

  window.getPoemaDoDia = getPoemaDoDia;
})();
