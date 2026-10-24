"use strict";
// Motor: estado do jogador, efeitos e simulação mês a mês
const novo=()=>({mes:0,divida:75,g:2,infl:4.5,desemp:7.5,aprov:55,cong:50,selic:10.5,imp:32,
  gasto:{...base},ind:{saude:55,educ:50,seg:45,mil:40,infra:45,amb:50},
  rel:{EUA:60,China:60,Argentina:50,UE:55},cd:{},log:["Você tomou posse. O povo confia em você, o que já foi o primeiro erro."],ev:null,fim:null});
let S=null;
const save=()=>{if(typeof Rede!=="undefined")Rede.publicar()};

// aplica efeitos: chaves como "aprov", "rel.EUA", "ind.saude"
function ap(o){for(const k in o){if(k==="fim"){S.fim=o[k];continue}if(k==="dado"){const r=Math.random()<.5;msg(r?"🎲 Deu sorte (por enquanto).":"🎲 Deu muito errado, como esperado.");ap(o[k][r?0:1]);continue}const [a,b]=k.split(".");
  if(b)S[a][b]=cl(S[a][b]+o[k]);
  else if(["aprov","cong"].includes(a))S[a]=cl(S[a]+o[k]);
  else S[a]+=o[k];}}

function msg(t){S.log.unshift(`${dataStr()}: ${t}`);S.log=S.log.slice(0,40)}
const dataStr=()=>`${MESES[S.mes%12]}/${2027+Math.floor(S.mes/12)}`;

function tick(){
  if(!S||S.fim||S.ev!==null)return;
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
