import { Component, effect, input, signal } from '@angular/core';
import { EncodeResult } from '../../../decoders/decoder';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FilterFulfilledPromisePipe } from '../../../common/utils-pipe';
import { ResultCard } from './result-card/result-card';

@Component({
  selector: 'app-results',
  imports: [ResultCard, MatProgressBarModule, FilterFulfilledPromisePipe],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  results = input<Promise<EncodeResult>[] | null>(null);
  allSettled = signal(true);

  constructor() {
    effect(() => {
      const res = this.results();
      if (res) {
        this.allSettled.set(false);
        Promise.allSettled(res).then(() => {
          this.allSettled.set(true);
        });
      }
    });
  }
}
