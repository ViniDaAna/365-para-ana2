
from pathlib import Path
import json

poems = [
"""A gente foi mudando sem perceber.

O que antes era intensidade
hoje também é calma.

O que antes era dúvida
hoje é escolha.

E talvez o mais bonito disso tudo
seja perceber
que nada foi forçado.

A gente só foi ficando.

Ficando mais perto.
Mais conectado.
Mais certo.""",
"""Tem dias em que eu olho pra nós
e sinto que a pressa foi embora.

Não porque o amor diminuiu,
mas porque ele encontrou lugar.

Hoje eu já não preciso
que tudo aconteça de uma vez.

Porque o que estamos construindo
tem a beleza das coisas
que escolhem permanecer.""",
"""Eu gosto de pensar
que o nosso amor não cresceu em linha reta.

Ele cresceu nas curvas,
nos retornos,
nos dias simples,
nas conversas longas,
nos silêncios que não machucaram.

Foi ali,
onde quase ninguém vê,
que a gente começou a ficar forte.""",
"""Amar você
tem me ensinado uma calma
que eu não conhecia.

Não aquela calma vazia,
de quem desistiu de sentir.

Mas a calma bonita
de quem encontrou
onde quer ficar.""",
"""Talvez crescer com alguém
seja isso:

descobrir que o amor
não vive só de momentos grandes.

Às vezes ele se firma mesmo
é no detalhe,
no costume,
na vontade sincera
de continuar.""",
"""O mais bonito em nós
é que eu nunca senti
que precisava correr.

Com você,
até o futuro
parece uma coisa que chega devagar,
mas chega certo.

E eu gosto dessa certeza calma
que você traz.""",
"""Tem dias em que eu percebo
o quanto a gente já não cabe
na palavra começo.

Porque o que existe entre nós
já virou presença,
já virou constância,
já virou parte da vida.

E isso,
de um jeito silencioso,
é uma das coisas mais bonitas
que eu já vivi.""",
"""Eu costumava achar
que amor forte
era o que queimava mais.

Hoje eu sei
que amor forte também é o que fica.

O que aprende.
O que escuta.
O que volta.
O que constrói.

E o nosso
tem feito tudo isso.""",
"""Tem uma parte de mim
que já te reconhece
em quase tudo que me faz bem.

No que me acalma.
No que me prende.
No que me melhora.

E talvez isso queira dizer
que você já se espalhou
pelo meu jeito de viver.""",
"""Aos poucos,
você deixou de ser só saudade
e virou também descanso.

Deixou de ser só intensidade
e virou caminho.

Deixou de ser só desejo
e virou escolha repetida.

E eu acho lindo
o jeito como tudo isso aconteceu.""",
"""Talvez o amor amadureça
quando deixa de pedir prova
o tempo todo.

Quando entende
que presença também fala,
que cuidado também confirma,
que o simples também sustenta.

Se for assim,
nós estamos crescendo
do jeito certo.""",
"""Você foi ficando
sem fazer barulho.

E quando eu percebi,
já estava pensando em você
como quem pensa em casa.

Não casa de parede e teto.

Mas casa no sentido mais raro:
o lugar onde o peito descansa.""",
"""Eu gosto do que o tempo
vem fazendo com a gente.

Não porque ele apaga as coisas,
mas porque ele revela.

Revela o que fica.
O que vale.
O que resiste.

E cada dia que passa
me faz confiar mais
no que somos.""",
"""O que existe entre nós
já não depende de acaso.

Tem intenção.
Tem cuidado.
Tem repetição bonita.

Tem esse jeito tranquilo
de quem não está só sentindo,
mas também escolhendo.

E eu amo isso na gente.""",
"""Eu nunca soube direito
explicar o momento exato
em que alguém deixa de ser só importante
e vira indispensável.

Mas acho que isso aconteceu com você
sem anúncio,
sem alarde,
sem dramaticidade.

Só aconteceu.

E ficou.""",
"""A verdade é que eu gosto
de tudo o que estamos virando.

Gosto da intimidade mais quieta.
Gosto da confiança mais funda.
Gosto do jeito
que o amor foi ganhando estrutura.

Com você,
até o que é leve
tem profundidade.""",
"""Tem dias em que eu penso
que o nosso amor
parece uma coisa viva.

Porque ele muda,
cresce,
aprende,
respira.

E mesmo mudando,
continua sendo ele.

Talvez seja isso
que o torna tão bonito.""",
"""Eu já não olho pra nós
como quem observa
uma possibilidade.

Eu olho como quem reconhece
uma direção.

Porque tem algo em você
que faz meu coração entender
que continuar
é uma boa ideia.""",
"""Não foi de uma vez
que eu senti tudo isso.

Foi aos poucos.

Em cada conversa boa.
Em cada saudade.
Em cada reencontro.
Em cada detalhe
que me fez perceber
que você não estava passando.

Você estava ficando.""",
"""Existem sentimentos
que chegam com fogo.

O nosso também teve isso.

Mas hoje ele tem outra coisa
que eu amo ainda mais:

raiz.

E talvez seja por isso
que tudo parece mais firme,
mais bonito,
mais real.""",
"""O futuro deixou de parecer distante
quando eu comecei a te imaginar nele.

Não como sonho solto,
mas como presença possível.

Como alguém
que eu quero perto
quando a vida estiver simples,
complicada,
bonita,
difícil.

Você em tudo isso
faz sentido pra mim.""",
"""Tem uma maturidade bonita
no amor que aprende
a não depender só de impulso.

No amor que sabe esperar.
Que sabe ouvir.
Que sabe ficar.

E eu sinto
que estamos entrando exatamente aí:
num lugar mais fundo
do que antes.""",
"""Eu gosto da forma
como a gente foi se entendendo.

Sem precisar ser igual em tudo.
Sem precisar acertar sempre.
Sem precisar transformar amor
em perfeição.

A gente só foi escolhendo
não desistir fácil.

E isso sustenta muita coisa.""",
"""Tem dias em que eu sinto
que nós dois estamos construindo
alguma coisa muito maior
do que parece.

Porque não é só sobre estar juntos.

É sobre criar um lugar
onde o amor possa morar
sem medo,
sem pressa,
sem máscara.""",
"""Você me ensinou
que amor também pode ser calmo
sem deixar de ser intenso.

Pode ser firme
sem deixar de ser leve.

Pode ser profundo
sem precisar doer.

E desde que eu percebi isso,
te amar ficou ainda mais bonito.""",
"""Eu penso em nós
como quem pensa
numa coisa que está ganhando forma.

Ainda crescendo,
ainda se ajustando,
ainda descobrindo.

Mas já firme o bastante
pra eu olhar e dizer:
isso aqui é real.""",
"""Talvez o que mais me encanta
na nossa história
seja o jeito como ela foi acontecendo.

Sem cena demais.
Sem promessa vazia.
Sem espetáculo.

Só com verdade.
Com presença.
Com vontade de continuar.

E isso tem muito valor.""",
"""Eu gosto quando percebo
que o nosso amor
já não vive só dos dias especiais.

Ele vive dos comuns também.

Das tardes.
Das conversas.
Da rotina que vai nascendo.
Da saudade pequena
que já sabe o caminho de volta.""",
"""Tem algo muito bonito
em ver o amor
deixar de ser só arrepio
e virar também paz.

Porque o arrepio passa.

Mas a paz que alguém traz
fica no corpo,
fica na mente,
fica na vida.

E você me traz isso.""",
"""Aos poucos,
eu fui entendendo
que te amar
não era só sentir muito.

Era também aprender
a permanecer.

Aprender a escutar.
Aprender a ceder.
Aprender a construir.

E eu gosto do homem
que vou sendo contigo.""",
"""Com você,
o tempo não pesa.

Ele aprofunda.

Ele revela nuances,
fortalece laços,
faz o amor sair da superfície
e tocar onde realmente importa.

Talvez por isso
cada fase nossa
tenha um tipo diferente de beleza.""",
"""Tem dias em que a única coisa
que eu sinto
é gratidão.

Por você existir.
Por nós existirmos.
Por tudo o que a vida
vem permitindo construir.

Nem sempre com facilidade.
Mas sempre com verdade.

E isso já é muito.""",
"""O nosso amor
não tem a pressa
das coisas frágeis.

Ele vai no passo
de quem quer durar.

No ritmo
de quem prefere profundidade
à aparência.

E eu acho lindo
fazer parte disso com você.""",
"""Você foi entrando
no meu jeito de viver
de uma forma tão natural
que às vezes eu esqueço
como era antes.

Só lembro
que hoje tudo parece mais inteiro
quando você está por perto.""",
"""Eu gosto do nosso amor
quando ele sorri.
Quando ele deseja.
Quando ele arde.

Mas gosto especialmente
quando ele amadurece.

Quando ele prova
que também sabe ficar de pé
nos dias normais.

Porque é aí
que ele vira casa.""",
"""Talvez crescer ao lado de alguém
seja perceber
que o vínculo já não precisa
ser reafirmado o tempo todo.

Ele apenas existe.

Nas escolhas.
Nos cuidados.
Na confiança.
Na paz que a presença traz.

E com você
eu sinto muito isso.""",
"""A gente foi se tornando
mais sólido
sem perder a delicadeza.

Mais íntimo
sem perder o encanto.

Mais verdadeiro
sem precisar endurecer.

E acho que isso diz muito
sobre o tipo de amor
que estamos construindo.""",
"""Às vezes eu paro
e fico pensando
na quantidade de pequenas coisas
que já carregam a sua presença.

Músicas.
Lugares.
Domingos.
Planos.
Silêncios.

Você está em tanta coisa minha
que já seria impossível
te chamar de detalhe.""",
"""Tem amor que chega
como explosão.

O nosso chegou assim também,
em algum momento.

Mas hoje ele me encanta
por outro motivo:
ele sabe permanecer.

E tem uma força absurda
nisso.""",
"""O mais bonito
é que eu não sinto
que estamos só repetindo dias.

Sinto que estamos aprofundando vida.

Cada fase,
cada conversa,
cada reencontro
coloca mais verdade
naquilo que a gente é.""",
"""Eu gosto do jeito
como você foi virando
um lugar seguro dentro de mim.

Porque nem tudo o que é intenso
consegue trazer paz.

Mas você trouxe.

E continua trazendo.""",
"""Se eu pudesse resumir
o que sinto neste momento,
eu diria assim:

eu gosto de continuar com você.

Gosto do que somos.
Gosto do que estamos virando.
Gosto do futuro
quando ele passa por nós.

E isso já diz muita coisa.""",
"""Tem uma parte de mim
que se acalma
só de perceber
que a gente não desistiu
de construir com cuidado.

Num mundo de tanta pressa,
isso é raro.

E por ser raro,
é precioso.""",
"""O amor que cresce
não perde a beleza;
ele troca de beleza.

Deixa de ser só chama
e vira também luz.

Deixa de ser só impacto
e vira também direção.

E eu acho
que nós estamos exatamente aí.""",
"""A sua presença
foi mudando
a temperatura dos meus dias.

Não porque tudo virou perfeito.

Mas porque muita coisa
passou a fazer mais sentido.

E esse tipo de mudança
é uma das mais profundas que existem.""",
"""Às vezes eu olho pra trás
e percebo
o quanto já caminhamos.

Não em distância,
mas em profundidade.

O que antes era começo
agora já tem estrutura.

O que antes era expectativa
agora já tem raiz.""",
"""Eu aprendi
que continuar não é pouco.

Continuar também é gesto de amor.

Continuar ouvindo.
Continuar tentando.
Continuar ficando.
Continuar voltando.

E eu gosto
do quanto nós sabemos fazer isso.""",
"""Você me fez enxergar
que maturidade no amor
não é sentir menos.

É sentir com mais verdade.

Com menos fantasia.
Com menos medo.
Com menos pressa.

E com muito mais vontade
de construir.""",
"""Tem dias em que eu só queria
que você visse
do jeito que eu vejo.

O quanto o nosso amor
já cresceu.
O quanto ele já amadureceu.
O quanto ele já encontrou
espaço dentro da vida real.

Porque isso,
pra mim,
é enorme.""",
"""Eu gosto da gente
quando a gente planeja,
mas gosto mais ainda
quando a gente simplesmente vive.

Porque até nos momentos comuns
tem alguma coisa nossa
se consolidando.

Um vínculo.
Uma rotina.
Uma paz.
Um jeito de ser dois.""",
"""Existem certezas
que chegam devagar.

Não batem na porta.
Não fazem barulho.
Só vão ficando.

E uma delas,
cada vez mais,
é essa:

eu quero continuar
crescendo com você.""",
"""A verdade é que
eu não tenho medo
das fases que mudam
quando penso em nós.

Porque o que sinto
não depende de uma versão única da vida.

Eu te quero
no começo,
no meio,
no depois,
no simples,
no difícil.

Isso é permanência.""",
"""Tem algo muito bonito
na forma como a gente
foi ficando mais verdadeiro.

Mais aberto.
Mais inteiro.
Mais sincero.

Como se o amor
estivesse perdendo camada por camada
de tudo o que não é essencial
até sobrar só o que importa.""",
"""Eu não preciso
que todos os dias
sejam extraordinários
pra saber o valor do que vivemos.

Às vezes basta
uma conversa tranquila,
uma presença demorada,
um gesto pequeno,
pra eu sentir
que estamos construindo certo.""",
"""Você foi se tornando
parte daquilo
que eu penso quando penso em futuro.

E isso não me assusta.

Pelo contrário.

Me dá uma paz
que eu não consigo fingir
que não existe.""",
"""O amor amadurece
quando aprende
que constância também seduz.

Que segurança também aproxima.
Que cuidado também acende.

E eu sinto
que você e eu
estamos descobrindo juntos
esse outro tipo de intensidade.""",
"""Tem dias em que eu quero
te agradecer
não por um momento específico,
mas pelo conjunto.

Pelo todo.
Pelo caminho.
Pela forma como você
tem participado da minha vida
sem ser peso,
sem ser confusão,
sem ser ausência.""",
"""Eu gosto da sensação
de que a gente
já está construindo memória
mesmo nos dias
em que nada grandioso acontece.

Porque no fundo,
são esses dias
que mostram
se o amor sabe durar.""",
"""Quando penso em nós,
penso em camadas.

Naquilo que começou com encanto,
passou pelo fogo,
e agora ganha profundidade.

E eu acho bonito
como cada fase
não apaga a anterior.

Só acrescenta verdade.""",
"""Tem amor
que quer sempre novidade.

O nosso,
cada vez mais,
me encanta pela permanência.

Pelo retorno.
Pela repetição bonita.
Pelo hábito que não esfria,
só aprofunda.

Isso vale muito.""",
"""Aos poucos,
o nosso vínculo
foi deixando de ser só emoção
e virou também estrutura.

Algo que sustenta,
que acolhe,
que acompanha.

E eu gosto de saber
que a gente está construindo
nesse nível.""",
"""Você me faz querer
ser melhor sem me violentar.

Mudar sem me perder.
Crescer sem me desmontar.
Amar sem fingir.

E isso talvez seja
uma das provas mais bonitas
de que o que temos
é saudável e forte.""",
"""Eu gosto do som
que a nossa história faz hoje.

Não é mais tempestade.

É coisa mais funda.

É como água correndo devagar,
como algo que segue,
como uma vida
que encontrou direção
sem precisar gritar.""",
"""Tem vezes
que eu fico pensando
em como foi natural
te incluir nos meus dias.

Como se parte de mim
já soubesse
que você tinha tudo
pra virar permanência.""",
"""Talvez amar de verdade
seja isso:

não perder o encanto,
mas ganhar profundidade.

Não abandonar o desejo,
mas acrescentar cuidado.

Não viver só de pico,
mas aprender a morar
na constância também.""",
"""A gente foi ficando
até os domingos
ganharem outro significado.

Até os reencontros
parecerem continuação
de uma coisa que nunca se interrompe.

Até a saudade
virar prova
de que existe lugar.""",
"""Tem um tipo de paz
que eu só sinto
quando penso na forma
como a gente se entende.

Nem sempre com perfeição.
Mas com verdade.

Nem sempre com resposta imediata.
Mas com vontade de resolver.

Isso amadurece qualquer amor.""",
"""Você foi virando
aquela pessoa
que eu quero perto
não só nos momentos bonitos,
mas também nos dias comuns.

E isso, pra mim,
é uma forma enorme de amor.

Porque é ali
que a vida realmente acontece.""",
"""Com você,
a palavra futuro
deixou de ser distante.

Virou imagem.
Virou conversa.
Virou sensação.
Virou possibilidade concreta.

E eu acho lindo
o fato de isso me trazer paz
em vez de medo.""",
"""O nosso amor
já não cabe só no peito.

Ele começou a ocupar
a rotina,
os planos,
a linguagem,
o jeito de olhar a semana,
o jeito de sentir falta.

Talvez seja isso
que chamam de construir vida.""",
"""Eu aprendi
que algumas raízes
crescem longe dos olhos.

Em silêncio.
Debaixo da superfície.
Sem pressa.

Mas são elas
que sustentam tudo depois.

E eu sinto
que muita coisa em nós
está nesse ponto.""",
"""Às vezes eu me pego
te olhando
e pensando
em como a gente conseguiu
transformar sentimento
em caminho.

Não só em ideia,
não só em vontade,
mas em algo
que de fato está sendo vivido.""",
"""O amor que eu sinto
por você hoje
tem mais chão do que antes.

Mais calma.
Mais consciência.
Mais verdade.

E mesmo assim,
ou talvez por isso,
ele continua bonito
num nível que eu não sabia explicar.""",
"""Tem uma delicadeza muito forte
na forma como a gente
foi aprendendo a continuar.

Sem dramaticidade.
Sem competição.
Sem precisar provar o tempo todo.

Só ficando.
Só amadurecendo.
Só virando mais nós.""",
"""Eu gosto da ideia
de que estamos construindo
alguma coisa que não depende
do espetáculo pra ser grande.

Porque o que é grande mesmo
às vezes cresce
em voz baixa.

E eu sinto
isso acontecendo com a gente.""",
"""Você tem esse efeito
de tornar a permanência
uma coisa bonita.

Não pesada.
Não sufocante.
Não assustadora.

Bonita.

E eu nunca achei
que diria isso
com tanta convicção.""",
"""Tem dias em que eu sinto
que já estamos plantando
coisas que só vamos entender melhor
mais pra frente.

Jeitos.
Hábitos.
Sonhos.
Certezas.

Mas, mesmo sem ver tudo,
eu gosto do que já nasce.""",
"""A vida perto de você
ganhou outro ritmo.

Um ritmo que me acalma
sem me apagar.

Que me aproxima
sem me prender.

Que me transforma
sem me desmontar.

Isso tem valor demais.""",
"""Talvez a melhor parte
de crescer com alguém
seja perceber
que o amor não ficou menor.

Ele só ficou mais consciente.

Mais limpo.
Mais inteiro.
Mais comprometido
com o que realmente importa.""",
"""Eu te amo
não só pelo que sinto
quando você chega.

Mas também pelo que fica
quando você vai.

A paz.
A lembrança boa.
A vontade de continuar.
A certeza silenciosa
de que isso aqui
vale a pena.""",
"""O nosso vínculo
foi se tornando
menos frágil do que antes.

Não porque nunca mais treme,
mas porque agora sabe voltar.

Sabe conversar.
Sabe sustentar.
Sabe escolher de novo.

Isso é crescer.""",
"""Quando penso em nós,
já não penso só
no que estamos vivendo agora.

Penso também
no que estamos preparando.

Na vida que o amor
vai deixando pronta
sem que a gente perceba
de imediato.""",
"""Eu gosto do jeito
como você foi virando
presença antes mesmo
de virar rotina.

E talvez seja isso
que torna tudo tão especial:

não foi costume.

Foi importância de verdade.""",
"""Tem algo muito forte
na simplicidade
do que construímos.

Porque não depende
de exagero.
Depende de verdade.

E verdade,
quando encontra abrigo,
vira raiz.""",
"""Você me dá vontade
de continuar investindo
naquilo que é fundo.

Naquilo que leva tempo.
Naquilo que não se prova em um dia.

Porque o que eu sinto
por você
já entrou nesse lugar.""",
"""Amar você hoje
tem um gosto diferente.

Não menos intenso.
Só mais amplo.

Mais consciente.
Mais estável.
Mais ligado
à vida real.

E eu gosto demais
desse ponto em que chegamos.""",
"""Tem dias em que eu sinto
que o nosso amor
já está aprendendo
a atravessar estações.

A mudar sem se perder.
A crescer sem se romper.
A aprofundar
sem deixar de ser leve.

Isso me dá esperança bonita.""",
"""O futuro não parece vazio
quando penso em você.

Parece cheio.

De possibilidades.
De planos.
De domingos.
De conversas.
De pequenos hábitos
que talvez virem lar.

E eu gosto dessa imagem.""",
"""Aos poucos,
a sua presença
foi ganhando um lugar
tão nítido em mim
que hoje eu percebo:
muita coisa já tem seu nome
mesmo sem eu dizer.""",
"""Tem amor
que marca pela intensidade.

O nosso também.

Mas cada vez mais
ele me marca
pela consistência.

Pelo retorno.
Pela construção.
Pela calma firme
de quem sabe permanecer.""",
"""Eu gosto da forma
como o nosso amor
foi deixando de ser só sentimento
e virou também prática.

Escuta.
Cuidado.
Paciência.
Vontade de resolver.

É nisso
que o profundo se revela.""",
"""Talvez a nossa história
ainda tenha muita coisa
pra viver.

E ainda bem.

Mas o que já existe
já é bonito o bastante
pra me fazer olhar pra você
com a sensação de:
sim,
é aqui que eu quero continuar.""",
"""Você foi se tornando
um pedaço importante
daquilo que eu entendo
como paz.

E isso não aconteceu
de uma vez.

Foi no detalhe.
No acúmulo.
Na repetição bonita
de tudo o que me faz bem.""",
"""Eu penso em nós
como quem observa
uma construção que ainda não terminou,
mas já mostra
claramente sua força.

Ainda tem muito pela frente.

Mas já tem base.
Já tem forma.
Já tem verdade.""",
"""Tem certas coisas
que eu só entendo
quando sinto.

E uma delas é essa:
o amor mais forte
nem sempre é o mais ruidoso.

Às vezes
é justamente o que aprende
a ficar em pé no silêncio.""",
"""Hoje eu vejo
que crescer com você
não é perder o brilho.

É descobrir
um brilho novo.

Menos imediato,
mais duradouro.
Menos explosão,
mais presença.

E eu acho isso lindo.""",
"""Se eu pudesse nomear
o momento em que estamos,
eu chamaria de amadurecimento bonito.

Porque ainda tem amor.
Ainda tem desejo.
Ainda tem encanto.

Mas agora tem também
estrutura,
consciência
e permanência.""",
"""A gente foi se tornando
mais certo
sem perder a delicadeza.

Mais firme
sem perder a ternura.

Mais nosso
sem precisar forçar nada.

E isso me faz acreditar
muito no que estamos vivendo.""",
"""Tem uma parte de mim
que já olha pra você
como quem olha
pra uma continuação.

Não continuação do hoje apenas,
mas da vida.

E isso veio tão naturalmente
que eu nem percebi
o momento exato em que começou.""",
"""Tudo o que cresce de verdade
aprende primeiro
a permanecer.

Talvez por isso
eu goste tanto
do que somos agora.

Porque eu sinto
que estamos saindo da superfície
e entrando,
cada vez mais,
naquilo que pode durar."""
]

content = "window.POEMAS_ATO_4 = " + json.dumps(poems, ensure_ascii=False, indent=2) + ";\n"
path = Path('/mnt/data/poemas.ato4.corrigido.js')
path.write_text(content, encoding='utf-8')
print(path)
