"use strict";
const $=s=>document.querySelector(s), cl=(v,a=0,b=100)=>Math.max(a,Math.min(b,v)), SK="republica_v1";
const base={saude:4,educ:4,seg:2,mil:1.5,infra:2,amb:.5};
const nomes={saude:"Saúde",educ:"Educação",seg:"Segurança",mil:"Defesa",infra:"Infraestrutura",amb:"Meio ambiente"};
const MESES=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const novo=()=>({mes:0,divida:75,g:2,infl:4.5,desemp:7.5,aprov:55,cong:50,selic:10.5,imp:32,
  gasto:{...base},ind:{saude:55,educ:50,seg:45,mil:40,infra:45,amb:50},
  rel:{EUA:60,China:60,Argentina:50,UE:55},cd:{},log:["Você tomou posse como presidente. Boa sorte!"],ev:null,fim:null});
let S; try{S=JSON.parse(localStorage.getItem(SK))}catch(e){} if(!S||!S.gasto)S=novo();
const save=()=>{try{localStorage.setItem(SK,JSON.stringify(S))}catch(e){}};

// aplica efeitos: chaves como "aprov", "rel.EUA", "ind.saude"
function ap(o){for(const k in o){const [a,b]=k.split(".");
  if(b)S[a][b]=cl(S[a][b]+o[k]);
  else if(["aprov","cong"].includes(a))S[a]=cl(S[a]+o[k]);
  else S[a]+=o[k];}}

const EVENTOS=[
 {t:"Greve dos caminhoneiros",d:"Rodovias bloqueadas por todo o país. O abastecimento está em risco.",o:[
  ["Negociar subsídio ao diesel",{infl:.4,aprov:3,divida:.5}],["Acionar as Forças Armadas",{aprov:-4,"ind.seg":2,cong:-3}]]},
 {t:"Seca histórica no Centro-Oeste",d:"A safra está comprometida e os alimentos sobem.",o:[
  ["Auxílio emergencial aos produtores",{divida:.8,aprov:2,infl:.2}],["Deixar o mercado resolver",{g:-.6,infl:.6,aprov:-3}]]},
 {t:"EUA taxam o aço brasileiro",d:"Washington anuncia tarifa de 25% sobre o aço e o alumínio.",o:[
  ["Retaliar com tarifas",{"rel.EUA":-15,aprov:3,g:-.2}],["Negociar discretamente",{"rel.EUA":5,aprov:-2,cong:2}]]},
 {t:"Escândalo no ministério",d:"A imprensa revela desvios de verba em um ministério.",o:[
  ["Demitir e abrir investigação",{aprov:2,cong:-5}],["Abafar o caso",{aprov:-8,cong:4}]]},
 {t:"China oferece investimento",d:"Pequim propõe comprar mais soja e financiar uma ferrovia.",o:[
  ["Aceitar o acordo",{"rel.China":12,"rel.EUA":-5,"ind.infra":4,divida:1}],["Recusar",{"rel.China":-5,"rel.EUA":3}]]},
 {t:"Crise cambial na Argentina",d:"O vizinho pede ajuda ao Brasil e ao Mercosul.",o:[
  ["Abrir linha de crédito",{"rel.Argentina":15,divida:.5,cong:-2}],["Restringir o comércio",{"rel.Argentina":-12,g:-.1}]]},
 {t:"Queimadas na Amazônia",d:"A União Europeia ameaça travar o acordo comercial.",o:[
  ["Plano de fiscalização",{"ind.amb":8,"rel.UE":10,divida:.3,cong:-3}],["Ignorar a pressão",{"ind.amb":-8,"rel.UE":-12,aprov:1}]]},
 {t:"Surto de dengue",d:"Hospitais lotados em vários estados.",o:[
  ["Campanha nacional de combate",{"ind.saude":6,divida:.4,aprov:3}],["Deixar com os estados",{"ind.saude":-5,aprov:-4}]]},
 {t:"Protestos contra os impostos",d:"Manifestantes pedem alívio tributário.",o:[
  ["Reduzir a carga em 1,5 p.p.",{imp:-1.5,aprov:4,cong:2}],["Manter a política",{aprov:-3}]]},
 {t:"Tensão na fronteira",d:"Incidente militar com um país vizinho.",o:[
  ["Reforçar a fronteira",{"ind.mil":5,divida:.4}],["Resolver pela diplomacia",{cong:1,"ind.mil":-1}]]}
];
const ACOES=[
 ["Acordo comercial com a China",{"rel.China":8,"rel.EUA":-3,g:.1}],
 ["Cúpula com EUA e UE",{"rel.EUA":6,"rel.UE":6}],
 ["Aprofundar o Mercosul",{"rel.Argentina":8,g:.05}],
 ["Negociar emendas no Congresso",{cong:10,divida:.4}],
 ["Campanha de publicidade",{aprov:5,divida:.2}],
 ["Privatizar uma estatal",{divida:-2,aprov:-3,cong:2}]
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
  if(S.aprov<12){S.fim="💥 Impeachment! O Congresso afastou você do cargo.";}
  else if(S.divida>130){S.fim="💥 Calote! A dívida explodiu e o país entrou em colapso.";}
  else if(S.infl>20){S.fim="💥 Hiperinflação! O governo caiu.";}
  else if(S.mes===48){
    if(S.aprov+(Math.random()-.5)*16>=45){msg("Reeleito! Segundo mandato começa.");}
    else S.fim="🗳️ Você perdeu a reeleição.";
  }else if(S.mes>=96)S.fim="🏁 Fim do segundo mandato.";
  if(!S.fim&&Math.random()<.35)S.ev=Math.floor(Math.random()*EVENTOS.length);
  save();draw();
}

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
  c+=`<p style="font-size:.8rem;color:${def>0?"var(--r)":"var(--g)"}">Resultado anual: ${def>0?"déficit":"superávit"} de ${Math.abs(def).toFixed(1)}% do PIB</p>`;
  $("#ctrl").innerHTML=c;
  $("#inds").innerHTML=Object.keys(S.ind).map(k=>bar(nomes[k],S.ind[k])).join("");
  $("#rels").innerHTML=Object.keys(S.rel).map(k=>bar(k,S.rel[k])).join("");
  $("#acoes").innerHTML=ACOES.map((a,i)=>`<div class="acao"><span>${a[0]}</span><button data-a="${i}" ${S.cd[i]||S.fim?"disabled":""}>${S.cd[i]?S.cd[i]+"m":"Fazer"}</button></div>`).join("");
  $("#log").innerHTML=S.log.map(l=>`<p>${l}</p>`).join("");
  $("#prox").disabled=$("#ano").disabled=!!S.fim;
  const m=$("#modal");
  if(S.fim){$("#mt").textContent=S.fim;$("#md").textContent=`Legado final: ${legado()} pontos. Aprovação ${S.aprov.toFixed(0)}%, dívida ${S.divida.toFixed(0)}% do PIB.`;
    $("#mo").innerHTML=`<button onclick="reset()">Jogar de novo</button>`;m.hidden=false;}
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
$("#novo").onclick=()=>{if(confirm("Reiniciar o jogo?"))reset()};
draw();
