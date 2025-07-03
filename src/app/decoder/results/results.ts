import { Component, computed, effect, input, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DecodeErrorCode } from '../../../decoders/errors';
import {
  isDecodeSuccessResult,
  type DecodeResult,
} from '../../../decoders/types';
import { ResultCard } from './result-card/result-card';

@Component({
  selector: 'app-results',
  imports: [ResultCard, MatProgressBarModule],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  results = input.required<Promise<DecodeResult>[]>();
  hasKey = input(false);
  inputSeq = 0;
  resultsList = signal<(DecodeResult | null)[]>([]);
  resultDisplayList = computed(() =>
    this.resultsList()
      .filter((r) => r !== null && isDecodeSuccessResult(r))
      .toSorted((a, b) => b.score - a.score),
  );
  allSettled = computed(() => this.resultsList().every((r) => r !== null));
  hasInvalidKeyError = computed(() =>
    this.resultsList().find(
      (decodeResult) =>
        decodeResult &&
        !isDecodeSuccessResult(decodeResult) &&
        decodeResult.errorCode === DecodeErrorCode.InvalidKey,
    ),
  );

  constructor() {
    effect(() => {
      const resultPromises = this.results();
      this.inputSeq += 1;

      const currentSeq = this.inputSeq;
      this.resultsList.set(
        Array<DecodeResult | null>(resultPromises.length).fill(null),
      );
      resultPromises.forEach((result, i) => {
        result.then((value) => {
          if (currentSeq === this.inputSeq /* to prevent update old result */) {
            this.resultsList.update((resultStatus) => {
              const newStatus = resultStatus.slice();
              newStatus[i] = value;
              return newStatus;
            });
          }
        });
      });
    });
  }
}
