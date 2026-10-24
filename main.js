"use strict";
// Início do jogo: telas de entrada e mapa, ranking, ataques e ligação com a rede
const EU={nome:"",pais:null};
let escolhido=null,mapaAberto=null,proxAtq=0,alvoAtq=null,msgErro="";
const quem=()=>EU.pais?`${EU.pais.f} ${EU.nome}`:"";
const tela=h=>{const t=$("#tela");t.innerHTML=h;t.hidden=!h};
const nm=()=>(($("#nome")&&$("#nome").value.trim())||"Presidente").slice(0,16);

function iniciarJogo(){
  S=novo();const m=EU.pais.mod;
  for(const k in m)S[k]+=m[k];
  S.aprov=cl(S.aprov);S.desemp=Math.max(2,S.desemp);S.infl=Math.max(0,S.infl);S.divida=Math.max(5,S.divida);
  S.log=[`${EU.nome} tomou posse em ${EU.pais.n}. ${EU.pais.tag}`];
  save();draw();
}

// ---- telas ----
function telaEntrada(){
  tela(`<div class="box"><h2>República</h2><p class="mut">Simulador de governo online. É um mundo só: você entra, escolhe um país e joga. Quem chegar primeiro leva o país.</p>
  <input type="text" id="nome" maxlength="16" placeholder="Nome do presidente" value="${esc(EU.nome)}">
  <button class="primary" data-t="entrar" style="width:100%">Entrar no mundo</button></div>`);
}
function telaConectando(){
  tela(`<div class="box"><h2>🌍 Conectando ao mundo...</h2><p class="mut">Procurando os outros presidentes. Se for o primeiro, você vira o anfitrião.</p><p class="err">${esc(msgErro)}</p></div>`);
}
function abrirMapa(escolher){
  const L=Rede.lista(),dono=id=>Object.values(L).find(j=>j.pais===id),p=escolhido&&PAISES.find(x=>x.id===escolhido);
  tela(`<div class="box wide"><h2>${escolher?"🗺️ Escolha seu país":"🗺️ Mapa do mundo"}</h2><div class="mapa">`+
    PAISES.map(c=>{const d=dono(c.id),meu=EU.pais&&EU.pais.id===c.id;
      return `<button class="pais ${d?"oc":""} ${meu||escolhido===c.id?"sel":""}" style="grid-column:${c.c};grid-row:${c.r}" ${escolher&&!d?`data-t="sel" data-id="${c.id}"`:"disabled"}>${c.f}<small>${c.n}</small>${d?`<em>${esc(d.nome)}</em>`:""}</button>`}).join("")+`</div>`+
    (escolher?(p?`<p><b>${p.f} ${p.n}:</b> ${p.tag}</p><button class="primary" data-t="ok" style="width:100%">Assumir o poder</button>`:`<p class="mut">${PAISES.every(c=>dono(c.id))?"Mundo lotado! Espere alguém sair.":"Clique num país livre. Quem chegar primeiro leva."}</p>`)+`<p class="err">${esc(msgErro)}</p>`
      :`<button data-t="fechar" style="width:100%">Fechar mapa</button>`)+`</div>`);
}

// ---- ranking e ataques ----
function desenhaRank(){
  const L=Rede.lista(),o=Object.entries(L).sort((a,b)=>(a[1].fim-b[1].fim)||b[1].leg-a[1].leg);
  $("#rank").innerHTML=`<p class="mut">🌍 Mundo ao vivo · ${o.length} jogando</p>`+o.map(([id,j],i)=>{
    const p=PAISES.find(x=>x.id===j.pais),meu=id===Rede.eu();
    return `<div class="rk ${j.fim?"morto":""}"><span>${["🥇","🥈","🥉"][i]||(i+1)+"º"} ${p?p.f:""} ${esc(j.nome)}${meu?" (você)":""}${j.fim?" 💀":""}</span><b>${j.leg} pts</b>${meu||j.fim?"":`<button data-t="atk" data-id="${id}">💣</button>`}</div>`}).join("");
}
function menuAtaque(id){
  const j=Rede.lista()[id];if(!j||!S||S.fim||S.ev!==null)return;
  alvoAtq=id;const w=Math.ceil((proxAtq-Date.now())/1000);
  $("#mt").textContent="💣 Atacar "+j.nome;
  $("#md").textContent=w>0?`Armas recarregando... ${w}s`:"Escolha o ataque (recarga de 20s).";
  $("#mo").innerHTML=ATQ.map((a,i)=>`<button data-t="atq" data-i="${i}" ${w>0?"disabled":""}>${a[0]}</button>`).join("")+`<button id="fechar">Cancelar</button>`;
  $("#modal").hidden=false;
}
function atacar(i){
  const a=ATQ[i],j=Rede.lista()[alvoAtq];if(!a||!j||Date.now()<proxAtq)return;
  Rede.atacar(alvoAtq,i);ap(a[2]);msg(`Você atacou ${j.nome}: ${a[0]}`);
  proxAtq=Date.now()+20000;save();draw();
}

// ---- cliques ----
document.addEventListener("click",e=>{
  const b=e.target.closest&&e.target.closest("[data-t]");if(!b)return;
  const t=b.dataset.t,id=b.dataset.id;
  if(t==="entrar"){EU.nome=nm();msgErro="";telaConectando();Rede.conectar()}
  else if(t==="sel"){escolhido=id;msgErro="";abrirMapa(true)}
  else if(t==="ok"&&escolhido)Rede.escolherPais(escolhido,EU.nome);
  else if(t==="fechar"){mapaAberto=null;tela("")}
  else if(t==="atk")menuAtaque(id);
  else if(t==="atq")atacar(+b.dataset.i);
});
$("#mapa").onclick=()=>{mapaAberto="v";abrirMapa(false)};

// ---- ligação com a rede ----
Rede.on({
  pronto:()=>{if(EU.pais&&S)Rede.escolherPais(EU.pais.id,EU.nome);else{mapaAberto="e";abrirMapa(true)}},
  lista:()=>{desenhaRank();if(mapaAberto)abrirMapa(mapaAberto==="e")},
  ok:id=>{if(EU.pais&&S){save();return}EU.pais=PAISES.find(x=>x.id===id);mapaAberto=null;tela("");iniciarJogo();abrirManual()},
  erro:m=>{msgErro=m;if(S){S.news="⚠️ "+m;draw()}else if(mapaAberto)abrirMapa(mapaAberto==="e");else telaConectando()},
  atq:(de,i)=>{if(!S||S.fim)return;const a=ATQ[i];ap(a[1]);msg(`💣 ${de} atacou você: ${a[0]}`);S.news=`${de} atacou você!`;save();draw()},
  mundo:i=>{if(!S||S.fim)return;const e=MUNDOEV[i];ap(e.fx);msg("🌍 "+e.t);S.news=e.t;save();draw()},
  snap:()=>S&&EU.pais?{leg:legado(),aprov:Math.round(S.aprov),mes:S.mes,fim:S.fim?1:0}:null
});
telaEntrada();
