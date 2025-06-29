import { Component, effect, input, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  FilterFulfilledPromisePipe,
  FilterSuccessDecodeResultPipe,
  SortByKeyPipe,
} from '../../../common/utils-pipe';
import { DecodeResult } from '../../../decoders/decoder';
import { ResultCard } from './result-card/result-card';

@Component({
  selector: 'app-results',
  imports: [
    ResultCard,
    MatProgressBarModule,
    FilterFulfilledPromisePipe,
    FilterSuccessDecodeResultPipe,
    SortByKeyPipe,
  ],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  results = input<Promise<DecodeResult>[] | null>(null);
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
