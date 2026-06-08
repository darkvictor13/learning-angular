import { Component, input, output } from '@angular/core';
import { MemoryCardComponent } from '../memory-card/memory-card';
import { MemoryCard } from '../models/memory-game.model';

@Component({
  selector: 'app-memory-board',
  imports: [MemoryCardComponent],
  template: `
    <div
      class="board"
      role="grid"
      aria-label="Tabuleiro do jogo da memoria"
      [style.--board-columns]="columns()"
    >
      @for (card of cards(); track card.id) {
        <app-memory-card
          role="gridcell"
          [card]="card"
          [disabled]="disabled()"
          (selected)="cardSelected.emit($event)"
        />
      }
    </div>
  `,
  styleUrl: './memory-board.css',
})
export class MemoryBoardComponent {
  readonly cards = input.required<MemoryCard[]>();
  readonly columns = input.required<number>();
  readonly disabled = input(false);
  readonly cardSelected = output<string>();
}
