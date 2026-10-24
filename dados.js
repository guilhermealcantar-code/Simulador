"use strict";
// Dados do jogo: setores, eventos, ações, ataques e eventos mundiais
const base={saude:4,educ:4,seg:2,mil:1.5,infra:2,amb:.5};
const nomes={saude:"Saúde (reze)",educ:"Educação (decorativa)",seg:"Segurança (de quem?)",mil:"Defesa (pro desfile)",infra:"Infraestrutura (obras eternas)",amb:"Meio ambiente (de enfeite)"};
const MESES=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const EVENTOS=[
 {t:"Greve dos caminhoneiros",d:"O Brasil parou. O povo agora sabe que comida não nasce no supermercado.",o:[
  ["Dar subsídio e culpar o diesel",{infl:.4,aprov:3,divida:.5}],["Mandar o Exército (finalmente um uso pra ele)",{aprov:-4,"ind.seg":2,cong:-3}]]},
 {t:"Seca histórica",d:"O agro pede socorro, mas só depois de bater recorde de safra e comprar o terceiro jatinho.",o:[
  ["Dar dinheiro público a quem já é rico",{divida:.8,aprov:2,infl:.2}],["Deixar o mercado resolver (lindo na teoria)",{g:-.6,infl:.6,aprov:-3}]]},
 {t:"EUA taxam seu aço",d:"Washington descobriu que amizade tem alíquota.",o:[
  ["Retaliar e fingir soberania",{"rel.EUA":-15,aprov:3,g:-.2}],["Beijar a mão e negociar",{"rel.EUA":5,aprov:-2,cong:2}]]},
 {t:"Ministro e o iate",d:"Seu ministro desviou verba para reformar o próprio iate. Ele diz que é “barco de pesquisa”.",o:[
  ["Demitir e investigar (de mentirinha)",{aprov:2,cong:-5}],["Abafar e rezar pro caso sumir",{aprov:-8,cong:4}]]},
 {t:"China faz uma proposta",d:"Pequim financia a ferrovia. Em troca pede um favorzinho: o porto, a soja e talvez a sua alma.",o:[
  ["Aceitar (a alma a gente recompra)",{"rel.China":12,"rel.EUA":-5,"ind.infra":4,divida:1}],["Recusar e posar de independente",{"rel.China":-5,"rel.EUA":3}]]},
 {t:"Argentina quebrou de novo",d:"O vizinho pede dinheiro emprestado. Você nunca vai ver essa grana.",o:[
  ["Emprestar sabendo que é doação",{"rel.Argentina":15,divida:.5,cong:-2}],["Fingir que não conhece",{"rel.Argentina":-12,g:-.1}]]},
 {t:"Amazônia em chamas",d:"A Europa quer discutir o meio ambiente. Você quer discutir o churrasco.",o:[
  ["Fingir que fiscaliza",{"ind.amb":8,"rel.UE":10,divida:.3,cong:-3}],["Mandar a UE cuidar da floresta deles",{"ind.amb":-8,"rel.UE":-12,aprov:1}]]},
 {t:"Surto de dengue",d:"Os mosquitos estão mais bem equipados que o SUS.",o:[
  ["Campanha nacional com jingle caríssimo",{"ind.saude":6,divida:.4,aprov:3}],["Culpar os governadores",{"ind.saude":-5,aprov:-4}]]},
 {t:"Panelaço contra imposto",d:"O povo odeia imposto, mas adora hospital, escola e estrada de graça. Fofo.",o:[
  ["Baixar imposto e ver o caixa chorar",{imp:-1.5,aprov:4,cong:2}],["Manter e ouvir o panelaço",{aprov:-3}]]},
 {t:"Tensão na fronteira",d:"Seu general jura que tem um plano de guerra. O plano é um PowerPoint.",o:[
  ["Reforçar a fronteira com dinheiro que não existe",{"ind.mil":5,divida:.4}],["Resolver na diplomacia (e rezar)",{cong:1,"ind.mil":-1}]]},
 {t:"Capivara no Palácio",d:"Uma capivara entrou na reunião e já tem mais aprovação que você.",o:[
  ["Nomear a capivara assessora especial",{aprov:6,cong:-1}],["Chamar o IBAMA (e ser vaiado)",{"ind.amb":2,aprov:-1}]]},
 {t:"Seu cunhado quer ser ministro",d:"Qualificações: “já mexeu em Excel” e “tem um primo na PF”.",o:[
  ["Nomear o cunhado (e o primo)",{cong:6,aprov:-6,"ind.saude":-2}],["Recusar (o Natal vai ser um inferno)",{cong:-4,aprov:2}]]},
 {t:"O Pix caiu 3 horas",d:"O país inteiro ficou sem pagar o açaí e descobriu o que é dinheiro vivo.",o:[
  ["Culpar o estagiário",{aprov:-2,cong:1}],["Fingir que investiga (ninguém olha)",{divida:.2,aprov:1}]]},
 {t:"Áudio vazado",d:"Você xingou o Congresso achando que estava no grupo do churrasco. Estava num grupo de 400 deputados.",o:[
  ["Pedir desculpas com cara de choro",{cong:4,aprov:-2}],["Dobrar a aposta e virar herói da internet",{cong:-8,aprov:5}]]},
 {t:"Jogo do Brasil na Copa",d:"Ninguém vai trabalhar de qualquer jeito. Só falta você assinar o óbvio.",o:[
  ["Ponto facultativo e cerveja liberada",{aprov:5,g:-.2}],["Mandar todo mundo trabalhar (boa sorte)",{aprov:-6,g:.1}]]},
 {t:"Alienígenas em Goiás",d:"Eles querem falar com o responsável. Pelo visto, não conhecem a política brasileira.",o:[
  ["Oferecer pão de queijo e aliança comercial",{aprov:4,"rel.EUA":-4}],["Ligar pra NASA e pagar propina em dólar",{"rel.EUA":10,aprov:-1}]]},
 {t:"Dólar a R$ 12",d:"Seu tio já mandou 14 áudios no zap culpando você e o Plano Real.",o:[
  ["Torrar as reservas pra segurar",{divida:.6,infl:-.2}],["Fazer pronunciamento: “fiquem calmos”",{aprov:-3,infl:.3}]]},
 {t:"Churrasco do Congresso",d:"Alguém jurou fidelidade em troca de picanha. Já deve ter virado emenda.",o:[
  ["Pagar a conta (e a picanha)",{cong:8,divida:.3,"ind.saude":-1}],["Sair de fininho sem pagar",{cong:-5,aprov:2}]]},
 {t:"Dinheiro na cueca",d:"Seu assessor foi pego no aeroporto com R$ 200 mil na roupa de baixo. Alega “economia de pastelaria”.",o:[
  ["Dizer que é troco do pastel",{aprov:-10,cong:-5}],["Demitir e jurar que nunca o viu",{aprov:-3,cong:2}]]},
 {t:"Jogo do Tigrinho liberado",d:"Influenciadores ensinam o povo a perder o aluguel pelo celular. A arrecadação tá tentadora.",o:[
  ["Regulamentar e taxar tudo",{divida:-.5,aprov:-2,"ind.educ":-1}],["Fingir que não viu (e pegar comissão)",{aprov:2,"ind.educ":-3,desemp:.3}]]},
 {t:"Delação premiada",d:"Seu ex-ministro quer entregar todo mundo em troca de prisão domiciliar com piscina.",o:[
  ["Oferecer cargo pra ele calar a boca",{cong:5,aprov:-5}],["Deixar o homem cantar",{cong:-10,aprov:4}]]},
 {t:"Emenda secreta",d:"Deputados exigem verba que ninguém sabe pra onde vai. “É pelo povo”, juram.",o:[
  ["Liberar a grana em silêncio",{cong:10,divida:.8,aprov:-4}],["Vetar e virar inimigo público",{cong:-8,aprov:3}]]},
 {t:"Obra parada desde 2014",d:"Uma ponte que não leva a lugar nenhum custou 3 vezes o orçamento.",o:[
  ["Inaugurar assim mesmo com faixa e fita",{aprov:3,"ind.infra":-1}],["Admitir que foi abandonada",{aprov:-2,"ind.infra":1}]]},
 {t:"Ronco na ONU",d:"Seu ronco saiu no microfone aberto e já virou áudio de TikTok.",o:[
  ["Dizer que foi “estratégia diplomática”",{"rel.EUA":-3,"rel.UE":-3,aprov:2}],["Pedir desculpas em inglês macarrônico",{"rel.EUA":2,aprov:-3}]]},
 {t:"Receita Federal bate na porta",d:"Você não declarou nem o imposto do seu próprio churrasco. Hipocrisia tem limite.",o:[
  ["Pagar a multa",{divida:.1,aprov:-2}],["Dizer que o cachorro comeu a declaração",{fim:"🚔 Você foi preso por sonegação! O juiz disse que o cachorro não serve de testemunha."}]]},
 {t:"O botão vermelho",d:"Tem um botão vermelho na mesa e ninguém sabe pra que serve. Seu dedo tá coçando.",o:[
  ["Apertar “só pra ver”",{fim:"🔴 Era o alarme geral. Sua equipe te demitiu e você saiu escoltado de pantufa."}],["Não apertar (que sem graça)",{aprov:1}]]},
 {t:"A mala do lobista",d:"Um empresário simpático deixa uma mala preta e diz que “não tem nada demais”.",o:[
  ["Aceitar a mala",{fim:"🚔 A mala tinha escuta, a PF filmou tudo e você virou protagonista de documentário de streaming."}],["Recusar e chamar a polícia (herói de 5 minutos)",{aprov:2,cong:-3}]]},
 {t:"O vice tenta um golpe com PowerPoint",d:"Seu vice reuniu 14 pessoas numa sala e apresentou o “Plano Golpe 2.0”. Slide 3 tem clipart de tanque.",o:[
  ["Mandar o vice para Dubai, passagem só de ida",{cong:-3,aprov:3}],["Aprovar o plano e pedir a versão em PDF",{dado:[{cong:6,aprov:3},{fim:"🪖 O golpe era mesmo sério. Seu vice assumiu e te deixou numa cela com wi-fi ruim."}]}],["Marcar uma reunião para marcar outra reunião",{aprov:-2,cong:1}]]},
 {t:"Um bilionário compra o Congresso",d:"Ele apresentou nota fiscal, garantia de 12 meses e perguntou se aceita Pix.",o:[
  ["Aprovar a venda (e pegar comissão)",{divida:-3,cong:10,aprov:-6}],["Tombar o prédio como patrimônio histórico",{aprov:2,cong:-4}],["Exigir parte em ações",{dado:[{divida:-5,aprov:-2},{aprov:-8,cong:-6}]}]]},
 {t:"Japão doa um robô-ministro da Fazenda",d:"Ele não aceita propina, não almoça com lobista e já chamou seu orçamento de “crime de guerra”.",o:[
  ["Ligar o robô e rezar",{dado:[{g:.5,infl:-.4,aprov:3},{infl:1.2,aprov:-5,desemp:.5}]}],["Desmontar e vender as peças",{divida:-1,aprov:-2}],["Nomear o robô e esconder o manual",{cong:-3,g:.2}]]},
 {t:"Atlântida emerge em Santa Catarina",d:"A cidade perdida subiu à superfície com 40 mil habitantes, nenhum CPF e muita vontade de abrir uma cervejaria.",o:[
  ["Cobrar ingresso e vender camiseta",{divida:-1.5,aprov:2}],["Anexar ao Brasil e cobrar IPTU retroativo",{aprov:-3,g:.2,divida:-1}],["Declarar independência (a deles) para evitar problema",{aprov:1,cong:-2}]]},
 {t:"Cientista inventa cachaça anti-inflação",d:"Dizem que ela baixa os preços de quem bebe. O efeito colateral é falar a verdade.",o:[
  ["Distribuir em rede nacional",{dado:[{infl:-.8,aprov:5,"ind.saude":-3},{infl:.5,aprov:-4,"ind.saude":-5}]}],["Beber primeiro (por segurança)",{aprov:-2,cong:-2}],["Patentear e privatizar",{divida:-1,aprov:-3}]]},
 {t:"Dinossauro encontrado no Piauí",d:"Está vivo, mal-humorado e já foi visto comendo um deputado. Ninguém sentiu falta.",o:[
  ["Nomear ministro do Turismo",{aprov:5,"ind.amb":-1}],["Mandar para o zoológico de Brasília (já é cheio)",{aprov:1}],["Soltar no Congresso para ver o que acontece",{dado:[{cong:-6,aprov:7},{aprov:-6,cong:-3}]}]]},
 {t:"Seu cachorro foi eleito deputado",d:"Ele teve 1,2 milhão de votos. Foi o primeiro candidato do Brasil a não prometer nada.",o:[
  ["Dar um gabinete com mordomia",{aprov:3,cong:1,divida:.1}],["Pedir a recontagem",{cong:-2,aprov:-1}],["Lançar para presidente em 2030",{aprov:4,cong:-3}]]},
 {t:"Senador Zé Mala quer ser seu vice",d:"Ele oferece 30 votos em troca do Ministério do Turismo, da Saúde e de um trem que ninguém sabe onde fica.",o:[
  ["Aceitar tudo, inclusive o trem",{cong:12,aprov:-7,divida:.8}],["Oferecer só o Turismo e um pedalinho",{cong:3,aprov:-1}],["Mandar plantar batata",{cong:-8,aprov:3}]]},
 {t:"Reunião com o Papai Noel (representante comercial)",d:"Ele quer abrir filial no Brasil. Quer isenção, mão de obra de elfo sem carteira e entrada pelo porto de Santos.",o:[
  ["Dar a isenção e ficar com 10%",{dado:[{divida:-2,aprov:2,cong:3},{aprov:-6,"rel.UE":-4}]}],["Taxar o trenó",{divida:-.5,aprov:-1}],["Pedir um presente para o povo",{aprov:4,divida:.3}]]},
 {t:"Tubarão no Lago Paranoá",d:"Um tubarão apareceu em Brasília. Todo mundo concorda que ele é o mais honesto da cidade.",o:[
  ["Nomear o tubarão ministro da Pesca",{aprov:5,cong:-2}],["Jogar um deputado no lago pra negociar",{cong:-4,aprov:3}]]},
 {t:"Zumbis no Congresso",d:"Descobriram zumbis no plenário. Estão lá há 30 anos e ninguém percebeu a diferença.",o:[
  ["Declarar que são servidores concursados",{cong:6,aprov:-3}],["Manter em segredo (já votam como todo mundo)",{cong:2,aprov:2}]]},
 {t:"Amazônia à venda no OLX",d:"Alguém anunciou a Amazônia por R$ 1,99, frete grátis, “aceito troca por Pix”.",o:[
  ["Comprar de volta com cupom de desconto",{divida:.3,aprov:3,"ind.amb":2}],["Aceitar a oferta (10% de comissão pro seu primo)",{divida:-1.5,"ind.amb":-10,"rel.UE":-10}]]},
 {t:"IA eleita vereadora",d:"Uma IA venceu em Cuiabá e aprovou 300 projetos em 2 minutos. Todos sobre pamonha.",o:[
  ["Dar um ministério pra ela (vai ser a mais competente)",{aprov:4,"ind.educ":-1}],["Desligar da tomada (assassinato digital)",{aprov:-3,cong:3}]]},
 {t:"Congresso vira reality show",d:"Uma emissora transformou as sessões em reality. O paredão é toda quarta.",o:[
  ["Entrar como convidado VIP",{aprov:5,cong:-4}],["Processar a emissora (e perder)",{aprov:-2,cong:2,divida:.1}]]},
 {t:"Juiz aceita Pix para absolver",d:"Um juiz criou o “Pix da Absolvição”. A fila dá volta no quarteirão.",o:[
  ["Fiscalizar (pegando uma comissão)",{aprov:-2,cong:3}],["Pedir uma filial na sua cidade",{aprov:-6,divida:-.4}]]},
 {t:"Figurinha vira moeda",d:"Alguém trocou 1 milhão de reais por figurinha da Copa. A economia travou esperando a rara.",o:[
  ["Decretar figurinha como moeda oficial",{infl:.5,aprov:3,g:-.3}],["Proibir o álbum e enfrentar o povo",{aprov:-5}]]},
 {t:"Ministro vira coach quântico",d:"Seu ministro vende curso de “manifestação de PIB”. Tem 40 mil alunos e zero resultado.",o:[
  ["Manter (ele fala bonito)",{aprov:2,"ind.educ":-2}],["Demitir por insanidade (não por incompetência)",{cong:-2,aprov:1}]]},
 {t:"Seu vice é um clone mal feito",d:"A oposição provou que seu vice tem três dedos a mais e uma vírgula no CPF.",o:[
  ["Negar com firmeza",{cong:-3}],["Admitir e pedir a patente",{aprov:3,cong:2}]]},
 {t:"A Lua pede asilo político",d:"A Lua pediu asilo ao Brasil. Disse que a órbita está insuportável.",o:[
  ["Conceder asilo (e cobrar aluguel)",{"rel.EUA":-4,aprov:3}],["Negar (a Lua tem péssimo advogado)",{aprov:-1}]]},
 {t:"Pão vira ministério",d:"O pão francês exigiu reconhecimento oficial. O pão de queijo ameaça greve de fome.",o:[
  ["Criar o Ministério do Pão",{divida:.4,aprov:4,cong:3}],["Declarar guerra ao glúten",{aprov:-3}]]},
 {t:"Câmera ligada no G20",d:"Você esqueceu a câmera aberta. Apareceu de cueca e meia, comendo coxinha, diante de 20 chefes de Estado.",o:[
  ["Dizer que é “tradição brasileira”",{aprov:2,"rel.EUA":-2}],["Assumir e lançar sua linha de moda",{aprov:4,"rel.UE":-4}]]},
 {t:"Batalha de rap no Congresso",d:"O líder da oposição te desafiou para um duelo de rimas ao vivo. Você tem 8 segundos pra pensar.",o:[
  ["Aceitar e mandar uma rima ruim",{aprov:3,cong:-3}],["Fugir pelo banheiro",{aprov:-4,cong:2}]]},
 {t:"Desafio de dança do TikTok",d:"Seu assessor jura que dançar na rampa do Planalto vai viralizar. A rampa está molhada.",o:[
  ["Dançar mesmo assim",{fim:"💃 Você escorregou na rampa e virou “o presidente do chão”. Renunciou de vergonha, mas foram 40 milhões de views."}],["Mandar o assessor dançar (ele aceita)",{aprov:3}]]}
];
const ACOES=[
 ["Acordo com a China (leve um terno)",{"rel.China":8,"rel.EUA":-3,g:.1}],
 ["Jantar com EUA e UE (pagam, mas cobram)",{"rel.EUA":6,"rel.UE":6}],
 ["Fingir que o Mercosul funciona",{"rel.Argentina":8,g:.05}],
 ["Comprar o Congresso (legalmente)",{cong:10,divida:.4}],
 ["Propaganda enganosa oficial",{aprov:5,divida:.2}],
 ["Vender estatal (pro amigo do primo)",{divida:-2,aprov:-3,cong:2}],
 ["Postar meme no X",{aprov:3,cong:-2}],
 ["Live no Instagram (com filtro)",{aprov:4,cong:-2,"rel.EUA":-1}],
 ["Viajar de jatinho “a trabalho”",{aprov:-6,cong:3,divida:.3}],
 ["Churrasco no Alvorada (com o imposto deles)",{cong:5,aprov:1,divida:.2}],
 ["Culpar o governo anterior",{aprov:3,cong:-1}],
 ["Criar uma CPI pra distrair",{aprov:2,cong:-3}],
 ["Nomear parente pra cargo de confiança",{cong:6,aprov:-5}],
 ["Soltar notícia de futebol (cortina de fumaça)",{aprov:3,cong:-1}],
 ["Declarar feriado pra quem acordou cedo",{aprov:4,g:-.15}],
 ["Live de tarot sobre o orçamento",{aprov:2,cong:-2}],
 ["Criar o Ministério da Gambiarra",{cong:5,divida:.3,aprov:-1}],
 ["Rifar um ministério no Instagram",{cong:3,aprov:-3,divida:-.5}],
 ["Vazar print de conversa (editado)",{aprov:3,cong:-4}],
 ["Demitir todo mundo e recontratar sem concurso",{aprov:-4,cong:4,g:.05}]
];

// ---- ataques entre jogadores: [nome, efeito no alvo, custo pra você] ----
const ATQ=[
 ["🎙️ Vazar áudio dele xingando o juiz",{aprov:-8},{cong:-1}],
 ["🧟 Mandar zumbis pro Congresso dele",{cong:-10},{}],
 ["💸 Tarifaço no aço dele",{g:-.4,infl:.3},{"rel.China":-2}],
 ["📡 Hackear a TV dele (só passa novela)",{aprov:-6},{}],
 ["🕵️ Denunciar o país dele na ONU",{"rel.EUA":-8,"rel.UE":-8},{"rel.UE":-2}],
 ["🐀 Soltar ratos na embaixada dele",{cong:-5,aprov:-4},{}],
 ["🎁 Mandar pão de queijo (diplomacia)",{aprov:4},{aprov:2}]
];
// ---- eventos mundiais (o host sorteia a cada 40s; solo = cai em um jogador só) ----
const MUNDOEV=[
 {t:"🚀 Bananolândia lança míssil de papelão. O mundo treme.",fx:{"rel.EUA":-3,"rel.China":-3,infl:.3}},
 {t:"🕵️ Sequestro do ditador de Pastelistão vira crise mundial.",fx:{"rel.UE":-5,aprov:2}},
 {t:"📉 A bolsa de Pastelistão quebra.",fx:{g:-.3}},
 {t:"🌋 Vulcão em Bananolândia derruba o mercado.",fx:{infl:.4,g:-.2}},
 {t:"🎉 Todo mundo jura que ganhou a Copa.",fx:{aprov:3}},
 {t:"🛸 Alienígenas sequestram o ministro da Fazenda do seu país.",fx:{aprov:-6,cong:-3},solo:true},
 {t:"💰 Acharam uma mala de dinheiro na sua calçada.",fx:{divida:-1.2,aprov:-2},solo:true}
];
