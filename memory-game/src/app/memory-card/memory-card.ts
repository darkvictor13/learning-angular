import { Component, computed, input, output } from '@angular/core';
import { MemoryCard } from '../models/memory-game.model';

@Component({
  selector: 'app-memory-card',
  template: `
    <button
      class="card"
      type="button"
      [class.card--face-up]="isVisible()"
      [class.card--matched]="card().isMatched"
      [disabled]="disabled() || card().isMatched"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-pressed]="isVisible()"
      (click)="selected.emit(card().id)"
    >
      <span class="card__symbol" aria-hidden="true">{{ isVisible() ? card().label : '?' }}</span>
    </button>
  `,
  styleUrl: './memory-card.css',
})
export class MemoryCardComponent {
  readonly card = input.required<MemoryCard>();
  readonly disabled = input(false);
  readonly selected = output<string>();

  readonly isVisible = computed(() => this.card().isFaceUp || this.card().isMatched);

  readonly ariaLabel = computed(() => {
    const card = this.card();

    if (card.isMatched) {
      return `Carta ${card.label}, par encontrado`;
    }

    if (this.isVisible()) {
      return `Carta ${card.label}, virada`;
    }

    return 'Carta oculta';
  });
}
