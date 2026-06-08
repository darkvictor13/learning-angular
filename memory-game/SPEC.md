# Especificacao: Jogo da Memoria

## Objetivo

Criar um jogo da memoria em Angular no qual a pessoa jogadora vira cartas para encontrar pares iguais. A experiencia deve ser simples, responsiva, acessivel e adequada para praticar conceitos modernos do Angular.

## Publico-alvo

- Pessoas iniciantes ou intermediarias em Angular.
- Pessoas que querem jogar uma partida rapida em navegador desktop ou mobile.

## Escopo da primeira versao

### Incluido

- Tela principal do jogo.
- Grade de cartas embaralhadas.
- Clique para virar cartas.
- Validacao de pares iguais.
- Contador de movimentos.
- Temporizador da partida.
- Estado de vitoria.
- Botao para reiniciar a partida.
- Seletor de dificuldade.
- Layout responsivo.
- Suporte basico a leitores de tela.

### Fora do escopo

- Login de usuario.
- Ranking online.
- Persistencia em backend.
- Modo multiplayer.
- Animacoes complexas em 3D.
- Compra de temas ou recursos externos.

## Regras do jogo

1. A partida comeca com todas as cartas viradas para baixo.
2. O baralho deve conter pares de cartas com o mesmo simbolo.
3 O baralho sao letras do alfabeto, onde cada letra representa um par. Exemplo: A, A, B, B, C, C, etc.
4. A ordem das cartas deve ser embaralhada a cada nova partida.
5. A pessoa jogadora pode virar no maximo duas cartas por tentativa.
6. Quando duas cartas viradas formam um par:
   - As cartas permanecem visiveis.
   - As cartas deixam de aceitar novas interacoes.
7. Quando duas cartas viradas nao formam um par:
   - As cartas permanecem visiveis por um curto periodo.
   - Depois desse periodo, voltam a ficar ocultas.
8. Cada tentativa com duas cartas deve incrementar o contador de movimentos.
9. A partida termina quando todos os pares forem encontrados.
10. Ao vencer, deve ser exibido um resumo com tempo total e quantidade de movimentos.
11. Reiniciar a partida deve criar um novo embaralhamento e zerar movimentos, tempo e estado das cartas.

## Dificuldades

| Dificuldade | Pares | Total de cartas | Grade sugerida |
| --- | ---: | ---: | --- |
| Facil | 6 | 12 | 3 x 4 |
| Medio | 8 | 16 | 4 x 4 |
| Dificil | 12 | 24 | 4 x 6 |

## Interface

### Cabecalho

- Titulo do jogo.
- Controle de dificuldade.
- Botao de reiniciar.

### Painel de status

- Movimentos realizados.
- Tempo decorrido.
- Pares encontrados.

### Tabuleiro

- Grade de cartas.
- Cartas com estados visuais distintos:
  - Oculta.
  - Virada.
  - Encontrada.

### Fim de partida

- Mensagem de vitoria.
- Tempo total.
- Total de movimentos.
- Acao para jogar novamente.

## Estados principais

- `idle`: partida pronta, antes da primeira jogada.
- `playing`: partida em andamento.
- `checking`: duas cartas abertas aguardando validacao.
- `won`: todos os pares encontrados.

## Modelo de dados sugerido

```ts
type GameStatus = 'idle' | 'playing' | 'checking' | 'won';

interface MemoryCard {
  id: string;
  pairId: string;
  label: string;
  isFaceUp: boolean;
  isMatched: boolean;
}

interface Difficulty {
  id: 'easy' | 'medium' | 'hard';
  label: string;
  pairCount: number;
}
```

## Requisitos funcionais

- O sistema deve iniciar uma partida na dificuldade facil por padrao.
- O sistema deve permitir alterar a dificuldade antes de uma partida.
- O sistema deve impedir a alteração da dificuldade durante uma partida
- O sistema deve impedir que a mesma carta seja selecionada duas vezes na mesma tentativa.
- O sistema deve impedir novas selecoes enquanto duas cartas incorretas aguardam para serem ocultadas.
- O sistema deve calcular o progresso com base na quantidade de pares encontrados.
- O sistema deve exibir uma mensagem clara quando a partida for concluida.
- O sistema deve permitir reiniciar a partida a qualquer momento.

## Requisitos visuais e responsivos

- A grade deve se adaptar a telas pequenas sem causar rolagem horizontal.
- Cartas devem manter proporcao consistente.
- Textos devem permanecer legiveis em mobile e desktop.
- Estados de foco, hover, carta virada e carta encontrada devem ser visualmente distintos.
- O contraste entre texto e fundo deve atender WCAG AA.


## Componentes sugeridos

- `MemoryGameComponent`: orquestra estado, dificuldade, movimentos e tempo.
- `MemoryBoardComponent`: renderiza a grade e emite selecao de carta.
- `MemoryCardComponent`: renderiza uma carta individual acessivel.
- `GameSummaryComponent`: exibe resultado final e acao de jogar novamente.

## Servicos sugeridos

- `MemoryDeckService`: cria e embaralha cartas.
- `GameTimerService`: controla tempo decorrido, se a implementacao preferir separar essa responsabilidade.

## Testes esperados

- Deve criar um baralho com pares corretos para cada dificuldade.
- Deve embaralhar as cartas sem alterar a quantidade de pares.
- Deve virar uma carta quando selecionada.
- Deve manter cartas iguais viradas e marcadas como encontradas.
- Deve ocultar cartas diferentes apos a validacao.
- Deve incrementar movimentos somente apos duas cartas selecionadas.
- Deve detectar vitoria quando todos os pares forem encontrados.
- Deve reiniciar a partida limpando estado anterior.
- Deve permitir navegacao por teclado nas cartas.

## Criterios de aceite

- A pessoa jogadora consegue concluir uma partida completa.
- O contador de movimentos reflete apenas tentativas com duas cartas.
- O temporizador inicia na primeira jogada e para na vitoria.
- Reiniciar sempre gera uma nova partida funcional.
- A troca de dificuldade altera corretamente a quantidade de cartas.
- A interface funciona em largura mobile e desktop.
- Nao ha erros no console durante uma partida normal.
- A aplicacao passa nos testes automatizados definidos para a regra de negocio.
- A tela passa em uma verificacao AXE sem violacoes criticas.

