const MEMORY_INTERVAL = 30;
const FINAL_LETTER_DAY = 365;

const MEMORIAS = {
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
  120: `Eu lembro exatamente do nosso primeiro beijo.

Naquele momento parecia simples,
mas minha cabeça estava a mil.

Eu pensava em tudo ao mesmo tempo:
se você estava sentindo o mesmo,
se aquilo mudaria tudo entre nós,
se era cedo demais
ou exatamente a hora certa.

Quando aconteceu,
foi como se o mundo tivesse ficado em silêncio
por um instante.

E eu percebi uma coisa muito clara:

aquele momento
ia ficar guardado para sempre.

Não foi só um beijo.

Foi o momento
em que eu entendi
que nossa história
tinha realmente começado.`,
  150: `A viagem para o casamento da minha prima
é uma lembrança que sempre volta na minha cabeça.

A estrada,
as conversas,
a sensação de que estávamos vivendo algo especial
mesmo nos momentos mais simples.

E claro,
aquela foto nossa
dando um selinho no casamento.

Sempre que penso nela
eu lembro
do quanto aquele dia foi leve.

Não era apenas uma viagem.

Era a sensação
de que estávamos construindo memórias
que um dia olharíamos para trás
e sorriríamos juntos.`,
  180: `Eu lembro daquele dia que a gente começou a falar
sobre filhos.

No começo parecia algo distante,
quase como um assunto que a gente
não precisava resolver agora.

Mas, conforme a conversa foi acontecendo,
eu percebi que não era só sobre isso.

Era sobre o nosso futuro.
Sobre o tipo de vida que a gente quer.
Sobre como a gente pensa.

E o mais marcante foi o jeito
que a gente se entendeu.

Sem pressão.
Sem discussão.
Sem tentar vencer.

A gente só… se ouviu.

E ali eu tive uma sensação muito clara:

a gente não estava só vivendo
um relacionamento.

A gente estava aprendendo
a construir uma vida juntos.`,,
  210: `Eu sempre lembro das vezes
que a gente fez bolo juntos.

Pode parecer simples,
mas nunca foi só isso.

Era a bagunça,
a gente rindo,
errando,
tentando acertar.

Era você implicando comigo,
eu implicando com você,
e no fim a gente dando risada de tudo.

E o mais engraçado é que
o bolo nem precisava ficar perfeito.

Porque o que importava
já estava acontecendo ali.

A gente junto.

Hoje eu vejo que esses momentos simples
foram alguns dos mais importantes.

Porque são eles que mostram
como a gente funciona de verdade.`,,
  240: `Os domingos na sua casa
viraram algo muito maior
do que eu esperava.

No começo era só um costume:
eu ir pra lá
e a gente passar a tarde juntos.

Mas, com o tempo,
isso foi ganhando outro significado.

Virou rotina.
Virou presença.
Virou parte da minha vida.

Era estranho perceber
como aquilo fazia falta
quando eu não estava lá.

E foi aí que eu entendi:

não era mais só sobre
ir na sua casa.

Era sobre você ter se tornado
um lugar onde eu me sinto bem.

Um lugar onde eu quero estar.

Um lugar que,
de alguma forma,
também virou casa pra mim.`,,
  270:`Em breve...`,
  300:`Em breve...`,
  330:`Em breve...`,
};

function isMemoryDay(dia){
  return dia > 0 && dia % MEMORY_INTERVAL === 0 && dia !== FINAL_LETTER_DAY;
}

function isFinalLetterDay(dia){
  return dia === FINAL_LETTER_DAY;
}

function getMemoriaDoDia(dia){
  return MEMORIAS[dia] || "";
}
