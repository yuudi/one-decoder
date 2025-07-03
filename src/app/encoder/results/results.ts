import { Component, effect, input, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  isEncodeSuccessResult,
  type EncodeResult,
} from '../../../decoders/types';
import { ResultErrorCard } from './result-error-card/result-error-card';
import { ResultSuccessCard } from './result-success-card/result-success-card';

@Component({
  selector: 'app-results',
  imports: [ResultSuccessCard, ResultErrorCard, MatProgressBarModule],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  results = input.required<Promise<EncodeResult>[]>();
  inputSeq = 0;
  resultsList = signal<(EncodeResult | null)[]>([]);

  constructor() {
    effect(() => {
      const resultPromises = this.results();
      this.inputSeq += 1;

      const currentSeq = this.inputSeq;
      this.resultsList.set(
        Array<EncodeResult | null>(resultPromises.length).fill(null),
      );
      resultPromises.forEach((result, i) => {
        result.then((value) => {
          if (currentSeq === this.inputSeq /* to prevent update old result */) {
            this.resultsList.update((resultStatus) => {
              resultStatus[i] = value;
              return resultStatus;
            });
          }
        });
      });
    });
  }

  isResultSuccess(result: EncodeResult) {
    return isEncodeSuccessResult(result);
  }
}
