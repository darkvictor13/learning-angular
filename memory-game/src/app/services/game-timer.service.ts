import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameTimerService {
  readonly elapsedSeconds = signal(0);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  start(): void {
    if (this.intervalId !== null) {
      return;
    }

    this.intervalId = setInterval(() => {
      this.elapsedSeconds.update((seconds) => seconds + 1);
    }, 1000);
  }

  stop(): void {
    if (this.intervalId === null) {
      return;
    }

    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  reset(): void {
    this.stop();
    this.elapsedSeconds.set(0);
  }
}
