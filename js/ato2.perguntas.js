(function () {

  function getDiaAtual() {
    return window.getDiaAtual ? window.getDiaAtual() : 1;
  }

  function getPerguntaHoje() {
    const dia = getDiaAtual();
    return window.ATO2_PERGUNTAS.find(p => p.dia === dia);
  }

  function salvarResposta(chave, valor) {
    const data = JSON.parse(localStorage.getItem("ato2_respostas") || "{}");
    data[chave] = valor;
    localStorage.setItem("ato2_respostas", JSON.stringify(data));
  }

  function criarBloco(perguntaData) {
    const container = document.createElement("div");
    container.className = "ato2-container";

    const botao = document.createElement("button");
    botao.className = "ato2-botao";
    botao.innerText = perguntaData.botao;

    botao.onclick = () => {
      botao.remove();

      const pergunta = document.createElement("p");
      pergunta.className = "ato2-pergunta";
      pergunta.innerText = perguntaData.pergunta;

      const input = document.createElement("textarea");
      input.className = "ato2-input";

      const enviar = document.createElement("button");
      enviar.innerText = "ok";
      enviar.className = "ato2-enviar";

      enviar.onclick = () => {
        salvarResposta("dia_" + perguntaData.dia, input.value);

        input.remove();
        enviar.remove();

        setTimeout(() => {
          const resposta = document.createElement("p");
          resposta.className = "ato2-resposta";
          resposta.innerText = "eu fiquei pensando nisso também...\n\n" + perguntaData.resposta;
          container.appendChild(resposta);
        }, 900);
      };

      container.appendChild(pergunta);
      container.appendChild(input);
      container.appendChild(enviar);
    };

    container.appendChild(botao);
    return container;
  }

  function initAto2Perguntas() {
    const data = getPerguntaHoje();
    if (!data) return;

    const alvo = document.querySelector("#poema-container");
    if (!alvo) return;

    const bloco = criarBloco(data);
    alvo.appendChild(bloco);
  }

  document.addEventListener("DOMContentLoaded", initAto2Perguntas);

})();
