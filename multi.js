"use strict";
const $=s=>document.querySelector(s),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const RODADAS=12, PFX="repbr-";
let peer,conns={},hostConn=null,eu=null,souHost=false,G=null,erro="";
let minha={imp:30,soc:30,acao:0,alvo:"",ev:0,rod:0};

// ---- conteúdo ácido ----
const EV=[
 {t:"Capivara no Palácio",d:"Uma capivara entrou na reunião e já tem mais aprovação que você.",o:[["Nomear assessora especial",{aprov:6,cong:-2}],["Chamar o IBAMA (e ser vaiado)",{aprov:-3,cong:3}]]},
 {t:"Dinheiro na cueca",d:"Seu assessor foi pego com R$ 200 mil na roupa de baixo. Alega “economia de pastelaria”.",o:[["Dizer que é troco do pastel",{aprov:-10,caos:6}],["Demitir e jurar que nunca o viu",{aprov:-3,cong:2}]]},
 {t:"O Pix caiu 3 horas",d:"O país ficou sem pagar o açaí e descobriu o que é dinheiro vivo.",o:[["Culpar o estagiário",{aprov:-3,cong:2}],["Fingir que investiga",{grana:-5,aprov:2}]]},
 {t:"Jogo do Tigrinho liberado",d:"Influenciadores ensinam o povo a perder o aluguel pelo celular.",o:[["Taxar tudo",{grana:15,aprov:-4}],["Fingir que não viu e pegar comissão",{grana:25,aprov:-8,caos:8}]]},
 {t:"Zumbis no Congresso",d:"Estão lá há 30 anos e ninguém percebeu a diferença.",o:[["Declarar que são concursados",{cong:8,grana:-8}],["Esconder o caso",{caos:8,aprov:2}]]},
 {t:"Delação premiada",d:"Seu ex-ministro quer entregar todo mundo em troca de prisão domiciliar com piscina.",o:[["Dar um cargo pra ele calar a boca",{cong:6,grana:-10}],["Deixar o homem cantar",{aprov:5,cong:-10}]]},
 {t:"Seu cunhado quer ser ministro",d:"Qualificações: “já mexeu em Excel” e “tem um primo na PF”.",o:[["Nomear (e o primo também)",{cong:8,aprov:-8}],["Recusar (Natal vai ser um inferno)",{cong:-5,aprov:3}]]},
 {t:"Jogo do Brasil na Copa",d:"Ninguém vai trabalhar de qualquer jeito.",o:[["Ponto facultativo e cerveja liberada",{aprov:7,grana:-10}],["Mandar todo mundo trabalhar",{aprov:-7,grana:10}]]},
 {t:"Câmera ligada no G20",d:"Você apareceu de cueca e meia comendo coxinha diante de 20 chefes de Estado.",o:[["Dizer que é tradição brasileira",{aprov:3,caos:4}],["Assumir e lançar sua linha de moda",{aprov:5,grana:6,cong:-4}]]},
 {t:"Alienígenas em Goiás",d:"Querem falar com o responsável. Pelo visto não conhecem a política brasileira.",o:[["Oferecer pão de queijo",{aprov:6,caos:5}],["Ligar pra NASA e pagar propina em dólar",{grana:-12,aprov:2}]]},
 {t:"Amazônia à venda no OLX",d:"R$ 1,99, frete grátis, “aceito troca por Pix”.",o:[["Comprar de volta com cupom",{grana:-10,aprov:5}],["Aceitar (10% de comissão pro seu primo)",{grana:30,aprov:-9,caos:8}]]}
];
// [nome, efeito, sabotagem?]  (sabotagem custa R$ 8 pra você e acerta o alvo)
const AC=[
 ["✨ Live de tarot sobre o orçamento",{aprov:5,cong:-3},0],
 ["✨ Comprar o Congresso em 12x sem juros",{cong:12,grana:-15},0],
 ["✨ Desviar verba pro “museu” (é um iate)",{grana:25,aprov:-8,caos:6},0],
 ["✨ Soltar notícia de futebol (cortina de fumaça)",{aprov:6,cong:-2},0],
 ["✨ Rifar um ministério no Instagram",{grana:10,cong:3,aprov:-4},0],
 ["💣 Vazar áudio do rival xingando a mãe do juiz",{aprov:-12},1],
 ["💣 Mandar zumbis pro Congresso do rival",{cong:-14},1],
 ["💣 Soltar capivara no gabinete do rival",{aprov:-8,caos:6},1],
 ["💣 Tarifaço no aço do rival",{grana:-18},1],
 ["💣 Fofoca na ONU sobre o rival",{aprov:-6,cong:-6},1],
 ["💣 Denunciar o rival pra Receita",{grana:-12,caos:8},1]
];
const MORTES={
 imp:["💥 {n} sofreu impeachment. Até a capivara votou contra.","💥 {n} foi derrubado. O Congresso se uniu pela primeira vez na história."],
 div:["🚔 {n} foi preso por dívida. O policial disse: “o senhor tem direito de ficar calado, mas o Serasa não”.","🚔 {n} foi preso por não pagar as contas. A cela tinha Wi-Fi melhor que o Planalto."],
 caos:["🔥 {n} deixou o caos chegar a 100. Brasília virou Mad Max com churrasco.","🔥 {n} perdeu o controle. O país agora é governado por um grupo de WhatsApp."]
};
const INST=[
 ["🚀 Míssil em Bananolândia (país fictício)",{aprov:5,grana:-10},null,8],
 ["🕵️ Sequestrar o ditador de Pastelistão (fictício)",{aprov:8,caos:6},null,10],
 ["☢️ Testar bomba “só pra ver”",{aprov:-5,caos:10},null,15],
 ["📡 Hackear a TV do rival (só passa novela)",{grana:-5},{aprov:-10},0],
 ["💸 Pix gigante pro rival (com vírus)",{caos:3},{grana:-20},0],
 ["🐀 Soltar ratos na embaixada do rival",{grana:-3},{aprov:-6,cong:-6},0]
];
const MUNDO=[
 ["🚀 Míssil de papelão de Bananolândia acerta o Congresso de {n}","1",{cong:-8,caos:4}],
 ["👽 Alienígenas sequestram o ministro da Fazenda de {n}","1",{aprov:-6}],
 ["🔥 Incêndio no Planalto de {n}. Ninguém sabe se foi acidente","1",{aprov:-6,caos:5}],
 ["💰 Mala achada na calçada de {n}. Foi achado, não foi roubado","1",{grana:15}],
 ["🦠 Meme viral destrói a imagem de {n}","1",{aprov:-8}],
 ["📉 A bolsa de Pastelistão quebra: todo mundo perde R$ 8","all",{grana:-8}],
 ["🎉 O povo jura que o Brasil ganhou a Copa. Todo mundo ganha aprovação","all",{aprov:3}],
 ["🌋 Vulcão em Bananolândia: o caos mundial dispara","mundo",{}]
];
const TIT=["👑 Presidente Supremo (a PF ainda não chegou)","🥈 Quase, mas ninguém lembra seu nome","🥉 Vice de si mesmo"];

// ---- estado (host) ----
const jog=n=>({nome:n,aprov:55,grana:50,cong:50,caos:0,vivo:true,pronto:false,esc:null,fim:"",mr:0,cdl:0});
const novoG=()=>({fase:"lobby",cod:"",rod:1,ev:0,p:{},t:45,wt:25,mundo:10,feed:[],ap:false,log:["Sala aberta. Que vença o menos pior."]});
const envia=(c,m)=>{try{c.send(m)}catch(e){}};
function bcast(){render();if(souHost)for(const id in conns)envia(conns[id],{t:"G",G})}
function nomeUnico(n){let b=n.slice(0,16)||"Anônimo",x=b,i=2;while(Object.values(G.p).some(p=>p.nome===x))x=b+" "+i++;return x}

function hostRecebe(id,m){
  if(m.t==="join"){
    if(G.fase!=="lobby"){envia(conns[id],{t:"erro",msg:"O jogo já começou. Espere a próxima!"});return}
    G.p[id]=jog(nomeUnico(String(m.nome||"")));bcast();
  }else if(m.t==="caos"&&G.fase==="jogo"){instante(id,m);
  }else if(m.t==="turn"&&G.fase==="jogo"){
    const p=G.p[id];if(!p||!p.vivo||p.pronto)return;
    const e=m.esc||{};p.esc={imp:cl(+e.imp||30,10,50),soc:cl(+e.soc||30,10,50),acao:cl(+e.acao||0,0,AC.length-1),alvo:String(e.alvo||""),ev:+e.ev===-1?-1:cl(+e.ev||0,0,1)};
    p.pronto=true;check();bcast();
  }
}
function check(){if(G.fase!=="jogo")return;const v=Object.values(G.p).filter(p=>p.vivo);if(v.length&&v.every(p=>p.pronto))resolver()}
function novaRodada(){G.t=45;G.ev=Math.floor(Math.random()*EV.length);for(const p of Object.values(G.p)){p.pronto=false;p.esc=null}}
function fx(p,e){for(const k in e)p[k]+=e[k];p.aprov=cl(p.aprov,0,100);p.cong=cl(p.cong,0,100);p.caos=cl(p.caos,0,100)}
function morre(p,tipo){const a=MORTES[tipo];p.vivo=false;p.mr=G.rod;p.fim=a[Math.floor(Math.random()*a.length)].replace("{n}",p.nome);G.log.push(p.fim);G.feed.unshift(p.fim)}

function resolver(){
  const L=[],ps=Object.entries(G.p).filter(([i,p])=>p.vivo);
  for(const [i,p] of ps){
    const c=p.esc||{imp:30,soc:30,acao:0,alvo:"",ev:0};
    p.grana+=Math.round(c.imp*1.5-c.soc*1.2-8);
    p.aprov=cl(p.aprov+(c.soc-30)*.4-(c.imp-30)*.5+(Math.random()*4-2)-p.caos*.05,0,100);
    const ix=c.ev<0?Math.floor(Math.random()*2):c.ev,o=EV[G.ev].o[ix];fx(p,o[1]);
    L.push(`${p.nome}: “${o[0]}”${c.ev<0?" 🎲 (decidiu no azar)":""}`);
    const a=AC[c.acao];
    if(a[2]){const al=G.p[c.alvo];
      if(al&&al.vivo&&c.alvo!==i){fx(al,a[1]);p.grana-=8;L.push(`💣 ${p.nome} → ${al.nome}: ${a[0].slice(3)}`)}
      else L.push(`💣 ${p.nome} tentou sabotar um fantasma e tropeçou no tapete`);
    }else{fx(p,a[1]);L.push(`${p.nome}: ${a[0].slice(2)}`)}
  }
  G.log=L;
  for(const [i,p] of ps){
    p.cong=cl(p.cong+(p.aprov-p.cong)*.1,0,100);p.caos=cl(p.caos+1,0,100);
  }
  G.mundo=cl(G.mundo+2,0,100);verificaMortes();G.feed=[...L,...G.feed].slice(0,10);
  G.rod++;fimCheck();if(G.fase==="jogo")novaRodada();
}
const score=p=>p.vivo?1000+p.aprov+p.cong/2+p.grana/4-p.caos/2:p.mr;

function verificaMortes(){for(const p of Object.values(G.p)){if(!p.vivo)continue;if(p.aprov<=0)morre(p,"imp");else if(p.grana<-80)morre(p,"div");else if(p.caos>=100)morre(p,"caos")}}
function fimCheck(){if(G.mundo>=100){G.fase="fim";G.ap=true}else if(G.rod>RODADAS||Object.values(G.p).filter(p=>p.vivo).length<=1)G.fase="fim"}
function instante(id,m){const p=G.p[id],a=INST[+m.i];if(!p||!p.vivo||p.cdl>0||!a)return;
  let al=null;if(a[2]){al=G.p[m.alvo];if(!al||!al.vivo||m.alvo===id)return}
  fx(p,a[1]);if(al)fx(al,a[2]);G.mundo=cl(G.mundo+a[3],0,100);p.cdl=15;
  G.feed.unshift(`${p.nome}: ${a[0].replace(/^\S+\s/,"")}${al?" → "+al.nome:""}`);G.feed=G.feed.slice(0,10);
  verificaMortes();fimCheck();bcast()}
function mundoEvento(){const e=MUNDO[Math.floor(Math.random()*MUNDO.length)],v=Object.values(G.p).filter(p=>p.vivo);if(!v.length)return;
  let n="todos";
  if(e[1]==="1"){const p=v[Math.floor(Math.random()*v.length)];n=p.nome;fx(p,e[2])}
  else if(e[1]==="all")v.forEach(p=>fx(p,e[2]));
  G.mundo=cl(G.mundo+(e[1]==="mundo"?12:3),0,100);
  G.feed.unshift(e[0].replace("{n}",n));G.feed=G.feed.slice(0,10);verificaMortes();fimCheck()}
function tickHost(){if(!G||G.fase!=="jogo")return;G.t--;G.wt--;
  for(const p of Object.values(G.p))if(p.cdl>0)p.cdl--;
  if(G.wt<=0){G.wt=20+Math.floor(Math.random()*15);mundoEvento()}
  if(G.fase==="jogo"&&G.t<=0)resolver();
  bcast()}

// ---- rede ----
function criar(){
  const nome=$("#nome").value.trim()||"Anônimo";
  const cod=Array.from({length:4},()=>"ABCDEFGHJKLMNPQRSTUVWXYZ"[Math.floor(Math.random()*24)]).join("");
  souHost=true;eu="host";peer=new Peer(PFX+cod);
  peer.on("open",()=>{G=novoG();G.cod=cod;G.p.host=jog(nome.slice(0,16));bcast();setInterval(tickHost,1000)});
  peer.on("error",e=>{if(e.type==="unavailable-id"){peer.destroy();criar()}else{erro="Erro de rede: "+e.type;render()}});
  peer.on("connection",c=>{
    conns[c.peer]=c;
    c.on("data",m=>hostRecebe(c.peer,m));
    c.on("close",()=>{delete conns[c.peer];const p=G&&G.p[c.peer];if(p&&p.vivo&&G.fase==="jogo"){p.vivo=false;p.mr=G.rod;p.fim=p.nome+" fugiu do país com a mala.";check()}if(p&&G.fase==="lobby")delete G.p[c.peer];bcast()});
  });
}
function entrar(){
  const nome=$("#nome").value.trim()||"Anônimo",cod=$("#cod").value.trim().toUpperCase();
  if(cod.length!==4){erro="O código tem 4 letras.";render();return}
  erro="Conectando...";render();
  peer=new Peer();
  peer.on("open",id=>{eu=id;const c=peer.connect(PFX+cod,{reliable:true});
    c.on("open",()=>{hostConn=c;erro="";envia(c,{t:"join",nome})});
    c.on("data",m=>{if(m.t==="G"){G=m.G;render()}else if(m.t==="erro"){erro=m.msg;render()}});
    c.on("close",()=>{G=null;hostConn=null;erro="A sala fechou (o host caiu).";render()});
    setTimeout(()=>{if(!hostConn){erro="Não achei essa sala. Confira o código (ou a rede da escola bloqueou).";render()}},9000);
  });
  peer.on("error",e=>{erro="Erro de rede: "+e.type;render()});
}
function caos(i){
  const al=Object.entries(G.p).filter(([k,q])=>q.vivo&&k!==eu).map(a=>a[0]),alvo=al.includes(minha.alvo)?minha.alvo:(al[0]||"");
  if(souHost)hostRecebe("host",{t:"caos",i,alvo});else envia(hostConn,{t:"caos",i,alvo});
}
function enviarTurno(){
  const alvos=Object.entries(G.p).filter(([i,q])=>q.vivo&&i!==eu).map(a=>a[0]);
  const esc={...minha,alvo:alvos.includes(minha.alvo)?minha.alvo:(alvos[0]||"")};
  if(souHost)hostRecebe("host",{t:"turn",esc});else envia(hostConn,{t:"turn",esc});
}

// ---- interface ----
const tabela=()=>`<table class="tbl"><tr><th>Presidente</th><th>Aprov.</th><th>Grana</th><th>Cong.</th><th>Caos</th><th></th></tr>`+
 Object.entries(G.p).map(([i,p])=>`<tr class="${p.vivo?"":"morto"}"><td>${esc(p.nome)}${i===eu?" (você)":""}</td><td>${p.aprov.toFixed(0)}%</td><td>R$ ${p.grana}</td><td>${p.cong.toFixed(0)}%</td><td>${p.caos.toFixed(0)}</td><td>${!p.vivo?"💀":p.pronto?"✅":"⏳"}</td></tr>`).join("")+`</table>`;
const MAN=`<details><summary>📖 Como funciona (leia, por favor)</summary><p>Cada um é um presidente. Em cada rodada (são ${RODADAS}) todo mundo escolhe <b>ao mesmo tempo</b>: uma resposta ao evento, o imposto, o gasto social e uma ação. Quando todos clicam em Pronto, a rodada roda.<br><br>
<b>Aprovação</b> chegando a 0 = impeachment. <b>Grana</b> abaixo de -80 = cadeia por dívida. <b>Caos</b> em 100 = Brasília vira Mad Max. <b>Congresso</b> acompanha sua aprovação e protege você.<br><br>
<b>Imposto alto</b> = mais grana, menos aprovação. <b>Gasto social alto</b> = mais aprovação, menos grana. <b>✨ Ações</b> melhoram você. <b>💣 Sabotagens</b> machucam o alvo e custam R$ 8 pra você. O 🎲 decide a resposta do evento no azar.<br><br>
Há um <b>cronômetro</b> de 45s por rodada e <b>⚡ botões de caos</b> que funcionam na hora (recarga de 15s). O <b>🌍 caos mundial</b> sobe com mísseis, bombas e eventos aleatórios: se chegar a 100%, o mundo acaba e vence quem tiver mais grana no bunker.<br><br>No fim vence quem estiver vivo com mais aprovação, Congresso e grana, e menos caos. Boa sorte, burros.</p></details>`;

function painel(){
  const p=G.p[eu];if(!p)return"";
  if(!p.vivo)return `<div class="card"><h2>💀 Você caiu</h2><p>${esc(p.fim)}</p><p>Agora fique vendo os outros se destruírem.</p></div>`;
  if(p.pronto)return `<div class="card"><h2>⏳ Pronto! Esperando os outros...</h2></div>`;
  const e=EV[G.ev],al=Object.entries(G.p).filter(([i,q])=>q.vivo&&i!==eu);
  return `<div class="card"><h2>📰 ${e.t}</h2><p style="font-size:.88rem">${e.d}</p>`+
  e.o.map((o,i)=>`<label class="op"><input type="radio" name="ev" value="${i}" ${minha.ev===i?"checked":""}> ${o[0]}</label>`).join("")+
  `<label class="op"><input type="radio" name="ev" value="-1" ${minha.ev===-1?"checked":""}> 🎲 Cara ou coroa</label>
  <div class="row"><label><span>Imposto</span><b>${minha.imp}</b></label><input type="range" min="10" max="50" value="${minha.imp}" data-k="imp"></div>
  <div class="row"><label><span>Gasto social</span><b>${minha.soc}</b></label><input type="range" min="10" max="50" value="${minha.soc}" data-k="soc"></div>
  <div class="row"><label>Ação</label><select data-k="acao">${AC.map((a,i)=>`<option value="${i}" ${minha.acao===i?"selected":""}>${a[0]}</option>`).join("")}</select></div>
  <div class="row"><label>Alvo (só vale pra 💣)</label><select data-k="alvo">${al.map(([i,q])=>`<option value="${i}" ${minha.alvo===i?"selected":""}>${esc(q.nome)}</option>`).join("")}</select></div>
  <button class="primary" data-ac="pronto" style="width:100%;padding:12px">Pronto ✅</button></div>`;
}

let lastKey="",pos={},ar={};
const ptos=p=>p.aprov+p.cong/2+p.grana/4-p.caos/2;
const set=(q,h)=>{const e=$(q);if(e&&e.innerHTML!==h)e.innerHTML=h};
function hud(){const m=G.mundo;return `<div style="display:flex;justify-content:space-between;font-size:.9rem"><b>Rodada ${G.rod}/${RODADAS} · Sala ${G.cod}</b><b>⏱️ ${G.t}s</b></div><div class="bar"><i style="width:${cl(G.t/45*100,0,100)}%;background:var(--b)"></i></div>
<div style="font-size:.82rem;margin-top:8px">🌍 Caos mundial: <b>${m.toFixed(0)}%</b> ${m>70?"☢️ o mundo está acabando!":""}</div><div class="bar"><i style="width:${m}%;background:${m>70?"var(--r)":m>40?"var(--y)":"var(--g)"}"></i></div>`}
function rank(){const o=Object.entries(G.p).sort((a,b)=>score(b[1])-score(a[1]));
  return `<h2>🏆 Ranking ao vivo</h2>`+o.map(([id,p],i)=>{if(pos[id]!==undefined&&pos[id]!==i)ar[id]=pos[id]>i?"🔺":"🔻";pos[id]=i;const v=ptos(p);
    return `<div class="row ${p.vivo?"":"morto"}"><label><span>${["🥇","🥈","🥉"][i]||(i+1)+"º"} ${esc(p.nome)}${id===eu?" (você)":""} ${p.vivo?(ar[id]||""):"💀"}</span><b>${p.vivo?v.toFixed(0):"fora"}</b></label><div class="bar"><i style="width:${p.vivo?cl(v,0,150)/1.5:0}%;background:var(--g)"></i></div><small style="color:var(--mut)">Aprov ${p.aprov.toFixed(0)}% · R$ ${p.grana} · Cong ${p.cong.toFixed(0)}% · Caos ${p.caos.toFixed(0)}</small></div>`}).join("")}
function inst(){const p=G.p[eu];if(!p||!p.vivo)return"";const cd=p.cdl||0;
  return `<h2>⚡ Botões de caos (ao vivo)</h2><p style="font-size:.78rem;color:var(--mut);margin:0 0 6px">${cd>0?"Recarregando... "+cd+"s":"Pronto! Afeta na hora. Os 💣 usam o alvo escolhido acima."}</p>`+INST.map((a,i)=>`<button data-ac="caos" data-i="${i}" ${cd>0?"disabled":""} style="width:100%;margin:4px 0;text-align:left">${a[0]}</button>`).join("")}
function feed(){return `<h2>📡 Notícias do caos</h2><div style="font-size:.8rem;color:var(--mut)">${(G.feed||[]).map(l=>`<p style="margin:5px 0;border-left:3px solid #35553f;padding-left:8px">${esc(l)}</p>`).join("")||"Nada ainda..."}</div>`}

function render(){
  const a=$("#app");
  if(!G){lastKey="";a.innerHTML=`<div class="card"><h2>🎮 Entrar na guerra</h2>
    <input type="text" id="nome" maxlength="16" placeholder="Seu nome de presidente" value="${esc($("#nome")?$("#nome").value:"")}">
    <button class="primary" data-ac="criar" style="width:100%;margin:6px 0;padding:12px">Criar sala (eu sou o host)</button>
    <p style="text-align:center;color:var(--mut)">ou entre numa sala:</p>
    <input type="text" id="cod" maxlength="4" placeholder="CÓDIGO (4 letras)" style="text-transform:uppercase">
    <button data-ac="entrar" style="width:100%;padding:12px">Entrar na sala</button>
    <p style="color:var(--r)">${esc(erro)}</p>${MAN}</div>`;return}
  if(minha.rod!==G.rod){minha.rod=G.rod;minha.ev=0}
  if(G.fase==="jogo"){
    const p=G.p[eu]||{},key=[G.rod,G.ev,p.pronto,p.vivo,Object.values(G.p).filter(q=>q.vivo).length].join("|");
    if(key===lastKey&&$("#rank")){set("#hud",hud());set("#rank",rank());set("#inst",inst());set("#feed",feed());return}
    lastKey=key;
    a.innerHTML=`<div class="card" id="hud">${hud()}</div><div class="grid"><div><div id="painel">${painel()}</div><div class="card" id="inst" style="margin-top:12px">${inst()}</div></div><div><div class="card" id="rank">${rank()}</div><div class="card" id="feed" style="margin-top:12px">${feed()}</div>${MAN}</div></div>`;return}
  lastKey="";let h="";
  if(G.fase==="lobby"){
    h=`<div class="card"><h2>🚪 Sala</h2><div class="cod">${G.cod}</div><p style="text-align:center;color:var(--mut)">Peça pros amigos abrirem o site, clicarem em Multijogador e digitarem o código.</p>${tabela()}
    ${souHost?`<button class="primary" data-ac="comecar" style="width:100%;margin-top:10px;padding:12px">Começar a guerra</button>`:`<p>Esperando o host começar...</p>`}${MAN}</div>`;
  }else{
    const r=Object.values(G.p).sort((x,y)=>G.ap?((y.vivo-x.vivo)||y.grana-x.grana):score(y)-score(x));
    h=`<div class="card"><h2>${G.ap?"☢️ O MUNDO ACABOU (parabéns, vocês conseguiram)":"🏁 Fim de jogo"}</h2>${G.ap?"<p>Quem estava vivo com mais grana no bunker vence.</p>":""}`+r.map((p,i)=>`<p style="font-size:1rem">${i<3&&p.vivo?TIT[i]:p.vivo?"🤡 Sobreviveu por pena":"💀 Eliminado"}: <b>${esc(p.nome)}</b> ${p.vivo?`(${p.aprov.toFixed(0)}% aprov., R$ ${p.grana})`:`<br><small style="color:var(--mut)">${esc(p.fim)}</small>`}</p>`).join("")+
    `<button class="primary" onclick="location.reload()" style="width:100%;padding:12px;margin-top:8px">Jogar de novo</button></div>`;
  }
  a.innerHTML=h;
}

document.addEventListener("click",e=>{const t=e.target.dataset.ac;if(!t)return;
  if(t==="criar")criar();else if(t==="entrar")entrar();
  else if(t==="comecar"&&souHost){G.fase="jogo";G.rod=1;G.log=["A guerra começou."];novaRodada();bcast()}
  else if(t==="pronto")enviarTurno();
  else if(t==="caos")caos(+e.target.dataset.i);
});
document.addEventListener("input",e=>{const t=e.target;
  if(t.name==="ev"){minha.ev=+t.value;return}
  const k=t.dataset.k;if(!k)return;
  minha[k]=k==="alvo"?t.value:+t.value;
  if(t.type==="range")t.previousElementSibling.querySelector("b").textContent=t.value;
});
render();
