<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>República — Multijogador Ácido</title>
    <style>
        :root {
            --bg: #0f111a;
            --card: #161925;
            --text: #e2e8f0;
            --mut: #64748b;
            --b: #3b82f6;
            --g: #10b981;
            --y: #f59e0b;
            --r: #ef4444;
        }
        * { box-sizing: border-box; font-family: system-ui, sans-serif; }
        body { background: var(--bg); color: var(--text); margin: 0; padding: 15px; }
        .card { background: var(--card); border: 1px solid #23283b; padding: 20px; border-radius: 12px; max-width: 600px; margin: 0 auto 15px; }
        h2 { margin-top: 0; font-size: 1.4rem; color: #fff; }
        input, select, button { width: 100%; padding: 10px; margin: 6px 0; border-radius: 6px; border: 1px solid #2e354f; background: #1e2235; color: #fff; font-size: 1rem; }
        button.primary { background: var(--b); font-weight: bold; cursor: pointer; border: none; }
        button.primary:hover { opacity: 0.9; }
        .grid { display: grid; grid-template-columns: 1fr; gap: 15px; max-width: 1200px; margin: 0 auto; }
        @media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }
        .row { display: flex; flex-direction: column; margin: 8px 0; }
        .row label { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 0.95rem; }
        .bar { background: #23283b; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 6px; }
        .bar i { display: block; height: 100%; width: 0; transition: width 0.3s; }
        .op { display: block; background: #1e2235; padding: 10px; border-radius: 6px; margin: 6px 0; cursor: pointer; font-size: 0.9rem; }
        .op input { width: auto; margin-right: 8px; }
        .tbl { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.9rem; }
        .tbl th, .tbl td { padding: 8px; border-bottom: 1px solid #23283b; text-align: left; }
        .morto { opacity: 0.4; text-decoration: line-through; }
        .cod { font-size: 2.5rem; font-weight: bold; text-align: center; color: var(--b); letter-spacing: 4px; margin: 10px 0; }
        details { background: #1e2235; padding: 10px; border-radius: 6px; margin-top: 15px; font-size: 0.85rem; }
        summary { font-weight: bold; cursor: pointer; }
    </style>
    <!-- PeerJS para conexões WebRTC gratuitas sem servidor próprio -->
    <script src="https://unpkg.com/peerjs@1.4.7/dist/peerjs.min.js"></script>
</head>
<body>
    <div id="app">
        <div class="card">
            <h2>Carregando os armamentos...</h2>
        </div>
    </div>
    <script src="multi.js"></script>
</body>
</html>
