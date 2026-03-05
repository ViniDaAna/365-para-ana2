// data/segredos.js
// Projeto 365 — Conteúdos “extras” (sem lógica pesada)
// - Segredos (toast)
// - Ato 1 (palavras da frase)
// - Intros de atos (transições)

(function () {
  "use strict";

  // =========================
  // SEGREDOS (TOAST)
  // =========================
  window.SEGREDOS = [
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

  window.pickSegredo = function pickSegredo() {
    const arr = window.SEGREDOS || [];
    if (!arr.length) return "";
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // =========================
  // ATO 1 — FRASE (30 palavras)
  // (usado no Entrelinhas e montagem do Dia 30)
  // =========================
  window.ATO1_PALAVRAS = [
    "Eu","te","escolho","todos","os","dias,","mesmo","quando","o","mundo","pesa","e","medo","grita,",
    "porque","amar","você","é","decisão","firme:","transformar","incerteza","em","casa,","silêncio",
    "em","abrigo,","futuro","em","promessa."
  ];

  // Chave do progresso do Ato 1
  window.ATO1_UNLOCK_KEY = "projeto365_ato1_unlock";

  // =========================
  // INTRODUÇÕES DE ATO (transição)
  // =========================
  window.INTRO_ATOS = {
    31: {
      tag: "Ato 2 — Conexão",
      texto:
`Agora a gente se permite chegar mais perto.
Menos defesa.
Mais verdade.

Se o Ato 1 foi escolha,
o Ato 2 é presença.`
    },
    91: {
      tag: "Ato 3 — Fogo",
      texto:
`A intensidade não é pressa.
É entrega consciente.

Aqui, o desejo aparece
com elegância — e coragem.`
    },
    151: {
      tag: "Ato 4 — Crescimento",
      texto:
`O amor amadurece quando escolhe evoluir.

Não é sobre sentir mais.
É sobre cuidar melhor.`
    },
    241: {
      tag: "Ato 5 — Raiz",
      texto:
`Agora não é só sentir.
É pertencer.

O que era promessa
vira casa.`
    },
    331: {
      tag: "Ato 6 — Recomeço",
      texto:
`Escolher de novo
é a forma mais madura de amar.

O fim não fecha.
Ele renova.`
    }
  };
})();
