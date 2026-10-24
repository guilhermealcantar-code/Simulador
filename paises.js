"use strict";
// Países do mapa: id, nome, bandeira, coluna, linha, ajustes iniciais, descrição
const PAISES=[
 {id:"CA",n:"Canadá",f:"🇨🇦",c:1,r:1,mod:{aprov:6,g:-.3,divida:-5},tag:"Educado demais pra governar. Pede desculpa até pro Congresso."},
 {id:"RU",n:"Rússia",f:"🇷🇺",c:7,r:1,mod:{g:-.5,infl:3,aprov:-3},tag:"Frio, enorme e cheio de segredos. A oposição some em silêncio."},
 {id:"US",n:"EUA",f:"🇺🇸",c:1,r:2,mod:{g:.8,divida:25,aprov:-5},tag:"Gasta como se não houvesse amanhã, e a conta é do mundo."},
 {id:"GB",n:"Reino Unido",f:"🇬🇧",c:4,r:2,mod:{g:-.4,infl:1,aprov:-2},tag:"Saiu da União Europeia e ainda procura a chave de casa."},
 {id:"DE",n:"Alemanha",f:"🇩🇪",c:5,r:2,mod:{g:-.2,infl:-2,divida:-15,aprov:5},tag:"Tudo funciona, mas ninguém tem graça."},
 {id:"TR",n:"Turquia",f:"🇹🇷",c:6,r:2,mod:{infl:8,g:1,aprov:-4},tag:"Inflação de montanha-russa e política de novela."},
 {id:"CN",n:"China",f:"🇨🇳",c:8,r:2,mod:{g:2.5,infl:-2,aprov:4,divida:-10},tag:"Cresce muito, pergunta pouco e o Congresso aplaude em pé."},
 {id:"JP",n:"Japão",f:"🇯🇵",c:9,r:2,mod:{g:-1,infl:-4,divida:90,aprov:2},tag:"Dívida de 250% do PIB e ninguém entra em pânico."},
 {id:"MX",n:"México",f:"🇲🇽",c:1,r:3,mod:{g:.3,desemp:-1,aprov:-3},tag:"Vizinho dos EUA e do caos, às vezes ao mesmo tempo."},
 {id:"FR",n:"França",f:"🇫🇷",c:4,r:3,mod:{g:-.2,aprov:-6,divida:25},tag:"O povo faz greve até quando está de acordo."},
 {id:"EG",n:"Egito",f:"🇪🇬",c:5,r:3,mod:{infl:5,g:.5,aprov:-2},tag:"Pirâmides ótimas, orçamento nem tanto."},
 {id:"IN",n:"Índia",f:"🇮🇳",c:7,r:3,mod:{g:2,desemp:2,aprov:2},tag:"1,4 bilhão de opiniões e uma única fila no banco."},
 {id:"BR",n:"Brasil",f:"🇧🇷",c:2,r:4,mod:{},tag:"Churrasco, corrupção e fé. O jogo foi feito pra você."},
 {id:"NG",n:"Nigéria",f:"🇳🇬",c:4,r:4,mod:{g:1,desemp:5,aprov:-8,infl:4},tag:"Petróleo de sobra e dinheiro de menos."},
 {id:"AU",n:"Austrália",f:"🇦🇺",c:9,r:4,mod:{g:.4,aprov:3,divida:-20},tag:"Tudo quer te matar, menos a economia."},
 {id:"AR",n:"Argentina",f:"🇦🇷",c:2,r:5,mod:{infl:15,divida:10,g:-1.5,aprov:-8},tag:"Inflação de novela e fé de sobra. Boa sorte."},
 {id:"ZA",n:"África do Sul",f:"🇿🇦",c:5,r:5,mod:{desemp:8,g:-.5,aprov:-5},tag:"Apagão de luz e de planos, nessa ordem."}
];
