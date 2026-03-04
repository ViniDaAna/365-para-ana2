// data/segredos.js
// Segredos por dia (eventos especiais) + fallback

(function () {
  // Segredo especial do Dia 120 (Ato 3 — Fogo)
  // Você pode mudar o texto quando quiser.
  const SEGREDOS_POR_DIA = {
    120: `Dia 120

Eu não quero pressa.
Quero você ficando.

Mas tem uma verdade que eu escondo atrás da calma:

eu te desejo.

E eu gosto do jeito que esse desejo
não pede permissão —
ele só me encontra.

Eu tento ser controle.
Mas perto de você
eu viro fogo bem educado.`,

    // (Já deixo o 150 preparado pra gente completar no próximo passo)
    150: `Dia 150

Em breve...`
  };

  const SEGREDOS_FALLBACK = [
    "Eu ainda estou aqui.",
    "Você chegou. Eu já respirei melhor.",
    "Esse lugar é seu também.",
    "Eu escolho você, mesmo nos dias comuns.",
    "Se o mundo estiver barulhento, fica aqui um pouco.",
    "Eu gosto quando você volta.",
    "O que a gente tem merece cuidado.",
    "Eu não tenho pressa. Eu tenho certeza.",
    "Aqui é onde eu fico.",
    "Eu penso em você com calma.",
    "Mesmo em silêncio, eu continuo.",
    "Você é a minha decisão tranquila.",
    "Se você ler isso, é porque existe nós.",
    "Eu guardo você nas coisas pequenas.",
    "Não precisa de nada grandioso. Só de você aqui."
  ];

  function pick(arr){
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // API pública
  window.getSegredoDoDia = function (dia) {
    const d = Number(dia);
    if (!Number.isFinite(d)) return "";
    return SEGREDOS_POR_DIA[d] || "";
  };

  window.getSegredoFallback = function () {
    return pick(SEGREDOS_FALLBACK);
  };
})();
