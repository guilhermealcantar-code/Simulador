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
function ap(o){for(const k in o){if(k==="fim"){S.fim=o[k];continue}const [a,b]=k.split(".");
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
  ["Aceitar a mala",{fim:"🚔 A mala tinha escuta, a PF filmou tudo e você virou protagonista de documentário de streaming."}],["Recusar e chamar a polícia (herói de 5 minutos)",{aprov:2,cong:-3}]]}
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
 ["Soltar notícia de futebol (cortina de fumaça)",{aprov:3,cong:-1}]
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
  save();draw();
}

const titulo=p=>p>105?"Melhor que o anterior, o que não é difícil":p>80?"Mediano, tipo todo político":p>55?"Meio ruim, mas teve churrasco":p>25?"Pior que o anterior, parabéns":"Obrigado, os memes do Brasil agradecem";
function legado(){const i=Object.values(S.ind).reduce((a,b)=>a+b,0)/6;
  return Math.round(S.aprov+i+S.g*5-S.divida/4-S.infl*2-S.desemp);}

const cor=v=>v>=60?"var(--g)":v>=35?"var(--y)":"var(--r)";
const bar=(n,v)=>`<div class="row"><label><span>${n}</span><b>${v.toFixed(0)}</b></label><div class="bar"><i style="width:${v}%;background:${cor(v)}"></i></div></div>`;
const kpi=(n,v,ruim)=>`<div class="kpi"><b style="color:${ruim?"var(--r)":"var(--tx)"}">${v}</b><span>${n}</span></div>`;

function draw(){
  $("#data").textContent=`${dataStr()} · Mandato ${S.mes<48?1:2} · mês ${S.mes}/96`;
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
    $("#mo").innerHTML=e.o.map((o,i)=>`<button data-e="${i}">${o[0]}</button>`).join("");m.hidden=false;}
  else m.hidden=true;
}
function reset(){S=novo();save();draw()}

document.addEventListener("input",e=>{const t=e.target;
  if(t.dataset.g)S.gasto[t.dataset.g]=+t.value;else if(t.dataset.k)S[t.dataset.k]=+t.value;else return;
  save();const p=t.previousElementSibling;if(p)p.querySelector("b").textContent=(+t.value).toFixed(1);});
document.addEventListener("change",e=>{if(e.target.type==="range")draw()});
document.addEventListener("click",e=>{const t=e.target;
  if(t.dataset.a!==undefined){const a=ACOES[t.dataset.a];ap(a[1]);S.cd[t.dataset.a]=6;msg(a[0]+".");save();draw();}
  if(t.dataset.e!==undefined){const o=EVENTOS[S.ev].o[t.dataset.e];ap(o[1]);msg(`${EVENTOS[S.ev].t}: ${o[0]}.`);S.ev=null;save();draw();}
});
$("#prox").onclick=()=>tick();
$("#ano").onclick=()=>{for(let i=0;i<3&&!S.fim&&S.ev===null;i++)tick()};
$("#novo").onclick=()=>{if(confirm("Renunciar e recomeçar do zero?"))reset()};
draw();
