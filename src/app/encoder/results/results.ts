import { Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { combineLatest, from, startWith, switchMap } from 'rxjs';
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
  allSettled = computed(() => this.resultsList().every((r) => r !== null));

  isResultSuccess(result: EncodeResult) {
    return isEncodeSuccessResult(result);
  }
}
