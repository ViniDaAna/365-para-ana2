(function () {
  const STORAGE_KEY = "projeto365_ato2_respostas";

  function getRoot() {
    return document.getElementById("ato2PerguntaBox");
  }

  function getPerguntaByDia(dia) {
    if (!Array.isArray(window.ATO2_PERGUNTAS)) return null;
    return window.ATO2_PERGUNTAS.find((item) => item.dia === dia) || null;
  }

  function readStore() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function writeStore(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function buildAnswerKey(dia) {
    return `dia_${dia}`;
  }

  function saveResposta(dia, pergunta, respostaDela) {
    const data = readStore();
    data[buildAnswerKey(dia)] = {
      dia,
      pergunta,
      respostaDela,
      respondedAt: new Date().toISOString()
    };
    writeStore(data);
  }

  function getRespostaSalva(dia) {
    const data = readStore();
    return data[buildAnswerKey(dia)] || null;
  }

  function hideAto2PerguntasUI(silencioso) {
    const root = getRoot();
    if (!root) return;
    root.classList.add("hidden");
    root.setAttribute("aria-hidden", "true");
    if (!silencioso) {
      root.innerHTML = "";
    }
  }

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (typeof text === "string") el.textContent = text;
    return el;
  }

  function renderResposta(root, item) {
    const wrap = createEl("div", "ato2AskCard ato2MyAnswer");
    const intro = createEl("div", "ato2MyAnswerIntro", "eu respondi assim...");
    const text = createEl("div", "ato2MyAnswerText", item.resposta);
    wrap.appendChild(intro);
    wrap.appendChild(text);
    root.appendChild(wrap);
  }

  function renderPergunta(root, item) {
    const card = createEl("div", "ato2AskCard");
    const btn = createEl("button", "ato2AskBtn", item.botao);
    btn.type = "button";

    btn.addEventListener("click", () => {
      card.innerHTML = "";

      const pergunta = createEl("div", "ato2QuestionText", item.pergunta);
      const textarea = document.createElement("textarea");
      textarea.className = "ato2AnswerInput";
      textarea.placeholder = "me responde aqui...";
      textarea.setAttribute("aria-label", item.pergunta);

      const actions = createEl("div", "ato2Actions");
      const send = createEl("button", "ato2SendBtn", "ok");
      send.type = "button";

      send.addEventListener("click", () => {
        const valor = (textarea.value || "").trim();
        if (!valor) {
          textarea.focus();
          return;
        }

        saveResposta(item.dia, item.pergunta, valor);

        card.innerHTML = "";
        root.innerHTML = "";

        window.setTimeout(() => {
          renderResposta(root, item);
        }, 850);
      });

      actions.appendChild(send);
      card.appendChild(pergunta);
      card.appendChild(textarea);
      card.appendChild(actions);
      textarea.focus();
    });

    card.appendChild(btn);
    root.appendChild(card);
  }

  function renderAto2PerguntasUI(dia) {
    const root = getRoot();
    if (!root) return;

    if (
      document.body.classList.contains("modo-arquivo") ||
      document.body.classList.contains("capsula-mode") ||
      document.body.classList.contains("memoria-mode")
    ) {
      hideAto2PerguntasUI(true);
      return;
    }

    const item = getPerguntaByDia(dia);

    if (!item) {
      hideAto2PerguntasUI(true);
      return;
    }

    root.innerHTML = "";
    root.classList.remove("hidden");
    root.setAttribute("aria-hidden", "false");

    const respostaSalva = getRespostaSalva(dia);
    if (respostaSalva) {
      renderResposta(root, item);
      return;
    }

    renderPergunta(root, item);
  }

  window.hideAto2PerguntasUI = hideAto2PerguntasUI;
  window.renderAto2PerguntasUI = renderAto2PerguntasUI;
})();


