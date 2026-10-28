// Servidor do mundo compartilhado (Vercel Serverless Function).
const S = globalThis.__rbmundo || (globalThis.__rbmundo = { players: {}, inbox: {}, world: [], seq: 0 });
const TTL = 50000;
const ID = /^[a-z0-9]{4,24}$/i;

function limpa(now) {
  for (const k in S.players) if (now - S.players[k].ts > TTL) delete S.players[k];
  for (const k in S.inbox) {
    const q = S.inbox[k];
    if (!q.length || (now - q[0].t > 60000 && !S.players[k])) delete S.inbox[k];
  }
  S.world = S.world.filter(e => now - e.t < 90000).slice(-40);
}

module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  
  if (req.method === "OPTIONS") { res.statusCode = 204; return res.end(); }
  
  const now = Date.now();
  limpa(now);
  
  if (req.method === "GET") return res.status(200).json({ ok: true, jogadores: Object.keys(S.players).length });
  if (req.method !== "POST") return res.status(405).json({ erro: "metodo" });

  let b = req.body;
  if (b && typeof b === "object" && typeof Buffer !== "undefined" && Buffer.isBuffer(b)) b = b.toString();
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = null; } }
  if (!b || typeof b.id !== "string" || !ID.test(b.id)) return res.status(400).json({ erro: "id" });
  const id = b.id;

  if (b.me && typeof b.me === "object") {
    if (JSON.stringify(b.me).length < 2000) S.players[id] = Object.assign({}, b.me, { ts: now });
  } else if (b.me === null) {
    delete S.players[id];
  }

  if (Array.isArray(b.send)) {
    for (const s of b.send.slice(0, 20)) {
      if (!s || typeof s.m !== "object" || s.m === null) continue;
      if (s.to === "*") S.world.push({ s: ++S.seq, t: now, m: s.m });
      else if (typeof s.to === "string" && ID.test(s.to)) {
        const q = (S.inbox[s.to] = S.inbox[s.to] || []);
        q.push({ t: now, m: s.m });
        if (q.length > 30) q.shift();
      }
    }
  }

  const players = {};
  for (const k in S.players) { const p = Object.assign({}, S.players[k]); delete p.ts; players[k] = p; }
  const since = typeof b.since === "number" ? b.since : -1;
  const world = since < 0 ? [] : S.world.filter(e => e.s > since).map(e => ({ s: e.s, m: e.m }));
  const q = S.inbox[id] || [];
  delete S.inbox[id];
  res.status(200).json({ players, world, seq: S.seq, inbox: q.map(x => x.m) });
};
