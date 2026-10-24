"use strict";
// Interface do jogador: painéis, botões e manual
const cor=v=>v>=60?"var(--g)":v>=35?"var(--y)":"var(--r)";
const bar=(n,v)=>`<div class="row"><label><span>${n}</span><b>${v.toFixed(0)}</b></label><div class="bar"><i style="width:${v}%;background:${cor(v)}"></i></div></div>`;
const kpi=(n,v,ruim)=>`<div class="kpi"><b style="color:${ruim?"var(--r)":"var(--tx)"}">${v}</b><span>${n}</span></div>`;

function draw(){
  $("#data").textContent=`${quem()} · ${dataStr()} · Mandato ${S.mes<48?1:2} · mês ${S.mes}/96`;
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
function reset(){iniciarJogo()}

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
<b>Online:</b> cada jogador tem seu país. No ranking, clique no 💣 de um rival pra atacar (recarga de 20s). O host sorteia eventos mundiais que atingem todo mundo. O botão 🗺️ Mapa mostra quem é dono de quê.<br><br><b>Dica pros burros:</b> não deixe a dívida estourar, mantenha a aprovação acima de 40 e não aperte botão vermelho nenhum.`;
function abrirManual(){$("#mt").textContent="📖 Manual do Presidente (pra quem não sabe ler)";$("#md").innerHTML=MANUAL;$("#mo").innerHTML='<button id="fechar">Entendi, vamos errar</button>';$("#modal").hidden=false}
$("#man").onclick=abrirManual;
document.addEventListener("click",e=>{if(e.target.id==="fechar")draw()});
$("#novo").onclick=()=>{if(confirm("Renunciar e recomeçar do zero?"))reset()};
