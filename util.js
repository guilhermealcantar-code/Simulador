"use strict";
// Utilidades compartilhadas
const $=s=>document.querySelector(s), cl=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
const esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
