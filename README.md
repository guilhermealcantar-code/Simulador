# República — Simulador de Governo Online

Sátira política por turnos no navegador, com humor ácido e só para maiores de idade. O online já é nativo: não existe mais "modo multijogador" separado.

## Como jogar
1. Abra o site, digite o nome do presidente e clique em **Entrar no mundo**. Não tem sala nem senha: todo mundo cai no mesmo mundo.
2. Escolha um país no **mapa**. Quem chegar primeiro leva; os outros escolhem outro.
3. Jogue a sua partida normalmente. O **ranking ao vivo** mostra os pontos de todo mundo, e o 💣 ao lado de um rival abre os ataques (recarga de 20s).
4. Eventos mundiais aleatórios atingem todo mundo. O botão **🗺️ Mapa** mostra quem é dono de cada país.

O primeiro a abrir o site vira o anfitrião automaticamente. Se ele sair, outro jogador assume sozinho. Precisa de internet (WebRTC via PeerJS); algumas redes de escola bloqueiam, e nesse caso teste no 4G.

## Estrutura
- `index.html`: página única
- `style.css`: visual
- `js/util.js`: funções comuns
- `js/dados.js`: setores, eventos, ações, ataques e eventos mundiais
- `js/motor.js`: estado do jogador, efeitos e simulação mês a mês
- `js/paises.js`: países do mapa e ajustes iniciais
- `js/rede.js`: sala online, ranking, ataques
- `js/ui.js`: painéis, botões e manual
- `js/main.js`: telas de entrada e mapa, ligação com a rede
