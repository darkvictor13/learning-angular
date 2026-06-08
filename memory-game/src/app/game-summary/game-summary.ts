import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-game-summary',
  template: `
    <section class="summary" aria-labelledby="summary-title" tabindex="-1">
      <h2 id="summary-title">Voce encontrou todos os pares</h2>
      <p>Tempo total: <strong>{{ time() }}</strong></p>
      <p>Movimentos: <strong>{{ moves() }}</strong></p>
      <button type="button" (click)="playAgain.emit()">Jogar novamente</button>
    </section>
  `,
  styleUrl: './game-summary.css',
})
export class GameSummaryComponent {
  readonly time = input.required<string>();
  readonly moves = input.required<number>();
  readonly playAgain = output<void>();
}
