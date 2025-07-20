import { Component, computed, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { combineLatest, from, startWith, switchMap } from 'rxjs';
import { DecodeErrorCode } from '../../../decoders/errors';
import {
  isDecodeSuccessResult,
  type DecodeResult,
} from '../../../decoders/types';
import { ResultErrorCard } from './result-error-card/result-error-card';
import { ResultSuccessCard } from './result-success-card/result-success-card';

@Component({
  selector: 'app-results',
  imports: [
    ResultSuccessCard,
    ResultErrorCard,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  results = input.required<Promise<DecodeResult>[]>();
  hasKey = input(false);
  showFailedResults = signal(false);
  showFailedHiddenResults = signal(false);
  resultsList = toSignal(
    toObservable(this.results).pipe(
      switchMap((resultPromises) =>
        combineLatest(
          resultPromises.map((resultPromise) =>
            from(resultPromise).pipe(startWith(null)),
          ),
        ),
      ),
    ),
    { initialValue: [] },
  );
  resultDisplayList = computed(() => {
    const displayList = this.resultsList();
    let filteredList = displayList.filter((r) => r !== null);
    if (!this.showFailedResults()) {
      filteredList = filteredList.filter((r) => isDecodeSuccessResult(r));
    }
    if (!this.showFailedHiddenResults()) {
      filteredList = filteredList.filter(
        (r) => isDecodeSuccessResult(r) || !r.hide,
      );
    }
    return filteredList.toSorted((a, b) => b.score - a.score);
  });
  allSettled = computed(() => this.resultsList().every((r) => r !== null));
  hasInvalidKeyError = computed(() =>
    this.resultsList().some(
      (decodeResult) =>
        decodeResult &&
        !isDecodeSuccessResult(decodeResult) &&
        decodeResult.errorCode === DecodeErrorCode.InvalidKey,
    ),
  );

  isResultSuccess(result: DecodeResult) {
    return isDecodeSuccessResult(result);
  }
}
