"use strict";
const $=s=>document.querySelector(s), cl=(v,a=0,b=100)=>Math.max(a,Math.min(b,v)), SK="republica_v1";
const base={saude:4,educ:4,seg:2,mil:1.5,infra:2,amb:.5};
const nomes={saude:"Saúde (reze)",educ:"Educação (decorativa)",seg:"Segurança (de quem?)",mil:"Defesa (pro desfile)",infra:"Infraestrutura (obras eternas)",amb:"Meio ambiente (de enfeite)"};
const MESES=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const novo=()=>({mes:0,divida:75,g:2,infl:4.5,desemp:7.5,aprov:55,cong:50,selic:10.5,imp:32,
  gasto:{...base},ind:{saude:55,educ:50,seg:45,mil:40,infra:45,amb:50},
  rel:{EUA:60,China:60,Argentina:50,UE:55},cd:{},log:["Você tomou posse. O povo confia em você, o que já foi o primeiro erro."],ev:null,fim:null});
let S; try{S=JSON.parse(localStorage.getItem(SK))}catch(e){} if(!S||!S.gasto)S=novo();
const save=()=>{try{localStorage.setItem(SK,JSON.stringify(S))}catch(e){}};

// aplica efeitos: chaves como "aprov", "rel.EUA", "ind.saude"
function ap(o){for(const k in o){if(k==="fim"){S.fim=o[k];continue}if(k==="dado"){const r=Math.random()<.5;msg(r?"🎲 Deu sorte (por enquanto).":"🎲 Deu muito errado, como esperado.");ap(o[k][r?0:1]);continue}const [a,b]=k.split(".");
  if(b)S[a][b]=cl(S[a][b]+o[k]);
  else if(["aprov","cong"].includes(a))S[a]=cl(S[a]+o[k]);
  else S[a]+=o[k];}}

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

function msg(t){S.log.unshift(`${dataStr()}: ${t}`);S.log=S.log.slice(0,40)}
const dataStr=()=>`${MESES[S.mes%12]}/${2027+Math.floor(S.mes/12)}`;

function tick(){
  if(S.fim||S.ev!==null)return;
  const gs=Object.values(S.gasto).reduce((a,b)=>a+b,0);
  const juros=S.divida*S.selic/100, def=10+gs+juros-S.imp;
  S.divida+=def/12-S.divida*S.g/1200;
  for(const k in S.ind)S.ind[k]=cl(S.ind[k]+(S.gasto[k]-base[k])/base[k]*1.5-.25+(Math.random()-.5)*.4);
  for(const k in S.rel)S.rel[k]=cl(S.rel[k]+(S.ind.mil-50)/500+(50-S.rel[k])*.01);
  const rg=Object.values(S.rel).reduce((a,b)=>a+b,0)/4-55;
  const gt=2+(S.ind.infra-50)/25+(S.ind.educ-50)/60+rg/30-(S.imp-32)*.15-(S.selic-10.5)*.18-(S.infl-4.5)*.12+(S.cong-50)/80;
  S.g+=(gt-S.g)*.25+(Math.random()-.5)*.2;
  S.infl=Math.max(0,S.infl+def*.02-(S.selic-10.5)*.03-(S.infl-4.5)*.04+(Math.random()-.5)*.15);
  S.desemp=Math.max(2,S.desemp-(S.g-2)*.08+(S.selic-10.5)*.02);
  const t=(S.g-2)*1.2-(S.infl-4.5)*1.2-(S.desemp-7.5)*1.2+(S.ind.saude-50)/25+(S.ind.seg-50)/30+(S.ind.educ-50)/60-(S.imp-32)*.3;
  S.aprov=cl(S.aprov+t*.4-.2);
  S.cong=cl(S.cong+(S.aprov-S.cong)*.05);
  for(const k in S.cd)if(--S.cd[k]<=0)delete S.cd[k];
  S.mes++;
  if(S.aprov<12){S.fim="💥 Impeachment! Foi o único assunto em que o Congresso inteiro concordou.";}
  else if(S.divida>100&&Math.random()<.04){S.fim="🚔 Você foi preso por não pagar as dívidas do país! O policial disse: “o senhor tem direito de ficar calado, mas o Serasa não”.";}
  else if(S.divida>130){S.fim="💥 Calote! A dívida explodiu e o FMI mudou de número.";}
  else if(S.infl>20){S.fim="💥 Hiperinflação! Cafezinho custa um rim, o salário vira meme e o brasileiro agora paga em pão de queijo.";}
  else if(S.mes===48){
    if(S.aprov+(Math.random()-.5)*16>=45){msg("Reeleito! O povo esqueceu tudo em tempo recorde.");}
    else S.fim="🗳️ Você perdeu a reeleição. Ainda dá tempo de virar coach de palestra motivacional.";
  }else if(S.mes>=96)S.fim="🏁 Fim do mandato. Você sai com aposentadoria vitalícia e o país com a conta.";
  if(!S.fim&&Math.random()<.35)S.ev=Math.floor(Math.random()*EVENTOS.length);
  S.news=manchete();save();draw();
}
function manchete(){const h=["Estudo mostra que 100% dos políticos prometem e 0% lembram.","Brasileiro descobre que o Pix também funciona pra pagar dívida (sem sucesso).","Tio do zap compartilha 14 áudios dizendo que o governo é culpado por tudo."];
  if(S.aprov<25)h.push("Pesquisa: 9 em cada 10 brasileiros trocariam você por uma capivara.");
  if(S.divida>90)h.push("FMI manda mensagem: “tudo bem aí? Precisa de ajuda ou de exorcista?”");
  if(S.infl>8)h.push("Preço do ovo vira investimento: já rende mais que poupança.");
  if(S.desemp>10)h.push("Desemprego sobe e o LinkedIn vira rede de lamentações.");
  if(S.g>3)h.push("PIB cresce e ninguém sentiu no bolso. Economistas comemoram em jatinho.");
  if(S.ind.saude<35)h.push("Hospital pede doação de esparadrapo por Pix.");
  if(S.ind.seg<35)h.push("Bandido começa a oferecer seguro contra assalto. O preço é justo.");
  if(S.cong<30)h.push("Congresso te ignora tanto que já te trata como parente.");
  return h[Math.floor(Math.random()*h.length)]}

const titulo=p=>p>105?"Melhor que o anterior, o que não é difícil":p>80?"Mediano, tipo todo político":p>55?"Meio ruim, mas teve churrasco":p>25?"Pior que o anterior, parabéns":"Obrigado, os memes do Brasil agradecem";
function legado(){const i=Object.values(S.ind).reduce((a,b)=>a+b,0)/6;
  return Math.round(S.aprov+i+S.g*5-S.divida/4-S.infl*2-S.desemp);}

const cor=v=>v>=60?"var(--g)":v>=35?"var(--y)":"var(--r)";
const bar=(n,v)=>`<div class="row"><label><span>${n}</span><b>${v.toFixed(0)}</b></label><div class="bar"><i style="width:${v}%;background:${cor(v)}"></i></div></div>`;
const kpi=(n,v,ruim)=>`<div class="kpi"><b style="color:${ruim?"var(--r)":"var(--tx)"}">${v}</b><span>${n}</span></div>`;

function draw(){
  $("#data").textContent=`${dataStr()} · Mandato ${S.mes<48?1:2} · mês ${S.mes}/96`;
  $("#news").textContent="📰 "+(S.news||"Extra: você ainda não estragou nada. Dá tempo.");
  $("#kpis").innerHTML=kpi("Aprovação",S.aprov.toFixed(0)+"%",S.aprov<30)+kpi("Congresso",S.cong.toFixed(0)+"%",S.cong<30)
    +kpi("Crescimento",S.g.toFixed(1)+"%",S.g<0)+kpi("Inflação",S.infl.toFixed(1)+"%",S.infl>8)
    +kpi("Desemprego",S.desemp.toFixed(1)+"%",S.desemp>10)+kpi("Dívida/PIB",S.divida.toFixed(0)+"%",S.divida>95);
  const gs=Object.values(S.gasto).reduce((a,b)=>a+b,0), def=10+gs+S.divida*S.selic/100-S.imp;
  let c=`<div class="row"><label><span>Carga tributária</span><b>${S.imp.toFixed(1)}%</b></label><input type="range" min="20" max="45" step=".5" value="${S.imp}" data-k="imp"></div>
  <div class="row"><label><span>Selic (Banco Central)</span><b>${S.selic.toFixed(2)}%</b></label><input type="range" min="2" max="20" step=".25" value="${S.selic}" data-k="selic"></div>`;
  for(const k in base)c+=`<div class="row"><label><span>${nomes[k]}</span><b>${S.gasto[k].toFixed(1)}%</b></label><input type="range" min="0" max="${base[k]*2.5}" step=".1" value="${S.gasto[k]}" data-g="${k}"></div>`;
  c+=`<p style="font-size:.8rem;color:${def>0?"var(--r)":"var(--g)"}">Resultado anual: ${def>0?"déficit (a conta fica pros seus netos)":"superávit (alguém roubou menos que o normal)"}: ${Math.abs(def).toFixed(1)}% do PIB</p>`;
  $("#ctrl").innerHTML=c;
  $("#inds").innerHTML=Object.keys(S.ind).map(k=>bar(nomes[k],S.ind[k])).join("");
  $("#rels").innerHTML=Object.keys(S.rel).map(k=>bar(k,S.rel[k])).join("");
  $("#acoes").innerHTML=ACOES.map((a,i)=>`<div class="acao"><span>${a[0]}</span><button data-a="${i}" ${S.cd[i]||S.fim?"disabled":""}>${S.cd[i]?S.cd[i]+"m":"Aprontar"}</button></div>`).join("");
  $("#log").innerHTML=S.log.map(l=>`<p>${l}</p>`).join("");
  $("#prox").disabled=$("#ano").disabled=!!S.fim;
  const m=$("#modal");
  if(S.fim){$("#mt").textContent=S.fim;$("#md").textContent=`Legado: ${legado()} pontos (${titulo(legado())}). Aprovação ${S.aprov.toFixed(0)}%, dívida ${S.divida.toFixed(0)}% do PIB.`;
    $("#mo").innerHTML=`<button onclick="reset()">Fazer tudo errado de novo</button>`;m.hidden=false;}
  else if(S.ev!==null){const e=EVENTOS[S.ev];$("#mt").textContent=e.t;$("#md").textContent=e.d;
    $("#mo").innerHTML=e.o.map((o,i)=>`<button data-e="${i}">${o[0]}</button>`).join("")+`<button data-e="coin">🎲 Cara ou coroa (deixa o azar decidir)</button>`;m.hidden=false;}
  else m.hidden=true;
}
function reset(){S=novo();save();draw()}

document.addEventListener("input",e=>{const t=e.target;
  if(t.dataset.g)S.gasto[t.dataset.g]=+t.value;else if(t.dataset.k)S[t.dataset.k]=+t.value;else return;
  save();const p=t.previousElementSibling;if(p)p.querySelector("b").textContent=(+t.value).toFixed(1);});
document.addEventListener("change",e=>{if(e.target.type==="range")draw()});
document.addEventListener("click",e=>{const t=e.target;
  if(t.dataset.a!==undefined){const a=ACOES[t.dataset.a];ap(a[1]);S.cd[t.dataset.a]=6;msg(a[0]+".");save();draw();}
  if(t.dataset.e!==undefined){const ix=t.dataset.e==="coin"?Math.floor(Math.random()*2):t.dataset.e;const o=EVENTOS[S.ev].o[ix];ap(o[1]);msg(`${EVENTOS[S.ev].t}: ${o[0]}.`);S.ev=null;save();draw();}
});
$("#prox").onclick=()=>tick();
$("#ano").onclick=()=>{for(let i=0;i<3&&!S.fim&&S.ev===null;i++)tick()};
const MANUAL=`<b>Objetivo:</b> sobreviver 8 anos sem ser preso, derrubado ou cancelado.<br><br>
<b>Topo da tela:</b><br>• <b>Aprovação</b>: abaixo de 12% = impeachment. No mês 48 ela decide a reeleição.<br>• <b>Congresso</b>: apoio dos deputados. Baixo = tudo piora.<br>• <b>Crescimento</b>: o PIB. Quanto mais, melhor.<br>• <b>Inflação</b>: acima de 20% o país acaba.<br>• <b>Desemprego</b>: alto derruba sua aprovação.<br>• <b>Dívida/PIB</b>: acima de 100% pode te levar pra cadeia, acima de 130% é calote.<br><br>
<b>Orçamento (barras deslizantes):</b><br>• <b>Carga tributária</b>: mais imposto = mais dinheiro, mas o povo te odeia e a economia freia.<br>• <b>Selic</b>: alta segura a inflação mas trava o crescimento. Baixa faz o contrário.<br>• <b>Gastos</b>: gastar mais melhora o setor, mas aumenta a dívida.<br>• Embaixo aparece déficit (vermelho: dívida sobe) ou superávit (verde: dívida cai).<br><br>
<b>Nação:</b> barra verde é boa, vermelha é desastre. Saúde, educação, segurança e infraestrutura mexem com crescimento e aprovação. Defesa ajuda nas relações. Meio ambiente agrada a Europa.<br><br>
<b>Relações:</b> EUA, China, UE e Argentina. Relação boa ajuda o PIB. Agradar um às vezes irrita outro.<br><br>
<b>Ações de governo:</b> cada uma só pode ser usada 1 vez a cada 6 meses. Leia o nome com atenção, a maioria tem pegadinha.<br><br>
<b>Eventos:</b> aparecem sozinhos e você escolhe. Com preguiça, use o 🎲 cara ou coroa.<br><br>
<b>Dica pros burros:</b> não deixe a dívida estourar, mantenha a aprovação acima de 40 e não aperte botão vermelho nenhum.`;
function abrirManual(){$("#mt").textContent="📖 Manual do Presidente (pra quem não sabe ler)";$("#md").innerHTML=MANUAL;$("#mo").innerHTML='<button id="fechar">Entendi, vamos errar</button>';$("#modal").hidden=false}
$("#man").onclick=abrirManual;
document.addEventListener("click",e=>{if(e.target.id==="fechar")draw()});
$("#novo").onclick=()=>{if(confirm("Renunciar e recomeçar do zero?"))reset()};
draw();
if(S.mes===0&&!S.fim&&S.ev===null)abrirManual();
