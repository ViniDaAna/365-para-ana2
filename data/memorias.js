// data/memorias.js
// Memórias desbloqueáveis

(function(){
  window.MEMORIAS = {
    30: `Naquele dia eu decidi.

Eu preciso te contar uma coisa.

O Projeto 365 não nasceu num dia perfeito.
Nasceu num dia comum. Um daqueles dias em que a cabeça fica cheia e o peito fica meio silencioso.

Eu tava pensando em você — do jeito que a gente pensa quando a pessoa já mora na gente, sem pedir licença.
E eu me peguei com medo.

Medo de deixar o tempo levar o que eu sinto.
Medo de amar e não saber mostrar direito.
Medo de você não enxergar o tamanho do que eu guardo.

Aí eu pensei: “eu preciso criar um jeito de te provar constância.”
Não com promessa. Com presença.

E foi aí que a ideia apareceu:
um lugar só nosso. Escuro, elegante, simples… como se fosse um arquivo secreto.
E dentro, uma coisa que ninguém consegue fingir por muito tempo:

todo dia, eu estar aqui.

Não pra te prender.
Pra te lembrar.

Que eu escolhi você.
E que eu vou continuar escolhendo.`,
    60: `Eu lembro como se eu estivesse te contando agora.

Era 19:00.
A gente no shopping, indo pro cinema com aquela mistura de empolgação e nervoso que dá vontade de fingir que não existe.

A gente foi assistir Aquaman…
e eu juro que tentei prestar atenção.
Mas eu tava muito mais preocupado em parecer tranquilo do que em entender o filme.

Eu lembro de pensar: “não estraga isso”.
Lembro do meu coração acelerado tentando disfarçar.
Lembro de você ali do meu lado, e de como aquilo já parecia diferente.

No fim, a gente nem assistiu direito.

Mas eu saí daquele cinema com um sorriso bobo,
daquele tipo que você tenta esconder e não consegue.

Talvez o filme tenha sido qualquer coisa.
Mas você… já tava ficando.`,
    90: `Eu lembro daquela noite.

A gente tinha discutido.
Não foi grito.
Mas foi pesado.

Palavras atravessadas.
Silêncios longos demais.
Aquela sensação incômoda
de que talvez algo tivesse quebrado.

Eu deitei com a cabeça cheia.
Orgulho misturado com medo.
Medo misturado com saudade.

E pela primeira vez
não era a ideia de “estar certo”
que me incomodava.

Era a possibilidade de te perder.

Eu pensei em como seria
acordar e não ter sua mensagem.
Não ter seu bom dia.
Não ter você.

E aquilo doeu mais
do que qualquer argumento.

Naquela madrugada
eu entendi uma coisa:

amar não é nunca brigar.
É decidir que a briga
não é maior que o que a gente construiu.

No dia seguinte,
quando a gente conversou —
de verdade —
sem ataque,
sem defesa,
só verdade —

eu senti algo diferente.

Não era só alívio.
Era maturidade.

Você poderia ter ido.
Eu poderia ter me fechado.

Mas nós ficamos.

E ali eu percebi
que o nosso amor
não depende de dias perfeitos.

Ele depende da nossa escolha.

E desde aquela noite,
toda vez que algo ameaça nos afastar,
eu lembro de como a gente voltou.

E isso me acalma.

Porque eu sei
que se for preciso,

a gente escolhe de novo.`,
    120: `Em breve...`,
    150: `Em breve...`,
    180: `Em breve...`,
    210: `Em breve...`,
    240: `Em breve...`,
    270: `Em breve...`,
    300: `Em breve...`,
    330: `Em breve...`,
  };

  window.getMemoriaDoDia = function(dia){
    return window.MEMORIAS?.[dia] || "";
  };
})();
