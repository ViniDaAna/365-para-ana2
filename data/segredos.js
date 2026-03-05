// data/segredos.js
(function () {
  const segredos = [
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

  window.getSegredoAleatorio = function () {
    return segredos[Math.floor(Math.random() * segredos.length)];
  };
})();
