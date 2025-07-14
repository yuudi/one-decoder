import { Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { forkJoin, from, startWith, switchMap } from 'rxjs';
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
  resultsList = toSignal(
    toObservable(this.results).pipe(
      switchMap((resultPromises) =>
        forkJoin(
          resultPromises.map((resultPromise) =>
            from(resultPromise).pipe(startWith(null)),
          ),
        ),
      ),
    ),
    { initialValue: [] },
  );
  resultDisplayList = computed(() =>
    this.resultsList()
      .filter((r) => r !== null && isDecodeSuccessResult(r))
      .toSorted((a, b) => b.score - a.score),
  );
  allSettled = computed(() => this.resultsList().every((r) => r !== null));
  hasInvalidKeyError = computed(() =>
    this.resultsList().some(
      (decodeResult) =>
        decodeResult &&
        !isDecodeSuccessResult(decodeResult) &&
        decodeResult.errorCode === DecodeErrorCode.InvalidKey,
    ),
  );
}
