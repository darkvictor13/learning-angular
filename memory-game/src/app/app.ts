import { Component } from '@angular/core';
import { MemoryGameComponent } from './memory-game/memory-game';

@Component({
  selector: 'app-root',
  imports: [MemoryGameComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
}
