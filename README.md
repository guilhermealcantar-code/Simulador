# 🇧🇷 República — Simulador de Governo do Brasil

Sátira política por turnos no navegador, com humor ácido e só para maiores de idade. Você é o presidente por 8 anos (96 meses) e precisa equilibrar economia, aprovação popular, Congresso e relações internacionais.

## Como jogar
- Ajuste **impostos, Selic e gastos** (saúde, educação, segurança, defesa, infraestrutura, meio ambiente).
- Clique em **Avançar** para passar os meses. Eventos aleatórios pedem decisões difíceis.
- Use as **ações de governo** (diplomacia, Congresso, privatização) — cada uma tem recarga de 6 meses.
- No mês 48 há **eleição**: sua aprovação decide se você continua.
- Você perde por impeachment (aprovação < 12%), calote (dívida > 130% do PIB) ou hiperinflação (> 20%).

O progresso é salvo automaticamente no navegador.

## Rodar
Abra o `index.html` no navegador. Não precisa instalar nada.

## Publicar no GitHub Pages
1. Crie um repositório e envie estes 4 arquivos.
2. Em **Settings → Pages**, escolha a branch `main` e a pasta `/ (root)`.
3. O jogo fica em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

## Ideias para evoluir
Mais países e mapa interativo, partidos e eleições detalhadas, guerra e alianças, setores da economia, mais eventos.

## 🎮 Multijogador online
Abra `multi.html`. Um jogador cria a sala e passa o código de 4 letras; os amigos entram com o código. Cada um é um presidente, com ranking ao vivo, cronômetro, botões de caos, sabotagens entre jogadores e eventos mundiais aleatórios. Funciona por WebRTC (PeerJS) e precisa de internet. Algumas redes de escola bloqueiam isso; se não conectar, teste com o 4G.
