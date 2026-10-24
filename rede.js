"use strict";
// Rede: um único mundo global (PeerJS). O primeiro a chegar vira o host (ID fixo); os outros conectam nele.
// Se o host sair, quem estiver jogando assume o lugar e todos se registram de novo.
const Rede=(()=>{
  const ID="repbr-mundo-v1";
  let peer=null,conns={},hc=null,host=false,eu=null,lista={},cb={},tp=null,rt=null,tent=0,sorteioOn=false;
  const envia=(c,m)=>{try{c.send(m)}catch(e){}};
  const avisa=()=>cb.lista&&cb.lista(lista);
  const bcast=()=>{if(host)for(const id in conns)envia(conns[id],{t:"lista",j:lista});avisa()};
  const erroPara=(id,msg)=>id==="host"?(cb.erro&&cb.erro(msg)):(conns[id]&&envia(conns[id],{t:"erro",msg}));
  const entrega=(id,m)=>id==="host"?trata(m):(conns[id]&&envia(conns[id],m));
  const falha=m=>cb.erro&&cb.erro(m);

  // chega em qualquer jogador
  function trata(m){
    if(m.t==="lista"){lista=m.j;avisa()}
    else if(m.t==="ok")cb.ok&&cb.ok(m.pais);
    else if(m.t==="erro")cb.erro&&cb.erro(m.msg);
    else if(m.t==="atq")cb.atq&&cb.atq(m.de,m.i);
    else if(m.t==="mundo")cb.mundo&&cb.mundo(m.i);
  }
  // chega só no host: quem pedir primeiro leva o país
  function recebe(id,m){
    if(m.t==="pais"){
      const o=Object.entries(lista).find(([k,j])=>j.pais===m.pais);
      if(o&&o[0]!==id)return erroPara(id,"Esse país já tem dono. Escolha outro!");
      lista[id]={nome:String(m.nome||"Presidente").slice(0,16),pais:m.pais,leg:0,aprov:0,mes:0,fim:0};
      entrega(id,{t:"ok",pais:m.pais});bcast();
    }else if(m.t==="pub"&&lista[id]){Object.assign(lista[id],m.d);bcast()}
    else if(m.t==="atq"&&lista[m.para]&&lista[id])entrega(m.para,{t:"atq",de:lista[id].nome,i:m.i});
  }
  function sorteio(){
    const ids=Object.keys(lista);if(!ids.length)return;
    const i=Math.floor(Math.random()*MUNDOEV.length);
    if(MUNDOEV[i].solo)entrega(ids[Math.floor(Math.random()*ids.length)],{t:"mundo",i});
    else ids.forEach(id=>entrega(id,{t:"mundo",i}));
  }

  function retry(ms){if(rt)return;rt=setTimeout(()=>{rt=null;tenta()},ms)}
  // tenta ser o host; se o ID já existe, vira cliente
  function tenta(){
    const n=++tent;
    try{peer&&peer.destroy()}catch(e){}
    hc=null;conns={};host=false;eu=null;
    peer=new Peer(ID);
    peer.on("open",()=>{
      if(n!==tent)return;
      host=true;eu="host";lista={};
      if(!sorteioOn){sorteioOn=true;setInterval(()=>{if(host)sorteio()},40000)}
      cb.pronto&&cb.pronto();
    });
    peer.on("error",e=>{
      if(n!==tent)return;
      if(e.type==="unavailable-id")cliente(n);
      else{falha("Sem conexão com o mundo ("+e.type+"). Tentando de novo...");retry(3000+Math.random()*3000)}
    });
    peer.on("connection",c=>{
      if(n!==tent)return;
      conns[c.peer]=c;
      c.on("open",()=>envia(c,{t:"lista",j:lista}));
      c.on("data",m=>recebe(c.peer,m));
      c.on("close",()=>{delete conns[c.peer];delete lista[c.peer];bcast()});
    });
  }
  function cliente(n){
    try{peer.destroy()}catch(e){}
    peer=new Peer();
    peer.on("open",id=>{
      if(n!==tent)return;
      eu=id;hc=peer.connect(ID,{reliable:true});
      hc.on("open",()=>{if(n===tent)cb.pronto&&cb.pronto()});
      hc.on("data",m=>{if(n===tent)trata(m)});
      hc.on("close",()=>{if(n!==tent)return;hc=null;lista={};avisa();retry(300+Math.random()*1500)});
      setTimeout(()=>{if(n===tent&&(!hc||!hc.open)){falha("Procurando o mundo...");retry(500)}},8000);
    });
    peer.on("error",e=>{if(n!==tent)return;falha("Procurando o mundo... ("+e.type+")");retry(2500+Math.random()*2500)});
  }

  return{
    on:o=>{cb=o},lista:()=>lista,eu:()=>eu,
    conectar(){tenta()},
    escolherPais(pais,nome){host?recebe("host",{t:"pais",pais,nome}):(hc&&hc.open&&envia(hc,{t:"pais",pais,nome}))},
    publicar(){
      clearTimeout(tp);
      tp=setTimeout(()=>{
        const d=cb.snap&&cb.snap();if(!d)return;
        if(host){if(lista.host){Object.assign(lista.host,d);bcast()}}
        else if(hc&&hc.open)envia(hc,{t:"pub",d});
      },300);
    },
    atacar(para,i){host?recebe("host",{t:"atq",para,i}):(hc&&hc.open&&envia(hc,{t:"atq",para,i}))}
  };
})();
