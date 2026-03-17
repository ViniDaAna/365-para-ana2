window.ATO4_INTERACOES = {
  puzzleDays: [151, 156, 162, 168, 173, 179, 185, 191, 196, 202, 208, 214, 220, 226, 233, 240],
  touchDays: [152, 155, 158, 161, 165, 169, 172, 176, 181, 184, 188, 193, 197, 203, 206, 211, 215, 218, 222, 225, 229, 234, 237, 239],
  scrollDays: [153, 154, 157, 159, 163, 164, 166, 167, 170, 171, 174, 175, 177, 178, 182, 183, 186, 187, 189, 190, 194, 195, 198, 199, 201, 204, 205, 207, 209, 212, 213, 216, 217, 219, 221, 223, 224, 227, 228, 230, 231, 232, 235, 236, 238],
  touchNotes: {
  "152": "— e eu gosto do jeito calmo como a gente escolheu ficar.",
  "155": "— tem coisas que criam raiz antes mesmo de receber nome.",
  "158": "— eu percebo você ficando cada vez mais casa pra mim.",
  "161": "— crescer com você nunca pareceu peso; pareceu caminho.",
  "165": "— o que era impulso agora tem direção.",
  "169": "— eu gosto do que a gente constrói no detalhe.",
  "172": "— ficar também é uma forma de amar.",
  "176": "— às vezes maturidade é só continuar escolhendo.",
  "181": "— o futuro parece menos distante quando eu penso em nós.",
  "184": "— o simples contigo sempre ganha profundidade.",
  "188": "— tem paz no jeito que a gente se entende.",
  "193": "— amor também amadurece quando encontra abrigo.",
  "197": "— você foi virando rotina sem nunca virar costume.",
  "203": "— eu confio no que a gente constrói em silêncio.",
  "206": "— eu gosto de tudo o que em nós deixou de ser dúvida.",
  "211": "— tem domingos que parecem prévia do resto da vida.",
  "215": "— continuar também pode ser um gesto bonito.",
  "218": "— tem raízes que crescem longe dos olhos e mesmo assim sustentam tudo.",
  "222": "— em você, eu descanso sem precisar me afastar de mim.",
  "225": "— o nosso jeito de ficar foi ficando cada vez mais certo.",
  "229": "— tem amor que não faz barulho; só permanece.",
  "234": "— eu percebo o quanto nós já somos parte da vida um do outro.",
  "237": "— eu gosto do futuro quando ele começa em você.",
  "239": "— peça por peça, a gente foi virando algo muito maior."
},
  scrollNotes: {
  "153": "E talvez crescer seja exatamente isso:\ncontinuar, mas de um jeito mais inteiro.",
  "154": "Hoje eu percebo:\no amor mais forte nem sempre é o mais barulhento.",
  "157": "Tem coisas em nós\nque amadureceram sem perder a ternura.",
  "159": "E quanto mais o tempo passa,\nmais eu reconheço você no que me faz bem.",
  "163": "O que a gente tem\njá não depende de impulso para existir.",
  "164": "É bonito quando o amor\ndecide criar raízes em vez de pressa.",
  "166": "Eu te vejo no futuro\nsem precisar forçar a imagem.",
  "167": "Algumas certezas\nse repetem até virarem paz.",
  "170": "Hoje, amar você\njá parece parte natural da minha vida.",
  "171": "Tem calma demais no que sentimos\npra isso ser só acaso.",
  "174": "A gente foi ficando\naté virar presença constante.",
  "175": "E o mais bonito\né que nada disso pareceu esforço.",
  "177": "O amor que cresce\ntambém aprende a respirar.",
  "178": "Tem vínculos que se fortalecem\nsó porque duas pessoas continuam.",
  "182": "Eu gosto do que o tempo fez com a gente:\nmenos medo, mais escolha.",
  "183": "Com você,\naté o comum parece construção.",
  "186": "Não foi de uma vez.\nFoi em cada detalhe que a gente sustentou.",
  "187": "Talvez maturidade seja isso:\nseguir perto sem perder a leveza.",
  "189": "Hoje eu já não penso em nós como hipótese.\nPenso como direção.",
  "190": "Tem dias em que eu sinto\nque já estamos construindo casa sem perceber.",
  "194": "Você foi ficando\ne eu fui entendendo que isso era amor.",
  "195": "A raiz cresce escondida,\nmas é ela que segura o resto.",
  "198": "O que antes tremia,\nagora permanece.",
  "199": "Eu te amo também no jeito\ndelicado como a vida vai se organizando perto de você.",
  "201": "Tem um tipo de paz\nque só aparece quando o sentimento amadurece.",
  "204": "Hoje eu reconheço a nossa força\nnas coisas que parecem pequenas.",
  "205": "Quanto mais a gente vive,\nmais eu entendo o valor de continuar.",
  "207": "Não é mais só sobre sentir.\nÉ sobre construir.",
  "209": "Tem amor que vai deixando marcas boas\naté no jeito da gente olhar o amanhã.",
  "212": "A gente foi se tornando mais sólido\nsem perder o encanto.",
  "213": "Eu gosto de perceber\nque o nosso futuro já começou em detalhes.",
  "216": "O que eu sinto por você\nnão corre mais: permanece.",
  "217": "Tem beleza no que cresce devagar\ne escolhe ficar.",
  "219": "Amar você também me ensinou\na ter mais calma diante da vida.",
  "221": "Hoje eu não penso só no agora.\nPenso no que ainda vamos construir.",
  "223": "Tem vínculos que param de doer\ne começam a florescer.",
  "224": "Você virou presença\nantes mesmo de virar rotina.",
  "227": "Quanto mais o tempo anda,\nmais eu gosto de andar ao seu lado.",
  "228": "Em você,\na permanência deixou de me assustar.",
  "230": "O que construímos\njá não cabe em palavras pequenas.",
  "231": "Tem dias em que amar você\nparece a coisa mais certa que eu já fiz.",
  "232": "A vida perto de você\nganha outra textura.",
  "235": "Talvez a nossa história esteja só começando,\nmas já parece raiz.",
  "236": "Quando eu penso em abrigo,\nmeu coração já sabe para onde olhar.",
  "238": "Tudo o que cresce de verdade\naprende primeiro a permanecer."
}
};

function getAto4Interacao(dia) {
  const d = Number(dia);
  if (!window.ATO4_INTERACOES) return null;
  if (window.ATO4_INTERACOES.puzzleDays.includes(d)) return { type: "puzzle" };
  if (window.ATO4_INTERACOES.touchDays.includes(d)) {
    return { type: "touch", extraText: window.ATO4_INTERACOES.touchNotes[d] || "" };
  }
  if (window.ATO4_INTERACOES.scrollDays.includes(d)) {
    return { type: "scroll", extraText: window.ATO4_INTERACOES.scrollNotes[d] || "" };
  }
  return null;
}

