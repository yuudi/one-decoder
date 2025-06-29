import {
  FilterFulfilledPromisePipe,
  FilterSuccessResultPipe,
  SortByKeyPipe,
} from './utils-pipe';

describe('FilterFulfilledPromisePipe', () => {
  it('create an instance', () => {
    const pipe = new FilterFulfilledPromisePipe();
    expect(pipe).toBeTruthy();
  });
});
describe('FilterSuccessResultPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterSuccessResultPipe();
    expect(pipe).toBeTruthy();
  });
});

describe('SortByKeyPipe', () => {
  it('create an instance', () => {
    const pipe = new SortByKeyPipe();
    expect(pipe).toBeTruthy();
  });
});
