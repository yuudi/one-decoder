import { Pipe, PipeTransform, signal, Signal } from '@angular/core';
import { DecodeResult, isDecodeSuccessResult } from '../../../decoders/decoder';

@Pipe({
  name: 'filterFulfilledPromise',
})
export class FilterFulfilledPromisePipe<T> implements PipeTransform {
  transform(value: Promise<T>[]): Signal<T[]> {
    const fulfilledPromises = signal<T[]>([]);
    for (const promise of value) {
      promise
        .then((result) => {
          fulfilledPromises.update((current) => [...current, result]);
        })
        .catch(() => {
          // Ignore rejected promises
        });
    }
    return fulfilledPromises;
  }
}

@Pipe({ name: 'filterSuccessResult' })
export class FilterSuccessResultPipe implements PipeTransform {
  transform(value: DecodeResult[] | null) {
    if (!value) {
      return [];
    }
    return value.filter(isDecodeSuccessResult);
  }
}

@Pipe({
  name: 'sortByKey',
})
export class SortByKeyPipe<T> implements PipeTransform {
  transform(value: T[], key: keyof T, decrease = false): T[] {
    return value.slice().sort((a, b) => {
      if (a[key] < b[key]) return decrease ? 1 : -1;
      if (a[key] > b[key]) return decrease ? -1 : 1;
      return 0;
    });
  }
}
