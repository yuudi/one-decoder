import { Component, input, signal, effect } from '@angular/core';
import { DecodeResult } from '../../../decoders/decoder';
import { CommonModule } from '@angular/common';
import { ResultCard } from './result-card/result-card';
import {
  FilterFulfilledPromisePipe,
  FilterSuccessResultPipe,
  SortByKeyPipe,
} from './utils-pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-results',
  imports: [
    CommonModule,
    ResultCard,
    MatProgressBarModule,
    FilterFulfilledPromisePipe,
    FilterSuccessResultPipe,
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
